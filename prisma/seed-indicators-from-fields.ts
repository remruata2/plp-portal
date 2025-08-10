import { PrismaClient, TargetType } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Worker allocation configuration by worker type
interface WorkerAllocation {
  hwo?: number;
  mo?: number;
  ayush_mo?: number;
  hw?: number;
  asha?: number;
  colocated_sc_hw?: number;
}

async function seedFinalCorrectedIndicators() {
  console.log("🌱 Starting FINAL corrected indicator seeding based on updated source files...");

  // Get all fields for reference
  const fields = await prisma.field.findMany();
  const fieldMap = new Map(fields.map((f) => [f.code, f]));

  console.log("📊 Creating indicators with ONLY 3 target types: PERCENTAGE_RANGE, RANGE, BINARY...");
  let createdCount = 0;
  let updatedCount = 0;

  const indicators = [
    // =================== TOTAL FOOTFALL INDICATORS ===================
    // All use "3%-5%" or "3-5%" → PERCENTAGE_RANGE
    {
      code: "TF001_PHC",
      name: "Total Footfall (M&F) - PHC",
      description: "Total footfall as percentage of population for PHC",
      numerator_field_code: "total_footfall_phc_colocated_sc",
      denominator_field_code: "total_population",
      numerator_label: "Total Footfall (M&F) PHC+colocated SC",
      denominator_label: "Total Population",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 3, max: 5 }),
      target_formula: "3%-5%",
      conditions: "Monthly monitoring",
      applicable_facility_types: ["PHC"],
      source_of_verification: "AAM Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Total Footfall / Total Population × 100"
      },
      worker_allocation: {
        mo: 500, // PHC: 500 (with TB), 500 (without TB)
      },
    },

    {
      code: "TF001_SC",
      name: "Total Footfall (M&F) - SC-HWC",
      description: "Total footfall as percentage of population for SC-HWC",
      numerator_field_code: "total_footfall_sc_clinic",
      denominator_field_code: "total_population",
      numerator_label: "Total footfall (SC+Clinic)",
      denominator_label: "Total Population",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 3, max: 5 }),
      target_formula: "3-5%",
      conditions: "Monthly monitoring",
      applicable_facility_types: ["SC_HWC"],
      source_of_verification: "AAM Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Total Footfall / Total Population × 100"
      },
      worker_allocation: {
        hwo: 1000, // SC-HWC: 1000 (with TB+Pregnant), 1000 (without)
      },
    },

    {
      code: "TF001_UHWC",
      name: "Total Footfall (M&F) - U-HWC", 
      description: "Total footfall as percentage of population for U-HWC",
      numerator_field_code: "total_footfall_uhwc",
      denominator_field_code: "total_population",
      numerator_label: "Total Footfall (M&F)",
      denominator_label: "Total Population",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 3, max: 5 }),
      target_formula: "3-5%",
      conditions: "Monthly monitoring",
      applicable_facility_types: ["U_HWC"],
      source_of_verification: "AAM Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Total Footfall / Total Population × 100"
      },
      worker_allocation: {
        hwo: 2000, // U-HWC: 2000 (with/without TB)
      },
    },

    {
      code: "TF001_AHWC",
      name: "Total Footfall (M&F) - A-HWC",
      description: "Total footfall as percentage of population for A-HWC",
      numerator_field_code: "total_footfall_sc_clinic",
      denominator_field_code: "total_population",
      numerator_label: "Total footfall (SC+Clinic)",
      denominator_label: "Total Population",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 3, max: 5 }),
      target_formula: "3-5%",
      conditions: "Monthly monitoring",
      applicable_facility_types: ["A_HWC"],
      source_of_verification: "AAM Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Total Footfall / Total Population × 100"
      },
      worker_allocation: {
        ayush_mo: 1000, // A-HWC: 1000 (with/without TB)
      },
    },

    {
      code: "TF001_UPHC",
      name: "Total Footfall (M&F) - UPHC",
      description: "Total footfall as percentage of population for UPHC",
      numerator_field_code: "total_footfall_phc_colocated_sc",
      denominator_field_code: "total_population",
      numerator_label: "Total Footfall (M&F) PHC+colocated SC",
      denominator_label: "Total Population",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 3, max: 5 }),
      target_formula: "3%-5%",
      conditions: "Monthly monitoring",
      applicable_facility_types: ["UPHC"],
      source_of_verification: "AAM Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Total Footfall / Total Population × 100"
      },
      worker_allocation: {
        hwo: 500, // UPHC: 500
      },
    },

    // =================== WELLNESS SESSIONS ===================
    // All use "5-10 sessions" → RANGE
    {
      code: "WS001",
      name: "Total Wellness sessions",
      description: "Total Wellness session conducted during the month",
      numerator_field_code: "wellness_sessions_conducted",
      denominator_field_code: "target_wellness_sessions",
      numerator_label: "Total Wellness session conducted during the month",
      denominator_label: "Target Wellness Sessions (10)",
      target_type: "RANGE" as const,
      target_value: JSON.stringify({ min: 5, max: 10 }),
      target_formula: "5-10 sessions",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "UPHC", "SC_HWC", "U_HWC", "A_HWC"],
      source_of_verification: "AAM Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Total Wellness sessions conducted / Target sessions × 100"
      },
      worker_allocation: {
        mo: 500,      // PHC: 500
        hwo: 500,     // SC-HWC: 500, UPHC: 1500, U-HWC: 2000
        ayush_mo: 500, // A-HWC: 500
      },
    },

    // =================== PRAKRITI PARIKSHAN (A-HWC only) ===================
    // Uses "50-80%" → PERCENTAGE_RANGE
    {
      code: "PP001",
      name: "No of Prakriti Parikshan conducted",
      description: "Number of Prakriti Parikshan conducted",
      numerator_field_code: "prakriti_parikshan_conducted",
      denominator_field_code: "population_18_plus",
      numerator_label: "Prakriti Parikshan Conducted",
      denominator_label: "Population 18+ / 12",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 80 }),
      target_formula: "50-80%",
      conditions: "Population-based target",
      applicable_facility_types: ["A_HWC"],
      source_of_verification: "State report",
      formula_config: {
        calculationFormula: "(A/(B/12))*100",
        description: "Prakriti Parikshan Conducted / (Population 18+ / 12) × 100"
      },
      worker_allocation: {
        ayush_mo: 1000, // A-HWC: 1000
      },
    },

    // =================== TELECONSULTATION ===================
    // All use "25-50 calls" → RANGE
    {
      code: "TC001",
      name: "Teleconsultation",
      description: "Teleconsultation against target by facility type",
      numerator_field_code: "teleconsultation_conducted",
      denominator_field_code: "target_teleconsultation",
      numerator_label: "Teleconsultation Conducted",
      denominator_label: "Target Teleconsultation",
      target_type: "RANGE" as const,
      target_value: JSON.stringify({ min: 25, max: 50 }),
      target_formula: "25-50 calls",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "UPHC", "U_HWC", "SC_HWC", "A_HWC"],
      source_of_verification: "e-Sanjeevani",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Teleconsultation calls conducted / Target calls × 100"
      },
      worker_allocation: {
        mo: 1000,      // PHC: 1000
        hwo: 2000,     // SC-HWC: 2000, UPHC: 2000, U-HWC: 3000
        ayush_mo: 2500, // A-HWC: 2500 (with TB), 2000 (without)
      },
    },

    // =================== ANC FOOTFALL ===================
    // All use "50-100%" → PERCENTAGE_RANGE
    {
      code: "AF001_PHC",
      name: "Total ANC footfall - PHC",
      description: "ANC visits against due list for PHC",
      numerator_field_code: "anc_footfall",
      denominator_field_code: "anc_due_list",
      numerator_label: "ANC Footfall",
      denominator_label: "ANC Due List",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "If ANC due is 0 then the indicator may be NA",
      applicable_facility_types: ["PHC"],
      source_of_verification: "HMIS",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "ANC Footfall / ANC Due List × 100"
      },
      worker_allocation: {
        mo: 300, // PHC: 300 (with/without TB)
      },
    },

    {
      code: "AF001_SC",
      name: "Total ANC footfall - SC-HWC", 
      description: "ANC visits against due list for SC-HWC",
      numerator_field_code: "anc_footfall",
      denominator_field_code: "anc_due_list",
      numerator_label: "ANC Footfall",
      denominator_label: "ANC Due List",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "If denominator is '0' the indicator may be NA",
      applicable_facility_types: ["SC_HWC"],
      source_of_verification: "HMIS",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "ANC Footfall / ANC Due List × 100"
      },
      worker_allocation: {
        hwo: 500, // SC-HWC: 500 (with TB+Pregnant), 0 (without)
      },
    },

    {
      code: "AF001_AHWC",
      name: "Total ANC footfall - A-HWC",
      description: "ANC visits against due list for A-HWC",
      numerator_field_code: "anc_footfall", 
      denominator_field_code: "anc_due_list",
      numerator_label: "ANC Footfall",
      denominator_label: "ANC Due List",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "If denominator is '0' the indicator may be NA",
      applicable_facility_types: ["A_HWC"],
      source_of_verification: "HMIS",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "ANC Footfall / ANC Due List × 100"
      },
      worker_allocation: {
        ayush_mo: 0, // A-HWC: 0 (without TB+Pregnant)
      },
    },

    // =================== TB SCREENING ===================
    // PHC: "50-100%", SC/A-HWC: "50-80%", U-HWC: "50-80%", UPHC: "50-100%" → PERCENTAGE_RANGE
    {
      code: "TS001_PHC",
      name: "Individuals screened for TB - PHC",
      description: "TB screening against total footfall for PHC",
      numerator_field_code: "tb_screenings",
      denominator_field_code: "total_footfall_phc_colocated_sc",
      numerator_label: "TB Screenings",
      denominator_label: "Total Footfall",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Same as Total Footfall",
      applicable_facility_types: ["PHC"],
      source_of_verification: "TB Cough App",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Screenings / Total Footfall × 100"
      },
      worker_allocation: {
        mo: 300,
      },
    },

    {
      code: "TS001_SC",
      name: "Individuals screened for TB - SC-HWC",
      description: "TB screening against total footfall for SC-HWC",
      numerator_field_code: "tb_screenings",
      denominator_field_code: "total_footfall_sc_clinic",
      numerator_label: "TB Screenings",
      denominator_label: "Total Footfall",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 80 }),
      target_formula: "50-80%",
      conditions: "Same as Total Footfall",
      applicable_facility_types: ["SC_HWC"],
      source_of_verification: "TB Cough App",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Screenings / Total Footfall × 100"
      },
      worker_allocation: {
        hwo: 500,
      },
    },

    {
      code: "TS001_UHWC",
      name: "Individuals screened for TB - U-HWC",
      description: "TB screening against total footfall for U-HWC",
      numerator_field_code: "tb_screenings",
      denominator_field_code: "total_footfall_uhwc",
      numerator_label: "TB Screenings",
      denominator_label: "Total Footfall",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 80 }),
      target_formula: "50-80%",
      conditions: "Same as Total Footfall",
      applicable_facility_types: ["U_HWC"],
      source_of_verification: "TB Cough App",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Screenings / Total Footfall × 100"
      },
      worker_allocation: {
        hwo: 2000,
      },
    },

    {
      code: "TS001_AHWC",
      name: "Individuals screened for TB - A-HWC",
      description: "TB screening against total footfall for A-HWC",
      numerator_field_code: "tb_screenings",
      denominator_field_code: "total_footfall_sc_clinic",
      numerator_label: "TB Screenings",
      denominator_label: "Total Footfall",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 80 }),
      target_formula: "50-80%",
      conditions: "Same as Total Footfall",
      applicable_facility_types: ["A_HWC"],
      source_of_verification: "TB Cough App",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Screenings / Total Footfall × 100"
      },
      worker_allocation: {
        ayush_mo: 1000,
      },
    },

    {
      code: "TS001_UPHC",
      name: "Individuals screened for TB - UPHC",
      description: "TB screening against total footfall for UPHC",
      numerator_field_code: "tb_screenings",
      denominator_field_code: "total_footfall_phc_colocated_sc",
      numerator_label: "TB Screenings",
      denominator_label: "Total Footfall",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Same as Total Footfall",
      applicable_facility_types: ["UPHC"],
      source_of_verification: "TB Cough App",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Screenings / Total Footfall × 100"
      },
      worker_allocation: {
        hwo: 500,
      },
    },

    // =================== TB CONTACT TRACING ===================
    // All use "50-100%" or "50-80%" → PERCENTAGE_RANGE
    {
      code: "CT001",
      name: "Household visited for TB contact tracing",
      description: "TB contact tracing against pulmonary TB patients",
      numerator_field_code: "tb_contact_tracing_households",
      denominator_field_code: "pulmonary_tb_patients",
      numerator_label: "TB Contact Tracing Households", 
      denominator_label: "Pulmonary TB Patients",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%", // PHC uses 50-100%, U-HWC uses 50-80%
      conditions: "If there are no Pulmonary TB patients, then the indicator may be NA",
      applicable_facility_types: ["PHC", "U_HWC", "SC_HWC", "A_HWC"],
      source_of_verification: "Nikshay",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Contact Tracing Households / Pulmonary TB Patients × 100"
      },
      worker_allocation: {
        mo: 300,   // PHC: 300 (with TB), 0 (without)
        hwo: 500,  // SC-HWC: 500, U-HWC: 2000 (with TB), 0 (without)
        ayush_mo: 0, // A-HWC: 0 (with/without TB)
      },
    },

    // =================== RI SESSIONS ===================
    // All use "1" or "100%" → BINARY
    {
      code: "RS001",
      name: "RI sessions held",
      description: "RI sessions held against planned",
      numerator_field_code: "ri_sessions_held",
      denominator_field_code: "ri_sessions_planned",
      numerator_label: "RI Sessions Held",
      denominator_label: "RI Sessions Planned",
      target_type: "BINARY" as const,
      target_value: "true",
      target_formula: "100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "U-Win",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "RI Sessions Held / RI Sessions Planned × 100"
      },
      worker_allocation: {
        mo: 300,     // PHC
        hwo: 500,    // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // =================== PATIENT SATISFACTION ===================
    // All use "70-100%" → PERCENTAGE_RANGE
    {
      code: "PS001",
      name: "Patient satisfaction score for the month",
      description: "Patient satisfaction score against maximum",
      numerator_field_code: "patient_satisfaction_score",
      denominator_field_code: "patient_satisfaction_max",
      numerator_label: "Patient Satisfaction Score",
      denominator_label: "Max Score (5)",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 70, max: 100 }),
      target_formula: "70-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "UPHC", "SC_HWC", "A_HWC"],
      source_of_verification: "QA Mizoram KPI dashboard",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Patient Satisfaction Score / Max Score × 100"
      },
      worker_allocation: {
        mo: 300,      // PHC
        hwo: 1000,    // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // =================== NCD DIAGNOSIS (PHC/UPHC only) ===================
    // Uses "100%" → BINARY
    {
      code: "ND001",
      name: "NCD Diagnosed & Tx completed",
      description: "NCD diagnosed and treatment completed against referrals",
      numerator_field_code: "ncd_diagnosed_tx_completed",
      denominator_field_code: "ncd_referred_from_sc",
      numerator_label: "NCD Diagnosed & Tx Completed",
      denominator_label: "NCD Referred from SC",
      target_type: "BINARY" as const,
      target_value: "true",
      target_formula: "100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "UPHC"],
      source_of_verification: "NCD Portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "NCD Diagnosed & Tx Completed / NCD Referred from SC × 100"
      },
      worker_allocation: {
        mo: 500,   // PHC: 500 (with TB), 600 (without)
        hwo: 500,  // UPHC: 500
      },
    },

    // =================== JAS MEETINGS ===================
    // All use "1" or "100%" → BINARY
    {
      code: "JM001",
      name: "No of JAS meeting conducted",
      description: "JAS meetings conducted against target",
      numerator_field_code: "jas_meetings_conducted",
      denominator_field_code: "target_jas_meetings",
      numerator_label: "JAS Meetings Conducted",
      denominator_label: "Target JAS Meetings",
      target_type: "BINARY" as const,
      target_value: "1",
      target_formula: "1",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "UPHC", "U_HWC", "SC_HWC", "A_HWC"],
      source_of_verification: "AAM portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "JAS Meetings Conducted / Target JAS Meetings × 100"
      },
      worker_allocation: {
        mo: 500,      // PHC
        hwo: 1000,    // SC-HWC/UPHC/U-HWC: 1000/1000/2000
        ayush_mo: 1000, // A-HWC: 1000
      },
    },

    // =================== DVDMS ISSUES ===================
    // SC: "10-20 issues", PHC: "25-50 issues" → PERCENTAGE_RANGE
    {
      code: "DV001_SC",
      name: "No. of issues generated in DVDMS - SC-HWC",
      description: "DVDMS issues generated against target for SC",
      numerator_field_code: "dvdms_issues_generated",
      denominator_field_code: "target_dvdms_issues",
      numerator_label: "DVDMS Issues Generated",
      denominator_label: "Target DVDMS Issues (20)",
      target_type: "RANGE" as const,
      target_value: JSON.stringify({ min: 10, max: 20 }),
      target_formula: "10-20 issues",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["SC_HWC", "A_HWC"],
      source_of_verification: "DVDMS portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "DVDMS Issues Generated / Target Issues × 100"
      },
      worker_allocation: {
        hwo: 1000,    // SC-HWC: 1000
        ayush_mo: 1000, // A-HWC: 1000
      },
    },

    {
      code: "DV001_PHC",
      name: "No. of issues generated in DVDMS - PHC",
      description: "DVDMS issues generated against target for PHC",
      numerator_field_code: "dvdms_issues_generated",
      denominator_field_code: "target_dvdms_issues",
      numerator_label: "DVDMS Issues Generated",
      denominator_label: "Target DVDMS Issues (50)",
      target_type: "RANGE" as const,
      target_value: JSON.stringify({ min: 25, max: 50 }),
      target_formula: "25-50 issues",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC"],
      source_of_verification: "DVDMS portal",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "DVDMS Issues Generated / Target Issues × 100"
      },
      worker_allocation: {
        mo: 250, // PHC: 250 (with TB), 500 (without)
      },
    },

    // =================== MISSING INDICATORS ===================
    
    // HT001 - Pregnant women tested for Hb
    {
      code: "HT001",
      name: "Pregnant women tested for Hb",
      description: "Total ANC tested for Hb",
      numerator_field_code: "anc_tested_hb",
      denominator_field_code: "anc_footfall",
      numerator_label: "Total ANC tested for Hb",
      denominator_label: "Total ANC footfall (Old + New Case)",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "If denominator is '0' the indicator may be NA",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "HMIS",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "ANC Tested for Hb / Total ANC Footfall × 100"
      },
      worker_allocation: {
        mo: 300,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // DC001 - No. of TB patients visited for Differentiated TB Care
    {
      code: "DC001",
      name: "No. of TB patients visited for Differentiated TB Care",
      description: "No. of TB patients visited for Differentiated TB Care",
      numerator_field_code: "tb_differentiated_care_visits",
      denominator_field_code: "total_tb_patients",
      numerator_label: "No. of TB patients visited for Differentiated TB Care",
      denominator_label: "Total TB patients under Treatment (Pulmonary + Extra Pulmonary TB)",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "If there are no TB patients(Pulmonary+extra Pulm), then the indicator may be NA",
      applicable_facility_types: ["PHC", "SC_HWC", "U_HWC", "A_HWC"],
      source_of_verification: "Nikshay",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "TB Differentiated Care Visits / Total TB Patients × 100"
      },
      worker_allocation: {
        mo: 300,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // RF001 - RI footfall
    {
      code: "RF001",
      name: "RI footfall",
      description: "Total RI footfall (u-Win)",
      numerator_field_code: "ri_footfall",
      denominator_field_code: "ri_beneficiaries_due",
      numerator_label: "Total RI footfall (u-Win)",
      denominator_label: "Total beneficiary reported in u-Win",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "U-Win",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "RI Footfall / RI Beneficiaries Due × 100"
      },
      worker_allocation: {
        mo: 300,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // CB001 - CBAC filled for the month
    {
      code: "CB001",
      name: "CBAC filled for the month (including rescreened)",
      description: "CBAC filled for the month (including rescreened)",
      numerator_field_code: "cbac_forms_filled",
      denominator_field_code: "total_population_30_plus",
      numerator_label: "CBAC filled for the month (including rescreened)",
      denominator_label: "Total 30+ population/12",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "NCD Portal",
      formula_config: {
        calculationFormula: "(A/(B/12))*100",
        description: "CBAC forms filled / (30+ Population / 12) × 100"
      },
      worker_allocation: {
        mo: 250,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // HS001 - HTN screened for the month
    {
      code: "HS001",
      name: "HTN screened (including rescreened) for the month",
      description: "HTN screened (including rescreened) for the month",
      numerator_field_code: "htn_screened",
      denominator_field_code: "total_population_30_plus",
      numerator_label: "HTN screened (including rescreened) for the month",
      denominator_label: "Total 30+ population/12",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "NCD Portal",
      formula_config: {
        calculationFormula: "(A/(B/12))*100",
        description: "HTN cases identified / (30+ Population / 12) × 100"
      },
      worker_allocation: {
        mo: 250,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // DS001 - DM screened for the month
    {
      code: "DS001",
      name: "DM screened (including rescreened) for the month",
      description: "DM screened (including rescreened) for the month",
      numerator_field_code: "dm_screened",
      denominator_field_code: "total_population_30_plus",
      numerator_label: "DM screened (including rescreened) for the month",
      denominator_label: "Total 30+ population/12",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "NCD Portal",
      formula_config: {
        calculationFormula: "(A/(B/12))*100",
        description: "DM Cases Identified / (30+ Population / 12) × 100"
      },
      worker_allocation: {
        mo: 250,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // OC001 - Oral Ca. Screened for the month
    {
      code: "OC001",
      name: "Oral Ca. Screened for the month",
      description: "Oral Ca. Screened for the month",
      numerator_field_code: "oral_cancer_screened",
      denominator_field_code: "total_population_30_plus",
      numerator_label: "Oral Ca. Screened for the month",
      denominator_label: "Total 30+ population/60",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "NCD Portal",
      formula_config: {
        calculationFormula: "(A/(B/60))*100",
        description: "Oral Cancer Screened / (30+ Population / 60) × 100"
      },
      worker_allocation: {
        mo: 250,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // BC001 - Breast & Cervical Ca. screened for the month
    {
      code: "BC001",
      name: "Breast & Cervical Ca. screened for the month",
      description: "Breast & Cervical Ca. screened for the month",
      numerator_field_code: "breast_cervical_cancer_screened",
      denominator_field_code: "total_female_population_30_plus",
      numerator_label: "Breast & Cervical Ca. screened for the month",
      denominator_label: "Total Female 30+ population/60",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 100 }),
      target_formula: "50-100%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "A_HWC"],
      source_of_verification: "NCD Portal",
      formula_config: {
        calculationFormula: "(A/(B/60))*100",
        description: "Breast & Cervical Cancer Screened / (Female 30+ Population / 60) × 100"
      },
      worker_allocation: {
        mo: 250,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // EP001 - No of Elderly & Palliative patients visited
    {
      code: "EP001",
      name: "No of Elderly & Palliative patients visited",
      description: "No of Elderly & Palliative patients visited",
      numerator_field_code: "elderly_palliative_visits",
      denominator_field_code: "bedridden_patients",
      numerator_label: "No of Elderly & Palliative patients visited",
      denominator_label: "Total bed-ridden patients identified who require home based care",
      target_type: "PERCENTAGE_RANGE" as const,
      target_value: JSON.stringify({ min: 50, max: 80 }),
      target_formula: "50-80%",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "U_HWC", "A_HWC"],
      source_of_verification: "HMIS",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Elderly & Palliative Visits / Bedridden Patients × 100"
      },
      worker_allocation: {
        mo: 300,      // PHC
        hwo: 500,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // EC001 - No of Elderly clinic conducted
    {
      code: "EC001",
      name: "No of Elderly clinic conducted",
      description: "Elderly clinic conducted against target",
      numerator_field_code: "elderly_clinic_conducted",
      denominator_field_code: "target_elderly_clinic",
      numerator_label: "Elderly Clinic Conducted",
      denominator_label: "Target Elderly Clinic",
      target_type: "BINARY" as const,
      target_value: "1",
      target_formula: "1",
      conditions: "Monthly target achievement",
      applicable_facility_types: ["PHC", "SC_HWC", "U_HWC", "A_HWC"],
      source_of_verification: "HMIS",
      formula_config: {
        calculationFormula: "(A/B)*100",
        description: "Elderly Clinic Conducted / Target Elderly Clinic × 100"
      },
      worker_allocation: {
        mo: 500,      // PHC
        hwo: 500,     // SC-HWC
        hw: 500,      // U-HWC
        ayush_mo: 500, // A-HWC
      },
    },

    // ES001 - Whether Elderly Support Group (Sanjivini) is formed
    {
      code: "ES001",
      name: "Whether Elderly Support Group (Sanjivini) is formed",
      description: "Elderly support group formation status",
      numerator_field_code: "elderly_support_group_formed",
      denominator_field_code: "elderly_support_group_formed", // Self-reference for binary
      numerator_label: "Elderly Support Group Formed",
      denominator_label: "Yes/No",
      target_type: "BINARY" as const,
      target_value: "Yes",
      target_formula: "Yes",
      conditions: "Binary target",
      applicable_facility_types: ["SC_HWC", "A_HWC"],
      source_of_verification: "Patient Support Group Register",
      formula_config: {
        calculationFormula: "A",
        description: "Elderly Support Group Formation Status (Yes/No)"
      },
      worker_allocation: {
        hwo: 800,     // SC-HWC
        ayush_mo: 1000, // A-HWC
      },
    },

    // EA001 - If Yes, any activity conducted during the month
    {
      code: "EA001",
      name: "If Yes, any activity conducted during the month",
      description: "Elderly support group activity status",
      numerator_field_code: "elderly_support_group_activity",
      denominator_field_code: "elderly_support_group_activity", // Self-reference for binary
      numerator_label: "Elderly Support Group Activity",
      denominator_label: "Yes/No",
      target_type: "BINARY" as const,
      target_value: "Yes(1 and above)",
      target_formula: "Yes(1 and above)",
      conditions: "Binary target",
      applicable_facility_types: ["SC_HWC", "A_HWC"],
      source_of_verification: "Patient Support Group Register",
      formula_config: {
        calculationFormula: "A",
        description: "Elderly Support Group Activity Status (Yes/No)"
      },
      worker_allocation: {
        hwo: 700,     // SC-HWC
        ayush_mo: 500, // A-HWC
      },
    },
  ];

  // Create or update indicators
  async function createOrUpdateIndicator(indicatorData: any) {
    const {
      code,
      name,
      description,
      numerator_field_code,
      denominator_field_code,
      numerator_label,
      denominator_label,
      target_type,
      target_value,
      target_formula,
      conditions,
      applicable_facility_types,
      source_of_verification,
      worker_allocation = {}
    } = indicatorData;

    // Find the fields by code
    const numeratorField = numerator_field_code ? fieldMap.get(numerator_field_code) : null;
    const denominatorField = denominator_field_code ? fieldMap.get(denominator_field_code) : null;

    // Check if indicator already exists
    const existingIndicator = await prisma.indicator.findUnique({
      where: { code },
    });

    if (existingIndicator) {
      // Update existing indicator
      const updatedIndicator = await prisma.indicator.update({
        where: { id: existingIndicator.id },
        data: {
          name,
          description,
          type: "FIELD_BASED",
          numerator_field_id: numeratorField?.id,
          denominator_field_id: denominatorField?.id,
          numerator_label,
          denominator_label,
          target_type,
          target_value,
          target_formula,
          conditions,
          source_of_verification,
          formula_config: indicatorData.formula_config,
          applicable_facility_types: applicable_facility_types || [],
        },
      });

      // Delete existing worker allocations for this indicator
      await prisma.indicatorWorkerAllocation.deleteMany({
        where: { indicator_id: existingIndicator.id },
      });

      // Create new worker allocations
      for (const [workerType, amount] of Object.entries(worker_allocation)) {
        if (Number(amount) > 0) {
          await prisma.indicatorWorkerAllocation.create({
            data: {
              indicator_id: existingIndicator.id,
              worker_type: workerType,
              allocated_amount: Number(amount),
            },
          });
        }
      }

      console.log(`✅ Updated indicator ${code} with FINAL definition.`);
      return { indicator: updatedIndicator, status: "updated" };
    } else {
      // Create new indicator
      const newIndicator = await prisma.indicator.create({
        data: {
          code,
          name,
          description,
          type: "FIELD_BASED",
          numerator_field_id: numeratorField?.id,
          denominator_field_id: denominatorField?.id,
          numerator_label,
          denominator_label,
          target_type,
          target_value,
          target_formula,
          conditions,
          source_of_verification,
          formula_config: indicatorData.formula_config,
          applicable_facility_types: applicable_facility_types || [],
        },
      });

      // Create worker allocations
      for (const [workerType, amount] of Object.entries(worker_allocation)) {
        if (Number(amount) > 0) {
          await prisma.indicatorWorkerAllocation.create({
            data: {
              indicator_id: newIndicator.id,
              worker_type: workerType,
              allocated_amount: Number(amount),
            },
          });
        }
      }

      console.log(`✅ Created FINAL indicator ${code}.`);
      return { indicator: newIndicator, status: "created" };
    }
  }

  // Process all indicators
  for (const indicatorData of indicators) {
    const result = await createOrUpdateIndicator(indicatorData);
    if (result.status === "created") {
      createdCount++;
    } else if (result.status === "updated") {
      updatedCount++;
    }
  }

  console.log(`🎉 FINAL indicator seeding completed:`);
  console.log(`   - ${createdCount} indicators created.`);
  console.log(`   - ${updatedCount} indicators updated.`);
  console.log(`   - Using ONLY 3 target types: PERCENTAGE_RANGE, RANGE, BINARY`);
  
  return { createdCount, updatedCount };
}

seedFinalCorrectedIndicators()
  .catch((e) => {
    console.error("❌ Error during FINAL indicator seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
