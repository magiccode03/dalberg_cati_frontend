'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  avatar?: string;
  avatarAlt?: string;
  clickable?: boolean;
  onClick?: () => void;
  selected?: boolean;
  loading?: boolean;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
  primary: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
  success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800',
  error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800',
  info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
  outline: 'bg-transparent text-gray-800 border-gray-300 dark:text-gray-200 dark:border-gray-600',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function Chip({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  disabled = false,
  className,
  icon,
  iconPosition = 'left',
  avatar,
  avatarAlt,
  clickable = false,
  onClick,
  selected = false,
  loading = false,
}: ChipProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const handleClick = () => {
    if (!disabled && !loading && clickable) {
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        clickable && !disabled && !loading && 'cursor-pointer hover:opacity-80',
        selected && 'ring-2 ring-blue-500 ring-offset-1',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-50 cursor-wait',
        className
      )}
      onClick={handleClick}
    >
      {loading && (
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      
      {!loading && avatar && (
        <img
          src={avatar}
          alt={avatarAlt || ''}
          className="h-4 w-4 rounded-full object-cover"
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      <span className="truncate">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      {!loading && removable && (
        <button
          onClick={handleRemove}
          className="ml-1 flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          disabled={disabled}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// Preset Chip Components
export function ChipPrimary({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="primary" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipSecondary({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="secondary" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipSuccess({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="success" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipWarning({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="warning" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipError({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="error" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipInfo({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="info" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipOutline({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="outline" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipGhost({ children, className, ...props }: Omit<ChipProps, 'variant'>) {
  return (
    <Chip variant="ghost" className={className} {...props}>
      {children}
    </Chip>
  );
}

// Size Variants
export function ChipSm({ children, className, ...props }: Omit<ChipProps, 'size'>) {
  return (
    <Chip size="sm" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipMd({ children, className, ...props }: Omit<ChipProps, 'size'>) {
  return (
    <Chip size="md" className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipLg({ children, className, ...props }: Omit<ChipProps, 'size'>) {
  return (
    <Chip size="lg" className={className} {...props}>
      {children}
    </Chip>
  );
}

// Special Variants
export function ChipRemovable({ children, className, ...props }: Omit<ChipProps, 'removable'>) {
  return (
    <Chip removable={true} className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipClickable({ children, className, ...props }: Omit<ChipProps, 'clickable'>) {
  return (
    <Chip clickable={true} className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipSelected({ children, className, ...props }: Omit<ChipProps, 'selected'>) {
  return (
    <Chip selected={true} className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipLoading({ children, className, ...props }: Omit<ChipProps, 'loading'>) {
  return (
    <Chip loading={true} className={className} {...props}>
      {children}
    </Chip>
  );
}

export function ChipDisabled({ children, className, ...props }: Omit<ChipProps, 'disabled'>) {
  return (
    <Chip disabled={true} className={className} {...props}>
      {children}
    </Chip>
  );
}

// Chip Group Component
export interface ChipGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const directionClasses = {
  row: 'flex-row',
  column: 'flex-col',
};

const gapClasses = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export function ChipGroup({
  children,
  className,
  direction = 'row',
  wrap = true,
  gap = 'md',
  align = 'center',
  justify = 'start',
}: ChipGroupProps) {
  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        wrap && 'flex-wrap',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}
