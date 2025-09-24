'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  closable?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  lazy?: boolean;
  scrollable?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  default: {
    container: 'border-b border-gray-200 dark:border-gray-700',
    tab: 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
    active: 'border-blue-500 text-blue-600 dark:text-blue-400',
  },
  pills: {
    container: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-1',
    tab: 'rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700',
    active: 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white',
  },
  underline: {
    container: 'border-b border-gray-200 dark:border-gray-700',
    tab: 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
    active: 'border-blue-500 text-blue-600 dark:text-blue-400',
  },
  cards: {
    container: 'bg-gray-50 dark:bg-gray-800 rounded-lg p-1',
    tab: 'rounded-md text-gray-500 hover:text-gray-700 hover:bg-white dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700',
    active: 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white',
  },
};

const sizeClasses = {
  sm: {
    tab: 'px-3 py-2 text-sm',
    content: 'p-4',
  },
  md: {
    tab: 'px-4 py-3 text-sm',
    content: 'p-6',
  },
  lg: {
    tab: 'px-6 py-4 text-base',
    content: 'p-8',
  },
};

export default function Tabs({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  onTabClose,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  tabClassName,
  contentClassName,
  lazy = false,
  scrollable = false,
  fullWidth = false,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(
    new Set([defaultActiveTab || tabs[0]?.id || ''])
  );
  
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const isControlled = controlledActiveTab !== undefined;
  const currentActiveTab = isControlled ? controlledActiveTab : internalActiveTab;

  const variantConfig = variantClasses[variant];
  const sizeConfig = sizeClasses[size];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    
    if (!lazy) {
      setLoadedTabs(prev => new Set([...prev, tabId]));
    }
    
    onTabChange?.(tabId);
  };

  // Handle tab close
  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose?.(tabId);
  };

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollable) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentActiveTab, scrollable]);

  // Get active tab content
  const activeTab = tabs.find(tab => tab.id === currentActiveTab);
  const shouldRenderContent = !lazy || loadedTabs.has(currentActiveTab);

  const containerClasses = cn(
    orientation === 'horizontal' ? 'flex flex-col' : 'flex',
    className
  );

  const tabListClasses = cn(
    'flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    variantConfig.container,
    scrollable && orientation === 'horizontal' && 'overflow-x-auto scrollbar-hide',
    fullWidth && 'w-full'
  );

  const tabClasses = cn(
    'flex items-center justify-center font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    sizeConfig.tab,
    fullWidth && 'flex-1',
    tabClassName
  );

  const contentClasses = cn(
    'flex-1',
    sizeConfig.content,
    contentClassName
  );

  return (
    <div className={containerClasses}>
      {/* Tab List */}
      <div className={tabListClasses} ref={tabListRef}>
        {tabs.map((tab) => {
          const isActive = tab.id === currentActiveTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                tabClasses,
                variantConfig.tab,
                isActive && variantConfig.active,
                isDisabled && 'opacity-50 cursor-not-allowed',
                orientation === 'vertical' && 'justify-start'
              )}
            >
              {/* Icon */}
              {tab.icon && (
                <span className="mr-2 flex-shrink-0">
                  {tab.icon}
                </span>
              )}

              {/* Label */}
              <span className="truncate">
                {tab.label}
              </span>

              {/* Badge */}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full">
                  {tab.badge}
                </span>
              )}

              {/* Close Button */}
              {tab.closable && (
                <button
                  type="button"
                  onClick={(e) => handleTabClose(e, tab.id)}
                  className="ml-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Close tab"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {shouldRenderContent && activeTab && (
        <div className={contentClasses}>
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

// Tab Panel Component
export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  );
}

// Tab List Component
export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div className={cn('flex border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}

// Tab Component
export interface TabProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Tab({ children, isActive, onClick, disabled, className }: TabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors',
        isActive
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

// Tab Panels Component
export interface TabPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanels({ children, className }: TabPanelsProps) {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
}
// Tab Panel Component
export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  );
}

