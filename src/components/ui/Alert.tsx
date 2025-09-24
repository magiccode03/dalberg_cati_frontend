'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  title?: string;
  className?: string;
  showIcon?: boolean;
  rounded?: boolean;
}

const typeClasses = {
  info: {
    default: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    filled: {
      bg: 'bg-blue-600',
      border: 'border-blue-600',
      text: 'text-white',
      icon: 'text-white',
    },
    outlined: {
      bg: 'bg-transparent',
      border: 'border-blue-600',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  },
  success: {
    default: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-600 dark:text-green-400',
    },
    filled: {
      bg: 'bg-green-600',
      border: 'border-green-600',
      text: 'text-white',
      icon: 'text-white',
    },
    outlined: {
      bg: 'bg-transparent',
      border: 'border-green-600',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-600 dark:text-green-400',
    },
  },
  warning: {
    default: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    filled: {
      bg: 'bg-yellow-600',
      border: 'border-yellow-600',
      text: 'text-white',
      icon: 'text-white',
    },
    outlined: {
      bg: 'bg-transparent',
      border: 'border-yellow-600',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
  },
  error: {
    default: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
    },
    filled: {
      bg: 'bg-red-600',
      border: 'border-red-600',
      text: 'text-white',
      icon: 'text-white',
    },
    outlined: {
      bg: 'bg-transparent',
      border: 'border-red-600',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
    },
  },
};

const sizeClasses = {
  sm: {
    container: 'p-3',
    icon: 'h-4 w-4',
    title: 'text-sm font-medium',
    content: 'text-sm',
    dismiss: 'h-4 w-4',
  },
  md: {
    container: 'p-4',
    icon: 'h-5 w-5',
    title: 'text-base font-medium',
    content: 'text-sm',
    dismiss: 'h-5 w-5',
  },
  lg: {
    container: 'p-6',
    icon: 'h-6 w-6',
    title: 'text-lg font-medium',
    content: 'text-base',
    dismiss: 'h-6 w-6',
  },
};

const defaultIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export default function Alert({
  children,
  type = 'info',
  variant = 'default',
  size = 'md',
  dismissible = false,
  onDismiss,
  icon,
  title,
  className,
  showIcon = true,
  rounded = true,
}: AlertProps) {
  const typeConfig = typeClasses[type][variant];
  const sizeConfig = sizeClasses[size];
  const DefaultIcon = defaultIcons[type];

  const handleDismiss = () => {
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        'relative flex items-start',
        typeConfig.bg,
        typeConfig.border,
        'border',
        rounded ? 'rounded-lg' : 'rounded-none',
        sizeConfig.container,
        className
      )}
      role="alert"
    >
      {/* Icon */}
      {showIcon && (
        <div className={cn('flex-shrink-0 mr-3', typeConfig.icon)}>
          {icon || <DefaultIcon className={sizeConfig.icon} />}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={cn(
            'mb-1',
            sizeConfig.title,
            typeConfig.text
          )}>
            {title}
          </h3>
        )}
        <div className={cn(
          sizeConfig.content,
          typeConfig.text
        )}>
          {children}
        </div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 ml-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
            typeConfig.icon
          )}
          aria-label="Dismiss alert"
        >
          <X className={sizeConfig.dismiss} />
        </button>
      )}
    </div>
  );
}

// Preset Alert Components
export function InfoAlert({
  children,
  title,
  dismissible,
  onDismiss,
  className,
  ...props
}: Omit<AlertProps, 'type'>) {
  return (
    <Alert
      type="info"
      title={title}
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
      {...props}
    >
      {children}
    </Alert>
  );
}

export function SuccessAlert({
  children,
  title,
  dismissible,
  onDismiss,
  className,
  ...props
}: Omit<AlertProps, 'type'>) {
  return (
    <Alert
      type="success"
      title={title}
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
      {...props}
    >
      {children}
    </Alert>
  );
}

export function WarningAlert({
  children,
  title,
  dismissible,
  onDismiss,
  className,
  ...props
}: Omit<AlertProps, 'type'>) {
  return (
    <Alert
      type="warning"
      title={title}
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
      {...props}
    >
      {children}
    </Alert>
  );
}

export function ErrorAlert({
  children,
  title,
  dismissible,
  onDismiss,
  className,
  ...props
}: Omit<AlertProps, 'type'>) {
  return (
    <Alert
      type="error"
      title={title}
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
      {...props}
    >
      {children}
    </Alert>
  );
}

// Alert with Actions
export interface AlertWithActionsProps extends AlertProps {
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
}

export function AlertWithActions({
  children,
  actions,
  className,
  ...props
}: AlertWithActionsProps) {
  return (
    <Alert className={className} {...props}>
      <div className="space-y-3">
        <div>{children}</div>
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  action.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
                  action.variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
                  action.variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                  !action.variant && 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Alert>
  );
}

// Alert List
export interface AlertListProps {
  alerts: Array<{
    id: string;
    type: AlertProps['type'];
    title?: string;
    message: string;
    dismissible?: boolean;
    onDismiss?: () => void;
  }>;
  className?: string;
  onDismissAll?: () => void;
  showDismissAll?: boolean;
}

export function AlertList({
  alerts,
  className,
  onDismissAll,
  showDismissAll = false,
}: AlertListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          dismissible={alert.dismissible}
          onDismiss={alert.onDismiss}
        >
          {alert.message}
        </Alert>
      ))}
      
      {showDismissAll && alerts.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={onDismissAll}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
          >
            Dismiss all
          </button>
        </div>
      )}
    </div>
  );
}
