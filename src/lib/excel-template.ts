import { PrismaClient } from "@/generated/prisma";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export interface IndicatorFormula {
  type: "percentage" | "sum" | "count" | "direct";
  numerator?: string; // Reference to other indicators
  denominator?: string;
  formula?: string; // Custom formula
}

export interface ExcelTemplateConfig {
  reportMonth: string;
  districtId?: number;
  facilityIds?: number[];
  includeSubCentres: boolean;
}

export class ExcelTemplateGenerator {
  async generateTemplate(config: ExcelTemplateConfig) {
    // Get all active indicators grouped by category
    const categories = await prisma.indicatorCategory.findMany({
      where: { is_active: true },
      include: {
        indicators: {
          where: { is_active: true },
          orderBy: { sort_order: "asc" },
        },
      },
      orderBy: { sort_order: "asc" },
    });

    // Get facilities and sub-centres based on config
    const facilities = await this.getFacilitiesForTemplate(config);

    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();

    // Main data sheet
    const dataSheet = this.createDataSheet(categories, facilities, config);
    XLSX.utils.book_append_sheet(workbook, dataSheet, "Monthly Data");

    // Metadata sheet for validation
    const metadataSheet = this.createMetadataSheet(categories, facilities);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");

    // Validation rules sheet
    const validationSheet = this.createValidationSheet(categories);
    XLSX.utils.book_append_sheet(workbook, validationSheet, "Validation Rules");

    return workbook;
  }

  private async getFacilitiesForTemplate(config: ExcelTemplateConfig) {
    const whereClause: any = {};

    if (config.districtId) {
      whereClause.district_id = config.districtId;
    }

    if (config.facilityIds?.length) {
      whereClause.id = { in: config.facilityIds };
    }

    return await prisma.facility.findMany({
      where: whereClause,
      include: {
        district: true,
        facility_type: true,
        children: config.includeSubCentres ? true : false,
      },
      orderBy: [{ district: { name: "asc" } }, { name: "asc" }],
    });
  }

  private createDataSheet(
    categories: any[],
    facilities: any[],
    config: ExcelTemplateConfig
  ) {
    const headers = [
      "District",
      "Facility Type",
      "Facility Name",
      "Sub Centre",
      "Indicator Category",
      "Indicator Code",
      "Indicator Name",
      "Unit",
      "Target Value",
      "Numerator",
      "Denominator",
      "Value",
      "Achievement %",
      "Remarks",
    ];

    const data: any[][] = [headers];

    // Add instruction row
    data.push([
      "Instructions:",
      "1. Fill Numerator/Denominator for percentage indicators",
      "2. Fill Value directly for number indicators",
      "3. Achievement % will be calculated automatically",
      "4. Do not modify gray columns",
      "5. Report Month: " + config.reportMonth,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // Generate rows for each facility-indicator combination
    for (const facility of facilities) {
      for (const category of categories) {
        for (const indicator of category.indicators) {
          // Facility-level row
          data.push([
            facility.district.name,
            facility.facility_type.name,
            facility.name,
            "", // No sub centre for facility level
            category.name,
            indicator.code,
            indicator.name,
            indicator.unit,
            indicator.target_value || "",
            "", // Numerator - to be filled
            "", // Denominator - to be filled
            "", // Value - to be filled
            "", // Achievement % - calculated
            "", // Remarks
          ]);

          // Child facility rows if included
          if (config.includeSubCentres && facility.children) {
            for (const child of facility.children) {
              data.push([
                facility.district.name,
                facility.facility_type.name,
                facility.name,
                child.name,
                category.name,
                indicator.code,
                indicator.name,
                indicator.unit,
                indicator.target_value || "",
                "", // Numerator
                "", // Denominator
                "", // Value
                "", // Achievement %
                "", // Remarks
              ]);
            }
          }
        }
      }
    }

    return XLSX.utils.aoa_to_sheet(data);
  }

  private createMetadataSheet(categories: any[], facilities: any[]) {
    const data = [
      ["Template Metadata"],
      ["Generated Date", new Date().toISOString()],
      ["Total Categories", categories.length],
      [
        "Total Indicators",
        categories.reduce((sum, cat) => sum + cat.indicators.length, 0),
      ],
      ["Total Facilities", facilities.length],
      [""],
      ["Indicator Details"],
      ["Code", "Name", "Category", "Unit", "Calculation Type", "Data Source"],
    ];

    for (const category of categories) {
      for (const indicator of category.indicators) {
        data.push([
          indicator.code,
          indicator.name,
          category.name,
          indicator.unit,
          indicator.calculation_type,
          indicator.data_source,
        ]);
      }
    }

    return XLSX.utils.aoa_to_sheet(data);
  }

  private createValidationSheet(categories: any[]) {
    const data = [
      ["Validation Rules"],
      ["Indicator Code", "Validation Rule", "Error Message"],
    ];

    for (const category of categories) {
      for (const indicator of category.indicators) {
        let rule = "";
        let message = "";

        switch (indicator.unit.toLowerCase()) {
          case "percentage":
            rule = "Value must be between 0 and 100";
            message = "Percentage values cannot exceed 100%";
            break;
          case "number":
            rule = "Value must be a positive number";
            message = "Only positive numbers allowed";
            break;
          default:
            rule = "Value must be numeric";
            message = "Enter valid numeric value";
        }

        data.push([indicator.code, rule, message]);
      }
    }

    return XLSX.utils.aoa_to_sheet(data);
  }
}

// Helper function to suggest valid indicator codes
function getIndicatorCodeSuggestions(invalidCode: string): string {
  const suggestions: Record<string, string> = {
    "1": 'Try "1.1" (Total number of NEW Pregnant Women registered for ANC)',
    "2": 'Try "1.1.1" (ANC registered within 1st trimester) or "2.1.1.a" (Home Deliveries by SBA)',
    "3": 'Try "1.2.1" (PW given Td1) or "3.1.1" (C-Section deliveries)',
    "4": 'Try "1.2.2" (PW given Td2) or "4.2" (Abortion spontaneous)',
    "5": 'Try "1.2.3" (PW given Td Booster)',
    "10": 'Try "1.2.8" (PW given ANC Corticosteroids)',
  };

  return (
    suggestions[invalidCode] ||
    "Please check the indicator codes list for valid codes."
  );
}

export class DataUploadProcessor {
  async processUploadedFile(
    file: Buffer,
    reportMonth: string,
    uploadedBy: number,
    fileName?: string
  ) {
    // Create upload session
    const session = await prisma.dataUploadSession.create({
      data: {
        file_name: fileName || `monthly_data_${reportMonth}.xlsx`,
        file_path: null, // We don't store the file path in this processor
        report_month: reportMonth,
        total_records: 0,
        uploaded_by: uploadedBy,
        status: "PROCESSING",
      },
    });

    try {
      let dataRows: any[][];

      // Check if it's a CSV file
      if (fileName && fileName.endsWith(".csv")) {
        // Handle CSV file
        const csvContent = file.toString("utf-8");
        const workbook = XLSX.read(csvContent, { type: "string" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        dataRows = data.slice(1) as any[][]; // Skip header row for CSV
      } else {
        // Handle Excel file
        const workbook = XLSX.read(file, { type: "buffer" });
        const worksheet = workbook.Sheets["Monthly Data"];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        dataRows = data.slice(2) as any[][]; // Skip header and instruction rows
      }

      await prisma.dataUploadSession.update({
        where: { id: session.id },
        data: { total_records: dataRows.length },
      });

      const results = await this.processDataRows(
        dataRows,
        reportMonth,
        uploadedBy
      );

      // Update session with results
      await prisma.dataUploadSession.update({
        where: { id: session.id },
        data: {
          success_count: results.successCount,
          error_count: results.errorCount,
          status: results.errorCount > 0 ? "COMPLETED" : "COMPLETED",
          completed_at: new Date(),
          upload_summary: results.summary,
        },
      });

      return {
        sessionId: session.id,
        totalRecords: dataRows.length,
        successCount: results.successCount,
        errorCount: results.errorCount,
        errors: results.errors,
      };
    } catch (error) {
      await prisma.dataUploadSession.update({
        where: { id: session.id },
        data: {
          status: "FAILED",
          completed_at: new Date(),
          upload_summary: { error: error.message },
        },
      });
      throw error;
    }
  }

  private async processDataRows(
    rows: any[][],
    reportMonth: string,
    uploadedBy: number
  ) {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const summary: any = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        // Skip completely empty rows
        if (
          !row ||
          row.length === 0 ||
          row.every((cell) => !cell || cell.toString().trim() === "")
        ) {
          continue; // Skip empty rows silently
        }

        if (row.length < 14) {
          errorCount++;
          errors.push(
            `Row ${i + 3}: Insufficient columns (expected 14, got ${
              row?.length || 0
            }) - Row appears to be incomplete`
          );
          continue; // Skip incomplete rows
        }

        const [
          districtName,
          facilityTypeName,
          facilityName,
          subCentreName,
          categoryName,
          indicatorCode,
          indicatorName,
          unit,
          targetValue,
          numerator,
          denominator,
          value,
          achievementPercent,
          remarks,
        ] = row;

        // Skip rows without indicator code
        if (!indicatorCode) continue;

        // Ensure all string fields are properly converted to strings
        const districtNameStr = String(districtName || "");
        const facilityNameStr = String(facilityName || "");
        const subCentreNameStr = subCentreName
          ? String(subCentreName)
          : undefined;
        const indicatorCodeStr = String(indicatorCode);

        // Validate and process the row
        await this.processDataRow({
          districtName: districtNameStr,
          facilityName: facilityNameStr,
          subCentreName: subCentreNameStr,
          indicatorCode: indicatorCodeStr,
          reportMonth,
          numerator: numerator ? parseFloat(numerator) : null,
          denominator: denominator ? parseFloat(denominator) : null,
          value: value ? parseFloat(value) : null,
          targetValue: targetValue ? parseFloat(targetValue) : null,
          remarks: remarks || null,
          uploadedBy,
        });

        successCount++;
      } catch (error: any) {
        errorCount++;
        const errorMessage = error?.message || "Unknown error";
        errors.push(`Row ${i + 3}: ${errorMessage}`);
      }
    }

    return {
      successCount,
      errorCount,
      errors,
      summary: {
        errors: errors.slice(0, 50), // Limit to first 50 errors to avoid huge JSON
        totalErrors: errors.length,
      },
    };
  }

  private async processDataRow(data: {
    districtName: string;
    facilityName: string;
    subCentreName?: string;
    indicatorCode: string;
    reportMonth: string;
    numerator?: number;
    denominator?: number;
    value?: number;
    targetValue?: number;
    remarks?: string;
    uploadedBy: number;
  }) {
    // Common invalid to valid indicator code mappings
    const INDICATOR_CODE_MAPPINGS: Record<string, string> = {
      "1": "1.1",
      "2": "1.1.1",
      "3": "1.2.1",
      "4": "1.2.2",
      "5": "1.2.3",
      "6": "1.2.4",
      "7": "1.2.5",
      "8": "1.2.6",
      "9": "1.2.7",
      "10": "1.2.8",
      "11": "2.1.1.a",
      "12": "2.1.1.b",
      "13": "2.2",
      "14": "2.3",
      "15": "3.1.1",
      "16": "4.1.1.a",
      "17": "4.1.1.b",
      "18": "4.1.2",
      "19": "9.1.1",
      "20": "9.1.2",
      "21": "9.1.3",
      "22": "9.1.4",
      "23": "9.1.5",
      "24": "14.1.1",
      "25": "14.1.2",
      "26": "14.2.1",
      "27": "14.2.2",
      "28": "14.3.1.a",
      "29": "14.3.1.b",
      "30": "14.3.1.c",
    };

    // Try to find indicator with original code first
    let indicator = await prisma.indicator.findUnique({
      where: { code: data.indicatorCode },
    });

    // If not found, try with mapped code
    if (!indicator && INDICATOR_CODE_MAPPINGS[data.indicatorCode]) {
      const mappedCode = INDICATOR_CODE_MAPPINGS[data.indicatorCode];
      indicator = await prisma.indicator.findUnique({
        where: { code: mappedCode },
      });

      if (indicator) {
        console.log(
          `Auto-fixed indicator code: ${data.indicatorCode} → ${mappedCode}`
        );
      }
    }

    if (!indicator) {
      // Provide helpful error message with suggestions
      const suggestions = getIndicatorCodeSuggestions(data.indicatorCode);
      throw new Error(
        `Indicator not found: "${data.indicatorCode}". ${suggestions}`
      );
    }

    // Find facility
    const facility = await prisma.facility.findFirst({
      where: {
        name: data.facilityName,
        district: { name: data.districtName },
      },
      include: { district: true },
    });

    if (!facility) {
      throw new Error(
        `Facility not found: ${data.facilityName} in ${data.districtName}`
      );
    }

    // Find sub-centre if specified
    let subCentre = null;
    if (data.subCentreName) {
      subCentre = await prisma.sub_centre.findFirst({
        where: {
          name: data.subCentreName,
          facility_id: facility.id,
        },
      });

      if (!subCentre) {
        throw new Error(
          `Sub-centre not found: ${data.subCentreName} under ${data.facilityName}`
        );
      }
    }

    // Calculate final value based on indicator type
    let finalValue = data.value;
    let achievement = null;

    // For percentage calculations, use numerator and denominator if available
    if (data.numerator && data.denominator) {
      if (data.denominator === 0) {
        throw new Error(
          "Denominator cannot be zero for percentage calculation"
        );
      }
      finalValue = (data.numerator / data.denominator) * 100;
    }

    // Calculate achievement percentage
    if (finalValue && data.targetValue) {
      achievement = (finalValue / data.targetValue) * 100;
    }

    // Check if record already exists
    const existingRecord = await prisma.monthlyHealthData.findFirst({
      where: {
        facility_id: facility.id,
        sub_centre_id: subCentre?.id || null,
        indicator_id: indicator.id,
        report_month: data.reportMonth,
      },
    });

    if (existingRecord) {
      // Update existing record
      await prisma.monthlyHealthData.update({
        where: { id: existingRecord.id },
        data: {
          value: finalValue,
          numerator: data.numerator,
          denominator: data.denominator,
          target_value: data.targetValue,
          achievement: achievement,
          remarks: data.remarks,
          data_quality: "VALIDATED",
          uploaded_by: data.uploadedBy,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new record
      await prisma.monthlyHealthData.create({
        data: {
          indicator_id: indicator.id,
          facility_id: facility.id,
          sub_centre_id: subCentre?.id || null,
          district_id: facility.district_id,
          report_month: data.reportMonth,
          value: finalValue,
          numerator: data.numerator,
          denominator: data.denominator,
          target_value: data.targetValue,
          achievement: achievement,
          remarks: data.remarks,
          data_quality: "VALIDATED",
          uploaded_by: data.uploadedBy,
        },
      });
    }
  }
}

export const excelTemplateGenerator = new ExcelTemplateGenerator();
export const dataUploadProcessor = new DataUploadProcessor();
