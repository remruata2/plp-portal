import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("\n⚙️  Updating HealthWorker allocated_amount for ASHA to 1000 where needed...\n");

  // Preview
  const mismatches = await prisma.healthWorker.findMany({
    where: {
      worker_type: "asha",
      is_active: true,
      NOT: { allocated_amount: 1000 },
    },
    select: {
      id: true,
      name: true,
      facility: { select: { id: true, name: true } },
      allocated_amount: true,
    },
  });

  if (mismatches.length === 0) {
    console.log("✅ No mismatched ASHA health workers found. Nothing to update.");
  } else {
    console.log(`Found ${mismatches.length} active ASHA workers to fix:`);
    mismatches.slice(0, 10).forEach((w) =>
      console.log(
        ` - ${w.name} @ ${w.facility?.name}: ${Number(w.allocated_amount)} -> 1000`
      )
    );
    if (mismatches.length > 10) {
      console.log(`   ...and ${mismatches.length - 10} more`);
    }

    const result = await prisma.healthWorker.updateMany({
      where: { worker_type: "asha", is_active: true, NOT: { allocated_amount: 1000 } },
      data: { allocated_amount: 1000 },
    });

    console.log(`\n✅ Updated ${result.count} HealthWorker rows.`);
  }

  // Summary
  const summary = await prisma.healthWorker.groupBy({
    by: ["worker_type", "allocated_amount"],
    where: { worker_type: "asha" },
    _count: { _all: true },
  });

  console.log("\n📊 Current ASHA HealthWorker allocation distribution:");
  summary
    .sort((a, b) => Number(a.allocated_amount) - Number(b.allocated_amount))
    .forEach((s) =>
      console.log(
        ` - allocated_amount=${Number(s.allocated_amount)}: ${s._count._all} workers`
      )
    );
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
