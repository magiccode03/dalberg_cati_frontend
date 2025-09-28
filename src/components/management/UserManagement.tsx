'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import SelectDropdown from '@/components/ui/SelectDropdown';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DataTable from '@/components/tables/DataTable';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft,
  Users
} from 'lucide-react';
import { apiService, User, Role } from '@/lib/api-service';

interface UserManagementProps {
  title: string;
  description: string;
  createUrl: string;
  backUrl?: string;
  showBackButton?: boolean;
  userType?: 'users' | 'enumerators';
}

export default function UserManagement({
  title,
  description,
  createUrl,
  backUrl,
  showBackButton = true,
  userType = 'users'
}: UserManagementProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch users
  const fetchUsers = async (page = 1, limit = 10, search = '', role = '', status = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        let filteredUsers = response.data.users || [];
        
        // Apply filters
        if (search) {
          filteredUsers = filteredUsers.filter((user: User) =>
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.uniqueId.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (role) {
          filteredUsers = filteredUsers.filter((user: User) => user.roleId.toString() === role);
        }
        
        if (status) {
          filteredUsers = filteredUsers.filter((user: User) => user.isActive.toString() === status);
        }
        
        setUsers(filteredUsers);
        setPagination({
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

  // Fetch roles
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
    router.push(createUrl);
  };

  const handleEditUser = (user: User) => {
    // Determine the base path based on the current URL
    const basePath = window.location.pathname.includes('/portal-admin') ? '/portal-admin' : '/super-admin';
    router.push(`${basePath}/users/edit/${user.id}`);
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

  const handlePageChange = (page: number) => {
    fetchUsers(page, pagination.limit, searchTerm, filterRole, filterStatus);
  };

  const roleOptions = roles.map(role => ({
    value: role.id.toString(),
    label: role.displayName || role.name,
  }));

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ];

  const columns = [
    {
      key: 'uniqueId' as keyof User,
      label: 'Unique ID',
      sortable: true,
    },
    {
      key: 'firstName' as keyof User,
      label: 'Name',
      sortable: true,
      render: (value: string, row: User) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: 'email' as keyof User,
      label: 'Email',
      sortable: true,
    },
    {
      key: 'roleDisplayName' as keyof User,
      label: 'Role',
      sortable: true,
    },
    {
      key: 'portalSlug' as keyof User,
      label: 'Portal Slug',
      sortable: true,
    },
    {
      key: 'isActive' as keyof User,
      label: 'Status',
      sortable: true,
      render: (value: number) => (
        <StatusBadge status={value === 1 ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'lastLoginAt' as keyof User,
      label: 'Last Login',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never',
    },
    {
      key: 'actions' as keyof User,
      label: 'Actions',
      sortable: false,
      render: (value: any, row: User) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditUser(row)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteUser(row.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => backUrl ? router.push(backUrl) : router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert type="success" className="mb-6">
            {success}
          </Alert>
        )}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={`Search ${userType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <SelectDropdown
                  options={[
                    { value: '', label: 'All Roles' },
                    ...roleOptions,
                  ]}
                  value={filterRole}
                  onChange={(value) => setFilterRole(value)}
                  placeholder="Select role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <SelectDropdown
                  options={statusOptions}
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                  placeholder="Select status"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {userType === 'users' ? 'Users' : 'Enumerators'} ({users.length})
              </h2>
              <Button
                onClick={handleCreateUser}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create {userType === 'users' ? 'User' : 'Enumerator'}
              </Button>
            </div>

            <DataTable
              data={users}
              columns={columns}
              loading={loading}
              className="min-h-[400px]"
            />

            {users.length > 0 && (
              <div className="mt-6">
                <PaginationStandard
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
