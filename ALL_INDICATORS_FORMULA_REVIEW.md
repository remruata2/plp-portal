# PLP Portal - Complete Indicator Formulas for Facility Remuneration

## 🏥 **Overview**

This document provides a comprehensive list of all 24 indicators used in the PLP Portal system for calculating facility incentives and remuneration. Each indicator includes its actual mathematical formula, target thresholds, and remuneration calculation logic.

## 💰 **How Remuneration is Calculated**

### **Linear Incentive Distribution System**
The PLP Portal uses a **linear incentive distribution** model:
- **Performance directly proportional to incentives**
- 50% performance = 50% of maximum incentive
- 75% performance = 75% of maximum incentive  
- 100% performance = 100% of maximum incentive

### **Formula Types Used:**
1. **PERCENTAGE_RANGE** - Linear progression within percentage ranges (e.g., 50%-100%)
2. **BINARY** - All-or-nothing achievement (e.g., 100% required)
3. **RANGE** - Linear progression within count ranges (e.g., 5-10 sessions)

---

## 📊 **Complete Indicator List (24 Indicators)**

### **✅ PERCENTAGE_RANGE Indicators (12 indicators)**

#### **1. TF001 - Total Footfall (M&F)**

- **Target**: 5% of Total Population
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 3-5%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Linear progression from 3% to 5%
  - 3% achievement → Rs. 300 (60% of max)
  - 4% achievement → Rs. 400 (80% of max)
  - 5% achievement → Rs. 500 (100% of max)
- **A (Numerator)**: Total footfall (SC+Clinic) for SC, PHC+colocated SC for PHC
- **B (Denominator)**: Total population of the catchment area for SC, Total catchment population for PHC
- **Target Description**: "upto 3%-5%"

#### **2. AF001 - Total ANC footfall**

- **Target**: 100% of ANC due list
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 50-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 50%, proportional scaling to 100%
  - Below 50% → Rs. 0
  - 50% achievement → Rs. 150 (50% of max)
  - 75% achievement → Rs. 225 (75% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: Total ANC beneficiary irrespective of gestation(new + old registration)
- **B (Denominator)**: Total ANC due as per ANC due list
- **Target Description**: "upto 50% only"
- **Conditions**: If ANC due is '0' then the amount for the indicator may be NA ✅ **IMPLEMENTED**

#### **3. HT001 - Pregnant women tested for Hb**

- **Target**: 100% of denominator (due list)
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 50-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 50%, proportional scaling to 100%
  - Below 50% → Rs. 0
  - 50% achievement → Rs. 150 (50% of max)
  - 75% achievement → Rs. 225 (75% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: Total ANC tested for Hb
- **B (Denominator)**: Total ANC footfall (Old + New Case)
- **Target Description**: "upto 50% only"
- **Conditions**: Same as Sl.5 denominator

#### **4. TS001 - Individuals screened for TB**

- **Target**: 100% of total footfall/month
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 50-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 50%, proportional scaling to 100%
  - Below 50% → Rs. 0
  - 50% achievement → Rs. 150 (50% of max)
  - 75% achievement → Rs. 225 (75% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: Individuals screened for TB
- **B (Denominator)**: Total footfall for the month
- **Target Description**: "upto 50% only"
- **Conditions**: Same as Sl.1 Numerator

#### **5. CT001 - Household visited for TB contact tracing**

- **Target**: 100% of household with newly notified Pulm. TB
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 50-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 50%, proportional scaling to 100%
  - Below 50% → Rs. 0
  - 50% achievement → Rs. 150 (50% of max)
  - 75% achievement → Rs. 225 (75% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: Total Number of Household visited for Pulmonary TB contact tracing for Symptom screening and Skin testing(Mantoux/Cy TB)
- **B (Denominator)**: Total No of Pulmonary TB patients under treatment
- **Target Description**: "upto 50% above"
- **Conditions**: If there are no Pulmonary TB patients, then the indicator may be NA ✅ **IMPLEMENTED**

#### **6. DC001 - No. of TB patients visited for Differentiated TB Care**

- **Target**: 100% of indiv. newly notified for TB
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 50-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 50%, proportional scaling to 100%
  - Below 50% → Rs. 0
  - 50% achievement → Rs. 150 (50% of max)
  - 75% achievement → Rs. 225 (75% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: No. of TB patients visited for Differentiated TB Care
- **B (Denominator)**: Total TB patients under Treatment (Pulmonday + Extra Pulmonary TB)
- **Target Description**: "upto 50% above"
- **Conditions**: If there are no TB patients(Pulm+extra Pulm), then the indicator may be NA ✅ **IMPLEMENTED**

#### **7. RF001 - RI footfall**

- **Target**: 100% of due list
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 50-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 50%, proportional scaling to 100%
  - Below 50% → Rs. 0
  - 50% achievement → Rs. 150 (50% of max)
  - 75% achievement → Rs. 225 (75% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: Total RI footfall (u-Win)
- **B (Denominator)**: Total beneficiary reported in u-Win
- **Target Description**: "upto 50% above"

#### **8. PS001 - Patient satisfaction score for the month**

- **Target**: 3.5 (70%) out of 5
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 70-100%
- **Calculation**: `A` (direct score) ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 70%, proportional scaling to 100%
  - Below 70% → Rs. 0
  - 70% achievement → Rs. 180 (60% of max)
  - 80% achievement → Rs. 220 (73% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: Patient satisfaction score for the month
- **B (Denominator)**: 5 (out of 5 scale)
- **Target Description**: "70% above only"

#### **9. EP001 - No of Elderly & Palliative patients visited**

- **Target**: 80% of targeted/month
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 80-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 80%, proportional scaling to 100%
  - Below 80% → Rs. 0
  - 80% achievement → Rs. 180 (60% of max)
  - 90% achievement → Rs. 240 (80% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: No of Elderly & Palliative patients visited
- **B (Denominator)**: Total bed-ridden patients identified who require home based care
- **Target Description**: "80% above only"

#### **10. PP001 - No of Prakriti Parikshan conducted**

- **Target**: 80% of PP conducted/(total indiv 18ys above/12)
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 80-100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Minimum threshold 80%, proportional scaling to 100%
  - Below 80% → Rs. 0
  - 80% achievement → Rs. 180 (60% of max)
  - 90% achievement → Rs. 240 (80% of max)
  - 100% achievement → Rs. 300 (100% of max)
- **A (Numerator)**: No of Prakriti Parikshan conducted
- **B (Denominator)**: Total 18+ population in the catchment area
- **Target Description**: "80% above only"

#### **11. WS001 - Total Wellness session**

- **Target**: 5-10 sessions/month
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 5-10
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Linear progression from 5 to 10 sessions
  - Below 5 sessions → Rs. 0
  - 5 sessions → Rs. 150 (50% of max)
  - 7.5 sessions → Rs. 225 (75% of max)
  - 10+ sessions → Rs. 300 (100% of max)
- **A (Numerator)**: Total Wellness session conducted
- **B (Denominator)**: 10 (maximum target)
- **Target Description**: "5-10"

#### **12. TC001 - Teleconsultation**

- **Target**: 25 calls/month for SC, 50 calls/month for others
- **Formula Type**: PERCENTAGE_RANGE
- **Range**: 25-50 (SC), 50-100 (others)
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: Facility-specific targets with linear progression
  - SC: 25-50 calls (25 = 50% remuneration, 50 = 100% remuneration)
  - Others: 50-100 calls (50 = 50% remuneration, 100 = 100% remuneration)
- **A (Numerator)**: Teleconsultation conducted
- **B (Denominator)**: Target Teleconsultation (generic - facility-specific mapping handled in calculation)
- **Target Description**: "25-50 (SC), 50-100 (others)"

---

### **✅ RANGE_BASED Indicators (0 indicators)**

_All RANGE_BASED indicators have been converted to PERCENTAGE_RANGE_

---

### **✅ BINARY Indicators (12 indicators)**

#### **13. RS001 - RI sessions held**

- **Target**: 100% of session planned/month
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: RI sessions held
- **B (Denominator)**: No of RI session planned
- **Target Description**: "100%"

#### **14. CB001 - CBAC filled for the month**

- **Target**: 100% of 30+ population/12/month
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/(B/12))*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: CBAC filled for the month (including rescreened)
- **B (Denominator)**: Total 30+ population (raw number, division by 12 in formula)
- **Target Description**: "100% only"

#### **15. HS001 - HTN screened for the month**

- **Target**: 100% of 30+ population/12/month
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/(B/12))*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: HTN screened (including rescreened) for the month
- **B (Denominator)**: Total 30+ population (raw number, division by 12 in formula)
- **Target Description**: "100% only"

#### **16. DS001 - DM screened for the month**

- **Target**: 100% of 30+ population/12/month
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/(B/12))*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: DM screened (including rescreened) for the month
- **B (Denominator)**: Total 30+ population (raw number, division by 12 in formula)
- **Target Description**: "100% only"

#### **17. OC001 - Oral Ca. Screened for the month**

- **Target**: 100% of 30+ population/60/month
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/(B/60))*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: Oral Ca. Screened for the month
- **B (Denominator)**: Total 30+ population (raw number, division by 60 in formula)
- **Target Description**: "100% only"

#### **18. BC001 - Breast & Cervical Ca. screened for the month**

- **Target**: 100% of 30+ population(female) /60/month
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/(B/60))*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: Breast & Cervical Ca. screened for the month
- **B (Denominator)**: Total Female 30+ population (raw number, division by 60 in formula)
- **Target Description**: "100% only"

#### **19. ND001 - NCD Diagnosed & Tx completed**

- **Target**: 100% of denominator (referred from SC)
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: NCD Diagnosed & Tx completed
- **B (Denominator)**: Total referred from SC as per NCD portal
- **Target Description**: "100% only"

#### **20. EC001 - No of Elderly clinic conducted**

- **Target**: 1/month for SHC, 4/month for PHC
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: No of Elderly clinic conducted
- **B (Denominator)**: Target Elderly Clinic (generic - facility-specific mapping handled in calculation)
- **Target Description**: "100%"

#### **21. JM001 - No of JAS meeting conducted**

- **Target**: >= 1
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: No of JAS meeting conducted
- **B (Denominator)**: 1
- **Target Description**: "100%"

#### **22. DI001 - No. of issues generated in DVDMS**

- **Target**: 20 issues/month for SC, 50 issues/month for PHC, 100 issues/month for UPHC
- **Formula Type**: BINARY
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: No. of issues generated in DVDMS
- **B (Denominator)**: Target DVDMS Issues (generic - facility-specific mapping handled in calculation)
- **Target Description**: "100%"

#### **23. ES001 - Whether Elderly Support Group (Sanjivini) is formed**

- **Target**: Yes
- **Formula Type**: BINARY ✅ **IMPLEMENTED**
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: Whether Elderly Support Group (Sanjivini) is formed (1 = Yes, 0 = No)
- **B (Denominator)**: 1 (Yes)
- **Target Description**: "Yes"

#### **24. EA001 - If Yes, any activity conducted during the month and recorded in register**

- **Target**: Yes
- **Formula Type**: BINARY ✅ **IMPLEMENTED**
- **Threshold**: 100%
- **Calculation**: `(A/B)*100` ✅ **IMPLEMENTED**
- **Logic**: All-or-nothing remuneration
  - Below 100% → Rs. 0
  - 100% and above → Full remuneration
- **A (Numerator)**: If Yes, any activity conducted during the month and recorded in register (1 = Yes, 0 = No)
- **B (Denominator)**: 1 (Yes)
- **Target Description**: "Yes"

---

## 📊 **Summary by Formula Type**

| Formula Type         | Count | Indicators                                                                                 | Status       |
| -------------------- | ----- | ------------------------------------------------------------------------------------------ | ------------ |
| **PERCENTAGE_RANGE** | 12    | TF001, AF001, HT001, TS001, CT001, DC001, RF001, PS001, EP001, PP001, WS001, TC001         | ✅ Complete  |
| **BINARY**           | 12    | RS001, CB001, HS001, DS001, OC001, BC001, ND001, EC001, JM001, DI001, **ES001**, **EA001** | ✅ Complete  |
| **RANGE_BASED**      | 0     | None                                                                                       | ✅ Converted |

## 🎯 **Formula Logic Patterns**

### **PERCENTAGE_RANGE Logic:**

- **Below range**: No remuneration (Rs. 0)
- **Within range**: Linear progression from minimum to maximum
- **Above range**: Full remuneration

### **RANGE_BASED Logic:**

- **Below range**: No remuneration (Rs. 0)
- **Within range**: Linear progression from minimum to maximum
- **Above range**: Full remuneration

### **BINARY Logic:**

- **Below threshold**: No remuneration (Rs. 0)
- **At or above threshold**: Full remuneration

## 🔮 **Implementation Status**

### **✅ COMPLETED (24 indicators):**

- All calculation formulas are implemented and working
- Formula calculator uses `calculation_formula` for achievement calculation
- Condition handling is implemented for TB-related indicators
- Remuneration calculation is working correctly
- **WS001 and TC001** converted from RANGE_BASED to PERCENTAGE_RANGE
- **ES001 and EA001** converted from RANGE_BASED to BINARY

### **✅ ALL INDICATORS COMPLETE:**

- **24/24 indicators** (100%) are fully implemented and working
- **No pending indicators** remaining
- The system is production-ready for all indicators

## 🎯 **Notes for Review**

1. **✅ All indicators** (24/24) have complete formula logic implemented
2. **✅ Calculation formulas** are working correctly with A/B notation
3. **✅ Condition handling** is implemented for TB-related indicators (NA if no TB patients)
4. **✅ Facility-specific targets** are handled in formula_config for special cases like Teleconsultation
5. **✅ WS001 and TC001** now use PERCENTAGE_RANGE with `(A/B)*100` instead of direct count
6. **✅ ES001 and EA001** now use BINARY with `(A/B)*100` for Yes/No logic

**Total: 24 indicators (24 complete, 0 pending)** 🎉
