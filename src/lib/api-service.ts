/**
 * Modern API Service using Axios with Interceptors
 * Centralized API management with automatic token handling
 */

import apiClient from './api-client';

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
}

// User Management Interfaces
export interface User {
  id: number;
  uniqueId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  roleName: string;
  roleDisplayName: string;
  roleLevel: number;
  portalSlug: string;
  mobile?: string;
  agency?: number;
  isActive: number | boolean;
  lastLoginAt: string;
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
  portalSlug: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  roleId?: number;
  portalSlug?: string;
  isActive?: boolean;
}

export interface Role {
  id: number;
  name: string;
  displayName: string;
  level: number;
}

export interface LoginRequest {
  uniqueId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    uniqueId: string;
    email: string;
    firstName: string;
    lastName: string;
    portalSlug: string;
    roleId: number;
    isActive: number;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    roleName: string;
    roleDisplayName: string;
    roleLevel: number;
  };
}

class ApiService {
  // Generic request method using axios
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.request({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return {
        success: response.data.success || true,
        data: response.data.data || response.data,
        message: response.data.message,
        timestamp: response.data.timestamp || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('API Request failed:', error);
      
      // Handle axios errors
      if (error.response) {
        const { status, data } = error.response;
        throw new Error(data?.message || `HTTP error! status: ${status}`);
      } else if (error.request) {
        throw new Error('Network error - please check your connection');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('POST', '/auth/login', credentials);
  }

  async logout(): Promise<ApiResponse> {
    return this.request('POST', '/auth/logout');
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.request<{ accessToken: string; refreshToken: string }>('POST', '/auth/refresh', { refreshToken });
  }

  // User Management Methods
  async getUsers(params?: {
    role_id?: number;
    agency?: number;
    page?: number;
    limit?: number;
    uniqueId?: string;
    name?: string;
    mobile?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString() : '';
    return this.request<{ users: User[]; pagination: any }>('GET', `/users${queryString}`);
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>('GET', `/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('POST', '/users', userData);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('PUT', `/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request('DELETE', `/users/${id}`);
  }

  // Role Management Methods
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return this.request<Role[]>('GET', '/roles?isActive=true');
  }

  async getRole(id: string): Promise<ApiResponse<Role>> {
    return this.request<Role>('GET', `/roles/${id}`);
  }

  async createRole(roleData: any): Promise<ApiResponse<Role>> {
    return this.request<Role>('POST', '/roles', roleData);
  }

  async updateRole(id: string, roleData: any): Promise<ApiResponse<Role>> {
    return this.request<Role>('PUT', `/roles/${id}`, roleData);
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    return this.request('DELETE', `/roles/${id}`);
  }

  // Dashboard Methods
  async getDashboardOverview(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/overview');
  }

  async getStatusBreakdown(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/status-breakdown');
  }

  async getACProgress(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/ac-progress');
  }

  async getPollingStations(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/polling-stations');
  }

  async getSurveyDates(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/survey-dates');
  }

  async getSampleStatistics(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/sample-statistics');
  }

  // Vote Share Estimates Methods
  async getVoteShareEstimates(progressType?: string): Promise<ApiResponse<{
    page_info: {
      page_name: string;
      page_title: string;
      total_interviews: number;
      progress_type?: string;
    };
    charts?: {
      '2025_preference': {
        chart_type: string;
        chart_id: string;
        question_id: string;
        total_sample: number;
        data: Array<{
          name: string;
          y: number;
          count: string;
        }>;
        colors: string[];
      };
      '2020_ae': {
        chart_type: string;
        chart_id: string;
        question_id: string;
        total_sample: number;
        data: Array<{
          name: string;
          y: number;
          count: string;
        }>;
        colors: string[];
      };
    };
    demographic_breakdown?: {
      gender: Record<string, Record<string, number>>;
      locality: Record<string, Record<string, number>>;
      social_category: Record<string, Record<string, number>>;
      age_group: Record<string, Record<string, number>>;
      religion: Record<string, Record<string, number>>;
    };
    ac_data?: Array<{
      ac_code: number;
      ac_name: string;
      sample: string;
      years: {
        '2020_ae': Record<string, number>;
        '2025_preference': Record<string, number>;
      };
    }>;
  }>> {
    const queryString = progressType ? `?progress_type=${progressType}` : '';
    return this.request<any>('GET', `/dashboard/findings/vote-share-estimates${queryString}`);
  }

  // PMT Methods
  async getQCFailReport(page: number = 1): Promise<ApiResponse<any>> {
    return this.request<any>('GET', `/pmt/qc-fail-report?page=${page}`);
  }

  async getMasterPollingStation(page: number = 1, limit: number = 10, filters: any = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request<any>('GET', `/pmt/master-polling-station?${params}`);
  }

  // Team Registration Methods
  async getTeamRegistration(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    team_registrations: Array<{
      agency_id: number;
      agency_name: string;
      username: string;
      qc_agency: string;
      total_ac: number;
      total_interviews_conducted: number;
      valid: number;
      rejected: number;
      under_qc: number;
      show_second_level_column: boolean;
      status: string;
    }>;
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
    totals: {
      total_interview: number;
      valid_interview: string;
      reject_interview: string;
      interview_under_qc: string;
    };
  }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request<any>('GET', `/dashboard/team-registration?${params}`);
  }

  // Gain and Losses API
  async getGainAndLosses(): Promise<ApiResponse<{
    page_info: {
      page_name: string;
      page_title: string;
      total_interviews: number;
    };
    state_level: {
      title: string;
      data: Array<{
        '2021_party': string;
        '2021_vote_share': number;
        upcoming: {
          AITC: number;
          BJP: number;
          INC: number;
          'Left Front': number;
          Independent: number;
          AJSU: number;
          Others: number;
          NOTA: number;
        };
      }>;
    };
    zone_breakdown: Array<{
      zone_code: number;
      zone_name: string;
      data: Array<{
        '2021_party': string;
        '2021_vote_share': number;
        upcoming: {
          AITC: number;
          BJP: number;
          INC: number;
          'Left Front': number;
          Independent: number;
          AJSU: number;
          Others: number;
          NOTA: number;
        };
      }>;
    }>;
  }>> {
    return this.request<any>('GET', '/dashboard/findings/gain-and-losses');
  }

  // Second Choice API
  async getSecondChoiceData(): Promise<ApiResponse<{
    page_info: {
      page_name: string;
      page_title: string;
      total_interviews: number;
    };
    state_level: {
      title: string;
      data: Array<{
        upcoming: string;
        second_choice: {
          AITC: number;
          BJP: number;
          INC: number;
          'Left Front': number;
          Independent: number;
          AJSU: number;
          Others: number;
          NOTA: number;
        };
      }>;
    };
    zone_breakdown: Array<{
      zone_code: number;
      zone_name: string;
      data: Array<{
        upcoming: string;
        second_choice: {
          AITC: number;
          BJP: number;
          INC: number;
          'Left Front': number;
          Independent: number;
          AJSU: number;
          Others: number;
          NOTA: number;
        };
      }>;
    }>;
  }>> {
    return this.request<any>('GET', '/dashboard/findings/second-choice');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
