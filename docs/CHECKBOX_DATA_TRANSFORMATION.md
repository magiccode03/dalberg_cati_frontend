# Checkbox Data Transformation for CATI Form Submission

## Overview
The CATI form now transforms checkbox field data before submission to match the backend's expected format. Instead of sending checkbox values as arrays, each selected option is sent as an individual field with a value of `1` (selected) or `null` (not selected).

## Problem
Previously, checkbox fields like `q10` and `q11` were being sent as arrays:
```json
{
  "q10": ["99"],
  "q11": ["1", "3"]
}
```

But the backend expects individual fields for each option:
```json
{
  "q10_99": 1,
  "q11_1": 1,
  "q11_3": 1
}
```

## Solution

### Data Transformation Function
A new function `transformFormDataForSubmission()` was added to both form pages:

```typescript
const transformFormDataForSubmission = (data: Record<string, any>) => {
  const transformed: Record<string, any> = {};
  
  currentFormConfig.forEach((field) => {
    const fieldValue = data[field.tag];
    
    if (field.type === 'checkbox' && Array.isArray(fieldValue)) {
      // For checkbox fields, create individual fields for each option
      field.options?.forEach((option) => {
        const fieldName = `${field.tag}_${option.value}`;
        transformed[fieldName] = fieldValue.includes(option.value) ? 1 : null;
      });
    } else if (field.type !== 'checkbox') {
      // For non-checkbox fields, keep as is
      transformed[field.tag] = fieldValue || null;
    }
  });
  
  return transformed;
};
```

### Integration Points

#### 1. Form Submission (`saveFormData`)
```typescript
// Transform form data to match backend expectations
const transformedData = transformFormDataForSubmission(formData);

const submissionData = {
  ...transformedData,
  status: status,
  form_duration_seconds: timer,
  final_submit: finalSubmit,
  language_used: language,
  user_timezone: timezone,
  user_localdatetime: currentTime,
};
```

#### 2. Auto-Save (`autoSaveForm`)
```typescript
// Transform form data to match backend expectations
const transformedData = transformFormDataForSubmission(formData);

await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ...transformedData,
    status: 4, // Draft status
    form_duration_seconds: timer,
    language_used: language,
  })
});
```

## Example Transformations

### Example 1: Single Selection (q10 with maxSelections: 1)
**Form Data:**
```json
{
  "q10": ["99"]
}
```

**Transformed Data:**
```json
{
  "q10_1": null,
  "q10_2": null,
  "q10_3": null,
  "q10_4": null,
  "q10_5": null,
  "q10_44": null,
  "q10_99": 1
}
```

### Example 2: Multiple Selections (q11 with maxSelections: 3)
**Form Data:**
```json
{
  "q11": ["1", "3", "14"]
}
```

**Transformed Data:**
```json
{
  "q11_1": 1,
  "q11_2": null,
  "q11_3": 1,
  "q11_4": null,
  "q11_5": null,
  "q11_6": null,
  "q11_7": null,
  "q11_8": null,
  "q11_9": null,
  "q11_11": null,
  "q11_13": null,
  "q11_14": 1,
  "q11_15": null,
  "q11_44": null,
  "q11_99": null
}
```

### Example 3: Multiple Selections (q13)
**Form Data:**
```json
{
  "q13": ["2", "3", "12"]
}
```

**Transformed Data:**
```json
{
  "q13_1": null,
  "q13_2": 1,
  "q13_3": 1,
  "q13_4": null,
  "q13_5": null,
  "q13_6": null,
  "q13_7": null,
  "q13_8": null,
  "q13_9": null,
  "q13_10": null,
  "q13_11": null,
  "q13_12": 1,
  "q13_13": null,
  "q13_44": null
}
```

## Database Schema Alignment

This transformation aligns with the database schema where each checkbox option has its own column:

| Question | Options | Database Columns |
|----------|---------|------------------|
| q10 | 1, 2, 3, 4, 5, 44, 99 | q10_1, q10_2, q10_3, q10_4, q10_5, q10_44, q10_99 |
| q11 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15, 44, 99 | q11_1, q11_2, ..., q11_99 |
| q12 | 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 14, 44, 99 | q12_1, q12_2, ..., q12_99 |
| q13 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 44 | q13_1, q13_2, ..., q13_44 |

## Impact on Existing Features

- ✅ **Form Validation**: Works correctly with both single values and arrays
- ✅ **Auto-Save**: Automatically transforms data before saving drafts
- ✅ **Full Submit**: Transforms data before final submission
- ✅ **Partial Submit (Call Dropped)**: Transforms data before partial submission
- ✅ **Field Visibility**: No impact on conditional logic
- ✅ **Field Clearing**: No impact on dependent field clearing

## Files Modified

1. `project-frontend/src/app/cati/ss/tele-form/[id]/page.tsx`
2. `project-frontend/src/app/cati/ss/tele-form-v2/[id]/page.tsx`

## Testing Recommendations

1. Test checkbox field submission with single selection (q10)
2. Test checkbox field submission with multiple selections (q11, q12, q13)
3. Verify auto-save correctly transforms checkbox data
4. Verify partial submit (call dropped) correctly transforms checkbox data
5. Verify full submit correctly transforms checkbox data
6. Check that non-checkbox fields are unaffected by the transformation

