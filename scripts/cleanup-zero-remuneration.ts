import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

interface Pair { facility_id: string; report_month: string }

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  return {
    execute: args.has("--execute") || args.has("-x"),
    includeZeroTotals: args.has("--include-zero-totals"),
  };
}

async function main() {
  const { execute, includeZeroTotals } = parseArgs();
  console.log("Cleanup zero/unwanted remuneration data");
  console.log(`Mode: ${execute ? "EXECUTE (will delete)" : "DRY-RUN (no deletes)"}`);
  console.log(`Include rows with all zero totals: ${includeZeroTotals}`);

  // 1) Build set of valid facility-month pairs from fieldValue (actual submissions)
  const fvPairsRaw = await prisma.fieldValue.findMany({
    select: { facility_id: true, report_month: true },
    distinct: ["facility_id", "report_month"],
  });
  const validPairs = new Set(
    fvPairsRaw
      .filter((p) => p.facility_id && p.report_month)
      .map((p) => `${p.facility_id}|${p.report_month}`)
  );

  // 2) Get existing remunerationCalculation pairs
  const rcPairsRaw = await prisma.remunerationCalculation.findMany({
    select: { facility_id: true, report_month: true, total_worker_remuneration: true, facility_remuneration: true, total_remuneration: true },
  });

  // 3) Identify bogus pairs (no submissions) and optionally zero-total pairs
  const bogusPairs: Pair[] = [];
  const zeroTotalPairs: Pair[] = [];

  for (const row of rcPairsRaw) {
    const key = `${row.facility_id}|${row.report_month}`;
    if (!validPairs.has(key)) bogusPairs.push({ facility_id: row.facility_id!, report_month: row.report_month! });

    const twr = Number(row.total_worker_remuneration ?? 0);
    const fr = Number(row.facility_remuneration ?? 0);
    const tr = Number(row.total_remuneration ?? 0);
    if (twr === 0 && fr === 0 && tr === 0) {
      zeroTotalPairs.push({ facility_id: row.facility_id!, report_month: row.report_month! });
    }
  }

  // Union target pairs
  const targetsKeyed = new Map<string, Pair>();
  for (const p of bogusPairs) targetsKeyed.set(`${p.facility_id}|${p.report_month}`, p);
  if (includeZeroTotals) {
    for (const p of zeroTotalPairs) targetsKeyed.set(`${p.facility_id}|${p.report_month}`, p);
  }
  const targets = Array.from(targetsKeyed.values());

  console.log(`Found ${bogusPairs.length} facility-month pairs with NO submissions.`);
  if (includeZeroTotals) console.log(`Including ${zeroTotalPairs.length} zero-total pairs.`);
  console.log(`Total target pairs to delete: ${targets.length}`);

  if (targets.length === 0) {
    console.log("Nothing to delete. Exiting.");
    return;
  }

  // 4) Delete in order using OR of composite pairs
  const orPairs = targets.map((p) => ({ facility_id: p.facility_id, report_month: p.report_month }));

  if (!execute) {
    console.log("DRY-RUN: Skipping deletes. Example of first 10 pairs:");
    console.log(orPairs.slice(0, 10));
    return;
  }

  console.log("Deleting workerRemuneration...");
  const delWR = await prisma.workerRemuneration.deleteMany({ where: { OR: orPairs } });

  console.log("Deleting facilityRemunerationRecord...");
  const delFRR = await prisma.facilityRemunerationRecord.deleteMany({ where: { OR: orPairs } });

  console.log("Deleting remunerationCalculation...");
  const delRC = await prisma.remunerationCalculation.deleteMany({ where: { OR: orPairs } });

  console.log("Deletion summary:");
  console.log({ workerRemuneration: delWR.count, facilityRemunerationRecord: delFRR.count, remunerationCalculation: delRC.count });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
