'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api-service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserCog, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface User {
  id: number;
  uniqueId: string;
  email: string;
  firstName: string;
  lastName: string;
  portalSlug: string;
  roleId: number;
  roleName: string;
  roleDisplayName: string;
  roleLevel: number;
  isActive: number | boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  displayName: string;
  level: number;
}

export default function PortalAdminUsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (page = 1, limit = 10, search = '', role = '', status = '') => {
    setLoading(true);
    setError(null);
    try {
      // Build API parameters
      const params: any = {
        page,
        limit,
      };
      
      // Add search parameter (name filter)
      if (search) {
        params.name = search;
      }
      
      // Add role filter
      if (role) {
        // Find role ID from role name
        const selectedRole = roles.find(r => r.name === role);
        if (selectedRole) {
          params.role_id = selectedRole.id;
        }
      }
      
      // Add status filter
      if (status !== '') {
        params.isActive = status === '1';
      }
      
      const response = await apiService.getUsers(params);
      
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        
        // Update pagination with API response
        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page || page,
            limit: response.data.pagination.limit || limit,
            total: response.data.pagination.total || 0,
            totalPages: response.data.pagination.totalPages || 0,
          });
        } else {
          // Fallback if no pagination in response
          const total = response.data.users?.length || 0;
          setPagination({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          });
        }
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiService.getRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleCreateUser = () => {
    router.push('/portal-admin/users/create');
  };

  const handleEditUser = (user: User) => {
    router.push(`/portal-admin/users/edit/${user.id}`);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await apiService.deleteUser(userId.toString());
        if (response.success) {
          setSuccess('User deleted successfully!');
          fetchUsers(pagination.page, pagination.limit, searchTerm, filterRole, filterStatus);
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        setError('Error deleting user');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    fetchUsers(1, pagination.limit, searchTerm, filterRole, filterStatus);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, pagination.limit, searchTerm, filterRole, filterStatus);
  };

  const roleOptions = [
    { label: 'All Roles', value: '' },
    ...roles.map(role => ({
      label: role.displayName,
      value: role.name,
    })),
  ];

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
  ];

  if (currentUser?.role !== 'portal_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert type="error" title="Access Denied">
          You do not have permission to access user management.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/portal-admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage portal users and their access.
            </p>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" title="Error" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" title="Success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Filters and Actions */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name, email, or unique ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              fetchUsers(1, pagination.limit, searchTerm, e.target.value, filterStatus);
            }}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              fetchUsers(1, pagination.limit, searchTerm, filterRole, e.target.value);
            }}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              onClick={() => fetchUsers(pagination.page, pagination.limit, searchTerm, filterRole, filterStatus)} 
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading users..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  (users || []).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.uniqueId}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status="active"
                          variant={user.roleName === 'super_admin' ? 'info' : user.roleName === 'admin' ? 'info' : 'default'}
                          size="sm"
                        >
                          {user.roleDisplayName}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={user.isActive === 1 || user.isActive === true ? 'active' : 'inactive'}
                          variant={user.isActive === 1 || user.isActive === true ? 'success' : 'error'}
                          size="sm"
                        >
                          {user.isActive === 1 || user.isActive === true ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={user.id === Number(currentUser?.id)} // Cannot delete self
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
