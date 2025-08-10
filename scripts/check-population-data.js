const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function checkPopulationData() {
  console.log("🔍 Checking population field values in database...");

  try {
    // First, find population-related fields
    const populationFields = await prisma.field.findMany({
      where: {
        OR: [
          { code: { contains: "population" } },
          { code: "total_population_30_plus" },
          { code: "total_female_population_30_plus" },
        ],
      },
    });

    console.log(`\n📊 Found ${populationFields.length} population fields:`);
    populationFields.forEach(field => {
      console.log(`  - ${field.code}: ${field.name}`);
    });

    // Get field values for population fields
    const populationFieldIds = populationFields.map(f => f.id);
    
    if (populationFieldIds.length > 0) {
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          field_id: { in: populationFieldIds },
        },
        include: {
          field: true,
          facility: {
            include: {
              facility_type: true
            }
          }
        },
        orderBy: [
          { facility_id: 'asc' },
          { field_id: 'asc' }
        ]
      });

      console.log(`\n📈 Found ${fieldValues.length} population field values:`);
      
      if (fieldValues.length === 0) {
        console.log("❌ NO POPULATION DATA FOUND! This explains the denominator = 1 fallback issue.");
      } else {
        const grouped = {};
        fieldValues.forEach(fv => {
          const facilityName = fv.facility?.name || 'Unknown';
          if (!grouped[facilityName]) {
            grouped[facilityName] = {};
          }
          grouped[facilityName][fv.field.code] = fv.numeric_value || fv.string_value || 'null';
        });

        Object.keys(grouped).forEach(facilityName => {
          console.log(`\n  ${facilityName}:`);
          Object.keys(grouped[facilityName]).forEach(fieldCode => {
            console.log(`    - ${fieldCode}: ${grouped[facilityName][fieldCode]}`);
          });
        });
      }
    }

    // Also check if there are any facilities at all
    const facilities = await prisma.facility.findMany({
      include: {
        facility_type: true
      }
    });
    
    console.log(`\n🏥 Found ${facilities.length} facilities:`);
    facilities.forEach(facility => {
      console.log(`  - ${facility.name} (${facility.facility_type.name})`);
    });

    // Check indicators that use population fields as denominators
    const populationBasedIndicators = await prisma.indicator.findMany({
      where: {
        denominator_field_id: { in: populationFieldIds },
      },
      include: {
        denominator_field: true,
      },
    });

    console.log(`\n📊 Found ${populationBasedIndicators.length} indicators using population denominators:`);
    populationBasedIndicators.forEach(indicator => {
      console.log(`  - ${indicator.code}: ${indicator.name} (uses ${indicator.denominator_field?.code})`);
    });

  } catch (error) {
    console.error("❌ Error checking population data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPopulationData();
