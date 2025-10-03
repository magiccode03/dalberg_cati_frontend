# WB Opinion Poll CATI 2025 - Complete Form Implementation Guide

## Overview
This document provides a comprehensive guide to implementing the CATI (Computer-Assisted Telephone Interviewing) form with all sections, questions, conditional logic, and validation rules.

## Form Structure

### Timer Section
- **Display**: Always visible at the top
- **Field**: `time` (auto-incrementing seconds counter)
- **Implementation**: UseEffect with setInterval updating every 1 second

---

## Section 1: Identification (gp_sec1)
**Display Condition**: Always visible

### Fields

| Field Name | Type | Required | Label (English) | Label (Bengali) | Validation |
|------------|------|----------|-----------------|-----------------|------------|
| `ac_code` | string | Yes | Assembly Constituency code | বিধানসভা কেন্দ্রের কোড | Max: 150 chars |
| `ac_name` | string | Yes | Assembly Constituency name | বিধানসভা কেন্দ্রের নাম | Max: 150 chars |
| `pc_name` | string | No | Parliamentary Constituency Name | সংসদীয় নির্বাচনী এলাকার নাম | Max: 150 chars |
| `pc_code` | string | No | Parliamentary Constituency Code | সংসদীয় নির্বাচনী এলাকার কোড | Max: 150 chars |
| `district_name` | string | No | District Name | জেলার নাম | Max: 150 chars |
| `district_code` | string | No | District Code | জেলার কোড | Max: 150 chars |
| `region_name` | string | No | Region Name | অঞ্চলের নাম | Max: 150 chars |
| `region_code` | string | No | Region Code | অঞ্চলের কোড | Max: 150 chars |
| `mla_name` | string | Yes | MLA Name | MLA Name | Max: 150 chars |
| `mp_name` | string | Yes | MP Name | MP Name | Max: 150 chars |

### Notes
- These fields support multilingual display (English/Bengali)
- MLA Name and MP Name are displayed as dynamic placeholders in later sections

---

## Call Status Section (call_status)
**Display Condition**: Always visible

### 1. Number Status
**Field**: `number_status` (Radio)  
**Required**: Yes  
**Default**: Value `1` (Ringing)

**Options**:
- `3` - Call Not Received to Telecaller
- `1` - Ringing (Respondent Call)
- `2` - Not Ringing (Respondent Call)

### 2. Call Not Ring Status
**Field**: `call_not_ring` (Radio)  
**Required**: Yes  
**Display Condition**: `number_status == 2`

**Options**:
- `1` - Switch Off
- `2` - Number Not Reachable
- `3` - Number Does not exist

**Logic**: When `number_status` changes away from `2`, clear this field and hide all subsequent sections.

### 3. Call Ring Status
**Field**: `call_ring_status` (Radio)  
**Required**: Yes  
**Display Condition**: `number_status == 1`  
**Default**: Value `1` (Picked)

**Options**:
- `1` - Picked
- `2` - Did not picked

**Logic**: When `number_status` changes away from `1`, clear this field and hide all subsequent sections.

### 4. Q Call Status
**Field**: `q_call_status` (Radio)  
**Required**: Yes  
**Display Condition**: `call_ring_status == 1`  
**Default**: Value `1` (Continue)

**Options**:
- `1` - Continue
- `2` - Wrong Number
- `5` - Respondent Not available/Reschedule Interview

**Logic**: 
- When `call_ring_status` changes away from `1`, clear this field and hide all subsequent sections
- When value is `1`, show Section 2 (Consent)
- When value is `2` or other non-continue, hide all subsequent sections

### 5. Reschedule Interview
**Field**: `call_reschedule` (datetime-local)  
**Required**: Yes  
**Display Condition**: `q_call_status == 5`

**Logic**: When `q_call_status` changes away from `5`, clear this field.

### 6. Telecaller ID
**Field**: `telecaller_id` (hidden)  
**Display**: Hidden field (not visible to user)

### 7. Telecaller Name
**Field**: `telecaller_name` (string)  
**Required**: No  
**Label**: Telecaller Name (English only)  
**Max**: 255 characters

**Note**: This value is dynamically inserted into consent statement as `[enumerator name]`

### 8. Call ID
**Field**: `callid` (string)  
**Required**: No  
**Label**: Call ID (English only)  
**Max**: 50 characters

---

## Section 2: Interviewer Introduction and Statement of Informed Consent (gp_sec2)
**Display Condition**: `q_call_status == 1`

### Consent Question
**Field**: `consent` (Radio)  
**Required**: Yes  
**Default**: Value `1` (Yes)

**Statement Text**:
```
Namaste, my name is [telecaller_name]. We are from Convergent, an independent research 
organization. We are conducting a survey on social and political issues in West Bengal, 
interviewing thousands of people. I will ask you a few questions about government performance 
and your preferences. Your responses will remain strictly confidential and will only be 
analysed in combination with others. No personal details will ever be shared. The survey 
will take about 5–10 minutes, and your honest opinions will greatly help us.

Should I continue?
```

**Options**:
- `1` - Yes
- `2` - No

**Logic**: 
- When `consent == 1`, show Section 3
- When `consent == 2`, hide all subsequent sections
- `[telecaller_name]` should be replaced with value from `telecaller_name` field

---

## Section 3: Basic Demographic (gp_sec3)
**Display Condition**: `consent == 1`

### 1. Respondent Age
**Field**: `resp_age` (number)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: Could you please tell me your age in complete years?  
**Hint**: Years  
**Validation**: Min: 10, Max: 99

**Triggers**:
- When `resp_age >= 18`: Show `resp_registered_voter`
- When `resp_age >= 19`: Show `q6` (in Section 4)
- When `resp_age >= 20`: Show `q7` (in Section 4)
- When `resp_age >= 22`: Show `q5` (in Section 4)
- When age changes and conditions not met, hide and clear dependent fields

### 2. Registered Voter
**Field**: `resp_registered_voter` (Radio)  
**Required**: Yes  
**Display Condition**: `resp_age >= 18`  
**Label**: Are you a registered voter in this assembly Constituency?

**Options**:
- `1` - Yes
- `2` - No

**Logic**: 
- When `resp_registered_voter == 1` AND `consent == 1`: Show `resp_gender`, Section 4, Section 5, Section 6
- When `resp_registered_voter == 2`: Hide gender, Section 4, Section 5, Section 6

### 3. Respondent Gender
**Field**: `resp_gender` (Radio)  
**Required**: Yes  
**Display Condition**: `resp_registered_voter == 1 AND consent == 1`  
**Label**: Please note the respondent's gender

**Options**:
- `1` - Male
- `2` - Female

---

## Section 4: Party Preferences (gp_sec4)
**Display Condition**: `resp_registered_voter == 1`

### Q5: Last Assembly Elections 2021
**Field**: `q5` (Radio)  
**Required**: Yes  
**Display Condition**: `resp_age >= 22`  
**Label**: 5. Which party did you vote for in the last assembly elections (MLA) in 2021?  
**Hint**: INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT

**Options** (from party_2019.csv):
- `1` - AITC (Trinamool Congress)
- `2` - BJP
- `3` - INC (Congress)
- `4` - Left Front
- `12` - Independent
- `44` - Others (specify)
- `55` - NOTA
- `66` - Did not vote
- `77` - Not eligible for voting
- `88` - No response/Refused to answer

**Sub-questions**:
- `q5_oth` (string) - Display when `q5 == 44`, Required: Yes, Max: 150 chars
- `q5_ind` (string) - Display when `q5 == 12`, Required: Yes, Max: 150 chars

### Q6: Last Lok Sabha Elections 2024
**Field**: `q6` (Radio)  
**Required**: Yes  
**Display Condition**: `resp_age >= 19`  
**Label**: 6. Which party did you vote for in the last Lok Sabha elections (MP) in 2024?  
**Hint**: INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT

**Options**: Same as Q5

**Sub-questions**:
- `q6_oth` (string) - Display when `q6 == 44`, Required: Yes, Max: 150 chars
- `q6_ind` (string) - Display when `q6 == 12`, Required: Yes, Max: 150 chars

### Q7: By-elections After 2021
**Field**: `q7` (Radio)  
**Required**: Yes  
**Display Condition**: `resp_age >= 20`  
**Label**: 7. Which party did you vote for in the by elections held in your assembly constituency (MLA) after 2021?  
**Hint**: INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT

**Options**: Same as Q5

**Sub-questions**:
- `q7_oth` (string) - Display when `q7 == 44`, Required: Yes, Max: 150 chars
- `q7_ind` (string) - Display when `q7 == 12`, Required: Yes, Max: 150 chars

### Q8: If Elections Tomorrow
**Field**: `q8` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: 8. If assembly elections (MLA) were to be held tomorrow, then which party would you vote for?  
**Hint**: INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT

**Options**: Same as Q5

**Sub-questions**:
- `q8_oth` (string) - Display when `q8 == 44`, Required: Yes, Max: 150 chars
- `q8_ind` (string) - Display when `q8 == 12`, Required: Yes, Max: 150 chars

### Q9: Second Choice Party
**Field**: `q9` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: 9. Let us assume that the above party of your choice doesn't contest elections in your assembly constituency, which party would you choose?  
**Hint**: INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT

**Options**: Same as Q5

**Sub-questions**:
- `q9_oth` (string) - Display when `q9 == 44`, Required: Yes, Max: 150 chars
- `q9_ind` (string) - Display when `q9 == 12`, Required: Yes, Max: 150 chars

### Q10: Reason for Second Choice (Multiple Select)
**Field**: `q10` (Checkbox Array)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: 10. Could you tell us the reason for choosing the above party as your second choice?  
**Hint**: INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT  
**Max Selections**: 3

**Options**:
- `1` - The party works for my caste and community
- `2` - The party makes some good arguments in their speeches
- `3` - The party supports my first choice party
- `4` - The leaders of the party work for Bengal
- `5` - Do not wish to vote for any other party
- `44` - Others (Specify)
- `99` - Don't know/can't say

**Sub-questions**:
- `q10_oth` (string) - Display when `44` is in selected array, Required: Yes, Max: 150 chars

**Logic**:
- If `99` is selected, automatically deselect all other options (exclusive)
- If any other option is selected when `99` is checked, deselect `99`
- Maximum 3 selections allowed (excluding "Others" text field)

### Q11: Top 3 Reasons for Voting AITC (Multiple Select)
**Field**: `q11` (Checkbox Array)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: 11. In your opinion what are the top 3 reasons for voting for AITC?  
**Hint**: INTERVIEWER INSTRUCTION: DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY  
**Max Selections**: 3

**Options**:
- `1` - The party has performed well in the state
- `2` - For good governance / delivering government services
- `3` - For the benefit of West Bengal
- `4` - For the development of WB
- `5` - The party provides good services when it comes to healthcare / education / drinking water / electricity / housing
- `6` - Works for farmers / agriculture / irrigation
- `7` - Promotes small businesses
- `8` - Works for the poor
- `9` - To control price rise
- `11` - The party will generate more employment
- `13` - For greater communal harmony
- `14` - Mamata B. is the best CM of Bengal so far
- `15` - For minorities' welfare
- `44` - Others (specify)
- `99` - Don't know / Can't say

**Sub-questions**:
- `q11_oth` (string) - Display when `44` is in selected array, Required: Yes, Max: 150 chars

**Logic**: Same as Q10 (exclusive `99` option)

### Q12: Top 3 Reasons for Voting BJP (Multiple Select)
**Field**: `q12` (Checkbox Array)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: 12. In your opinion what are the top 3 reasons for voting for BJP?  
**Hint**: INTERVIEWER INSTRUCTION: DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY  
**Max Selections**: 3

**Options**:
- `1` - BJP has proven to be a stable govt. at the centre
- `2` - For good governance / delivering government services
- `3` - Because of Narendra Modi (Note: Add class "good / strong / decisive leader")
- `5` - For the better development of WB
- `6` - Better for farmers / agriculture / irrigation
- `7` - Better for small businesses
- `8` - For better healthcare / education / drinking water / electricity / housing
- `9` - For good welfare schemes
- `11` - BJP is better for Hindus
- `12` - BJP cares for the poor
- `14` - TMC has not performed in West Bengal
- `44` - Others (Specify)
- `99` - Don't know / Can't say

**Sub-questions**:
- `q12_oth` (string) - Display when `44` is in selected array, Required: Yes, Max: 150 chars

**Logic**: Same as Q10 (exclusive `99` option)

### Q13: Three Most Pressing Issues (Multiple Select)
**Field**: `q13` (Checkbox Array)  
**Required**: Yes  
**Display Condition**: `consent == 1`  
**Label**: 13. According to you what are the three most pressing issues of your assembly constituency?  
**Hint**: INTERVIEWER INSTRUCTION: DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY  
**Max Selections**: 3

**Options**:
- `1` - Professional Degree
- `2` - Price rise / inflation
- `3` - Unemployment / lack of jobs
- `4` - Electricity/power problems
- `5` - Healthcare not good
- `6` - Education system issues
- `7` - Voter list issues / fear of losing citizenship
- `8` - Safety for migrant workers
- `9` - Teacher protests & job insecurity
- `10` - Floods and natural disasters
- `11` - Communal tensions / law-and-order concerns
- `12` - Safety of women (crime / security)
- `13` - Infrastructure (roads, connectivity)
- `44` - Others (Specify)

**Sub-questions**:
- `q13_oth` (string) - Display when `44` is in selected array, Required: Yes, Max: 150 chars

**Note**: No "Don't know" option for this question

---

## Section 5: Satisfaction and Approval Ratings (gp_sec5)
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`

### Q14: Satisfaction with State Government
**Field**: `q14` (Radio)  
**Required**: Yes  
**Display Condition**: `resp_registered_voter == 1 AND consent == 1`  
**Label**: 14. How satisfied or dissatisfied are you with the performance of the state govt led by Mamata Banerjee?  
**Hint**: INTERVIEWER INSTRUCTIONS – READ THE OPTIONS

**Options**:
- `1` - Fully satisfied
- `2` - Somewhat satisfied
- `3` - Neutral/Don't know/Can't say
- `4` - Somewhat dissatisfied
- `5` - Fully dissatisfied

### Q15: Satisfaction with BJP Opposition
**Field**: `q15` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 15. How satisfied or dissatisfied are you with the performance of BJP as the opposition in the state?  
**Hint**: INTERVIEWER INSTRUCTIONS – READ THE OPTIONS

**Options**: Same as Q14

### Q16: Satisfaction with Representatives (Info Header)
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 16. How satisfied or dissatisfied are you with the work done by the following.  
**Hint**: INTERVIEWER INSTRUCTIONS – READ THE OPTIONS

#### Q16_A: Lok Sabha MP Satisfaction
**Field**: `q16_a` (Radio)  
**Required**: Yes  
**Label**: A. Lok Sabha MP/ [MP Name] from your parliament constituency

**Options**: Same as Q14

**Note**: `[MP Name]` should be dynamically replaced with value from `mp_name` field

#### Q16_B: MLA Satisfaction
**Field**: `q16_b` (Radio)  
**Required**: Yes  
**Label**: B. Your current MLA/ [MLA Name]?

**Options**: Same as Q14

**Note**: `[MLA Name]` should be dynamically replaced with value from `mla_name` field

### Q17: Best Leader for CM
**Field**: `q17` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 17. Who do you think is the best leader to be the Chief Minister of West Bengal?

**Options**:
- `1` - Mamata Banerjee(AITC)
- `2` - Dilip Ghosh (BJP)
- `3` - Suvendu Adhikari (BJP)
- `4` - Sukanta Majumudar (BJP)
- `5` - Abhishek Banerjee (AITC)
- `6` - Samik Bhattacharya (BJP)
- `7` - Subhankar Sarkar (INC)
- `8` - Biman Bose( Left Front)
- `9` - Srideep (Sridip) Bhattacharya (Left Front)
- `10` - Anyone from TMC
- `11` - Anyone from INC
- `12` - Anyone from BJP
- `44` - Others (specify)

**Sub-questions**:
- `q17_oth` (string) - Display when `q17 == 44`, Required: Yes, Max: 150 chars

### Q19: Which Party Will Win
**Field**: `q19` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 19. In your opinion, which party would win the next elections in your constituency, when you would elect your MLA?

**Options** (from party_2020.csv):
- `1` - AITC (Trinamool Congress)
- `2` - BJP
- `3` - INC (Congress)
- `4` - Left Front
- `44` - Others (specify)
- `99` - Don't know/can't say

**Sub-questions**:
- `q19_oth` (string) - Display when `q19 == 44`, Required: Yes, Max: 150 chars

---

## Section 6: Basic Demographic (gp_sec6)
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`

### Q20: Religion
**Field**: `resp_religion` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 20. Could you please tell me the religion that you belong to?

**Options**:
- `1` - Hindu
- `2` - Muslim
- `3` - Christian
- `4` - Sikh
- `5` - Jain
- `6` - Buddhist
- `7` - No response
- `44` - Others (Specify)

**Sub-questions**:
- `resp_religion_oth` (string) - Display when `resp_religion == 44`, Required: Yes, Max: 150 chars

### Q21: Social Category
**Field**: `resp_social_cat` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 21. Which social category do you belong to?

**Options**:
- `1` - General/OC
- `2` - Schedule Castes
- `3` - Schedule Tribes
- `4` - Other Backward Caste
- `5` - No response

### Q22: Caste/Jati
**Field**: `resp_caste_jati` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 22. Could you please tell me your caste?

**Options** (47 castes):
- `1` - Aguri
- `2` - Kansabanik
- `3` - Sadgop
- `4` - Shunri
- `5` - Yadav
- `6` - Santal
- `7` - Pod
- `8` - Tanti
- `9` - Namaseej
- `10` - Brahmins
- `11` - Kayasthas
- `12` - Baidyas
- `13` - Rajputs
- `14` - Kshatriyas
- `15` - Barui
- `16` - Gandha Banik
- `17` - Kulin Kayasthas
- `18` - Mahishya
- `19` - Namasudra
- `20` - Rajbanshi
- `21` - Poundra
- `22` - Dom
- `23` - Bagdi
- `24` - Chamar
- `25` - Muchi
- `26` - Kori
- `27` - Haldar
- `28` - Santhal
- `29` - Munda
- `30` - Oraon
- `31` - Bhumij
- `32` - Ho
- `33` - Lodha
- `34` - Bhil
- `35` - Birhor
- `36` - Mahali
- `37` - Teli/Teli Sahu
- `38` - Napit
- `39` - Karmakar
- `40` - Rajak
- `41` - Dhoba
- `42` - Hela
- `43` - Kahar
- `47` - Keot
- `45` - Kurmi
- `46` - Pasi
- `44` - Others (Specify)
- `88` - Refused to respond

**Sub-questions**:
- `resp_caste_jati_oth` (string) - Display when `resp_caste_jati == 44`, Required: Yes, Max: 150 chars

### Q23: Female Education
**Field**: `resp_female_edu` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 23. Could you please tell me the highest educational level of the most educated female of the household?

**Options**:
- `1` - No female adult
- `2` - No formal education
- `3` - Upto class 5
- `4` - Class 6–9
- `5` - Class 10–14
- `6` - Degree (regular)
- `7` - Professional Degree

### Q24: Male Education
**Field**: `resp_male_edu` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 24. Could you please tell me the highest educational level of the most educated male of the household?

**Options**: Same as Q23 (with "No male adult" instead)

### Q25: Occupation
**Field**: `resp_occupation` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 25. What is the occupation of the chief wage earner?

**Options**:
- `2` - Labour
- `3` - Farmer
- `4` - Worker
- `5` - Trader
- `6` - Clerical Sales/Supervisor
- `7` - Managerial/Professional

### Q28: Future Contact
**Field**: `thanks_future` (Radio)  
**Required**: Yes  
**Display Condition**: `consent == 1 AND resp_registered_voter == 1`  
**Label**: 28. Thank you for your excellent responses, can we contact you in future for similar surveys and get your valuable opinions?

**Options**:
- `1` - Yes, you can
- `2` - No please

---

## Call Drop Group (call_drop)
**Display Condition**: Always visible

### Call Drop Button
**Field**: `q_call_drop` (Button Action)  
**Label**: Respondent Cut the Call  
**Style**: Red button (danger/destructive action)

**Logic**:
```javascript
onClick: () => {
  if (window.confirm('Are you sure You Want to drop the Call?')) {
    // Redirect to close survey URL or navigate away
    // In original: window.location.href = closesubmissionurl
  }
}
```

---

## Submit Section
**Display Condition**: Always visible at bottom

### Submit Button
**Type**: Submit  
**Label**: Submit  
**Icon**: Save icon  
**Style**: Large, green/success button

**Hidden Fields** (auto-populated):
- `final_submit` - Set to `1` on submit button click
- `user_timezone` - Browser timezone (e.g., "Asia/Calcutta")
- `user_local_startdatetime` - Form start time
- `user_localdatetime` - Current time on submit

---

## Conditional Logic Summary

### Primary Cascade Logic

```
number_status
├── == 1 (Ringing)
│   └── show: call_ring_status
│       ├── == 1 (Picked)
│       │   └── show: q_call_status
│       │       ├── == 1 (Continue)
│       │       │   └── show: Section 2 (consent)
│       │       │       └── consent == 1
│       │       │           └── show: Section 3 (resp_age)
│       │       │               └── resp_age >= 18
│       │       │                   └── show: resp_registered_voter
│       │       │                       └── resp_registered_voter == 1
│       │       │                           ├── show: resp_gender
│       │       │                           ├── show: Section 4 (if resp_age conditions met)
│       │       │                           ├── show: Section 5
│       │       │                           └── show: Section 6
│       │       ├── == 2 (Wrong Number)
│       │       │   └── STOP (no further sections)
│       │       └── == 5 (Reschedule)
│       │           ├── show: call_reschedule datetime picker
│       │           └── STOP (no further sections)
│       └── == 2 (Did not pick)
│           └── STOP (no further sections)
└── == 2 (Not Ringing)
    ├── show: call_not_ring
    └── STOP (no further sections)
```

### Age-Based Conditional Display

```
resp_age value triggers:
├── >= 18: Show resp_registered_voter
├── >= 19: Show q6 (if in Section 4)
├── >= 20: Show q7 (if in Section 4)
└── >= 22: Show q5 (if in Section 4)
```

### Consent-Based Display

```
consent == 1:
├── Show Section 3 (resp_age, resp_registered_voter, resp_gender)
├── Show q8, q9, q10, q11, q12, q13 (Section 4)
└── If resp_registered_voter == 1:
    ├── Show Section 5 (q14, q15, q16, q17, q19)
    └── Show Section 6 (resp_religion, resp_social_cat, resp_caste_jati, resp_female_edu, resp_male_edu, resp_occupation, thanks_future)
```

### "Others" Field Display Logic

For questions with "Others (specify)" or "Independent (specify)" options:

```javascript
// For radio buttons (q5, q6, q7, q8, q9, q17, q19, resp_religion, resp_caste_jati)
if (value == 44) {
  show: {fieldName}_oth
} else {
  hide: {fieldName}_oth
  clear: {fieldName}_oth value
}

if (value == 12) { // For questions with Independent option
  show: {fieldName}_ind
} else {
  hide: {fieldName}_ind
  clear: {fieldName}_ind value
}
```

```javascript
// For checkboxes (q10, q11, q12, q13)
if (selectedArray.includes('44')) {
  show: {fieldName}_oth
} else {
  hide: {fieldName}_oth
  clear: {fieldName}_oth value
}
```

### Exclusive "Don't Know" Logic (Checkboxes)

For Q10, Q11, Q12 (questions with `99` - "Don't know/can't say"):

```javascript
handleCheckboxChange(field, value, checked) {
  const dontKnowValues = ['99'];
  const isDontKnow = dontKnowValues.includes(value);
  
  if (isDontKnow && checked) {
    // Selecting "Don't know" - clear ALL other selections
    setFormData(prev => ({ ...prev, [field]: [value] }));
  } else if (checked) {
    // Selecting any other option - remove "Don't know" if present
    const currentValues = formData[field].filter(v => !dontKnowValues.includes(v));
    setFormData(prev => ({ ...prev, [field]: [...currentValues, value] }));
  } else {
    // Unchecking
    setFormData(prev => ({
      ...prev,
      [field]: formData[field].filter(v => v !== value)
    }));
  }
}
```

---

## Field Clearing Logic

### When `number_status` changes:
- If not `== 1`: Clear `call_ring_status` and all subsequent fields
- If not `== 2`: Clear `call_not_ring`

### When `call_ring_status` changes:
- If not `== 1`: Clear `q_call_status` and all subsequent fields

### When `q_call_status` changes:
- If not `== 1`: Clear `consent` and all subsequent fields
- If not `== 5`: Clear `call_reschedule`

### When `consent` changes:
- If not `== 1`: Clear Section 3, 4, 5, 6 fields

### When `resp_age` changes:
```javascript
if (resp_age < 18) {
  clear: resp_registered_voter, resp_gender, Section 4, Section 5, Section 6
}
if (resp_age < 19) {
  clear: q6, q6_oth, q6_ind
}
if (resp_age < 20) {
  clear: q7, q7_oth, q7_ind
}
if (resp_age < 22) {
  clear: q5, q5_oth, q5_ind
}
```

### When `resp_registered_voter` changes:
- If not `== 1`: Clear `resp_gender`, Section 4, Section 5, Section 6

---

## Implementation Guidelines

### 1. State Management

```typescript
interface FormData {
  // Timer
  time: number;
  
  // Section 1
  ac_code: string;
  ac_name: string;
  // ... all identification fields
  
  // Call Status
  number_status: string;
  call_not_ring: string;
  // ... all call status fields
  
  // Section 2
  consent: string;
  
  // Section 3
  resp_age: string;
  resp_registered_voter: string;
  resp_gender: string;
  
  // Section 4
  q5: string;
  q5_oth: string;
  q5_ind: string;
  // ... all party preference fields
  q10: string[];  // Checkbox array
  q11: string[];  // Checkbox array
  q12: string[];  // Checkbox array
  q13: string[];  // Checkbox array
  
  // Section 5
  q14: string;
  q15: string;
  // ... all satisfaction fields
  
  // Section 6
  resp_religion: string;
  resp_social_cat: string;
  // ... all demographic fields
}
```

### 2. Default Values

```typescript
const defaultFormData = {
  number_status: '1',      // Default: Ringing
  call_ring_status: '1',   // Default: Picked
  q_call_status: '1',      // Default: Continue
  consent: '1',            // Default: Yes
  q10: [],                 // Empty arrays for checkboxes
  q11: [],
  q12: [],
  q13: [],
  // All other fields: empty strings
};
```

### 3. Computed Visibility Conditions

```typescript
// Call Status Conditionals
const showCallNotRing = formData.number_status === '2';
const showCallRingStatus = formData.number_status === '1';
const showCallStatus = formData.call_ring_status === '1';
const showReschedule = formData.q_call_status === '5';

// Section Conditionals
const showSection2 = formData.q_call_status === '1';
const showSection3 = formData.consent === '1';
const showSection4 = formData.resp_registered_voter === '1';
const showSection5 = formData.consent === '1' && formData.resp_registered_voter === '1';
const showSection6 = formData.consent === '1' && formData.resp_registered_voter === '1';

// Age-based Conditionals
const showRegisteredVoter = parseInt(formData.resp_age) >= 18;
const showQ5 = parseInt(formData.resp_age) >= 22;
const showQ6 = parseInt(formData.resp_age) >= 19;
const showQ7 = parseInt(formData.resp_age) >= 20;

// Gender Display
const showGender = formData.resp_registered_voter === '1' && formData.consent === '1';

// "Others" Field Display
const showQ5Oth = formData.q5 === '44';
const showQ5Ind = formData.q5 === '12';
const showQ6Oth = formData.q6 === '44';
const showQ6Ind = formData.q6 === '12';
// ... similar for all questions with "Others" options

const showQ10Oth = formData.q10.includes('44');
const showQ11Oth = formData.q11.includes('44');
const showQ12Oth = formData.q12.includes('44');
const showQ13Oth = formData.q13.includes('44');
```

### 4. Field Update Handlers

```typescript
// For text/number/radio inputs
const handleInputChange = (field: keyof FormData, value: string) => {
  setFormData(prev => {
    const newData = { ...prev, [field]: value };
    
    // Apply clearing logic based on field
    if (field === 'number_status') {
      if (value !== '1') {
        newData.call_ring_status = '';
        newData.q_call_status = '';
        // Clear all subsequent fields...
      }
      if (value !== '2') {
        newData.call_not_ring = '';
      }
    }
    
    if (field === 'call_ring_status' && value !== '1') {
      newData.q_call_status = '';
      // Clear all subsequent fields...
    }
    
    if (field === 'q_call_status') {
      if (value !== '1') {
        newData.consent = '';
        // Clear all subsequent fields...
      }
      if (value !== '5') {
        newData.call_reschedule = '';
      }
    }
    
    if (field === 'consent' && value !== '1') {
      // Clear Section 3, 4, 5, 6
      newData.resp_age = '';
      newData.resp_registered_voter = '';
      // ... clear all dependent fields
    }
    
    if (field === 'resp_age') {
      const age = parseInt(value);
      if (age < 18) {
        newData.resp_registered_voter = '';
        // Clear all dependent fields
      }
      if (age < 19) {
        newData.q6 = '';
        newData.q6_oth = '';
        newData.q6_ind = '';
      }
      if (age < 20) {
        newData.q7 = '';
        newData.q7_oth = '';
        newData.q7_ind = '';
      }
      if (age < 22) {
        newData.q5 = '';
        newData.q5_oth = '';
        newData.q5_ind = '';
      }
    }
    
    if (field === 'resp_registered_voter' && value !== '1') {
      newData.resp_gender = '';
      // Clear Section 4, 5, 6
    }
    
    return newData;
  });
};

// For checkbox inputs
const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
  setFormData(prev => {
    const currentValues = prev[field] as string[];
    const dontKnowValues = ['99'];
    const isDontKnow = dontKnowValues.includes(value);
    
    let newValues: string[];
    
    if (isDontKnow && checked) {
      // Selecting "Don't know" - clear all others
      newValues = [value];
    } else if (checked) {
      // Selecting option - remove "Don't know" if present
      const filteredValues = currentValues.filter(v => !dontKnowValues.includes(v));
      newValues = [...filteredValues, value];
    } else {
      // Unchecking
      newValues = currentValues.filter(v => v !== value);
    }
    
    const newData = { ...prev, [field]: newValues };
    
    // Handle "Others" text field visibility
    if (field === 'q10') {
      if (!newValues.includes('44')) {
        newData.q10_oth = '';
      }
    }
    // Similar for q11, q12, q13
    
    return newData;
  });
};
```

### 5. Multilingual Support

Only Section 1 (Identification) fields should be multilingual. All other sections are English-only.

```typescript
const translations = {
  english: {
    ac_code: 'Assembly Constituency code',
    ac_name: 'Assembly Constituency name',
    // ... other Section 1 fields
  },
  bengali: {
    ac_code: 'বিধানসভা কেন্দ্রের কোড',
    ac_name: 'বিধানসভা কেন্দ্রের নাম',
    // ... other Section 1 fields
  }
};

// Use translation for Section 1 only
<Input label={t.ac_code} ... />

// Use English directly for all other sections
<Text>Number Status</Text>
```

### 6. Form Submission

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Get timezone and datetime
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date().toLocaleString();
  
  const submissionData = {
    ...formData,
    final_submit: 1,
    user_timezone: timezone,
    user_localdatetime: currentTime,
    time: timer, // Include timer value
  };
  
  console.log('Form submitted:', submissionData);
  
  // API call to submit form
  // POST to backend with submissionData
};
```

---

## Component Usage

### Radio Buttons
```tsx
<Radio
  id={`field_name_${value}`}
  name="field_name"
  value={value}
  label="Option Label"
  checked={formData.field_name === value}
  onChange={() => handleInputChange('field_name', value)}
/>
```

### Checkboxes
```tsx
<Checkbox
  id={`field_name_${value}`}
  label="Option Label"
  checked={formData.field_name.includes(value)}
  onChange={(e) => handleCheckboxChange('field_name', value, e.target.checked)}
/>
```

### Text Inputs
```tsx
<Input
  label="Label Text"
  value={formData.field_name}
  onChange={(e) => handleInputChange('field_name', e.target.value)}
  required={true}
  maxLength={150}
/>
```

### Number Inputs
```tsx
<Input
  type="number"
  label="Label Text"
  value={formData.field_name}
  onChange={(e) => handleInputChange('field_name', e.target.value)}
  min={10}
  max={99}
/>
```

### DateTime Inputs
```tsx
<Input
  type="datetime-local"
  label="Label Text"
  value={formData.field_name}
  onChange={(e) => handleInputChange('field_name', e.target.value)}
/>
```

---

## Validation Rules

### Required Fields Validation
All fields marked as "Required: Yes" must have values before form submission.

### Age Validation
- Minimum: 10 years
- Maximum: 99 years
- Must be integer

### String Length Validation
- Most text fields: Max 150 characters
- `telecaller_name`: Max 255 characters
- `callid`: Max 50 characters

### Checkbox Validation
- Maximum 3 selections for multi-select questions (q10, q11, q12, q13)
- At least 1 selection required

---

## UI/UX Guidelines

### Card Layout
Each section should be in a separate Card component with:
- Padding: `p-6`
- Margin bottom: `mb-6`
- Section heading as `Heading level={4}`

### Question Labels
- Use `Text` component with class: `text-base font-medium text-blue-600 dark:text-blue-400 mb-3`
- Question hints in italic with gray color

### Spacing
- Space between questions: `mb-6`
- Space between radio/checkbox options: `space-y-3`

### Dynamic Placeholders
- Replace `[enumerator name]` with `telecaller_name` value in consent statement
- Replace `[MP Name]` with `mp_name` value in Q16_A
- Replace `[MLA Name]` with `mla_name` value in Q16_B

### Button Styling
- **Call Drop Button**: Red background (`bg-red-600 hover:bg-red-700`), large size
- **Submit Button**: Blue background (`bg-blue-600 hover:bg-blue-700`), large size

---

## Error Handling

### Validation Errors
Display validation errors below respective fields when:
- Required field is empty on submit
- Age is out of range (< 10 or > 99)
- String exceeds max length

### Confirmation Dialogs
- **Call Drop**: "Are you sure You Want to drop the Call?"
- Use `window.confirm()` for confirmation (as per user preference for custom dialogs in production)

---

## Data References

### Party Options (from CSV files)
The form references external CSV files for party options:
- **party_2019.csv**: Used for Q5, Q6, Q7
- **party_2020.csv**: Used for Q19

**Note**: In the implementation, these are hardcoded as the CSV structure shows:
- party_code : party_name_english

---

## Implementation Checklist

- [ ] Set up state management for all 70+ form fields
- [ ] Implement timer with useEffect (1-second interval)
- [ ] Create Section 1 with multilingual support
- [ ] Implement Call Status section with cascade logic
- [ ] Create Section 2 (Consent) with dynamic telecaller name
- [ ] Implement Section 3 (Basic Demographics) with age-based triggers
- [ ] Create Section 4 (Party Preferences) with all questions
  - [ ] Q5, Q6, Q7 with party options and conditional "Others"/"Independent" fields
  - [ ] Q8, Q9 with party options
  - [ ] Q10, Q11, Q12, Q13 as multi-select with exclusive "Don't know" logic
- [ ] Implement Section 5 (Satisfaction) with all rating questions
  - [ ] Q14, Q15 satisfaction ratings
  - [ ] Q16 (info header) with Q16_A and Q16_B sub-questions
  - [ ] Q17, Q19 with dynamic MLA/MP names
- [ ] Create Section 6 (Demographics) with all questions
  - [ ] Religion, Social Category, Caste (47 options)
  - [ ] Education (Female/Male)
  - [ ] Occupation
  - [ ] Future contact consent
- [ ] Implement Call Drop button with confirmation
- [ ] Create Submit button with hidden fields
- [ ] Add comprehensive field clearing logic for all dependencies
- [ ] Implement "Others" conditional text fields for all applicable questions
- [ ] Add exclusive "Don't know" logic for checkbox questions
- [ ] Validate required fields before submission
- [ ] Test all conditional display logic
- [ ] Test all field clearing cascades
- [ ] Verify multilingual switching works correctly
- [ ] Test timer functionality
- [ ] Verify dynamic placeholder replacements

---

## API Integration

### Submission Endpoint
```typescript
POST /api/cati/submit-form
Headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
Body: FormData (entire state object)
```

### Expected Response
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "Q_r1759399045YmS"
}
```

### Error Handling
- Network errors: Display error message with retry option
- Validation errors: Display field-level errors
- Token expiry: Redirect to login

---

## Notes

1. **Field Naming Convention**: All fields use snake_case as per backend requirements
2. **English-Only Sections**: Only Section 1 (Identification) supports Bengali translation
3. **Hidden Fields**: `telecaller_id`, `callid`, and submission metadata fields are implementation details
4. **Timer**: Starts when form loads, tracks total time spent on survey
5. **Confirmation Required**: Both call drop and form close actions require user confirmation
6. **CSS Customization**: Some fields may be hidden via CSS (e.g., `callid` initially hidden)
7. **Responsive Design**: Form should work on desktop and tablet devices
8. **Accessibility**: Use proper ARIA labels, role="radiogroup" for radio groups

---

## Testing Scenarios

### Scenario 1: Complete Survey Flow
1. Fill Section 1 fields
2. Select "Ringing" → "Picked" → "Continue"
3. Give consent "Yes"
4. Enter age (e.g., 25)
5. Select "Yes" for registered voter
6. Complete all sections through to Section 6
7. Submit form

### Scenario 2: Call Not Ringing
1. Fill Section 1
2. Select "Not Ringing"
3. Select call not ring status
4. Verify no further sections appear
5. Can only submit or drop call

### Scenario 3: Did Not Pick Call
1. Fill Section 1
2. Select "Ringing" → "Did not picked"
3. Verify no further sections appear

### Scenario 4: Reschedule Interview
1. Fill Section 1
2. Select "Ringing" → "Picked" → "Reschedule"
3. Select datetime
4. Verify no consent section appears

### Scenario 5: No Consent
1. Complete call status to "Continue"
2. Select "No" for consent
3. Verify Section 3+ hidden

### Scenario 6: Under 18
1. Give consent
2. Enter age < 18
3. Verify registered voter question hidden
4. Verify all subsequent sections hidden

### Scenario 7: Not Registered Voter
1. Enter age >= 18
2. Select "No" for registered voter
3. Verify Section 4, 5, 6 hidden

### Scenario 8: Age Restrictions
1. Test with age 17: No questions appear
2. Test with age 19: Q6 appears, Q5 and Q7 hidden
3. Test with age 21: Q6, Q7 appear, Q5 hidden
4. Test with age 23: All Q5, Q6, Q7 appear

### Scenario 9: "Others" Fields
1. Select "Others (44)" in any question
2. Verify "Others specify" text field appears
3. Change selection away from "Others"
4. Verify "Others" text field hides and clears

### Scenario 10: Exclusive "Don't Know"
1. In Q10, select multiple options
2. Check "Don't know/can't say (99)"
3. Verify all other selections cleared
4. Select another option
5. Verify "Don't know" unchecked

---

## Performance Considerations

1. **Debouncing**: Consider debouncing age input to prevent excessive re-renders
2. **Memoization**: Memoize computed visibility conditions with useMemo
3. **Callback Optimization**: Use useCallback for event handlers
4. **Form State**: Consider using useReducer for complex state management
5. **Validation**: Validate on blur for better UX, not on every keystroke

---

## Accessibility Requirements

1. Use proper `<label>` elements with `htmlFor` attributes
2. Radio groups should have `role="radiogroup"`
3. Required fields should have `aria-required="true"`
4. Error messages should be associated with inputs via `aria-describedby`
5. Focus management: Focus first error on validation failure
6. Keyboard navigation: Ensure all form elements are keyboard accessible

---

## Final Implementation File Structure

```
src/app/cati/ss/tele-form/
├── page.tsx                 # Main form component
├── components/
│   ├── Section1.tsx         # Identification section
│   ├── CallStatus.tsx       # Call status logic
│   ├── Section2.tsx         # Consent section
│   ├── Section3.tsx         # Basic demographic
│   ├── Section4.tsx         # Party preferences
│   ├── Section5.tsx         # Satisfaction ratings
│   ├── Section6.tsx         # Demographics
│   └── CallDrop.tsx         # Call drop button
├── hooks/
│   ├── useFormValidation.ts # Validation logic
│   └── useFormLogic.ts      # Conditional logic
├── types/
│   └── form.types.ts        # TypeScript interfaces
└── utils/
    ├── formDefaults.ts      # Default values
    └── partyOptions.ts      # Party dropdown options
```

---

## Estimated Complexity

- **Total Fields**: ~70 form fields
- **Radio Questions**: ~35
- **Checkbox Questions**: 4 (with 30+ total options)
- **Text Inputs**: ~20
- **Conditional Rules**: ~50 display conditions
- **Clearing Cascades**: ~15 major cascades
- **Lines of Code**: ~2000-2500 (complete implementation)

---

## Development Priority

### Phase 1 (MVP - Core Flow)
1. Timer
2. Section 1 (Identification)
3. Call Status with basic conditional logic
4. Section 2 (Consent)
5. Section 3 (Basic Demographics with age-based logic)
6. Call Drop button
7. Submit button

### Phase 2 (Complete Survey)
1. Section 4 (Q5-Q13) with all party questions
2. Section 5 (Q14-Q19) with satisfaction ratings
3. Section 6 (Q20-Q28) with complete demographics

### Phase 3 (Polish)
1. Comprehensive field clearing logic
2. Complete validation
3. Error handling and user feedback
4. API integration
5. Testing all scenarios

---

## Key Implementation Notes

1. **State Complexity**: This form has significant state interdependencies. Use a clear state management strategy.

2. **Clearing Logic**: When a condition changes that hides a field, always clear that field's value to prevent dirty data submission.

3. **Checkbox Arrays**: Handle as arrays of strings, not single values.

4. **Dynamic Content**: Telecaller name, MP name, and MLA name must be dynamically inserted into question text.

5. **Confirmation Dialogs**: Per user preference [[memory:5802008]], use custom popup/dialog boxes instead of browser's default alert/confirm.

6. **Language Switching**: Only Section 1 labels change with language. All other sections remain English.

7. **Timer Persistence**: Timer should continue running even if user navigates away and comes back (consider localStorage persistence).

8. **Form Recovery**: Consider auto-saving form state to localStorage to prevent data loss.

9. **Mobile Responsiveness**: While primarily for desktop/tablet, ensure form is usable on smaller screens.

10. **Loading States**: Show loading spinner during form submission.

---

## Reference Files

- `project-frontend/ref_page/form.html` - Complete HTML structure with rendered form
- `project-frontend/ref_page/form-logic.html` - Conditional logic documentation
- Current Implementation: `project-frontend/src/app/cati/ss/tele-form/page.tsx`

---

## End of Implementation Guide

