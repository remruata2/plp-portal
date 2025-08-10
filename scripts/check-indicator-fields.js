const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function checkIndicatorFields() {
  console.log("🔍 Checking specific indicator field mappings...");

  try {
    // Check the problematic indicators
    const problematicIndicators = ['CB001', 'HS001', 'DS001', 'OC001', 'BC001'];
    
    const indicators = await prisma.indicator.findMany({
      where: {
        code: { in: problematicIndicators },
      },
      include: {
        denominator_field: true,
        numerator_field: true,
      },
    });

    console.log(`\n📊 Found ${indicators.length} problematic indicators:`);
    indicators.forEach(indicator => {
      console.log(`\n${indicator.code}: ${indicator.name}`);
      console.log(`  Numerator field: ${indicator.numerator_field?.code} (${indicator.numerator_field?.name})`);
      console.log(`  Denominator field: ${indicator.denominator_field?.code} (${indicator.denominator_field?.name})`);
      console.log(`  Formula: ${indicator.formula_config?.calculationFormula || 'N/A'}`);
    });

    // Now check what field values exist for these denominator fields
    const denominatorFieldIds = indicators
      .map(i => i.denominator_field_id)
      .filter(id => id !== null);

    if (denominatorFieldIds.length > 0) {
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          field_id: { in: denominatorFieldIds },
        },
        include: {
          field: true,
          facility: true,
        },
        take: 10, // Just show first 10 for sample
      });

      console.log(`\n📈 Sample field values for these denominator fields (${fieldValues.length} found):`);
      fieldValues.forEach(fv => {
        console.log(`  ${fv.facility?.name}: ${fv.field.code} = ${fv.numeric_value || fv.string_value || 'null'}`);
      });
    }

    // Check if there's a field mismatch - indicators expect 'total_population_30_plus' but data is in 'population_30_plus'
    const expectedField = await prisma.field.findFirst({
      where: { code: 'total_population_30_plus' }
    });
    
    const actualField = await prisma.field.findFirst({
      where: { code: 'population_30_plus' }
    });

    console.log(`\n🔧 Field existence check:`);
    console.log(`  'total_population_30_plus' field exists: ${!!expectedField} (ID: ${expectedField?.id})`);
    console.log(`  'population_30_plus' field exists: ${!!actualField} (ID: ${actualField?.id})`);

    if (actualField) {
      const actualFieldValues = await prisma.fieldValue.findMany({
        where: { field_id: actualField.id },
        take: 5,
        include: { facility: true }
      });
      
      console.log(`\n  'population_30_plus' has ${actualFieldValues.length} values:`);
      actualFieldValues.forEach(fv => {
        console.log(`    ${fv.facility?.name}: ${fv.numeric_value}`);
      });
    }

  } catch (error) {
    console.error("❌ Error checking indicator fields:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkIndicatorFields();
