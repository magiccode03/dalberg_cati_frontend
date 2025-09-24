/**
 * Error Handling Utilities
 * Based on the Frontend Authentication Guide specifications
 */

export interface ApiError {
  message: string;
  statusCode: number;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  timestamp: string;
}

export class AuthenticationError extends Error {
  public statusCode: number;
  public details?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode: number, details?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  public details: Array<{ field: string; message: string }>;

  constructor(message: string, details: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * Handle API errors based on status codes and error types
 */
export function handleApiError(error: any): never {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new NetworkError('Unable to connect to server. Please check your internet connection.');
  }

  // Parse API error response
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        if (data.error?.details) {
          throw new ValidationError(data.error.message, data.error.details);
        }
        throw new AuthenticationError(data.error?.message || 'Bad request', 400);
      
      case 401:
        if (data.error?.message === 'Invalid or expired token') {
          throw new AuthenticationError('Session expired. Please login again.', 401);
        }
        throw new AuthenticationError(data.error?.message || 'Authentication required', 401);
      
      case 403:
        throw new AuthenticationError(data.error?.message || 'Access forbidden', 403);
      
      case 404:
        throw new AuthenticationError('Resource not found', 404);
      
      case 409:
        throw new AuthenticationError(data.error?.message || 'Resource already exists', 409);
      
      case 422:
        if (data.error?.details) {
          throw new ValidationError(data.error.message, data.error.details);
        }
        throw new AuthenticationError(data.error?.message || 'Validation failed', 422);
      
      case 500:
        throw new AuthenticationError('Internal server error. Please try again later.', 500);
      
      default:
        throw new AuthenticationError(data.error?.message || 'An unexpected error occurred', status);
    }
  }

  // Generic error
  throw new Error(error.message || 'An unexpected error occurred');
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // Invalid token
  }
}

/**
 * Extract token payload
 */
export function getTokenPayload(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (error instanceof ValidationError) {
    return error.details.map(detail => `${detail.field}: ${detail.message}`).join(', ');
  }
  
  if (error instanceof AuthenticationError) {
    return error.message;
  }
  
  if (error instanceof NetworkError) {
    return error.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: any): boolean {
  return error instanceof AuthenticationError && 
         (error.statusCode === 401 || error.statusCode === 403);
}

/**
 * Check if error is validation related
 */
export function isValidationError(error: any): boolean {
  return error instanceof ValidationError;
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: any): boolean {
  return error instanceof NetworkError;
}

/**
 * Format validation errors for form fields
 */
export function formatValidationErrors(error: ValidationError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  error.details.forEach(detail => {
    fieldErrors[detail.field] = detail.message;
  });
  
  return fieldErrors;
}

/**
 * Retry mechanism for network requests
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry authentication or validation errors
      if (isAuthError(error) || isValidationError(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

/**
 * Global error handler for unhandled promise rejections
 */
export function setupGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Handle authentication errors globally
      if (isAuthError(event.reason)) {
        // Redirect to login if token is invalid
        if (event.reason.statusCode === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    });
  }
}

export default {
  handleApiError,
  isTokenExpired,
  getTokenPayload,
  getErrorMessage,
  isAuthError,
  isValidationError,
  isNetworkError,
  formatValidationErrors,
  retryRequest,
  setupGlobalErrorHandler,
};
