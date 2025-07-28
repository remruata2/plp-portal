import { PrismaClient, CalculationType } from "../src/generated/prisma";

const prisma = new PrismaClient();

const indicatorCategories = [
  {
    name: "Maternal Health",
    description:
      "Reproductive and Child Health (RCH) flexipool including Routine Immunization Programme, Pulse Polio Immunization Programme",
    sort_order: 1,
    indicators: [
      {
        code: "ANC_COV",
        name: "ANC Coverage",
        description: "Percentage of PW Registered for ANC",
        unit: "Percentage",
        target_value: 90,
        calculation_type: CalculationType.PERCENTAGE,
        data_source: "HMIS",
        sort_order: 1,
      },
      {
        code: "ANC_REG_1ST",
        name: "ANC registration in 1 trimester of pregnancy (within12 weeks)",
        description: "Percentage of PW registered for ANC in 1st trimester",
        unit: "Percentage",
        target_value: 75,
        calculation_type: "PERCENTAGE",
        data_source: "HMIS",
        sort_order: 2,
      },
      {
        code: "ANC_4PLUS",
        name: "Pregnant Women who received 4 or more ANC check-ups",
        description: "% of PW received 4 or more ANC check-ups",
        unit: "Percentage",
        target_value: 80,
        calculation_type: "PERCENTAGE",
        data_source: "HMIS",
        sort_order: 3,
      },
      {
        code: "HRP_IDENT",
        name: "Identification of HRP",
        description: "% of high risk pregnancies identified",
        unit: "Percentage",
        target_value: 15,
        calculation_type: "PERCENTAGE",
        data_source: "RCH Portal",
        sort_order: 4,
      },
      {
        code: "HRP_MGMT",
        name: "Management of HRP",
        description: "% of HRP Managed",
        unit: "Percentage",
        target_value: 100,
        calculation_type: "PERCENTAGE",
        data_source: "RCH Portal",
        sort_order: 5,
      },
      {
        code: "INST_DEL",
        name: "Institutional Deliveries",
        description: "% of institutional deliveries out of total Deliveries",
        unit: "Percentage",
        target_value: 90,
        calculation_type: "PERCENTAGE",
        data_source: "RCH Portal",
        sort_order: 6,
      },
      {
        code: "LAQSHYA_LR",
        name: "National Certification of LRs &OTs under LaQshya against target (LaQshya LR)",
        description:
          "% of nationally certified LRs and OTs under LaQshya against target",
        unit: "Numbers",
        target_value: 3,
        calculation_type: "DIRECT_INPUT",
        data_source: "NHSRC Report",
        sort_order: 7,
      },
      {
        code: "LAQSHYA_OT",
        name: "LaQshya OT",
        description: "LaQshya OT certification",
        unit: "Numbers",
        target_value: 0,
        calculation_type: "DIRECT_INPUT",
        data_source: "NHSRC Report",
        sort_order: 8,
      },
      {
        code: "SUMAN_NOTIF",
        name: "Public Health facilities notified under SUMAN",
        description:
          "Percentage of public health facilities notified under SUMAN against target",
        unit: "Percentage",
        target_value: 100,
        calculation_type: "PERCENTAGE",
        data_source: "State Report",
        sort_order: 9,
      },
      {
        code: "MDR_MECH",
        name: "Maternal death review mechanism",
        description:
          "% of maternal deaths reviewed against the reported maternal deaths",
        unit: "Percentage",
        target_value: 80, // CMO level
        calculation_type: "PERCENTAGE",
        data_source: "HMIS",
        sort_order: 10,
      },
      {
        code: "JSY_BENEF",
        name: "JSY Beneficiaries",
        description:
          "Percentage of beneficiaries availed JSY benefits against RoP approval",
        unit: "Percentage",
        target_value: 25,
        calculation_type: "PERCENTAGE",
        data_source: "State Report",
        sort_order: 11,
      },
      {
        code: "NQAS_CERT",
        name: "NQAS certification of SUMAN notified facilities",
        description:
          "Percentage of SUMAN notified facilities received NQAS/Part NQAS nationally certification against target",
        unit: "Percentage",
        target_value: 11,
        calculation_type: "PERCENTAGE",
        data_source: "NHSRC Report",
        sort_order: 12,
      },
    ],
  },
  {
    name: "Child Health (CH) and RBSK",
    description: "Child Health and Rashtriya Bal Swasthya Karyakram indicators",
    sort_order: 2,
    indicators: [
      // Add child health indicators based on the continuation of the spreadsheet
    ],
  },
  {
    name: "Immunization",
    description: "Routine Immunization and special immunization programs",
    sort_order: 3,
    indicators: [
      // Add immunization indicators
    ],
  },
];

async function seedIndicators() {
  console.log("🌱 Seeding health indicators...");

  try {
    // Clear existing data
    await prisma.monthlyHealthData.deleteMany();
    await prisma.indicatorTarget.deleteMany();
    await prisma.indicator.deleteMany();
    await prisma.indicatorCategory.deleteMany();

    console.log("✅ Cleared existing indicator data");

    // Seed categories and indicators
    for (const categoryData of indicatorCategories) {
      const { indicators, ...categoryInfo } = categoryData;

      const category = await prisma.indicatorCategory.create({
        data: categoryInfo,
      });

      console.log(`✅ Created category: ${category.name}`);

      // Create indicators for this category
      for (const indicatorData of indicators) {
        const indicator = await prisma.indicator.create({
          data: {
            ...indicatorData,
            category_id: category.id,
          },
        });

        console.log(
          `  ✅ Created indicator: ${indicator.code} - ${indicator.name}`
        );

        // Create default targets for all districts
        const districts = await prisma.district.findMany();

        for (const district of districts) {
          await prisma.indicatorTarget.create({
            data: {
              indicator_id: indicator.id,
              district_id: district.id,
              target_value: indicator.target_value || 0,
              target_period: "2024-25",
              is_active: true,
            },
          });
        }

        console.log(`    ✅ Created targets for ${districts.length} districts`);
      }
    }

    console.log("🎉 Successfully seeded all health indicators!");

    // Summary
    const totalCategories = await prisma.indicatorCategory.count();
    const totalIndicators = await prisma.indicator.count();
    const totalTargets = await prisma.indicatorTarget.count();

    console.log(`
📊 Seeding Summary:
   Categories: ${totalCategories}
   Indicators: ${totalIndicators} 
   Targets: ${totalTargets}
    `);
  } catch (error) {
    console.error("❌ Error seeding indicators:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedIndicators().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedIndicators;
