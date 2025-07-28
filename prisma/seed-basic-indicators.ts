import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding basic indicators...");

  // Create basic indicator category
  let dataFieldsCategory = await prisma.indicator_category.findFirst({
    where: { name: "Data Fields" },
  });

  if (!dataFieldsCategory) {
    dataFieldsCategory = await prisma.indicator_category.create({
      data: {
        name: "Data Fields",
        description: "Basic data collection fields for monthly reporting",
        sort_order: 0,
        updated_at: new Date(),
      },
    });
    console.log("Created indicator category: Data Fields");
  } else {
    console.log("Indicator category already exists: Data Fields");
  }

  // Sample indicators/fields
  const indicators = [
    {
      code: "anc_registrations",
      name: "Number of ANC registrations",
      description: "Monthly count of new ANC registrations",
      unit: "Count",
      calculation_type: "DIRECT_INPUT" as const,
      data_source: "HMIS",
      category_id: dataFieldsCategory.id,
    },
    {
      code: "anc_4_visits",
      name: "Number of pregnant women with 4+ ANC visits",
      description: "Count of pregnant women who completed 4 or more ANC visits",
      unit: "Count",
      calculation_type: "DIRECT_INPUT" as const,
      data_source: "HMIS",
      category_id: dataFieldsCategory.id,
    },
    {
      code: "institutional_deliveries",
      name: "Number of institutional deliveries",
      description: "Count of deliveries conducted at health facilities",
      unit: "Count",
      calculation_type: "DIRECT_INPUT" as const,
      data_source: "HMIS",
      category_id: dataFieldsCategory.id,
    },
    {
      code: "home_deliveries",
      name: "Number of home deliveries",
      description: "Count of deliveries conducted at home",
      unit: "Count",
      calculation_type: "DIRECT_INPUT" as const,
      data_source: "HMIS",
      category_id: dataFieldsCategory.id,
    },
    {
      code: "jsy_beneficiaries",
      name: "Number of JSY beneficiaries",
      description: "Count of JSY (Janani Suraksha Yojana) beneficiaries",
      unit: "Count",
      calculation_type: "DIRECT_INPUT" as const,
      data_source: "RCH Portal",
      category_id: dataFieldsCategory.id,
    },
  ];

  for (const indicator of indicators) {
    const existingIndicator = await prisma.indicator.findFirst({
      where: { code: indicator.code },
    });

    if (!existingIndicator) {
      const created = await prisma.indicator.create({
        data: indicator,
      });
      console.log(`Created indicator: ${created.name}`);
    } else {
      console.log(`Indicator already exists: ${indicator.name}`);
    }
  }

  console.log("Seeding basic indicators finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
