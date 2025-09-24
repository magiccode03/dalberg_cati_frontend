'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormErrorProps {
  error?: string | null;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export default function FormError({
  error,
  className,
  dismissible = false,
  onDismiss,
  variant = 'error',
}: FormErrorProps) {
  if (!error) return null;

  const variantStyles = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  };

  const iconStyles = {
    error: 'text-red-500 dark:text-red-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    info: 'text-blue-500 dark:text-blue-400',
  };

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 rounded-md border',
        variantStyles[variant],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[variant])} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {variant === 'error' && 'Error'}
          {variant === 'warning' && 'Warning'}
          {variant === 'info' && 'Information'}
        </p>
        <p className="text-sm mt-1">{error}</p>
      </div>

      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
            iconStyles[variant]
          )}
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
