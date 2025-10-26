# SQL Queries for Tele-Form Completion Analysis

## Overview
These SQL queries identify completed interviews in the tele-form flow, considering all conditional logic and required field dependencies.

## Base Table Structure Assumptions
```sql
-- Main table: 'cati_survey_calling_interview' with fields like:
-- id, status, final_submit, form_duration_seconds, language_used, user_timezone, user_localdatetime
-- All form fields as columns (q5, q6, q7, q8, q9, q10_1, q10_2, etc.)
-- Created_at, updated_at timestamps
```

## 1. Basic Completion Query (Status-Based)

```sql
-- Simple completion check based on status
SELECT 
    id,
    status,
    final_submit,
    form_duration_seconds,
    language_used,
    created_at,
    updated_at
FROM cati_survey_calling_interview 
WHERE status = 2 
  AND final_submit = 1;
```

## 2. Complete Flow Validation Query

```sql
-- Comprehensive completion validation considering all conditional logic
SELECT 
    id,
    status,
    final_submit,
    form_duration_seconds,
    language_used,
    created_at,
    updated_at,
    -- Call Status Fields
    number_status,
    call_ring_status,
    q_call_status,
    -- Demographics
    consent,
    resp_age,
    resp_registered_voter,
    resp_gender,
    -- Party Preferences
    q5, q6, q7, q8, q9,
    q14, q15, q16_a, q16_b, q17, q19,
    -- Demographics
    resp_religion, resp_social_cat, resp_caste_jati,
    resp_female_edu, resp_male_edu, resp_occupation,
    thanks_future
FROM cati_survey_calling_interview 
WHERE 
    -- Basic completion criteria
    status = 2 
    AND final_submit = 1
    
    -- Call Status Validation
    AND number_status = 1  -- Ringing
    AND call_ring_status = 1  -- Picked Up
    AND q_call_status = 1  -- Continue
    
    -- Consent Validation
    AND consent = 1  -- Yes
    
    -- Demographics Validation
    AND resp_age IS NOT NULL 
    AND resp_age >= 18  -- Eligible age
    AND resp_registered_voter = 1  -- Registered voter
    AND resp_gender IS NOT NULL  -- Gender provided
    
    -- Party Preferences Validation (Age-based conditions)
    AND (
        (resp_age >= 22 AND q5 IS NOT NULL) OR  -- Q5 required if age >= 22
        (resp_age < 22)  -- Q5 not required if age < 22
    )
    AND (
        (resp_age >= 19 AND q6 IS NOT NULL) OR  -- Q6 required if age >= 19
        (resp_age < 19)  -- Q6 not required if age < 19
    )
    AND (
        (resp_age >= 20 AND q7 IS NOT NULL) OR  -- Q7 required if age >= 20
        (resp_age < 20)  -- Q7 not required if age < 20
    )
    AND q8 IS NOT NULL  -- Q8 always required for registered voters
    AND q9 IS NOT NULL  -- Q9 always required for registered voters
    
    -- Checkbox Questions Validation (Q10-Q13)
    AND (
        -- Q10: At least one option selected (values: 1,2,3,4,5,44,99)
        (q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR 
         q10_44 = 1 OR q10_99 = 1)
    )
    AND (
        -- Q11: At least one option selected (values: 1,2,3,4,5,6,7,8,9,11,13,14,15,44,99)
        (q11_1 = 1 OR q11_2 = 1 OR q11_3 = 1 OR q11_4 = 1 OR q11_5 = 1 OR 
         q11_6 = 1 OR q11_7 = 1 OR q11_8 = 1 OR q11_9 = 1 OR q11_11 = 1 OR 
         q11_13 = 1 OR q11_14 = 1 OR q11_15 = 1 OR q11_44 = 1 OR q11_99 = 1)
    )
    AND (
        -- Q12: At least one option selected (values: 1,2,3,5,6,7,8,9,11,12,14,44,99)
        (q12_1 = 1 OR q12_2 = 1 OR q12_3 = 1 OR q12_5 = 1 OR q12_6 = 1 OR 
         q12_7 = 1 OR q12_8 = 1 OR q12_9 = 1 OR q12_11 = 1 OR q12_12 = 1 OR 
         q12_14 = 1 OR q12_44 = 1 OR q12_99 = 1)
    )
    AND (
        -- Q13: At least one option selected (values: 2,3,4,5,6,7,8,9,10,11,12,13,44)
        (q13_2 = 1 OR q13_3 = 1 OR q13_4 = 1 OR q13_5 = 1 OR q13_6 = 1 OR 
         q13_7 = 1 OR q13_8 = 1 OR q13_9 = 1 OR q13_10 = 1 OR q13_11 = 1 OR 
         q13_12 = 1 OR q13_13 = 1 OR q13_44 = 1)
    )
    
    -- Satisfaction Ratings Validation
    AND q14 IS NOT NULL  -- State government satisfaction
    AND q15 IS NOT NULL  -- BJP opposition satisfaction
    AND q16_a IS NOT NULL  -- MP satisfaction
    AND q16_b IS NOT NULL  -- MLA satisfaction
    AND q17 IS NOT NULL  -- Best CM choice
    AND q19 IS NOT NULL  -- Next election prediction
    
    -- Final Demographics Validation
    AND resp_religion IS NOT NULL
    AND resp_social_cat IS NOT NULL
    AND resp_caste_jati IS NOT NULL
    AND resp_female_edu IS NOT NULL
    AND resp_male_edu IS NOT NULL
    AND resp_occupation IS NOT NULL
    AND thanks_future IS NOT NULL
    
    -- "Others" Fields Validation
    AND (
        (q5 != 44 OR (q5 = 44 AND q5_oth IS NOT NULL AND q5_oth != '')) AND
        (q6 != 44 OR (q6 = 44 AND q6_oth IS NOT NULL AND q6_oth != '')) AND
        (q7 != 44 OR (q7 = 44 AND q7_oth IS NOT NULL AND q7_oth != '')) AND
        (q8 != 44 OR (q8 = 44 AND q8_oth IS NOT NULL AND q8_oth != '')) AND
        (q9 != 44 OR (q9 = 44 AND q9_oth IS NOT NULL AND q9_oth != '')) AND
        (q10_44 != 1 OR (q10_44 = 1 AND q10_oth IS NOT NULL AND q10_oth != '')) AND
        (q11_44 != 1 OR (q11_44 = 1 AND q11_oth IS NOT NULL AND q11_oth != '')) AND
        (q12_44 != 1 OR (q12_44 = 1 AND q12_oth IS NOT NULL AND q12_oth != '')) AND
        (q13_44 != 1 OR (q13_44 = 1 AND q13_oth IS NOT NULL AND q13_oth != '')) AND
        (q17 != 44 OR (q17 = 44 AND q17_oth IS NOT NULL AND q17_oth != '')) AND
        (q19 != 44 OR (q19 = 44 AND q19_oth IS NOT NULL AND q19_oth != '')) AND
        (resp_religion != 44 OR (resp_religion = 44 AND resp_religion_oth IS NOT NULL AND resp_religion_oth != '')) AND
        (resp_caste_jati != 44 OR (resp_caste_jati = 44 AND resp_caste_jati_oth IS NOT NULL AND resp_caste_jati_oth != ''))
    )
    
    -- "Independent" Fields Validation
    AND (
        (q5 != 12 OR (q5 = 12 AND q5_ind IS NOT NULL AND q5_ind != '')) AND
        (q6 != 12 OR (q6 = 12 AND q6_ind IS NOT NULL AND q6_ind != '')) AND
        (q7 != 12 OR (q7 = 12 AND q7_ind IS NOT NULL AND q7_ind != '')) AND
        (q8 != 12 OR (q8 = 12 AND q8_ind IS NOT NULL AND q8_ind != '')) AND
        (q9 != 12 OR (q9 = 12 AND q9_ind IS NOT NULL AND q9_ind != ''))
    );
```

## 3. Detailed Completion Analysis with Missing Fields

```sql
-- Query to identify what's missing in incomplete interviews
SELECT 
    id,
    status,
    final_submit,
    
    -- Call Status Analysis
    CASE 
        WHEN number_status IS NULL THEN 'Missing: number_status'
        WHEN number_status != 1 THEN 'Invalid: number_status = ' || number_status
        WHEN call_ring_status IS NULL THEN 'Missing: call_ring_status'
        WHEN call_ring_status != 1 THEN 'Invalid: call_ring_status = ' || call_ring_status
        WHEN q_call_status IS NULL THEN 'Missing: q_call_status'
        WHEN q_call_status != 1 THEN 'Invalid: q_call_status = ' || q_call_status
        ELSE 'Call Status: OK'
    END as call_status_check,
    
    -- Consent Analysis
    CASE 
        WHEN consent IS NULL THEN 'Missing: consent'
        WHEN consent != 1 THEN 'Invalid: consent = ' || consent
        ELSE 'Consent: OK'
    END as consent_check,
    
    -- Demographics Analysis
    CASE 
        WHEN resp_age IS NULL THEN 'Missing: resp_age'
        WHEN resp_age < 18 THEN 'Invalid: resp_age < 18 (' || resp_age || ')'
        WHEN resp_registered_voter IS NULL THEN 'Missing: resp_registered_voter'
        WHEN resp_registered_voter != 1 THEN 'Invalid: resp_registered_voter = ' || resp_registered_voter
        WHEN resp_gender IS NULL THEN 'Missing: resp_gender'
        ELSE 'Demographics: OK'
    END as demographics_check,
    
    -- Party Preferences Analysis
    CASE 
        WHEN resp_age >= 22 AND q5 IS NULL THEN 'Missing: q5 (age >= 22)'
        WHEN resp_age >= 19 AND q6 IS NULL THEN 'Missing: q6 (age >= 19)'
        WHEN resp_age >= 20 AND q7 IS NULL THEN 'Missing: q7 (age >= 20)'
        WHEN q8 IS NULL THEN 'Missing: q8'
        WHEN q9 IS NULL THEN 'Missing: q9'
        ELSE 'Party Preferences: OK'
    END as party_preferences_check,
    
    -- Checkbox Questions Analysis
    CASE 
        WHEN NOT (q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR 
                  q10_44 = 1 OR q10_99 = 1)
        THEN 'Missing: q10 (no options selected)'
        WHEN NOT (q11_1 = 1 OR q11_2 = 1 OR q11_3 = 1 OR q11_4 = 1 OR q11_5 = 1 OR 
                  q11_6 = 1 OR q11_7 = 1 OR q11_8 = 1 OR q11_9 = 1 OR q11_11 = 1 OR 
                  q11_13 = 1 OR q11_14 = 1 OR q11_15 = 1 OR q11_44 = 1 OR q11_99 = 1)
        THEN 'Missing: q11 (no options selected)'
        WHEN NOT (q12_1 = 1 OR q12_2 = 1 OR q12_3 = 1 OR q12_5 = 1 OR q12_6 = 1 OR 
                  q12_7 = 1 OR q12_8 = 1 OR q12_9 = 1 OR q12_11 = 1 OR q12_12 = 1 OR 
                  q12_14 = 1 OR q12_44 = 1 OR q12_99 = 1)
        THEN 'Missing: q12 (no options selected)'
        WHEN NOT (q13_2 = 1 OR q13_3 = 1 OR q13_4 = 1 OR q13_5 = 1 OR q13_6 = 1 OR 
                  q13_7 = 1 OR q13_8 = 1 OR q13_9 = 1 OR q13_10 = 1 OR q13_11 = 1 OR 
                  q13_12 = 1 OR q13_13 = 1 OR q13_44 = 1)
        THEN 'Missing: q13 (no options selected)'
        ELSE 'Checkbox Questions: OK'
    END as checkbox_check,
    
    -- Satisfaction Analysis
    CASE 
        WHEN q14 IS NULL THEN 'Missing: q14'
        WHEN q15 IS NULL THEN 'Missing: q15'
        WHEN q16_a IS NULL THEN 'Missing: q16_a'
        WHEN q16_b IS NULL THEN 'Missing: q16_b'
        WHEN q17 IS NULL THEN 'Missing: q17'
        WHEN q19 IS NULL THEN 'Missing: q19'
        ELSE 'Satisfaction: OK'
    END as satisfaction_check,
    
    -- Final Demographics Analysis
    CASE 
        WHEN resp_religion IS NULL THEN 'Missing: resp_religion'
        WHEN resp_social_cat IS NULL THEN 'Missing: resp_social_cat'
        WHEN resp_caste_jati IS NULL THEN 'Missing: resp_caste_jati'
        WHEN resp_female_edu IS NULL THEN 'Missing: resp_female_edu'
        WHEN resp_male_edu IS NULL THEN 'Missing: resp_male_edu'
        WHEN resp_occupation IS NULL THEN 'Missing: resp_occupation'
        WHEN thanks_future IS NULL THEN 'Missing: thanks_future'
        ELSE 'Final Demographics: OK'
    END as final_demographics_check,
    
    -- Missing "Others" Fields Analysis
    CASE 
        WHEN q5 = 44 AND (q5_oth IS NULL OR q5_oth = '') THEN 'Missing: q5_oth (Others selected)'
        WHEN q6 = 44 AND (q6_oth IS NULL OR q6_oth = '') THEN 'Missing: q6_oth (Others selected)'
        WHEN q7 = 44 AND (q7_oth IS NULL OR q7_oth = '') THEN 'Missing: q7_oth (Others selected)'
        WHEN q8 = 44 AND (q8_oth IS NULL OR q8_oth = '') THEN 'Missing: q8_oth (Others selected)'
        WHEN q9 = 44 AND (q9_oth IS NULL OR q9_oth = '') THEN 'Missing: q9_oth (Others selected)'
        WHEN q10_44 = 1 AND (q10_oth IS NULL OR q10_oth = '') THEN 'Missing: q10_oth (Others selected)'
        WHEN q11_44 = 1 AND (q11_oth IS NULL OR q11_oth = '') THEN 'Missing: q11_oth (Others selected)'
        WHEN q12_44 = 1 AND (q12_oth IS NULL OR q12_oth = '') THEN 'Missing: q12_oth (Others selected)'
        WHEN q13_44 = 1 AND (q13_oth IS NULL OR q13_oth = '') THEN 'Missing: q13_oth (Others selected)'
        WHEN q17 = 44 AND (q17_oth IS NULL OR q17_oth = '') THEN 'Missing: q17_oth (Others selected)'
        WHEN q19 = 44 AND (q19_oth IS NULL OR q19_oth = '') THEN 'Missing: q19_oth (Others selected)'
        WHEN resp_religion = 44 AND (resp_religion_oth IS NULL OR resp_religion_oth = '') THEN 'Missing: resp_religion_oth (Others selected)'
        WHEN resp_caste_jati = 44 AND (resp_caste_jati_oth IS NULL OR resp_caste_jati_oth = '') THEN 'Missing: resp_caste_jati_oth (Others selected)'
        ELSE 'Others Fields: OK'
    END as others_fields_check,
    
    -- Missing "Independent" Fields Analysis
    CASE 
        WHEN q5 = 12 AND (q5_ind IS NULL OR q5_ind = '') THEN 'Missing: q5_ind (Independent selected)'
        WHEN q6 = 12 AND (q6_ind IS NULL OR q6_ind = '') THEN 'Missing: q6_ind (Independent selected)'
        WHEN q7 = 12 AND (q7_ind IS NULL OR q7_ind = '') THEN 'Missing: q7_ind (Independent selected)'
        WHEN q8 = 12 AND (q8_ind IS NULL OR q8_ind = '') THEN 'Missing: q8_ind (Independent selected)'
        WHEN q9 = 12 AND (q9_ind IS NULL OR q9_ind = '') THEN 'Missing: q9_ind (Independent selected)'
        ELSE 'Independent Fields: OK'
    END as independent_fields_check

FROM cati_survey_calling_interview 
WHERE status IN (2, 3, 4)  -- Include all non-failed interviews
ORDER BY id;
```

## 4. Completion Rate Analysis

```sql
-- Calculate completion rates by different criteria
SELECT 
    'Total Attempts' as metric,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_calling_interview), 2) as percentage
FROM cati_survey_calling_interview

UNION ALL

SELECT 
    'Ringing Calls' as metric,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_calling_interview), 2) as percentage
FROM cati_survey_calling_interview 
WHERE number_status = 1

UNION ALL

SELECT 
    'Picked Up Calls' as metric,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_calling_interview), 2) as percentage
FROM cati_survey_calling_interview 
WHERE number_status = 1 AND call_ring_status = 1

UNION ALL

SELECT 
    'Consented Interviews' as metric,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_calling_interview), 2) as percentage
FROM cati_survey_calling_interview 
WHERE number_status = 1 AND call_ring_status = 1 AND q_call_status = 1 AND consent = 1

UNION ALL

SELECT 
    'Eligible Respondents' as metric,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_calling_interview), 2) as percentage
FROM cati_survey_calling_interview 
WHERE number_status = 1 AND call_ring_status = 1 AND q_call_status = 1 
  AND consent = 1 AND resp_age >= 18 AND resp_registered_voter = 1

UNION ALL

SELECT 
    'Fully Completed Interviews' as metric,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_calling_interview), 2) as percentage
FROM cati_survey_calling_interview 
WHERE 
    -- Basic completion criteria
    status = 2 
    AND final_submit = 1
    
    -- Call Status Validation
    AND number_status = 1  -- Ringing
    AND call_ring_status = 1  -- Picked Up
    AND q_call_status = 1  -- Continue
    
    -- Consent Validation
    AND consent = 1  -- Yes
    
    -- Demographics Validation
    AND resp_age IS NOT NULL 
    AND resp_age >= 18  -- Eligible age
    AND resp_registered_voter = 1  -- Registered voter
    AND resp_gender IS NOT NULL  -- Gender provided
    
    -- Party Preferences Validation (Age-based conditions)
    AND (
        (resp_age >= 22 AND q5 IS NOT NULL) OR  -- Q5 required if age >= 22
        (resp_age < 22)  -- Q5 not required if age < 22
    )
    AND (
        (resp_age >= 19 AND q6 IS NOT NULL) OR  -- Q6 required if age >= 19
        (resp_age < 19)  -- Q6 not required if age < 19
    )
    AND (
        (resp_age >= 20 AND q7 IS NOT NULL) OR  -- Q7 required if age >= 20
        (resp_age < 20)  -- Q7 not required if age < 20
    )
    AND q8 IS NOT NULL  -- Q8 always required for registered voters
    AND q9 IS NOT NULL  -- Q9 always required for registered voters
    
    -- Checkbox Questions Validation (Q10-Q13)
    AND (
        -- Q10: At least one option selected (values: 1,2,3,4,5,44,99)
        (q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR 
         q10_44 = 1 OR q10_99 = 1)
    )
    AND (
        -- Q11: At least one option selected (values: 1,2,3,4,5,6,7,8,9,11,13,14,15,44,99)
        (q11_1 = 1 OR q11_2 = 1 OR q11_3 = 1 OR q11_4 = 1 OR q11_5 = 1 OR 
         q11_6 = 1 OR q11_7 = 1 OR q11_8 = 1 OR q11_9 = 1 OR q11_11 = 1 OR 
         q11_13 = 1 OR q11_14 = 1 OR q11_15 = 1 OR q11_44 = 1 OR q11_99 = 1)
    )
    AND (
        -- Q12: At least one option selected (values: 1,2,3,5,6,7,8,9,11,12,14,44,99)
        (q12_1 = 1 OR q12_2 = 1 OR q12_3 = 1 OR q12_5 = 1 OR q12_6 = 1 OR 
         q12_7 = 1 OR q12_8 = 1 OR q12_9 = 1 OR q12_11 = 1 OR q12_12 = 1 OR 
         q12_14 = 1 OR q12_44 = 1 OR q12_99 = 1)
    )
    AND (
        -- Q13: At least one option selected (values: 2,3,4,5,6,7,8,9,10,11,12,13,44)
        (q13_2 = 1 OR q13_3 = 1 OR q13_4 = 1 OR q13_5 = 1 OR q13_6 = 1 OR 
         q13_7 = 1 OR q13_8 = 1 OR q13_9 = 1 OR q13_10 = 1 OR q13_11 = 1 OR 
         q13_12 = 1 OR q13_13 = 1 OR q13_44 = 1)
    )
    
    -- Satisfaction Ratings Validation
    AND q14 IS NOT NULL  -- State government satisfaction
    AND q15 IS NOT NULL  -- BJP opposition satisfaction
    AND q16_a IS NOT NULL  -- MP satisfaction
    AND q16_b IS NOT NULL  -- MLA satisfaction
    AND q17 IS NOT NULL  -- Best CM choice
    AND q19 IS NOT NULL  -- Next election prediction
    
    -- Final Demographics Validation
    AND resp_religion IS NOT NULL
    AND resp_social_cat IS NOT NULL
    AND resp_caste_jati IS NOT NULL
    AND resp_female_edu IS NOT NULL
    AND resp_male_edu IS NOT NULL
    AND resp_occupation IS NOT NULL
    AND thanks_future IS NOT NULL
    
    -- "Others" Fields Validation
    AND (
        (q5 != 44 OR (q5 = 44 AND q5_oth IS NOT NULL AND q5_oth != '')) AND
        (q6 != 44 OR (q6 = 44 AND q6_oth IS NOT NULL AND q6_oth != '')) AND
        (q7 != 44 OR (q7 = 44 AND q7_oth IS NOT NULL AND q7_oth != '')) AND
        (q8 != 44 OR (q8 = 44 AND q8_oth IS NOT NULL AND q8_oth != '')) AND
        (q9 != 44 OR (q9 = 44 AND q9_oth IS NOT NULL AND q9_oth != '')) AND
        (q10_44 != 1 OR (q10_44 = 1 AND q10_oth IS NOT NULL AND q10_oth != '')) AND
        (q11_44 != 1 OR (q11_44 = 1 AND q11_oth IS NOT NULL AND q11_oth != '')) AND
        (q12_44 != 1 OR (q12_44 = 1 AND q12_oth IS NOT NULL AND q12_oth != '')) AND
        (q13_44 != 1 OR (q13_44 = 1 AND q13_oth IS NOT NULL AND q13_oth != '')) AND
        (q17 != 44 OR (q17 = 44 AND q17_oth IS NOT NULL AND q17_oth != '')) AND
        (q19 != 44 OR (q19 = 44 AND q19_oth IS NOT NULL AND q19_oth != '')) AND
        (resp_religion != 44 OR (resp_religion = 44 AND resp_religion_oth IS NOT NULL AND resp_religion_oth != '')) AND
        (resp_caste_jati != 44 OR (resp_caste_jati = 44 AND resp_caste_jati_oth IS NOT NULL AND resp_caste_jati_oth != ''))
    )
    
    -- "Independent" Fields Validation
    AND (
        (q5 != 12 OR (q5 = 12 AND q5_ind IS NOT NULL AND q5_ind != '')) AND
        (q6 != 12 OR (q6 = 12 AND q6_ind IS NOT NULL AND q6_ind != '')) AND
        (q7 != 12 OR (q7 = 12 AND q7_ind IS NOT NULL AND q7_ind != '')) AND
        (q8 != 12 OR (q8 = 12 AND q8_ind IS NOT NULL AND q8_ind != '')) AND
        (q9 != 12 OR (q9 = 12 AND q9_ind IS NOT NULL AND q9_ind != ''))
    );
```

## 5. Age-Based Completion Analysis

```sql
-- Analyze completion by age groups
SELECT 
    CASE 
        WHEN resp_age < 18 THEN 'Under 18 (Ineligible)'
        WHEN resp_age BETWEEN 18 AND 21 THEN '18-21 (Limited Questions)'
        WHEN resp_age BETWEEN 22 AND 24 THEN '22-24 (Most Questions)'
        WHEN resp_age >= 25 THEN '25+ (All Questions)'
        ELSE 'Age Not Provided'
    END as age_group,
    COUNT(*) as total_interviews,
    COUNT(CASE WHEN status = 2 AND final_submit = 1 THEN 1 END) as completed_interviews,
    ROUND(COUNT(CASE WHEN status = 2 AND final_submit = 1 THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM cati_survey_calling_interview 
WHERE number_status = 1 AND call_ring_status = 1 AND q_call_status = 1 AND consent = 1
GROUP BY 
    CASE 
        WHEN resp_age < 18 THEN 'Under 18 (Ineligible)'
        WHEN resp_age BETWEEN 18 AND 21 THEN '18-21 (Limited Questions)'
        WHEN resp_age BETWEEN 22 AND 24 THEN '22-24 (Most Questions)'
        WHEN resp_age >= 25 THEN '25+ (All Questions)'
        ELSE 'Age Not Provided'
    END
ORDER BY 
    CASE 
        WHEN resp_age < 18 THEN 1
        WHEN resp_age BETWEEN 18 AND 21 THEN 2
        WHEN resp_age BETWEEN 22 AND 24 THEN 3
        WHEN resp_age >= 25 THEN 4
        ELSE 5
    END;
```

## 6. Checkbox Validation with Exclusive Options

```sql
-- Validate checkbox exclusive options logic
SELECT 
    id,
    -- Q10 Exclusive Options Check
    CASE 
        WHEN (q10_5 = 1 OR q10_99 = 1) AND 
             (q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_44 = 1)
        THEN 'Q10: Invalid - Exclusive options selected with regular options'
        WHEN NOT (q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR 
                  q10_44 = 1 OR q10_99 = 1)
        THEN 'Q10: Missing - No options selected'
        ELSE 'Q10: Valid'
    END as q10_validation,
    
    -- Q11 Exclusive Options Check
    CASE 
        WHEN q11_99 = 1 AND 
             (q11_1 = 1 OR q11_2 = 1 OR q11_3 = 1 OR q11_4 = 1 OR q11_5 = 1 OR 
              q11_6 = 1 OR q11_7 = 1 OR q11_8 = 1 OR q11_9 = 1 OR q11_11 = 1 OR 
              q11_13 = 1 OR q11_14 = 1 OR q11_15 = 1 OR q11_44 = 1)
        THEN 'Q11: Invalid - Don''t know selected with other options'
        WHEN NOT (q11_1 = 1 OR q11_2 = 1 OR q11_3 = 1 OR q11_4 = 1 OR q11_5 = 1 OR 
                  q11_6 = 1 OR q11_7 = 1 OR q11_8 = 1 OR q11_9 = 1 OR q11_11 = 1 OR 
                  q11_13 = 1 OR q11_14 = 1 OR q11_15 = 1 OR q11_44 = 1 OR q11_99 = 1)
        THEN 'Q11: Missing - No options selected'
        ELSE 'Q11: Valid'
    END as q11_validation,
    
    -- Q12 Exclusive Options Check
    CASE 
        WHEN q12_99 = 1 AND 
             (q12_1 = 1 OR q12_2 = 1 OR q12_3 = 1 OR q12_5 = 1 OR q12_6 = 1 OR 
              q12_7 = 1 OR q12_8 = 1 OR q12_9 = 1 OR q12_11 = 1 OR q12_12 = 1 OR 
              q12_14 = 1 OR q12_44 = 1)
        THEN 'Q12: Invalid - Don''t know selected with other options'
        WHEN NOT (q12_1 = 1 OR q12_2 = 1 OR q12_3 = 1 OR q12_5 = 1 OR q12_6 = 1 OR 
                  q12_7 = 1 OR q12_8 = 1 OR q12_9 = 1 OR q12_11 = 1 OR q12_12 = 1 OR 
                  q12_14 = 1 OR q12_44 = 1 OR q12_99 = 1)
        THEN 'Q12: Missing - No options selected'
        ELSE 'Q12: Valid'
    END as q12_validation

FROM cati_survey_calling_interview 
WHERE status IN (2, 3, 4)
  AND resp_registered_voter = 1;
```

## 7. "Others" Field Validation

```sql
-- Check if "Others" fields are filled when "Others" option is selected
SELECT 
    id,
    -- Q5 Others validation
    CASE 
        WHEN q5 = 44 AND (q5_oth IS NULL OR q5_oth = '') THEN 'Q5: Others selected but not specified'
        WHEN q5 != 44 AND q5_oth IS NOT NULL AND q5_oth != '' THEN 'Q5: Others not selected but specified'
        ELSE 'Q5: Valid'
    END as q5_others_check,
    
    -- Q6 Others validation
    CASE 
        WHEN q6 = 44 AND (q6_oth IS NULL OR q6_oth = '') THEN 'Q6: Others selected but not specified'
        WHEN q6 != 44 AND q6_oth IS NOT NULL AND q6_oth != '' THEN 'Q6: Others not selected but specified'
        ELSE 'Q6: Valid'
    END as q6_others_check,
    
    -- Q10 Others validation
    CASE 
        WHEN q10_44 = 1 AND (q10_oth IS NULL OR q10_oth = '') THEN 'Q10: Others selected but not specified'
        WHEN q10_44 != 1 AND q10_oth IS NOT NULL AND q10_oth != '' THEN 'Q10: Others not selected but specified'
        ELSE 'Q10: Valid'
    END as q10_others_check,
    
    -- Religion Others validation
    CASE 
        WHEN resp_religion = 44 AND (resp_religion_oth IS NULL OR resp_religion_oth = '') THEN 'Religion: Others selected but not specified'
        WHEN resp_religion != 44 AND resp_religion_oth IS NOT NULL AND resp_religion_oth != '' THEN 'Religion: Others not selected but specified'
        ELSE 'Religion: Valid'
    END as religion_others_check

FROM cati_survey_calling_interview 
WHERE status IN (2, 3, 4)
  AND resp_registered_voter = 1;
```

## 8. Final Complete Validation Query

```sql
-- Ultimate completion validation query
WITH completion_checks AS (
    SELECT 
        id,
        status,
        final_submit,
        
        -- Basic completion flags
        CASE WHEN status = 2 AND final_submit = 1 THEN 1 ELSE 0 END as basic_complete,
        
        -- Call flow completion
        CASE WHEN number_status = 1 AND call_ring_status = 1 AND q_call_status = 1 THEN 1 ELSE 0 END as call_complete,
        
        -- Consent completion
        CASE WHEN consent = 1 THEN 1 ELSE 0 END as consent_complete,
        
        -- Demographics completion
        CASE WHEN resp_age >= 18 AND resp_registered_voter = 1 AND resp_gender IS NOT NULL THEN 1 ELSE 0 END as demographics_complete,
        
        -- Party preferences completion (age-based)
        CASE WHEN 
            (resp_age >= 22 AND q5 IS NOT NULL OR resp_age < 22) AND
            (resp_age >= 19 AND q6 IS NOT NULL OR resp_age < 19) AND
            (resp_age >= 20 AND q7 IS NOT NULL OR resp_age < 20) AND
            q8 IS NOT NULL AND q9 IS NOT NULL
        THEN 1 ELSE 0 END as party_preferences_complete,
        
        -- Checkbox completion
        CASE WHEN 
            (q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR q10_44 = 1 OR q10_99 = 1) AND
            (q11_1 = 1 OR q11_2 = 1 OR q11_3 = 1 OR q11_4 = 1 OR q11_5 = 1 OR q11_6 = 1 OR q11_7 = 1 OR q11_8 = 1 OR q11_9 = 1 OR q11_11 = 1 OR q11_13 = 1 OR q11_14 = 1 OR q11_15 = 1 OR q11_44 = 1 OR q11_99 = 1) AND
            (q12_1 = 1 OR q12_2 = 1 OR q12_3 = 1 OR q12_5 = 1 OR q12_6 = 1 OR q12_7 = 1 OR q12_8 = 1 OR q12_9 = 1 OR q12_11 = 1 OR q12_12 = 1 OR q12_14 = 1 OR q12_44 = 1 OR q12_99 = 1) AND
            (q13_2 = 1 OR q13_3 = 1 OR q13_4 = 1 OR q13_5 = 1 OR q13_6 = 1 OR q13_7 = 1 OR q13_8 = 1 OR q13_9 = 1 OR q13_10 = 1 OR q13_11 = 1 OR q13_12 = 1 OR q13_13 = 1 OR q13_44 = 1)
        THEN 1 ELSE 0 END as checkbox_complete,
        
        -- Satisfaction completion
        CASE WHEN q14 IS NOT NULL AND q15 IS NOT NULL AND q16_a IS NOT NULL AND q16_b IS NOT NULL AND q17 IS NOT NULL AND q19 IS NOT NULL THEN 1 ELSE 0 END as satisfaction_complete,
        
        -- Final demographics completion
        CASE WHEN resp_religion IS NOT NULL AND resp_social_cat IS NOT NULL AND resp_caste_jati IS NOT NULL AND resp_female_edu IS NOT NULL AND resp_male_edu IS NOT NULL AND resp_occupation IS NOT NULL AND thanks_future IS NOT NULL THEN 1 ELSE 0 END as final_demographics_complete
        
    FROM cati_survey_calling_interview
)
SELECT 
    id,
    status,
    final_submit,
    basic_complete,
    call_complete,
    consent_complete,
    demographics_complete,
    party_preferences_complete,
    checkbox_complete,
    satisfaction_complete,
    final_demographics_complete,
    
    -- Overall completion score
    (call_complete + consent_complete + demographics_complete + party_preferences_complete + checkbox_complete + satisfaction_complete + final_demographics_complete) as completion_score,
    
    -- Completion status
    CASE 
        WHEN basic_complete = 1 AND call_complete = 1 AND consent_complete = 1 AND demographics_complete = 1 AND party_preferences_complete = 1 AND checkbox_complete = 1 AND satisfaction_complete = 1 AND final_demographics_complete = 1 
        THEN 'FULLY_COMPLETED'
        WHEN basic_complete = 1 
        THEN 'MARKED_COMPLETED_BUT_INCOMPLETE'
        WHEN (call_complete + consent_complete + demographics_complete + party_preferences_complete + checkbox_complete + satisfaction_complete + final_demographics_complete) >= 5
        THEN 'MOSTLY_COMPLETED'
        WHEN (call_complete + consent_complete + demographics_complete + party_preferences_complete + checkbox_complete + satisfaction_complete + final_demographics_complete) >= 3
        THEN 'PARTIALLY_COMPLETED'
        ELSE 'INCOMPLETE'
    END as completion_status

FROM completion_checks
ORDER BY completion_score DESC, id;
```

## Usage Notes

1. **Replace table name**: Change `cati_survey_calling_interview` to your actual table name
2. **Adjust field names**: Ensure field names match your database schema
3. **Add indexes**: Consider adding indexes on frequently queried fields like `status`, `final_submit`, `resp_age`, etc.
4. **Performance**: For large datasets, consider adding WHERE clauses to limit date ranges
5. **Validation**: Test queries on a subset of data first to ensure accuracy

These queries provide comprehensive analysis of interview completion status considering all conditional logic and required field dependencies in the tele-form flow.
