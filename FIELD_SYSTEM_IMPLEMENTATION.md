# Simplified Field-Based Health Data System

## Overview

We have successfully implemented a simplified field-based system for managing monthly health data uploads. This system allows users to:

1. **Create Fields** - Define data fields that will be collected monthly
2. **Upload Data** - Upload CSV/Excel files with monthly values for these fields
3. **Process Data** - Automatically validate and store the uploaded data

## Database Schema

### Key Models

**Field**

- `id` - Primary key
- `name` - Field name (e.g., "Number of ANC registrations")
- `field_type` - Either NUMBER or PERCENTAGE
- `data_source` - Source of data (HMIS, RCH Portal, etc.)
- `is_active` - Whether field is active

**MonthlyHealthData**

- `id` - Primary key
- `field_id` - Reference to field (for field values)
- `indicator_id` - Reference to indicator (for calculated values)
- `facility_id` - Facility where data was collected
- `district_id` - District (required for aggregation)
- `report_month` - Month in YYYY-MM format
- `value` - The actual numeric value
- `data_quality` - PENDING, VALIDATED, APPROVED, REJECTED
- `remarks` - Optional notes

## API Endpoints

### Fields Management

- `GET /api/fields` - List all active fields
- `POST /api/fields` - Create a new field

### Data Upload

- `POST /api/health-data/upload` - Upload CSV/Excel file with monthly data

## File Upload Format

### Expected CSV/Excel Structure

```csv
facility_code,field_name,value,remarks
PHC001,Number of ANC registrations,45,Regular data
PHC001,Number of institutional deliveries,42,Facility delivery
PHC002,Number of ANC registrations,32,
```

### Column Descriptions

1. **facility_code** - Facility code or name (must match existing facilities)
2. **field_name** - Exact field name (must match created fields)
3. **value** - Numeric value for the field
4. **remarks** - Optional notes or comments

## User Interface

### Field Management Page (`/admin/health-data/fields`)

- Create new fields with name, type, and data source
- View all existing fields in a table
- Filter by active/inactive status

### Upload Page (`/admin/health-data/upload`)

- Select report month and district
- Upload CSV/Excel files
- View upload results with success/error counts
- Detailed error reporting for failed rows

## Sample Data

We've created sample fields for common RCH indicators:

- Number of ANC registrations
- Number of pregnant women with 4+ ANC visits
- Number of institutional deliveries
- Number of home deliveries
- Number of JSY beneficiaries
- Number of high risk pregnancies identified
- Number of newborns weighed at birth
- Number of low birth weight babies
- Number of children fully immunized
- Number of children eligible for immunization
- Number of PW given IFA tablets
- Number of children 6-59 months given Vitamin A

## Next Steps

1. **Create Indicators** - Build calculated indicators using formulas with field values
2. **Add Charts** - Implement data visualization for uploaded field values
3. **Data Validation** - Add more sophisticated validation rules
4. **Approval Workflow** - Implement data approval process
5. **Export Features** - Add data export functionality

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/admin/health-data/fields` to create fields
3. Use the sample CSV file `sample-data.csv` to test uploads
4. Go to `/admin/health-data/upload` to upload test data

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── fields/route.ts
│   │   └── health-data/upload/route.ts
│   └── admin/health-data/
│       ├── fields/page.tsx
│       └── upload/page.tsx
├── components/layout/AdminSidebar.tsx
└── generated/prisma/ (auto-generated)

prisma/
├── schema.prisma
├── seed-fields.ts
└── migrations/

sample-data.csv (test file)
```

This implementation provides a solid foundation for a field-based health data management system that can be easily extended with indicators, charts, and advanced features.
