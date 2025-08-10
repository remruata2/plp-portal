# PLP Dashboard - Formula-Based Remuneration System

## **🎯 Overview**

The PLP Dashboard implements a sophisticated **formula-based remuneration system** that calculates performance-based payments for health facilities based on their achievement against predefined thresholds and formulas.

## **📊 Formula Types & Calculation Logic**

### **1. RANGE Formula**

**Pattern**: "5 above to 10", "25 above, upto 50"

**Logic**:

- Below minimum threshold → ₹0 remuneration
- Within range → Linear progression from 60% to 100% remuneration
- At/above maximum → Full remuneration

**Examples**:

```
Wellness Sessions (₹500 max):
• 3 sessions → ₹0 (below 5)
• 7.5 sessions → ₹400 (80% of range = 80% remuneration)
• 10 sessions → ₹500 (full achievement)
• 12 sessions → ₹500 (above maximum)

Teleconsultation (₹2000 max):
• 20 calls → ₹0 (below 25)
• 37.5 calls → ₹1600 (80% of range = 80% remuneration)
• 50 calls → ₹2000 (full achievement)
```

### **2. PERCENTAGE_RANGE Formula**

**Pattern**: "upto 3%-5%", "50%-100%"

**Logic**:

- Below minimum threshold → ₹0 remuneration
- Within range → Linear progression from 60% to 100% remuneration
- At/above maximum → Full remuneration

**Examples**:

```
Total Footfall (₹1000 max, 3%-5% range):
• 2% achievement → ₹0 (below 3%)
• 4% achievement → ₹800 (80% of range = 80% remuneration)
• 5% achievement → ₹1000 (full achievement)

ANC Footfall (₹500 max, 50%-100% range):
• 30% achievement → ₹0 (below 50%)
• 75% achievement → ₹400 (80% of range = 80% remuneration)
• 100% achievement → ₹500 (full achievement)
```

### **3. BINARY Formula**

**Pattern**: "1", "Yes"

**Logic**:

- All-or-nothing remuneration
- Achieve threshold → Full payment
- Below threshold → No payment

**Examples**:

```
RI Sessions (₹500 max):
• 0 sessions → ₹0
• 1 session → ₹500
• 2 sessions → ₹500

Elderly Support Group (₹800 max):
• Not formed → ₹0
• Formed → ₹800
```

## **🧮 Mathematical Implementation**

### **Linear Progression Formula**

For both RANGE and PERCENTAGE_RANGE formulas, the system uses a **linear progression** from 60% to 100% remuneration:

```typescript
// Calculate percentage within the range (0% to 100%)
const rangeSize = max - min;
const achievedWithinRange = achievedValue - min;
const percentageWithinRange = (achievedWithinRange / rangeSize) * 100;

// Convert to linear progression: 0% range = 60% remuneration, 100% range = 100% remuneration
const linearPercentage = 60 + (percentageWithinRange * 0.4);
const remuneration = (linearPercentage / 100) * maxRemuneration;
```

### **Example Calculation**

**Wellness Sessions (5-10 range, ₹500 max):**
- 7.5 sessions achieved
- Range size: 10 - 5 = 5
- Achieved within range: 7.5 - 5 = 2.5
- Percentage within range: (2.5 / 5) × 100 = 50%
- Linear percentage: 60 + (50 × 0.4) = 80%
- Remuneration: (80 / 100) × 500 = ₹400

## **📋 Complete Indicator List**

### **22 Performance Indicators**

1. **Total Footfall (M&F)** - Percentage Range (3-5%)
2. **Total Wellness sessions** - Range-based (5-10)
3. **Teleconsultation** - Range-based (25-50)
4. **Total ANC footfall** - Percentage Range (50-100%)
5. **Pregnant women tested for Hb** - Percentage Range (50-100%)
6. **Individuals screened for TB** - Percentage Range (50-100%)
7. **Household visited for TB contact tracing** - Percentage Range (50-100%)
8. **TB patients visited for Differentiated TB Care** - Percentage Range (50-100%)
9. **RI sessions held** - Binary (1)
10. **RI footfall** - Percentage Range (50-100%)
11. **CBAC filled** - Percentage Range (100%)
12. **HTN screened** - Percentage Range (100%)
13. **DM screened** - Percentage Range (100%)
14. **Oral Cancer screened** - Percentage Range (100%)
15. **Breast & Cervical Cancer screened** - Percentage Range (100%)
16. **Patient satisfaction score** - Percentage Range (70-100%)
17. **Elderly & Palliative patients visited** - Percentage Range (80-100%)
18. **Elderly clinic conducted** - Binary (1)
19. **Elderly Support Group formed** - Binary (1)
20. **Elderly activity conducted** - Binary (1)
21. **JAS meeting conducted** - Binary (1)
22. **DVDMS issues generated** - Binary (1)

## **🎯 Key Features**

### **1. Threshold-Based Eligibility**

All indicators have clear minimum thresholds that must be met before any remuneration is awarded:

- **RANGE**: Must achieve minimum value (e.g., 5 sessions)
- **PERCENTAGE_RANGE**: Must achieve minimum percentage (e.g., 3%)
- **BINARY**: Must achieve threshold (e.g., 1 session)

### **2. Linear Incentive Distribution**

The system ensures **fair and proportional** remuneration:

- **50% achievement** = **50% of maximum incentive**
- **75% achievement** = **75% of maximum incentive**
- **100% achievement** = **100% of maximum incentive**

### **3. Facility Type Specific Amounts**

Different facility types receive different remuneration amounts for the same indicators:

| Facility Type | Total Footfall Max | Wellness Sessions Max | Teleconsultation Max |
|---------------|-------------------|----------------------|---------------------|
| **PHC** | ₹500 | ₹500 | ₹2000 |
| **UPHC** | ₹2000 | ₹500 | ₹2000 |
| **SC-HWC** | ₹1000 | ₹500 | ₹2000 |
| **U-HWC** | ₹2000 | ₹500 | ₹2000 |
| **A-HWC** | ₹1000 | ₹500 | ₹2000 |

### **4. Conditional Remuneration**

Some indicators have conditional logic based on TB patient presence:

```typescript
// Example: TB Contact Tracing
if (hasTbPatients) {
  // Calculate based on contact tracing performance
  remuneration = calculatePerformanceBasedAmount(performance);
} else {
  // No TB patients - indicator not applicable
  remuneration = 0;
}
```

## **🏗️ System Architecture**

### **Database Schema**

```sql
-- Core indicator configuration
Indicator {
  id: Int
  name: String
  target_type: TargetType // BINARY, RANGE, PERCENTAGE_RANGE
  target_value: String // e.g., "5-10", "3%-5%", "1"
  formula_config: Json // Detailed calculation parameters
}

-- Remuneration amounts per facility type
IndicatorRemuneration {
  facility_type_remuneration_id: Int
  indicator_id: Int
  base_amount: Decimal
  conditional_amount: Decimal?
  condition_type: String? // "WITH_TB_PATIENT", "WITHOUT_TB_PATIENT"
}
```

### **Calculation Engine**

```typescript
// Formula Calculator
class FormulaCalculator {
  static calculateRemuneration(
    submittedValue: number,
    targetValue: number,
    maxRemuneration: number,
    formulaConfig: FormulaConfig
  ): CalculationResult;
}

// Remuneration Calculator
class RemunerationCalculator {
  static calculateFacilityRemuneration(
    input: RemunerationCalculationInput
  ): Promise<RemunerationResult>;
}
```

## **📊 Performance Calculation Examples**

### **Example 1: Total Footfall (SC-HWC)**

**Target**: 3%-5% of catchment population
**Max Remuneration**: ₹1000
**Achievement**: 4% (within range)

**Calculation**:
- Range: 3% to 5% (2% range)
- Achieved within range: 4% - 3% = 1%
- Percentage within range: (1% / 2%) × 100 = 50%
- Linear percentage: 60% + (50% × 0.4) = 80%
- Remuneration: (80% / 100%) × ₹1000 = **₹800**

### **Example 2: Wellness Sessions (PHC)**

**Target**: 5-10 sessions
**Max Remuneration**: ₹500
**Achievement**: 8 sessions (within range)

**Calculation**:
- Range: 5 to 10 (5 session range)
- Achieved within range: 8 - 5 = 3 sessions
- Percentage within range: (3 / 5) × 100 = 60%
- Linear percentage: 60% + (60% × 0.4) = 84%
- Remuneration: (84% / 100%) × ₹500 = **₹420**

### **Example 3: Binary Indicator (RI Sessions)**

**Target**: 1 session
**Max Remuneration**: ₹500
**Achievement**: 1 session

**Calculation**:
- Binary threshold met: 1 ≥ 1 ✅
- Remuneration: **₹500** (full amount)

## **🎯 Benefits of Linear System**

### **1. Fairness**
- **Proportional rewards** for partial achievements
- **No cliff effects** at threshold boundaries
- **Predictable** incentive structure

### **2. Motivation**
- **Continuous improvement** is rewarded
- **Every percentage point** counts
- **Clear path** to full remuneration

### **3. Transparency**
- **Simple calculation** logic
- **Easy to understand** for facilities
- **Consistent** across all indicators

## **🚀 Future Enhancements**

### **1. Dynamic Thresholds**
- **Seasonal adjustments** based on historical data
- **Facility-specific targets** based on capacity
- **Performance-based** threshold modifications

### **2. Advanced Analytics**
- **Trend analysis** for performance improvement
- **Predictive modeling** for target setting
- **Benchmarking** across similar facilities

### **3. Real-time Calculations**
- **Live performance tracking**
- **Instant incentive updates**
- **Mobile notifications** for achievements

## **📋 Summary**

The PLP Dashboard's formula-based remuneration system provides:

✅ **Linear incentive distribution** for fair and proportional rewards
✅ **Multiple formula types** to handle different indicator patterns
✅ **Facility-specific amounts** based on facility type and capacity
✅ **Conditional logic** for complex scenarios like TB patient presence
✅ **Transparent calculations** that are easy to understand and verify

This system ensures that health facilities are motivated to continuously improve their performance while receiving fair compensation for their achievements.
