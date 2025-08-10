import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seedWorkerAllocationConfig() {
  console.log("🌱 Seeding Worker Allocation Configuration...\n");

  try {
    // Get facility types
    const facilityTypes = await prisma.facilityType.findMany();
    console.log(`📋 Found ${facilityTypes.length} facility types`);

    // Define worker allocation configuration based on requirements
    const workerAllocationConfig = [
      // Subcenters (SC_HWC)
      {
        facilityTypeName: "SC_HWC",
        workerType: "hwo",
        workerRole: "HWO",
        maxCount: 1,
        allocatedAmount: 15000,
        description: "Health & Wellness Officer - Single position per facility",
      },
      {
        facilityTypeName: "SC_HWC",
        workerType: "hw",
        workerRole: "HW",
        maxCount: 3, // Multiple HW workers allowed
        allocatedAmount: 1500,
        description:
          "Health Workers - Multiple positions allowed, total allocation 1500",
      },
      {
        facilityTypeName: "SC_HWC",
        workerType: "asha",
        workerRole: "ASHA",
        maxCount: 5, // Multiple ASHA workers allowed
        allocatedAmount: 1500,
        description:
          "ASHA Workers - Multiple positions allowed, total allocation 1500",
      },

      // AYUSH (A_HWC)
      {
        facilityTypeName: "A_HWC",
        workerType: "ayush_mo",
        workerRole: "AYUSH MO",
        maxCount: 1,
        allocatedAmount: 15000,
        description: "AYUSH Medical Officer - Single position per facility",
      },
      {
        facilityTypeName: "A_HWC",
        workerType: "hw",
        workerRole: "HW",
        maxCount: 3, // Multiple HW workers allowed
        allocatedAmount: 1500,
        description:
          "Health Workers - Multiple positions allowed, total allocation 1500",
      },
      {
        facilityTypeName: "A_HWC",
        workerType: "asha",
        workerRole: "ASHA",
        maxCount: 3, // Multiple ASHA workers allowed
        allocatedAmount: 1000,
        description:
          "ASHA Workers - Multiple positions allowed, total allocation 1000",
      },

      // PHC
      {
        facilityTypeName: "PHC",
        workerType: "mo",
        workerRole: "MO",
        maxCount: 1,
        allocatedAmount: 7500,
        description: "Medical Officer - Single position per facility",
      },
      {
        facilityTypeName: "PHC",
        workerType: "colocated_sc_hw",
        workerRole: "Colocated SC HW",
        maxCount: 3, // Multiple colocated SC HW workers allowed
        allocatedAmount: 1500,
        description:
          "Colocated Sub Centre Health Workers - Multiple positions allowed, total allocation 1500",
      },
      {
        facilityTypeName: "PHC",
        workerType: "asha",
        workerRole: "ASHA",
        maxCount: 3, // Multiple ASHA workers allowed
        allocatedAmount: 1000,
        description:
          "ASHA Workers - Multiple positions allowed, total allocation 1000",
      },

      // UPHC (Urban Primary Health Centre) - Team-based only
      {
        facilityTypeName: "UPHC",
        workerType: "mo",
        workerRole: "MO",
        maxCount: 1,
        allocatedAmount: 7500,
        description: "Medical Officer - Single position per facility (team-based)",
      },

      // U_HWC (Urban Health & Wellness Centre) - Team-based only
      {
        facilityTypeName: "U_HWC",
        workerType: "mo",
        workerRole: "MO",
        maxCount: 1,
        allocatedAmount: 7500,
        description: "Medical Officer - Single position per facility (team-based)",
      },
    ];

    // Create worker allocation configurations
    const createdConfigs = [];
    for (const config of workerAllocationConfig) {
      const facilityType = facilityTypes.find(
        (ft) => ft.name === config.facilityTypeName
      );

      if (!facilityType) {
        console.log(
          `⚠️  Facility type "${config.facilityTypeName}" not found, skipping...`
        );
        continue;
      }

      try {
        const workerConfig = await prisma.workerAllocationConfig.create({
          data: {
            facility_type_id: facilityType.id,
            worker_type: config.workerType,
            worker_role: config.workerRole,
            max_count: config.maxCount,
            allocated_amount: config.allocatedAmount,
            description: config.description,
            is_active: true,
          },
        });

        createdConfigs.push(workerConfig);
        console.log(
          `✅ Created ${config.workerRole} for ${config.facilityTypeName}: ₹${config.allocatedAmount} (max: ${config.maxCount})`
        );
      } catch (error) {
        if (error.code === "P2002") {
          console.log(
            `⚠️  ${config.workerRole} for ${config.facilityTypeName} already exists, skipping...`
          );
        } else {
          console.error(
            `❌ Error creating ${config.workerRole} for ${config.facilityTypeName}:`,
            error
          );
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total Configurations Created: ${createdConfigs.length}`);

    // Display summary by facility type
    const facilityTypeSummary = {};
    createdConfigs.forEach((config) => {
      const facilityType = facilityTypes.find(
        (ft) => ft.id === config.facility_type_id
      );
      if (facilityType) {
        if (!facilityTypeSummary[facilityType.name]) {
          facilityTypeSummary[facilityType.name] = [];
        }
        facilityTypeSummary[facilityType.name].push(config);
      }
    });

    console.log(`\n🏥 Configuration by Facility Type:`);
    Object.entries(facilityTypeSummary).forEach(([facilityType, configs]) => {
      console.log(`   ${facilityType}:`);
      configs.forEach((config) => {
        console.log(
          `     - ${config.worker_role}: ₹${config.allocated_amount} (max: ${config.max_count})`
        );
      });
    });

    console.log(
      "\n✅ Worker allocation configuration seeding completed successfully!"
    );
  } catch (error) {
    console.error("❌ Error seeding worker allocation configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedWorkerAllocationConfig();
