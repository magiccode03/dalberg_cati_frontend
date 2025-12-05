import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobById, 
  updateCronJob 
} from '@/lib/cron-jobs-service';

/**
 * POST /api/cron-jobs/:id/pause
 * Pause a CRON job (disable it)
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

    // Pause job (set enabled to false)
    await updateCronJob(id, { enabled: false }, authResult.userId);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Job paused successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error pausing cron job:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to pause cron job',
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

