import {
  FormulaCalculator,
  FormulaConfig,
} from "../src/lib/calculations/formula-calculator";
import { FormulaType } from "../src/generated/prisma";

// Test configurations for both PERCENTAGE_RANGE and MINIMUM_THRESHOLD
const testConfigs = {
  // PERCENTAGE_RANGE tests (simplified approach)
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

  // MINIMUM_THRESHOLD tests (original approach - kept for future use)
  minimumThreshold_70: {
    type: FormulaType.MINIMUM_THRESHOLD,
    minThreshold: 70,
    calculationFormula: "A", // Direct score for patient satisfaction
  } as FormulaConfig,

  minimumThreshold_80: {
    type: FormulaType.MINIMUM_THRESHOLD,
    minThreshold: 80,
    calculationFormula: "(A/B)*100",
  } as FormulaConfig,
};

function testFormulaTypes() {
  console.log("🧪 Testing Formula Types with MINIMUM_THRESHOLD");
  console.log("===============================================");

  // Test PERCENTAGE_RANGE (70-100%)
  console.log("\n📊 PERCENTAGE_RANGE (70-100%) - Patient Satisfaction:");
  testPercentageRange(3.5, 5, 300, testConfigs.percentageRange_70_100, "PS001");
  testPercentageRange(4.0, 5, 300, testConfigs.percentageRange_70_100, "PS001");
  testPercentageRange(4.5, 5, 300, testConfigs.percentageRange_70_100, "PS001");

  // Test PERCENTAGE_RANGE (80-100%)
  console.log("\n📊 PERCENTAGE_RANGE (80-100%) - Elderly Palliative:");
  testPercentageRange(
    80,
    100,
    300,
    testConfigs.percentageRange_80_100,
    "EP001"
  );
  testPercentageRange(
    90,
    100,
    300,
    testConfigs.percentageRange_80_100,
    "EP001"
  );
  testPercentageRange(
    100,
    100,
    300,
    testConfigs.percentageRange_80_100,
    "EP001"
  );

  // Test MINIMUM_THRESHOLD (70%)
  console.log(
    "\n📊 MINIMUM_THRESHOLD (70%) - Patient Satisfaction (Original):"
  );
  testMinimumThreshold(3.5, 5, 300, testConfigs.minimumThreshold_70, "PS001");
  testMinimumThreshold(4.0, 5, 300, testConfigs.minimumThreshold_70, "PS001");
  testMinimumThreshold(4.5, 5, 300, testConfigs.minimumThreshold_70, "PS001");

  // Test MINIMUM_THRESHOLD (80%)
  console.log("\n📊 MINIMUM_THRESHOLD (80%) - Elderly Palliative (Original):");
  testMinimumThreshold(80, 100, 300, testConfigs.minimumThreshold_80, "EP001");
  testMinimumThreshold(90, 100, 300, testConfigs.minimumThreshold_80, "EP001");
  testMinimumThreshold(100, 100, 300, testConfigs.minimumThreshold_80, "EP001");

  console.log("\n✅ All formula type tests completed!");
  console.log(
    "\n📝 Note: MINIMUM_THRESHOLD is kept for future use but not currently used in indicators"
  );
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
testFormulaTypes();
