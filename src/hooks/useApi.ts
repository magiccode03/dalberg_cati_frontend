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
