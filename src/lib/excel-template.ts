import { PrismaClient } from "@/generated/prisma";
import * as XLSX from "xlsx";


const prisma = new PrismaClient();

export interface ExcelUploadConfig {
  includeSubCentres?: boolean;
  includeHistoricalData?: boolean;
  includeCalculatedFields?: boolean;
  includeTargets?: boolean;
  includeRemuneration?: boolean;
}

export interface ExcelUploadResult {
  success: boolean;
  message: string;
  totalRecords?: number;
  successCount?: number;
  errorCount?: number;
  errors?: string[];
}

export class ExcelTemplateService {
  /**
   * Generate Excel template for data upload
   */
  static async generateTemplate(
    facilityId: string,
    reportMonth: string,
    config: ExcelUploadConfig = {}
  ): Promise<Buffer> {
    try {
      // Get facility information
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: {
          facility_type: true,
          district: true,
        },
      });

      if (!facility) {
        throw new Error("Facility not found");
      }

      // Get fields for this facility type
      const fields = await prisma.facilityFieldMapping.findMany({
        where: {
          facility_type_id: facility.facility_type_id,
          is_required: true,
        },
        include: {
          field: true,
        },
        orderBy: {
          display_order: "asc",
        },
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Create data sheet
      const dataSheet = this.createDataSheet(fields, facility, reportMonth, config);
      XLSX.utils.book_append_sheet(workbook, dataSheet, "Data Upload");

      // Create instructions sheet
      const instructionsSheet = this.createInstructionsSheet(facility, reportMonth);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

      // Create validation sheet
      const validationSheet = this.createValidationSheet(fields);
      XLSX.utils.book_append_sheet(workbook, validationSheet, "Field Validation");

      // Convert to buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      return buffer;
    } catch (error) {
      console.error("Error generating template:", error);
      throw error;
    }
  }

  /**
   * Process uploaded Excel file
   */
  static async processUpload(
    fileBuffer: Buffer,
    facilityId: string,
    reportMonth: string,
    uploadedBy: number,
    config: ExcelUploadConfig = {}
  ): Promise<ExcelUploadResult> {
    try {
      // Read Excel file
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const dataSheet = workbook.Sheets["Data Upload"];

      if (!dataSheet) {
        return {
          success: false,
          message: "Data Upload sheet not found in Excel file",
        };
      }

      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(dataSheet, { header: 1 });

      if (data.length < 2) {
        return {
          success: false,
          message: "Excel file must contain at least header row and one data row",
        };
      }

      // Extract headers and data
      const headers = data[0] as string[];
      const rows = data.slice(1) as any[][];

      // Validate headers
      const validationResult = this.validateHeaders(headers);
      if (!validationResult.valid) {
        return {
          success: false,
          message: `Invalid headers: ${validationResult.errors.join(", ")}`,
        };
      }

      // Process data rows
      const results = await this.processDataRows(
        rows,
        headers,
        facilityId,
        reportMonth,
        uploadedBy,
        config
      );

      return {
        success: true,
        message: `Successfully processed ${results.successCount} out of ${results.totalRecords} records`,
        totalRecords: results.totalRecords,
        successCount: results.successCount,
        errorCount: results.errorCount,
        errors: results.errors,
      };
    } catch (error) {
      console.error("Error processing upload:", error);
      return {
        success: false,
        message: `Error processing upload: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Create data sheet
   */
  private static createDataSheet(
    fields: any[],
    facility: any,
    reportMonth: string,
    config: ExcelUploadConfig
  ): XLSX.WorkSheet {
    // Create headers
    const headers = [
      "Field Code",
      "Field Name",
      "Value",
      "Remarks",
      "Is Override",
      "Override Reason",
    ];

    // Create sample data rows
    const sampleRows = fields.map((fieldMapping) => [
      fieldMapping.field.code,
      fieldMapping.field.name,
      "", // Value column - empty for template
      "", // Remarks column
      "No", // Is Override column
      "", // Override Reason column
    ]);

    // Combine headers and data
    const sheetData = [headers, ...sampleRows];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths
    const columnWidths = [
      { wch: 20 }, // Field Code
      { wch: 30 }, // Field Name
      { wch: 25 }, // Value
      { wch: 30 }, // Remarks
      { wch: 15 }, // Is Override
      { wch: 25 }, // Override Reason
    ];

    worksheet["!cols"] = columnWidths;

    // Add data validation
    this.addDataValidation(worksheet, fields);

    return worksheet;
  }

  /**
   * Create instructions sheet
   */
  private static createInstructionsSheet(facility: any, reportMonth: string): XLSX.WorkSheet {
    const instructions = [
      ["Instructions for Data Upload"],
      [""],
      ["Facility:", facility.name],
      ["District:", facility.district.name],
      ["Facility Type:", facility.facility_type.name],
      ["Report Month:", reportMonth],
      [""],
      ["Instructions:"],
      ["1. Fill in the 'Value' column with the actual data for each field"],
      ["2. Use 'Remarks' column to add any notes or explanations"],
      ["3. Set 'Is Override' to 'Yes' if this value overrides a default"],
      ["4. Provide 'Override Reason' if overriding a default value"],
      ["5. Do not modify the 'Field Code' or 'Field Name' columns"],
      ["6. Save the file and upload it back to the system"],
      [""],
      ["Data Types:"],
      ["- Text: Enter text directly"],
      ["- Number: Enter numeric values only"],
      ["- Boolean: Enter 'Yes' or 'No'"],
      ["- Date: Use YYYY-MM-DD format"],
      ["- Percentage: Enter as decimal (e.g., 0.85 for 85%)"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(instructions);

    // Set column width
    worksheet["!cols"] = [{ wch: 60 }];

    return worksheet;
  }

  /**
   * Create validation sheet
   */
  private static createValidationSheet(fields: any[]): XLSX.WorkSheet {
    const validationData = [
      ["Field Validation Rules"],
      [""],
      ["Field Code", "Field Name", "Data Type", "Required", "Validation Rules"],
      ...fields.map((fieldMapping) => [
        fieldMapping.field.code,
        fieldMapping.field.name,
        fieldMapping.field.field_type,
        fieldMapping.is_required ? "Yes" : "No",
        fieldMapping.field.validation_rules ? JSON.stringify(fieldMapping.field.validation_rules) : "None",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(validationData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Field Code
      { wch: 30 }, // Field Name
      { wch: 15 }, // Data Type
      { wch: 15 }, // Required
      { wch: 40 }, // Validation Rules
    ];

    return worksheet;
  }

  /**
   * Validate headers
   */
  private static validateHeaders(headers: string[]): { valid: boolean; errors: string[] } {
    const requiredHeaders = ["Field Code", "Field Name", "Value"];
    const errors: string[] = [];

    requiredHeaders.forEach((header) => {
      if (!headers.includes(header)) {
        errors.push(`Missing required header: ${header}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Process data rows
   */
  private static async processDataRows(
    rows: any[][],
    headers: string[],
    facilityId: string,
    reportMonth: string,
    uploadedBy: number,
    config: ExcelUploadConfig
  ): Promise<{
    totalRecords: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  }> {
    const results = {
      totalRecords: rows.length,
      successCount: 0,
      errorCount: 0,
      errors: [] as string[],
    };

    // Get field mappings for validation
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { facility_type: true },
    });

    if (!facility) {
      throw new Error("Facility not found");
    }

    const fieldMappings = await prisma.facilityFieldMapping.findMany({
      where: {
        facility_type_id: facility.facility_type_id,
      },
      include: {
        field: true,
      },
    });

    const fieldMap = new Map(fieldMappings.map((fm) => [fm.field.code, fm.field]));

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because Excel is 1-indexed and we have headers

      try {
        // Skip empty rows
        if (row.every((cell: any) => cell === null || cell === undefined || cell === "")) {
          continue;
        }

        // Extract field code and value
        const fieldCodeIndex = headers.indexOf("Field Code");
        const valueIndex = headers.indexOf("Value");
        const remarksIndex = headers.indexOf("Remarks");
        const isOverrideIndex = headers.indexOf("Is Override");
        const overrideReasonIndex = headers.indexOf("Override Reason");

        if (fieldCodeIndex === -1 || valueIndex === -1) {
          results.errors.push(`Row ${rowNumber}: Missing required columns`);
          results.errorCount++;
          continue;
        }

        const fieldCode = row[fieldCodeIndex];
        const value = row[valueIndex];
        const remarks = remarksIndex !== -1 ? row[remarksIndex] || "" : "";
        const isOverride = isOverrideIndex !== -1 ? row[isOverrideIndex]?.toString().toLowerCase() === "yes" : false;
        const overrideReason = overrideReasonIndex !== -1 ? row[overrideReasonIndex] || "" : "";

        // Validate field code
        if (!fieldCode || !fieldMap.has(fieldCode)) {
          results.errors.push(`Row ${rowNumber}: Invalid field code: ${fieldCode}`);
          results.errorCount++;
          continue;
        }

        const field = fieldMap.get(fieldCode)!;

        // Validate value based on field type
        const validationResult = this.validateFieldValue(value, field, rowNumber);
        if (!validationResult.valid) {
          results.errors.push(validationResult.error);
          results.errorCount++;
          continue;
        }

        // Save field value
        await this.saveFieldValue(
          field.id,
          facilityId,
          reportMonth,
          value,
          uploadedBy,
          remarks,
          isOverride,
          overrideReason
        );

        results.successCount++;
      } catch (error) {
        const errorMessage = `Row ${rowNumber}: ${error instanceof Error ? error.message : "Unknown error"}`;
        results.errors.push(errorMessage);
        results.errorCount++;
      }
    }

    return results;
  }

  /**
   * Validate field value
   */
  private static validateFieldValue(
    value: any,
    field: any,
    rowNumber: number
  ): { valid: boolean; error?: string } {
    // Check if required field has value
    if (field.validation_rules?.required && (value === null || value === undefined || value === "")) {
      return {
        valid: false,
        error: `Row ${rowNumber}: Field ${field.code} is required but has no value`,
      };
    }

    // Skip validation for empty values
    if (value === null || value === undefined || value === "") {
      return { valid: true };
    }

    // Validate based on field type
    switch (field.field_type) {
      case "number":
        if (isNaN(Number(value))) {
          return {
            valid: false,
            error: `Row ${rowNumber}: Field ${field.code} must be a number`,
          };
        }
        break;

      case "boolean":
        const boolValue = value.toString().toLowerCase();
        if (!["yes", "no", "true", "false", "1", "0"].includes(boolValue)) {
          return {
            valid: false,
            error: `Row ${rowNumber}: Field ${field.code} must be Yes/No, True/False, or 1/0`,
          };
        }
        break;

      case "date":
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          return {
            valid: false,
            error: `Row ${rowNumber}: Field ${field.code} must be a valid date`,
          };
        }
        break;

      case "percentage":
        const percentValue = Number(value);
        if (isNaN(percentValue) || percentValue < 0 || percentValue > 1) {
          return {
            valid: false,
            error: `Row ${rowNumber}: Field ${field.code} must be a decimal between 0 and 1`,
          };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * Save field value
   */
  private static async saveFieldValue(
    fieldId: number,
    facilityId: string,
    reportMonth: string,
    value: any,
    uploadedBy: number,
    remarks: string | undefined,
    isOverride: boolean,
    overrideReason: string | undefined
  ): Promise<void> {
    // Prepare value data
    const valueData: any = {
      field_id: fieldId,
      facility_id: facilityId,
      report_month: reportMonth,
      uploaded_by: uploadedBy,
      remarks: remarks || null,
      is_override: isOverride,
      override_reason: overrideReason || null,
    };

    // Set the appropriate value field based on type
    if (typeof value === "string") {
      valueData.string_value = value;
    } else if (typeof value === "number") {
      valueData.numeric_value = value;
    } else if (typeof value === "boolean") {
      valueData.boolean_value = value;
    } else if (value instanceof Date) {
      valueData.string_value = value.toISOString().split("T")[0];
    } else {
      valueData.string_value = String(value);
    }

    // Note: sub_centre functionality has been removed from the schema
    // All data is now stored at the facility level

    // Upsert the field value
    await prisma.fieldValue.upsert({
      where: {
        field_id_facility_id_report_month: {
          field_id: fieldId,
          facility_id: facilityId,
          report_month: reportMonth,
        },
      },
      update: valueData,
      create: valueData,
    });
  }

  /**
   * Add data validation to worksheet
   */
  private static addDataValidation(worksheet: XLSX.WorkSheet, fields: any[]): void {
    // This is a placeholder for data validation
    // In a real implementation, you would add Excel data validation rules
    // For now, we'll just add some basic formatting
    console.log("Adding data validation for", fields.length, "fields");
  }
}
