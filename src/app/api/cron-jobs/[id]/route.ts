import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobById, 
  updateCronJob, 
  deleteCronJob,
  validateCronJobData 
} from '@/lib/cron-jobs-service';

/**
 * GET /api/cron-jobs/:id
 * Get job details by ID
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

    // Fetch job
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

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching cron job:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch cron job',
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

/**
 * PUT /api/cron-jobs/:id
 * Update an existing CRON job
 */
export async function PUT(
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

    // Check if job exists
    const existingJob = await getCronJobById(id, authResult.userId);
    if (!existingJob) {
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

    // Validate update data (only validate provided fields)
    const updateData = { ...existingJob, ...body };
    const validation = validateCronJobData(updateData, true);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error || 'Invalid job data',
          error: {
            code: 'VALIDATION_ERROR',
            details: validation.details || {}
          },
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Update job
    const updatedJob = await updateCronJob(id, body, authResult.userId);

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: 'Job updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error updating cron job:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update cron job',
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

/**
 * DELETE /api/cron-jobs/:id
 * Soft delete a CRON job
 */
export async function DELETE(
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

    // Delete job (soft delete)
    await deleteCronJob(id, authResult.userId);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Job deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error deleting cron job:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete cron job',
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

