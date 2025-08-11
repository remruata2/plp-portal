import { PrismaClient } from "../src/generated/prisma";
import { RemunerationCalculator } from "../src/lib/calculations/remuneration-calculator";

const prisma = new PrismaClient();

async function directRecalculateRemuneration() {
  try {
    console.log("🧹 Clearing old remuneration data...");
    
    // Clear all old remuneration records
    await prisma.facilityRemunerationRecord.deleteMany({});
    await prisma.workerRemuneration.deleteMany({});
    await prisma.remunerationCalculation.deleteMany({});
    
    console.log("✅ Cleared all old remuneration data");
    
    // Get all facilities
    const facilities = await prisma.facility.findMany({
      include: {
        facility_type: true,
      },
    });
    
    console.log(`📋 Found ${facilities.length} facilities to recalculate`);
    
    // Get all available report months
    const fieldValues = await prisma.fieldValue.findMany({
      select: {
        report_month: true,
      },
      distinct: ['report_month'],
    });
    
    const reportMonths = [...new Set(fieldValues.map(fv => fv.report_month))];
    console.log(`📅 Found ${reportMonths.length} report months: ${reportMonths.join(', ')}`);
    
    // Recalculate for each facility and month combination
    for (const facility of facilities) {
      for (const month of reportMonths) {
        try {
          console.log(`\n🔄 Recalculating for ${facility.name} - ${month}`);
          
          // Directly call the remuneration calculation
          await RemunerationCalculator.triggerRemunerationCalculation(
            facility.id,
            month
          );
          
          console.log(`✅ Successfully recalculated for ${facility.name} - ${month}`);
        } catch (error) {
          console.log(`❌ Error recalculating for ${facility.name} - ${month}: ${error}`);
        }
      }
    }
    
    console.log("\n🎉 Remuneration recalculation completed!");
    console.log("💡 You can now refresh the facility reports page to see the corrected data");
    
  } catch (error) {
    console.error("❌ Error during remuneration recalculation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
directRecalculateRemuneration();
