import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seedFieldsComplete() {
  console.log("🌱 Starting comprehensive field seeding...");

  // Clear existing data in the correct order to avoid foreign key constraints
  console.log("🗑️ Clearing existing data...");
  
  // Clear dependent tables first
  await prisma.fieldValue.deleteMany();
  await prisma.facilityFieldDefaults.deleteMany();
  await prisma.performanceCalculation.deleteMany();
  await prisma.indicatorRemuneration.deleteMany();
  await prisma.indicatorWorkerAllocation.deleteMany();
  await prisma.facilityTarget.deleteMany();
  await prisma.monthlyHealthData.deleteMany();
  
  // Clear main tables
  await prisma.indicator.deleteMany();
  await prisma.field.deleteMany();

  console.log("✅ Existing data cleared successfully!");

  // Create all fields based on the indicator markdown files
  const fields = [
    // ADMIN FIELDS (Pre-filled by admin)
    {
      code: "total_population",
      name: "Total Population",
      description: "Total population of the facility's catchment area",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 1,
    },
    {
      code: "population_18_plus",
      name: "Population 18+",
      description: "Population aged 18 and above",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 2,
    },
    {
      code: "population_30_plus",
      name: "Population 30+",
      description: "Population aged 30 and above",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 3,
    },
    {
      code: "population_30_plus_female",
      name: "Female Population 30+",
      description: "Female population aged 30 and above",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 4,
    },
    {
      code: "anc_due_list",
      name: "ANC Due List",
      description: "Number of pregnant women due for ANC",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 5,
    },
    {
      code: "ri_sessions_planned",
      name: "RI Sessions Planned",
      description: "Number of RI sessions planned for the month",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 6,
    },
    {
      code: "ri_beneficiaries_due",
      name: "RI Beneficiaries Due",
      description: "Total beneficiaries due for RI",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 7,
    },
    {
      code: "bedridden_patients",
      name: "Bed-ridden Patients",
      description: "Total bed-ridden patients requiring home care",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 8,
    },
    {
      code: "pulmonary_tb_patients",
      name: "Pulmonary TB Patients",
      description: "Total pulmonary TB patients under treatment",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 9,
    },
    {
      code: "total_tb_patients",
      name: "Total TB Patients",
      description: "Total TB patients under treatment",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 10,
    },
    {
      code: "ncd_referred_from_sc",
      name: "NCD Referred from SC",
      description: "Total referred from SC as per NCD portal",
      user_type: "ADMIN" as const,
      field_type: "FACILITY_SPECIFIC" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 11,
    },
    {
      code: "patient_satisfaction_max",
      name: "Patient Satisfaction Max Score",
      description: "Maximum score for patient satisfaction (5 points)",
      user_type: "ADMIN" as const,
      field_type: "CONSTANT" as const,
      field_category: "TARGET_FIELD" as const,
      default_value: "5",
      sort_order: 12,
    },

    // TARGET FIELDS (Generic targets for facility-specific indicators)
    {
      code: "target_wellness_sessions",
      name: "Target Wellness Sessions",
      description: "Target for wellness sessions (facility-specific mapping in formula_config)",
      user_type: "ADMIN" as const,
      field_type: "CONSTANT" as const,
      field_category: "TARGET_FIELD" as const,
      default_value: "10",
      sort_order: 100,
    },
    {
      code: "target_teleconsultation",
      name: "Target Teleconsultation",
      description: "Target for teleconsultation (facility-specific mapping in formula_config)",
      user_type: "ADMIN" as const,
      field_type: "CONSTANT" as const,
      field_category: "TARGET_FIELD" as const,
      default_value: "50",
      sort_order: 101,
    },
    {
      code: "target_elderly_clinic",
      name: "Target Elderly Clinic",
      description: "Target for elderly clinic (facility-specific mapping in formula_config)",
      user_type: "ADMIN" as const,
      field_type: "CONSTANT" as const,
      field_category: "TARGET_FIELD" as const,
      default_value: "4",
      sort_order: 102,
    },
    {
      code: "target_jas_meetings",
      name: "Target JAS Meetings",
      description: "Target for JAS meetings (facility-specific mapping in formula_config)",
      user_type: "ADMIN" as const,
      field_type: "CONSTANT" as const,
      field_category: "TARGET_FIELD" as const,
      default_value: "1",
      sort_order: 103,
    },
    {
      code: "target_dvdms_issues",
      name: "Target DVDMS Issues",
      description: "Target for DVDMS issues (facility-specific mapping in formula_config)",
      user_type: "ADMIN" as const,
      field_type: "CONSTANT" as const,
      field_category: "TARGET_FIELD" as const,
      default_value: "50",
      sort_order: 104,
    },

    // FACILITY FIELDS (Submitted by facilities)
    {
      code: "total_footfall_phc_colocated_sc",
      name: "Total Footfall (M&F) PHC+colocated SC",
      description: "Total footfall for PHC including colocated SC",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 201,
    },
    {
      code: "total_footfall_sc_clinic",
      name: "Total footfall (SC+Clinic)",
      description: "Total footfall for SC including clinic",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 202,
    },
    {
      code: "total_footfall_uhwc",
      name: "Total Footfall (M&F)",
      description: "Total footfall for U-HWC",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 203,
    },
    {
      code: "wellness_sessions_conducted",
      name: "Wellness Sessions Conducted",
      description: "Total wellness sessions conducted during the month",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 204,
    },
    {
      code: "prakriti_parikshan_conducted",
      name: "Prakriti Parikshan Conducted",
      description: "Number of Prakriti Parikshan conducted",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 203,
    },
    {
      code: "teleconsultation_conducted",
      name: "Teleconsultation Conducted",
      description: "Total teleconsultation conducted",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 204,
    },
    {
      code: "anc_footfall",
      name: "ANC Footfall",
      description: "Total ANC beneficiary irrespective of gestation",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 205,
    },
    {
      code: "anc_tested_hb",
      name: "ANC Tested for Hb",
      description: "Total ANC tested for Hb",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 206,
    },
    {
      code: "tb_screenings",
      name: "TB Screenings",
      description: "Individuals screened for TB",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 207,
    },
    {
      code: "tb_contact_tracing_households",
      name: "TB Contact Tracing Households",
      description: "Households visited for TB contact tracing",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 208,
    },
    {
      code: "tb_differentiated_care_visits",
      name: "TB Differentiated Care Visits",
      description: "TB patients visited for differentiated care",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 209,
    },
    {
      code: "ri_sessions_held",
      name: "RI Sessions Held",
      description: "RI sessions held",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 210,
    },
    {
      code: "ri_footfall",
      name: "RI Footfall",
      description: "Total RI footfall",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 211,
    },
    {
      code: "cbac_forms_filled",
      name: "CBAC Forms Filled",
      description: "CBAC filled for the month (including rescreened)",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 212,
    },
    {
      code: "htn_screened",
      name: "HTN Screened",
      description: "HTN screened for the month (including rescreened)",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 213,
    },
    {
      code: "dm_screened",
      name: "DM Screened",
      description: "DM screened for the month (including rescreened)",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 214,
    },
    {
      code: "oral_cancer_screened",
      name: "Oral Cancer Screened",
      description: "Oral cancer screened for the month",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 215,
    },
    {
      code: "breast_cervical_cancer_screened",
      name: "Breast & Cervical Cancer Screened",
      description: "Breast & cervical cancer screened for the month",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 216,
    },
    {
      code: "ncd_diagnosed_tx_completed",
      name: "NCD Diagnosed & Tx Completed",
      description: "NCD diagnosed and treatment completed",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 217,
    },
    {
      code: "patient_satisfaction_score",
      name: "Patient Satisfaction Score",
      description: "Patient satisfaction score for the month",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 218,
    },
    {
      code: "elderly_palliative_visits",
      name: "Elderly & Palliative Visits",
      description: "Number of elderly and palliative patients visited",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 219,
    },
    {
      code: "elderly_clinic_conducted",
      name: "Elderly Clinic Conducted",
      description: "Number of elderly clinic conducted",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 220,
    },
    {
      code: "jas_meetings_conducted",
      name: "JAS Meetings Conducted",
      description: "Number of JAS meetings conducted",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 221,
    },
    {
      code: "dvdms_issues_generated",
      name: "DVDMS Issues Generated",
      description: "Number of issues generated in DVDMS",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 222,
    },

    // Binary fields
    {
      code: "elderly_support_group_formed",
      name: "Whether Elderly Support Group (Sanjivini) is formed",
      description: "Whether Elderly Support Group (Sanjivini) is formed",
      user_type: "FACILITY" as const,
      field_type: "BINARY" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 301,
    },
    {
      code: "elderly_support_group_activity",
      name: "If Yes, any activity conducted during the month",
      description: "If Yes, any activity conducted during the month",
      user_type: "FACILITY" as const,
      field_type: "MONTHLY_COUNT" as const,
      field_category: "DATA_FIELD" as const,
      sort_order: 302,
    },
  ];

  console.log("📝 Creating fields...");
  for (const fieldData of fields) {
    await prisma.field.create({
      data: fieldData,
    });
  }

  console.log(`✅ Created ${fields.length} fields successfully!`);
}

seedFieldsComplete()
  .catch((e) => {
    console.error("❌ Error during field seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
