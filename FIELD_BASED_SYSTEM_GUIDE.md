# Field-Based System Guide

## Overview

The PLP Portal now uses a **field-based system** where facilities submit field values, and indicators are automatically calculated based on formulas. This eliminates the need for facilities to manually calculate and submit indicator values.

## System Architecture

### 1. **Fields** (What facilities submit)

- **Admin Fields**: Pre-filled by administrators (population data, targets)
- **Facility Fields**: Submitted by facilities (monthly counts, activities)

### 2. **Indicators** (Auto-calculated)

- Formulas reference fields as numerator/denominator
- Automatically calculated when field values are updated
- Stored in `MonthlyHealthData` table

### 3. **Incentives** (Auto-calculated)

- Based on indicator achievement percentages
- Multiple formula types (range-based, binary, percentage cap, etc.)

## Data Flow

```
Facility submits field values
         ↓
Field values stored in FieldValue table
         ↓
AutoIndicatorCalculator triggers
         ↓
Indicators calculated using formulas
         ↓
Results stored in MonthlyHealthData
         ↓
Incentives calculated based on achievement
```

## API Endpoints

### 1. Submit Field Values

```http
POST /api/facility/field-values
Content-Type: application/json

{
  "facility_id": "123",
  "report_month": "2024-01",
  "field_values": [
    {
      "field_code": "total_footfall",
      "value": 150,
      "remarks": "Monthly footfall count"
    },
    {
      "field_code": "wellness_sessions_conducted",
      "value": 8,
      "remarks": "Wellness sessions held"
    }
  ]
}
```

### 2. Get Field Values

```http
GET /api/facility/field-values?facility_id=123&report_month=2024-01
```

### 3. Get Calculated Indicators

```http
GET /api/facility/indicators?facility_id=123&report_month=2024-01
```

## Field Categories

### Admin Fields (Pre-filled)

- `total_population` - Total population of catchment area
- `population_18_plus` - Population aged 18+
- `population_30_plus` - Population aged 30+
- `population_30_plus_female` - Female population 30+
- `anc_due_list` - ANC due list
- `ri_sessions_planned` - RI sessions planned
- `ri_beneficiaries_due` - RI beneficiaries due
- `bedridden_patients` - Bed-ridden patients
- `pulmonary_tb_patients` - Pulmonary TB patients
- `total_tb_patients` - Total TB patients
- `ncd_referred_from_sc` - NCD referred from SC

### Facility Fields (Submitted by facilities)

- `total_footfall` - Total footfall
- `wellness_sessions_conducted` - Wellness sessions
- `prakriti_parikshan_conducted` - Prakriti Parikshan
- `teleconsultation_conducted` - Teleconsultation
- `anc_footfall` - ANC footfall
- `anc_tested_hb` - ANC tested for Hb
- `tb_screenings` - TB screenings
- `tb_contact_tracing_households` - TB contact tracing
- `tb_differentiated_care_visits` - TB differentiated care
- `ri_sessions_held` - RI sessions held
- `ri_footfall` - RI footfall
- `cbac_forms_filled` - CBAC forms filled
- `htn_screened` - HTN screened
- `dm_screened` - DM screened
- `oral_cancer_screened` - Oral cancer screened
- `breast_cervical_cancer_screened` - Breast & cervical cancer screened
- `ncd_diagnosed_tx_completed` - NCD diagnosed & treatment completed
- `patient_satisfaction_score` - Patient satisfaction score
- `elderly_palliative_visits` - Elderly & palliative visits
- `elderly_clinic_conducted` - Elderly clinic conducted
- `jas_meetings_conducted` - JAS meetings conducted
- `dvdms_issues_generated` - DVDMS issues generated
- `elderly_support_group_formed` - Elderly support group formed (binary)
- `elderly_support_group_activity` - Elderly support group activity (binary)

## Indicator Formulas

### 1. Total Footfall (TF001)

- **Formula**: `(total_footfall / total_population) * 100`
- **Target**: 5%
- **Range**: 3-5%

### 2. Wellness Sessions (WS001)

- **Formula**: `(wellness_sessions_conducted / target_wellness_sessions) * 100`
- **Target**: 100%
- **Range**: 5-10 sessions

### 3. Teleconsultation (TC001)

- **Formula**: `(teleconsultation_conducted / target_teleconsultation) * 100`
- **Target**: 100%
- **Range**: 25-50

### 4. ANC Footfall (AF001)

- **Formula**: `(anc_footfall / anc_due_list) * 100`
- **Target**: 100%
- **Cap**: 50%
- **Condition**: NA if ANC due is 0

### 5. TB Screenings (TS001)

- **Formula**: `(tb_screenings / total_footfall) * 100`
- **Target**: 100%
- **Cap**: 50%

## Facility Type Field Mappings

### PHC

- All facility fields except `prakriti_parikshan_conducted`
- Includes NCD diagnosis and treatment

### UPHC

- Limited set: footfall, wellness, teleconsultation, TB screening, NCD, patient satisfaction, elderly clinic, JAS, DVDMS

### SC_HWC

- All facility fields except `prakriti_parikshan_conducted` and NCD fields
- Includes elderly support group fields

### U_HWC

- Limited set: footfall, wellness, teleconsultation, TB-related fields, elderly fields, JAS, DVDMS

### A_HWC

- All facility fields including `prakriti_parikshan_conducted`
- Complete set of fields

## Calculation Process

### 1. Field Value Submission

```typescript
// Facility submits field values
const fieldValues = [
  { field_code: "total_footfall", value: 150 },
  { field_code: "wellness_sessions_conducted", value: 8 },
];

// FieldBasedUpdater processes the submission
const updater = new FieldBasedUpdater();
await updater.updateFieldValues(fieldValues, userId);
```

### 2. Auto-Indicator Calculation

```typescript
// AutoIndicatorCalculator triggers automatically
const calculator = new AutoIndicatorCalculator();
await calculator.calculateAllIndicators(facilityId, reportMonth);
```

### 3. Formula Application

```typescript
// For each applicable indicator
const numeratorValue = getFieldValue(indicator.numerator_field_id);
const denominatorValue = getFieldValue(indicator.denominator_field_id);
const calculatedValue = (numeratorValue / denominatorValue) * 100;
```

### 4. Remuneration Calculation

```typescript
// FormulaCalculator determines remuneration
const result = FormulaCalculator.calculateRemuneration(
  calculatedValue,
  targetValue,
  maxRemuneration,
  formulaConfig
);
```

## Benefits

### 1. **Simplified Data Entry**

- Facilities only submit raw data (counts, activities)
- No need to understand complex formulas
- Reduced data entry errors

### 2. **Consistent Calculations**

- All indicators calculated using same logic
- No manual calculation errors
- Standardized formulas across facilities

### 3. **Real-time Updates**

- Indicators recalculate automatically
- Immediate feedback on achievement
- Live incentive calculations

### 4. **Flexible Formula System**

- Support for multiple formula types
- Facility-specific targets
- Conditional calculations (NA scenarios)

### 5. **Audit Trail**

- Field values stored separately
- Calculation history maintained
- Clear data lineage

## Migration from Old System

### 1. **Data Migration**

- Existing indicator values can be preserved
- New field values can be back-calculated
- Gradual transition possible

### 2. **User Training**

- Facilities need to understand field submission
- Admin needs to understand field management
- Clear documentation and training materials

### 3. **Validation**

- Field value validation rules
- Formula calculation verification
- Cross-checking with existing data

## Implementation Status

### ✅ **Completed**

- Database schema with field-based system
- Field seeding scripts
- Indicator seeding with field references
- Facility field mappings
- Auto-calculation engine
- API endpoints for field submission
- Formula calculator with multiple types

### 🔄 **In Progress**

- Frontend forms for field submission
- Admin interface for field management
- Validation and error handling
- Performance optimization

### 📋 **Planned**

- Bulk field value import
- Advanced formula builder
- Real-time calculation dashboard
- Mobile app integration

## Usage Examples

### Facility Data Entry

```javascript
// Submit field values
const response = await fetch("/api/facility/field-values", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    facility_id: "123",
    report_month: "2024-01",
    field_values: [
      { field_code: "total_footfall", value: 150 },
      { field_code: "wellness_sessions_conducted", value: 8 },
      { field_code: "teleconsultation_conducted", value: 25 },
    ],
  }),
});

// Get calculated results
const indicators = await fetch(
  "/api/facility/indicators?facility_id=123&report_month=2024-01"
);
```

### Admin Field Management

```javascript
// Set admin field values
const adminFields = [
  { field_code: "total_population", value: 3000 },
  { field_code: "anc_due_list", value: 45 },
];

// These are pre-filled and used in calculations
```

This field-based system provides a robust, scalable foundation for healthcare performance monitoring with automatic indicator calculations and incentive determination.
