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
    
    // Build the set of facility-month pairs that actually have submissions.
    // We derive this from fieldValue to avoid creating zero rows for facilities without data.
    const fvPairsRaw = await prisma.fieldValue.findMany({
      select: {
        facility_id: true,
        report_month: true,
      },
      distinct: ["facility_id", "report_month"],
    });

    const fvPairs = fvPairsRaw.filter(
      (p) => typeof p.facility_id === "string" && !!p.facility_id && !!p.report_month
    );

    // Optionally ensure facilities exist and are active
    const facilityIds = Array.from(new Set(fvPairs.map((p) => p.facility_id!)));
    const facilitiesById = new Map<string, { id: string; name: string }>();
    const facilities = await prisma.facility.findMany({
      where: { id: { in: facilityIds } },
      select: { id: true, name: true, is_active: true },
    });
    for (const f of facilities) {
      if (f.is_active) facilitiesById.set(f.id, { id: f.id, name: f.name });
    }

    console.log(`📋 Found ${facilitiesById.size} facilities with submissions`);
    console.log(`📦 Found ${fvPairs.length} facility-month pairs with data`);

    for (const pair of fvPairs) {
      const fac = facilitiesById.get(pair.facility_id!);
      if (!fac) continue; // skip inactive or missing facilities
      const month = pair.report_month!;

      try {
        console.log(`\n🔄 Recalculating for ${fac.name} - ${month}`);

        await RemunerationCalculator.triggerRemunerationCalculation(
          fac.id,
          month
        );

        console.log(`✅ Successfully recalculated for ${fac.name} - ${month}`);
      } catch (error) {
        console.log(`❌ Error recalculating for ${fac?.name ?? pair.facility_id} - ${month}: ${error}`);
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
