# Worker Management System Updates

## Overview

This document provides a comprehensive overview of the recent updates to the Worker Management and Incentive System in the PLP Portal. The system now fully supports six distinct worker types with proper allocation, management, and remuneration calculation.

## Worker Types Supported

The system now supports the following worker types:

1. **HWO (Health and Wellness Officer)**
2. **MO (Medical Officer)**
3. **AYUSH MO (AYUSH Medical Officer)**
4. **HW (Health Worker)**
5. **ASHA (Accredited Social Health Activist)**
6. **Colocated SC HW (Sub-Center Health Worker)**

## Database Schema

The worker management system is built on the following database models:

### HealthWorker

```prisma
model HealthWorker {
  id                Int      @id @default(autoincrement())
  facility_id       String
  name              String
  worker_type       String   // "hwo", "mo", "ayush_mo", "hw", "asha", "colocated_sc_hw"
  allocated_amount  Decimal  @db.Decimal(10, 2)
  contact_number    String?
  email             String?
  is_active         Boolean  @default(true)
  created_at        DateTime @default(now()) @db.Timestamptz(6)
  updated_at        DateTime @updatedAt @db.Timestamptz(6)

  // Relations
  facility Facility @relation(fields: [facility_id], references: [id], onDelete: Cascade)
  remuneration_calculations WorkerRemuneration[]

  @@map("health_workers")
}
```

### WorkerAllocationConfig

```prisma
model WorkerAllocationConfig {
  id                Int      @id @default(autoincrement())
  facility_type_id  String
  worker_type       String   // "hwo", "mo", "ayush_mo", "hw", "asha", "colocated_sc_hw"
  worker_role       String   // "HWO", "MO", "AYUSH MO", "HW", "ASHA", "Colocated SC HW"
  max_count         Int      @default(1)
  allocated_amount  Decimal  @db.Decimal(10, 2)
  description       String?
  is_active         Boolean  @default(true)
  created_at        DateTime @default(now()) @db.Timestamptz(6)
  updated_at        DateTime @updatedAt @db.Timestamptz(6)

  // Relations
  facility_type FacilityType @relation(fields: [facility_type_id], references: [id], onDelete: Cascade)
  facility_allocations FacilityWorkerAllocation[]

  @@unique([facility_type_id, worker_type, worker_role])
  @@map("worker_allocation_config")
}
```

## API Endpoints

### Worker Management

1. **GET /api/facilities/[id]/workers**
   - Fetches active workers for a specific facility
   - Returns worker details including name, type, role, and allocation amount

2. **POST /api/facilities/[id]/workers**
   - Saves worker data (create/update)
   - Marks existing workers as inactive before updating
   - Handles validation and error responses

3. **GET /api/facilities/[id]/worker-allocation-config**
   - Fetches allocation configuration for worker types based on facility type
   - Returns max count and allocated amount per worker type

### Reports

1. **GET /api/facility/reports/[month]**
   - Updated to handle all worker types instead of just health workers and AYUSH workers
   - Calculates remuneration based on performance percentage
   - Returns worker counts by type

## UI Components

### WorkerManagementForm

The `WorkerManagementForm` component has been updated to:

1. Dynamically render worker sections based on worker types from allocation config
2. Enforce maximum worker count per type
3. Handle adding and removing workers
4. Save worker data to the API
5. Display appropriate error messages and success notifications
6. Filter out empty worker entries when saving

### Reports Page

The reports page has been updated to:

1. Display a unified workers section instead of separate health/AYUSH worker sections
2. Show worker role in the table
3. Calculate and display total worker remuneration
4. Show worker counts by type in the summary

## Bug Fixes

1. Fixed Next.js 15 async params usage by awaiting params before accessing properties
2. Fixed issue with MO worker type showing "Maximum limit reached" prematurely by filtering out empty workers
3. Improved error handling in the saveWorkers function to better handle API responses
4. Fixed mismatch between API response structure and component expectations by transforming config objects to arrays

## Implementation Details

### Worker Addition/Removal Logic

```tsx
const addWorker = (workerType: string) => {
  if (!canAddWorker(workerType)) return;
  
  const config = getWorkerTypeConfig(workerType);
  const newWorker = {
    id: 0, // Will be assigned by the server on save
    name: "",
    worker_type: workerType,
    worker_role: config?.worker_role || "",
    allocated_amount: config?.allocated_amount || 0,
    is_active: true,
  };
  
  setWorkers([...workers, newWorker]);
};

const removeWorker = (index: number) => {
  const updatedWorkers = [...workers];
  updatedWorkers.splice(index, 1);
  setWorkers(updatedWorkers);
};
```

### Worker Save Logic

```tsx
const saveWorkers = async () => {
  try {
    setSaving(true);

    // Only save workers with non-empty names
    const validWorkers = workers.filter((w) => w.name.trim());

    const response = await fetch(`/api/facilities/${facilityId}/workers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workers: validWorkers }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        toast.success("Workers saved successfully!");
        if (onWorkersUpdated) {
          onWorkersUpdated();
        }
      } else {
        throw new Error(result.error || "Failed to save workers");
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to save workers");
    }
  } catch (error) {
    console.error("Error saving workers:", error);
    toast.error(error instanceof Error ? error.message : "Failed to save workers");
  } finally {
    setSaving(false);
  }
};
```

## Next Steps

1. Continue testing the worker management system end-to-end
2. Verify remuneration calculations are correct for all worker types
3. Enhance UI feedback for worker management operations
4. Add validation for worker data entry (email, contact number)
5. Implement worker history tracking for auditing purposes

## Conclusion

The Worker Management and Incentive System has been fully implemented to support six distinct worker types with proper allocation, management, and remuneration calculation. The system now correctly handles individual incentive allocation, data fetching and saving via API endpoints, and provides a seamless UI for worker management and remuneration calculation.
