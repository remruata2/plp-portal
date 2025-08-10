# UPHC and UHWC Team-Based Incentive System Update

## Overview

This document summarizes the changes made to implement UPHC and UHWC as **completely team-based facilities** that cannot have individual workers (HW, ASHA) and only support Medical Officer (MO) workers with team-based incentives.

## Changes Made

### 1. Worker Allocation Configuration (`scripts/seed-worker-allocation-config.ts`)

**Before:**
- UPHC and UHWC had MO, HW, and ASHA workers
- Total allocation: ₹10,000 per facility

**After:**
- UPHC and UHWC now only have MO workers
- Total allocation: ₹7,500 per facility (MO only)
- HW and ASHA workers completely removed

```typescript
// UPHC (Urban Primary Health Centre) - Team-based only
{
  facilityTypeName: "UPHC",
  workerType: "mo",
  workerRole: "MO",
  maxCount: 1,
  allocatedAmount: 7500,
  description: "Medical Officer - Single position per facility (team-based)",
},

// U_HWC (Urban Health & Wellness Centre) - Team-based only
{
  facilityTypeName: "U_HWC",
  workerType: "mo",
  workerRole: "MO",
  maxCount: 1,
  allocatedAmount: 7500,
  description: "Medical Officer - Single position per facility (team-based)",
},
```

### 2. API Route Updates (`src/app/api/facility/reports/[month]/route.ts`)

**Added logic to completely exclude UPHC and UHWC from individual worker calculations:**

```typescript
// UPHC and UHWC are completely team-based - they should not have any individual workers
const completelyTeamBasedFacilities = ['UPHC', 'U_HWC'];

// Calculate worker remuneration - ONLY show performance-based workers
// UPHC and UHWC are completely team-based - they should not show any individual workers
const workersRemuneration = workers
  .filter(worker => {
    // For UPHC and UHWC, don't show any individual workers (they are completely team-based)
    if (completelyTeamBasedFacilities.includes(facility.facility_type.name)) {
      return false;
    }
    // For other facilities, only show performance-based workers
    return performanceBasedWorkerTypes.includes(worker.worker_type.toLowerCase());
  })
```

### 3. Reports Page Updates (`src/app/facility/reports/page.tsx`)

**Workers Section:**
- UPHC and UHWC now show a "Team-Based Facility" message instead of worker tables
- Other facilities continue to show individual worker breakdowns

**Total Remuneration Section:**
- UPHC and UHWC show "Team-Based Incentives" with ₹0.00 for individual workers
- Other facilities show "Total Worker Remuneration" with calculated amounts

### 4. Documentation Updates (`WORKER_ALLOCATION_SYSTEM.md`)

**Updated facility allocation table:**
| Facility Type | Total Allocation | Worker Types | Description |
|---------------|------------------|--------------|-------------|
| **UPHC**      | ₹7,500           | MO only      | Urban Primary Health Centre (Team-based) |
| **U_HWC**     | ₹7,500           | MO only      | Urban Health & Wellness Centre (Team-based) |

**Added new section explaining team-based vs performance-based facilities**

## Result

### **UPHC and UHWC Facilities Now:**
✅ **CAN** enter MO names (Medical Officers)  
✅ **CANNOT** add HW or ASHA workers  
✅ **DO NOT** show individual worker incentives in reports  
✅ **ARE** treated as completely team-based incentives  
✅ **SHOW** "Team-Based Facility" message instead of worker tables  
✅ **DISPLAY** ₹0.00 for individual worker remuneration  

### **Other Facilities (SC_HWC, A_HWC, PHC):**
✅ **CAN** have both team-based and performance-based workers  
✅ **SHOW** individual worker incentives for performance-based workers  
✅ **DISPLAY** worker tables with calculated amounts  

## Database Impact

When the updated worker allocation configuration is applied:
- Existing UPHC and UHWC facilities will no longer be able to add HW or ASHA workers
- Only MO workers will be allowed for these facility types
- Reports will automatically filter out any existing HW/ASHA workers for UPHC/UHWC

## Testing Recommendations

1. **Verify UPHC/UHWC facilities cannot add HW or ASHA workers**
2. **Confirm reports show "Team-Based Facility" message for UPHC/UHWC**
3. **Ensure other facilities continue to work as before**
4. **Validate that MO workers still work correctly for UPHC/UHWC**
