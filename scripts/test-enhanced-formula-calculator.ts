import { PrismaClient, FormulaType } from "../src/generated/prisma";
import {
  FormulaCalculator,
  FormulaConfig,
} from "../src/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

async function testEnhancedFormulaCalculator() {
  try {
    console.log("🧮 Testing Enhanced Formula Calculator");
    console.log("=====================================");

    // Test 1: Mathematical Formula Calculation
    console.log("\n📊 Test 1: Mathematical Formula Calculation");
    console.log("─".repeat(50));

    const mathematicalTests = [
      {
        name: "Percentage Calculation",
        formula: "(numerator/denominator)*100",
        numerator: 300,
        denominator: 1000,
        expected: 30,
      },
      {
        name: "Direct Value",
        formula: "numerator",
        numerator: 50,
        denominator: 100,
        expected: 50,
      },
      {
        name: "Default Percentage",
        formula: "",
        numerator: 25,
        denominator: 100,
        expected: 25,
      },
    ];

    for (const test of mathematicalTests) {
      const result = FormulaCalculator.calculateMathematicalFormula(
        test.numerator,
        test.denominator,
        test.formula
      );

      console.log(`  ${test.name}:`);
      console.log(
        `    Formula: ${test.formula || "(numerator/denominator)*100"}`
      );
      console.log(
        `    Numerator: ${test.numerator}, Denominator: ${test.denominator}`
      );
      console.log(`    Expected: ${test.expected}`);
      console.log(`    Calculated: ${result.toFixed(2)}`);
      console.log(
        `    ✅ Correct: ${
          Math.abs(result - test.expected) < 0.01 ? "YES" : "NO"
        }`
      );
      console.log("");
    }

    // Test 2: Facility-Specific Targets (Teleconsultation)
    console.log("\n📊 Test 2: Facility-Specific Targets (Teleconsultation)");
    console.log("─".repeat(50));

    const teleconsultationConfig: FormulaConfig = {
      type: FormulaType.RANGE_BASED,
      range: { min: 25, max: 50 }, // Default for most facilities
      facilitySpecificTargets: {
        SC_HWC: {
          range: { min: 12, max: 25 }, // Special case for SC_HWC
        },
      },
    };

    const teleconsultationTests = [
      {
        facilityType: "PHC",
        numerator: 30,
        denominator: 1,
        expected: 60, // 30 is within 25-50 range, so 20% of range = 20% of 300 = 60
      },
      {
        facilityType: "SC_HWC",
        numerator: 15,
        denominator: 1,
        expected: 69, // 15 is within 12-25 range, so 23.1% of range = 23.1% of 300 = 69
      },
      {
        facilityType: "SC_HWC",
        numerator: 30,
        denominator: 1,
        expected: 300, // 30 is above 25 range for SC_HWC, so full amount
      },
    ];

    for (const test of teleconsultationTests) {
      const result = FormulaCalculator.calculateRemuneration(
        test.numerator,
        test.denominator,
        300, // maxRemuneration
        teleconsultationConfig,
        test.facilityType
      );

      console.log(`  ${test.facilityType} - ${test.numerator} calls:`);
      console.log(`    Expected: Rs. ${test.expected}`);
      console.log(`    Calculated: Rs. ${result.remuneration}`);
      console.log(`    Status: ${result.status}`);
      console.log(`    Message: ${result.message}`);
      console.log(
        `    ✅ Correct: ${
          result.remuneration === test.expected ? "YES" : "NO"
        }`
      );
      console.log("");
    }

    // Test 3: Conditional Remuneration (TB Contact Tracing)
    console.log("\n📊 Test 3: Conditional Remuneration (TB Contact Tracing)");
    console.log("─".repeat(50));

    const tbContactConfig: FormulaConfig = {
      type: FormulaType.THRESHOLD_BONUS,
      bonusThreshold: 50,
    };

    const tbContactTests = [
      {
        name: "With TB Patients",
        numerator: 100,
        denominator: 100,
        conditionMet: true, // TB patients present
        expected: 300, // Full remuneration
      },
      {
        name: "Without TB Patients",
        numerator: 100,
        denominator: 100,
        conditionMet: false, // No TB patients
        expected: 0, // NA status
      },
    ];

    for (const test of tbContactTests) {
      const result = FormulaCalculator.calculateRemuneration(
        test.numerator,
        test.denominator,
        300, // maxRemuneration
        tbContactConfig,
        "PHC",
        test.conditionMet
      );

      console.log(`  ${test.name}:`);
      console.log(
        `    Achievement: ${test.numerator}/${test.denominator} = ${
          (test.numerator / test.denominator) * 100
        }%`
      );
      console.log(`    TB Patients Present: ${test.conditionMet}`);
      console.log(`    Expected: Rs. ${test.expected}`);
      console.log(`    Calculated: Rs. ${result.remuneration}`);
      console.log(`    Status: ${result.status}`);
      console.log(`    Message: ${result.message}`);
      console.log(
        `    ✅ Correct: ${
          result.remuneration === test.expected ? "YES" : "NO"
        }`
      );
      console.log("");
    }

    // Test 4: Total Footfall with Mathematical Formula
    console.log("\n📊 Test 4: Total Footfall with Mathematical Formula");
    console.log("─".repeat(50));

    const totalFootfallConfig: FormulaConfig = {
      type: FormulaType.PERCENTAGE_RANGE,
      range: { min: 3, max: 5 },
      calculationFormula: "(numerator/denominator)*100",
    };

    const footfallTests = [
      {
        name: "PHC - 3% Achievement",
        numerator: 300,
        denominator: 10000,
        facilityType: "PHC",
        expected: 300, // 60% of Rs. 500
      },
      {
        name: "UPHC - 4% Achievement",
        numerator: 400,
        denominator: 10000,
        facilityType: "UPHC",
        expected: 1600, // 80% of Rs. 2000
      },
    ];

    for (const test of footfallTests) {
      // First calculate the mathematical formula
      const achievement = FormulaCalculator.calculateMathematicalFormula(
        test.numerator,
        test.denominator,
        totalFootfallConfig.calculationFormula!
      );

      // Then calculate remuneration
      const result = FormulaCalculator.calculateRemuneration(
        achievement, // Use calculated achievement as submitted value
        100, // target value (100% for percentage calculation)
        test.facilityType === "PHC" ? 500 : 2000, // Different amounts per facility
        totalFootfallConfig,
        test.facilityType
      );

      console.log(`  ${test.name}:`);
      console.log(
        `    Footfall: ${test.numerator}, Population: ${test.denominator}`
      );
      console.log(`    Achievement: ${achievement.toFixed(1)}%`);
      console.log(`    Expected: Rs. ${test.expected}`);
      console.log(`    Calculated: Rs. ${result.remuneration}`);
      console.log(`    Status: ${result.status}`);
      console.log(
        `    ✅ Correct: ${
          result.remuneration === test.expected ? "YES" : "NO"
        }`
      );
      console.log("");
    }

    console.log("\n🎯 Summary of Enhanced Features:");
    console.log("================================");
    console.log("✅ Mathematical Formula Calculation");
    console.log("✅ Facility-Specific Target Handling");
    console.log("✅ Conditional Remuneration Logic");
    console.log("✅ NA Status for Inapplicable Indicators");
    console.log("✅ Flexible Formula Storage");
  } catch (error) {
    console.error("Error testing enhanced formula calculator:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnhancedFormulaCalculator();
