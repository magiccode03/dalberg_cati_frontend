# CRON Job Manager - API Documentation

Complete API documentation with curl examples for frontend integration.

## Base URL
```
http://localhost:4001/api/cron-jobs
```

## Authentication
All endpoints require Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. List Jobs

Get paginated list of CRON jobs with optional filters.

**Endpoint:** `GET /api/cron-jobs`

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number
- `limit` (integer, optional, default: 20) - Items per page
- `search` (string, optional) - Search in name/description
- `status` (string, optional) - Filter by status: `enabled`, `disabled`, `running`, `failed`
- `type` (string, optional) - Filter by job type: `script`, `api`, `queue`, `database`, `command`

**Curl Example:**
```bash
curl -X GET "http://localhost:4001/api/cron-jobs?page=1&limit=20&status=enabled&type=database" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Daily Backup",
        "description": "Backup database daily at midnight",
        "jobType": "database",
        "cronExpression": "0 0 * * *",
        "timezone": "Asia/Kolkata",
        "enabled": true,
        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": null,
        "nextRun": "2025-12-02T00:00:00.000Z",
        "lastRun": "2025-12-01T00:00:00.000Z",
        "lastRunStatus": "success",
        "executionCount": 365,
        "failureCount": 2,
        "averageDuration": 1234,
        "config": {
          "sqlQuery": "BACKUP DATABASE main",
          "database": "main"
        },
        "retryConfig": {
          "enabled": true,
          "maxRetries": 3
        },
        "notificationConfig": {},
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-12-01T10:00:00.000Z",
        "createdBy": "admin"
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
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 2. Get Job Details

Get detailed information about a specific CRON job.

**Endpoint:** `GET /api/cron-jobs/:id`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Curl Example:**
```bash
curl -X GET "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Daily Backup",
    "description": "Backup database daily at midnight",
    "jobType": "database",
    "cronExpression": "0 0 * * *",
    "timezone": "Asia/Kolkata",
    "enabled": true,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": null,
    "nextRun": "2025-12-02T00:00:00.000Z",
    "lastRun": "2025-12-01T00:00:00.000Z",
    "lastRunStatus": "success",
    "executionCount": 365,
    "failureCount": 2,
    "averageDuration": 1234,
    "config": {
      "sqlQuery": "BACKUP DATABASE main",
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
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z",
    "createdBy": "admin"
  },
  "message": "Job retrieved successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Job not found",
  "error": {
    "code": "JOB_NOT_FOUND",
    "details": {}
  },
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 3. Create Job

Create a new scheduled CRON job.

**Endpoint:** `POST /api/cron-jobs`

**Request Body:**
```json
{
  "name": "Daily Backup",
  "description": "Backup database daily at midnight",
  "jobType": "database",
  "cronExpression": "0 0 * * *",
  "timezone": "Asia/Kolkata",
  "enabled": true,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": null,
  "config": {
    "sqlQuery": "BACKUP DATABASE main",
    "database": "main",
    "timeout": 60000
  },
  "retryConfig": {
    "enabled": true,
    "maxRetries": 3,
    "retryInterval": 5000,
    "retryOnFailure": true
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

**Curl Example:**
```bash
curl -X POST "http://localhost:4001/api/cron-jobs" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Backup",
    "description": "Backup database daily at midnight",
    "jobType": "database",
    "cronExpression": "0 0 * * *",
    "timezone": "Asia/Kolkata",
    "enabled": true,
    "config": {
      "sqlQuery": "BACKUP DATABASE main",
      "database": "main"
    },
    "retryConfig": {
      "enabled": true,
      "maxRetries": 3
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Daily Backup",
    "description": "Backup database daily at midnight",
    "jobType": "database",
    "cronExpression": "0 0 * * *",
    "timezone": "Asia/Kolkata",
    "enabled": true,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": null,
    "nextRun": "2025-12-02T00:00:00.000Z",
    "lastRun": null,
    "lastRunStatus": null,
    "executionCount": 0,
    "failureCount": 0,
    "averageDuration": 0,
    "config": {
      "sqlQuery": "BACKUP DATABASE main",
      "database": "main"
    },
    "retryConfig": {
      "enabled": true,
      "maxRetries": 3
    },
    "notificationConfig": {},
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z",
    "createdBy": "user123"
  },
  "message": "Job created successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

**Error Response (400 Bad Request - Invalid Cron Expression):**
```json
{
  "success": false,
  "message": "Invalid cron expression: Invalid cron expression format",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  },
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

### Job Type Config Examples

#### Script Job
```json
{
  "name": "Run Backup Script",
  "jobType": "script",
  "cronExpression": "0 2 * * *",
  "config": {
    "scriptPath": "/scripts/backup.sh",
    "workingDirectory": "/var/app",
    "environment": {
      "BACKUP_DIR": "/backups"
    },
    "timeout": 3600
  }
}
```

#### API Job
```json
{
  "name": "Call External API",
  "jobType": "api",
  "cronExpression": "*/5 * * * *",
  "config": {
    "apiUrl": "https://api.example.com/endpoint",
    "apiMethod": "POST",
    "apiHeaders": {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
    },
    "apiBody": {
      "action": "sync"
    },
    "timeout": 30000
  }
}
```

#### Queue Job
```json
{
  "name": "Process Queue",
  "jobType": "queue",
  "cronExpression": "0 * * * *",
  "config": {
    "queueName": "task-queue",
    "queueType": "rabbitmq",
    "message": {
      "type": "process"
    },
    "priority": 0
  }
}
```

#### Database Job
```json
{
  "name": "Database Cleanup",
  "jobType": "database",
  "cronExpression": "0 3 * * *",
  "config": {
    "sqlQuery": "DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)",
    "database": "main",
    "timeout": 60000
  }
}
```

#### Command Job
```json
{
  "name": "System Check",
  "jobType": "command",
  "cronExpression": "0 */6 * * *",
  "config": {
    "command": "df -h",
    "workingDirectory": "/tmp",
    "environment": {},
    "timeout": 60
  }
}
```

---

## 4. Update Job

Update an existing CRON job. All fields are optional - only include fields you want to update.

**Endpoint:** `PUT /api/cron-jobs/:id`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Request Body (all fields optional):**
```json
{
  "name": "Updated Daily Backup",
  "description": "Updated description",
  "cronExpression": "0 1 * * *",
  "enabled": false,
  "config": {
    "sqlQuery": "BACKUP DATABASE main WITH COMPRESSION",
    "database": "main"
  }
}
```

**Curl Example:**
```bash
curl -X PUT "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Daily Backup",
    "cronExpression": "0 1 * * *",
    "enabled": false
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Daily Backup",
    "description": "Backup database daily at midnight",
    "jobType": "database",
    "cronExpression": "0 1 * * *",
    "timezone": "Asia/Kolkata",
    "enabled": false,
    "nextRun": "2025-12-02T01:00:00.000Z",
    "lastRun": "2025-12-01T00:00:00.000Z",
    "lastRunStatus": "success",
    "executionCount": 365,
    "failureCount": 2,
    "averageDuration": 1234,
    "config": {
      "sqlQuery": "BACKUP DATABASE main WITH COMPRESSION",
      "database": "main"
    },
    "retryConfig": {
      "enabled": true,
      "maxRetries": 3
    },
    "notificationConfig": {},
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T10:30:00.000Z",
    "createdBy": "admin"
  },
  "message": "Job updated successfully",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

---

## 5. Delete Job

Soft delete a CRON job (sets `deleted_at` timestamp).

**Endpoint:** `DELETE /api/cron-jobs/:id`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Curl Example:**
```bash
curl -X DELETE "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Job deleted successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 6. Toggle Job (Enable/Disable)

Enable or disable a CRON job.

**Endpoint:** `PATCH /api/cron-jobs/:id/toggle`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Request Body:**
```json
{
  "enabled": true
}
```

**Curl Example:**
```bash
curl -X PATCH "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/toggle" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Daily Backup",
    "enabled": true,
    "nextRun": "2025-12-02T00:00:00.000Z",
    ...
  },
  "message": "Job toggled successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 7. Run Job Now

Manually trigger a CRON job execution immediately.

**Endpoint:** `POST /api/cron-jobs/:id/run-now`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Curl Example:**
```bash
curl -X POST "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/run-now" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "executionId": "exec-550e8400-e29b-41d4-a716-446655440001",
    "status": "pending",
    "estimatedStartTime": "2025-12-01T10:00:00.000Z"
  },
  "message": "Job execution triggered",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

**Error Response (400 Bad Request - Job Disabled):**
```json
{
  "success": false,
  "message": "Job is disabled",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  },
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 8. Pause Job

Pause a CRON job (disables it).

**Endpoint:** `POST /api/cron-jobs/:id/pause`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Curl Example:**
```bash
curl -X POST "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/pause" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Job paused successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 9. Resume Job

Resume a paused CRON job (enables it).

**Endpoint:** `POST /api/cron-jobs/:id/resume`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Curl Example:**
```bash
curl -X POST "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/resume" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Job resumed successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 10. Get Job Logs

Get execution logs for a CRON job with optional filters.

**Endpoint:** `GET /api/cron-jobs/:id/logs`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number
- `limit` (integer, optional, default: 20) - Items per page
- `status` (string, optional) - Filter by status: `pending`, `running`, `success`, `failed`, `skipped`, `timeout`
- `dateFrom` (string, optional) - ISO date string (e.g., "2025-12-01T00:00:00.000Z")
- `dateTo` (string, optional) - ISO date string (e.g., "2025-12-31T23:59:59.000Z")

**Curl Example:**
```bash
curl -X GET "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/logs?page=1&limit=20&status=failed&dateFrom=2025-12-01T00:00:00.000Z" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "log-550e8400-e29b-41d4-a716-446655440001",
        "executionId": "exec-550e8400-e29b-41d4-a716-446655440001",
        "startTime": "2025-12-01T00:00:00.000Z",
        "endTime": "2025-12-01T00:00:15.000Z",
        "duration": 15000,
        "status": "failed",
        "triggeredBy": "scheduled",
        "error": "Connection timeout after 15 seconds"
      },
      {
        "id": "log-550e8400-e29b-41d4-a716-446655440002",
        "executionId": "exec-550e8400-e29b-41d4-a716-446655440002",
        "startTime": "2025-11-30T00:00:00.000Z",
        "endTime": "2025-11-30T00:00:10.000Z",
        "duration": 10000,
        "status": "success",
        "triggeredBy": "scheduled",
        "error": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "totalPages": 1
    }
  },
  "message": "Logs retrieved successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 11. Get Execution History

Get execution history for a CRON job.

**Endpoint:** `GET /api/cron-jobs/:id/history`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number
- `limit` (integer, optional, default: 20) - Items per page

**Curl Example:**
```bash
curl -X GET "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/history?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "exec-550e8400-e29b-41d4-a716-446655440001",
        "executionId": "exec-550e8400-e29b-41d4-a716-446655440001",
        "startTime": "2025-12-01T00:00:00.000Z",
        "endTime": "2025-12-01T00:00:15.000Z",
        "duration": 15000,
        "status": "success",
        "triggeredBy": "scheduled"
      },
      {
        "id": "exec-550e8400-e29b-41d4-a716-446655440002",
        "executionId": "exec-550e8400-e29b-41d4-a716-446655440002",
        "startTime": "2025-11-30T00:00:00.000Z",
        "endTime": "2025-11-30T00:00:10.000Z",
        "duration": 10000,
        "status": "success",
        "triggeredBy": "manual"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 365,
      "totalPages": 19
    }
  },
  "message": "History retrieved successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## 12. Get Next Runs Preview

Calculate and return next scheduled run times for a CRON job.

**Endpoint:** `GET /api/cron-jobs/:id/next-runs`

**Path Parameters:**
- `id` (string, required) - Job ID (UUID)

**Query Parameters:**
- `count` (integer, optional, default: 10, min: 1, max: 50) - Number of future runs to calculate

**Curl Example:**
```bash
curl -X GET "http://localhost:4001/api/cron-jobs/550e8400-e29b-41d4-a716-446655440000/next-runs?count=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "runs": [
      {
        "scheduledAt": "2025-12-02T00:00:00.000Z",
        "timezone": "Asia/Kolkata"
      },
      {
        "scheduledAt": "2025-12-03T00:00:00.000Z",
        "timezone": "Asia/Kolkata"
      },
      {
        "scheduledAt": "2025-12-04T00:00:00.000Z",
        "timezone": "Asia/Kolkata"
      },
      {
        "scheduledAt": "2025-12-05T00:00:00.000Z",
        "timezone": "Asia/Kolkata"
      },
      {
        "scheduledAt": "2025-12-06T00:00:00.000Z",
        "timezone": "Asia/Kolkata"
      }
    ]
  },
  "message": "Next runs calculated successfully",
  "timestamp": "2025-12-01T10:00:00.000Z"
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
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

### Common Error Codes:

- `VALIDATION_ERROR` (400) - Request validation failed
- `JOB_NOT_FOUND` (404) - Job ID not found
- `INVALID_CRON_EXPRESSION` (400) - Invalid cron expression format
- `JOB_ALREADY_RUNNING` (400) - Job is currently executing
- `PERMISSION_DENIED` (403) - User lacks permission
- `INTERNAL_ERROR` (500) - Server error
- `UNAUTHORIZED` (401) - Missing or invalid authentication token

### Example Error Response (401 Unauthorized):
```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": "UNAUTHORIZED",
    "details": {}
  },
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

## Cron Expression Examples

Common cron expressions for reference:

| Expression | Description |
|------------|-------------|
| `0 0 * * *` | Every day at midnight |
| `0 */6 * * *` | Every 6 hours |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 0 1 * *` | First day of every month at midnight |
| `*/5 * * * *` | Every 5 minutes |
| `0 9 * * 1-5` | Every weekday at 9 AM |
| `0 0 1 1 *` | Every January 1st at midnight |

---

## Frontend Integration Tips

### 1. Authentication
Always include the Bearer token in the Authorization header:
```javascript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

### 2. Error Handling
Check the `success` field in the response:
```javascript
if (response.success) {
  // Handle success
  const data = response.data;
} else {
  // Handle error
  const errorCode = response.error.code;
  const errorMessage = response.message;
}
```

### 3. Pagination
Use pagination metadata for building pagination UI:
```javascript
const { data, pagination } = response.data;
const { page, limit, total, totalPages } = pagination;
```

### 4. Date Formatting
All dates are in ISO 8601 format. Use JavaScript Date objects:
```javascript
const nextRun = new Date(job.nextRun);
const formatted = nextRun.toLocaleString('en-IN', { 
  timeZone: job.timezone 
});
```

### 5. Job Status Filtering
Use the status filter to show different job states:
- `enabled` - Active jobs
- `disabled` - Inactive jobs
- `running` - Currently executing jobs
- `failed` - Jobs with recent failures

### 6. Real-time Updates
For real-time job status updates, consider polling the job details endpoint:
```javascript
setInterval(async () => {
  const job = await fetchJobDetails(jobId);
  updateJobStatus(job);
}, 5000); // Poll every 5 seconds
```

---

## Complete Example: React/TypeScript Integration

```typescript
// types.ts
interface CronJob {
  id: string;
  name: string;
  description?: string;
  jobType: 'script' | 'api' | 'queue' | 'database' | 'command';
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  nextRun?: string;
  lastRun?: string;
  lastRunStatus?: string;
  executionCount: number;
  failureCount: number;
  averageDuration: number;
  config: any;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details: any;
  };
  timestamp: string;
}

// api.ts
const API_BASE_URL = 'http://localhost:4001/api/cron-jobs';

async function fetchCronJobs(
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  },
  token: string
): Promise<ApiResponse<{ data: CronJob[]; pagination: any }>> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);

  const response = await fetch(`${API_BASE_URL}?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}

async function createCronJob(
  jobData: Partial<CronJob>,
  token: string
): Promise<ApiResponse<CronJob>> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  });

  return response.json();
}

async function updateCronJob(
  id: string,
  updates: Partial<CronJob>,
  token: string
): Promise<ApiResponse<CronJob>> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  return response.json();
}

async function deleteCronJob(
  id: string,
  token: string
): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}

async function toggleCronJob(
  id: string,
  enabled: boolean,
  token: string
): Promise<ApiResponse<CronJob>> {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ enabled })
  });

  return response.json();
}

async function runJobNow(
  id: string,
  token: string
): Promise<ApiResponse<{ executionId: string; status: string }>> {
  const response = await fetch(`${API_BASE_URL}/${id}/run-now`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}

// Usage in React component
function CronJobList() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useAuthToken(); // Your auth hook

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await fetchCronJobs({ page: 1, limit: 20 }, token);
      if (response.success && response.data) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await toggleCronJob(id, enabled, token);
      if (response.success) {
        loadJobs(); // Reload list
      }
    } catch (error) {
      console.error('Failed to toggle job:', error);
    }
  };

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.name}</h3>
          <p>{job.description}</p>
          <button onClick={() => handleToggle(job.id, !job.enabled)}>
            {job.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Testing with Postman

### Postman Collection Setup

1. **Environment Variables:**
   - `base_url`: `http://localhost:4001`
   - `access_token`: Your JWT access token

2. **Pre-request Script (for all requests):**
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('access_token')
   });
   ```

3. **Example Request:**
   - Method: `GET`
   - URL: `{{base_url}}/api/cron-jobs?page=1&limit=20`
   - Headers: `Authorization: Bearer {{access_token}}`

---

## Support

For issues or questions:
- Check Swagger documentation at `/api-docs`
- Review error codes and messages in responses
- Ensure authentication token is valid and not expired
- Verify database tables are created using migration script

---

**Last Updated:** December 2025

