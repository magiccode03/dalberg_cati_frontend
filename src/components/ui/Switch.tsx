'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  label?: string;
  description?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

const sizeClasses = {
  sm: {
    container: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    container: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    container: 'h-7 w-12',
    thumb: 'h-6 w-6',
    translate: 'translate-x-5',
  },
};

const colorClasses = {
  primary: {
    checked: 'bg-blue-600',
    unchecked: 'bg-gray-200 dark:bg-gray-700',
  },
  success: {
    checked: 'bg-green-600',
    unchecked: 'bg-gray-200 dark:bg-gray-700',
  },
  warning: {
    checked: 'bg-yellow-600',
    unchecked: 'bg-gray-200 dark:bg-gray-700',
  },
  error: {
    checked: 'bg-red-600',
    unchecked: 'bg-gray-200 dark:bg-gray-700',
  },
};

export default function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  description,
  className,
  id,
  name,
  required = false,
}: SwitchProps) {
  const sizeConfig = sizeClasses[size];
  const colorConfig = colorClasses[color];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const switchElement = (
    <div className={cn('relative inline-flex items-center', className)}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer',
          sizeConfig.container,
          checked ? colorConfig.checked : colorConfig.unchecked,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
            sizeConfig.thumb,
            checked ? sizeConfig.translate : 'translate-x-0.5'
          )}
        />
      </label>
    </div>
  );

  if (label || description) {
    return (
      <div className="flex items-start space-x-3">
        {switchElement}
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'block text-sm font-medium cursor-pointer',
                disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className={cn(
              'text-sm',
              disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return switchElement;
}

// Toggle Switch with Icon
export interface ToggleSwitchProps extends Omit<SwitchProps, 'label' | 'description'> {
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  onIcon,
  offIcon,
  showLabels = false,
  onLabel = 'On',
  offLabel = 'Off',
  className,
  id,
  name,
  required = false,
}: ToggleSwitchProps) {
  const sizeConfig = sizeClasses[size];
  const colorConfig = colorClasses[color];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {showLabels && (
        <span className={cn(
          'text-sm font-medium',
          !checked && !disabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
        )}>
          {offLabel}
        </span>
      )}
      
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={cn(
            'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer',
            sizeConfig.container,
            checked ? colorConfig.checked : colorConfig.unchecked,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
              sizeConfig.thumb,
              checked ? sizeConfig.translate : 'translate-x-0.5'
            )}
          >
            {checked ? onIcon : offIcon}
          </span>
        </label>
      </div>

      {showLabels && (
        <span className={cn(
          'text-sm font-medium',
          checked && !disabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
        )}>
          {onLabel}
        </span>
      )}
    </div>
  );
}

// Switch Group for multiple switches
export interface SwitchGroupProps {
  switches: Array<{
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }>;
  title?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function SwitchGroup({
  switches,
  title,
  description,
  className,
  size = 'md',
  color = 'primary',
}: SwitchGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        {switches.map((switchItem) => (
          <Switch
            key={switchItem.id}
            id={switchItem.id}
            label={switchItem.label}
            description={switchItem.description}
            checked={switchItem.checked}
            onChange={switchItem.onChange}
            disabled={switchItem.disabled}
            size={size}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}
