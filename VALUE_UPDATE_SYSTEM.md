# Value Update System for Healthcare Indicators

## Overview

The Value Update System provides a comprehensive solution for updating numerator and denominator values for healthcare indicators based on different formula types and facility configurations. This system handles:

1. **Constants** - Fixed values (e.g., "10 sessions/month")
2. **Population-based calculations** - Based on catchment area demographics
3. **Indicator references** - Values derived from other indicators
4. **Dynamic monthly data** - Values that change each month
5. **Facility-specific values** - Different targets per facility type

## System Architecture

### Core Components

1. **ValueUpdater Class** (`/src/lib/calculations/value-updater.ts`)

   - Handles all value calculation logic
   - Supports different formula types
   - Manages database operations

2. **API Endpoint** (`/api/indicators/update-values`)

   - RESTful API for updating values
   - Supports batch updates
   - Returns current values

3. **React Component** (`/src/components/indicators/value-updater-form.tsx`)
   - User-friendly interface
   - Dynamic input modes
   - Real-time validation

## Formula Types and Update Methods

### 1. Constants (e.g., Wellness Sessions)

**Formula**: "10 sessions/month"
**Update Method**: Raw value input

```typescript
// Example update
await ValueUpdater.updateValues({
  facilityId: 1,
  indicatorId: 2,
  reportMonth: "2024-01",
  rawValue: 8, // User enters actual sessions conducted
  uploadedBy: 1,
});
```

**Result**:

- Numerator: 8
- Denominator: 10 (from configuration)
- Achievement: 80%

### 2. Population-Based (e.g., CBAC Screening)

**Formula**: "Population 30+ / 12"
**Update Method**: Numerator input, denominator auto-calculated

```typescript
// Example update
await ValueUpdater.updateValues({
  facilityId: 1,
  indicatorId: 12,
  reportMonth: "2024-01",
  numeratorValue: 45, // User enters CBAC forms filled
  uploadedBy: 1,
});
```

**Result**:

- Numerator: 45
- Denominator: 208 (calculated from population data)
- Achievement: 21.6%

### 3. Indicator References (e.g., TB Screening)

**Formula**: "100% of Total Footfall"
**Update Method**: Numerator input, denominator from referenced indicator

```typescript
// Example update
await ValueUpdater.updateValues({
  facilityId: 1,
  indicatorId: 7,
  reportMonth: "2024-01",
  numeratorValue: 150, // User enters TB screenings conducted
  uploadedBy: 1,
});
```

**Result**:

- Numerator: 150
- Denominator: 250 (from Total Footfall indicator)
- Achievement: 60%

### 4. Facility-Specific (e.g., Teleconsultation)

**Formula**: "25 for SC, 50 for PHC, 100 for UPHC"
**Update Method**: Numerator input, denominator based on facility type

```typescript
// Example update
await ValueUpdater.updateValues({
  facilityId: 1, // PHC facility
  indicatorId: 4,
  reportMonth: "2024-01",
  numeratorValue: 35, // User enters teleconsultation calls
  uploadedBy: 1,
});
```

**Result**:

- Numerator: 35
- Denominator: 50 (PHC target)
- Achievement: 70%

### 5. Dynamic Monthly Data (e.g., ANC Footfall)

**Formula**: "100% of ANC Due List"
**Update Method**: Numerator input, denominator from monthly data

```typescript
// Example update
await ValueUpdater.updateValues({
  facilityId: 1,
  indicatorId: 5,
  reportMonth: "2024-01",
  numeratorValue: 40, // User enters ANC footfall
  uploadedBy: 1,
});
```

**Result**:

- Numerator: 40
- Denominator: 45 (from ANC due list data)
- Achievement: 88.9%

## API Usage

### Update Single Value

```typescript
// POST /api/indicators/update-values
const response = await fetch("/api/indicators/update-values", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    updates: [
      {
        facilityId: 1,
        indicatorId: 2,
        reportMonth: "2024-01",
        numeratorValue: 8,
        denominatorValue: 10,
        rawValue: undefined,
        remarks: "Regular monthly data",
      },
    ],
  }),
});
```

### Get Current Values

```typescript
// GET /api/indicators/update-values?facilityId=1&indicatorId=2&reportMonth=2024-01
const response = await fetch(
  "/api/indicators/update-values?facilityId=1&indicatorId=2&reportMonth=2024-01"
);
const data = await response.json();
// Returns: { numerator: 8, denominator: 10, value: 80, achievement: 80 }
```

### Batch Update

```typescript
// Update multiple indicators at once
const response = await fetch("/api/indicators/update-values", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    updates: [
      {
        facilityId: 1,
        indicatorId: 2,
        reportMonth: "2024-01",
        rawValue: 8,
      },
      {
        facilityId: 1,
        indicatorId: 4,
        reportMonth: "2024-01",
        numeratorValue: 35,
      },
    ],
  }),
});
```

## React Component Usage

```tsx
import { ValueUpdaterForm } from "@/components/indicators/value-updater-form";

function IndicatorPage() {
  return (
    <ValueUpdaterForm
      facilityId={1}
      indicatorId={2}
      reportMonth="2024-01"
      indicatorName="Wellness Sessions"
      facilityName="PHC Aizawl"
      onSuccess={() => {
        // Refresh data or show success message
        console.log("Values updated successfully!");
      }}
    />
  );
}
```

## Population Data Management

The system automatically handles population data for calculations:

```typescript
// Population data structure
interface PopulationData {
  totalPopulation: number;
  population18Plus: number;
  population30Plus: number;
  femalePopulation30Plus: number;
  ancDueList: number;
  tbPatients: number;
}
```

### Population-Based Calculations

1. **CBAC Screening**: `population30Plus / 12`
2. **HTN/DM Screening**: `population30Plus / 12`
3. **Oral Cancer**: `population30Plus / 60`
4. **Breast/Cervical Cancer**: `femalePopulation30Plus / 60`

## Error Handling

The system provides comprehensive error handling:

```typescript
// Example error response
{
  success: false,
  errors: [
    {
      facilityId: 1,
      indicatorId: 2,
      error: "No configuration found for indicator WS001 and facility type PHC"
    }
  ],
  summary: {
    total: 1,
    successful: 0,
    failed: 1
  }
}
```

## Common Error Scenarios

1. **Missing Configuration**: No indicator configuration for facility type
2. **Invalid Facility**: Facility not found in database
3. **Missing Population Data**: No population data for facility/month
4. **Invalid Formula**: Cannot evaluate target formula
5. **Referenced Indicator Not Found**: Referenced indicator doesn't exist

## Best Practices

### 1. Data Validation

```typescript
// Validate input before updating
if (numeratorValue < 0) {
  throw new Error("Numerator cannot be negative");
}

if (denominatorValue === 0) {
  throw new Error("Denominator cannot be zero");
}
```

### 2. Batch Operations

```typescript
// Use batch updates for multiple indicators
const updates = indicators.map((indicator) => ({
  facilityId,
  indicatorId: indicator.id,
  reportMonth,
  numeratorValue: indicator.numerator,
  denominatorValue: indicator.denominator,
}));

await ValueUpdater.updateMultipleValues(updates);
```

### 3. Error Recovery

```typescript
// Handle partial failures in batch updates
const result = await updateValues(updates);
if (result.errors.length > 0) {
  // Retry failed updates or notify user
  console.log("Some updates failed:", result.errors);
}
```

## Integration with Existing Systems

### Performance Calculations

After updating values, the system automatically triggers performance calculations:

```typescript
// Performance calculation is triggered automatically
const performance = await PerformanceCalculator.calculatePerformance(
  facilityId,
  indicatorId,
  reportMonth
);
```

### Remuneration Calculations

Updated values are used for remuneration calculations:

```typescript
// Remuneration is calculated based on updated values
const remuneration = await RemunerationCalculator.calculateFacilityRemuneration(
  facilityId,
  reportMonth
);
```

## Monitoring and Analytics

### Data Quality Tracking

```typescript
// Track data quality status
enum DataQuality {
  PENDING = "PENDING",
  VALIDATED = "VALIDATED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
```

### Audit Trail

All updates are tracked with:

- User who made the update
- Timestamp of update
- Previous and new values
- Remarks/notes

## Future Enhancements

1. **Formula Builder UI**: Visual formula editor
2. **Bulk Import**: Excel/CSV import for multiple facilities
3. **Data Validation Rules**: Custom validation per indicator
4. **Approval Workflow**: Multi-level approval process
5. **Real-time Notifications**: Alerts for data updates
6. **Historical Tracking**: Version history of all changes

## Troubleshooting

### Common Issues

1. **Formula Not Evaluating**: Check formula syntax and variable references
2. **Population Data Missing**: Ensure population data is uploaded for the facility
3. **Configuration Not Found**: Verify indicator configuration exists for facility type
4. **Permission Denied**: Check user role and facility access

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// Enable debug mode
process.env.DEBUG = "value-updater:*";
```

This comprehensive system provides a flexible and robust solution for updating healthcare indicator values while maintaining data integrity and supporting various formula types.
