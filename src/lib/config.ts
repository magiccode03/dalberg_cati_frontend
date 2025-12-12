/**
 * Application Configuration
 * Centralized configuration for the Bihar Election Analysis Dashboard
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
    version: '/api',
    timeout: 30000, // 30 seconds timeout for large data requests
  },

  // Application Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Bihar Election Analysis Dashboard',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'user',
    rememberMeKey: 'rememberMe',
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },

  // UI Configuration
  ui: {
    defaultTheme: 'light',
    defaultLanguage: 'en',
    itemsPerPage: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },

  // Feature Flags
  features: {
    enableUserManagement: true,
    enableRealTimeUpdates: true,
    enableOfflineMode: false,
    enableAnalytics: false,
  },

  // Demo Configuration
  demo: {
    enabled: process.env.NODE_ENV === 'development',
    defaultUsers: {
      superAdmin: {
        uniqueId: 'SUPER001',
        password: 'SuperAdmin123!',
      },
      admin: {
        uniqueId: 'ADMIN001',
        password: 'Admin123!',
      },
      pmt: {
        uniqueId: 'PMT001',
        password: 'PMT123!',
      },
      qc: {
        uniqueId: 'QC001',
        password: 'QC123!',
      },
      analyst: {
        uniqueId: 'QA001',
        password: 'Analyst123!',
      },
    },
  },
} as const;

// Helper functions
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${config.api.version}${endpoint}`;
};

export const isDevelopment = (): boolean => {
  return config.app.environment === 'development';
};

export const isProduction = (): boolean => {
  return config.app.environment === 'production';
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(config.auth.tokenKey);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(config.auth.tokenKey, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(config.auth.tokenKey);
  localStorage.removeItem(config.auth.refreshTokenKey);
  localStorage.removeItem(config.auth.userKey);
};

export default config;
