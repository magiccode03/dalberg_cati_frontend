import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobById, 
  triggerJobExecution 
} from '@/lib/cron-jobs-service';

/**
 * POST /api/cron-jobs/:id/run-now
 * Manually trigger a CRON job execution immediately
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate authentication
    const authResult = await validateAuth(request);
    if (!authResult.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
          error: {
            code: 'UNAUTHORIZED',
            details: {}
          },
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if job exists
    const job = await getCronJobById(id, authResult.userId);
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: 'Job not found',
          error: {
            code: 'JOB_NOT_FOUND',
            details: { id }
          },
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }

    // Check if job is enabled
    if (!job.enabled) {
      return NextResponse.json(
        {
          success: false,
          message: 'Job is disabled',
          error: {
            code: 'VALIDATION_ERROR',
            details: { enabled: job.enabled }
          },
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Trigger execution
    const execution = await triggerJobExecution(id, 'manual', authResult.userId);

    return NextResponse.json({
      success: true,
      data: {
        executionId: execution.executionId,
        status: execution.status,
        estimatedStartTime: execution.estimatedStartTime
      },
      message: 'Job execution triggered',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error triggering job execution:', error);
    
    // Check for specific error types
    if (error.code === 'JOB_ALREADY_RUNNING') {
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Job is already running',
          error: {
            code: 'JOB_ALREADY_RUNNING',
            details: {}
          },
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to trigger job execution',
        error: {
          code: 'INTERNAL_ERROR',
          details: {}
        },
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

