# Incentive Calculation Logic Analysis Report

## Executive Summary

After thoroughly studying the incentive calculation logic and comparing it with the source indicator files, I've identified several key insights and discrepancies that need to be addressed.

## 1. Incentive Calculation Logic Structure

### Core Components

1. **IndicatorBasedRemunerationCalculator** - Main calculation engine
   - Calculates facility remuneration based on indicator performance
   - Integrates with health worker and ASHA worker allocations
   - Uses FormulaCalculator for complex calculations

2. **AutoIndicatorCalculator** - Automatic calculation system
   - Triggers calculations when field values are updated
   - Handles different indicator types and formulas
   - Manages conditional indicators (TB-related)

3. **FormulaCalculator** - Core formula execution engine
   - Handles multiple calculation types: RANGE_BASED, BINARY, PERCENTAGE_RANGE, MINIMUM_THRESHOLD
   - Manages conditional logic (NA conditions)
   - Supports facility-specific configurations

### Key Features

- **Conditional Indicators**: Supports TB-related indicators with conditional questions
- **Multiple Formula Types**: Range-based, binary, percentage calculations
- **Worker Allocation**: Distributes remuneration across different worker types
- **Performance Weighting**: Uses base amounts for weighted performance calculations

## 2. Source Files Analysis

### Facility Types Covered:
- **A-HWC** (AYUSH Health & Wellness Centre) - `ayushindicators.md`
- **PHC** (Primary Health Centre) - `phcindicators.md`
- **SC-HWC** (Sub Centre Health & Wellness Centre) - `schwcindicators.md`
- **UPHC** (Urban Primary Health Centre) - `uphcindicators.md`
- **U-HWC** (Urban Health & Wellness Centre) - `urbanhwc.md`

### Common Indicators Across Facilities:

1. **Total Footfall (M&F)** - 3%-5% target across all facilities
2. **Total Wellness sessions** - 5-10 sessions target
3. **Teleconsultation** - 25-50 calls target
4. **TB screening** - 50-100% target
5. **TB contact tracing** - Conditional on pulmonary TB patients
6. **TB differentiated care** - Conditional on any TB patients
7. **RI sessions** - Binary (100%)
8. **RI footfall** - 50-100%
9. **NCD screenings** (CBAC, HTN, DM, Oral Cancer, Breast & Cervical)
10. **Patient satisfaction** - 70-100%
11. **Elderly care** - Various targets
12. **JAS meetings** - Binary (100%)
13. **DVDMS issues** - Range-based targets

### Facility-Specific Variations:

#### A-HWC Specific:
- **Prakriti Parikshan** - 80% above only target
- Higher remuneration for certain indicators

#### PHC/UPHC Specific:
- **ANC indicators** - 50-100% targets
- **NCD diagnosis & treatment** - Binary (100%)

## 3. Seed Script vs Source Files Comparison

### ✅ What Matches Well:

1. **Field Structure**: All required fields are properly defined in `seed-fields-complete.ts`
2. **Indicator Codes**: Systematic coding approach with facility suffixes
3. **Target Types**: Proper mapping of target types (RANGE, BINARY, PERCENTAGE)
4. **Worker Allocations**: Basic allocation structure is in place

### ❌ Key Discrepancies Found:

#### 3.1 Missing Indicators:
- **Prakriti Parikshan** (PP001) - Only partially implemented for A-HWC
- **ANC indicators** - Not properly mapped for all facility types
- **Elderly Support Group indicators** - Basic structure exists but needs refinement

#### 3.2 Worker Allocation Mismatches:

**From Source Files (should be):**
- A-HWC Total Footfall: Ayush MO = 1000 (with TB) / 1000 (without TB)
- PHC Total Footfall: MO = 500 (with TB) / 500 (without TB)
- SC-HWC: HWO = 1000 (with/without TB)

**Current Seed Script:**
- Some allocations don't match the source file specifications
- Missing conditional allocations based on TB patient presence

#### 3.3 Formula Configuration Issues:

1. **Range Targets**: Some ranges not properly configured
   - SC-HWC uses "upto 3%-5%" but seed uses simple 3-5% range
   - Missing "upto 50% only" configurations

2. **Conditional Logic**: TB-related conditions need better implementation
   - Conditional questions are basic
   - Need to map to actual field codes from source

#### 3.4 Remuneration Amounts:

**Source Files specify different amounts by facility and worker type:**
- PHC MO: 7500 (with TB) / 7500 (without TB)
- UPHC: 7500 base amount
- U-HWC: 16600 base amount
- A-HWC: Various amounts (14500-15000 range)

**Current implementation** doesn't properly map these facility-specific amounts.

## 4. Specific Issues to Address

### 4.1 Conditional Indicators:
```typescript
// Current implementation
config.conditionalQuestion = {
  field: "pulmonary_tb_patients",
  text: "Are there any patients with Pulmonary TB in your catchment area?"
};

// Should reference actual field codes from seed
```

### 4.2 Target Value Parsing:
```typescript
// Source: "upto 50% only" 
// Should map to PERCENTAGE_CAP type with cap at 50%

// Source: "80% above only"
// Should map to MINIMUM_THRESHOLD type with threshold at 80%
```

### 4.3 Worker Allocation Mapping:
Current seed script has basic worker allocations, but source files show:
- Different amounts for "with TB patient" vs "without TB patient" scenarios
- Facility-specific base amounts
- Different worker types per facility

## 5. Recommendations

### Priority 1 - Critical Updates:

1. **Update Worker Allocations**: Align with source file specifications
2. **Fix Formula Configurations**: Proper mapping of "upto X% only" patterns
3. **Implement Conditional Remuneration**: TB patient presence affects amounts

### Priority 2 - Enhancement Updates:

1. **Add Missing Indicators**: Especially ANC-related for PHC facilities
2. **Refine Conditional Logic**: Better mapping of conditional questions
3. **Add Facility-Specific Base Amounts**: Different base amounts per facility type

### Priority 3 - Optimization:

1. **Formula Calculator Enhancement**: Better parsing of complex formulas
2. **Performance Calculation Refinement**: More accurate weighted calculations
3. **Validation Logic**: Ensure data integrity in calculations

## 6. Next Steps

1. **Update seed script** with corrected worker allocations and formula configs
2. **Test calculations** against source file examples
3. **Validate conditional logic** for TB-related indicators
4. **Add missing indicators** identified in the analysis

This analysis reveals that while the foundation is solid, there are significant alignment issues between the seed script and source files that need to be addressed for accurate incentive calculations.
