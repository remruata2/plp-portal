import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function addMissingRemuneration() {
  try {
    console.log("🔧 Adding missing remuneration records...");

    // Get all facility types
    const facilityTypes = await prisma.facilityType.findMany();
    
    for (const facilityType of facilityTypes) {
      console.log(`\n📋 Processing ${facilityType.name}...`);
      
      // Get facility type remuneration
      const facilityTypeRemuneration = await prisma.facilityTypeRemuneration.findUnique({
        where: { facility_type_id: facilityType.id }
      });

      if (!facilityTypeRemuneration) {
        console.log(`⚠️ No facility type remuneration found for ${facilityType.name}`);
        continue;
      }

      // Define missing indicators for each facility type
      const missingIndicators = [
        { code: `TF001_${facilityType.name}`, amount: 500 },
        { code: `TS001_${facilityType.name}`, amount: 300 }
      ];

      for (const { code, amount } of missingIndicators) {
        // Find the indicator
        const indicator = await prisma.indicator.findUnique({
          where: { code }
        });

        if (!indicator) {
          console.log(`⚠️ Indicator ${code} not found`);
          continue;
        }

        // Check if remuneration already exists
        const existingRemuneration = await prisma.indicatorRemuneration.findUnique({
          where: {
            facility_type_remuneration_id_indicator_id: {
              facility_type_remuneration_id: facilityTypeRemuneration.id,
              indicator_id: indicator.id
            }
          }
        });

        if (!existingRemuneration) {
          // Create remuneration record
          await prisma.indicatorRemuneration.create({
            data: {
              facility_type_remuneration_id: facilityTypeRemuneration.id,
              indicator_id: indicator.id,
              base_amount: amount,
              conditional_amount: amount,
              condition_type: "WITH_TB_PATIENT"
            }
          });
          console.log(`✅ Added remuneration for ${code}: Rs. ${amount}`);
        } else {
          console.log(`⚠️ Remuneration already exists for ${code}`);
        }
      }
    }

    console.log("\n🎉 Missing remuneration records added successfully!");
  } catch (error) {
    console.error("❌ Error adding missing remuneration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addMissingRemuneration()
  .then(() => {
    console.log("✅ Missing remuneration addition completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Missing remuneration addition failed:", error);
    process.exit(1);
  });
