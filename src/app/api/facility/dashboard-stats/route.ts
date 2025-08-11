import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");

    if (!facilityId) {
      return NextResponse.json(
        { error: "Facility ID is required" },
        { status: 400 }
      );
    }

    // Get current and last month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(
      lastMonth.getMonth() + 1
    ).padStart(2, "0")}`;

    // Find the latest month with remuneration data for comparison
    const latestRemunerationMonth = await prisma.facilityRemunerationRecord.findFirst({
      where: {
        facility_id: facilityId,
      },
      orderBy: {
        report_month: "desc",
        },
      select: {
        report_month: true,
      },
    });

    console.log("=== MONTH SELECTION DEBUG ===");
    console.log("Current month:", currentMonth);
    console.log("Last month:", lastMonthStr);
    console.log("Latest month with remuneration data:", latestRemunerationMonth?.report_month);
    console.log("=== END MONTH SELECTION DEBUG ===");

    // Get total submissions (count of unique months where facility has submitted data)
    const totalSubmissions = await prisma.fieldValue.groupBy({
      by: ["report_month"],
      where: {
        facility_id: facilityId,
      },
      _count: {
        report_month: true,
      },
    });

    // Get last month's submissions
    const lastMonthSubmissions = await prisma.fieldValue.groupBy({
      by: ["report_month"],
      where: {
        facility_id: facilityId,
        report_month: lastMonthStr,
      },
      _count: {
        report_month: true,
      },
    });

    // Get facility type to determine appropriate footfall field IDs
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        facility_type: true,
      },
    });

    console.log("=== FACILITY DEBUG INFO ===");
    console.log("Facility ID requested:", facilityId);
    console.log("Facility found:", facility?.name);
    console.log("Facility display name:", facility?.display_name);
    console.log("Facility type ID:", facility?.facility_type_id);
    console.log("Facility type name:", facility?.facility_type?.name);
    console.log("Facility type display name:", facility?.facility_type?.display_name);
    console.log("Complete facility object:", JSON.stringify(facility, null, 2));
    console.log("=== END FACILITY DEBUG ===");

    // Determine the correct footfall field IDs based on facility type
    let footfallFieldIds: number[] = [];

    if (facility && facility.facility_type.name === "PHC" || facility?.facility_type.name === "UPHC") {
      console.log("Looking for PHC footfall field: total_footfall_phc_colocated_sc");
      // Get field ID for total_footfall_phc_colocated_sc
      const phcField = await prisma.field.findFirst({
        where: { code: 'total_footfall_phc_colocated_sc', is_active: true },
      });
      if (phcField) footfallFieldIds.push(phcField.id);

    } else if (facility && facility.facility_type.name === "SC-HWC") {
      console.log("Looking for SC footfall field: total_footfall_sc_clinic");
      // Get field ID for total_footfall_sc_clinic
      const scField = await prisma.field.findFirst({
        where: { code: 'total_footfall_sc_clinic', is_active: true },
      });
      if (scField) footfallFieldIds.push(scField.id);

    } else if (facility && facility.facility_type.name === "U-HWC") {
      console.log("Looking for UHWC footfall field: total_footfall_uhwc");
      // Get field ID for total_footfall_uhwc
      const uhwcField = await prisma.field.findFirst({
        where: { code: 'total_footfall_uhwc', is_active: true },
      });
      if (uhwcField) footfallFieldIds.push(uhwcField.id);

    } else {
      console.log("Using default case - looking for any available footfall fields");
      // For other facility types, try to get any available footfall field
      const availableFootfallFields = await prisma.field.findMany({
        where: {
          code: {
            in: ['total_footfall_phc_colocated_sc', 'total_footfall_sc_clinic', 'total_footfall_uhwc']
          },
          is_active: true,
        },
      });
      console.log("Available footfall fields found:", availableFootfallFields);
      footfallFieldIds = availableFootfallFields.map(f => f.id);
    }

    console.log("Footfall field IDs found:", footfallFieldIds);

    // Get total footfall (sum of footfall field values from all months)
    let totalFootfall = 0;
    let lastMonthFootfall = 0;

    if (footfallFieldIds.length > 0) {
      // Sum footfall values from all months using the identified footfall field IDs
      const totalFootfallResult = await prisma.fieldValue.aggregate({
        where: {
          facility_id: facilityId,
          field_id: { in: footfallFieldIds },
          numeric_value: { not: null, gt: 0 },
        },
        _sum: {
          numeric_value: true,
        },
      });

      console.log("Total footfall query result (footfall fields only):", totalFootfallResult);

      // Get last month's footfall for comparison
      const lastMonthFootfallResult = await prisma.fieldValue.aggregate({
        where: {
          facility_id: facilityId,
          report_month: lastMonthStr,
          field_id: { in: footfallFieldIds },
          numeric_value: { not: null, gt: 0 },
        },
        _sum: {
          numeric_value: true,
        },
      });

      console.log("Last month footfall query result (footfall fields only):", lastMonthFootfallResult);

      totalFootfall = parseInt(totalFootfallResult._sum.numeric_value?.toString() || "0");
      lastMonthFootfall = parseInt(lastMonthFootfallResult._sum.numeric_value?.toString() || "0");
    } else {
      console.log("No footfall fields found for this facility type");
      totalFootfall = 0;
      lastMonthFootfall = 0;
    }

    // Calculate performance and incentives based on facility type
    let performance = 0;
    let lastMonthPerformance = 0;
    let totalIncentives = 0;

    if (facility) {
      const isTeamBased = ['PHC', 'UPHC'].includes(facility.facility_type.name);
      console.log("Facility type is team-based:", isTeamBased);

      if (isTeamBased) {
        // Team-based facilities: use FacilityRemunerationRecord
        console.log("Using FacilityRemunerationRecord for team-based facility");
        
        // Get current month performance from FacilityRemunerationRecord
        const currentMonthPerformance = await prisma.facilityRemunerationRecord.aggregate({
          where: {
            facility_id: facilityId,
            report_month: currentMonth,
          },
          _avg: {
            percentage_achieved: true,
          },
        });

        console.log("Current month performance (FacilityRemunerationRecord):", currentMonthPerformance);

        // Get last month performance from FacilityRemunerationRecord
        const lastMonthPerformanceData = await prisma.facilityRemunerationRecord.aggregate({
          where: {
            facility_id: facilityId,
            report_month: lastMonthStr,
          },
          _avg: {
            percentage_achieved: true,
          },
        });

        console.log("Last month performance (FacilityRemunerationRecord):", lastMonthPerformanceData);

        // Calculate total incentives from FacilityRemunerationRecord (cumulative across all months)
        const totalIncentivesResult = await prisma.facilityRemunerationRecord.aggregate({
          where: {
            facility_id: facilityId,
          },
          _sum: {
            incentive_amount: true,
          },
        });

        console.log("Total incentives (FacilityRemunerationRecord):", totalIncentivesResult);

        performance = Math.round(Number(currentMonthPerformance._avg.percentage_achieved) || 0);
        lastMonthPerformance = Math.round(Number(lastMonthPerformanceData._avg.percentage_achieved) || 0);
        totalIncentives = parseFloat(totalIncentivesResult._sum.incentive_amount?.toString() || "0");

      } else {
        // Individual-based facilities: use WorkerRemuneration
        console.log("Using WorkerRemuneration for individual-based facility");
        
        // Get current month performance from WorkerRemuneration
        const currentMonthPerformance = await prisma.workerRemuneration.aggregate({
          where: {
            facility: {
              id: facilityId,
            },
            report_month: currentMonth,
          },
          _avg: {
            performance_percentage: true,
          },
        });

        console.log("Current month performance (WorkerRemuneration):", currentMonthPerformance);

        // Get last month performance from WorkerRemuneration
        const lastMonthPerformanceData = await prisma.workerRemuneration.aggregate({
          where: {
            facility: {
              id: facilityId,
            },
            report_month: lastMonthStr,
          },
          _avg: {
            performance_percentage: true,
          },
        });

        console.log("Last month performance (WorkerRemuneration):", lastMonthPerformanceData);

        // Calculate total incentives from WorkerRemuneration table (cumulative across all months)
        const totalIncentivesResult = await prisma.workerRemuneration.aggregate({
          where: {
            facility: {
              id: facilityId,
            },
          },
          _sum: {
            calculated_amount: true,
          },
        });

        console.log("Total incentives (WorkerRemuneration):", totalIncentivesResult);

        performance = Math.round(Number(currentMonthPerformance._avg.performance_percentage) || 0);
        lastMonthPerformance = Math.round(Number(lastMonthPerformanceData._avg.performance_percentage) || 0);
        totalIncentives = parseFloat(totalIncentivesResult._sum.calculated_amount?.toString() || "0");
      }
    }

    // Debug: Let's see what's actually in both tables
    const workerRemunerationRecords = await prisma.workerRemuneration.findMany({
      where: {
        facility: {
          id: facilityId,
        },
      },
      take: 5, // Limit to first 5 for debugging
    });

    console.log("WorkerRemuneration records found:", workerRemunerationRecords.length);
    if (workerRemunerationRecords.length > 0) {
      console.log("Sample WorkerRemuneration record:", workerRemunerationRecords[0]);
    }

    // Debug: Also check FacilityRemunerationRecord table
    const facilityRemunerationRecords = await prisma.facilityRemunerationRecord.findMany({
      where: {
        facility_id: facilityId,
      },
      take: 5, // Limit to first 5 for debugging
    });

    console.log("FacilityRemunerationRecord records found:", facilityRemunerationRecords.length);
    if (facilityRemunerationRecords.length > 0) {
      console.log("Sample FacilityRemunerationRecord:", facilityRemunerationRecords[0]);
    }

    // Debug: Check if there are any records for the current month
    const currentMonthRecords = await prisma.facilityRemunerationRecord.findMany({
      where: {
        facility_id: facilityId,
        report_month: currentMonth,
      },
    });

    console.log("FacilityRemunerationRecord records for current month:", currentMonthRecords.length);
    if (currentMonthRecords.length > 0) {
      console.log("Current month records:", currentMonthRecords.map(r => ({
        id: r.id,
        indicator_id: r.indicator_id,
        percentage_achieved: r.percentage_achieved,
        incentive_amount: r.incentive_amount,
        status: r.status
      })));
    }

    // Debug: Check if there are any records at all for this facility
    const allFacilityRecords = await prisma.facilityRemunerationRecord.findMany({
      where: {
        facility_id: facilityId,
      },
      select: {
        report_month: true,
        indicator_id: true,
        percentage_achieved: true,
        incentive_amount: true,
        status: true
      }
    });

    console.log("All FacilityRemunerationRecord records for facility:", allFacilityRecords.length);
    if (allFacilityRecords.length > 0) {
      console.log("All records summary:", allFacilityRecords);
    }

    // Get total workers (count unique workers from all months)
    const totalWorkersResult = await prisma.healthWorker.count({
      where: {
        facility_id: facilityId,
      },
    });

    console.log("Total workers count:", totalWorkersResult);

    // Calculate stats
    const totalSubmissionsCount = totalSubmissions.length;
    const lastMonthSubmissionsCount = lastMonthSubmissions.length;

    const stats = {
      totalSubmissions: totalSubmissionsCount,
      totalFootfall: totalFootfall,
      performance: performance,
      totalIncentives: totalIncentives,
      totalWorkers: totalWorkersResult,
      lastMonthSubmissions: lastMonthSubmissionsCount,
      lastMonthFootfall: lastMonthFootfall,
      lastMonthPerformance: lastMonthPerformance,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
