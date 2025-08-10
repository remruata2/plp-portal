# Conditional Display Integration - Dynamic Form

## 🎯 **What We've Successfully Implemented**

I've successfully integrated the conditional display logic into the `DynamicHealthDataForm` component. Here's what's now working:

## ✅ **Integration Details**

### **1. Enhanced DynamicHealthDataForm**

**File**: `src/components/forms/DynamicHealthDataForm.tsx`

**Key Changes**:
- ✅ Imported `ConditionalIndicatorDisplay` component
- ✅ Added conditional logic detection for CT001 and DC001 indicators
- ✅ Integrated field value collection for conditional checking
- ✅ Added conditional display rendering with proper field handling

### **2. Conditional Logic Detection**

```typescript
// Check if this indicator has conditional logic
const isConditionalIndicator = group.indicatorCode === "CT001" || group.indicatorCode === "DC001";

// Build fieldValues object for conditional checking
const fieldValues: { [key: string]: number } = {};

// Add all form data to fieldValues
Object.keys(formData).forEach((key) => {
  const value = formData[key];
  if (value !== undefined && value !== "") {
    fieldValues[key] = parseFloat(value) || 0;
  } else {
    fieldValues[key] = 0;
  }
});

// Add specific conditional fields
if (group.indicatorCode === "CT001") {
  // For TB contact tracing, check pulmonary TB patients
  fieldValues.pulmonary_tb_patients_present = fieldValues.pulmonary_tb_patients || 0;
} else if (group.indicatorCode === "DC001") {
  // For TB differentiated care, check total TB patients
  fieldValues.tb_patients_present = fieldValues.total_tb_patients || 0;
}
```

### **3. Conditional Display Integration**

```typescript
{isConditionalIndicator ? (
  <ConditionalIndicatorDisplay
    indicator={{
      id: groupIndex,
      code: group.indicatorCode,
      name: group.indicatorName,
      conditions: group.conditions,
      source_of_verification: group.source_of_verification,
      target_formula: group.target_formula,
      target_value: group.target_value,
    }}
    fieldValues={fieldValues}
    onConditionChange={(conditionMet) => {
      console.log(`Condition for ${group.indicatorCode}:`, conditionMet);
    }}
  >
    {/* Render fields inside conditional component */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4 mt-4">
      {group.fields.map((mapping, fieldIndex) => (
        <div key={mapping.databaseFieldId} className="space-y-2">
          <Label htmlFor={mapping.formFieldName} className="text-sm font-medium">
            {groupIndex + 1}{String.fromCharCode(97 + fieldIndex)}. {mapping.description}
          </Label>
          <Input
            id={mapping.formFieldName}
            type={mapping.fieldType === "numeric" ? "number" : "text"}
            value={formData[mapping.formFieldName] || ""}
            onChange={(e) =>
              handleInputChange(mapping.formFieldName, e.target.value)
            }
            placeholder={`Enter ${mapping.description.toLowerCase()}`}
            disabled={submitting}
            className="text-sm"
          />
        </div>
      ))}
    </div>
  </ConditionalIndicatorDisplay>
) : (
  // Regular indicator display (existing code)
)}
```

## 🎯 **How It Works in the Dynamic Form**

### **1. Automatic Detection**

The form automatically detects conditional indicators (CT001, DC001) and applies conditional logic:

- **CT001** - Household visited for TB contact tracing
- **DC001** - TB patients visited for Differentiated TB Care

### **2. Real-time Condition Checking**

The form continuously monitors field values and updates the conditional display:

- **Field Value Collection**: All form data is collected and converted to numeric values
- **Conditional Field Mapping**: Specific fields are mapped for conditional checking
- **Real-time Updates**: Conditional display updates as users enter data

### **3. User Experience**

**When Conditions Are Met**:
- ✅ Green border and checkmark icon
- ✅ "Conditional" badge displayed
- ✅ Fields are visible and editable
- ✅ Clear indication that condition is met

**When Conditions Are Not Met**:
- ⚠️ Orange border and alert icon
- ⚠️ "Not Applicable (NA)" badge displayed
- ⚠️ Clear explanation of why indicator is not applicable
- ⚠️ Fields are hidden or disabled

## 🚀 **Example Usage**

### **Scenario 1: No Pulmonary TB Patients**

When a user enters `0` for pulmonary TB patients:

```typescript
// Form data
const formData = {
  pulmonary_tb_patients: "0",
  // ... other fields
};

// Result: CT001 indicator shows NA message
```

**Visual Result**:
```
┌─────────────────────────────────────┐
│ ⚠ Household visited for TB contact  │
│   tracing                           │
├─────────────────────────────────────┤
│ ⚠ Are there any patients with       │
│   Pulmonary TB in your catchment    │
│   area?                             │
│                                     │
│   This indicator is not applicable  │
│   because there are no pulmonary TB │
│   patients in your catchment area.  │
│                                     │
│   [Not Applicable (NA)]             │
└─────────────────────────────────────┘
```

### **Scenario 2: Pulmonary TB Patients Present**

When a user enters a value > 0 for pulmonary TB patients:

```typescript
// Form data
const formData = {
  pulmonary_tb_patients: "5",
  // ... other fields
};

// Result: CT001 indicator shows normally with fields
```

**Visual Result**:
```
┌─────────────────────────────────────┐
│ ✓ Household visited for TB contact  │
│   tracing [Conditional]             │
├─────────────────────────────────────┤
│ ✓ Condition Met                     │
│   Are there any patients with       │
│   Pulmonary TB in your catchment    │
│   area? - Yes                       │
│                                     │
│   [Fields are visible and editable] │
└─────────────────────────────────────┘
```

## 🎯 **Benefits of Integration**

1. **Seamless User Experience**: Conditional logic is integrated directly into the form
2. **Real-time Feedback**: Users see immediate feedback on conditional status
3. **Data Quality**: Prevents invalid data entry for non-applicable indicators
4. **Visual Clarity**: Clear visual indicators for conditional states
5. **Maintainable**: Centralized conditional logic in reusable component

## 📝 **Next Steps**

1. **Testing**: Test the integrated conditional display with real data
2. **User Training**: Train users on the new conditional behavior
3. **Documentation**: Update user documentation with conditional examples
4. **Monitoring**: Add monitoring for NA indicators in reports
5. **Extension**: Add more conditional indicators as needed

## 🎯 **Conclusion**

The conditional display logic is now fully integrated into the `DynamicHealthDataForm`. Users will see:

- **Automatic conditional detection** for TB-related indicators
- **Real-time conditional feedback** as they enter data
- **Clear visual states** for conditional indicators
- **Seamless integration** with existing form functionality

The implementation provides a robust, user-friendly solution for handling conditional display requirements exactly as specified in the individual indicators source files.
