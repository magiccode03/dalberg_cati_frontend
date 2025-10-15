'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';

// Form validation schema
const teleCallerSchema = z.object({
  teleform_user_id: z.string()
    .min(1, 'TeleForm User ID is required')
    .regex(/^[0-9]+$/, 'TeleForm User ID must contain only numbers'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters'),
  mobile_number: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(10, 'Mobile number must be 10 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
  status: z.string().min(1, 'Status is required'),
  fill_form: z.boolean(),
  qc: z.boolean(),
});

type TeleCallerFormData = z.infer<typeof teleCallerSchema>;

const statusOptions = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
];

export default function EditTeleCallerPage() {
  const router = useRouter();
  const params = useParams();
  const telecallerId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TeleCallerFormData>({
    resolver: zodResolver(teleCallerSchema),
    defaultValues: {
      teleform_user_id: '',
      name: '',
      mobile_number: '',
      status: '1',
      fill_form: false,
      qc: false,
    },
  });

  const statusValue = watch('status');

  // Fetch existing telecaller data
  const fetchTelecallerData = async () => {
    setFetchLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teleform-users/${telecallerId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const data = result.data;
        // Set form values
        setValue('teleform_user_id', data.teleform_user_id.toString());
        setValue('name', data.name);
        setValue('mobile_number', data.mobile_number);
        setValue('status', data.status.toString());
        setValue('fill_form', data.fill_form === 1);
        setValue('qc', data.qc === 1);
      } else {
        setError(result.message || 'Failed to fetch telecaller data');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching telecaller data');
      console.error('Error fetching telecaller data:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (telecallerId) {
      fetchTelecallerData();
    }
  }, [telecallerId]);

  const onSubmit = async (data: TeleCallerFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare the payload with all updatable fields
      const payload = {
        name: data.name,
        mobile_number: data.mobile_number,
        status: parseInt(data.status),
        fill_form: data.fill_form ? 1 : 0,
        qc: data.qc ? 1 : 0,
      };

      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Call the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teleform-users/${telecallerId}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Telecaller updated successfully!');
        
        // Redirect to the list page after 1.5 seconds
        setTimeout(() => {
          router.push('/cati/ppm/manage-calling/tele-caller');
        }, 1500);
      } else {
        setError(result.message || 'Failed to update telecaller');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating telecaller. Please try again.');
      console.error('Error updating telecaller:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading telecaller data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/cati/ppm/manage-calling/tele-caller')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Telecaller
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Update telecaller information
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

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Telecaller Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Telecaller Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    TeleForm User ID *
                  </label>
                  <Input
                    {...register('teleform_user_id')}
                    placeholder="e.g., 1001"
                    disabled={true}
                    className="bg-gray-100 dark:bg-gray-800"
                    error={errors.teleform_user_id?.message}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    TeleForm User ID cannot be changed
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Enter full name"
                    error={errors.name?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number *
                  </label>
                  <Input
                    {...register('mobile_number')}
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    error={errors.mobile_number?.message}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter 10-digit mobile number without country code
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Settings
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <SelectDropdown
                    options={statusOptions}
                    value={statusValue}
                    onChange={(value) => setValue('status', Array.isArray(value) ? value[0] : value as string)}
                    error={errors.status?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fill_form"
                        checked={watch('fill_form')}
                        onCheckedChange={(checked) => setValue('fill_form', checked === true)}
                      />
                      <label htmlFor="fill_form" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Can Fill Form
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="qc"
                        checked={watch('qc')}
                        onCheckedChange={(checked) => setValue('qc', checked === true)}
                      />
                      <label htmlFor="qc" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        QC User
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/cati/ppm/manage-calling/tele-caller')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Update Telecaller
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
