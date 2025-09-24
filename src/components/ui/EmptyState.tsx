'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { FileX, Search, Database, AlertCircle, Plus, RefreshCw } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }> | 'file' | 'search' | 'database' | 'alert' | 'plus' | 'refresh';
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  illustration?: React.ReactNode;
}

const iconMap = {
  file: FileX,
  search: Search,
  database: Database,
  alert: AlertCircle,
  plus: Plus,
  refresh: RefreshCw,
};

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'space-y-3',
  },
  md: {
    container: 'py-12',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'space-y-4',
  },
  lg: {
    container: 'py-16',
    icon: 'w-20 h-20',
    title: 'text-2xl',
    description: 'text-lg',
    spacing: 'space-y-6',
  },
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  size = 'md',
  illustration,
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;
  const sizeConfig = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeConfig.container,
        className
      )}
    >
      <div className={cn('flex flex-col items-center', sizeConfig.spacing)}>
        {/* Icon or Illustration */}
        {illustration ? (
          <div className="mb-4">
            {illustration}
          </div>
        ) : IconComponent ? (
          <div className={cn(
            'flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500',
            sizeConfig.icon
          )}>
            <IconComponent className={cn('text-gray-400 dark:text-gray-500', sizeConfig.icon)} />
          </div>
        ) : null}

        {/* Content */}
        <div className="max-w-md">
          <h3 className={cn(
            'font-semibold text-gray-900 dark:text-white mb-2',
            sizeConfig.title
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              'text-gray-500 dark:text-gray-400',
              sizeConfig.description
            )}>
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || 'primary'}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || 'outline'}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Preset empty states for common scenarios
export function NoDataEmptyState({
  title = 'No data available',
  description = 'There is no data to display at the moment.',
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: EmptyStateProps['action'];
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="database"
      action={action}
      className={className}
    />
  );
}

export function NoResultsEmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filter criteria.',
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: EmptyStateProps['action'];
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="search"
      action={action}
      className={className}
    />
  );
}

export function ErrorEmptyState({
  title = 'Something went wrong',
  description = 'We encountered an error while loading the data.',
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: EmptyStateProps['action'];
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="alert"
      action={action}
      className={className}
    />
  );
}

export function CreateEmptyState({
  title = 'Get started',
  description = 'Create your first item to get started.',
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: EmptyStateProps['action'];
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="plus"
      action={action}
      className={className}
    />
  );
}
