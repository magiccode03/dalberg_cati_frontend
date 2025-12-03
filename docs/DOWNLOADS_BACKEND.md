# Downloads Management System - Backend Implementation

## Overview
The Downloads Management System allows portal administrators to configure and manage downloadable data items. Unlike traditional file storage, this system uses **API-based downloads** where each download item points to an API endpoint that generates and returns the data on-demand.

## Key Concept
- **No Physical Files**: Files are not stored; they are generated dynamically via API calls
- **API Configuration**: Each download item contains API endpoint details (URL, method, params)
- **On-Demand Generation**: Data is generated when user clicks download
- **Flexible Parameters**: Each download can have configurable parameters (e.g., date ranges)

## Database Schema

### Table: `download_items`

Stores download item configurations that point to API endpoints.

```sql
CREATE TABLE download_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT 'Display title of the download item',
    description TEXT COMMENT 'Description of what the download contains',
    api_url VARCHAR(500) NOT NULL COMMENT 'API endpoint URL (e.g., /api/capi/interview/download)',
    api_method ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL DEFAULT 'GET' COMMENT 'HTTP method for the API call',
    api_params JSON NULL COMMENT 'Optional parameters as JSON object or string (e.g., {"date":"2025-11-20"} or "date=2025-11-20")',
    type ENUM('CSV', 'EXCEL', 'ZIP', 'JSON', 'PDF', 'OTHER') NOT NULL DEFAULT 'CSV' COMMENT 'File type that will be generated',
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 0 = inactive',
    sort_order INT DEFAULT 0 COMMENT 'Display order in the list',
    created_by VARCHAR(36) COMMENT 'User ID who created the item',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_sort_order (sort_order),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table: `download_tracking` (Optional)

Tracks download events for analytics.

```sql
CREATE TABLE download_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    download_item_id INT NOT NULL,
    user_id VARCHAR(36) COMMENT 'User ID who downloaded (if authenticated)',
    user_role VARCHAR(50) COMMENT 'Role of the user',
    ip_address VARCHAR(45),
    user_agent TEXT,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (download_item_id) REFERENCES download_items(id) ON DELETE CASCADE,
    INDEX idx_download_item_id (download_item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_downloaded_at (downloaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Data Structure

### Download Item Object

```json
{
  "id": 1,
  "title": "CAPI Interview Data",
  "description": "Download CAPI interview data for a specific date",
  "api": {
    "url": "/api/capi/interview/download",
    "method": "GET",
    "params": {
      "date": "2025-11-20"
    }
  },
  "status": 1,
  "type": "CSV",
  "sortOrder": 0,
  "createdAt": "2025-12-01T10:00:00Z",
  "updatedAt": "2025-12-01T10:00:00Z"
}
```

**Alternative params format (string):**
```json
{
  "api": {
    "url": "/api/capi/interview/download",
    "method": "GET",
    "params": "date=2025-11-20&format=csv"
  }
}
```

## API Endpoints

### 1. List Download Items

**Endpoint:** `GET /api/download-items`

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)
- `search` (string, optional): Search term for title/description
- `type` (string, optional): Filter by type (CSV, EXCEL, ZIP, JSON, PDF, OTHER)
- `status` (integer, optional): Filter by status (1 = active, 0 = inactive)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "CAPI Interview Data",
      "description": "Download CAPI interview data for a specific date",
      "api": {
        "url": "/api/capi/interview/download",
        "method": "GET",
        "params": {
          "date": "2025-11-20"
        }
      },
      "status": 1,
      "type": "CSV",
      "sortOrder": 0,
      "createdAt": "2025-12-01T10:00:00Z",
      "updatedAt": "2025-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 2. Get Download Item by ID

**Endpoint:** `GET /api/download-items/:id`

**Response:**
```json
{
  "success": true,
  "data":     {
      "id": 1,
      "title": "CAPI Interview Data",
    "description": "Download CAPI interview data for a specific date",
    "api": {
      "url": "/api/capi/interview/download",
      "method": "GET",
      "params": {
        "date": "2025-11-20"
      }
    },
    "status": 1,
    "type": "CSV",
    "sortOrder": 0,
    "createdAt": "2025-12-01T10:00:00Z",
    "updatedAt": "2025-12-01T10:00:00Z"
  }
}
```

### 3. Create Download Item

**Endpoint:** `POST /api/download-items`

**Authentication:** Required (Portal Admin role)

**Request Body:**
```json
{
  "title": "CAPI Interview Data",
  "description": "Download CAPI interview data for a specific date",
  "api": {
    "url": "/api/capi/interview/download",
    "method": "GET",
    "params": {
      "date": "2025-11-20"
    }
  },
  "type": "CSV",
  "status": 1,
  "sortOrder": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Download item created successfully",
  "data":     {
      "id": 1,
      "title": "CAPI Interview Data",
    "description": "Download CAPI interview data for a specific date",
    "api": {
      "url": "/api/capi/interview/download",
      "method": "GET",
      "params": {
        "date": "2025-11-20"
      }
    },
    "status": 1,
    "type": "CSV",
    "sortOrder": 0,
    "createdAt": "2025-12-01T10:00:00Z"
  }
}
```

### 4. Update Download Item

**Endpoint:** `PUT /api/download-items/:id`

**Authentication:** Required (Portal Admin role)

**Request Body:**
```json
{
  "title": "Updated CAPI Interview Data",
  "description": "Updated description",
  "api": {
    "url": "/api/capi/interview/download",
    "method": "GET",
    "params": {
      "date": "2025-11-21"
    }
  },
  "type": "EXCEL",
  "status": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Download item updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated CAPI Interview Data",
    "description": "Updated description",
    "api": {
      "url": "/api/capi/interview/download",
      "method": "GET",
      "params": {
        "date": "2025-11-21"
      }
    },
    "type": "EXCEL",
    "status": 1,
    "updatedAt": "2025-12-01T11:00:00Z"
  }
}
```

### 5. Delete Download Item

**Endpoint:** `DELETE /api/download-items/:id`

**Authentication:** Required (Portal Admin role)

**Response:**
```json
{
  "success": true,
  "message": "Download item deleted successfully"
}
```

### 6. Track Download

**Endpoint:** `POST /api/download-items/:id/track`

**Request Body:**
```json
{
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Download tracked successfully"
}
```

## Download Flow

### Frontend Download Process

1. **User clicks Download button** on a download item
2. **Frontend reads** the item's API configuration:
   - `api.url`: `/api/capi/interview/download`
   - `api.method`: `GET`
   - `api.params`: `{"date": "2025-11-20"}`

3. **For GET requests:**
   - Build URL with query parameters: `/api/capi/interview/download?date=2025-11-20`
   - Open in new tab or trigger download via anchor tag

4. **For POST/PUT/DELETE requests:**
   - Make API call with params as request body
   - Receive blob response
   - Create download link and trigger download

5. **Track the download** (optional) via `/api/download-items/:id/track`

### Backend API Endpoints (Data Generation)

These are the actual endpoints that generate the data files. Examples:

**CAPI Interview Download:**
```
GET /api/capi/interview/download?date=2025-11-20
Response: CSV file stream
```

**CATI Survey Data:**
```
GET /api/cati/survey/download?startDate=2025-11-01&endDate=2025-11-30
Response: Excel file stream
```

**Report Generation:**
```
POST /api/reports/generate
Body: {"type": "monthly", "month": "2025-11"}
Response: PDF file stream
```

## Business Logic

### API Parameters Handling

1. **Params as JSON Object:**
   ```json
   {
     "api": {
       "params": {
         "date": "2025-11-20",
         "format": "csv"
       }
     }
   }
   ```
   - Converted to query string for GET: `?date=2025-11-20&format=csv`
   - Sent as body for POST/PUT/DELETE

2. **Params as String:**
   ```json
   {
     "api": {
       "params": "date=2025-11-20&format=csv"
     }
   }
   ```
   - Parsed and used directly

3. **No Params:**
   - API called without additional parameters
   - Uses default behavior of the endpoint

### Status Management

- **Status = 1 (Active)**: Item is visible and downloadable
- **Status = 0 (Inactive)**: Item is hidden or disabled
- Only active items are shown by default in the UI

### Type Handling

Supported types:
- **CSV**: Comma-separated values
- **EXCEL**: Excel file (.xlsx)
- **ZIP**: Compressed archive
- **JSON**: JSON data file
- **PDF**: PDF document
- **OTHER**: Other file types

The type determines:
- File extension in download
- Content-Type header
- Icon displayed in UI

## Security Considerations

1. **Authentication:**
   - Management endpoints (create/update/delete) require Portal Admin role
   - Download tracking can be optional authentication
   - Actual data download endpoints should validate user permissions

2. **API Endpoint Security:**
   - Validate user has permission to access the data
   - Sanitize parameters to prevent injection attacks
   - Rate limit download requests
   - Validate date ranges and other parameters

3. **Input Validation:**
   - Validate API URLs are relative paths (prevent external redirects)
   - Validate HTTP methods
   - Sanitize parameters
   - Validate file types

4. **Data Access Control:**
   - Each data generation API should check user permissions
   - Filter data based on user role and access level
   - Log all download attempts

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid request parameters",
  "errors": {
    "title": "Title is required",
    "api.url": "API URL is required"
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Download item not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to generate download file"
}
```

## Implementation Notes

### API URL Format

- **Relative URLs**: Recommended (e.g., `/api/capi/interview/download`)
- **Absolute URLs**: Can be used for external APIs (validate carefully)
- **Base URL**: Frontend uses `NEXT_PUBLIC_API_URL` environment variable

### Parameter Handling

1. **String Params:**
   - Format: `"key1=value1&key2=value2"`
   - Parsed by frontend into query string or body

2. **Object Params:**
   - Format: `{"key1": "value1", "key2": "value2"}`
   - Converted to query string (GET) or JSON body (POST/PUT/DELETE)

3. **Dynamic Params:**
   - Future: Allow user input for params (e.g., date picker)
   - Frontend can override default params

### File Generation APIs

Each data download API should:

1. **Accept Parameters:**
   - Query params for GET requests
   - Request body for POST/PUT/DELETE

2. **Generate Data:**
   - Query database
   - Format data (CSV, Excel, JSON, etc.)
   - Compress if needed (ZIP)

3. **Return File:**
   - Set appropriate Content-Type header
   - Set Content-Disposition header for download
   - Stream file data

**Example Implementation:**
```javascript
// GET /api/capi/interview/download
app.get('/api/capi/interview/download', async (req, res) => {
  const { date } = req.query;
  
  // Validate date
  if (!date) {
    return res.status(400).json({ success: false, message: 'Date parameter required' });
  }
  
  // Query data
  const interviews = await db.query('SELECT * FROM interviews WHERE date = ?', [date]);
  
  // Generate CSV
  const csv = convertToCSV(interviews);
  
  // Set headers
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="capi-interviews-${date}.csv"`);
  
  // Send file
  res.send(csv);
});
```

## Sample Data

```sql
INSERT INTO download_items (title, description, api_url, api_method, api_params, type, status, sort_order) VALUES
('CAPI Interview Data', 'Download CAPI interview data for a specific date', '/api/capi/interview/download', 'GET', '{"date": "2025-11-20"}', 'CSV', 1, 1),
('CATI Survey Data', 'Download CATI survey data for date range', '/api/cati/survey/download', 'GET', '{"startDate": "2025-11-01", "endDate": "2025-11-30"}', 'EXCEL', 1, 2),
('Monthly Report', 'Generate monthly report PDF', '/api/reports/monthly', 'POST', '{"month": "2025-11"}', 'PDF', 1, 3),
('All Interview Data', 'Download all interview data as ZIP', '/api/interviews/download-all', 'GET', NULL, 'ZIP', 1, 4),
('User Statistics', 'Download user statistics in JSON format', '/api/users/statistics/download', 'GET', NULL, 'JSON', 1, 5);
```

## Testing

### Unit Tests

1. Test download item creation with valid data
2. Test parameter parsing (string vs object)
3. Test status filtering
4. Test search functionality
5. Test type filtering

### Integration Tests

1. Test API endpoint calls with parameters
2. Test file generation endpoints
3. Test download tracking
4. Test error handling
5. Test authentication and authorization

## Future Enhancements

1. **Dynamic Parameters:**
   - Allow users to input parameters before download
   - Date range picker
   - Filter options

2. **Scheduled Downloads:**
   - Schedule automatic downloads
   - Email delivery

3. **Download History:**
   - Track user download history
   - Re-download previous files

4. **File Caching:**
   - Cache generated files for frequently accessed downloads
   - Reduce database load

5. **Bulk Downloads:**
   - Select multiple items
   - Download as ZIP archive
