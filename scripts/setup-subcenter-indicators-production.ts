import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const isDryRun = process.argv.includes("--dry-run");

interface SubCenterIndicatorConfig {
	code: string;
	name: string;
	description: string;
	numerator_name?: string;
	denominator_name?: string;
	target_type: "PERCENTAGE_RANGE" | "RANGE" | "BINARY";
	target_formula: string;
	target_value: string;
	source_of_verification: string;
	base_amount: number;
	condition_1_amount?: number;
	condition_2_amount?: number;
	condition_3_amount?: number;
	condition_4_amount?: number;
	condition_config?: any;
}

const SUBCENTER_INDICATORS: SubCenterIndicatorConfig[] = [
	{
		code: "TF001_SC",
		name: "Total OPD Footfall (M&F) - SC-HWC",
		description: "Total OPD footfall as percentage of catchment population for Sub Centre",
		numerator_name: "Total OPD Footfall (M&F) as per HWC portal",
		denominator_name: "Total Catchment population including (Clinics)",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "5-7%",
		target_value: JSON.stringify({ min: 5, max: 7 }),
		source_of_verification: "HWC Portal",
		base_amount: 1500,
	},
	{
		code: "WS001_SC",
		name: "Total Wellness Sessions Conducted - SC-HWC",
		description: "Total wellness sessions (Awareness/Yoga/Fitness) conducted during month",
		numerator_name: "Total Wellness Sessions (Awareness/Yoga/Fitness etc.) conducted",
		target_type: "RANGE",
		target_formula: "5 - 10",
		target_value: JSON.stringify({ min: 5, max: 10 }),
		source_of_verification: "Monthly Report",
		base_amount: 1000,
	},
	{
		code: "SR001_SC",
		name: "Timely Monthly Service Delivery Report Submission - SC-HWC",
		description: "Whether monthly report submitted before 5th in AAM Portal",
		numerator_name: "Whether Monthly Service Delivery report have been submitted before 5th of the month in AAM Portal",
		target_type: "BINARY",
		target_formula: "1 & 0",
		target_value: JSON.stringify({ expected: 1 }),
		source_of_verification: "AAM Portal",
		base_amount: 1000,
	},
	// Conditional ANC / TB Sputum Block (Q4 Yes/No)
	{
		code: "ANC_RCH_REG_SC",
		name: "ANC Registration in RCH 2.0 - SC-HWC",
		description: "New pregnant women registered for ANC in HMIS reported in RCH 2.0",
		numerator_name: "Whether new pregnant women registered for ANC reported in HMIS is reported in RCH 2.0?",
		target_type: "BINARY",
		target_formula: "1 & 0",
		target_value: JSON.stringify({ expected: 1 }),
		source_of_verification: "RCH 2.0 / HMIS",
		base_amount: 0,
		condition_1_amount: 250,
		condition_2_amount: 0,
		condition_config: {
			condition_1: [{ field_code: "sc_are_there_any_new_pregnant_women_in_the__5", operator: "equals", value: true }],
			condition_2: [{ field_code: "sc_are_there_any_new_pregnant_women_in_the__5", operator: "equals", value: false }],
		},
	},
	{
		code: "ANC_1ST_TRIM_SC",
		name: "1st Trimester ANC Registration in RCH 2.0 - SC-HWC",
		description: "Total pregnant women registered within 1st Trimester updated in RCH 2.0",
		numerator_name: "Whether Total pregnant women registered within 1st Trimester reported in HMIS is updated in RCH 2.0",
		target_type: "BINARY",
		target_formula: "1 & 0",
		target_value: JSON.stringify({ expected: 1 }),
		source_of_verification: "RCH 2.0 / HMIS",
		base_amount: 0,
		condition_1_amount: 250,
		condition_2_amount: 0,
		condition_config: {
			condition_1: [{ field_code: "sc_are_there_any_new_pregnant_women_in_the__5", operator: "equals", value: true }],
			condition_2: [{ field_code: "sc_are_there_any_new_pregnant_women_in_the__5", operator: "equals", value: false }],
		},
	},
	{
		code: "TB_SPUTUM_SC",
		name: "Presumptive TB Sputum Sample Testing - SC-HWC",
		description: "Sputum sample collected & sent for TB testing at NAAT center vs presumptive identified",
		numerator_name: "No of Sputum sample collected and sent for TB testing at NAAT center",
		denominator_name: "No of TB presumptive identified",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-100%",
		target_value: JSON.stringify({ min: 50, max: 100 }),
		source_of_verification: "NAAT Center Register",
		base_amount: 0,
		condition_1_amount: 0,
		condition_2_amount: 500,
		condition_config: {
			condition_1: [{ field_code: "sc_are_there_any_new_pregnant_women_in_the__5", operator: "equals", value: true }],
			condition_2: [{ field_code: "sc_are_there_any_new_pregnant_women_in_the__5", operator: "equals", value: false }],
		},
	},
	// Conditional IFA / 4+ ANC / CBAC Block (Q8 Yes/No)
	{
		code: "ANC_IFA_SC",
		name: "Pregnant Women Provided 180 IFA Tablets - SC-HWC",
		description: "Pregnant women provided 180 IFA full course tablets",
		numerator_name: "Total Pregnant Women provided 180 IFA (full course) tablets",
		denominator_name: "Total PW due for ANC",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-80%",
		target_value: JSON.stringify({ min: 50, max: 80 }),
		source_of_verification: "ANC Register",
		base_amount: 0,
		condition_1_amount: 500,
		condition_2_amount: 0,
		condition_config: {
			condition_1: [{ field_code: "sc_are_there_any_pregnant_women_in_the_catc_10", operator: "equals", value: true }],
			condition_2: [{ field_code: "sc_are_there_any_pregnant_women_in_the_catc_10", operator: "equals", value: false }],
		},
	},
	{
		code: "ANC_4CHECKUPS_SC",
		name: "4 or More ANC Checkups Received - SC-HWC",
		description: "Pregnant women received 4 or more ANC checkup reported in HMIS",
		numerator_name: "Total No of PW received 4 or more ANC check up reported in HMIS",
		denominator_name: "Total PW in the catchment area",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "80-100%",
		target_value: JSON.stringify({ min: 80, max: 100 }),
		source_of_verification: "HMIS / RCH 2.0",
		base_amount: 0,
		condition_1_amount: 500,
		condition_2_amount: 0,
		condition_config: {
			condition_1: [{ field_code: "sc_are_there_any_pregnant_women_in_the_catc_10", operator: "equals", value: true }],
			condition_2: [{ field_code: "sc_are_there_any_pregnant_women_in_the_catc_10", operator: "equals", value: false }],
		},
	},
	{
		code: "CBAC001_SC",
		name: "CBAC Forms Filled in Month - SC-HWC",
		description: "Community Based Assessment Checklist forms filled in the month",
		numerator_name: "No of CBAC form filled in the month",
		denominator_name: "Total 30+ population in the catchment area",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-100%",
		target_value: JSON.stringify({ min: 50, max: 100 }),
		source_of_verification: "CBAC Register",
		base_amount: 0,
		condition_1_amount: 0,
		condition_2_amount: 1000,
		condition_config: {
			condition_1: [{ field_code: "sc_are_there_any_pregnant_women_in_the_catc_10", operator: "equals", value: true }],
			condition_2: [{ field_code: "sc_are_there_any_pregnant_women_in_the_catc_10", operator: "equals", value: false }],
		},
	},
	{
		code: "FP001_SC",
		name: "FP Commodities Indent/Issues Generated - SC-HWC",
		description: "FP commodities indent or issues generated by facility",
		numerator_name: "Total of.FP commodities(any) indent/issues generated by facility",
		target_type: "RANGE",
		target_formula: "Minimum 1",
		target_value: JSON.stringify({ min: 1 }),
		source_of_verification: "FPLMIS / Register",
		base_amount: 500,
	},
	// TB Block (Cough App, Contact Tracing, Differentiated Care)
	{
		code: "TS001_SC",
		name: "TB Screening via Cough App - SC-HWC",
		description: "Individuals screened for TB at OPD/Outreach using Cough App",
		numerator_name: "Individuals screened for TB at OPD/Outreach/Shivir using Cough App",
		denominator_name: "Total OPD Footfall (M&F) as per HWC portal",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "1-80%",
		target_value: JSON.stringify({ min: 1, max: 80 }),
		source_of_verification: "Cough App",
		base_amount: 1500,
		condition_1_amount: 500,
		condition_2_amount: 1500,
		condition_3_amount: 1000,
		condition_4_amount: 1000,
		condition_config: {
			condition_1: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: true },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: true },
			],
			condition_2: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: false },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: false },
			],
			condition_3: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: true },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: false },
			],
			condition_4: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: false },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: true },
			],
		},
	},
	{
		code: "CT001_SC",
		name: "TB Contact Tracing Visits - SC-HWC",
		description: "Household visited for TB contact tracing for newly notified Pulmonary TB",
		numerator_name: "Household visited for TB contact tracing for newly Notified Pulm TB",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "1-100%",
		target_value: JSON.stringify({ min: 1, max: 100 }),
		source_of_verification: "Nikshay Portal",
		base_amount: 0,
		condition_1_amount: 500,
		condition_2_amount: 0,
		condition_3_amount: 500,
		condition_4_amount: 0,
		condition_config: {
			condition_1: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: true },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: true },
			],
			condition_2: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: false },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: false },
			],
			condition_3: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: true },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: false },
			],
			condition_4: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: false },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: true },
			],
		},
	},
	{
		code: "DC001_SC",
		name: "Differentiated TB Care Visits - SC-HWC",
		description: "TB patients under treatment conducted follow up for Differentiated TB Care",
		numerator_name: "No. of TB patients under treatment conducted follow up for Differentiated TB Care",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "1-100%",
		target_value: JSON.stringify({ min: 1, max: 100 }),
		source_of_verification: "Nikshay Portal",
		base_amount: 0,
		condition_1_amount: 500,
		condition_2_amount: 0,
		condition_3_amount: 0,
		condition_4_amount: 500,
		condition_config: {
			condition_1: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: true },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: true },
			],
			condition_2: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: false },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: false },
			],
			condition_3: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: true },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: false },
			],
			condition_4: [
				{ field_code: "sc_are_there_any_new_pulmonary_tb_diagnosed_24", operator: "equals", value: false },
				{ field_code: "sc_are_there_any_patients_any_type_currently_26", operator: "equals", value: true },
			],
		},
	},

	// Immunization & NCD Screening
	{
		code: "RS001_SC",
		name: "RI Sessions Held - SC-HWC",
		description: "No of Routine Immunization sessions held vs planned",
		numerator_name: "No of RI sessions held(including clinics)",
		denominator_name: "RI sessions planned(including clinics)",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "1-100%",
		target_value: JSON.stringify({ min: 1, max: 100 }),
		source_of_verification: "RI Register",
		base_amount: 500,
	},
	{
		code: "RF001_SC",
		name: "RI Beneficiary Footfall Coverage - SC-HWC",
		description: "Total beneficiary for Routine Immunization vs total RI footfall",
		numerator_name: "Total beneficiary for RI (due list)",
		denominator_name: "Total RI footfall",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "80-100%",
		target_value: JSON.stringify({ min: 80, max: 100 }),
		source_of_verification: "RI Register",
		base_amount: 500,
	},
	{
		code: "HS001_SC",
		name: "HTN Screening Coverage - SC-HWC",
		description: "Hypertension screened for the month vs 30+ population",
		numerator_name: "HTN screened (including rescreened) for the month",
		denominator_name: "Total 30+ population in the catchment area",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-100%",
		target_value: JSON.stringify({ min: 50, max: 100 }),
		source_of_verification: "NCD Portal",
		base_amount: 100,
	},
	{
		code: "DS001_SC",
		name: "DM Screening Coverage - SC-HWC",
		description: "Diabetes Mellitus screened for the month vs 30+ population",
		numerator_name: "DM screened (including rescreened) for the month",
		denominator_name: "Same as Q.20 (30+Population)",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-100%",
		target_value: JSON.stringify({ min: 50, max: 100 }),
		source_of_verification: "NCD Portal",
		base_amount: 100,
	},
	{
		code: "OC001_SC",
		name: "Oral Cancer Screening Coverage - SC-HWC",
		description: "Oral Cancer screened for the month vs 30+ population",
		numerator_name: "Oral Ca. Screened for the month",
		denominator_name: "Same as Q.20 (30+Population) - Oral Ca",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-100%",
		target_value: JSON.stringify({ min: 50, max: 100 }),
		source_of_verification: "NCD Portal",
		base_amount: 100,
	},
	{
		code: "BC001_SC",
		name: "Breast & Cervical Cancer Screening - SC-HWC",
		description: "Breast & Cervical Cancer screened vs 30+ female population",
		numerator_name: "Breast & Cervical Ca. screened for the month",
		denominator_name: "Total 30+ Female population",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "50-100%",
		target_value: JSON.stringify({ min: 50, max: 100 }),
		source_of_verification: "NCD Portal",
		base_amount: 100,
	},

	// NCD Diagnosis & Referral / Follow-up
	{
		code: "HTN_REF_SC",
		name: "HTN Diagnosis & Referral - SC-HWC",
		description: "No of HTN diagnosed & referred to higher facility vs diagnosed",
		numerator_name: "No of HTN sreened & referred to higher facility",
		denominator_name: "No of HTN diagnosed",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "30-70%",
		target_value: JSON.stringify({ min: 30, max: 70 }),
		source_of_verification: "NCD Register",
		base_amount: 400,
	},
	{
		code: "DM_REF_SC",
		name: "DM Diagnosis & Referral - SC-HWC",
		description: "No of DM diagnosed & referred to higher facility vs diagnosed",
		numerator_name: "No of DM sreened & referred to higher facility",
		denominator_name: "No of DM diagnosed",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "30-70%",
		target_value: JSON.stringify({ min: 30, max: 70 }),
		source_of_verification: "NCD Register",
		base_amount: 400,
	},
	{
		code: "HTN_FU_SC",
		name: "HTN Client Follow-Up Under Treatment - SC-HWC",
		description: "No of HTN clients follow up vs clients under treatment",
		numerator_name: "No of HTN clients follow up",
		denominator_name: "No of HTN clients under treatment",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "1-70%",
		target_value: JSON.stringify({ min: 1, max: 70 }),
		source_of_verification: "NCD Register",
		base_amount: 400,
	},
	{
		code: "DM_FU_SC",
		name: "DM Client Follow-Up Under Treatment - SC-HWC",
		description: "No of DM clients follow up vs clients under treatment",
		numerator_name: "No of DM clients follow up",
		denominator_name: "No of DM clients under treatment",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "1-70%",
		target_value: JSON.stringify({ min: 1, max: 70 }),
		source_of_verification: "NCD Register",
		base_amount: 400,
	},

	// General & Quality & Infrastructure
	{
		code: "PS001_SC",
		name: "Patient Satisfaction Score - SC-HWC",
		description: "Patient satisfaction score for the month",
		numerator_name: "Patient satisfaction score for the month",
		target_type: "RANGE",
		target_formula: "3.5-5",
		target_value: JSON.stringify({ min: 3.5, max: 5 }),
		source_of_verification: "Feedback Forms",
		base_amount: 1000,
	},
	{
		code: "EP001_SC",
		name: "Elderly & Palliative Home Visits - SC-HWC",
		description: "No of Elderly & Palliative patients visited vs identified",
		numerator_name: "No of Elderly & Palliative patients visited",
		denominator_name: "No of patients identified for Elderly/Palliative home visit",
		target_type: "PERCENTAGE_RANGE",
		target_formula: "80-100%",
		target_value: JSON.stringify({ min: 80, max: 100 }),
		source_of_verification: "Palliative Register",
		base_amount: 500,
	},
	{
		code: "EC001_SC",
		name: "Elderly Clinic Conducted - SC-HWC",
		description: "No of Elderly clinic conducted in a month",
		numerator_name: "No of Elderly clinic conducted in a month",
		target_type: "BINARY",
		target_formula: "1 & 0",
		target_value: JSON.stringify({ expected: 1 }),
		source_of_verification: "Monthly Report",
		base_amount: 500,
	},
	{
		code: "NQAS001_SC",
		name: "National NQAS Assessment Undergone - SC-HWC",
		description: "HWO undergone National NQAS assessment (Virtual/Physical)",
		numerator_name: "HWO undergone National NQAS assessment (Virtual/Physical)",
		target_type: "BINARY",
		target_formula: "1 & 0",
		target_value: JSON.stringify({ expected: 1 }),
		source_of_verification: "NQAS Certificate",
		base_amount: 1000,
	},
	{
		code: "DV001_SC",
		name: "DVDMS Issues Generated - SC-HWC",
		description: "No. of issues generated in DVDMS for Sub Centre",
		numerator_name: "No. of issues generated in DVDMS",
		target_type: "RANGE",
		target_formula: "10-20",
		target_value: JSON.stringify({ min: 10, max: 20 }),
		source_of_verification: "DVDMS Portal",
		base_amount: 1000,
	},
	{
		code: "SFORM001_SC",
		name: "S-Form IDSP Case Reporting - SC-HWC",
		description: "No of case reported in S-form (IDSP-IHIP) for the month",
		numerator_name: "No of case reported in S-form (IDSP-IHIP) for the month",
		target_type: "RANGE",
		target_formula: "15-24",
		target_value: JSON.stringify({ min: 15, max: 24 }),
		source_of_verification: "IHIP Portal",
		base_amount: 1000,
	},
];

async function setupSubcenterIndicators() {
	console.log("🚀 Starting Sub-Center Indicators & Remuneration Setup...");

	if (isDryRun) {
		console.log("⚠️ DRY-RUN MODE: No database changes will be written.\n");
	}

	// 1. Fetch Sub-Center Facility Type and Remuneration Record
	const subCenterType = await prisma.facility_type.findFirst({
		where: { name: "SC_HWC" },
	});

	if (!subCenterType) {
		throw new Error("❌ Facility type 'SC_HWC' (Sub Centre) not found in database.");
	}

	const subCenterFTR = await prisma.facility_type_remuneration.findFirst({
		where: { facility_type_id: subCenterType.id },
	});

	if (!subCenterFTR) {
		throw new Error("❌ facility_type_remuneration for 'SC_HWC' not found in database.");
	}

	// 2. Fetch all fields for fast name lookup
	const allFields = await prisma.field.findMany();
	const fieldByNameMap = new Map(allFields.map((f) => [f.name, f]));

	// 3. UNMAP / CLEAR ALL OLD Sub-Center indicator remunerations
	const oldRemunerationCount = await prisma.indicator_remuneration.count({
		where: { facility_type_remuneration_id: subCenterFTR.id },
	});

	if (isDryRun) {
		console.log(`🧹 [DRY-RUN] Would unmap ${oldRemunerationCount} existing indicator remunerations for Sub Centre.`);
	} else {
		const deleted = await prisma.indicator_remuneration.deleteMany({
			where: { facility_type_remuneration_id: subCenterFTR.id },
		});
		console.log(`🧹 Unmapped and released ${deleted.count} old indicator remunerations for Sub Centre.`);
	}

	// 4. Update applicable_facility_types on existing indicators to remove SC_HWC if present
	const existingIndicators = await prisma.indicator.findMany();
	let unlinkedCount = 0;

	for (const ind of existingIndicators) {
		const types = Array.isArray(ind.applicable_facility_types)
			? (ind.applicable_facility_types as string[])
			: [];

		if (types.includes("SC_HWC")) {
			unlinkedCount++;
			const updatedTypes = types.filter((t) => t !== "SC_HWC");
			if (isDryRun) {
				console.log(`  🔗 [DRY-RUN] Would remove SC_HWC from indicator '${ind.code}' (${ind.name})`);
			} else {
				await prisma.indicator.update({
					where: { id: ind.id },
					data: { applicable_facility_types: updatedTypes },
				});
			}
		}
	}
	console.log(`🔗 Unlinked SC_HWC from ${unlinkedCount} previously mapped indicators.\n`);

	// 5. Create / Update and Map the 29 Sub-Center Indicators
	let createdCount = 0;
	let updatedCount = 0;
	let mappedCount = 0;

	for (let i = 0; i < SUBCENTER_INDICATORS.length; i++) {
		const cfg = SUBCENTER_INDICATORS[i];

		const numField = cfg.numerator_name ? fieldByNameMap.get(cfg.numerator_name) : null;
		const denField = cfg.denominator_name ? fieldByNameMap.get(cfg.denominator_name) : null;

		let indicatorObj = await prisma.indicator.findUnique({
			where: { code: cfg.code },
		});

		const parsedTargetVal = cfg.target_value ? JSON.parse(cfg.target_value) : null;
		const rangeObj =
			parsedTargetVal && parsedTargetVal.min !== undefined && parsedTargetVal.max !== undefined
				? { min: parsedTargetVal.min, max: parsedTargetVal.max }
				: null;

		const indicatorData = {
			name: cfg.name,
			description: cfg.description,
			type: "MONTHLY_MONITORING",
			code: cfg.code,
			applicable_facility_types: ["SC_HWC"],
			numerator_field_id: numField?.id ?? null,
			numerator_label: cfg.numerator_name ?? null,
			denominator_field_id: denField?.id ?? null,
			denominator_label: cfg.denominator_name ?? null,
			target_type: cfg.target_type as any,
			target_formula: cfg.target_formula,
			target_value: cfg.target_value,
			source_of_verification: cfg.source_of_verification,
			formula_config: {
				calculationFormula: numField && denField ? "(A/B)*100" : undefined,
				range: rangeObj,
			},
			updated_at: new Date(),
		};

		if (!indicatorObj) {
			createdCount++;
			if (isDryRun) {
				console.log(`✨ [DRY-RUN ${i + 1}/${SUBCENTER_INDICATORS.length}] Would CREATE indicator: ${cfg.code} - "${cfg.name}"`);
			} else {
				indicatorObj = await prisma.indicator.create({
					data: {
						...indicatorData,
						created_at: new Date(),
					},
				});
				console.log(`✨ [${i + 1}/${SUBCENTER_INDICATORS.length}] Created indicator: ${cfg.code} - "${cfg.name}"`);
			}
		} else {
			updatedCount++;
			if (isDryRun) {
				console.log(`🔄 [DRY-RUN ${i + 1}/${SUBCENTER_INDICATORS.length}] Would UPDATE indicator: ${cfg.code} - "${cfg.name}"`);
			} else {
				// Merge SC_HWC into applicable_facility_types if not present
				const existingTypes = Array.isArray(indicatorObj.applicable_facility_types)
					? (indicatorObj.applicable_facility_types as string[])
					: [];
				const mergedTypes = Array.from(new Set([...existingTypes, "SC_HWC"]));

				indicatorObj = await prisma.indicator.update({
					where: { id: indicatorObj.id },
					data: {
						...indicatorData,
						applicable_facility_types: mergedTypes,
					},
				});
				console.log(`🔄 [${i + 1}/${SUBCENTER_INDICATORS.length}] Updated indicator: ${cfg.code} - "${cfg.name}"`);
			}
		}

		// 6. Map to Sub-Center indicator_remuneration
		mappedCount++;
		if (isDryRun) {
			console.log(`   💰 [DRY-RUN] Would MAP to Sub Centre Remuneration (Base: ₹${cfg.base_amount})`);
		} else if (indicatorObj) {
			await prisma.indicator_remuneration.create({
				data: {
					facility_type_remuneration_id: subCenterFTR.id,
					indicator_id: indicatorObj.id,
					base_amount: cfg.base_amount,
					condition_1_amount: cfg.condition_1_amount ?? null,
					condition_2_amount: cfg.condition_2_amount ?? null,
					condition_3_amount: cfg.condition_3_amount ?? null,
					condition_4_amount: cfg.condition_4_amount ?? null,
					condition_config: cfg.condition_config ?? null,
					updated_at: new Date(),
				},
			});
			console.log(`   💰 Mapped to Sub Centre Remuneration (Base: ₹${cfg.base_amount})`);
		}
	}

	console.log("\n==========================================");
	console.log("🎉 Sub-Center Indicator Setup Summary:");
	console.log(`  - Dry Run: ${isDryRun ? "YES" : "NO"}`);
	console.log(`  - Indicators Created: ${createdCount}`);
	console.log(`  - Indicators Updated: ${updatedCount}`);
	console.log(`  - Indicators Mapped to Sub Centre: ${mappedCount}`);
	console.log("==========================================");
}

setupSubcenterIndicators()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("❌ Setup failed:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
