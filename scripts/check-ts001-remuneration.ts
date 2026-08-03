import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkTs001() {
	const indicators = await prisma.indicator.findMany({
		where: {
			OR: [
				{ code: { contains: "TS" } },
				{ code: { contains: "TB" } },
				{ name: { contains: "TB" } },
				{ name: { contains: "screen" } },
			],
		},
	});

	console.log("=== MATCHING INDICATORS ===");
	console.dir(indicators, { depth: null });

	const tsRemunerations = await prisma.indicator_remuneration.findMany({
		where: {
			indicator_id: { in: indicators.map((i) => i.id) },
		},
		include: {
			indicator: true,
			facility_type_remuneration: {
				include: { facility_type: true },
			},
		},
	});

	console.log("\n=== MATCHING REMUNERATION RECORDS ===");
	console.dir(tsRemunerations, { depth: null });

	await prisma.$disconnect();
}

checkTs001();
