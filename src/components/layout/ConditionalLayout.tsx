'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import Header from './Header';
import HorizontalNav from './HorizontalNav';
import Sidebar from './Sidebar';
import FDSidebar from './FDSidebar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/unauthorized'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Routes that should show header but NOT horizontal menu (home landing page)
  const noMenuRoutes = ['/home'];
  const isNoMenuRoute = noMenuRoutes.includes(pathname);
  
  // FD routes that should show FD sidebar and NO header
  const fdRoutes = [
    // CAPI FD routes
    '/capi/fd/fieldwork-progress',
    '/capi/fd/demographics/basic-demographics',
    '/capi/fd/demographics/caste',
    '/capi/fd/interview-audio',
    '/capi/fd/findings/vote-share-estimate',
    '/capi/fd/findings/gain-and-losses',
    '/capi/fd/findings/second-choice',
    '/capi/fd/client-comparison',
    // CATI FD routes
    '/cati/fd/progress',
    '/cati/fd/download',
    '/cati/fd/tracking-dashboard',
    '/cati/fd/data-analysis',
  ];
  const isFDRoute = fdRoutes.some(route => pathname.startsWith(route));
  
  // Routes that should show sidebar instead of horizontal menu
  const sidebarRoutes = [
    '/capi/fd/demographics/basic-demographics',
    '/capi/fd/demographics/caste',
  ];
  const isSidebarRoute = sidebarRoutes.includes(pathname);

  // Don't render header and nav for public routes or when loading
  if (isPublicRoute || isLoading) {
    return <>{children}</>;
  }

  // Only render header and nav for authenticated users
  if (isAuthenticated) {
    // FD routes: show header + FD sidebar, NO horizontal menu
    if (isFDRoute && user?.role === 'fd') {
      return (
        <>
          <Header />
          <FDSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
          <main 
            className="transition-all duration-300 ease-in-out min-h-screen bg-gray-50 dark:bg-gray-900 pt-16"
            style={{ marginLeft: isCollapsed ? '4rem' : '16rem' }}
          >
            {children}
          </main>
        </>
      );
    }
    
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
    
    // Sidebar pages: show header and sidebar, but NO horizontal menu
    if (isSidebarRoute) {
      return (
        <>
          <Header />
          <div className="flex">
            <Sidebar />
            <main 
              className="flex-1 pt-16 transition-all duration-300 ease-in-out"
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
