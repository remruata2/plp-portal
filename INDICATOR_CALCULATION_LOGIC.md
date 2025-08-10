# Indicator Calculation Logic

## Overview
This document outlines how indicator achievement and remuneration are calculated in the PLP Portal application. The logic is handled by the `FormulaCalculator` class, which uses different calculation methods based on the `formula_type` of each indicator.

## `FormulaCalculator` Class
**File**: `src/lib/calculations/formula-calculator.ts`

This class contains the core logic for all indicator calculations. It provides the following calculation methods:

- `calculateRangeBased`: For indicators with a numeric range (e.g., 5-10 sessions). Achievement starts at 50% for the minimum value and scales linearly to 100% for the maximum value.
- `calculatePercentageCap`: For indicators with a percentage-based target where achievement is capped (e.g., 50%-100%).
- `calculateBinary`: For indicators with a binary outcome (e.g., Yes/No, 1/0).
- `calculateMinimumThreshold`: For indicators where a minimum percentage must be achieved before any remuneration is awarded (e.g., 70% or more).
- `calculatePercentageRange`: For indicators where achievement falls within a percentage range (e.g., 3%-5%).

## Indicator Configuration
The calculation for each indicator is determined by its `formula_type` and other configuration properties stored in the `indicator` table in the database.

### Key Configuration Fields
- `formula_type`: Specifies which calculation method to use (e.g., `RANGE_BASED`, `BINARY`).
- `target_value`: The target for the indicator (e.g., a number, a range, a boolean).
- `target_formula`: A human-readable description of the target (e.g., "25-50 calls").
- `formula_config`: A JSON object containing detailed parameters for the calculation (e.g., min/max for ranges, percentage caps).

## Teleconsultation Calculation Issue
**Problem**: The Teleconsultation indicator (TC001) has a target of "25-50 calls", but an actual value of 10 was resulting in 100% achievement.

**Root Cause**: Incorrect formula type in the database. The `formula_type` for the TC001 indicator was set to `BINARY` instead of `RANGE_BASED`. This caused the system to treat any value greater than or equal to 1 as 100% achievement.

**Solution**:
1.  **Corrected `formula_type`**: The `formula_type` for TC001 has been updated to `RANGE_BASED`.
2.  **Added `formula_config`**: A `formula_config` with the correct min/max range has been added to the TC001 indicator to ensure accurate calculations:
    ```json
    {
      "range": {
        "min": 25,
        "max": 50
      }
    }
    ```

With these changes, the calculation for Teleconsultation will now be performed correctly, with achievement scaling proportionally between 25 and 50 calls.
