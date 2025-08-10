# PLP Dashboard - Comprehensive Remuneration System

## **🎯 Overview**

The PLP Dashboard implements a comprehensive **performance-based remuneration system** that calculates incentives for health facilities based on their achievement against predefined targets. The system uses **linear calculations** to ensure fair and proportional incentive distribution.

## **📊 Current Formula Types**

### **1. BINARY Formula**
- **Pattern**: "1", "Yes", "100%"
- **Logic**: All-or-nothing remuneration
- **Examples**: RI sessions, Elderly clinic conducted
- **Calculation**: Achieve threshold → Full payment, Below threshold → No payment

### **2. RANGE Formula**
- **Pattern**: "5 above to 10", "25 above, upto 50"
- **Logic**: Linear progression within numeric range
- **Examples**: Wellness sessions, Teleconsultation
- **Calculation**: Below minimum → ₹0, Within range → Linear 60%-100%, Above maximum → Full payment

### **3. PERCENTAGE_RANGE Formula**
- **Pattern**: "upto 3%-5%", "50%-100%"
- **Logic**: Linear progression within percentage range
- **Examples**: Total footfall, ANC footfall, Patient satisfaction
- **Calculation**: Below minimum → ₹0, Within range → Linear 60%-100%, Above maximum → Full payment

## **🧮 Linear Calculation Implementation**

### **Core Principle**
The system ensures **fair and proportional** remuneration:
- **50% achievement** = **50% of maximum incentive**
- **75% achievement** = **75% of maximum incentive**
- **100% achievement** = **100% of maximum incentive**

### **Linear Progression Formula**
For both RANGE and PERCENTAGE_RANGE formulas:

```typescript
// Calculate percentage within the range (0% to 100%)
const rangeSize = max - min;
const achievedWithinRange = achievedValue - min;
const percentageWithinRange = (achievedWithinRange / rangeSize) * 100;

// Convert to linear progression: 0% range = 60% remuneration, 100% range = 100% remuneration
const linearPercentage = 60 + (percentageWithinRange * 0.4);
const remuneration = (linearPercentage / 100) * maxRemuneration;
```

### **Example Calculations**

#### **Wellness Sessions (5-10 range, ₹500 max)**
- 7.5 sessions achieved
- Range size: 10 - 5 = 5
- Achieved within range: 7.5 - 5 = 2.5
- Percentage within range: (2.5 / 5) × 100 = 50%
- Linear percentage: 60 + (50 × 0.4) = 80%
- Remuneration: (80 / 100) × 500 = **₹400**

#### **Total Footfall (3%-5% range, ₹1000 max)**
- 4% achievement
- Range size: 5% - 3% = 2%
- Achieved within range: 4% - 3% = 1%
- Percentage within range: (1% / 2%) × 100 = 50%
- Linear percentage: 60 + (50 × 0.4) = 80%
- Remuneration: (80 / 100) × 1000 = **₹800**

## **📋 Complete Indicator List (22 Indicators)**

### **Range-Based Indicators**
1. **Total Wellness sessions** - 5-10 range
2. **Teleconsultation** - 25-50 range

### **Percentage Range Indicators**
3. **Total Footfall (M&F)** - 3%-5% range
4. **Total ANC footfall** - 50%-100% range
5. **Pregnant women tested for Hb** - 50%-100% range
6. **Individuals screened for TB** - 50%-100% range
7. **Household visited for TB contact tracing** - 50%-100% range
8. **TB patients visited for Differentiated TB Care** - 50%-100% range
9. **RI footfall** - 50%-100% range
10. **CBAC filled** - 100% target
11. **HTN screened** - 100% target
12. **DM screened** - 100% target
13. **Oral Cancer screened** - 100% target
14. **Breast & Cervical Cancer screened** - 100% target
15. **Patient satisfaction score** - 70%-100% range
16. **Elderly & Palliative patients visited** - 80%-100% range

### **Binary Indicators**
17. **RI sessions held** - 1 session required
18. **Elderly clinic conducted** - 1 clinic required
19. **Elderly Support Group formed** - 1 group required
20. **Elderly activity conducted** - 1 activity required
21. **JAS meeting conducted** - 1 meeting required
22. **DVDMS issues generated** - 1 issue required

## **💰 Remuneration Structure**

### **Facility Type Specific Amounts**

| Facility Type | Total Footfall | Wellness Sessions | Teleconsultation | Total Max |
|---------------|----------------|-------------------|------------------|-----------|
| **PHC** | ₹500 | ₹500 | ₹2000 | ₹15,000 |
| **UPHC** | ₹2000 | ₹500 | ₹2000 | ₹15,000 |
| **SC-HWC** | ₹1000 | ₹500 | ₹2000 | ₹15,000 |
| **U-HWC** | ₹2000 | ₹500 | ₹2000 | ₹15,000 |
| **A-HWC** | ₹1000 | ₹500 | ₹2000 | ₹15,000 |

### **Conditional Logic**
Some indicators have conditional remuneration based on TB patient presence:

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

### **Core Components**

1. **FormulaCalculator** - Handles different formula types and calculations
2. **RemunerationCalculator** - Orchestrates the overall calculation process
3. **IndicatorBasedRemunerationCalculator** - Calculates remuneration for specific indicators
4. **AutoIndicatorCalculator** - Auto-calculates when data is submitted

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

### **Calculation Flow**

```
Data Submission → Formula Type Detection → Linear Calculation → Remuneration Distribution
```

## **🎯 Key Features**

### **1. Linear Incentive Distribution**
- **Proportional rewards** for partial achievements
- **No cliff effects** at threshold boundaries
- **Predictable** incentive structure

### **2. Threshold-Based Eligibility**
- **Clear minimum thresholds** that must be met
- **Quality standards** maintained across all indicators
- **Consistent application** of rules

### **3. Facility Type Flexibility**
- **Different amounts** for different facility types
- **Capacity-based** remuneration structure
- **Scalable** across various facility sizes

### **4. Conditional Logic**
- **TB patient conditions** for certain indicators
- **Dynamic remuneration** based on facility circumstances
- **Comprehensive coverage** of health scenarios

## **📊 Performance Calculation Examples**

### **Scenario 1: High-Performing Facility**
- **Wellness Sessions**: 10/10 → ₹500 (100%)
- **Teleconsultation**: 50/50 → ₹2000 (100%)
- **ANC Footfall**: 80/100 → ₹400 (80% of range)
- **Total: ₹2900**

### **Scenario 2: Low-Performing Facility**
- **Wellness Sessions**: 3/10 → ₹0 (below threshold)
- **Teleconsultation**: 20/50 → ₹0 (below threshold)
- **ANC Footfall**: 30/100 → ₹0 (below threshold)
- **Total: ₹0**

### **Scenario 3: Mixed Performance**
- **Wellness Sessions**: 7.5/10 → ₹400 (80% of range)
- **Total Footfall**: 4%/5% → ₹800 (80% of range)
- **RI Sessions**: 1/1 → ₹500 (binary achieved)
- **Total: ₹1700**

## **🚀 Benefits of Linear System**

### **1. Fairness**
- **Equal treatment** for equal performance
- **Transparent calculations** that are easy to understand
- **Consistent application** across all indicators

### **2. Motivation**
- **Continuous improvement** is rewarded
- **Every percentage point** counts toward incentives
- **Clear path** to full remuneration

### **3. Transparency**
- **Simple calculation** logic
- **Easy to verify** results
- **Clear audit trail** for all payments

## **🔧 Technical Implementation**

### **Formula Calculator Methods**

```typescript
class FormulaCalculator {
  // Calculate remuneration based on formula type
  static calculateRemuneration(
    submittedValue: number,
    targetValue: number,
    maxRemuneration: number,
    formulaConfig: FormulaConfig
  ): CalculationResult;

  // Parse formula strings into configuration
  static parseFormula(formula: string): FormulaConfig;

  // Calculate mathematical formulas
  static calculateMathematicalFormula(
    numerator: number,
    denominator: number,
    formula: string
  ): number;
}
```

### **Formula Parsing Examples**

```typescript
// Range-based formulas
"5 above to 10" → { type: "RANGE", range: { min: 5, max: 10 } }
"25 above, upto 50" → { type: "RANGE", range: { min: 25, max: 50 } }

// Percentage range formulas
"upto 3%-5%" → { type: "PERCENTAGE_RANGE", range: { min: 3, max: 5 } }
"50%-100%" → { type: "PERCENTAGE_RANGE", range: { min: 50, max: 100 } }

// Binary formulas
"1" → { type: "BINARY" }
"Yes" → { type: "BINARY" }
"100%" → { type: "BINARY" }
```

## **📈 Future Enhancements**

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

The PLP Dashboard's comprehensive remuneration system provides:

✅ **Linear incentive distribution** for fair and proportional rewards
✅ **Three formula types** covering all calculation scenarios
✅ **Facility-specific amounts** based on facility type and capacity
✅ **Conditional logic** for complex scenarios like TB patient presence
✅ **Transparent calculations** that are easy to understand and verify

This system ensures that health facilities are motivated to continuously improve their performance while receiving fair compensation for their achievements. The linear calculation approach eliminates unfair cliff effects and provides a clear path to full remuneration. 