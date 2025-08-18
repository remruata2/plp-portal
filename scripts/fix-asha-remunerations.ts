import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Helper to compute remuneration = allocated_amount * (performance_percentage / 100)
function computeCalculatedAmount(allocatedAmount: number, performancePct: number): number {
  const amt = allocatedAmount * (performancePct / 100);
  return Math.round(amt * 100) / 100; // round to 2 decimals
}

async function main() {
  console.log("\n⚙️  Fixing ASHA remunerations: setting allocated_amount to 1000 and recalculating calculated_amount...\n");

  // Find all ASHA worker remunerations that are not already set to 1000
  const toFix = await prisma.workerRemuneration.findMany({
    where: {
      worker_type: "asha",
      NOT: { allocated_amount: 1000 },
    },
    select: {
      id: true,
      health_worker_id: true,
      facility_id: true,
      report_month: true,
      worker_type: true,
      worker_role: true,
      allocated_amount: true,
      performance_percentage: true,
      calculated_amount: true,
    },
  });

  console.log(`Found ${toFix.length} ASHA remuneration records to fix.`);

  let updated = 0;
  const batchSize = 100;

  for (let i = 0; i < toFix.length; i += batchSize) {
    const batch = toFix.slice(i, i + batchSize);

    await prisma.$transaction(
      batch.map((rec) => {
        const performance = Number(rec.performance_percentage);
        const newAllocated = 1000;
        const newCalculated = computeCalculatedAmount(newAllocated, performance);

        return prisma.workerRemuneration.update({
          where: { id: rec.id },
          data: {
            allocated_amount: newAllocated,
            calculated_amount: newCalculated,
          },
        });
      })
    );

    updated += batch.length;
    console.log(`   - Updated ${updated}/${toFix.length} records...`);
  }

  console.log(`\n✅ Completed. Updated ${updated} ASHA remuneration records.`);

  // Optional: show a quick summary by report_month
  const summary = await prisma.workerRemuneration.groupBy({
    by: ["report_month"],
    where: { worker_type: "asha" },
    _count: { _all: true },
  });

  console.log("\n📊 Summary (ASHA records by month):");
  summary
    .sort((a, b) => a.report_month.localeCompare(b.report_month))
    .forEach((s) => console.log(`   ${s.report_month}: ${s._count._all}`));
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
