# Super Admin API Documentation

## Overview
This document provides comprehensive API documentation for Super Admin role functionality in the ConvergentView Portal Backend. Super Admins have full system access and can manage users, roles, permissions, features, and pages.

## Authentication
All API endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Base URL
```
http://localhost:4001
```

---

## 🔐 Authentication APIs

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT tokens

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "uniqueId": "SUPER001",
  "password": "SuperAdmin123!"
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "uniqueId": "SUPER001",
      "email": "superadmin@convergentview.com",
      "firstName": "Super",
      "lastName": "Admin",
      "portalSlug": "super-admin",
      "role": {
        "id": 1,
        "name": "super_admin",
        "displayName": "Super Admin",
        "level": 3
      },
      "isActive": true,
      "lastLoginAt": "2025-09-24T08:12:57.000Z",
      "createdAt": "2025-09-24T08:08:42.000Z",
      "updatedAt": "2025-09-24T08:12:57.000Z"
    }
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:16:11.836Z"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "statusCode": 401
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

### 2. Get Current User
**Endpoint:** `GET /api/auth/me`

**Description:** Get current authenticated user information

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/auth/me' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uniqueId": "SUPER001",
    "email": "superadmin@convergentview.com",
    "firstName": "Super",
    "lastName": "Admin",
    "portalSlug": "super-admin",
    "role": {
      "id": 1,
      "name": "super_admin",
      "displayName": "Super Admin",
      "level": 3
    },
    "isActive": true,
    "lastLoginAt": "2025-09-24T08:12:57.000Z",
    "createdAt": "2025-09-24T08:08:42.000Z",
    "updatedAt": "2025-09-24T08:12:57.000Z"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:16:11.836Z"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "statusCode": 401
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

### 3. Register New User
**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account (Super Admin only)

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "uniqueId": "USER002",
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "roleId": 2,
  "portalSlug": "jane-smith"
}'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 3,
      "uniqueId": "USER002",
      "email": "newuser@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "portalSlug": "jane-smith",
      "role": {
        "id": 2,
        "name": "admin",
        "displayName": "Administrator",
        "level": 2
      },
      "isActive": true,
      "createdAt": "2025-09-24T08:30:00.000Z",
      "updatedAt": "2025-09-24T08:30:00.000Z"
    }
  },
  "message": "User registered successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": {
    "message": "User with this unique ID or email already exists",
    "statusCode": 409
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "error": {
    "message": "Super Admin role required",
    "statusCode": 403
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

### 4. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Description:** Get new access token using refresh token

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/refresh' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "uniqueId": "SUPER001",
      "email": "superadmin@convergentview.com",
      "firstName": "Super",
      "lastName": "Admin",
      "role": {
        "id": 1,
        "name": "super_admin",
        "displayName": "Super Admin",
        "level": 3
      }
    }
  },
  "message": "Token refreshed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 5. Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate tokens

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/logout' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 👥 User Management APIs

### 1. List All Users
**Endpoint:** `GET /api/users`

**Description:** Get list of all users with pagination

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/users?page=1&limit=10&search=&sortBy=created_at&sortOrder=desc' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "uniqueId": "SUPER001",
        "email": "superadmin@convergentview.com",
        "firstName": "Super",
        "lastName": "Admin",
        "portalSlug": "super-admin",
        "role": {
          "id": 1,
          "name": "super_admin",
          "displayName": "Super Admin",
          "level": 3
        },
        "isActive": true,
        "lastLoginAt": "2025-09-24T08:12:57.000Z",
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:12:57.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "message": "Users retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. Get User by ID
**Endpoint:** `GET /api/users/:id`

**Description:** Get specific user by ID

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/users/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uniqueId": "SUPER001",
    "email": "superadmin@convergentview.com",
    "firstName": "Super",
    "lastName": "Admin",
    "portalSlug": "super-admin",
    "role": {
      "id": 1,
      "name": "super_admin",
      "displayName": "Super Admin",
      "level": 3
    },
    "isActive": true,
    "lastLoginAt": "2025-09-24T08:12:57.000Z",
    "createdAt": "2025-09-24T08:08:42.000Z",
    "updatedAt": "2025-09-24T08:12:57.000Z"
  },
  "message": "User retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "statusCode": 404
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 3. Update User
**Endpoint:** `PUT /api/users/:id`

**Description:** Update user information

**Request:**
```bash
curl -X 'PUT' \
  'http://localhost:4001/api/users/2' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "email": "john.updated@example.com",
  "isActive": true,
  "roleId": 2
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "uniqueId": "USER001",
    "email": "john.updated@example.com",
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "portalSlug": "john-doe",
    "role": {
      "id": 2,
      "name": "admin",
      "displayName": "Administrator",
      "level": 2
    },
    "isActive": true,
    "lastLoginAt": "2025-09-24T08:24:51.000Z",
    "createdAt": "2025-09-24T08:24:51.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "User updated successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 4. Delete User
**Endpoint:** `DELETE /api/users/:id`

**Description:** Delete user account

**Request:**
```bash
curl -X 'DELETE' \
  'http://localhost:4001/api/users/3' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "Cannot delete Super Admin user",
    "statusCode": 400
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 🛡️ Role Management APIs

### 1. List All Roles
**Endpoint:** `GET /api/roles`

**Description:** Get list of all roles

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/roles' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": 1,
        "name": "super_admin",
        "displayName": "Super Admin",
        "description": "Full system access with all permissions",
        "level": 3,
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      },
      {
        "id": 2,
        "name": "admin",
        "displayName": "Administrator",
        "description": "Administrative access with most permissions",
        "level": 2,
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      },
      {
        "id": 3,
        "name": "pmt",
        "displayName": "Project Management Team",
        "description": "Project management and survey access",
        "level": 1,
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      }
    ]
  },
  "message": "Roles retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. Create New Role
**Endpoint:** `POST /api/roles`

**Description:** Create a new role

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/roles' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "name": "moderator",
  "displayName": "Moderator",
  "description": "Content moderation and user support",
  "level": 1,
  "isActive": true
}'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "moderator",
    "displayName": "Moderator",
    "description": "Content moderation and user support",
    "level": 1,
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "Role created successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": {
    "message": "Role with this name already exists",
    "statusCode": 409
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 3. Update Role
**Endpoint:** `PUT /api/roles/:id`

**Description:** Update role information

**Request:**
```bash
curl -X 'PUT' \
  'http://localhost:4001/api/roles/4' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "displayName": "Senior Moderator",
  "description": "Senior content moderation and user support",
  "level": 2,
  "isActive": true
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "moderator",
    "displayName": "Senior Moderator",
    "description": "Senior content moderation and user support",
    "level": 2,
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "Role updated successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 4. Delete Role
**Endpoint:** `DELETE /api/roles/:id`

**Description:** Delete a role

**Request:**
```bash
curl -X 'DELETE' \
  'http://localhost:4001/api/roles/4' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Role deleted successfully"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "Cannot delete role that is assigned to users",
    "statusCode": 400
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## ⚙️ Feature Management APIs

### 1. List All Features
**Endpoint:** `GET /api/features`

**Description:** Get list of all system features

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/features' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "features": [
      {
        "id": 1,
        "name": "user_view",
        "displayName": "View Users",
        "category": "user_management",
        "module": "frontend",
        "description": "View user accounts and profiles",
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      },
      {
        "id": 2,
        "name": "user_create",
        "displayName": "Create Users",
        "category": "user_management",
        "module": "frontend",
        "description": "Create new user accounts",
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      }
    ]
  },
  "message": "Features retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. Create New Feature
**Endpoint:** `POST /api/features`

**Description:** Create a new system feature

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/features' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "name": "analytics_view",
  "displayName": "View Analytics",
  "category": "analytics",
  "module": "frontend",
  "description": "View analytics and reports",
  "isActive": true
}'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "analytics_view",
    "displayName": "View Analytics",
    "category": "analytics",
    "module": "frontend",
    "description": "View analytics and reports",
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "Feature created successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 3. Update Feature
**Endpoint:** `PUT /api/features/:id`

**Description:** Update feature information

**Request:**
```bash
curl -X 'PUT' \
  'http://localhost:4001/api/features/9' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "displayName": "Advanced Analytics View",
  "description": "View advanced analytics and detailed reports",
  "isActive": true
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "analytics_view",
    "displayName": "Advanced Analytics View",
    "category": "analytics",
    "module": "frontend",
    "description": "View advanced analytics and detailed reports",
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "Feature updated successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 4. Delete Feature
**Endpoint:** `DELETE /api/features/:id`

**Description:** Delete a feature

**Request:**
```bash
curl -X 'DELETE' \
  'http://localhost:4001/api/features/9' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Feature deleted successfully"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 📄 Page Management APIs

### 1. List All Pages
**Endpoint:** `GET /api/pages`

**Description:** Get list of all frontend pages

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/pages' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "pages": [
      {
        "id": 1,
        "name": "dashboard",
        "displayName": "Dashboard",
        "route": "/dashboard",
        "description": "Main dashboard page",
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      },
      {
        "id": 2,
        "name": "users",
        "displayName": "User Management",
        "route": "/users",
        "description": "User management page",
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      }
    ]
  },
  "message": "Pages retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. Create New Page
**Endpoint:** `POST /api/pages`

**Description:** Create a new frontend page

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/pages' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "name": "settings",
  "displayName": "Settings",
  "route": "/settings",
  "description": "Application settings page",
  "isActive": true
}'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "settings",
    "displayName": "Settings",
    "route": "/settings",
    "description": "Application settings page",
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "Page created successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 3. Update Page
**Endpoint:** `PUT /api/pages/:id`

**Description:** Update page information

**Request:**
```bash
curl -X 'PUT' \
  'http://localhost:4001/api/pages/5' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "displayName": "System Settings",
  "description": "System configuration and settings page",
  "isActive": true
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "settings",
    "displayName": "System Settings",
    "route": "/settings",
    "description": "System configuration and settings page",
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "Page updated successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 4. Delete Page
**Endpoint:** `DELETE /api/pages/:id`

**Description:** Delete a page

**Request:**
```bash
curl -X 'DELETE' \
  'http://localhost:4001/api/pages/5' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Page deleted successfully"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 🔗 API Endpoint Management APIs

### 1. List All API Endpoints
**Endpoint:** `GET /api/api-endpoints`

**Description:** Get list of all API endpoints

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/api-endpoints' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "endpoints": [
      {
        "id": 1,
        "name": "user_list",
        "method": "GET",
        "route": "/api/users",
        "description": "List all users",
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      },
      {
        "id": 2,
        "name": "user_create",
        "method": "POST",
        "route": "/api/users",
        "description": "Create new user",
        "isActive": true,
        "createdAt": "2025-09-24T08:08:42.000Z",
        "updatedAt": "2025-09-24T08:08:42.000Z"
      }
    ]
  },
  "message": "API endpoints retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. Create New API Endpoint
**Endpoint:** `POST /api/api-endpoints`

**Description:** Create a new API endpoint definition

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/api-endpoints' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "name": "user_export",
  "method": "GET",
  "route": "/api/users/export",
  "description": "Export users data",
  "isActive": true
}'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "user_export",
    "method": "GET",
    "route": "/api/users/export",
    "description": "Export users data",
    "isActive": true,
    "createdAt": "2025-09-24T08:30:00.000Z",
    "updatedAt": "2025-09-24T08:30:00.000Z"
  },
  "message": "API endpoint created successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 🛡️ Permission Management APIs

### 1. Get Role Permissions
**Endpoint:** `GET /api/roles/:id/permissions`

**Description:** Get all permissions for a specific role

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/roles/2/permissions' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "role": {
      "id": 2,
      "name": "admin",
      "displayName": "Administrator"
    },
    "featurePermissions": [
      {
        "id": 1,
        "featureId": 1,
        "featureName": "user_view",
        "featureDisplayName": "View Users",
        "canView": true,
        "canCreate": true,
        "canUpdate": true,
        "canDelete": false,
        "canExport": true
      }
    ],
    "pagePermissions": [
      {
        "id": 1,
        "pageId": 1,
        "pageName": "dashboard",
        "pageDisplayName": "Dashboard",
        "canView": true
      }
    ],
    "apiPermissions": [
      {
        "id": 1,
        "apiEndpointId": 1,
        "apiEndpointName": "user_list",
        "apiEndpointMethod": "GET",
        "apiEndpointRoute": "/api/users",
        "canAccess": true
      }
    ]
  },
  "message": "Role permissions retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. Update Role Permissions
**Endpoint:** `PUT /api/roles/:id/permissions`

**Description:** Update permissions for a specific role

**Request:**
```bash
curl -X 'PUT' \
  'http://localhost:4001/api/roles/2/permissions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
  "featurePermissions": [
    {
      "featureId": 1,
      "canView": true,
      "canCreate": true,
      "canUpdate": true,
      "canDelete": true,
      "canExport": true
    }
  ],
  "pagePermissions": [
    {
      "pageId": 1,
      "canView": true
    }
  ],
  "apiPermissions": [
    {
      "apiEndpointId": 1,
      "canAccess": true
    }
  ]
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Role permissions updated successfully"
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 🏥 System Health APIs

### 1. Health Check
**Endpoint:** `GET /health`

**Description:** Check system health and database connections

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/health' \
  -H 'accept: application/json'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-09-24T08:30:00.000Z",
    "databases": {
      "mysql": true,
      "analytics": true,
      "overall": true
    },
    "uptime": 3600.5,
    "version": "1.0.0",
    "environment": "development",
    "memory": {
      "used": 28,
      "total": 30,
      "external": 6
    },
    "cpu": {
      "loadAverage": "0 0 0",
      "uptime": 333159
    }
  },
  "message": "System is healthy",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 2. System Information
**Endpoint:** `GET /api/system/info`

**Description:** Get detailed system information (requires authentication)

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/system/info' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "system": {
      "version": "1.0.0",
      "environment": "development",
      "uptime": 3600.5,
      "nodeVersion": "v22.17.0",
      "platform": "win32",
      "arch": "x64"
    },
    "database": {
      "mysql": {
        "connected": true,
        "version": "8.0.0"
      },
      "analytics": {
        "connected": true,
        "version": "8.0.0"
      }
    },
    "features": {
      "totalFeatures": 8,
      "activeFeatures": 8
    },
    "users": {
      "totalUsers": 2,
      "activeUsers": 2
    },
    "roles": {
      "totalRoles": 3,
      "activeRoles": 3
    }
  },
  "message": "System information retrieved successfully",
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 📊 Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Invalid input data",
    "statusCode": 400,
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "statusCode": 401
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions",
    "statusCode": 403
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Resource not found",
    "statusCode": 404
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "message": "Resource already exists",
    "statusCode": 409
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "statusCode": 500
  },
  "timestamp": "2025-09-24T08:30:00.000Z"
}
```

---

## 🔑 Super Admin Credentials

**Default Super Admin Account:**
- **Unique ID:** `SUPER001`
- **Password:** `SuperAdmin123!`
- **Email:** `superadmin@convergentview.com`

**⚠️ Security Note:** Change the Super Admin password after first login!

---

## 📝 Notes for Frontend Development

1. **Authentication Flow:**
   - Login to get JWT token
   - Store token securely (localStorage/sessionStorage)
   - Include token in Authorization header for all protected requests
   - Handle token expiration and refresh

2. **Error Handling:**
   - Always check the `success` field in responses
   - Handle different HTTP status codes appropriately
   - Display user-friendly error messages

3. **Pagination:**
   - Use `page` and `limit` query parameters for list endpoints
   - Handle pagination metadata in responses

4. **Real-time Updates:**
   - Consider implementing WebSocket connections for real-time updates
   - Use polling for critical data that needs frequent updates

5. **Security:**
   - Never expose sensitive data in frontend logs
   - Implement proper input validation
   - Use HTTPS in production

---

## 🚀 Getting Started

1. **Start the server:** `npm run dev`
2. **Access Swagger UI:** http://localhost:4001/api-docs
3. **Login with Super Admin credentials**
4. **Copy the JWT token from login response**
5. **Use the token in Authorization header for all API calls**

This documentation provides all the necessary information for frontend developers to integrate with the Super Admin APIs effectively.
