import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("\n⚙️  Updating WorkerAllocationConfig for ASHA to allocated_amount = 1000 where needed...\n");

  // Preview
  const mismatches = await prisma.workerAllocationConfig.findMany({
    where: {
      worker_type: "asha",
      NOT: { allocated_amount: 1000 },
    },
    select: {
      id: true,
      worker_role: true,
      worker_type: true,
      allocated_amount: true,
      facility_type: { select: { id: true, name: true, display_name: true } },
    },
  });

  if (mismatches.length === 0) {
    console.log("✅ No mismatched ASHA allocation configs found. Nothing to update.");
  } else {
    console.log(`Found ${mismatches.length} configs to fix:`);
    mismatches.forEach((c) =>
      console.log(
        ` - [${c.facility_type?.name}] ${c.worker_role} (${c.worker_type}) from ${c.allocated_amount} -> 1000`
      )
    );

    const result = await prisma.workerAllocationConfig.updateMany({
      where: { worker_type: "asha", NOT: { allocated_amount: 1000 } },
      data: { allocated_amount: 1000 },
    });

    console.log(`\n✅ Updated ${result.count} WorkerAllocationConfig rows.`);
  }

  // Summary
  const summary = await prisma.workerAllocationConfig.findMany({
    where: { worker_type: "asha" },
    select: {
      allocated_amount: true,
      facility_type: { select: { name: true } },
    },
    orderBy: [{ facility_type: { name: "asc" } }],
  });

  console.log("\n📊 Current ASHA allocated_amount by facility type:");
  summary.forEach((s) =>
    console.log(` - ${s.facility_type?.name}: ${Number(s.allocated_amount)}`)
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
