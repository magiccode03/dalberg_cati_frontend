# Download Items Management API - Complete Documentation

## Overview
This document provides comprehensive API documentation for the Download Items Management System. All endpoints require authentication via Bearer token.

**Base URL**: `http://localhost:4001/api/download-items`

**Authentication**: All endpoints require `Authorization: Bearer <token>` header

---

## Table of Contents
1. [List Download Items](#1-list-download-items)
2. [Get Download Item by ID](#2-get-download-item-by-id)
3. [Create Download Item](#3-create-download-item)
4. [Update Download Item](#4-update-download-item)
5. [Delete Download Item](#5-delete-download-item)
6. [Track Download](#6-track-download)
7. [Error Handling](#error-handling)
8. [Data Models](#data-models)

---

## 1. List Download Items

**GET** `/api/download-items`

Retrieve a paginated list of download items with optional filters.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 20 | Number of items per page (max: 100) |
| `search` | string | No | - | Search term for title/description |
| `type` | string | No | - | Filter by file type (CSV, EXCEL, ZIP, JSON, PDF, OTHER) |
| `status` | integer | No | - | Filter by status (0 = inactive, 1 = active) |

### Request Example

```bash
curl -X GET "http://localhost:4001/api/download-items?page=1&limit=20&search=CAPI&type=CSV&status=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

### Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "Download items retrieved successfully",
  "data": {
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
        "type": "CSV",
        "status": 1,
        "sortOrder": 1,
        "createdAt": "2025-12-01T10:00:00.000Z",
        "updatedAt": "2025-12-01T10:00:00.000Z"
      },
      {
        "id": 2,
        "title": "CATI Survey Data",
        "description": "Download CATI survey data for date range",
        "api": {
          "url": "/api/cati/survey/download",
          "method": "GET",
          "params": {
            "startDate": "2025-11-01",
            "endDate": "2025-11-30"
          }
        },
        "type": "EXCEL",
        "status": 1,
        "sortOrder": 2,
        "createdAt": "2025-12-01T11:00:00.000Z",
        "updatedAt": "2025-12-01T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if request was successful |
| `message` | string | Success message |
| `data.data` | array | Array of download items |
| `data.pagination` | object | Pagination metadata |
| `data.pagination.page` | integer | Current page number |
| `data.pagination.limit` | integer | Items per page |
| `data.pagination.total` | integer | Total number of items |
| `data.pagination.totalPages` | integer | Total number of pages |
| `timestamp` | string (ISO 8601) | Response timestamp |

---

## 2. Get Download Item by ID

**GET** `/api/download-items/:id`

Retrieve a single download item by its ID.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Download item ID |

### Request Example

```bash
curl -X GET "http://localhost:4001/api/download-items/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

### Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "Download item retrieved successfully",
  "data": {
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
    "type": "CSV",
    "status": 1,
    "sortOrder": 1,
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z"
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### Error Response

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "message": "Download item not found",
  "error": "Download item not found",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

---

## 3. Create Download Item

**POST** `/api/download-items`

Create a new download item. Requires authentication (Portal Admin role recommended).

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Display title of the download item |
| `description` | string | No | Description of what the download contains |
| `api` | object | Yes | API configuration object |
| `api.url` | string | Yes | API endpoint URL (relative or absolute) |
| `api.method` | string | Yes | HTTP method (GET, POST, PUT, DELETE) |
| `api.params` | object/string | No | Optional parameters as JSON object or query string |
| `type` | string | Yes | File type (CSV, EXCEL, ZIP, JSON, PDF, OTHER) |
| `status` | integer | No | Status (0 = inactive, 1 = active, default: 1) |
| `sortOrder` | integer | No | Display order (default: 0) |

### Request Example

```bash
curl -X POST "http://localhost:4001/api/download-items" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
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
    "sortOrder": 1
  }'
```

### Alternative Request (Params as String)

```bash
curl -X POST "http://localhost:4001/api/download-items" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "CAPI Interview Data",
    "description": "Download CAPI interview data",
    "api": {
      "url": "/api/capi/interview/download",
      "method": "GET",
      "params": "date=2025-11-20&format=csv"
    },
    "type": "CSV",
    "status": 1,
    "sortOrder": 1
  }'
```

### Response

**Status Code**: `201 Created`

```json
{
  "success": true,
  "message": "Download item created successfully",
  "data": {
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
    "type": "CSV",
    "status": 1,
    "sortOrder": 1,
    "createdAt": "2025-12-02T12:00:00.000Z",
    "updatedAt": "2025-12-02T12:00:00.000Z"
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### Error Response

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid request data",
  "error": {
    "title": "Title is required",
    "api.url": "API URL is required",
    "type": "Type must be one of: CSV, EXCEL, ZIP, JSON, PDF, OTHER"
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

---

## 4. Update Download Item

**PUT** `/api/download-items/:id`

Update an existing download item. Requires authentication (Portal Admin role recommended).

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Download item ID |

### Request Body

All fields are optional. Only include fields you want to update.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Display title of the download item |
| `description` | string | No | Description of what the download contains |
| `api` | object | No | API configuration object |
| `api.url` | string | No | API endpoint URL |
| `api.method` | string | No | HTTP method (GET, POST, PUT, DELETE) |
| `api.params` | object/string | No | Optional parameters |
| `type` | string | No | File type (CSV, EXCEL, ZIP, JSON, PDF, OTHER) |
| `status` | integer | No | Status (0 = inactive, 1 = active) |
| `sortOrder` | integer | No | Display order |

### Request Example

```bash
curl -X PUT "http://localhost:4001/api/download-items/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
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
    "sortOrder": 2
  }'
```

### Partial Update Example

```bash
curl -X PUT "http://localhost:4001/api/download-items/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "status": 0
  }'
```

### Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "Download item updated successfully",
  "data": {
    "id": 1,
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
    "sortOrder": 2,
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-02T12:00:00.000Z"
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### Error Response

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "message": "Download item not found",
  "error": "Download item not found",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

---

## 5. Delete Download Item

**DELETE** `/api/download-items/:id`

Delete a download item. Requires authentication (Portal Admin role recommended).

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Download item ID |

### Request Example

```bash
curl -X DELETE "http://localhost:4001/api/download-items/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

### Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "Download item deleted successfully",
  "data": null,
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### Error Response

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "message": "Download item not found",
  "error": "Download item not found",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

---

## 6. Track Download

**POST** `/api/download-items/:id/track`

Track a download event for analytics purposes. This endpoint records when a user downloads a file.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Download item ID |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ipAddress` | string | No | IP address of the downloader (auto-detected if not provided) |
| `userAgent` | string | No | User agent string (auto-detected if not provided) |

### Request Example

```bash
curl -X POST "http://localhost:4001/api/download-items/1/track" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  }'
```

### Minimal Request (Auto-detect IP and User Agent)

```bash
curl -X POST "http://localhost:4001/api/download-items/1/track" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{}'
```

### Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "Download tracked successfully",
  "data": {
    "id": 1,
    "downloadItemId": 1,
    "userId": "123",
    "userRole": "admin",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "downloadedAt": "2025-12-02T12:00:00.000Z"
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Tracking record ID |
| `downloadItemId` | integer | ID of the downloaded item |
| `userId` | string/null | User ID who downloaded (if authenticated) |
| `userRole` | string/null | Role of the user |
| `ipAddress` | string/null | IP address of the downloader |
| `userAgent` | string/null | User agent string |
| `downloadedAt` | string (ISO 8601) | Download timestamp |

### Error Response

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "message": "Download item not found",
  "error": "Download item not found",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

---

## Error Handling

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

### HTTP Status Codes

| Status Code | Description | Common Scenarios |
|-------------|-------------|------------------|
| `200` | OK | Successful GET, PUT, DELETE requests |
| `201` | Created | Successful POST request (create) |
| `400` | Bad Request | Invalid request parameters, validation errors |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `500` | Internal Server Error | Server-side error |

### Common Error Scenarios

#### 1. Missing Authentication Token

**Status Code**: `401 Unauthorized`

```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

#### 2. Invalid Request Data

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid request data",
  "error": {
    "title": "Title is required",
    "api.url": "API URL is required",
    "api.method": "Method must be one of: GET, POST, PUT, DELETE",
    "type": "Type must be one of: CSV, EXCEL, ZIP, JSON, PDF, OTHER"
  },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

#### 3. Invalid API URL

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid API URL format",
  "error": "Invalid API URL protocol. Only http and https are allowed",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

#### 4. Resource Not Found

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "message": "Download item not found",
  "error": "Download item not found",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

---

## Data Models

### Download Item Object

```typescript
{
  id: number;
  title: string;
  description: string | null;
  api: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    params?: Record<string, any> | string | null;
  };
  type: "CSV" | "EXCEL" | "ZIP" | "JSON" | "PDF" | "OTHER";
  status: number; // 0 = inactive, 1 = active
  sortOrder: number;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

### API Configuration Object

```typescript
{
  url: string; // Relative URL (e.g., "/api/capi/interview/download") or absolute URL
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, any> | string | null; // JSON object or query string
}
```

### Pagination Object

```typescript
{
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### Download Tracking Object

```typescript
{
  id: number;
  downloadItemId: number;
  userId?: string | null;
  userRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  downloadedAt: string; // ISO 8601 timestamp
}
```

---

## Usage Examples

### Complete Workflow Example

#### 1. List all active CSV download items

```bash
curl -X GET "http://localhost:4001/api/download-items?type=CSV&status=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

#### 2. Create a new download item

```bash
curl -X POST "http://localhost:4001/api/download-items" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Report",
    "description": "Generate monthly report in PDF format",
    "api": {
      "url": "/api/reports/monthly",
      "method": "POST",
      "params": {
        "month": "2025-11"
      }
    },
    "type": "PDF",
    "status": 1,
    "sortOrder": 3
  }'
```

#### 3. Update download item status

```bash
curl -X PUT "http://localhost:4001/api/download-items/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 0
  }'
```

#### 4. Track a download event

```bash
curl -X POST "http://localhost:4001/api/download-items/1/track" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### 5. Delete a download item

```bash
curl -X DELETE "http://localhost:4001/api/download-items/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Frontend Integration Guide

### 1. Fetching Download Items List

```javascript
const fetchDownloadItems = async (filters = {}) => {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.search && { search: filters.search }),
    ...(filters.type && { type: filters.type }),
    ...(filters.status !== undefined && { status: filters.status })
  });

  const response = await fetch(
    `${API_BASE_URL}/api/download-items?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  );

  return await response.json();
};
```

### 2. Creating a Download Item

```javascript
const createDownloadItem = async (itemData) => {
  const response = await fetch(`${API_BASE_URL}/api/download-items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(itemData)
  });

  return await response.json();
};
```

### 3. Triggering a Download

```javascript
const triggerDownload = async (downloadItem) => {
  // Build URL based on API configuration
  let downloadUrl = downloadItem.api.url;
  
  // For GET requests, append params as query string
  if (downloadItem.api.method === 'GET' && downloadItem.api.params) {
    const params = new URLSearchParams(
      typeof downloadItem.api.params === 'string' 
        ? new URLSearchParams(downloadItem.api.params)
        : downloadItem.api.params
    );
    downloadUrl += `?${params.toString()}`;
  }

  // Track the download
  await fetch(`${API_BASE_URL}/api/download-items/${downloadItem.id}/track`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  // Open download URL
  window.open(`${API_BASE_URL}${downloadUrl}`, '_blank');
};
```

### 4. Updating a Download Item

```javascript
const updateDownloadItem = async (id, updateData) => {
  const response = await fetch(`${API_BASE_URL}/api/download-items/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  return await response.json();
};
```

### 5. Deleting a Download Item

```javascript
const deleteDownloadItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/download-items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  return await response.json();
};
```

---

## Notes

1. **Authentication**: All endpoints require a valid Bearer token in the Authorization header.

2. **API URL Format**: 
   - Relative URLs (starting with `/`) are recommended (e.g., `/api/capi/interview/download`)
   - Absolute URLs are also supported but must use `http://` or `https://` protocol

3. **Parameters Format**:
   - Can be provided as JSON object: `{"date": "2025-11-20"}`
   - Or as query string: `"date=2025-11-20&format=csv"`

4. **File Types**: Supported types are: `CSV`, `EXCEL`, `ZIP`, `JSON`, `PDF`, `OTHER`

5. **Status Values**: 
   - `0` = Inactive (hidden from users)
   - `1` = Active (visible to users)

6. **Sort Order**: Lower numbers appear first in the list. Default is `0`.

7. **Download Tracking**: The track endpoint automatically captures IP address and user agent from the request if not provided in the body.

---

## Support

For issues or questions, please refer to the main project documentation or contact the development team.

