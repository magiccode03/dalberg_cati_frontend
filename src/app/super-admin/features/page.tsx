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
  Settings, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  Filter,
  ArrowLeft,
  Tag,
  Monitor,
  FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const featureSchema = z.object({
  name: z.string().min(2, 'Feature name must be at least 2 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  module: z.string().min(2, 'Module must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  isActive: z.boolean(),
});

type FeatureFormData = z.infer<typeof featureSchema>;

interface Feature {
  id: number;
  name: string;
  displayName: string;
  category: string;
  module: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SuperAdminFeaturesPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FeatureFormData>({
    resolver: zodResolver(featureSchema),
  });

  const fetchFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getFeatures();
      if (response.success && response.data) {
        setFeatures(response.data);
      } else {
        setError('Failed to fetch features');
      }
    } catch (err) {
      setError('Error loading features');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleCreateFeature = () => {
    setEditingFeature(null);
    reset({
      name: '',
      displayName: '',
      category: '',
      module: '',
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    reset({
      name: feature.name,
      displayName: feature.displayName,
      category: feature.category,
      module: feature.module,
      description: feature.description,
      isActive: feature.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDeleteFeature = async (featureId: number) => {
    if (window.confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await apiService.deleteFeature(featureId.toString());
        if (response.success) {
          setSuccess('Feature deleted successfully!');
          fetchFeatures();
        } else {
          setError('Failed to delete feature');
        }
      } catch (err) {
        setError('Error deleting feature');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: FeatureFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      if (editingFeature) {
        result = await apiService.updateFeature(editingFeature.id.toString(), data);
      } else {
        result = await apiService.createFeature(data);
      }

      if (result.success) {
        setSuccess(editingFeature ? 'Feature updated successfully!' : 'Feature created successfully!');
        setIsModalOpen(false);
        fetchFeatures();
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

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = searchTerm === '' || 
                          feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          feature.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || feature.category === filterCategory;
    const matchesModule = filterModule === '' || feature.module === filterModule;
    const matchesStatus = filterStatus === '' || 
                          (filterStatus === 'active' && feature.isActive) ||
                          (filterStatus === 'inactive' && !feature.isActive);
    return matchesSearch && matchesCategory && matchesModule && matchesStatus;
  });

  // Get unique categories and modules for filter dropdowns
  const categories = Array.from(new Set(features.map(f => f.category))).sort();
  const modules = Array.from(new Set(features.map(f => f.module))).sort();

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...categories.map(category => ({
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      value: category,
    })),
  ];

  const moduleOptions = [
    { label: 'All Modules', value: '' },
    ...modules.map(module => ({
      label: module.charAt(0).toUpperCase() + module.slice(1),
      value: module,
    })),
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
          You do not have permission to access feature management.
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
          Feature Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system features and their configurations.
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
              placeholder="Search features by name, display name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <SelectDropdown
            options={categoryOptions}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full lg:w-48"
          />
          <SelectDropdown
            options={moduleOptions}
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="w-full lg:w-48"
          />
          <SelectDropdown
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full lg:w-48"
          />
          <div className="flex gap-2">
            <Button onClick={() => fetchFeatures()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreateFeature}>
              <Plus className="h-4 w-4 mr-2" />
              Create Feature
            </Button>
          </div>
        </div>
      </Card>

      {/* Features Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading features..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Module
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
                {filteredFeatures.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      No features found.
                    </td>
                  </tr>
                ) : (
                  filteredFeatures.map((feature) => (
                    <tr key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {feature.displayName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {feature.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant="default"
                          size="sm"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {feature.category.replace(/_/g, ' ')}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant="info"
                          size="sm"
                        >
                          <Monitor className="h-3 w-3 mr-1" />
                          {feature.module}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          variant={feature.isActive ? 'success' : 'error'}
                          size="sm"
                        >
                          {feature.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {feature.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(feature.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditFeature(feature)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteFeature(feature.id)}
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

      {/* Create/Edit Feature Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFeature ? 'Edit Feature' : 'Create New Feature'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Feature Name"
              {...register('name')}
              error={errors.name?.message}
              disabled={isSubmitting}
              placeholder="e.g., user_view"
            />
            <Input
              label="Display Name"
              {...register('displayName')}
              error={errors.displayName?.message}
              disabled={isSubmitting}
              placeholder="e.g., View Users"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              {...register('category')}
              error={errors.category?.message}
              disabled={isSubmitting}
              placeholder="e.g., user_management"
            />
            <Input
              label="Module"
              {...register('module')}
              error={errors.module?.message}
              disabled={isSubmitting}
              placeholder="e.g., frontend"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the feature"
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
              {isSubmitting ? 'Saving...' : editingFeature ? 'Update Feature' : 'Create Feature'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
