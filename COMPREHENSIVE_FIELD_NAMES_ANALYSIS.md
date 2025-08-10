# Comprehensive Field Names Analysis - All Source Files

## 🎯 **Overview**

This document analyzes ALL field names from ALL indicator source files and identifies what needs to be updated in the database schema and seed files.

## 📊 **Source Files Analyzed**

1. **phcindicators.md** - PHC indicators (27 lines)
2. **schwcindicators.md** - SC-HWC indicators (29 lines) 
3. **uphcindicators.md** - UPHC indicators (13 lines)
4. **urbanhwc.md** - U-HWC indicators (16 lines)
5. **ayushindicators.md** - A-HWC indicators (30 lines)

## 🔍 **Field Names Extraction from Source Files**

### **PHC Indicators (phcindicators.md)**

| Sl | Indicator Name | Numerator Field | Denominator Field | Field Names Needed |
|----|----------------|-----------------|-------------------|-------------------|
| 1 | Total Footfall (M&F) | Total Footfall (M&F) PHC+colocated SC | Total catchment population for PHC | `total_footfall`, `total_population` |
| 2 | Total Wellness sessions | Total Wellness session conducted during the month | 10 | `wellness_sessions_conducted`, `target_wellness_sessions` |
| 3 | Teleconsultation | Total Teleconsultation attended | 50 | `teleconsultation_conducted`, `target_teleconsultation` |
| 4 | Total ANC footfall (naupai check up) | Total ANC beneficiary irrespective of gestation(new + old registration) | Total ANC due as per ANC due list(co-located SC) | `anc_footfall`, `anc_due_list` |
| 5 | Pregnant women tested for Hb | Total ANC tested for Hb | Total ANC footfall (Old + New Case) co-located SC | `anc_tested_hb`, `anc_footfall` |
| 6 | Individuals screened for TB | Individuals screened for TB | Total footfall for the month(including co-located SC) | `tb_screenings`, `total_footfall` |
| 7 | Household visited for TB contact tracing | Total Number of Household visited for Pulmonary TB contact tracing for Symptom screening and Skin testing(Mantoux/Cy TB) | Total No of Pulmonary TB patients under treatment under co-located SC catchment area | `tb_contact_tracing_households`, `pulmonary_tb_patients` |
| 8 | No. of TB patients visited for Differentiated TB Care | No. of TB patients visited for Differentiated TB Care | Total TB patients under Treatment (Pulmonary + Extra Pulmonary TB) by co-located SC | `tb_differentiated_care_visits`, `total_tb_patients` |
| 9 | RI sessions held | RI sessions held | No of RI session planned (co-located SC) | `ri_sessions_held`, `ri_sessions_planned` |
| 10 | RI footfall | Total RI footfall (u-Win) | Total beneficiary reported in u-Win (including co-located SC) | `ri_footfall`, `ri_beneficiaries_due` |
| 11 | CBAC filled for the month (including rescreened) | CBAC filled for the month (including rescreened) | Total 30+ population/12 (co-located SC) | `cbac_forms_filled`, `population_30_plus` |
| 12 | HTN screened (including rescreened) for the month | HTN screened (including rescreened) for the month | Total 30+ population/12 (co-located SC) | `htn_screened`, `population_30_plus` |
| 13 | DM screened (including rescreened) for the month | DM screened (including rescreened) for the month | Total 30+ population/12 (co-located SC) | `dm_screened`, `population_30_plus` |
| 14 | Oral Ca. Screened for the month | Oral Ca. Screened for the month | Total 30+ population/60 (co-located SC) | `oral_cancer_screened`, `population_30_plus` |
| 15 | Breast & Cervical Ca. screened for the month | Breast & Cervical Ca. screened for the month | Total Female 30+ population/60 (co-located SC) | `breast_cervical_cancer_screened`, `population_30_plus_female` |
| 16 | NCD Diagnosed & Tx completed | NCD Diagnosed & Tx completed | Total referred from SC as per NCD portal | `ncd_diagnosed_tx_completed`, `ncd_referred_from_sc` |
| 17 | Patient satisfaction score for the month | Patient satisfaction score for the month | 5 | `patient_satisfaction_score`, `patient_satisfaction_max` |
| 18 | No of Elderly & Palliative patients visited | No of Elderly & Palliative patients visited | Total bed-ridden patients identified who require home based care(co-located SC area) | `elderly_palliative_visits`, `bedridden_patients` |
| 19 | No of Elderly clinic conducted | No of Elderly clinic conducted | 4 | `elderly_clinic_conducted`, `target_elderly_clinic` |
| 20 | No of JAS meeting conducted | No of JAS meeting conducted | 1 | `jas_meetings_conducted`, `target_jas_meetings` |
| 21 | No. of issues generated in DVDMS | No. of issues generated in DVDMS | 50 | `dvdms_issues_generated`, `target_dvdms_issues` |

### **SC-HWC Indicators (schwcindicators.md)**

| Sl | Indicator Name | Numerator Field | Denominator Field | Field Names Needed |
|----|----------------|-----------------|-------------------|-------------------|
| 1 | Total Footfall (M&F) | Total footfall (SC+Clinic) | Total population of the catchment area | `total_footfall`, `total_population` |
| 2 | Total Wellness sessions | Total Wellness session conducted during the month | 10 | `wellness_sessions_conducted`, `target_wellness_sessions` |
| 3 | Teleconsultation | Total Teleconsultation conducted | 25 | `teleconsultation_conducted`, `target_teleconsultation` |
| 4 | Total ANC footfall | Total ANC beneficiary irrespective of gestation(new + old registration) | Total ANC due as per ANC due list | `anc_footfall`, `anc_due_list` |
| 5 | Pregnant women tested for Hb | Total ANC tested for Hb | Total ANC footfall (Old + New Case) | `anc_tested_hb`, `anc_footfall` |
| 6 | Individuals screened for TB | Individuals screened for TB | Total footfall for the month | `tb_screenings`, `total_footfall` |
| 7 | Household visited for TB contact tracing | Total Number of Household visited for Pulmonary TB contact tracing for Symptom screening and Skin testing(Mantoux/Cy TB) | Total No of Pulmonary TB patients under treatment | `tb_contact_tracing_households`, `pulmonary_tb_patients` |
| 8 | No. of TB patients visited for Differentiated TB Care | No. of TB patients visited for Differentiated TB Care | Total TB patients under Treatment (Pulmonday + Extra Pulmonary TB) | `tb_differentiated_care_visits`, `total_tb_patients` |
| 9 | RI sessions held | RI sessions held | No of RI session planned | `ri_sessions_held`, `ri_sessions_planned` |
| 10 | RI footfall | Total RI footfall (u-Win) | Total beneficiary reported in u-Win | `ri_footfall`, `ri_beneficiaries_due` |
| 11 | CBAC filled for the month (including rescreened) | CBAC filled for the month (including rescreened) | Total 30+ population/12 | `cbac_forms_filled`, `population_30_plus` |
| 12 | HTN screened (including rescreened) for the month | HTN screened (including rescreened) for the month | Total 30+ population/12 | `htn_screened`, `population_30_plus` |
| 13 | DM screened (including rescreened) for the month | DM screened (including rescreened) for the month | Total 30+ population/12 | `dm_screened`, `population_30_plus` |
| 14 | Oral Ca. Screened for the month | Oral Ca. Screened for the month | Total 30+ population/60 | `oral_cancer_screened`, `population_30_plus` |
| 15 | Breast & Cervical Ca. screened for the month | Breast & Cervical Ca. screened for the month | Total Female 30+ population/60 | `breast_cervical_cancer_screened`, `population_30_plus_female` |
| 16 | Patient satisfaction score for the month | Patient satisfaction score for the month | 5 | `patient_satisfaction_score`, `patient_satisfaction_max` |
| 17 | No of Elderly & Palliative patients visited | No of Elderly & Palliative patients visited | Total bed-ridden patients identified who require home based care | `elderly_palliative_visits`, `bedridden_patients` |
| 18 | No of Elderly clinic conducted | No of Elderly clinic conducted | 1 | `elderly_clinic_conducted`, `target_elderly_clinic` |
| 19 | Whether Elderly Support Group (Sanjivini) is formed | Whether Elderly Support Group (Sanjivini) is formed | Yes/No | `elderly_support_group_formed` |
| 20 | If Yes, any activity conducted during the month | If Yes, any activity conducted during the month | - | `elderly_support_group_activity` |
| 21 | No of JAS meeting conducted | No of JAS meeting conducted | 1 | `jas_meetings_conducted`, `target_jas_meetings` |
| 22 | No. of issues generated in DVDMS | No. of issues generated in DVDMS | 20 | `dvdms_issues_generated`, `target_dvdms_issues` |

### **UPHC Indicators (uphcindicators.md)**

| Sl | Indicator Name | Numerator Field | Denominator Field | Field Names Needed |
|----|----------------|-----------------|-------------------|-------------------|
| 1 | Total Footfall (M&F) | Total Footfall (M&F) PHC+colocated SC | Total catchment population for PHC | `total_footfall`, `total_population` |
| 2 | Total Wellness sessions | Total Wellness session conducted during the month | 10 | `wellness_sessions_conducted`, `target_wellness_sessions` |
| 3 | Teleconsultation | Total Teleconsultation attended | 50 | `teleconsultation_conducted`, `target_teleconsultation` |
| 4 | Individuals screened for TB | Individuals screened for TB | Total footfall for the month(including co-located SC) | `tb_screenings`, `total_footfall` |
| 5 | NCD Diagnosed & Tx completed | NCD Diagnosed & Tx completed | Total referred from SC as per NCD portal | `ncd_diagnosed_tx_completed`, `ncd_referred_from_sc` |
| 6 | Patient satisfaction score for the month | Patient satisfaction score for the month | 5 | `patient_satisfaction_score`, `patient_satisfaction_max` |
| 7 | No of Elderly clinic conducted | No of Elderly clinic conducted | 4 | `elderly_clinic_conducted`, `target_elderly_clinic` |
| 8 | No of JAS meeting conducted | No of JAS meeting conducted | 1 | `jas_meetings_conducted`, `target_jas_meetings` |
| 9 | No. of issues generated in DVDMS | No. of issues generated in DVDMS | 100 | `dvdms_issues_generated`, `target_dvdms_issues` |

### **U-HWC Indicators (urbanhwc.md)**

| Sl | Indicator Name | Numerator Field | Denominator Field | Field Names Needed |
|----|----------------|-----------------|-------------------|-------------------|
| 1 | Total Footfall (M&F) | Total Footfall (M&F) | Total catchment population | `total_footfall`, `total_population` |
| 2 | Total Wellness sessions | Total Wellness session conducted during the month | 10 | `wellness_sessions_conducted`, `target_wellness_sessions` |
| 3 | Teleconsultation | Total Teleconsultation attended | 50 | `teleconsultation_conducted`, `target_teleconsultation` |
| 4 | Individuals screened for TB | Individuals screened for TB | Total footfall for the month | `tb_screenings`, `total_footfall` |
| 5 | Household visited for TB contact tracing | Total Number of Household visited for Pulmonary TB contact tracing for Symptom screening and Skin testing(Mantoux/Cy TB) | Total No of Pulmonary TB patients under treatment | `tb_contact_tracing_households`, `pulmonary_tb_patients` |
| 6 | No. of TB patients visited for Differentiated TB Care | No. of TB patients visited for Differentiated TB Care | Total TB patients under Treatment (Pulmonday + Extra Pulmonary TB) | `tb_differentiated_care_visits`, `total_tb_patients` |
| 7 | No of Elderly & Palliative patients visited | No of Elderly & Palliative patients visited | Total bed-ridden patients identified who require home based car | `elderly_palliative_visits`, `bedridden_patients` |
| 8 | No of Elderly clinic conducted | No of Elderly clinic conducted | 4 | `elderly_clinic_conducted`, `target_elderly_clinic` |
| 9 | No of JAS meeting conducted | No of JAS meeting conducted | 1 | `jas_meetings_conducted`, `target_jas_meetings` |
| 10 | No. of issues generated in DVDMS | No. of issues generated in DVDMS | 50 | `dvdms_issues_generated`, `target_dvdms_issues` |

### **A-HWC Indicators (ayushindicators.md)**

| Sl | Indicator Name | Numerator Field | Denominator Field | Field Names Needed |
|----|----------------|-----------------|-------------------|-------------------|
| 1 | Total Footfall (M&F) | Total footfall (SC+Clinic) | Total population of the catchment area | `total_footfall`, `total_population` |
| 2 | Total Wellness sessions | Total Wellness session conducted during the month | 10 | `wellness_sessions_conducted`, `target_wellness_sessions` |
| 3 | No of Prakriti Parikshan conducted | No of Prakriti Parikshan conducted | Total 18+ population in the catchment area/12 | `prakriti_parikshan_conducted`, `population_18_plus` |
| 4 | Teleconsultation | Total Teleconsultation conducted | 25 | `teleconsultation_conducted`, `target_teleconsultation` |
| 5 | Total ANC footfall | Total ANC beneficiary irrespective of gestation(new + old registration) | Total ANC due as per ANC due list | `anc_footfall`, `anc_due_list` |
| 6 | Pregnant women tested for Hb | Total ANC tested for Hb | Total ANC footfall (Old + New Case) | `anc_tested_hb`, `anc_footfall` |
| 7 | Individuals screened for TB | Individuals screened for TB | Total footfall for the month | `tb_screenings`, `total_footfall` |
| 8 | Household visited for TB contact tracing | Total Number of Household visited for Pulmonary TB contact tracing for Symptom screening and Skin testing(Mantoux/Cy TB) | Total No of Pulmonary TB patients under treatment | `tb_contact_tracing_households`, `pulmonary_tb_patients` |
| 9 | No. of TB patients visited for Differentiated TB Care | No. of TB patients visited for Differentiated TB Care | Total TB patients under Treatment (Pulmonday + Extra Pulmonary TB) | `tb_differentiated_care_visits`, `total_tb_patients` |
| 10 | RI sessions held | RI sessions held | No of RI session planned | `ri_sessions_held`, `ri_sessions_planned` |
| 11 | RI footfall | Total RI footfall (u-Win) | Total beneficiary reported in u-Win | `ri_footfall`, `ri_beneficiaries_due` |
| 12 | CBAC filled for the month (including rescreened) | CBAC filled for the month (including rescreened) | Total 30+ population/12 | `cbac_forms_filled`, `population_30_plus` |
| 13 | HTN screened (including rescreened) for the month | HTN screened (including rescreened) for the month | Total 30+ population/12 | `htn_screened`, `population_30_plus` |
| 14 | DM screened (including rescreened) for the month | DM screened (including rescreened) for the month | Total 30+ population/12 | `dm_screened`, `population_30_plus` |
| 15 | Oral Ca. Screened for the month | Oral Ca. Screened for the month | Total 30+ population/60 | `oral_cancer_screened`, `population_30_plus` |
| 16 | Breast & Cervical Ca. screened for the month | Breast & Cervical Ca. screened for the month | Total Female 30+ population/60 | `breast_cervical_cancer_screened`, `population_30_plus_female` |
| 17 | Patient satisfaction score for the month | Patient satisfaction score for the month | 5 | `patient_satisfaction_score`, `patient_satisfaction_max` |
| 18 | No of Elderly & Palliative patients visited | No of Elderly & Palliative patients visited | Total bed-ridden patients identified who require home based care | `elderly_palliative_visits`, `bedridden_patients` |
| 19 | No of Elderly clinic conducted | No of Elderly clinic conducted | 1 | `elderly_clinic_conducted`, `target_elderly_clinic` |
| 20 | Whether Elderly Support Group (Sanjivini) is formed | Whether Elderly Support Group (Sanjivini) is formed | Yes/No | `elderly_support_group_formed` |
| 21 | If Yes, any activity conducted during the month | If Yes, no of activity/session conducted during the month(updated) | - | `elderly_support_group_activity` |
| 22 | No of JAS meeting conducted | No of JAS meeting conducted | 1 | `jas_meetings_conducted`, `target_jas_meetings` |
| 23 | No. of issues generated in DVDMS | No. of issues generated in DVDMS | 20 | `dvdms_issues_generated`, `target_dvdms_issues` |

## 🎯 **Complete Field Names List**

### **ADMIN Fields (Pre-filled by admin)**

1. `total_population` - Total Population
2. `population_18_plus` - Population 18+
3. `population_30_plus` - Population 30+
4. `population_30_plus_female` - Female Population 30+
5. `anc_due_list` - ANC Due List
6. `ri_sessions_planned` - RI Sessions Planned
7. `ri_beneficiaries_due` - RI Beneficiaries Due
8. `bedridden_patients` - Bed-ridden Patients
9. `pulmonary_tb_patients` - Pulmonary TB Patients
10. `total_tb_patients` - Total TB Patients
11. `ncd_referred_from_sc` - NCD Referred from SC

### **TARGET Fields (Generic targets)**

12. `target_wellness_sessions` - Target Wellness Sessions
13. `target_teleconsultation` - Target Teleconsultation
14. `target_elderly_clinic` - Target Elderly Clinic
15. `target_jas_meetings` - Target JAS Meetings
16. `target_dvdms_issues` - Target DVDMS Issues
17. `patient_satisfaction_max` - Patient Satisfaction Max Score

### **FACILITY Fields (Submitted by facilities)**

18. `total_footfall` - Total Footfall
19. `wellness_sessions_conducted` - Wellness Sessions Conducted
20. `prakriti_parikshan_conducted` - Prakriti Parikshan Conducted
21. `teleconsultation_conducted` - Teleconsultation Conducted
22. `anc_footfall` - ANC Footfall
23. `anc_tested_hb` - ANC Tested for Hb
24. `tb_screenings` - TB Screenings
25. `tb_contact_tracing_households` - TB Contact Tracing Households
26. `tb_differentiated_care_visits` - TB Differentiated Care Visits
27. `ri_sessions_held` - RI Sessions Held
28. `ri_footfall` - RI Footfall
29. `cbac_forms_filled` - CBAC Forms Filled
30. `htn_screened` - HTN Screened
31. `dm_screened` - DM Screened
32. `oral_cancer_screened` - Oral Cancer Screened
33. `breast_cervical_cancer_screened` - Breast & Cervical Cancer Screened
34. `ncd_diagnosed_tx_completed` - NCD Diagnosed & Tx Completed
35. `patient_satisfaction_score` - Patient Satisfaction Score
36. `elderly_palliative_visits` - Elderly & Palliative Visits
37. `elderly_clinic_conducted` - Elderly Clinic Conducted
38. `jas_meetings_conducted` - JAS Meetings Conducted
39. `dvdms_issues_generated` - DVDMS Issues Generated
40. `elderly_support_group_formed` - Elderly Support Group Formed
41. `elderly_support_group_activity` - Elderly Support Group Activity

## 🚨 **Issues Found**

### **1. Missing Fields in Current Implementation**

- `population_18_plus` - Missing for A-HWC Prakriti Parikshan
- `target_wellness_sessions` - Should be `target_wellness_sessions` not `target_wellness_sessions_generic`
- `target_teleconsultation` - Should be `target_teleconsultation` not `target_teleconsultation_generic`
- `target_elderly_clinic` - Should be `target_elderly_clinic` not `target_elderly_clinic_generic`
- `target_jas_meetings` - Should be `target_jas_meetings` not `target_jas_meetings_generic`
- `target_dvdms_issues` - Should be `target_dvdms_issues` not `target_dvdms_generic`

### **2. Field Name Mismatches**

- Current: `prakriti_parikshan_conducted` ✅ (Correct)
- Current: `tb_contact_tracing_households` ✅ (Correct)
- Current: `tb_differentiated_care_visits` ✅ (Correct)
- Current: `cbac_forms_filled` ✅ (Correct)
- Current: `htn_screened` ✅ (Correct)
- Current: `dm_screened` ✅ (Correct)
- Current: `oral_cancer_screened` ✅ (Correct)
- Current: `breast_cervical_cancer_screened` ✅ (Correct)
- Current: `ncd_diagnosed_tx_completed` ✅ (Correct)
- Current: `patient_satisfaction_score` ✅ (Correct)
- Current: `elderly_palliative_visits` ✅ (Correct)
- Current: `elderly_clinic_conducted` ✅ (Correct)
- Current: `jas_meetings_conducted` ✅ (Correct)
- Current: `dvdms_issues_generated` ✅ (Correct)
- Current: `elderly_support_group_formed` ✅ (Correct)
- Current: `elderly_support_group_activity` ✅ (Correct)

### **3. Field Names That Need Updates**

1. **Target Fields**: Remove `_generic` suffix
2. **Add Missing Field**: `population_18_plus`
3. **Update Descriptions**: Match exact descriptions from source files

## 📝 **Required Updates**

### **1. Update Seed Fields Complete**

**File**: `prisma/seed-fields-complete.ts`

**Required Changes**:
- Add `population_18_plus` field
- Update target field names (remove `_generic` suffix)
- Update field descriptions to match source files exactly

### **2. Update Database Schema**

**File**: `prisma/schema.prisma`

**Required Changes**:
- Ensure all field types are properly defined
- Update field constraints if needed

### **3. Update Field Mappings**

**File**: `scripts/setup-facility-field-mappings.ts`

**Required Changes**:
- Update field codes to match new names
- Ensure all facility types have correct field mappings

### **4. Update Indicator Seed Script**

**File**: `prisma/seed-indicators-from-fields.ts`

**Required Changes**:
- Update field references to use correct field names
- Ensure all indicators reference correct fields

## 🎯 **Next Steps**

1. **Update seed-fields-complete.ts** with all correct field names
2. **Update field mappings** in setup-facility-field-mappings.ts
3. **Update indicator seed script** with correct field references
4. **Test the implementation** with all facility types
5. **Update documentation** to reflect correct field names
