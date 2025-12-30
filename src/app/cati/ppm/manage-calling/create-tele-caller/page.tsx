'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, UserPlus } from 'lucide-react';

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
  telecalling_group_id: z.string().min(1, 'Telecalling Group is required'),
  state_id: z.string().min(1, 'State is required'),
  fill_form: z.boolean(),
  qc: z.boolean(),
  data_entry: z.boolean(),
});

type TeleCallerFormData = z.infer<typeof teleCallerSchema>;

interface TelecallingGroup {
  id: number;
  name: string;
  group_name?: string;
}

interface State {
  id: number;
  state_name: string;
  status: number;
}

export default function CreateTeleCallerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [telecallingGroups, setTelecallingGroups] = useState<TelecallingGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TeleCallerFormData>({
    resolver: zodResolver(teleCallerSchema),
    defaultValues: {
      teleform_user_id: '',
      name: '',
      mobile_number: '',
      status: '1', // Default to Active
      telecalling_group_id: '', // User must select from dropdown
      state_id: '', // User must select from dropdown
      fill_form: false,
      qc: false,
      data_entry: false,
    },
  });

  // Fetch telecalling groups
  useEffect(() => {
    const fetchTelecallingGroups = async () => {
      setLoadingGroups(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        if (!token) {
          console.warn('No auth token, using default groups');
          setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
          return;
        }

        // Fetch telecalling groups from the API
        const endpoint = `${apiUrl}/api/teleform-users/telecalling-groups`;
        console.log('Fetching telecalling groups from:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status, response.statusText);

        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);
          
          if (result.success && Array.isArray(result.data)) {
            console.log('Groups data array:', result.data);
            const groups: TelecallingGroup[] = result.data.map((item: any) => ({
              id: item.telecalling_group_id || item.id,
              name: item.telecalling_group_name || item.name || `Group ${item.telecalling_group_id || item.id}`,
            }));
            console.log('Mapped groups:', groups);
            setTelecallingGroups(groups);
          } else {
            console.warn('Invalid API response format:', result);
            console.warn('Response success:', result.success, 'Data is array:', Array.isArray(result.data));
            setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
          }
        } else {
          const errorText = await response.text();
          console.warn('Failed to fetch telecalling groups. Status:', response.status, 'Response:', errorText);
          setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
        }
      } catch (err) {
        console.error('Error fetching telecalling groups:', err);
        // Fallback to default
        setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchTelecallingGroups();
  }, []);

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        if (!token) {
          console.warn('No auth token, using default states');
          setStates([{ id: 1, state_name: 'Default State', status: 1 }]);
          return;
        }

        // Fetch states from the API
        const endpoint = `${apiUrl}/api/teleform-users/states`;
        console.log('Fetching states from:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('States response status:', response.status, response.statusText);

        if (response.ok) {
          const result = await response.json();
          console.log('States API Response:', result);
          
          if (result.success && Array.isArray(result.data)) {
            console.log('States data array:', result.data);
            const statesData: State[] = result.data
              .filter((item: any) => item.status === 1) // Only active states
              .map((item: any) => ({
                id: item.id,
                state_name: item.state_name,
                status: item.status,
              }));
            console.log('Mapped states:', statesData);
            setStates(statesData);
          } else {
            console.warn('Invalid states API response format:', result);
            setStates([{ id: 1, state_name: 'Default State', status: 1 }]);
          }
        } else {
          const errorText = await response.text();
          console.warn('Failed to fetch states. Status:', response.status, 'Response:', errorText);
          setStates([{ id: 1, state_name: 'Default State', status: 1 }]);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
        // Fallback to default
        setStates([{ id: 1, state_name: 'Default State', status: 1 }]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const onSubmit = async (data: TeleCallerFormData): Promise<void> => {
    setError(null);
    setSuccess(null);

    // Get API URL with fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

    // Get auth token (with SSR guard)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setError('Authentication required');
      return;
    }

    // Prepare the payload with form values
    const payload = {
      teleform_user_id: parseInt(data.teleform_user_id),
      name: data.name,
      mobile_number: data.mobile_number,
      form_id: 1,
      fill_form: data.fill_form ? 1 : 0,
      form_data: 0,
      qc: data.qc ? 1 : 0,
      qc_recheck: 0,
      data_entry: data.data_entry ? 1 : 0,
      supervisor_id: 1,
      agency_id: 1,
      telecalling_group_id: parseInt(data.telecalling_group_id),
      state_id: parseInt(data.state_id),
      under_training: 0,
      status: parseInt(data.status),
    };

    try {
      // Call the API
      const response = await fetch(`${apiUrl}/api/teleform-users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Safe JSON parsing
      let result;
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        setSuccess(result.message || 'Telecaller created successfully!');
        reset();
        
        // Redirect to the list page after 1.5 seconds
        setTimeout(() => {
          router.push('/cati/ppm/manage-calling/tele-caller');
        }, 1500);
      } else {
        setError(result.error || 'Failed to create telecaller');
      }
    } catch (err: any) {
      console.error('Error creating telecaller:', err);
      setError(err.message || 'Error creating telecaller. Please try again.');
    }
  };

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
                  Create New Telecaller
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Add a new telecaller to the system
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
                    error={errors.teleform_user_id?.message}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter numeric TeleForm User ID
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telecalling Group *
                  </label>
                  <SelectDropdown
                    value={watch('telecalling_group_id')}
                    onChange={(value) => setValue('telecalling_group_id', value as string)}
                    options={telecallingGroups.map(group => ({
                      value: String(group.id),
                      label: group.name,
                    }))}
                    placeholder={loadingGroups ? "Loading groups..." : "Select Telecalling Group"}
                    disabled={loadingGroups}
                  />
                  {errors.telecalling_group_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.telecalling_group_id.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select the telecalling group for this user
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <SelectDropdown
                    value={watch('state_id')}
                    onChange={(value) => setValue('state_id', value as string)}
                    options={states.map(state => ({
                      value: String(state.id),
                      label: state.state_name,
                    }))}
                    placeholder={loadingStates ? "Loading states..." : "Select State"}
                    disabled={loadingStates}
                  />
                  {errors.state_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.state_id.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select the state for this user
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
                    value={watch('status')}
                    onChange={(value) => setValue('status', value as string)}
                    options={[
                      { value: '1', label: 'Active' },
                      { value: '0', label: 'Inactive' },
                    ]}
                    placeholder="Select Status"
                  />
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.status.message}
                    </p>
                  )}
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
                        Telecaller
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
                <UserPlus className="h-4 w-4" />
                Create Telecaller
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

