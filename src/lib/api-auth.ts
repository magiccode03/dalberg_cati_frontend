/**
 * API Authentication Helper
 * Validates JWT tokens from request headers
 */

import { NextRequest } from 'next/server';
import { getTokenPayload, isTokenExpired } from './error-handler';

interface AuthResult {
  valid: boolean;
  userId?: string;
  userRole?: string;
  error?: string;
}

/**
 * Validate authentication token from request
 */
export async function validateAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        valid: false,
        error: 'Missing or invalid authorization header'
      };
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return {
        valid: false,
        error: 'Token not provided'
      };
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      return {
        valid: false,
        error: 'Token expired'
      };
    }

    // Decode token payload
    const payload = getTokenPayload(token);
    
    if (!payload) {
      return {
        valid: false,
        error: 'Invalid token format'
      };
    }

    // Extract user information from payload
    return {
      valid: true,
      userId: payload.userId?.toString() || payload.id?.toString() || payload.uniqueId,
      userRole: payload.role
    };

  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Authentication error'
    };
  }
}

/**
 * Check if user has required role
 */
export function hasRole(authResult: AuthResult, requiredRole: string): boolean {
  if (!authResult.valid) return false;
  return authResult.userRole === requiredRole;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(authResult: AuthResult, requiredRoles: string[]): boolean {
  if (!authResult.valid) return false;
  return requiredRoles.includes(authResult.userRole || '');
}

