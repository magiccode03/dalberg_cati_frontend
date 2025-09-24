'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormSuccessProps {
  message?: string | null;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'success' | 'info';
}

export default function FormSuccess({
  message,
  className,
  dismissible = false,
  onDismiss,
  variant = 'success',
}: FormSuccessProps) {
  if (!message) return null;

  const variantStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  };

  const iconStyles = {
    success: 'text-green-500 dark:text-green-400',
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
      <CheckCircle className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[variant])} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {variant === 'success' && 'Success'}
          {variant === 'info' && 'Information'}
        </p>
        <p className="text-sm mt-1">{message}</p>
      </div>

      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
            iconStyles[variant]
          )}
          aria-label="Dismiss message"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
