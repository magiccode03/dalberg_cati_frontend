# Tele-Form Page Documentation
## West Bengal Opinion Poll 2025 - CATI Survey System

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Dynamic Form System](#dynamic-form-system)
5. [Conditional Logic Engine](#conditional-logic-engine)
6. [Multi-Language Support](#multi-language-support)
7. [Data Management](#data-management)
8. [Validation System](#validation-system)
9. [Auto-Save Functionality](#auto-save-functionality)
10. [Form Sections](#form-sections)
11. [API Integration](#api-integration)
12. [Error Handling](#error-handling)
13. [Performance Optimizations](#performance-optimizations)
14. [Usage Examples](#usage-examples)
15. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Tele-Form page is a sophisticated **Computer-Assisted Telephone Interview (CATI)** system designed for the **West Bengal Opinion Poll 2025**. It provides a dynamic, multi-language survey form with complex conditional logic, real-time validation, and auto-save functionality.

### Key Features
- ✅ **Multi-language support** (English, Bengali, Hindi)
- ✅ **Dynamic form configuration** based on Assembly Constituency (AC)
- ✅ **Complex conditional logic** with expression evaluation
- ✅ **Real-time validation** with visual feedback
- ✅ **Auto-save functionality** with draft preservation
- ✅ **Responsive design** for all devices
- ✅ **Section-based organization** with progressive disclosure

---

## 🏗️ Architecture

### File Structure
```
src/app/cati/ss/tele-form/[id]/[ac_code]/page.tsx
├── Form Configurations
│   ├── form-en-config.json (English)
│   ├── form-bn-config.json (Bengali)
│   └── form-hi-config.json (Hindi)
├── Data Sources
│   ├── party_2021_q5.json (Party data)
│   ├── mla-mp-ac-data.json (MLA/MP data)
│   └── caste-options.json (Caste options)
└── UI Components
    ├── Container, Card, Heading
    ├── Input, Button, SelectDropdown
    ├── Radio, Checkbox, Text
    └── Toast system
```

### Component Hierarchy
```
TeleFormV2Page
├── Header (Timer + Language Selector)
├── Form Sections
│   ├── Call Status
│   ├── Consent
│   ├── Demographics
│   ├── Party Preferences
│   ├── Satisfaction
│   └── Final Demographics
├── Submit Buttons
└── Toast Container
```

---

## 🔧 Core Components

### 1. Type Definitions

```typescript
interface FormOption {
  label: string;
  value: string;
  tag: string;
}

interface FormField {
  type: string;
  label: string;
  tag: string;
  required?: boolean;
  conditional?: string;
  options?: FormOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  maxSelections?: number;
  rules?: {
    clearFields?: Record<string, string[]>;
    showFields?: Record<string, string[]>;
    exclusiveOptions?: string[];
    excludeOptions?: string;
  };
}
```

### 2. State Management

```typescript
// Core form state
const [language, setLanguage] = useState<string>('english');
const [timer, setTimer] = useState<number>(0);
const [formData, setFormData] = useState<Record<string, any>>({});
const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

// User session state
const [teleformUserName, setTeleformUserName] = useState<string>('');
const [teleformUserId, setTeleformUserId] = useState<string>('');
const [isSubmitting, setIsSubmitting] = useState(false);

// Toast notifications
const [toasts, setToasts] = useState<any[]>([]);
const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
```

---

## 🎨 Dynamic Form System

### 1. Multi-Language Configuration

```typescript
const formConfigs: Record<string, FormField[]> = {
  english: formEnConfig as FormField[],
  bengali: formBnConfig as FormField[],
  hindi: formHiConfig as FormField[],
};

// Get current form configuration based on language
const currentFormConfig = formConfigs[language] || formConfigs.english;
```

### 2. Dynamic Content Processing

#### A. Placeholder Replacement
```typescript
const replaceLabelPlaceholders = (label: string, acCode: string): string => {
  const mlaMpInfo = getMlaMpData(acCode);
  if (!mlaMpInfo) return label;
  
  return label
    .replace(/\{\{mp_name\}\}/g, `"${mlaMpInfo.mp_name}"`)
    .replace(/\{\{mla_name\}\}/g, `"${mlaMpInfo.mla_name}"`);
};
```

**Example:**
- Input: `"Who is your MP? {{mp_name}}"`
- Output: `"Who is your MP? "John Doe""`

#### B. AC-Specific Party Options
```typescript
const getPartyOptions = (acCode: string): FormOption[] => {
  const acCodeNum = parseInt(acCode);
  const acPartyData = partyData.ac_data[acCodeNum.toString()];
  
  if (!acPartyData) {
    return defaultPartyOptions; // Fallback options
  }
  
  return acPartyData.parties.map((party: any) => ({
    label: language === 'bengali' ? party.party_name_bangla : party.party_name_english,
    value: party.party_code.toString(),
    tag: `party_${party.party_code}`
  }));
};
```

#### C. Religion-Based Caste Options
```typescript
const getCasteOptions = (religionValue: string): FormOption[] => {
  if (!religionValue) return [];
  
  const religionData = casteOptions[religionValue];
  if (!religionData || !religionData.castes) return [];
  
  return religionData.castes.map((caste: any) => ({
    label: language === 'bengali' ? caste.caste_name_bangla : 
           language === 'hindi' ? caste.caste_name_hindi : 
           caste.caste_name_english,
    value: caste.caste_code.toString(),
    tag: `caste_${caste.caste_code}`
  }));
};
```

---

## 🧠 Conditional Logic Engine

### 1. Expression Evaluation System

```typescript
const evaluateCondition = (condition: string): boolean => {
  if (!condition) return true;
  
  try {
    let expr = condition;
    
    // Handle numeric comparisons (>=, <=, >, <)
    const numericPattern = /(\w+)\s*(>=|<=|>|<)\s*(\d+)/g;
    expr = expr.replace(numericPattern, (match, field, operator, value) => {
      const fieldValue = formData[field];
      if (fieldValue === undefined || fieldValue === '' || fieldValue === null) {
        return 'false';
      }
      const numValue = parseInt(fieldValue);
      const compareValue = parseInt(value);
      if (isNaN(numValue)) return 'false';
      
      switch (operator) {
        case '>=': return (numValue >= compareValue).toString();
        case '<=': return (numValue <= compareValue).toString();
        case '>': return (numValue > compareValue).toString();
        case '<': return (numValue < compareValue).toString();
        default: return 'false';
      }
    });
    
    // Handle string comparisons (===, !==)
    const stringPattern = /(\w+)\s*(===|!==)\s*'(\d+)'/g;
    expr = expr.replace(stringPattern, (match, field, operator, value) => {
      const fieldValue = formData[field];
      if (fieldValue === undefined || fieldValue === null) {
        return operator === '!==' ? 'true' : 'false';
      }
      const stringValue = String(fieldValue);
      
      if (operator === '===') {
        return (stringValue === value).toString();
      } else {
        return (stringValue !== value).toString();
      }
    });
    
    // Handle array includes
    const includesPattern = /(\w+)\.includes\('(\d+)'\)/g;
    expr = expr.replace(includesPattern, (match, field, value) => {
      const fieldValue = formData[field];
      if (!Array.isArray(fieldValue)) return 'false';
      return fieldValue.includes(value).toString();
    });
    
    // Handle && and || operators
    expr = expr.replace(/&&/g, ' && ').replace(/\|\|/g, ' || ');
    
    // Safely evaluate
    return eval(expr);
  } catch (err) {
    console.error('Error evaluating condition:', condition, err);
    return false;
  }
};
```

### 2. Supported Expression Types

#### A. Numeric Comparisons
```typescript
// Examples:
"age >= 18"           // Show if age is 18 or above
"score > 50"          // Show if score is greater than 50
"duration <= 300"     // Show if duration is 300 seconds or less
```

#### B. String Comparisons
```typescript
// Examples:
"gender === '1'"      // Show if gender is male
"status !== '2'"      // Show if status is not rejected
"consent === '1'"     // Show if consent is given
```

#### C. Array Operations
```typescript
// Examples:
"selected.includes('3')"  // Show if '3' is in selected array
"preferences.includes('1')"  // Show if preference 1 is selected
```

#### D. Complex Logical Expressions
```typescript
// Examples:
"age >= 18 && gender === '1'"  // Show if adult male
"status === '1' || status === '2'"  // Show if status is 1 or 2
"consent === '1' && age >= 18"  // Show if consent given and adult
```

### 3. Field Visibility Control

```typescript
const isFieldVisible = (field: FormField): boolean => {
  if (!field.conditional) return true;
  return evaluateCondition(field.conditional);
};
```

---

## 🌐 Multi-Language Support

### 1. Language Configuration

```typescript
const [language, setLanguage] = useState<string>('english');

// Language options
const languageOptions = [
  { value: 'english', label: 'English (English)' },
  { value: 'bengali', label: 'Bangla (বাংলা)' },
  { value: 'hindi', label: 'Hindi (हिंदी)' },
];
```

### 2. Language-Specific Content

#### A. Consent Section
```typescript
{language === 'hindi' 
  ? `नमस्ते, मेरा नाम ${teleformUserName || '[enumerator name]'} है। हम कन्वर्जेंट नाम की एक संस्था से बात कर रहे हैं...`
  : language === 'bengali'
  ? `নমস্কার, আমার নাম ${teleformUserName || '[enumerator name]'}। আমরা কনভার্জেন্ট থেকে এসেছি...`
  : `Namaste, my name is ${teleformUserName || '[enumerator name]'}. We are from Convergent...`
}
```

#### B. Dynamic Options
```typescript
// Party options with language support
label: language === 'bengali' ? party.party_name_bangla : party.party_name_english

// Caste options with language support
label: language === 'bengali' ? caste.caste_name_bangla : 
       language === 'hindi' ? caste.caste_name_hindi : 
       caste.caste_name_english
```

---

## 💾 Data Management

### 1. Form Data Transformation

```typescript
const transformFormDataForSubmission = (data: Record<string, any>) => {
  const transformed: Record<string, any> = {};
  
  processedFormConfig.forEach((field) => {
    const fieldValue = data[field.tag];
    
    if (field.type === 'checkbox' && Array.isArray(fieldValue)) {
      // For checkbox fields, create individual fields for each option
      field.options?.forEach((option) => {
        const fieldName = `${field.tag}_${option.value}`;
        transformed[fieldName] = fieldValue.includes(option.value) ? 1 : null;
      });
    } else if (field.type !== 'checkbox') {
      // For non-checkbox fields, convert to appropriate type
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
        transformed[field.tag] = null;
      } else if (field.type === 'radio' || field.type === 'number') {
        // Convert radio button values and number inputs to integers
        const numValue = parseInt(fieldValue);
        transformed[field.tag] = isNaN(numValue) ? null : numValue;
      } else {
        // Keep text and other types as strings
        transformed[field.tag] = fieldValue;
      }
    }
  });
  
  return transformed;
};
```

### 2. Data Transformation Examples

#### A. Checkbox Arrays → Individual Fields
```typescript
// Input: { "preferences": ["1", "3", "5"] }
// Output: {
//   "preferences_1": 1,
//   "preferences_2": null,
//   "preferences_3": 1,
//   "preferences_4": null,
//   "preferences_5": 1
// }
```

#### B. Radio/Number Values → Integers
```typescript
// Input: { "age": "25", "gender": "1" }
// Output: { "age": 25, "gender": 1 }
```

#### C. Empty Values → Null
```typescript
// Input: { "name": "", "email": undefined }
// Output: { "name": null, "email": null }
```

---

## ✅ Validation System

### 1. Real-Time Validation

```typescript
const validateForm = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Get all visible fields that are required
  processedFormConfig.forEach((field) => {
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

### 2. Visual Error Feedback

```typescript
const hasError = validationErrors.has(field.tag);

// Error styling
className={`mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 ${
  hasError 
    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200 dark:shadow-red-900/20' 
    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
}`}
```

### 3. Error Message Display

```typescript
{hasError && (
  <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
    <i className="fa fa-exclamation-triangle mr-2"></i>
    This field is required
  </div>
)}
```

---

## 💾 Auto-Save Functionality

### 1. Debounced Auto-Save

```typescript
// Trigger auto-save on form data change (debounced)
useEffect(() => {
  if (autoSaveTimeoutRef.current) {
    clearTimeout(autoSaveTimeoutRef.current);
  }
  
  autoSaveTimeoutRef.current = setTimeout(() => {
    autoSaveForm();
  }, 1000);
  
  return () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  };
}, [formData]);
```

### 2. Auto-Save Implementation

```typescript
const autoSaveForm = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token || !interviewId) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    
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
        status: formData.thanks_future == '1' || formData.thanks_future == '2' ? 2 : 4, // Draft status
        form_duration_seconds: timer,
        language_used: language,
      })
    });
    
    console.log('Auto-saved draft');
  } catch (error) {
    console.error('Auto-save error:', error);
  }
};
```

---

## 📋 Form Sections

### 1. Section Organization

```typescript
const groupFieldsBySection = () => {
  const sections: Record<string, FormField[]> = {
    callStatus: [],
    consent: [],
    demographics: [],
    partyPreferences: [],
    satisfaction: [],
    finalDemographics: [],
  };

  processedFormConfig.forEach(field => {
    if (['number_status', 'call_not_ring', 'call_ring_status', 'q_call_status', 'call_reschedule'].includes(field.tag)) {
      sections.callStatus.push(field);
    } else if (field.tag === 'consent') {
      sections.consent.push(field);
    } else if (['resp_age', 'resp_registered_voter', 'resp_gender'].includes(field.tag)) {
      sections.demographics.push(field);
    } else if (['q5', 'q5_oth', 'q5_ind', 'q6', 'q6_oth', 'q6_ind', 'q7', 'q7_oth', 'q7_ind', 'q8', 'q8_oth', 'q8_ind', 'q9', 'q9_oth', 'q9_ind', 'q10', 'q10_oth', 'q11', 'q11_oth', 'q12', 'q12_oth', 'q13', 'q13_oth'].includes(field.tag)) {
      sections.partyPreferences.push(field);
    } else if (['q14', 'q15', 'q16_a', 'q16_b', 'q17', 'q17_oth', 'q19', 'q19_oth'].includes(field.tag)) {
      sections.satisfaction.push(field);
    } else if (['resp_religion', 'resp_religion_oth', 'resp_social_cat', 'resp_caste_jati', 'resp_caste_jati_oth', 'resp_female_edu', 'resp_male_edu', 'resp_occupation', 'thanks_future'].includes(field.tag)) {
      sections.finalDemographics.push(field);
    }
  });

  return sections;
};
```

### 2. Section Visibility Logic

```typescript
// Check if sections should be visible
const showConsentSection = formData.q_call_status === '1';
const showDemographicsSection = formData.consent === '1';
const showPartyPreferencesSection = formData.resp_registered_voter === '1';
const showSatisfactionSection = formData.resp_registered_voter === '1';
const showFinalDemographicsSection = formData.resp_registered_voter === '1';
```

### 3. Section Rendering

```typescript
{/* Call Status Section */}
<Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
  <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
    Call Status
  </Heading>
  {sections.callStatus.map((field, index) => renderField(field, index))}
</Card>

{/* Consent Section */}
{showConsentSection && sections.consent.length > 0 && (
  <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
    <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
      Section 2: Interviewer Introduction and Statement of Informed Consent
    </Heading>
    {/* Language-specific consent text */}
    {sections.consent.map((field, index) => renderField(field, index))}
  </Card>
)}
```

---

## 🔌 API Integration

### 1. Form Submission

```typescript
const saveFormData = async (finalSubmit: number) => {
  try {
    setIsSubmitting(true);
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast('No authentication token found', 'error');
      return false;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date().toLocaleString();
    
    // Determine status based on submission type
    // 1 = Call initiated, 2 = Successful submit, 3 = Partial submit, 4 = Draft
    let status = 4; // Default to draft
    if (finalSubmit === 1) {
      status = 2; // Successful submit
    } else if (finalSubmit === 0) {
      status = 3; // Partial submit (call dropped)
    }
    
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
    
    const response = await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      showToast(data.message || 'Failed to save form', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error saving form:', error);
    showToast('Failed to save form. Please try again.', 'error');
    return false;
  } finally {
    setIsSubmitting(false);
  }
};
```

### 2. Submission Handlers

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form before submission
  const validation = validateForm();
  
  if (!validation.isValid) {
    // Handle validation errors
    setValidationErrors(new Set(validation.errors.map((_, index) => `field_${index}`)));
    showToast(`Please fill all required fields. Missing: ${validation.errors.slice(0, 3).join(', ')}${validation.errors.length > 3 ? ` and ${validation.errors.length - 3} more...` : ''}`, 'error');
    return;
  }
  
  // Clear validation errors if form is valid
  setValidationErrors(new Set());
  
  showToast('Saving form data...', 'info');
  
  const success = await saveFormData(1);
  
  if (success) {
    showToast('Form submitted successfully! Data has been saved.', 'success');
    
    setTimeout(() => {
      router.push(`/cati/ss/new-call/${teleformUserId}`);
    }, 1500);
  }
};

const handleCallDropped = async () => {
  showToast('Saving partial data...', 'info');
  
  const success = await saveFormData(0);
  
  if (success) {
    showToast('Call dropped. Partial data has been saved.', 'success');
    
    setTimeout(() => {
      router.push(`/cati/ss/new-call/${teleformUserId}`);
    }, 1500);
  }
};
```

---

## ⚠️ Error Handling

### 1. Validation Error Handling

```typescript
// Clear validation error for this field when user starts typing
if (value && value !== '') {
  setValidationErrors(prev => {
    const newErrors = new Set(prev);
    newErrors.delete(fieldTag);
    return newErrors;
  });
}
```

### 2. API Error Handling

```typescript
try {
  const response = await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submissionData)
  });
  
  const data = await response.json();
  
  if (data.success) {
    return true;
  } else {
    showToast(data.message || 'Failed to save form', 'error');
    return false;
  }
} catch (error) {
  console.error('Error saving form:', error);
  showToast('Failed to save form. Please try again.', 'error');
  return false;
}
```

### 3. Toast Notification System

```typescript
const showToast = (message: string, type: 'warning' | 'error' | 'success' | 'info' = 'warning') => {
  const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newToast = {
    id,
    message,
    type,
    position: 'bottom-left' as const,
    duration: 3000,
  };
  setToasts(prev => [...prev, newToast]);
};

const removeToast = (id: string) => {
  setToasts(prev => prev.filter(toast => toast.id !== id));
};
```

---

## 🚀 Performance Optimizations

### 1. Memoized Form Processing

```typescript
// Get processed form configuration
const processedFormConfig = React.useMemo(() => {
  return processFormConfig(currentFormConfig);
}, [currentFormConfig, acCode, language, formData.resp_religion]);
```

### 2. Debounced Auto-Save

```typescript
// Trigger auto-save on form data change (debounced)
useEffect(() => {
  if (autoSaveTimeoutRef.current) {
    clearTimeout(autoSaveTimeoutRef.current);
  }
  
  autoSaveTimeoutRef.current = setTimeout(() => {
    autoSaveForm();
  }, 1000);
  
  return () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  };
}, [formData]);
```

### 3. Conditional Rendering

```typescript
// Only render fields that are visible
const renderField = (field: FormField, index: number) => {
  if (!isFieldVisible(field)) return null;
  // ... render field
};
```

---

## 📝 Usage Examples

### 1. Basic Form Field Configuration

```json
{
  "type": "radio",
  "label": "What is your gender?",
  "tag": "resp_gender",
  "required": true,
  "options": [
    { "label": "Male", "value": "1", "tag": "gender_male" },
    { "label": "Female", "value": "2", "tag": "gender_female" }
  ]
}
```

### 2. Conditional Field Configuration

```json
{
  "type": "text",
  "label": "Please specify your caste",
  "tag": "resp_caste_jati_oth",
  "required": true,
  "conditional": "resp_caste_jati === '44'",
  "placeholder": "Enter your caste"
}
```

### 3. Checkbox Field with Rules

```json
{
  "type": "checkbox",
  "label": "What are your main concerns?",
  "tag": "concerns",
  "required": true,
  "maxSelections": 3,
  "options": [
    { "label": "Education", "value": "1", "tag": "concern_education" },
    { "label": "Healthcare", "value": "2", "tag": "concern_healthcare" },
    { "label": "Employment", "value": "3", "tag": "concern_employment" },
    { "label": "Other", "value": "99", "tag": "concern_other" }
  ],
  "rules": {
    "exclusiveOptions": ["99"],
    "showFields": {
      "concern_other": ["concern_other_specify"]
    }
  }
}
```

---

## 🔧 Troubleshooting

### 1. Common Issues

#### A. Form Not Saving
- **Check**: Authentication token in localStorage
- **Check**: API endpoint availability
- **Check**: Network connectivity

#### B. Conditional Fields Not Showing
- **Check**: Expression syntax in `conditional` field
- **Check**: Field values in `formData`
- **Check**: Console for evaluation errors

#### C. Validation Errors Not Clearing
- **Check**: Field tag names match exactly
- **Check**: `setValidationErrors` calls
- **Check**: Form data updates

### 2. Debug Tools

#### A. Console Logging
```typescript
console.log('Form data:', formData);
console.log('Validation errors:', validationErrors);
console.log('Current language:', language);
console.log('Timer:', timer);
```

#### B. Form State Inspection
```typescript
// Add to component for debugging
useEffect(() => {
  console.log('Form data updated:', formData);
}, [formData]);
```

### 3. Performance Monitoring

#### A. Auto-Save Frequency
```typescript
// Monitor auto-save calls
let autoSaveCount = 0;
const autoSaveForm = async () => {
  autoSaveCount++;
  console.log(`Auto-save #${autoSaveCount}`);
  // ... rest of function
};
```

#### B. Form Processing Time
```typescript
// Monitor form processing
const startTime = performance.now();
const processedConfig = processFormConfig(currentFormConfig);
const endTime = performance.now();
console.log(`Form processing took ${endTime - startTime} milliseconds`);
```

---

## 📊 Status Codes

### 1. Interview Status
- **1**: Call initiated
- **2**: Successful submit
- **3**: Partial submit (call dropped)
- **4**: Draft

### 2. Form Submission Types
- **0**: Call dropped (partial data)
- **1**: Successful completion

### 3. Field Types
- **text**: Text input
- **number**: Numeric input
- **radio**: Single selection
- **checkbox**: Multiple selection
- **datetime-local**: Date/time input

---

## 🎯 Best Practices

### 1. Form Configuration
- Use descriptive field tags
- Provide clear labels
- Set appropriate validation rules
- Test conditional logic thoroughly

### 2. Performance
- Use memoization for expensive calculations
- Implement proper debouncing
- Avoid unnecessary re-renders
- Monitor auto-save frequency

### 3. User Experience
- Provide clear error messages
- Use progressive disclosure
- Implement smooth transitions
- Ensure responsive design

### 4. Data Integrity
- Validate on both client and server
- Implement proper error handling
- Use consistent data formats
- Maintain audit trails

---

## 📚 Additional Resources

### 1. Related Documentation
- [Form Configuration Guide](./FORM_CONFIG_GUIDE.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Multi-Language Setup](./MULTI_LANGUAGE_SETUP.md)

### 2. Configuration Files
- `form-en-config.json` - English form configuration
- `form-bn-config.json` - Bengali form configuration
- `form-hi-config.json` - Hindi form configuration
- `party_2021_q5.json` - Party data
- `mla-mp-ac-data.json` - MLA/MP data
- `caste-options.json` - Caste options

### 3. Component Dependencies
- `@/components/ui/Container`
- `@/components/ui/Card`
- `@/components/ui/Input`
- `@/components/ui/Button`
- `@/components/ui/SelectDropdown`
- `@/components/ui/Radio`
- `@/components/ui/Checkbox`
- `@/components/ui/Text`
- `@/components/ui/Toast`

---

*This documentation is maintained for the West Bengal Opinion Poll 2025 CATI Survey System.*
