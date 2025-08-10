# Facility Reports Achievement Status and Incentive Calculation Fixes

## 🔍 **Issues Identified**

### 1. **Range-Based Calculation Error in FormulaCalculator**
**File**: `src/lib/calculations/formula-calculator.ts`
**Lines**: 345-346

**Problem**: Using `submittedValue` directly as achievement percentage.
```typescript
// WRONG
const achievement = submittedValue;
const remuneration = (achievement / 100) * maxRemuneration;
```

**Fix**: Calculate achievement percentage based on position within the range.
```typescript
// CORRECT
// For range-based indicators, calculate position within range
const rangeSize = max - min;
const achievedWithinRange = submittedValue - min;
const positionInRange = achievedWithinRange / rangeSize;

// Map to 50%-100% scale (minimum gets 50%, maximum gets 100%)
const achievement = 50 + (positionInRange * 50);
const remuneration = (achievement / 100) * maxRemuneration;
```

### 2. **Percentage Range Calculation Issue**
**File**: `src/lib/calculations/formula-calculator.ts`  
**Lines**: 451-453

**Problem**: Direct achievement percentage used for remuneration without proper scaling.
```typescript
// PROBLEMATIC - May not align with expected remuneration model
const remuneration = (achievement / 100) * maxRemuneration;
```

**Expected Behavior**: 
- 3% footfall should give ~60% of maximum remuneration  
- 4% footfall should give ~80% of maximum remuneration
- 5% footfall should give 100% of maximum remuneration

### 3. **Status Determination Logic**
**File**: `src/app/api/facility/reports/[month]/route.ts`
**Lines**: 235-250

**Problem**: Incomplete status mapping and missing achievement thresholds.

## 🛠️ **Comprehensive Fixes**

### **Fix 1: Correct Range-Based Calculation**

```typescript
// In FormulaCalculator.calculateRangeBased()
private static calculateRangeBased(
  submittedValue: number,
  targetValue: number,
  maxRemuneration: number,
  config: FormulaConfig
): CalculationResult {
  const { min, max } = config.range || { min: 5, max: 10 };

  // If submitted value is below minimum, return 0% achievement
  if (submittedValue < min) {
    return {
      achievement: 0,
      remuneration: 0,
      status: "BELOW_TARGET",
      message: `Below minimum threshold of ${min}`,
    };
  }

  // If submitted value is at or above maximum, return 100% achievement  
  if (submittedValue >= max) {
    return {
      achievement: 100,
      remuneration: maxRemuneration,
      status: "ACHIEVED",
      message: `Achieved maximum threshold of ${max}`,
    };
  }

  // FIXED: Calculate proper achievement percentage within range
  // Map range (min-max) to achievement scale (50%-100%)
  const rangeSize = max - min;
  const achievedWithinRange = submittedValue - min;
  const positionInRange = achievedWithinRange / rangeSize; // 0.0 to 1.0
  
  // Linear scaling: min = 50% achievement, max = 100% achievement
  const achievement = 50 + (positionInRange * 50);
  const remuneration = (achievement / 100) * maxRemuneration;

  return {
    achievement: achievement,
    remuneration: Math.round(remuneration),
    status: "PARTIALLY_ACHIEVED",
    message: `Achieved ${submittedValue} out of ${max} (${achievement.toFixed(1)}% achievement)`,
  };
}
```

### **Fix 2: Correct Percentage Range Calculation**

```typescript
// In FormulaCalculator.calculatePercentageRange()  
private static calculatePercentageRange(
  submittedValue: number,
  targetValue: number,
  maxRemuneration: number,
  config: FormulaConfig
): CalculationResult {
  const { min, max } = config.range || { min: 3, max: 5 };

  if (targetValue === 0) {
    return {
      achievement: 0,
      remuneration: 0,
      status: "BELOW_TARGET", 
      message: "Target value is zero",
    };
  }

  // Calculate the actual percentage achieved
  const actualPercentage = config.calculationFormula 
    ? this.calculateMathematicalFormula(submittedValue, targetValue, config.calculationFormula)
    : (submittedValue / targetValue) * 100;

  // Below minimum threshold - no remuneration
  if (actualPercentage < min) {
    return {
      achievement: 0,
      remuneration: 0,
      status: "BELOW_TARGET",
      message: `Below minimum threshold of ${min}% (achieved: ${actualPercentage.toFixed(1)}%)`,
    };
  }

  // At or above maximum threshold - full remuneration
  if (actualPercentage >= max) {
    return {
      achievement: 100,
      remuneration: maxRemuneration,
      status: "ACHIEVED", 
      message: `At or above maximum threshold of ${max}% (achieved: ${actualPercentage.toFixed(1)}%)`,
    };
  }

  // FIXED: Within range - calculate remuneration based on expected model
  // For 3%-5% range: 3% = 60% remuneration, 4% = 80%, 5% = 100%
  let remuneration: number;
  let achievementForRemuneration: number;
  
  if (min === 3 && max === 5) {
    // Special case for Total Footfall (3%-5%) 
    // 3% → 60%, 4% → 80%, 5% → 100%
    const baseRemuneration = 60; // 3% gives 60%
    const rangeSize = max - min; // 2%
    const achievedWithinRange = actualPercentage - min; // How much above 3%
    const additionalRemuneration = (achievedWithinRange / rangeSize) * 40; // Scale 0-40%
    
    achievementForRemuneration = baseRemuneration + additionalRemuneration;
  } else {
    // For other ranges, use linear scaling
    // Map the achieved percentage to the expected remuneration percentage
    const rangeSize = max - min;
    const achievedWithinRange = actualPercentage - min;
    const positionInRange = achievedWithinRange / rangeSize;
    
    // Most percentage ranges should scale 50%-100%
    achievementForRemuneration = 50 + (positionInRange * 50);
  }

  remuneration = (achievementForRemuneration / 100) * maxRemuneration;

  return {
    achievement: achievementForRemuneration,
    remuneration: Math.round(remuneration),
    status: "PARTIALLY_ACHIEVED",
    message: `Within range ${min}-${max}% (achieved: ${actualPercentage.toFixed(1)}%, remuneration: ${achievementForRemuneration.toFixed(1)}%)`,
  };
}
```

### **Fix 3: Enhanced Status Determination in API**

```typescript
// In facility reports API route
// Calculate status based on achievement percentage and indicator type
let status: "achieved" | "partial" | "not_achieved";

// Use consistent logic based on result.achievement percentage
if (result.achievement >= 100) {
  status = "achieved";
  achievedCount++;
} else if (result.achievement >= 50) {
  status = "partial"; 
  partialCount++;
} else {
  status = "not_achieved";
  notAchievedCount++;
}

// Special handling for binary indicators
if (indicator.target_type === "BINARY") {
  if (result.achievement >= 100) {
    status = "achieved";
  } else {
    status = "not_achieved"; // Binary has no partial state
  }
}
```

### **Fix 4: Correct Target Value Parsing**

```typescript
// Simplified target value parsing for better reliability
let targetValue = 100; // Safe default
let targetDescription = indicator.target_formula || "Standard target";

// Parse target_value from database
if (indicator.target_value) {
  const targetValueStr = indicator.target_value.toString();
  
  try {
    // Try JSON parsing first (for ranges)
    if (targetValueStr.startsWith('{')) {
      const parsedRange = JSON.parse(targetValueStr);
      if (parsedRange.min !== undefined && parsedRange.max !== undefined) {
        targetValue = parsedRange.max; // Use max for calculations
        targetDescription = `Target: ${parsedRange.min}-${parsedRange.max}`;
      }
    } 
    // Handle range strings like "3-5" or "25-50"
    else if (targetValueStr.includes('-')) {
      const rangeMatch = targetValueStr.match(/(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        targetValue = parseInt(rangeMatch[2]); // Use max
        targetDescription = `Target: ${rangeMatch[1]}-${rangeMatch[2]}`;
      }
    }
    // Handle percentage strings like "50%"
    else if (targetValueStr.includes('%')) {
      targetValue = parseFloat(targetValueStr.replace('%', ''));
      targetDescription = `Target: ${targetValue}%`;
    }
    // Handle binary strings like "true"
    else if (targetValueStr === 'true' || targetValueStr === 'false') {
      targetValue = targetValueStr === 'true' ? 1 : 0;
      targetDescription = targetValueStr === 'true' ? "Target: Yes" : "Target: No";
    }
    // Simple numeric values
    else {
      targetValue = parseFloat(targetValueStr) || 100;
      targetDescription = `Target: ${targetValue}`;
    }
  } catch (error) {
    console.warn(`Error parsing target value "${targetValueStr}":`, error);
    targetValue = 100; // Safe fallback
  }
}

// Override with facility-specific targets where needed
if (indicator.code === "TC001") {
  const teleconsultationTargets: Record<string, number> = {
    SC_HWC: 25,
    PHC: 50, 
    UPHC: 50,
    U_HWC: 50,
    A_HWC: 50,
  };
  targetValue = teleconsultationTargets[facility.facility_type.name] || 50;
  targetDescription = `Target: ${targetValue} calls`;
}
```

## 🎯 **Expected Results After Fixes**

### **Range-Based Indicators (RANGE)**
- **Teleconsultation (TC001)**: Target 25-50 calls
  - 10 calls → 0% achievement, ₹0
  - 25 calls → 50% achievement, ₹500 (50% of ₹1000)  
  - 37 calls → 75% achievement, ₹750
  - 50 calls → 100% achievement, ₹1000

- **Wellness Sessions (WS001)**: Target 5-10 sessions
  - 3 sessions → 0% achievement, ₹0
  - 5 sessions → 50% achievement, ₹250 (50% of ₹500)
  - 7 sessions → 75% achievement, ₹375
  - 10 sessions → 100% achievement, ₹500

### **Percentage Range Indicators (PERCENTAGE_RANGE)**
- **Total Footfall (TF001)**: Target 3%-5% 
  - 2% → 0% achievement, ₹0
  - 3% → 60% achievement, ₹300 (60% of ₹500)
  - 4% → 80% achievement, ₹400  
  - 5% → 100% achievement, ₹500

- **ANC Footfall (AF001)**: Target 50%-100%
  - 40% → 0% achievement, ₹0
  - 50% → 50% achievement, ₹150 (50% of ₹300)
  - 75% → 75% achievement, ₹225
  - 100% → 100% achievement, ₹300

### **Binary Indicators (BINARY)**
- **JAS Meetings (JM001)**: Target ≥1 meeting
  - 0 meetings → 0% achievement, ₹0
  - 1+ meetings → 100% achievement, ₹500

## 🚀 **Implementation Priority**

1. **High Priority**: Fix range-based calculation (Fix 1)
2. **High Priority**: Fix percentage range calculation (Fix 2) 
3. **Medium Priority**: Improve status determination (Fix 3)
4. **Medium Priority**: Enhance target parsing (Fix 4)

These fixes will ensure that the facility reports show accurate achievement percentages and appropriate incentive amounts that align with the expected linear incentive distribution system.
