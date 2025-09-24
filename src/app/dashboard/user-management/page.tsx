'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  Filter,
  User,
  Shield,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  uniqueId: z.string().min(3, 'Unique ID must be at least 3 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  role: z.string().min(1, 'Please select a role'),
  department: z.string().min(1, 'Please enter department'),
  designation: z.string().min(1, 'Please enter designation'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type UserFormData = z.infer<typeof userSchema>;

const roleOptions = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'PMT Manager', value: 'pmt' },
  { label: 'QC Manager', value: 'qc_manager' },
  { label: 'Quality Analyst', value: 'quality_analyst' },
  { label: 'Start QC', value: 'start_qc' },
  { label: 'Data Quality', value: 'data_quality' },
  { label: 'Convergent Analysis', value: 'convergent_analysis' },
];

export default function UserManagementPage() {
  const { user, getAllUsers, createUser, updateUserById, deleteUser, generateUniqueId } = useAuth();
  const [users, setUsers] = useState(getAllUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (selectedRole && !editingUser) {
      const generatedId = generateUniqueId(selectedRole);
      setValue('uniqueId', generatedId);
    }
  }, [selectedRole, editingUser, generateUniqueId, setValue]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await createUser({
        ...data,
        email: data.email || undefined,
        avatar: '/logo.png',
        permissions: getDefaultPermissions(data.role),
        isActive: true,
      });

      if (success) {
        setSuccess('User created successfully!');
        setUsers(getAllUsers());
        setIsModalOpen(false);
        reset();
      } else {
        setError('Failed to create user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await updateUserById(editingUser.id, {
        ...data,
        email: data.email || undefined,
      });

      if (success) {
        setSuccess('User updated successfully!');
        setUsers(getAllUsers());
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
      } else {
        setError('Failed to update user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await deleteUser(userId);
      if (success) {
        setSuccess('User deleted successfully!');
        setUsers(getAllUsers());
      } else {
        setError('Failed to delete user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while deleting the user.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (userData: any) => {
    setEditingUser(userData);
    setValue('uniqueId', userData.uniqueId);
    setValue('name', userData.name);
    setValue('email', userData.email || '');
    setValue('role', userData.role);
    setValue('department', userData.department || '');
    setValue('designation', userData.designation || '');
    setValue('password', ''); // Don't pre-fill password
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
    setError(null);
    setSuccess(null);
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

  const getRoleBadgeVariant = (role: string) => {
    const variants = {
      'super_admin': 'error',
      'admin': 'warning',
      'pmt': 'info',
      'qc_manager': 'success',
      'quality_analyst': 'default',
      'start_qc': 'secondary',
      'data_quality': 'primary',
      'convergent_analysis': 'outline',
    };
    return variants[role as keyof typeof variants] || 'default';
  };

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error">
          <AlertCircle className="h-4 w-4" />
          Access denied. Only Super Administrators can access this page.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system users and their permissions
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-6">
          <CheckCircle className="h-4 w-4" />
          {success}
        </Alert>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <SelectDropdown
          label="Filter by Role"
          options={[
            { label: 'All Roles', value: '' },
            ...roleOptions,
          ]}
          value={roleFilter}
          onChange={(value) => setRoleFilter(value)}
          className="w-full sm:w-48"
        />
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {userData.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {userData.uniqueId}
                        </div>
                        {userData.email && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      variant={getRoleBadgeVariant(userData.role)}
                      text={userData.role.replace('_', ' ').toUpperCase()}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {userData.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      variant={userData.isActive ? 'success' : 'error'}
                      text={userData.isActive ? 'Active' : 'Inactive'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(userData)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(userData.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
        title={editingUser ? 'Edit User' : 'Create New User'}
      >
        <form onSubmit={handleSubmit(editingUser ? handleUpdateUser : handleCreateUser)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('uniqueId')}
              label="Unique ID"
              placeholder="Enter unique ID"
              error={errors.uniqueId?.message}
              disabled={!!editingUser}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              {...register('name')}
              label="Full Name"
              placeholder="Enter full name"
              error={errors.name?.message}
              icon={<User className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('email')}
              label="Email (Optional)"
              placeholder="Enter email address"
              error={errors.email?.message}
              icon={<Mail className="h-4 w-4" />}
            />
            <SelectDropdown
              {...register('role')}
              label="Role"
              options={roleOptions}
              error={errors.role?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('department')}
              label="Department"
              placeholder="Enter department"
              error={errors.department?.message}
            />
            <Input
              {...register('designation')}
              label="Designation"
              placeholder="Enter designation"
              error={errors.designation?.message}
            />
          </div>

          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
              placeholder="Enter password"
              error={errors.password?.message}
              icon={<Shield className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
