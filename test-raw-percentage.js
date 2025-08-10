const { FormulaCalculator } = require('./src/lib/calculations/formula-calculator');

// Test the raw percentage calculation logic
function testRawPercentageCalculation() {
  console.log('Testing Raw Percentage Calculation Logic\n');
  
  // Test case 1: Simple division (A/B)*100
  const numerator = 44.35;
  const denominator = 100;
  const formula = "(A/B)*100";
  
  console.log(`Test Case 1: ${numerator}/${denominator} using formula ${formula}`);
  const result1 = FormulaCalculator.calculateMathematicalFormula(numerator, denominator, formula);
  console.log(`Raw calculation result: ${result1.toFixed(2)}%`);
  console.log(`Expected: 44.35%`);
  console.log(`Match: ${Math.abs(result1 - 44.35) < 0.01 ? '✅' : '❌'}\n`);
  
  // Test case 2: Different values
  const numerator2 = 25;
  const denominator2 = 50;
  const formula2 = "(A/B)*100";
  
  console.log(`Test Case 2: ${numerator2}/${denominator2} using formula ${formula2}`);
  const result2 = FormulaCalculator.calculateMathematicalFormula(numerator2, denominator2, formula2);
  console.log(`Raw calculation result: ${result2.toFixed(2)}%`);
  console.log(`Expected: 50.00%`);
  console.log(`Match: ${Math.abs(result2 - 50.00) < 0.01 ? '✅' : '❌'}\n`);
  
  // Test case 3: Edge case with zero denominator
  const numerator3 = 10;
  const denominator3 = 0;
  const formula3 = "(A/B)*100";
  
  console.log(`Test Case 3: ${numerator3}/${denominator3} using formula ${formula3}`);
  const result3 = FormulaCalculator.calculateMathematicalFormula(numerator3, denominator3, formula3);
  console.log(`Raw calculation result: ${result3.toFixed(2)}%`);
  console.log(`Expected: 0% (due to division by zero)`);
  console.log(`Match: ${result3 === 0 ? '✅' : '❌'}\n`);
  
  // Test case 4: Custom formula
  const numerator4 = 30;
  const denominator4 = 60;
  const formula4 = "(A/B)*100";
  
  console.log(`Test Case 4: ${numerator4}/${denominator4} using formula ${formula4}`);
  const result4 = FormulaCalculator.calculateMathematicalFormula(numerator4, denominator4, formula4);
  console.log(`Raw calculation result: ${result4.toFixed(2)}%`);
  console.log(`Expected: 50.00%`);
  console.log(`Match: ${Math.abs(result4 - 50.00) < 0.01 ? '✅' : '❌'}\n`);
}

// Run the test
testRawPercentageCalculation();
