'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, AlertCircle, Clock } from 'lucide-react';

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'pending' | 'current' | 'completed' | 'error' | 'warning' | 'disabled';
  disabled?: boolean;
  clickable?: boolean;
  href?: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  content?: React.ReactNode;
  validation?: {
    required?: boolean;
    message?: string;
  };
  metadata?: Record<string, any>;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep?: string;
  onStepClick?: (step: StepperStep) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'card' | 'timeline';
  showConnector?: boolean;
  showStepNumbers?: boolean;
  showStepIcons?: boolean;
  showStepDescriptions?: boolean;
  allowClickOnCompleted?: boolean;
  allowClickOnPending?: boolean;
  className?: string;
  stepClassName?: string;
  connectorClassName?: string;
  contentClassName?: string;
  responsive?: boolean;
  compact?: boolean;
  loading?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
}

const sizeClasses = {
  sm: {
    step: 'text-sm',
    icon: 'h-4 w-4',
    connector: 'h-4',
    content: 'text-sm',
  },
  md: {
    step: 'text-base',
    icon: 'h-5 w-5',
    connector: 'h-6',
    content: 'text-base',
  },
  lg: {
    step: 'text-lg',
    icon: 'h-6 w-6',
    connector: 'h-8',
    content: 'text-lg',
  },
};

const variantClasses = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
  minimal: 'bg-transparent',
  card: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg',
  timeline: 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 dark:border-l-blue-400',
};

const statusClasses = {
  pending: 'text-gray-400 dark:text-gray-500',
  current: 'text-blue-600 dark:text-blue-400',
  completed: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  disabled: 'text-gray-300 dark:text-gray-600',
};

const statusIconClasses = {
  pending: 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500',
  current: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  completed: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  error: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
  disabled: 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600',
};

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  showConnector = true,
  showStepNumbers = true,
  showStepIcons = true,
  showStepDescriptions = true,
  allowClickOnCompleted = true,
  allowClickOnPending = false,
  className,
  stepClassName,
  connectorClassName,
  contentClassName,
  responsive = true,
  compact = false,
  loading = false,
  error,
  warning,
  info,
  success,
}: StepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps.find(step => step.id === currentStep);

  const getStepStatus = (step: StepperStep, index: number) => {
    if (step.status) return step.status;
    if (step.id === currentStep) return 'current';
    if (index < currentStepIndex) return 'completed';
    return 'pending';
  };

  const isStepClickable = (step: StepperStep, index: number) => {
    if (step.disabled || loading) return false;
    if (!onStepClick) return false;
    if (step.clickable === false) return false;
    
    const status = getStepStatus(step, index);
    if (status === 'completed' && !allowClickOnCompleted) return false;
    if (status === 'pending' && !allowClickOnPending) return false;
    
    return true;
  };

  const handleStepClick = (step: StepperStep, index: number) => {
    if (isStepClickable(step, index)) {
      onStepClick?.(step);
    }
  };

  const renderStepIcon = (step: StepperStep, index: number) => {
    const status = getStepStatus(step, index);
    const isClickable = isStepClickable(step, index);
    
    if (showStepIcons && step.icon) {
      return (
        <div className={cn(
          'flex-shrink-0 rounded-full p-2 transition-colors',
          statusIconClasses[status],
          isClickable && 'cursor-pointer hover:opacity-80'
        )}>
          {step.icon}
        </div>
      );
    }

    if (showStepNumbers) {
      return (
        <div className={cn(
          'flex-shrink-0 rounded-full p-2 transition-colors',
          statusIconClasses[status],
          isClickable && 'cursor-pointer hover:opacity-80'
        )}>
          {status === 'completed' ? (
            <Check className={sizeClasses[size].icon} />
          ) : status === 'error' ? (
            <AlertCircle className={sizeClasses[size].icon} />
          ) : status === 'warning' ? (
            <AlertCircle className={sizeClasses[size].icon} />
          ) : (
            <span className={cn('font-medium', sizeClasses[size].step)}>
              {index + 1}
            </span>
          )}
        </div>
      );
    }

    return null;
  };

  const renderStepContent = (step: StepperStep, index: number) => {
    const status = getStepStatus(step, index);
    const isClickable = isStepClickable(step, index);
    
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className={cn(
            'font-medium truncate',
            sizeClasses[size].step,
            statusClasses[status],
            isClickable && 'cursor-pointer hover:opacity-80'
          )}>
            {step.title}
          </h3>
          
          {step.badge && (
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              step.badgeVariant === 'primary' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
              step.badgeVariant === 'secondary' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
              step.badgeVariant === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
              step.badgeVariant === 'warning' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
              step.badgeVariant === 'error' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
              step.badgeVariant === 'info' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
              !step.badgeVariant && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            )}>
              {step.badge}
            </span>
          )}
        </div>
        
        {showStepDescriptions && step.description && (
          <p className={cn(
            'text-gray-500 dark:text-gray-400 mt-1',
            sizeClasses[size].content
          )}>
            {step.description}
          </p>
        )}
      </div>
    );
  };

  const renderConnector = (index: number) => {
    if (!showConnector || index === steps.length - 1) return null;
    
    const currentStatus = getStepStatus(steps[index], index);
    const nextStatus = getStepStatus(steps[index + 1], index + 1);
    
    const isCompleted = currentStatus === 'completed';
    const isCurrent = currentStatus === 'current';
    
    return (
      <div
        className={cn(
          'flex-shrink-0',
          orientation === 'horizontal' ? 'w-full h-px' : 'w-px h-full',
          sizeClasses[size].connector,
          isCompleted || isCurrent
            ? 'bg-blue-500 dark:bg-blue-400'
            : 'bg-gray-200 dark:bg-gray-700',
          connectorClassName
        )}
      />
    );
  };

  const renderHorizontalStepper = () => (
    <div className={cn(
      'flex items-center',
      variantClasses[variant],
      compact ? 'p-4' : 'p-6',
      className
    )}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={cn(
              'flex items-center space-x-3',
              isStepClickable(step, index) && 'cursor-pointer',
              stepClassName
            )}
            onClick={() => handleStepClick(step, index)}
          >
            {renderStepIcon(step, index)}
            {renderStepContent(step, index)}
          </div>
          {renderConnector(index)}
        </React.Fragment>
      ))}
    </div>
  );

  const renderVerticalStepper = () => (
    <div className={cn(
      'space-y-6',
      variantClasses[variant],
      compact ? 'p-4' : 'p-6',
      className
    )}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            {renderStepIcon(step, index)}
            {renderConnector(index)}
          </div>
          <div
            className={cn(
              'flex-1 min-w-0',
              isStepClickable(step, index) && 'cursor-pointer'
            )}
            onClick={() => handleStepClick(step, index)}
          >
            {renderStepContent(step, index)}
            {step.content && (
              <div className={cn(
                'mt-4',
                contentClassName
              )}>
                {step.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {orientation === 'horizontal' ? renderHorizontalStepper() : renderVerticalStepper()}
      
      {(error || warning || info || success) && (
        <div className="mt-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          {warning && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</p>
            </div>
          )}
          {info && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">{info}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
