# CATI Survey Form - API Documentation

Complete API documentation for saving CATI survey form data to the database.

---

## 📊 Table Status: ✅ READY

**Table:** `cati_survey_calling_interview`  
**Total Columns:** 209  
**Status:** All required columns exist  

---

## 🎯 API Endpoint: Save Survey Form

### **POST** `/api/cati/survey/save`

Save or update CATI survey form data.

---

## 📥 Request Body

### Complete Form Data Structure

```json
{
  "interview_id": 12345,
  "language": "english",
  "time": 1800,
  "final_submit": 1,
  "user_timezone": "Asia/Kolkata",
  "user_localdatetime": "2024-12-01 15:30:00",
  
  "number_status": "1",
  "call_not_ring": "",
  "call_ring_status": "1",
  "q_call_status": "1",
  "call_reschedule": "",
  "callid": "CALL_20241201_001",
  
  "consent": "1",
  
  "resp_age": "35",
  "resp_registered_voter": "1",
  "resp_gender": "1",
  
  "q5": "1",
  "q5_oth": "",
  "q5_ind": "",
  
  "q6": "2",
  "q6_oth": "",
  "q6_ind": "",
  
  "q7": "3",
  "q7_oth": "",
  "q7_ind": "",
  
  "q8": "1",
  "q8_oth": "",
  "q8_ind": "",
  
  "q9": "2",
  "q9_oth": "",
  "q9_ind": "",
  
  "q10": ["3", "5", "7"],
  "q10_oth": "",
  
  "q11": ["3", "4", "5"],
  "q11_oth": "",
  
  "q12": ["1", "2", "5"],
  "q12_oth": "",
  
  "q13": ["7", "8"],
  "q13_oth": "",
  
  "q14": "3",
  "q15": "4",
  "q16_a": "2",
  "q16_b": "3",
  "q17": "1",
  "q17_oth": "",
  "q19": "2",
  "q19_oth": "",
  
  "resp_religion": "1",
  "resp_religion_oth": "",
  "resp_social_cat": "2",
  "resp_caste_jati": "5",
  "resp_caste_jati_oth": "",
  "resp_female_edu": "3",
  "resp_male_edu": "4",
  "resp_occupation": "5",
  "thanks_future": "1"
}
```

---

## 🔄 Data Transformation Logic

### 1. **Single Choice Questions** (Direct Mapping)

```javascript
// Q5 - 2019 Lok Sabha Vote (Binary columns)
// Frontend: q5 = "1"
// Backend: Set q1_1 = 1, all others = 0

const q5Mapping = {
  "1": "q1_1",
  "2": "q1_2",
  "3": "q1_3",
  "4": "q1_4",
  "5": "q1_5",
  "44": "q1_44"  // Also set q1_other = q5_oth
};

// Q6, Q7, Q8, Q9 - Direct INT mapping
q6: formData.q6,
q7: formData.q7,  // ⚠️ Needs confirmation which column
q2: formData.q8,
q3: formData.q9
```

### 2. **Multi-Choice Questions** (Array to Binary)

```javascript
// Q10 - Reasons for current choice
// Frontend: q10 = ["3", "5", "99"]
// Backend: q7_3=1, q7_5=1, q7_99=1, others=0

const q10Values = formData.q10 || [];
const q10Columns = {
  q7_3: q10Values.includes("3") ? 1 : 0,
  q7_4: q10Values.includes("4") ? 1 : 0,
  q7_5: q10Values.includes("5") ? 1 : 0,
  q7_6: q10Values.includes("6") ? 1 : 0,
  q7_7: q10Values.includes("7") ? 1 : 0,
  q7_8: q10Values.includes("8") ? 1 : 0,
  q7_10: q10Values.includes("10") ? 1 : 0,
  q7_11: q10Values.includes("11") ? 1 : 0,
  q7_12: q10Values.includes("12") ? 1 : 0,
  q7_13: q10Values.includes("13") ? 1 : 0,
  q7_44: q10Values.includes("44") ? 1 : 0,
  q7_99: q10Values.includes("99") ? 1 : 0,
  q7_other: q10Values.includes("44") ? formData.q10_oth : null
};

// Q11 - Reasons for BJP choice
const q11Values = formData.q11 || [];
const q11Columns = {
  q8_3: q11Values.includes("3") ? 1 : 0,
  q8_4: q11Values.includes("4") ? 1 : 0,
  q8_5: q11Values.includes("5") ? 1 : 0,
  q8_7: q11Values.includes("7") ? 1 : 0,
  q8_9: q11Values.includes("9") ? 1 : 0,
  q8_10: q11Values.includes("10") ? 1 : 0,
  q8_11: q11Values.includes("11") ? 1 : 0,
  q8_12: q11Values.includes("12") ? 1 : 0,
  q8_13: q11Values.includes("13") ? 1 : 0,
  q8_14: q11Values.includes("14") ? 1 : 0,
  q8_44: q11Values.includes("44") ? 1 : 0,
  q8_99: q11Values.includes("99") ? 1 : 0,
  q8_other: q11Values.includes("44") ? formData.q11_oth : null
};

// Q12 - Reasons for TMC choice
const q12Values = formData.q12 || [];
const q12Columns = {
  q9_1: q12Values.includes("1") ? 1 : 0,
  q9_2: q12Values.includes("2") ? 1 : 0,
  q9_3: q12Values.includes("3") ? 1 : 0,
  q9_4: q12Values.includes("4") ? 1 : 0,
  q9_5: q12Values.includes("5") ? 1 : 0,
  q9_6: q12Values.includes("6") ? 1 : 0,
  q9_7: q12Values.includes("7") ? 1 : 0,
  q9_8: q12Values.includes("8") ? 1 : 0,
  q9_9: q12Values.includes("9") ? 1 : 0,
  q9_10: q12Values.includes("10") ? 1 : 0,
  q9_11: q12Values.includes("11") ? 1 : 0,
  q9_12: q12Values.includes("12") ? 1 : 0,
  q9_13: q12Values.includes("13") ? 1 : 0,
  q9_44: q12Values.includes("44") ? 1 : 0,
  q9_99: q12Values.includes("99") ? 1 : 0,
  q9_other: q12Values.includes("44") ? formData.q12_oth : null
};

// Q13 - Reasons for Congress choice
const q13Values = formData.q13 || [];
const q13Columns = {
  q10_1: q13Values.includes("1") ? 1 : 0,
  q10_2: q13Values.includes("2") ? 1 : 0,
  q10_3: q13Values.includes("3") ? 1 : 0,
  q10_4: q13Values.includes("4") ? 1 : 0,
  q10_5: q13Values.includes("5") ? 1 : 0,
  q10_6: q13Values.includes("6") ? 1 : 0,
  q10_7: q13Values.includes("7") ? 1 : 0,
  q10_8: q13Values.includes("8") ? 1 : 0,
  q10_9: q13Values.includes("9") ? 1 : 0,
  q10_10: q13Values.includes("10") ? 1 : 0,
  q10_11: q13Values.includes("11") ? 1 : 0,
  q10_12: q13Values.includes("12") ? 1 : 0,
  q10_13: q13Values.includes("13") ? 1 : 0,
  q10_14: q13Values.includes("14") ? 1 : 0,
  q10_44: q13Values.includes("44") ? 1 : 0,
  q10_99: q13Values.includes("99") ? 1 : 0,
  q10_other: q13Values.includes("44") ? formData.q13_oth : null
};
```

---

## 📝 Complete SQL UPDATE Query

```sql
UPDATE cati_survey_calling_interview
SET
  -- Metadata
  form_duration_seconds = ?,        -- formData.time
  language_used = ?,                -- formData.language
  user_timezone = ?,                -- formData.user_timezone
  user_localdatetime = ?,           -- formData.user_localdatetime
  final_submit = ?,                 -- formData.final_submit
  survey_complete_date = NOW(),
  endtime = UNIX_TIMESTAMP(),
  
  -- Call Status
  number_status = ?,                -- formData.number_status
  call_not_ring = ?,                -- formData.call_not_ring
  call_ring_status = ?,             -- formData.call_ring_status
  q_call_status = ?,                -- formData.q_call_status
  call_reschedule_datetime = ?,     -- formData.call_reschedule
  callid = ?,                       -- formData.callid
  call_received = 1,
  call_date = CURDATE(),
  
  -- Consent
  q_consent = ?,                    -- formData.consent
  
  -- Demographics
  q_age = ?,                        -- formData.resp_age
  q_register_voter = ?,             -- formData.resp_registered_voter
  q_gender = ?,                     -- formData.resp_gender
  
  -- Q5 (2019 Lok Sabha) - Binary columns
  q1_1 = ?,                         -- 1 if formData.q5 === "1", else 0
  q1_2 = ?,                         -- 1 if formData.q5 === "2", else 0
  q1_3 = ?,                         -- 1 if formData.q5 === "3", else 0
  q1_4 = ?,                         -- 1 if formData.q5 === "4", else 0
  q1_5 = ?,                         -- 1 if formData.q5 === "5", else 0
  q1_44 = ?,                        -- 1 if formData.q5 === "44", else 0
  q1_other = ?,                     -- formData.q5_oth (if q5 === "44")
  q5_ind = ?,                       -- formData.q5_ind (if q5 === "12")
  
  -- Q6 (2019 Assembly)
  q6 = ?,                           -- formData.q6
  q6_oth = ?,                       -- formData.q6_oth
  q6_ind = ?,                       -- formData.q6_ind
  
  -- Q7 (2021 Assembly) - ⚠️ Needs column confirmation
  -- q7 = ?,                        -- formData.q7 (which column?)
  q7_oth = ?,                       -- formData.q7_oth
  q7_ind = ?,                       -- formData.q7_ind
  
  -- Q8 (Current Lok Sabha)
  q2 = ?,                           -- formData.q8
  q2_other = ?,                     -- formData.q8_oth
  q8_ind = ?,                       -- formData.q8_ind
  
  -- Q9 (Current Assembly)
  q3 = ?,                           -- formData.q9
  q3_other = ?,                     -- formData.q9_oth
  q9_ind = ?,                       -- formData.q9_ind
  
  -- Q10 (Multi-choice) - Binary columns
  q7_3 = ?, q7_4 = ?, q7_5 = ?, q7_6 = ?, q7_7 = ?, q7_8 = ?,
  q7_10 = ?, q7_11 = ?, q7_12 = ?, q7_13 = ?, q7_44 = ?, q7_99 = ?,
  q7_other = ?,
  
  -- Q11 (Multi-choice) - Binary columns
  q8_3 = ?, q8_4 = ?, q8_5 = ?, q8_7 = ?, q8_9 = ?, q8_10 = ?,
  q8_11 = ?, q8_12 = ?, q8_13 = ?, q8_14 = ?, q8_44 = ?, q8_99 = ?,
  q8_other = ?,
  
  -- Q12 (Multi-choice) - Binary columns
  q9_1 = ?, q9_2 = ?, q9_3 = ?, q9_4 = ?, q9_5 = ?, q9_6 = ?,
  q9_7 = ?, q9_8 = ?, q9_9 = ?, q9_10 = ?, q9_11 = ?, q9_12 = ?,
  q9_13 = ?, q9_44 = ?, q9_99 = ?,
  q9_other = ?,
  
  -- Q13 (Multi-choice) - Binary columns
  q10_1 = ?, q10_2 = ?, q10_3 = ?, q10_4 = ?, q10_5 = ?, q10_6 = ?,
  q10_7 = ?, q10_8 = ?, q10_9 = ?, q10_10 = ?, q10_11 = ?, q10_12 = ?,
  q10_13 = ?, q10_14 = ?, q10_44 = ?, q10_99 = ?,
  q10_other = ?,
  
  -- Satisfaction Ratings
  q4 = ?,                           -- formData.q14
  q5 = ?,                           -- formData.q15
  q8a = ?,                          -- formData.q16_a
  q8b = ?,                          -- formData.q16_b
  q11 = ?,                          -- formData.q17
  q11_other = ?,                    -- formData.q17_oth
  
  -- Q19 (2024 LS Vote) - ⚠️ Needs column confirmation
  -- q19 = ?,                       -- formData.q19 (which column?)
  q19_oth = ?,                      -- formData.q19_oth
  
  -- Demographics
  q_religion = ?,                   -- formData.resp_religion
  q_religion_other = ?,             -- formData.resp_religion_oth
  q_social_category = ?,            -- formData.resp_social_cat
  q_caste_jati = ?,                 -- formData.resp_caste_jati
  q_caste_jati_other = ?,           -- formData.resp_caste_jati_oth
  q_female_education = ?,           -- formData.resp_female_edu
  resp_education = ?,               -- formData.resp_male_edu
  q_occupation = ?,                 -- formData.resp_occupation
  q_future_contact = ?,             -- formData.thanks_future
  
  -- System Fields
  q_interview_status = ?,           -- Based on final_submit
  status = 2,                       -- 2 = Completed
  updated_at = UNIX_TIMESTAMP(),
  updated_by = ?                    -- Current user ID

WHERE id = ?;                       -- interview_id
```

---

## 📤 Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Survey data saved successfully",
  "data": {
    "interview_id": 12345,
    "status": "completed",
    "survey_complete_date": "2024-12-01T15:30:00.000Z"
  },
  "timestamp": "2024-12-01T15:30:00.123Z"
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid interview_id or missing required fields",
  "timestamp": "2024-12-01T15:30:00.123Z"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Interview record not found",
  "timestamp": "2024-12-01T15:30:00.123Z"
}
```

---

## ✅ Validation Rules

### Required Fields
- `interview_id` (must exist in database)
- `final_submit` (1 or 0)

### Conditional Requirements
- If `number_status === "2"` → `call_not_ring` required
- If `q_call_status === "5"` → `call_reschedule` required
- If `consent === "1"` → `resp_age` required
- If `resp_age >= 18` → `resp_registered_voter` required
- If `resp_registered_voter === "1"` → `resp_gender` required

### Data Type Validation
- Ages: 10-99
- Phone numbers: 10 digits
- Multi-choice arrays: Max 3 selections for q11, q12, q13
- Exclusive options: q10 values "5" and "99" are mutually exclusive

---

## 🔍 Additional Endpoints

### Get Interview Details

**GET** `/api/cati/interviews/{id}`

Get details of a specific interview for pre-filling the form.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "ac_code": 105,
    "ac_name": "Example AC",
    "phone": "9876543210",
    "name": "John Doe",
    "district_name": "Example District",
    // ... other AC details
  }
}
```

### List Interviews

**GET** `/api/cati/interviews/teleform-user/{userId}`

Query Parameters:
- `status`: Filter by status (0=new, 1=in-progress, 2=completed)
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## ⚠️ Important Notes

1. **Q7 Mapping**: Need to confirm which database column maps to frontend Q7 (2021 Assembly Vote)
2. **Q19 Mapping**: Need to confirm which database column maps to frontend Q19 (2024 LS Vote)
3. **Timestamps**: `starttime` and `endtime` are Unix timestamps (seconds since epoch)
4. **Status Updates**: When form is submitted, update `status = 2` (completed)
5. **Call Tracking**: Increment `call_attempt` when call is initiated, set `call_received = 1` when answered

---

## 🎯 Implementation Checklist

- [ ] Implement transformation logic for Q5 (single to binary columns)
- [ ] Implement transformation logic for Q10, Q11, Q12, Q13 (arrays to binary)
- [ ] Clarify and implement Q7 mapping
- [ ] Clarify and implement Q19 mapping
- [ ] Add validation for all required fields
- [ ] Add validation for conditional fields
- [ ] Implement error handling
- [ ] Add logging for debugging
- [ ] Test with actual form submissions
- [ ] Document any additional business logic

---

**Database Status:** ✅ All 209 columns ready  
**API Ready:** ⚠️ Needs Q7 & Q19 mapping clarification  
**Last Updated:** December 2024
