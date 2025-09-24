'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
  onRemove?: () => void;
  removable?: boolean;
  icon?: React.ReactNode;
  maxWidth?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent',
};

const sizeClasses = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'h-3 w-3',
    remove: 'h-3 w-3',
    spacing: 'mr-1',
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'h-4 w-4',
    remove: 'h-4 w-4',
    spacing: 'mr-1.5',
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'h-5 w-5',
    remove: 'h-5 w-5',
    spacing: 'mr-2',
  },
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className,
  onRemove,
  removable = false,
  icon,
  maxWidth,
}: BadgeProps) {
  const sizeConfig = sizeClasses[size];
  const variantConfig = variantClasses[variant];

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border-0',
        variantConfig,
        sizeConfig.container,
        rounded ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{ maxWidth }}
    >
      {/* Icon */}
      {icon && (
        <span className={cn('flex-shrink-0', sizeConfig.spacing)}>
          {icon}
        </span>
      )}

      {/* Content */}
      <span className="truncate">
        {children}
      </span>

      {/* Remove Button */}
      {(removable || onRemove) && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            'flex-shrink-0 ml-1 inline-flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
            sizeConfig.remove
          )}
          aria-label="Remove"
        >
          <X className={sizeConfig.remove} />
        </button>
      )}
    </span>
  );
}

// Count Badge
export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
  className?: string;
  showZero?: boolean;
}

export function CountBadge({
  count,
  max = 99,
  variant = 'error',
  size = 'sm',
  className,
  showZero = false,
}: CountBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn('min-w-[1.25rem] justify-center', className)}
    >
      {displayCount}
    </Badge>
  );
}

// Dot Badge
export interface DotBadgeProps {
  variant?: BadgeProps['variant'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export function DotBadge({
  variant = 'error',
  size = 'md',
  className,
  pulse = false,
}: DotBadgeProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const variantConfig = variantClasses[variant];

  return (
    <span
      className={cn(
        'inline-block rounded-full',
        sizeClasses[size],
        variantConfig,
        pulse && 'animate-pulse',
        className
      )}
    />
  );
}

// Badge Group
export interface BadgeGroupProps {
  badges: Array<{
    id: string;
    label: string;
    variant?: BadgeProps['variant'];
    onRemove?: () => void;
  }>;
  maxVisible?: number;
  className?: string;
  size?: BadgeProps['size'];
  onRemoveAll?: () => void;
  showRemoveAll?: boolean;
}

export function BadgeGroup({
  badges,
  maxVisible = 5,
  className,
  size = 'md',
  onRemoveAll,
  showRemoveAll = false,
}: BadgeGroupProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleBadges.map((badge) => (
        <Badge
          key={badge.id}
          variant={badge.variant}
          size={size}
          onRemove={badge.onRemove}
          removable={!!badge.onRemove}
        >
          {badge.label}
        </Badge>
      ))}
      
      {hiddenCount > 0 && (
        <Badge variant="outline" size={size}>
          +{hiddenCount} more
        </Badge>
      )}
      
      {showRemoveAll && badges.length > 0 && (
        <button
          onClick={onRemoveAll}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
        >
          Remove all
        </button>
      )}
    </div>
  );
}

// Status Badge (using the existing StatusBadge component)
export { StatusBadge } from './StatusBadge';

// Preset badges
export function PrimaryBadge({ children, ...props }: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="primary" {...props}>{children}</Badge>;
}

export function SuccessBadge({ children, ...props }: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="success" {...props}>{children}</Badge>;
}

export function WarningBadge({ children, ...props }: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="warning" {...props}>{children}</Badge>;
}

export function ErrorBadge({ children, ...props }: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="error" {...props}>{children}</Badge>;
}

export function InfoBadge({ children, ...props }: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="info" {...props}>{children}</Badge>;
}

export function OutlineBadge({ children, ...props }: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="outline" {...props}>{children}</Badge>;
}
