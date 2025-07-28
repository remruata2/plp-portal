import { PrismaClient } from "../src/generated/prisma";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Common invalid to valid indicator code mappings
const INDICATOR_CODE_MAPPINGS: Record<string, string> = {
  // Maternal Health
  "1": "1.1", // Total number of NEW Pregnant Women registered for ANC
  "2": "1.1.1", // Out of the total NEW ANC registered, number registered within 1st trimester
  "3": "1.2.1", // Number of PW given Td1 (Tetanus Diptheria dose 1)
  "4": "1.2.2", // Number of PW given Td2 (Tetanus Diptheria dose 2)
  "5": "1.2.3", // Number of PW given Td Booster (Tetanus Diptheria dose booster)
  "6": "1.2.4", // Number of PW provided full course 180 Iron Folic Acid (IFA) tablets
  "7": "1.2.5", // Number of PW provided full course 360 Calcium tablets
  "8": "1.2.6", // Number of PW given one Albendazole tablet after 1st trimester
  "9": "1.2.7", // Number of PW received 4 or more ANC check ups
  "10": "1.2.8", // Number of PW given ANC Corticosteroids in Pre-Term Labour

  // Delivery
  "11": "2.1.1.a", // Number of Home Deliveries attended by Skill Birth Attendant(SBA)
  "12": "2.1.1.b", // Number of Home Deliveries attended by Non SBA
  "13": "2.2", // Number of Institutional Deliveries conducted (Including C-Sections)
  "14": "2.3", // Age wise total number of delivery (Home +Institutional) reported

  // C-Section
  "15": "3.1.1", // Total number of C -Section deliveries performed

  // Births
  "16": "4.1.1.a", // Live Birth - Male
  "17": "4.1.1.b", // Live Birth - Female
  "18": "4.1.2", // Number of Pre-term newborns (< 37 weeks of pregnancy)

  // Immunization
  "19": "9.1.1", // Child immunisation - Vitamin K (Birth Dose)
  "20": "9.1.2", // Child immunisation - BCG
  "21": "9.1.3", // Child immunisation - Pentavalent 1
  "22": "9.1.4", // Child immunisation - Pentavalent 2
  "23": "9.1.5", // Child immunisation - Pentavalent 3

  // Outpatient
  "24": "14.1.1", // Outpatient - Diabetes
  "25": "14.1.2", // Outpatient - Hypertension
  "26": "14.2.1", // Allopathic- Outpatient attendance
  "27": "14.2.2", // Ayush - Outpatient attendance

  // Inpatient
  "28": "14.3.1.a", // IPD Admission Male- Children<18yrs
  "29": "14.3.1.b", // IPD Admission Male- Adults <60yrs
  "30": "14.3.1.c", // IPD Admission Female- Children<18yrs
};

async function validateAndFixCSV(
  inputFilePath: string,
  outputFilePath: string
) {
  try {
    console.log("Reading CSV file...");
    const csvContent = fs.readFileSync(inputFilePath, "utf-8");
    const lines = csvContent.split("\n");

    console.log(`Processing ${lines.length} lines...`);

    const fixedLines: string[] = [];
    const errors: string[] = [];
    let fixedCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const columns = line.split(",");

      // Skip header and empty lines
      if (i === 0 || line.trim() === "") {
        fixedLines.push(line);
        continue;
      }

      // Check if we have enough columns
      if (columns.length < 14) {
        errors.push(
          `Row ${i + 1}: Insufficient columns (expected 14, got ${
            columns.length
          })`
        );
        continue;
      }

      // Get indicator code (6th column, index 5)
      const indicatorCode = columns[5]?.trim();

      if (!indicatorCode) {
        errors.push(`Row ${i + 1}: Missing indicator code`);
        continue;
      }

      // Check if indicator code needs fixing
      if (INDICATOR_CODE_MAPPINGS[indicatorCode]) {
        const newCode = INDICATOR_CODE_MAPPINGS[indicatorCode];
        columns[5] = newCode;
        fixedCount++;
        console.log(
          `Row ${i + 1}: Fixed indicator code ${indicatorCode} → ${newCode}`
        );
      } else {
        // Check if it's already a valid code
        const existingIndicator = await prisma.indicator.findUnique({
          where: { code: indicatorCode },
        });

        if (!existingIndicator) {
          errors.push(
            `Row ${
              i + 1
            }: Invalid indicator code "${indicatorCode}" - no mapping found`
          );
        }
      }

      fixedLines.push(columns.join(","));
    }

    // Write fixed CSV
    fs.writeFileSync(outputFilePath, fixedLines.join("\n"));

    console.log("\n=== VALIDATION RESULTS ===");
    console.log(`✅ Fixed ${fixedCount} indicator codes`);
    console.log(`❌ ${errors.length} errors found`);
    console.log(`📁 Fixed file saved to: ${outputFilePath}`);

    if (errors.length > 0) {
      console.log("\n=== ERRORS ===");
      errors.slice(0, 20).forEach((error) => console.log(error));
      if (errors.length > 20) {
        console.log(`... and ${errors.length - 20} more errors`);
      }
    }

    return {
      fixedCount,
      errorCount: errors.length,
      errors,
    };
  } catch (error) {
    console.error("Error processing CSV:", error);
    throw error;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(
      "Usage: npx ts-node scripts/fix-indicator-codes.ts <input-csv-file> [output-csv-file]"
    );
    console.log(
      "Example: npx ts-node scripts/fix-indicator-codes.ts data.csv data-fixed.csv"
    );
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile.replace(".csv", "-fixed.csv");

  validateAndFixCSV(inputFile, outputFile)
    .then(() => {
      console.log("\n✅ Processing completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Processing failed:", error);
      process.exit(1);
    });
}

export { validateAndFixCSV, INDICATOR_CODE_MAPPINGS };
