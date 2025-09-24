'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, AlertCircle, Info, Pause, Play } from 'lucide-react';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'pending' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const statusConfig = {
  // Default statuses
  active: { color: 'green', icon: CheckCircle, label: 'Active' },
  inactive: { color: 'gray', icon: Pause, label: 'Inactive' },
  pending: { color: 'yellow', icon: Clock, label: 'Pending' },
  completed: { color: 'green', icon: CheckCircle, label: 'Completed' },
  failed: { color: 'red', icon: XCircle, label: 'Failed' },
  cancelled: { color: 'gray', icon: XCircle, label: 'Cancelled' },
  in_progress: { color: 'blue', icon: Play, label: 'In Progress' },
  on_hold: { color: 'yellow', icon: Pause, label: 'On Hold' },
  
  // Election specific statuses
  approved: { color: 'green', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'red', icon: XCircle, label: 'Rejected' },
  under_review: { color: 'yellow', icon: Clock, label: 'Under Review' },
  draft: { color: 'gray', icon: Info, label: 'Draft' },
  published: { color: 'green', icon: CheckCircle, label: 'Published' },
  archived: { color: 'gray', icon: Pause, label: 'Archived' },
  
  // Quality control statuses
  qc_pending: { color: 'yellow', icon: Clock, label: 'QC Pending' },
  qc_approved: { color: 'green', icon: CheckCircle, label: 'QC Approved' },
  qc_rejected: { color: 'red', icon: XCircle, label: 'QC Rejected' },
  under_qc: { color: 'blue', icon: AlertCircle, label: 'Under QC' },
  
  // Survey statuses
  survey_completed: { color: 'green', icon: CheckCircle, label: 'Survey Completed' },
  survey_in_progress: { color: 'blue', icon: Play, label: 'Survey In Progress' },
  survey_pending: { color: 'yellow', icon: Clock, label: 'Survey Pending' },
  survey_rejected: { color: 'red', icon: XCircle, label: 'Survey Rejected' },
};

const colorClasses = {
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

const sizeClasses = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'h-3 w-3',
    spacing: 'mr-1',
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'h-4 w-4',
    spacing: 'mr-1.5',
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'h-5 w-5',
    spacing: 'mr-2',
  },
};

export default function StatusBadge({
  status,
  variant,
  size = 'md',
  showIcon = true,
  className,
  children,
}: StatusBadgeProps) {
  // Get status configuration
  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: 'gray',
    icon: Info,
    label: status,
  };

  // Override with variant if provided
  const finalConfig = variant ? {
    color: variant === 'success' ? 'green' : 
           variant === 'error' ? 'red' : 
           variant === 'warning' ? 'yellow' : 
           variant === 'info' ? 'blue' : 
           variant === 'pending' ? 'yellow' : 
           variant === 'active' ? 'green' : 
           variant === 'inactive' ? 'gray' : 'gray',
    icon: variant === 'success' ? CheckCircle : 
          variant === 'error' ? XCircle : 
          variant === 'warning' ? AlertCircle : 
          variant === 'info' ? Info : 
          variant === 'pending' ? Clock : 
          variant === 'active' ? CheckCircle : 
          variant === 'inactive' ? Pause : Info,
    label: children || status,
  } : {
    ...config,
    label: children || config.label,
  };

  const colorClass = colorClasses[finalConfig.color as keyof typeof colorClasses];
  const sizeConfig = sizeClasses[size];
  const IconComponent = finalConfig.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        colorClass.bg,
        colorClass.text,
        colorClass.border,
        sizeConfig.container,
        className
      )}
    >
      {showIcon && (
        <IconComponent className={cn(sizeConfig.icon, sizeConfig.spacing)} />
      )}
      {finalConfig.label}
    </span>
  );
}

// Preset status badges for common use cases
export function SuccessBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="success" {...props}>{children}</StatusBadge>;
}

export function ErrorBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="error" {...props}>{children}</StatusBadge>;
}

export function WarningBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="warning" {...props}>{children}</StatusBadge>;
}

export function InfoBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="info" {...props}>{children}</StatusBadge>;
}

export function PendingBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="pending" {...props}>{children}</StatusBadge>;
}

export function ActiveBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="active" {...props}>{children}</StatusBadge>;
}

export function InactiveBadge({ children, ...props }: Omit<StatusBadgeProps, 'variant'>) {
  return <StatusBadge variant="inactive" {...props}>{children}</StatusBadge>;
}
