import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobById, 
  getCronJobExecutionHistory 
} from '@/lib/cron-jobs-service';

/**
 * GET /api/cron-jobs/:id/history
 * Get execution history for a CRON job
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
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid pagination parameters',
          error: {
            code: 'VALIDATION_ERROR',
            details: { page, limit }
          },
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Fetch execution history
    const result = await getCronJobExecutionHistory(id, {
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'History retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching cron job history:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch cron job history',
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

