import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobById, 
  updateCronJob 
} from '@/lib/cron-jobs-service';

/**
 * PATCH /api/cron-jobs/:id/toggle
 * Enable or disable a CRON job
 */
export async function PATCH(
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
    const body = await request.json();
    const { enabled } = body;

    // Validate enabled field
    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid enabled value. Must be boolean',
          error: {
            code: 'VALIDATION_ERROR',
            details: { enabled }
          },
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

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

    // Update enabled status
    const updatedJob = await updateCronJob(
      id, 
      { enabled }, 
      authResult.userId
    );

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: 'Job toggled successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error toggling cron job:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to toggle cron job',
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

