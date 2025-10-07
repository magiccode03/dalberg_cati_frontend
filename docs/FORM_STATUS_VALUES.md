# Form Status Values Documentation

## 📊 **Status Field Values**

The `status` field in the CATI interview table uses specific integer values to track the state of each interview.

---

## 🔢 **Status Value Definitions**

| Value | Status Name | Description | When Set | User Action |
|-------|-------------|-------------|----------|-------------|
| **1** | **Call Initiated** | Call has been started but form not yet opened | When user clicks "Call" button | System sets on call initiation |
| **2** | **Successful Submit** | Form completed and successfully submitted | When user clicks "Submit" button (with validation passed) | Final complete submission |
| **3** | **Partial Submit** | Form partially filled and call was dropped | When user clicks "Call Dropped" button | Partial data saved |
| **4** | **Draft** | Form data auto-saved while user is filling | On every field change (debounced 1 second) | Auto-save in progress |

---

## 🔄 **Status Flow Diagram**

```
Interview Created (status = 0 or NULL)
        ↓
    [Click Call Button]
        ↓
    status = 1 (Call Initiated)
        ↓
    [Open Form & Start Filling]
        ↓
    ┌───────────────────────────────────┐
    │                                   │
    │  [Auto-save on field change]     │
    │  status = 4 (Draft)              │
    │  ↓                                │
    │  [Continue filling form...]       │
    │  ↓                                │
    └───────────────────────────────────┘
        ↓
    [User Decision Point]
        ↓
    ┌───────────┴───────────┐
    │                       │
[Submit Button]      [Call Dropped Button]
    │                       │
    │ (Validation)          │ (No validation)
    │                       │
    ↓                       ↓
status = 2            status = 3
(Successful)          (Partial Submit)
```

---

## 💻 **Implementation in Code**

### **File:** `src/app/cati/ss/tele-form-v2/[id]/page.tsx`

#### **1. Auto-Save (Draft) - Lines 250-276**
```typescript
const autoSaveForm = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token || !interviewId) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    
    await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        status: 4, // ← Draft status
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

**Trigger:** Debounced auto-save on every field change (1 second delay)

---

#### **2. Save Form Data (Submit/Partial) - Lines 294-352**
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
      status = 2; // ← Successful submit
    } else if (finalSubmit === 0) {
      status = 3; // ← Partial submit (call dropped)
    }
    
    const submissionData = {
      ...formData,
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

**Parameters:**
- `finalSubmit = 1` → Status = 2 (Successful Submit)
- `finalSubmit = 0` → Status = 3 (Partial Submit)

---

#### **3. Submit Button Handler - Lines 372-408**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form before submission
  const validation = validateForm();
  
  if (!validation.isValid) {
    // Show error and prevent submission
    return;
  }
  
  showToast('Saving form data...', 'info');
  
  const success = await saveFormData(1); // ← finalSubmit = 1 → status = 2
  
  if (success) {
    showToast('Form submitted successfully! Data has been saved.', 'success');
    
    setTimeout(() => {
      router.push(`/cati/ss/new-call/${teleformUserId}`);
    }, 1500);
  }
};
```

**Result:** Sets `status = 2` (Successful Submit)

---

#### **4. Call Dropped Button Handler - Lines 410-422**
```typescript
const handleCallDropped = async () => {
  showToast('Saving partial data...', 'info');
  
  const success = await saveFormData(0); // ← finalSubmit = 0 → status = 3
  
  if (success) {
    showToast('Call dropped. Partial data has been saved.', 'success');
    
    setTimeout(() => {
      router.push(`/cati/ss/new-call/${teleformUserId}`);
    }, 1500);
  }
};
```

**Result:** Sets `status = 3` (Partial Submit)

---

## 📋 **Status Transition Rules**

### **Valid Transitions:**

```
NULL/0 → 1 (Call initiated)
1 → 4 (Draft - user starts filling form)
4 → 4 (Draft - auto-save continues)
4 → 2 (Successful submit - user completes form)
4 → 3 (Partial submit - call dropped)
1 → 2 (Direct submit without draft)
1 → 3 (Direct partial submit without draft)
```

### **Invalid Transitions:**

```
2 → 4 (Cannot draft after successful submit)
2 → 3 (Cannot partial submit after successful submit)
3 → 2 (Cannot successful submit after partial submit)
3 → 4 (Cannot draft after partial submit)
```

---

## 🎯 **Use Cases**

### **Use Case 1: Successful Complete Interview**
```
1. User clicks "Call" → status = 1
2. User opens form and fills first field → status = 4 (auto-save)
3. User continues filling → status = 4 (auto-save on each change)
4. User completes all required fields
5. User clicks "Submit" → Validation passes → status = 2
✅ Interview completed successfully
```

### **Use Case 2: Call Dropped Mid-Interview**
```
1. User clicks "Call" → status = 1
2. User opens form and fills some fields → status = 4 (auto-save)
3. Call gets disconnected
4. User clicks "Call Dropped" → status = 3
⚠️ Partial data saved
```

### **Use Case 3: Draft Saved (User Working)**
```
1. User clicks "Call" → status = 1
2. User opens form and starts filling → status = 4
3. User fills field A → (wait 1 second) → auto-save → status = 4
4. User fills field B → (wait 1 second) → auto-save → status = 4
5. User fills field C → (wait 1 second) → auto-save → status = 4
📝 Draft continuously updated
```

---

## 📊 **Database Values**

### **Expected API Request Body:**

#### **Successful Submit:**
```json
{
  "status": 2,
  "final_submit": 1,
  "form_duration_seconds": 342,
  "language_used": "english",
  "user_timezone": "Asia/Kolkata",
  "user_localdatetime": "10/7/2025, 4:30:00 PM",
  "q_call_status": 1,
  "q_consent": 1,
  // ... all form fields
}
```

#### **Partial Submit (Call Dropped):**
```json
{
  "status": 3,
  "final_submit": 0,
  "form_duration_seconds": 180,
  "language_used": "english",
  "user_timezone": "Asia/Kolkata",
  "user_localdatetime": "10/7/2025, 4:28:00 PM",
  "q_call_status": 1,
  // ... partial form fields
}
```

#### **Draft (Auto-Save):**
```json
{
  "status": 4,
  "form_duration_seconds": 45,
  "language_used": "english",
  "q_call_status": 1,
  "q_consent": 1,
  // ... partially filled fields
}
```

---

## 🔍 **Querying by Status**

### **Get All Completed Interviews:**
```sql
SELECT * FROM cati_survey_calling_interview 
WHERE status = 2;
```

### **Get All Partial Submissions:**
```sql
SELECT * FROM cati_survey_calling_interview 
WHERE status = 3;
```

### **Get All Drafts (In Progress):**
```sql
SELECT * FROM cati_survey_calling_interview 
WHERE status = 4;
```

### **Get All Initiated Calls (Not Yet Filled):**
```sql
SELECT * FROM cati_survey_calling_interview 
WHERE status = 1;
```

---

## 📈 **Analytics and Reporting**

### **Interview Completion Rate:**
```sql
SELECT 
  COUNT(CASE WHEN status = 2 THEN 1 END) AS completed,
  COUNT(CASE WHEN status = 3 THEN 1 END) AS partial,
  COUNT(CASE WHEN status = 4 THEN 1 END) AS draft,
  COUNT(CASE WHEN status = 1 THEN 1 END) AS initiated,
  COUNT(*) AS total,
  ROUND(COUNT(CASE WHEN status = 2 THEN 1 END) * 100.0 / COUNT(*), 2) AS completion_rate
FROM cati_survey_calling_interview;
```

### **Average Time to Complete:**
```sql
SELECT 
  AVG(form_duration_seconds) AS avg_duration,
  MAX(form_duration_seconds) AS max_duration,
  MIN(form_duration_seconds) AS min_duration
FROM cati_survey_calling_interview
WHERE status = 2;
```

---

## ⚠️ **Important Notes**

### **1. Status Persistence**
- Status is updated in database on every save operation
- Auto-save continuously updates status to 4 (Draft)
- Final submission overwrites draft status with 2 or 3

### **2. Final Submit Flag**
- `final_submit = 1` always pairs with `status = 2`
- `final_submit = 0` always pairs with `status = 3`
- Draft saves don't include `final_submit` field

### **3. Data Integrity**
- Status 2 interviews should have all required fields filled
- Status 3 interviews may have partial data
- Status 4 interviews are work-in-progress

### **4. User Experience**
- Users see "Draft saved" console message for status 4
- Users see success toast for status 2 and 3
- Status transitions are automatic based on user actions

---

## 🎯 **Summary Table**

| Status | Name | `final_submit` | Validation | Redirect | User Action |
|--------|------|----------------|------------|----------|-------------|
| **1** | Call Initiated | - | No | No | Click "Call" |
| **2** | Successful Submit | 1 | ✅ Yes | ✅ Yes | Click "Submit" |
| **3** | Partial Submit | 0 | ❌ No | ✅ Yes | Click "Call Dropped" |
| **4** | Draft | - | ❌ No | ❌ No | Auto-save (1s debounce) |

---

## 🔗 **Related Fields**

These fields work together with `status`:

| Field | Type | Description |
|-------|------|-------------|
| `status` | `tinyint` | Interview status (1-4) |
| `final_submit` | `tinyint(1)` | Final submission flag (0 or 1) |
| `form_duration_seconds` | `int` | Time spent on form |
| `language_used` | `enum` | Language selected |
| `user_timezone` | `varchar(100)` | User's timezone |
| `user_localdatetime` | `varchar(100)` | User's local date/time |
| `updated_at` | `int` | Last update timestamp |
| `updated_by` | `int` | User who made last update |

---

## 📞 **Troubleshooting**

### **Issue: Status not updating to 2 after submit**
- Check if validation is passing
- Verify `finalSubmit === 1` in saveFormData
- Check API response for errors

### **Issue: Status stuck at 4 (Draft)**
- Check if submit button is being clicked
- Verify validation logic
- Check console for errors

### **Issue: Status jumps from 1 to 2 without 4**
- This is normal if user submits without filling any fields
- Auto-save only triggers on field changes

---

**Last Updated:** October 7, 2025  
**Status Field:** `cati_survey_calling_interview.status`  
**Version:** v2 (JSON-driven form)

