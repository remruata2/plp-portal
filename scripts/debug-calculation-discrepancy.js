const { PrismaClient } = require("../src/generated/prisma");
const { FormulaCalculator } = require("../src/lib/calculations/formula-calculator");

const prisma = new PrismaClient();

async function debugCalculationDiscrepancy() {
  console.log("🔍 Debugging calculation discrepancy between API and modal...");

  try {
    // Focus on OC001 which shows the discrepancy
    const indicator = await prisma.indicator.findFirst({
      where: { code: 'OC001' },
      include: {
        denominator_field: true,
        numerator_field: true,
      }
    });

    if (!indicator) {
      console.log("❌ OC001 indicator not found");
      return;
    }

    console.log(`\n📊 Indicator: ${indicator.code} - ${indicator.name}`);
    console.log(`Formula: ${indicator.formula_config?.calculationFormula}`);
    console.log(`Denominator field: ${indicator.denominator_field?.code}`);

    // Get field values for Zuangtui SC (the one with data)
    const facilityValues = await prisma.fieldValue.findMany({
      where: {
        facility: { name: 'Zuangtui SC' },
        field_id: { in: [indicator.numerator_field_id, indicator.denominator_field_id].filter(id => id) }
      },
      include: { field: true, facility: true }
    });

    console.log('\n📈 Field Values:');
    let numeratorValue = 0;
    let denominatorValue = 0;
    
    facilityValues.forEach(fv => {
      const value = Number(fv.numeric_value || fv.string_value || 0);
      console.log(`  ${fv.field.code}: ${value}`);
      
      if (fv.field_id === indicator.numerator_field_id) {
        numeratorValue = value;
      }
      if (fv.field_id === indicator.denominator_field_id) {
        denominatorValue = value;
      }
    });

    // If no data, use test values from screenshot
    if (denominatorValue === 0) {
      console.log('\n⚠️  No field values found, using test values from screenshot:');
      numeratorValue = 79; // Oral Cancer Screened from screenshot
      denominatorValue = 4343; // Population 30+ from screenshot
    }

    console.log(`\n🧮 Calculations:`);
    console.log(`Numerator (A): ${numeratorValue}`);
    console.log(`Denominator (B): ${denominatorValue}`);

    // API calculation (what should happen)
    const formula = indicator.formula_config?.calculationFormula || "(A/B)*100";
    console.log(`\nFormula: ${formula}`);

    const apiCalculation = FormulaCalculator.calculateMathematicalFormula(
      numeratorValue,
      denominatorValue, 
      formula
    );
    console.log(`API Result: ${apiCalculation.toFixed(1)}%`);

    // Manual calculation for verification
    const manualCalc = (numeratorValue / (denominatorValue / 60)) * 100;
    console.log(`Manual calc: ${numeratorValue} ÷ (${denominatorValue} ÷ 60) × 100 = ${manualCalc.toFixed(1)}%`);

    // Modal's "smart" logic (the problematic one)
    const isLikelyDivided = denominatorValue < 100;
    console.log(`\n🎭 Modal Logic:`);
    console.log(`denominatorValue < 100? ${isLikelyDivided}`);
    
    if (isLikelyDivided) {
      const modalCalc = (numeratorValue / denominatorValue) * 100;
      console.log(`Modal calc (thinks already divided): ${numeratorValue} ÷ ${denominatorValue} × 100 = ${modalCalc.toFixed(1)}%`);
    } else {
      const modalCalc = (numeratorValue / (denominatorValue / 60)) * 100;
      console.log(`Modal calc (raw denominator): ${numeratorValue} ÷ (${denominatorValue} ÷ 60) × 100 = ${modalCalc.toFixed(1)}%`);
    }

    // The problem: what if the API passes raw denominator but modal thinks it's divided?
    console.log(`\n🚨 Potential Issue:`);
    console.log(`If API passes raw denominator (${denominatorValue}) to modal:`);
    console.log(`Modal sees ${denominatorValue} > 100, so uses: ${numeratorValue} ÷ (${denominatorValue} ÷ 60) = ${manualCalc.toFixed(1)}%`);
    console.log(`But if API already calculated percentage and modal recalculates wrongly...`);

  } catch (error) {
    console.error("❌ Error debugging calculation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCalculationDiscrepancy();
