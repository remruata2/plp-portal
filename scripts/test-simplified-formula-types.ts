import { FormulaCalculator, FormulaConfig } from "../src/lib/calculations/formula-calculator";
import { FormulaType } from "../src/generated/prisma";

// Test configurations for simplified formula types
const testConfigs = {
  // PERCENTAGE_RANGE tests
  percentageRange_3_5: {
    type: FormulaType.PERCENTAGE_RANGE,
    range: { min: 3, max: 5 },
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  percentageRange_50_100: {
    type: FormulaType.PERCENTAGE_RANGE,
    range: { min: 50, max: 100 },
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  percentageRange_70_100: {
    type: FormulaType.PERCENTAGE_RANGE,
    range: { min: 70, max: 100 },
    calculationFormula: "A", // Direct score for patient satisfaction
  } as FormulaConfig,

  percentageRange_80_100: {
    type: FormulaType.PERCENTAGE_RANGE,
    range: { min: 80, max: 100 },
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  // RANGE_BASED tests
  rangeBased_5_10: {
    type: FormulaType.RANGE_BASED,
    range: { min: 5, max: 10 },
    calculationFormula: "A",
  } as FormulaConfig,

  rangeBased_25_50: {
    type: FormulaType.RANGE_BASED,
    range: { min: 25, max: 50 },
    calculationFormula: "A",
  } as FormulaConfig,

  // PERCENTAGE_CAP tests
  percentageCap_50: {
    type: FormulaType.PERCENTAGE_CAP,
    percentageCap: 50,
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,

  // BINARY tests
  binary_100: {
    type: FormulaType.BINARY,
    targetValue: 100,
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,
};

function testFormulaTypes() {
  console.log("🧪 Testing Simplified Formula Types");
  console.log("===================================");

  // Test PERCENTAGE_RANGE (3-5%)
  console.log("\n📊 PERCENTAGE_RANGE (3-5%) - Total Footfall:");
  testPercentageRange(3, 100, 500, testConfigs.percentageRange_3_5, "TF001");
  testPercentageRange(4, 100, 500, testConfigs.percentageRange_3_5, "TF001");
  testPercentageRange(5, 100, 500, testConfigs.percentageRange_3_5, "TF001");
  testPercentageRange(6, 100, 500, testConfigs.percentageRange_3_5, "TF001");

  // Test PERCENTAGE_RANGE (50-100%)
  console.log("\n📊 PERCENTAGE_RANGE (50-100%) - TB Contact Tracing:");
  testPercentageRange(50, 100, 300, testConfigs.percentageRange_50_100, "CT001");
  testPercentageRange(75, 100, 300, testConfigs.percentageRange_50_100, "CT001");
  testPercentageRange(100, 100, 300, testConfigs.percentageRange_50_100, "CT001");

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

  // Test RANGE_BASED (5-10)
  console.log("\n📊 RANGE_BASED (5-10) - Wellness Sessions:");
  testRangeBased(5, 500, testConfigs.rangeBased_5_10, "WS001");
  testRangeBased(7, 500, testConfigs.rangeBased_5_10, "WS001");
  testRangeBased(10, 500, testConfigs.rangeBased_5_10, "WS001");
  testRangeBased(12, 500, testConfigs.rangeBased_5_10, "WS001");

  // Test RANGE_BASED (25-50)
  console.log("\n📊 RANGE_BASED (25-50) - Teleconsultation:");
  testRangeBased(25, 1000, testConfigs.rangeBased_25_50, "TC001");
  testRangeBased(35, 1000, testConfigs.rangeBased_25_50, "TC001");
  testRangeBased(50, 1000, testConfigs.rangeBased_25_50, "TC001");
  testRangeBased(60, 1000, testConfigs.rangeBased_25_50, "TC001");

  // Test PERCENTAGE_CAP (50%)
  console.log("\n📊 PERCENTAGE_CAP (50%) - ANC Footfall:");
  testPercentageCap(50, 100, 300, testConfigs.percentageCap_50, "AF001");
  testPercentageCap(75, 100, 300, testConfigs.percentageCap_50, "AF001");
  testPercentageCap(100, 100, 300, testConfigs.percentageCap_50, "AF001");

  // Test BINARY (100%)
  console.log("\n📊 BINARY (100%) - CBAC Forms:");
  testBinary(100, 100, 500, testConfigs.binary_100, "CB001");
  testBinary(90, 100, 500, testConfigs.binary_100, "CB001");
  testBinary(110, 100, 500, testConfigs.binary_100, "CB001");

  console.log("\n✅ All formula type tests completed!");
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
    `  ${indicatorCode}: ${numerator}/${denominator} = ${achievement.toFixed(1)}% → Rs. ${result.remuneration} (${result.status})`
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

function testPercentageCap(
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
    `  ${indicatorCode}: ${numerator}/${denominator} = ${achievement.toFixed(1)}% → Rs. ${result.remuneration} (${result.status})`
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
    `  ${indicatorCode}: ${numerator}/${denominator} = ${achievement.toFixed(1)}% → Rs. ${result.remuneration} (${result.status})`
  );
}

// Run tests
testFormulaTypes(); 