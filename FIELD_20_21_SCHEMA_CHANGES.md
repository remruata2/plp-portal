# Field 20 and Field 21 Schema Adjustments

## Task Summary

Successfully adjusted database schema for Fields 20 and 21 according to the requirements:

1. ✅ **Field 20 remains BINARY (Yes/No)**: `elderly_support_group_formed`
2. ✅ **Field 21 changed to MONTHLY_COUNT (integer)**: `elderly_support_group_activity`
3. ✅ **Added nullable constraint**: Field 21 can be empty when Field 20 = No

## Changes Made

### 1. Database Schema Updates

**Migration File**: `prisma/migrations/20250101000000_adjust_field_20_and_21_schema/migration.sql`

- Updated Field 21 (`elderly_support_group_activity`) from `BINARY` to `MONTHLY_COUNT`
- Updated field name and description to reflect the change
- Confirmed Field 20 (`elderly_support_group_formed`) remains `BINARY`
- Added documentation comment for the nullable constraint

### 2. Seed File Updates

**File**: `prisma/seed-fields-complete.ts`

Updated the field definition for `elderly_support_group_activity`:
```typescript
{
  code: "elderly_support_group_activity",
  name: "Elderly Support Group Activity Count",
  description: "Number of activities conducted by Elderly Support Group during the month (empty when no group formed)",
  user_type: "FACILITY" as const,
  field_type: "MONTHLY_COUNT" as const,
  field_category: "DATA_FIELD" as const,
  sort_order: 302,
}
```

### 3. Backend Validation

**File**: `src/app/api/facility/field-values/route.ts`

Added server-side validation logic:
- Validates that Field 21 cannot have a value when Field 20 is false
- Automatically sets Field 21 to null when Field 20 is false
- Returns appropriate error messages for invalid combinations

### 4. Frontend Form Updates

**File**: `src/components/forms/DynamicHealthDataForm.tsx`

Added client-side validation and UX improvements:
- Automatic clearing of Field 21 when Field 20 is set to "No"
- Visual feedback (disabled state) when Field 21 cannot be edited
- Informative message explaining why the field is disabled

## Field Mapping

| Field Reference | Database Field Code | Field Name | Field Type | ID |
|-----------------|-------------------|------------|------------|-----|
| Field 20 | `elderly_support_group_formed` | Elderly Support Group Formed | BINARY | 271 |
| Field 21 | `elderly_support_group_activity` | Elderly Support Group Activity Count | MONTHLY_COUNT | 272 |

## Business Logic

The relationship between these fields follows this logic:

1. **When Field 20 = Yes (true/1)**:
   - Field 21 is enabled and can accept integer values (0 or positive numbers)
   - Users can enter the number of activities conducted

2. **When Field 20 = No (false/0)**:
   - Field 21 is automatically cleared and disabled
   - Field 21 value is stored as NULL in the database
   - Visual feedback indicates why the field is disabled

## Testing

Verified the changes work correctly:
1. Database schema updated successfully
2. Migration applied without errors
3. Field types confirmed in database
4. Validation logic prevents invalid data entry
5. Frontend provides appropriate user experience

## Files Modified

1. `prisma/migrations/20250101000000_adjust_field_20_and_21_schema/migration.sql` (created)
2. `prisma/seed-fields-complete.ts` (updated)
3. `src/app/api/facility/field-values/route.ts` (updated)
4. `src/components/forms/DynamicHealthDataForm.tsx` (updated)
5. `FIELD_20_21_SCHEMA_CHANGES.md` (created - this file)

## Compliance

This implementation fulfills all requirements:
- ✅ Field 20 remains BINARY (Yes/No)
- ✅ Field 21 changed to MONTHLY_COUNT (integer)
- ✅ Nullable constraint implemented (Field 21 can be empty when Field 20 = No)
- ✅ Both server-side and client-side validation implemented
- ✅ User-friendly interface with clear feedback
