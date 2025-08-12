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

    // Get total incentives from all remuneration calculations (sum across all months)
    let totalIncentives = 0;
    
    try {
      // Get all remuneration calculations for this facility and sum the total remuneration
      const allRemunerations = await prisma.remunerationCalculation.findMany({
        where: {
          facility_id: facilityId,
        },
        select: {
          id: true,
          report_month: true,
          total_remuneration: true,
        },
      });

      if (allRemunerations.length > 0) {
        console.log("=== ALL REMUNERATION CALCULATIONS ===");
        console.log(`Found ${allRemunerations.length} remuneration calculations`);
        
        // Sum all total remuneration amounts across all months
        totalIncentives = allRemunerations.reduce((sum, remuneration) => {
          const amount = Number(remuneration.total_remuneration || 0);
          console.log(`Month: ${remuneration.report_month}, Amount: ${amount}`);
          return sum + amount;
        }, 0);
        
        totalIncentives = Math.round(totalIncentives);
        console.log("Total incentives (sum of all months):", totalIncentives);
      } else {
        console.log("No remuneration calculations found in database");
        totalIncentives = 0;
      }
    } catch (error) {
      console.error("Error fetching remuneration calculations:", error);
      totalIncentives = 0;
    }

    // Get total workers (count unique workers from all months)
    const totalWorkersResult = await prisma.healthWorker.count({
      where: {
        facility_id: facilityId,
      },
    });

    console.log("Total workers count:", totalWorkersResult);

    // Calculate total submissions (count unique report months with data)
    const totalSubmissionsResult = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
      },
      select: {
        report_month: true,
      },
      distinct: ['report_month'],
    });
    const totalSubmissionsCount = totalSubmissionsResult.length;

    // Calculate last month submissions (get current month - 1)
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthString = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    
    const lastMonthSubmissionsResult = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
        report_month: lastMonthString,
      },
      select: {
        report_month: true,
      },
      distinct: ['report_month'],
    });
    const lastMonthSubmissionsCount = lastMonthSubmissionsResult.length > 0 ? 1 : 0;

    // Calculate total footfall (sum all footfall-related fields across all months)
    const footfallFields = [
      'total_footfall_phc_colocated_sc',
      'total_footfall_uhwc', 
      'total_footfall_sc_clinic',
      'total_footfall'
    ];
    
    let totalFootfall = 0;
    for (const fieldCode of footfallFields) {
      const footfallField = await prisma.field.findUnique({
        where: { code: fieldCode },
        select: { id: true }
      });
      
      if (footfallField) {
        const footfallValues = await prisma.fieldValue.findMany({
          where: {
            facility_id: facilityId,
            field_id: footfallField.id,
          },
          select: {
            numeric_value: true,
          },
        });
        
        const fieldTotal = footfallValues.reduce((sum, value) => {
          return sum + Number(value.numeric_value || 0);
        }, 0);
        
        totalFootfall += fieldTotal;
        console.log(`Field ${fieldCode}: ${fieldTotal}`);
      }
    }

    // Calculate last month footfall
    let lastMonthFootfall = 0;
    for (const fieldCode of footfallFields) {
      const footfallField = await prisma.field.findUnique({
        where: { code: fieldCode },
        select: { id: true }
      });
      
      if (footfallField) {
        const footfallValues = await prisma.fieldValue.findMany({
          where: {
            facility_id: facilityId,
            field_id: footfallField.id,
            report_month: lastMonthString,
          },
          select: {
            numeric_value: true,
          },
        });
        
        const fieldTotal = footfallValues.reduce((sum, value) => {
          return sum + Number(value.numeric_value || 0);
        }, 0);
        
        lastMonthFootfall += fieldTotal;
      }
    }

    console.log("Total submissions count:", totalSubmissionsCount);
    console.log("Last month submissions count:", lastMonthSubmissionsCount);
    console.log("Total footfall:", totalFootfall);
    console.log("Last month footfall:", lastMonthFootfall);

    const stats = {
      totalSubmissions: totalSubmissionsCount,
      totalFootfall: totalFootfall,
      totalIncentives: totalIncentives,
      totalWorkers: totalWorkersResult,
      lastMonthSubmissions: lastMonthSubmissionsCount,
      lastMonthFootfall: lastMonthFootfall,
    };

    console.log("=== FINAL STATS ===");
    console.log("Total submissions:", totalSubmissionsCount);
    console.log("Total footfall:", totalFootfall);
    console.log("Total incentives:", totalIncentives);
    console.log("Total workers:", totalWorkersResult);
    console.log("Last month submissions:", lastMonthSubmissionsCount);
    console.log("Last month footfall:", lastMonthFootfall);
    console.log("=== END FINAL STATS ===");

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
