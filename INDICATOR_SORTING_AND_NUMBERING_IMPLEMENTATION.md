# Indicator Sorting and Numbering Implementation

## Overview
This document outlines the implementation of a consistent indicator sorting and numbering system across the PLP Portal application. The system ensures indicators are displayed in a standardized order based on their appearance in official government source files.

## Implementation Details

### 1. Core Utility Functions
**File**: `src/lib/utils/indicator-sort-order.ts`

The utility provides two main functions:
- `sortIndicatorsBySourceOrder(indicators: any[])`: Sorts indicator arrays according to source file order
- `getIndicatorNumber(indicator: any): number`: Returns the official number for an indicator

The numbering system is based on the following source files:
- **SC-HWC**: 22 indicators (1-24)
- **PHC**: 21 indicators (1-21) 
- **UPHC**: 9 indicators (1-19)
- **U-HWC**: 10 indicators (1-20)
- **A-HWC**: 23 indicators (1-24)

### 2. API Integration
The sorting utility is integrated into the following API endpoints:

#### Facility Reports API
**File**: `src/app/api/facility/reports/[month]/route.ts`
- Line 293: Uses `sortIndicatorsBySourceOrder()` to sort performance indicators
- Ensures consistent ordering in facility reports

#### Facility Indicators API  
**File**: `src/app/api/facility/indicators/route.ts`
- Lines 156-157: Sorts both calculated and applicable indicators
- Maintains order consistency for facility indicator lists

#### Enhanced Indicators API
**File**: `src/app/api/indicators/enhanced/route.ts`
- Line 49: Sorts enhanced indicators by source order
- Used by admin interfaces for enhanced indicator management

### 3. UI Components Updated

#### Facility Reports Page
**File**: `src/app/facility/reports/page.tsx`
- Added indicator numbering column with visual number badges
- Displays indicator code alongside names for clarity
- Added explanatory text about numbering system
- Visual indicators show official source file ordering

#### Enhanced Indicators Component
**File**: `src/components/dashboard/enhanced-indicators.tsx`  
- Lines 105, 313, 362, 496: Uses sorting and numbering functions
- Grid and table views both display indicator numbers
- Shows numbering range statistics
- Explains the numbering system to users

#### Admin Indicators Page
**File**: `src/app/admin/indicators/page.tsx`
- Line 125: Sorts indicators on load
- Line 381: Displays indicator numbers in the listing
- Visual number badges for easy identification

### 4. Indicator Code Mappings

The system maps indicator codes to their official numbers:

```typescript
// Examples from the mapping:
['TF001_SC', 1],     // Total Footfall - SC-HWC
['WS001', 2],        // Total Wellness sessions  
['TC001', 3],        // Teleconsultation
['AF001_PHC', 4],    // Total ANC footfall - PHC
['HT001', 5],        // Pregnant women tested for Hb
['TS001_UPHC', 6],   // TB screening - UPHC
// ... and so on through all 24 indicators
```

### 5. Visual Design Elements

#### Number Badges
Consistent styling across all components:
```css
w-8 h-8 text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200
```

#### Table Headers
Added dedicated numbering columns with "#" headers for clear identification.

#### Explanatory Text
User-friendly descriptions explain the numbering system's purpose and consistency with government documentation.

### 6. Benefits

1. **Consistency**: All indicator lists now follow the same standardized order
2. **Government Alignment**: Matches official source file ordering
3. **User Experience**: Clear numbering helps users navigate and reference indicators
4. **Maintenance**: Centralized utility makes updates easy
5. **Documentation**: Visual cues help users understand the system

### 7. Affected Pages

- **Facility Reports** (`/facility/reports`): Main performance reporting with numbered indicators
- **Enhanced Indicators** (`/dashboard`): Grid and table views with numbering
- **Admin Indicators** (`/admin/indicators`): Management interface with consistent ordering
- **API Endpoints**: All indicator-returning APIs now use consistent sorting

### 8. Future Considerations

- The mapping can be easily extended for new indicators
- The visual design is consistent and can be themed
- The system is flexible for different facility types
- API responses maintain backward compatibility

This implementation ensures a professional, consistent user experience while maintaining alignment with official government documentation standards.
