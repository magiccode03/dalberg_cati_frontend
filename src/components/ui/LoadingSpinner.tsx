'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  className?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  gray: 'text-gray-400',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
  className,
  overlay = false,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{
            borderTopColor: 'currentColor',
          }}
        />
        {text && (
          <p className={cn('text-sm', colorClasses[color])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div
        className={cn(
          'absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50',
          fullScreen && 'fixed inset-0'
        )}
      >
        {spinner}
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Preset loading components for common use cases
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner
      size={size}
      color="white"
      className="mr-2"
    />
  );
}

export function PageSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <LoadingSpinner
      size="lg"
      color="primary"
      text={text}
      fullScreen
    />
  );
}

export function CardSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <LoadingSpinner
      size="md"
      color="primary"
      text={text}
      overlay
    />
  );
}

export function InlineSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner
      size={size}
      color="gray"
    />
  );
}
