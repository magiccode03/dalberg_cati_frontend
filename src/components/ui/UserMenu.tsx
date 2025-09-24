'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { User, Settings, LogOut, ChevronDown, Bell, Shield, HelpCircle, CreditCard, BarChart3 } from 'lucide-react';

export interface UserMenuProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  menuItems?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    divider?: boolean;
    danger?: boolean;
  }>;
  showStatus?: boolean;
  showRole?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

const sizeClasses = {
  sm: {
    avatar: 'h-6 w-6',
    text: 'text-sm',
    icon: 'h-4 w-4',
    menu: 'w-48',
  },
  md: {
    avatar: 'h-8 w-8',
    text: 'text-sm',
    icon: 'h-4 w-4',
    menu: 'w-56',
  },
  lg: {
    avatar: 'h-10 w-10',
    text: 'text-base',
    icon: 'h-5 w-5',
    menu: 'w-64',
  },
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const defaultMenuItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
    onClick: () => {},
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    onClick: () => {},
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCard className="h-4 w-4" />,
    onClick: () => {},
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    onClick: () => {},
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: <HelpCircle className="h-4 w-4" />,
    onClick: () => {},
  },
  {
    id: 'divider',
    label: '',
    onClick: () => {},
    divider: true,
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: <LogOut className="h-4 w-4" />,
    onClick: () => {},
    danger: true,
  },
];

export default function UserMenu({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
  menuItems = defaultMenuItems,
  showStatus = true,
  showRole = true,
  size = 'md',
  variant = 'ghost',
  className,
  disabled = false,
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeConfig = sizeClasses[size];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleMenuToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    if (item.id === 'profile' && onProfileClick) {
      onProfileClick();
    } else if (item.id === 'settings' && onSettingsClick) {
      onSettingsClick();
    } else if (item.id === 'logout' && onLogout) {
      onLogout();
    } else {
      item.onClick();
    }
    setIsOpen(false);
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNotificationClick?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    if (!status || !showStatus) return '';
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.offline;
  };

  return (
    <div className="relative">
      {/* User Menu Button */}
      <Button
        ref={buttonRef}
        onClick={handleMenuToggle}
        disabled={disabled}
        variant={variant}
        size={size}
        className={cn('flex items-center space-x-2', className)}
      >
        {/* Notifications */}
        {showNotifications && (
          <div className="relative">
            <Bell className={sizeConfig.icon} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </div>
        )}

        {/* Avatar */}
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={cn('rounded-full object-cover', sizeConfig.avatar)}
            />
          ) : (
            <div className={cn(
              'rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium',
              sizeConfig.avatar
            )}>
              {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
            </div>
          )}
          
          {/* Status Indicator */}
          {user?.status && showStatus && (
            <div className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800',
              getStatusColor(user.status)
            )} />
          )}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <div className={cn('font-medium text-gray-900 dark:text-white', sizeConfig.text)}>
            {user?.name || 'User'}
          </div>
          {showRole && user?.role && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user.role}
            </div>
          )}
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown className={cn(
          'text-gray-400 transition-transform duration-200',
          sizeConfig.icon,
          isOpen && 'transform rotate-180'
        )} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50',
            sizeConfig.menu
          )}
        >
          {/* User Info Header */}
          {user && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={cn('rounded-full object-cover', sizeConfig.avatar)}
                    />
                  ) : (
                    <div className={cn(
                      'rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium',
                      sizeConfig.avatar
                    )}>
                      {getInitials(user.name)}
                    </div>
                  )}
                  
                  {user.status && showStatus && (
                    <div className={cn(
                      'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800',
                      getStatusColor(user.status)
                    )} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn('font-medium text-gray-900 dark:text-white truncate', sizeConfig.text)}>
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </div>
                  {showRole && user.role && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              if (item.divider) {
                return (
                  <div
                    key={item.id}
                    className="border-t border-gray-200 dark:border-gray-700 my-1"
                  />
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-2 text-left text-sm transition-colors',
                    item.danger
                      ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {item.icon && (
                    <span className="flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple User Menu (just avatar and name)
export function SimpleUserMenu({
  user,
  onLogout,
  onProfileClick,
  size = 'sm',
  variant = 'ghost',
  className,
  disabled,
}: Omit<UserMenuProps, 'showStatus' | 'showRole' | 'showNotifications' | 'menuItems'>) {
  const simpleMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      onClick: () => onProfileClick?.(),
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: <LogOut className="h-4 w-4" />,
      onClick: () => onLogout?.(),
      danger: true,
    },
  ];

  return (
    <UserMenu
      user={user}
      onLogout={onLogout}
      onProfileClick={onProfileClick}
      menuItems={simpleMenuItems}
      showStatus={false}
      showRole={false}
      showNotifications={false}
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
    />
  );
}

// User Menu with Notifications
export function UserMenuWithNotifications({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  size = 'md',
  variant = 'ghost',
  className,
  disabled,
}: Omit<UserMenuProps, 'showStatus' | 'showRole' | 'menuItems'>) {
  return (
    <UserMenu
      user={user}
      onLogout={onLogout}
      onProfileClick={onProfileClick}
      onSettingsClick={onSettingsClick}
      showNotifications={showNotifications}
      notificationCount={notificationCount}
      onNotificationClick={onNotificationClick}
      showStatus={false}
      showRole={false}
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
    />
  );
}
