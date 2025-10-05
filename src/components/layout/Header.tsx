'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGetAgencies } from '@/hooks/useApi';
import { User, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import SelectDropdown from '@/components/ui/SelectDropdown';

export default function Header() {
  const { user: authUser, logout, getRedirectUrl } = useAuth();
  const user = authUser; // Use auth user instead of Redux user
  const notifications: any[] = []; // Empty notifications array for now
  const { getAgencies, data: agenciesData, loading: agenciesLoading, error: agenciesError } = useGetAgencies();

  // Helper function to get role display name
  const getRoleDisplayName = (role: string | undefined): string => {
    const roleDisplayNames: { [key: string]: string } = {
      'super_admin': 'Super Administrator',
      'admin': 'Administrator',
      'pmt': 'Project Progress Monitoring',
      'qc_manager': 'Quality Control Manager',
      'quality_analyst': 'Quality Analyst',
      'start_qc': 'Start QC',
      'data_quality': 'Data Quality',
      'convergent_analysis': 'Convergent Analysis',
    };
    return roleDisplayNames[role || ''] || role || 'admin';
  };
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedAgency, setSelectedAgency] = useState<string>('all');

  // Check if user is PPM or DQM role and system is CAPI (hide for CATI)
  const showAgencySelector = (user?.role === 'ppm' || user?.role === 'dqm') && user?.system === 'capi';

  // Dynamic agency options from API
  const agencyOptions = agenciesData ? [
    { value: 'all', label: 'All Agencies' },
    ...Object.entries(agenciesData).map(([key, value]) => ({
      value: key,
      label: value
    }))
  ] : [
    { value: 'all', label: 'All Agencies' },
    { value: 'agency_001', label: 'Agency 001' },
    { value: 'agency_002', label: 'Agency 002' },
    { value: 'agency_003', label: 'Agency 003' },
    { value: 'agency_004', label: 'Agency 004' },
    { value: 'agency_005', label: 'Agency 005' },
  ];

  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage or system preference
    const getStoredTheme = (): 'light' | 'dark' => {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    const currentTheme = getStoredTheme();
    setTheme(currentTheme);
    
    // Apply theme to document after hydration - use 'dark' class for dark mode, no class for light mode
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch agencies when component mounts and when user role changes
  useEffect(() => {
    if (showAgencySelector) {
      getAgencies();
    }
  }, [showAgencySelector, getAgencies]);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Apply theme to document first
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Then update state
    setTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };


  const handleLogout = () => {
    logout();
  };

  const handleLogoClick = () => {
    // Navigate to role-specific landing page on logo click
    if (authUser) {
      const redirectUrl = getRedirectUrl(authUser.role);
      window.location.href = redirectUrl;
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-40">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center justify-center w-26 h-12 overflow-hidden rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
              onClick={handleLogoClick}
              title="Go to Dashboard"
            >
              <img 
                src="/logo.png" 
                alt="Bihar Election Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text if logo fails to load
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center hidden">
                <span className="text-white font-bold text-lg">BE</span>
              </div>
            </div>
            {/* <div className="hidden md:block">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bihar Election</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Analysis Dashboard</p>
            </div> */}
          </div>
        </div>

        {/* Center - Project Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          West Bengal Opinion Poll 2025
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Agency Selector - Show for PPM and DQM roles */}
          {showAgencySelector && (
            <div className="w-40">
              <SelectDropdown
                options={agencyOptions}
                value={selectedAgency}
                onChange={(value) => setSelectedAgency(value as string)}
                placeholder={agenciesLoading ? "Loading..." : "Select Agency"}
                disabled={agenciesLoading}
              />
              {agenciesError && (
                <div className="text-xs text-red-500 mt-1">
                  Failed to load agencies
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle theme"
          >
            {mounted ? (
              theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.roleDisplayName || getRoleDisplayName(user?.role) || 'admin'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Profile dropdown */}
            {profileOpen && mounted && createPortal(
              <div className="fixed right-4 top-16 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[9999]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || 'admin@biharelection.gov.in'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center space-x-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
