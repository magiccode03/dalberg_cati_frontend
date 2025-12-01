# CRON Job Manager - Backend & Database Documentation

## Overview
This document outlines the backend API structure, database schema, and implementation details for the CRON Job Manager module.

---

## Database Schema

### 1. `cron_jobs` Table

Main table for storing CRON job definitions.

```sql
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
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Job name
- `description`: Optional description
- `job_type`: Type of job execution
- `cron_expression`: Cron expression (e.g., "0 0 * * *")
- `timezone`: Timezone for schedule (e.g., "Asia/Kolkata")
- `enabled`: Whether job is active
- `start_date`: Optional start date
- `end_date`: Optional end date
- `config`: JSON configuration based on job_type
- `retry_config`: JSON retry configuration
- `notification_config`: JSON notification settings
- `created_by`: User ID who created the job
- `deleted_at`: Soft delete timestamp

**Config JSON Structure by Job Type:**

```json
// Script Job
{
  "scriptPath": "/scripts/backup.sh",
  "workingDirectory": "/var/app",
  "environment": {},
  "timeout": 3600
}

// API Job
{
  "apiUrl": "https://api.example.com/endpoint",
  "apiMethod": "POST",
  "apiHeaders": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  "apiBody": {},
  "timeout": 30000
}

// Queue Job
{
  "queueName": "task-queue",
  "queueType": "rabbitmq",
  "message": {},
  "priority": 0
}

// Database Job
{
  "sqlQuery": "SELECT * FROM table WHERE...",
  "database": "main",
  "timeout": 60000
}

// Command Job
{
  "command": "ls -la /path",
  "workingDirectory": "/tmp",
  "environment": {},
  "timeout": 60
}
```

**Retry Config JSON:**
```json
{
  "enabled": true,
  "maxRetries": 3,
  "retryInterval": 5000,
  "retryOnFailure": true,
  "retryOnTimeout": false
}
```

**Notification Config JSON:**
```json
{
  "onFailure": {
    "enabled": true,
    "channels": ["email", "slack"],
    "recipients": ["admin@example.com"]
  },
  "onSuccess": {
    "enabled": false,
    "channels": [],
    "recipients": []
  },
  "onTimeout": {
    "enabled": true,
    "channels": ["email"],
    "recipients": ["admin@example.com"]
  },
  "email": {
    "smtp": {},
    "from": "noreply@example.com"
  },
  "slack": {
    "webhookUrl": "https://hooks.slack.com/...",
    "channel": "#alerts"
  },
  "webhook": {
    "url": "https://api.example.com/webhook",
    "method": "POST",
    "headers": {}
  }
}
```

---

### 2. `cron_job_executions` Table

Stores execution history and status.

```sql
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
    FOREIGN KEY (job_id) REFERENCES cron_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**
- `id`: Unique identifier
- `job_id`: Reference to cron_jobs
- `execution_id`: Unique execution identifier
- `triggered_by`: How execution was triggered
- `status`: Current execution status
- `start_time`: When execution started
- `end_time`: When execution completed
- `duration_ms`: Execution duration in milliseconds
- `next_run_at`: Calculated next run time
- `error_message`: Error message if failed
- `retry_count`: Number of retry attempts

---

### 3. `cron_job_logs` Table

Stores detailed execution logs.

```sql
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
    FOREIGN KEY (execution_id) REFERENCES cron_job_executions(execution_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES cron_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**
- `id`: Unique identifier
- `execution_id`: Reference to execution
- `job_id`: Reference to job
- `log_type`: Type of log entry
- `log_level`: Log severity level
- `message`: Log message/content
- `metadata`: Additional structured data (JSON)

**Metadata JSON Examples:**

```json
// API Response
{
  "statusCode": 200,
  "headers": {},
  "body": "...",
  "responseTime": 1234
}

// SQL Result
{
  "rowsAffected": 100,
  "executionTime": 500,
  "query": "SELECT ..."
}

// Error
{
  "stack": "...",
  "code": "ECONNREFUSED",
  "line": 123
}
```

---

### 4. `cron_job_schedules` Table

Stores calculated next run times for efficient scheduling.

```sql
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
```

**Fields:**
- `id`: Unique identifier
- `job_id`: Reference to job (unique)
- `next_run_at`: Next scheduled run time
- `last_calculated_at`: When schedule was last calculated
- `calculated_runs`: JSON array of next 10 run times

**Calculated Runs JSON:**
```json
[
  "2025-12-01T10:00:00Z",
  "2025-12-01T11:00:00Z",
  "2025-12-01T12:00:00Z"
]
```

---

### 5. `cron_job_audit_logs` Table

Audit trail for job changes and actions.

```sql
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
```

**Fields:**
- `id`: Unique identifier
- `job_id`: Reference to job
- `action`: Type of action performed
- `performed_by`: User ID who performed action
- `changes`: JSON diff of changes
- `ip_address`: IP address of requester
- `user_agent`: User agent string

**Changes JSON Example:**
```json
{
  "before": {
    "enabled": false,
    "cronExpression": "0 0 * * *"
  },
  "after": {
    "enabled": true,
    "cronExpression": "0 */2 * * *"
  }
}
```

---

## API Endpoints

### Base URL
```
/api/cron-jobs
```

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

---

### 1. List Jobs

**GET** `/api/cron-jobs`

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20) - Items per page
- `search` (string, optional) - Search in name/description
- `status` (string, optional) - Filter by status: `enabled`, `disabled`, `running`, `failed`
- `type` (string, optional) - Filter by job type: `script`, `api`, `queue`, `database`, `command`

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "Backup Database",
        "description": "Daily database backup",
        "jobType": "database",
        "cronExpression": "0 0 * * *",
        "timezone": "Asia/Kolkata",
        "enabled": true,
        "startDate": "2025-01-01T00:00:00Z",
        "endDate": null,
        "nextRun": "2025-12-02T00:00:00Z",
        "lastRun": "2025-12-01T00:00:00Z",
        "lastRunStatus": "success",
        "executionCount": 365,
        "failureCount": 2,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-12-01T10:00:00Z",
        "createdBy": "user123"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "Jobs retrieved successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 2. Get Job Details

**GET** `/api/cron-jobs/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Backup Database",
    "description": "Daily database backup",
    "jobType": "database",
    "cronExpression": "0 0 * * *",
    "timezone": "Asia/Kolkata",
    "enabled": true,
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": null,
    "nextRun": "2025-12-02T00:00:00Z",
    "lastRun": "2025-12-01T00:00:00Z",
    "lastRunStatus": "success",
    "executionCount": 365,
    "failureCount": 2,
    "averageDuration": 1234,
    "config": {
      "sqlQuery": "SELECT * FROM table",
      "database": "main"
    },
    "retryConfig": {
      "enabled": true,
      "maxRetries": 3
    },
    "notificationConfig": {},
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-12-01T10:00:00Z",
    "createdBy": "user123"
  },
  "message": "Job retrieved successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 3. Create Job

**POST** `/api/cron-jobs`

**Request Body:**
```json
{
  "name": "Backup Database",
  "description": "Daily database backup",
  "jobType": "database",
  "cronExpression": "0 0 * * *",
  "timezone": "Asia/Kolkata",
  "enabled": true,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": null,
  "config": {
    "sqlQuery": "SELECT * FROM table",
    "database": "main"
  },
  "retryConfig": {
    "enabled": true,
    "maxRetries": 3,
    "retryInterval": 5000
  },
  "notificationConfig": {
    "onFailure": {
      "enabled": true,
      "channels": ["email"],
      "recipients": ["admin@example.com"]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Backup Database",
    ...
  },
  "message": "Job created successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 4. Update Job

**PUT** `/api/cron-jobs/:id`

**Request Body:** (Same as Create, all fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...
  },
  "message": "Job updated successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 5. Delete Job

**DELETE** `/api/cron-jobs/:id`

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

**Note:** Soft delete - sets `deleted_at` timestamp.

---

### 6. Toggle Job (Enable/Disable)

**PATCH** `/api/cron-jobs/:id/toggle`

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "enabled": true,
    ...
  },
  "message": "Job toggled successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 7. Run Job Now

**POST** `/api/cron-jobs/:id/run-now`

**Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "exec-uuid",
    "status": "pending",
    "estimatedStartTime": "2025-12-01T10:00:00Z"
  },
  "message": "Job execution triggered",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 8. Pause Job

**POST** `/api/cron-jobs/:id/pause`

**Response:**
```json
{
  "success": true,
  "message": "Job paused successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 9. Resume Job

**POST** `/api/cron-jobs/:id/resume`

**Response:**
```json
{
  "success": true,
  "message": "Job resumed successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 10. Get Job Logs

**GET** `/api/cron-jobs/:id/logs`

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `status` (string, optional) - Filter by status
- `dateFrom` (string, optional) - ISO date string
- `dateTo` (string, optional) - ISO date string

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "executionId": "exec-uuid",
        "startTime": "2025-12-01T00:00:00Z",
        "endTime": "2025-12-01T00:00:15Z",
        "duration": 15000,
        "status": "success",
        "output": "Backup completed successfully",
        "error": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "Logs retrieved successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 11. Get Execution History

**GET** `/api/cron-jobs/:id/history`

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "executionId": "exec-uuid",
        "startTime": "2025-12-01T00:00:00Z",
        "endTime": "2025-12-01T00:00:15Z",
        "duration": 15000,
        "status": "success",
        "triggeredBy": "scheduled"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "History retrieved successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 12. Get Next Runs Preview

**GET** `/api/cron-jobs/:id/next-runs`

**Query Parameters:**
- `count` (integer, default: 10) - Number of future runs to calculate

**Response:**
```json
{
  "success": true,
  "data": {
    "runs": [
      {
        "scheduledAt": "2025-12-01T10:00:00Z",
        "timezone": "Asia/Kolkata"
      },
      {
        "scheduledAt": "2025-12-01T11:00:00Z",
        "timezone": "Asia/Kolkata"
      }
    ]
  },
  "message": "Next runs calculated successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Request validation failed
- `JOB_NOT_FOUND` - Job ID not found
- `INVALID_CRON_EXPRESSION` - Invalid cron expression
- `JOB_ALREADY_RUNNING` - Job is currently executing
- `PERMISSION_DENIED` - User lacks permission
- `INTERNAL_ERROR` - Server error

---

## Backend Implementation Notes

### 1. Cron Expression Validation

Use a library like `node-cron` or `cron-parser` to validate cron expressions:

```javascript
const cronParser = require('cron-parser');

function validateCronExpression(expression) {
  try {
    cronParser.parseExpression(expression);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

### 2. Next Run Calculation

Calculate next run times using cron parser:

```javascript
const cronParser = require('cron-parser');
const moment = require('moment-timezone');

function calculateNextRuns(cronExpression, timezone, count = 10) {
  const interval = cronParser.parseExpression(cronExpression, {
    tz: timezone
  });
  
  const runs = [];
  for (let i = 0; i < count; i++) {
    runs.push(interval.next().toDate());
  }
  
  return runs;
}
```

### 3. Job Execution

Implement job execution based on type:

```javascript
async function executeJob(job) {
  const execution = await createExecution(job.id);
  
  try {
    switch (job.jobType) {
      case 'script':
        await executeScript(job.config);
        break;
      case 'api':
        await callAPI(job.config);
        break;
      case 'queue':
        await pushToQueue(job.config);
        break;
      case 'database':
        await executeSQL(job.config);
        break;
      case 'command':
        await executeCommand(job.config);
        break;
    }
    
    await updateExecution(execution.id, { status: 'success' });
  } catch (error) {
    await updateExecution(execution.id, { 
      status: 'failed', 
      error: error.message 
    });
    
    if (job.retryConfig?.enabled) {
      await scheduleRetry(job, execution);
    }
    
    await sendNotifications(job, 'failure', error);
  }
}
```

### 4. Scheduler Service

Implement a scheduler service that:
- Polls for jobs due to run
- Executes jobs in background workers
- Updates execution status
- Handles retries
- Sends notifications

```javascript
class CronScheduler {
  async start() {
    setInterval(async () => {
      const dueJobs = await this.getDueJobs();
      for (const job of dueJobs) {
        await this.executeJob(job);
      }
    }, 60000); // Check every minute
  }
  
  async getDueJobs() {
    // Query jobs where next_run_at <= NOW() AND enabled = true
  }
}
```

### 5. Notification Service

Implement notification service for alerts:

```javascript
async function sendNotification(job, type, data) {
  const config = job.notificationConfig;
  
  if (config.onFailure?.enabled && type === 'failure') {
    for (const channel of config.onFailure.channels) {
      switch (channel) {
        case 'email':
          await sendEmail(config.email, data);
          break;
        case 'slack':
          await sendSlack(config.slack, data);
          break;
        case 'webhook':
          await sendWebhook(config.webhook, data);
          break;
      }
    }
  }
}
```

---

## Database Indexes

Recommended indexes for performance:

```sql
-- cron_jobs
CREATE INDEX idx_enabled_next_run ON cron_jobs(enabled, next_run_at) WHERE deleted_at IS NULL;

-- cron_job_executions
CREATE INDEX idx_job_status_time ON cron_job_executions(job_id, status, start_time);

-- cron_job_logs
CREATE INDEX idx_execution_created ON cron_job_logs(execution_id, created_at);
```

---

## Security Considerations

1. **Input Validation**: Validate all cron expressions, URLs, SQL queries, and commands
2. **SQL Injection**: Use parameterized queries for database jobs
3. **Command Injection**: Sanitize command inputs, use whitelist of allowed commands
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Access Control**: Check user permissions before job operations
6. **Audit Logging**: Log all job modifications and executions

---

## Performance Optimization

1. **Pagination**: Always paginate large result sets
2. **Caching**: Cache next run calculations
3. **Background Processing**: Execute jobs asynchronously
4. **Log Retention**: Implement log retention policies (auto-delete old logs)
5. **Database Cleanup**: Archive old execution records

---

## Migration Scripts

### Initial Migration

```sql
-- Create tables in order
CREATE TABLE cron_jobs (...);
CREATE TABLE cron_job_executions (...);
CREATE TABLE cron_job_logs (...);
CREATE TABLE cron_job_schedules (...);
CREATE TABLE cron_job_audit_logs (...);
```

### Add Indexes

```sql
-- Add performance indexes
ALTER TABLE cron_jobs ADD INDEX idx_enabled_next_run (enabled, next_run_at);
-- ... other indexes
```

---

## Testing

### Unit Tests
- Cron expression validation
- Next run calculation
- Job execution logic
- Notification sending

### Integration Tests
- API endpoint testing
- Database operations
- Scheduler service
- Error handling

---

## Monitoring & Alerts

1. **Job Health**: Monitor job success/failure rates
2. **Execution Time**: Track average execution duration
3. **System Load**: Monitor scheduler service health
4. **Error Rates**: Alert on high failure rates
5. **Queue Depth**: Monitor queue job backlog

---

## Future Enhancements

1. **Distributed Scheduler**: Leader election for HA
2. **Job Dependencies**: Chain jobs together
3. **Job Templates**: Reusable job configurations
4. **Job Groups**: Organize jobs into groups
5. **Advanced Scheduling**: Calendar-based scheduling
6. **Job Versioning**: Track job configuration changes
7. **Performance Metrics**: Detailed performance analytics

