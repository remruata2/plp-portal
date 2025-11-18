import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function addConditionalAnswerFields() {
	console.log("📝 Adding conditional answer boolean fields...");

	try {
		// Check if fields already exist
		const existingCT001 = await prisma.field.findUnique({
			where: { code: "indicator_ct001_conditional_answer" },
		});

		const existingDC001 = await prisma.field.findUnique({
			where: { code: "indicator_dc001_conditional_answer" },
		});

		if (existingCT001) {
			console.log(
				"⚠️  Field indicator_ct001_conditional_answer already exists, skipping..."
			);
		} else {
			await prisma.field.create({
				data: {
					code: "indicator_ct001_conditional_answer",
					name: "Indicator CT001 Conditional Answer",
					description:
						"Yes/No answer for 'Are there any patients with Pulmonary TB in your catchment area?'",
					user_type: "FACILITY",
					field_type: "BINARY",
					field_category: "DATA_FIELD",
					sort_order: 303,
					is_active: true,
				},
			});
			console.log("✅ Created indicator_ct001_conditional_answer field");
		}

		if (existingDC001) {
			console.log(
				"⚠️  Field indicator_dc001_conditional_answer already exists, skipping..."
			);
		} else {
			await prisma.field.create({
				data: {
					code: "indicator_dc001_conditional_answer",
					name: "Indicator DC001 Conditional Answer",
					description:
						"Yes/No answer for 'Are there any patients with any type of TB?'",
					user_type: "FACILITY",
					field_type: "BINARY",
					field_category: "DATA_FIELD",
					sort_order: 304,
					is_active: true,
				},
			});
			console.log("✅ Created indicator_dc001_conditional_answer field");
		}

		console.log("✅ Conditional answer fields added successfully!");
	} catch (error) {
		console.error("❌ Error adding conditional answer fields:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

addConditionalAnswerFields().catch((e) => {
	console.error("❌ Error:", e);
	process.exit(1);
});
