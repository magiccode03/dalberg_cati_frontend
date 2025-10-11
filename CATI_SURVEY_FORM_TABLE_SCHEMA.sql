-- =====================================================
-- CATI Survey Form Database Field Mapping
-- Based on actual form structure from tele-form/[id]/page.tsx
-- Target Table: cati_survey_calling_interview (existing table)
-- =====================================================

-- =====================================================
-- FRONTEND TO BACKEND FIELD MAPPING
-- =====================================================

/*
The form data will be saved directly to the existing `cati_survey_calling_interview` table.
Below is the complete mapping between frontend form fields and database columns:

METADATA FIELDS:
--------------------------------------------------
Frontend Field              → Database Column              → Notes
--------------------------------------------------
time (seconds)              → starttime, endtime           → Calculate start/end timestamps
language ('english'/'bengali') → [NEW FIELD NEEDED]       → Need to add language_used column
final_submit (1/0)          → [Use q_interview_status]    → 1=Complete, 0=Incomplete
user_timezone               → [NEW FIELD NEEDED]          → Need to add timezone column
user_localdatetime          → [NEW FIELD NEEDED]          → Need to add local datetime column

IDENTIFICATION SECTION (Currently commented in form):
--------------------------------------------------
ac_code                     → ac_code (int)
ac_name                     → [No matching field]         → Need to fetch from AC master table
pc_code                     → [No matching field]
pc_name                     → [No matching field]
district_code               → [No matching field]
district_name               → [No matching field]
region_code                 → [No matching field]
region_name                 → [No matching field]
mla_name                    → [No matching field]
mp_name                     → [No matching field]

CALL STATUS SECTION:
--------------------------------------------------
number_status (1/2/3)       → [NEW FIELD NEEDED]         → 1=Ring, 2=Not Ring, 3=Invalid
call_not_ring (1/2/3)       → [NEW FIELD NEEDED]         → Sub-status when not ring
call_ring_status (1/2)      → [NEW FIELD NEEDED]         → 1=Answered, 2=Not Answered
q_call_status (1/2/5)       → q_call_status (int)        → 1=Complete, 2=Refused, 5=Reschedule
call_reschedule (datetime)  → [NEW FIELD NEEDED]         → Reschedule date and time
telecaller_id               → teleform_user_id (int)
telecaller_name             → [Fetch from users table]
callid                      → callid (varchar)

SECTION 2: CONSENT
--------------------------------------------------
consent (1/2)               → q_consent (int)             → 1=Yes, 2=No

SECTION 3: BASIC DEMOGRAPHIC
--------------------------------------------------
resp_age                    → q_age (int)
resp_registered_voter (1/2) → q_register_voter (int)     → 1=Yes, 2=No
resp_gender (1/2)           → q_gender (int)              → 1=Male, 2=Female

SECTION 4: PARTY PREFERENCES (Single Choice)
--------------------------------------------------
q5 (2019 Lok Sabha)         → [Check q1_* or similar]    → Need clarification on mapping
q5_oth                      → q1_other (varchar)
q5_ind                      → [NEW FIELD NEEDED]         → Independent candidate specify

q6 (2019 Assembly)          → q6 (int)
q6_oth                      → [NEW FIELD NEEDED]
q6_ind                      → [NEW FIELD NEEDED]

q7 (2021 Assembly)          → [Check mapping]
q7_oth                      → [NEW FIELD NEEDED]
q7_ind                      → [NEW FIELD NEEDED]

q8 (Current Lok Sabha)      → q2 (int)                    → Need confirmation
q8_oth                      → q2_other (varchar)
q8_ind                      → [NEW FIELD NEEDED]

q9 (Current Assembly)       → q3 (int)                    → Need confirmation
q9_oth                      → q3_other (varchar)
q9_ind                      → [NEW FIELD NEEDED]

SECTION 4: MULTI-CHOICE QUESTIONS (Array to Individual Columns)
--------------------------------------------------
Frontend: q10 = ["1", "2", "5"]
Backend: q7_3, q7_4, q7_5, q7_6, q7_7, q7_8, q7_10, q7_11, q7_12, q7_13, q7_44, q7_99
Logic: If "3" in array → q7_3 = 1, else q7_3 = 0
q10_oth                     → q7_other (varchar)

Frontend: q11 = ["1", "2", "3"]
Backend: q8_3, q8_4, q8_5, q8_7, q8_9, q8_10, q8_11, q8_12, q8_13, q8_14, q8_44, q8_99
Logic: If "3" in array → q8_3 = 1, else q8_3 = 0
q11_oth                     → q8_other (varchar)

Frontend: q12 = ["1", "2", "3"]
Backend: q9_1, q9_2, q9_3, q9_4, q9_5, q9_6, q9_7, q9_8, q9_9, q9_10, q9_11, q9_12, q9_13, q9_44, q9_99
Logic: If "1" in array → q9_1 = 1, else q9_1 = 0
q12_oth                     → q9_other (varchar)

Frontend: q13 = ["1", "2", "3"]
Backend: q10_1, q10_2, q10_3, q10_4, q10_5, q10_6, q10_7, q10_8, q10_9, q10_10, q10_11, q10_12, q10_13, q10_14, q10_44, q10_99
Logic: If "1" in array → q10_1 = 1, else q10_1 = 0
q13_oth                     → [NEW FIELD NEEDED]         → Need q10_other field

SECTION 5: SATISFACTION AND APPROVAL RATINGS
--------------------------------------------------
q14 (Central Govt)          → q4 (int) OR q8a           → Need confirmation
q15 (State Govt)            → q5 (int) OR q8b           → Need confirmation
q16_a (MP Performance)      → q8a (int)                  → Need confirmation
q16_b (MLA Performance)     → q8b (int)                  → Need confirmation
q17 (Important Issue)       → q11 (int)
q17_oth                     → q11_other (varchar)
q19 (2024 LS Vote)          → [Check mapping]
q19_oth                     → [NEW FIELD NEEDED]

SECTION 6: BASIC DEMOGRAPHIC
--------------------------------------------------
resp_religion               → q_religion (int)
resp_religion_oth           → q_religion_other (varchar)
resp_social_cat             → q_social_category (int)
resp_caste_jati             → q_caste_jati (int)
resp_caste_jati_oth         → q_caste_jati_other (varchar)
resp_female_edu             → q_female_education (int)
resp_male_edu               → resp_education (int)
resp_occupation             → q_occupation (int)
thanks_future               → q_future_contact (int)

*/

-- =====================================================
-- ALTER TABLE - Add Missing Columns
-- =====================================================

-- NOTE: Check if columns exist before running. Remove already existing columns from this script.
-- To check existing columns: SHOW COLUMNS FROM cati_survey_calling_interview LIKE 'column_name';

-- Add metadata fields
ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `form_duration_seconds` INT DEFAULT 0 COMMENT 'Time spent on form in seconds';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `language_used` ENUM('english', 'bengali') DEFAULT 'english' COMMENT 'Language used during interview';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `user_timezone` VARCHAR(100) DEFAULT NULL COMMENT 'User timezone';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `user_localdatetime` VARCHAR(100) DEFAULT NULL COMMENT 'User local date time';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `final_submit` TINYINT(1) DEFAULT 0 COMMENT '1=Form completed and submitted';

-- Add call status fields
ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `number_status` TINYINT DEFAULT NULL COMMENT '1=Ring, 2=Not Ring, 3=Invalid';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `call_not_ring` TINYINT DEFAULT NULL COMMENT '1=Switched Off, 2=Not Reachable, 3=Busy';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `call_ring_status` TINYINT DEFAULT NULL COMMENT '1=Answered, 2=Not Answered';

ALTER TABLE `cati_survey_calling_interview`
  ADD COLUMN `call_reschedule_datetime` DATETIME DEFAULT NULL COMMENT 'Rescheduled date and time';

-- Add independent candidate specification fields
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

-- =====================================================
-- DATA TRANSFORMATION LOGIC
-- =====================================================

/*
MULTI-CHOICE TO BINARY COLUMNS TRANSFORMATION:

Frontend sends arrays like:
{
  q10: ["3", "5", "99"],
  q11: ["3", "4"],
  q12: ["1", "2", "5"],
  q13: ["7", "8"]
}

Backend transformation:
q10 array → q7_* columns
  q7_3 = 1 (because "3" is in array)
  q7_5 = 1 (because "5" is in array)
  q7_99 = 1 (because "99" is in array)
  All others = 0

q11 array → q8_* columns
  q8_3 = 1 (because "3" is in array)
  q8_4 = 1 (because "4" is in array)
  All others = 0

q12 array → q9_* columns
  q9_1 = 1 (because "1" is in array)
  q9_2 = 1 (because "2" is in array)
  q9_5 = 1 (because "5" is in array)
  All others = 0

q13 array → q10_* columns
  q10_7 = 1 (because "7" is in array)
  q10_8 = 1 (because "8" is in array)
  All others = 0

VALIDATION RULES:
1. q11, q12, q13: Maximum 3 selections allowed
2. q10: Options "5" and "99" are mutually exclusive with other options
3. Age must be between 10-99
4. Phone must be 10 digits
*/

-- =====================================================
-- SAMPLE UPDATE QUERY (Form Submission)
-- =====================================================

/*
When form is submitted from frontend, the backend should execute:

UPDATE cati_survey_calling_interview
SET
  -- Metadata
  form_duration_seconds = ?,
  language_used = ?,
  user_timezone = ?,
  user_localdatetime = ?,
  final_submit = 1,
  survey_complete_date = NOW(),
  endtime = UNIX_TIMESTAMP(),
  
  -- Call Status
  number_status = ?,
  call_not_ring = ?,
  call_ring_status = ?,
  q_call_status = ?,
  call_reschedule_datetime = ?,
  callid = ?,
  
  -- Consent
  q_consent = ?,
  
  -- Demographics
  q_age = ?,
  q_register_voter = ?,
  q_gender = ?,
  
  -- Single choice questions (Q5-Q9)
  -- Need to map to correct columns based on your survey structure
  -- q1_* or q2, q3, q6 etc.
  
  -- Multi-choice transformations
  q7_3 = IF(FIND_IN_SET('3', ?), 1, 0),
  q7_4 = IF(FIND_IN_SET('4', ?), 1, 0),
  q7_5 = IF(FIND_IN_SET('5', ?), 1, 0),
  -- ... repeat for all q7_* columns
  q7_other = ?,
  
  q8_3 = IF(FIND_IN_SET('3', ?), 1, 0),
  q8_4 = IF(FIND_IN_SET('4', ?), 1, 0),
  -- ... repeat for all q8_* columns
  q8_other = ?,
  
  q9_1 = IF(FIND_IN_SET('1', ?), 1, 0),
  q9_2 = IF(FIND_IN_SET('2', ?), 1, 0),
  -- ... repeat for all q9_* columns
  q9_other = ?,
  
  q10_1 = IF(FIND_IN_SET('1', ?), 1, 0),
  q10_2 = IF(FIND_IN_SET('2', ?), 1, 0),
  -- ... repeat for all q10_* columns
  q10_other = ?,
  
  -- Satisfaction ratings
  q4 = ?,  -- q14
  q5 = ?,  -- q15
  q8a = ?, -- q16_a
  q8b = ?, -- q16_b
  q11 = ?, -- q17
  q11_other = ?,
  
  -- Demographics
  q_religion = ?,
  q_religion_other = ?,
  q_social_category = ?,
  q_caste_jati = ?,
  q_caste_jati_other = ?,
  q_female_education = ?,
  resp_education = ?,
  q_occupation = ?,
  q_future_contact = ?,
  
  -- System fields
  updated_at = UNIX_TIMESTAMP(),
  updated_by = ?
  
WHERE id = ?;
*/

-- =====================================================
-- IMPORTANT NOTES FOR BACKEND IMPLEMENTATION
-- =====================================================

/*
1. QUESTION MAPPING CLARIFICATION NEEDED:
   - Confirm which database columns map to q5, q6, q7 (voting history questions)
   - Confirm q14, q15 satisfaction mapping (q4, q5 or q8a, q8b?)
   - Confirm q19 (2024 LS vote) mapping

2. MULTI-CHOICE ARRAY HANDLING:
   - Frontend sends: ["1", "2", "5"]
   - Backend must convert to individual binary columns
   - Set matched columns to 1, others to 0

3. CONDITIONAL LOGIC:
   - Form has complex skip logic based on responses
   - Backend should validate that only asked questions have values
   - Unasked questions should remain NULL

4. EXCLUSIVE OPTIONS:
   - Q10: If "5" or "99" is selected, other options are cleared
   - Validate this on backend before saving

5. TIMESTAMPS:
   - starttime: Unix timestamp when form opened
   - endtime: Unix timestamp when form submitted
   - survey_complete_date: Datetime when form completed

6. STATUS FIELDS:
   - q_interview_status: Should be set based on completion
   - status: Should be updated (0=new, 1=in-progress, 2=completed)
   - final_submit: 1 when form is fully submitted

7. CALL TRACKING:
   - call_attempt: Increment on each call attempt
   - call_received: Set to 1 when call is answered
   - call_date: Set to today's date

8. AC DETAILS:
   - ac_code: Should be pre-filled from interview assignment
   - All AC-related info (name, district, mla, etc.) can be fetched from AC master table
*/
