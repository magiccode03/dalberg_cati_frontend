'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  Shield, 
  LogIn,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
  uniqueId: z.string().min(3, 'Unique ID must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      uniqueId: '',
      password: '',
      rememberMe: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock authentication logic
      if (data.uniqueId === 'SUPER001' && data.password === 'super123') {
        setSuccess('Login successful! Redirecting...');
        
        // Store authentication data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          uniqueId: data.uniqueId,
          name: 'Super Administrator',
          email: 'superadmin@bihar2025.gov.in',
          role: 'super_admin',
          avatar: '/logo.png',
        }));

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError('Invalid Unique ID or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    const demoCredentials = {
      'super-admin': { uniqueId: 'SUPER001', password: 'super123' },
      admin: { uniqueId: 'ADMIN001', password: 'admin123' },
      pmt: { uniqueId: 'PMT001', password: 'pmt123' },
      qc: { uniqueId: 'QC001', password: 'qc123' },
      'quality-analyst': { uniqueId: 'QA001', password: 'analyst123' },
    };

    const credentials = demoCredentials[role as keyof typeof demoCredentials];
    if (credentials) {
      setValue('uniqueId', credentials.uniqueId);
      setValue('password', credentials.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Bihar Election 2025"
                width={80}
                height={80}
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="hidden w-20 h-20 bg-blue-600 text-white rounded-lg shadow-lg items-center justify-center text-2xl font-bold"
                style={{ display: 'none' }}
              >
                BE
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bihar Election 2025
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analysis Dashboard System
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <Alert type="error" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </Alert>
          )}

          {success && (
            <Alert type="success" className="mb-4">
              <CheckCircle className="h-4 w-4" />
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register('uniqueId')}
                type="text"
                label="Unique ID"
                placeholder="Enter your unique ID"
                error={errors.uniqueId?.message}
                icon={<User className="h-4 w-4" />}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                icon={<Lock className="h-4 w-4" />}
                disabled={isLoading}
                className="w-full"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid || isLoading}
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('super-admin')}
                disabled={isLoading}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Super Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('pmt')}
                disabled={isLoading}
                className="text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                PMT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('qc')}
                disabled={isLoading}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                QC
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Bihar Election Analysis System. All rights reserved.</p>
          <p className="mt-1">
            For technical support, contact{' '}
            <a href="mailto:support@bihar2025.gov.in" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              support@bihar2025.gov.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
