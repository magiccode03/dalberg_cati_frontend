'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  trigger?: 'hover' | 'click' | 'focus';
  maxWidth?: string;
  arrow?: boolean;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  className,
  contentClassName,
  trigger = 'hover',
  maxWidth = '200px',
  arrow = true,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (trigger === 'focus' && (e.key === 'Escape')) {
      setIsVisible(false);
    }
  };

  // Position calculation
  const getTooltipPosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return {};

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const positions = {
      top: {
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
        transform: 'translateX(-50%)',
      },
      left: {
        top: rect.top + rect.height / 2 - tooltipRect.height / 2,
        right: window.innerWidth - rect.left + 8,
        transform: 'translateY(-50%)',
      },
      right: {
        top: rect.top + rect.height / 2 - tooltipRect.height / 2,
        left: rect.right + 8,
        transform: 'translateY(-50%)',
      },
    };

    return positions[position];
  };

  // Event handlers based on trigger
  const eventHandlers = {
    hover: {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    },
    click: {
      onClick: handleClick,
    },
    focus: {
      onFocus: showTooltip,
      onBlur: hideTooltip,
      onKeyDown: handleKeyDown,
    },
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trigger === 'click' &&
        isVisible &&
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, trigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-100',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-100',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-100',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-100',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        ref={triggerRef}
        className="inline-block"
        {...eventHandlers[trigger]}
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-md shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            positionClasses[position],
            contentClassName
          )}
          style={{ maxWidth }}
        >
          {content}
          {arrow && (
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowClasses[position]
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
