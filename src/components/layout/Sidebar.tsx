'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
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
  Bell
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
  const { sidebarOpen, user } = useAppSelector((state) => state.app);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuItems = user ? getMenuByRole(user.role, user.system) : [];

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Home className="h-5 w-5" />;
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Home;
    return <IconComponent className="h-5 w-5" />;
  };

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-700 overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Bihar Election Logo" 
              className="w-6 h-6 object-contain"
              onError={(e) => {
                // Fallback to text if logo fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'block';
              }}
            />
            <span className="text-white font-bold text-xs hidden">BE</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Bihar Election</h2>
            <p className="text-xs text-gray-400">Analysis Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 px-4 flex-1 overflow-y-auto pb-20 sidebar-scrollbar">
        <ul className="space-y-2">
          {menuItems.length === 0 ? (
            <li className="p-3 text-gray-500 dark:text-gray-400 text-sm">
              No menu items available
            </li>
          ) : (
            menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              {item.children ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg text-white hover:bg-gray-800 transition-colors ${
                      openMenus[item.id] ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span className="ml-3 flex-grow text-left font-medium">{item.label}</span>
                    {openMenus[item.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <div className={`ml-6 mt-2 space-y-1 border-l border-gray-600 pl-4 transition-all duration-300 ease-in-out ${
                    openMenus[item.id] ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                  }`}>
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`flex items-center p-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors ${
                            pathname === child.href ? 'bg-blue-600 text-white font-medium' : ''
                          }`}
                        >
                          {child.icon && getIcon(child.icon)}
                          <span className="ml-3">{child.label}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg text-white hover:bg-gray-800 transition-colors ${
                    pathname === item.href ? 'bg-blue-600 text-white font-medium' : ''
                  }`}
                >
                  {getIcon(item.icon)}
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              )}
            </li>
          )))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="mt-auto p-4 border-t border-gray-700 bg-gray-800 shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.role || 'Role'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
