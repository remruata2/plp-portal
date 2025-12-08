import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { RemunerationCalculator } from "@/lib/calculations/remuneration-calculator";
import { checkSubmissionAllowed } from "@/lib/submission-deadline";


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { facilityId, reportMonth, fieldValues, compare } = body;

    // Check if comparison mode is enabled (temporarily enabled for testing)

    // Check submission deadline - only enforce for facility users, admins can bypass
    if (session.user.role === "facility") {
      const deadlineStatus = await checkSubmissionAllowed();
      if (!deadlineStatus.isSubmissionAllowed) {
        return NextResponse.json(
          {
            error: "Submission deadline has passed",
            reason: deadlineStatus.reason,
            deadlineStatus: deadlineStatus
          },
          { status: 403 }
        );
      }
    }

    if (!facilityId || !reportMonth || !fieldValues) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if facility exists and user has access
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { user: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this facility
    if (session.user.role === "facility") {
      const userFacility = await prisma.user.findUnique({
        where: { id: parseInt(session.user.id) },
        include: { facility: true },
      });

      if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
        return NextResponse.json(
          { error: "Access denied to this facility" },
          { status: 403 }
        );
      }
    }

    // Start transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing field values for this facility and report month
      await tx.field_value.deleteMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
      });

      // Insert new field values
      const createdFieldValues = [];
      for (const fieldValue of fieldValues) {
        const created = await tx.field_value.create({
          data: {
            field_id: fieldValue.fieldId,
            facility_id: facilityId,
            report_month: reportMonth,
            string_value: fieldValue.stringValue !== undefined && fieldValue.stringValue !== null && fieldValue.stringValue !== "" ? fieldValue.stringValue : null,
            numeric_value: fieldValue.numericValue !== undefined && fieldValue.numericValue !== null ? fieldValue.numericValue : null,
            boolean_value: fieldValue.booleanValue !== undefined && fieldValue.booleanValue !== null ? fieldValue.booleanValue : null,
            json_value: fieldValue.jsonValue || null,
            is_override: fieldValue.isOverride || false,
            override_reason: fieldValue.overrideReason || null,
            uploaded_by: parseInt(session.user.id),
            remarks: fieldValue.remarks || null,
            updated_at: new Date(),
          },
        });
        createdFieldValues.push(created);
      }

      // Enhance field values with field relationships for remuneration calculation
      // Enhance field values with field relationships for remuneration calculation
      // Optimized to avoid N+1 queries by fetching all fields in one query
      const fieldIds = createdFieldValues.map(fv => fv.field_id);

      const fieldsWithRelations = await tx.field.findMany({
        where: { id: { in: fieldIds } },
        include: {
          indicator_indicator_numerator_field_idTofield: {
            select: { id: true, code: true, name: true },
          },
          indicator_indicator_denominator_field_idTofield: {
            select: { id: true, code: true, name: true },
          },
          indicator_indicator_target_field_idTofield: {
            select: { id: true, code: true, name: true },
          },
        },
      });

      // Create a map for easy lookup
      const fieldsMap = new Map(fieldsWithRelations.map(f => [f.id, f]));

      const enhancedFieldValues = [];
      for (const fieldValue of createdFieldValues) {
        const fieldWithRelations = fieldsMap.get(fieldValue.field_id);

        if (fieldWithRelations) {
          enhancedFieldValues.push({
            ...fieldValue,
            field: fieldWithRelations,
          });
        }
      }

      // Calculate remuneration using the same logic as the report page
      try {
        console.log("🔄 Starting remuneration calculation for", facilityId, "month", reportMonth);

        // Get facility information
        const facility = await tx.facility.findUnique({
          where: { id: facilityId },
          include: {
            district: true,
            facility_type: true,
          },
        });

        if (!facility) {
          throw new Error("Facility not found");
        }

        console.log("🔍 Facility details:", {
          id: facility.id,
          name: facility.name,
          facilityTypeId: facility.facility_type.id,
          facilityTypeName: facility.facility_type.name,
          facilityTypeDisplayName: facility.facility_type.display_name
        });

        // Get all indicators for this facility type - try multiple approaches
        let indicators = await tx.indicator.findMany({
          where: {
            applicable_facility_types: {
              array_contains: [facility.facility_type.name],
            },
          },
          include: {
            indicator_remuneration: {
              where: {
                facility_type_remuneration: {
                  facility_type_id: facility.facility_type.id,
                },
              },
              include: { facility_type_remuneration: true },
            },
            numerator_field: true,
            denominator_field: true,
            target_field: true,
          },
          orderBy: { code: "asc" },
        });

        // If no indicators found, try alternative facility type names
        if (indicators.length === 0) {
          console.log("⚠️ No indicators found with exact facility type name, trying alternatives...");

          // Try common variations
          const alternativeNames = [
            facility.facility_type.name,
            facility.facility_type.display_name,
            facility.facility_type.name.replace('_', ' '),
            facility.facility_type.name.toLowerCase(),
            facility.facility_type.name.toUpperCase()
          ];

          console.log("🔍 Trying alternative facility type names:", alternativeNames);

          for (const altName of alternativeNames) {
            if (altName === facility.facility_type.name) continue; // Skip the one we already tried

            const altIndicators = await tx.indicator.findMany({
              where: {
                applicable_facility_types: {
                  array_contains: [altName],
                },
              },
              include: {
                indicator_remuneration: {
                  where: {
                    facility_type_remuneration: {
                      facility_type_id: facility.facility_type.id,
                    },
                  },
                  include: { facility_type_remuneration: true },
                },
                numerator_field: true,
                denominator_field: true,
                target_field: true,
              },
              orderBy: { code: "asc" },
            });

            if (altIndicators.length > 0) {
              console.log(`✅ Found ${altIndicators.length} indicators with alternative name: ${altName}`);
              indicators = altIndicators;
              break;
            }
          }
        }

        console.log(`📊 Found ${indicators.length} indicators for facility type ${facility.facility_type.name}`);

        // If still no indicators found, get all indicators as fallback
        if (indicators.length === 0) {
          console.log("⚠️ No indicators found with any facility type name, getting all indicators as fallback...");
          indicators = await tx.indicator.findMany({
            include: {
              indicator_remuneration: {
                where: {
                  facility_type_remuneration: {
                    facility_type_id: facility.facility_type.id,
                  },
                },
                include: { facility_type_remuneration: true },
              },
              numerator_field: true,
              denominator_field: true,
              target_field: true,
            },
            orderBy: { code: "asc" },
          });
          console.log(`📊 Fallback: Found ${indicators.length} total indicators`);
        }

        // If still no indicators, we can't proceed
        if (indicators.length === 0) {
          console.log("❌ No indicators found at all, cannot calculate remuneration");
          return {
            success: true,
            fieldValues: enhancedFieldValues,
            remuneration: null,
          };
        }

        // Use the HealthDataRemunerationService for all calculation and storage
        try {
          const { HealthDataRemunerationService } = await import("@/lib/services/health-data-remuneration.service");

          // Convert enhancedFieldValues to the format expected by the service
          const serviceFieldValues = enhancedFieldValues.map((fv: any) => ({
            fieldId: fv.field_id,
            value: fv.string_value || fv.numeric_value || fv.boolean_value
          }));

          const serviceResult = await HealthDataRemunerationService.processHealthDataRemuneration(
            facilityId,
            reportMonth,
            serviceFieldValues,
            tx // Pass the transaction instance
          );

          return {
            success: true,
            fieldValues: enhancedFieldValues,
            remuneration: {
              performancePercentage: serviceResult.performancePercentage,
              facilityRemuneration: serviceResult.facilityRemuneration,
              totalWorkerRemuneration: serviceResult.totalWorkerRemuneration,
              totalRemuneration: serviceResult.totalRemuneration,
              healthWorkersCount: serviceResult.healthWorkersCount,
              ashaWorkersCount: serviceResult.ashaWorkersCount,
            },
          };
        } catch (error) {
          console.error("Error calculating remuneration:", error);
          // Continue with data submission even if remuneration calculation fails
          return {
            success: true,
            fieldValues: enhancedFieldValues,
            remuneration: null,
          };
        }
      } catch (remunerationError) {
        console.error("Error in remuneration calculation block:", remunerationError);
        return {
          success: true,
          fieldValues: enhancedFieldValues,
          remuneration: null,
        };
      }
    }, {
      maxWait: 5000, // default: 2000
      timeout: 20000, // default: 5000
    });

    return NextResponse.json({
      message: "Health data submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting health data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");
    const reportMonth = searchParams.get("reportMonth");

    if (!facilityId || !reportMonth) {
      return NextResponse.json(
        { error: "Missing facilityId or reportMonth" },
        { status: 400 }
      );
    }

    // Check access permissions
    if (session.user.role === "facility") {
      const userFacility = await prisma.user.findUnique({
        where: { id: parseInt(session.user.id) },
        include: { facility: true },
      });

      if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
        return NextResponse.json(
          { error: "Access denied to this facility" },
          { status: 403 }
        );
      }
    }

    // Get field values for the facility and report month
    const fieldValues = await prisma.field_value.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
      include: {
        field: true,
      },
    });

    // Get remuneration calculation if available
    const remunerationCalculation =
      await prisma.remuneration_calculations.findUnique({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
      });

    return NextResponse.json({
      fieldValues,
      remuneration: remunerationCalculation,
    });
  } catch (error) {
    console.error("Error fetching health data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
