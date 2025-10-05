'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getMenuByRole } from '@/lib/menu-data';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  BarChart3, 
  Users, 
  Shield, 
  UserCheck, 
  Play, 
  Database, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Map, 
  TrendingUp, 
  ClipboardList, 
  UserCog, 
  Sliders,
  Server,
  Phone,
  Upload,
  Download,
  RefreshCw,
  Edit,
  Calendar,
  MapPin,
  Scale,
  Send,
  Mic,
  Target,
  ThumbsUp,
  GitCompare,
  Monitor,
  UserPlus,
  List,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';

const iconMap = {
  Home,
  BarChart3,
  Users,
  Shield,
  UserCheck,
  Play,
  Database,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Map,
  TrendingUp,
  ClipboardList,
  UserCog,
  Sliders,
  Server,
  Phone,
  Upload,
  Download,
  RefreshCw,
  Edit,
  Calendar,
  MapPin,
  Scale,
  Send,
  Mic,
  Target,
  ThumbsUp,
  GitCompare,
  Monitor,
  UserPlus,
  List,
  Search,
  Bell,
};

export default function HorizontalNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const menuItems = user ? getMenuByRole(user.role, user.system) : [];

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => {
      // Close all other menus and toggle the clicked one
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== id) {
          newState[key] = false;
        }
      });
      newState[id] = !prev[id];
      return newState;
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside the navigation
      if (navRef.current && navRef.current.contains(target)) {
        return;
      }
      
      // Close desktop dropdowns but keep mobile menu open until explicitly closed
      if (window.innerWidth >= 768) {
        setOpenMenus({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Make navbar sticky when it reaches the top
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const shouldBeSticky = rect.top <= 0;
        setIsSticky(shouldBeSticky);
      }
    };

    // Check initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Home className="h-4 w-4" />;
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Home;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav ref={navRef} className={`hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 ${
        isSticky ? 'sticky top-0 z-30' : 'relative'
      }`}>
        <div className="px-6 py-3">
          <div className="flex items-center space-x-1">
            {/* Main Menu Items */}
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                {item.children ? (
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        openMenus[item.id] 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {getIcon(item.icon)}
                      <span>{item.label}</span>
                      {openMenus[item.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openMenus[item.id] && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                pathname === child.href ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                              }`}
                              onClick={() => setOpenMenus({})}
                            >
                              {getIcon(child.icon)}
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      pathname === item.href 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className={`md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 ${
        isSticky ? 'sticky top-0 z-30' : 'relative'
      }`}>
        <div className="px-4 py-3">
          {/* Mobile Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Navigation
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu Items */}
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  {item.children ? (
                    <div className="py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(item.id);
                        }}
                        className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          openMenus[item.id] 
                            ? 'bg-blue-600 text-white shadow-sm border border-blue-500' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {getIcon(item.icon)}
                          <span>{item.label}</span>
                        </div>
                        {openMenus[item.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {/* Mobile Submenu */}
                      {openMenus[item.id] && (
                        <div className="mt-2 ml-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-700 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                pathname === child.href 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => {
                                setOpenMenus({});
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {getIcon(child.icon)}
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pathname === item.href 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {getIcon(item.icon)}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
