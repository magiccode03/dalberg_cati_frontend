'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { 
  Shield, 
  ArrowLeft, 
  Home, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import Image from 'next/image';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
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

        {/* Unauthorized Card */}
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this resource
            </p>
          </div>

          <Alert type="error" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <p className="font-medium">Unauthorized Access</p>
              <p className="text-sm mt-1">
                Your account doesn't have the required permissions to view this page. 
                Please contact your administrator if you believe this is an error.
              </p>
            </div>
          </Alert>

          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGoHome}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleGoBack}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleGoToLogin}
              className="w-full"
            >
              <Lock className="h-4 w-4 mr-2" />
              Sign in with Different Account
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Need help?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Contact{' '}
                <a 
                  href="mailto:support@bihar2025.gov.in" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  support@bihar2025.gov.in
                </a>
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Bihar Election Analysis System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
