/**
 * Authentication Service
 * Based on the Frontend Authentication Guide specifications
 */

import { apiService } from './api';
import { tokenManager } from './token-manager';
import { handleApiError, getErrorMessage, isAuthError } from './error-handler';

export interface LoginCredentials {
  uniqueId: string;
  password: string;
}

export interface RegisterData {
  uniqueId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  portalSlug: string;
}

export interface AuthUser {
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
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {
    this.setupTokenRefresh();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with credentials
   */
  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // Store tokens securely
        tokenManager.storeTokens(token, refreshToken);
        
        // Store user data
        this.storeUserData(user);
        
        return {
          success: true,
          user: user,
        };
      } else {
        return {
          success: false,
          error: response.message || 'Login failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Register new user (Super Admin only)
   */
  public async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // Store tokens securely
        tokenManager.storeTokens(token, refreshToken);
        
        // Store user data
        this.storeUserData(user);
        
        return {
          success: true,
          user: user,
        };
      } else {
        return {
          success: false,
          error: response.message || 'Registration failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      // Call logout API
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local data
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  public async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // First check if we have a valid token
      if (!tokenManager.isTokenValid()) {
        return null;
      }

      const response = await apiService.getProfile();
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      if (isAuthError(error)) {
        this.clearAuthData();
      }
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return tokenManager.isTokenValid() && !!this.getStoredUser();
  }

  /**
   * Get stored user data
   */
  public getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Check if user has specific role
   */
  public hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.role.name === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  public hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();
    return user ? roles.includes(user.role.name) : false;
  }

  /**
   * Check if user has specific permission
   */
  public hasPermission(permission: string): boolean {
    const user = this.getStoredUser();
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role.name === 'super_admin') return true;
    
    // Check role-based permissions
    const rolePermissions = this.getRolePermissions(user.role.name);
    return rolePermissions.includes(permission) || rolePermissions.includes('*');
  }

  /**
   * Get role-based permissions
   */
  private getRolePermissions(role: string): string[] {
    const permissions = {
      'super_admin': ['*'],
      'admin': ['admin:read', 'admin:write', 'dashboard:read', 'users:read'],
      'pmt': ['pmt:read', 'pmt:write', 'dashboard:read'],
      'qc_manager': ['qc:read', 'qc:write', 'dashboard:read'],
      'quality_analyst': ['analysis:read', 'dashboard:read'],
      'start_qc': ['qc:read', 'dashboard:read'],
      'data_quality': ['data:read', 'data:write', 'dashboard:read'],
      'convergent_analysis': ['analysis:read', 'analysis:write', 'dashboard:read'],
    };
    
    return permissions[role as keyof typeof permissions] || ['dashboard:read'];
  }

  /**
   * Store user data
   */
  private storeUserData(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    tokenManager.clearTokens();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('rememberMe');
    }
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (typeof window === 'undefined') return;
    
    // Setup auto refresh
    tokenManager.setupAutoRefresh();
    
    // Setup expiry warning
    tokenManager.setupExpiryWarning(2); // 2 minutes warning
    
    // Listen for token expiry warnings
    window.addEventListener('tokenExpiryWarning', (event: any) => {
      const { timeUntilExpiry } = event.detail;
      console.warn(`Token expires in ${Math.ceil(timeUntilExpiry / 60)} minutes`);
      
      // You can show a notification to the user here
      // or dispatch a custom event for the UI to handle
    });
  }

  /**
   * Refresh authentication state
   */
  public async refreshAuthState(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (user) {
        this.storeUserData(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      return false;
    }
  }

  /**
   * Get token expiry information
   */
  public getTokenInfo(): {
    isValid: boolean;
    expiresAt: Date | null;
    timeUntilExpiry: number;
  } {
    return {
      isValid: tokenManager.isTokenValid(),
      expiresAt: tokenManager.getTokenExpiry(),
      timeUntilExpiry: tokenManager.getTimeUntilExpiry(),
    };
  }

  /**
   * Force token refresh
   */
  public async forceTokenRefresh(): Promise<boolean> {
    try {
      const newToken = await tokenManager.refreshAccessToken();
      return !!newToken;
    } catch (error) {
      console.error('Force token refresh failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export class for testing
export default AuthService;
