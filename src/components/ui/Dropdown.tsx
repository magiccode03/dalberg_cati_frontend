'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Search, 
  Filter, 
  MoreHorizontal,
  Settings,
  User,
  LogOut,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  value?: any;
  disabled?: boolean;
  hidden?: boolean;
  divider?: boolean;
  group?: string;
  order?: number;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: React.ReactNode;
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  triggerVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  triggerSize?: 'sm' | 'md' | 'lg';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  arrow?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  closeOnSelect?: boolean;
  closeOnBlur?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: DropdownItem) => void;
  onSearch?: (query: string) => void;
  onFilter?: (query: string) => void;
  onClear?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  triggerClassName?: string;
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
  showSearch?: boolean;
  showFilter?: boolean;
  showClear?: boolean;
  showSelectAll?: boolean;
  showDeselectAll?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'card' | 'tooltip' | 'menu' | 'modal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  hoverDelay?: number;
  focusDelay?: number;
  clickDelay?: number;
  manualDelay?: number;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  multiple?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  searchPlaceholder?: string;
  filterPlaceholder?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  loadingState?: {
    title: string;
    description: string;
  };
  errorState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
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
  menu: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg',
  modal: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl',
};

const sizeClasses = {
  sm: 'text-sm p-1',
  md: 'text-base p-2',
  lg: 'text-lg p-3',
  xl: 'text-xl p-4',
};

const animationClasses = {
  fade: 'transition-opacity duration-200',
  slide: 'transition-transform duration-200',
  scale: 'transition-transform duration-200',
  none: '',
};

export default function Dropdown({
  items,
  trigger,
  triggerText = 'Open',
  triggerIcon,
  triggerVariant = 'outline',
  triggerSize = 'md',
  placement = 'bottom',
  offset = 8,
  arrow = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  closeOnSelect = true,
  closeOnBlur = true,
  open: controlledOpen,
  onOpenChange,
  onSelect,
  onSearch,
  onFilter,
  onClear,
  onSelectAll,
  onDeselectAll,
  className,
  contentClassName,
  itemClassName,
  triggerClassName,
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
  showSearch = false,
  showFilter = false,
  showClear = false,
  showSelectAll = false,
  showDeselectAll = false,
  showHeader = false,
  showFooter = false,
  header,
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
  searchable = false,
  filterable = false,
  selectable = false,
  multiple = false,
  selectedItems = [],
  onSelectionChange,
  searchPlaceholder = 'Search...',
  filterPlaceholder = 'Filter...',
  emptyState,
  loadingState,
  errorState,
  onOpen,
  onClose,
  onToggle,
  onBeforeOpen,
  onBeforeClose,
  onAfterOpen,
  onAfterClose,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedItemsState, setSelectedItemsState] = useState<string[]>(selectedItems);

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
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

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.hidden) return;

    if (item.onClick) {
      item.onClick();
    }

    if (selectable) {
      if (multiple) {
        const newSelectedItems = selectedItemsState.includes(item.id)
          ? selectedItemsState.filter(id => id !== item.id)
          : [...selectedItemsState, item.id];
        setSelectedItemsState(newSelectedItems);
        onSelectionChange?.(newSelectedItems);
      } else {
        const newSelectedItems = [item.id];
        setSelectedItemsState(newSelectedItems);
        onSelectionChange?.(newSelectedItems);
        if (closeOnSelect) {
          handleClose();
        }
      }
    }

    onSelect?.(item);

    if (closeOnSelect && !multiple) {
      handleClose();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilter = (query: string) => {
    setFilterQuery(query);
    onFilter?.(query);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilterQuery('');
    onClear?.();
  };

  const handleSelectAll = () => {
    const allItemIds = items.filter(item => !item.disabled && !item.hidden).map(item => item.id);
    setSelectedItemsState(allItemIds);
    onSelectionChange?.(allItemIds);
    onSelectAll?.();
  };

  const handleDeselectAll = () => {
    setSelectedItemsState([]);
    onSelectionChange?.([]);
    onDeselectAll?.();
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

  const filteredItems = items.filter(item => {
    if (item.hidden) return false;
    
    const matchesSearch = !searchQuery || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !filterQuery || 
      item.group?.toLowerCase().includes(filterQuery.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, DropdownItem[]>);

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
          arrowClasses[placement]
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
          </div>
        )}

        {(showSearch || showFilter) && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
            {showSearch && (
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            )}
            {showFilter && (
              <div className="relative">
                <input
                  ref={filterRef}
                  type="text"
                  placeholder={filterPlaceholder}
                  value={filterQuery}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <div key={group}>
              {group !== 'default' && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group}
                </div>
              )}
              {groupItems.map((item, index) => (
                <div key={item.id}>
                  {item.divider && (
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  )}
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2',
                      selectedItemsState.includes(item.id) && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                      item.className
                    )}
                    style={item.style}
                  >
                    {selectable && (
                      <div className="flex-shrink-0">
                        {selectedItemsState.includes(item.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 border border-gray-300 dark:border-gray-600 rounded" />
                        )}
                      </div>
                    )}
                    {item.icon && (
                      <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.badge && (
                      <div className={cn(
                        'flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full',
                        item.badgeVariant === 'primary' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
                        item.badgeVariant === 'secondary' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                        item.badgeVariant === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
                        item.badgeVariant === 'warning' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
                        item.badgeVariant === 'error' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
                        item.badgeVariant === 'info' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
                        !item.badgeVariant && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      )}>
                        {item.badge}
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ))}
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

  const renderTrigger = () => {
    if (trigger) {
      return (
        <div
          ref={triggerRef}
          className={cn('cursor-pointer', triggerClassName)}
          onClick={handleToggle}
        >
          {trigger}
        </div>
      );
    }

    return (
      <Button
        ref={triggerRef}
        variant={triggerVariant}
        size={triggerSize}
        onClick={handleToggle}
        disabled={disabled}
        loading={loading}
        className={cn('flex items-center space-x-2', triggerClassName)}
      >
        {triggerIcon}
        <span>{triggerText}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    );
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {renderTrigger()}
      {renderContent()}
    </div>
  );
}
