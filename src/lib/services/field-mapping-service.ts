import { prisma } from "@/lib/prisma";

export interface FieldMapping {
  formFieldName: string;
  databaseFieldId: number;
  fieldType: "numeric" | "boolean" | "text";
  description: string;
}

export interface FacilityFieldMapping {
  facilityType: string;
  fields: FieldMapping[];
}

export class FieldMappingService {
  private static fieldMappings: Map<string, FieldMapping[]> = new Map();

  // Initialize field mappings for different facility types
  static async initializeMappings() {
    if (this.fieldMappings.size > 0) {
      return; // Already initialized
    }

    // Get all active fields from database
    const activeFields = await prisma.field.findMany({
      where: { is_active: true },
      select: { id: true, code: true, name: true, field_type: true },
    });

    console.log("Active fields from database:", activeFields);

    // Get facility types and their field mappings from database
    const facilityTypes = await prisma.facilityType.findMany({
      where: { is_active: true },
      include: {
        field_mappings: {
          include: {
            field: true,
          },
          orderBy: { display_order: "asc" },
        },
      },
    });

    // Create mappings for each facility type based on database
    for (const facilityType of facilityTypes) {
      const mappings: FieldMapping[] = facilityType.field_mappings.map(
        (mapping) => ({
          formFieldName: mapping.field.code.toLowerCase().replace(/\s+/g, ""), // Convert to camelCase
          databaseFieldId: mapping.field.id,
          fieldType: mapping.field.field_type.toLowerCase() as
            | "numeric"
            | "boolean"
            | "text",
          description: mapping.field.name,
        })
      );

      this.fieldMappings.set(facilityType.name, mappings);
    }

    console.log(
      "Field mappings initialized from database:",
      Object.fromEntries(this.fieldMappings)
    );
  }

  static getFieldMappings(facilityType: string): FieldMapping[] {
    return this.fieldMappings.get(facilityType) || [];
  }

  static getFieldId(
    formFieldName: string,
    facilityType: string
  ): number | null {
    const mappings = this.getFieldMappings(facilityType);
    const mapping = mappings.find((m) => m.formFieldName === formFieldName);
    return mapping?.databaseFieldId || null;
  }

  static getFieldType(
    formFieldName: string,
    facilityType: string
  ): string | null {
    const mappings = this.getFieldMappings(facilityType);
    const mapping = mappings.find((m) => m.formFieldName === formFieldName);
    return mapping?.fieldType || null;
  }

  static convertFormDataToFieldValues(
    formData: any,
    facilityType: string
  ): Array<{
    fieldId: number;
    value: any;
    fieldType: string;
  }> {
    const mappings = this.getFieldMappings(facilityType);
    const fieldValues: Array<{
      fieldId: number;
      value: any;
      fieldType: string;
    }> = [];

    for (const mapping of mappings) {
      const formValue = formData[mapping.formFieldName];
      if (formValue !== undefined && formValue !== null) {
        fieldValues.push({
          fieldId: mapping.databaseFieldId,
          value: formValue,
          fieldType: mapping.fieldType,
        });
      }
    }

    return fieldValues;
  }
}
