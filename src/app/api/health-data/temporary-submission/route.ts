import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { SmartFieldService } from "@/lib/services/smart-field-service";
import { FieldMappingService } from "@/lib/services/field-mapping-service";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      facilityId,
      reportMonth,
      formData,
      fieldValues, // Keep for backward compatibility
      remarks,
      facilityType = "PHC",
    } = body;

    console.log("Temporary Submission API called with:", {
      userId: session.user.id,
      facilityId,
      reportMonth,
      formDataKeys: formData ? Object.keys(formData) : null,
      fieldValuesCount: fieldValues?.length,
      facilityType,
      remarks,
    });

    if (!facilityId || !reportMonth || (!formData && !fieldValues)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize field mappings
    await FieldMappingService.initializeMappings();

    // Convert formData to fieldValues if needed
    let processedFieldValues = fieldValues;
    if (formData && !fieldValues) {
      processedFieldValues = FieldMappingService.convertFormDataToFieldValues(
        formData,
        facilityType
      );
      console.log("Converted formData to fieldValues:", processedFieldValues);
    }

    // Get all active fields to validate field IDs
    const activeFields = await prisma.field.findMany({
      where: { is_active: true },
      select: { id: true, user_type: true, code: true },
    });

    console.log(
      "Available fields in database:",
      activeFields.map((f) => ({ id: f.id, code: f.code }))
    );

    const fieldMap = new Map(activeFields.map((field) => [field.id, field]));

    // Process each field value
    const results = [];
    for (const fieldValue of processedFieldValues) {
      const { fieldId, value, fieldType = "numeric" } = fieldValue;

      // Validate field exists
      const field = fieldMap.get(fieldId);
      if (!field) {
        results.push({
          fieldId,
          success: false,
          error: "Field not found",
        });
        continue;
      }

      try {
        // Convert value based on field type
        let processedValue: string | number | boolean;

        switch (fieldType) {
          case "string":
            processedValue = String(value);
            break;
          case "boolean":
            processedValue = Boolean(value);
            break;
          case "numeric":
          default:
            processedValue = Number(value);
            if (isNaN(processedValue)) {
              throw new Error("Invalid numeric value");
            }
            break;
        }

        console.log(`Processing field ${fieldId} with value:`, processedValue);

        // Set the field value using SmartFieldService
        await SmartFieldService.setFieldValue(
          fieldId,
          facilityId, // Keep as string since it's a CUID
          reportMonth,
          processedValue,
          parseInt(session.user.id),
          false, // isOverride
          undefined, // overrideReason
          remarks
        );

        console.log(`Successfully saved field ${fieldId}`);

        results.push({
          fieldId,
          fieldCode: field.code,
          userType: field.user_type,
          success: true,
        });
      } catch (error) {
        console.error(`Error setting field ${fieldId}:`, error);
        console.error(`Field details:`, {
          fieldId,
          fieldCode: field.code,
          value: fieldValue.value,
        });
        results.push({
          fieldId,
          fieldCode: field.code,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Count successes and failures
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log("Temporary submission completed:", {
      total: results.length,
      successful,
      failed,
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${successful} fields successfully${
        failed > 0 ? `, ${failed} failed` : ""
      }`,
      results,
      summary: {
        total: results.length,
        successful,
        failed,
      },
    });
  } catch (error) {
    console.error("Error in temporary submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
