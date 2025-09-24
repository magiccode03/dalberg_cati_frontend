'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  animated?: boolean;
  striped?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
  backgroundColor?: string;
  progressColor?: string;
  indeterminate?: boolean;
  rounded?: boolean;
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorClasses = {
  primary: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
  info: 'bg-blue-500',
};

const labelSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function ProgressBar({
  progress,
  size = 'md',
  color = 'primary',
  animated = false,
  striped = false,
  showLabel = false,
  label,
  className,
  backgroundColor,
  progressColor,
  indeterminate = false,
  rounded = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const sizeConfig = sizeClasses[size];
  const colorConfig = colorClasses[color];
  const labelSizeConfig = labelSizeClasses[size];

  const progressBarClasses = cn(
    'w-full overflow-hidden',
    sizeConfig,
    backgroundColor || 'bg-gray-200 dark:bg-gray-700',
    rounded ? 'rounded-full' : 'rounded-none',
    className
  );

  const progressClasses = cn(
    'h-full transition-all duration-300 ease-in-out',
    progressColor || colorConfig,
    striped && 'bg-stripes',
    animated && 'animate-pulse',
    indeterminate && 'animate-indeterminate',
    rounded ? 'rounded-full' : 'rounded-none'
  );

  const progressStyle = indeterminate ? {} : {
    width: `${clampedProgress}%`,
  };

  return (
    <div className="w-full">
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={cn(
            'font-medium text-gray-700 dark:text-gray-300',
            labelSizeConfig
          )}>
            {label || 'Progress'}
          </span>
          {!indeterminate && (
            <span className={cn(
              'text-gray-500 dark:text-gray-400',
              labelSizeConfig
            )}>
              {clampedProgress}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={progressBarClasses}>
        <div
          className={progressClasses}
          style={progressStyle}
        />
      </div>
    </div>
  );
}

// Circular Progress Bar
export interface CircularProgressBarProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
  backgroundColor?: string;
  progressColor?: string;
  animated?: boolean;
}

export function CircularProgressBar({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showLabel = false,
  label,
  className,
  backgroundColor = '#e5e7eb',
  progressColor,
  animated = false,
}: CircularProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const colorConfig = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  };

  const finalProgressColor = progressColor || colorConfig[color];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className={cn(
            'transform -rotate-90',
            animated && 'animate-spin'
          )}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalProgressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        
        {/* Center label */}
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {label || `${clampedProgress}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Multi-step Progress Bar
export interface StepProgressBarProps {
  steps: Array<{
    id: string;
    label: string;
    completed?: boolean;
    active?: boolean;
  }>;
  currentStep: number;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StepProgressBar({
  steps,
  currentStep,
  className,
  showLabels = true,
  size = 'md',
}: StepProgressBarProps) {
  const sizeConfig = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-3', text: 'text-sm' },
    lg: { height: 'h-4', text: 'text-base' },
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Line */}
      <div className="relative">
        <div className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full',
          sizeConfig[size].height
        )}>
          <div
            className={cn(
              'bg-blue-600 rounded-full transition-all duration-300',
              sizeConfig[size].height
            )}
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="absolute inset-0 flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                index <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              )}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Labels */}
      {showLabels && (
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'text-center max-w-20',
                sizeConfig[size].text
              )}
            >
              <div className={cn(
                'font-medium',
                step.active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}>
                {step.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
