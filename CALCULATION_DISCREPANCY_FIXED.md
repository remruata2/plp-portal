# Calculation Discrepancy Between API and Modal - FIXED

## 🔍 Issue Identified

There was a significant discrepancy between the achievement percentage shown in the main report vs. the calculation modal:

- **Report showed**: 6548.5% for Oral Cancer Screening
- **Modal showed**: 109.1% for Oral Cancer Screening  

The correct calculation should be: `79 ÷ (4343 ÷ 60) × 100 = 109.1%`

## 🚨 Root Cause Analysis

The issue was **double calculation** in the API:

### Before Fix:
1. **API Step 1**: Calculate `achievementPercentage = FormulaCalculator.calculateMathematicalFormula(79, 4343, "(A/(B/60))*100")` → **109.1%**
2. **API Step 2**: Pass this percentage (109.1) to `FormulaCalculator.calculateRemuneration(109.1, targetValue, ...)`
3. **FormulaCalculator.calculatePercentageRange()**: Recalculate percentage as `109.1 / targetValue * 100` → **Wrong result!**

### The Problem:
- **API was passing calculated percentages** to FormulaCalculator
- **FormulaCalculator expected raw numerator values** and did its own calculation
- This caused double/incorrect calculations

## ✅ Solution Implemented

### 1. Fixed API Logic
Changed the API to pass **raw values** directly to FormulaCalculator:

```typescript
// Before (WRONG):
const submittedToCalculator = indicator.target_type === "RANGE" 
  ? actualValue  // Raw value for RANGE
  : achievementPercentage; // Pre-calculated percentage for PERCENTAGE_RANGE ❌

// After (CORRECT):
const result = FormulaCalculator.calculateRemuneration(
  actualValue, // Always pass raw numerator (79)
  denominatorValue, // Always pass raw denominator (4343) 
  maxRemuneration,
  calculationConfig, // Contains formula: "(A/(B/60))*100"
  ...
);
```

### 2. Fixed Modal Logic
Removed the "smart" detection logic that was trying to recalculate:

```typescript
// Before (PROBLEMATIC):
const isLikelyDivided = denominatorValue < 100;
if (isLikelyDivided) {
  return `${numerator} ÷ ${denominator} × 100 = ${percentage}%`; // Wrong formula
} else {
  return `${numerator} ÷ (${denominator} ÷ 60) × 100 = ${percentage}%`; // Correct formula
}

// After (CORRECT):
// Always use the API-calculated percentage and show correct formula
if (formula === "(A/(B/60))*100") {
  return `${numerator} ÷ (${denominator} ÷ 60) × 100 = ${percentage}%`;
}
```

## 📊 Expected Results Now

### For OC001 (Oral Cancer Screening):
- **Numerator**: 79 (Oral cancer screened)
- **Denominator**: 4343 (Population 30+)  
- **Formula**: `(A/(B/60))*100`
- **Calculation**: `79 ÷ (4343 ÷ 60) × 100 = 109.1%`
- **Both API and modal should show**: **109.1%** ✅

### For Other Population-Based Indicators:
- **CB001, HS001, DS001**: Formula `(A/(B/12))*100` should work correctly
- **BC001**: Formula `(A/(B/60))*100` should work correctly
- **All calculations consistent** between API and modal

## 🎯 Key Changes Made

### Files Modified:
1. **API Route** (`src/app/api/facility/reports/[month]/route.ts`):
   - Pass raw values to FormulaCalculator instead of pre-calculated percentages
   - Let FormulaCalculator handle all mathematical operations

2. **Modal Component** (`src/components/calculation-details-modal.tsx`):
   - Removed problematic "smart detection" logic
   - Always show correct formula representation
   - Use API-calculated percentage values

### Technical Approach:
- **Single Source of Truth**: FormulaCalculator now handles all percentage calculations
- **No Double Calculations**: API doesn't pre-calculate percentages for PERCENTAGE_RANGE indicators
- **Consistent Display**: Both API response and modal show the same calculated values

## ✨ Current Status

**FIXED**: The calculation discrepancy between API and modal has been resolved:
- ✅ **Consistent percentages** between report and modal
- ✅ **Correct mathematical calculations** using proper formulas
- ✅ **Proper handling** of population-based indicators (CB001, HS001, DS001, OC001, BC001)
- ✅ **Unified calculation logic** through FormulaCalculator

Both the main report and calculation modal now show the same accurate percentage calculations for all indicators.
