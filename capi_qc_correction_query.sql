-- SQL Query to Correct CAPI QC Status Fields
-- This query updates audio_qc_status, status, audio_qc_rejection_level, and status_reason_reject
-- based on existing QC question values and resp_age from instance data

-- ASSUMPTION: Replace 'capi_interviews' with your actual table name
-- ASSUMPTION: resp_age is available in the same table or needs to be joined from instance table

-- =====================================================
-- OPTION 1: If resp_age is in the same table
-- =====================================================

UPDATE capi_interviews AS ci
SET 
    -- Determine rejection level based on QC logic
    audio_qc_rejection_level = CASE
        -- Case 1: Audio status is 2 (No Conversation), 3 (Irrelevant), or 8 (Duplicate) → Fail at level 1
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 1
        
        -- Case 2: Audio status is 1, 4, or 7 → Check mandatory questions
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                -- Check qc_q2 (always mandatory)
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 2
                
                -- Check qc_q3 (always mandatory)
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 3
                
                -- Check qc_q5 (mandatory if resp_age >= 19)
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 5
                
                -- Check qc_q4 (mandatory if resp_age >= 22)
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 4
                
                -- Check "Cannot hear clearly" count (value 3)
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 6
                
                -- All checks passed → Pass
                ELSE 0
            END
        )
        
        -- Default: Fail at level 1
        ELSE 1
    END,
    
    -- Set audio_qc_status: 1 = Pass, 2 = Fail
    audio_qc_status = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 2  -- Fail immediately
        
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                -- Fail if qc_q2 is not "1"
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 2
                
                -- Fail if qc_q3 is not "1"
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 2
                
                -- Fail if qc_q5 is mandatory (resp_age >= 19) and not "1"
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 2
                
                -- Fail if qc_q4 is mandatory (resp_age >= 22) and not "1"
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 2
                
                -- Fail if more than 3 questions have "Cannot hear clearly" (value 3)
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 2
                
                -- All passed → Pass
                ELSE 1
            END
        )
        
        -- Default: Fail
        ELSE 2
    END,
    
    -- Set status: 10 = Pass, 20 = Fail
    status = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 20  -- Fail immediately
        
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 20
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 20
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 20
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 20
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 20
                ELSE 10
            END
        )
        
        ELSE 20
    END,
    
    -- Set status_reason_reject: 25 = Rejected, NULL = Passed
    status_reason_reject = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 25  -- Fail immediately
        
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 25
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 25
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 25
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 25
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 25
                ELSE NULL
            END
        )
        
        ELSE 25
    END

WHERE 
    -- Only update records where QC data exists
    ci.qc_audio_status IS NOT NULL
    AND ci.qc_q2 IS NOT NULL
    AND ci.qc_q3 IS NOT NULL
    -- Optional: Add conditions to filter specific records
    -- AND ci.server_id IN (12345, 67890)
    -- AND ci.audio_qc_complete_date IS NOT NULL
;


-- =====================================================
-- OPTION 2: If resp_age needs to be joined from instance table
-- =====================================================

UPDATE capi_interviews AS ci
INNER JOIN capi_instances AS inst ON ci.server_id = inst.server_id
SET 
    audio_qc_rejection_level = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 1
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 2
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 3
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 5
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 4
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 6
                ELSE 0
            END
        )
        ELSE 1
    END,
    
    audio_qc_status = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 2
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 2
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 2
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 2
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 2
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 2
                ELSE 1
            END
        )
        ELSE 2
    END,
    
    status = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 20
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 20
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 20
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 20
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 20
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 20
                ELSE 10
            END
        )
        ELSE 20
    END,
    
    status_reason_reject = CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 25
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 25
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 25
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 25
                WHEN CAST(inst.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 25
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 25
                ELSE NULL
            END
        )
        ELSE 25
    END

WHERE 
    ci.qc_audio_status IS NOT NULL
    AND ci.qc_q2 IS NOT NULL
    AND ci.qc_q3 IS NOT NULL
;


-- =====================================================
-- PREVIEW QUERY (SELECT) - Run this first to see what will be updated
-- =====================================================

SELECT 
    ci.server_id,
    ci.qc_audio_status,
    ci.resp_age,  -- or inst.resp_age if joining
    ci.qc_q2,
    ci.qc_q3,
    ci.qc_q4,
    ci.qc_q5,
    ci.qc_q6,
    
    -- Current values
    ci.audio_qc_status AS current_audio_qc_status,
    ci.audio_qc_rejection_level AS current_rejection_level,
    ci.status AS current_status,
    ci.status_reason_reject AS current_status_reason,
    
    -- Calculated values (what will be set)
    CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 2
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 2
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 2
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 2
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 2
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 2
                ELSE 1
            END
        )
        ELSE 2
    END AS new_audio_qc_status,
    
    CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 1
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 2
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 3
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 5
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 4
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 6
                ELSE 0
            END
        )
        ELSE 1
    END AS new_rejection_level,
    
    CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 20
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 20
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 20
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 20
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 20
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 20
                ELSE 10
            END
        )
        ELSE 20
    END AS new_status,
    
    CASE
        WHEN ci.qc_audio_status IN (2, 3, 8) THEN 25
        WHEN ci.qc_audio_status IN (1, 4, 7) THEN (
            CASE
                WHEN ci.qc_q2 IS NOT NULL AND ci.qc_q2 != 1 THEN 25
                WHEN ci.qc_q3 IS NOT NULL AND ci.qc_q3 != 1 THEN 25
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 19 
                     AND ci.qc_q5 IS NOT NULL 
                     AND ci.qc_q5 != 1 THEN 25
                WHEN CAST(ci.resp_age AS UNSIGNED) >= 22 
                     AND ci.qc_q4 IS NOT NULL 
                     AND ci.qc_q4 != 1 THEN 25
                WHEN (
                    (ci.qc_q2 = 3) + 
                    (ci.qc_q3 = 3) + 
                    (IFNULL(ci.qc_q4, 0) = 3) + 
                    (IFNULL(ci.qc_q5, 0) = 3) + 
                    (IFNULL(ci.qc_q6, 0) = 3)
                ) > 3 THEN 25
                ELSE NULL
            END
        )
        ELSE 25
    END AS new_status_reason

FROM capi_interviews AS ci
WHERE 
    ci.qc_audio_status IS NOT NULL
    AND ci.qc_q2 IS NOT NULL
    AND ci.qc_q3 IS NOT NULL
    -- Add filters as needed
    -- AND ci.server_id BETWEEN 100000 AND 200000
ORDER BY ci.server_id
LIMIT 100;  -- Check first 100 records

