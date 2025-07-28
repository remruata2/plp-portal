import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding health data fields and formulas...");

  // Define the fields we need for our formulas
  const fields = [
    {
      code: "anc_total_registrations",
      name: "1.1.1 - Total number of pregnant women registered for ANC",
      description: "Total count of pregnant women who registered for antenatal care",
    },
    {
      code: "anc_first_trimester",
      name: "1.1.2 - Out of the total ANC registrations, number registered within 1st trimester",
      description: "Number of pregnant women who registered for ANC within the first trimester",
    },
    {
      code: "pw_high_risk",
      name: "1.2.1 - Number of PW identified with high-risk pregnancy",
      description: "Count of pregnant women identified with high-risk conditions during pregnancy",
    },
    {
      code: "pw_anc_4_visits",
      name: "1.3.1 - Number of PW received 4 or more ANC check-ups",
      description: "Count of pregnant women who received 4 or more antenatal check-ups",
    },
    {
      code: "pw_anc_3_visits",
      name: "1.3.2 - Number of PW received 3 ANC check-ups",
      description: "Count of pregnant women who received exactly 3 antenatal check-ups",
    },
    {
      code: "pw_anc_2_visits",
      name: "1.3.3 - Number of PW received 2 ANC check-ups",
      description: "Count of pregnant women who received exactly 2 antenatal check-ups",
    },
    {
      code: "pw_anc_1_visit",
      name: "1.3.4 - Number of PW received 1 ANC check-up",
      description: "Count of pregnant women who received exactly 1 antenatal check-up",
    },
    {
      code: "total_deliveries",
      name: "2.1.1 - Total number of deliveries conducted",
      description: "Total count of all deliveries conducted",
    },
    {
      code: "public_deliveries",
      name: "2.1.2 - Out of total deliveries, number conducted at public institutions",
      description: "Count of deliveries conducted at public healthcare institutions",
    },
    {
      code: "private_deliveries",
      name: "2.1.3 - Out of total deliveries, number conducted at private institutions",
      description: "Count of deliveries conducted at private healthcare institutions",
    },
    {
      code: "infants_due_immunization",
      name: "3.1.1 - Total number of infants due for immunization",
      description: "Count of infants who are due for immunization in the reporting period",
    },
    {
      code: "infants_complete_immunization",
      name: "3.1.2 - Number of infants who received complete immunization",
      description: "Count of infants who received all recommended vaccines in the reporting period",
    },
  ];

  // Create or update the fields
  console.log("\n📊 Creating/updating health data fields...");
  
  for (const field of fields) {
    const existingField = await prisma.field.findUnique({
      where: { code: field.code },
    });

    if (existingField) {
      console.log(`  ⏭️  Field already exists: ${field.name}`);
    } else {
      await prisma.field.create({
        data: field,
      });
      console.log(`  ✅ Created field: ${field.name}`);
    }
  }

  // Fetch all fields to get their IDs
  const dbFields = await prisma.field.findMany();
  const fieldMap = dbFields.reduce((acc, field) => {
    acc[field.code] = field.id;
    return acc;
  }, {} as Record<string, number>);

  // Define the formulas
  const formulas = [
    {
      name: "ANC First Trimester Registration %",
      description: "Percentage of pregnant women registered for ANC within first trimester",
      structure: {
        operands: [
          {
            alias: "A",
            type: "field",
            value: fieldMap.anc_total_registrations,
          },
          {
            alias: "B",
            type: "field",
            value: fieldMap.anc_first_trimester,
          },
        ],
        expression: "(B / A) * 100",
      },
    },
    {
      name: "Average ANC Visits Per PW",
      description: "Average number of antenatal care visits per registered pregnant woman",
      structure: {
        operands: [
          {
            alias: "A",
            type: "field",
            value: fieldMap.anc_total_registrations,
          },
          {
            alias: "B",
            type: "field",
            value: fieldMap.pw_anc_4_visits,
          },
          {
            alias: "C",
            type: "field",
            value: fieldMap.pw_anc_3_visits,
          },
          {
            alias: "D",
            type: "field",
            value: fieldMap.pw_anc_2_visits,
          },
          {
            alias: "E",
            type: "field",
            value: fieldMap.pw_anc_1_visit,
          },
        ],
        expression: "(B * 4 + C * 3 + D * 2 + E * 1) / A",
      },
    },
    {
      name: "Institutional Delivery Rate",
      description: "Percentage of deliveries conducted in healthcare institutions",
      structure: {
        operands: [
          {
            alias: "A",
            type: "field",
            value: fieldMap.total_deliveries,
          },
          {
            alias: "B",
            type: "field",
            value: fieldMap.public_deliveries,
          },
          {
            alias: "C",
            type: "field",
            value: fieldMap.private_deliveries,
          },
        ],
        expression: "((B + C) / A) * 100",
      },
    },
    {
      name: "High-Risk Pregnancy Identification Rate",
      description: "Percentage of registered pregnant women identified with high-risk conditions",
      structure: {
        operands: [
          {
            alias: "A",
            type: "field",
            value: fieldMap.anc_total_registrations,
          },
          {
            alias: "B",
            type: "field",
            value: fieldMap.pw_high_risk,
          },
        ],
        expression: "(B / A) * 100",
      },
    },
    {
      name: "Complete Immunization Coverage",
      description: "Percentage of infants who received all recommended vaccines",
      structure: {
        operands: [
          {
            alias: "A",
            type: "field",
            value: fieldMap.infants_due_immunization,
          },
          {
            alias: "B",
            type: "field",
            value: fieldMap.infants_complete_immunization,
          },
        ],
        expression: "(B / A) * 100",
      },
    },
  ];

  // Create or update the formulas
  console.log("\n📐 Creating/updating formulas...");
  
  for (const formula of formulas) {
    const existingFormula = await prisma.formula.findFirst({
      where: { name: formula.name },
    });

    if (existingFormula) {
      await prisma.formula.update({
        where: { id: existingFormula.id },
        data: formula,
      });
      console.log(`  🔄 Updated formula: ${formula.name}`);
    } else {
      await prisma.formula.create({
        data: formula,
      });
      console.log(`  ✅ Created formula: ${formula.name}`);
    }
  }

  console.log("\n🎉 Seeding formulas completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding formulas:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
