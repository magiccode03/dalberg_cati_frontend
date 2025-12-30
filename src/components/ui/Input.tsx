'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, icon, rightIcon, ...props }, ref) => {
    const withLeftIcon = Boolean(icon);
    const withRightIcon = Boolean(rightIcon);

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {withLeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-blue-400',
              error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
              withLeftIcon && 'pl-9',
              withRightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />

          {withRightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500">
              {/* Keep rightIcon interactive (e.g., a button) */}
              <div className="flex items-center">{rightIcon}</div>
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
