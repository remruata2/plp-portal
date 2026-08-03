import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function migrateLegacyConditionsToDb() {
	console.log("🚀 Migrating legacy TS001, CT001, and DC001 hardcoded conditions to condition_config JSON in DB...");

	try {
		// Find all indicator_remuneration records
		const remunerations = await prisma.indicator_remuneration.findMany({
			include: {
				indicator: true,
				facility_type_remuneration: {
					include: {
						facility_type: true,
					},
				},
			},
		});

		let updatedCount = 0;

		for (const rem of remunerations) {
			const code = rem.indicator?.code || "";
			const facilityTypeName = rem.facility_type_remuneration?.facility_type?.name || "";

			// Facility-aware field codes
			const ct001FieldCode = facilityTypeName === "PHC"
				? "indicator_ct001_conditional_answer_phc"
				: "indicator_ct001_conditional_answer";

			const dc001FieldCode = facilityTypeName === "PHC"
				? "indicator_dc001_conditional_answer_phc"
				: "indicator_dc001_conditional_answer";

			let newConfig: any = null;

			if (code === "TS001" || code.startsWith("TS001_")) {
				newConfig = {
					condition_1: [
						{ field_code: ct001FieldCode, operator: "equals", value: true },
						{ field_code: dc001FieldCode, operator: "equals", value: true },
					],
					condition_2: [
						{ field_code: ct001FieldCode, operator: "equals", value: false },
						{ field_code: dc001FieldCode, operator: "equals", value: false },
					],
					condition_3: [
						{ field_code: ct001FieldCode, operator: "equals", value: true },
						{ field_code: dc001FieldCode, operator: "equals", value: false },
					],
					condition_4: [
						{ field_code: ct001FieldCode, operator: "equals", value: false },
						{ field_code: dc001FieldCode, operator: "equals", value: true },
					],
				};
			} else if (code === "CT001" || code.startsWith("CT001_")) {
				newConfig = {
					condition_1: [
						{ field_code: ct001FieldCode, operator: "equals", value: true },
					],
				};
			} else if (code === "DC001" || code.startsWith("DC001_")) {
				newConfig = {
					condition_1: [
						{ field_code: dc001FieldCode, operator: "equals", value: true },
					],
				};
			}

			if (newConfig) {
				await prisma.indicator_remuneration.update({
					where: { id: rem.id },
					data: { condition_config: newConfig },
				});
				updatedCount++;
				console.log(`✅ Updated ${code} (${facilityTypeName}) with dynamic condition_config.`);
			}
		}

		console.log(`\n🎉 Migration complete! ${updatedCount} remuneration records updated in database.`);
	} catch (e) {
		console.error("❌ Migration error:", e);
	} finally {
		await prisma.$disconnect();
	}
}

migrateLegacyConditionsToDb();
