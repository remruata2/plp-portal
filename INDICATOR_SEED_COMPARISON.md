# Indicator Seed Script Comparison

## Overview

This document compares the old basic seed script with the new enhanced seed script that aligns with our complex healthcare indicators from `newindicators.md`.

## Old Seed Script (`seed-indicators.ts`)

### Characteristics:

- **Simple parsing**: Reads from a basic text file with code::description format
- **Basic structure**: Creates indicators with minimal fields (code, name, description, type)
- **No formula handling**: Doesn't handle complex numerators/denominators
- **No facility-specific logic**: Same indicator for all facility types
- **No target configuration**: No achievement targets or thresholds

### Example Output:

```sql
INSERT INTO indicator (code, name, description, type) VALUES
('1.1', 'Total number of NEW Pregnant Women registered for ANC', 'Total number of NEW Pregnant Women registered for ANC', 'simple'),
('1.1.a', 'Out of total number of NEW Pregnant Women registered with age <15 years', 'Out of total number of NEW Pregnant Women registered with age <15 years', 'simple');
```

### Limitations:

1. **No formula support**: Can't handle "5% of Total Population" or "100% of ANC due list"
2. **No facility-specific targets**: Can't handle "25 calls/month for SC, 50 for others"
3. **No achievement calculation**: No way to calculate performance percentages
4. **No data source tracking**: No record of where data comes from (AAM Portal, HMIS, etc.)
5. **No NA conditions**: Can't handle "If ANC due is 0 then NA"

## New Enhanced Seed Script (`seed-enhanced-indicators.ts`)

### Characteristics:

- **Complex indicator mapping**: Maps all 24 indicators from `newindicators.md`
- **Formula type classification**: Uses appropriate formula types (PERCENTAGE_CAP, RANGE_BASED, etc.)
- **Facility-specific configuration**: Creates different configurations per facility type
- **Enhanced metadata**: Stores source of verification, target descriptions, NA conditions
- **Structured data**: Uses JSON configuration for complex settings

### Example Output:

```sql
-- Creates indicator with enhanced configuration
INSERT INTO indicator (code, name, description, type, formula_type, formula_config) VALUES
('TF001', 'Total Footfall (M&F)', 'Total footfall (SC+Clinic) for SC, PHC+colocated SC for PHC', 'enhanced', 'PERCENTAGE_RANGE',
 '{"source_of_verification": "AAM Portal", "target_description": "5% of Total Population", "facility_types": ["PHC", "UPHC", "U_HWC", "SC_HWC", "A_HWC"]}');

-- Creates facility-specific configurations
INSERT INTO indicator_configuration (indicator_id, facility_type_id, numerator_label, denominator_label, target_value, target_formula) VALUES
(1, 1, 'Total Footfall', 'Total Population', NULL, 'Total Population * 0.05');
```

### Features:

1. **Formula handling**: Supports all formula types from the indicators table
2. **Facility-specific targets**: Different targets for different facility types
3. **Achievement calculation**: Built-in support for performance tracking
4. **Data source tracking**: Records verification sources (AAM Portal, HMIS, etc.)
5. **NA condition support**: Handles "Not Applicable" scenarios
6. **Population-based calculations**: Supports "Total 30+ population/12" formulas

## Key Differences

| Aspect                   | Old Script      | New Script                            |
| ------------------------ | --------------- | ------------------------------------- |
| **Data Source**          | Basic text file | Structured indicator definitions      |
| **Formula Support**      | None            | Full formula type classification      |
| **Facility Types**       | Same for all    | Facility-specific configurations      |
| **Target Values**        | None            | Dynamic target calculation            |
| **Achievement Tracking** | None            | Built-in performance calculation      |
| **Data Quality**         | None            | Source verification tracking          |
| **NA Conditions**        | None            | Conditional logic support             |
| **Population Formulas**  | None            | Dynamic population-based calculations |

## Indicator Examples

### Old Script Output:

```typescript
{
  code: "1.1",
  name: "Total number of NEW Pregnant Women registered for ANC",
  description: "Total number of NEW Pregnant Women registered for ANC",
  type: "simple"
}
```

### New Script Output:

```typescript
{
  code: "TF001",
  name: "Total Footfall (M&F)",
  description: "Total footfall (SC+Clinic) for SC, PHC+colocated SC for PHC",
  type: "enhanced",
  formula_type: "PERCENTAGE_RANGE",
  formula_config: {
    source_of_verification: "AAM Portal",
    target_description: "5% of Total Population",
    facility_types: ["PHC", "UPHC", "U_HWC", "SC_HWC", "A_HWC"]
  }
}
```

## Formula Type Mapping

| Indicator Type   | Old Script | New Script          |
| ---------------- | ---------- | ------------------- |
| Percentage-based | None       | `PERCENTAGE_CAP`    |
| Range-based      | None       | `RANGE_BASED`       |
| Binary (Yes/No)  | None       | `BINARY`            |
| Threshold-based  | None       | `MINIMUM_THRESHOLD` |
| Population-based | None       | `PERCENTAGE_RANGE`  |

## Facility Type Support

### Old Script:

- No facility-specific logic
- Same indicator for all facilities

### New Script:

- **PHC**: Primary Health Centre
- **UPHC**: Urban Primary Health Centre
- **U_HWC**: Urban Health & Wellness Centre
- **SC_HWC**: Sub Centre Health & Wellness Centre
- **A_HWC**: Ayush Health & Wellness Centre

Each facility type gets appropriate configurations and targets.

## Benefits of New Script

1. **Accurate Mapping**: All 24 indicators from `newindicators.md` properly mapped
2. **Formula Support**: Handles complex numerators/denominators
3. **Facility Flexibility**: Different targets per facility type
4. **Performance Tracking**: Built-in achievement calculation
5. **Data Quality**: Source verification and NA condition support
6. **Scalability**: Easy to add new indicators or modify existing ones
7. **Maintainability**: Clear structure and documentation

## Migration Path

To migrate from old to new:

1. **Backup existing data**: Export current indicators
2. **Run new seed script**: `npm run seed:enhanced`
3. **Update application logic**: Use new formula types and configurations
4. **Test thoroughly**: Verify all indicators work correctly
5. **Deploy gradually**: Roll out to test environments first

## Conclusion

The new enhanced seed script provides a much more robust foundation for handling complex healthcare indicators. It properly supports all the different types of numerators and denominators from the `newindicators.md` table, while maintaining flexibility for future requirements.
