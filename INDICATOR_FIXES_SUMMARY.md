# Indicator Numbering and Default Month Selection Fixes

## Issues Fixed

### 1. Serial Number 999 Issue
**Problem**: The indicator with code "DV001_SC" was showing serial number 999 instead of the correct number 21.

**Root Cause**: The indicator mapping in `src/lib/utils/indicator-sort-order.ts` was missing facility-specific variants for the DVDMS indicators. Only `DV001_PHC` was mapped, but `DV001_SC` (SC-HWC specific) was not included.

**Solution**: Updated both functions in the utility file to include all facility-specific variants for indicator #21 (Issues generated in DVDMS):
```typescript
// 21. Issues generated in DVDMS - All facility types
['DV001_SC', 21],    // SC-HWC
['DV001_PHC', 21],   // PHC
['DV001_UPHC', 21],  // UPHC
['DV001_UHWC', 21],  // U-HWC
['DV001_AHWC', 21],  // A-HWC
['DV001', 21],       // Generic fallback
['DI001', 21],       // Generic fallback (alternative code)
```

### 2. Default Month Selection
**Problem**: The facility reports page was defaulting to the current month, which might not have any data available.

**Solution**: Updated the logic to automatically select the latest available month with data:

#### Changes Made:
1. **Replaced `getCurrentMonth()` function** with `getLatestAvailableMonth()`:
   ```typescript
   const getLatestAvailableMonth = (months: string[]) => {
     if (months.length === 0) return "";
     // Sort months in descending order and return the latest
     return months.sort((a, b) => b.localeCompare(a))[0];
   };
   ```

2. **Updated initialization logic**: 
   - Removed automatic setting of current month on load
   - Now sets the latest available month after loading available months data

3. **Improved user experience**:
   - Users immediately see data for the most recent month with available reports
   - No need to manually select a month with data
   - Falls back gracefully if no data is available

## Benefits

### Fixed Serial Numbers
- All indicators now display correct sequential numbers (1-24)
- No more confusing "999" numbers in reports
- Consistent numbering across all facility types

### Improved Default Selection
- Users immediately see the most recent data
- Reduces clicks needed to access relevant information
- Better user experience with automatic smart defaults
- Eliminates confusion about which months have data

## Files Modified

1. **`src/lib/utils/indicator-sort-order.ts`**:
   - Added missing facility-specific mappings for DV001 indicators
   - Updated both sorting and numbering functions

2. **`src/app/facility/reports/page.tsx`**:
   - Replaced current month logic with latest available month logic
   - Updated initialization sequence
   - Improved user experience flow

## Testing Notes

- Verify that DV001_SC now shows as indicator #21
- Check that the page loads with the latest available month selected
- Ensure all facility types show correct indicator numbers
- Confirm that month selection still works properly for manual changes

These fixes ensure a more professional and user-friendly experience in the facility reports section.
