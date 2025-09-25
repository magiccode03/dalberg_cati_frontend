'use client';

import React, { useState, useEffect } from 'react';
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
  Shield, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  Filter,
  Settings,
  Users,
  ArrowLeft,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  level: z.number().min(1, 'Level must be at least 1').max(10, 'Level must be at most 10'),
  isActive: z.boolean(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: number;
  featureId: number;
  featureName: string;
  featureDisplayName: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
}

interface RolePermissions {
  role: {
    id: number;
    name: string;
    displayName: string;
  };
  featurePermissions: Permission[];
  pagePermissions: any[];
  apiPermissions: any[];
}

export default function SuperAdminRolesPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      } else {
        setError('Failed to fetch roles');
      }
    } catch (err) {
      setError('Error loading roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId: number) => {
    try {
      const response = await apiService.getRolePermissions(roleId.toString());
      if (response.success && response.data) {
        setRolePermissions(response.data);
      }
    } catch (err) {
      console.error('Error fetching role permissions:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = () => {
    setEditingRole(null);
    reset({
      name: '',
      displayName: '',
      description: '',
      level: 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    reset({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      level: role.level,
      isActive: role.isActive,
    });
    setIsModalOpen(true);
  };

  const handleManagePermissions = async (role: Role) => {
    setSelectedRole(role);
    await fetchRolePermissions(role.id);
    setIsPermissionsModalOpen(true);
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await apiService.deleteRole(roleId.toString());
        if (response.success) {
          setSuccess('Role deleted successfully!');
          fetchRoles();
        } else {
          setError('Failed to delete role');
        }
      } catch (err) {
        setError('Error deleting role');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: RoleFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      if (editingRole) {
        result = await apiService.updateRole(editingRole.id.toString(), data);
      } else {
        result = await apiService.createRole(data);
      }

      if (result.success) {
        setSuccess(editingRole ? 'Role updated successfully!' : 'Role created successfully!');
        setIsModalOpen(false);
        fetchRoles();
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

  const handlePermissionChange = async (featureId: number, permission: string, value: boolean) => {
    if (!rolePermissions) return;

    const updatedPermissions = rolePermissions.featurePermissions.map(fp => 
      fp.featureId === featureId ? { ...fp, [permission]: value } : fp
    );

    setRolePermissions({
      ...rolePermissions,
      featurePermissions: updatedPermissions,
    });
  };

  const savePermissions = async () => {
    if (!rolePermissions || !selectedRole) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.updateRolePermissions(selectedRole.id.toString(), {
        featurePermissions: rolePermissions.featurePermissions,
        pagePermissions: rolePermissions.pagePermissions,
        apiPermissions: rolePermissions.apiPermissions,
      });

      if (response.success) {
        setSuccess('Permissions updated successfully!');
        setIsPermissionsModalOpen(false);
      } else {
        setError('Failed to update permissions');
      }
    } catch (err) {
      setError('Error updating permissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchTerm === '' || 
                          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          role.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === '' || role.level.toString() === filterLevel;
    const matchesStatus = filterStatus === '' || 
                          (filterStatus === 'active' && role.isActive) ||
                          (filterStatus === 'inactive' && !role.isActive);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const levelOptions = [
    { label: 'All Levels', value: '' },
    { label: 'Level 1', value: '1' },
    { label: 'Level 2', value: '2' },
    { label: 'Level 3', value: '3' },
    { label: 'Level 4', value: '4' },
    { label: 'Level 5', value: '5' },
  ];

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert type="error" title="Access Denied">
          You do not have permission to access role management.
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
          Role Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system roles and their permissions.
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
              placeholder="Search roles by name or display name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <SelectDropdown
            options={levelOptions}
            value={filterLevel}
            onChange={(value) => setFilterLevel(Array.isArray(value) ? value[0] : value)}
            className="w-full lg:w-48"
          />
          <SelectDropdown
            options={statusOptions}
            value={filterStatus}
            onChange={(value) => setFilterStatus(Array.isArray(value) ? value[0] : value)}
            className="w-full lg:w-48"
          />
          <div className="flex gap-2">
            <Button onClick={() => fetchRoles()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreateRole}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        </div>
      </Card>

      {/* Roles Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading roles..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
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
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {role.displayName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {role.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant={role.level >= 3 ? 'default' : role.level >= 2 ? 'info' : 'default'}
                          size="sm"
                          status={`level-${role.level}`}
                        >
                          Level {role.level}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant={role.isActive ? 'success' : 'error'}
                          size="sm"
                          status={role.isActive ? 'active' : 'inactive'}
                        >
                          {role.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {role.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleManagePermissions(role)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditRole(role)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={role.name === 'super_admin'} // Cannot delete super admin role
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
      </Card>

      {/* Create/Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Edit Role' : 'Create New Role'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Role Name"
              {...register('name')}
              error={errors.name?.message}
              disabled={isSubmitting || editingRole?.name === 'super_admin'}
              placeholder="e.g., moderator"
            />
            <Input
              label="Display Name"
              {...register('displayName')}
              error={errors.displayName?.message}
              disabled={isSubmitting}
              placeholder="e.g., Moderator"
            />
          </div>

          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            disabled={isSubmitting}
            placeholder="Brief description of the role"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Level"
              type="number"
              {...register('level', { valueAsNumber: true })}
              error={errors.level?.message}
              disabled={isSubmitting}
              min="1"
              max="10"
            />
            <div className="flex items-center space-x-2 mt-6">
              <input
                id="isActive"
                type="checkbox"
                {...register('isActive')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500"
                disabled={isSubmitting}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              loading={isSubmitting} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Permissions Modal */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title={`Manage Permissions - ${selectedRole?.displayName}`}
        size="lg"
      >
        {rolePermissions && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Feature Permissions</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rolePermissions.featurePermissions.map((permission) => (
                  <div key={permission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {permission.featureDisplayName}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {permission.featureName}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      {[
                        { key: 'canView', label: 'View' },
                        { key: 'canCreate', label: 'Create' },
                        { key: 'canUpdate', label: 'Update' },
                        { key: 'canDelete', label: 'Delete' },
                        { key: 'canExport', label: 'Export' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={permission[key as keyof Permission] as boolean}
                            onChange={(e) => handlePermissionChange(permission.featureId, key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="secondary" 
                onClick={() => setIsPermissionsModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={savePermissions}
                loading={loading}
                disabled={loading}
              >
                Save Permissions
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
