'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import Header from './Header';
import HorizontalNav from './HorizontalNav';
import Sidebar from './Sidebar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isCollapsed } = useSidebar();

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/unauthorized'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Routes that should show header but NOT horizontal menu (home landing page)
  const noMenuRoutes = ['/home'];
  const isNoMenuRoute = noMenuRoutes.includes(pathname);
  
  // Routes that should show sidebar instead of horizontal menu
  const sidebarRoutes = [
    '/capi/fd/demographics/basic-demographics',
    '/capi/fd/demographics/caste',
  ];
  const isSidebarRoute = sidebarRoutes.includes(pathname);
  
  // Check if user has 'fd' role - show sidebar for all FD pages
  const isFDRole = user?.role === 'fd';
  const isFDPage = pathname.startsWith('/capi/fd/') || pathname.startsWith('/cati/fd/');
  const shouldShowSidebar = isFDRole && isFDPage;

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
          <Header key={pathname} />
          <main className="flex-1">
            {children}
          </main>
        </>
      );
    }
    
    // Sidebar pages: show header and sidebar, but NO horizontal menu
    if (isSidebarRoute || shouldShowSidebar) {
      return (
        <>
          <Header key={pathname} />
          <div className="flex">
            <Sidebar key={pathname} />
            <main 
              className="flex-1 pt-4 transition-all duration-300 ease-in-out"
              style={{ marginLeft: isCollapsed ? '4rem' : '16rem' }}
            >
              {children}
            </main>
          </div>
        </>
      );
    }
    
    // All other pages: show both header and horizontal menu
    return (
      <>
        <Header key={pathname} />
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
