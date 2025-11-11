# Long Roll Registration System - API Documentation

## Overview

The Long Roll Registration system allows facility users (subcentres and clinics) to manage household registry data with a hierarchical structure:

**Hierarchy**: Facility → Village → Section → Family → Family Members

## Authentication

All endpoints require authentication via NextAuth session. The user must have a `facility_id` associated with their account.

## API Endpoints

### 1. Villages

#### GET `/api/facility/long-roll/villages`
Get all villages for the logged-in facility user.

**Response:**
```json
{
  "success": true,
  "villages": [
    {
      "id": "cuid",
      "name": "Village Name",
      "facility_id": "facility_cuid",
      "is_active": true,
      "created_at": "2025-09-30T...",
      "updated_at": "2025-09-30T...",
      "facility": {
        "id": "facility_cuid",
        "name": "Facility Name",
        "display_name": "Display Name"
      },
      "_count": {
        "sections": 5
      }
    }
  ],
  "count": 10
}
```

#### POST `/api/facility/long-roll/villages`
Create a new village.

**Request Body:**
```json
{
  "name": "New Village Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Village created successfully",
  "village": { ... }
}
```

#### GET `/api/facility/long-roll/villages/[id]`
Get a specific village with its sections.

**Response:**
```json
{
  "success": true,
  "village": {
    "id": "cuid",
    "name": "Village Name",
    "sections": [
      {
        "id": "section_cuid",
        "name": "Section Name",
        "_count": {
          "families": 10
        }
      }
    ]
  }
}
```

#### PUT `/api/facility/long-roll/villages/[id]`
Update a village.

**Request Body:**
```json
{
  "name": "Updated Village Name"
}
```

#### DELETE `/api/facility/long-roll/villages/[id]`
Soft delete a village.

**Request Body:**
```json
{
  "reason": "Optional deletion reason"
}
```

---

### 2. Sections

#### GET `/api/facility/long-roll/sections?village_id={village_id}`
Get all sections for a specific village.

**Query Parameters:**
- `village_id` (required): The village ID

**Response:**
```json
{
  "success": true,
  "sections": [
    {
      "id": "cuid",
      "name": "Section Name",
      "village_id": "village_cuid",
      "village": {
        "id": "village_cuid",
        "name": "Village Name"
      },
      "_count": {
        "families": 15
      }
    }
  ],
  "count": 5
}
```

#### POST `/api/facility/long-roll/sections`
Create a new section.

**Request Body:**
```json
{
  "name": "New Section Name",
  "village_id": "village_cuid"
}
```

#### GET `/api/facility/long-roll/sections/[id]`
Get a specific section with its families.

#### PUT `/api/facility/long-roll/sections/[id]`
Update a section.

**Request Body:**
```json
{
  "name": "Updated Section Name"
}
```

#### DELETE `/api/facility/long-roll/sections/[id]`
Soft delete a section.

**Request Body:**
```json
{
  "reason": "Optional deletion reason"
}
```

---

### 3. Families

#### GET `/api/facility/long-roll/families?section_id={section_id}`
Get all families for a specific section.

**Query Parameters:**
- `section_id` (required): The section ID

**Response:**
```json
{
  "success": true,
  "families": [
    {
      "id": "cuid",
      "house_no": "V12",
      "floor_no": "1",
      "no_of_couples": 2,
      "habitation_type": "PERMANENT",
      "section": {
        "id": "section_cuid",
        "name": "Section Name",
        "village": {
          "id": "village_cuid",
          "name": "Village Name"
        }
      },
      "_count": {
        "members": 5
      }
    }
  ],
  "count": 15
}
```

#### POST `/api/facility/long-roll/families`
Create a new family.

**Request Body:**
```json
{
  "section_id": "section_cuid",
  "house_no": "V12",
  "floor_no": "1",
  "no_of_couples": 2,
  "habitation_type": "PERMANENT"
}
```

**Field Details:**
- `house_no` (required): House number
- `floor_no` (optional): Floor number
- `no_of_couples` (optional, default: 0): Number of couples
- `habitation_type` (optional, default: "PERMANENT"): Either "PERMANENT" or "TEMPORARY"

#### GET `/api/facility/long-roll/families/[id]`
Get a specific family with all its members.

#### PUT `/api/facility/long-roll/families/[id]`
Update a family.

**Request Body:**
```json
{
  "house_no": "V12A",
  "floor_no": "2",
  "no_of_couples": 3,
  "habitation_type": "PERMANENT"
}
```

#### DELETE `/api/facility/long-roll/families/[id]`
Soft delete a family.

**Request Body:**
```json
{
  "reason": "MIGRATION",
  "remarks": "Family moved to another district"
}
```

**Valid Deletion Reasons:**
- `DEATH`
- `MIGRATION`
- `DUPLICATE`
- `OTHER`

---

### 4. Family Members

#### GET `/api/facility/long-roll/family-members?family_id={family_id}`
Get all members for a specific family.

**Query Parameters:**
- `family_id` (required): The family ID

**Response:**
```json
{
  "success": true,
  "members": [
    {
      "id": "cuid",
      "name": "John Doe",
      "relationship_with_hof": "SELF",
      "voter_id": "ABC123",
      "phone": "1234567890",
      "sex": "MALE",
      "occupation": "Farmer",
      "abha_id": "12-3456-7890-1234",
      "abha_address": "john.doe@abdm",
      "dob": "1980-01-01",
      "family": {
        "id": "family_cuid",
        "house_no": "V12",
        "section": {
          "id": "section_cuid",
          "name": "Section Name",
          "village": {
            "id": "village_cuid",
            "name": "Village Name"
          }
        }
      }
    }
  ],
  "count": 5
}
```

#### POST `/api/facility/long-roll/family-members`
Create a new family member.

**Request Body:**
```json
{
  "family_id": "family_cuid",
  "name": "John Doe",
  "relationship_with_hof": "SELF",
  "voter_id": "ABC123",
  "phone": "1234567890",
  "sex": "MALE",
  "occupation": "Farmer",
  "abha_id": "12-3456-7890-1234",
  "abha_address": "john.doe@abdm",
  "dob": "1980-01-01"
}
```

**Required Fields:**
- `family_id`
- `name`
- `relationship_with_hof`
- `sex`

**Optional Fields:**
- `voter_id`
- `phone`
- `occupation`
- `abha_id`
- `abha_address`
- `dob`

**Valid Sex Values:**
- `MALE`
- `FEMALE`
- `OTHER`

**Valid Relationship Values:**
- `SELF` (Head of Family)
- `HUSBAND`
- `WIFE`
- `SON`
- `DAUGHTER`
- `FATHER`
- `MOTHER`
- `BROTHER`
- `SISTER`
- `GRANDFATHER`
- `GRANDMOTHER`
- `GRANDSON`
- `GRANDDAUGHTER`
- `FATHER_IN_LAW`
- `MOTHER_IN_LAW`
- `SON_IN_LAW`
- `DAUGHTER_IN_LAW`
- `BROTHER_IN_LAW`
- `SISTER_IN_LAW`
- `UNCLE`
- `AUNT`
- `NEPHEW`
- `NIECE`
- `COUSIN`
- `OTHER`

#### GET `/api/facility/long-roll/family-members/[id]`
Get a specific family member.

#### PUT `/api/facility/long-roll/family-members/[id]`
Update a family member.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "relationship_with_hof": "SELF",
  "voter_id": "ABC123",
  "phone": "9876543210",
  "sex": "MALE",
  "occupation": "Teacher",
  "abha_id": "12-3456-7890-1234",
  "abha_address": "john.doe@abdm",
  "dob": "1980-01-01"
}
```

#### DELETE `/api/facility/long-roll/family-members/[id]`
Soft delete a family member.

**Request Body:**
```json
{
  "reason": "DEATH",
  "remarks": "Passed away on 2025-09-15"
}
```

**Valid Deletion Reasons:**
- `DEATH`
- `MIGRATION`
- `DUPLICATE`
- `OTHER`

---

## Security Features

1. **Authentication**: All endpoints require valid NextAuth session
2. **Authorization**: Users can only access data for their assigned facility
3. **Soft Delete**: All deletions are soft deletes with reason tracking
4. **Data Validation**: Comprehensive validation on all inputs
5. **Unique Constraints**: Prevents duplicate entries at each level

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "No facility associated with this user"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found or access denied"
}
```

### 409 Conflict
```json
{
  "error": "Duplicate entry exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Database Schema

### Village
- `id`: CUID
- `name`: String (200 chars)
- `facility_id`: String (FK to Facility)
- `is_active`: Boolean
- `deleted_at`: DateTime (nullable)
- `deleted_reason`: String (nullable)

### Section
- `id`: CUID
- `name`: String (200 chars)
- `village_id`: String (FK to Village)
- `is_active`: Boolean
- `deleted_at`: DateTime (nullable)
- `deleted_reason`: String (nullable)

### Family
- `id`: CUID
- `section_id`: String (FK to Section)
- `house_no`: String (50 chars)
- `floor_no`: String (20 chars, nullable)
- `no_of_couples`: Integer
- `habitation_type`: Enum (PERMANENT, TEMPORARY)
- `is_active`: Boolean
- `deleted_at`: DateTime (nullable)
- `deleted_reason`: Enum (nullable)
- `deleted_remarks`: String (nullable)

### FamilyMember
- `id`: CUID
- `family_id`: String (FK to Family)
- `name`: String (200 chars)
- `relationship_with_hof`: Enum (24 values)
- `voter_id`: String (50 chars, nullable)
- `phone`: String (20 chars, nullable)
- `sex`: Enum (MALE, FEMALE, OTHER)
- `occupation`: String (200 chars, nullable)
- `abha_id`: String (50 chars, nullable)
- `abha_address`: String (200 chars, nullable)
- `dob`: Date (nullable)
- `is_active`: Boolean
- `deleted_at`: DateTime (nullable)
- `deleted_reason`: Enum (nullable)
- `deleted_remarks`: String (nullable)

## Next Steps

To complete the Long Roll Registration system, you should:

1. **Create Frontend Components**:
   - Village management page
   - Section management page
   - Family management page
   - Family member form with all fields
   - Soft delete confirmation dialogs

2. **Add Data Export**:
   - Export village data to Excel/CSV
   - Generate reports by village/section

3. **Add Search & Filters**:
   - Search by name, voter ID, ABHA ID
   - Filter by village, section, habitation type
   - Filter by relationship, sex, age range

4. **Add Statistics Dashboard**:
   - Total villages, sections, families, members
   - Population demographics
   - Habitation type distribution

5. **Add Bulk Operations**:
   - Bulk import from Excel
   - Bulk update operations
   - Bulk soft delete with reason
