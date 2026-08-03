import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function findTs001() {
	const allIndicators = await prisma.indicator.findMany({
		select: { id: true, code: true, name: true },
	});

	console.log("=== ALL INDICATORS IN DB ===");
	console.dir(allIndicators, { depth: null });

	await prisma.$disconnect();
}

findTs001();
