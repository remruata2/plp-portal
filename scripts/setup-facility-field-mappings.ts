import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Define the mapping of field codes for each facility type (based on indicator files)
const facilityTypeFieldCodes: Record<string, string[]> = {
  PHC: [
    "total_population",
    "population_30_plus",
    "population_30_plus_female",
    "anc_due_list",
    "ri_sessions_planned",
    "ri_beneficiaries_due",
    "bedridden_patients",
    "pulmonary_tb_patients",
    "total_tb_patients",
    "total_footfall_phc_colocated_sc", // PHC specific footfall
    "wellness_sessions_conducted",
    "teleconsultation_conducted",
    "anc_footfall",
    "anc_tested_hb",
    "tb_screenings",
    "tb_contact_tracing_households",
    "tb_differentiated_care_visits",
    "ri_sessions_held",
    "ri_footfall",
    "cbac_forms_filled",
    "htn_screened",
    "dm_screened",
    "oral_cancer_screened",
    "breast_cervical_cancer_screened",
    "ncd_diagnosed_tx_completed",
    "patient_satisfaction_score",
    "elderly_palliative_visits",
    "elderly_clinic_conducted",
    "jas_meetings_conducted",
    "dvdms_issues_generated",
  ],
  UPHC: [
    "total_population",
    "ncd_referred_from_sc",
    "total_footfall_phc_colocated_sc", // UPHC uses same as PHC
    "wellness_sessions_conducted",
    "teleconsultation_conducted",
    "tb_screenings",
    "ncd_diagnosed_tx_completed",
    "patient_satisfaction_score",
    "elderly_clinic_conducted",
    "jas_meetings_conducted",
    "dvdms_issues_generated",
  ],
  SC_HWC: [
    "total_population",
    "population_30_plus",
    "population_30_plus_female",
    "anc_due_list",
    "ri_sessions_planned",
    "ri_beneficiaries_due",
    "bedridden_patients",
    "pulmonary_tb_patients",
    "total_tb_patients",
    "total_footfall_sc_clinic", // SC-HWC specific footfall
    "wellness_sessions_conducted",
    "teleconsultation_conducted",
    "anc_footfall",
    "anc_tested_hb",
    "tb_screenings",
    "tb_contact_tracing_households",
    "tb_differentiated_care_visits",
    "ri_sessions_held",
    "ri_footfall",
    "cbac_forms_filled",
    "htn_screened",
    "dm_screened",
    "oral_cancer_screened",
    "breast_cervical_cancer_screened",
    "patient_satisfaction_score",
    "elderly_palliative_visits",
    "elderly_clinic_conducted",
    "elderly_support_group_formed",
    "elderly_support_group_activity",
    "jas_meetings_conducted",
    "dvdms_issues_generated",
  ],
  U_HWC: [
    "total_population",
    "bedridden_patients",
    "pulmonary_tb_patients",
    "total_tb_patients",
    "total_footfall_uhwc", // U-HWC specific footfall
    "wellness_sessions_conducted",
    "teleconsultation_conducted",
    "tb_screenings",
    "tb_contact_tracing_households",
    "tb_differentiated_care_visits",
    "elderly_palliative_visits",
    "elderly_clinic_conducted",
    "jas_meetings_conducted",
    "dvdms_issues_generated",
  ],
  A_HWC: [
    "total_population",
    "population_18_plus",
    "population_30_plus",
    "population_30_plus_female",
    "anc_due_list",
    "ri_sessions_planned",
    "ri_beneficiaries_due",
    "bedridden_patients",
    "pulmonary_tb_patients",
    "total_tb_patients",
    "total_footfall_sc_clinic", // A-HWC uses same as SC-HWC
    "wellness_sessions_conducted",
    "prakriti_parikshan_conducted",
    "teleconsultation_conducted",
    "anc_footfall",
    "anc_tested_hb",
    "tb_screenings",
    "tb_contact_tracing_households",
    "tb_differentiated_care_visits",
    "ri_sessions_held",
    "ri_footfall",
    "cbac_forms_filled",
    "htn_screened",
    "dm_screened",
    "oral_cancer_screened",
    "breast_cervical_cancer_screened",
    "patient_satisfaction_score",
    "elderly_palliative_visits",
    "elderly_clinic_conducted",
    "elderly_support_group_formed",
    "elderly_support_group_activity",
    "jas_meetings_conducted",
    "dvdms_issues_generated",
  ],
};

async function main() {
  try {
    // Get all fields from the DB
    const fields = await prisma.field.findMany({
      select: { id: true, code: true },
    });
    const codeToId: Record<string, number> = {};
    for (const field of fields) {
      codeToId[field.code] = field.id;
    }

    // Get all facility types
    const facilityTypes = await prisma.facilityType.findMany({
      select: { id: true, name: true },
    });
    const nameToId: Record<string, string> = {};
    for (const ft of facilityTypes) {
      nameToId[ft.name] = ft.id;
    }

    // Clear existing mappings
    await prisma.facilityFieldMapping.deleteMany({});

    // Insert new mappings
    for (const [ftype, codes] of Object.entries(facilityTypeFieldCodes)) {
      const facilityTypeId = nameToId[ftype];
      if (!facilityTypeId) {
        console.warn(`Facility type not found: ${ftype}`);
        continue;
      }
      let order = 1;
      for (const code of codes) {
        const fieldId = codeToId[code];
        if (!fieldId) {
          console.warn(`Field code not found: ${code}`);
          continue;
        }
        await prisma.facilityFieldMapping.create({
          data: {
            facility_type_id: facilityTypeId,
            field_id: fieldId,
            is_required: false,
            display_order: order++,
          },
        });
      }
    }
    console.log("Facility field mappings setup complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main();
