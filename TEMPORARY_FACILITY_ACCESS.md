# Temporary Facility Access to Admin Fields

## Overview

This is a **temporary implementation** that allows facility users to submit both admin and facility type fields when submitting their health data. This is intended as a temporary solution until the final field-based system is fully implemented.

## Current Implementation

### 1. Form Changes

- **DynamicHealthDataForm**: Now handles all facility types dynamically using field mappings from the database
- **Visual Indicators**: Added warning messages and field type labels to clearly indicate which fields are admin vs facility
- **Combined Interface**: All fields are now in a single section for facility users instead of separate admin/facility sections

### 2. API Changes

- **New Endpoint**: `/api/health-data/temporary-submission` - Handles submission of both admin and facility fields by facility users
- **SmartFieldService Integration**: Uses the existing SmartFieldService to properly store field values
- **Validation**: Validates field existence and handles different field types (numeric, string, boolean)

### 3. User Experience

- **Warning Message**: Facility users see a temporary mode warning
- **Field Labels**: Each field is labeled as "Admin field" or "Facility field"
- **Unified Interface**: All fields are accessible in one form

## Field Mapping

The current implementation maps form fields to database field IDs as follows:

| Form Field                      | Field ID | Type     | Description             |
| ------------------------------- | -------- | -------- | ----------------------- |
| totalPopulation                 | 1        | Admin    | Total Population        |
| ancDueList                      | 2        | Admin    | ANC Due List            |
| riSessionsPlanned               | 3        | Admin    | RI Sessions Planned     |
| population30Plus                | 4        | Admin    | Population 30+          |
| femalePopulation30Plus          | 5        | Admin    | Female Population 30+   |
| referredFromSC                  | 6        | Admin    | Referred from SC        |
| bedRiddenPatients               | 7        | Admin    | Bed Ridden Patients     |
| totalFootfall                   | 8        | Facility | Total Footfall          |
| wellnessSessions                | 9        | Facility | Wellness Sessions       |
| teleconsultationCalls           | 10       | Facility | Teleconsultation Calls  |
| ancFootfall                     | 11       | Facility | ANC Footfall            |
| ancHbTested                     | 12       | Facility | ANC Hb Tested           |
| tbScreened                      | 13       | Facility | TB Screened             |
| pulmonaryTbPatients             | 14       | Facility | Pulmonary TB Patients   |
| tbContactTracingHouseholds      | 15       | Facility | TB Contact Tracing      |
| tbPatientsForDifferentiatedCare | 16       | Facility | TB Differentiated Care  |
| totalTbPatients                 | 17       | Facility | Total TB Patients       |
| riSessionsHeld                  | 18       | Facility | RI Sessions Held        |
| riFootfall                      | 19       | Facility | RI Footfall             |
| riBeneficiaries                 | 20       | Facility | RI Beneficiaries        |
| cbacFilled                      | 21       | Facility | CBAC Filled             |
| htnScreened                     | 22       | Facility | HTN Screened            |
| dmScreened                      | 23       | Facility | DM Screened             |
| oralCancerScreened              | 24       | Facility | Oral Cancer Screened    |
| breastCervicalCancerScreened    | 25       | Facility | Breast/Cervical Cancer  |
| ncdDiagnosedTreated             | 26       | Facility | NCD Diagnosed & Treated |
| patientSatisfactionScore        | 27       | Facility | Patient Satisfaction    |
| elderlyPalliativeVisited        | 28       | Facility | Elderly Palliative      |
| elderlyClinicsConducted         | 29       | Facility | Elderly Clinics         |
| jasMeetingsConducted            | 30       | Facility | JAS Meetings            |
| dvdmsIssuesGenerated            | 31       | Facility | DVDMS Issues            |

## API Usage

### Temporary Submission Endpoint

**POST** `/api/health-data/temporary-submission`

**Request Body:**

```json
{
  "facilityId": 1,
  "reportMonth": "2024-01",
  "fieldValues": [
    {
      "fieldId": 1,
      "value": 5000,
      "fieldType": "numeric"
    },
    {
      "fieldId": 8,
      "value": 250,
      "fieldType": "numeric"
    }
  ],
  "remarks": "Temporary submission by facility user"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Processed 2 fields successfully",
  "results": [
    {
      "fieldId": 1,
      "fieldCode": "total_population",
      "userType": "ADMIN",
      "success": true
    },
    {
      "fieldId": 8,
      "fieldCode": "total_footfall",
      "userType": "FACILITY",
      "success": true
    }
  ],
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

## Final Approach (Future Implementation)

The final approach should differentiate fields based on user type:

1. **Admin Fields**: Pre-filled by administrators, facility users cannot modify
2. **Facility Fields**: Submitted by facility users, visible to both admin and facility users
3. **Field-based System**: Use the existing field system with proper user type restrictions
4. **Dynamic Forms**: Generate forms based on facility type and user role
5. **Validation**: Proper validation based on field types and user permissions

## Migration Path

To migrate to the final approach:

1. Update field definitions to properly set `user_type` (ADMIN/FACILITY)
2. Modify form components to only show appropriate fields based on user role
3. Update API endpoints to enforce field access restrictions
4. Remove temporary submission endpoint
5. Implement proper field-based form generation

## Notes

- This is a **temporary solution** and should not be used in production
- Field IDs are hardcoded and should be replaced with proper field lookup
- The facility ID is hardcoded and should come from the user's session
- Error handling should be improved for production use
- The final approach should use the existing field-based system with proper user type restrictions
