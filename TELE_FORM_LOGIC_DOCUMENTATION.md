# Tele-Form Logic Documentation - West Bengal Opinion Poll 2025

## Overview
This document provides comprehensive logic for the Tele-Form system used in the West Bengal Opinion Poll 2025. It covers question flow, conditional display rules, mandatory fields, and data structure for reverse engineering reports from saved data.

## Form Structure & Flow

### 1. Call Status Section
**Purpose**: Determine call outcome and respondent availability

#### 1.1 Number Status (Required)
- **Tag**: `number_status`
- **Type**: Radio
- **Options**:
  - `"3"` - Call Not Received to Telecaller
  - `"1"` - Ringing (Respondent Call) 
  - `"2"` - Not Ringing (Respondent Call)

**Conditional Logic**:
- If `"1"` (Ringing) → Show `call_ring_status`
- If `"2"` (Not Ringing) → Show `call_not_ring`
- If `"3"` (Not Received) → End form

#### 1.2 Call Not Ring Status
- **Tag**: `call_not_ring`
- **Type**: Radio
- **Condition**: `number_status === '2'`
- **Options**:
  - `"1"` - Switched Off
  - `"2"` - Number Not Reachable
  - `"3"` - Number Does not exist

#### 1.3 Call Ring Status
- **Tag**: `call_ring_status`
- **Type**: Radio
- **Condition**: `number_status === '1'`
- **Options**:
  - `"1"` - Picked Up
  - `"2"` - Did not picked

**Conditional Logic**:
- If `"1"` (Picked Up) → Show `q_call_status`

#### 1.4 Q Call Status
- **Tag**: `q_call_status`
- **Type**: Radio
- **Condition**: `call_ring_status === '1'`
- **Options**:
  - `"1"` - Continue
  - `"3"` - Refuse to Respond
  - `"4"` - Call Back Later

**Conditional Logic**:
- If `"1"` (Continue) → Show `consent`

#### 1.5 Call Reschedule
- **Tag**: `call_reschedule`
- **Type**: datetime-local
- **Condition**: `q_call_status === '4'` (Call Back Later)

### 2. Consent Section
**Purpose**: Obtain respondent consent to participate

#### 2.1 Consent (Required)
- **Tag**: `consent`
- **Type**: Radio
- **Condition**: `q_call_status === '1'`
- **Options**:
  - `"1"` - Yes
  - `"2"` - No

**Conditional Logic**:
- If `"1"` (Yes) → Show Demographics Section
- If `"2"` (No) → End form

### 3. Demographics Section
**Purpose**: Collect basic respondent information

#### 3.1 Respondent Age (Required)
- **Tag**: `resp_age`
- **Type**: Number
- **Condition**: `consent === '1'`
- **Range**: 10-99 years

**Conditional Logic**:
- If `age >= 18` → Show `resp_registered_voter`
- If `age < 18` → End form (not eligible)

#### 3.2 Registered Voter Status (Required)
- **Tag**: `resp_registered_voter`
- **Type**: Radio
- **Condition**: `resp_age >= 18`
- **Options**:
  - `"1"` - Yes
  - `"2"` - No

**Conditional Logic**:
- If `"1"` (Yes) → Show `resp_gender` and Party Preferences
- If `"2"` (No) → End form (not eligible)

#### 3.3 Gender (Required)
- **Tag**: `resp_gender`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - Male
  - `"2"` - Female

### 4. Party Preferences Section
**Purpose**: Collect voting preferences and political opinions

#### 4.1 Q5 - 2021 Assembly Vote (Required)
- **Tag**: `q5`
- **Type**: Radio
- **Condition**: `resp_age >= 22 && resp_registered_voter === '1'`
- **Options**: Dynamic based on AC Code from `party_2021_q5.json`
- **Common Options**:
  - `"1"` - AITC (Trinamool Congress)
  - `"2"` - BJP
  - `"3"` - INC (Congress)
  - `"4"` - Left Front
  - `"12"` - Independent
  - `"44"` - Others (specify)
  - `"55"` - NOTA
  - `"66"` - Did not vote
  - `"77"` - Not eligible for voting
  - `"88"` - Refused to answer

**Sub-fields**:
- `q5_oth` (Text) - Others specification (if `q5 === '44'`)
- `q5_ind` (Text) - Independent specification (if `q5 === '12'`)

#### 4.2 Q6 - 2024 Lok Sabha Vote (Required)
- **Tag**: `q6`
- **Type**: Radio
- **Condition**: `resp_age >= 19 && resp_registered_voter === '1'`
- **Options**: Same as Q5
- **Sub-fields**:
  - `q6_oth` (Text) - Others specification (if `q6 === '44'`)
  - `q6_ind` (Text) - Independent specification (if `q6 === '12'`)

#### 4.3 Q7 - By-elections Vote (Required)
- **Tag**: `q7`
- **Type**: Radio
- **Condition**: `resp_age >= 20 && resp_registered_voter === '1'`
- **Options**: Same as Q5
- **Sub-fields**:
  - `q7_oth` (Text) - Others specification (if `q7 === '44'`)
  - `q7_ind` (Text) - Independent specification (if `q7 === '12'`)

#### 4.4 Q8 - Future Assembly Vote (Required)
- **Tag**: `q8`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**: Same as Q5
- **Sub-fields**:
  - `q8_oth` (Text) - Others specification (if `q8 === '44'`)
  - `q8_ind` (Text) - Independent specification (if `q8 === '12'`)

#### 4.5 Q9 - Alternative Party Choice (Required)
- **Tag**: `q9`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**: Same as Q5
- **Special Logic**: Excludes option selected in Q8
- **Sub-fields**:
  - `q9_oth` (Text) - Others specification (if `q9 === '44'`)
  - `q9_ind` (Text) - Independent specification (if `q9 === '12'`)

#### 4.6 Q10 - Reasons for Second Choice (Required)
- **Tag**: `q10`
- **Type**: Checkbox
- **Condition**: `resp_registered_voter === '1'`
- **Max Selections**: 6
- **Options**:
  - `"1"` - The party works for my caste and community
  - `"2"` - The party makes some good arguments in their speeches
  - `"3"` - The party supports my first choice party
  - `"4"` - The leaders of the party work for Bengal
  - `"5"` - Do not wish to vote for any other party (Exclusive)
  - `"44"` - Others (specify)
  - `"99"` - Don't know/can't say (Exclusive)

**Exclusive Options**: `"5"` and `"99"` - selecting one clears others
**Sub-fields**:
- `q10_oth` (Text) - Others specification (if `q10.includes('44')`)

#### 4.7 Q11 - Reasons for Voting AITC (Required)
- **Tag**: `q11`
- **Type**: Checkbox
- **Condition**: `resp_registered_voter === '1'`
- **Max Selections**: 3
- **Options**:
  - `"1"` - The party has performed well in the state
  - `"2"` - For Good governance /delivering government services
  - `"3"` - For the benefit of West Bengal
  - `"4"` - For the development of WB
  - `"5"` - The party provides good services when it comes to healthcare/education/drinking water/electricity/housing
  - `"6"` - Works for farmers/agriculture/irrigation
  - `"7"` - Promotes small businesses
  - `"8"` - Works for the poor
  - `"9"` - To control price rise
  - `"11"` - The party will generate more employment
  - `"13"` - For greater communal harmony
  - `"14"` - Mamata B. is the best CM of Bengal so far
  - `"15"` - For minorities' welfare
  - `"44"` - Others (specify)
  - `"99"` - Don't know/ Can't Say (Exclusive)

**Exclusive Options**: `"99"` - selecting it clears others
**Sub-fields**:
- `q11_oth` (Text) - Others specification (if `q11.includes('44')`)

#### 4.8 Q12 - Reasons for Voting BJP (Required)
- **Tag**: `q12`
- **Type**: Checkbox
- **Condition**: `resp_registered_voter === '1'`
- **Max Selections**: 3
- **Options**:
  - `"1"` - BJP has proven to be a stable govt. at the centre
  - `"2"` - For Good governance /delivering government services
  - `"3"` - Because of Narendra Modi: good/ strong/decisive leader
  - `"5"` - For the better development of WB
  - `"6"` - Better for farmers/agriculture/irrigation
  - `"7"` - Better for small businesses
  - `"8"` - For better healthcare/education/drinking water/electricity/housing
  - `"9"` - For good welfare schemes
  - `"11"` - BJP is better for Hindus
  - `"12"` - BJP cares for the poor
  - `"14"` - TMC has not performed in West Bengal
  - `"44"` - Others (specify)
  - `"99"` - Don't Know/Can't say (Exclusive)

**Exclusive Options**: `"99"` - selecting it clears others
**Sub-fields**:
- `q12_oth` (Text) - Others specification (if `q12.includes('44')`)

#### 4.9 Q13 - Most Pressing Issues (Required)
- **Tag**: `q13`
- **Type**: Checkbox
- **Condition**: `resp_registered_voter === '1'`
- **Max Selections**: 3
- **Options**:
  - `"2"` - Price rise / inflation
  - `"3"` - Unemployment / lack of jobs
  - `"4"` - Electricity/power problems
  - `"5"` - Healthcare not good
  - `"6"` - Education system issues
  - `"7"` - Voter list issues / fear of losing citizenship
  - `"8"` - Safety for migrant workers
  - `"9"` - Teacher protests & job insecurity
  - `"10"` - Floods and natural disasters
  - `"11"` - Communal tensions / law-and-order concerns
  - `"12"` - Safety of women (crime / security)
  - `"13"` - Infrastructure (roads, connectivity)
  - `"44"` - Others (specify)

**Sub-fields**:
- `q13_oth` (Text) - Others specification (if `q13.includes('44')`)

### 5. Satisfaction Section
**Purpose**: Collect satisfaction ratings for government performance

#### 5.1 Q14 - State Government Satisfaction (Required)
- **Tag**: `q14`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - Fully satisfied
  - `"2"` - Somewhat satisfied
  - `"3"` - Neutral/Don't know/Can't say
  - `"4"` - Somewhat dissatisfied
  - `"5"` - Fully dissatisfied

#### 5.2 Q15 - BJP Opposition Satisfaction (Required)
- **Tag**: `q15`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**: Same as Q14

#### 5.3 Q16_A - MP Performance Satisfaction (Required)
- **Tag**: `q16_a`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Label**: Dynamic with MP name from `mla-mp-ac-data.json`
- **Options**: Same as Q14

#### 5.4 Q16_B - MLA Performance Satisfaction (Required)
- **Tag**: `q16_b`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Label**: Dynamic with MLA name from `mla-mp-ac-data.json`
- **Options**: Same as Q14

#### 5.5 Q17 - Best CM Choice (Required)
- **Tag**: `q17`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - Mamata Banerjee(TMC)
  - `"2"` - Dilip Ghosh (BJP)
  - `"3"` - Suvendu Adhikari (BJP)
  - `"4"` - Sukanta Majumudar (BJP)
  - `"5"` - Abhishek Banerjee (TMC)
  - `"6"` - Samik Bhattacharya (BJP)
  - `"7"` - Subhankar Sarkar (INC)
  - `"8"` - Biman Bose( Left Front)
  - `"9"` - Srideep (Sridip) Bhattacharya (Left Front)
  - `"10"` - Anyone from TMC
  - `"11"` - Anyone from INC
  - `"12"` - Anyone from BJP
  - `"44"` - Others (specify)

**Sub-fields**:
- `q17_oth` (Text) - Others specification (if `q17 === '44'`)

#### 5.6 Q19 - Next Election Winner Prediction (Required)
- **Tag**: `q19`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - AITC (Trinamool Congress)
  - `"2"` - BJP
  - `"3"` - INC (Congress)
  - `"4"` - Left Front
  - `"44"` - Others (specify)
  - `"99"` - Don't know/Can't say

**Sub-fields**:
- `q19_oth` (Text) - Others specification (if `q19 === '44'`)

### 6. Final Demographics Section
**Purpose**: Collect detailed demographic information

#### 6.1 Q20 - Religion (Required)
- **Tag**: `resp_religion`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - Hindu
  - `"2"` - Muslim
  - `"3"` - Christian
  - `"4"` - Sikh
  - `"5"` - Jain
  - `"6"` - Buddhist
  - `"7"` - No response
  - `"44"` - Others (specify)

**Sub-fields**:
- `resp_religion_oth` (Text) - Others specification (if `resp_religion === '44'`)

#### 6.2 Q21 - Social Category (Required)
- **Tag**: `resp_social_cat`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - General/OC
  - `"2"` - Schedule Castes
  - `"3"` - Schedule Tribes
  - `"4"` - Other Backward Caste
  - `"88"` - No response

#### 6.3 Q22 - Caste (Required)
- **Tag**: `resp_caste_jati`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**: Dynamic based on religion from `caste-options.json`
- **Sub-fields**:
  - `resp_caste_jati_oth` (Text) - Others specification (if `resp_caste_jati === '44'`)

#### 6.4 Q23 - Female Education Level (Required)
- **Tag**: `resp_female_edu`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - Illiterate
  - `"2"` - Primary Education (Class 1–5)
  - `"3"` - Secondary Education (Class 6–10)
  - `"4"` - Higher Secondary Education (Class 11–12)
  - `"5"` - Graduate
  - `"6"` - Postgraduate
  - `"7"` - Technical / Vocational Education

#### 6.5 Q24 - Male Education Level (Required)
- **Tag**: `resp_male_edu`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**: Same as Q23

#### 6.6 Q25 - Occupation (Required)
- **Tag**: `resp_occupation`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"2"` - Labour
  - `"3"` - Farmer
  - `"4"` - Worker
  - `"5"` - Trader
  - `"6"` - Clerical Sales/Supervisor
  - `"7"` - Managerial/Professional

#### 6.7 Q26 - Future Contact Consent (Required)
- **Tag**: `thanks_future`
- **Type**: Radio
- **Condition**: `resp_registered_voter === '1'`
- **Options**:
  - `"1"` - Yes
  - `"2"` - No

## Data Structure for Reverse Engineering

### API Submission Format
All form data is submitted to: `PUT /api/cati/interviews/{interviewId}`

### Field Transformation Rules

#### 1. Radio Button Fields
- **Format**: `field_tag: integer_value`
- **Example**: `q5: 1` (AITC selected)
- **Empty**: `null`

#### 2. Checkbox Fields
- **Format**: `field_tag_option_value: 1_or_null`
- **Example**: 
  ```json
  {
    "q10_1": 1,    // Selected
    "q10_2": null, // Not selected
    "q10_3": 1,    // Selected
    "q10_44": null // Not selected
  }
  ```

#### 3. Text Fields
- **Format**: `field_tag: "string_value"`
- **Example**: `q5_oth: "Custom Party Name"`
- **Empty**: `null`

#### 4. System Fields
- **status**: `1`=Initiated, `2`=Completed, `3`=Partial, `4`=Draft
- **form_duration_seconds**: Time taken in seconds
- **final_submit**: `1`=Final submit, `0`=Call dropped
- **language_used**: `"english"`, `"bengali"`, `"hindi"`
- **user_timezone**: User's timezone
- **user_localdatetime**: Local date and time

### Complete Field List for Reports

#### Call Status Fields
```json
{
  "number_status": "integer",
  "call_not_ring": "integer", 
  "call_ring_status": "integer",
  "q_call_status": "integer",
  "call_reschedule": "datetime_string"
}
```

#### Demographics Fields
```json
{
  "consent": "integer",
  "resp_age": "integer",
  "resp_registered_voter": "integer",
  "resp_gender": "integer"
}
```

#### Party Preference Fields
```json
{
  "q5": "integer", "q5_oth": "string", "q5_ind": "string",
  "q6": "integer", "q6_oth": "string", "q6_ind": "string",
  "q7": "integer", "q7_oth": "string", "q7_ind": "string",
  "q8": "integer", "q8_oth": "string", "q8_ind": "string",
  "q9": "integer", "q9_oth": "string", "q9_ind": "string"
}
```

#### Checkbox Fields (Q10-Q13)
```json
{
  "q10_1": "integer", "q10_2": "integer", "q10_3": "integer",
  "q10_4": "integer", "q10_5": "integer", "q10_44": "integer",
  "q10_99": "integer", "q10_oth": "string",
  "q11_1": "integer", "q11_2": "integer", "q11_3": "integer",
  "q11_4": "integer", "q11_5": "integer", "q11_6": "integer",
  "q11_7": "integer", "q11_8": "integer", "q11_9": "integer",
  "q11_11": "integer", "q11_13": "integer", "q11_14": "integer",
  "q11_15": "integer", "q11_44": "integer", "q11_99": "integer",
  "q11_oth": "string",
  "q12_1": "integer", "q12_2": "integer", "q12_3": "integer",
  "q12_5": "integer", "q12_6": "integer", "q12_7": "integer",
  "q12_8": "integer", "q12_9": "integer", "q12_11": "integer",
  "q12_12": "integer", "q12_14": "integer", "q12_44": "integer",
  "q12_99": "integer", "q12_oth": "string",
  "q13_2": "integer", "q13_3": "integer", "q13_4": "integer",
  "q13_5": "integer", "q13_6": "integer", "q13_7": "integer",
  "q13_8": "integer", "q13_9": "integer", "q13_10": "integer",
  "q13_11": "integer", "q13_12": "integer", "q13_13": "integer",
  "q13_44": "integer", "q13_oth": "string"
}
```

#### Satisfaction Fields
```json
{
  "q14": "integer",
  "q15": "integer", 
  "q16_a": "integer",
  "q16_b": "integer",
  "q17": "integer", "q17_oth": "string",
  "q19": "integer", "q19_oth": "string"
}
```

#### Final Demographics Fields
```json
{
  "resp_religion": "integer", "resp_religion_oth": "string",
  "resp_social_cat": "integer",
  "resp_caste_jati": "integer", "resp_caste_jati_oth": "string",
  "resp_female_edu": "integer",
  "resp_male_edu": "integer",
  "resp_occupation": "integer",
  "thanks_future": "integer"
}
```

## Form Completion Logic

### Successful Completion Path
1. `number_status` = `"1"` (Ringing)
2. `call_ring_status` = `"1"` (Picked Up)
3. `q_call_status` = `"1"` (Continue)
4. `consent` = `"1"` (Yes)
5. `resp_age` >= 18
6. `resp_registered_voter` = `"1"` (Yes)
7. All required fields completed
8. `status` = `2` (Completed)

### Partial Completion Paths
1. **Call Dropped**: Any point after consent, `status` = `3`
2. **Not Eligible**: Age < 18 or not registered voter, `status` = `3`
3. **Refused**: `consent` = `"2"` or `q_call_status` = `"3"`, `status` = `3`

### Draft Status
- Auto-save every 1 second with `status` = `4`
- Occurs when form is incomplete but respondent is still engaged

## Report Generation Guidelines

### Data Validation Rules
1. **Complete Interviews**: `status` = `2` AND `final_submit` = `1`
2. **Partial Interviews**: `status` = `3` OR `final_submit` = `0`
3. **Draft Interviews**: `status` = `4`

### Field Dependencies for Analysis
1. **Voting Analysis**: Requires `resp_registered_voter` = `"1"`
2. **Age-based Analysis**: Requires valid `resp_age` value
3. **Party Preference Analysis**: Requires Q5-Q9 completion
4. **Satisfaction Analysis**: Requires Q14-Q19 completion
5. **Demographic Analysis**: Requires Q20-Q26 completion

### Common Report Queries
1. **Response Rate**: `number_status` = `"1"` AND `call_ring_status` = `"1"`
2. **Completion Rate**: `status` = `2` / Total attempts
3. **Refusal Rate**: `q_call_status` = `"3"` OR `consent` = `"2"`
4. **Eligibility Rate**: `resp_age` >= 18 AND `resp_registered_voter` = `"1"`

This documentation provides the complete logic structure needed to reverse engineer reports from saved tele-form data.
