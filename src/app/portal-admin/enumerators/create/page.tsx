'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';

// Form validation schema
const enumeratorSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(25, 'First name must be less than 25 characters'),
  lastName: z.string().min(1, 'Last name is required').max(25, 'Last name must be less than 25 characters'),
  username: z.string().min(1, 'Login ID is required').max(50, 'Login ID must be less than 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  uniqueDevice: z.boolean().optional(),
  enumeratorWebDashboard: z.boolean().optional(),
});

type EnumeratorFormData = z.infer<typeof enumeratorSchema>;

export default function CreateEnumeratorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EnumeratorFormData>({
    resolver: zodResolver(enumeratorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      uniqueDevice: false,
      enumeratorWebDashboard: false,
    },
  });

  const onSubmit = async (data: EnumeratorFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSuccess('Enumerator created successfully!');
      reset();
      setTimeout(() => {
        router.push('/portal-admin/enumerators');
      }, 1500);
    } catch (err) {
      setError('Error creating enumerator');
      console.error(err);
    } finally {
      setLoading(false);
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
              onClick={() => router.push('/portal-admin/enumerators')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Enumerators
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add New Enumerator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a new field enumerator account
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
        <Card className="max-w-4xl mx-auto">
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Enumerator Detail
              </h4>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <Input
                    {...register('firstName')}
                    placeholder="Enter First Name"
                    maxLength={25}
                    error={errors.firstName?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <Input
                    {...register('lastName')}
                    placeholder="Enter Last Name"
                    maxLength={25}
                    error={errors.lastName?.message}
                  />
                </div>
              </div>

              {/* Login Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Login ID *
                  </label>
                  <Input
                    {...register('username')}
                    placeholder="Enter Login ID"
                    maxLength={50}
                    error={errors.username?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Login Password"
                      error={errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...register('uniqueDevice')}
                    id="uniqueDevice"
                  />
                  <label htmlFor="uniqueDevice" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unique Device Login
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...register('enumeratorWebDashboard')}
                    id="enumeratorWebDashboard"
                  />
                  <label htmlFor="enumeratorWebDashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ODK Dashboard
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}