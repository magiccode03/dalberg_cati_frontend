# CRON Job Manager API Implementation Guide

## Overview

All CRON Job Manager API routes have been created in the Next.js App Router structure. The implementation includes:

- ✅ All 12 API endpoints as per documentation
- ✅ Authentication validation
- ✅ Request validation
- ✅ Error handling
- ✅ Service layer structure

## API Routes Created

### Base Routes
- `GET /api/cron-jobs` - List jobs with pagination and filters
- `POST /api/cron-jobs` - Create new job

### Job Management Routes
- `GET /api/cron-jobs/[id]` - Get job details
- `PUT /api/cron-jobs/[id]` - Update job
- `DELETE /api/cron-jobs/[id]` - Delete job (soft delete)
- `PATCH /api/cron-jobs/[id]/toggle` - Enable/disable job
- `POST /api/cron-jobs/[id]/run-now` - Trigger immediate execution
- `POST /api/cron-jobs/[id]/pause` - Pause job
- `POST /api/cron-jobs/[id]/resume` - Resume job

### Monitoring Routes
- `GET /api/cron-jobs/[id]/logs` - Get execution logs
- `GET /api/cron-jobs/[id]/history` - Get execution history
- `GET /api/cron-jobs/[id]/next-runs` - Calculate next run times

## Files Created

### API Routes
```
src/app/api/cron-jobs/
├── route.ts                    # GET (list), POST (create)
├── [id]/
│   ├── route.ts               # GET, PUT, DELETE
│   ├── toggle/
│   │   └── route.ts           # PATCH
│   ├── run-now/
│   │   └── route.ts           # POST
│   ├── pause/
│   │   └── route.ts           # POST
│   ├── resume/
│   │   └── route.ts           # POST
│   ├── logs/
│   │   └── route.ts           # GET
│   ├── history/
│   │   └── route.ts           # GET
│   └── next-runs/
│       └── route.ts           # GET
```

### Service Layer
```
src/lib/
├── api-auth.ts                # Authentication validation
└── cron-jobs-service.ts       # Business logic & database operations
```

## Next Steps: Database Integration

The service layer (`cron-jobs-service.ts`) currently has placeholder functions. You need to:

### 1. Install Required Packages

```bash
# For UUID generation (optional - fallback included)
npm install uuid @types/uuid

# For cron expression parsing
npm install cron-parser

# For database (choose one):
# MySQL/MariaDB
npm install mysql2

# PostgreSQL
npm install pg

# MongoDB
npm install mongodb
```

### 2. Database Connection

Create a database connection file (e.g., `src/lib/db.ts`):

```typescript
// Example for MySQL
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cron_jobs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

### 3. Implement Database Functions

Update `src/lib/cron-jobs-service.ts` with actual database queries:

#### Example: getCronJobs

```typescript
export async function getCronJobs(filters: GetJobsFilters): Promise<{
  data: CronJob[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
}> {
  const offset = (filters.page - 1) * filters.limit;
  
  // Build WHERE clause
  let whereClause = 'WHERE deleted_at IS NULL';
  const params: any[] = [];
  
  if (filters.search) {
    whereClause += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  if (filters.status === 'enabled') {
    whereClause += ' AND enabled = 1';
  } else if (filters.status === 'disabled') {
    whereClause += ' AND enabled = 0';
  }
  
  if (filters.type) {
    whereClause += ' AND job_type = ?';
    params.push(filters.type);
  }
  
  // Get total count
  const [countResult] = await db.query(
    `SELECT COUNT(*) as total FROM cron_jobs ${whereClause}`,
    params
  );
  const total = countResult[0].total;
  
  // Get jobs
  params.push(filters.limit, offset);
  const [jobs] = await db.query(
    `SELECT * FROM cron_jobs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );
  
  // Calculate next run for each job
  const jobsWithNextRun = await Promise.all(
    jobs.map(async (job: any) => {
      const nextRuns = await calculateNextRuns(
        job.cron_expression,
        job.timezone,
        1,
        job.start_date,
        job.end_date
      );
      return {
        ...job,
        nextRun: nextRuns[0]?.toISOString()
      };
    })
  );
  
  return {
    data: jobsWithNextRun,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit)
    }
  };
}
```

#### Example: createCronJob

```typescript
export async function createCronJob(data: Partial<CronJob>): Promise<CronJob> {
  const id = generateUUID();
  const now = new Date();
  
  // Calculate next run
  const nextRuns = await calculateNextRuns(
    data.cronExpression!,
    data.timezone || 'Asia/Kolkata',
    1,
    data.startDate,
    data.endDate
  );
  
  const job = {
    id,
    name: data.name!,
    description: data.description || null,
    job_type: data.jobType!,
    cron_expression: data.cronExpression!,
    timezone: data.timezone || 'Asia/Kolkata',
    enabled: data.enabled !== undefined ? data.enabled : true,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    config: JSON.stringify(data.config || {}),
    retry_config: data.retryConfig ? JSON.stringify(data.retryConfig) : null,
    notification_config: data.notificationConfig ? JSON.stringify(data.notificationConfig) : null,
    created_by: data.createdBy || '',
    created_at: now,
    updated_at: now,
    deleted_at: null,
    next_run_at: nextRuns[0] || null,
    execution_count: 0,
    failure_count: 0
  };
  
  await db.query(
    `INSERT INTO cron_jobs (
      id, name, description, job_type, cron_expression, timezone,
      enabled, start_date, end_date, config, retry_config, notification_config,
      created_by, created_at, updated_at, next_run_at, execution_count, failure_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      job.id, job.name, job.description, job.job_type, job.cron_expression,
      job.timezone, job.enabled, job.start_date, job.end_date, job.config,
      job.retry_config, job.notification_config, job.created_by, job.created_at,
      job.updated_at, job.next_run_at, job.execution_count, job.failure_count
    ]
  );
  
  // Return formatted job
  return formatJobFromDB(job);
}
```

### 4. Implement Cron Parser

Update `calculateNextRuns` function:

```typescript
import parser from 'cron-parser';

export async function calculateNextRuns(
  cronExpression: string,
  timezone: string,
  count: number = 10,
  startDate?: string,
  endDate?: string
): Promise<Date[]> {
  try {
    const options: any = { tz: timezone };
    
    if (startDate) {
      options.currentDate = new Date(startDate);
    }
    
    const interval = parser.parseExpression(cronExpression, options);
    const runs: Date[] = [];
    
    for (let i = 0; i < count; i++) {
      const next = interval.next();
      
      if (endDate && next.toDate() > new Date(endDate)) {
        break;
      }
      
      runs.push(next.toDate());
    }
    
    return runs;
  } catch (error: any) {
    throw new Error(`Invalid cron expression: ${error.message}`);
  }
}
```

### 5. Job Execution Scheduler

Create a scheduler service (`src/lib/cron-scheduler.ts`):

```typescript
import { getCronJobs } from './cron-jobs-service';
import { triggerJobExecution } from './cron-jobs-service';

class CronScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  
  async start() {
    // Check for due jobs every minute
    this.intervalId = setInterval(async () => {
      await this.checkAndExecuteJobs();
    }, 60000);
  }
  
  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private async checkAndExecuteJobs() {
    try {
      // Get all enabled jobs
      const result = await getCronJobs({
        page: 1,
        limit: 1000,
        status: 'enabled'
      });
      
      const now = new Date();
      
      for (const job of result.data) {
        if (!job.nextRun) continue;
        
        const nextRun = new Date(job.nextRun);
        
        // Execute if due (within 1 minute window)
        if (nextRun <= now && (now.getTime() - nextRun.getTime()) < 60000) {
          await triggerJobExecution(job.id, 'scheduled');
          
          // Calculate and update next run
          // ... update job.nextRun in database
        }
      }
    } catch (error) {
      console.error('Error checking jobs:', error);
    }
  }
}

export const scheduler = new CronScheduler();
```

### 6. Start Scheduler

In your main server file or API route initialization:

```typescript
// src/app/api/cron-jobs/scheduler/route.ts
import { scheduler } from '@/lib/cron-scheduler';

// Start scheduler on server startup
if (process.env.NODE_ENV !== 'test') {
  scheduler.start();
}
```

## Testing

### Manual Testing with curl

```bash
# List jobs
curl -X GET "http://localhost:3000/api/cron-jobs?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create job
curl -X POST "http://localhost:3000/api/cron-jobs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Job",
    "jobType": "api",
    "cronExpression": "0 0 * * *",
    "config": {
      "apiUrl": "https://api.example.com/endpoint"
    }
  }'
```

### Unit Testing

Create test files in `tests/api/cron-jobs/`:

```typescript
// tests/api/cron-jobs/route.test.ts
import { GET, POST } from '@/app/api/cron-jobs/route';
import { NextRequest } from 'next/server';

describe('Cron Jobs API', () => {
  it('should list jobs', async () => {
    const request = new NextRequest('http://localhost/api/cron-jobs', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## Environment Variables

Add to `.env.local`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cron_jobs

# JWT (if using separate auth service)
JWT_SECRET=your-secret-key

# API
NEXT_PUBLIC_API_URL=http://localhost:4001
```

## Security Considerations

1. **Authentication**: All routes require valid JWT token
2. **Authorization**: Add role-based checks (portal_admin only)
3. **Input Validation**: All inputs are validated
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Add rate limiting middleware
6. **Audit Logging**: Log all job modifications

## Error Handling

All endpoints return consistent error format:

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

## Status

✅ **API Routes**: Complete
✅ **Authentication**: Complete
✅ **Validation**: Complete
⏳ **Database Integration**: Pending
⏳ **Scheduler Service**: Pending
⏳ **Job Execution**: Pending

## Support

For questions or issues:
1. Check the API documentation: `docs/CRON_JOB_MANAGER_API_DOCUMENTATION.md`
2. Review database schema: `docs/CRON_JOB_MANAGER_SQL.sql`
3. Check backend documentation: `docs/CRON_JOB_MANAGER_BACKEND.md`

