# Comprehensive Form Validation System

## 🎯 Overview

The PLP Portal now includes a comprehensive validation system for dynamic health data forms that ensures data quality and accuracy across all facility types. This system includes real-time validation, facility-specific rules, and special handling for team-based facilities.

## 🏥 Facility Type Support

### Worker-Required Facilities
- **PHC**: Requires Medical Officer (mandatory) + Colocated SC HW + ASHA
- **SC_HWC**: Requires Health & Wellness Officer (mandatory) + HW + ASHA  
- **A_HWC**: Requires AYUSH Medical Officer (mandatory) + HW + ASHA

### Team-Based Facilities (No Individual Workers)
- **UPHC**: Urban Primary Health Centre - Team-based incentives only
- **U_HWC**: Urban Health & Wellness Centre - Team-based incentives only

## 🔍 Validation Features

### 1. Real-Time Field Validation
- ✅ Validates fields as users type (300ms debounce)
- ✅ Shows validation errors immediately
- ✅ Provides helpful hints and range information
- ✅ Visual indicators (red borders for errors)

### 2. Comprehensive Error Types
- **Required Field Errors**: Missing mandatory data
- **Range Errors**: Values outside acceptable limits
- **Logic Errors**: Cross-field validation issues
- **Worker Errors**: Incorrect worker selection
- **Invalid Value Errors**: Wrong data types or formats

### 3. Smart Warnings System
- ⚠️ Suspicious values (e.g., zero footfall)
- ⚠️ Unusual patterns (e.g., very high/low percentages)
- ⚠️ Data quality concerns
- ⚠️ Missing expected services

### 4. Facility-Specific Rules

#### PHC Validation Rules
```typescript
total_footfall_phc_colocated_sc: {
  required: true,
  minValue: 50,
  maxValue: 1000,
  customValidator: // Population-based validation
}
anc_footfall: {
  required: true,
  customValidator: // Cannot exceed ANC due list
}
ncd_diagnosed_tx_completed: {
  customValidator: // Cannot exceed referrals
}
```

#### SC_HWC Validation Rules
```typescript
elderly_support_group_formed: {
  required: true,
  customValidator: // Must have activities if group formed
}
total_footfall_sc_clinic: {
  minValue: 30,
  maxValue: 500
}
```

#### U_HWC/UPHC Special Rules
```typescript
// No individual workers allowed
requiresWorkers: false,
minimumWorkers: 0,
maximumWorkers: 0
```

### 5. Cross-Field Validation
- 📊 Population data consistency
- 🔍 TB screenings vs total footfall
- 🏥 Service delivery logic
- 👥 ANC footfall vs due list
- 💊 Treatment completion vs referrals

## 🛠️ Implementation

### File Structure
```
src/lib/validations/
├── facility-form-validation.ts    # Core validation logic
src/components/forms/
├── DynamicHealthDataForm.tsx      # Enhanced with validation
├── WorkerSelectionForm.tsx        # Worker validation
```

### Key Components

#### 1. Validation Engine
```typescript
// Real-time field validation
validateField(fieldName, value, formData, facilityType, fieldMapping)

// Complete form validation
validateForm(formData, fieldMappings, facilityType, workers)

// Worker selection validation
validateWorkerSelection(selectedWorkers, facilityType, available)
```

#### 2. Validation Rules
```typescript
FACILITY_VALIDATION_RULES: {
  COMMON: { /* Rules for all facilities */ },
  PHC: { /* PHC-specific rules */ },
  SC_HWC: { /* SC_HWC-specific rules */ },
  U_HWC: { /* U_HWC-specific rules */ },
  UPHC: { /* UPHC-specific rules */ },
  A_HWC: { /* A_HWC-specific rules */ }
}
```

#### 3. Worker Validation Rules
```typescript
WORKER_VALIDATION_RULES: {
  PHC: {
    requiresWorkers: true,
    mandatoryWorkerTypes: ['mo'],
    allowedWorkerTypes: ['mo', 'colocated_sc_hw', 'asha']
  },
  UPHC: {
    requiresWorkers: false, // Team-based facility
    minimumWorkers: 0,
    maximumWorkers: 0
  }
}
```

## 🎨 User Experience

### Visual Indicators
- 🔴 **Red borders**: Fields with validation errors
- ⚠️ **Yellow indicators**: Warnings and suspicious values
- 💡 **Gray hints**: Validation requirements and ranges
- ✅ **Green success**: Valid data with no issues

### Error Messaging
- **Field-level errors**: Shown immediately below each field
- **Worker selection errors**: Highlighted in worker section
- **Validation summary**: Complete overview before submission
- **Toast notifications**: Success/error feedback on submission

### Progressive Enhancement
- **Basic validation**: Always works even if JavaScript fails
- **Real-time feedback**: Enhanced experience with live validation
- **Smart suggestions**: Contextual help and recommendations
- **Accessibility**: Screen reader friendly error messages

## 📊 Validation Examples

### 1. Population Data Validation
```typescript
// Total population must be realistic
total_population: {
  minValue: 1000,
  maxValue: 50000,
  customValidator: (value) => {
    if (value < 2000) return warning("Population seems low")
  }
}

// 30+ population cannot exceed 80% of total
population_30_plus: {
  customValidator: (value, formData) => {
    const total = formData.total_population;
    if (value > total * 0.8) return error("30+ too high")
  }
}
```

### 2. Service Delivery Validation
```typescript
// Patient satisfaction score validation
patient_satisfaction_score: {
  minValue: 1,
  maxValue: 5,
  customValidator: (value) => {
    if (value < 3) return warning("Score needs improvement")
  }
}

// TB screening validation
tb_screenings: {
  customValidator: (value, formData) => {
    const footfall = formData.total_footfall;
    if (value > footfall) return error("Cannot exceed footfall")
  }
}
```

### 3. Worker Selection Validation
```typescript
// PHC must have Medical Officer
if (facilityType === 'PHC') {
  const hasMO = selectedWorkers.some(w => w.worker_type === 'mo');
  if (!hasMO) return error("PHC must include Medical Officer");
}

// UPHC/U_HWC cannot have individual workers
if (['UPHC', 'U_HWC'].includes(facilityType)) {
  if (selectedWorkers.length > 0) {
    return error("Team-based facility - no individual workers");
  }
}
```

## 🔧 Configuration

### Adding New Validation Rules
1. **Define rules** in `FACILITY_VALIDATION_RULES`
2. **Add custom validators** for complex logic
3. **Update worker rules** if needed
4. **Test across facility types**

### Customizing Messages
```typescript
// Field-specific validation messages
getFieldValidationMessage(fieldName, facilityType)

// Custom error messages
{
  field: 'fieldName',
  message: 'Custom validation message',
  type: 'error_type'
}
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Test all facility types (PHC, SC_HWC, A_HWC, UPHC, U_HWC)
- [ ] Verify worker selection validation
- [ ] Test real-time validation feedback
- [ ] Check cross-field validation logic
- [ ] Validate error message clarity
- [ ] Test form submission blocking
- [ ] Verify warning system functionality

### Edge Cases to Test
- Empty forms
- Maximum/minimum values
- Invalid data types
- Missing mandatory workers
- Team-based facility worker selection
- Cross-field dependencies
- Population data relationships

## 🚀 Future Enhancements

### Planned Features
- [ ] Server-side validation matching
- [ ] Validation rule versioning
- [ ] Custom validation rule builder
- [ ] Advanced data quality scoring
- [ ] Machine learning anomaly detection
- [ ] Historical data comparison warnings

### Performance Optimizations
- [ ] Validation rule caching
- [ ] Debounced validation improvements
- [ ] Async validation for complex rules
- [ ] Progressive validation loading

## 📋 Validation Summary

The comprehensive form validation system ensures:

✅ **Data Quality**: Rigorous validation prevents invalid data entry  
✅ **User Experience**: Real-time feedback guides users to correct data  
✅ **Facility Compliance**: Type-specific rules ensure proper data collection  
✅ **Worker Management**: Validates worker selection per facility requirements  
✅ **Team-Based Support**: Special handling for UPHC and U_HWC facilities  
✅ **Error Prevention**: Blocks submission until all issues are resolved  
✅ **Smart Warnings**: Identifies suspicious data for review  
✅ **Accessibility**: Screen reader compatible error messages  

This validation system significantly improves data quality and user experience across all facility types in the PLP Portal.
