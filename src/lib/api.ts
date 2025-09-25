/**
 * Centralized API Service for Bihar Election Analysis Dashboard
 * Manages all backend API calls from one place
 */

import { tokenManager } from './token-manager';
import { handleApiError, isTokenExpired } from './error-handler';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
const API_VERSION = '/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/me', // Updated to match the guide
    REGISTER: '/auth/register', // Added register endpoint
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // User Management (SUPER ADMIN only)
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },

  // Role Management (SUPER ADMIN only)
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    GET: (id: string) => `/roles/${id}`,
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    PERMISSIONS: (id: string) => `/roles/${id}/permissions`,
  },

  // Feature Management (SUPER ADMIN only)
  FEATURES: {
    LIST: '/features',
    CREATE: '/features',
    GET: (id: string) => `/features/${id}`,
    UPDATE: (id: string) => `/features/${id}`,
    DELETE: (id: string) => `/features/${id}`,
  },

  // Page Management (SUPER ADMIN only)
  PAGES: {
    LIST: '/pages',
    CREATE: '/pages',
    GET: (id: string) => `/pages/${id}`,
    UPDATE: (id: string) => `/pages/${id}`,
    DELETE: (id: string) => `/pages/${id}`,
  },

  // API Endpoint Management (SUPER ADMIN only)
  API_ENDPOINTS: {
    LIST: '/api-endpoints',
    CREATE: '/api-endpoints',
    GET: (id: string) => `/api-endpoints/${id}`,
    UPDATE: (id: string) => `/api-endpoints/${id}`,
    DELETE: (id: string) => `/api-endpoints/${id}`,
  },

  // System Management (SUPER ADMIN only)
  SYSTEM: {
    HEALTH: '/health',
    INFO: '/system/info',
  },
  
  // Dashboard Data
  DASHBOARD: {
    STATS: '/dashboard/stats',
    OVERVIEW: '/dashboard/overview',
    RECENT_ACTIVITIES: '/dashboard/activities',
  },
  
  // Analysis
  ANALYSIS: {
    VOTE_SHARE: '/analysis/vote-share',
    PROGRESS: '/analysis/progress',
    TRENDS: '/analysis/trends',
  },
  
  // PMT System
  PMT: {
    AGENCIES: '/pmt/agencies',
    AGENCY: (id: string) => `/pmt/agencies/${id}`,
    AUDIT_LOGS: '/pmt/audit-logs',
  },
  
  // QC Management
  QC: {
    TASKS: '/qc/tasks',
    TASK: (id: string) => `/qc/tasks/${id}`,
    GPS_DATA: '/qc/gps',
    REPORTS: '/qc/reports',
  },
  
  // Data Quality
  DATA_QUALITY: {
    VALIDATION: '/data-quality/validation',
    METRICS: '/data-quality/metrics',
    ISSUES: '/data-quality/issues',
  },
  
  // Demographic Data
  DEMOGRAPHIC: {
    GENDER_WISE: '/progress/demographic/genderwise',
    AGE_WISE: '/progress/demographic/agewise',
    LOCALITY_WISE: '/progress/demographic/localitywise',
    RELIGION_WISE: '/progress/demographic/religionwise',
    SOCIAL_CATEGORY_WISE: '/progress/demographic/socialcategorywise',
    CASTE_WISE: '/progress/demographic/castewise',
  },
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface LoginRequest {
  uniqueId: string;
  password: string;
}

export interface LoginResponse {
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

export interface RegisterRequest {
  uniqueId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  portalSlug: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
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

export interface CreateUserRequest {
  uniqueId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  roleId?: number;
  isActive?: boolean;
}

// Demographic Data Types
export interface GenderData {
  quota: number;
  covered: number;
  balance: number;
}

export interface DemographicConstituency {
  ac_code: number;
  ac_name: string;
  sample_achieved: number;
  male: GenderData;
  female: GenderData;
}

export interface DemographicSummary {
  total_sample_achieved: number;
  total_male_quota: number;
  total_male_covered: number;
  total_male_balance: number;
  total_female_quota: number;
  total_female_covered: number;
  total_female_balance: number;
}

export interface GenderWiseResponse {
  summary: DemographicSummary;
  constituencies: DemographicConstituency[];
}

// Age-wise data types
export interface AgeGroupData {
  min_sample: number;
  achieved_sample: number;
  balance: number;
}

export interface AgeGroups {
  "18_24": AgeGroupData;
  "25_34": AgeGroupData;
  "35_50": AgeGroupData;
  "50_above": AgeGroupData;
}

export interface AgeWiseConstituency {
  ac_name: string;
  ac_code: number;
  sample_achieved: number;
  age_groups: AgeGroups;
}

export interface AgeWiseSummary {
  total_sample_achieved: number;
  total_18_24_min_sample: number;
  total_18_24_achieved_sample: number;
  total_18_24_balance: number;
  total_25_34_min_sample: number;
  total_25_34_achieved_sample: number;
  total_25_34_balance: number;
  total_35_50_min_sample: number;
  total_35_50_achieved_sample: number;
  total_35_50_balance: number;
  total_50_above_min_sample: number;
  total_50_above_achieved_sample: number;
  total_50_above_balance: number;
}

export interface AgeWiseResponse {
  constituencies: AgeWiseConstituency[];
  summary: AgeWiseSummary;
  metadata: DemographicMetadata;
}

// Locality-wise data types
export interface LocalityData {
  population: string;
  sample: number;
  difference: number;
}

export interface Locality {
  urban: LocalityData;
  rural: LocalityData;
}

export interface LocalityWiseConstituency {
  pc_name: string;
  pc_code: number;
  sample_achieved: number;
  locality: Locality;
}

export interface LocalityWiseSummary {
  total_sample_achieved: number;
  total_urban_population: string;
  total_urban_sample: number;
  total_urban_difference: number;
  total_rural_population: string;
  total_rural_sample: number;
  total_rural_difference: number;
}

export interface LocalityWiseResponse {
  constituencies: LocalityWiseConstituency[];
  summary: LocalityWiseSummary;
  metadata: DemographicMetadata;
}

// Caste-wise data types
export interface CasteData {
  caste_name: string;
  caste_code: string;
  quota: number;
  covered: number;
  balance: number;
  rank: number;
}

export interface CasteWiseConstituency {
  ac_code: number;
  ac_name: string;
  sample_achieved: number;
  castes: CasteData[];
}

export interface CasteWiseSummary {
  total_sample_achieved: number;
  total_castes: number;
}

export interface CasteWiseResponse {
  summary: CasteWiseSummary;
  constituencies: CasteWiseConstituency[];
}

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.baseURL = `${API_BASE_URL}${API_VERSION}`;
    this.loadTokens();
  }

  // Token Management
  private loadTokens() {
    this.token = tokenManager.getAccessToken();
    this.refreshToken = tokenManager.getRefreshToken();
  }

  private saveTokens(token: string, refreshToken: string) {
    tokenManager.storeTokens(token, refreshToken);
    this.token = token;
    this.refreshToken = refreshToken;
  }

  private clearTokens() {
    tokenManager.clearTokens();
    this.token = null;
    this.refreshToken = null;
  }

  // HTTP Methods
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authorization header if token exists
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token refresh if 401
      if (response.status === 401 && this.refreshToken) {
        const newToken = await tokenManager.refreshAccessToken();
        if (newToken) {
          // Retry the original request with new token
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(url, config);
          return await this.handleResponse<T>(retryResponse);
        } else {
          // Refresh failed, redirect to login
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Request failed:', error);
      handleApiError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        try {
          const data = await response.json();
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        } catch (parseError) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        // Handle non-JSON error responses (like HTML 404 pages)
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
    }

    if (isJson) {
      try {
        const data = await response.json();
        return data;
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
    } else {
      // For non-JSON successful responses, return a basic success response
      return {
        success: true,
        data: {} as T,
        message: 'Request successful'
      };
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    // Save tokens on successful login
    if (response.success && response.data) {
      this.saveTokens(response.data.token, response.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      });
      return response;
    } finally {
      // Always clear tokens on logout
      this.clearTokens();
    }
  }

  async refreshAuthToken(): Promise<boolean> {
    try {
      const newToken = await tokenManager.refreshAccessToken();
      if (newToken) {
        this.token = newToken;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    // Save tokens on successful registration
    if (response.success && response.data) {
      this.saveTokens(response.data.token, response.data.refreshToken);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  // User Management Methods (SUPER ADMIN only)
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(API_ENDPOINTS.USERS.LIST);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.GET(id));
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.USERS.DELETE(id), {
      method: 'DELETE',
    });
  }

  async activateUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.ACTIVATE(id), {
      method: 'PATCH',
    });
  }

  async deactivateUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.DEACTIVATE(id), {
      method: 'PATCH',
    });
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.STATS);
  }

  async getDashboardOverview(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.OVERVIEW);
  }

  async getRecentActivities(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
  }

  // Analysis Methods
  async getVoteShareAnalysis(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`${API_ENDPOINTS.ANALYSIS.VOTE_SHARE}${queryString}`);
  }

  async getProgressAnalysis(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`${API_ENDPOINTS.ANALYSIS.PROGRESS}${queryString}`);
  }

  // PMT Methods
  async getAgencies(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.PMT.AGENCIES);
  }

  async getAgency(id: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.PMT.AGENCY(id));
  }

  async getAuditLogs(params?: any): Promise<ApiResponse<any[]>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any[]>(`${API_ENDPOINTS.PMT.AUDIT_LOGS}${queryString}`);
  }

  // QC Methods
  async getQCTasks(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.QC.TASKS);
  }

  async getQCTask(id: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.QC.TASK(id));
  }

  async getGPSData(params?: any): Promise<ApiResponse<any[]>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any[]>(`${API_ENDPOINTS.QC.GPS_DATA}${queryString}`);
  }

  // Data Quality Methods
  async getDataValidation(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DATA_QUALITY.VALIDATION);
  }

  async getQualityMetrics(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DATA_QUALITY.METRICS);
  }

  async getQualityIssues(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.DATA_QUALITY.ISSUES);
  }

  // Demographic Methods
  async getGenderWiseData(): Promise<ApiResponse<GenderWiseResponse>> {
    return this.request<GenderWiseResponse>(API_ENDPOINTS.DEMOGRAPHIC.GENDER_WISE);
  }

  async getAgeWiseData(): Promise<ApiResponse<AgeWiseResponse>> {
    return this.request<AgeWiseResponse>(API_ENDPOINTS.DEMOGRAPHIC.AGE_WISE);
  }

  async getLocalityWiseData(): Promise<ApiResponse<LocalityWiseResponse>> {
    return this.request<LocalityWiseResponse>(API_ENDPOINTS.DEMOGRAPHIC.LOCALITY_WISE);
  }

  async getReligionWiseData(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.DEMOGRAPHIC.RELIGION_WISE);
  }

  async getSocialCategoryWiseData(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.DEMOGRAPHIC.SOCIAL_CATEGORY_WISE);
  }

  async getCasteWiseData(): Promise<ApiResponse<CasteWiseResponse>> {
    return this.request<CasteWiseResponse>(API_ENDPOINTS.DEMOGRAPHIC.CASTE_WISE);
  }

  // Super Admin Methods - Role Management
  async getRoles(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.ROLES.LIST);
  }

  async createRole(roleData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.ROLES.CREATE, {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async getRole(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.ROLES.GET(id));
  }

  async updateRole(id: string, roleData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.ROLES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.ROLES.DELETE(id), {
      method: 'DELETE',
    });
  }

  async getRolePermissions(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.ROLES.PERMISSIONS(id));
  }

  async updateRolePermissions(id: string, permissions: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.ROLES.PERMISSIONS(id), {
      method: 'PUT',
      body: JSON.stringify(permissions),
    });
  }

  // Super Admin Methods - Feature Management
  async getFeatures(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.FEATURES.LIST);
  }

  async createFeature(featureData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.FEATURES.CREATE, {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
  }

  async getFeature(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.FEATURES.GET(id));
  }

  async updateFeature(id: string, featureData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.FEATURES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(featureData),
    });
  }

  async deleteFeature(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.FEATURES.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Super Admin Methods - Page Management
  async getPages(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.PAGES.LIST);
  }

  async createPage(pageData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.PAGES.CREATE, {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  }

  async getPage(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.PAGES.GET(id));
  }

  async updatePage(id: string, pageData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.PAGES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(pageData),
    });
  }

  async deletePage(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.PAGES.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Super Admin Methods - API Endpoint Management
  async getApiEndpoints(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.API_ENDPOINTS.LIST);
  }

  async createApiEndpoint(endpointData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.API_ENDPOINTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(endpointData),
    });
  }

  async getApiEndpoint(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.API_ENDPOINTS.GET(id));
  }

  async updateApiEndpoint(id: string, endpointData: any): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.API_ENDPOINTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(endpointData),
    });
  }

  async deleteApiEndpoint(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.API_ENDPOINTS.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Super Admin Methods - System Management
  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.SYSTEM.HEALTH);
  }

  async getSystemInfo(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.SYSTEM.INFO);
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
