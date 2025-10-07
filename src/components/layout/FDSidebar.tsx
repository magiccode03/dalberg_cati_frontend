'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  Mic, 
  TrendingUp, 
  GitCompare,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface FDSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function FDSidebar({ isCollapsed, onToggle }: FDSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which system we're in based on current pathname
  const isCATISystem = pathname.startsWith('/cati/fd');
  const isCAPISystem = pathname.startsWith('/capi/fd');

  // CAPI FD menu items
  const capiMenuItems = [
    {
      id: 'fieldwork-progress',
      label: 'Fieldwork Progress',
      icon: BarChart3,
      href: '/capi/fd/fieldwork-progress',
      hasSubmenu: false,
    },
    {
      id: 'progress-report',
      label: 'Progress Report',
      icon: TrendingUp,
      href: '/capi/fd/progress-report',
      hasSubmenu: false,
    },
    {
      id: 'interview-audios',
      label: 'Interview Audios',
      icon: Mic,
      href: '/capi/fd/interview-audio',
      hasSubmenu: false,
    },
  ];

  // CATI FD menu items
  const catiMenuItems = [
    {
      id: 'telecaller-progress',
      label: 'Telecaller Progress',
      icon: BarChart3,
      href: '/cati/fd/telecaller-progress',
      hasSubmenu: false,
    },
    {
      id: 'telecaller-daily-call-details',
      label: 'Telecaller Daily Call Details',
      icon: TrendingUp,
      href: '/cati/fd/telecaller-daily-call-details',
      hasSubmenu: false,
    },
    {
      id: 'interview-audios',
      label: 'Interview Audios',
      icon: Mic,
      href: '/cati/fd/interview-audio',
      hasSubmenu: false,
    },
  ];

  // Select the appropriate menu items based on current system
  const menuItems = isCATISystem ? catiMenuItems : capiMenuItems;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  if (!mounted) {
    return null;
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header Section */}
      <div className="px-4 md:px-6 py-2 border-b border-gray-200 dark:border-gray-700">
        {isCollapsed ? (
          /* Collapsed State - Image 1 */
          <div className="flex flex-col items-center space-y-4">
            {/* Hamburger Menu */}
            <button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Expand sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            {/* Navigation Icons */}
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`p-2 rounded-md transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* Expanded State - Image 2 */
          <div className="flex items-center justify-between h-12">
            <div className="w-25 md:w-26 h-10 md:h-12 overflow-hidden rounded-lg">
              <img 
                src="/logo.png" 
                alt="Bihar Election Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = 'block';
                }}
              />
              <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center hidden">
                <span className="text-white font-bold text-sm md:text-lg">BE</span>
              </div>
            </div>
            
            {/* Collapse Button */}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation - Only show in expanded state */}
      {!isCollapsed && (
        <nav className="mt-6 px-4 flex-1 overflow-y-auto sidebar-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors touch-manipulation ${
                      active
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="ml-3 flex-grow text-left font-medium">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </aside>
  );
}
