import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

/**
 * Set up default population values for all facilities
 * This fixes the issue where population-based indicators fall back to denominator = 1
 * causing incorrect percentage calculations
 */
async function setupPopulationDefaults() {
  console.log("🏥 Setting up population defaults for facilities...");

  try {
    // Get all facilities
    const facilities = await prisma.facility.findMany({
      include: {
        facility_type: true,
      },
    });

    // Get all population-related fields
    const populationFields = await prisma.field.findMany({
      where: {
        OR: [
          { code: { contains: "population" } },
          { code: "total_population_30_plus" },
          { code: "total_female_population_30_plus" },
        ],
      },
    });

    console.log(`Found ${facilities.length} facilities and ${populationFields.length} population fields`);

    // Default population values by facility type
    const defaultPopulationValues = {
      PHC: {
        total_population_30_plus: 25000,
        total_female_population_30_plus: 12500,
      },
      SC_HWC: {
        total_population_30_plus: 3000,
        total_female_population_30_plus: 1500,
      },
      A_HWC: {
        total_population_30_plus: 3000,
        total_female_population_30_plus: 1500,
      },
      U_HWC: {
        total_population_30_plus: 10000,
        total_female_population_30_plus: 5000,
      },
      UPHC: {
        total_population_30_plus: 50000,
        total_female_population_30_plus: 25000,
      },
    };

    let createdCount = 0;
    let skippedCount = 0;

    for (const facility of facilities) {
      const facilityTypeName = facility.facility_type.name;
      const defaultValues = defaultPopulationValues[facilityTypeName as keyof typeof defaultPopulationValues];

      if (!defaultValues) {
        console.warn(`No default values defined for facility type: ${facilityTypeName}`);
        continue;
      }

      for (const field of populationFields) {
        // Check if default already exists
        const existingDefault = await prisma.facilityFieldDefaults.findFirst({
          where: {
            facility_id: facility.id,
            field_id: field.id,
          },
        });

        if (existingDefault) {
          skippedCount++;
          continue;
        }

        // Get the appropriate default value for this field
        let defaultValue = null;
        if (field.code === "total_population_30_plus") {
          defaultValue = defaultValues.total_population_30_plus;
        } else if (field.code === "total_female_population_30_plus") {
          defaultValue = defaultValues.total_female_population_30_plus;
        } else if (field.code.includes("population")) {
          // For other population fields, use the general population value
          defaultValue = defaultValues.total_population_30_plus;
        }

        if (defaultValue) {
          await prisma.facilityFieldDefaults.create({
            data: {
              facility_id: facility.id,
              field_id: field.id,
              numeric_value: defaultValue,
              is_active: true,
            },
          });

          createdCount++;
          console.log(
            `Created default for ${facility.name} (${facilityTypeName}): ${field.code} = ${defaultValue}`
          );
        }
      }
    }

    console.log(`✅ Population defaults setup complete:`);
    console.log(`  - Created: ${createdCount} defaults`);
    console.log(`  - Skipped (already exists): ${skippedCount}`);

    // Verify the setup by checking indicators that would be affected
    const affectedIndicators = await prisma.indicator.findMany({
      where: {
        denominator_field: {
          code: {
            in: ["total_population_30_plus", "total_female_population_30_plus"],
          },
        },
      },
      include: {
        denominator_field: true,
      },
    });

    console.log(`\n📊 Affected indicators (${affectedIndicators.length}):`);
    affectedIndicators.forEach((indicator) => {
      console.log(`  - ${indicator.code}: ${indicator.name} (uses ${indicator.denominator_field?.code})`);
    });

  } catch (error) {
    console.error("❌ Error setting up population defaults:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupPopulationDefaults();
