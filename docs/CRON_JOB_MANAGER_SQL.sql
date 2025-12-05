-- CRON Job Manager Database Schema
-- MySQL/MariaDB Compatible

-- Drop tables if they exist (for fresh install)
DROP TABLE IF EXISTS cron_job_audit_logs;
DROP TABLE IF EXISTS cron_job_logs;
DROP TABLE IF EXISTS cron_job_executions;
DROP TABLE IF EXISTS cron_job_schedules;
DROP TABLE IF EXISTS cron_jobs;

-- 1. Main cron_jobs table
CREATE TABLE cron_jobs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    job_type ENUM('script', 'api', 'queue', 'database', 'command') NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    enabled BOOLEAN DEFAULT TRUE,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    config JSON NOT NULL,
    retry_config JSON NULL,
    notification_config JSON NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_enabled (enabled),
    INDEX idx_job_type (job_type),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_created_at (created_at),
    INDEX idx_enabled_next_run (enabled, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Execution history table
CREATE TABLE cron_job_executions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id VARCHAR(36) NOT NULL,
    execution_id VARCHAR(36) NOT NULL UNIQUE,
    triggered_by ENUM('scheduled', 'manual', 'retry') DEFAULT 'scheduled',
    status ENUM('pending', 'running', 'success', 'failed', 'skipped', 'timeout') DEFAULT 'pending',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    duration_ms INT NULL,
    next_run_at TIMESTAMP NULL,
    error_message TEXT NULL,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_execution_id (execution_id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_triggered_by (triggered_by),
    INDEX idx_job_status_time (job_id, status, start_time),
    FOREIGN KEY (job_id) REFERENCES cron_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Execution logs table
CREATE TABLE cron_job_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    execution_id VARCHAR(36) NOT NULL,
    job_id VARCHAR(36) NOT NULL,
    log_type ENUM('stdout', 'stderr', 'api_response', 'sql_result', 'error') NOT NULL,
    log_level ENUM('info', 'warning', 'error', 'debug') DEFAULT 'info',
    message TEXT NOT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_execution_id (execution_id),
    INDEX idx_job_id (job_id),
    INDEX idx_log_type (log_type),
    INDEX idx_created_at (created_at),
    INDEX idx_execution_created (execution_id, created_at),
    FOREIGN KEY (execution_id) REFERENCES cron_job_executions(execution_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES cron_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Schedule cache table
CREATE TABLE cron_job_schedules (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id VARCHAR(36) NOT NULL UNIQUE,
    next_run_at TIMESTAMP NOT NULL,
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calculated_runs JSON NULL,
    INDEX idx_next_run_at (next_run_at),
    INDEX idx_job_id (job_id),
    FOREIGN KEY (job_id) REFERENCES cron_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Audit logs table
CREATE TABLE cron_job_audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id VARCHAR(36) NOT NULL,
    action ENUM('create', 'update', 'delete', 'enable', 'disable', 'run_now', 'pause', 'resume', 'clone') NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    changes JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_action (action),
    INDEX idx_performed_by (performed_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (job_id) REFERENCES cron_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional - for testing)
-- INSERT INTO cron_jobs (id, name, description, job_type, cron_expression, timezone, enabled, config, created_by)
-- VALUES (
--     '550e8400-e29b-41d4-a716-446655440000',
--     'Daily Backup',
--     'Backup database daily at midnight',
--     'database',
--     '0 0 * * *',
--     'Asia/Kolkata',
--     TRUE,
--     '{"sqlQuery": "BACKUP DATABASE main", "database": "main"}',
--     'admin'
-- );

