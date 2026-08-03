import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function createTs001RemunerationRecords() {
	console.log("🚀 Creating indicator_remuneration records for TS001 variants...");

	const facilityTypeRemunerations = await prisma.facility_type_remuneration.findMany({
		include: { facility_type: true },
	});

	const tsIndicators = await prisma.indicator.findMany({
		where: {
			code: { startsWith: "TS001" },
		},
	});

	for (const ftr of facilityTypeRemunerations) {
		const facilityTypeName = ftr.facility_type.name;

		for (const ind of tsIndicators) {
			const isMatch =
				ind.code === "TS001" ||
				ind.code.endsWith(`_${facilityTypeName}`) ||
				(facilityTypeName === "SC_HWC" && ind.code === "TS001_SC") ||
				(facilityTypeName === "U_HWC" && ind.code === "TS001_UHWC") ||
				(facilityTypeName === "A_HWC" && ind.code === "TS001_AHWC");

			if (isMatch) {
				const existing = await prisma.indicator_remuneration.findUnique({
					where: {
						facility_type_remuneration_id_indicator_id: {
							facility_type_remuneration_id: ftr.id,
							indicator_id: ind.id,
						},
					},
				});

				const ct001FieldCode = facilityTypeName === "PHC"
					? "indicator_ct001_conditional_answer_phc"
					: "indicator_ct001_conditional_answer";

				const dc001FieldCode = facilityTypeName === "PHC"
					? "indicator_dc001_conditional_answer_phc"
					: "indicator_dc001_conditional_answer";

				const conditionConfig = {
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

				if (!existing) {
					await prisma.indicator_remuneration.create({
						data: {
							facility_type_remuneration_id: ftr.id,
							indicator_id: ind.id,
							base_amount: 500,
							condition_1_amount: 500,
							condition_2_amount: 1000,
							condition_3_amount: 500,
							condition_4_amount: 1000,
							condition_config: conditionConfig,
							updated_at: new Date(),
						},
					});
					console.log(`✅ Created TS001 remuneration for ${ind.code} (${facilityTypeName})`);
				} else {
					await prisma.indicator_remuneration.update({
						where: { id: existing.id },
						data: {
							condition_1_amount: 500,
							condition_2_amount: 1000,
							condition_3_amount: 500,
							condition_4_amount: 1000,
							condition_config: conditionConfig,
						},
					});
					console.log(`🔄 Updated TS001 remuneration for ${ind.code} (${facilityTypeName})`);
				}
			}
		}
	}

	await prisma.$disconnect();
}

createTs001RemunerationRecords();
