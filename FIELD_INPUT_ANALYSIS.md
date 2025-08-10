# Field Input Analysis

## Overview

This document analyzes all fields in the PLP Portal system to identify which fields require user input versus which are hardcoded or automatically calculated.

## Field Categories

### 🔴 **REQUIRES USER INPUT**

#### **Admin Input Fields (ADMIN user_type)**

These fields are managed by administrators and require manual input:

| Field Code                  | Field Name            | Field Type        | Category   | Description                                   |
| --------------------------- | --------------------- | ----------------- | ---------- | --------------------------------------------- |
| `total_population`          | Total Population      | FACILITY_SPECIFIC | DATA_FIELD | Total population of facility's catchment area |
| `population_18_plus`        | Population 18+        | FACILITY_SPECIFIC | DATA_FIELD | Population aged 18 and above                  |
| `population_30_plus`        | Population 30+        | FACILITY_SPECIFIC | DATA_FIELD | Population aged 30 and above                  |
| `population_30_plus_female` | Female Population 30+ | FACILITY_SPECIFIC | DATA_FIELD | Female population aged 30 and above           |
| `anc_due_list`              | ANC Due List          | FACILITY_SPECIFIC | DATA_FIELD | Number of pregnant women due for ANC          |
| `ri_sessions_planned`       | RI Sessions Planned   | FACILITY_SPECIFIC | DATA_FIELD | Number of RI sessions planned for the month   |
| `ri_beneficiaries_due`      | RI Beneficiaries Due  | FACILITY_SPECIFIC | DATA_FIELD | Total beneficiaries due for RI                |
| `bedridden_patients`        | Bed-ridden Patients   | FACILITY_SPECIFIC | DATA_FIELD | Total bed-ridden patients requiring home care |
| `pulmonary_tb_patients`     | Pulmonary TB Patients | FACILITY_SPECIFIC | DATA_FIELD | Total pulmonary TB patients under treatment   |
| `total_tb_patients`         | Total TB Patients     | FACILITY_SPECIFIC | DATA_FIELD | Total TB patients under treatment             |
| `ncd_referred_from_sc`      | NCD Referred from SC  | FACILITY_SPECIFIC | DATA_FIELD | Total referred from SC as per NCD portal      |

#### **Facility Input Fields (FACILITY user_type)**

These fields are submitted by facility staff monthly:

| Field Code                        | Field Name                        | Field Type    | Category   | Description                                                 |
| --------------------------------- | --------------------------------- | ------------- | ---------- | ----------------------------------------------------------- |
| `total_footfall`                  | Total Footfall                    | MONTHLY_COUNT | DATA_FIELD | Total footfall (SC+Clinic) for SC, PHC+colocated SC for PHC |
| `wellness_sessions_conducted`     | Wellness Sessions Conducted       | MONTHLY_COUNT | DATA_FIELD | Total wellness sessions conducted during the month          |
| `prakriti_parikshan_conducted`    | Prakriti Parikshan Conducted      | MONTHLY_COUNT | DATA_FIELD | Number of Prakriti Parikshan conducted                      |
| `teleconsultation_conducted`      | Teleconsultation Conducted        | MONTHLY_COUNT | DATA_FIELD | Total teleconsultation conducted                            |
| `anc_footfall`                    | ANC Footfall                      | MONTHLY_COUNT | DATA_FIELD | Total ANC beneficiary irrespective of gestation             |
| `anc_tested_hb`                   | ANC Tested for Hb                 | MONTHLY_COUNT | DATA_FIELD | Total ANC tested for Hb                                     |
| `tb_screenings`                   | TB Screenings                     | MONTHLY_COUNT | DATA_FIELD | Individuals screened for TB                                 |
| `tb_contact_tracing_households`   | TB Contact Tracing Households     | MONTHLY_COUNT | DATA_FIELD | Households visited for TB contact tracing                   |
| `tb_differentiated_care_visits`   | TB Differentiated Care Visits     | MONTHLY_COUNT | DATA_FIELD | TB patients visited for differentiated care                 |
| `ri_sessions_held`                | RI Sessions Held                  | MONTHLY_COUNT | DATA_FIELD | RI sessions held                                            |
| `ri_footfall`                     | RI Footfall                       | MONTHLY_COUNT | DATA_FIELD | Total RI footfall                                           |
| `cbac_forms_filled`               | CBAC Forms Filled                 | MONTHLY_COUNT | DATA_FIELD | CBAC filled for the month (including rescreened)            |
| `htn_screened`                    | HTN Screened                      | MONTHLY_COUNT | DATA_FIELD | HTN screened for the month (including rescreened)           |
| `dm_screened`                     | DM Screened                       | MONTHLY_COUNT | DATA_FIELD | DM screened for the month (including rescreened)            |
| `oral_cancer_screened`            | Oral Cancer Screened              | MONTHLY_COUNT | DATA_FIELD | Oral cancer screened for the month                          |
| `breast_cervical_cancer_screened` | Breast & Cervical Cancer Screened | MONTHLY_COUNT | DATA_FIELD | Breast & cervical cancer screened for the month             |
| `ncd_diagnosed_tx_completed`      | NCD Diagnosed & Tx Completed      | MONTHLY_COUNT | DATA_FIELD | NCD diagnosed and treatment completed                       |
| `patient_satisfaction_score`      | Patient Satisfaction Score        | MONTHLY_COUNT | DATA_FIELD | Patient satisfaction score for the month                    |
| `elderly_palliative_visits`       | Elderly & Palliative Visits       | MONTHLY_COUNT | DATA_FIELD | Number of elderly and palliative patients visited           |
| `elderly_clinic_conducted`        | Elderly Clinic Conducted          | MONTHLY_COUNT | DATA_FIELD | Number of elderly clinic conducted                          |
| `jas_meetings_conducted`          | JAS Meetings Conducted            | MONTHLY_COUNT | DATA_FIELD | Number of JAS meetings conducted                            |
| `dvdms_issues_generated`          | DVDMS Issues Generated            | MONTHLY_COUNT | DATA_FIELD | Number of issues generated in DVDMS                         |
| `elderly_support_group_formed`    | Elderly Support Group Formed      | BINARY        | DATA_FIELD | Whether Elderly Support Group (Sanjivini) is formed         |
| `elderly_support_group_activity`  | Elderly Support Group Activity    | BINARY        | DATA_FIELD | If Yes, any activity conducted during the month             |

### 🟢 **HARDCODED/AUTOMATIC**

#### **Target Values (Stored in formula_config)**

Target values are now stored directly in the indicator's `formula_config` and are not separate fields:

- **Wellness Sessions**: Target 10 sessions/month
- **Teleconsultation**: Target 25 (SC) / 50 (PHC) calls/month  
- **Elderly Clinic**: Target 1 (SC) / 4 (PHC) clinics/month
- **JAS Meetings**: Target 1 meeting/month
- **DVDMS Issues**: Target 20 (SC) / 50 (PHC) / 100 (UPHC) issues/month
- **Patient Satisfaction**: Max score 5

## Form Requirements

### **Admin Forms Needed**

1. **Population Data Form**

   - Total Population
   - Population 18+
   - Population 30+
   - Female Population 30+

2. **Patient Lists Form**
   - ANC Due List
   - RI Sessions Planned
   - RI Beneficiaries Due
   - Bed-ridden Patients
   - Pulmonary TB Patients
   - Total TB Patients
   - NCD Referred from SC

### **Facility Forms Needed**

1. **Monthly Activity Form**

   - Total Footfall
   - Wellness Sessions Conducted
   - Teleconsultation Conducted
   - ANC Footfall
   - ANC Tested for Hb
   - TB Screenings
   - TB Contact Tracing Households
   - TB Differentiated Care Visits
   - RI Sessions Held
   - RI Footfall
   - CBAC Forms Filled
   - HTN Screened
   - DM Screened
   - Oral Cancer Screened
   - Breast & Cervical Cancer Screened
   - NCD Diagnosed & Tx Completed
   - Patient Satisfaction Score
   - Elderly & Palliative Visits
   - Elderly Clinic Conducted
   - JAS Meetings Conducted
   - DVDMS Issues Generated

2. **Binary Activity Form**

   - Elderly Support Group Formed (Yes/No)
   - Elderly Support Group Activity (Yes/No)

3. **Ayush-Specific Form**
   - Prakriti Parikshan Conducted

## Implementation Recommendations

### **1. Admin Dashboard**

- Population data management interface
- Patient list management interface
- Bulk import/export functionality

### **2. Facility Dashboard**

- Monthly activity submission form
- Binary activity submission form
- Data validation and approval workflow

### **3. Data Validation**

- Range validation for numeric fields
- Required field validation
- Cross-field validation (e.g., ANC tested ≤ ANC footfall)

### **4. Reporting**

- Monthly submission status
- Data completeness reports
- Performance tracking dashboards

## Field Usage by Indicator

### **Numerator Fields (Facility Input)**

- All facility-submitted monthly counts
- Binary fields for Yes/No activities

### **Denominator Fields (Admin Input)**

- Population data
- Patient lists
- Target values

### **Target Fields (Hardcoded)**

- Fixed target values per facility type
- Maximum scores for satisfaction surveys

## Summary

- **32 Total Fields** (removed 13 target fields)
- **11 Fields require Admin input** (population data, patient lists)
- **22 Fields require Facility input** (monthly activities, binary responses)
- **0 Fields are hardcoded** (target values moved to formula_config)

The system needs forms for both admin and facility users to input their respective data, while target values are stored in the indicator's formula_config for consistency.
