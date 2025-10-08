# CATI Survey Database Schema - WB Opinion Poll 2025

## Overview
This document defines the complete database schema for storing CATI survey responses for the West Bengal Opinion Poll 2025. The schema is based on the existing `survey_calling_interview` table structure and aligned with the multilingual form implementation.

---

## 📊 Main Table: `survey_calling_interview`

### Table Purpose
Stores all CATI survey responses including call status, identification data, all survey questions, QC data, and metadata.

---

## 🗂️ Complete Column Definitions

### Primary Key
| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique survey response ID |

---

### 1️⃣ **Assignment & Tracking**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `survey_data_id` | INT | NOT NULL | - | Reference to master survey data |
| `agency_id` | INT | NULL | 1 | Agency ID |
| `supervisor_id` | INT | NULL | NULL | Supervisor user ID |
| `teleform_user_id` | INT | NULL | NULL | Telecaller/Teleform user ID |
| `generate_date` | DATE | NULL | NULL | Date when record was generated |
| `track` | INT | NOT NULL | 0 | Survey track number |
| `calling_group` | INT | NULL | 1 | Calling group assignment |
| `priority` | INT | NOT NULL | 0 | Call priority (0-10) |
| `status` | TINYINT | NOT NULL | - | Survey status (0=Pending, 1=Completed, 2=Rejected, etc.) |

**Indexes**: `idx_teleform_user_id_ac_status` on (`teleform_user_id`, `ac_code`, `status`)

---

### 2️⃣ **Respondent Identification (Section 1)**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `ac_code` | INT | NULL | NULL | Assembly Constituency code |
| `part_no` | INT | NULL | NULL | Part number |
| `phone` | CHAR(10) | NOT NULL | - | Respondent phone number (10 digits) |
| `name` | VARCHAR(512) | NULL | NULL | Respondent name (from form: q_name) |
| `q_name` | VARCHAR(255) | NULL | NULL | Respondent name collected in survey |

**Indexes**: 
- `idx_phone` on `phone`
- `idx_ac_code` on `ac_code`

**Note**: Additional identification fields (PC, District, Region, MLA, MP) should be fetched from lookup tables using `ac_code` as reference.

---

### 3️⃣ **Call Status & Metadata**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `call_attempt` | INT | NULL | 0 | Number of call attempts made |
| `call_received` | INT | NOT NULL | 0 | Whether call was received (0/1) |
| `call_date` | DATE | NULL | NULL | Date of call attempt |
| `callid` | VARCHAR(50) | NULL | NULL | Unique call ID from calling system |
| `starttime` | INT | NULL | NULL | Form start time (Unix timestamp) |
| `endtime` | INT | NULL | NULL | Form end time (Unix timestamp) |
| `survey_complete_date` | DATETIME | NULL | NULL | Survey completion timestamp |

**Indexes**: `idx_call_date` on `call_date`

---

### 4️⃣ **Call Flow Questions**

| Column Name | Data Type | Constraints | Default | Description | Form Field |
|------------|-----------|-------------|---------|-------------|------------|
| `q_call_status` | INT | NULL | NULL | Call status outcome | `q_call_status` |
| | | | | 1 = Continue | |
| | | | | 2 = Wrong Number | |
| | | | | 5 = Reschedule/Not Available | |

**Index**: `idx_q_call_status` on `q_call_status`

**Form Mapping**:
- `number_status` (frontend) → Determines if call rings
- `call_ring_status` (frontend) → Determines if picked
- `q_call_status` (frontend) → Maps to `q_call_status` (backend)

---

### 5️⃣ **Section 2: Consent**

| Column Name | Data Type | Constraints | Default | Description | Form Field |
|------------|-----------|-------------|---------|-------------|------------|
| `q_consent` | INT | NULL | NULL | Informed consent response | `consent` |
| | | | | 1 = Yes (Continue) | |
| | | | | 2 = No (Stop) | |

---

### 6️⃣ **Section 3: Basic Demographics**

| Column Name | Data Type | Constraints | Default | Description | Form Field |
|------------|-----------|-------------|---------|-------------|------------|
| `q_age` | INT | NULL | NULL | Respondent age (complete years) | `resp_age` |
| `q_locality` | INT | NULL | NULL | Urban/Rural locality | - |
| `q_register_voter` | INT | NULL | NULL | Registered voter status | `resp_registered_voter` |
| | | | | 1 = Yes | |
| | | | | 2 = No | |
| `q_gender` | INT | NULL | NULL | Respondent gender | `resp_gender` |
| | | | | 1 = Male | |
| | | | | 2 = Female | |

**Validation**:
- `q_age`: Range 10-99
- Required if `q_consent = 1`

---

### 7️⃣ **Section 4: Party Preferences**

#### Q5: Which party did you vote for in the last assembly elections (MLA) in 2021?
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q1_1` | INT | AITC | `q5` value=1 |
| `q1_2` | INT | BJP | `q5` value=2 |
| `q1_3` | INT | INC | `q5` value=3 |
| `q1_4` | INT | Left Front | `q5` value=4 |
| `q1_5` | INT | NOTA | `q5` value=55 |
| `q1_44` | INT | Others | `q5` value=44 |
| `q1_other` | VARCHAR(255) | Other party specify | `q5_oth` |

**Frontend Mapping**:
```javascript
// If q5 = "1" → q1_1 = 1, others = NULL
// If q5 = "44" → q1_44 = 1, q1_other = [value from q5_oth]
```

#### Q6: Which party did you vote for in the last Lok Sabha elections (MP) in 2024?
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q2` | INT | Party code (1-6, 12, 44, 55, 66, 77, 88) | `q6` |
| `q2_other` | VARCHAR(255) | Other party specify | `q6_oth` |

**Value Mapping**:
- 1 = AITC, 2 = BJP, 3 = INC, 4 = Left Front, 5 = CPI(ML), 6 = RSP
- 12 = Independent (stored in `q6_ind`)
- 44 = Others (stored in `q2_other`)
- 55 = NOTA, 66 = Did not vote, 77 = Not eligible, 88 = No response

#### Q7: By-election party vote
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q3` | INT | Party code | `q7` |
| `q3_other` | VARCHAR(255) | Other party specify | `q7_oth` |

#### Q8: If assembly elections were held tomorrow
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q4` | INT | Party code | `q8` |

#### Q9: Second choice party
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q5` | INT | Party code | `q9` |

**Note**: Column `q5` in database conflicts with frontend Q5. Need to verify mapping.

---

### 8️⃣ **Q10: Reason for Second Choice (Multi-select, Max 3)**

| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q7_3` | INT | Party manifesto/agenda | `q10` includes "1" |
| `q7_4` | INT | Track record in govt | `q10` includes "2" |
| `q7_5` | INT | Local candidate | `q10` includes "3" |
| `q7_6` | INT | Party's national leadership | `q10` includes "4" |
| `q7_7` | INT | Party's state leadership | `q10` includes "5" |
| `q7_8` | INT | Caste/community identity | `q10` includes "6" |
| `q7_10` | INT | Development work | `q10` includes "7" |
| `q7_11` | INT | - | - |
| `q7_12` | INT | - | - |
| `q7_13` | INT | - | - |
| `q7_44` | INT | Others | `q10` includes "44" |
| `q7_99` | INT | Don't know | `q10` includes "99" |
| `q7_other` | VARCHAR(255) | Other specify | `q10_oth` |

**Frontend Transformation**:
```javascript
// Frontend: q10 = ["1", "3", "5"]
// Backend: q7_3 = 1, q7_5 = 1, q7_7 = 1 (all others = NULL)
```

---

### 9️⃣ **Q11: Reasons for Voting AITC (Multi-select, Max 3)**

| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q8_3` | INT | Mamata Banerjee leadership | `q11` includes "1" |
| `q8_4` | INT | Welfare schemes | `q11` includes "2" |
| `q8_5` | INT | Women empowerment | `q11` includes "3" |
| `q8_7` | INT | Development work | `q11` includes "4" |
| `q8_9` | INT | Protection of Bengali identity | `q11` includes "5" |
| `q8_10` | INT | Local leadership | `q11` includes "6" |
| `q8_11` | INT | Party workers' connect | `q11` includes "7" |
| `q8_12` | INT | Anti-BJP stance | `q11` includes "8" |
| `q8_13` | INT | Muslim minority support | `q11` includes "9" |
| `q8_14` | INT | Secular credentials | `q11` includes "10" |
| `q8_44` | INT | Others | `q11` includes "44" |
| `q8_99` | INT | Don't know | `q11` includes "99" |
| `q8_other` | VARCHAR(255) | Other specify | `q11_oth` |

---

### 🔟 **Q12: Reasons for Voting BJP (Multi-select, Max 3)**

**Similar structure to Q11** - Need to add columns `q9_*` series

**Recommended New Columns**:
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q9_1` | INT | Modi leadership | `q12` includes "1" |
| `q9_2` | INT | Development agenda | `q12` includes "2" |
| `q9_3` | INT | National security | `q12` includes "3" |
| `q9_4` | INT | Anti-corruption | `q12` includes "4" |
| `q9_5` | INT | Hindu identity | `q12` includes "5" |
| `q9_6` | INT | Local candidate | `q12` includes "6" |
| `q9_7` | INT | Change from AITC | `q12` includes "7" |
| `q9_8` | INT | Central govt schemes | `q12` includes "8" |
| `q9_9` | INT | Party organization | `q12` includes "9" |
| `q9_10` | INT | Opposition to AITC corruption | `q12` includes "10" |
| `q9_11` | INT | Religious/cultural values | `q12` includes "11" |
| `q9_44` | INT | Others | `q12` includes "44" |
| `q9_99` | INT | Don't know | `q12` includes "99" |
| `q9_other` | VARCHAR(255) | Other specify | `q12_oth` |

---

### 1️⃣1️⃣ **Q13: Most Pressing Issues (Multi-select, Max 3)**

**Recommended New Columns**:
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q10_1` | INT | Unemployment | `q13` includes "1" |
| `q10_2` | INT | Inflation/Price rise | `q13` includes "2" |
| `q10_3` | INT | Education | `q13` includes "3" |
| `q10_4` | INT | Healthcare | `q13` includes "4" |
| `q10_5` | INT | Infrastructure | `q13` includes "5" |
| `q10_6` | INT | Law and order | `q13` includes "6" |
| `q10_7` | INT | Corruption | `q13` includes "7" |
| `q10_8` | INT | Agriculture | `q13` includes "8" |
| `q10_9` | INT | Water supply | `q13` includes "9" |
| `q10_10` | INT | Electricity | `q13` includes "10" |
| `q10_11` | INT | Women safety | `q13` includes "11" |
| `q10_12` | INT | Social welfare | `q13` includes "12" |
| `q10_13` | INT | Environment | `q13` includes "13" |
| `q10_14` | INT | Other local issues | `q13` includes "14" |
| `q10_44` | INT | Others | `q13` includes "44" |
| `q10_99` | INT | Don't know | `q13` includes "99" |
| `q10_other` | VARCHAR(255) | Other specify | `q13_oth` |

---

### 1️⃣2️⃣ **Section 5: Satisfaction & Approval Ratings**

#### Q14: Satisfaction with State Govt (Mamata Banerjee)
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q6` | INT | Satisfaction level (1-5) | `q14` |

**Values**:
- 1 = Fully satisfied
- 2 = Somewhat satisfied
- 3 = Neither satisfied nor dissatisfied
- 4 = Somewhat dissatisfied
- 5 = Fully dissatisfied

#### Q15: Satisfaction with BJP Opposition
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q8a` | INT | Satisfaction level (1-5) | `q15` |

#### Q16: Satisfaction with MP/MLA
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q8b` | INT | Satisfaction with Lok Sabha MP | `q16_a` |
| `q30a_1_1` to `q30a_1_5` | INT | MP satisfaction breakdown (optional) | - |
| `q30a_2_1` to `q30a_2_5` | INT | MLA satisfaction breakdown (optional) | `q16_b` |

**Note**: Current schema has separate columns for detailed MP/MLA ratings. Simplified mapping:
- `q8b` → Satisfaction with MP (`q16_a`)
- Add new column `q8c` → Satisfaction with MLA (`q16_b`)

**Recommended Addition**:
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q8c` | INT | Satisfaction with current MLA (1-5) | `q16_b` |

#### Q17: Best Leader for Chief Minister
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q9` | INT | Leader code (1-13, 44, 88, 99) | `q17` |
| `q9_other` | VARCHAR(255) | Other leader specify | `q17_oth` |

**Values**:
- 1 = Mamata Banerjee
- 2 = Suvendu Adhikari
- 3 = Dilip Ghosh
- ... (13 leaders)
- 44 = Others
- 88 = No response
- 99 = Don't know

#### Q19: Which party will win next election
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q10` | INT | Party code (1-6, 12, 44, 88, 99) | `q19` |
| `q10_other` | VARCHAR(255) | Other party specify | `q19_oth` |

**Note**: Column name `q10` conflicts with Q10 (reasons). Consider renaming to `q19_party` in future.

---

### 1️⃣3️⃣ **Section 6: Demographics**

#### Q20: Religion
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_religion` | INT | Religion code (1-7, 44, 88) | `resp_religion` |
| `q_religion_other` | VARCHAR(255) | Other religion specify | `resp_religion_oth` |

**Values**:
- 1 = Hindu
- 2 = Muslim
- 3 = Christian
- 4 = Sikh
- 5 = Buddhist
- 6 = Jain
- 7 = Others
- 44 = Others (specify)
- 88 = Refused

#### Q21: Social Category
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_social_category` | INT | Social category code (1-5) | `resp_social_cat` |

**Values**:
- 1 = Schedule Castes
- 2 = Schedule Tribes
- 3 = OBC
- 4 = General
- 5 = Refused to answer

#### Q22: Caste/Jati
**Recommended New Columns**:
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_caste_jati` | INT | Caste code (1-47, 44, 88) | `resp_caste_jati` |
| `q_caste_jati_other` | VARCHAR(255) | Other caste specify | `resp_caste_jati_oth` |

#### Q23: Female Education (Highest in household)
**Recommended New Column**:
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_female_education` | INT | Education level (1-7) | `resp_female_edu` |

**Values**:
- 1 = Illiterate
- 2 = Literate but no formal schooling
- 3 = Below Secondary
- 4 = Secondary
- 5 = Higher Secondary
- 6 = Graduate
- 7 = Post Graduate and above

#### Q24: Male Education (Highest in household)
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `resp_education` | INT | Male education level (1-7) | `resp_male_edu` |

**Note**: `resp_education` exists but should be renamed to `q_male_education` for consistency.

#### Q25: Occupation of Chief Wage Earner
**Recommended New Column**:
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_occupation` | INT | Occupation code (2-7) | `resp_occupation` |

**Values**:
- 2 = Cultivators
- 3 = Agricultural labour
- 4 = Labour (other than agriculture)
- 5 = Petty businessman/trader/shopkeeper
- 6 = Business/Service class
- 7 = Retired/Unemployed/Housewife

#### Q28: Future Contact Consent
| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_future_contact` | INT | Future contact permission | `thanks_future` |

**Values**:
- 1 = Yes
- 2 = No

---

### 1️⃣4️⃣ **Additional Q&A (Not in Current Form)**

These columns exist in the schema but may be for future use or different survey versions:

| Column Name | Data Type | Description |
|------------|-----------|-------------|
| `q11` | INT | Reserved for future question |
| `q11_other` | VARCHAR(255) | Other specify |
| `q12` | INT | Reserved for future question |
| `q12_other` | VARCHAR(255) | Other specify |
| `q13` | INT | Reserved for future question |
| `q13_other` | VARCHAR(255) | Other specify |
| `q13_a` | INT | Reserved for future question |
| `q13_a_other` | VARCHAR(255) | Other specify |
| `q14` | INT | Reserved for future question |
| `q14_other` | VARCHAR(255) | Other specify |
| `q15` | INT | Reserved for future question |
| `q15_other` | VARCHAR(255) | Other specify |

---

### 1️⃣5️⃣ **Quality Control (QC)**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `qc_teleform_user_id` | INT | NULL | NULL | QC user ID |
| `qc` | INT | NOT NULL | 0 | QC status (0=Not done, 1=Done) |
| `qc_assign_date` | DATE | NULL | NULL | QC assignment date |
| `qc_q_intro` | INT | NULL | NULL | QC check: Introduction quality |
| `qc_q12` | INT | NULL | NULL | QC check: Q12 validation |
| `qc_q11` | INT | NULL | NULL | QC check: Q11 validation |
| `qc_q16` | INT | NULL | NULL | QC check: Q16 validation |
| `qc_q14` | INT | NULL | NULL | QC check: Q14 validation |
| `qc_q28` | INT | NULL | NULL | QC check: Q28 validation |
| `qc_remark` | INT | NULL | NULL | QC overall remark code |
| `qc_complete_date` | DATETIME | NULL | NULL | QC completion timestamp |
| `qc_status` | INT | NULL | NULL | QC final status (1=Approved, 2=Rejected) |

---

### 1️⃣6️⃣ **Re-QC (Second Quality Check)**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `re_qc_teleform_user_id` | INT | NULL | NULL | Re-QC user ID |
| `re_qc` | INT | NOT NULL | 0 | Re-QC status (0=Not done, 1=Done) |
| `re_qc_assign_date` | DATE | NULL | NULL | Re-QC assignment date |
| `re_qc_q_intro` | INT | NULL | NULL | Re-QC check: Introduction |
| `re_qc_q12` | INT | NULL | NULL | Re-QC check: Q12 |
| `re_qc_q11` | INT | NULL | NULL | Re-QC check: Q11 |
| `re_qc_q16` | INT | NULL | NULL | Re-QC check: Q16 |
| `re_qc_q14` | INT | NULL | NULL | Re-QC check: Q14 |
| `re_qc_q28` | INT | NULL | NULL | Re-QC check: Q28 |
| `re_qc_remark` | VARCHAR(255) | NULL | NULL | Re-QC remarks text |
| `re_qc_complete_date` | DATETIME | NULL | NULL | Re-QC completion timestamp |
| `re_qc_status` | INT | NULL | NULL | Re-QC final status |

---

### 1️⃣7️⃣ **Weighting & Adjustments**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `weight` | DECIMAL(10,5) | NULL | 1.00000 | Survey weight for analysis |
| `non_weight` | INT | NOT NULL | 1 | Non-weighted indicator |

---

### 1️⃣8️⃣ **Rejection & Invalid Data**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `invalid_phone` | TINYINT | NOT NULL | 0 | Phone marked as invalid (0/1) |
| `invalid_phone_verify_by` | INT | NULL | NULL | User who verified invalid phone |
| `invalid_phone_verify_date` | DATE | NULL | NULL | Verification date |
| `reject_reason` | INT | NULL | NULL | Rejection reason code |
| `reject_date` | DATE | NULL | NULL | Rejection date |

---

### 1️⃣9️⃣ **Re-completion & Re-calling**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `recomplete` | TINYINT(1) | NULL | 0 | Survey re-completed flag |
| `recomplete_date` | DATETIME | NULL | NULL | Re-completion timestamp |
| `recomplete_by` | INT | NULL | NULL | User who re-completed |
| `pre_survey_calling_id` | INT | NULL | NULL | Previous survey attempt ID |
| `re_sent_for_calling` | INT | NULL | 0 | Re-sent for calling flag |

---

### 2️⃣0️⃣ **Cloud Integration**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `cloud_api_id` | INT | NULL | 0 | Cloud API integration ID |
| `calling_request_id` | INT | NULL | NULL | Calling request reference |

---

### 2️⃣1️⃣ **Interview Status**

| Column Name | Data Type | Description | Form Field |
|------------|-----------|-------------|------------|
| `q_interview_status` | INT | Interview completion status | - |

**Values**:
- 1 = Completed
- 2 = Partial
- 3 = Dropped
- 4 = Refused

---

### 2️⃣2️⃣ **Audit Fields**

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| `created_at` | INT | NULL | NULL | Creation timestamp (Unix) |
| `created_by` | INT | NULL | NULL | User who created record |
| `updated_at` | INT | NULL | NULL | Last update timestamp (Unix) |
| `updated_by` | INT | NULL | NULL | User who last updated |

---

## 🔄 Frontend to Backend Field Mapping

### Complete Mapping Table

| Frontend Field | Backend Column | Data Type | Transformation |
|---------------|----------------|-----------|----------------|
| **Identification** | | | |
| `ac_code` | `ac_code` | INT | Direct |
| `ac_name` | - | - | Lookup from master |
| `pc_code`, `pc_name` | - | - | Lookup from master |
| `district_code`, `district_name` | - | - | Lookup from master |
| `region_code`, `region_name` | - | - | Lookup from master |
| `mla_name` | - | - | Lookup from master |
| `mp_name` | - | - | Lookup from master |
| **Call Status** | | | |
| `number_status` | - | - | Logic only (not stored) |
| `call_not_ring` | - | - | Logic only |
| `call_ring_status` | `call_received` | INT | 1→1, 2→0 |
| `q_call_status` | `q_call_status` | INT | Direct (1/2/5) |
| `call_reschedule` | - | - | Update queue table |
| `telecaller_id` | `teleform_user_id` | INT | Direct |
| `telecaller_name` | - | - | Lookup from users |
| `callid` | `callid` | VARCHAR(50) | Direct |
| **Section 2: Consent** | | | |
| `consent` | `q_consent` | INT | Direct (1/2) |
| **Section 3: Basic Demo** | | | |
| `resp_age` | `q_age` | INT | Direct |
| `resp_registered_voter` | `q_register_voter` | INT | Direct (1/2) |
| `resp_gender` | `q_gender` | INT | Direct (1/2) |
| **Section 4: Party Prefs** | | | |
| `q5` | `q1_1` to `q1_5`, `q1_44` | INT | Split to columns |
| `q5_oth` | `q1_other` | VARCHAR(255) | Direct |
| `q5_ind` | `q1_other` | VARCHAR(255) | Merge with prefix "Ind:" |
| `q6` | `q2` | INT | Direct |
| `q6_oth` | `q2_other` | VARCHAR(255) | Direct |
| `q6_ind` | `q2_other` | VARCHAR(255) | Merge with prefix "Ind:" |
| `q7` | `q3` | INT | Direct |
| `q7_oth` | `q3_other` | VARCHAR(255) | Direct |
| `q8` | `q4` | INT | Direct |
| `q9` | `q5` | INT | Direct |
| `q10` (array) | `q7_3` to `q7_13`, `q7_44`, `q7_99` | INT | Array → Multiple columns (1/NULL) |
| `q10_oth` | `q7_other` | VARCHAR(255) | Direct |
| `q11` (array) | `q8_3` to `q8_14`, `q8_44`, `q8_99` | INT | Array → Multiple columns (1/NULL) |
| `q11_oth` | `q8_other` | VARCHAR(255) | Direct |
| `q12` (array) | `q9_1` to `q9_13`, `q9_44`, `q9_99` | INT | Array → Multiple columns (1/NULL) |
| `q12_oth` | `q9_other` | VARCHAR(255) | Direct |
| `q13` (array) | `q10_1` to `q10_14`, `q10_44`, `q10_99` | INT | Array → Multiple columns (1/NULL) |
| `q13_oth` | `q10_other` | VARCHAR(255) | Direct |
| **Section 5: Satisfaction** | | | |
| `q14` | `q6` | INT | Direct (1-5) |
| `q15` | `q8a` | INT | Direct (1-5) |
| `q16_a` | `q8b` | INT | Direct (1-5) |
| `q16_b` | `q8c` (new) | INT | Direct (1-5) |
| `q17` | `q9` | INT | Direct |
| `q17_oth` | `q9_other` | VARCHAR(255) | Direct |
| `q19` | `q10` | INT | Direct |
| `q19_oth` | `q10_other` | VARCHAR(255) | Direct |
| **Section 6: Demographics** | | | |
| `resp_religion` | `q_religion` | INT | Direct |
| `resp_religion_oth` | `q_religion_other` | VARCHAR(255) | Direct |
| `resp_social_cat` | `q_social_category` | INT | Direct |
| `resp_caste_jati` | `q_caste_jati` (new) | INT | Direct |
| `resp_caste_jati_oth` | `q_caste_jati_other` (new) | VARCHAR(255) | Direct |
| `resp_female_edu` | `q_female_education` (new) | INT | Direct |
| `resp_male_edu` | `resp_education` | INT | Direct |
| `resp_occupation` | `q_occupation` (new) | INT | Direct |
| `thanks_future` | `q_future_contact` | INT | Direct |
| **Metadata** | | | |
| `time` (seconds) | `starttime`, `endtime` | INT | starttime=now, endtime=now+time |
| `language_used` | - | - | Log separately if needed |

---

## 🆕 Recommended Schema Additions

### New Columns to Add

```sql
ALTER TABLE `survey_calling_interview`
  ADD COLUMN `q8c` INT NULL COMMENT 'Q16_B: Satisfaction with MLA' AFTER `q8b`,
  ADD COLUMN `q_caste_jati` INT NULL COMMENT 'Q22: Caste/Jati code' AFTER `q_social_category`,
  ADD COLUMN `q_caste_jati_other` VARCHAR(255) NULL COMMENT 'Q22: Other caste specify' AFTER `q_caste_jati`,
  ADD COLUMN `q_female_education` INT NULL COMMENT 'Q23: Female education level' AFTER `resp_education`,
  ADD COLUMN `q_occupation` INT NULL COMMENT 'Q25: Occupation code' AFTER `q_female_education`,
  ADD COLUMN `q9_1` INT NULL COMMENT 'Q12: BJP reason - Modi leadership' AFTER `q8_other`,
  ADD COLUMN `q9_2` INT NULL COMMENT 'Q12: BJP reason - Development' AFTER `q9_1`,
  ADD COLUMN `q9_3` INT NULL COMMENT 'Q12: BJP reason - National security' AFTER `q9_2`,
  ADD COLUMN `q9_4` INT NULL COMMENT 'Q12: BJP reason - Anti-corruption' AFTER `q9_3`,
  ADD COLUMN `q9_5` INT NULL COMMENT 'Q12: BJP reason - Hindu identity' AFTER `q9_4`,
  ADD COLUMN `q9_6` INT NULL COMMENT 'Q12: BJP reason - Local candidate' AFTER `q9_5`,
  ADD COLUMN `q9_7` INT NULL COMMENT 'Q12: BJP reason - Change from AITC' AFTER `q9_6`,
  ADD COLUMN `q9_8` INT NULL COMMENT 'Q12: BJP reason - Central schemes' AFTER `q9_7`,
  ADD COLUMN `q9_9` INT NULL COMMENT 'Q12: BJP reason - Party organization' AFTER `q9_8`,
  ADD COLUMN `q9_10` INT NULL COMMENT 'Q12: BJP reason - Anti-AITC corruption' AFTER `q9_9`,
  ADD COLUMN `q9_11` INT NULL COMMENT 'Q12: BJP reason - Religious values' AFTER `q9_10`,
  ADD COLUMN `q9_44` INT NULL COMMENT 'Q12: BJP reason - Others' AFTER `q9_11`,
  ADD COLUMN `q9_99` INT NULL COMMENT 'Q12: BJP reason - Don\'t know' AFTER `q9_44`,
  ADD COLUMN `q9_other` VARCHAR(255) NULL COMMENT 'Q12: Other reason specify' AFTER `q9_99`,
  ADD COLUMN `q10_1` INT NULL COMMENT 'Q13: Issue - Unemployment' AFTER `q9_other`,
  ADD COLUMN `q10_2` INT NULL COMMENT 'Q13: Issue - Inflation' AFTER `q10_1`,
  ADD COLUMN `q10_3` INT NULL COMMENT 'Q13: Issue - Education' AFTER `q10_2`,
  ADD COLUMN `q10_4` INT NULL COMMENT 'Q13: Issue - Healthcare' AFTER `q10_3`,
  ADD COLUMN `q10_5` INT NULL COMMENT 'Q13: Issue - Infrastructure' AFTER `q10_4`,
  ADD COLUMN `q10_6` INT NULL COMMENT 'Q13: Issue - Law and order' AFTER `q10_5`,
  ADD COLUMN `q10_7` INT NULL COMMENT 'Q13: Issue - Corruption' AFTER `q10_6`,
  ADD COLUMN `q10_8` INT NULL COMMENT 'Q13: Issue - Agriculture' AFTER `q10_7`,
  ADD COLUMN `q10_9` INT NULL COMMENT 'Q13: Issue - Water supply' AFTER `q10_8`,
  ADD COLUMN `q10_10` INT NULL COMMENT 'Q13: Issue - Electricity' AFTER `q10_9`,
  ADD COLUMN `q10_11` INT NULL COMMENT 'Q13: Issue - Women safety' AFTER `q10_10`,
  ADD COLUMN `q10_12` INT NULL COMMENT 'Q13: Issue - Social welfare' AFTER `q10_11`,
  ADD COLUMN `q10_13` INT NULL COMMENT 'Q13: Issue - Environment' AFTER `q10_12`,
  ADD COLUMN `q10_14` INT NULL COMMENT 'Q13: Issue - Local issues' AFTER `q10_13`,
  ADD COLUMN `q10_44` INT NULL COMMENT 'Q13: Issue - Others' AFTER `q10_14`,
  ADD COLUMN `q10_99` INT NULL COMMENT 'Q13: Issue - Don\'t know' AFTER `q10_44`;
```

---

## 📝 Recommended Schema Improvements

### Option 1: Keep Current Structure (Minimal Changes)

**Add only missing columns**:
- `q8c` for Q16_B (MLA satisfaction)
- `q9_1` to `q9_other` for Q12 (BJP reasons)
- `q10_1` to `q10_other` for Q13 (Issues)
- `q_caste_jati` and `q_caste_jati_other`
- `q_female_education`
- `q_occupation`

**Pros**: Minimal disruption, maintains existing structure  
**Cons**: Inconsistent column naming

---

### Option 2: Normalize Schema (Recommended for New Projects)

Create separate tables:

#### Main Response Table
```sql
CREATE TABLE `cati_survey_responses_new` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `submission_token` VARCHAR(50) UNIQUE NOT NULL,
  `survey_data_id` INT NOT NULL,
  `agency_id` INT DEFAULT 1,
  `teleform_user_id` INT NOT NULL,
  `ac_code` INT NOT NULL,
  `phone` CHAR(10) NOT NULL,
  `respondent_name` VARCHAR(512),
  
  -- Call metadata
  `call_attempt` INT DEFAULT 0,
  `call_received` TINYINT DEFAULT 0,
  `callid` VARCHAR(50),
  `call_date` DATE,
  `start_time` DATETIME,
  `end_time` DATETIME,
  `survey_duration` INT COMMENT 'Duration in seconds',
  
  -- Survey flow
  `q_call_status` INT COMMENT '1=Continue, 2=Wrong, 5=Reschedule',
  `q_consent` INT COMMENT '1=Yes, 2=No',
  `q_interview_status` INT COMMENT '1=Completed, 2=Partial, 3=Dropped',
  
  -- Status
  `status` TINYINT NOT NULL,
  `priority` INT DEFAULT 0,
  
  -- Timestamps
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_phone` (`phone`),
  INDEX `idx_ac_code` (`ac_code`),
  INDEX `idx_teleform_user` (`teleform_user_id`),
  INDEX `idx_call_date` (`call_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### Question Responses Table (Normalized)
```sql
CREATE TABLE `cati_question_responses` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `survey_response_id` BIGINT UNSIGNED NOT NULL,
  `question_code` VARCHAR(20) NOT NULL COMMENT 'e.g., q5, q6, q14',
  `response_value` VARCHAR(255),
  `response_int` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`survey_response_id`) REFERENCES `cati_survey_responses_new`(`id`),
  INDEX `idx_survey_question` (`survey_response_id`, `question_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Pros**: Flexible, scalable, easy to add new questions  
**Cons**: Requires refactoring, complex queries

---

## 💾 Data Transformation Logic

### Checkbox Array to Multiple Columns

**Example: Q10 (Reasons for Second Choice)**

**Frontend sends**:
```json
{
  "q10": ["1", "3", "5"],
  "q10_oth": ""
}
```

**Backend transformation**:
```javascript
// Initialize all columns to NULL
const q10Columns = {
  q7_3: null,
  q7_4: null,
  q7_5: null,
  q7_6: null,
  q7_7: null,
  q7_8: null,
  q7_10: null,
  q7_11: null,
  q7_12: null,
  q7_13: null,
  q7_44: null,
  q7_99: null,
  q7_other: null
};

// Map array values to columns
const mapping = {
  '1': 'q7_3',
  '2': 'q7_4',
  '3': 'q7_5',
  '4': 'q7_6',
  '5': 'q7_7',
  '6': 'q7_8',
  '7': 'q7_10',
  '44': 'q7_44',
  '99': 'q7_99'
};

formData.q10.forEach(value => {
  if (mapping[value]) {
    q10Columns[mapping[value]] = 1;
  }
});

if (formData.q10_oth) {
  q10Columns.q7_other = formData.q10_oth;
}

// Result:
// q7_3 = 1, q7_5 = 1, q7_7 = 1, rest = NULL
```

---

## 📤 Complete INSERT Query Example

### Backend Implementation

```typescript
async function saveSurveyResponse(formData: any) {
  // Transform checkbox arrays
  const q10Values = transformCheckboxArray(formData.q10, q10Mapping);
  const q11Values = transformCheckboxArray(formData.q11, q11Mapping);
  const q12Values = transformCheckboxArray(formData.q12, q12Mapping);
  const q13Values = transformCheckboxArray(formData.q13, q13Mapping);
  
  // Transform Q5 party selection
  const q5Values = transformPartyQuestion(formData.q5);
  
  // Calculate timestamps
  const starttime = Math.floor(Date.now() / 1000);
  const endtime = starttime + formData.time;
  
  const query = `
    INSERT INTO survey_calling_interview (
      survey_data_id, agency_id, teleform_user_id,
      ac_code, phone, name,
      call_attempt, call_received, callid, call_date,
      starttime, endtime, survey_complete_date,
      q_call_status, q_consent, q_age, q_register_voter, q_gender,
      
      -- Q5 (2021 MLA)
      q1_1, q1_2, q1_3, q1_4, q1_5, q1_44, q1_other,
      
      -- Q6 (2024 MP)
      q2, q2_other,
      
      -- Q7 (By-election)
      q3, q3_other,
      
      -- Q8 (If election tomorrow)
      q4,
      
      -- Q9 (Second choice)
      q5,
      
      -- Q10 (Reason for second choice)
      q7_3, q7_4, q7_5, q7_6, q7_7, q7_8, q7_10,
      q7_44, q7_99, q7_other,
      
      -- Q11 (Reasons for AITC)
      q8_3, q8_4, q8_5, q8_7, q8_9, q8_10, q8_11, q8_12, q8_13, q8_14,
      q8_44, q8_99, q8_other,
      
      -- Q12 (Reasons for BJP)
      q9_1, q9_2, q9_3, q9_4, q9_5, q9_6, q9_7, q9_8, q9_9, q9_10, q9_11,
      q9_44, q9_99, q9_other,
      
      -- Q13 (Pressing issues)
      q10_1, q10_2, q10_3, q10_4, q10_5, q10_6, q10_7, q10_8, q10_9, q10_10,
      q10_11, q10_12, q10_13, q10_14, q10_44, q10_99,
      
      -- Satisfaction
      q6, q8a, q8b, q8c,
      
      -- Best CM, Election prediction
      q9, q9_other, q10, q10_other,
      
      -- Demographics
      q_religion, q_religion_other, q_social_category,
      q_caste_jati, q_caste_jati_other,
      q_female_education, resp_education, q_occupation,
      q_future_contact,
      
      -- Status
      status, priority, track, weight,
      created_at, created_by
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `;
  
  await db.execute(query, [
    formData.survey_data_id,
    formData.agency || 1,
    formData.telecaller_id,
    formData.ac_code,
    formData.phone,
    formData.name,
    // ... all values
  ]);
}
```

---

## 🔍 Key Indexes

### Existing Indexes
```sql
PRIMARY KEY (`id`)
INDEX `idx_phone` (`phone`)
INDEX `idx_track` (`track`)
INDEX `idx_ac_code` (`ac_code`)
INDEX `idx_q_call_status` (`q_call_status`)
INDEX `idx_call_date` (`call_date`)
INDEX `idx_teleform_user_ac_status` (`teleform_user_id`, `ac_code`, `status`)
```

### Recommended Additional Indexes
```sql
CREATE INDEX `idx_survey_data_id` ON `survey_calling_interview`(`survey_data_id`);
CREATE INDEX `idx_agency_id` ON `survey_calling_interview`(`agency_id`);
CREATE INDEX `idx_status` ON `survey_calling_interview`(`status`);
CREATE INDEX `idx_qc_status` ON `survey_calling_interview`(`qc`, `qc_status`);
CREATE INDEX `idx_completion_date` ON `survey_calling_interview`(`survey_complete_date`);
```

---

## 📊 Status Code Definitions

### Survey Status (`status`)
| Code | Meaning |
|------|---------|
| 0 | Pending/Not Started |
| 1 | Completed |
| 2 | Rejected/Invalid |
| 3 | In Progress |
| 4 | Dropped/Incomplete |
| 5 | Rescheduled |

### Call Status (`q_call_status`)
| Code | Meaning |
|------|---------|
| 1 | Continue (Interview started) |
| 2 | Wrong Number |
| 5 | Respondent Not Available/Reschedule |

### Interview Status (`q_interview_status`)
| Code | Meaning |
|------|---------|
| 1 | Fully Completed |
| 2 | Partially Completed |
| 3 | Call Dropped |
| 4 | Respondent Refused |

### QC Status (`qc_status`)
| Code | Meaning |
|------|---------|
| 0 | Not QC'd |
| 1 | QC Approved |
| 2 | QC Rejected |
| 3 | Re-QC Required |

---

## 🎯 Complete Column Summary

### Total Columns: **150+**

| Category | Column Count | Description |
|----------|-------------|-------------|
| **Primary & Assignment** | 10 | ID, survey_data_id, agency, telecaller, etc. |
| **Identification** | 5 | AC, phone, name, part_no |
| **Call Metadata** | 10 | Call attempts, times, dates, callid |
| **Call Flow** | 1 | q_call_status |
| **Consent & Basic** | 5 | Consent, age, locality, voter, gender |
| **Q5 (MLA 2021)** | 7 | q1_1 to q1_44, q1_other |
| **Q6 (MP 2024)** | 2 | q2, q2_other |
| **Q7 (By-election)** | 2 | q3, q3_other |
| **Q8 (Tomorrow)** | 1 | q4 |
| **Q9 (Second choice)** | 1 | q5 |
| **Q10 (Reasons)** | 10 | q7_3 to q7_99, q7_other |
| **Q11 (AITC reasons)** | 13 | q8_3 to q8_99, q8_other |
| **Q12 (BJP reasons)** | 14 | q9_1 to q9_99, q9_other (NEW) |
| **Q13 (Issues)** | 17 | q10_1 to q10_99 (NEW) |
| **Satisfaction (Q14-Q16)** | 6 | q6, q8a, q8b, q8c, q30a_* |
| **Q17 (Best CM)** | 2 | q9, q9_other (conflicts with Q12!) |
| **Q19 (Win prediction)** | 2 | q10, q10_other (conflicts with Q13!) |
| **Q11-Q15 (Reserved)** | 10 | q11 to q15 with _other |
| **Demographics** | 7 | Religion, social cat, caste, education, occupation |
| **QC Data** | 15 | qc_*, re_qc_* fields |
| **Weighting** | 2 | weight, non_weight |
| **Rejection** | 5 | Invalid phone, reject fields |
| **Re-completion** | 4 | recomplete fields |
| **Cloud/Calling** | 3 | cloud_api_id, calling_request_id, calling_group |
| **Audit** | 4 | created_at/by, updated_at/by |

---

## ⚠️ Column Name Conflicts

### Critical Issues to Resolve

1. **Q9 (Frontend) vs q5 (Backend)**
   - Frontend Q9 = Second choice party
   - Backend `q5` = Already used for Q9
   - **Solution**: Use `q5` for Q9 ✅

2. **Q17 (Frontend) vs q9 (Backend)**
   - Frontend Q17 = Best CM leader
   - Backend `q9` and `q9_other` = Already used for Q17
   - Backend also needs `q9_*` for Q12 (BJP reasons)
   - **Solution**: 
     - Use `q11` and `q11_other` for Q17 (Best CM)
     - Use `q9_*` series for Q12 (BJP reasons)

3. **Q19 (Frontend) vs q10 (Backend)**
   - Frontend Q19 = Party will win
   - Backend `q10` and `q10_other` = Already used for Q19
   - Backend also needs `q10_*` for Q13 (Issues)
   - **Solution**:
     - Use `q12` and `q12_other` for Q19 (Win prediction)
     - Use `q10_*` series for Q13 (Issues)

---

## 🔧 Revised Field Mapping (Conflict Resolution)

| Frontend Field | Backend Column | Notes |
|---------------|----------------|-------|
| `q5` | `q1_1` to `q1_44`, `q1_other` | Multi-column split |
| `q6` | `q2`, `q2_other` | Direct |
| `q7` | `q3`, `q3_other` | Direct |
| `q8` | `q4` | Direct |
| `q9` | `q5` | Direct (no conflict) |
| `q10` (array) | `q7_3` to `q7_99`, `q7_other` | Array to columns |
| `q11` (array) | `q8_3` to `q8_99`, `q8_other` | Array to columns |
| `q12` (array) | `q9_1` to `q9_99`, `q9_other` | Array to columns (NEW) |
| `q13` (array) | `q10_1` to `q10_99` | Array to columns (NEW) |
| `q14` | `q6` | Direct |
| `q15` | `q8a` | Direct |
| `q16_a` | `q8b` | Direct |
| `q16_b` | `q8c` | Direct (NEW) |
| `q17` | `q11`, `q11_other` | **Changed from q9** |
| `q19` | `q12`, `q12_other` | **Changed from q10** |
| `resp_religion` | `q_religion`, `q_religion_other` | Direct |
| `resp_social_cat` | `q_social_category` | Direct |
| `resp_caste_jati` | `q_caste_jati` (NEW) | Direct |
| `resp_female_edu` | `q_female_education` (NEW) | Direct |
| `resp_male_edu` | `resp_education` | Direct |
| `resp_occupation` | `q_occupation` (NEW) | Direct |
| `thanks_future` | `q_future_contact` | Direct |

---

## 📋 Complete ALTER TABLE Script

```sql
-- Add missing columns for complete form support
ALTER TABLE `survey_calling_interview`
  
  -- Q16_B: MLA Satisfaction
  ADD COLUMN `q8c` INT NULL COMMENT 'Q16_B: Satisfaction with current MLA (1-5)' AFTER `q8b`,
  
  -- Q12: Reasons for voting BJP (Multi-select)
  ADD COLUMN `q9_1` INT NULL COMMENT 'Q12: Modi leadership' AFTER `q8_other`,
  ADD COLUMN `q9_2` INT NULL COMMENT 'Q12: Development agenda' AFTER `q9_1`,
  ADD COLUMN `q9_3` INT NULL COMMENT 'Q12: National security' AFTER `q9_2`,
  ADD COLUMN `q9_4` INT NULL COMMENT 'Q12: Anti-corruption' AFTER `q9_3`,
  ADD COLUMN `q9_5` INT NULL COMMENT 'Q12: Hindu identity' AFTER `q9_4`,
  ADD COLUMN `q9_6` INT NULL COMMENT 'Q12: Local candidate' AFTER `q9_5`,
  ADD COLUMN `q9_7` INT NULL COMMENT 'Q12: Change from AITC' AFTER `q9_6`,
  ADD COLUMN `q9_8` INT NULL COMMENT 'Q12: Central govt schemes' AFTER `q9_7`,
  ADD COLUMN `q9_9` INT NULL COMMENT 'Q12: Party organization' AFTER `q9_8`,
  ADD COLUMN `q9_10` INT NULL COMMENT 'Q12: Opposition to AITC corruption' AFTER `q9_9`,
  ADD COLUMN `q9_11` INT NULL COMMENT 'Q12: Religious/cultural values' AFTER `q9_10`,
  ADD COLUMN `q9_12` INT NULL COMMENT 'Q12: Strong leadership' AFTER `q9_11`,
  ADD COLUMN `q9_13` INT NULL COMMENT 'Q12: National development' AFTER `q9_12`,
  ADD COLUMN `q9_44` INT NULL COMMENT 'Q12: Others' AFTER `q9_13`,
  ADD COLUMN `q9_99` INT NULL COMMENT 'Q12: Don\'t know/Can\'t say' AFTER `q9_44`,
  ADD COLUMN `q9_other` VARCHAR(255) NULL COMMENT 'Q12: Other reason specify' AFTER `q9_99`,
  
  -- Q13: Most pressing issues (Multi-select)
  ADD COLUMN `q10_1` INT NULL COMMENT 'Q13: Unemployment' AFTER `q9_other`,
  ADD COLUMN `q10_2` INT NULL COMMENT 'Q13: Inflation/Price rise' AFTER `q10_1`,
  ADD COLUMN `q10_3` INT NULL COMMENT 'Q13: Education' AFTER `q10_2`,
  ADD COLUMN `q10_4` INT NULL COMMENT 'Q13: Healthcare' AFTER `q10_3`,
  ADD COLUMN `q10_5` INT NULL COMMENT 'Q13: Infrastructure/Roads' AFTER `q10_4`,
  ADD COLUMN `q10_6` INT NULL COMMENT 'Q13: Law and order/Crime' AFTER `q10_5`,
  ADD COLUMN `q10_7` INT NULL COMMENT 'Q13: Corruption' AFTER `q10_6`,
  ADD COLUMN `q10_8` INT NULL COMMENT 'Q13: Agriculture/Farmers' AFTER `q10_7`,
  ADD COLUMN `q10_9` INT NULL COMMENT 'Q13: Water supply' AFTER `q10_8`,
  ADD COLUMN `q10_10` INT NULL COMMENT 'Q13: Electricity' AFTER `q10_9`,
  ADD COLUMN `q10_11` INT NULL COMMENT 'Q13: Women safety' AFTER `q10_10`,
  ADD COLUMN `q10_12` INT NULL COMMENT 'Q13: Social welfare schemes' AFTER `q10_11`,
  ADD COLUMN `q10_13` INT NULL COMMENT 'Q13: Environment/Pollution' AFTER `q10_12`,
  ADD COLUMN `q10_14` INT NULL COMMENT 'Q13: Other local issues' AFTER `q10_13`,
  ADD COLUMN `q10_44` INT NULL COMMENT 'Q13: Others (specify)' AFTER `q10_14`,
  ADD COLUMN `q10_99` INT NULL COMMENT 'Q13: Don\'t know/Can\'t say' AFTER `q10_44`,
  
  -- Caste/Jati
  ADD COLUMN `q_caste_jati` INT NULL COMMENT 'Q22: Caste/Jati code (1-47)' AFTER `q_social_category`,
  ADD COLUMN `q_caste_jati_other` VARCHAR(255) NULL COMMENT 'Q22: Other caste specify' AFTER `q_caste_jati`,
  
  -- Female Education
  ADD COLUMN `q_female_education` INT NULL COMMENT 'Q23: Female education level (1-7)' AFTER `resp_education`,
  
  -- Occupation
  ADD COLUMN `q_occupation` INT NULL COMMENT 'Q25: Occupation code (2-7)' AFTER `q_female_education`;
```

---

## 🔄 Data Transformation Helper Functions

### TypeScript/Node.js Backend

```typescript
interface FormSubmission {
  // All form fields from frontend
  q5: string;
  q5_oth: string;
  q5_ind: string;
  q10: string[];
  q11: string[];
  q12: string[];
  q13: string[];
  // ... etc
}

// Transform Q5 party selection to multiple columns
function transformQ5(q5: string, q5_oth: string, q5_ind: string) {
  const result = {
    q1_1: null, q1_2: null, q1_3: null, q1_4: null, q1_5: null, q1_44: null,
    q1_other: null
  };
  
  const mapping: any = {
    '1': 'q1_1',   // AITC
    '2': 'q1_2',   // BJP
    '3': 'q1_3',   // INC
    '4': 'q1_4',   // Left Front
    '55': 'q1_5',  // NOTA
    '44': 'q1_44'  // Others
  };
  
  if (mapping[q5]) {
    result[mapping[q5]] = 1;
  }
  
  if (q5 === '44' && q5_oth) {
    result.q1_other = q5_oth;
  } else if (q5 === '12' && q5_ind) {
    result.q1_other = 'Independent: ' + q5_ind;
  }
  
  return result;
}

// Transform checkbox arrays (Q10, Q11, Q12, Q13)
function transformCheckboxArray(values: string[], columnMapping: any) {
  const result: any = {};
  
  // Initialize all columns to NULL
  Object.values(columnMapping).forEach((col: any) => {
    result[col] = null;
  });
  
  // Set selected values to 1
  values.forEach(value => {
    if (columnMapping[value]) {
      result[columnMapping[value]] = 1;
    }
  });
  
  return result;
}

// Column mappings
const q10Mapping = {
  '1': 'q7_3',   // Party manifesto
  '2': 'q7_4',   // Track record
  '3': 'q7_5',   // Local candidate
  '4': 'q7_6',   // National leadership
  '5': 'q7_7',   // State leadership
  '6': 'q7_8',   // Caste/community
  '7': 'q7_10',  // Development
  '44': 'q7_44', // Others
  '99': 'q7_99'  // Don't know
};

const q11Mapping = {
  '1': 'q8_3',   // Mamata leadership
  '2': 'q8_4',   // Welfare schemes
  '3': 'q8_5',   // Women empowerment
  '4': 'q8_7',   // Development
  '5': 'q8_9',   // Bengali identity
  '6': 'q8_10',  // Local leadership
  '7': 'q8_11',  // Party workers
  '8': 'q8_12',  // Anti-BJP
  '9': 'q8_13',  // Muslim support
  '10': 'q8_14', // Secular
  '44': 'q8_44', // Others
  '99': 'q8_99'  // Don't know
};

const q12Mapping = {
  '1': 'q9_1',   // Modi leadership
  '2': 'q9_2',   // Development
  '3': 'q9_3',   // National security
  '4': 'q9_4',   // Anti-corruption
  '5': 'q9_5',   // Hindu identity
  '6': 'q9_6',   // Local candidate
  '7': 'q9_7',   // Change from AITC
  '8': 'q9_8',   // Central schemes
  '9': 'q9_9',   // Organization
  '10': 'q9_10', // Anti-AITC corruption
  '11': 'q9_11', // Religious values
  '12': 'q9_12', // Strong leadership
  '13': 'q9_13', // National development
  '44': 'q9_44', // Others
  '99': 'q9_99'  // Don't know
};

const q13Mapping = {
  '1': 'q10_1',   // Unemployment
  '2': 'q10_2',   // Inflation
  '3': 'q10_3',   // Education
  '4': 'q10_4',   // Healthcare
  '5': 'q10_5',   // Infrastructure
  '6': 'q10_6',   // Law and order
  '7': 'q10_7',   // Corruption
  '8': 'q10_8',   // Agriculture
  '9': 'q10_9',   // Water
  '10': 'q10_10', // Electricity
  '11': 'q10_11', // Women safety
  '12': 'q10_12', // Social welfare
  '13': 'q10_13', // Environment
  '14': 'q10_14', // Local issues
  '44': 'q10_44', // Others
  '99': 'q10_99'  // Don't know
};

// Complete transformation function
function transformFormToDatabase(formData: FormSubmission) {
  return {
    // Identification
    survey_data_id: formData.survey_data_id,
    agency_id: formData.agency || 1,
    teleform_user_id: formData.telecaller_id,
    ac_code: parseInt(formData.ac_code),
    phone: formData.phone || '',
    name: formData.q_name || null,
    
    // Call metadata
    callid: formData.callid,
    call_date: new Date().toISOString().split('T')[0],
    call_received: formData.call_ring_status === '1' ? 1 : 0,
    starttime: Math.floor(Date.now() / 1000),
    endtime: Math.floor(Date.now() / 1000) + formData.time,
    survey_complete_date: new Date(),
    
    // Call status
    q_call_status: formData.q_call_status ? parseInt(formData.q_call_status) : null,
    
    // Consent & Basic
    q_consent: formData.consent ? parseInt(formData.consent) : null,
    q_age: formData.resp_age ? parseInt(formData.resp_age) : null,
    q_register_voter: formData.resp_registered_voter ? parseInt(formData.resp_registered_voter) : null,
    q_gender: formData.resp_gender ? parseInt(formData.resp_gender) : null,
    
    // Q5: 2021 MLA vote
    ...transformQ5(formData.q5, formData.q5_oth, formData.q5_ind),
    
    // Q6-Q9: Direct mappings
    q2: formData.q6 ? parseInt(formData.q6) : null,
    q2_other: formData.q6_oth || (formData.q6 === '12' ? 'Ind: ' + formData.q6_ind : null),
    q3: formData.q7 ? parseInt(formData.q7) : null,
    q3_other: formData.q7_oth || (formData.q7 === '12' ? 'Ind: ' + formData.q7_ind : null),
    q4: formData.q8 ? parseInt(formData.q8) : null,
    q5: formData.q9 ? parseInt(formData.q9) : null, // Q9 → q5
    
    // Q10: Reasons (array to columns)
    ...transformCheckboxArray(formData.q10, q10Mapping),
    q7_other: formData.q10_oth || null,
    
    // Q11: AITC reasons (array to columns)
    ...transformCheckboxArray(formData.q11, q11Mapping),
    q8_other: formData.q11_oth || null,
    
    // Q12: BJP reasons (array to columns)
    ...transformCheckboxArray(formData.q12, q12Mapping),
    q9_other: formData.q12_oth || null,
    
    // Q13: Issues (array to columns)
    ...transformCheckboxArray(formData.q13, q13Mapping),
    q10_other: formData.q13_oth || null,
    
    // Satisfaction
    q6: formData.q14 ? parseInt(formData.q14) : null,   // State govt
    q8a: formData.q15 ? parseInt(formData.q15) : null,  // BJP opposition
    q8b: formData.q16_a ? parseInt(formData.q16_a) : null, // MP
    q8c: formData.q16_b ? parseInt(formData.q16_b) : null, // MLA (NEW)
    
    // Q17: Best CM (REVISED MAPPING)
    q11: formData.q17 ? parseInt(formData.q17) : null,
    q11_other: formData.q17_oth || null,
    
    // Q19: Win prediction (REVISED MAPPING)
    q12: formData.q19 ? parseInt(formData.q19) : null,
    q12_other: formData.q19_oth || null,
    
    // Demographics
    q_religion: formData.resp_religion ? parseInt(formData.resp_religion) : null,
    q_religion_other: formData.resp_religion_oth || null,
    q_social_category: formData.resp_social_cat ? parseInt(formData.resp_social_cat) : null,
    q_caste_jati: formData.resp_caste_jati ? parseInt(formData.resp_caste_jati) : null, // NEW
    q_caste_jati_other: formData.resp_caste_jati_oth || null, // NEW
    q_female_education: formData.resp_female_edu ? parseInt(formData.resp_female_edu) : null, // NEW
    resp_education: formData.resp_male_edu ? parseInt(formData.resp_male_edu) : null,
    q_occupation: formData.resp_occupation ? parseInt(formData.resp_occupation) : null, // NEW
    q_future_contact: formData.thanks_future ? parseInt(formData.thanks_future) : null,
    
    // Status
    status: formData.final_submit === 1 ? 1 : 0,
    q_interview_status: formData.final_submit === 1 ? 1 : 2,
    
    // Audit
    created_at: Math.floor(Date.now() / 1000),
    created_by: formData.telecaller_id
  };
}
```

---

## 📊 Complete Table Structure (After Alterations)

### Estimated Total Columns: **165+**

### Column Groups:
1. ✅ **Primary & Assignment** (10 columns)
2. ✅ **Identification** (5 columns)
3. ✅ **Call Metadata** (10 columns)
4. ✅ **Call Flow & Consent** (2 columns)
5. ✅ **Basic Demographics** (4 columns)
6. ✅ **Q5 - 2021 MLA** (7 columns)
7. ✅ **Q6 - 2024 MP** (2 columns)
8. ✅ **Q7 - By-election** (2 columns)
9. ✅ **Q8 - Tomorrow** (1 column)
10. ✅ **Q9 - Second choice** (1 column)
11. ✅ **Q10 - Reasons** (10 columns)
12. ✅ **Q11 - AITC reasons** (13 columns)
13. ✅ **Q12 - BJP reasons** (16 columns) **NEW**
14. ✅ **Q13 - Issues** (17 columns) **NEW**
15. ✅ **Q14-Q16 - Satisfaction** (7 columns, +1 NEW)
16. ✅ **Q17 - Best CM** (2 columns) **REMAPPED**
17. ✅ **Q19 - Win prediction** (2 columns) **REMAPPED**
18. ✅ **Reserved Q11-Q15** (10 columns)
19. ✅ **Demographics** (9 columns, +3 NEW)
20. ✅ **QC Data** (15 columns)
21. ✅ **Re-QC Data** (10 columns)
22. ✅ **Weighting** (2 columns)
23. ✅ **Rejection** (5 columns)
24. ✅ **Re-completion** (4 columns)
25. ✅ **Cloud/Calling** (3 columns)
26. ✅ **Audit** (4 columns)

---

## 🎯 Summary

### Current Schema
✅ Existing `survey_calling_interview` table with ~120 columns

### Required Additions
✅ **50+ new columns** for:
- Q12 (BJP reasons): 16 columns
- Q13 (Issues): 17 columns
- Q8c (MLA satisfaction): 1 column
- Caste/Jati: 2 columns
- Female education: 1 column
- Occupation: 1 column

### Field Mapping Resolution
✅ Resolved column name conflicts:
- Q17 (Best CM): Use `q11`, `q11_other` instead of `q9`
- Q19 (Win prediction): Use `q12`, `q12_other` instead of `q10`
- Q12 (BJP reasons): Use `q9_*` series
- Q13 (Issues): Use `q10_*` series

### Backend Transformation
✅ Provided complete TypeScript helper functions for:
- Checkbox arrays → Multiple columns
- Party questions → Multi-column split
- Form validation → Database insertion

**Ready for backend database schema updates!** 🚀

