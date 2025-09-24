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
  FileText, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  Filter,
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const pageSchema = z.object({
  name: z.string().min(2, 'Page name must be at least 2 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  route: z.string().min(1, 'Route is required').regex(/^\/[a-zA-Z0-9\/\-_]*$/, 'Route must start with / and contain only letters, numbers, /, -, and _'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  isActive: z.boolean(),
});

type PageFormData = z.infer<typeof pageSchema>;

interface Page {
  id: number;
  name: string;
  displayName: string;
  route: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SuperAdminPagesPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
  });

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPages();
      if (response.success && response.data) {
        setPages(response.data);
      } else {
        setError('Failed to fetch pages');
      }
    } catch (err) {
      setError('Error loading pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = () => {
    setEditingPage(null);
    reset({
      name: '',
      displayName: '',
      route: '',
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
    reset({
      name: page.name,
      displayName: page.displayName,
      route: page.route,
      description: page.description,
      isActive: page.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDeletePage = async (pageId: number) => {
    if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await apiService.deletePage(pageId.toString());
        if (response.success) {
          setSuccess('Page deleted successfully!');
          fetchPages();
        } else {
          setError('Failed to delete page');
        }
      } catch (err) {
        setError('Error deleting page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: PageFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      if (editingPage) {
        result = await apiService.updatePage(editingPage.id.toString(), data);
      } else {
        result = await apiService.createPage(data);
      }

      if (result.success) {
        setSuccess(editingPage ? 'Page updated successfully!' : 'Page created successfully!');
        setIsModalOpen(false);
        fetchPages();
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

  const filteredPages = pages.filter(page => {
    const matchesSearch = searchTerm === '' || 
                          page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
                          (filterStatus === 'active' && page.isActive) ||
                          (filterStatus === 'inactive' && !page.isActive);
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert type="error" title="Access Denied">
          You do not have permission to access page management.
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
          Page Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage frontend pages and their routes.
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
              placeholder="Search pages by name, display name, route, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <SelectDropdown
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full lg:w-48"
          />
          <div className="flex gap-2">
            <Button onClick={() => fetchPages()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreatePage}>
              <Plus className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          </div>
        </div>
      </Card>

      {/* Pages Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading pages..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Route
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
                {filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      No pages found.
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {page.displayName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {page.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {page.route}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(page.route, '_blank')}
                            className="ml-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant={page.isActive ? 'success' : 'error'}
                          size="sm"
                        >
                          {page.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {page.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditPage(page)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeletePage(page.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Create/Edit Page Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? 'Edit Page' : 'Create New Page'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Page Name"
              {...register('name')}
              error={errors.name?.message}
              disabled={isSubmitting}
              placeholder="e.g., dashboard"
            />
            <Input
              label="Display Name"
              {...register('displayName')}
              error={errors.displayName?.message}
              disabled={isSubmitting}
              placeholder="e.g., Dashboard"
            />
          </div>

          <Input
            label="Route"
            {...register('route')}
            error={errors.route?.message}
            disabled={isSubmitting}
            placeholder="e.g., /dashboard"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the page"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
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

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={isSubmitting} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingPage ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
