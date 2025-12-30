'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PMTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'pmt')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'pmt') {
    return null;
  }

  // Hide horizontal navbar for PPMP page
  const isPPMPPage = pathname === '/pmt/ppmp';
  
  useEffect(() => {
    if (isPPMPPage) {
      // Hide the horizontal navbar by adding a CSS class to the body
      document.body.classList.add('hide-horizontal-nav');
    } else {
      // Remove the class when leaving PPMP page
      document.body.classList.remove('hide-horizontal-nav');
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('hide-horizontal-nav');
    };
  }, [isPPMPPage]);

  return <>{children}</>;
}
