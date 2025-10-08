# CATI Survey Form - Complete Field Mapping

Based on actual `cati_survey_calling_interview` table structure (191 columns)

## 📋 Frontend to Backend Field Mapping

### ✅ METADATA FIELDS

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `time` (seconds) | `starttime`, `endtime` | ✅ EXISTS | Store as Unix timestamps |
| `language` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `language_used` ENUM column |
| `final_submit` | `q_interview_status` | ✅ EXISTS | 1=Complete, 0=Incomplete |
| `user_timezone` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `user_timezone` VARCHAR column |
| `user_localdatetime` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `user_localdatetime` VARCHAR column |

---

### ✅ IDENTIFICATION SECTION

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `ac_code` | `ac_code` | ✅ EXISTS | INT field |
| `ac_name` | N/A | 🔄 FETCH | Fetch from AC master table |
| `pc_code` | N/A | 🔄 FETCH | Fetch from AC master table |
| `pc_name` | N/A | 🔄 FETCH | Fetch from AC master table |
| `district_code` | N/A | 🔄 FETCH | Fetch from AC master table |
| `district_name` | N/A | 🔄 FETCH | Fetch from AC master table |
| `region_code` | N/A | 🔄 FETCH | Fetch from AC master table |
| `region_name` | N/A | 🔄 FETCH | Fetch from AC master table |
| `mla_name` | N/A | 🔄 FETCH | Fetch from AC master table |
| `mp_name` | N/A | 🔄 FETCH | Fetch from AC master table |

---

### ✅ CALL STATUS SECTION

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `number_status` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `number_status` TINYINT |
| `call_not_ring` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `call_not_ring` TINYINT |
| `call_ring_status` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `call_ring_status` TINYINT |
| `q_call_status` | `q_call_status` | ✅ EXISTS | INT field |
| `call_reschedule` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `call_reschedule_datetime` DATETIME |
| `telecaller_id` | `teleform_user_id` | ✅ EXISTS | INT field |
| `telecaller_name` | N/A | 🔄 FETCH | Fetch from users table |
| `callid` | `callid` | ✅ EXISTS | VARCHAR(50) |

---

### ✅ SECTION 2: CONSENT

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `consent` | `q_consent` | ✅ EXISTS | INT: 1=Yes, 2=No |

---

### ✅ SECTION 3: BASIC DEMOGRAPHIC

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `resp_age` | `q_age` | ✅ EXISTS | INT field |
| `resp_registered_voter` | `q_register_voter` | ✅ EXISTS | INT: 1=Yes, 2=No |
| `resp_gender` | `q_gender` | ✅ EXISTS | INT: 1=Male, 2=Female |

---

### ✅ SECTION 4: PARTY PREFERENCES (Single Choice)

#### Q5 - 2019 Lok Sabha Vote
| Frontend Field | Database Column | Status | Transformation |
|---------------|----------------|--------|----------------|
| `q5` (string) | `q1_1` to `q1_44` | ✅ EXISTS | Convert to binary columns |
| `q5_oth` | `q1_other` | ✅ EXISTS | VARCHAR(255) |
| `q5_ind` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q5_ind` VARCHAR(150) |

**Transformation Logic:**
```javascript
// Frontend: q5 = "1"
// Backend: Set q1_1 = 1, all others = 0

if (q5 === "1") { q1_1 = 1; }
else if (q5 === "2") { q1_2 = 1; }
else if (q5 === "3") { q1_3 = 1; }
else if (q5 === "4") { q1_4 = 1; }
else if (q5 === "5") { q1_5 = 1; }
else if (q5 === "44") { q1_44 = 1; q1_other = q5_oth; }
```

#### Q6 - 2019 Assembly Vote
| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `q6` | `q6` | ✅ EXISTS | Direct INT mapping |
| `q6_oth` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q6_oth` VARCHAR(150) |
| `q6_ind` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q6_ind` VARCHAR(150) |

#### Q7 - 2021 Assembly Vote
| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `q7` | **❓ UNCLEAR** | ⚠️ NEEDS MAPPING | Could be q12, q13, or other |
| `q7_oth` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q7_oth` VARCHAR(150) |
| `q7_ind` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q7_ind` VARCHAR(150) |

#### Q8 - Current Lok Sabha Vote
| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `q8` | `q2` | ✅ EXISTS | Direct INT mapping |
| `q8_oth` | `q2_other` | ✅ EXISTS | VARCHAR(255) |
| `q8_ind` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q8_ind` VARCHAR(150) |

#### Q9 - Current Assembly Vote
| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `q9` | `q3` | ✅ EXISTS | Direct INT mapping |
| `q9_oth` | `q3_other` | ✅ EXISTS | VARCHAR(255) |
| `q9_ind` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q9_ind` VARCHAR(150) |

---

### ✅ SECTION 4: MULTI-CHOICE QUESTIONS (Array to Binary)

#### Q10 - Reasons for Current Choice
| Frontend | Backend Columns | Status | Transformation |
|----------|----------------|--------|----------------|
| `q10: ["3", "5", "99"]` | `q7_3`, `q7_4`, `q7_5`, `q7_6`, `q7_7`, `q7_8`, `q7_10`, `q7_11`, `q7_12`, `q7_13`, `q7_44`, `q7_99` | ✅ EXISTS | Array → Binary columns |
| `q10_oth` | `q7_other` | ✅ EXISTS | VARCHAR(255) |

**Transformation Logic:**
```javascript
// Frontend: q10 = ["3", "5", "99"]
// Backend: 
q7_3 = 1;   // "3" is in array
q7_5 = 1;   // "5" is in array
q7_99 = 1;  // "99" is in array
// All others = 0
```

#### Q11 - Reasons for BJP Choice
| Frontend | Backend Columns | Status | Transformation |
|----------|----------------|--------|----------------|
| `q11: ["3", "4"]` | `q8_3`, `q8_4`, `q8_5`, `q8_7`, `q8_9`, `q8_10`, `q8_11`, `q8_12`, `q8_13`, `q8_14`, `q8_44`, `q8_99` | ✅ EXISTS | Array → Binary columns |
| `q11_oth` | `q8_other` | ✅ EXISTS | VARCHAR(255) |

**Transformation Logic:**
```javascript
// Frontend: q11 = ["3", "4"]
// Backend:
q8_3 = 1;   // "3" is in array
q8_4 = 1;   // "4" is in array
// All others = 0
```

#### Q12 - Reasons for TMC Choice
| Frontend | Backend Columns | Status | Transformation |
|----------|----------------|--------|----------------|
| `q12: ["1", "2", "5"]` | `q9_1`, `q9_2`, `q9_3`, `q9_4`, `q9_5`, `q9_6`, `q9_7`, `q9_8`, `q9_9`, `q9_10`, `q9_11`, `q9_12`, `q9_13`, `q9_44`, `q9_99` | ✅ EXISTS | Array → Binary columns |
| `q12_oth` | `q9_other` | ✅ EXISTS | VARCHAR(255) |

**Transformation Logic:**
```javascript
// Frontend: q12 = ["1", "2", "5"]
// Backend:
q9_1 = 1;   // "1" is in array
q9_2 = 1;   // "2" is in array
q9_5 = 1;   // "5" is in array
// All others = 0
```

#### Q13 - Reasons for Congress Choice
| Frontend | Backend Columns | Status | Transformation |
|----------|----------------|--------|----------------|
| `q13: ["7", "8"]` | `q10_1`, `q10_2`, `q10_3`, `q10_4`, `q10_5`, `q10_6`, `q10_7`, `q10_8`, `q10_9`, `q10_10`, `q10_11`, `q10_12`, `q10_13`, `q10_14`, `q10_44`, `q10_99` | ✅ EXISTS | Array → Binary columns |
| `q13_oth` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q10_other` VARCHAR(150) |

**Transformation Logic:**
```javascript
// Frontend: q13 = ["7", "8"]
// Backend:
q10_7 = 1;  // "7" is in array
q10_8 = 1;  // "8" is in array
// All others = 0
```

---

### ✅ SECTION 5: SATISFACTION & APPROVAL RATINGS

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `q14` (Central Govt) | `q4` | ✅ EXISTS | INT: 1-5, 99 |
| `q15` (State Govt) | `q5` | ✅ EXISTS | INT: 1-5, 99 |
| `q16_a` (MP Performance) | `q8a` | ✅ EXISTS | INT: 1-5, 99 |
| `q16_b` (MLA Performance) | `q8b` | ✅ EXISTS | INT: 1-5, 99 |
| `q17` (Important Issue) | `q11` | ✅ EXISTS | INT |
| `q17_oth` | `q11_other` | ✅ EXISTS | VARCHAR(255) |
| `q19` (2024 LS Vote) | **❓ UNCLEAR** | ⚠️ NEEDS MAPPING | Could be q12, q13, q14, or q15 |
| `q19_oth` | ⚠️ **NEEDS ADDING** | ❌ MISSING | Add `q19_oth` VARCHAR(150) |

---

### ✅ SECTION 6: DEMOGRAPHIC DETAILS

| Frontend Field | Database Column | Status | Notes |
|---------------|----------------|--------|-------|
| `resp_religion` | `q_religion` | ✅ EXISTS | INT |
| `resp_religion_oth` | `q_religion_other` | ✅ EXISTS | VARCHAR(255) |
| `resp_social_cat` | `q_social_category` | ✅ EXISTS | INT |
| `resp_caste_jati` | `q_caste_jati` | ✅ EXISTS | INT |
| `resp_caste_jati_oth` | `q_caste_jati_other` | ✅ EXISTS | VARCHAR(255) |
| `resp_female_edu` | `q_female_education` | ✅ EXISTS | INT |
| `resp_male_edu` | `resp_education` | ✅ EXISTS | INT |
| `resp_occupation` | `q_occupation` | ✅ EXISTS | INT |
| `thanks_future` | `q_future_contact` | ✅ EXISTS | INT |

---

## 🔧 REQUIRED ALTER TABLE STATEMENTS

Based on the comparison, these columns need to be added:

```sql
-- Add metadata fields
ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `form_duration_seconds` INT DEFAULT 0 COMMENT 'Time spent on form in seconds';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `language_used` ENUM('english', 'bengali') DEFAULT 'english' COMMENT 'Language used during interview';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `user_timezone` VARCHAR(100) DEFAULT NULL COMMENT 'User timezone';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `user_localdatetime` VARCHAR(100) DEFAULT NULL COMMENT 'User local date time';

-- Add call status fields
ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `number_status` TINYINT DEFAULT NULL COMMENT '1=Ring, 2=Not Ring, 3=Invalid';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `call_not_ring` TINYINT DEFAULT NULL COMMENT '1=Switched Off, 2=Not Reachable, 3=Busy';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `call_ring_status` TINYINT DEFAULT NULL COMMENT '1=Answered, 2=Not Answered';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `call_reschedule_datetime` DATETIME DEFAULT NULL COMMENT 'Rescheduled date and time';

-- Add independent/other specification fields
ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q5_ind` VARCHAR(150) DEFAULT NULL COMMENT 'Q5 Independent specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q6_oth` VARCHAR(150) DEFAULT NULL COMMENT 'Q6 Other specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q6_ind` VARCHAR(150) DEFAULT NULL COMMENT 'Q6 Independent specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q7_oth` VARCHAR(150) DEFAULT NULL COMMENT 'Q7 Other specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q7_ind` VARCHAR(150) DEFAULT NULL COMMENT 'Q7 Independent specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q8_ind` VARCHAR(150) DEFAULT NULL COMMENT 'Q8 Independent specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q9_ind` VARCHAR(150) DEFAULT NULL COMMENT 'Q9 Independent specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q10_other` VARCHAR(150) DEFAULT NULL COMMENT 'Q13 (frontend) other specify';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `q19_oth` VARCHAR(150) DEFAULT NULL COMMENT 'Q19 other specify';
```

---

## ⚠️ CLARIFICATIONS NEEDED

### 1. Q7 Mapping (2021 Assembly Vote)
**Frontend:** `q7`, `q7_oth`, `q7_ind`  
**Backend:** Could be `q12`, `q13`, or other field  
**Action Required:** Confirm which database column maps to frontend Q7

### 2. Q19 Mapping (2024 Lok Sabha Vote)
**Frontend:** `q19`, `q19_oth`  
**Backend:** Could be `q12`, `q13`, `q14`, or `q15`  
**Action Required:** Confirm which database column maps to frontend Q19

### 3. Q1 Binary Columns
The table has `q1_1` through `q1_5`, `q1_44` columns. Need to confirm:
- Are these used for Q5 (2019 LS Vote)?
- Or are they used for a different question?

---

## 📊 SUMMARY

| Category | Count | Status |
|----------|-------|--------|
| ✅ **Existing Mappings** | ~60 fields | Ready to use |
| ❌ **Missing Columns** | 17 columns | Need to be added |
| ⚠️ **Needs Clarification** | 3 mappings | Q7, Q19, Q1 binary columns |
| 🔄 **External Data** | ~10 fields | Fetch from other tables |

---

## 🎯 NEXT STEPS

1. ✅ Run the ALTER TABLE statements to add missing columns
2. ⚠️ Clarify Q7, Q19, and Q1 binary column mappings
3. ✅ Implement backend transformation logic for multi-choice arrays
4. ✅ Test form submission with actual data
5. ✅ Validate all field mappings with test submissions

