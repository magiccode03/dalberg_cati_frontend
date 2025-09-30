'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FileText, Phone, Database } from 'lucide-react';

// Role-based route mapping
const roleRouteMap: Record<string, { capi: string; cati: string }> = {
  ppm: {
    capi: '/capi/ppm/overview/fieldwork-progress',
    cati: '/cati/ppm/manage-calling/tele-caller',
  },
  ppmt: {
    capi: '/capi/ppmt/overview/fieldwork-progress',
    cati: '/cati/ppmt/overview/fieldwork-progress',
  },
  dqm: {
    capi: '/capi/dqm/fieldwork-progress',
    cati: '/cati/dqm/fieldwork-progress',
  },
  dqmt: {
    capi: '/capi/dqmt/fieldwork-progress',
    cati: '/cati/dqmt/fieldwork-progress',
  },
  fd: {
    capi: '/capi/fd/fieldwork-progress',
    cati: '/cati/fd/fieldwork-progress',
  },
  start_qc: {
    capi: '/capi/start_qc/start-gps-qc',
    cati: '/cati/start_qc/start-audio-qc',
  },
  cd: {
    capi: '/capi/cd/progress',
    cati: '/cati/cd/progress',
  },
  ss: {
    capi: '/capi/ss/start-form-filling',
    cati: '/cati/ss/start-form-filling',
  },
  atrd: {
    capi: '/capi/atrd/capi',
    cati: '/cati/atrd/capi',
  },
  wba: {
    capi: '/capi/wba',
    cati: '/cati/wba',
  },
  nd: {
    capi: '/capi/nd',
    cati: '/cati/nd',
  },
  pmt: {
    capi: '/pmt/dashboard',
    cati: '/pmt/dashboard',
  },
};

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();

  const handleSystemSelect = (system: 'capi' | 'cati') => {
    if (!user) return;

    // Get the route for this role and system
    const routes = roleRouteMap[user.role];
    if (routes) {
      const targetRoute = routes[system];
      
      // Update user system in both context and localStorage
      updateUser({ system });
      
      // Navigate to the appropriate page
      router.push(targetRoute);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect super_admin and portal_admin to their dashboards
  if (user?.role === 'super_admin') {
    router.push('/super-admin/dashboard');
    return null;
  }

  if (user?.role === 'portal_admin') {
    router.push('/portal-admin/users');
    return null;
  }

  const getRoleDisplayName = () => {
    return user?.roleDisplayName || user?.role?.toUpperCase() || 'User';
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 p-4">
      {/* Title - directly on blue background */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {getRoleDisplayName()}
      </h1>

      {/* White Container for Buttons - spans almost full width */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex gap-4">
          {/* CAPI Button */}
          <button
            onClick={() => handleSystemSelect('capi')}
            className="flex-1 h-20 bg-[#a8d5a1] hover:bg-[#98c591] dark:bg-[#6b9b63] dark:hover:bg-[#5b8b53] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
          >
            <FileText className="h-6 w-6 text-gray-800 dark:text-white" />
            <span className="text-lg font-bold text-gray-800 dark:text-white">CAPI</span>
          </button>

          {/* CATI Button */}
          <button
            onClick={() => handleSystemSelect('cati')}
            className="flex-1 h-20 bg-[#e8d699] hover:bg-[#d8c689] dark:bg-[#b8a679] dark:hover:bg-[#a89669] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Phone className="h-6 w-6 text-gray-800 dark:text-white" />
            <span className="text-lg font-bold text-gray-800 dark:text-white">CATI</span>
          </button>

          {/* CAPI + CATI Button */}
          <button
            className="flex-1 h-20 bg-[#7dd3c0] hover:bg-[#6dc3b0] dark:bg-[#5da39f] dark:hover:bg-[#4d938f] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Database className="h-6 w-6 text-gray-800 dark:text-white" />
            <span className="text-lg font-bold text-gray-800 dark:text-white">CAPI + CATI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
