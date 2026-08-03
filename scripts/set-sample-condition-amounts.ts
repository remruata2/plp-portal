import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function setSampleConditionAmounts() {
	console.log("📝 Updating sample condition amounts for TS001 and Sub-Center indicators...");

	try {
		const remunerations = await prisma.indicator_remuneration.findMany({
			include: {
				indicator: true,
				facility_type_remuneration: {
					include: { facility_type: true },
				},
			},
		});

		for (const rem of remunerations) {
			const code = rem.indicator?.code || "";
			const facilityType = rem.facility_type_remuneration?.facility_type?.name || "";

			// Set custom condition amounts for TS001 (TB Screening)
			if (code === "TS001" || code.startsWith("TS001_")) {
				await prisma.indicator_remuneration.update({
					where: { id: rem.id },
					data: {
						condition_1_amount: 500,
						condition_2_amount: 1000,
						condition_3_amount: 500,
						condition_4_amount: 1000,
					},
				});
				console.log(`✅ Set TS001 (${facilityType}) -> Cond 1: 500, Cond 2: 1000, Cond 3: 500, Cond 4: 1000`);
			}

			// Set custom condition amounts for CT001 (TB Contact Tracing)
			if (code === "CT001" || code.startsWith("CT001_")) {
				await prisma.indicator_remuneration.update({
					where: { id: rem.id },
					data: {
						condition_1_amount: 500,
						condition_2_amount: 0,
						condition_3_amount: 0,
						condition_4_amount: 0,
					},
				});
				console.log(`✅ Set CT001 (${facilityType}) -> Cond 1: 500, Cond 2: 0, Cond 3: 0, Cond 4: 0`);
			}

			// Set custom condition amounts for DC001 (TB Differentiated Care)
			if (code === "DC001" || code.startsWith("DC001_")) {
				await prisma.indicator_remuneration.update({
					where: { id: rem.id },
					data: {
						condition_1_amount: 500,
						condition_2_amount: 0,
						condition_3_amount: 0,
						condition_4_amount: 0,
					},
				});
				console.log(`✅ Set DC001 (${facilityType}) -> Cond 1: 500, Cond 2: 0, Cond 3: 0, Cond 4: 0`);
			}
		}

		console.log("\n🎉 Finished setting sample condition amounts!");
	} catch (e) {
		console.error("Error setting sample condition amounts:", e);
	} finally {
		await prisma.$disconnect();
	}
}

setSampleConditionAmounts();
