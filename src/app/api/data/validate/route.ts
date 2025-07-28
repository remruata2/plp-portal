import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      return NextResponse.json(
        {
          error:
            "Only Excel files (.xlsx, .xls) and CSV files (.csv) are allowed",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Process the file
    let dataRows: any[][];

    if (file.name.endsWith(".csv")) {
      const csvContent = fileBuffer.toString("utf-8");
      const workbook = XLSX.read(csvContent, { type: "string" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      dataRows = data.slice(1) as any[][]; // Skip header row
    } else {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const worksheet =
        workbook.Sheets["Monthly Data"] ||
        workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      dataRows = data.slice(2) as any[][]; // Skip header and instruction rows
    }

    // Validation results
    const validationResults = {
      totalRows: dataRows.length,
      validRows: 0,
      invalidRows: 0,
      errors: [] as string[],
      warnings: [] as string[],
      suggestions: [] as string[],
    };

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

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];

      try {
        // Check column count
        if (!row || row.length < 14) {
          validationResults.invalidRows++;
          validationResults.errors.push(
            `Row ${i + 3}: Insufficient columns (expected 14, got ${
              row?.length || 0
            })`
          );
          continue;
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

        // Check for missing required fields
        if (!indicatorCode) {
          validationResults.invalidRows++;
          validationResults.errors.push(`Row ${i + 3}: Missing indicator code`);
          continue;
        }

        if (!facilityName) {
          validationResults.invalidRows++;
          validationResults.errors.push(`Row ${i + 3}: Missing facility name`);
          continue;
        }

        if (!districtName) {
          validationResults.invalidRows++;
          validationResults.errors.push(`Row ${i + 3}: Missing district name`);
          continue;
        }

        // Check indicator code validity
        const indicatorCodeStr = String(indicatorCode);

        if (INDICATOR_CODE_MAPPINGS[indicatorCodeStr]) {
          validationResults.warnings.push(
            `Row ${
              i + 3
            }: Invalid indicator code "${indicatorCodeStr}" - should be "${
              INDICATOR_CODE_MAPPINGS[indicatorCodeStr]
            }"`
          );
          validationResults.suggestions.push(
            `Row ${i + 3}: Replace "${indicatorCodeStr}" with "${
              INDICATOR_CODE_MAPPINGS[indicatorCodeStr]
            }"`
          );
        }

        validationResults.validRows++;
      } catch (error: any) {
        validationResults.invalidRows++;
        validationResults.errors.push(`Row ${i + 3}: ${error.message}`);
      }
    }

    // Generate summary
    const summary = {
      file: file.name,
      totalRows: validationResults.totalRows,
      validRows: validationResults.validRows,
      invalidRows: validationResults.invalidRows,
      successRate:
        validationResults.totalRows > 0
          ? Math.round(
              (validationResults.validRows / validationResults.totalRows) * 100
            )
          : 0,
      errors: validationResults.errors.slice(0, 20), // Limit to first 20 errors
      warnings: validationResults.warnings.slice(0, 20), // Limit to first 20 warnings
      suggestions: validationResults.suggestions.slice(0, 20), // Limit to first 20 suggestions
      totalErrors: validationResults.errors.length,
      totalWarnings: validationResults.warnings.length,
      totalSuggestions: validationResults.suggestions.length,
    };

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
