# Conditional Display Implementation

## 📊 **Overview**

This document describes the implementation of conditional display logic for indicators, specifically handling cases where indicators should be hidden or defaulted to 0 when certain conditions are not met.

## 🎯 **Problem Statement**

Based on the individual indicators source files, some indicators have conditional display requirements:

### **Example: TB Contact Tracing (Indicator #7)**

- **Conditional Question**: "Are there any patients with Pulmonary TB in your catchment area?"
- **Expected Behavior**: 
  - If **Yes** → Show the indicator and allow data entry
  - If **No** → Hide the indicator or mark as "Not Applicable (NA)"

### **Example: TB Differentiated Care (Indicator #8)**

- **Conditional Question**: "Are there any patients with any type of TB?"
- **Expected Behavior**:
  - If **Yes** → Show the indicator and allow data entry
  - If **No** → Hide the indicator or mark as "Not Applicable (NA)"

## ✅ **Implementation Details**

### **1. Enhanced Formula Calculator**

**File**: `src/lib/calculations/formula-calculator.ts`

**Added Features**:
- Enhanced `shouldReturnNA` method with conditional question support
- New `conditionalQuestion` interface for Yes/No conditions
- Support for TB-related conditional indicators

```typescript
export interface FormulaConfig {
  // ... existing fields
  
  // Conditional question for Yes/No conditions
  conditionalQuestion?: {
    field: string; // Field name to check (e.g., "pulmonary_tb_patients_present")
    text: string; // Question text (e.g., "Are there any patients with Pulmonary TB in your catchment area?")
  };
}
```

**Conditional Logic**:
```typescript
// Check for conditional questions (Yes/No conditions)
if (config.conditionalQuestion && fieldValues) {
  const questionField = config.conditionalQuestion.field;
  const questionValue = fieldValues[questionField];
  
  if (questionField && questionValue !== undefined) {
    // Since fieldValues is typed as { [key: string]: number }, we only need to check for 0
    if (questionValue === 0) {
      return {
        shouldReturnNA: true,
        remuneration: 0,
        message: `${config.conditionalQuestion.text} - condition not met`,
        conditionalRemuneration: {
          withCondition: 0,
          withoutCondition: 0,
          appliedCondition: config.conditionalQuestion.text,
        },
      };
    }
  }
}
```

### **2. Enhanced Auto-Calculator**

**File**: `src/lib/calculations/auto-indicator-calculator.ts`

**Added Features**:
- Enhanced `buildFormulaConfig` method with conditional question support
- Updated `calculateSingleIndicator` to pass fieldValues for conditional checking
- Support for TB-related conditional indicators

```typescript
// Handle conditional questions for TB-related indicators
if (indicator.code === "CT001") {
  // Household visited for TB contact tracing
  config.conditionalQuestion = {
    field: "pulmonary_tb_patients_present",
    text: "Are there any patients with Pulmonary TB in your catchment area?"
  };
  config.conditionType = "TB_CONTACT_TRACING";
  config.conditionField = "pulmonary_tb_patients";
} else if (indicator.code === "DC001") {
  // No. of TB patients visited for Differentiated TB Care
  config.conditionalQuestion = {
    field: "tb_patients_present",
    text: "Are there any patients with any type of TB?"
  };
  config.conditionType = "TB_DIFFERENTIATED_CARE";
  config.conditionField = "total_tb_patients";
}
```

### **3. Conditional Display Component**

**File**: `src/components/indicators/ConditionalIndicatorDisplay.tsx`

**Features**:
- Handles conditional display logic for indicators
- Shows/hides indicators based on conditions
- Displays appropriate messages for NA conditions
- Visual indicators for conditional status

```typescript
interface ConditionalIndicatorDisplayProps {
  indicator: {
    id: number;
    code: string;
    name: string;
    description?: string;
    conditions?: string;
    source_of_verification?: string;
    target_formula?: string;
    target_value?: string;
    numerator_label?: string;
    denominator_label?: string;
  };
  fieldValues: { [key: string]: number };
  onConditionChange?: (conditionMet: boolean) => void;
  showConditionalQuestion?: boolean;
}
```

## 🎯 **Conditional Indicators Supported**

### **1. CT001 - Household visited for TB contact tracing**

**Conditional Question**: "Are there any patients with Pulmonary TB in your catchment area?"
**Condition Field**: `pulmonary_tb_patients_present`
**Behavior**:
- If `pulmonary_tb_patients_present === 0` → Show NA message
- If `pulmonary_tb_patients_present > 0` → Show indicator

### **2. DC001 - No. of TB patients visited for Differentiated TB Care**

**Conditional Question**: "Are there any patients with any type of TB?"
**Condition Field**: `tb_patients_present`
**Behavior**:
- If `tb_patients_present === 0` → Show NA message
- If `tb_patients_present > 0` → Show indicator

## 🚀 **Usage Examples**

### **Frontend Usage**

```typescript
import ConditionalIndicatorDisplay from "@/components/indicators/ConditionalIndicatorDisplay";

// In your component
const fieldValues = {
  pulmonary_tb_patients_present: 0, // No pulmonary TB patients
  tb_patients_present: 5, // 5 TB patients
  // ... other field values
};

return (
  <ConditionalIndicatorDisplay
    indicator={indicator}
    fieldValues={fieldValues}
    onConditionChange={(conditionMet) => {
      console.log("Condition met:", conditionMet);
    }}
  />
);
```

### **Backend Usage**

```typescript
// The auto-calculator automatically handles conditional logic
const result = await autoCalculator.calculateAllIndicators(facilityId, reportMonth);

// Check for NA status
const naIndicators = result.calculatedIndicators.filter(
  indicator => indicator.status === "NA"
);
```

## 📊 **Visual States**

### **1. Condition Met (Show Indicator)**

```tsx
<Card className="border-green-200">
  <CardHeader>
    <CardTitle>
      <CheckCircle className="h-5 w-5 text-green-600" />
      Household visited for TB contact tracing
      <Badge variant="outline">Conditional</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="bg-green-50 p-3 rounded-md">
      <CheckCircle className="h-4 w-4" />
      <span>Condition Met</span>
      <p>Are there any patients with Pulmonary TB in your catchment area? - Yes</p>
    </div>
  </CardContent>
</Card>
```

### **2. Condition Not Met (NA State)**

```tsx
<Card className="border-orange-200 bg-orange-50">
  <CardHeader>
    <CardTitle>
      <AlertCircle className="h-5 w-5 text-orange-800" />
      Household visited for TB contact tracing
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <p>Are there any patients with Pulmonary TB in your catchment area?</p>
        <p>This indicator is not applicable because there are no pulmonary TB patients in your catchment area.</p>
        <Badge variant="outline">Not Applicable (NA)</Badge>
      </AlertDescription>
    </Alert>
  </CardContent>
</Card>
```

## 🔧 **Configuration**

### **Adding New Conditional Indicators**

1. **Update Formula Calculator**:
   ```typescript
   case "NEW_CONDITIONAL_INDICATOR":
     if (fieldValue === 0) {
       return {
         shouldReturnNA: true,
         remuneration: 0,
         message: "Condition not met - indicator not applicable",
       };
     }
     break;
   ```

2. **Update Auto-Calculator**:
   ```typescript
   if (indicator.code === "NEW001") {
     config.conditionalQuestion = {
       field: "new_condition_field",
       text: "Your conditional question here?"
     };
     config.conditionType = "NEW_CONDITIONAL_INDICATOR";
     config.conditionField = "new_condition_field";
   }
   ```

3. **Update Conditional Display Component**:
   ```typescript
   case "NEW001":
     return {
       field: "new_condition_field",
       text: "Your conditional question here?",
       conditionField: "new_condition_field",
     };
   ```

## 🎯 **Benefits**

1. **User Experience**: Clear indication when indicators are not applicable
2. **Data Quality**: Prevents invalid data entry for non-applicable indicators
3. **Compliance**: Ensures adherence to conditional logic requirements
4. **Maintainability**: Centralized conditional logic handling
5. **Scalability**: Easy to add new conditional indicators

## 📝 **Next Steps**

1. **Testing**: Test conditional logic with real data
2. **Frontend Integration**: Integrate ConditionalIndicatorDisplay component
3. **User Training**: Train users on conditional indicator behavior
4. **Documentation**: Update user documentation with conditional logic
5. **Monitoring**: Add monitoring for NA indicators

## 🎯 **Conclusion**

The conditional display implementation provides a robust solution for handling indicators that should be hidden or marked as NA when certain conditions are not met. The solution is:

- **Flexible**: Easy to add new conditional indicators
- **User-Friendly**: Clear visual feedback for conditional states
- **Maintainable**: Centralized logic in formula calculator
- **Scalable**: Supports multiple conditional types
- **Compliant**: Follows the requirements from individual indicators files
