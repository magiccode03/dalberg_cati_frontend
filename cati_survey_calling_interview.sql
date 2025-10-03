-- =====================================================
-- CATI Survey Calling Interview Table Creation Script
-- West Bengal Opinion Poll 2025
-- =====================================================

-- Drop table if exists (for fresh creation)
DROP TABLE IF EXISTS `cati_survey_calling_interview`;

-- Create the main table
CREATE TABLE `cati_survey_calling_interview` (
  -- =====================================================
  -- PRIMARY KEY & BASIC IDENTIFICATION
  -- =====================================================
  `id` INT NOT NULL AUTO_INCREMENT,
  
  -- =====================================================
  -- ASSIGNMENT & TRACKING
  -- =====================================================
  `survey_data_id` INT NOT NULL COMMENT 'Reference to master survey data',
  `agency_id` INT DEFAULT 1 COMMENT 'Agency ID',
  `supervisor_id` INT DEFAULT NULL COMMENT 'Supervisor user ID',
  `teleform_user_id` INT DEFAULT NULL COMMENT 'Telecaller/Teleform user ID',
  `generate_date` DATE DEFAULT NULL COMMENT 'Date when record was generated',
  `track` INT NOT NULL DEFAULT 0 COMMENT 'Survey track number',
  `calling_group` INT DEFAULT 1 COMMENT 'Calling group assignment',
  `priority` INT NOT NULL DEFAULT 0 COMMENT 'Call priority (0-10)',
  `status` TINYINT NOT NULL COMMENT 'Survey status (0=Pending, 1=Completed, 2=Rejected, 3=In Progress, 4=Dropped, 5=Rescheduled)',
  
  -- =====================================================
  -- RESPONDENT IDENTIFICATION (Section 1)
  -- =====================================================
  `ac_code` INT DEFAULT NULL COMMENT 'Assembly Constituency code',
  `part_no` INT DEFAULT NULL COMMENT 'Part number',
  `phone` CHAR(10) NOT NULL COMMENT 'Respondent phone number (10 digits)',
  `name` VARCHAR(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Respondent name (from form: q_name)',
  `q_name` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Respondent name collected in survey',
  
  -- =====================================================
  -- CALL STATUS & METADATA
  -- =====================================================
  `call_attempt` INT DEFAULT 0 COMMENT 'Number of call attempts made',
  `call_received` INT NOT NULL DEFAULT 0 COMMENT 'Whether call was received (0/1)',
  `call_date` DATE DEFAULT NULL COMMENT 'Date of call attempt',
  `callid` VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Unique call ID from calling system',
  `starttime` INT DEFAULT NULL COMMENT 'Form start time (Unix timestamp)',
  `endtime` INT DEFAULT NULL COMMENT 'Form end time (Unix timestamp)',
  `survey_complete_date` DATETIME DEFAULT NULL COMMENT 'Survey completion timestamp',
  
  -- =====================================================
  -- CALL FLOW QUESTIONS
  -- =====================================================
  `q_call_status` INT DEFAULT NULL COMMENT 'Call status outcome (1=Continue, 2=Wrong Number, 5=Reschedule/Not Available)',
  
  -- =====================================================
  -- SECTION 2: CONSENT
  -- =====================================================
  `q_consent` INT DEFAULT NULL COMMENT 'Informed consent response (1=Yes Continue, 2=No Stop)',
  
  -- =====================================================
  -- SECTION 3: BASIC DEMOGRAPHICS
  -- =====================================================
  `q_age` INT DEFAULT NULL COMMENT 'Respondent age (complete years, 10-99)',
  `q_locality` INT DEFAULT NULL COMMENT 'Urban/Rural locality',
  `q_register_voter` INT DEFAULT NULL COMMENT 'Registered voter status (1=Yes, 2=No)',
  `q_gender` INT DEFAULT NULL COMMENT 'Respondent gender (1=Male, 2=Female)',
  
  -- =====================================================
  -- SECTION 4: PARTY PREFERENCES
  -- =====================================================
  
  -- Q5: Which party did you vote for in the last assembly elections (MLA) in 2021?
  `q1_1` INT DEFAULT NULL COMMENT 'Q5: AITC vote',
  `q1_2` INT DEFAULT NULL COMMENT 'Q5: BJP vote',
  `q1_3` INT DEFAULT NULL COMMENT 'Q5: INC vote',
  `q1_4` INT DEFAULT NULL COMMENT 'Q5: Left Front vote',
  `q1_5` INT DEFAULT NULL COMMENT 'Q5: NOTA vote',
  `q1_44` INT DEFAULT NULL COMMENT 'Q5: Others vote',
  `q1_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q5: Other party specify',
  
  -- Q6: Which party did you vote for in the last Lok Sabha elections (MP) in 2024?
  `q2` INT DEFAULT NULL COMMENT 'Q6: Party code (1-6, 12, 44, 55, 66, 77, 88)',
  `q2_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q6: Other party specify',
  
  -- Q7: By-election party vote
  `q3` INT DEFAULT NULL COMMENT 'Q7: Party code',
  `q3_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q7: Other party specify',
  
  -- Q8: If assembly elections were held tomorrow
  `q4` INT DEFAULT NULL COMMENT 'Q8: Party code',
  
  -- Q9: Second choice party
  `q5` INT DEFAULT NULL COMMENT 'Q9: Party code',
  
  -- =====================================================
  -- Q10: REASON FOR SECOND CHOICE (Multi-select, Max 3)
  -- =====================================================
  `q7_3` INT DEFAULT NULL COMMENT 'Q10: Party manifesto/agenda',
  `q7_4` INT DEFAULT NULL COMMENT 'Q10: Track record in govt',
  `q7_5` INT DEFAULT NULL COMMENT 'Q10: Local candidate',
  `q7_6` INT DEFAULT NULL COMMENT 'Q10: Party\'s national leadership',
  `q7_7` INT DEFAULT NULL COMMENT 'Q10: Party\'s state leadership',
  `q7_8` INT DEFAULT NULL COMMENT 'Q10: Caste/community identity',
  `q7_10` INT DEFAULT NULL COMMENT 'Q10: Development work',
  `q7_11` INT DEFAULT NULL COMMENT 'Q10: Reserved',
  `q7_12` INT DEFAULT NULL COMMENT 'Q10: Reserved',
  `q7_13` INT DEFAULT NULL COMMENT 'Q10: Reserved',
  `q7_44` INT DEFAULT NULL COMMENT 'Q10: Others',
  `q7_99` INT DEFAULT NULL COMMENT 'Q10: Don\'t know',
  `q7_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q10: Other specify',
  
  -- =====================================================
  -- Q11: REASONS FOR VOTING AITC (Multi-select, Max 3)
  -- =====================================================
  `q8_3` INT DEFAULT NULL COMMENT 'Q11: Mamata Banerjee leadership',
  `q8_4` INT DEFAULT NULL COMMENT 'Q11: Welfare schemes',
  `q8_5` INT DEFAULT NULL COMMENT 'Q11: Women empowerment',
  `q8_7` INT DEFAULT NULL COMMENT 'Q11: Development work',
  `q8_9` INT DEFAULT NULL COMMENT 'Q11: Protection of Bengali identity',
  `q8_10` INT DEFAULT NULL COMMENT 'Q11: Local leadership',
  `q8_11` INT DEFAULT NULL COMMENT 'Q11: Party workers\' connect',
  `q8_12` INT DEFAULT NULL COMMENT 'Q11: Anti-BJP stance',
  `q8_13` INT DEFAULT NULL COMMENT 'Q11: Muslim minority support',
  `q8_14` INT DEFAULT NULL COMMENT 'Q11: Secular credentials',
  `q8_44` INT DEFAULT NULL COMMENT 'Q11: Others',
  `q8_99` INT DEFAULT NULL COMMENT 'Q11: Don\'t know',
  `q8_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q11: Other specify',
  
  -- =====================================================
  -- Q12: REASONS FOR VOTING BJP (Multi-select, Max 3)
  -- =====================================================
  `q9_1` INT DEFAULT NULL COMMENT 'Q12: Modi leadership',
  `q9_2` INT DEFAULT NULL COMMENT 'Q12: Development agenda',
  `q9_3` INT DEFAULT NULL COMMENT 'Q12: National security',
  `q9_4` INT DEFAULT NULL COMMENT 'Q12: Anti-corruption',
  `q9_5` INT DEFAULT NULL COMMENT 'Q12: Hindu identity',
  `q9_6` INT DEFAULT NULL COMMENT 'Q12: Local candidate',
  `q9_7` INT DEFAULT NULL COMMENT 'Q12: Change from AITC',
  `q9_8` INT DEFAULT NULL COMMENT 'Q12: Central govt schemes',
  `q9_9` INT DEFAULT NULL COMMENT 'Q12: Party organization',
  `q9_10` INT DEFAULT NULL COMMENT 'Q12: Opposition to AITC corruption',
  `q9_11` INT DEFAULT NULL COMMENT 'Q12: Religious/cultural values',
  `q9_12` INT DEFAULT NULL COMMENT 'Q12: Strong leadership',
  `q9_13` INT DEFAULT NULL COMMENT 'Q12: National development',
  `q9_44` INT DEFAULT NULL COMMENT 'Q12: Others',
  `q9_99` INT DEFAULT NULL COMMENT 'Q12: Don\'t know/Can\'t say',
  `q9_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q12: Other reason specify',
  
  -- =====================================================
  -- Q13: MOST PRESSING ISSUES (Multi-select, Max 3)
  -- =====================================================
  `q10_1` INT DEFAULT NULL COMMENT 'Q13: Unemployment',
  `q10_2` INT DEFAULT NULL COMMENT 'Q13: Inflation/Price rise',
  `q10_3` INT DEFAULT NULL COMMENT 'Q13: Education',
  `q10_4` INT DEFAULT NULL COMMENT 'Q13: Healthcare',
  `q10_5` INT DEFAULT NULL COMMENT 'Q13: Infrastructure/Roads',
  `q10_6` INT DEFAULT NULL COMMENT 'Q13: Law and order/Crime',
  `q10_7` INT DEFAULT NULL COMMENT 'Q13: Corruption',
  `q10_8` INT DEFAULT NULL COMMENT 'Q13: Agriculture/Farmers',
  `q10_9` INT DEFAULT NULL COMMENT 'Q13: Water supply',
  `q10_10` INT DEFAULT NULL COMMENT 'Q13: Electricity',
  `q10_11` INT DEFAULT NULL COMMENT 'Q13: Women safety',
  `q10_12` INT DEFAULT NULL COMMENT 'Q13: Social welfare schemes',
  `q10_13` INT DEFAULT NULL COMMENT 'Q13: Environment/Pollution',
  `q10_14` INT DEFAULT NULL COMMENT 'Q13: Other local issues',
  `q10_44` INT DEFAULT NULL COMMENT 'Q13: Others (specify)',
  `q10_99` INT DEFAULT NULL COMMENT 'Q13: Don\'t know/Can\'t say',
  
  -- =====================================================
  -- SECTION 5: SATISFACTION & APPROVAL RATINGS
  -- =====================================================
  
  -- Q14: Satisfaction with State Govt (Mamata Banerjee)
  `q6` INT DEFAULT NULL COMMENT 'Q14: Satisfaction level (1=Fully satisfied, 2=Somewhat satisfied, 3=Neither, 4=Somewhat dissatisfied, 5=Fully dissatisfied)',
  
  -- Q15: Satisfaction with BJP Opposition
  `q8a` INT DEFAULT NULL COMMENT 'Q15: Satisfaction level (1-5)',
  
  -- Q16: Satisfaction with MP/MLA
  `q8b` INT DEFAULT NULL COMMENT 'Q16_A: Satisfaction with Lok Sabha MP (1-5)',
  `q8c` INT DEFAULT NULL COMMENT 'Q16_B: Satisfaction with current MLA (1-5)',
  
  -- Detailed MP satisfaction breakdown (optional)
  `q30a_1_1` INT DEFAULT NULL COMMENT 'MP satisfaction breakdown',
  `q30a_1_2` INT DEFAULT NULL COMMENT 'MP satisfaction breakdown',
  `q30a_1_3` INT DEFAULT NULL COMMENT 'MP satisfaction breakdown',
  `q30a_1_4` INT DEFAULT NULL COMMENT 'MP satisfaction breakdown',
  `q30a_1_5` INT DEFAULT NULL COMMENT 'MP satisfaction breakdown',
  `q30a_1_other` VARCHAR(150) DEFAULT NULL COMMENT 'MP satisfaction other',
  
  -- Detailed MLA satisfaction breakdown (optional)
  `q30a_2_1` INT DEFAULT NULL COMMENT 'MLA satisfaction breakdown',
  `q30a_2_2` INT DEFAULT NULL COMMENT 'MLA satisfaction breakdown',
  `q30a_2_3` INT DEFAULT NULL COMMENT 'MLA satisfaction breakdown',
  `q30a_2_4` INT DEFAULT NULL COMMENT 'MLA satisfaction breakdown',
  `q30a_2_5` INT DEFAULT NULL COMMENT 'MLA satisfaction breakdown',
  `q30a_2_other` VARCHAR(150) DEFAULT NULL COMMENT 'MLA satisfaction other',
  
  -- Additional satisfaction breakdowns (optional)
  `q30a_3_1` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_3_2` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_3_3` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_3_4` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_3_5` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_3_other` VARCHAR(150) DEFAULT NULL COMMENT 'Additional satisfaction other',
  `q30a_4_1` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_4_2` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_4_3` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_4_4` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_4_5` INT DEFAULT NULL COMMENT 'Additional satisfaction breakdown',
  `q30a_4_other` VARCHAR(150) DEFAULT NULL COMMENT 'Additional satisfaction other',
  
  -- Q17: Best Leader for Chief Minister
  `q11` INT DEFAULT NULL COMMENT 'Q17: Leader code (1-13, 44, 88, 99)',
  `q11_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q17: Other leader specify',
  
  -- Q19: Which party will win next election
  `q12` INT DEFAULT NULL COMMENT 'Q19: Party code (1-6, 12, 44, 88, 99)',
  `q12_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q19: Other party specify',
  
  -- =====================================================
  -- ADDITIONAL Q&A (Reserved for future use)
  -- =====================================================
  `q13` INT DEFAULT NULL COMMENT 'Reserved for future question',
  `q13_other` VARCHAR(255) DEFAULT NULL COMMENT 'Reserved other specify',
  `q13_a` INT DEFAULT NULL COMMENT 'Reserved for future question',
  `q13_a_other` VARCHAR(255) DEFAULT NULL COMMENT 'Reserved other specify',
  `q14` INT DEFAULT NULL COMMENT 'Reserved for future question',
  `q14_other` VARCHAR(255) DEFAULT NULL COMMENT 'Reserved other specify',
  `q15` INT DEFAULT NULL COMMENT 'Reserved for future question',
  `q15_other` VARCHAR(255) DEFAULT NULL COMMENT 'Reserved other specify',
  
  -- =====================================================
  -- SECTION 6: DEMOGRAPHICS
  -- =====================================================
  
  -- Q20: Religion
  `q_religion` INT DEFAULT NULL COMMENT 'Q20: Religion code (1-7, 44, 88)',
  `q_religion_other` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Q20: Other religion specify',
  
  -- Q21: Social Category
  `q_social_category` INT DEFAULT NULL COMMENT 'Q21: Social category code (1=SC, 2=ST, 3=OBC, 4=General, 5=Refused)',
  
  -- Q22: Caste/Jati
  `q_caste_jati` INT DEFAULT NULL COMMENT 'Q22: Caste/Jati code (1-47, 44, 88)',
  `q_caste_jati_other` VARCHAR(255) DEFAULT NULL COMMENT 'Q22: Other caste specify',
  
  -- Q23: Female Education (Highest in household)
  `q_female_education` INT DEFAULT NULL COMMENT 'Q23: Female education level (1-7)',
  
  -- Q24: Male Education (Highest in household)
  `resp_education` INT DEFAULT NULL COMMENT 'Q24: Male education level (1-7)',
  
  -- Q25: Occupation of Chief Wage Earner
  `q_occupation` INT DEFAULT NULL COMMENT 'Q25: Occupation code (2-7)',
  
  -- Q28: Future Contact Consent
  `q_future_contact` INT DEFAULT NULL COMMENT 'Q28: Future contact permission (1=Yes, 2=No)',
  
  -- =====================================================
  -- INTERVIEW STATUS
  -- =====================================================
  `q_interview_status` INT DEFAULT NULL COMMENT 'Interview completion status (1=Completed, 2=Partial, 3=Dropped, 4=Refused)',
  
  -- =====================================================
  -- CLOUD INTEGRATION
  -- =====================================================
  `cloud_api_id` INT DEFAULT 0 COMMENT 'Cloud API integration ID',
  `calling_request_id` INT DEFAULT NULL COMMENT 'Calling request reference',
  
  -- =====================================================
  -- REJECTION & INVALID DATA
  -- =====================================================
  `invalid_phone` TINYINT NOT NULL DEFAULT 0 COMMENT 'Phone marked as invalid (0/1)',
  `invalid_phone_verify_by` INT DEFAULT NULL COMMENT 'User who verified invalid phone',
  `invalid_phone_verify_date` DATE DEFAULT NULL COMMENT 'Verification date',
  `reject_reason` INT DEFAULT NULL COMMENT 'Rejection reason code',
  `reject_date` DATE DEFAULT NULL COMMENT 'Rejection date',
  
  -- =====================================================
  -- RE-COMPLETION & RE-CALLING
  -- =====================================================
  `recomplete` TINYINT(1) DEFAULT 0 COMMENT 'Survey re-completed flag',
  `recomplete_date` DATETIME DEFAULT NULL COMMENT 'Re-completion timestamp',
  `recomplete_by` INT DEFAULT NULL COMMENT 'User who re-completed',
  `pre_survey_calling_id` INT DEFAULT NULL COMMENT 'Previous survey attempt ID',
  `re_sent_for_calling` INT DEFAULT 0 COMMENT 'Re-sent for calling flag',
  
  -- =====================================================
  -- QUALITY CONTROL (QC)
  -- =====================================================
  `qc_teleform_user_id` INT DEFAULT NULL COMMENT 'QC user ID',
  `qc` INT DEFAULT 0 COMMENT 'QC status (0=Not done, 1=Done)',
  `qc_assign_date` DATE DEFAULT NULL COMMENT 'QC assignment date',
  `qc_q_intro` INT DEFAULT NULL COMMENT 'QC check: Introduction quality',
  `qc_q12` INT DEFAULT NULL COMMENT 'QC check: Q12 validation',
  `qc_q11` INT DEFAULT NULL COMMENT 'QC check: Q11 validation',
  `qc_q16` INT DEFAULT NULL COMMENT 'QC check: Q16 validation',
  `qc_q14` INT DEFAULT NULL COMMENT 'QC check: Q14 validation',
  `qc_q28` INT DEFAULT NULL COMMENT 'QC check: Q28 validation',
  `qc_remark` INT DEFAULT NULL COMMENT 'QC overall remark code',
  `qc_complete_date` DATETIME DEFAULT NULL COMMENT 'QC completion timestamp',
  `qc_status` INT DEFAULT NULL COMMENT 'QC final status (1=Approved, 2=Rejected)',
  
  -- =====================================================
  -- RE-QC (SECOND QUALITY CHECK)
  -- =====================================================
  `re_qc_teleform_user_id` INT DEFAULT NULL COMMENT 'Re-QC user ID',
  `re_qc` INT DEFAULT 0 COMMENT 'Re-QC status (0=Not done, 1=Done)',
  `re_qc_assign_date` DATE DEFAULT NULL COMMENT 'Re-QC assignment date',
  `re_qc_q_intro` INT DEFAULT NULL COMMENT 'Re-QC check: Introduction',
  `re_qc_q12` INT DEFAULT NULL COMMENT 'Re-QC check: Q12',
  `re_qc_q11` INT DEFAULT NULL COMMENT 'Re-QC check: Q11',
  `re_qc_q16` INT DEFAULT NULL COMMENT 'Re-QC check: Q16',
  `re_qc_q14` INT DEFAULT NULL COMMENT 'Re-QC check: Q14',
  `re_qc_q28` INT DEFAULT NULL COMMENT 'Re-QC check: Q28',
  `re_qc_remark` VARCHAR(255) DEFAULT NULL COMMENT 'Re-QC remarks text',
  `re_qc_complete_date` DATETIME DEFAULT NULL COMMENT 'Re-QC completion timestamp',
  `re_qc_status` INT DEFAULT NULL COMMENT 'Re-QC final status',
  
  -- =====================================================
  -- WEIGHTING & ADJUSTMENTS
  -- =====================================================
  `weight` DECIMAL(10,5) DEFAULT 1.00000 COMMENT 'Survey weight for analysis',
  `non_weight` INT NOT NULL DEFAULT 1 COMMENT 'Non-weighted indicator',
  
  -- =====================================================
  -- AUDIT FIELDS
  -- =====================================================
  `created_at` INT DEFAULT NULL COMMENT 'Creation timestamp (Unix)',
  `created_by` INT DEFAULT NULL COMMENT 'User who created record',
  `updated_at` INT DEFAULT NULL COMMENT 'Last update timestamp (Unix)',
  `updated_by` INT DEFAULT NULL COMMENT 'User who last updated',
  
  -- =====================================================
  -- PRIMARY KEY & INDEXES
  -- =====================================================
  PRIMARY KEY (`id`),
  
  -- Basic indexes for performance
  INDEX `idx_phone` (`phone`),
  INDEX `idx_track` (`track`),
  INDEX `idx_ac_code` (`ac_code`),
  INDEX `idx_q_call_status` (`q_call_status`),
  INDEX `idx_call_date` (`call_date`),
  INDEX `idx_teleform_user_ac_status` (`teleform_user_id`, `ac_code`, `status`) USING BTREE,
  
  -- Additional recommended indexes
  INDEX `idx_survey_data_id` (`survey_data_id`),
  INDEX `idx_agency_id` (`agency_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_qc_status` (`qc`, `qc_status`),
  INDEX `idx_completion_date` (`survey_complete_date`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_teleform_user_id` (`teleform_user_id`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='CATI Survey Responses - West Bengal Opinion Poll 2025';

-- =====================================================
-- TABLE CREATION COMPLETE
-- =====================================================

-- Display table structure
DESCRIBE `cati_survey_calling_interview`;

-- Show table information
SHOW TABLE STATUS LIKE 'cati_survey_calling_interview';

-- Display index information
SHOW INDEX FROM `cati_survey_calling_interview`;

-- =====================================================
-- NOTES FOR BACKEND IMPLEMENTATION
-- =====================================================

/*
COLUMN MAPPING REFERENCE:

Frontend → Backend Transformations:

1. CHECKBOX ARRAYS TO MULTIPLE COLUMNS:
   - q10: ["1", "3", "5"] → q7_3=1, q7_5=1, q7_7=1 (others=NULL)
   - q11: ["1", "2", "4"] → q8_3=1, q8_4=1, q8_7=1 (others=NULL)
   - q12: ["1", "3", "5"] → q9_1=1, q9_3=1, q9_5=1 (others=NULL)
   - q13: ["1", "2", "3"] → q10_1=1, q10_2=1, q10_3=1 (others=NULL)

2. PARTY QUESTIONS TO MULTI-COLUMN SPLIT:
   - q5: "1" → q1_1=1 (others=NULL)
   - q5: "44" → q1_44=1, q1_other="[specified value]"

3. DIRECT MAPPINGS:
   - resp_age → q_age
   - consent → q_consent
   - q14 → q6 (satisfaction with state govt)
   - q15 → q8a (satisfaction with BJP)
   - q16_a → q8b (satisfaction with MP)
   - q16_b → q8c (satisfaction with MLA)
   - q17 → q11 (best CM leader)
   - q19 → q12 (win prediction)

4. STATUS CODES:
   - Survey Status: 0=Pending, 1=Completed, 2=Rejected, 3=In Progress, 4=Dropped, 5=Rescheduled
   - Call Status: 1=Continue, 2=Wrong Number, 5=Reschedule
   - Interview Status: 1=Completed, 2=Partial, 3=Dropped, 4=Refused
   - QC Status: 0=Not done, 1=Approved, 2=Rejected, 3=Re-QC Required

5. VALIDATION RULES:
   - q_age: Range 10-99 (required if q_consent=1)
   - Checkbox arrays: Max 3 selections
   - Phone: Exactly 10 digits
   - All "Other" fields: Required when corresponding option is "Others"

6. TIMESTAMPS:
   - starttime: Unix timestamp when form started
   - endtime: Unix timestamp when form completed
   - survey_complete_date: DATETIME when survey was completed
   - created_at: Unix timestamp when record created
   - updated_at: Unix timestamp when record last updated

TOTAL COLUMNS: 165+
*/
