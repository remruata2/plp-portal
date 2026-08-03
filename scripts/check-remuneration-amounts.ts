import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkRemunerationAmounts() {
	const items = await prisma.indicator_remuneration.findMany({
		include: {
			indicator: true,
			facility_type_remuneration: {
				include: {
					facility_type: true,
				},
			},
		},
	});

	console.log("=== ALL INDICATOR REMUNERATIONS ===");
	items.forEach((item) => {
		console.log(`[ID ${item.id}] ${item.indicator?.code} - ${item.facility_type_remuneration?.facility_type?.name}:`);
		console.log(`  Base: ${item.base_amount}`);
		console.log(`  Cond 1: ${item.condition_1_amount}, Cond 2: ${item.condition_2_amount}, Cond 3: ${item.condition_3_amount}, Cond 4: ${item.condition_4_amount}`);
		console.log(`  Config: ${JSON.stringify(item.condition_config)}`);
	});

	await prisma.$disconnect();
}

checkRemunerationAmounts();
