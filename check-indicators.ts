import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function checkIndicators() {
  try {
    console.log("🔍 Checking indicators with formula_config...");
    
    const indicators = await prisma.indicator.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        target_type: true,
        formula_config: true,
        target_value: true,
        target_formula: true,
      },
      orderBy: {
        code: 'asc'
      }
    });

    console.log(`\n📊 Found ${indicators.length} indicators:`);
    console.log("=" .repeat(80));

    indicators.forEach((indicator, index) => {
      console.log(`\n${index + 1}. ${indicator.code} - ${indicator.name}`);
      console.log(`   Target Type: ${indicator.target_type}`);
      console.log(`   Target Value: ${indicator.target_value || 'Not set'}`);
      console.log(`   Target Formula: ${indicator.target_formula || 'Not set'}`);
      
      if (indicator.formula_config) {
        const config = indicator.formula_config as any;
        console.log(`   ✅ Formula Config:`);
        console.log(`      - Calculation Formula: ${config.calculationFormula || 'Not set'}`);
        console.log(`      - Description: ${config.description || 'Not set'}`);
        if (config.range) {
          console.log(`      - Range: ${config.range.min}-${config.range.max}`);
        }
      } else {
        console.log(`   ❌ No Formula Config`);
      }
    });

    // Count indicators with formula_config
    const withFormulaConfig = indicators.filter(i => i.formula_config).length;
    const withoutFormulaConfig = indicators.filter(i => !i.formula_config).length;
    
    console.log("\n" + "=" .repeat(80));
    console.log(`📈 Summary:`);
    console.log(`   - Total Indicators: ${indicators.length}`);
    console.log(`   - With Formula Config: ${withFormulaConfig}`);
    console.log(`   - Without Formula Config: ${withoutFormulaConfig}`);
    console.log(`   - Coverage: ${((withFormulaConfig / indicators.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error("❌ Error checking indicators:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkIndicators();
