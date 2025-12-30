'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SuccessBannerProps {
  message: string;
  className?: string;
  showIcon?: boolean;
  centered?: boolean;
}

export default function SuccessBanner({
  message,
  className,
  showIcon = true,
  centered = true,
}: SuccessBannerProps) {
  return (
    <div
      className={cn(
        'bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg',
        centered && 'text-center',
        className
      )}
      role="alert"
    >
      <div className={cn(
        'flex items-center',
        centered && 'justify-center'
      )}>
        {showIcon && (
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        )}
        <span className="font-medium text-lg">
          {message}
        </span>
      </div>
    </div>
  );
}
