import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Mapping from field codes to indicator codes
const fieldToIndicatorMapping = {
  total_footfall: "TF001",
  wellness_sessions_conducted: "WS001",
  prakriti_parikshan_conducted: "PP001",
  teleconsultation_conducted: "TC001",
  anc_footfall: "AF001",
  anc_tested_hb: "HT001",
  tb_screenings: "TS001",
  tb_contact_tracing_households: "CT001",
  tb_differentiated_care_visits: "DC001",
  ri_sessions_held: "RS001",
  ri_footfall: "RF001",
  cbac_forms_filled: "CB001",
  htn_screened: "HS001",
  dm_screened: "DS001",
  oral_cancer_screened: "OC001",
  breast_cervical_cancer_screened: "BC001",
  ncd_diagnosed_tx_completed: "ND001",
  patient_satisfaction_score: "PS001",
  elderly_palliative_visits: "EP001",
  elderly_clinic_conducted: "EC001",
  jas_meetings_conducted: "JM001",
  dvdms_issues_generated: "DI001",
  elderly_support_group_formed: "ES001",
  elderly_support_group_activity: "EA001",
};

// Comprehensive remuneration configuration based on indicator source files
const remunerationConfig = {
  // Total Footfall (M&F) - upto 3%-5%
  TF001: {
    PHC: 500,
    UPHC: 2000,
    SC_HWC: 1000,
    U_HWC: 2000,
    A_HWC: 1000,
  },
  // Total Footfall (M&F) - PHC specific
  TF001_PHC: {
    PHC: 500,
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // Total Footfall (M&F) - SC-HWC specific
  TF001_SC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 1000,
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // Total Footfall (M&F) - U-HWC specific
  TF001_UHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 2000,
    A_HWC: 0, // Not applicable
  },
  // Total Footfall (M&F) - A-HWC specific
  TF001_AHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 1000,
  },
  // Total Footfall (M&F) - UPHC specific
  TF001_UPHC: {
    PHC: 0, // Not applicable
    UPHC: 2000,
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // Total Wellness sessions - 5 above to 10
  WS001: {
    PHC: 500,
    UPHC: 1500,
    SC_HWC: 500,
    U_HWC: 2000,
    A_HWC: 500,
  },
  // Teleconsultation - 25 above, upto 50
  TC001: {
    PHC: 1000,
    UPHC: 2000,
    SC_HWC: 0, // moved to TC001_SC
    U_HWC: 3000,
    A_HWC: 0, // moved to TC001_AHWC
  },
  // Teleconsultation - SC-HWC specific (new: 10-25 target band)
  TC001_SC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 2000,
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // Teleconsultation - A-HWC specific (new: 10-25 target band)
  TC001_AHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 1500,
  },
  // ANC Footfall - upto 50% only
  AF001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // ANC Footfall - PHC specific
  AF001_PHC: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // ANC Footfall - SC-HWC specific
  AF001_SC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // ANC Footfall - A-HWC specific
  AF001_AHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // ANC Hb Testing - upto 50% only
  HT001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // TB Screenings - upto 50% only
  TS001: {
    PHC: 300,
    UPHC: 500,
    SC_HWC: 500,
    U_HWC: 2000,
    A_HWC: 500,
  },
  // TB Screenings - PHC specific
  TS001_PHC: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // TB Screenings - SC-HWC specific
  TS001_SC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // TB Screenings - U-HWC specific
  TS001_UHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 2000,
    A_HWC: 0, // Not applicable
  },
  // TB Screenings - A-HWC specific
  TS001_AHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // TB Screenings - UPHC specific
  TS001_UPHC: {
    PHC: 0, // Not applicable
    UPHC: 500,
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // TB Contact Tracing - upto 50% above
  CT001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 2000,
    A_HWC: 500,
  },
  // TB Differentiated Care - upto 50% above
  DC001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 1000,
    A_HWC: 500,
  },
  // RI Sessions - 100%
  RS001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // RI Footfall - upto 50% above
  RF001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // CBAC Forms - 100% only
  CB001: {
    PHC: 250,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // HTN Screened - 100% only
  HS001: {
    PHC: 250,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // DM Screened - 100% only
  DS001: {
    PHC: 250,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // Oral Cancer Screened - 100% only
  OC001: {
    PHC: 250,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // Breast Cervical Cancer Screened - 100% only
  BC001: {
    PHC: 250,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // NCD Diagnosed & Tx Completed - 100% only
  ND001: {
    PHC: 500,
    UPHC: 500,
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // Patient Satisfaction Score - 70% above only
  PS001: {
    PHC: 300,
    UPHC: 500,
    SC_HWC: 1000,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
  // Elderly Palliative Visits - 80% above only
  EP001: {
    PHC: 300,
    UPHC: 0, // Not applicable
    SC_HWC: 500,
    U_HWC: 1000,
    A_HWC: 500,
  },
  // Elderly Clinic Conducted - 100%
  EC001: {
    PHC: 300,
    UPHC: 500,
    SC_HWC: 500,
    U_HWC: 600,
    A_HWC: 500,
  },
  // JAS Meetings - 100%
  JM001: {
    PHC: 500,
    UPHC: 1000,
    SC_HWC: 1000,
    U_HWC: 2000,
    A_HWC: 1000,
  },
  // DVDMS Issues - 100%
  DI001: {
    PHC: 250,
    UPHC: 500,
    SC_HWC: 1000,
    U_HWC: 1000,
    A_HWC: 1000,
  },
  // DVDMS Issues - SC specific
  DV001_SC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 1000,
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // DVDMS Issues - PHC specific
  DV001_PHC: {
    PHC: 250,
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 0, // Not applicable
  },
  // DVDMS Issues - U-HWC specific
  DV001_UHWC: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 1000,
    A_HWC: 0, // Not applicable
  },
  // Prakriti Parikshan (A-HWC only) - 80% above only
  PP001: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 0, // Not applicable
    U_HWC: 0, // Not applicable
    A_HWC: 1000,
  },
  // Elderly Support Group (Sanjivini) is formed
  ES001: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 800,
    U_HWC: 0, // Not applicable
    A_HWC: 1000,
  },
  // Elderly Support Group activity conducted
  EA001: {
    PHC: 0, // Not applicable
    UPHC: 0, // Not applicable
    SC_HWC: 700,
    U_HWC: 0, // Not applicable
    A_HWC: 500,
  },
};

async function main() {
  try {
    console.log("Setting up comprehensive remuneration configuration...");

    // Get facility types
    const facilityTypes = await prisma.facilityType.findMany({
      select: { id: true, name: true },
    });

    // Get all indicators
    const indicators = await prisma.indicator.findMany({
      select: { id: true, code: true, name: true },
    });

    // Set up remuneration for each facility type and indicator
    for (const facilityType of facilityTypes) {
      console.log(`\n📋 Setting up remuneration for ${facilityType.name}...`);

      // Check if facility type remuneration already exists
      let facilityTypeRemuneration =
        await prisma.facilityTypeRemuneration.findUnique({
          where: { facility_type_id: facilityType.id },
        });

      if (!facilityTypeRemuneration) {
        // Create new facility type remuneration with total amount
        const totalAmount = Object.values(remunerationConfig.TF001).reduce(
          (sum, amount) => sum + amount,
          0
        );
        facilityTypeRemuneration = await prisma.facilityTypeRemuneration.create(
          {
            data: {
              facility_type_id: facilityType.id,
              total_amount: totalAmount,
            },
          }
        );
        console.log(
          `Created remuneration for ${facilityType.name}: Rs. ${totalAmount}`
        );
      }

      // Set up indicator remunerations
      for (const indicator of indicators) {
        const indicatorConfig =
          remunerationConfig[indicator.code as keyof typeof remunerationConfig];

        if (!indicatorConfig) {
          console.warn(
            `No remuneration config for indicator: ${indicator.code}`
          );
          continue;
        }

        const amount =
          indicatorConfig[facilityType.name as keyof typeof indicatorConfig];

        if (amount === 0 || amount === undefined) {
          console.log(
            `Skipping ${indicator.code} for ${facilityType.name} (not applicable)`
          );
          continue;
        }

        // Check if indicator remuneration already exists
        const existingIndicatorRemuneration =
          await prisma.indicatorRemuneration.findUnique({
            where: {
              facility_type_remuneration_id_indicator_id: {
                facility_type_remuneration_id: facilityTypeRemuneration.id,
                indicator_id: indicator.id,
              },
            },
          });

        if (!existingIndicatorRemuneration) {
          // Create indicator remuneration
          await prisma.indicatorRemuneration.create({
            data: {
              facility_type_remuneration_id: facilityTypeRemuneration.id,
              indicator_id: indicator.id,
              base_amount: amount,
            },
          });
          console.log(`  ✅ ${indicator.code}: Rs. ${amount}`);
        } else {
          // Update existing indicator remuneration
          await prisma.indicatorRemuneration.update({
            where: { id: existingIndicatorRemuneration.id },
            data: { base_amount: amount },
          });
          console.log(`  🔄 ${indicator.code}: Rs. ${amount} (updated)`);
        }
      }
    }

    console.log("\n🎯 Remuneration Configuration Summary:");
    console.log("======================================");

    for (const facilityType of facilityTypes) {
      console.log(`\n📊 ${facilityType.name}:`);
      const facilityConfig = Object.entries(remunerationConfig)
        .map(([indicator, config]) => ({
          indicator,
          amount: config[facilityType.name as keyof typeof config],
        }))
        .filter((item) => item.amount > 0);

      facilityConfig.forEach((item) => {
        console.log(`  - ${item.indicator}: Rs. ${item.amount}`);
      });
    }

    console.log(
      "\n✅ Comprehensive remuneration configuration setup complete!"
    );
  } catch (error) {
    console.error("Error setting up remuneration configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
