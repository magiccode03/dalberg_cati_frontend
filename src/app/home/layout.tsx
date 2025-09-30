'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    // Redirect super_admin and portal_admin to their dashboards
    if (!isLoading && user) {
      if (user.role === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else if (user.role === 'portal_admin') {
        router.push('/portal-admin/users');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Render without the default layout (no header/nav)
  return <div className="min-h-screen">{children}</div>;
}
