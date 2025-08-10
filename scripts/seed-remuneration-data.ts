import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Remuneration data based on facility-specific indicator files
const remunerationData = {
  // PHC (Primary Health Centre)
  PHC: {
    total_amount: 7500,
    indicators: [
      { code: "TF001", with_tb: 500, without_tb: 500 }, // Total Footfall
      { code: "WS001", with_tb: 500, without_tb: 500 }, // Total Wellness sessions
      { code: "TC001", with_tb: 1000, without_tb: 1000 }, // Teleconsultation
      { code: "AF001", with_tb: 300, without_tb: 300 }, // Total ANC footfall
      { code: "HT001", with_tb: 300, without_tb: 300 }, // Pregnant women tested for Hb
      { code: "TS001", with_tb: 300, without_tb: 300 }, // Individuals screened for TB
      { code: "CT001", with_tb: 300, without_tb: 0 }, // Household visited for TB contact tracing
      { code: "DC001", with_tb: 300, without_tb: 0 }, // No. of TB patients visited for Differentiated TB Care
      { code: "RS001", with_tb: 300, without_tb: 300 }, // RI sessions held
      { code: "RF001", with_tb: 300, without_tb: 300 }, // RI footfall
      { code: "CB001", with_tb: 250, without_tb: 300 }, // CBAC filled for the month
      { code: "HS001", with_tb: 250, without_tb: 300 }, // HTN screened for the month
      { code: "DS001", with_tb: 250, without_tb: 300 }, // DM screened for the month
      { code: "OC001", with_tb: 250, without_tb: 300 }, // Oral Ca. Screened for the month
      { code: "BC001", with_tb: 250, without_tb: 300 }, // Breast & Cervical Ca. screened for the month
      { code: "ND001", with_tb: 500, without_tb: 600 }, // NCD Diagnosed & Tx completed
      { code: "PS001", with_tb: 300, without_tb: 300 }, // Patient satisfaction score for the month
      { code: "EP001", with_tb: 300, without_tb: 300 }, // No of Elderly & Palliative patients visited
      { code: "EC001", with_tb: 300, without_tb: 300 }, // No of Elderly clinic conducted
      { code: "JM001", with_tb: 500, without_tb: 500 }, // No of JAS meeting conducted
      { code: "DI001", with_tb: 250, without_tb: 500 }, // No. of issues generated in DVDMS
    ],
  },

  // UPHC (Urban Primary Health Centre)
  UPHC: {
    total_amount: 7500,
    indicators: [
      { code: "TF001", with_tb: 500, without_tb: 500 }, // Total Footfall
      { code: "WS001", with_tb: 1500, without_tb: 1500 }, // Total Wellness sessions
      { code: "TC001", with_tb: 2000, without_tb: 2000 }, // Teleconsultation
      { code: "TS001", with_tb: 500, without_tb: 500 }, // Individuals screened for TB
      { code: "ND001", with_tb: 500, without_tb: 500 }, // NCD Diagnosed & Tx completed
      { code: "PS001", with_tb: 500, without_tb: 500 }, // Patient satisfaction score for the month
      { code: "EC001", with_tb: 500, without_tb: 500 }, // No of Elderly clinic conducted
      { code: "JM001", with_tb: 1000, without_tb: 1000 }, // No of JAS meeting conducted
      { code: "DI001", with_tb: 500, without_tb: 500 }, // No. of issues generated in DVDMS
    ],
  },

  // SC_HWC (Sub Centre - Health & Wellness Centre)
  SC_HWC: {
    total_amount: 15000,
    indicators: [
      { code: "TF001", with_tb: 1000, without_tb: 1000 }, // Total Footfall
      { code: "WS001", with_tb: 500, without_tb: 500 }, // Total Wellness sessions
      { code: "TC001", with_tb: 2000, without_tb: 2500 }, // Teleconsultation
      { code: "AF001", with_tb: 500, without_tb: 0 }, // Total ANC footfall
      { code: "HT001", with_tb: 500, without_tb: 0 }, // Pregnant women tested for Hb
      { code: "TS001", with_tb: 500, without_tb: 1000 }, // Individuals screened for TB
      { code: "CT001", with_tb: 500, without_tb: 0 }, // Household visited for TB contact tracing
      { code: "DC001", with_tb: 500, without_tb: 0 }, // No. of TB patients visited for Differentiated TB Care
      { code: "RS001", with_tb: 500, without_tb: 500 }, // RI sessions held
      { code: "RF001", with_tb: 500, without_tb: 500 }, // RI footfall
      { code: "CB001", with_tb: 500, without_tb: 500 }, // CBAC filled for the month
      { code: "HS001", with_tb: 500, without_tb: 1000 }, // HTN screened for the month
      { code: "DS001", with_tb: 500, without_tb: 1000 }, // DM screened for the month
      { code: "OC001", with_tb: 500, without_tb: 500 }, // Oral Ca. Screened for the month
      { code: "BC001", with_tb: 500, without_tb: 500 }, // Breast & Cervical Ca. screened for the month
      { code: "PS001", with_tb: 1000, without_tb: 1000 }, // Patient satisfaction score for the month
      { code: "EP001", with_tb: 500, without_tb: 500 }, // No of Elderly & Palliative patients visited
      { code: "EC001", with_tb: 500, without_tb: 500 }, // No of Elderly clinic conducted
      { code: "ES001", with_tb: 800, without_tb: 1000 }, // Whether Elderly Support Group (Sanjivini) is formed
      { code: "EA001", with_tb: 700, without_tb: 500 }, // If Yes, any activity conducted during the month
      { code: "JM001", with_tb: 1000, without_tb: 1000 }, // No of JAS meeting conducted
      { code: "DI001", with_tb: 1000, without_tb: 1000 }, // No. of issues generated in DVDMS
    ],
  },

  // U_HWC (Urban Health & Wellness Centre)
  U_HWC: {
    total_amount: 16600,
    indicators: [
      { code: "TF001", with_tb: 2000, without_tb: 2000 }, // Total Footfall
      { code: "WS001", with_tb: 2000, without_tb: 2000 }, // Total Wellness sessions
      { code: "TC001", with_tb: 3000, without_tb: 3000 }, // Teleconsultation
      { code: "TS001", with_tb: 2000, without_tb: 2000 }, // Individuals screened for TB
      { code: "CT001", with_tb: 2000, without_tb: 0 }, // Household visited for TB contact tracing
      { code: "DC001", with_tb: 1000, without_tb: 0 }, // No. of TB patients visited for Differentiated TB Care
      { code: "EP001", with_tb: 1000, without_tb: 2000 }, // No of Elderly & Palliative patients visited
      { code: "EC001", with_tb: 600, without_tb: 2000 }, // No of Elderly clinic conducted
      { code: "JM001", with_tb: 2000, without_tb: 2000 }, // No of JAS meeting conducted
      { code: "DI001", with_tb: 1000, without_tb: 1600 }, // No. of issues generated in DVDMS
    ],
  },

  // A_HWC (Ayush Health & Wellness Centre)
  A_HWC: {
    total_amount: 15000,
    indicators: [
      { code: "TF001", with_tb: 1000, without_tb: 1000 }, // Total Footfall
      { code: "WS001", with_tb: 500, without_tb: 500 }, // Total Wellness sessions
      { code: "PP001", with_tb: 1000, without_tb: 1000 }, // No of Prakriti Parikshan conducted
      { code: "TC001", with_tb: 1500, without_tb: 2000 }, // Teleconsultation
      { code: "AF001", with_tb: 500, without_tb: 0 }, // Total ANC footfall
      { code: "HT001", with_tb: 500, without_tb: 0 }, // Pregnant women tested for Hb
      { code: "TS001", with_tb: 500, without_tb: 1000 }, // Individuals screened for TB
      { code: "CT001", with_tb: 500, without_tb: 0 }, // Household visited for TB contact tracing
      { code: "DC001", with_tb: 500, without_tb: 0 }, // No. of TB patients visited for Differentiated TB Care
      { code: "RS001", with_tb: 500, without_tb: 500 }, // RI sessions held
      { code: "RF001", with_tb: 500, without_tb: 500 }, // RI footfall
      { code: "CB001", with_tb: 500, without_tb: 500 }, // CBAC filled for the month
      { code: "HS001", with_tb: 500, without_tb: 1000 }, // HTN screened for the month
      { code: "DS001", with_tb: 500, without_tb: 1000 }, // DM screened for the month
      { code: "OC001", with_tb: 500, without_tb: 500 }, // Oral Ca. Screened for the month
      { code: "BC001", with_tb: 500, without_tb: 500 }, // Breast & Cervical Ca. screened for the month
      { code: "PS001", with_tb: 500, without_tb: 500 }, // Patient satisfaction score for the month
      { code: "EP001", with_tb: 500, without_tb: 500 }, // No of Elderly & Palliative patients visited
      { code: "EC001", with_tb: 500, without_tb: 500 }, // No of Elderly clinic conducted
      { code: "ES001", with_tb: 1000, without_tb: 1000 }, // Whether Elderly Support Group (Sanjivini) is formed
      { code: "EA001", with_tb: 500, without_tb: 500 }, // If Yes, any activity conducted during the month
      { code: "JM001", with_tb: 1000, without_tb: 1000 }, // No of JAS meeting conducted
      { code: "DI001", with_tb: 1000, without_tb: 1000 }, // No. of issues generated in DVDMS
    ],
  },
};

async function seedRemunerationData() {
  try {
    console.log("🌱 Starting remuneration data seeding...");

    // Get all facility types
    const facilityTypes = await prisma.facilityType.findMany({
      where: { is_active: true },
    });

    console.log(`Found ${facilityTypes.length} active facility types`);

    for (const facilityType of facilityTypes) {
      const facilityData =
        remunerationData[facilityType.name as keyof typeof remunerationData];

      if (!facilityData) {
        console.log(
          `⚠️ No remuneration data found for facility type: ${facilityType.name}`
        );
        continue;
      }

      console.log(`\n💰 Processing ${facilityType.name} (${facilityType.id})`);

      // Create or update facility type remuneration
      let facilityTypeRemuneration =
        await prisma.facilityTypeRemuneration.upsert({
          where: { facility_type_id: facilityType.id },
          update: {
            total_amount: facilityData.total_amount,
          },
          create: {
            facility_type_id: facilityType.id,
            total_amount: facilityData.total_amount,
          },
        });

      console.log(
        `✅ Facility type remuneration created/updated with total: Rs. ${facilityData.total_amount}`
      );

      // Process each indicator for this facility type
      for (const indicatorData of facilityData.indicators) {
        // Find the indicator by code
        const indicator = await prisma.indicator.findFirst({
          where: { code: indicatorData.code },
          select: {
            id: true,
            code: true,
            name: true,
            applicable_facility_types: true,
          },
        });

        if (!indicator) {
          console.log(`⚠️ Indicator not found: ${indicatorData.code}`);
          continue;
        }

        // Check if this indicator is applicable to this facility type
        if (!indicator.applicable_facility_types) {
          console.log(
            `⚠️ Indicator ${indicatorData.code} has no applicable facility types`
          );
          continue;
        }

        // applicable_facility_types is already an array
        const applicableTypes = Array.isArray(
          indicator.applicable_facility_types
        )
          ? indicator.applicable_facility_types
          : indicator.applicable_facility_types.split(",");

        if (!applicableTypes.includes(facilityType.name)) {
          console.log(
            `⚠️ Indicator ${indicatorData.code} is not applicable to ${facilityType.name}`
          );
          continue;
        }

        // Create or update indicator remuneration
        await prisma.indicatorRemuneration.upsert({
          where: {
            facility_type_remuneration_id_indicator_id: {
              facility_type_remuneration_id: facilityTypeRemuneration.id,
              indicator_id: indicator.id,
            },
          },
          update: {
            base_amount: indicatorData.with_tb,
            conditional_amount: indicatorData.without_tb,
            condition_type: "WITH_TB_PATIENT",
          },
          create: {
            facility_type_remuneration_id: facilityTypeRemuneration.id,
            indicator_id: indicator.id,
            base_amount: indicatorData.with_tb,
            conditional_amount: indicatorData.without_tb,
            condition_type: "WITH_TB_PATIENT",
          },
        });

        console.log(
          `  ✅ ${indicator.code} (${indicator.name}): Rs. ${indicatorData.with_tb} / Rs. ${indicatorData.without_tb}`
        );
      }
    }

    console.log("\n🎉 Remuneration data seeding completed successfully!");

    // Summary
    const totalConfigs = await prisma.indicatorRemuneration.count();
    const totalFacilityTypes = await prisma.facilityTypeRemuneration.count();

    console.log(`\n📊 Summary:`);
    console.log(`  - Facility Types: ${totalFacilityTypes}`);
    console.log(`  - Total Indicator Configurations: ${totalConfigs}`);
  } catch (error) {
    console.error("❌ Error seeding remuneration data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedRemunerationData()
  .then(() => {
    console.log("✅ Remuneration seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Remuneration seeding failed:", error);
    process.exit(1);
  });
