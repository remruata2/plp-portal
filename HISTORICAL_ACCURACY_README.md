# Historical Accuracy System for Remuneration Calculations

## Overview

This system ensures that remuneration calculations remain historically accurate even when KPI weights, targets, or formulas change. Instead of recalculating historical data with new metrics (which would show incorrect incentives for the past), the system preserves the original calculations and allows admins to control when recalculations occur.

## Key Benefits

✅ **Historical Accuracy**: Past calculations remain unchanged when metrics are modified  
✅ **Admin Control**: Admins can choose when to apply new calculations  
✅ **Audit Trail**: Full tracking of what changed and when  
✅ **Performance**: Stored calculations load faster than real-time calculations  
✅ **Flexibility**: Support for both historical and fresh calculations  

## How It Works

### 1. **First Calculation (Fresh)**
When a facility's remuneration is calculated for the first time:
- System calculates performance percentage using current KPI configuration
- Worker remuneration is computed based on current formulas
- **Configuration snapshots are stored** with the calculation
- Results are saved to `facility_remuneration_records` table

### 2. **Subsequent Views (Historical)**
When viewing the same month again:
- System retrieves stored historical data
- **Uses original KPI weights, targets, and formulas**
- **No recalculation occurs** - preserving historical accuracy
- UI shows `isHistorical: true` to indicate stored data

### 3. **Admin-Controlled Updates**
When metrics change:
- Admin creates a new calculation version (e.g., "2.0")
- Historical data remains unchanged
- New calculations use new version
- Admin can force recalculation for specific months if needed

## Database Schema

### `facility_remuneration_records` Table
```sql
-- Core fields
facility_id, report_month, indicator_id, worker_id
actual_value, target_value, percentage_achieved
incentive_amount, calculated_amount, worker_type, worker_role

-- Historical accuracy fields
calculation_version          -- Version when calculation was performed
kpi_config_snapshot         -- JSON snapshot of KPI weights/targets
remuneration_formula_snapshot -- JSON snapshot of formulas
worker_allocation_snapshot   -- JSON snapshot of worker allocation rules
calculation_metadata         -- Additional calculation context
calculation_date             -- When calculation was performed
```

## Usage Examples

### Basic Historical Calculation
```typescript
import { HistoricalRemunerationCalculator } from './historical-remuneration-calculator';

// This will use stored historical data if available
const calculation = await HistoricalRemunerationCalculator.getFacilityRemuneration(
  'facility_123',
  '2024-01'
);

console.log(calculation.isHistorical); // true if using stored data
console.log(calculation.calculationVersion); // e.g., "1.0"
```

### Force Recalculation (Admin Only)
```typescript
import { RemunerationVersionManager } from './admin/remuneration-version-manager';

// Force recalculation for a specific month
const result = await RemunerationVersionManager.forceRecalculationForMonth(
  '2024-01',
  'admin@example.com',
  'Updated KPI weights for Q1 2024'
);

console.log(`Recalculated ${result.recalculatedFacilities} facilities`);
```

### Create New Version
```typescript
// When KPI configuration changes
await RemunerationVersionManager.createNewVersion({
  newVersion: '2.0',
  adminUser: 'admin@example.com',
  reason: 'Increased footfall weight from 30% to 40%',
  changes: {
    kpiWeights: true,
    kpiTargets: false,
    remunerationFormulas: false,
    workerAllocations: false,
  },
  effectiveFrom: new Date('2024-04-01'),
  notes: 'Q2 2024 KPI adjustment based on performance analysis'
});
```

## Configuration Snapshots

### KPI Configuration Snapshot
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:00:00Z",
  "kpis": [
    {
      "fieldCode": "total_footfall",
      "weight": 0.3,
      "target": 1000,
      "description": "Total monthly footfall"
    },
    {
      "fieldCode": "wellness_sessions",
      "weight": 0.25,
      "target": 50,
      "description": "Wellness sessions conducted"
    }
  ],
  "totalWeight": 1.0
}
```

### Remuneration Formula Snapshot
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:00:00Z",
  "facilityIncentive": 8632.00,
  "workerAllocationRules": [
    {
      "workerType": "hwo",
      "allocationType": "individual",
      "description": "HWO gets fixed facility incentive"
    },
    {
      "workerType": "hw",
      "allocationType": "performance",
      "description": "HW gets performance-based allocation"
    }
  ]
}
```

## Migration Strategy

### Phase 1: Setup (Current)
- ✅ Add configuration snapshot fields to database
- ✅ Create historical remuneration calculator
- ✅ Implement version management system

### Phase 2: Data Migration
- Run initial calculations for existing months
- Store configuration snapshots for current version
- Mark existing data as historical

### Phase 3: UI Integration
- Update remuneration display to show historical status
- Add admin controls for version management
- Show calculation version in reports

### Phase 4: Advanced Features
- Automated version comparison tools
- Impact assessment for configuration changes
- Rollback capabilities for problematic changes

## Best Practices

### 1. **Version Naming**
- Use semantic versioning: `1.0`, `1.1`, `2.0`
- Document what changed in each version
- Keep versions simple and meaningful

### 2. **Configuration Changes**
- Test new configurations on small datasets first
- Use version comparison to assess impact
- Plan changes during low-usage periods

### 3. **Recalculation Strategy**
- Only force recalculation when necessary
- Consider the impact on historical reports
- Maintain audit trail of all changes

### 4. **Performance Considerations**
- Historical data loads much faster than fresh calculations
- Use stored data for reports and dashboards
- Reserve fresh calculations for admin functions

## Troubleshooting

### Common Issues

**Q: Why is my historical data showing different results?**
A: Check if the `calculation_version` matches your expected version. Historical data preserves the original calculation context.

**Q: How do I update all facilities to use new metrics?**
A: Use `forceRecalculationForMonth()` for specific months, or create a new version and let it apply to new calculations.

**Q: Can I rollback to a previous version?**
A: Yes, you can force recalculation using a previous version's configuration, but this will overwrite current data.

**Q: How do I know which facilities need recalculation?**
A: Use `getFacilitiesNeedingRecalculation()` to find facilities with outdated calculation versions.

## Security Considerations

- Only admin users can force recalculations
- All version changes are logged with admin identity
- Configuration snapshots are immutable once stored
- Historical data cannot be modified without admin action

## Future Enhancements

- **Automated Impact Analysis**: AI-powered assessment of configuration changes
- **Rollback Management**: Automated rollback to previous versions
- **Configuration Templates**: Pre-built configurations for common scenarios
- **Performance Monitoring**: Track calculation performance and optimization opportunities
- **Integration APIs**: REST endpoints for external system integration
