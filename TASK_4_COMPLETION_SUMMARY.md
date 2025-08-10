# Task 4: Extend API Layer with Conditional Logic - COMPLETED ✅

## Task Requirements
**Step 4: Extend API layer with conditional logic**

Update DTO/serializer to:  
• Always expose Field 20.  
• Only accept/return Field 21 when Field 20 = true.  
Add server-side validation to reject non-null Field 21 if Field 20 = false.

## Implementation Summary

### ✅ **Always expose Field 20**
**Implementation**: `FieldValueSerializer.serializeFieldResponse()` method always returns Field 20 (elderly_support_group_formed) regardless of its value or any other conditions.

**Code Location**: `src/lib/dto/field-value.dto.ts` lines 54-68
```typescript
// Always expose Field 20
if (isField20) {
  return {
    field_id: fieldMapping.field.id,
    field_code: fieldMapping.field.code,
    field_name: fieldMapping.field.name,
    // ... always returned
  };
}
```

### ✅ **Only accept/return Field 21 when Field 20 = true**

**Accept (Input Validation)**: `FieldValueSerializer.validateFieldValueInput()` method rejects Field 21 input when Field 20 = false with `CONDITIONAL_LOGIC_ERROR`.

**Return (Output Serialization)**: `FieldValueSerializer.serializeFieldResponse()` method:
- Returns Field 21 with `current_value = null` and `is_conditionally_hidden = true` when Field 20 = false
- Returns Field 21 normally when Field 20 = true

**Code Locations**: 
- Validation: `src/lib/dto/field-value.dto.ts` lines 137-155
- Serialization: `src/lib/dto/field-value.dto.ts` lines 70-101

### ✅ **Server-side validation to reject non-null Field 21 if Field 20 = false**

**Implementation**: Comprehensive server-side validation in the API route using the DTO serializer:

1. **Validation Layer**: `validateFieldValueInput()` checks conditional logic
2. **Storage Layer**: `prepareFieldValueForStorage()` forces null storage when Field 20 = false
3. **API Integration**: Updated POST endpoint returns detailed validation errors

**Code Locations**:
- API Route: `src/app/api/facility/field-values/route.ts` lines 95-110
- DTO Validation: `src/lib/dto/field-value.dto.ts` lines 137-155

## Technical Implementation

### Files Created/Modified

1. **Created**: `src/lib/dto/field-value.dto.ts`
   - Complete DTO/serializer implementation
   - Field 20/21 conditional logic
   - Comprehensive validation rules

2. **Modified**: `src/app/api/facility/field-values/route.ts`
   - Enhanced POST method with DTO validation
   - Enhanced GET method with conditional serialization
   - Detailed error responses

3. **Created**: `FIELD_20_21_DTO_IMPLEMENTATION.md`
   - Complete documentation
   - Usage examples
   - API specifications

### Key Features Implemented

#### 1. DTO Architecture
- `FieldValueInputDTO`: Standardized input structure
- `FieldValueResponseDTO`: Enhanced response with conditional metadata
- `FieldValidationError`: Structured error handling

#### 2. Conditional Logic Engine
- **Field Value Map**: Cross-field validation support
- **Conditional Serialization**: Field 21 visibility based on Field 20
- **Smart Storage**: Automatic null storage when conditions not met

#### 3. Enhanced Validation
- **Type Validation**: BINARY, MONTHLY_COUNT, etc.
- **Conditional Validation**: Field 21 depends on Field 20
- **Error Classification**: VALIDATION_ERROR, CONDITIONAL_LOGIC_ERROR

#### 4. API Response Enhancement
```json
{
  "applicable_fields": [
    {
      "field_code": "elderly_support_group_formed",
      "is_conditionally_hidden": false // Always false (always exposed)
    },
    {
      "field_code": "elderly_support_group_activity",
      "current_value": null,
      "is_conditionally_hidden": true, // When Field 20 = false
      "conditional_reason": "Field not available when Elderly Support Group is not formed"
    }
  ],
  "field_20_21_info": {
    "field_20_always_exposed": true,
    "field_21_conditional": "Only exposed when Field 20 = true"
  }
}
```

## Validation Test Results ✅

All test scenarios passed:
- ✅ Field 20 is always exposed
- ✅ Field 21 is hidden when Field 20 = false  
- ✅ Field 21 is visible when Field 20 = true
- ✅ Server validation rejects Field 21 value when Field 20 = false
- ✅ Server validation allows Field 21 value when Field 20 = true
- ✅ Field 21 is stored as null when Field 20 = false
- ✅ Field 21 stores actual value when Field 20 = true
- ✅ Field 20 accepts valid binary values
- ✅ Field 20 rejects invalid binary values

## Business Logic Summary

| Condition | Field 20 Behavior | Field 21 Behavior |
|-----------|------------------|-------------------|
| Field 20 = false | Always exposed, stored as provided | Hidden in response, stored as null |
| Field 20 = true | Always exposed, stored as provided | Exposed normally, stored as provided |
| Invalid input | Validation error returned | Conditional validation applied |

## Error Handling

### Validation Error Response
```json
{
  "error": "Field validation failed",
  "validation_errors": [
    {
      "field_code": "elderly_support_group_activity",
      "error_message": "If Yes, any activity conducted during the month cannot have a value when Elderly Support Group is not formed",
      "error_type": "CONDITIONAL_LOGIC_ERROR"
    }
  ]
}
```

## Compliance Verification

| Requirement | Status | Implementation |
|------------|---------|----------------|
| Always expose Field 20 | ✅ COMPLETE | `serializeFieldResponse()` - Field 20 always returned |
| Only accept/return Field 21 when Field 20 = true | ✅ COMPLETE | Conditional validation + serialization |
| Server-side validation to reject non-null Field 21 if Field 20 = false | ✅ COMPLETE | `validateFieldValueInput()` + error responses |

## Task Completion Status: ✅ COMPLETE

The API layer has been successfully extended with comprehensive conditional logic for Field 20 and Field 21, implementing all required features:

1. **DTO/Serializer Layer**: Complete implementation with conditional logic
2. **Server-Side Validation**: Comprehensive validation with detailed error handling  
3. **API Enhancement**: Both GET and POST endpoints updated with conditional behavior
4. **Documentation**: Complete documentation and usage examples provided

The implementation ensures Field 20 is always exposed while Field 21 is only accepted and returned when Field 20 = true, with robust server-side validation rejecting invalid Field 21 values according to the business rules.
