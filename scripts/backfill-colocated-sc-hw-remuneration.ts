import { PrismaClient } from "../src/generated/prisma";
import { HealthDataRemunerationService } from "../src/lib/services/health-data-remuneration.service";

const prisma = new PrismaClient();

/**
 * Backfill script to add colocated_sc_hw workers to WorkerRemuneration for existing PHC facilities
 * 
 * This script:
 * 1. Finds all PHC facilities with colocated_sc_hw workers
 * 2. Finds all report months where these facilities have submissions
 * 3. Recalculates remuneration using HealthDataRemunerationService (which now includes colocated_sc_hw)
 * 
 * This ensures that existing PHC facilities will have their colocated_sc_hw workers
 * included in the Workers sheet of the bulk export.
 */
async function backfillColocatedScHwRemuneration() {
  try {
    console.log("\n🔄 Starting backfill for colocated_sc_hw workers in PHC facilities...\n");

    // Find PHC facility type
    const phcFacilityType = await prisma.facility_type.findFirst({
      where: { name: "PHC" },
    });

    if (!phcFacilityType) {
      console.error("❌ PHC facility type not found!");
      return;
    }

    // Find all PHC facilities
    const phcFacilities = await prisma.facility.findMany({
      where: {
        facility_type_id: phcFacilityType.id,
        is_active: true,
      },
      include: {
        facility_type: true,
      },
    });

    console.log(`📋 Found ${phcFacilities.length} active PHC facilities`);

    // Find PHC facilities that have colocated_sc_hw workers
    const facilitiesWithColocatedHw = await prisma.health_workers.findMany({
      where: {
        facility_id: { in: phcFacilities.map((f) => f.id) },
        worker_type: "colocated_sc_hw",
        is_active: true,
      },
      select: {
        facility_id: true,
      },
      distinct: ["facility_id"],
    });

    const facilityIdsWithColocatedHw = new Set(
      facilitiesWithColocatedHw.map((w) => w.facility_id)
    );

    console.log(
      `👥 Found ${facilityIdsWithColocatedHw.size} PHC facilities with colocated_sc_hw workers\n`
    );

    if (facilityIdsWithColocatedHw.size === 0) {
      console.log("✅ No PHC facilities with colocated_sc_hw workers found. Nothing to backfill.");
      return;
    }

    // Find all report months where these facilities have submissions
    const fieldValues = await prisma.field_value.findMany({
      where: {
        facility_id: { in: Array.from(facilityIdsWithColocatedHw) },
      },
      select: {
        facility_id: true,
        report_month: true,
      },
      distinct: ["facility_id", "report_month"],
    });

    // Group by facility_id and report_month
    const facilityMonthPairs = new Map<string, Set<string>>();
    for (const fv of fieldValues) {
      if (!fv.facility_id || !fv.report_month) continue;
      if (!facilityMonthPairs.has(fv.facility_id)) {
        facilityMonthPairs.set(fv.facility_id, new Set());
      }
      facilityMonthPairs.get(fv.facility_id)!.add(fv.report_month);
    }

    console.log(
      `📦 Found ${facilityMonthPairs.size} facilities with submissions across ${Array.from(facilityMonthPairs.values()).reduce((sum, months) => sum + months.size, 0)} facility-month pairs\n`
    );

    let processed = 0;
    let successCount = 0;
    let errorCount = 0;

    // Process each facility-month pair
    for (const [facilityId, months] of facilityMonthPairs.entries()) {
      const facility = phcFacilities.find((f) => f.id === facilityId);
      if (!facility) continue;

      for (const reportMonth of months) {
        processed++;
        try {
          console.log(
            `🔄 [${processed}] Processing ${facility.display_name || facility.name} - ${reportMonth}...`
          );

          // Use the service to recalculate remuneration
          // This will now include colocated_sc_hw workers in WorkerRemuneration
          await prisma.$transaction(async (tx) => {
            await HealthDataRemunerationService.processHealthDataRemuneration(
              facilityId,
              reportMonth,
              [],
              tx
            );
          });

          successCount++;
          console.log(
            `   ✅ Successfully recalculated remuneration for ${facility.display_name || facility.name} - ${reportMonth}`
          );
        } catch (error) {
          errorCount++;
          console.error(
            `   ❌ Error processing ${facility.display_name || facility.name} - ${reportMonth}:`,
            error instanceof Error ? error.message : String(error)
          );
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Backfill Summary:");
    console.log(`   Total processed: ${processed}`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log("=".repeat(60));

    // Verify the results
    console.log("\n🔍 Verifying results...");
    const colocatedHwRemunerations = await prisma.worker_remunerations.findMany({
      where: {
        worker_type: "colocated_sc_hw",
      },
      select: {
        facility_id: true,
        report_month: true,
      },
      distinct: ["facility_id", "report_month"],
    });

    console.log(
      `✅ Found ${colocatedHwRemunerations.length} facility-month pairs with colocated_sc_hw workers in WorkerRemuneration`
    );

    if (colocatedHwRemunerations.length > 0) {
      console.log("\n📋 Sample records:");
      const sample = await prisma.worker_remunerations.findMany({
        where: {
          worker_type: "colocated_sc_hw",
        },
        include: {
          health_worker: {
            select: {
              name: true,
            },
          },
          facility: {
            select: {
              display_name: true,
              name: true,
            },
          },
        },
        take: 5,
      });

      sample.forEach((rec) => {
        console.log(
          `   - ${rec.facility.display_name || rec.facility.name} | ${rec.health_worker.name} | ${rec.report_month} | Role: ${rec.worker_role}`
        );
      });
    }

    console.log("\n🎉 Backfill completed!");
    console.log(
      "💡 PHC facilities with colocated_sc_hw workers will now appear in the Workers sheet of bulk exports."
    );
  } catch (error) {
    console.error("❌ Error during backfill:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
backfillColocatedScHwRemuneration();

