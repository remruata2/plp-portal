const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function checkPS001() {
  console.log("🔍 Checking PS001 indicator configuration...");

  try {
    const ps001 = await prisma.indicator.findFirst({
      where: { code: 'PS001' },
      include: {
        denominator_field: true,
        numerator_field: true,
        target_field: true,
      }
    });

    if (!ps001) {
      console.log("❌ PS001 not found");
      return;
    }

    console.log(`\n📊 PS001 Configuration:`);
    console.log(`Name: ${ps001.name}`);
    console.log(`Target Type: ${ps001.target_type}`);
    console.log(`Target Value: ${ps001.target_value}`);
    console.log(`Target Formula: ${ps001.target_formula}`);
    console.log(`Numerator field: ${ps001.numerator_field?.code} (${ps001.numerator_field?.name})`);
    console.log(`Denominator field: ${ps001.denominator_field?.code} (${ps001.denominator_field?.name})`);
    
    if (ps001.formula_config) {
      console.log(`Formula config:`, JSON.stringify(ps001.formula_config, null, 2));
    }

    // Check field values for PS001
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        field_id: { in: [ps001.numerator_field_id, ps001.denominator_field_id].filter(id => id) }
      },
      include: { field: true, facility: true },
      take: 5
    });

    console.log(`\n📈 Sample field values:`);
    fieldValues.forEach(fv => {
      console.log(`  ${fv.facility?.name}: ${fv.field.code} = ${fv.numeric_value || fv.string_value || 'null'}`);
    });

    // Test calculation manually
    const numeratorValue = fieldValues.find(fv => fv.field_id === ps001.numerator_field_id)?.numeric_value || 0;
    const denominatorValue = fieldValues.find(fv => fv.field_id === ps001.denominator_field_id)?.numeric_value || 1;
    
    console.log(`\n🧮 Manual calculation test:`);
    console.log(`Numerator: ${numeratorValue}`);
    console.log(`Denominator: ${denominatorValue}`);
    console.log(`Current calculation: (${numeratorValue}/${denominatorValue})*100 = ${(numeratorValue/denominatorValue)*100}%`);
    console.log(`Correct calculation: (${numeratorValue}/5)*100 = ${(numeratorValue/5)*100}%`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPS001();
