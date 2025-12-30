/**
 * CRON Jobs Service
 * Business logic for CRON job management
 * 
 * NOTE: This is a service layer that should connect to your database.
 * Currently, it provides the interface and structure. You'll need to
 * implement the actual database operations based on your DB setup.
 */

// UUID generation - install uuid package: npm install uuid @types/uuid
// import { v4 as uuidv4 } from 'uuid';

// Simple UUID v4 generator (fallback if uuid package not installed)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Types
export interface CronJob {
  id: string;
  name: string;
  description?: string;
  jobType: 'script' | 'api' | 'queue' | 'database' | 'command';
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  startDate?: string;
  endDate?: string;
  nextRun?: string;
  lastRun?: string;
  lastRunStatus?: 'success' | 'failed' | 'running' | 'skipped';
  executionCount: number;
  failureCount: number;
  averageDuration?: number;
  config: any;
  retryConfig?: any;
  notificationConfig?: any;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CronJobExecution {
  id: string;
  executionId: string;
  jobId: string;
  triggeredBy: 'scheduled' | 'manual' | 'retry';
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'timeout';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
}

export interface CronJobLog {
  id: string;
  executionId: string;
  jobId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'success' | 'failed' | 'running';
  output?: string;
  error?: string;
  triggeredBy?: 'scheduled' | 'manual' | 'retry';
}

export interface GetJobsFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  type?: string;
  userId?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: any;
}

// Validation
export function validateCronExpression(expression: string): ValidationResult {
  // Basic cron expression validation
  // Format: minute hour day month dayOfWeek
  const parts = expression.trim().split(/\s+/);
  
  if (parts.length !== 5) {
    return {
      valid: false,
      error: 'Invalid cron expression format. Expected: minute hour day month dayOfWeek',
      details: { expression, parts: parts.length }
    };
  }

  // Validate each part
  const ranges = [
    { min: 0, max: 59 },   // minute
    { min: 0, max: 23 },   // hour
    { min: 1, max: 31 },   // day
    { min: 1, max: 12 },   // month
    { min: 0, max: 6 }     // dayOfWeek
  ];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Allow wildcards and special characters
    if (part === '*' || part === '?') continue;
    
    // Check for valid ranges, lists, and steps
    if (!/^[\d\*\/\-\,]+$/.test(part)) {
      return {
        valid: false,
        error: `Invalid character in cron expression part ${i + 1}`,
        details: { part, index: i }
      };
    }
  }

  return { valid: true };
}

export function validateCronJobData(data: any, isUpdate: boolean = false): ValidationResult {
  // Required fields for creation
  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return {
        valid: false,
        error: 'Job name is required',
        details: { field: 'name' }
      };
    }

    if (!data.jobType || !['script', 'api', 'queue', 'database', 'command'].includes(data.jobType)) {
      return {
        valid: false,
        error: 'Valid job type is required',
        details: { field: 'jobType', value: data.jobType }
      };
    }

    if (!data.cronExpression || typeof data.cronExpression !== 'string') {
      return {
        valid: false,
        error: 'Cron expression is required',
        details: { field: 'cronExpression' }
      };
    }
  }

  // Validate cron expression if provided
  if (data.cronExpression) {
    const cronValidation = validateCronExpression(data.cronExpression);
    if (!cronValidation.valid) {
      return {
        valid: false,
        error: `Invalid cron expression: ${cronValidation.error}`,
        details: cronValidation.details
      };
    }
  }

  // Validate timezone if provided
  if (data.timezone && typeof data.timezone !== 'string') {
    return {
      valid: false,
      error: 'Timezone must be a string',
      details: { field: 'timezone' }
    };
  }

  // Validate config based on job type
  if (data.config) {
    const configValidation = validateJobConfig(data.jobType || data.jobType, data.config);
    if (!configValidation.valid) {
      return configValidation;
    }
  }

  return { valid: true };
}

function validateJobConfig(jobType: string, config: any): ValidationResult {
  switch (jobType) {
    case 'script':
      if (!config.scriptPath) {
        return {
          valid: false,
          error: 'Script path is required for script jobs',
          details: { field: 'config.scriptPath' }
        };
      }
      break;
    
    case 'api':
      if (!config.apiUrl) {
        return {
          valid: false,
          error: 'API URL is required for API jobs',
          details: { field: 'config.apiUrl' }
        };
      }
      break;
    
    case 'queue':
      if (!config.queueName) {
        return {
          valid: false,
          error: 'Queue name is required for queue jobs',
          details: { field: 'config.queueName' }
        };
      }
      break;
    
    case 'database':
      if (!config.sqlQuery) {
        return {
          valid: false,
          error: 'SQL query is required for database jobs',
          details: { field: 'config.sqlQuery' }
        };
      }
      break;
    
    case 'command':
      if (!config.command) {
        return {
          valid: false,
          error: 'Command is required for command jobs',
          details: { field: 'config.command' }
        };
      }
      break;
  }

  return { valid: true };
}

// Database operations (to be implemented with actual DB)
// These are placeholder functions - replace with actual database calls

export async function getCronJobs(filters: GetJobsFilters): Promise<{
  data: CronJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  // TODO: Implement actual database query
  // Example structure:
  // const jobs = await db.query(`
  //   SELECT * FROM cron_jobs 
  //   WHERE deleted_at IS NULL
  //   AND (search conditions)
  //   ORDER BY created_at DESC
  //   LIMIT ? OFFSET ?
  // `);
  
  return {
    data: [],
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: 0,
      totalPages: 0
    }
  };
}

export async function getCronJobById(id: string, userId?: string): Promise<CronJob | null> {
  // TODO: Implement actual database query
  // const job = await db.query('SELECT * FROM cron_jobs WHERE id = ? AND deleted_at IS NULL', [id]);
  return null;
}

export async function createCronJob(data: Partial<CronJob>): Promise<CronJob> {
  // TODO: Implement actual database insert
  // Generate ID, calculate next run, insert into DB
  
  const job: CronJob = {
    id: generateUUID(),
    name: data.name!,
    description: data.description,
    jobType: data.jobType!,
    cronExpression: data.cronExpression!,
    timezone: data.timezone || 'Asia/Kolkata',
    enabled: data.enabled !== undefined ? data.enabled : true,
    startDate: data.startDate,
    endDate: data.endDate,
    config: data.config || {},
    retryConfig: data.retryConfig,
    notificationConfig: data.notificationConfig,
    executionCount: 0,
    failureCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy || ''
  };

  // Calculate next run
  const nextRuns = await calculateNextRuns(
    job.cronExpression,
    job.timezone,
    1,
    job.startDate,
    job.endDate
  );
  if (nextRuns.length > 0) {
    job.nextRun = nextRuns[0].toISOString();
  }

  // TODO: Insert into database
  // await db.query('INSERT INTO cron_jobs ...', [job]);

  return job;
}

export async function updateCronJob(
  id: string,
  updates: Partial<CronJob>,
  userId?: string
): Promise<CronJob> {
  // TODO: Implement actual database update
  // const job = await getCronJobById(id);
  // const updated = { ...job, ...updates, updated_at: new Date() };
  // await db.query('UPDATE cron_jobs SET ... WHERE id = ?', [id]);
  
  throw new Error('Not implemented - connect to database');
}

export async function deleteCronJob(id: string, userId?: string): Promise<void> {
  // TODO: Implement soft delete
  // await db.query('UPDATE cron_jobs SET deleted_at = ? WHERE id = ?', [new Date(), id]);
  
  throw new Error('Not implemented - connect to database');
}

export async function triggerJobExecution(
  jobId: string,
  triggeredBy: 'scheduled' | 'manual' | 'retry',
  userId?: string
): Promise<{
  executionId: string;
  status: string;
  estimatedStartTime: string;
}> {
  // TODO: Check if job is already running
  // TODO: Create execution record
  // TODO: Queue job for execution
  
  const executionId = generateUUID();
  
  return {
    executionId,
    status: 'pending',
    estimatedStartTime: new Date().toISOString()
  };
}

export async function getCronJobLogs(
  jobId: string,
  filters: {
    page: number;
    limit: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<{
  data: CronJobLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  // TODO: Implement actual database query
  return {
    data: [],
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: 0,
      totalPages: 0
    }
  };
}

export async function getCronJobExecutionHistory(
  jobId: string,
  filters: {
    page: number;
    limit: number;
  }
): Promise<{
  data: CronJobExecution[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  // TODO: Implement actual database query
  return {
    data: [],
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: 0,
      totalPages: 0
    }
  };
}

export async function calculateNextRuns(
  cronExpression: string,
  timezone: string,
  count: number = 10,
  startDate?: string,
  endDate?: string
): Promise<Date[]> {
  // TODO: Use cron-parser library to calculate next runs
  // Example:
  // const parser = require('cron-parser');
  // const interval = parser.parseExpression(cronExpression, { tz: timezone });
  // const runs = [];
  // for (let i = 0; i < count; i++) {
  //   const next = interval.next();
  //   if (endDate && next > new Date(endDate)) break;
  //   runs.push(next);
  // }
  // return runs;
  
  // Placeholder - returns empty array
  // Install: npm install cron-parser
  return [];
}

