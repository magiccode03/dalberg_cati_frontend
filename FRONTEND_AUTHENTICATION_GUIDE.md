# Frontend Authentication Implementation Guide

## Overview
This guide provides comprehensive documentation for implementing authentication in the frontend application for the ConvergentView Portal Backend. It covers all authentication-related APIs, security best practices, and implementation examples.

## Base URL
```
http://localhost:4001
```

---

## 🔐 Authentication Flow Overview

### 1. Login Process
```
User Input → Login API → JWT Tokens → Store Tokens → Redirect to Dashboard
```

### 2. Token Management
```
Access Token (15 minutes) + Refresh Token (7 days) → Automatic Refresh → Logout on Expiry
```

### 3. Protected Route Access
```
Request → Check Token → Validate Token → API Call → Handle Response
```

---

## 📡 Authentication APIs

### 1. User Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user with unique ID and password, receive JWT tokens

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzM1MDI0OTc3LCJleHAiOjE3MzUwMjU4Nzd9.example_signature",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwiaWF0IjoxNzM1MDI0OTc3LCJleHAiOjE3MzUwODU0Nzd9.example_signature",
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

**Error Response - Invalid Credentials (401):**
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

**Error Response - Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "uniqueId",
        "message": "Unique ID is required"
      },
      {
        "field": "password",
        "message": "Password is required"
      }
    ]
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

**Error Response - User Inactive (403):**
```json
{
  "success": false,
  "error": {
    "message": "Account is deactivated",
    "statusCode": 403
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

### 2. Get Current User Profile
**Endpoint:** `GET /api/auth/me`

**Description:** Get current authenticated user's profile information

**Request:**
```bash
curl -X 'GET' \
  'http://localhost:4001/api/auth/me' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzM1MDI0OTc3LCJleHAiOjE3MzUwMjU4Nzd9.example_signature'
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

**Error Response - Unauthorized (401):**
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

**Error Response - Invalid Token (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token",
    "statusCode": 401
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

### 3. Refresh Access Token
**Endpoint:** `POST /api/auth/refresh`

**Description:** Get new access token using refresh token

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/refresh' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwiaWF0IjoxNzM1MDI0OTc3LCJleHAiOjE3MzUwODU0Nzd9.example_signature"
}'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzM1MDI1MDAwLCJleHAiOjE3MzUwMjU5MDB9.new_signature",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwiaWF0IjoxNzM1MDI1MDAwLCJleHAiOjE3MzUwODU1MDB9.new_signature",
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

**Error Response - Invalid Refresh Token (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired refresh token",
    "statusCode": 401
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

**Error Response - Missing Refresh Token (400):**
```json
{
  "success": false,
  "error": {
    "message": "Refresh token is required",
    "statusCode": 400
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

### 4. User Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate tokens

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/logout' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzM1MDI0OTc3LCJleHAiOjE3MzUwMjU4Nzd9.example_signature'
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

**Error Response - Unauthorized (401):**
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

### 5. Register New User (Super Admin Only)
**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account (Super Admin only)

**Request:**
```bash
curl -X 'POST' \
  'http://localhost:4001/api/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVuaXF1ZUlkIjoiU1VQRVIwMDEiLCJlbWFpbCI6InN1cGVyYWRtaW5AY29udmVyZ2VudHZpZXcuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzM1MDI0OTc3LCJleHAiOjE3MzUwMjU4Nzd9.example_signature' \
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVuaXF1ZUlkIjoiVVNFUjAwMiIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNTAyNTAwMCwiZXhwIjoxNzM1MDI1OTAwfQ.example_signature",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVuaXF1ZUlkIjoiVVNFUjAwMiIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTczNTAyNTAwMCwiZXhwIjoxNzM1MDg1NTAwfQ.example_signature",
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

**Error Response - User Already Exists (409):**
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

**Error Response - Forbidden (403):**
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

**Error Response - Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "uniqueId",
        "message": "Unique ID must be alphanumeric"
      },
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

---

## 🛡️ Security Implementation

### 1. Token Storage Best Practices

#### Secure Storage (Recommended)
```javascript
// Use httpOnly cookies for production
// Store tokens in secure, httpOnly cookies
document.cookie = `accessToken=${token}; secure; httpOnly; sameSite=strict`;
document.cookie = `refreshToken=${refreshToken}; secure; httpOnly; sameSite=strict`;
```

#### Local Storage (Development Only)
```javascript
// ⚠️ NOT RECOMMENDED FOR PRODUCTION
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

#### Session Storage (Alternative)
```javascript
// Better than localStorage but still not ideal for production
sessionStorage.setItem('accessToken', token);
sessionStorage.setItem('refreshToken', refreshToken);
sessionStorage.setItem('user', JSON.stringify(user));
```

### 2. Token Validation

#### Check Token Expiry
```javascript
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // Invalid token
  }
}
```

#### Automatic Token Refresh
```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    // Redirect to login
    window.location.href = '/login';
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('accessToken', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.token;
    } else {
      // Refresh failed, redirect to login
      localStorage.clear();
      window.location.href = '/login';
      return null;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.clear();
    window.location.href = '/login';
    return null;
  }
}
```

---

## 🚀 Frontend Implementation Examples

### 1. React Authentication Hook

```javascript
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        // Try to refresh token
        refreshAccessToken().then((newToken) => {
          if (newToken) {
            setToken(newToken);
            setUser(JSON.parse(storedUser));
          }
          setLoading(false);
        });
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (uniqueId, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueId, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { token, refreshToken, user } = data.data;
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        
        return { success: true, user };
      } else {
        return { success: false, error: data.error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, user: data.data.user };
      } else {
        return { success: false, error: data.error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. API Client with Automatic Token Refresh

```javascript
class ApiClient {
  constructor() {
    this.baseURL = 'http://localhost:4001';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401 && token) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry request with new token
          config.headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(url, config);
        } else {
          // Redirect to login
          window.location.href = '/login';
          return;
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

### 3. Protected Route Component

```javascript
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role?.name !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### 4. Login Component

```javascript
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    uniqueId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.uniqueId, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="uniqueId">Unique ID:</label>
        <input
          type="text"
          id="uniqueId"
          name="uniqueId"
          value={formData.uniqueId}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## 🔧 Error Handling

### 1. Common Error Scenarios

#### Network Errors
```javascript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uniqueId, password }),
  });
} catch (error) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    // Network error
    setError('Unable to connect to server. Please check your internet connection.');
  }
}
```

#### Token Expiration
```javascript
if (response.status === 401) {
  const data = await response.json();
  if (data.error?.message === 'Invalid or expired token') {
    // Try to refresh token
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Redirect to login
      navigate('/login');
    }
  }
}
```

#### Validation Errors
```javascript
if (response.status === 400) {
  const data = await response.json();
  if (data.error?.details) {
    // Handle field-specific validation errors
    data.error.details.forEach(detail => {
      setFieldError(detail.field, detail.message);
    });
  }
}
```

### 2. Global Error Handler

```javascript
// Axios interceptor example
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 📱 Mobile App Considerations

### 1. Secure Storage for Mobile

#### React Native
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureValue, setSecureValue } from 'react-native-keychain';

// Store tokens securely
await setSecureValue('accessToken', token);
await setSecureValue('refreshToken', refreshToken);

// Retrieve tokens
const token = await getSecureValue('accessToken');
```

#### Flutter
```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

// Store tokens
await storage.write(key: 'accessToken', value: token);
await storage.write(key: 'refreshToken', value: refreshToken);

// Retrieve tokens
String? token = await storage.read(key: 'accessToken');
```

### 2. Biometric Authentication

```javascript
// React Native biometric authentication
import TouchID from 'react-native-touch-id';

const authenticateWithBiometrics = async () => {
  try {
    const biometryType = await TouchID.isSupported();
    
    if (biometryType) {
      const result = await TouchID.authenticate('Authenticate to login');
      if (result) {
        // Use stored credentials to login
        const storedCredentials = await getStoredCredentials();
        return await login(storedCredentials.uniqueId, storedCredentials.password);
      }
    }
  } catch (error) {
    console.error('Biometric authentication failed:', error);
  }
};
```

---

## 🧪 Testing Authentication

### 1. Unit Tests

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { AuthProvider } from './AuthContext';

const renderWithAuth = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

test('should login successfully with valid credentials', async () => {
  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: { id: 1, uniqueId: 'TEST001' }
        }
      }),
    })
  );

  renderWithAuth(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/unique id/i), {
    target: { value: 'TEST001' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uniqueId: 'TEST001',
        password: 'password123'
      })
    });
  });
});
```

### 2. Integration Tests

```javascript
test('should handle login failure', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
        success: false,
        error: { message: 'Invalid credentials' }
      }),
    })
  );

  renderWithAuth(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/unique id/i), {
    target: { value: 'INVALID' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrongpassword' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
```

---

## 🔒 Security Checklist

### ✅ Authentication Security
- [ ] Use HTTPS in production
- [ ] Implement secure token storage
- [ ] Set appropriate token expiration times
- [ ] Implement automatic token refresh
- [ ] Handle token expiration gracefully
- [ ] Clear tokens on logout
- [ ] Implement proper error handling
- [ ] Validate all user inputs
- [ ] Use CSRF protection
- [ ] Implement rate limiting

### ✅ Frontend Security
- [ ] Sanitize user inputs
- [ ] Implement XSS protection
- [ ] Use Content Security Policy (CSP)
- [ ] Implement proper session management
- [ ] Handle sensitive data carefully
- [ ] Use secure communication channels
- [ ] Implement proper error messages
- [ ] Log security events
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📚 Additional Resources

### Default Credentials
- **Super Admin:** `SUPER001` / `SuperAdmin123!`
- **Test User:** `USER001` / `SecurePassword123!`

### API Documentation
- **Swagger UI:** http://localhost:4001/api-docs
- **OpenAPI JSON:** http://localhost:4001/api-docs.json

### Support
For technical support or questions about authentication implementation, please refer to the main API documentation or contact the development team.

---

This guide provides everything needed to implement secure authentication in your frontend application. Follow the security best practices and use the provided examples as a foundation for your implementation.
