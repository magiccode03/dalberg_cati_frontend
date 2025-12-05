import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/api-auth';
import { 
  getCronJobs, 
  createCronJob, 
  validateCronJobData 
} from '@/lib/cron-jobs-service';

/**
 * GET /api/cron-jobs
 * List all CRON jobs with pagination and filters
 */
export async function GET(request: NextRequest) {
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

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

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

    // Fetch jobs
    const result = await getCronJobs({
      page,
      limit,
      search,
      status,
      type,
      userId: authResult.userId
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Jobs retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching cron jobs:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch cron jobs',
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
 * POST /api/cron-jobs
 * Create a new CRON job
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();

    // Validate job data
    const validation = validateCronJobData(body);
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

    // Create job
    const job = await createCronJob({
      ...body,
      createdBy: authResult.userId
    });

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating cron job:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create cron job',
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

