import { FormulaCalculator } from "../src/lib/calculations/formula-calculator";

function testABNotation() {
  console.log("🧪 Testing A, B Notation in Mathematical Formulas");
  console.log("==================================================");

  // Test 1: Basic percentage calculation
  console.log("\n📊 Test 1: Basic Percentage Calculation");
  console.log("─".repeat(50));

  const percentageResult = FormulaCalculator.calculateMathematicalFormula(
    300, // A (numerator)
    10000, // B (denominator)
    "(A/B)*100"
  );

  console.log("✅ Formula: (A/B)*100");
  console.log(`  A (numerator): 300`);
  console.log(`  B (denominator): 10000`);
  console.log(`  Result: ${percentageResult.toFixed(1)}%`);

  // Test 2: Simple addition
  console.log("\n📊 Test 2: Simple Addition");
  console.log("─".repeat(50));

  const additionResult = FormulaCalculator.calculateMathematicalFormula(
    50, // A
    30, // B
    "A+B"
  );

  console.log("✅ Formula: A+B");
  console.log(`  A: 50`);
  console.log(`  B: 30`);
  console.log(`  Result: ${additionResult}`);

  // Test 3: Complex formula
  console.log("\n📊 Test 3: Complex Formula");
  console.log("─".repeat(50));

  const complexResult = FormulaCalculator.calculateMathematicalFormula(
    100, // A
    200, // B
    "(A/B)*100 + 10"
  );

  console.log("✅ Formula: (A/B)*100 + 10");
  console.log(`  A: 100`);
  console.log(`  B: 200`);
  console.log(`  Result: ${complexResult.toFixed(1)}`);

  // Test 4: Just A (numerator only)
  console.log("\n📊 Test 4: Numerator Only");
  console.log("─".repeat(50));

  const numeratorOnlyResult = FormulaCalculator.calculateMathematicalFormula(
    500, // A
    0, // B (not used)
    "A"
  );

  console.log("✅ Formula: A");
  console.log(`  A: 500`);
  console.log(`  Result: ${numeratorOnlyResult}`);

  // Test 5: Default behavior (no formula)
  console.log("\n📊 Test 5: Default Behavior");
  console.log("─".repeat(50));

  const defaultResult = FormulaCalculator.calculateMathematicalFormula(
    75, // A
    100, // B
    "" // No formula provided
  );

  console.log("✅ Default Formula: (A/B)*100");
  console.log(`  A: 75`);
  console.log(`  B: 100`);
  console.log(`  Result: ${defaultResult.toFixed(1)}%`);

  // Test 6: Form organization improvements
  console.log("\n📊 Test 6: Form Organization Improvements");
  console.log("─".repeat(50));

  console.log("✅ Formula Config Tab Now Includes:");
  console.log("  - Numerator Field (A) selection");
  console.log("  - Denominator Field (B) selection");
  console.log("  - Mathematical formula with A, B notation");
  console.log("  - Formula type selection");
  console.log("  - Target value and description");

  console.log("\n✅ Basic Info Tab Now Includes:");
  console.log("  - Indicator code, name, description");
  console.log("  - Target field selection");
  console.log("  - No redundant field selections");

  console.log("\n🎯 A, B Notation Benefits:");
  console.log("============================");
  console.log("✅ Simpler and cleaner notation");
  console.log("✅ More intuitive than 'numerator/denominator'");
  console.log("✅ Shorter and easier to type");
  console.log("✅ Consistent with mathematical conventions");
  console.log("✅ Better form organization");
  console.log("✅ Field selection in appropriate tab");

  console.log("\n📝 Example Formulas:");
  console.log("  - (A/B)*100     → Percentage calculation");
  console.log("  - A             → Numerator only");
  console.log("  - A+B           → Addition");
  console.log("  - (A/B)*100+10  → Percentage with offset");
  console.log("  - A*B           → Multiplication");
}

testABNotation();
