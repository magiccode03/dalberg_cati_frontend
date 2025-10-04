'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id={id}
            className={cn(
              'h-4 w-4 border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 cursor-pointer',
              error && 'border-red-500 dark:border-red-400',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              {label}
            </label>
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

Radio.displayName = 'Radio';

export default Radio;
