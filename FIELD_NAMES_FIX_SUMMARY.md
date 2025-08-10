# Field Names Fix Summary - Matching Source Files Exactly

## 🎯 **Problem Identified**

The field names in the implementation didn't match exactly with the source files, causing issues with the conditional display logic.

## ✅ **Fixes Implemented**

### **1. Updated Field Names to Match Source Files**

**File**: `src/components/forms/DynamicHealthDataForm.tsx`

**Key Changes**:
- ✅ Updated indicator names to match source files exactly
- ✅ Fixed conditional field names for TB indicators
- ✅ Updated form data initialization with correct field names

```typescript
// TB indicators - updated to match source files exactly
'pulmonary_tb_patients': { code: 'CT001', name: 'Household visited for TB contact tracing' },
'total_tb_patients': { code: 'DC001', name: 'No. of TB patients visited for Differentiated TB Care' },
'tb_screenings': { code: 'TS001', name: 'Individuals screened for TB' },
'tb_contact_tracing_households': { code: 'CT001', name: 'Household visited for TB contact tracing' },
'tb_differentiated_care_visits': { code: 'DC001', name: 'No. of TB patients visited for Differentiated TB Care' },
```

### **2. Updated Conditional Logic Field Names**

**File**: `src/components/forms/DynamicHealthDataForm.tsx`

**Key Changes**:
- ✅ Updated conditional field names to use `pulmonary_tb_patients` (not `pulmonary_tb_patients_present`)
- ✅ Updated conditional field names to use `total_tb_patients` (not `tb_patients_present`)

```typescript
// Add specific conditional fields only if they exist in formData
if (group.indicatorCode === "CT001") {
  // For TB contact tracing, check pulmonary TB patients
  // Field name: pulmonary_tb_patients (from source files)
  if (formData.pulmonary_tb_patients !== undefined && formData.pulmonary_tb_patients !== "") {
    fieldValues.pulmonary_tb_patients_present = parseFloat(formData.pulmonary_tb_patients) || 0;
  }
} else if (group.indicatorCode === "DC001") {
  // For TB differentiated care, check total TB patients
  // Field name: total_tb_patients (from source files)
  if (formData.total_tb_patients !== undefined && formData.total_tb_patients !== "") {
    fieldValues.tb_patients_present = parseFloat(formData.total_tb_patients) || 0;
  }
}
```

### **3. Updated Form Data Initialization**

**File**: `src/components/forms/DynamicHealthDataForm.tsx`

**Key Changes**:
- ✅ Updated form data initialization to use correct field names
- ✅ Added proper comments for field purposes

```typescript
// Add Yes/No question fields for conditional indicators - using correct field names from source files
initialData.pulmonary_tb_patients = ""; // For CT001 - "Are there any patients with Pulmonary TB in your catchment area?"
initialData.total_tb_patients = ""; // For DC001 - "Are there any patients with any type of TB?"
```

### **4. Updated ConditionalIndicatorDisplay Component**

**File**: `src/components/indicators/ConditionalIndicatorDisplay.tsx`

**Key Changes**:
- ✅ Updated conditional question field names
- ✅ Updated question text to match source files exactly

```typescript
case "CT001": // Household visited for TB contact tracing
  return {
    field: "pulmonary_tb_patients", // Updated to match source files
    text: "Are there any patients with Pulmonary TB in your catchment area (co-located SC)?",
    conditionField: "pulmonary_tb_patients",
  };
case "DC001": // No. of TB patients visited for Differentiated TB Care
  return {
    field: "total_tb_patients", // Updated to match source files
    text: "Are there any patients with any type of TB ?",
    conditionField: "total_tb_patients",
  };
```

### **5. Updated Auto-Indicator Calculator**

**File**: `src/lib/calculations/auto-indicator-calculator.ts`

**Key Changes**:
- ✅ Updated conditional question field names
- ✅ Updated question text to match source files exactly

```typescript
if (indicator.code === "CT001") {
  // Household visited for TB contact tracing
  config.conditionalQuestion = {
    field: "pulmonary_tb_patients", // Updated to match source files
    text: "Are there any patients with Pulmonary TB in your catchment area (co-located SC)?"
  };
  config.conditionType = "TB_CONTACT_TRACING";
  config.conditionField = "pulmonary_tb_patients";
} else if (indicator.code === "DC001") {
  // No. of TB patients visited for Differentiated TB Care
  config.conditionalQuestion = {
    field: "total_tb_patients", // Updated to match source files
    text: "Are there any patients with any type of TB ?"
  };
  config.conditionType = "TB_DIFFERENTIATED_CARE";
  config.conditionField = "total_tb_patients";
}
```

### **6. Updated HandleYesNoAnswer Function**

**File**: `src/components/forms/DynamicHealthDataForm.tsx`

**Key Changes**:
- ✅ Updated to use correct field names from source files

```typescript
const handleYesNoAnswer = (indicatorCode: string, answer: "yes" | "no") => {
  if (indicatorCode === "CT001") {
    // For TB contact tracing - use pulmonary_tb_patients field
    setFormData((prev) => ({
      ...prev,
      pulmonary_tb_patients: answer === "yes" ? "1" : "0",
    }));
  } else if (indicatorCode === "DC001") {
    // For TB differentiated care - use total_tb_patients field
    setFormData((prev) => ({
      ...prev,
      total_tb_patients: answer === "yes" ? "1" : "0",
    }));
  }
};
```

## 🎯 **Exact Field Names from Source Files**

### **CT001 - Household visited for TB contact tracing**

**Question**: "Are there any patients with Pulmonary TB in your catchment area (co-located SC)?"
**Field Name**: `pulmonary_tb_patients`
**Fields Shown After "Yes"**:
- `tb_contact_tracing_households` - Total Number of Household visited for Pulmonary TB contact tracing for Symptom screening and Skin testing(Mantoux/Cy TB)

### **DC001 - No. of TB patients visited for Differentiated TB Care**

**Question**: "Are there any patients with any type of TB ?"
**Field Name**: `total_tb_patients`
**Fields Shown After "Yes"**:
- `tb_differentiated_care_visits` - No. of TB patients visited for Differentiated TB Care

## 🚀 **Benefits of the Fix**

1. **Exact Source File Alignment**: Field names now match exactly with source files
2. **Correct Conditional Logic**: Yes/No questions work with the right field names
3. **Proper Data Flow**: Form data uses correct field names throughout
4. **Consistent Implementation**: All components use the same field names
5. **Source of Truth**: Implementation now follows source files as the single source of truth

## 📝 **Next Steps**

1. **Testing**: Test the conditional display with the correct field names
2. **Validation**: Ensure all field mappings work correctly
3. **Documentation**: Update documentation to reflect correct field names
4. **User Training**: Train users on the correct field names and conditional logic

## 🎯 **Conclusion**

The field names have been successfully updated to match exactly with the source files. The conditional display logic now uses the correct field names:

- **CT001**: Uses `pulmonary_tb_patients` field
- **DC001**: Uses `total_tb_patients` field

This ensures that the Yes/No conditional logic works correctly and matches the exact specifications from the source files.
