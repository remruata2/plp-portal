import { FormulaCalculator, FormulaConfig } from "../src/lib/calculations/formula-calculator";
import { TargetType } from "../src/generated/prisma";

// Test configurations for simplified formula system
const testConfigs = {
  // PERCENTAGE_RANGE tests (all percentage-based calculations)
  percentageRange_3_5: {
    type: TargetType.PERCENTAGE_RANGE,
    range: { min: 3, max: 5 },
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  percentageRange_50_100: {
    type: TargetType.PERCENTAGE_RANGE,
    range: { min: 50, max: 100 },
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  percentageRange_70_100: {
    type: TargetType.PERCENTAGE_RANGE,
    range: { min: 70, max: 100 },
    calculationFormula: "A", // Direct score for patient satisfaction
  } as FormulaConfig,

  percentageRange_80_100: {
    type: TargetType.PERCENTAGE_RANGE,
    range: { min: 80, max: 100 },
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  // RANGE tests (direct counts)
  rangeBased_5_10: {
    type: TargetType.RANGE,
    range: { min: 5, max: 10 },
    calculationFormula: "A",
  } as FormulaConfig,

  rangeBased_25_50: {
    type: TargetType.RANGE,
    range: { min: 25, max: 50 },
    calculationFormula: "A",
  } as FormulaConfig,

  // BINARY tests (all-or-nothing)
  binary_100: {
    type: TargetType.BINARY,
    targetValue: 100,
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,


};

function testSimplifiedFormulaSystem() {
  console.log("🧪 Testing Simplified Formula System");
  console.log("====================================");
  console.log("✅ Active Types: PERCENTAGE_RANGE, RANGE, BINARY");

  // Test PERCENTAGE_RANGE (3-5%)
  console.log("\n📊 PERCENTAGE_RANGE (3-5%) - Total Footfall:");
  testPercentageRange(3, 100, 500, testConfigs.percentageRange_3_5, "TF001_PHC");
  testPercentageRange(4, 100, 500, testConfigs.percentageRange_3_5, "TF001_PHC");
  testPercentageRange(5, 100, 500, testConfigs.percentageRange_3_5, "TF001_PHC");

  // Test PERCENTAGE_RANGE (50-100%) - Former PERCENTAGE_CAP
  console.log("\n📊 PERCENTAGE_RANGE (50-100%) - ANC Footfall (Former PERCENTAGE_CAP):");
  testPercentageRange(50, 100, 300, testConfigs.percentageRange_50_100, "AF001_PHC");
  testPercentageRange(75, 100, 300, testConfigs.percentageRange_50_100, "AF001_PHC");
  testPercentageRange(100, 100, 300, testConfigs.percentageRange_50_100, "AF001_PHC");

  // Test PERCENTAGE_RANGE (70-100%)
  console.log("\n📊 PERCENTAGE_RANGE (70-100%) - Patient Satisfaction:");
  testPercentageRange(3.5, 5, 300, testConfigs.percentageRange_70_100, "PS001");
  testPercentageRange(4.0, 5, 300, testConfigs.percentageRange_70_100, "PS001");
  testPercentageRange(4.5, 5, 300, testConfigs.percentageRange_70_100, "PS001");

  // Test PERCENTAGE_RANGE (80-100%)
  console.log("\n📊 PERCENTAGE_RANGE (80-100%) - Elderly Palliative:");
  testPercentageRange(80, 100, 300, testConfigs.percentageRange_80_100, "EP001");
  testPercentageRange(90, 100, 300, testConfigs.percentageRange_80_100, "EP001");
  testPercentageRange(100, 100, 300, testConfigs.percentageRange_80_100, "EP001");

  // Test RANGE (5-10)
  console.log("\n📊 RANGE (5-10) - Wellness Sessions:");
  testRangeBased(5, 500, testConfigs.rangeBased_5_10, "WS001");
  testRangeBased(7, 500, testConfigs.rangeBased_5_10, "WS001");
  testRangeBased(10, 500, testConfigs.rangeBased_5_10, "WS001");

  // Test RANGE (25-50)
  console.log("\n📊 RANGE (25-50) - Teleconsultation:");
  testRangeBased(25, 1000, testConfigs.rangeBased_25_50, "TC001");
  testRangeBased(35, 1000, testConfigs.rangeBased_25_50, "TC001");
  testRangeBased(50, 1000, testConfigs.rangeBased_25_50, "TC001");

  // Test BINARY (100%)
  console.log("\n📊 BINARY (100%) - CBAC Forms:");
  testBinary(100, 100, 500, testConfigs.binary_100, "CB001");
  testBinary(90, 100, 500, testConfigs.binary_100, "CB001");
  testBinary(110, 100, 500, testConfigs.binary_100, "CB001");



  console.log("\n✅ Simplified formula system test completed!");
  console.log("\n📊 Summary:");
  console.log("  - PERCENTAGE_RANGE: 10 indicators (all percentage-based)");
  console.log("  - RANGE: 2 indicators (direct counts)");
  console.log("  - BINARY: 10 indicators (all-or-nothing)");
}

function testPercentageRange(
  numerator: number,
  denominator: number,
  maxRemuneration: number,
  config: FormulaConfig,
  indicatorCode: string
) {
  const achievement = FormulaCalculator.calculateMathematicalFormula(
    numerator,
    denominator,
    config.calculationFormula || "(A/B)*100"
  );
  
  const result = FormulaCalculator.calculateRemuneration(
    numerator,
    denominator,
    maxRemuneration,
    config
  );

  console.log(
    `  ${indicatorCode}: ${numerator}/${denominator} = ${achievement.toFixed(
      1
    )}% → Rs. ${result.remuneration} (${result.status})`
  );
}

function testRangeBased(
  submittedValue: number,
  maxRemuneration: number,
  config: FormulaConfig,
  indicatorCode: string
) {
  const result = FormulaCalculator.calculateRemuneration(
    submittedValue,
    0, // Not used for range-based
    maxRemuneration,
    config
  );

  console.log(
    `  ${indicatorCode}: ${submittedValue} → Rs. ${result.remuneration} (${result.status})`
  );
}

function testBinary(
  numerator: number,
  denominator: number,
  maxRemuneration: number,
  config: FormulaConfig,
  indicatorCode: string
) {
  const achievement = FormulaCalculator.calculateMathematicalFormula(
    numerator,
    denominator,
    config.calculationFormula || "(A/B)*100"
  );
  
  const result = FormulaCalculator.calculateRemuneration(
    numerator,
    denominator,
    maxRemuneration,
    config
  );

  console.log(
    `  ${indicatorCode}: ${numerator}/${denominator} = ${achievement.toFixed(
      1
    )}% → Rs. ${result.remuneration} (${result.status})`
  );
}

function testMinimumThreshold(
  numerator: number,
  denominator: number,
  maxRemuneration: number,
  config: FormulaConfig,
  indicatorCode: string
) {
  const achievement = FormulaCalculator.calculateMathematicalFormula(
    numerator,
    denominator,
    config.calculationFormula || "(A/B)*100"
  );
  
  const result = FormulaCalculator.calculateRemuneration(
    numerator,
    denominator,
    maxRemuneration,
    config
  );

  console.log(
    `  ${indicatorCode}: ${numerator}/${denominator} = ${achievement.toFixed(
      1
    )}% → Rs. ${result.remuneration} (${result.status})`
  );
}

// Run tests
testSimplifiedFormulaSystem(); 