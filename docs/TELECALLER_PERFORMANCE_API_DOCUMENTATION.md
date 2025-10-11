# Telecaller Performance API Documentation

## Overview
This document provides comprehensive API specifications for implementing the telecaller performance dashboard backend endpoints. The APIs will calculate performance metrics from the `cati_survey_calling_interview` table.

## Table Schema Reference

### Primary Table: `cati_survey_calling_interview`

```sql
-- Key fields for performance calculations
teleform_user_id     INT       -- Telecaller identifier
ac_code             INT       -- Assembly Constituency code
call_attempt        INT       -- Number of dial attempts (default: 0)
call_received       INT       -- Call received status (default: 0)
call_date           DATE      -- Date of call
starttime           INT       -- Call start time (timestamp)
endtime             INT       -- Call end time (timestamp)
form_duration_seconds INT     -- Duration of completed forms
q_call_status       INT       -- Call status (1-4: various statuses)
call_not_ring       TINYINT   -- Phone not ringing (0/1)
call_ring_status    TINYINT   -- Phone ringing status (0/1)
final_submit        TINYINT   -- Form completion status (0/1)
number_status       TINYINT   -- Number validation status
status              TINYINT   -- Overall record status
```

## API Endpoints

### 1. Overall Performance Metrics

#### Endpoint
```
GET /api/cati/telecaller-performance
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teleform_user_id` | integer | No | Filter by specific telecaller |
| `ac_code` | integer | No | Filter by specific AC |
| `date` | string | No | Filter by specific date (YYYY-MM-DD) |
| `start_date` | string | No | Filter from date (YYYY-MM-DD) |
| `end_date` | string | No | Filter to date (YYYY-MM-DD) |

#### Response Structure
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
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Calculation Logic

##### Caller Performance Metrics

**1. Total Callers**
```sql
SELECT COUNT(DISTINCT teleform_user_id) 
FROM cati_survey_calling_interview 
WHERE status = 1 AND [filters]
```

**2. Number of Dials**
```sql
SELECT SUM(call_attempt) 
FROM cati_survey_calling_interview 
WHERE [filters]
```

**3. Caller did not pick**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 0 AND [filters]
```

**4. Days till now**
```sql
SELECT DATEDIFF(NOW(), MIN(call_date)) + 1 
FROM cati_survey_calling_interview 
WHERE [filters]
```

**5. Total IVR Duration**
```sql
-- Calculate from starttime to endtime for incomplete calls
SELECT SEC_TO_TIME(SUM(
  CASE 
    WHEN endtime IS NOT NULL AND starttime IS NOT NULL 
    THEN endtime - starttime 
    ELSE 0 
  END
)) 
FROM cati_survey_calling_interview 
WHERE call_received = 1 AND final_submit = 0 AND [filters]
```

**6. Total Talk Duration**
```sql
SELECT SEC_TO_TIME(SUM(form_duration_seconds)) 
FROM cati_survey_calling_interview 
WHERE final_submit = 1 AND [filters]
```

##### Call Dial Status Metrics

**7. Call not Received**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 0 AND [filters]
```

**8. Ringing**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_ring_status = 1 AND [filters]
```

**9. Not Ringing**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_not_ring = 1 AND [filters]
```

**10. No Response**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE q_call_status = 0 AND [filters]
```

##### Not Ringing Breakdown

**11. Switch Off**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_not_ring = 1 AND q_call_status = 1 AND [filters]
```

**12. Number Not Reachable**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_not_ring = 1 AND q_call_status = 2 AND [filters]
```

**13. Number Does Not Exist**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_not_ring = 1 AND q_call_status = 3 AND [filters]
```

**14. Not Ringing No Response**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_not_ring = 1 AND q_call_status = 0 AND [filters]
```

##### Ringing Breakdown

**15. Picked**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_ring_status = 1 AND call_received = 1 AND [filters]
```

**16. Did not picked**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_ring_status = 1 AND call_received = 0 AND [filters]
```

**17. Ringing No Response**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_ring_status = 1 AND q_call_status = 0 AND [filters]
```

##### Ringing Picked Breakdown

**18. Call Continue**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 1 AND final_submit = 1 AND [filters]
```

**19. Wrong Number**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 1 AND q_call_status = 5 AND [filters]
```

**20. Reschedule Call**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 1 AND q_call_status = 6 AND [filters]
```

**21. Picked No Response**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 1 AND final_submit = 0 AND [filters]
```

##### Interview Metrics

**22. Number Exhausted**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE number_status = 0 AND [filters]
```

**23. Successful Interview**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE final_submit = 1 AND [filters]
```

**24. Incomplete Interview**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE call_received = 1 AND final_submit = 0 AND [filters]
```

**25. Reject Interview**
```sql
SELECT COUNT(*) 
FROM cati_survey_calling_interview 
WHERE q_call_status = 7 AND [filters]
```

### 2. Day-wise Performance

#### Endpoint
```
GET /api/cati/telecaller-performance/daywise
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teleform_user_id` | integer | No | Filter by specific telecaller |
| `ac_code` | integer | No | Filter by specific AC |
| `days` | integer | No | Number of days (default: 7) |
| `start_date` | string | No | Start date (YYYY-MM-DD) |
| `end_date` | string | No | End date (YYYY-MM-DD) |

#### Response Structure
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-15",
      "metrics": {
        "total_callers": 15,
        "number_of_dials": 2847,
        "caller_did_not_pick": 1245,
        "days_till_now": 1,
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
      }
    },
    {
      "date": "2025-01-14",
      "metrics": { /* Same structure */ }
    }
    // ... for each day
  ],
  "message": "Day-wise performance metrics retrieved successfully",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Calculation Logic

For day-wise data, use the same calculation logic but group by date:

```sql
SELECT 
  DATE(call_date) as date,
  -- Apply all the same calculations as above
  COUNT(DISTINCT teleform_user_id) as total_callers,
  SUM(call_attempt) as number_of_dials,
  -- ... other metrics
FROM cati_survey_calling_interview 
WHERE [filters]
GROUP BY DATE(call_date)
ORDER BY date DESC
LIMIT 7
```

## Implementation Guidelines

### 1. Database Optimization

**Indexes Required:**
```sql
-- Primary performance indexes
CREATE INDEX idx_teleform_user_id ON cati_survey_calling_interview(teleform_user_id);
CREATE INDEX idx_ac_code ON cati_survey_calling_interview(ac_code);
CREATE INDEX idx_call_date ON cati_survey_calling_interview(call_date);
CREATE INDEX idx_status ON cati_survey_calling_interview(status);
CREATE INDEX idx_call_received ON cati_survey_calling_interview(call_received);
CREATE INDEX idx_final_submit ON cati_survey_calling_interview(final_submit);

-- Composite indexes for better performance
CREATE INDEX idx_teleform_date ON cati_survey_calling_interview(teleform_user_id, call_date);
CREATE INDEX idx_ac_date ON cati_survey_calling_interview(ac_code, call_date);
CREATE INDEX idx_status_date ON cati_survey_calling_interview(status, call_date);
```

### 2. Caching Strategy

**Redis Cache Keys:**
```
telecaller_performance:overall:{hash_of_filters}
telecaller_performance:daywise:{hash_of_filters}
telecaller_performance:user:{teleform_user_id}:{date_range}
telecaller_performance:ac:{ac_code}:{date_range}
```

**Cache TTL:** 5 minutes for real-time data

### 3. Performance Considerations

**Query Optimization:**
- Use prepared statements
- Limit result sets with appropriate WHERE clauses
- Use aggregation functions efficiently
- Consider materialized views for complex calculations

**Response Time Targets:**
- Overall metrics: < 2 seconds
- Day-wise metrics: < 3 seconds
- Filtered queries: < 1.5 seconds

### 4. Error Handling

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "PERFORMANCE_CALCULATION_ERROR",
    "message": "Unable to calculate performance metrics",
    "details": "Database connection timeout"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Error Codes:**
- `INVALID_FILTERS`: Invalid query parameters
- `DATABASE_ERROR`: Database connection issues
- `CALCULATION_ERROR`: Metric calculation failures
- `AUTHORIZATION_ERROR`: Invalid or missing auth token

### 5. Authentication

**Required Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

**Token Validation:**
- Validate JWT token
- Check user permissions for telecaller data access
- Log API access for audit purposes

## Sample Implementation

### Node.js/Express Example

```javascript
// GET /api/cati/telecaller-performance
app.get('/api/cati/telecaller-performance', async (req, res) => {
  try {
    const { teleform_user_id, ac_code, date } = req.query;
    
    // Build WHERE clause
    const whereConditions = ['status = 1'];
    const params = [];
    
    if (teleform_user_id) {
      whereConditions.push('teleform_user_id = ?');
      params.push(teleform_user_id);
    }
    
    if (ac_code) {
      whereConditions.push('ac_code = ?');
      params.push(ac_code);
    }
    
    if (date) {
      whereConditions.push('DATE(call_date) = ?');
      params.push(date);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Calculate metrics
    const metrics = await calculatePerformanceMetrics(whereClause, params);
    
    res.json({
      success: true,
      data: metrics,
      message: 'Performance metrics retrieved successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PERFORMANCE_CALCULATION_ERROR',
        message: 'Unable to calculate performance metrics',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
});

async function calculatePerformanceMetrics(whereClause, params) {
  const query = `
    SELECT 
      COUNT(DISTINCT teleform_user_id) as total_callers,
      SUM(call_attempt) as number_of_dials,
      SUM(CASE WHEN call_received = 0 THEN 1 ELSE 0 END) as caller_did_not_pick,
      DATEDIFF(NOW(), MIN(call_date)) + 1 as days_till_now,
      SEC_TO_TIME(SUM(CASE WHEN call_received = 1 AND final_submit = 0 THEN endtime - starttime ELSE 0 END)) as total_ivr_duration,
      SEC_TO_TIME(SUM(form_duration_seconds)) as total_talk_duration,
      SUM(CASE WHEN call_received = 0 THEN 1 ELSE 0 END) as call_not_received,
      SUM(CASE WHEN call_ring_status = 1 THEN 1 ELSE 0 END) as ringing,
      SUM(CASE WHEN call_not_ring = 1 THEN 1 ELSE 0 END) as not_ringing,
      SUM(CASE WHEN q_call_status = 0 THEN 1 ELSE 0 END) as no_response,
      SUM(CASE WHEN call_not_ring = 1 AND q_call_status = 1 THEN 1 ELSE 0 END) as switch_off,
      SUM(CASE WHEN call_not_ring = 1 AND q_call_status = 2 THEN 1 ELSE 0 END) as number_not_reachable,
      SUM(CASE WHEN call_not_ring = 1 AND q_call_status = 3 THEN 1 ELSE 0 END) as number_does_not_exist,
      SUM(CASE WHEN call_not_ring = 1 AND q_call_status = 0 THEN 1 ELSE 0 END) as not_ringing_no_response,
      SUM(CASE WHEN call_ring_status = 1 AND call_received = 1 THEN 1 ELSE 0 END) as picked,
      SUM(CASE WHEN call_ring_status = 1 AND call_received = 0 THEN 1 ELSE 0 END) as did_not_picked,
      SUM(CASE WHEN call_ring_status = 1 AND q_call_status = 0 THEN 1 ELSE 0 END) as ringing_no_response,
      SUM(CASE WHEN call_received = 1 AND final_submit = 1 THEN 1 ELSE 0 END) as call_continue,
      SUM(CASE WHEN call_received = 1 AND q_call_status = 5 THEN 1 ELSE 0 END) as wrong_number,
      SUM(CASE WHEN call_received = 1 AND q_call_status = 6 THEN 1 ELSE 0 END) as reschedule_call,
      SUM(CASE WHEN call_received = 1 AND final_submit = 0 THEN 1 ELSE 0 END) as picked_no_response,
      SUM(CASE WHEN number_status = 0 THEN 1 ELSE 0 END) as number_exhausted,
      SUM(CASE WHEN final_submit = 1 THEN 1 ELSE 0 END) as successful_interview,
      SUM(CASE WHEN call_received = 1 AND final_submit = 0 THEN 1 ELSE 0 END) as incomplete_interview,
      SUM(CASE WHEN q_call_status = 7 THEN 1 ELSE 0 END) as reject_interview
    FROM cati_survey_calling_interview 
    WHERE ${whereClause}
  `;
  
  const result = await db.query(query, params);
  return result[0];
}
```

## Testing

### Test Cases

1. **Overall Performance (No Filters)**
   - Verify all metrics are calculated correctly
   - Check response time < 2 seconds

2. **Filtered by Telecaller**
   - Test with valid teleform_user_id
   - Test with invalid teleform_user_id
   - Verify metrics are specific to that telecaller

3. **Filtered by AC**
   - Test with valid ac_code
   - Test with invalid ac_code
   - Verify metrics are specific to that AC

4. **Date Filtering**
   - Test with specific date
   - Test with date range
   - Verify metrics are for specified period

5. **Combined Filters**
   - Test telecaller + AC filters
   - Test telecaller + date filters
   - Test AC + date filters
   - Test all filters combined

6. **Day-wise Performance**
   - Verify 7 days of data
   - Check date ordering (newest first)
   - Verify each day has complete metrics

### Sample Test Data

```sql
-- Insert test data for verification
INSERT INTO cati_survey_calling_interview 
(teleform_user_id, ac_code, call_attempt, call_received, call_date, starttime, endtime, form_duration_seconds, q_call_status, call_not_ring, call_ring_status, final_submit, number_status, status)
VALUES 
(1, 12, 5, 1, '2025-01-15', 1642248000, 1642248300, 300, 1, 0, 1, 1, 1, 1),
(1, 12, 3, 0, '2025-01-15', 1642248000, NULL, 0, 2, 0, 1, 0, 1, 1),
(2, 13, 2, 1, '2025-01-15', 1642248000, 1642248200, 200, 1, 0, 1, 1, 1, 1);
```

## Monitoring and Alerts

### Key Metrics to Monitor
- API response times
- Database query performance
- Error rates
- Cache hit rates
- Concurrent request handling

### Alerts
- Response time > 5 seconds
- Error rate > 5%
- Database connection failures
- Cache service unavailable

## Security Considerations

1. **Input Validation**
   - Validate all query parameters
   - Sanitize SQL inputs
   - Check data types and ranges

2. **Access Control**
   - Verify user permissions
   - Log all API access
   - Implement rate limiting

3. **Data Privacy**
   - Mask sensitive information
   - Follow data retention policies
   - Audit data access

---

This documentation provides a complete guide for implementing the telecaller performance API endpoints. The calculations are based on the actual database schema and business logic requirements from the frontend dashboard.
