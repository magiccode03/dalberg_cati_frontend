'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted' | 'double';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'thin' | 'medium' | 'thick';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
  showLabel?: boolean;
  style?: React.CSSProperties;
}

const orientationClasses = {
  horizontal: 'w-full border-t',
  vertical: 'h-full border-l',
};

const variantClasses = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  double: 'border-double',
};

const colorClasses = {
  default: 'border-gray-200 dark:border-gray-700',
  primary: 'border-blue-200 dark:border-blue-700',
  secondary: 'border-gray-300 dark:border-gray-600',
  muted: 'border-gray-100 dark:border-gray-800',
  accent: 'border-purple-200 dark:border-purple-700',
  success: 'border-green-200 dark:border-green-700',
  warning: 'border-yellow-200 dark:border-yellow-700',
  error: 'border-red-200 dark:border-red-700',
  info: 'border-blue-200 dark:border-blue-700',
};

const sizeClasses = {
  thin: 'border-0',
  medium: 'border',
  thick: 'border-2',
};

const spacingClasses = {
  none: '',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6',
  xl: 'my-8',
};

const labelPositionClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export default function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  size = 'medium',
  spacing = 'md',
  className,
  children,
  label,
  labelPosition = 'center',
  showLabel = false,
  style,
}: DividerProps) {
  if (showLabel && label) {
    return (
      <div
        className={cn(
          'relative flex items-center',
          orientation === 'horizontal' ? 'w-full' : 'h-full',
          spacingClasses[spacing],
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'flex-1',
            orientationClasses[orientation],
            variantClasses[variant],
            colorClasses[color],
            sizeClasses[size]
          )}
        />
        <span
          className={cn(
            'px-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900',
            labelPositionClasses[labelPosition]
          )}
        >
          {label}
        </span>
        <div
          className={cn(
            'flex-1',
            orientationClasses[orientation],
            variantClasses[variant],
            colorClasses[color],
            sizeClasses[size]
          )}
        />
      </div>
    );
  }

  if (children) {
    return (
      <div
        className={cn(
          'relative flex items-center',
          orientation === 'horizontal' ? 'w-full' : 'h-full',
          spacingClasses[spacing],
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'flex-1',
            orientationClasses[orientation],
            variantClasses[variant],
            colorClasses[color],
            sizeClasses[size]
          )}
        />
        <div className="px-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
          {children}
        </div>
        <div
          className={cn(
            'flex-1',
            orientationClasses[orientation],
            variantClasses[variant],
            colorClasses[color],
            sizeClasses[size]
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        orientationClasses[orientation],
        variantClasses[variant],
        colorClasses[color],
        sizeClasses[size],
        spacingClasses[spacing],
        className
      )}
      style={style}
    />
  );
}

// Preset Divider Components
export function DividerHorizontal({ children, className, ...props }: Omit<DividerProps, 'orientation'>) {
  return (
    <Divider orientation="horizontal" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerVertical({ children, className, ...props }: Omit<DividerProps, 'orientation'>) {
  return (
    <Divider orientation="vertical" className={className} {...props}>
      {children}
    </Divider>
  );
}

// Variant Components
export function DividerSolid({ children, className, ...props }: Omit<DividerProps, 'variant'>) {
  return (
    <Divider variant="solid" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerDashed({ children, className, ...props }: Omit<DividerProps, 'variant'>) {
  return (
    <Divider variant="dashed" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerDotted({ children, className, ...props }: Omit<DividerProps, 'variant'>) {
  return (
    <Divider variant="dotted" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerDouble({ children, className, ...props }: Omit<DividerProps, 'variant'>) {
  return (
    <Divider variant="double" className={className} {...props}>
      {children}
    </Divider>
  );
}

// Color Components
export function DividerPrimary({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="primary" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerSecondary({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="secondary" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerMuted({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="muted" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerAccent({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="accent" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerSuccess({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="success" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerWarning({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="warning" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerError({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="error" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerInfo({ children, className, ...props }: Omit<DividerProps, 'color'>) {
  return (
    <Divider color="info" className={className} {...props}>
      {children}
    </Divider>
  );
}

// Size Components
export function DividerThin({ children, className, ...props }: Omit<DividerProps, 'size'>) {
  return (
    <Divider size="thin" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerMedium({ children, className, ...props }: Omit<DividerProps, 'size'>) {
  return (
    <Divider size="medium" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerThick({ children, className, ...props }: Omit<DividerProps, 'size'>) {
  return (
    <Divider size="thick" className={className} {...props}>
      {children}
    </Divider>
  );
}

// Spacing Components
export function DividerNoSpacing({ children, className, ...props }: Omit<DividerProps, 'spacing'>) {
  return (
    <Divider spacing="none" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerSm({ children, className, ...props }: Omit<DividerProps, 'spacing'>) {
  return (
    <Divider spacing="sm" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerMd({ children, className, ...props }: Omit<DividerProps, 'spacing'>) {
  return (
    <Divider spacing="md" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerLg({ children, className, ...props }: Omit<DividerProps, 'spacing'>) {
  return (
    <Divider spacing="lg" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerXl({ children, className, ...props }: Omit<DividerProps, 'spacing'>) {
  return (
    <Divider spacing="xl" className={className} {...props}>
      {children}
    </Divider>
  );
}

// Label Components
export function DividerWithLabel({ children, className, ...props }: Omit<DividerProps, 'showLabel' | 'label'>) {
  return (
    <Divider showLabel={true} label={children} className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerLabelLeft({ children, className, ...props }: Omit<DividerProps, 'showLabel' | 'label' | 'labelPosition'>) {
  return (
    <Divider showLabel={true} label={children} labelPosition="left" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerLabelCenter({ children, className, ...props }: Omit<DividerProps, 'showLabel' | 'label' | 'labelPosition'>) {
  return (
    <Divider showLabel={true} label={children} labelPosition="center" className={className} {...props}>
      {children}
    </Divider>
  );
}

export function DividerLabelRight({ children, className, ...props }: Omit<DividerProps, 'showLabel' | 'label' | 'labelPosition'>) {
  return (
    <Divider showLabel={true} label={children} labelPosition="right" className={className} {...props}>
      {children}
    </Divider>
  );
}
