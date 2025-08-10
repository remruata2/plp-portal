# PLP Portal - Facility Incentive & Remuneration Formulas

## 🏥 **System Overview**

The **PLP Portal** calculates facility incentives and remuneration based on 24 healthcare indicators across different facility types (Sub-Centers, Primary Health Centers, Urban Primary Health Centers, and AYUSH Health \u0026 Wellness Centers).

### **💰 Key Principles**

1. **Linear Incentive Distribution**: Performance directly correlates to remuneration (50% performance = 50% incentive)
2. **Target-Based Calculation**: Each indicator has specific targets that facilities must meet
3. **Conditional Logic**: Some indicators depend on specific conditions (e.g., TB patients present)
4. **Multi-Worker Distribution**: Incentives are distributed across 6 types of health workers

---

## 🔢 **Mathematical Formula System**

### **Core Calculation Methods**

#### **1. PERCENTAGE_RANGE (12 indicators)**
**Formula**: `Achievement% = (Numerator/Denominator) × 100`
**Remuneration**: Linear progression within specified range

```
If Achievement% < MinRange: Remuneration = 0
If Achievement% >= MaxRange: Remuneration = MaxAmount
If MinRange <= Achievement% < MaxRange: 
  Remuneration = ((Achievement% - MinRange) / (MaxRange - MinRange)) × MaxAmount
```

#### **2. BINARY (12 indicators)**  
**Formula**: `Achievement% = (Numerator/Denominator) × 100`
**Remuneration**: All-or-nothing based on threshold

```
If Achievement% >= Threshold: Remuneration = MaxAmount
If Achievement% < Threshold: Remuneration = 0
```

#### **3. RANGE (0 indicators - deprecated)**
Previously used for count-based targets, now converted to PERCENTAGE_RANGE.

---

## 📋 **Complete Indicator Formulas**

### **🎯 PERCENTAGE_RANGE INDICATORS**

#### **TF001 - Total Footfall (Male \u0026 Female)**
- **Formula**: `(Total Footfall / Total Catchment Population) × 100`
- **Target Range**: 3% - 5%
- **Remuneration Logic**: 
  - \u003c 3%: Rs. 0
  - 3%: Rs. 300 (60% of max Rs. 500)
  - 4%: Rs. 400 (80% of max)
  - ≥ 5%: Rs. 500 (100% of max)
- **Facility Variations**:
  - **SC**: Total footfall (SC + Clinic) / SC catchment population
  - **PHC**: Total footfall (PHC + colocated SC) / PHC catchment population

#### **AF001 - Total ANC Footfall**
- **Formula**: `(ANC Beneficiaries / ANC Due List) × 100`
- **Target Range**: 50% - 100%
- **Remuneration Logic**: Linear from 50% (Rs. 150) to 100% (Rs. 300)
- **Special Condition**: If ANC due list = 0, indicator marked as NA

#### **HT001 - Pregnant Women Tested for Hb**
- **Formula**: `(ANC Tested for Hb / Total ANC Footfall) × 100`
- **Target Range**: 50% - 100%
- **Remuneration Logic**: Linear from 50% to 100%

#### **TS001 - Individuals Screened for TB**
- **Formula**: `(TB Screened / Total Footfall) × 100`
- **Target Range**: 50% - 100%
- **Remuneration Logic**: Linear from 50% to 100%

#### **CT001 - TB Contact Tracing**
- **Formula**: `(Households Visited / Pulmonary TB Patients) × 100`
- **Target Range**: 50% - 100%
- **Special Condition**: If no pulmonary TB patients, indicator marked as NA

#### **DC001 - TB Differentiated Care**
- **Formula**: `(TB Patients Visited / Total TB Patients) × 100`
- **Target Range**: 50% - 100%
- **Special Condition**: If no TB patients (pulmonary + extra pulmonary), indicator marked as NA

#### **RF001 - RI Footfall**
- **Formula**: `(RI Footfall / Total Beneficiary in u-Win) × 100`
- **Target Range**: 50% - 100%
- **Remuneration Logic**: Linear from 50% to 100%

#### **PS001 - Patient Satisfaction Score**
- **Formula**: `(Satisfaction Score / 5) × 100`
- **Target Range**: 70% - 100%
- **Remuneration Logic**: Linear from 70% to 100%

#### **EP001 - Elderly \u0026 Palliative Patients Visited**
- **Formula**: `(Patients Visited / Bed-ridden Patients Identified) × 100`
- **Target Range**: 80% - 100%
- **Remuneration Logic**: Linear from 80% to 100%

#### **PP001 - Prakriti Parikshan Conducted**
- **Formula**: `(Prakriti Parikshan Conducted / (18+ Population / 12)) × 100`
- **Target Range**: 80% - 100%
- **Remuneration Logic**: Linear from 80% to 100%

#### **WS001 - Wellness Sessions**
- **Formula**: `(Sessions Conducted / 10) × 100`
- **Target Range**: 5 - 10 sessions
- **Remuneration Logic**: 
  - \u003c 5 sessions: Rs. 0
  - 5 sessions: 50% of max
  - 10 sessions: 100% of max

#### **TC001 - Teleconsultation**
- **Formula**: `(Teleconsultations Conducted / Target) × 100`
- **Target Varies by Facility**:
  - **SC**: 25-50 calls/month
  - **PHC/UPHC**: 50-100 calls/month
- **Remuneration Logic**: Linear within facility-specific range

---

### **✅ BINARY INDICATORS**

#### **RS001 - RI Sessions Held**
- **Formula**: `(RI Sessions Held / RI Sessions Planned) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **CB001 - CBAC Filled**
- **Formula**: `(CBAC Filled / (30+ Population / 12)) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **HS001 - HTN Screened**
- **Formula**: `(HTN Screened / (30+ Population / 12)) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **DS001 - DM Screened**  
- **Formula**: `(DM Screened / (30+ Population / 12)) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **OC001 - Oral Cancer Screened**
- **Formula**: `(Oral Ca. Screened / (30+ Population / 60)) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **BC001 - Breast \u0026 Cervical Cancer Screened**
- **Formula**: `(Breast \u0026 Cervical Ca. Screened / (Female 30+ Population / 60)) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **ND001 - NCD Diagnosed \u0026 Treatment Completed**
- **Formula**: `(NCD Diagnosed \u0026 Tx Completed / Total Referred from SC) × 100`
- **Target**: 100%
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **EC001 - Elderly Clinic Conducted**
- **Formula**: `(Elderly Clinics Conducted / Target Clinics) × 100`
- **Target Varies by Facility**:
  - **SC**: 1 clinic/month
  - **PHC**: 4 clinics/month
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **JM001 - JAS Meeting Conducted**
- **Formula**: `(JAS Meetings Conducted / 1) × 100`
- **Target**: ≥ 1 meeting/month
- **Remuneration**: Full amount if ≥1, Rs. 0 if \u003c1

#### **DI001 - DVDMS Issues Generated**
- **Formula**: `(Issues Generated / Target Issues) × 100`
- **Target Varies by Facility**:
  - **SC**: 20 issues/month
  - **PHC**: 50 issues/month  
  - **UPHC**: 100 issues/month
- **Remuneration**: Full amount if ≥100%, Rs. 0 if \u003c100%

#### **ES001 - Elderly Support Group Formation**
- **Formula**: `(Group Formed / 1) × 100`
- **Target**: Yes (1 = formed, 0 = not formed)
- **Remuneration**: Full amount if formed, Rs. 0 if not formed

#### **EA001 - Elderly Support Group Activity**
- **Formula**: `(Activity Conducted / 1) × 100`
- **Target**: Yes (1 = activity conducted, 0 = no activity)
- **Remuneration**: Full amount if activity conducted, Rs. 0 if no activity

---

## 🏥 **Facility-Specific Targets \u0026 Amounts**

### **Sub-Center Health \u0026 Wellness Centers (SC-HWC)**
| Indicator | Target | Max Amount (Rs.) | Conditions |
|-----------|--------|------------------|------------|
| Total Footfall | 3-5% | 1000 | |
| Wellness Sessions | 5-10 | 500 | |
| Teleconsultation | 25-50 calls | 2000-2500 | |
| ANC Footfall | 50-100% | 500 | If ANC due \u003e 0 |
| TB Screening | 50-100% | 500-1000 | |
| TB Contact Tracing | 50-100% | 500 | If TB patients exist |

### **Primary Health Centers (PHC)**
| Indicator | Target | Max Amount (Rs.) | Conditions |
|-----------|--------|------------------|------------|
| Total Footfall | 3-5% | 500 | |
| Wellness Sessions | 5-10 | 500 | |
| Teleconsultation | 25-50 calls | 1000 | |
| ANC Footfall | 50-100% | 300 | |
| RI Sessions | 100% | 300 | |
| Elderly Clinic | 100% (4/month) | 300 | |
| DVDMS Issues | 100% (50/month) | 250-500 | |

### **Urban Primary Health Centers (UPHC)**
| Indicator | Target | Max Amount (Rs.) | Conditions |
|-----------|--------|------------------|------------|
| Total Footfall | 3-5% | 500 | |
| Wellness Sessions | 5-10 | 1500 | |
| Teleconsultation | 25-50 calls | 2000 | |
| TB Screening | 50-100% | 500 | |
| Elderly Clinic | 100% (4/month) | 500 | |
| DVDMS Issues | 100% (100/month) | 500 | |

### **AYUSH Health \u0026 Wellness Centers**
| Indicator | Target | Max Amount (Rs.) | Conditions |
|-----------|--------|------------------|------------|
| Total Footfall | 3-5% | 1000 | |
| Prakriti Parikshan | 80-100% | 1000 | AYUSH-specific |
| Wellness Sessions | 5-10 | 500 | |
| Teleconsultation | 25-50 calls | 2000-2500 | |
| ANC Footfall | 50-100% | 500 | If ANC due \u003e 0 |

---

## 👥 **Worker Allocation Distribution**

### **Health Worker Types:**
1. **HWO** (Health Worker Officer)
2. **MO** (Medical Officer) 
3. **AYUSH MO** (AYUSH Medical Officer)
4. **HW** (Health Worker)
5. **ASHA** (Accredited Social Health Activist)
6. **Colocated SC HW** (Sub-Centre Health Worker)

### **Allocation Conditions:**
- **With TB Patients + Pregnant Women**: Higher allocation amounts
- **Without TB Patients + Pregnant Women**: Lower allocation amounts
- **Percentage Distribution**: Based on overall facility performance

---

## 🔧 **System Implementation**

### **Calculation Engine:**
1. **Data Collection**: Monthly submission by facilities
2. **Formula Application**: Automatic calculation using defined formulas
3. **Conditional Logic**: Handles NA cases (e.g., no TB patients)
4. **Performance Aggregation**: Weighted average across all indicators
5. **Worker Distribution**: Proportional allocation based on performance

### **Quality Assurance:**
- **Linear Distribution**: Ensures fair proportional incentives
- **Threshold Validation**: Prevents invalid calculations
- **Condition Handling**: Proper NA marking for inapplicable indicators
- **Audit Trail**: Complete calculation history tracking

---

## 📊 **Performance Calculation Example**

### **Sample Facility Performance:**
```
Facility: ABC Sub-Center
Month: January 2024

Indicator Results:
- Total Footfall: 4% (Target: 3-5%) → 80% achievement → Rs. 400
- ANC Footfall: 75% (Target: 50-100%) → 50% achievement → Rs. 150  
- TB Screening: 60% (Target: 50-100%) → 20% achievement → Rs. 60
- RI Sessions: 100% (Target: 100%) → 100% achievement → Rs. 300

Total Base Amount: Rs. 1000
Total Calculated: Rs. 910
Overall Performance: 91%

Worker Distribution (91% performance):
- HWO: Rs. 364 (40% × 91%)
- HW: Rs. 273 (30% × 91%)  
- ASHA: Rs. 273 (30% × 91%)
```

## 🎯 **Key Benefits**

1. **Transparent Calculations**: Clear mathematical formulas for all indicators
2. **Performance-Based**: Direct correlation between achievement and incentives
3. **Conditional Flexibility**: Handles special cases appropriately
4. **Fair Distribution**: Linear progression ensures proportional rewards
5. **Quality Healthcare**: Incentivizes comprehensive service delivery

---

## 📈 **System Status**

- **✅ 24 Indicators**: All formulas implemented and tested
- **✅ 4 Facility Types**: Complete coverage across facility types  
- **✅ 6 Worker Types**: Full worker allocation system
- **✅ Conditional Logic**: TB and ANC condition handling
- **✅ Linear Distribution**: Performance-based remuneration
- **✅ Production Ready**: System operational for healthcare facilities

**The PLP Portal provides a comprehensive, fair, and transparent system for calculating healthcare facility incentives based on performance across critical health indicators.**
