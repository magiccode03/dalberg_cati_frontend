'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  footer?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const positionClasses = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
};

const sizeClasses = {
  sm: {
    left: 'w-80',
    right: 'w-80',
    top: 'h-64',
    bottom: 'h-64',
  },
  md: {
    left: 'w-96',
    right: 'w-96',
    top: 'h-80',
    bottom: 'h-80',
  },
  lg: {
    left: 'w-[32rem]',
    right: 'w-[32rem]',
    top: 'h-96',
    bottom: 'h-96',
  },
  xl: {
    left: 'w-[40rem]',
    right: 'w-[40rem]',
    top: 'h-[28rem]',
    bottom: 'h-[28rem]',
  },
  full: {
    left: 'w-full',
    right: 'w-full',
    top: 'h-full',
    bottom: 'h-full',
  },
};

const transformClasses = {
  left: {
    open: 'translate-x-0',
    closed: '-translate-x-full',
  },
  right: {
    open: 'translate-x-0',
    closed: 'translate-x-full',
  },
  top: {
    open: 'translate-y-0',
    closed: '-translate-y-full',
  },
  bottom: {
    open: 'translate-y-0',
    closed: 'translate-y-full',
  },
};

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  showHeader = true,
  showFooter = false,
  footer,
  loading = false,
  disabled = false,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the drawer
    if (drawerRef.current) {
      drawerRef.current.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isVertical = position === 'left' || position === 'right';
  const isHorizontal = position === 'top' || position === 'bottom';

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        isVertical ? 'items-stretch' : 'items-end',
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Drawer Content */}
      <div
        ref={drawerRef}
        className={cn(
          'relative bg-white dark:bg-gray-800 shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          'focus:outline-none',
          positionClasses[position],
          sizeClasses[size][position],
          isOpen ? transformClasses[position].open : transformClasses[position].closed,
          className
        )}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {showHeader && (
          <div
            className={cn(
              'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700',
              headerClassName
            )}
          >
            {title && (
              <h2
                id="drawer-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={disabled || loading}
                className={cn(
                  'p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            'flex-1 overflow-y-auto',
            isVertical ? 'p-6' : 'px-6 py-4',
            bodyClassName
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div
            className={cn(
              'flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
