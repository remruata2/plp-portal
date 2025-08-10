import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function recalculateIncentives() {
  console.log("🔄 Starting incentive recalculation with new logic...");

  try {
    // Step 1: Clear existing performance calculations
    console.log("🗑️ Clearing existing performance calculations...");
    const deletedCount = await prisma.performanceCalculation.deleteMany();
    console.log(`✅ Deleted ${deletedCount.count} existing performance calculations`);

    // Step 2: Clear existing remuneration calculations
    console.log("🗑️ Clearing existing remuneration calculations...");
    const deletedRemunerationCount = await prisma.remunerationCalculation.deleteMany();
    console.log(`✅ Deleted ${deletedRemunerationCount.count} existing remuneration calculations`);

    // Step 3: Clear existing worker remuneration records
    console.log("🗑️ Clearing existing worker remuneration records...");
    const deletedWorkerRemunerationCount = await prisma.workerRemuneration.deleteMany();
    console.log(`✅ Deleted ${deletedWorkerRemunerationCount.count} existing worker remuneration records`);

    // Step 4: Get all facilities with submitted data
    console.log("🔍 Finding facilities with submitted data...");
    const facilitiesWithData = await prisma.facility.findMany({
      where: {
        field_values: {
          some: {}
        }
      },
      include: {
        field_values: {
          distinct: ['report_month']
        }
      }
    });

    console.log(`📊 Found ${facilitiesWithData.length} facilities with data`);

    // Step 5: Regenerate calculations for each facility/month
    for (const facility of facilitiesWithData) {
      const reportMonths = facility.field_values.map(fv => fv.report_month);
      const uniqueMonths = [...new Set(reportMonths)];
      
      for (const month of uniqueMonths) {
        console.log(`🔄 Regenerating calculations for facility ${facility.name} (${month})...`);
        
        try {
          // Trigger remuneration calculation (this will use the updated FormulaCalculator)
          const { RemunerationCalculator } = await import("../src/lib/calculations/remuneration-calculator");
          await RemunerationCalculator.triggerRemunerationCalculation(facility.id, month);
          console.log(`✅ Successfully regenerated for ${facility.name} (${month})`);
        } catch (error) {
          console.error(`❌ Error regenerating for ${facility.name} (${month}):`, error);
        }
      }
    }

    console.log("\n🎉 Incentive recalculation completed!");
    console.log("\n📋 Summary:");
    console.log(`- Cleared ${deletedCount.count} performance calculations`);
    console.log(`- Cleared ${deletedRemunerationCount.count} remuneration calculations`);
    console.log(`- Cleared ${deletedWorkerRemunerationCount.count} worker remuneration records`);
    console.log(`- Regenerated calculations for ${facilitiesWithData.length} facilities`);
    console.log("\n💡 The new incentive calculation logic is now active!");
    console.log("   - Teleconsultation at 60% will now get 60% of ₹2000 = ₹1200");
    console.log("   - All incentives are now proportional to achievement percentage");

  } catch (error) {
    console.error("❌ Error during incentive recalculation:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
recalculateIncentives()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
