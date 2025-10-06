'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { getMenuByRole } from '@/lib/menu-data';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
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
  Menu
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

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = user ? getMenuByRole(user.role, user.system) : [];

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      toggleSidebar();
    }
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Home className="h-5 w-5" />;
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Home;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        // Mobile responsive classes
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo and Toggle */}
        <div className="px-4 md:px-6 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-12">
            {(!isCollapsed || window.innerWidth < 768) && (
              <div className="w-20 md:w-26 h-10 md:h-12 overflow-hidden rounded-lg">
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
            )}
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-3 md:mt-5 px-2 flex-1 overflow-y-auto pb-20 sidebar-scrollbar">
          <ul className="space-y-1 md:space-y-2">
            {menuItems.length === 0 ? (
              (!isCollapsed || window.innerWidth < 768) && (
                <li className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                  No menu items available
                </li>
              )
            ) : (
              menuItems.map((item) => (
              <li key={item.id} className="mb-1 md:mb-2">
                {item.children ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`flex items-center w-full p-3 rounded-lg transition-colors touch-manipulation ${
                        openMenus[item.id] 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : ''}
                    >
                      {getIcon(item.icon)}
                      {(!isCollapsed || window.innerWidth < 768) && (
                        <>
                          <span className="ml-3 flex-grow text-left font-medium">{item.label}</span>
                          {openMenus[item.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <div className={`ml-6 mt-2 space-y-1 border-l border-gray-300 dark:border-gray-600 pl-4 transition-all duration-300 ease-in-out ${
                        openMenus[item.id] ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                      }`}>
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className={`flex items-center p-2 rounded-lg text-sm transition-colors touch-manipulation ${
                                pathname === child.href 
                                  ? 'bg-blue-600 text-white font-medium' 
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                              onClick={() => {
                                // Close mobile sidebar when navigating
                                if (window.innerWidth < 768) {
                                  setIsMobileOpen(false);
                                }
                              }}
                            >
                              {child.icon && getIcon(child.icon)}
                              <span className="ml-3">{child.label}</span>
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors touch-manipulation ${
                      pathname === item.href 
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : ''}
                    onClick={() => {
                      // Close mobile sidebar when navigating
                      if (window.innerWidth < 768) {
                        setIsMobileOpen(false);
                      }
                    }}
                  >
                    {getIcon(item.icon)}
                    {(!isCollapsed || window.innerWidth < 768) && <span className="ml-3 font-medium">{item.label}</span>}
                  </Link>
                )}
              </li>
            )))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
