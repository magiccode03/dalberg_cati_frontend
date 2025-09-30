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
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import { apiService } from '@/lib/api-service';

// Form validation schema
const userSchema = z.object({
  uniqueId: z.string().min(1, 'Unique ID is required'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roleId: z.number().min(1, 'Please select a role'),
  portalSlug: z.string().min(1, 'Portal slug is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

interface Role {
  id: number;
  name: string;
  displayName: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      uniqueId: '',
      email: '',
      firstName: '',
      lastName: '',
      roleId: 0,
      portalSlug: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/roles?isActive=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setRoles(data.data);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.createUser({
        uniqueId: data.uniqueId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        roleId: data.roleId,
        portalSlug: data.portalSlug,
        isActive: true,
      });

      if (result.success) {
        setSuccess('User created successfully!');
        reset();
        setTimeout(() => {
          router.push('/super-admin/users');
        }, 1500);
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Error creating user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.displayName || role.name,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
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
                  Create New User
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Add a new user to the system
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <Input
                    {...register('firstName')}
                    placeholder="Enter first name"
                    error={errors.firstName?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <Input
                    {...register('lastName')}
                    placeholder="Enter last name"
                    error={errors.lastName?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unique ID *
                  </label>
                  <Input
                    {...register('uniqueId')}
                    placeholder="e.g., USER001"
                    error={errors.uniqueId?.message}
                  />
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="user@example.com"
                    error={errors.email?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portal Slug *
                  </label>
                  <Input
                    {...register('portalSlug')}
                    placeholder="e.g., john-doe"
                    error={errors.portalSlug?.message}
                  />
                </div>
              </div>
            </div>

            {/* Role & Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Role & Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role *
                  </label>
                  <select
                    {...register('roleId', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value={0}>Select a role</option>
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.roleId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      error={errors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
                Create User
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
