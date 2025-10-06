# Telecaller Performance API Implementation

## Summary
Implemented comprehensive telecaller performance APIs based on the specification document. These APIs provide detailed metrics for monitoring telecaller activities, call statuses, and interview completion rates.

## API Endpoints Created

### 1. Overall Performance Metrics
```
GET /api/cati/telecaller-performance
```

**Query Parameters:**
- `teleform_user_id` (optional): Filter by specific telecaller
- `ac_code` (optional): Filter by Assembly Constituency  
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)

**Response Example:**
```json
{
  "success": true,
  "data": {
    "total_callers": 15,
    "number_of_dials": 2847,
    "caller_did_not_pick": 1245,
    "days_till_now": 7,
    "total_ivr_duration": "02:15:30",
    "total_talk_duration": "08:42:15",
    "call_not_received": 342,
    "ringing": 1256,
    "not_ringing": 1249,
    "no_response": 0,
    "switch_off": 567,
    "number_not_reachable": 423,
    "number_does_not_exist": 198,
    "not_ringing_no_response": 61,
    "picked": 892,
    "did_not_picked": 364,
    "ringing_no_response": 0,
    "call_continue": 567,
    "wrong_number": 123,
    "reschedule_call": 89,
    "picked_no_response": 113,
    "number_exhausted": 0,
    "successful_interview": 445,
    "incomplete_interview": 122,
    "reject_interview": 78
  },
  "message": "Performance metrics retrieved successfully",
  "timestamp": "2025-10-05T20:15:00.000Z"
}
```

### 2. Day-wise Performance Metrics
```
GET /api/cati/telecaller-performance/daywise
```

**Query Parameters:**
- `teleform_user_id` (optional): Filter by specific telecaller
- `ac_code` (optional): Filter by Assembly Constituency
- `days` (optional): Number of days (default: 7)
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-10-05",
      "metrics": {
        "total_callers": 12,
        "number_of_dials": 456,
        "successful_interview": 89,
        // ... all other metrics
      }
    },
    {
      "date": "2025-10-04",
      "metrics": { /* Same structure */ }
    }
    // ... for each day
  ],
  "message": "Day-wise performance metrics retrieved successfully",
  "timestamp": "2025-10-05T20:15:00.000Z"
}
```

## Files Created

### 1. DTO (`src/dto/telecaller-performance.dto.ts`)
- `TelecallerPerformanceQueryDto` - Validation for overall performance query
- `TelecallerPerformanceDaywiseQueryDto` - Validation for day-wise query

### 2. Interfaces (`src/interfaces/telecaller-performance.interfaces.ts`)
- `ITelecallerPerformanceMetrics` - Structure for performance metrics
- `IDaywisePerformanceMetrics` - Structure for day-wise data
- `ITelecallerPerformanceFilters` - Filter parameters

### 3. Repository (`src/repositories/telecaller-performance.repository.ts`)
- `getOverallPerformance()` - Calculate overall metrics
- `getDaywisePerformance()` - Calculate day-wise metrics
- `buildWhereClause()` - Dynamic SQL filter building

### 4. Service (`src/services/telecaller-performance.service.ts`)
- `getOverallPerformance()` - Business logic layer
- `getDaywisePerformance()` - Business logic layer

### 5. Controller (`src/controllers/telecaller-performance.controller.ts`)
- `getOverallPerformance()` - HTTP handler
- `getDaywisePerformance()` - HTTP handler

### 6. Routes (`src/routes/telecaller-performance.routes.ts`)
- GET `/` - Overall performance endpoint
- GET `/daywise` - Day-wise performance endpoint
- Complete Swagger documentation

### 7. Main App (`src/index.ts`)
- Registered routes at `/api/cati/telecaller-performance`

## Performance Metrics Explained

### Caller Performance
| Metric | Description | Calculation |
|--------|-------------|-------------|
| `total_callers` | Unique telecallers | COUNT(DISTINCT teleform_user_id) |
| `number_of_dials` | Total dial attempts | SUM(call_attempt) |
| `caller_did_not_pick` | Calls not picked | WHERE call_received = 0 |
| `days_till_now` | Days since first call | DATEDIFF(NOW(), MIN(call_date)) + 1 |
| `total_ivr_duration` | IVR time (HH:MM:SS) | SUM(endtime - starttime) for incomplete |
| `total_talk_duration` | Talk time (HH:MM:SS) | SUM(form_duration_seconds) for completed |

### Call Dial Status
| Metric | Description | Calculation |
|--------|-------------|-------------|
| `call_not_received` | Not received | call_received = 0 |
| `ringing` | Phone ringing | call_ring_status = 1 |
| `not_ringing` | Not ringing | call_not_ring = 1 |
| `no_response` | No response | q_call_status = 0 |

### Not Ringing Breakdown
| Metric | Description | Calculation |
|--------|-------------|-------------|
| `switch_off` | Phone switched off | call_not_ring = 1 AND q_call_status = 1 |
| `number_not_reachable` | Not reachable | call_not_ring = 1 AND q_call_status = 2 |
| `number_does_not_exist` | Number doesn't exist | call_not_ring = 1 AND q_call_status = 3 |
| `not_ringing_no_response` | Not ringing, no response | call_not_ring = 1 AND q_call_status = 0 |

### Ringing Breakdown
| Metric | Description | Calculation |
|--------|-------------|-------------|
| `picked` | Call picked | call_ring_status = 1 AND call_received = 1 |
| `did_not_picked` | Did not pick | call_ring_status = 1 AND call_received = 0 |
| `ringing_no_response` | Ringing, no response | call_ring_status = 1 AND q_call_status = 0 |

### Ringing Picked Breakdown
| Metric | Description | Calculation |
|--------|-------------|-------------|
| `call_continue` | Call completed | call_received = 1 AND final_submit = 1 |
| `wrong_number` | Wrong number | call_received = 1 AND q_call_status = 5 |
| `reschedule_call` | Rescheduled | call_received = 1 AND q_call_status = 6 |
| `picked_no_response` | Picked, no response | call_received = 1 AND final_submit = 0 |

### Interview Metrics
| Metric | Description | Calculation |
|--------|-------------|-------------|
| `number_exhausted` | Number exhausted | number_status = 0 |
| `successful_interview` | Completed successfully | final_submit = 1 |
| `incomplete_interview` | Started but incomplete | call_received = 1 AND final_submit = 0 |
| `reject_interview` | Rejected | q_call_status = 7 |

## Usage Examples

### 1. Get Overall Performance (No Filters)
```bash
curl "http://localhost:4001/api/cati/telecaller-performance" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Get Performance for Specific Telecaller
```bash
curl "http://localhost:4001/api/cati/telecaller-performance?teleform_user_id=123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Performance for Specific AC
```bash
curl "http://localhost:4001/api/cati/telecaller-performance?ac_code=105" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Performance for Date Range
```bash
curl "http://localhost:4001/api/cati/telecaller-performance?start_date=2025-01-01&end_date=2025-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get Performance for Specific Date
```bash
curl "http://localhost:4001/api/cati/telecaller-performance?date=2025-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Get Day-wise Performance (Last 7 Days)
```bash
curl "http://localhost:4001/api/cati/telecaller-performance/daywise" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Get Day-wise Performance (Last 30 Days)
```bash
curl "http://localhost:4001/api/cati/telecaller-performance/daywise?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Get Day-wise Performance for Specific Telecaller
```bash
curl "http://localhost:4001/api/cati/telecaller-performance/daywise?teleform_user_id=123&days=14" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. Combined Filters
```bash
curl "http://localhost:4001/api/cati/telecaller-performance?teleform_user_id=123&ac_code=105&start_date=2025-01-01&end_date=2025-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema Reference

### Key Fields Used
```sql
teleform_user_id     INT       -- Telecaller identifier
ac_code             INT       -- Assembly Constituency code
call_attempt        INT       -- Number of dial attempts
call_received       INT       -- Call received status (0/1)
call_date           DATE      -- Date of call
starttime           INT       -- Call start time (timestamp)
endtime             INT       -- Call end time (timestamp)
form_duration_seconds INT     -- Duration of completed forms
q_call_status       INT       -- Call status (0-7)
call_not_ring       TINYINT   -- Phone not ringing (0/1)
call_ring_status    TINYINT   -- Phone ringing status (0/1)
final_submit        TINYINT   -- Form completion status (0/1)
number_status       TINYINT   -- Number validation status
status              TINYINT   -- Overall record status
```

### Call Status Codes (q_call_status)
- `0` - No response
- `1` - Switch off
- `2` - Number not reachable
- `3` - Number does not exist
- `5` - Wrong number
- `6` - Reschedule call
- `7` - Reject interview

## Performance Optimization

### Indexes Recommended
```sql
CREATE INDEX idx_teleform_user_id ON cati_survey_calling_interview(teleform_user_id);
CREATE INDEX idx_ac_code ON cati_survey_calling_interview(ac_code);
CREATE INDEX idx_call_date ON cati_survey_calling_interview(call_date);
CREATE INDEX idx_status ON cati_survey_calling_interview(status);
CREATE INDEX idx_call_received ON cati_survey_calling_interview(call_received);
CREATE INDEX idx_final_submit ON cati_survey_calling_interview(final_submit);

-- Composite indexes
CREATE INDEX idx_teleform_date ON cati_survey_calling_interview(teleform_user_id, call_date);
CREATE INDEX idx_ac_date ON cati_survey_calling_interview(ac_code, call_date);
```

### Query Performance
- Uses aggregate functions (COUNT, SUM) for efficiency
- Single query for overall metrics
- Grouped query for day-wise metrics
- All conditions use indexed fields
- COALESCE prevents NULL values

## Testing

### Test Overall Performance
```bash
# Test 1: All metrics
curl "http://localhost:4001/api/cati/telecaller-performance" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Test 2: Filtered by user
curl "http://localhost:4001/api/cati/telecaller-performance?teleform_user_id=13" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Test 3: Date range
curl "http://localhost:4001/api/cati/telecaller-performance?start_date=2025-10-01&end_date=2025-10-05" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .
```

### Test Day-wise Performance
```bash
# Test 1: Last 7 days
curl "http://localhost:4001/api/cati/telecaller-performance/daywise" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Test 2: Last 30 days
curl "http://localhost:4001/api/cati/telecaller-performance/daywise?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Test 3: Filtered by AC
curl "http://localhost:4001/api/cati/telecaller-performance/daywise?ac_code=105&days=14" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .
```

### Expected Results

**Successful Response (200):**
- All metrics calculated correctly
- Duration fields in HH:MM:SS format
- All counts are non-negative integers
- Day-wise data ordered by date DESC

**Error Responses:**
- 400: Invalid parameters (negative numbers, invalid dates)
- 401: Missing or invalid authorization token
- 500: Database error or calculation failure

## JavaScript/Frontend Usage

### Fetch Overall Performance
```javascript
const getPerformanceMetrics = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await fetch(
    `http://localhost:4001/api/cati/telecaller-performance?${queryString}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );
  
  const result = await response.json();
  return result.data;
};

// Usage
const metrics = await getPerformanceMetrics({
  teleform_user_id: 123,
  start_date: '2025-01-01',
  end_date: '2025-01-15'
});

console.log(`Total Dials: ${metrics.number_of_dials}`);
console.log(`Successful Interviews: ${metrics.successful_interview}`);
console.log(`Success Rate: ${(metrics.successful_interview / metrics.number_of_dials * 100).toFixed(2)}%`);
```

### Fetch Day-wise Performance
```javascript
const getDaywisePerformance = async (days = 7) => {
  const response = await fetch(
    `http://localhost:4001/api/cati/telecaller-performance/daywise?days=${days}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );
  
  const result = await response.json();
  return result.data;
};

// Usage
const daywiseData = await getDaywisePerformance(14);

// Create chart data
const chartData = daywiseData.map(day => ({
  date: day.date,
  successful: day.metrics.successful_interview,
  incomplete: day.metrics.incomplete_interview,
  rejected: day.metrics.reject_interview
}));
```

## Dashboard Integration

### Key Performance Indicators (KPIs)
```javascript
const metrics = await getPerformanceMetrics();

// Calculate KPIs
const successRate = (metrics.successful_interview / metrics.number_of_dials * 100).toFixed(2);
const pickRate = (metrics.picked / metrics.number_of_dials * 100).toFixed(2);
const completionRate = (metrics.successful_interview / metrics.picked * 100).toFixed(2);

// Display
console.log(`Success Rate: ${successRate}%`);
console.log(`Pick Rate: ${pickRate}%`);
console.log(`Completion Rate: ${completionRate}%`);
console.log(`Avg Dials per Caller: ${(metrics.number_of_dials / metrics.total_callers).toFixed(2)}`);
```

### Trend Analysis
```javascript
const daywiseData = await getDaywisePerformance(7);

// Calculate daily trends
const dailySuccess = daywiseData.map(day => day.metrics.successful_interview);
const trend = dailySuccess[0] > dailySuccess[dailySuccess.length - 1] ? 'up' : 'down';

console.log(`Daily Success Trend: ${trend}`);
console.log(`Today: ${dailySuccess[0]}, 7 days ago: ${dailySuccess[dailySuccess.length - 1]}`);
```

## Error Handling

### Common Errors

**1. Invalid Date Format**
```json
{
  "success": false,
  "error": "Date must be in YYYY-MM-DD format",
  "message": "Validation failed"
}
```

**2. Invalid Telecaller ID**
```json
{
  "success": false,
  "error": "Teleform user ID must be positive",
  "message": "Validation failed"
}
```

**3. Database Error**
```json
{
  "success": false,
  "message": "Internal server error",
  "timestamp": "2025-10-05T20:15:00.000Z"
}
```

## Monitoring and Logging

### Log Entries
```javascript
// Info logs
"Getting overall telecaller performance metrics"
"Overall performance metrics retrieved successfully"
"Getting day-wise telecaller performance metrics"
"Day-wise performance metrics calculated successfully"

// Error logs
"Error fetching overall performance metrics"
"Error fetching day-wise performance metrics"
"Error in getOverallPerformance:"
"Error in getDaywisePerformance:"
```

### Metrics to Monitor
- API response time (target: < 2-3 seconds)
- Query execution time
- Error rate
- Number of API calls per minute
- Filter usage patterns

## Security

### Authentication
- ✅ Required on all endpoints (`requireAuthMiddleware`)
- ✅ JWT token validation
- ✅ Request logging with user ID

### Authorization
- Currently: Any authenticated user can access
- Future: Add role-based access control if needed

### Input Validation
- ✅ All query parameters validated via DTOs
- ✅ Type checking (integers, dates)
- ✅ Range validation (positive numbers)
- ✅ Date format validation (YYYY-MM-DD)

### SQL Injection Protection
- ✅ Uses parameterized queries
- ✅ No string concatenation in SQL
- ✅ All values properly escaped

## Future Enhancements

1. **Caching**: Implement Redis caching with 5-minute TTL
2. **Export**: Add CSV/Excel export functionality
3. **Real-time**: WebSocket support for live updates
4. **Alerts**: Threshold-based alerts for poor performance
5. **Comparison**: Compare performance across telecallers or time periods
6. **Detailed Breakdown**: Per-telecaller detailed performance report
7. **AC-wise Breakdown**: Performance metrics grouped by AC
8. **Time-of-Day Analysis**: Peak hours, busy times analysis

## Deployment

### Environment Setup
No additional environment variables needed. Uses existing CATI database configuration.

### Database Requirements
- Table: `cati_survey_calling_interview`
- Recommended: Create performance indexes (see above)

### Application Restart
After deployment, restart the application:
```bash
npm run build
npm start
```

Or for development:
```bash
npm run dev
```

## Date
October 5, 2025

## Related Documentation
- [Telecaller Performance API Specification](./TELECALLER_PERFORMANCE_API_DOCUMENTATION.md)
- [CATI Interview API](./CATI_INTERVIEW_UPDATE_API.md)
- [CATI Database Schema](../click_house_schema/)

