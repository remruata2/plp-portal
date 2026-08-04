import { PrismaClient } from "../src/generated/prisma";
import { getConditionAmount } from "../src/lib/calculations/formula-calculator/calculate-condition-amount";
import { calculateEffectiveRemuneration, getEffectiveMaxRemuneration } from "../src/lib/services/indicator-remuneration-helper";

const prisma = new PrismaClient();

async function testSubCenterCalculations() {
	console.log("🧪 Testing Sub-Center & Facility Remuneration Calculation Engine...\n");

	// 1. Fetch SC_HWC Remunerations from DB
	const scFTR = await prisma.facility_type_remuneration.findFirst({
		where: { facility_type: { name: "SC_HWC" } },
		include: {
			indicator_remuneration: {
				include: { indicator: true },
			},
		},
	});

	if (!scFTR) {
		console.error("❌ SC_HWC facility type remuneration not found in DB.");
		return;
	}

	console.log(`Found ${scFTR.indicator_remuneration.length} mapped indicators for Sub Centre.\n`);

	// 2. Scenario 1: Sub-Center has new pregnant women (Q4 = True), Pregnant Women in Catchment (Q8 = True), New Pulm TB & Treatment (Q14 = True, Q16 = True)
	console.log("--- SCENARIO 1: Q4 = YES (New Pregnant Women), Q8 = YES (PW Catchment), Q14 = YES & Q16 = YES (TB Active) ---");
	const mockFieldValuesScenario1 = [
		{ fieldCode: "sc_are_there_any_new_pregnant_women_in_the__5", boolean_value: true },
		{ fieldCode: "sc_are_there_any_pregnant_women_in_the_catc_10", boolean_value: true },
		{ fieldCode: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", boolean_value: true },
		{ fieldCode: "sc_are_there_any_patients_any_type_currently_26", boolean_value: true },
	];

	for (const rem of scFTR.indicator_remuneration) {
		const code = rem.indicator.code;
		const effectiveMax = getEffectiveMaxRemuneration(
			code,
			Number(rem.base_amount),
			rem,
			mockFieldValuesScenario1,
			"SC_HWC"
		);

		if (rem.condition_config) {
			console.log(`  🎯 Conditional Indicator [${code}] ("${rem.indicator.name}") ➔ Effective Max: ₹${effectiveMax}`);
		}
	}

	console.log("\n--- SCENARIO 2: Q4 = NO (No New PW), Q8 = NO (No PW Catchment), Q14 = NO & Q16 = NO (No TB) ---");
	const mockFieldValuesScenario2 = [
		{ fieldCode: "sc_are_there_any_new_pregnant_women_in_the__5", boolean_value: false },
		{ fieldCode: "sc_are_there_any_pregnant_women_in_the_catc_10", boolean_value: false },
		{ fieldCode: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", boolean_value: false },
		{ fieldCode: "sc_are_there_any_patients_any_type_currently_26", boolean_value: false },
	];

	for (const rem of scFTR.indicator_remuneration) {
		const code = rem.indicator.code;
		const effectiveMax = getEffectiveMaxRemuneration(
			code,
			Number(rem.base_amount),
			rem,
			mockFieldValuesScenario2,
			"SC_HWC"
		);

		if (rem.condition_config) {
			console.log(`  🎯 Conditional Indicator [${code}] ("${rem.indicator.name}") ➔ Effective Max: ₹${effectiveMax}`);
		}
	}

	console.log("\n✅ Test completed successfully!");
}

testSubCenterCalculations()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
