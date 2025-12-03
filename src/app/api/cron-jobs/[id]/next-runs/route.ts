import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobById, 
  calculateNextRuns 
} from '@/lib/cron-jobs-service';

/**
 * GET /api/cron-jobs/:id/next-runs
 * Calculate and return next scheduled run times for a CRON job
 */
export async function GET(
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

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const count = Math.min(
      Math.max(parseInt(searchParams.get('count') || '10', 10), 1),
      50
    );

    // Calculate next runs
    const runs = await calculateNextRuns(
      job.cronExpression,
      job.timezone,
      count,
      job.startDate,
      job.endDate
    );

    return NextResponse.json({
      success: true,
      data: {
        runs: runs.map(run => ({
          scheduledAt: run.toISOString(),
          timezone: job.timezone
        }))
      },
      message: 'Next runs calculated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error calculating next runs:', error);
    
    // Check for invalid cron expression
    if (error.message?.includes('Invalid cron expression')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid cron expression',
          error: {
            code: 'INVALID_CRON_EXPRESSION',
            details: { message: error.message }
          },
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to calculate next runs',
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

