/**
 * React Hooks for API Service
 * Provides easy-to-use hooks for API calls with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse } from '@/lib/api';

// Generic API Hook
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'API call failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// Authentication Hooks
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (uniqueId: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login({ uniqueId, password });
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Login failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Registration failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, logout, register, loading, error };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Token might be invalid, clear it
            apiService.logout();
          }
        } catch (error) {
          // Token might be invalid, clear it
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (uniqueId: string, password: string) => {
    const result = await apiService.login({ uniqueId, password });
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (userData: any) => {
    const result = await apiService.register(userData);
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register,
  };
}

// User Management Hooks (SUPER ADMIN only)
export function useUsers() {
  return useApi(() => apiService.getUsers());
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createUser(userData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to create user');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (id: string, userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateUser(id, userData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update user');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deleteUser(id);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to delete user');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUser, loading, error };
}

// Dashboard Hooks
export function useDashboardStats() {
  return useApi(() => apiService.getDashboardStats());
}

export function useDashboardOverview() {
  return useApi(() => apiService.getDashboardOverview());
}

export function useRecentActivities() {
  return useApi(() => apiService.getRecentActivities());
}

// Analysis Hooks
export function useVoteShareAnalysis(params?: any) {
  return useApi(() => apiService.getVoteShareAnalysis(params), [params]);
}

export function useProgressAnalysis(params?: any) {
  return useApi(() => apiService.getProgressAnalysis(params), [params]);
}

// PMT Hooks
export function useAgencies() {
  return useApi(() => apiService.getAgencies());
}

export function useAuditLogs(params?: any) {
  return useApi(() => apiService.getAuditLogs(params), [params]);
}

// QC Hooks
export function useQCTasks() {
  return useApi(() => apiService.getQCTasks());
}

export function useGPSData(params?: any) {
  return useApi(() => apiService.getGPSData(params), [params]);
}

// Team Registration Hooks
export function useTeamRegistration(page: number = 1, limit: number = 20) {
  return useApi(() => apiService.getTeamRegistration(page, limit), [page, limit]);
}

// Rejection Report Hooks
export function useRejectionReport(params?: any) {
  return useApi(() => apiService.getRejectionReport(params), [
    params?.report_days,
    params?.custom_date,
    params?.custom_date_end,
    params?.report_level,
    params?.interviewer_id,
    params?.enumerator_id,
    params?.ac_code,
    params?.district_code,
    params?.pc_code,
    params?.supervisor_id,
    params?.server_id,
    params?.mobile_no,
    params?.fail_reason,
    params?.page,
    params?.per_page
  ]);
}

export function useToggleReQcStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleReQc = async (agencyId: number, dataSendForReqc: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Toggling Re-QC status:', { agencyId, dataSendForReqc });
      
      // First, let's test if the endpoint exists with a simple request
      console.log('Testing endpoint availability...');
      
      const response = await apiService.toggleReQcStatus(agencyId, dataSendForReqc);
      
      console.log('Toggle Re-QC response:', response);
      
      return response;
    } catch (err: any) {
      console.error('Toggle Re-QC error:', err);
      
      let errorMessage = 'Failed to toggle Re-QC status';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Add more specific error information
      if (err.message?.includes('500')) {
        errorMessage += ' (Server Error - Check if endpoint exists)';
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { toggleReQc, loading, error };
}

// Data Quality Hooks
export function useDataValidation() {
  return useApi(() => apiService.getDataValidation());
}

export function useQualityMetrics() {
  return useApi(() => apiService.getQualityMetrics());
}

export function useQualityIssues() {
  return useApi(() => apiService.getQualityIssues());
}

// Team Registration Hooks
export function useCreateTeamRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeamRegistration = useCallback(async (data: {
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
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createTeamRegistration(data);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to create team registration');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTeamRegistration, loading, error };
}

// Team Registration Update Hook
export function useUpdateTeamRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTeamRegistration = useCallback(async (agencyId: number, data: {
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
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateTeamRegistration(agencyId, data);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update team registration');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTeamRegistration, loading, error };
}

// Get Team Registration by ID Hook
export function useGetTeamRegistrationById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeamRegistrationById = useCallback(async (agencyId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getTeamRegistrationById(agencyId);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch team registration');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getTeamRegistrationById, loading, error };
}

// Fieldwork Progress Hook
export function useFieldworkProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFieldworkProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getFieldworkProgress();
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch fieldwork progress');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getFieldworkProgress, loading, error };
}

// Utility Hook for Manual API Calls
export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'API call failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}
