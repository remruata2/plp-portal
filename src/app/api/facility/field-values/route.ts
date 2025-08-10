import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { FieldBasedUpdater } from "@/lib/calculations/field-based-updater";
import { PrismaClient } from "@/generated/prisma";
import { 
  FieldValueSerializer, 
  FieldValueInputDTO, 
  FieldValidationError,
  FieldValueResponseDTO 
} from "@/lib/dto/field-value.dto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { facility_id, report_month, field_values } = body;

    if (
      !facility_id ||
      !report_month ||
      !field_values ||
      !Array.isArray(field_values)
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: facility_id, report_month, field_values",
        },
        { status: 400 }
      );
    }

    // Validate facility access
    const facility = await prisma.facility.findUnique({
      where: { id: facility_id },
      include: { facility_type: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Build field value map for cross-field validation
    const fieldValueMap = new Map<string, any>();
    for (const fieldValue of field_values) {
      fieldValueMap.set(fieldValue.field_code, fieldValue.value);
    }

    // Validate all field values using DTO validator
    const validatedFieldValues = [];
    const allValidationErrors: FieldValidationError[] = [];
    
    for (const fieldValue of field_values) {
      const input: FieldValueInputDTO = {
        field_code: fieldValue.field_code,
        value: fieldValue.value,
        remarks: fieldValue.remarks,
      };

      if (!input.field_code) {
        return NextResponse.json(
          { error: "Missing field_code in field value" },
          { status: 400 }
        );
      }

      // Get field details
      const field = await prisma.field.findUnique({
        where: { code: input.field_code },
      });

      if (!field) {
        return NextResponse.json(
          { error: `Field not found: ${input.field_code}` },
          { status: 400 }
        );
      }

      // Check if field is applicable to this facility type
      const fieldMapping = await prisma.facilityFieldMapping.findFirst({
        where: {
          facility_type_id: facility.facility_type.id,
          field_id: field.id,
        },
      });

      if (!fieldMapping) {
        return NextResponse.json(
          {
            error: `Field ${input.field_code} is not applicable to facility type ${facility.facility_type.name}`,
          },
          { status: 400 }
        );
      }

      // Validate field value using DTO validator with enhanced Field 20/21 logic
      const validationErrors = FieldValueSerializer.validateFieldValueInput(
        input,
        field,
        fieldValueMap
      );

      if (validationErrors.length > 0) {
        allValidationErrors.push(...validationErrors);
        continue;
      }

      // Prepare field value for storage using DTO serializer
      const preparedValue = FieldValueSerializer.prepareFieldValueForStorage(
        input,
        field,
        parseInt(facility_id),
        report_month,
        fieldValueMap
      );

      validatedFieldValues.push(preparedValue);
    }

    // Return validation errors if any
    if (allValidationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Field validation failed",
          validation_errors: allValidationErrors,
          details: allValidationErrors.map(e => `${e.field_code}: ${e.error_message}`).join('; ')
        },
        { status: 400 }
      );
    }

    // Update field values using the field-based updater
    const updater = new FieldBasedUpdater();
    const result = await updater.updateFieldValues(
      validatedFieldValues,
      session.user.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Field values updated successfully",
      updated_count: validatedFieldValues.length,
      field_20_21_logic: "Enhanced validation applied for Field 20 (always exposed) and Field 21 (conditionally exposed)"
    });
  } catch (error) {
    console.error("Error updating field values:", error);
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
    const facility_id = searchParams.get("facility_id");
    const report_month = searchParams.get("report_month");

    if (!facility_id || !report_month) {
      return NextResponse.json(
        { error: "Missing required parameters: facility_id, report_month" },
        { status: 400 }
      );
    }

    // Get facility info
    const facility = await prisma.facility.findUnique({
      where: { id: facility_id },
      include: { facility_type: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Get field values for this facility and month
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        facility_id: parseInt(facility_id),
        report_month,
      },
      include: {
        field: true,
      },
      orderBy: {
        field: {
          sort_order: "asc",
        },
      },
    });

    // Get applicable fields for this facility type
    const applicableFields = await prisma.facilityFieldMapping.findMany({
      where: {
        facility_type_id: facility.facility_type.id,
      },
      include: {
        field: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    // Build field value map for conditional logic (Field 20/21)
    const fieldValueMap = new Map<string, any>();
    fieldValues.forEach(fv => {
      if (fv.field.field_type === 'BINARY') {
        fieldValueMap.set(fv.field.code, fv.boolean_value);
      } else if (fv.field.field_type === 'MONTHLY_COUNT' || fv.field.field_type === 'FACILITY_SPECIFIC') {
        fieldValueMap.set(fv.field.code, fv.numeric_value ? Number(fv.numeric_value) : null);
      } else {
        fieldValueMap.set(fv.field.code, fv.string_value);
      }
    });

    // Apply DTO serializer with Field 20/21 conditional logic
    const serializedFields: FieldValueResponseDTO[] = applicableFields.map((mapping) => {
      const fieldValue = fieldValues.find((fv) => fv.field_id === mapping.field.id);
      return FieldValueSerializer.serializeFieldResponse(
        mapping,
        fieldValue,
        fieldValueMap
      );
    });

    // Separate field values for backward compatibility
    const serializedFieldValues = fieldValues.map((fv) => ({
      field_id: fv.field_id,
      field_code: fv.field.code,
      field_name: fv.field.name,
      string_value: fv.string_value,
      numeric_value: fv.numeric_value ? Number(fv.numeric_value) : null,
      boolean_value: fv.boolean_value,
      json_value: fv.json_value,
      remarks: fv.remarks,
      created_at: fv.created_at,
      updated_at: fv.updated_at,
    }));

    // Enhanced response with DTO-based serialization
    const response = {
      facility: {
        id: facility.id,
        name: facility.name,
        type: facility.facility_type.name,
      },
      report_month,
      // New DTO-based response with Field 20/21 conditional logic
      applicable_fields: serializedFields,
      // Legacy field values for backward compatibility
      field_values: serializedFieldValues,
      // Metadata about Field 20/21 logic
      field_20_21_info: {
        field_20_always_exposed: true,
        field_21_conditional: "Only exposed when Field 20 = true",
        conditional_fields: {
          elderly_support_group_formed: "Field 20 - Always exposed (BINARY)",
          elderly_support_group_activity: "Field 21 - Conditionally exposed (MONTHLY_COUNT)"
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching field values:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Parse field value based on field type
 */
function parseFieldValue(value: any, fieldType: string) {
  switch (fieldType) {
    case "MONTHLY_COUNT":
    case "FACILITY_SPECIFIC":
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        throw new Error(`Invalid numeric value: ${value}`);
      }
      return { numeric_value: numericValue };

    case "BINARY":
      const booleanValue = Boolean(value);
      return { boolean_value: booleanValue };

    case "CONSTANT":
      return { string_value: String(value) };

    default:
      return { string_value: String(value) };
  }
}
