const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function fixIndicatorFieldMappings() {
  console.log("🔧 Fixing indicator denominator field mappings...");

  try {
    // Get the correct field IDs that actually exist
    const populationFields = await prisma.field.findMany({
      where: {
        code: { in: ['population_30_plus', 'population_30_plus_female'] }
      }
    });

    const fieldMap = {};
    populationFields.forEach(field => {
      fieldMap[field.code] = field.id;
    });

    console.log('Available population fields:', fieldMap);

    // Fix the indicators that have undefined denominator fields
    const indicatorFixMap = [
      {
        code: 'CB001',
        correctDenominatorFieldCode: 'population_30_plus',
        description: 'CBAC filled - uses 30+ population'
      },
      {
        code: 'HS001', 
        correctDenominatorFieldCode: 'population_30_plus',
        description: 'HTN screened - uses 30+ population'
      },
      {
        code: 'DS001',
        correctDenominatorFieldCode: 'population_30_plus', 
        description: 'DM screened - uses 30+ population'
      },
      {
        code: 'OC001',
        correctDenominatorFieldCode: 'population_30_plus',
        description: 'Oral cancer screened - uses 30+ population'
      },
      {
        code: 'BC001',
        correctDenominatorFieldCode: 'population_30_plus_female',
        description: 'Breast & cervical cancer screened - uses 30+ female population'
      }
    ];

    let fixedCount = 0;
    let errorCount = 0;

    for (const fix of indicatorFixMap) {
      try {
        const correctFieldId = fieldMap[fix.correctDenominatorFieldCode];
        
        if (!correctFieldId) {
          console.error(`❌ Field '${fix.correctDenominatorFieldCode}' not found for ${fix.code}`);
          errorCount++;
          continue;
        }

        const updateResult = await prisma.indicator.update({
          where: { code: fix.code },
          data: { 
            denominator_field_id: correctFieldId 
          }
        });

        console.log(`✅ Fixed ${fix.code}: ${fix.description} -> field ID ${correctFieldId}`);
        fixedCount++;
        
      } catch (error) {
        console.error(`❌ Error fixing ${fix.code}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Fix Summary:`);
    console.log(`  Fixed: ${fixedCount} indicators`);
    console.log(`  Errors: ${errorCount} indicators`);

    // Verify the fixes
    console.log(`\n🔍 Verifying fixes...`);
    const verifyIndicators = await prisma.indicator.findMany({
      where: {
        code: { in: indicatorFixMap.map(f => f.code) }
      },
      include: {
        denominator_field: true
      }
    });

    verifyIndicators.forEach(indicator => {
      console.log(`  ${indicator.code}: ${indicator.denominator_field?.code || 'STILL NULL'} (ID: ${indicator.denominator_field_id})`);
    });

  } catch (error) {
    console.error("❌ Error fixing indicator field mappings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixIndicatorFieldMappings();
