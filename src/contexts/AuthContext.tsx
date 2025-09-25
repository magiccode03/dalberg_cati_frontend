'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';

export interface User {
  id: string;
  uniqueId: string; // Alphanumeric/numeric unique ID
  name: string;
  email?: string; // Optional email for notifications
  role: string;
  avatar?: string;
  permissions?: string[];
  lastLogin?: string;
  department?: string;
  designation?: string;
  createdBy?: string; // SUPER ADMIN who created this user
  createdAt?: string;
  isActive?: boolean;
  password?: string; // Only for SUPER ADMIN user management
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (uniqueId: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  // SUPER ADMIN functions
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  updateUserById: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getAllUsers: () => User[];
  generateUniqueId: (role: string) => string;
  getRedirectUrl: (role: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      try {
        const isAuth = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('user');
        const usersData = localStorage.getItem('allUsers');

        if (isAuth === 'true' && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }

        // Load all users for SUPER ADMIN functionality
        if (usersData) {
          setAllUsers(JSON.parse(usersData));
        } else {
          // Initialize with default SUPER ADMIN user
          const defaultUsers = [
            {
              id: '1',
              uniqueId: 'SUPER001',
              name: 'Super Administrator',
              email: 'superadmin@bihar2025.gov.in',
              role: 'super_admin',
              avatar: '/logo.png',
              permissions: ['*'],
              department: 'Administration',
              designation: 'Super Administrator',
              createdBy: 'system',
              createdAt: new Date().toISOString(),
              isActive: true,
              password: 'super123',
            }
          ];
          setAllUsers(defaultUsers);
          localStorage.setItem('allUsers', JSON.stringify(defaultUsers));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (uniqueId: string, password: string, rememberMe = false): Promise<{ success: boolean; user?: User }> => {
    try {
      setIsLoading(true);

      // Use API service for login
      const response = await apiService.login({ uniqueId, password });
      
      if (response.success && response.data) {
        const { user: apiUser, token, refreshToken } = response.data;
        
        // Transform API user to our User interface
        const userData: User = {
          id: apiUser.id.toString(),
          uniqueId: apiUser.uniqueId,
          name: `${apiUser.firstName} ${apiUser.lastName}`,
          email: apiUser.email,
          role: apiUser.role.name,
          avatar: '/logo.png',
          permissions: getDefaultPermissions(apiUser.role.name),
          lastLogin: apiUser.lastLoginAt,
          department: 'Administration', // Default value
          designation: apiUser.role.displayName,
          createdBy: 'system',
          createdAt: apiUser.createdAt,
          isActive: apiUser.isActive,
        };

        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        return { success: true, user: userData };
      }

      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    const permissions = {
      'super_admin': ['*'],
      'admin': ['admin:read', 'admin:write', 'dashboard:read'],
      'pmt': ['pmt:read', 'pmt:write', 'dashboard:read'],
      'qc_manager': ['qc:read', 'qc:write', 'dashboard:read'],
      'quality_analyst': ['analysis:read', 'dashboard:read'],
      'start_qc': ['qc:read', 'dashboard:read'],
      'data_quality': ['data:read', 'data:write', 'dashboard:read'],
      'convergent_analysis': ['analysis:read', 'analysis:write', 'dashboard:read'],
    };
    return permissions[role as keyof typeof permissions] || ['dashboard:read'];
  };

  const logout = async () => {
    try {
      // Call API logout endpoint
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      router.push('/login');
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Use API service for registration
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user: apiUser, token, refreshToken } = response.data;
        
        // Transform API user to our User interface
        const userData: User = {
          id: apiUser.id.toString(),
          uniqueId: apiUser.uniqueId,
          name: `${apiUser.firstName} ${apiUser.lastName}`,
          email: apiUser.email,
          role: apiUser.role.name,
          avatar: '/logo.png',
          permissions: getDefaultPermissions(apiUser.role.name),
          lastLogin: apiUser.lastLoginAt,
          department: 'Administration', // Default value
          designation: apiUser.role.displayName,
          createdBy: 'system',
          createdAt: apiUser.createdAt,
          isActive: apiUser.isActive,
        };

        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions?.includes('*')) return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasAllRoles = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.every(role => user.role === role);
  };

  // SUPER ADMIN functions
  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      if (!user || user.role !== 'super_admin') {
        return false;
      }

      // Use API service to create user
      const response = await apiService.createUser({
        uniqueId: userData.uniqueId,
        email: userData.email || '',
        firstName: userData.name.split(' ')[0] || '',
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        password: userData.password || '',
        roleId: getRoleId(userData.role),
        isActive: userData.isActive ?? true,
      });

      if (response.success) {
        // Update local users list
        const newUser: User = {
          ...userData,
          id: response.data.id.toString(),
          createdAt: response.data.createdAt,
          createdBy: user.id,
          isActive: response.data.isActive,
        };

        const updatedUsers = [...allUsers, newUser];
        setAllUsers(updatedUsers);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  const getRoleId = (roleName: string): number => {
    const roleMap = {
      'super_admin': 1,
      'admin': 2,
      'pmt': 3,
      'qc_manager': 4,
      'quality_analyst': 5,
      'start_qc': 6,
      'data_quality': 7,
      'convergent_analysis': 8,
    };
    return roleMap[roleName as keyof typeof roleMap] || 2;
  };

  const updateUserById = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user || user.role !== 'super_admin') {
        return false;
      }

      // Use API service to update user
      const response = await apiService.updateUser(userId, {
        email: userData.email,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        password: userData.password,
        roleId: userData.role ? getRoleId(userData.role) : undefined,
        isActive: userData.isActive,
      });

      if (response.success) {
        const updatedUsers = allUsers.map(u => 
          u.id === userId ? { ...u, ...userData } : u
        );
        setAllUsers(updatedUsers);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      if (!user || user.role !== 'super_admin') {
        return false;
      }

      // Don't allow deleting self
      if (userId === user.id) {
        return false;
      }

      // Use API service to delete user
      const response = await apiService.deleteUser(userId);
      
      if (response.success) {
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        setAllUsers(updatedUsers);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const getAllUsers = (): User[] => {
    return allUsers.filter(u => u.id !== user?.id); // Don't return current user
  };

  const generateUniqueId = (role: string): string => {
    const rolePrefix = {
      'super_admin': 'SUPER',
      'admin': 'ADMIN',
      'pmt': 'PMT',
      'qc_manager': 'QC',
      'quality_analyst': 'QA',
      'start_qc': 'SQC',
      'data_quality': 'DQ',
      'convergent_analysis': 'CA',
    };

    const prefix = rolePrefix[role as keyof typeof rolePrefix] || 'USER';
    const existingIds = allUsers.map(u => u.uniqueId);
    
    let counter = 1;
    let newId = `${prefix}${counter.toString().padStart(3, '0')}`;
    
    while (existingIds.includes(newId)) {
      counter++;
      newId = `${prefix}${counter.toString().padStart(3, '0')}`;
    }
    
    return newId;
  };

  const getRedirectUrl = (role: string): string => {
    const roleRedirects: { [key: string]: string } = {
      'super_admin': '/super-admin/dashboard',
      'admin': '/dashboard',
      'pmt': '/pmt/dashboard',
      'qc': '/dashboard/qc',
      'quality_analyst': '/dashboard/quality-analyst',
      'start_qc': '/dashboard/start-qc',
      'data_quality': '/dashboard/data-quality',
    };

    return roleRedirects[role] || '/dashboard';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    createUser,
    updateUserById,
    deleteUser,
    getAllUsers,
    generateUniqueId,
    getRedirectUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
