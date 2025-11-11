# Facility & User Creation Process - Complete Guide

## Overview

This document explains the complete process for creating facilities and users with the new Long Roll access control system.

---

## Schema Structure

### **Facility Hierarchy**

```
District
  └─ Facility (Subcentre)
      ├─ parent_facility_id: NULL
      ├─ has_clinic: true/false
      ├─ User (Subcentre Staff)
      └─ Facility (Clinic)
          ├─ parent_facility_id: Subcentre ID
          ├─ has_clinic: true
          └─ User (Clinic Staff)
```

### **Key Fields**

- **`parent_facility_id`**: NULL = Subcentre, NOT NULL = Clinic under subcentre
- **`has_clinic`**: true = Can access Long Roll, false = Cannot access Long Roll

---

## Creation Process

### **Scenario 1: Subcentre WITH Clinic Infrastructure**

#### Step 1: Create Subcentre
```typescript
POST /api/facilities
{
  "name": "Durtlang Subcentre",
  "district_id": "district_cuid",
  "facility_type_id": "SC_HWC_type_id",
  "parent_facility_id": "",           // Empty = Subcentre
  "has_clinic": true,                 // ✅ Enable Long Roll
  "address": "Durtlang, Aizawl",
  "contact_number": "1234567890",
  "email": "durtlang@facility.com"
}
```

**Result**: Subcentre created with Long Roll access

#### Step 2: Create User for Subcentre
```typescript
POST /api/admin/users
{
  "username": "durtlang_sc",
  "password": "password123",
  "role": "facility",
  "facility_id": "durtlang_sc_cuid",  // Links to subcentre
  "email": "durtlang_sc@facility.com"
}
```

**Result**: User can login and see Long Roll menu

---

### **Scenario 2: Subcentre WITHOUT Clinic (Field-based only)**

#### Step 1: Create Subcentre
```typescript
POST /api/facilities
{
  "name": "Rural Subcentre",
  "district_id": "district_cuid",
  "facility_type_id": "SC_HWC_type_id",
  "parent_facility_id": "",           // Empty = Subcentre
  "has_clinic": false,                // ❌ No Long Roll access
  "address": "Rural Area",
  "contact_number": "9876543210",
  "email": "rural@facility.com"
}
```

**Result**: Subcentre created WITHOUT Long Roll access

#### Step 2: Create User for Subcentre
```typescript
POST /api/admin/users
{
  "username": "rural_sc",
  "password": "password123",
  "role": "facility",
  "facility_id": "rural_sc_cuid",
  "email": "rural_sc@facility.com"
}
```

**Result**: User can login but CANNOT see Long Roll menu

---

### **Scenario 3: Clinic Under Subcentre**

#### Step 1: Create Parent Subcentre (if not exists)
```typescript
POST /api/facilities
{
  "name": "Durtlang Subcentre",
  "district_id": "district_cuid",
  "facility_type_id": "SC_HWC_type_id",
  "parent_facility_id": "",
  "has_clinic": true,
  // ... other fields
}
```

#### Step 2: Create Clinic Under Subcentre
```typescript
POST /api/facilities
{
  "name": "Durtlang Clinic A",
  "district_id": "district_cuid",
  "facility_type_id": "clinic_type_id",
  "parent_facility_id": "durtlang_sc_cuid",  // ✅ Links to parent
  "has_clinic": true,                         // ✅ Enable Long Roll
  "address": "Durtlang North",
  "contact_number": "1234567891",
  "email": "durtlang_clinic_a@facility.com"
}
```

**Result**: Clinic created under subcentre with Long Roll access

#### Step 3: Create User for Clinic
```typescript
POST /api/admin/users
{
  "username": "durtlang_clinic_a",
  "password": "password123",
  "role": "facility",
  "facility_id": "durtlang_clinic_a_cuid",  // Links to clinic
  "email": "durtlang_clinic_a@facility.com"
}
```

**Result**: User can login and see Long Roll menu (clinic's own data)

---

## Admin UI Updates

### **Facility Creation Form**

The admin facility creation form now includes:

#### 1. **Parent Facility Dropdown**
```
Parent Facility (Optional)
┌─────────────────────────────┐
│ None (Subcentre)           │ ← Default
│ Durtlang Subcentre         │
│ Sairang Subcentre          │
└─────────────────────────────┘

Help text: "Select parent if this is a clinic under a subcentre"
```

**Options**:
- Shows only facilities with `parent_facility_id = NULL` (subcentres)
- Empty value = creating a subcentre
- Selected value = creating a clinic under that subcentre

#### 2. **Has Clinic Checkbox**
```
Has Clinic Infrastructure
☑ Enable Long Roll Registration

Help text: "Check if facility has clinic infrastructure"
```

**Purpose**:
- Checked = Facility can access Long Roll features
- Unchecked = Facility cannot access Long Roll features

---

## Data Isolation

### **Important: Each Facility Has Its Own Long Roll Data**

```
Durtlang Subcentre (has_clinic: true)
  └─ Villages: Village A, Village B
  └─ Long Roll Data: Independent

Durtlang Clinic A (parent: Durtlang SC, has_clinic: true)
  └─ Villages: Village C, Village D
  └─ Long Roll Data: Independent

Durtlang Clinic B (parent: Durtlang SC, has_clinic: true)
  └─ Villages: Village E, Village F
  └─ Long Roll Data: Independent
```

**Key Points**:
- ✅ Subcentre and its clinics have **separate** Long Roll data
- ✅ No data sharing between parent and child facilities
- ✅ Each facility user sees only their own facility's data

---

## Access Control Matrix

| Facility Type | parent_facility_id | has_clinic | Long Roll Access | User Can See |
|--------------|-------------------|------------|------------------|--------------|
| Subcentre    | NULL              | true       | ✅ Yes           | Menu visible |
| Subcentre    | NULL              | false      | ❌ No            | Menu hidden  |
| Clinic       | Subcentre ID      | true       | ✅ Yes           | Menu visible |
| Clinic       | Subcentre ID      | false      | ❌ No            | Menu hidden  |

---

## Common Workflows

### **Workflow 1: Create Subcentre with Multiple Clinics**

1. Create Subcentre (parent_facility_id: NULL, has_clinic: true)
2. Create User for Subcentre
3. Create Clinic A (parent_facility_id: Subcentre ID, has_clinic: true)
4. Create User for Clinic A
5. Create Clinic B (parent_facility_id: Subcentre ID, has_clinic: true)
6. Create User for Clinic B

**Result**: 3 facilities, 3 users, all with Long Roll access (independent data)

---

### **Workflow 2: Create Subcentre Without Clinic**

1. Create Subcentre (parent_facility_id: NULL, has_clinic: false)
2. Create User for Subcentre

**Result**: 1 facility, 1 user, NO Long Roll access

---

### **Workflow 3: Enable Long Roll for Existing Facility**

```sql
-- Update existing facility to enable Long Roll
UPDATE facility 
SET has_clinic = true 
WHERE id = 'facility_id_here';
```

**Result**: Facility users will see Long Roll menu on next login

---

## Testing Checklist

### ✅ **Test Case 1: Subcentre with Clinic**
1. Create subcentre with `has_clinic = true`
2. Create user for subcentre
3. Login as user
4. **Expected**: Long Roll menu visible
5. Add villages, sections, families, members
6. **Expected**: All operations work

### ✅ **Test Case 2: Subcentre without Clinic**
1. Create subcentre with `has_clinic = false`
2. Create user for subcentre
3. Login as user
4. **Expected**: Long Roll menu NOT visible
5. Try direct URL `/facility/long-roll`
6. **Expected**: "Access Denied" message

### ✅ **Test Case 3: Clinic under Subcentre**
1. Create subcentre with `has_clinic = true`
2. Create clinic with `parent_facility_id = subcentre_id` and `has_clinic = true`
3. Create users for both
4. Login as subcentre user
5. **Expected**: See subcentre's Long Roll data
6. Login as clinic user
7. **Expected**: See clinic's Long Roll data (different from subcentre)

### ✅ **Test Case 4: Data Isolation**
1. Login as subcentre user
2. Add village "Village A"
3. Logout, login as clinic user (under same subcentre)
4. **Expected**: "Village A" NOT visible (separate data)

---

## API Endpoints Summary

### **Facilities**
- `POST /api/facilities` - Create facility (with parent_facility_id and has_clinic)
- `PUT /api/facilities/:id` - Update facility
- `GET /api/facilities` - List all facilities
- `DELETE /api/facilities/:id` - Delete facility

### **Users**
- `POST /api/admin/users` - Create user (with facility_id)
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/:id` - Delete user

### **Long Roll** (Facility-specific)
- `GET /api/facility/long-roll/villages` - List villages for logged-in facility
- `POST /api/facility/long-roll/villages` - Create village
- ... (all other Long Roll endpoints)

---

## Database Queries

### **Find all subcentres**
```sql
SELECT * FROM facility 
WHERE parent_facility_id IS NULL;
```

### **Find all clinics under a subcentre**
```sql
SELECT * FROM facility 
WHERE parent_facility_id = 'subcentre_id';
```

### **Find all facilities with Long Roll access**
```sql
SELECT * FROM facility 
WHERE has_clinic = true;
```

### **Find all facilities without Long Roll access**
```sql
SELECT * FROM facility 
WHERE has_clinic = false OR has_clinic IS NULL;
```

---

## Summary

### **Key Concepts**

1. **`parent_facility_id`**: Defines hierarchy (NULL = subcentre, value = clinic)
2. **`has_clinic`**: Controls Long Roll access (true = access, false = no access)
3. **Data Isolation**: Each facility has its own independent Long Roll data
4. **User Access**: Users see only their assigned facility's data

### **Admin Responsibilities**

- ✅ Create facilities with correct hierarchy
- ✅ Set `has_clinic` appropriately
- ✅ Create users linked to correct facilities
- ✅ Verify access control works as expected

### **Facility User Experience**

- ✅ Login with credentials
- ✅ See Long Roll menu if `has_clinic = true`
- ✅ Manage own facility's household data
- ✅ Cannot see other facilities' data

---

**Last Updated**: September 30, 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
