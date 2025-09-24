'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
  variant?: 'default' | 'bordered' | 'flush';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  animated?: boolean;
  chevronPosition?: 'left' | 'right';
  showChevron?: boolean;
}

const variantClasses = {
  default: {
    container: 'space-y-2',
    item: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
    header: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  },
  bordered: {
    container: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    item: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
    header: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  },
  flush: {
    container: 'space-y-0',
    item: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
    header: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  },
};

const sizeClasses = {
  sm: {
    header: 'px-3 py-2 text-sm',
    content: 'px-3 py-2 text-sm',
    icon: 'h-4 w-4',
    chevron: 'h-4 w-4',
  },
  md: {
    header: 'px-4 py-3 text-sm',
    content: 'px-4 py-3 text-sm',
    icon: 'h-5 w-5',
    chevron: 'h-5 w-5',
  },
  lg: {
    header: 'px-6 py-4 text-base',
    content: 'px-6 py-4 text-base',
    icon: 'h-6 w-6',
    chevron: 'h-6 w-6',
  },
};

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpenItems = [],
  onItemToggle,
  variant = 'default',
  size = 'md',
  className,
  itemClassName,
  headerClassName,
  contentClassName,
  animated = true,
  chevronPosition = 'right',
  showChevron = true,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems)
  );

  const variantConfig = variantClasses[variant];
  const sizeConfig = sizeClasses[size];

  // Handle item toggle
  const handleItemToggle = (itemId: string) => {
    const isCurrentlyOpen = openItems.has(itemId);
    let newOpenItems: Set<string>;

    if (allowMultiple) {
      newOpenItems = new Set(openItems);
      if (isCurrentlyOpen) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
    } else {
      newOpenItems = isCurrentlyOpen ? new Set() : new Set([itemId]);
    }

    setOpenItems(newOpenItems);
    onItemToggle?.(itemId, !isCurrentlyOpen);
  };

  const containerClasses = cn(
    variantConfig.container,
    className
  );

  const itemClasses = cn(
    variantConfig.item,
    itemClassName
  );

  const headerClasses = cn(
    'flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white transition-colors',
    sizeConfig.header,
    variantConfig.header,
    headerClassName
  );

  const contentClasses = cn(
    'text-gray-600 dark:text-gray-300',
    sizeConfig.content,
    contentClassName
  );

  return (
    <div className={containerClasses}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const isDisabled = item.disabled;

        return (
          <AccordionItemComponent
            key={item.id}
            item={item}
            isOpen={isOpen}
            isDisabled={isDisabled}
            onToggle={handleItemToggle}
            variant={variant}
            size={size}
            itemClassName={itemClasses}
            headerClassName={headerClasses}
            contentClassName={contentClasses}
            animated={animated}
            chevronPosition={chevronPosition}
            showChevron={showChevron}
          />
        );
      })}
    </div>
  );
}

// Individual Accordion Item Component
interface AccordionItemComponentProps {
  item: AccordionItem;
  isOpen: boolean;
  isDisabled: boolean;
  onToggle: (itemId: string) => void;
  variant: 'default' | 'bordered' | 'flush';
  size: 'sm' | 'md' | 'lg';
  itemClassName: string;
  headerClassName: string;
  contentClassName: string;
  animated: boolean;
  chevronPosition: 'left' | 'right';
  showChevron: boolean;
}

function AccordionItemComponent({
  item,
  isOpen,
  isDisabled,
  onToggle,
  variant,
  size,
  itemClassName,
  headerClassName,
  contentClassName,
  animated,
  chevronPosition,
  showChevron,
}: AccordionItemComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    isOpen ? undefined : 0
  );

  const sizeConfig = sizeClasses[size];

  // Update content height when open state changes
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setContentHeight(contentRef.current.scrollHeight);
      } else {
        setContentHeight(0);
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!isDisabled) {
      onToggle(item.id);
    }
  };

  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className={itemClassName}>
      {/* Header */}
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        className={cn(
          headerClassName,
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center flex-1">
          {/* Left Chevron */}
          {showChevron && chevronPosition === 'left' && (
            <ChevronIcon className={cn(
              'text-gray-400 transition-transform duration-200',
              sizeConfig.chevron,
              isOpen && 'transform rotate-90'
            )} />
          )}

          {/* Icon */}
          {item.icon && (
            <span className={cn('mr-3 flex-shrink-0', sizeConfig.icon)}>
              {item.icon}
            </span>
          )}

          {/* Title */}
          <span className="flex-1 text-left">
            {item.title}
          </span>

          {/* Badge */}
          {item.badge && (
            <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full">
              {item.badge}
            </span>
          )}

          {/* Right Chevron */}
          {showChevron && chevronPosition === 'right' && (
            <ChevronIcon className={cn(
              'ml-3 text-gray-400 transition-transform duration-200',
              sizeConfig.chevron,
              isOpen && 'transform rotate-180'
            )} />
          )}
        </div>
      </button>

      {/* Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          animated && 'transition-all duration-200 ease-in-out'
        )}
        style={{
          height: animated ? contentHeight : isOpen ? 'auto' : 0,
        }}
      >
        <div ref={contentRef} className={contentClassName}>
          {item.content}
        </div>
      </div>
    </div>
  );
}

// Simple Accordion for single item
export interface SimpleAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  variant?: 'default' | 'bordered' | 'flush';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

export function SimpleAccordion({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  icon,
  badge,
  variant = 'default',
  size = 'md',
  className,
  onToggle,
}: SimpleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      onToggle?.(newIsOpen);
    }
  };

  return (
    <Accordion
      items={[{
        id: 'single',
        title,
        content: children,
        disabled,
        icon,
        badge,
      }]}
      defaultOpenItems={defaultOpen ? ['single'] : []}
      variant={variant}
      size={size}
      className={className}
      onItemToggle={(itemId, isOpen) => {
        if (itemId === 'single') {
          onToggle?.(isOpen);
        }
      }}
    />
  );
}

// Accordion with custom trigger
export interface AccordionWithTriggerProps {
  items: AccordionItem[];
  trigger: (item: AccordionItem, isOpen: boolean, onToggle: () => void) => React.ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
  variant?: 'default' | 'bordered' | 'flush';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export function AccordionWithTrigger({
  items,
  trigger,
  allowMultiple = false,
  defaultOpenItems = [],
  onItemToggle,
  variant = 'default',
  size = 'md',
  className,
  animated = true,
}: AccordionWithTriggerProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems)
  );

  const handleItemToggle = (itemId: string) => {
    const isCurrentlyOpen = openItems.has(itemId);
    let newOpenItems: Set<string>;

    if (allowMultiple) {
      newOpenItems = new Set(openItems);
      if (isCurrentlyOpen) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
    } else {
      newOpenItems = isCurrentlyOpen ? new Set() : new Set([itemId]);
    }

    setOpenItems(newOpenItems);
    onItemToggle?.(itemId, !isCurrentlyOpen);
  };

  const variantConfig = variantClasses[variant];
  const sizeConfig = sizeClasses[size];

  return (
    <div className={cn(variantConfig.container, className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const isDisabled = item.disabled;

        return (
          <div key={item.id} className={variantConfig.item}>
            {trigger(item, isOpen, () => handleItemToggle(item.id))}
            
            <div
              className={cn(
                'overflow-hidden transition-all duration-200 ease-in-out',
                animated && 'transition-all duration-200 ease-in-out'
              )}
              style={{
                height: animated ? (isOpen ? 'auto' : 0) : (isOpen ? 'auto' : 0),
              }}
            >
              <div className={cn('text-gray-600 dark:text-gray-300', sizeConfig.content)}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
