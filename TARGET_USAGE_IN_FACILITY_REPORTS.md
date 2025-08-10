# Target Usage in Facility Reports

## 🎯 **Overview**

This document explains how targets should be correctly used in facility reports at `http://localhost:3000/facility/reports` based on the comprehensive remuneration system analysis.

## ❌ **Current Problem**

The current facility reports API incorrectly uses **denominator field values** as targets:

```typescript
// INCORRECT - Using denominator as target
const denominatorValue = fieldValueMap.get(indicator.denominator_field_id) || 1;
const target = denominatorValue; // This is wrong!
```

**Why this is wrong:**

- Denominator fields contain **actual data** (population numbers, patient lists)
- These are **inputs**, not **targets**
- Targets should be **expected/desired values** for performance measurement

## ✅ **Correct Target Sources**

Based on the analysis of all documents, targets should come from these sources in order of priority:

### **1. Formula Config Targets (Primary Source)**

Each indicator has specific targets defined in their `formula_config`:

| Indicator                        | Target Source                            | Target Value          | Description                              |
| -------------------------------- | ---------------------------------------- | --------------------- | ---------------------------------------- |
| **TF001 - Total Footfall**       | `formula_config.range.max`               | 5%                    | Maximum percentage of population         |
| **WS001 - Wellness Sessions**    | `formula_config.range.max`               | 10 sessions           | Maximum sessions per month               |
| **TC001 - Teleconsultation**     | `formula_config.facilitySpecificTargets` | 25 (SC) / 50 (others) | Facility-specific call targets           |
| **AF001 - ANC Footfall**         | `formula_config.range.max`               | 100%                  | Maximum percentage of ANC due list       |
| **PS001 - Patient Satisfaction** | `formula_config.range.max`               | 100% (5/5)            | Maximum satisfaction score               |
| **EP001 - Elderly Palliative**   | `formula_config.range.max`               | 100%                  | Maximum percentage of bedridden patients |

### **2. Target Fields (Secondary Source)**

Some indicators have dedicated `target_field_id` references:

```typescript
// Example target fields
{
  code: "target_wellness_sessions_generic",
  name: "Target Wellness Sessions (Generic)",
  default_value: "10",
  field_category: "TARGET_FIELD"
}
```

### **3. Hardcoded Targets (Tertiary Source)**

For indicators with fixed targets:

- **RI Sessions**: 100% of planned sessions
- **JAS Meetings**: 1 meeting/month
- **Binary indicators**: 100% threshold
- **DVDMS Issues**: 20 (SC) / 50 (PHC) / 100 (UPHC) issues/month

## 🔧 **Implementation Logic**

### **Updated Target Calculation**

```typescript
// Get target value from formula_config or target_field
let targetValue = denominatorValue; // Default fallback

// Use formula_config target if available
const formulaConfig = (indicator.formula_config as any) || {};
if (formulaConfig.targetValue) {
  targetValue = formulaConfig.targetValue;
} else if (formulaConfig.range?.max) {
  // For percentage range indicators, use the max value as target
  targetValue = formulaConfig.range.max;
} else if (indicator.target_field_id) {
  // Use target field value if available
  const targetFieldValue = fieldValueMap.get(indicator.target_field_id);
  if (targetFieldValue !== undefined) {
    targetValue = targetFieldValue;
  }
}
```

### **Target Examples by Indicator Type**

#### **PERCENTAGE_RANGE Indicators**

| Indicator | Target Source              | Target Value | Range    |
| --------- | -------------------------- | ------------ | -------- |
| **TF001** | `formula_config.range.max` | 5%           | 3%-5%    |
| **AF001** | `formula_config.range.max` | 100%         | 50%-100% |
| **PS001** | `formula_config.range.max` | 100%         | 70%-100% |
| **EP001** | `formula_config.range.max` | 100%         | 80%-100% |

#### **BINARY Indicators**

| Indicator | Target Source     | Target Value | Description         |
| --------- | ----------------- | ------------ | ------------------- |
| **RS001** | Denominator field | 100%         | RI sessions planned |
| **JM001** | Hardcoded         | 1            | JAS meetings        |
| **DI001** | Facility-specific | 20/50/100    | DVDMS issues        |

## 📊 **Target Values by Facility Type**

### **PHC Targets**

| Indicator            | Target Value     | Source         |
| -------------------- | ---------------- | -------------- |
| Total Footfall       | 5% of population | Formula config |
| Wellness Sessions    | 10 sessions      | Formula config |
| Teleconsultation     | 50 calls         | Formula config |
| ANC Footfall         | 100% of due list | Formula config |
| Patient Satisfaction | 100% (5/5)       | Formula config |
| JAS Meetings         | 1 meeting        | Hardcoded      |
| DVDMS Issues         | 50 issues        | Hardcoded      |

### **UPHC Targets**

| Indicator            | Target Value     | Source         |
| -------------------- | ---------------- | -------------- |
| Total Footfall       | 5% of population | Formula config |
| Wellness Sessions    | 10 sessions      | Formula config |
| Teleconsultation     | 50 calls         | Formula config |
| Patient Satisfaction | 100% (5/5)       | Formula config |
| JAS Meetings         | 1 meeting        | Hardcoded      |
| DVDMS Issues         | 100 issues       | Hardcoded      |

### **SC_HWC Targets**

| Indicator            | Target Value     | Source         |
| -------------------- | ---------------- | -------------- |
| Total Footfall       | 5% of population | Formula config |
| Wellness Sessions    | 10 sessions      | Formula config |
| Teleconsultation     | 25 calls         | Formula config |
| ANC Footfall         | 100% of due list | Formula config |
| Patient Satisfaction | 100% (5/5)       | Formula config |
| JAS Meetings         | 1 meeting        | Hardcoded      |
| DVDMS Issues         | 20 issues        | Hardcoded      |

## 🎯 **Key Benefits**

### **1. Accurate Performance Measurement**

- **Correct targets** show actual performance expectations
- **Denominator values** remain as data inputs
- **Clear distinction** between inputs and targets

### **2. Facility-Specific Targets**

- **Different targets** for different facility types
- **Dynamic calculation** based on facility type
- **Proper remuneration** calculation

### **3. Better User Experience**

- **Meaningful targets** in reports
- **Clear performance indicators**
- **Accurate achievement percentages**

## ✅ **Implementation Status**

### **✅ Updated API**

The facility reports API has been updated to use correct target sources:

1. **Formula config targets** (primary)
2. **Target field values** (secondary)
3. **Hardcoded values** (tertiary)

### **✅ Enhanced Response**

The API now returns additional information:

```typescript
{
  id: indicator.id,
  name: indicator.name,
  target: targetValue,           // ✅ Correct target
  actual: actualValue,           // ✅ Actual achievement
  percentage: result.achievement, // ✅ Achievement percentage
  status: status,                // ✅ Performance status
  incentive_amount: result.remuneration, // ✅ Remuneration amount
  formula_type: indicator.formula_type,  // ✅ Formula type
  target_description: indicator.target_formula || "Standard target" // ✅ Target description
}
```

## 🚀 **Usage in Frontend**

The facility reports page should now display:

1. **Correct target values** instead of denominator values
2. **Meaningful performance indicators**
3. **Accurate achievement percentages**
4. **Clear target descriptions**

## 📋 **Summary**

**Targets in facility reports should be:**

- ✅ **Formula config values** (primary source)
- ✅ **Target field values** (secondary source)
- ✅ **Hardcoded facility-specific values** (tertiary source)
- ❌ **NOT denominator field values** (these are inputs, not targets)

This ensures accurate performance measurement and meaningful reports for facility staff.
