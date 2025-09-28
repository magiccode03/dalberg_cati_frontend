'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';
import SelectDropdown from '@/components/ui/SelectDropdown';
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
  KeyRound,
  RefreshCw,
  Filter,
  Download,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  uniqueId: z.string().min(3, 'Unique ID must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  roleId: z.number().min(1, 'Please select a role'),
  portalSlug: z.string().min(2, 'Portal slug must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

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
  isActive: boolean;
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

export default function SuperAdminUsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      uniqueId: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      roleId: 0,
      portalSlug: '',
    },
  });

  const fetchUsers = async (page = 1, limit = 10, search = '', role = '', status = '') => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching users with filters:', { search, role, status });
      const response = await apiService.getUsers();
      
      if (response.success && response.data) {
        let filteredUsers = response.data.users || [];
        
        // Apply search filter
        if (search) {
          filteredUsers = filteredUsers.filter(user => 
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.uniqueId.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        // Apply role filter
        if (role) {
          filteredUsers = filteredUsers.filter(user => 
            user.roleName === role || user.role?.name === role
          );
        }
        
        // Apply status filter
        if (status) {
          const isActive = status === '1';
          filteredUsers = filteredUsers.filter(user => 
            user.isActive === isActive
          );
        }
        
        setUsers(filteredUsers);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / 10),
        });
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
      console.log('Roles response:', response);
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
    router.push('/super-admin/users/create');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    reset({
      uniqueId: user.uniqueId,
      email: user.email,
      password: '', // Don't pre-fill password
      confirmPassword: '', // Don't pre-fill confirm password
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      portalSlug: user.portalSlug,
    });
    setIsModalOpen(true);
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

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      if (editingUser) {
        // Update user
        result = await apiService.updateUser(editingUser.id.toString(), {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
          portalSlug: data.portalSlug,
          ...(data.password && { password: data.password }),
        });
      } else {
        // Create user
        result = await apiService.createUser({
          uniqueId: data.uniqueId,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
          portalSlug: data.portalSlug,
        });
      }

      if (result.success) {
        setSuccess(editingUser ? 'User updated successfully!' : 'User created successfully!');
        setIsModalOpen(false);
        fetchUsers(pagination.page, pagination.limit, searchTerm, filterRole, filterStatus);
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (err) {
      setError('An error occurred during the operation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('Search filters:', { searchTerm, filterRole, filterStatus });
    fetchUsers(1, pagination.limit, searchTerm, filterRole, filterStatus);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, pagination.limit, searchTerm, filterRole, filterStatus);
  };

  const roleOptions = [
    { label: 'All Roles', value: '' },
    ...roles.map(role => ({
      label: role.displayName || role.roleDisplayName,
      value: role.name || role.roleName,
    })),
  ];

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
  ];

  if (currentUser?.role !== 'super_admin') {
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
            onClick={() => router.push('/super-admin/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system users, roles, and permissions.
        </p>
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
          <SelectDropdown
            options={roleOptions}
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            className="w-full lg:w-48"
          />
          <SelectDropdown
            options={statusOptions}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            className="w-full lg:w-48"
          />
          <div className="flex gap-2">
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => fetchUsers()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
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
                          variant={user.roleName === 'super_admin' ? 'primary' : user.roleName === 'admin' ? 'info' : 'default'}
                          size="sm"
                        >
                          {user.roleDisplayName}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant={user.isActive ? 'success' : 'error'}
                          size="sm"
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
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
                            disabled={user.id === currentUser?.id} // Cannot delete self
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

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Information Section */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
                disabled={isSubmitting}
                placeholder="Enter first name"
              />
              <Input
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
                disabled={isSubmitting}
                placeholder="Enter last name"
              />
              <Input
                label="Unique ID"
                {...register('uniqueId')}
                error={errors.uniqueId?.message}
                disabled={isSubmitting || !!editingUser}
                placeholder="e.g., USER001"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                disabled={isSubmitting}
                icon={<Mail className="h-4 w-4" />}
                placeholder="user@example.com"
              />
              <Input
                label="Portal Slug"
                {...register('portalSlug')}
                error={errors.portalSlug?.message}
                disabled={isSubmitting}
                placeholder="e.g., john-doe"
              />
            </div>
          </div>

          {/* Role and Security Section */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
              Role & Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectDropdown
                label="Role"
                options={roles.map(role => ({
                  label: role.displayName,
                  value: role.id.toString(),
                }))}
                {...register('roleId', { valueAsNumber: true })}
                error={errors.roleId?.message}
                disabled={isSubmitting}
                placeholder="Select a role"
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                error={errors.password?.message}
                icon={<KeyRound className="h-4 w-4" />}
                rightIcon={showPassword ? <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(true)} />}
                disabled={isSubmitting}
              />
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
                icon={<KeyRound className="h-4 w-4" />}
                rightIcon={showPassword ? <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(true)} />}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsModalOpen(false)} 
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={isSubmitting} 
              disabled={isSubmitting}
              className="px-6"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
