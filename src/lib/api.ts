/**
 * Centralized API Service for Bihar Election Analysis Dashboard
 * Manages all backend API calls from one place
 */

import apiClient from './api-client';
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
  
  // Dropdown APIs
  DROPDOWN: {
    AGENCIES: '/dropdown/agencies',
    AC_LIST: '/dropdown/ac-list',
    INTERVIEWERS: '/dropdown/interviewers'
  },

  // Filter Options APIs
  FILTER_OPTIONS: {
    REJECTION_REPORT: '/progress/rejectreport/filter-options'
  },

  // Download APIs
  DOWNLOAD: {
    REJECTION_REPORT: '/progress/rejectreport/download'
  },

  // QC User Registration
  QC_USER_REGISTRATION: '/qc-user-registration',

  // QC User Progress
  QC_USER_PROGRESS: '/progress/qc-user-progress',

  // QC User Pending Data
  QC_USER_PENDING_DATA: '/progress/qc-user-pending-data',

  // Dashboard Data
  DASHBOARD: {
    STATS: '/dashboard/stats',
    OVERVIEW: '/dashboard/overview',
    RECENT_ACTIVITIES: '/dashboard/activities',
    STATUS_BREAKDOWN: '/dashboard/status-breakdown',
    AC_PROGRESS: '/dashboard/ac-progress',
    POLLING_STATIONS: '/dashboard/polling-stations',
    SURVEY_DATES: '/dashboard/survey-dates',
    SAMPLE_STATISTICS: '/dashboard/sample-statistics',
    FIELDWORK_PROGRESS: '/dataquality',
    MASTER_AC_LIST: '/dashboard/master-ac/list',
    MASTER_AC_UPDATE: '/dashboard/master-ac/update',
    MASTER_AC_INDEX_UPDATE: '/dashboard/master-ac-index/acupdate',
    INTERVIEW_LOG: '/overview/interview-log',
    MASTER_AC_CASTE_LIST: '/dashboard/master-ac-caste/list',
    MASTER_POLLING_STATION_LIST: '/dashboard/master-polling-station/list',
    PS_FORM_LIST: '/dashboard/master-polling-station-dynamic',
    PS_FORM_UPDATE: (id: string) => `/dashboard/master-polling-station-dynamic/update?id=${id}`,
    PS_FORM_UPDATE_SUBMIT: '/dashboard/master-polling-station-dynamic/update',
    PS_FORM_DOWNLOAD: '/dashboard/master-polling-station-dynamic/download',
    TEAM_REGISTRATION: '/dashboard/team-registration',
    TEAM_REGISTRATION_CREATE: '/dashboard/team-registration/newregistration',
    TEAM_REGISTRATION_UPDATE: (id: string) => `/dashboard/team-registration/newregistration/update/${id}`,
    TEAM_REGISTRATION_DROPDOWN_OPTIONS: '/dashboard/team-registration/newregistration/dropdown-options',
    QC_AGENCIES: '/dashboard/team-registration/qc-agencies',
  },

  // Project Settings
  PROJECT_SETTINGS: {
    GET: '/project-setting',
    UPDATE: '/project-setting/update',
    UPDATE_INSTANCE: '/project-setting/update/instance',
    UPDATE_SAMPLE: '/project-setting/update/sample',
    UPDATE_DATES: '/project-setting/update/dates',
    UPDATE_THEMES: '/project-setting/update/themes',
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
    TEAM_REGISTRATION: '/qc-team-registration/newregistration',
    TEAM_REGISTRATIONS: '/qc-team-registration',
    TEAM_REGISTRATION_UPDATE: (id: string) => `/qc-team-registration/update/${id}`,
  },
  
  // Data Quality
  DATA_QUALITY: {
    VALIDATION: '/data-quality/validation',
    METRICS: '/data-quality/metrics',
    ISSUES: '/data-quality/issues',
  },
  
  // Demographic Data
  DEMOGRAPHIC: {
    GENDER_WISE: '/demographic/genderwise',
    AGE_WISE: '/demographic/agewise',
    LOCALITY_WISE: '/demographic/localitywise',
    RELIGION_WISE: '/demographic/religionwise',
    SOCIAL_CATEGORY_WISE: '/demographic/socialcategorywise',
    CASTE_WISE: '/demographic/castewise',
    CASTE_DETAILS: '/demographics/caste',
  },
  
  // Field Data (FD)
  FD: {
    INTERNAL_DASHBOARD: '/fd/internal-dashboard',
    INTERVIEW_AUDIO: '/cati/interviews/ac-audio',
    INTERVIEW_AUDIO_SEARCH_CAPI: '/fd/interviewaudio/search',
    AC_WISE_DATA: '/cati/ac-progress-report',
  },
  
  // Interview Masters
  INTERVIEW_MASTERS: '/interview-masters',

  // Interview Assigned
  INTERVIEW_ASSIGNED: '/interview-assigned',

  // Findings
  FINDINGS: {
    GAIN_AND_LOSSES: '/dashboard/findings/gain-and-losses',
  },

  // Performance Report
  PERFORMANCE_REPORT: '/performance-report',
  PERFORMANCE_REPORT_AC_LIST: '/performance-report/aclist',
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
  accessToken: string;
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

export interface DemographicMetadata {
  total_constituencies: number;
  last_updated: string;
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

// Detailed Caste Demographics API Response Types
export interface DetailedCasteInfo {
  rank: number;
  caste_name: string;
  castecode: string;
  caste: number;
  minsample: number;
  achievement_count: number;
  achievement: number;
  difference: number;
  status: 'met' | 'not_met';
  color_class: string;
}

export interface DetailedCasteACData {
  ac_code: number;
  ac_name: string;
  sample_target: number;
  valid_underqc_achived: number;
  completion_rate: string;
  castes: DetailedCasteInfo[];
}

export interface DetailedCastePCData {
  pc_code: number;
  pc_name: string;
  district_name: string;
  sample_target: number;
  valid_underqc_achived: number;
  completion_rate: string;
  castes: DetailedCasteInfo[];
}

export interface DetailedCasteDistrictData {
  district_code: number;
  district_name: string;
  sample_target: number;
  valid_underqc_achived: number;
  completion_rate: string;
  castes: DetailedCasteInfo[];
}

export interface DetailedCasteZoneData {
  region_code: number;
  region_name: string;
  sample_target: number;
  valid_underqc_achived: number;
  completion_rate: string;
  castes: DetailedCasteInfo[];
}

export interface DetailedCasteResponse {
  progress_type: number;
  progress_page: string;
  total_records: number;
  search_filters: Record<string, any>;
  data_list: DetailedCasteACData[] | DetailedCastePCData[] | DetailedCasteDistrictData[] | DetailedCasteZoneData[];
  message: string;
  timestamp: string;
}

// Interview Masters Types
export interface InterviewMaster {
  id: number;
  fullname: string;
  login_id: string;
  total_data_submitted: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InterviewMastersResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  data: InterviewMaster[];
}

// Gain and Losses API Types
export interface GainLossPreference {
  BJP: number;
  JDU: number;
  HAMS: number;
  VSIP: number;
  'LJP(RV)': number;
  INC: number;
  RJD: number;
  'CPI(M)': number;
  JSP: number;
  Others: number;
  NWR: number;
}

export interface GainLossData {
  '2020_party': string;
  '2020_vote_share': number;
  '2025_preference': GainLossPreference;
}

export interface GainLossZoneData {
  zone_code: number;
  zone_name: string;
  data: GainLossData[];
}

// CATI AC Progress Report Types
export interface CATIACData {
  ac_code: number;
  ac_name: string;
  district_name: string;
  call_attempt: number;
  call_connected: number;
  success: number;
  total_records: number;
  pass?: number;
  under_qc?: number;
  qc_rejected?: number;
  short_interview?: number;
  total_caller_data?: number;
  total_caller_available?: number;
}

export interface CATIACResponse {
  success: boolean;
  data: CATIACData[];
  message: string;
  timestamp: string;
}

export interface GainLossResponse {
  success: boolean;
  data: {
    page_info: {
      page_name: string;
      page_title: string;
      total_interviews: number;
    };
    state_level: {
      title: string;
      data: GainLossData[];
    };
    zone_breakdown: GainLossZoneData[];
    zone_pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
  };
  message: string;
  timestamp: string;
}

// Performance Report Interfaces
export interface PerformanceReportSummary {
  sc: string;
  muslim: string;
  ac: number;
  district: number;
  supervisor: number;
  interviewer: number;
  pscovered: number;
  no_of_day: number;
  no_of_ac: number;
  total_interview: number;
  invalid: number;
  reject_auto: number;
  interview_gps_pending: number;
  interview_gps_completed: number;
  interview_in_qc: number;
  interview_in_qc_complete: number;
  interview_in_reqc: number;
  interview_in_reqc_complete: number;
  red: number;
  blue: number;
  amber: number;
  green: number;
  qc_valid: number;
  valid: number;
  valid_with_qc: number;
  assign_to_qc: number;
  assign_to_teleqc: number;
  assign_to_audioqc: number;
  qc_reject: number;
  interview_gps_reject: number;
  reject_without_system: number;
  reject: number;
  interview_male: number;
  interview_female: number;
  without_phone: number;
  sc_category: number;
  muslim_category: number;
  age_18_24: number;
  age_50_above: number;
  target_sample_ac: number;
  target_sample_district: number;
  target_sample_interviewer: number;
  target_sample_supervisor: number;
  target_sample_pollingstation: number;
  avg_loi: number;
  average_per_day: number;
  average_per_day_valid: number;
  valid_after_qc: number;
  without_phone_per: number;
  sc_category_per: number;
  muslim_category_per: number;
  age_18_24_per: number;
  age_50_above_per: number;
  rejection_per: number;
  min_achivement: number;
  max_achivement: number;
  sent_for_1st_level: number;
  sent_for_1st_level_passed: number;
  "1st_level_passed_without_checking": number;
  sent_for_1st_level_failed: number;
  sent_for_1st_level_pending: number;
  sent_for_2nd_level: number;
  sent_for_2nd_level_passed: number;
  sent_for_2nd_level_failed: number;
  sent_for_2nd_level_pending: number;
  reject_short: number;
  reject_duplicatephone: number;
  reject_rta: number;
  reject_qc: number;
  reject_qc_audio_blank: number;
  reject_qc_audio_gender: number;
  reject_qc_audio_irrelevant: number;
  reject_qc_audio_interviewer_more: number;
  reject_qc_audio_mechanical: number;
  reject_qc_audio_respondent: number;
  reject_qc_gps: number;
  without_audio: number;
  without_audio_valid: number;
  valid_without_phone: number;
  valid_without_phone_per: number;
  male_per: number;
  female_per: number;
}

export interface PerformanceReportData {
  // Basic Info
  ac_code: number;
  ac_name: string;
  pc_name: string;
  target_sample: number;
  interviewer: number;
  pscovered: number;
  
  // Interview Counts
  total_interview: number;
  invalid: number;
  reject_auto: number;
  count_after_termination_and_rejection: number;
  
  // GPS Status
  interview_gps_pending: number;
  interview_gps_reject: number;
  
  // QC Status
  interview_in_qc: number;
  interview_in_qc_complete: number;
  interview_in_reqc: number;
  interview_in_reqc_complete: number;
  
  // Final Results
  valid: number;
  reject: number;
  
  // Demographics - Actual Percentages
  sc: string;
  muslim: string;
  
  // Demographics - Interview Percentages
  female_per: number;
  without_phone_per: number;
  sc_category_per: number;
  muslim_category_per: number;
  age_18_24_per: number;
  age_50_above_per: number;
}

export interface PerformanceReportResponse {
  summary: PerformanceReportSummary;
  data: PerformanceReportData[];
}

export interface PerformanceReportParams {
  report_days?: 'all' | 'today' | 'yesterday' | 'dby' | 'l3' | 'l7' | 'l15' | 'currentmonth' | 'custom';
  type?: 'performance' | 'quality';
  level?: 'ac' | 'pc' | 'polingstation' | 'interviewer';
  ac_code?: string;
  custom_date?: string; // YYYY-MM-DD format
  custom_date_end?: string; // YYYY-MM-DD format
}

// AC List interfaces
export interface ACListItem {
  ac_code: number;
  ac_name: string;
  acnameandcode: string;
}

export type ACListResponse = ACListItem[];

// Report Endpoints
export const REPORT_ENDPOINTS = {
  ENUMERATOR_WISE: '/report/enumerator-wise',
  AC_WISE: '/report/acwisereport',
  ASSIGNED_AC: '/report/assigned-ac',
};

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

    // Debug logging for POST and PUT requests
    if (config.method === 'POST' || config.method === 'PUT') {
      console.log(`Making ${config.method} request:`, {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body,
        baseURL: this.baseURL,
        fullEndpoint: endpoint
      });
    }

    try {
      const response = await fetch(url, config);
      
    // Debug response for PUT requests
    if (config.method === 'PUT') {
      console.log(`PUT response status:`, response.status);
      console.log(`PUT response headers:`, Object.fromEntries(response.headers.entries()));
      
      // Clone response to read body without consuming it
      const responseClone = response.clone();
      try {
        const responseText = await responseClone.text();
        console.log(`PUT response body:`, responseText);
        
        // Try to parse as JSON if it looks like JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(responseText);
            console.log(`PUT response JSON:`, jsonData);
          } catch (e) {
            console.log(`PUT response is not valid JSON:`, e);
          }
        }
      } catch (e) {
        console.log(`Could not read PUT response body:`, e);
      }
    }
      
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
      // Don't call global error handler for toggle Re-QC requests
      if (endpoint.includes('toggle-reqc')) {
        throw error; // Re-throw to let our custom handler deal with it
      }
      handleApiError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      console.error(`HTTP Error ${response.status}:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        contentType: contentType
      });

      if (isJson) {
        try {
          const data = await response.json();
          console.error('Error response data:', data);
          console.error('Error response data type:', typeof data);
          console.error('Error response data keys:', Object.keys(data || {}));
          
          // Handle different error response formats
          let errorMessage = `HTTP error! status: ${response.status}`;
          
          if (data && typeof data === 'object') {
            if (data.message) {
              errorMessage = data.message;
            } else if (data.error) {
              errorMessage = data.error;
            } else if (data.details) {
              errorMessage = data.details;
            } else if (Object.keys(data).length > 0) {
              errorMessage = `Server error: ${JSON.stringify(data)}`;
            }
          }
          
          throw new Error(errorMessage);
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        // Handle non-JSON error responses (like HTML 404 pages)
        try {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        } catch (textError) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
      }
    }

    if (isJson) {
      try {
        const data = await response.json();
        
        // Normalize API response format
        // Some APIs return 'status: "success"' instead of 'success: true'
        if (data.status === 'success' && !data.hasOwnProperty('success')) {
          return {
            success: true,
            data: data.data,
            message: data.message || 'Request successful',
            timestamp: data.timestamp || new Date().toISOString()
          };
        }
        
        return data;
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
    } else {
      // For non-JSON successful responses, return a basic success response
      return {
        success: true,
        data: {} as T,
        message: 'Request successful',
        timestamp: new Date().toISOString()
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
      this.saveTokens(response.data.accessToken, response.data.refreshToken);
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
      this.saveTokens(response.data.accessToken, response.data.refreshToken);
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

  async getFieldworkProgress(): Promise<ApiResponse<{
    summary: {
      total_sample: number;
      sample_achieved_numbers: number;
      sample_achieved_percentage: number;
      acs_completed: number;
      acs_in_progress: number;
      acs_yet_to_initiate: number;
    };
    ac_wise_progress: Array<{
      ac_code: number;
      ac_name: string;
      district_name: string;
      target_sample: number;
      valid_interviews: number;
      under_qc_interviews: number;
      total_achieved: number;
      rejected_interviews: number;
      completion_percentage: string;
      status: string;
    }>;
  }>> {
    return this.request(API_ENDPOINTS.DASHBOARD.FIELDWORK_PROGRESS);
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
    const queryString = `?${new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    }).toString()}`;
    return this.request(`/dashboard/team-registration${queryString}`);
  }

  async createTeamRegistration(data: {
    agency_name: string;
    qc_agency_id: number;
    show_second_level_column: number;
    status: number;
    qa_id: number;
    unique_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{
    agencyId: number;
    userId: number;
    agency_name: string;
    unique_id: string;
    message: string;
  }>> {
    return this.request(API_ENDPOINTS.DASHBOARD.TEAM_REGISTRATION_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getTeamRegistrationById(agencyId: number): Promise<ApiResponse<{
    agency_id: number;
    agency_name: string;
    qc_agency_id: number;
    show_second_level_column: number;
    status: number;
    qa_id: number;
    unique_id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
  } | null>> {
    // Use the existing team registration endpoint and filter by agency_id
    // This is a workaround since there might not be a single agency endpoint
    try {
      // Try to find the agency by searching through pages
      let page = 1;
      const limit = 100;
      let foundAgency = null;
      
      // Search through multiple pages if needed (max 10 pages to avoid infinite loop)
      while (page <= 10 && !foundAgency) {
        const response = await this.getTeamRegistration(page, limit);
        
        if (response.success && response.data?.team_registrations) {
          foundAgency = response.data.team_registrations.find(
            (item: any) => item.agency_id === agencyId
          );
          
          if (foundAgency) {
            break;
          }
          
          // If this is the last page, stop searching
          if (!response.data.has_next) {
            break;
          }
          
          page++;
        } else {
          break;
        }
      }
      
      if (foundAgency) {
        // Map the list data to the expected single agency format
        return {
          success: true,
          data: {
            agency_id: foundAgency.agency_id,
            agency_name: foundAgency.agency_name,
            qc_agency_id: 1, // Default value since not available in list
            show_second_level_column: foundAgency.show_second_level_column ? 1 : 0,
            status: foundAgency.status === 'Active' ? 1 : 0,
            qa_id: 1, // Default value since not available in list
            unique_id: foundAgency.username || '', // Use username as unique_id
            first_name: '', // Not available in list
            last_name: '', // Not available in list
            email: '', // Not available in list
            username: foundAgency.username || '',
            password: '********' // Don't return actual password for security
          },
          message: 'Agency found successfully',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          data: null,
          message: `Agency with ID ${agencyId} not found`,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Error fetching agency: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  async updateTeamRegistration(agencyId: number, data: {
    agency_name: string;
    qc_agency_id: number;
    show_second_level_column: number;
    status: number;
    qa_id: number;
    unique_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{
    agencyId: number;
    userId: number;
    agency_name: string;
    unique_id: string;
    message: string;
  }>> {
    return this.request(API_ENDPOINTS.DASHBOARD.TEAM_REGISTRATION_UPDATE(agencyId.toString()), {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getTeamRegistrationDropdownOptions(): Promise<ApiResponse<{
    show_second_level_column: Array<{
      value: number;
      label: string;
    }>;
    status: Array<{
      value: number;
      label: string;
    }>;
  }>> {
    return this.request(API_ENDPOINTS.DASHBOARD.TEAM_REGISTRATION_DROPDOWN_OPTIONS);
  }

  async getQCAgencies(): Promise<ApiResponse<Array<{
    id: number;
    agency_name: string;
    username: string;
  }>>> {
    return this.request(API_ENDPOINTS.DASHBOARD.QC_AGENCIES);
  }

  // Rejection Report Methods
  async getRejectionReport(params?: {
    report_days?: string;
    custom_date?: string;
    custom_date_end?: string;
    report_level?: string;
    interviewer_id?: string;
    enumerator_id?: string;
    ac_code?: string;
    district_code?: string;
    pc_code?: string;
    supervisor_id?: string;
    server_id?: string;
    mobile_no?: string;
    fail_reason?: string;
    qualityreportstatus?: string;
    audio_fail_reason?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{
    interviews: Array<{
      server_id: number;
      interview_date: string;
      ac_code: number;
      ac_name: string;
      district_name: string;
      pc_name: string;
      ps_code: string;
      ps_name: string;
      interviewer_id: string;
      supervisor_id: string;
      user_id: number;
      respondent_name: string;
      mobile_no: string | null;
      status: number;
      status_reason_reject: number;
      fail_reason: string;
      total_duration: number;
      audio_duration: number;
      audio_qc_id: number | null;
      audio_fail_reason: string;
      audio1_status: number;
      audio1_status_label: string;
      qc_recheck_status_audio: number | null;
      qc_recheck_status_audio_label: string;
      outcome_color: string;
      qc_scenario_color: string;
      qc_outcome: string;
      agency_id: number;
      agency_name: string;
      device_id: string;
      start_time: string;
      end_time: string;
      created_at: number;
      updated_at: number;
      audio_available: boolean;
      gps_available: boolean;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
    filters_applied: any;
    sorting: any;
    level_filter: any;
    message: string;
  }>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString()}` : '';
    return this.request(`/progress/rejectreport${queryString}`);
  }

  async downloadRejectionReport(params?: {
    report_days?: string;
    custom_date?: string;
    custom_date_end?: string;
    report_level?: string;
    interviewer_id?: string;
    enumerator_id?: string;
    ac_code?: string;
    district_code?: string;
    pc_code?: string;
    supervisor_id?: string;
    server_id?: string;
    mobile_no?: string;
    fail_reason?: string;
    qualityreportstatus?: string;
  }): Promise<Blob> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString()}` : '';
    
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.DOWNLOAD.REJECTION_REPORT}${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Assigned AC Report Methods
  async getAssignedACReport(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<{
    data: Array<{
      qc_id: number;
      qc_user_name: string;
      mobile_number: string;
      audio: number;
      tele: number;
      gps: number;
      clientaudiocheck: number;
      status: number;
      agency_id: number;
      assignments: Array<{
        ac_code: number;
        ac_name: string;
        interviewer_id: number;
      }>;
    }>;
  }>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${REPORT_ENDPOINTS.ASSIGNED_AC}${queryString}`);
  }

  async getDashboardOverview(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.OVERVIEW);
  }

  async getInterviewLog(params?: {
    server_id?: string;
    interview_date?: string;
    ac_code?: string;
    interviewer_id?: string;
    qc_date?: string;
    qc_id?: string;
    audio_qc_status?: string;
    audio1_status?: string;
    qc_scenario_color?: string;
    page?: number;
    per_page?: number;
    sort_field?: string;
    sort_direction?: 'ASC' | 'DESC';
  }): Promise<ApiResponse<{
    interviews: Array<{
      server_id: number;
      interview_date: string;
      sample_type: string;
      ac_code: number;
      ac_name: string;
      ps_name: string;
      device_id: string;
      interviewer_id: string;
      audio_qc_label: string;
      audio_qc_id: string;
      audio1_status_label: string;
      qc_outcome: string;
      status_label: string;
      gender_label: string;
      gps_available: boolean;
      ps_image_available: boolean;
      selfie_image_available: boolean;
      audio_playback_available: boolean;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
    filters_applied: Record<string, any>;
    sorting: {
      field: string;
      direction: string;
    };
    message: string;
  }>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.INTERVIEW_LOG}${queryString}`);
  }

  async getRecentActivities(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
  }

  async getStatusBreakdown(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.STATUS_BREAKDOWN);
  }

  async getACProgress(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.AC_PROGRESS}${queryString}`);
  }

  async getPollingStations(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.POLLING_STATIONS}${queryString}`);
  }

  async getSurveyDates(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.SURVEY_DATES);
  }

  async getSampleStatistics(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.SAMPLE_STATISTICS);
  }

  async getMasterACList(params?: { 
    page?: number; 
    limit?: number; 
    ac_name?: string; 
    ac_code?: string; 
  }): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.MASTER_AC_LIST}${queryString}`);
  }

  async getMasterACCasteList(params?: { 
    page?: number; 
    limit?: number; 
    caste_name?: string; 
    ac_code?: string; 
    caste_code?: string; 
  }): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.MASTER_AC_CASTE_LIST}${queryString}`);
  }

  async getMasterPollingStationList(params?: { 
    page?: number; 
    limit?: number; 
    polling_station_name?: string; 
    ac_code?: string; 
    polling_station_no?: string; 
  }): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.MASTER_POLLING_STATION_LIST}${queryString}`);
  }

  async getMasterACForUpdate(acCode: number): Promise<ApiResponse<any>> {
    return this.request(`${API_ENDPOINTS.DASHBOARD.MASTER_AC_UPDATE}/${acCode}`);
  }

  async getMasterACIndexForUpdate(acCode: number): Promise<ApiResponse<any>> {
    const queryString = `?ac_code=${acCode}`;
    return this.request(`${API_ENDPOINTS.DASHBOARD.MASTER_AC_INDEX_UPDATE}${queryString}`);
  }


  async getPSFormList(params?: { page?: number; limit?: number; polling_station_name?: string; polling_station_no?: string; ac_code?: string }): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.DASHBOARD.PS_FORM_LIST}${queryString}`);
  }

  async getPSFormForUpdate(id: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD.PS_FORM_UPDATE(id));
  }

  async updatePSForm(id: string, psData: any): Promise<ApiResponse<any>> {
    const url = `${API_ENDPOINTS.DASHBOARD.PS_FORM_UPDATE_SUBMIT}?id=${id}`;
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(psData),
    });
  }

  async downloadPSForm(): Promise<Blob> {
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.DASHBOARD.PS_FORM_DOWNLOAD}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Demographic Methods
  async getDemographicGenderWise(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DEMOGRAPHIC.GENDER_WISE);
  }

  async getDemographicAgeWise(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DEMOGRAPHIC.AGE_WISE);
  }

  async getDemographicCasteWise(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DEMOGRAPHIC.CASTE_WISE);
  }

  async getDemographicReligionWise(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DEMOGRAPHIC.RELIGION_WISE);
  }

  async getDemographicSocialCategoryWise(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DEMOGRAPHIC.SOCIAL_CATEGORY_WISE);
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
  async getAgencies(): Promise<ApiResponse<{ [key: string]: string }>> {
    return this.request(API_ENDPOINTS.DROPDOWN.AGENCIES);
  }

  async updateMasterACIndex(acCode: number, agencyId: number): Promise<ApiResponse<any>> {
    const queryString = `?ac_code=${acCode}`;
    return this.request(`${API_ENDPOINTS.DASHBOARD.MASTER_AC_INDEX_UPDATE}${queryString}`, {
      method: 'PUT',
      body: JSON.stringify({ agency_id: agencyId })
    });
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

  async createQCTeamRegistration(data: {
    agency_name: string;
    status: number;
    unique_id: string;
    password: string;
  }): Promise<ApiResponse<{
    agency_id: number;
    user_id: number;
    agency_name: string;
    status: number;
    unique_id: string;
  }>> {
    return this.request(API_ENDPOINTS.QC.TEAM_REGISTRATION, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getQCTeamRegistrations(params?: { page?: number; pageSize?: number }): Promise<ApiResponse<{
    agencies: Array<{
      agency_id: number;
      agency_name: string;
      supervisor_username: string;
      status: string;
      total_users: number;
      supervisor_details: any;
      created_at: string | number;
      updated_at: string | number;
    }>;
    pagination: {
      total_count: number;
      page_count: number;
      current_page: number;
      per_page: number;
    };
  }>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.QC.TEAM_REGISTRATIONS}${queryString}`);
  }

  async updateQCTeamRegistration(id: string, data: {
    agency_name: string;
    status: number;
    unique_id: string;
    password?: string;
    qc_agency_id: number;
    show_second_level_column: number;
    qa_id: number;
    first_name: string;
    last_name: string;
    email: string;
  }): Promise<ApiResponse<{
    agency_id: number;
    user_id: number;
    agency_name: string;
    status: number;
    unique_id: string;
  }>> {
    console.log('🔄 API Service: Updating QC team registration:', { id, data });
    console.log('🔄 API Service: Endpoint:', API_ENDPOINTS.QC.TEAM_REGISTRATION_UPDATE(id));
    console.log('🔄 API Service: Full URL:', `${this.baseURL}${API_ENDPOINTS.QC.TEAM_REGISTRATION_UPDATE(id)}`);
    console.log('🔄 API Service: Request body:', JSON.stringify(data));
    console.log('🔄 API Service: Request headers will include:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer [token]'
    });
    
    // Use the QC endpoint for QC team registration updates
    const qcEndpoint = API_ENDPOINTS.QC.TEAM_REGISTRATION_UPDATE(id);
    console.log('🔄 API Service: Using QC endpoint:', qcEndpoint);
    console.log('🔄 API Service: QC URL:', `${this.baseURL}${qcEndpoint}`);
    
    try {
      const response = await this.request<{
        agency_id: number;
        user_id: number;
        agency_name: string;
        status: number;
        unique_id: string;
      }>(qcEndpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('🔄 API Service: Response received:', response);
      return response;
    } catch (error) {
      console.error('🔄 API Service: Error in updateQCTeamRegistration:', error);
      console.error('🔄 API Service: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
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

  async getDetailedCasteData(params?: { progress_type?: number; ac_code?: number; pc_code?: number; caste_not_met?: string }): Promise<ApiResponse<DetailedCasteResponse>> {
    const stringParams: Record<string, string> = {};
    if (params) {
      if (params.progress_type) stringParams.progress_type = params.progress_type.toString();
      if (params.ac_code) stringParams.ac_code = params.ac_code.toString();
      if (params.pc_code) stringParams.pc_code = params.pc_code.toString();
      if (params.caste_not_met) stringParams.caste_not_met = params.caste_not_met;
    }
    const queryString = Object.keys(stringParams).length ? `?${new URLSearchParams(stringParams).toString()}` : '';
    return this.request<DetailedCasteResponse>(`${API_ENDPOINTS.DEMOGRAPHIC.CASTE_DETAILS}${queryString}`);
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

  // Field Data (FD) Methods
  async getFDInternalDashboard(params?: { page?: number; limit?: number }): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.FD.INTERNAL_DASHBOARD}${queryString}`);
  }

  async getInterviewAudio(params?: { page?: number; limit?: number; server_id?: string; ac_code?: string; interview_date?: string }): Promise<ApiResponse<{
    data: Array<{
      server_id: number;
      ac_code: number;
      ac_name: string;
      interview_date: string;
      interview_audio: string;
    }>;
    pagination?: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
    filters?: {
      ac_codes?: Array<{
        ac_code: number;
        ac_name: string;
      }>;
      interview_dates?: string[];
    };
  }>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.FD.INTERVIEW_AUDIO_SEARCH_CAPI}${queryString}`);
  }

  async getCatiInterviewAudio(params?: { page?: number; limit?: number; id?: string; ac_code?: string; interview_date?: string }): Promise<ApiResponse<{
    data: Array<{
      id: number;
      ac_code: number;
      ac_name: string;
      audio: string;
      interview_date: string;
    }>;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters?: {
      ac_codes?: Array<{
        ac_code: number;
        ac_name: string;
      }>;
      interview_dates?: string[];
    };
  }>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`${API_ENDPOINTS.FD.INTERVIEW_AUDIO}${queryString}`);
  }

  async toggleReQcStatus(agencyId: number, dataSendForReqc: number): Promise<ApiResponse<{
    agencyId: number;
    data_send_for_reqc: number;
    message: string;
  }>> {
    console.log('Attempting toggle Re-QC with:', { agencyId, dataSendForReqc });
    
    // Try the original endpoint first
    try {
      const primaryEndpoint = '/dashboard/team-registration/newregistration/toggle-reqc';
      console.log('Trying primary endpoint:', primaryEndpoint);
      
      return await this.request(primaryEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          agency_id: agencyId,
          data_send_for_reqc: dataSendForReqc
        })
      });
    } catch (error) {
      console.error('Primary endpoint failed:', error);
      
      // Try alternative endpoint format
      try {
        const secondaryEndpoint = '/dashboard/team-registration/toggle-reqc';
        console.log('Trying alternative endpoint:', secondaryEndpoint);
        
        return await this.request(secondaryEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            agency_id: agencyId,
            data_send_for_reqc: dataSendForReqc
          })
        });
      } catch (secondError) {
        console.error('Both endpoints failed:', { 
          primary: error, 
          secondary: secondError,
          agencyId,
          dataSendForReqc
        });
        throw secondError; // Throw the second error
      }
    }
  }

  // Interview Masters Methods
  async getInterviewMasters(params?: { page?: number; limit?: number }): Promise<ApiResponse<InterviewMastersResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.INTERVIEW_MASTERS}?${queryParams.toString()}`
      : `${API_ENDPOINTS.INTERVIEW_MASTERS}`;
    
    return this.request(url);
  }

  async getInterviewerAssignedACs(userId: string): Promise<ApiResponse<{ user_id: number; fullname: string; assigned_ac: number[] }>> {
    return this.request(`${API_ENDPOINTS.INTERVIEW_MASTERS}/assigned-ac?user_id=${userId}`);
  }

  async updateInterviewerAssignedACs(userId: string, assignedACs: number[]): Promise<ApiResponse<any>> {
    const url = `${API_ENDPOINTS.INTERVIEW_MASTERS}/update?user_id=${userId}`;
    const body = JSON.stringify({
      assigned_ac: assignedACs
    });
    
    console.log('API Request:', {
      url,
      method: 'PUT',
      body,
      userId,
      assignedACs
    });
    
    return this.request(url, {
      method: 'PUT',
      body
    });
  }

  // Interview Assigned Methods
  async getAssignedInterviewers(params?: { page?: number; limit?: number }): Promise<ApiResponse<{ total: number; data: Array<{ user_id: number; fullname: string; login_id: string; assigned_ac: number[]; agency_name?: string }> }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.INTERVIEW_ASSIGNED}/list?${queryParams.toString()}`
      : `${API_ENDPOINTS.INTERVIEW_ASSIGNED}/list`;
    
    return this.request(url);
  }

  async getInterviewMasterForUpdate(userId: string): Promise<ApiResponse<{ user_id: number; fullname: string; login_id: string; total_data_submitted: number; is_active: boolean; assigned_ac: number[]; updated_at: string }>> {
    return this.request(`${API_ENDPOINTS.INTERVIEW_MASTERS}/update?user_id=${userId}`);
  }

  async getACList(): Promise<ApiResponse<Array<{ value: number; label: string }>>> {
    return this.request(`${API_ENDPOINTS.INTERVIEW_MASTERS}/ac-list`);
  }

  async getACDropdownList(): Promise<ApiResponse<Record<string, string>>> {
    return this.request(API_ENDPOINTS.DROPDOWN.AC_LIST);
  }

  async getInterviewerDropdownList(): Promise<ApiResponse<Record<string, string>>> {
    return this.request(API_ENDPOINTS.DROPDOWN.INTERVIEWERS);
  }

  // Filter Options Methods
  async getRejectionReportFilterOptions(): Promise<ApiResponse<{
    report_days: Record<string, string>;
    report_levels: Record<string, string>;
    quality_statuses: Record<string, string>;
  }>> {
    return this.request(API_ENDPOINTS.FILTER_OPTIONS.REJECTION_REPORT);
  }

  // QC User Registration Methods
  async getQCUserRegistration(params?: {
    qc_id?: string;
    name?: string;
    mobile_number?: string;
    status?: string;
    gps?: number;
    audio?: number;
    clientaudiocheck?: number;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{
    qc_users: Array<{
      id: number;
      qc_id: number;
      name: string;
      mobile_number: string;
      audio: number;
      gps: number;
      tele: number;
      agency_id: number;
      status: string;
      clientaudiocheck: number;
      access_permissions: {
        audio_qc: boolean;
        gps_qc: boolean;
        tele_qc: boolean;
        rechecking: boolean;
      };
      assigned_ac_count: number;
      assigned_ac_interviewers: string;
      created_at: number | string;
      updated_at: number | string;
    }>;
    statistics: {
      total_users: number;
      active_users: string;
      inactive_users: string;
      audio_qc_users: string;
      gps_qc_users: string;
      rechecking_users: string;
    };
    filters_applied?: {
      qc_id?: number;
      name?: string;
      mobile_number?: string;
      status?: number;
      gps?: number;
      audio?: number;
      clientaudiocheck?: number;
    };
    pagination: {
      total_count: number;
      page_count: number;
      current_page: number;
      per_page: number;
    };
  }>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString()}` : '';
    return this.request(`${API_ENDPOINTS.QC_USER_REGISTRATION}${queryString}`);
  }

  // QC User Progress Methods
  async getQCUserProgress(params?: {
    qc_id?: string;
    name?: string;
    telecaller_status?: string;
    report_type?: string;
    custom_date?: string;
    custom_date_end?: string;
    qc_complete_date?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{
    data: Array<{
      qc_id: number;
      name: string;
      mobile_number: string;
      audio: number;
      gps: number;
      tele: number;
      agency_id: number;
      status: string;
      statistics: {
        audio_qc_completed: number;
        audio_qc_pass: number;
        audio_qc_fail: number;
        audio_qc_fail_blank_audio: number;
        audio_qc_fail_irrelevant: number;
      };
    }>;
    pagination: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number | boolean;
    };
    summary: string;
    report_type: string;
    filters_applied?: {
      qc_id?: number;
      name?: string;
      telecaller_status?: number;
      report_type?: string;
      custom_date?: string;
      custom_date_end?: string;
      qc_complete_date?: string;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.QC_USER_PROGRESS}?${queryParams.toString()}`
      : API_ENDPOINTS.QC_USER_PROGRESS;
    
    return this.request(url);
  }

  // QC User Pending Data Methods
  async getQCUserPendingData(): Promise<ApiResponse<{
    data: Array<{
      qc_id: number;
      name: string;
      pending_interview: number;
    }>;
    pagination: {
      page: number;
      pageSize: number | boolean;
      totalCount: number;
      pageCount: number;
    };
  }>> {
    return this.request(API_ENDPOINTS.QC_USER_PENDING_DATA);
  }

  // Gain and Losses Methods
  async getGainAndLosses(): Promise<ApiResponse<GainLossResponse['data']>> {
    return this.request(API_ENDPOINTS.FINDINGS.GAIN_AND_LOSSES);
  }

  // Project Settings APIs
  async getProjectSettings(): Promise<ApiResponse<{
    id: number;
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
    instance_loi: number;
    instance_audio1: string;
    instance_audio2: string;
    instance_audio3: string;
    quality_check_type: number;
    total_sample: number;
    ac_sample: number;
    pollingstation_sample: number;
    enumerator_sample: number;
    female_quota: number;
    ps_cricle_radius: number;
    survey_start_date: string;
    survey_end_date: string | null;
    qc_theme: number;
    client_theme: number;
    pmt_theme: number;
    quality_theme: number;
  }>> {
    return this.request(`${API_ENDPOINTS.PROJECT_SETTINGS.GET}`);
  }

  async updateProjectSettings(data: {
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
  }): Promise<ApiResponse<{
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
    message: string;
  }>> {
    return this.request(`${API_ENDPOINTS.PROJECT_SETTINGS.UPDATE}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProjectInstanceSettings(data: {
    instance_loi: number;
    instance_audio1: string;
    instance_audio2: string;
    instance_audio3: string;
    quality_check_type: number;
  }): Promise<ApiResponse<{
    id: number;
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
    instance_loi: number;
    instance_audio1: string;
    instance_audio2: string;
    instance_audio3: string;
    quality_check_type: number;
  }>> {
    return this.request(`${API_ENDPOINTS.PROJECT_SETTINGS.UPDATE_INSTANCE}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProjectSampleSettings(data: {
    total_sample: number;
    ac_sample: number;
    pollingstation_sample: number;
    enumerator_sample: number;
    female_quota: number;
    ps_cricle_radius: number;
  }): Promise<ApiResponse<{
    id: number;
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
    instance_loi: number;
    instance_audio1: string;
    instance_audio2: string;
    instance_audio3: string;
    quality_check_type: number;
    total_sample: number;
    ac_sample: number;
    pollingstation_sample: number;
    enumerator_sample: number;
    female_quota: number;
    ps_cricle_radius: number;
    survey_start_date: string;
    survey_end_date: string | null;
    qc_theme: number;
    client_theme: number;
    pmt_theme: number;
    quality_theme: number;
  }>> {
    return this.request(`${API_ENDPOINTS.PROJECT_SETTINGS.UPDATE_SAMPLE}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProjectDatesSettings(data: {
    survey_start_date: string;
    survey_end_date: string;
  }): Promise<ApiResponse<{
    id: number;
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
    instance_loi: number;
    instance_audio1: string;
    instance_audio2: string;
    instance_audio3: string;
    quality_check_type: number;
    total_sample: number;
    ac_sample: number;
    pollingstation_sample: number;
    enumerator_sample: number;
    female_quota: number;
    ps_cricle_radius: number;
    survey_start_date: string;
    survey_end_date: string | null;
    qc_theme: number;
    client_theme: number;
    pmt_theme: number;
    quality_theme: number;
  }>> {
    return this.request(`${API_ENDPOINTS.PROJECT_SETTINGS.UPDATE_DATES}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProjectThemesSettings(data: {
    qc_theme: number;
    client_theme: number;
    pmt_theme: number;
    quality_theme: number;
  }): Promise<ApiResponse<{
    id: number;
    form_id: number;
    project_name: string;
    pm_ids: string;
    audio_qc_form_id: number;
    audio_re_qc_form_id: number;
    voice_broadcast_announcement_id: number;
    instance_loi: number;
    instance_audio1: string;
    instance_audio2: string;
    instance_audio3: string;
    quality_check_type: number;
    total_sample: number;
    ac_sample: number;
    pollingstation_sample: number;
    enumerator_sample: number;
    female_quota: number;
    ps_cricle_radius: number;
    survey_start_date: string;
    survey_end_date: string | null;
    qc_theme: number;
    client_theme: number;
    pmt_theme: number;
    quality_theme: number;
  }>> {
    return this.request(`${API_ENDPOINTS.PROJECT_SETTINGS.UPDATE_THEMES}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Performance Report Methods
  async getPerformanceReport(params?: PerformanceReportParams): Promise<ApiResponse<PerformanceReportResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.report_days) {
      queryParams.append('report_days', params.report_days);
    }
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    if (params?.level) {
      queryParams.append('level', params.level);
    }
    if (params?.ac_code) {
      queryParams.append('ac_code', params.ac_code);
    }
    if (params?.custom_date) {
      queryParams.append('custom_date', params.custom_date);
    }
    if (params?.custom_date_end) {
      queryParams.append('custom_date_end', params.custom_date_end);
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.PERFORMANCE_REPORT}?${queryString}` : API_ENDPOINTS.PERFORMANCE_REPORT;
    
    return this.request<PerformanceReportResponse>(endpoint);
  }

  async getPerformanceReportACList(): Promise<ApiResponse<ACListResponse>> {
    return this.request<ACListResponse>(API_ENDPOINTS.PERFORMANCE_REPORT_AC_LIST);
  }

  async getPSDetails(params: {
    ac_code?: string;
    pc_code?: string;
    report_days: string;
    custom_date?: string;
    custom_date_end?: string;
    ps_covered: string;
  }): Promise<ApiResponse<{
    title: string;
    ps_covered_type: string;
    total_ps_covered: number;
    ps_list: Array<{
      sr_no: number;
      ps_code: string;
      no_of_interviewers_worked: number;
      completed_interviews: number;
      valid_interviews: number;
      interviews_under_qc: number;
      rejected_interviews: number;
      interviewers: Array<{
        interviewer_id: string;
        full_interviews: number;
      }>;
    }>;
    applied_filters: {
      ps_covered: string;
      report_days: string;
      ac_code?: number;
      pc_code?: string;
      agency_id: number | null;
      is_ppm_user: boolean;
    };
  }>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/ps-covered?${queryString}`;
    
    return this.request<{
      title: string;
      ps_covered_type: string;
      total_ps_covered: number;
      ps_list: Array<{
        sr_no: number;
        ps_code: string;
        no_of_interviewers_worked: number;
        completed_interviews: number;
        valid_interviews: number;
        interviews_under_qc: number;
        rejected_interviews: number;
        interviewers: Array<{
          interviewer_id: string;
          full_interviews: number;
        }>;
      }>;
      applied_filters: {
        ps_covered: string;
        report_days: string;
        ac_code?: number;
        pc_code?: string;
        agency_id: number | null;
        is_ppm_user: boolean;
      };
    }>(endpoint);
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Enumerator Wise Report Methods
  async getEnumeratorWiseReport(params?: {
    user_id?: string;
    interview_date?: string;
    device_id?: string;
    progressphase?: string;
    progress_phase?: string; // Alternative parameter name
    qcuser_qc_id?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<{
    data: Array<{
      id: number;
      user_id: number;
      interview_date: string;
      device_id: string;
      interviewerids: string;
      total_interview: number;
      total_interview_without_phone: number;
      valid_interview: number;
      invalid_interview: number;
      reject_interview: number;
      reject_interview_system: number;
      underqc_interview: number;
      progress_phase: number;
      progressphase: string;
      teleqcstatus: string;
      audioqcstatus: string;
      qcuser: {
        qc_id: number;
        name: string;
        qcnameandid: string;
      } | null;
    }>;
    pagination?: {
      page: number;
      pageSize: number;
      totalCount: number;
      pageCount: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.request(`${REPORT_ENDPOINTS.ENUMERATOR_WISE}${queryString ? `?${queryString}` : ''}`);
  }

  // Second Choice Methods
  async getSecondChoiceData(): Promise<ApiResponse<{
    page_info: {
      page_name: string;
      page_title: string;
      total_interviews: number;
    };
    state_level: {
      title: string;
      data: Array<{
        first_choice: string;
        second_choice_breakdown: {
          BJP: number;
          JDU: number;
          HAMS: number;
          VSIP: number;
          "LJP(RV)": number;
          INC: number;
          RJD: number;
          "CPI(M)": number;
          JSP: number;
          Others: number;
          NWR: number;
        };
      }>;
    };
    zone_breakdown: Array<{
      zone_code: number;
      zone_name: string;
      data: Array<{
        first_choice: string;
        second_choice_breakdown: {
          BJP: number;
          JDU: number;
          HAMS: number;
          VSIP: number;
          "LJP(RV)": number;
          INC: number;
          RJD: number;
          "CPI(M)": number;
          JSP: number;
          Others: number;
          NWR: number;
        };
      }>;
    }>;
    zone_pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
  }>> {
    return this.request('/dashboard/findings/second-choice');
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

  // CATI AC Progress Report
  async getCATIACData(): Promise<ApiResponse<CATIACData[]>> {
    return this.request(`${API_ENDPOINTS.FD.AC_WISE_DATA}/all`);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
