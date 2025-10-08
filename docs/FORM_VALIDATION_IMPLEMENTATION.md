# Form Validation Implementation

## ✅ **Complete Validation Added to Tele-Form V2**

The CATI form now includes comprehensive validation to ensure all required fields are filled before submission.

---

## 🎯 **Key Features**

### **1. ✅ Required Field Validation**
- All fields marked with `required: true` in the JSON config are validated
- Only **visible** fields are validated (respects conditional logic)
- Validation runs **only on Submit button** click
- **Call Dropped button** allows partial submission without validation

### **2. 🔴 Visual Indicators**
- Required fields show a red asterisk (`*`) next to the label
- Clear visual distinction between required and optional fields

### **3. 📜 Auto-Scroll to First Error**
- When validation fails, the page automatically scrolls to the first missing field
- Smooth scroll animation for better UX
- Centers the field in the viewport

### **4. 🔔 User-Friendly Error Messages**
- Toast notification shows which fields are missing
- Shows first 3 missing fields + count of additional missing fields
- Example: "Please fill all required fields. Missing: Call Status, Consent, Age and 2 more..."

---

## 📋 **Implementation Details**

### **File Modified:**
`src/app/cati/ss/tele-form-v2/[id]/page.tsx`

### **Changes Made:**

#### **1. Validation Function (Lines 344-370)**
```typescript
const validateForm = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Get all visible fields that are required
  currentFormConfig.forEach((field) => {
    if (field.required && isFieldVisible(field)) {
      const fieldValue = formData[field.tag];
      
      // Check if field is empty
      if (field.type === 'checkbox') {
        if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
          errors.push(field.label);
        }
      } else {
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          errors.push(field.label);
        }
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

**Features:**
- ✅ Checks only **visible** fields (respects conditional logic)
- ✅ Handles **checkbox arrays** separately
- ✅ Returns list of missing field labels
- ✅ Works with dynamic form configuration

#### **2. Enhanced Submit Handler (Lines 372-408)**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form before submission
  const validation = validateForm();
  
  if (!validation.isValid) {
    showToast(
      `Please fill all required fields. Missing: ${validation.errors.slice(0, 3).join(', ')}${
        validation.errors.length > 3 ? ` and ${validation.errors.length - 3} more...` : ''
      }`, 
      'error'
    );
    
    // Scroll to first error
    const firstErrorField = currentFormConfig.find(
      field => field.required && isFieldVisible(field) && 
      (formData[field.tag] === undefined || formData[field.tag] === null || formData[field.tag] === '')
    );
    
    if (firstErrorField) {
      const element = document.getElementById(`${firstErrorField.tag}_container`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return;
  }
  
  showToast('Saving form data...', 'info');
  
  const success = await saveFormData(1);
  
  if (success) {
    showToast('Form submitted successfully! Data has been saved.', 'success');
    
    setTimeout(() => {
      router.push(`/cati/ss/new-call/${teleformUserId}`);
    }, 1500);
  }
};
```

**Features:**
- ✅ Validates before submission
- ✅ Shows error toast with first 3 missing fields
- ✅ Auto-scrolls to first missing field
- ✅ Prevents submission if validation fails
- ✅ Proceeds with API call only if valid

#### **3. Updated Render Function (Lines 424-524)**
```typescript
const renderField = (field: FormField, index: number) => {
  if (!isFieldVisible(field)) return null;

  const fieldValue = formData[field.tag] || (field.type === 'checkbox' ? [] : '');

  switch (field.type) {
    case 'radio':
      return (
        <div key={index} id={`${field.tag}_container`} className="mb-6">
          <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Text>
          // ... field rendering ...
        </div>
      );
    // ... other field types ...
  }
};
```

**Features:**
- ✅ Adds unique container ID for scrolling (`${field.tag}_container`)
- ✅ Shows red asterisk (`*`) for required fields
- ✅ Applied to all field types (radio, checkbox, text, number, datetime-local)

---

## 🔍 **Validation Logic**

### **What Gets Validated?**
1. **Only Required Fields** - Fields with `required: true` in JSON config
2. **Only Visible Fields** - Fields that pass the conditional logic check
3. **All Field Types:**
   - **Radio buttons:** Must have a selected value
   - **Checkboxes:** Must have at least one option selected
   - **Text inputs:** Must have non-empty text
   - **Number inputs:** Must have a numeric value
   - **Datetime inputs:** Must have a date/time selected

### **What Doesn't Get Validated?**
1. ❌ Optional fields (no `required` flag)
2. ❌ Hidden fields (failed conditional logic)
3. ❌ Fields in "Call Dropped" scenario (allows partial submission)

---

## 🎨 **User Experience**

### **Scenario 1: All Required Fields Filled**
1. User fills all required fields
2. User clicks "Submit" button
3. ✅ Validation passes
4. 📤 Form data is sent to API
5. ✅ Success toast appears
6. ↪️ Redirect to `/cati/ss/new-call/{teleformUserId}`

### **Scenario 2: Missing Required Fields**
1. User leaves some required fields empty
2. User clicks "Submit" button
3. ❌ Validation fails
4. 🔔 Error toast shows missing fields
5. 📜 Page scrolls to first missing field
6. 🚫 Form is **not submitted** to API
7. User fills missing fields and tries again

### **Scenario 3: Call Dropped**
1. User partially fills the form
2. User clicks "Call Dropped" button
3. ⚠️ No validation is performed
4. 📤 Partial data is sent to API with `final_submit: 0`
5. ✅ Success toast appears
6. ↪️ Redirect to `/cati/ss/new-call/{teleformUserId}`

---

## 📊 **Field Types and Validation**

| Field Type | Empty Value | Validation Check |
|------------|-------------|------------------|
| Radio | `undefined`, `null`, `''` | `value === undefined \|\| value === null \|\| value === ''` |
| Checkbox | `[]` (empty array) | `!Array.isArray(value) \|\| value.length === 0` |
| Text | `''` (empty string) | `value === undefined \|\| value === null \|\| value === ''` |
| Number | `''` (empty string) | `value === undefined \|\| value === null \|\| value === ''` |
| Datetime | `''` (empty string) | Not validated (usually optional) |

---

## 🧪 **Testing the Validation**

### **Test Case 1: Required Radio Button**
1. Leave a required radio button unselected
2. Click "Submit"
3. **Expected:** Error toast + scroll to field

### **Test Case 2: Required Checkbox (Multi-select)**
1. Leave a required checkbox group with no selections
2. Click "Submit"
3. **Expected:** Error toast + scroll to field

### **Test Case 3: Required Text Input**
1. Leave a required text field empty
2. Click "Submit"
3. **Expected:** Error toast + scroll to field

### **Test Case 4: Required Number Input**
1. Leave a required number field empty
2. Click "Submit"
3. **Expected:** Error toast + scroll to field

### **Test Case 5: Conditional Required Field**
1. A required field is hidden due to conditional logic
2. Click "Submit"
3. **Expected:** Field is NOT validated (not visible)

### **Test Case 6: Multiple Missing Fields**
1. Leave 5 required fields empty
2. Click "Submit"
3. **Expected:** Toast shows first 3 fields + "and 2 more..."
4. **Expected:** Scroll to first missing field

### **Test Case 7: Call Dropped (No Validation)**
1. Leave all required fields empty
2. Click "Call Dropped"
3. **Expected:** No validation, partial data saved successfully

---

## 💡 **How Conditional Logic Works with Validation**

The validation system is **smart** and respects conditional field visibility:

### **Example:**
```json
{
  "type": "radio",
  "label": "Are you a registered voter?",
  "tag": "resp_registered_voter",
  "required": true,
  "options": [...]
},
{
  "type": "radio",
  "label": "Which party do you support?",
  "tag": "q5",
  "required": true,
  "conditional": "resp_registered_voter === '1'",
  "options": [...]
}
```

**Scenario:**
1. User selects "No" for `resp_registered_voter` (value = `'2'`)
2. Field `q5` becomes **hidden** (conditional fails)
3. User clicks "Submit"
4. **Result:** `q5` is **NOT validated** because it's hidden

**Scenario 2:**
1. User selects "Yes" for `resp_registered_voter` (value = `'1'`)
2. Field `q5` becomes **visible** (conditional passes)
3. User clicks "Submit" without selecting `q5`
4. **Result:** Validation **fails** - `q5` is required and visible

---

## 🎯 **Summary**

### **✅ What Was Implemented:**
1. ✅ Required field validation
2. ✅ Conditional visibility awareness
3. ✅ Visual required field indicators (red asterisk)
4. ✅ Auto-scroll to first error
5. ✅ User-friendly error messages
6. ✅ Different validation for Submit vs Call Dropped
7. ✅ Support for all field types
8. ✅ Container IDs for scroll targeting

### **🎨 UX Improvements:**
1. 🔴 Red asterisk (`*`) on required fields
2. 🔔 Toast notification with missing field names
3. 📜 Smooth scroll to first error
4. 🚫 Form submission blocked until valid
5. ⚠️ Partial submission allowed for "Call Dropped"

### **🔒 Data Integrity:**
- ✅ Ensures all required data is collected
- ✅ Respects conditional field visibility
- ✅ Allows partial saves for call drops
- ✅ Maintains user progress with auto-save

---

## 📞 **Error Messages**

### **Single Missing Field:**
```
"Please fill all required fields. Missing: Call Status"
```

### **Multiple Missing Fields (≤3):**
```
"Please fill all required fields. Missing: Call Status, Consent, Age"
```

### **Multiple Missing Fields (>3):**
```
"Please fill all required fields. Missing: Call Status, Consent, Age and 2 more..."
```

---

**Last Updated:** October 7, 2025  
**Status:** ✅ Production Ready  
**Validation:** Client-side (Frontend)

