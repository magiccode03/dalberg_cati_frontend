'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, Save } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface DownloadItemFormData {
  title: string;
  description: string;
  api: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: string;
  };
  type: 'CSV' | 'EXCEL' | 'ZIP' | 'JSON' | 'PDF' | 'OTHER';
  survey_type: 'CAPI' | 'CATI' | 'CAVI' | 'CAPI_QC' | 'OTHER'
  status: number;
  sortOrder: number;
}

export default function CreateDownloadItemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<DownloadItemFormData>({
    title: '',
    description: '',
    api: {
      url: '',
      method: 'GET',
      params: '',
    },
    type: 'CSV',
    survey_type: 'CAPI',
    status: 1,
    sortOrder: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Basic validation
    if (!formData.title.trim()) {
      setValidationErrors({ title: 'Title is required' });
      return;
    }

    if (!formData.api.url.trim()) {
      setValidationErrors({ 'api.url': 'API URL is required' });
      return;
    }

    // Validate URL format
    const url = formData.api.url.trim();
    if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
      setValidationErrors({ 'api.url': 'API URL must be relative (starting with /) or absolute (http:// or https://)' });
      return;
    }

    setLoading(true);

    try {
      // Prepare request body
      const requestBody: any = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        api: {
          url: formData.api.url.trim(),
          method: formData.api.method,
        },
        type: formData.type,
        survey_type: formData.survey_type,
        status: formData.status,
        sortOrder: formData.sortOrder,
      };

      // Handle params - can be JSON object or string
      if (formData.api.params && formData.api.params.trim()) {
        const paramsStr = formData.api.params.trim();
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(paramsStr);
          requestBody.api.params = parsed;
        } catch {
          // If not valid JSON, treat as string
          requestBody.api.params = paramsStr;
        }
      }

      const response = await apiClient.post('/download-items', requestBody);

      if (response.data.success) {
        router.push('/portal-admin/downloads');
      } else {
        setError(response.data.message || 'Failed to create download item');
        if (response.data.error && typeof response.data.error === 'object') {
          setValidationErrors(response.data.error);
        }
      }
    } catch (err: any) {
      console.error('Error creating download item:', err);
      setError(err.response?.data?.message || 'Failed to create download item');
      if (err.response?.data?.error && typeof err.response.data.error === 'object') {
        setValidationErrors(err.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'CSV', label: 'CSV' },
    { value: 'EXCEL', label: 'Excel' },
    { value: 'ZIP', label: 'ZIP' },
    { value: 'JSON', label: 'JSON' },
    { value: 'PDF', label: 'PDF' },
    { value: 'OTHER', label: 'Other' },
  ];

  const surveytypeOptions = [
    { value: 'CAPI', label: 'CAPI' },
    { value: 'CATI', label: 'CATI' },
    { value: 'CAVI', label: 'CAVI' },
    { value: 'CAPI_QC', label: 'CAPI QC' },
    { value: 'OTHER', label: 'Other' },
  ];

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
  ];

  const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ];

  return (
    <Container maxWidth="7xl" className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/portal-admin/downloads')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Downloads
          </Button>
          <div>
            <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Download Item
            </Heading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure a new download item
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column - Item Details */}
            <div>
              <Card className="p-6 h-full flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                    Item Details
                  </Heading>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., CAPI Interview Data"
                      className={validationErrors.title ? 'border-red-500' : ''}
                      required
                    />
                    {validationErrors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description of what the download contains"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File Type <span className="text-red-500">*</span>
                    </label>
                    <SelectDropdown
                      value={formData.type}
                      onChange={(value) => setFormData({ ...formData, type: value as DownloadItemFormData['type'] })}
                      options={typeOptions}
                      className={validationErrors.type ? 'border-red-500' : ''}
                    />
                    {validationErrors.type && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.type}</p>
                    )}
                  </div>

                  {/* survey type option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Survey Type <span className="text-red-500">*</span>
                    </label>
                    <SelectDropdown
                      value={formData.survey_type}
                      onChange={(value) => setFormData({ ...formData, survey_type: value as DownloadItemFormData['survey_type'] })}
                      options={surveytypeOptions}
                      className={validationErrors.survey_type ? 'border-red-500' : ''}
                    />
                    {validationErrors.survey_type && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.survey_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <SelectDropdown
                      value={String(formData.status)}
                      onChange={(value) => setFormData({ ...formData, status: Number(value) })}
                      options={statusOptions}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort Order
                    </label>
                    <Input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Lower numbers appear first in the list
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - API Configuration */}
            <div>
              <Card className="p-6 h-full flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                    API Configuration
                  </Heading>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.api.url}
                      onChange={(e) => setFormData({ ...formData, api: { ...formData.api, url: e.target.value } })}
                      placeholder="/api/capi/interview/download"
                      className={validationErrors['api.url'] ? 'border-red-500' : ''}
                      required
                    />
                    {validationErrors['api.url'] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors['api.url']}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Relative URL (starting with /) or absolute URL (http:// or https://)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      HTTP Method <span className="text-red-500">*</span>
                    </label>
                    <SelectDropdown
                      value={formData.api.method}
                      onChange={(value) => setFormData({ ...formData, api: { ...formData.api, method: value as DownloadItemFormData['api']['method'] } })}
                      options={methodOptions}
                      className={validationErrors['api.method'] ? 'border-red-500' : ''}
                    />
                    {validationErrors['api.method'] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors['api.method']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Parameters (Optional)
                    </label>
                    <Textarea
                      value={formData.api.params || ''}
                      onChange={(e) => setFormData({ ...formData, api: { ...formData.api, params: e.target.value } })}
                      placeholder='JSON object: {"date": "2025-11-20"}&#10;Or query string: date=2025-11-20&format=csv'
                      rows={4}
                      className="font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Can be a JSON object or query string format
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/portal-admin/downloads')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Download Item'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}

