/**
 * Token Management Utilities
 * Based on the Frontend Authentication Guide specifications
 */

import { isTokenExpired, getTokenPayload } from './error-handler';

export interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface TokenPayload {
  userId: number;
  uniqueId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

class TokenManager {
  private static instance: TokenManager;
  private tokenRefreshPromise: Promise<string> | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Store tokens securely
   */
  public storeTokens(token: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;

    try {
      // Store in localStorage (development only)
      // In production, use httpOnly cookies
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Calculate expiry time
      const payload = getTokenPayload(token);
      if (payload) {
        const expiresAt = payload.exp * 1000; // Convert to milliseconds
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      }
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Get access token
   */
  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Get refresh token
   */
  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  /**
   * Check if token is valid and not expired
   */
  public isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    return !isTokenExpired(token);
  }

  /**
   * Check if token needs refresh (5 minutes before expiry)
   */
  public shouldRefreshToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const payload = getTokenPayload(token);
    if (!payload) return false;

    const currentTime = Date.now() / 1000;
    const refreshThreshold = 5 * 60; // 5 minutes in seconds
    
    return (payload.exp - currentTime) < refreshThreshold;
  }

  /**
   * Get token payload
   */
  public getTokenPayload(): TokenPayload | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    return getTokenPayload(token);
  }

  /**
   * Refresh access token
   */
  public async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return null;
    }

    this.tokenRefreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const newToken = await this.tokenRefreshPromise;
      return newToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { token, refreshToken: newRefreshToken } = data.data;
        
        // Store new tokens
        this.storeTokens(token, newRefreshToken);
        
        return token;
      } else {
        // Refresh failed, clear tokens
        this.clearTokens();
        return null;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Clear all tokens
   */
  public clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberMe');
  }

  /**
   * Get user from token
   */
  public getUserFromToken(): any {
    const payload = this.getTokenPayload();
    if (!payload) return null;

    return {
      id: payload.userId,
      uniqueId: payload.uniqueId,
      email: payload.email,
      role: payload.role,
    };
  }

  /**
   * Check if user has specific role
   */
  public hasRole(role: string): boolean {
    const payload = this.getTokenPayload();
    return payload?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  public hasAnyRole(roles: string[]): boolean {
    const payload = this.getTokenPayload();
    return payload ? roles.includes(payload.role) : false;
  }

  /**
   * Get token expiry time
   */
  public getTokenExpiry(): Date | null {
    const payload = this.getTokenPayload();
    return payload ? new Date(payload.exp * 1000) : null;
  }

  /**
   * Get time until token expires (in seconds)
   */
  public getTimeUntilExpiry(): number {
    const payload = this.getTokenPayload();
    if (!payload) return 0;

    const currentTime = Date.now() / 1000;
    return Math.max(0, payload.exp - currentTime);
  }

  /**
   * Setup automatic token refresh
   */
  public setupAutoRefresh(): void {
    if (typeof window === 'undefined') return;

    // Check token every minute
    setInterval(async () => {
      if (this.shouldRefreshToken() && this.isTokenValid()) {
        try {
          await this.refreshAccessToken();
        } catch (error) {
          console.error('Auto token refresh failed:', error);
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Setup token expiry warning
   */
  public setupExpiryWarning(warningMinutes: number = 2): void {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      const timeUntilExpiry = this.getTimeUntilExpiry();
      const warningTime = warningMinutes * 60; // Convert to seconds

      if (timeUntilExpiry > 0 && timeUntilExpiry <= warningTime) {
        // Show warning to user
        console.warn(`Token expires in ${Math.ceil(timeUntilExpiry / 60)} minutes`);
        
        // You can dispatch a custom event or show a notification here
        window.dispatchEvent(new CustomEvent('tokenExpiryWarning', {
          detail: { timeUntilExpiry }
        }));
      }
    }, 30000); // Check every 30 seconds
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export class for testing
export default TokenManager;
