'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export interface ToastProps {
  id?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  title?: string;
  persistent?: boolean;
  className?: string;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  loading: {
    icon: Loader2,
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

export default function Toast({
  id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  onClose,
  onAction,
  actionLabel = 'Action',
  title,
  persistent = false,
  className,
  icon,
  showCloseButton = true,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const toastRef = useRef<HTMLDivElement>(null);

  const config = typeConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-hide toast
    if (!persistent && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!persistent && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
  };

  return (
    <div
      ref={toastRef}
      className={cn(
        'fixed z-50 max-w-sm w-full transition-all duration-300 ease-in-out',
        positionClasses[position],
        isVisible && !isExiting
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-95',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          'flex items-start p-4 rounded-lg shadow-lg border',
          config.bg,
          config.border,
          'animate-in slide-in-from-right-full duration-300'
        )}
      >
        {/* Icon */}
        <div className={cn('flex-shrink-0 mr-3', config.iconColor)}>
          {icon || (
            <IconComponent
              className={cn(
                'h-5 w-5',
                type === 'loading' && 'animate-spin'
              )}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-medium mb-1', config.text)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm', config.text)}>
            {message}
          </p>

          {/* Action Button */}
          {onAction && (
            <div className="mt-3">
              <button
                onClick={handleAction}
                className={cn(
                  'text-sm font-medium px-3 py-1 rounded-md transition-colors',
                  'hover:bg-black/10 dark:hover:bg-white/10',
                  config.text
                )}
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 ml-3 p-1 rounded-md transition-colors',
              'hover:bg-black/10 dark:hover:bg-white/10',
              config.text
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
  position?: ToastProps['position'];
  maxToasts?: number;
  className?: string;
}

export function ToastContainer({
  toasts,
  onRemove,
  position = 'top-right',
  maxToasts = 5,
  className,
}: ToastContainerProps) {
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div className={cn('fixed z-50', className)}>
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}

// Toast Hook
export interface UseToastReturn {
  toast: (props: Omit<ToastProps, 'id'>) => string;
  success: (message: string, options?: Omit<ToastProps, 'id' | 'type' | 'message'>) => string;
  error: (message: string, options?: Omit<ToastProps, 'id' | 'type' | 'message'>) => string;
  warning: (message: string, options?: Omit<ToastProps, 'id' | 'type' | 'message'>) => string;
  info: (message: string, options?: Omit<ToastProps, 'id' | 'type' | 'message'>) => string;
  loading: (message: string, options?: Omit<ToastProps, 'id' | 'type' | 'message'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (props: Omit<ToastProps, 'id'>): string => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...props, id };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return {
    toast: addToast,
    success: (message, options) => addToast({ ...options, message, type: 'success' }),
    error: (message, options) => addToast({ ...options, message, type: 'error' }),
    warning: (message, options) => addToast({ ...options, message, type: 'warning' }),
    info: (message, options) => addToast({ ...options, message, type: 'info' }),
    loading: (message, options) => addToast({ ...options, message, type: 'loading' }),
    dismiss: removeToast,
    dismissAll,
  };
}

// Preset Toast Components
export function SuccessToast({
  message,
  title = 'Success',
  ...props
}: Omit<ToastProps, 'type' | 'title'>) {
  return (
    <Toast
      message={message}
      title={title}
      type="success"
      {...props}
    />
  );
}

export function ErrorToast({
  message,
  title = 'Error',
  ...props
}: Omit<ToastProps, 'type' | 'title'>) {
  return (
    <Toast
      message={message}
      title={title}
      type="error"
      {...props}
    />
  );
}

export function WarningToast({
  message,
  title = 'Warning',
  ...props
}: Omit<ToastProps, 'type' | 'title'>) {
  return (
    <Toast
      message={message}
      title={title}
      type="warning"
      {...props}
    />
  );
}

export function InfoToast({
  message,
  title = 'Info',
  ...props
}: Omit<ToastProps, 'type' | 'title'>) {
  return (
    <Toast
      message={message}
      title={title}
      type="info"
      {...props}
    />
  );
}

export function LoadingToast({
  message,
  title = 'Loading',
  persistent = true,
  ...props
}: Omit<ToastProps, 'type' | 'persistent'>) {
  return (
    <Toast
      message={message}
      title={title}
      type="loading"
      persistent={persistent}
      {...props}
    />
  );
}
