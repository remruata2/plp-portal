import { FormulaCalculator, FormulaConfig } from "../src/lib/calculations/formula-calculator";

// Test configurations for all current formula types
const testConfigs = [
  // 1. BINARY: "100%" or "Yes" (RI Sessions)
  {
    name: "RI Sessions",
    formulaType: "BINARY",
    config: { type: "BINARY" },
    testCases: [
      { submitted: 0, expected: 0, description: "No sessions" },
      { submitted: 1, expected: 100, description: "One session" },
      { submitted: 2, expected: 100, description: "Multiple sessions" },
    ],
  },

  // 2. RANGE: "5 above to 10" (Wellness Sessions)
  {
    name: "Wellness Sessions",
    formulaType: "RANGE",
    config: { type: "RANGE", range: { min: 5, max: 10 } },
    testCases: [
      { submitted: 3, expected: 0, description: "Below minimum" },
      { submitted: 5, expected: 60, description: "At minimum" },
      { submitted: 7.5, expected: 80, description: "Middle of range" },
      { submitted: 10, expected: 100, description: "At maximum" },
      { submitted: 12, expected: 100, description: "Above maximum" },
    ],
  },

  // 3. PERCENTAGE_RANGE: "50%-100%" (ANC Footfall)
  {
    name: "ANC Footfall",
    formulaType: "PERCENTAGE_RANGE",
    config: { type: "PERCENTAGE_RANGE", range: { min: 50, max: 100 } },
    testCases: [
      { submitted: 30, target: 100, expected: 0, description: "Below minimum" },
      { submitted: 50, target: 100, expected: 60, description: "At minimum" },
      { submitted: 75, target: 100, expected: 80, description: "Middle of range" },
      { submitted: 100, target: 100, expected: 100, description: "At maximum" },
      { submitted: 120, target: 100, expected: 100, description: "Above maximum" },
    ],
  },
];

// Test formula parsing
const testFormulaParsing = () => {
  console.log("🧪 Testing Formula Parsing");
  console.log("=" .repeat(50));

  const testFormulas = [
    "upto 3%-5%",
    "5 above to 10",
    "25 above, upto 50",
    "100%",
    "Yes",
    "1",
  ];

  testFormulas.forEach((formula) => {
    const config = FormulaCalculator.parseFormula(formula);
    console.log(`📝 Formula: "${formula}"`);
    console.log(`   → Type: ${config.type}`);
    if (config.range) {
      console.log(`   → Range: ${config.range.min}-${config.range.max}`);
    }
    console.log("");
  });
};

// Test individual formula types
const testFormulaTypes = () => {
  console.log("🧪 Testing Formula Types");
  console.log("=" .repeat(50));

  testConfigs.forEach((config) => {
    console.log(`\n📊 ${config.name} (${config.formulaType}):`);
    console.log("-".repeat(40));

    config.testCases.forEach((testCase) => {
      let result;
      
      if (config.formulaType === "PERCENTAGE_RANGE") {
        // For percentage range, we need target value
        const achievement = (testCase.submitted / testCase.target) * 100;
        result = FormulaCalculator.calculateRemuneration(
          achievement,
          testCase.target,
          1000, // max remuneration
          config.config as FormulaConfig
        );
      } else {
        result = FormulaCalculator.calculateRemuneration(
          testCase.submitted,
          1, // target value
          1000, // max remuneration
          config.config as FormulaConfig
        );
      }

      console.log(`   ${testCase.description}:`);
      console.log(`     Submitted: ${testCase.submitted}${config.formulaType === "PERCENTAGE_RANGE" ? `/${testCase.target}` : ""}`);
      console.log(`     Achievement: ${result.achievement.toFixed(1)}%`);
      console.log(`     Remuneration: ₹${result.remuneration}`);
      console.log(`     Status: ${result.status}`);
      console.log("");
    });
  });
};

// Test linear progression calculations
const testLinearProgression = () => {
  console.log("🧪 Testing Linear Progression");
  console.log("=" .repeat(50));

  // Test RANGE formula linear progression
  console.log("📊 RANGE Formula Linear Progression (5-10 range):");
  const rangeConfig = { type: "RANGE", range: { min: 5, max: 10 } };
  
  for (let i = 5; i <= 10; i += 0.5) {
    const result = FormulaCalculator.calculateRemuneration(
      i,
      1,
      1000,
      rangeConfig as FormulaConfig
    );
    console.log(`   ${i} sessions → ${result.achievement.toFixed(1)}% achievement → ₹${result.remuneration}`);
  }

  console.log("\n📊 PERCENTAGE_RANGE Formula Linear Progression (50%-100% range):");
  const percentageConfig = { type: "PERCENTAGE_RANGE", range: { min: 50, max: 100 } };
  
  for (let i = 50; i <= 100; i += 10) {
    const result = FormulaCalculator.calculateRemuneration(
      i,
      100,
      1000,
      percentageConfig as FormulaConfig
    );
    console.log(`   ${i}% achievement → ${result.achievement.toFixed(1)}% remuneration → ₹${result.remuneration}`);
  }
};

// Test edge cases
const testEdgeCases = () => {
  console.log("\n🧪 Testing Edge Cases");
  console.log("=" .repeat(50));

  // Test zero values
  console.log("📊 Zero Value Handling:");
  const zeroResult = FormulaCalculator.calculateRemuneration(
    0,
    100,
    1000,
    { type: "PERCENTAGE_RANGE", range: { min: 50, max: 100 } } as FormulaConfig
  );
  console.log(`   0% achievement → ${zeroResult.achievement}% remuneration → ₹${zeroResult.remuneration}`);

  // Test negative values
  console.log("\n📊 Negative Value Handling:");
  const negativeResult = FormulaCalculator.calculateRemuneration(
    -10,
    100,
    1000,
    { type: "RANGE", range: { min: 5, max: 10 } } as FormulaConfig
  );
  console.log(`   -10 sessions → ${negativeResult.achievement}% achievement → ₹${negativeResult.remuneration}`);

  // Test very high values
  console.log("\n📊 High Value Handling:");
  const highResult = FormulaCalculator.calculateRemuneration(
    1000,
    100,
    1000,
    { type: "PERCENTAGE_RANGE", range: { min: 50, max: 100 } } as FormulaConfig
  );
  console.log(`   1000% achievement → ${highResult.achievement}% remuneration → ₹${highResult.remuneration}`);
};

// Main test execution
const runAllTests = () => {
  console.log("🚀 PLP Portal - Formula Calculator Tests");
  console.log("=" .repeat(60));
  console.log("Testing current supported formula types: BINARY, RANGE, PERCENTAGE_RANGE");
  console.log("");

  testFormulaParsing();
  testFormulaTypes();
  testLinearProgression();
  testEdgeCases();

  console.log("\n✅ All tests completed!");
  console.log("\n📋 Summary of Current Formula Types:");
  console.log("1. BINARY: All-or-nothing (e.g., RI sessions)");
  console.log("2. RANGE: Linear progression within range (e.g., 5-10 sessions)");
  console.log("3. PERCENTAGE_RANGE: Linear progression within percentage range (e.g., 50%-100%)");
  console.log("\n🎯 All formulas now use linear calculations for fair incentive distribution!");
};

// Run tests
runAllTests();
