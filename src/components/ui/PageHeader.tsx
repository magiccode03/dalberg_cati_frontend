'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Breadcrumb } from './Breadcrumb';
import { Badge } from './Badge';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Settings, 
  Download, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Share, 
  Bookmark,
  RefreshCw,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';

export interface PageHeaderAction {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
  tooltip?: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  hidden?: boolean;
  group?: string;
  order?: number;
}

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
  active?: boolean;
  icon?: React.ReactNode;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  status?: string;
  statusVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  progress?: number;
  progressLabel?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  actions?: PageHeaderAction[];
  primaryAction?: PageHeaderAction;
  secondaryActions?: PageHeaderAction[];
  backButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  search?: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
  };
  filters?: {
    label: string;
    count: number;
    onClick: () => void;
  };
  tabs?: {
    items: { label: string; value: string; badge?: string | number }[];
    activeTab: string;
    onTabChange: (tab: string) => void;
  };
  stats?: {
    label: string;
    value: string | number;
    change?: number;
    changeType?: 'positive' | 'negative' | 'neutral';
  }[];
  className?: string;
  compact?: boolean;
  sticky?: boolean;
  showDivider?: boolean;
  loading?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  icon,
  badge,
  badgeVariant = 'default',
  status,
  statusVariant = 'default',
  progress,
  progressLabel,
  breadcrumbs,
  actions = [],
  primaryAction,
  secondaryActions = [],
  backButton,
  search,
  filters,
  tabs,
  stats,
  className,
  compact = false,
  sticky = false,
  showDivider = true,
  loading = false,
  error,
  warning,
  info,
  success,
  children,
}: PageHeaderProps) {
  const allActions = [
    ...(primaryAction ? [primaryAction] : []),
    ...secondaryActions,
    ...actions,
  ].filter(action => !action.hidden).sort((a, b) => (a.order || 0) - (b.order || 0));

  const groupedActions = allActions.reduce((acc, action) => {
    const group = action.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(action);
    return acc;
  }, {} as Record<string, PageHeaderAction[]>);

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
        sticky && 'sticky top-0 z-20',
        className
      )}
    >
      <div className={cn('px-6', compact ? 'py-4' : 'py-6')}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="flex-shrink-0">
                  {icon}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h1 className={cn(
                    'font-semibold text-gray-900 dark:text-white truncate',
                    compact ? 'text-lg' : 'text-2xl'
                  )}>
                    {title}
                  </h1>
                  
                  {badge && (
                    <Badge variant={badgeVariant} size="sm">
                      {badge}
                    </Badge>
                  )}
                  
                  {status && (
                    <StatusBadge status={status} variant={statusVariant} />
                  )}
                </div>
                
                {subtitle && (
                  <p className={cn(
                    'text-gray-600 dark:text-gray-400 mt-1',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {subtitle}
                  </p>
                )}
                
                {description && (
                  <p className={cn(
                    'text-gray-500 dark:text-gray-500 mt-2',
                    compact ? 'text-xs' : 'text-sm'
                  )}>
                    {description}
                  </p>
                )}
              </div>
            </div>

            {progress !== undefined && (
              <div className="mt-4">
                <ProgressBar
                  progress={progress}
                  size="sm"
                  showLabel={!!progressLabel}
                  label={progressLabel}
                />
              </div>
            )}

            {stats && stats.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                    {stat.change !== undefined && (
                      <div className={cn(
                        'text-xs mt-1',
                        stat.changeType === 'positive' && 'text-green-600',
                        stat.changeType === 'negative' && 'text-red-600',
                        stat.changeType === 'neutral' && 'text-gray-600'
                      )}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(error || warning || info || success) && (
              <div className="mt-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}
                {warning && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</p>
                  </div>
                )}
                {info && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">{info}</p>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                    <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {backButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={backButton.onClick}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{backButton.label}</span>
              </Button>
            )}

            {search && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={search.placeholder}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && search.onSearch?.(search.value)}
                  className="w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            )}

            {filters && (
              <Button
                variant="outline"
                size="sm"
                onClick={filters.onClick}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>{filters.label}</span>
                {filters.count > 0 && (
                  <Badge variant="primary" size="sm">
                    {filters.count}
                  </Badge>
                )}
              </Button>
            )}

            {Object.entries(groupedActions).map(([group, groupActions]) => (
              <div key={group} className="flex items-center space-x-2">
                {groupActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size={action.size || 'sm'}
                    disabled={action.disabled || loading}
                    loading={action.loading}
                    onClick={action.onClick}
                    className={cn(
                      'flex items-center space-x-2',
                      action.className
                    )}
                    title={action.tooltip}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                    {action.badge && (
                      <Badge variant={action.badgeVariant || 'default'} size="sm">
                        {action.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {tabs && (
          <div className="mt-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.items.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => tabs.onTabChange(tab.value)}
                    className={cn(
                      'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                      tab.value === tabs.activeTab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <Badge variant="secondary" size="sm">
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>

      {showDivider && (
        <div className="border-b border-gray-200 dark:border-gray-700" />
      )}
    </div>
  );
}
