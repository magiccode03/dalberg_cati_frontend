-- =====================================================
-- SAFE ALTER TABLE Script with Existence Checks
-- Run this script to add missing columns safely
-- =====================================================

-- This script uses a safer approach that won't fail if columns exist

-- Add form_duration_seconds
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'form_duration_seconds');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `form_duration_seconds` INT DEFAULT 0 COMMENT ''Time spent on form in seconds''', 
  'SELECT ''Column form_duration_seconds already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add language_used
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'language_used');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `language_used` ENUM(''english'', ''bengali'') DEFAULT ''english'' COMMENT ''Language used during interview''', 
  'SELECT ''Column language_used already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add user_timezone
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'user_timezone');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `user_timezone` VARCHAR(100) DEFAULT NULL COMMENT ''User timezone''', 
  'SELECT ''Column user_timezone already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add user_localdatetime
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'user_localdatetime');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `user_localdatetime` VARCHAR(100) DEFAULT NULL COMMENT ''User local date time''', 
  'SELECT ''Column user_localdatetime already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add final_submit
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'final_submit');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `final_submit` TINYINT(1) DEFAULT 0 COMMENT ''1=Form completed and submitted''', 
  'SELECT ''Column final_submit already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add number_status
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'number_status');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `number_status` TINYINT DEFAULT NULL COMMENT ''1=Ring, 2=Not Ring, 3=Invalid''', 
  'SELECT ''Column number_status already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add call_not_ring
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'call_not_ring');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `call_not_ring` TINYINT DEFAULT NULL COMMENT ''1=Switched Off, 2=Not Reachable, 3=Busy''', 
  'SELECT ''Column call_not_ring already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add call_ring_status
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'call_ring_status');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `call_ring_status` TINYINT DEFAULT NULL COMMENT ''1=Answered, 2=Not Answered''', 
  'SELECT ''Column call_ring_status already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add call_reschedule_datetime
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'call_reschedule_datetime');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `call_reschedule_datetime` DATETIME DEFAULT NULL COMMENT ''Rescheduled date and time''', 
  'SELECT ''Column call_reschedule_datetime already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q5_ind
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q5_ind');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q5_ind` VARCHAR(150) DEFAULT NULL COMMENT ''Q5 Independent specify''', 
  'SELECT ''Column q5_ind already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q6_oth
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q6_oth');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q6_oth` VARCHAR(150) DEFAULT NULL COMMENT ''Q6 Other specify''', 
  'SELECT ''Column q6_oth already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q6_ind
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q6_ind');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q6_ind` VARCHAR(150) DEFAULT NULL COMMENT ''Q6 Independent specify''', 
  'SELECT ''Column q6_ind already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q7_oth
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q7_oth');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q7_oth` VARCHAR(150) DEFAULT NULL COMMENT ''Q7 Other specify''', 
  'SELECT ''Column q7_oth already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q7_ind
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q7_ind');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q7_ind` VARCHAR(150) DEFAULT NULL COMMENT ''Q7 Independent specify''', 
  'SELECT ''Column q7_ind already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q8_ind
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q8_ind');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q8_ind` VARCHAR(150) DEFAULT NULL COMMENT ''Q8 Independent specify''', 
  'SELECT ''Column q8_ind already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q9_ind
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q9_ind');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q9_ind` VARCHAR(150) DEFAULT NULL COMMENT ''Q9 Independent specify''', 
  'SELECT ''Column q9_ind already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q10_other
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q10_other');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q10_other` VARCHAR(150) DEFAULT NULL COMMENT ''Q13 (frontend) other specify''', 
  'SELECT ''Column q10_other already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add q19_oth
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'cati_survey_calling_interview' 
               AND COLUMN_NAME = 'q19_oth');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `cati_survey_calling_interview` ADD COLUMN `q19_oth` VARCHAR(150) DEFAULT NULL COMMENT ''Q19 other specify''', 
  'SELECT ''Column q19_oth already exists'' AS msg');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'All ALTER TABLE operations completed successfully!' AS Status;

