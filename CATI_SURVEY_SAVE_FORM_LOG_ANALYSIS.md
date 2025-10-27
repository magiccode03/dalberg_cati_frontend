# CATI Survey Save Form Log Analysis

## Overview
This document provides SQL queries for analyzing the `cati_survey_save_form_log` table, which tracks form submission logs with detailed metrics on completion flow, pass/fail rates, and submission patterns.

## Table Structure
```sql
-- Table: cati_survey_save_form_log
-- Fields:
-- survey_id: Form ID (references the main interview)
-- form_data: JSON data containing all form fields
-- save_type: Submission status (1=Call Initiated, 2=Successful Submit, 3=Partial Submit, 4=Draft)
-- created_at: Timestamp of submission
-- updated_at: Last update timestamp
```

## 1. General Metrics Overview

### 1.1 Total Submissions by Save Type
```sql
SELECT 
    CASE 
        WHEN save_type = 1 THEN 'Call Initiated'
        WHEN save_type = 2 THEN 'Successful Submit'
        WHEN save_type = 3 THEN 'Partial Submit (Call Dropped)'
        WHEN save_type = 4 THEN 'Draft Save'
        ELSE 'Unknown'
    END as submission_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cati_survey_save_form_log), 2) as percentage
FROM cati_survey_save_form_log
GROUP BY save_type
ORDER BY save_type;
```

### 1.2 Daily Submission Trends
```sql
SELECT 
    DATE(created_at) as submission_date,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) as successful_submissions,
    SUM(CASE WHEN save_type = 3 THEN 1 ELSE 0 END) as partial_submissions,
    SUM(CASE WHEN save_type = 4 THEN 1 ELSE 0 END) as draft_saves,
    ROUND(SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM cati_survey_save_form_log
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY submission_date DESC;
```

### 1.3 Hourly Submission Patterns
```sql
SELECT 
    HOUR(created_at) as hour_of_day,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) as successful_submissions,
    ROUND(SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM cati_survey_save_form_log
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY HOUR(created_at)
ORDER BY hour_of_day;
```

## 2. Complete Form Flow Analysis

### 2.1 Form Completion Flow Tracking
```sql
-- Track the progression of each survey through different save types
WITH survey_progression AS (
    SELECT 
        survey_id,
        MIN(CASE WHEN save_type = 1 THEN created_at END) as call_initiated_at,
        MIN(CASE WHEN save_type = 2 THEN created_at END) as successful_submit_at,
        MIN(CASE WHEN save_type = 3 THEN created_at END) as partial_submit_at,
        MIN(CASE WHEN save_type = 4 THEN created_at END) as first_draft_at,
        COUNT(*) as total_saves,
        MAX(save_type) as final_save_type
    FROM cati_survey_save_form_log
    GROUP BY survey_id
)
SELECT 
    CASE 
        WHEN successful_submit_at IS NOT NULL THEN 'Completed Successfully'
        WHEN partial_submit_at IS NOT NULL THEN 'Partially Completed'
        WHEN call_initiated_at IS NOT NULL THEN 'Call Initiated Only'
        ELSE 'Draft Only'
    END as completion_status,
    COUNT(*) as survey_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM cati_survey_save_form_log), 2) as percentage,
    AVG(total_saves) as avg_saves_per_survey,
    AVG(CASE 
        WHEN successful_submit_at IS NOT NULL AND call_initiated_at IS NOT NULL 
        THEN TIMESTAMPDIFF(MINUTE, call_initiated_at, successful_submit_at)
        END) as avg_completion_time_minutes
FROM survey_progression
GROUP BY completion_status
ORDER BY survey_count DESC;
```

### 2.2 Form Flow Pass/Fail Analysis
```sql
-- Analyze pass/fail rates based on form completion criteria
WITH form_validation AS (
    SELECT 
        survey_id,
        save_type,
        form_data,
        created_at,
        -- Extract key fields from JSON for validation
        JSON_EXTRACT(form_data, '$.status') as status,
        JSON_EXTRACT(form_data, '$.final_submit') as final_submit,
        JSON_EXTRACT(form_data, '$.number_status') as number_status,
        JSON_EXTRACT(form_data, '$.call_ring_status') as call_ring_status,
        JSON_EXTRACT(form_data, '$.q_call_status') as q_call_status,
        JSON_EXTRACT(form_data, '$.consent') as consent,
        JSON_EXTRACT(form_data, '$.resp_age') as resp_age,
        JSON_EXTRACT(form_data, '$.resp_registered_voter') as resp_registered_voter,
        JSON_EXTRACT(form_data, '$.resp_gender') as resp_gender
    FROM cati_survey_save_form_log
    WHERE save_type = 2  -- Only analyze successful submissions
),
validation_results AS (
    SELECT 
        survey_id,
        save_type,
        created_at,
        -- Pass criteria: Complete call flow + consent + demographics
        CASE 
            WHEN number_status = 1 
                AND call_ring_status = 1 
                AND q_call_status = 1 
                AND consent = 1 
                AND resp_age IS NOT NULL 
                AND resp_age >= 18 
                AND resp_registered_voter = 1 
                AND resp_gender IS NOT NULL
            THEN 'PASS'
            ELSE 'FAIL'
        END as validation_result,
        -- Detailed failure reasons
        CASE 
            WHEN number_status != 1 THEN 'Call not ringing'
            WHEN call_ring_status != 1 THEN 'Call not picked up'
            WHEN q_call_status != 1 THEN 'Call not continued'
            WHEN consent != 1 THEN 'No consent'
            WHEN resp_age IS NULL THEN 'Age missing'
            WHEN resp_age < 18 THEN 'Underage'
            WHEN resp_registered_voter != 1 THEN 'Not registered voter'
            WHEN resp_gender IS NULL THEN 'Gender missing'
            ELSE 'Unknown'
        END as failure_reason
    FROM form_validation
)
SELECT 
    validation_result,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM validation_results), 2) as percentage
FROM validation_results
GROUP BY validation_result

UNION ALL

SELECT 
    CONCAT('FAIL - ', failure_reason) as validation_result,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM validation_results WHERE validation_result = 'FAIL'), 2) as percentage
FROM validation_results
WHERE validation_result = 'FAIL'
GROUP BY failure_reason
ORDER BY count DESC;
```

### 2.3 Form Completion Rate by Time Period
```sql
-- Analyze completion rates over time
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) as successful_submissions,
    SUM(CASE WHEN save_type = 3 THEN 1 ELSE 0 END) as partial_submissions,
    SUM(CASE WHEN save_type = 4 THEN 1 ELSE 0 END) as draft_saves,
    ROUND(SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate,
    ROUND(SUM(CASE WHEN save_type = 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as partial_completion_rate
FROM cati_survey_save_form_log
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 3. Detailed Form Data Analysis

### 3.1 Form Field Completion Analysis
```sql
-- Analyze completion of specific form fields in successful submissions
WITH field_analysis AS (
    SELECT 
        survey_id,
        -- Extract key fields from JSON
        JSON_EXTRACT(form_data, '$.q5') as q5,
        JSON_EXTRACT(form_data, '$.q6') as q6,
        JSON_EXTRACT(form_data, '$.q7') as q7,
        JSON_EXTRACT(form_data, '$.q8') as q8,
        JSON_EXTRACT(form_data, '$.q9') as q9,
        JSON_EXTRACT(form_data, '$.q14') as q14,
        JSON_EXTRACT(form_data, '$.q15') as q15,
        JSON_EXTRACT(form_data, '$.resp_religion') as resp_religion,
        JSON_EXTRACT(form_data, '$.resp_caste_jati') as resp_caste_jati
    FROM cati_survey_save_form_log
    WHERE save_type = 2  -- Only successful submissions
)
SELECT 
    'Q5 (Party Preference 1)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q5 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q5 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Q6 (Party Preference 2)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q6 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q6 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Q7 (Party Preference 3)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q7 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q7 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Q8 (Party Preference 4)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q8 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q8 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Q9 (Party Preference 5)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q9 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q9 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Q14 (State Govt Satisfaction)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q14 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q14 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Q15 (BJP Opposition Satisfaction)' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN q15 IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN q15 IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Religion' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN resp_religion IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN resp_religion IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

UNION ALL

SELECT 
    'Caste/Jati' as field_name,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN resp_caste_jati IS NOT NULL THEN 1 ELSE 0 END) as completed,
    ROUND(SUM(CASE WHEN resp_caste_jati IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM field_analysis

ORDER BY completion_rate DESC;
```

### 3.2 Checkbox Questions Analysis
```sql
-- Analyze checkbox questions completion in successful submissions
WITH checkbox_analysis AS (
    SELECT 
        survey_id,
        -- Extract checkbox fields
        JSON_EXTRACT(form_data, '$.q10_1') as q10_1,
        JSON_EXTRACT(form_data, '$.q10_2') as q10_2,
        JSON_EXTRACT(form_data, '$.q10_3') as q10_3,
        JSON_EXTRACT(form_data, '$.q10_4') as q10_4,
        JSON_EXTRACT(form_data, '$.q10_5') as q10_5,
        JSON_EXTRACT(form_data, '$.q10_44') as q10_44,
        JSON_EXTRACT(form_data, '$.q10_99') as q10_99
    FROM cati_survey_save_form_log
    WHERE save_type = 2  -- Only successful submissions
)
SELECT 
    'Q10 Checkbox Completion' as metric,
    COUNT(*) as total_submissions,
    SUM(CASE 
        WHEN q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR q10_44 = 1 OR q10_99 = 1 
        THEN 1 ELSE 0 
    END) as completed,
    ROUND(SUM(CASE 
        WHEN q10_1 = 1 OR q10_2 = 1 OR q10_3 = 1 OR q10_4 = 1 OR q10_5 = 1 OR q10_44 = 1 OR q10_99 = 1 
        THEN 1 ELSE 0 
    END) * 100.0 / COUNT(*), 2) as completion_rate
FROM checkbox_analysis;
```

## 4. Performance and Quality Metrics

### 4.1 Average Form Completion Time
```sql
-- Calculate average time from first draft to successful submission
WITH completion_times AS (
    SELECT 
        survey_id,
        MIN(CASE WHEN save_type = 4 THEN created_at END) as first_draft,
        MIN(CASE WHEN save_type = 2 THEN created_at END) as successful_submit,
        TIMESTAMPDIFF(MINUTE, 
            MIN(CASE WHEN save_type = 4 THEN created_at END), 
            MIN(CASE WHEN save_type = 2 THEN created_at END)
        ) as completion_time_minutes
    FROM cati_survey_save_form_log
    WHERE save_type IN (2, 4)  -- Successful submit and draft
    GROUP BY survey_id
    HAVING first_draft IS NOT NULL AND successful_submit IS NOT NULL
)
SELECT 
    'Form Completion Time Analysis' as metric,
    COUNT(*) as completed_forms,
    ROUND(AVG(completion_time_minutes), 2) as avg_completion_time_minutes,
    ROUND(MIN(completion_time_minutes), 2) as min_completion_time_minutes,
    ROUND(MAX(completion_time_minutes), 2) as max_completion_time_minutes,
    ROUND(STDDEV(completion_time_minutes), 2) as std_deviation_minutes
FROM completion_times;
```

### 4.2 Form Save Frequency Analysis
```sql
-- Analyze how many times forms are saved before completion
WITH save_frequency AS (
    SELECT 
        survey_id,
        COUNT(*) as total_saves,
        MAX(save_type) as final_save_type,
        COUNT(CASE WHEN save_type = 4 THEN 1 END) as draft_saves,
        COUNT(CASE WHEN save_type = 2 THEN 1 END) as successful_saves
    FROM cati_survey_save_form_log
    GROUP BY survey_id
)
SELECT 
    CASE 
        WHEN final_save_type = 2 THEN 'Successfully Completed'
        WHEN final_save_type = 3 THEN 'Partially Completed'
        WHEN final_save_type = 4 THEN 'Draft Only'
        ELSE 'Other'
    END as completion_status,
    COUNT(*) as survey_count,
    ROUND(AVG(total_saves), 2) as avg_saves_per_survey,
    ROUND(AVG(draft_saves), 2) as avg_draft_saves,
    ROUND(AVG(successful_saves), 2) as avg_successful_saves
FROM save_frequency
GROUP BY completion_status
ORDER BY survey_count DESC;
```

## 5. Error and Failure Analysis

### 5.1 Failed Submission Analysis
```sql
-- Analyze patterns in failed submissions
WITH failed_submissions AS (
    SELECT 
        survey_id,
        save_type,
        form_data,
        created_at,
        -- Extract error indicators from form data
        JSON_EXTRACT(form_data, '$.status') as status,
        JSON_EXTRACT(form_data, '$.final_submit') as final_submit,
        JSON_EXTRACT(form_data, '$.consent') as consent,
        JSON_EXTRACT(form_data, '$.resp_age') as resp_age
    FROM cati_survey_save_form_log
    WHERE save_type IN (3, 4)  -- Partial submits and drafts
)
SELECT 
    CASE 
        WHEN save_type = 3 THEN 'Partial Submit (Call Dropped)'
        WHEN save_type = 4 THEN 'Draft Save'
        ELSE 'Unknown'
    END as failure_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM failed_submissions), 2) as percentage,
    -- Analyze common failure patterns
    SUM(CASE WHEN consent != 1 THEN 1 ELSE 0 END) as no_consent_count,
    SUM(CASE WHEN resp_age IS NULL THEN 1 ELSE 0 END) as missing_age_count,
    SUM(CASE WHEN resp_age < 18 THEN 1 ELSE 0 END) as underage_count
FROM failed_submissions
GROUP BY save_type
ORDER BY count DESC;
```

### 5.2 Data Quality Issues
```sql
-- Identify data quality issues in successful submissions
WITH quality_check AS (
    SELECT 
        survey_id,
        form_data,
        -- Check for common data quality issues
        CASE WHEN JSON_EXTRACT(form_data, '$.resp_age') < 18 THEN 1 ELSE 0 END as underage_issue,
        CASE WHEN JSON_EXTRACT(form_data, '$.resp_age') > 100 THEN 1 ELSE 0 END as invalid_age_issue,
        CASE WHEN JSON_EXTRACT(form_data, '$.consent') != 1 THEN 1 ELSE 0 END as consent_issue,
        CASE WHEN JSON_EXTRACT(form_data, '$.resp_registered_voter') != 1 THEN 1 ELSE 0 END as voter_issue
    FROM cati_survey_save_form_log
    WHERE save_type = 2  -- Only successful submissions
)
SELECT 
    'Data Quality Issues in Successful Submissions' as metric,
    COUNT(*) as total_successful_submissions,
    SUM(underage_issue) as underage_issues,
    SUM(invalid_age_issue) as invalid_age_issues,
    SUM(consent_issue) as consent_issues,
    SUM(voter_issue) as voter_registration_issues,
    ROUND((SUM(underage_issue) + SUM(invalid_age_issue) + SUM(consent_issue) + SUM(voter_issue)) * 100.0 / COUNT(*), 2) as total_quality_issues_percentage
FROM quality_check;
```

## 6. Summary Dashboard Query

### 6.1 Complete Metrics Dashboard
```sql
-- Comprehensive dashboard with all key metrics
SELECT 
    '=== CATI SURVEY SAVE FORM LOG ANALYSIS ===' as section,
    '' as metric,
    '' as value,
    '' as percentage

UNION ALL

SELECT 
    'GENERAL METRICS' as section,
    'Total Submissions' as metric,
    CAST(COUNT(*) as CHAR) as value,
    '100.00' as percentage
FROM cati_survey_save_form_log

UNION ALL

SELECT 
    'GENERAL METRICS' as section,
    'Successful Submissions' as metric,
    CAST(SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) as CHAR) as value,
    CAST(ROUND(SUM(CASE WHEN save_type = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as CHAR) as percentage
FROM cati_survey_save_form_log

UNION ALL

SELECT 
    'GENERAL METRICS' as section,
    'Partial Submissions' as metric,
    CAST(SUM(CASE WHEN save_type = 3 THEN 1 ELSE 0 END) as CHAR) as value,
    CAST(ROUND(SUM(CASE WHEN save_type = 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as CHAR) as percentage
FROM cati_survey_save_form_log

UNION ALL

SELECT 
    'GENERAL METRICS' as section,
    'Draft Saves' as metric,
    CAST(SUM(CASE WHEN save_type = 4 THEN 1 ELSE 0 END) as CHAR) as value,
    CAST(ROUND(SUM(CASE WHEN save_type = 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as CHAR) as percentage
FROM cati_survey_save_form_log

UNION ALL

SELECT 
    'COMPLETION FLOW' as section,
    'Unique Surveys Tracked' as metric,
    CAST(COUNT(DISTINCT survey_id) as CHAR) as value,
    '' as percentage
FROM cati_survey_save_form_log

UNION ALL

SELECT 
    'COMPLETION FLOW' as section,
    'Avg Saves per Survey' as metric,
    CAST(ROUND(COUNT(*) / COUNT(DISTINCT survey_id), 2) as CHAR) as value,
    '' as percentage
FROM cati_survey_save_form_log

UNION ALL

SELECT 
    'PERFORMANCE' as section,
    'Submissions Today' as metric,
    CAST(COUNT(*) as CHAR) as value,
    '' as percentage
FROM cati_survey_save_form_log
WHERE DATE(created_at) = CURDATE()

UNION ALL

SELECT 
    'PERFORMANCE' as section,
    'Submissions This Week' as metric,
    CAST(COUNT(*) as CHAR) as value,
    '' as percentage
FROM cati_survey_save_form_log
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)

ORDER BY section, metric;
```

## Usage Instructions

1. **Run General Metrics**: Start with Query 1.1 to understand overall submission patterns
2. **Analyze Completion Flow**: Use Query 2.1 to track how surveys progress through different stages
3. **Check Pass/Fail Rates**: Use Query 2.2 to validate form completion quality
4. **Monitor Performance**: Use Query 4.1 to track completion times and efficiency
5. **Identify Issues**: Use Query 5.1 to find common failure patterns
6. **Dashboard View**: Use Query 6.1 for a comprehensive overview

## Key Insights to Look For

- **Completion Rate**: Percentage of surveys that reach successful submission
- **Drop-off Points**: Where surveys most commonly fail or get abandoned
- **Data Quality**: Issues in successful submissions that need attention
- **Performance**: Average time to complete forms and save frequency
- **Trends**: Daily/hourly patterns in submission behavior

This analysis will help optimize the form completion process and improve data quality.
