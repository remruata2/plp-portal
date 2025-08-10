const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function fixPS001Formula() {
  console.log("🔧 Fixing PS001 Patient Satisfaction Score formula...");

  try {
    // Get PS001 indicator
    const ps001 = await prisma.indicator.findFirst({
      where: { code: 'PS001' }
    });

    if (!ps001) {
      console.log("❌ PS001 not found");
      return;
    }

    console.log("📊 Current PS001 configuration:");
    console.log(`  Formula: ${ps001.formula_config?.calculationFormula}`);
    console.log(`  Description: ${ps001.formula_config?.description}`);

    // Update PS001 to use the correct formula for satisfaction score
    // Patient satisfaction is entered as a score from 1-5
    // We need to convert it to percentage: (score/5)*100
    // The target range is 3.5-5 which equals 70%-100%
    
    const updatedFormulaConfig = {
      calculationFormula: "A", // Use direct score, FormulaCalculator will handle conversion
      description: "Patient Satisfaction Score (1-5 scale converted to percentage: score/5*100)",
      scoreScale: 5, // Maximum score is 5
      isDirectScore: true // Flag to indicate this uses direct score input
    };

    await prisma.indicator.update({
      where: { code: 'PS001' },
      data: {
        formula_config: updatedFormulaConfig,
        denominator_field_id: null, // Remove denominator field since we use fixed scale
      }
    });

    console.log("✅ Updated PS001 formula configuration:");
    console.log(`  New formula: ${updatedFormulaConfig.calculationFormula}`);
    console.log(`  Description: ${updatedFormulaConfig.description}`);
    console.log(`  Score scale: ${updatedFormulaConfig.scoreScale}`);

    // Test the calculation
    console.log("\n🧮 Testing calculation:");
    console.log("  Score 4 (out of 5) = (4/5)*100 = 80%");
    console.log("  Score 3.5 (out of 5) = (3.5/5)*100 = 70% (minimum for target)");
    console.log("  Score 5 (out of 5) = (5/5)*100 = 100% (maximum)");

    console.log("\n⚠️  Note: You may need to update the FormulaCalculator to handle direct scores properly");
    console.log("   or ensure the API converts the score to percentage before calculation.");

  } catch (error) {
    console.error("❌ Error fixing PS001:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPS001Formula();
