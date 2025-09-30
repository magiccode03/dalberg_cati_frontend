'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import HorizontalNav from './HorizontalNav';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/unauthorized'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Routes that should show header but NOT horizontal menu (home landing page)
  const noMenuRoutes = ['/home'];
  const isNoMenuRoute = noMenuRoutes.includes(pathname);

  // Don't render header and nav for public routes or when loading
  if (isPublicRoute || isLoading) {
    return <>{children}</>;
  }

  // Only render header and nav for authenticated users
  if (isAuthenticated) {
    // Home page: show header but no horizontal menu
    if (isNoMenuRoute) {
      return (
        <>
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </>
      );
    }
    
    // All other pages: show both header and horizontal menu
    return (
      <>
        <Header />
        <HorizontalNav />
        <main className="flex-1">
          {children}
        </main>
      </>
    );
  }

  // For unauthenticated users on protected routes, just render children
  // The ProtectedRoute component will handle the redirect
  return <>{children}</>;
}
