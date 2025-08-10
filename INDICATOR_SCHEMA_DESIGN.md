# Enhanced Indicator Schema Design

## Overview

This schema design handles complex healthcare indicators with different types of numerators and denominators as specified in the `newindicators.md` table. The design is flexible enough to accommodate:

1. **Constants** (e.g., "10 sessions/month")
2. **Population-based calculations** (e.g., "Total 30+ population/12")
3. **References to other indicators** (e.g., "Total footfall")
4. **Dynamic monthly data** (e.g., "Total ANC due list")
5. **Facility-specific values** (e.g., "20 for SC, 50 for PHC")

## Core Design Principles

### 1. Formula Component System

The `FormulaComponent` model acts as a flexible container for different types of numerators and denominators:

```sql
-- Different types of formula components
enum FormulaComponentType {
  CONSTANT           // Fixed value like "10", "25"
  POPULATION_BASED   // Based on population data
  INDICATOR_REFERENCE // References another indicator
  DYNAMIC_MONTHLY    // Changes each month
  FACILITY_SPECIFIC  // Different values per facility type
  CALCULATED         // Derived from other components
}
```

### 2. Indicator Configuration

Each indicator can have:

- A numerator configuration (FormulaComponent)
- A denominator configuration (FormulaComponent)
- Facility-specific targets
- Achievement thresholds

## Handling Different Types of Indicators

### Type 1: Constants

**Example**: "10 sessions/month" for Wellness Sessions

```sql
-- Create constant component
INSERT INTO formula_component (name, component_type, constant_value) VALUES
('Wellness Sessions Target', 'CONSTANT', 10.00);

-- Link to indicator
UPDATE indicator SET
  numerator_config_id = (SELECT id FROM formula_component WHERE name = 'Wellness Sessions Target'),
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'Wellness Sessions Target')
WHERE code = 'WS001';
```

### Type 2: Population-Based

**Example**: "100% of 30+ population/12/month" for CBAC

```sql
-- Create population-based component
INSERT INTO formula_component (name, component_type, population_formula) VALUES
('Population 30+ Monthly', 'POPULATION_BASED', 'population_30_plus / 12');

-- Link to indicator
UPDATE indicator SET
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'Population 30+ Monthly')
WHERE code = 'CB001';
```

### Type 3: Indicator References

**Example**: "100% of total footfall/month" for TB Screening

```sql
-- Create indicator reference component
INSERT INTO formula_component (name, component_type, referenced_indicator_id) VALUES
('Total Footfall Reference', 'INDICATOR_REFERENCE', 1);

-- Link to indicator
UPDATE indicator SET
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'Total Footfall Reference')
WHERE code = 'TS001';
```

### Type 4: Dynamic Monthly Data

**Example**: "100% of ANC due list" for ANC Footfall

```sql
-- Create dynamic monthly component
INSERT INTO formula_component (name, component_type, data_source, aggregation_method) VALUES
('ANC Due List', 'DYNAMIC_MONTHLY', 'ANC_DUE_LIST', 'count');

-- Link to indicator
UPDATE indicator SET
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'ANC Due List')
WHERE code = 'AF001';
```

### Type 5: Facility-Specific Values

**Example**: "20 issues/month for SC, 50 issues/month for PHC, 100 issues/month for UPHC"

```sql
-- Create facility-specific component
INSERT INTO formula_component (name, component_type, facility_specific_values) VALUES
('DVDMS Issues Target', 'FACILITY_SPECIFIC',
 '{"SC": 20, "PHC": 50, "UPHC": 100, "U_HWC": 50, "SC_HWC": 20, "A_HWC": 50}');

-- Link to indicator
UPDATE indicator SET
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'DVDMS Issues Target')
WHERE code = 'DI001';
```

## Calculation Engine

### 1. Numerator Calculation

The system calculates numerators based on the component type:

```javascript
function calculateNumerator(component, facilityId, reportMonth) {
  switch (component.component_type) {
    case "CONSTANT":
      return component.constant_value;

    case "POPULATION_BASED":
      return evaluatePopulationFormula(
        component.population_formula,
        facilityId,
        reportMonth
      );

    case "INDICATOR_REFERENCE":
      return getIndicatorValue(
        component.referenced_indicator_id,
        facilityId,
        reportMonth
      );

    case "DYNAMIC_MONTHLY":
      return getMonthlyData(component.data_source, facilityId, reportMonth);

    case "FACILITY_SPECIFIC":
      return getFacilitySpecificValue(
        component.facility_specific_values,
        facilityId
      );
  }
}
```

### 2. Denominator Calculation

Similar logic applies to denominators:

```javascript
function calculateDenominator(component, facilityId, reportMonth) {
  // Same logic as numerator calculation
  return calculateNumerator(component, facilityId, reportMonth);
}
```

### 3. Achievement Calculation

```javascript
function calculateAchievement(numerator, denominator, targetValue) {
  if (denominator === 0) return 0;

  const percentage = (numerator / denominator) * 100;

  // Apply min/max thresholds
  const minAchievement = getMinAchievement(facilityId, indicatorId);
  const maxAchievement = getMaxAchievement(facilityId, indicatorId);

  return Math.max(minAchievement, Math.min(maxAchievement, percentage));
}
```

## Population Data Management

The `PopulationData` model stores catchment area demographics:

```sql
-- Example population data
INSERT INTO population_data (facility_id, district_id, report_month,
                           total_population, population_18_plus, population_30_plus,
                           female_population_30_plus, anc_due_list, tb_patients) VALUES
(1, 1, '2024-01', 5000, 3500, 2500, 1200, 45, 12);
```

## Facility-Specific Targets

The `FacilityTarget` model handles different targets per facility type:

```sql
-- Example: Different targets for different facility types
INSERT INTO facility_target (facility_id, indicator_id, facility_type,
                           target_value, target_percentage, min_achievement, max_achievement) VALUES
(1, 2, 'PHC', 10.00, NULL, 5.00, 10.00),      -- Wellness sessions
(2, 5, 'SC_HWC', NULL, 100.00, 50.00, 100.00), -- ANC footfall
(3, 7, 'UPHC', NULL, 100.00, 50.00, 100.00);   -- TB screening
```

## NA (Not Applicable) Conditions

Some indicators have conditions where they become "Not Applicable":

```sql
-- Example: ANC footfall becomes NA if ANC due list is 0
UPDATE facility_target SET
  na_condition = 'If ANC due is 0 then NA'
WHERE indicator_id = 5 AND facility_type = 'SC_HWC';
```

## Data Quality and Validation

The system includes data quality controls:

```sql
-- Example: Data quality workflow
UPDATE monthly_health_data SET
  data_quality = 'PENDING',
  remarks = 'Data uploaded, awaiting validation'
WHERE facility_id = 1 AND report_month = '2024-01';
```

## Performance Calculation and Remuneration

The `PerformanceCalculation` model stores calculated results:

```sql
-- Example: Performance calculation
INSERT INTO performance_calculation (facility_id, indicator_id, report_month,
                                   numerator, denominator, achievement, remuneration_amount) VALUES
(1, 2, '2024-01', 8.00, 10.00, 80.00, 800.00);
```

## Benefits of This Design

### 1. Flexibility

- Handles all types of numerators/denominators from the indicators table
- Easy to add new formula component types
- Supports complex calculations

### 2. Maintainability

- Clear separation of concerns
- Reusable formula components
- Centralized calculation logic

### 3. Scalability

- Efficient queries with proper indexing
- Supports multiple facility types
- Handles large datasets

### 4. Audit Trail

- Complete history of calculations
- Data quality tracking
- Approval workflow

## Implementation Steps

1. **Create the enhanced schema** using the Prisma schema file
2. **Migrate existing data** to the new structure
3. **Implement calculation engine** in your application logic
4. **Create admin interface** for managing formula components
5. **Add validation rules** for data quality
6. **Implement reporting** for performance analysis

## Example Usage

```javascript
// Calculate achievement for a specific indicator
const achievement = await calculateIndicatorAchievement({
  facilityId: 1,
  indicatorId: 2,
  reportMonth: "2024-01",
});

console.log(`Achievement: ${achievement.percentage}%`);
console.log(`Remuneration: ₹${achievement.remuneration}`);
```

This schema design provides a robust foundation for handling complex healthcare indicators while maintaining flexibility for future requirements.
