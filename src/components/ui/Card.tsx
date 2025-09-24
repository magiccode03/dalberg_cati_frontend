'use client';

import { forwardRef } from 'react';
import { CardProps } from '@/types';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, subtitle, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {(title || subtitle || actions) && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
