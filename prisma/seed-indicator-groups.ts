import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Standard indicator groups matching indicator-grouping.ts
const defaultGroups = [
  { code: "POP001", name: "Population Data", description: "Foundational demographic information", sort_order: 1 },
  { code: "TF001_PHC", name: "Total Footfall (M&F)", description: "Total OPD footfall for PHC", sort_order: 2 },
  { code: "TF001_SC", name: "Total Footfall (M&F)", description: "Total OPD footfall for SC", sort_order: 3 },
  { code: "TF001_UHWC", name: "Total Footfall (M&F)", description: "Total OPD footfall for UHWC", sort_order: 4 },
  { code: "TF001_AHWC", name: "Total Footfall (M&F)", description: "Total OPD footfall for AHWC", sort_order: 5 },
  { code: "TF001_UPHC", name: "Total Footfall (M&F)", description: "Total OPD footfall for UPHC", sort_order: 6 },
  { code: "WS001", name: "Total Wellness Sessions", description: "Wellness sessions conducted", sort_order: 7 },
  { code: "TC001", name: "Teleconsultation", description: "Teleconsultation sessions", sort_order: 8 },
  { code: "AF001_PHC", name: "Total ANC Footfall", description: "ANC footfall for PHC", sort_order: 9 },
  { code: "AF001_SC", name: "Total ANC Footfall", description: "ANC footfall for SC", sort_order: 10 },
  { code: "AF001_AHWC", name: "Total ANC Footfall", description: "ANC footfall for AHWC", sort_order: 11 },
  { code: "HT001", name: "Pregnant Women Tested for Hb", description: "Hb testing coverage", sort_order: 12 },
  { code: "TS001_PHC", name: "Individuals Screened for TB", description: "TB screenings for PHC", sort_order: 13 },
  { code: "TS001_SC", name: "Individuals Screened for TB", description: "TB screenings for SC", sort_order: 14 },
  { code: "TS001_UHWC", name: "Individuals Screened for TB", description: "TB screenings for UHWC", sort_order: 15 },
  { code: "TS001_AHWC", name: "Individuals Screened for TB", description: "TB screenings for AHWC", sort_order: 16 },
  { code: "TS001_UPHC", name: "Individuals Screened for TB", description: "TB screenings for UPHC", sort_order: 17 },
  { code: "CT001", name: "Household Visited for TB Contact Tracing", description: "TB contact tracing visits", sort_order: 18 },
  { code: "DC001", name: "TB Patients Visited for Differentiated Care", description: "Differentiated care visits", sort_order: 19 },
  { code: "RS001", name: "RI Sessions Held", description: "Routine Immunization sessions", sort_order: 20 },
  { code: "RF001", name: "RI Footfall", description: "Routine Immunization footfall", sort_order: 21 },
  { code: "CB001", name: "CBAC Forms Filled", description: "Community Based Assessment Checklist forms", sort_order: 22 },
  { code: "HS001", name: "HTN Screened", description: "Hypertension screening", sort_order: 23 },
  { code: "DS001", name: "DM Screened", description: "Diabetes Mellitus screening", sort_order: 24 },
  { code: "OC001", name: "Oral Cancer Screened", description: "Oral Cancer screening", sort_order: 25 },
  { code: "BC001", name: "Breast & Cervical Cancer Screened", description: "Breast and Cervical Cancer screening", sort_order: 26 },
  { code: "ND001", name: "NCD Diagnosed & Treatment Initiated", description: "NCD diagnosis and treatment", sort_order: 27 },
  { code: "EP001", name: "Elderly & Palliative Patients Visited", description: "Home visits for elderly and palliative patients", sort_order: 28 },
  { code: "EC001", name: "Elderly Clinics Conducted", description: "Elderly care clinics", sort_order: 29 },
  { code: "ES001", name: "Elderly Support Group (Sanjivini)", description: "Support group formation", sort_order: 30 },
  { code: "EA001", name: "Elderly Support Group Activities", description: "Support group monthly activities", sort_order: 31 },
  { code: "JM001", name: "JAS Meetings Conducted", description: "Jan Arogya Samiti meetings", sort_order: 32 },
  { code: "DV001_PHC", name: "DVDMS Issues Generated", description: "Drug distribution management system issues", sort_order: 33 },
  { code: "DV001_SC", name: "DVDMS Issues Generated", description: "DVDMS issues for SC", sort_order: 34 },
  { code: "DV001_UHWC", name: "DVDMS Issues Generated", description: "DVDMS issues for UHWC", sort_order: 35 },
  { code: "DV001_AHWC", name: "DVDMS Issues Generated", description: "DVDMS issues for AHWC", sort_order: 36 },
];

const fieldToGroupMap: Record<string, string> = {
  total_population: "POP001",
  population_30_plus: "POP001",
  population_30_plus_female: "POP001",
  population_18_plus: "POP001",

  anc_due_list: "AF001_PHC",
  anc_footfall: "AF001_PHC",
  anc_footfall_phc: "AF001_PHC",
  anc_footfall_sc: "AF001_SC",
  anc_footfall_ahwc: "AF001_AHWC",
  anc_tested_hb: "HT001",

  ri_sessions_planned: "RS001",
  ri_sessions_held: "RS001",
  ri_beneficiaries_due: "RF001",
  ri_footfall: "RF001",

  pulmonary_tb_patients: "CT001",
  total_tb_patients: "DC001",
  tb_screenings: "TS001_PHC",
  tb_screenings_phc: "TS001_PHC",
  tb_screenings_sc: "TS001_SC",
  tb_screenings_uhwc: "TS001_UHWC",
  tb_screenings_ahwc: "TS001_AHWC",
  tb_screenings_uphc: "TS001_UPHC",
  tb_contact_tracing_households: "CT001",
  tb_differentiated_care_visits: "DC001",

  cbac_forms_filled: "CB001",
  htn_screened: "HS001",
  dm_screened: "DS001",
  oral_cancer_screened: "OC001",
  breast_cervical_cancer_screened: "BC001",
  ncd_diagnosed_tx_completed: "ND001",
  ncd_referred_from_sc: "ND001",

  total_footfall: "TF001_PHC",
  total_footfall_phc_colocated_sc: "TF001_PHC",
  total_footfall_sc_clinic: "TF001_SC",
  total_footfall_uhwc: "TF001_UHWC",
  total_footfall_ahwc: "TF001_AHWC",
  total_footfall_uphc: "TF001_UPHC",
  wellness_sessions_conducted: "WS001",
  teleconsultation_conducted: "TC001",
  prakriti_parikshan_conducted: "TC001",
  patient_satisfaction_score: "WS001",

  bedridden_patients: "EP001",
  elderly_palliative_visits: "EP001",
  elderly_clinic_conducted: "EC001",
  elderly_support_group_formed: "ES001",
  elderly_support_group_activity: "EA001",

  jas_meetings_conducted: "JM001",
  dvdms_issues_generated: "DV001_PHC",
  dvdms_issues_generated_phc: "DV001_PHC",
  dvdms_issues_generated_sc: "DV001_SC",
  dvdms_issues_generated_uhwc: "DV001_UHWC",
  dvdms_issues_generated_ahwc: "DV001_AHWC",
};

export async function seedIndicatorGroups() {
  console.log("🌱 Seeding default indicator groups...");

  for (const group of defaultGroups) {
    const existing = await prisma.indicator_group.findFirst({
      where: {
        code: group.code,
        facility_type_id: null,
      },
    });

    if (existing) {
      await prisma.indicator_group.update({
        where: { id: existing.id },
        data: {
          name: group.name,
          description: group.description,
          sort_order: group.sort_order,
        },
      });
    } else {
      await prisma.indicator_group.create({
        data: {
          code: group.code,
          name: group.name,
          description: group.description,
          sort_order: group.sort_order,
          facility_type_id: null,
        },
      });
    }
  }

  console.log("✅ Indicator groups seeded successfully!");

  console.log("🔗 Linking facility field mappings to indicator groups...");
  const mappings = await prisma.facility_field_mapping.findMany({
    include: { field: true },
  });

  const dbGroups = await prisma.indicator_group.findMany({
    where: { facility_type_id: null },
  });

  const groupCodeToId = new Map(dbGroups.map((g) => [g.code, g.id]));

  for (const mapping of mappings) {
    const targetGroupCode = fieldToGroupMap[mapping.field.code];
    if (targetGroupCode && groupCodeToId.has(targetGroupCode)) {
      await prisma.facility_field_mapping.update({
        where: { id: mapping.id },
        data: {
          group_id: groupCodeToId.get(targetGroupCode),
        },
      });
    }
  }

  console.log("✅ Facility field mappings updated with group links!");
}

if (require.main === module) {
  seedIndicatorGroups()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
