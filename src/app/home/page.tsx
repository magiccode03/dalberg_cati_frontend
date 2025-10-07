'use client';

import React, { useState } from 'react';
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
    cati: '/cati/fd/telecaller-progress',
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
  const [showProjectManagement, setShowProjectManagement] = useState(false);
  const [showFindingsDashboard, setShowFindingsDashboard] = useState(false);
  const [showProjectProgressMonitoring, setShowProjectProgressMonitoring] = useState(false);

  const handleSystemSelect = (system: 'capi' | 'cati') => {
    if (!user) return;

    // For FD users, keep their role as 'fd' but update system
    if (user.role === 'fd') {
      updateUser({ system });
      // Navigate to FD-specific routes
      const targetRoute = system === 'capi' ? '/capi/fd/fieldwork-progress' : '/cati/fd/telecaller-progress';
      router.push(targetRoute);
    } else {
      // For other users, update both role and system
      const newRole = system === 'capi' ? 'capi_user' : 'cati_user';
      updateUser({ system, role: newRole });
      
      // Navigate to the appropriate page based on system
      const targetRoute = system === 'capi' ? '/capi/fieldwork-progress' : '/cati/telecaller-progress';
      router.push(targetRoute);
    }
  };

  // Handle PPM system selection (for research role Project Progress Monitoring)
  const handlePPMSystemSelect = (system: 'capi' | 'cati') => {
    // Update user system in context
    updateUser({ system });
    
    // Navigate to PPM role routes
    const ppmRoutes = roleRouteMap['ppm'];
    if (ppmRoutes) {
      const targetRoute = ppmRoutes[system];
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

  const isResearchRole = user?.role === 'research' || user?.role === 'research_admin';
  const isFDRole = user?.role === 'fd';

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 p-4">
      {/* Title - directly on blue background */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isResearchRole ? 'Admin Portal' : getRoleDisplayName()}
      </h1>

      {/* White Container for Buttons - spans almost full width */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Research Role Buttons */}
        {isResearchRole && (
          <>
            <div className="flex gap-4">
              {/* Project Management Dashboard Button */}
              <button
                onClick={() => {
                  setShowProjectManagement(!showProjectManagement);
                  setShowFindingsDashboard(false);
                }}
                className={`flex-1 h-14 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center ${
                  showProjectManagement 
                    ? 'bg-[#4338ca] dark:bg-[#3730a3]' 
                    : 'bg-[#6366f1] hover:bg-[#5558e3] dark:bg-[#5558e3] dark:hover:bg-[#4449d5]'
                }`}
              >
                <span className="text-base font-bold text-white">Project Management Dashboard</span>
              </button>

              {/* Findings Dashboard Button */}
              <button
                onClick={() => {
                  setShowFindingsDashboard(!showFindingsDashboard);
                  setShowProjectManagement(false);
                }}
                className={`flex-1 h-14 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center ${
                  showFindingsDashboard
                    ? 'bg-[#1d4ed8] dark:bg-[#1e40af]'
                    : 'bg-[#3b82f6] hover:bg-[#2c73e8] dark:bg-[#2c73e8] dark:hover:bg-[#1d64da]'
                }`}
              >
                <span className="text-base font-bold text-white">Findings Dashboard</span>
              </button>

              {/* Access to Raw Data Button */}
              <button
                onClick={() => {
                  setShowProjectManagement(false);
                  setShowFindingsDashboard(false);
                  router.push('/research/system-selection');
                }}
                className="flex-1 h-14 bg-[#06b6d4] hover:bg-[#0595b6] dark:bg-[#0595b6] dark:hover:bg-[#047a98] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
              >
                <span className="text-base font-bold text-white">Access to Raw Data</span>
              </button>
            </div>

            {/* Project Management Dashboard Sub-options */}
            {showProjectManagement && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Project Management Dashboard
                </h2>
                <div className="flex gap-4">
                  {/* Project Progress Monitoring Button */}
                  <button
                    onClick={() => setShowProjectProgressMonitoring(!showProjectProgressMonitoring)}
                    className={`flex-1 h-14 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center ${
                      showProjectProgressMonitoring
                        ? 'bg-[#4338ca] dark:bg-[#3730a3]'
                        : 'bg-[#6366f1] hover:bg-[#5558e3] dark:bg-[#5558e3] dark:hover:bg-[#4449d5]'
                    }`}
                  >
                    <span className="text-base font-bold text-white">Project Progress Monitoring</span>
                  </button>

                  {/* Data Quality Management Button */}
                  <button
                    onClick={() => {
                      setShowProjectProgressMonitoring(false);
                      router.push('/research/data-quality-management');
                    }}
                    className="flex-1 h-14 bg-[#6366f1] hover:bg-[#5558e3] dark:bg-[#5558e3] dark:hover:bg-[#4449d5] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    <span className="text-base font-bold text-white">Data Quality Management</span>
                  </button>
                </div>

                {/* Project Progress Monitoring - System Selection */}
                {showProjectProgressMonitoring && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Select System
                    </h3>
                    <div className="flex gap-4">
                      {/* CAPI Button */}
                      <button
                        onClick={() => handlePPMSystemSelect('capi')}
                        className="flex-1 h-14 bg-[#a8d5a1] hover:bg-[#98c591] dark:bg-[#6b9b63] dark:hover:bg-[#5b8b53] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
                      >
                        <FileText className="h-5 w-5 text-gray-800 dark:text-white" />
                        <span className="text-base font-bold text-gray-800 dark:text-white">CAPI</span>
                      </button>

                      {/* CATI Button */}
                      <button
                        onClick={() => handlePPMSystemSelect('cati')}
                        className="flex-1 h-14 bg-[#e8d699] hover:bg-[#d8c689] dark:bg-[#b8a679] dark:hover:bg-[#a89669] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
                      >
                        <Phone className="h-5 w-5 text-gray-800 dark:text-white" />
                        <span className="text-base font-bold text-gray-800 dark:text-white">CATI</span>
                      </button>

                      {/* CAPI + CATI Button - Hidden for FD users */}
                      {!isFDRole && (
                        <button
                          className="flex-1 h-14 bg-[#7dd3c0] hover:bg-[#6dc3b0] dark:bg-[#5da39f] dark:hover:bg-[#4d938f] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
                        >
                          <Database className="h-5 w-5 text-gray-800 dark:text-white" />
                          <span className="text-base font-bold text-gray-800 dark:text-white">CAPI + CATI</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Findings Dashboard Sub-options */}
            {showFindingsDashboard && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Findings Dashboard
                </h2>
                <div className="flex gap-4">
                  {/* Findings Dashboard Button */}
                  <button
                    onClick={() => router.push('/research/findings-dashboard')}
                    className="flex-1 h-14 bg-[#3b82f6] hover:bg-[#2c73e8] dark:bg-[#2c73e8] dark:hover:bg-[#1d64da] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    <span className="text-base font-bold text-white">Findings Dashboard</span>
                  </button>

                  {/* Normalization Dashboard Button */}
                  <button
                    onClick={() => router.push('/research/normalization-dashboard')}
                    className="flex-1 h-14 bg-[#3b82f6] hover:bg-[#2c73e8] dark:bg-[#2c73e8] dark:hover:bg-[#1d64da] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    <span className="text-base font-bold text-white">Normalization Dashboard</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* CAPI/CATI Buttons - Show for non-research roles */}
        {!isResearchRole && (
          <div className="flex gap-4">
            {/* CAPI Button */}
            <button
              onClick={() => handleSystemSelect('capi')}
              className="flex-1 h-14 bg-[#a8d5a1] hover:bg-[#98c591] dark:bg-[#6b9b63] dark:hover:bg-[#5b8b53] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
            >
              <FileText className="h-5 w-5 text-gray-800 dark:text-white" />
              <span className="text-base font-bold text-gray-800 dark:text-white">CAPI</span>
            </button>

            {/* CATI Button */}
            <button
              onClick={() => handleSystemSelect('cati')}
              className="flex-1 h-14 bg-[#e8d699] hover:bg-[#d8c689] dark:bg-[#b8a679] dark:hover:bg-[#a89669] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Phone className="h-5 w-5 text-gray-800 dark:text-white" />
              <span className="text-base font-bold text-gray-800 dark:text-white">CATI</span>
            </button>

            {/* CAPI + CATI Button - Hidden for FD users */}
            {!isFDRole && (
              <button
                className="flex-1 h-14 bg-[#7dd3c0] hover:bg-[#6dc3b0] dark:bg-[#5da39f] dark:hover:bg-[#4d938f] rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Database className="h-5 w-5 text-gray-800 dark:text-white" />
                <span className="text-base font-bold text-gray-800 dark:text-white">CAPI + CATI</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
