# API Service Documentation

## Overview

The API service provides a centralized way to manage all backend API calls for the Bihar Election Analysis Dashboard. It handles authentication, token management, error handling, and provides a consistent interface for all API operations.

**Updated to match the Frontend Authentication Guide specifications.**

## Files

- **`api.ts`** - Main API service class with all HTTP methods and endpoints
- **`api-client.ts`** - Advanced API client with automatic token refresh and file upload
- **`auth-service.ts`** - Comprehensive authentication service
- **`token-manager.ts`** - Token management utilities
- **`error-handler.ts`** - Error handling utilities
- **`config.ts`** - Application configuration and environment settings
- **`useApi.ts`** - React hooks for easy API integration in components

## API Service Features

### 🔐 Authentication
- JWT token management (15-minute access tokens, 7-day refresh tokens)
- Automatic token refresh with retry logic
- Secure token storage with expiry tracking
- Comprehensive logout functionality
- Role-based access control
- Permission-based authorization

### 📡 HTTP Methods
- GET, POST, PUT, DELETE, PATCH
- Automatic error handling with retry logic
- Request/response interceptors
- Timeout handling (30 seconds default)
- File upload with progress tracking
- File download functionality

### 🎯 Endpoints Coverage
- **Authentication**: login, logout, refresh, profile (`/auth/me`), register
- **User Management**: CRUD operations for SUPER ADMIN
- **Dashboard**: stats, overview, activities
- **Analysis**: vote share, progress, trends
- **PMT System**: agencies, audit logs
- **QC Management**: tasks, GPS data, reports
- **Data Quality**: validation, metrics, issues

## Usage Examples

### Basic API Call
```typescript
import { apiService } from '@/lib/api';

// Login
const response = await apiService.login({
  uniqueId: 'SUPER001',
  password: 'SuperAdmin123!'
});

// Get users
const users = await apiService.getUsers();
```

### Advanced API Client
```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const data = await apiClient.get('/dashboard/stats');

// POST request
const result = await apiClient.post('/users', {
  uniqueId: 'USER002',
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  roleId: 2,
  portalSlug: 'john-doe'
});

// File upload with progress
await apiClient.uploadFile('/upload', file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// File download
await apiClient.downloadFile('/export/data', 'report.pdf');
```

### Authentication Service
```typescript
import { authService } from '@/lib/auth-service';

// Login
const result = await authService.login({
  uniqueId: 'SUPER001',
  password: 'SuperAdmin123!'
});

if (result.success) {
  console.log('User:', result.user);
} else {
  console.error('Error:', result.error);
}

// Check authentication
if (authService.isAuthenticated()) {
  const user = authService.getStoredUser();
  console.log('Current user:', user);
}

// Check permissions
if (authService.hasRole('super_admin')) {
  console.log('User is super admin');
}

if (authService.hasPermission('users:write')) {
  console.log('User can write users');
}
```

### Token Management
```typescript
import { tokenManager } from '@/lib/token-manager';

// Check token validity
if (tokenManager.isTokenValid()) {
  console.log('Token is valid');
}

// Get token info
const tokenInfo = tokenManager.getTokenInfo();
console.log('Expires at:', tokenInfo.expiresAt);
console.log('Time until expiry:', tokenInfo.timeUntilExpiry);

// Force token refresh
const success = await tokenManager.forceTokenRefresh();
if (success) {
  console.log('Token refreshed successfully');
}
```

### Using React Hooks
```typescript
import { useLogin, useUsers } from '@/hooks/useApi';

function LoginComponent() {
  const { login, loading, error } = useLogin();
  
  const handleLogin = async () => {
    const result = await login('SUPER001', 'SuperAdmin123!');
    if (result) {
      // Login successful
    }
  };
}

function UsersList() {
  const { data: users, loading, error, refetch } = useUsers();
  
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

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

### User Management (SUPER ADMIN only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/activate` - Activate user
- `PATCH /api/users/:id/deactivate` - Deactivate user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/activities` - Recent activities

### Analysis
- `GET /api/analysis/vote-share` - Vote share analysis
- `GET /api/analysis/progress` - Progress analysis
- `GET /api/analysis/trends` - Analysis trends

### PMT System
- `GET /api/pmt/agencies` - List agencies
- `GET /api/pmt/agencies/:id` - Get agency
- `GET /api/pmt/audit-logs` - Audit logs

### QC Management
- `GET /api/qc/tasks` - QC tasks
- `GET /api/qc/tasks/:id` - Get QC task
- `GET /api/qc/gps` - GPS data
- `GET /api/qc/reports` - QC reports

### Data Quality
- `GET /api/data-quality/validation` - Data validation
- `GET /api/data-quality/metrics` - Quality metrics
- `GET /api/data-quality/issues` - Quality issues

## Configuration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_APP_NAME=Bihar Election Analysis Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}
```

### Login Response
```typescript
interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    uniqueId: string;
    email: string;
    firstName: string;
    lastName: string;
    portalSlug: string;
    role: {
      id: number;
      name: string;
      displayName: string;
      level: number;
    };
    isActive: boolean;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

## Error Handling

The API service automatically handles:
- Network errors
- HTTP status codes
- Token expiration and refresh
- Request timeouts
- Response parsing errors

## Security Features

- JWT token authentication
- Automatic token refresh
- Secure token storage
- Request/response validation
- CORS handling
- XSS protection

## Development

### Adding New Endpoints
1. Add endpoint to `API_ENDPOINTS` in `api.ts`
2. Create corresponding method in `ApiService` class
3. Add React hook in `useApi.ts` if needed
4. Update types if necessary

### Testing
```typescript
// Mock API service for testing
import { ApiService } from '@/lib/api';

const mockApiService = new ApiService();
// Override methods for testing
```

## Best Practices

1. **Always use the API service** instead of direct fetch calls
2. **Use React hooks** for component integration
3. **Handle loading and error states** in UI
4. **Validate responses** before using data
5. **Use TypeScript types** for better development experience
6. **Test API calls** with proper mocking
7. **Handle network failures** gracefully
8. **Implement proper error boundaries** for API errors
