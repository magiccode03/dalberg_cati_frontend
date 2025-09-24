'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  arrow?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  closeOnBlur?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  arrowClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  zIndex?: number;
  portal?: boolean;
  portalTarget?: string;
  showCloseButton?: boolean;
  showHeader?: boolean;
  header?: React.ReactNode;
  showFooter?: boolean;
  footer?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'card' | 'tooltip' | 'dropdown' | 'modal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  hoverDelay?: number;
  focusDelay?: number;
  clickDelay?: number;
  manualDelay?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onToggle?: (open: boolean) => void;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

const placementClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  'left-start': 'right-full top-0 mr-2',
  'left-end': 'right-full bottom-0 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  'right-start': 'left-full top-0 ml-2',
  'right-end': 'left-full bottom-0 ml-2',
};

const variantClasses = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg',
  card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl',
  tooltip: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md shadow-lg',
  dropdown: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg',
  modal: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl',
};

const sizeClasses = {
  sm: 'text-sm p-2',
  md: 'text-base p-3',
  lg: 'text-lg p-4',
  xl: 'text-xl p-6',
};

const animationClasses = {
  fade: 'transition-opacity duration-200',
  slide: 'transition-transform duration-200',
  scale: 'transition-transform duration-200',
  none: '',
};

export default function Popover({
  children,
  content,
  trigger = 'click',
  placement = 'bottom',
  offset = 8,
  arrow = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  closeOnBlur = true,
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
  arrowClassName,
  disabled = false,
  loading = false,
  error,
  warning,
  info,
  success,
  compact = false,
  responsive = true,
  sticky = false,
  maxWidth = '300px',
  maxHeight = '400px',
  minWidth = '200px',
  minHeight = '100px',
  zIndex = 50,
  portal = false,
  portalTarget = 'body',
  showCloseButton = false,
  showHeader = false,
  header,
  showFooter = false,
  footer,
  title,
  description,
  icon,
  variant = 'default',
  size = 'md',
  theme = 'auto',
  animation = 'fade',
  duration = 200,
  delay = 0,
  hoverDelay = 200,
  focusDelay = 100,
  clickDelay = 0,
  manualDelay = 0,
  onOpen,
  onClose,
  onToggle,
  onBeforeOpen,
  onBeforeClose,
  onAfterOpen,
  onAfterClose,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : isOpen;

  useEffect(() => {
    if (open) {
      onBeforeOpen?.();
      const timer = setTimeout(() => {
        setIsVisible(true);
        onAfterOpen?.();
      }, delay);
      return () => clearTimeout(timer);
    } else {
      onBeforeClose?.();
      const timer = setTimeout(() => {
        setIsVisible(false);
        onAfterClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, delay, duration, onBeforeOpen, onBeforeClose, onAfterOpen, onAfterClose]);

  useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          top = triggerRect.top - contentRect.height - offset;
          left = placement === 'top' ? triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 :
                 placement === 'top-start' ? triggerRect.left :
                 triggerRect.right - contentRect.width;
          break;
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          top = triggerRect.bottom + offset;
          left = placement === 'bottom' ? triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 :
                 placement === 'bottom-start' ? triggerRect.left :
                 triggerRect.right - contentRect.width;
          break;
        case 'left':
        case 'left-start':
        case 'left-end':
          top = placement === 'left' ? triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 :
                 placement === 'left-start' ? triggerRect.top :
                 triggerRect.bottom - contentRect.height;
          left = triggerRect.left - contentRect.width - offset;
          break;
        case 'right':
        case 'right-start':
        case 'right-end':
          top = placement === 'right' ? triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 :
                 placement === 'right-start' ? triggerRect.top :
                 triggerRect.bottom - contentRect.height;
          left = triggerRect.right + offset;
          break;
      }

      // Adjust for viewport boundaries
      if (left < 0) left = 8;
      if (left + contentRect.width > viewport.width) left = viewport.width - contentRect.width - 8;
      if (top < 0) top = 8;
      if (top + contentRect.height > viewport.height) top = viewport.height - contentRect.height - 8;

      setPosition({ top, left });

      // Calculate arrow position
      if (arrow && arrowRef.current) {
        const arrowRect = arrowRef.current.getBoundingClientRect();
        let arrowTop = 0;
        let arrowLeft = 0;

        switch (placement) {
          case 'top':
          case 'top-start':
          case 'top-end':
            arrowTop = contentRect.height - 1;
            arrowLeft = placement === 'top' ? contentRect.width / 2 - arrowRect.width / 2 :
                       placement === 'top-start' ? triggerRect.left - left + triggerRect.width / 2 :
                       triggerRect.right - left - triggerRect.width / 2;
            break;
          case 'bottom':
          case 'bottom-start':
          case 'bottom-end':
            arrowTop = -arrowRect.height + 1;
            arrowLeft = placement === 'bottom' ? contentRect.width / 2 - arrowRect.width / 2 :
                       placement === 'bottom-start' ? triggerRect.left - left + triggerRect.width / 2 :
                       triggerRect.right - left - triggerRect.width / 2;
            break;
          case 'left':
          case 'left-start':
          case 'left-end':
            arrowTop = placement === 'left' ? contentRect.height / 2 - arrowRect.height / 2 :
                      placement === 'left-start' ? triggerRect.top - top + triggerRect.height / 2 :
                      triggerRect.bottom - top - triggerRect.height / 2;
            arrowLeft = contentRect.width - 1;
            break;
          case 'right':
          case 'right-start':
          case 'right-end':
            arrowTop = placement === 'right' ? contentRect.height / 2 - arrowRect.height / 2 :
                      placement === 'right-start' ? triggerRect.top - top + triggerRect.height / 2 :
                      triggerRect.bottom - top - triggerRect.height / 2;
            arrowLeft = -arrowRect.width + 1;
            break;
        }

        setArrowPosition({ top: arrowTop, left: arrowLeft });
      }
    }
  }, [open, placement, offset, arrow]);

  const handleOpen = () => {
    if (disabled || loading) return;

    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setIsOpen(true);
    }
    onOpen?.();
    onToggle?.(true);
  };

  const handleClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setIsOpen(false);
    }
    onClose?.();
    onToggle?.(false);
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !disabled && !loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleOpen, hoverDelay);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !disabled && !loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleClose, hoverDelay);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus' && !disabled && !loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleOpen, focusDelay);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus' && !disabled && !loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleClose, focusDelay);
    }
  };

  const handleClick = () => {
    if (trigger === 'click' && !disabled && !loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleToggle, clickDelay);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      handleClose();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (closeOnClickOutside && 
        triggerRef.current && 
        !triggerRef.current.contains(e.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeOnClickOutside, closeOnEscape]);

  const renderArrow = () => {
    if (!arrow) return null;

    const arrowClasses = {
      top: 'border-l-transparent border-r-transparent border-b-gray-200 dark:border-b-gray-700',
      'top-start': 'border-l-transparent border-r-transparent border-b-gray-200 dark:border-b-gray-700',
      'top-end': 'border-l-transparent border-r-transparent border-b-gray-200 dark:border-b-gray-700',
      bottom: 'border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700',
      'bottom-start': 'border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700',
      'bottom-end': 'border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700',
      left: 'border-t-transparent border-b-transparent border-r-gray-200 dark:border-r-gray-700',
      'left-start': 'border-t-transparent border-b-transparent border-r-gray-200 dark:border-r-gray-700',
      'left-end': 'border-t-transparent border-b-transparent border-r-gray-200 dark:border-r-gray-700',
      right: 'border-t-transparent border-b-transparent border-l-gray-200 dark:border-l-gray-700',
      'right-start': 'border-t-transparent border-b-transparent border-l-gray-200 dark:border-l-gray-700',
      'right-end': 'border-t-transparent border-b-transparent border-l-gray-200 dark:border-l-gray-700',
    };

    return (
      <div
        ref={arrowRef}
        className={cn(
          'absolute w-0 h-0 border-4',
          arrowClasses[placement],
          arrowClassName
        )}
        style={{
          top: arrowPosition.top,
          left: arrowPosition.left,
        }}
      />
    );
  };

  const renderContent = () => {
    if (!open || !isVisible) return null;

    const contentElement = (
      <div
        ref={contentRef}
        className={cn(
          'absolute z-50',
          placementClasses[placement],
          variantClasses[variant],
          sizeClasses[size],
          animationClasses[animation],
          contentClassName
        )}
        style={{
          top: position.top,
          left: position.left,
          maxWidth,
          maxHeight,
          minWidth,
          minHeight,
          zIndex,
        }}
      >
        {showHeader && (
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
              <div>
                {title && <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>}
                {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
              </div>
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="p-3">
          {content}
        </div>

        {showFooter && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}

        {renderArrow()}
      </div>
    );

    if (portal) {
      const target = document.querySelector(portalTarget);
      if (target) {
        return React.createPortal(contentElement, target);
      }
    }

    return contentElement;
  };

  return (
    <div
      ref={triggerRef}
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {children}
      {renderContent()}
    </div>
  );
}
