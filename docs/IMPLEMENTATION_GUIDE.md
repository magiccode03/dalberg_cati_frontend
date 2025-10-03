# Frontend Implementation Guide

## Overview
This guide provides comprehensive implementation details for the Bihar Election Analysis Dashboard frontend, updated to match the Frontend Authentication Guide specifications.

## 🚀 Quick Start

### 1. Environment Setup
Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_APP_NAME=Bihar Election Analysis Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

### 2. Default Credentials
- **Super Admin:** `SUPER001` / `SuperAdmin123!`
- **Test User:** `USER001` / `SecurePassword123!`

## 🔐 Authentication Implementation

### Login Process
```typescript
import { authService } from '@/lib/auth-service';

const handleLogin = async (uniqueId: string, password: string) => {
  const result = await authService.login({ uniqueId, password });
  
  if (result.success) {
    // Redirect to dashboard
    router.push('/dashboard');
  } else {
    // Show error message
    setError(result.error);
  }
};
```

### Token Management
```typescript
import { tokenManager } from '@/lib/token-manager';

// Check if user is authenticated
if (tokenManager.isTokenValid()) {
  // User is logged in
}

// Get token expiry information
const tokenInfo = tokenManager.getTokenInfo();
console.log('Token expires at:', tokenInfo.expiresAt);
```

### Automatic Token Refresh
The system automatically refreshes tokens 5 minutes before expiry:
```typescript
// Setup is automatic, but you can also force refresh
const success = await tokenManager.forceTokenRefresh();
```

## 📡 API Integration

### Basic API Calls
```typescript
import { apiService } from '@/lib/api';

// Login
const response = await apiService.login({
  uniqueId: 'SUPER001',
  password: 'SuperAdmin123!'
});

// Get dashboard stats
const stats = await apiService.getDashboardStats();

// Get users (SUPER ADMIN only)
const users = await apiService.getUsers();
```

### Advanced API Client
```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const data = await apiClient.get('/dashboard/stats');

// POST request with error handling
try {
  const result = await apiClient.post('/users', userData);
  console.log('User created:', result);
} catch (error) {
  console.error('Error:', error.message);
}

// File upload with progress
await apiClient.uploadFile('/upload', file, (progress) => {
  setUploadProgress(progress);
});
```

## 🎯 React Hooks Usage

### Authentication Hook
```typescript
import { useAuth } from '@/contexts/AuthContext';

function Dashboard() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### API Hooks
```typescript
import { useUsers, useLogin } from '@/hooks/useApi';

function UserManagement() {
  const { data: users, loading, error, refetch } = useUsers();
  const { login, loading: loginLoading } = useLogin();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🛡️ Error Handling

### Global Error Handling
```typescript
import { setupGlobalErrorHandler } from '@/lib/error-handler';

// Setup in your app initialization
setupGlobalErrorHandler();
```

### Component Error Handling
```typescript
import { handleApiError, getErrorMessage } from '@/lib/error-handler';

try {
  const result = await apiService.getUsers();
} catch (error) {
  const message = getErrorMessage(error);
  setError(message);
}
```

### Validation Errors
```typescript
import { isValidationError, formatValidationErrors } from '@/lib/error-handler';

try {
  await apiService.createUser(userData);
} catch (error) {
  if (isValidationError(error)) {
    const fieldErrors = formatValidationErrors(error);
    setFieldErrors(fieldErrors);
  }
}
```

## 🔒 Security Features

### Token Security
- **Access Tokens**: 15-minute expiry
- **Refresh Tokens**: 7-day expiry
- **Automatic Refresh**: 5 minutes before expiry
- **Secure Storage**: localStorage (development), httpOnly cookies (production)

### Role-Based Access Control
```typescript
import { authService } from '@/lib/auth-service';

// Check user role
if (authService.hasRole('super_admin')) {
  // Show admin features
}

// Check permissions
if (authService.hasPermission('users:write')) {
  // Allow user creation
}
```

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

## 📱 Component Examples

### Login Form
```typescript
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const [formData, setFormData] = useState({
    uniqueId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.uniqueId, formData.password);

    if (!result) {
      setError('Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Unique ID"
        value={formData.uniqueId}
        onChange={(e) => setFormData({...formData, uniqueId: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      {error && <div style={{color: 'red'}}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### User Management (SUPER ADMIN)
```typescript
import { useUsers, useCreateUser } from '@/hooks/useApi';

export function UserManagement() {
  const { data: users, loading, error, refetch } = useUsers();
  const { createUser, loading: createLoading } = useCreateUser();

  const handleCreateUser = async (userData) => {
    const result = await createUser(userData);
    if (result) {
      refetch(); // Refresh the list
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Management</h2>
      {users?.map(user => (
        <div key={user.id}>
          <span>{user.uniqueId}</span>
          <span>{user.firstName} {user.lastName}</span>
          <span>{user.role.displayName}</span>
        </div>
      ))}
    </div>
  );
}
```

## 🧪 Testing

### Unit Tests
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';

test('should login successfully', async () => {
  // Mock API response
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

  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );

  fireEvent.change(screen.getByPlaceholderText('Unique ID'), {
    target: { value: 'TEST001' }
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
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

## 🔧 Configuration

### API Configuration
```typescript
// src/lib/config.ts
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
    timeout: 30000,
  },
  auth: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
  },
};
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_APP_NAME=Bihar Election Analysis Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get user profile
- `POST /api/auth/register` - Register new user (SUPER ADMIN only)

### User Management
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/activities` - Recent activities

## 🚨 Error Codes

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid/expired token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (Resource already exists)
- `422` - Unprocessable Entity (Validation failed)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": [
      {
        "field": "uniqueId",
        "message": "Unique ID is required"
      }
    ]
  },
  "timestamp": "2025-09-24T08:17:21.053Z"
}
```

## 🔒 Security Checklist

### ✅ Authentication Security
- [x] Use HTTPS in production
- [x] Implement secure token storage
- [x] Set appropriate token expiration times (15 min access, 7 day refresh)
- [x] Implement automatic token refresh
- [x] Handle token expiration gracefully
- [x] Clear tokens on logout
- [x] Implement proper error handling
- [x] Validate all user inputs
- [x] Use CSRF protection
- [x] Implement rate limiting

### ✅ Frontend Security
- [x] Sanitize user inputs
- [x] Implement XSS protection
- [x] Use Content Security Policy (CSP)
- [x] Implement proper session management
- [x] Handle sensitive data carefully
- [x] Use secure communication channels
- [x] Implement proper error messages
- [x] Log security events
- [x] Regular security audits
- [x] Keep dependencies updated

## 📞 Support

### API Documentation
- **Swagger UI:** http://localhost:4001/api-docs
- **OpenAPI JSON:** http://localhost:4001/api-docs.json

### Default Credentials
- **Super Admin:** `SUPER001` / `SuperAdmin123!`
- **Test User:** `USER001` / `SecurePassword123!`

---

This implementation guide provides everything needed to integrate the authentication system with your frontend application. Follow the security best practices and use the provided examples as a foundation for your implementation.
