'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { RefreshCw, RotateCcw, RotateCw } from 'lucide-react';

export interface RefreshButtonProps {
  onRefresh?: () => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: 'refresh' | 'rotate-ccw' | 'rotate-cw';
  children?: React.ReactNode;
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
  showAutoRefreshIndicator?: boolean;
  tooltip?: string;
}

const iconMap = {
  refresh: RefreshCw,
  'rotate-ccw': RotateCcw,
  'rotate-cw': RotateCw,
};

export default function RefreshButton({
  onRefresh,
  loading = false,
  disabled = false,
  className,
  size = 'md',
  variant = 'outline',
  icon = 'refresh',
  children,
  autoRefresh = false,
  autoRefreshInterval = 30000, // 30 seconds
  showAutoRefreshIndicator = false,
  tooltip,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshActive, setAutoRefreshActive] = useState(autoRefresh);

  const IconComponent = iconMap[icon];

  const handleRefresh = async () => {
    if (disabled || loading || isRefreshing) return;

    setIsRefreshing(true);
    
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshActive(!autoRefreshActive);
  };

  const buttonContent = (
    <Button
      onClick={handleRefresh}
      disabled={disabled || loading || isRefreshing}
      loading={loading || isRefreshing}
      size={size}
      variant={variant}
      className={cn(
        'relative',
        autoRefreshActive && showAutoRefreshIndicator && 'ring-2 ring-blue-500 ring-opacity-50',
        className
      )}
    >
      <IconComponent className={cn(
        'h-4 w-4',
        (loading || isRefreshing) && 'animate-spin',
        children && 'mr-2'
      )} />
      {children || 'Refresh'}
    </Button>
  );

  if (tooltip) {
    return (
      <div className="relative group">
        {buttonContent}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {tooltip}
        </div>
      </div>
    );
  }

  return buttonContent;
}

// Auto Refresh Button
export interface AutoRefreshButtonProps extends RefreshButtonProps {
  onAutoRefreshToggle?: (enabled: boolean) => void;
  showToggle?: boolean;
}

export function AutoRefreshButton({
  onRefresh,
  onAutoRefreshToggle,
  showToggle = true,
  autoRefresh = false,
  autoRefreshInterval = 30000,
  className,
  ...props
}: AutoRefreshButtonProps) {
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(autoRefresh);

  const handleAutoRefreshToggle = () => {
    const newState = !isAutoRefreshActive;
    setIsAutoRefreshActive(newState);
    onAutoRefreshToggle?.(newState);
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <RefreshButton
        {...props}
        onRefresh={onRefresh}
        autoRefresh={isAutoRefreshActive}
        autoRefreshInterval={autoRefreshInterval}
        showAutoRefreshIndicator
      />
      {showToggle && (
        <button
          onClick={handleAutoRefreshToggle}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-md transition-colors',
            isAutoRefreshActive
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          )}
        >
          Auto: {isAutoRefreshActive ? 'ON' : 'OFF'}
        </button>
      )}
    </div>
  );
}

// Refresh Button with Timer
export interface RefreshButtonWithTimerProps extends RefreshButtonProps {
  showTimer?: boolean;
  timerFormat?: 'seconds' | 'minutes' | 'auto';
}

export function RefreshButtonWithTimer({
  onRefresh,
  showTimer = true,
  timerFormat = 'auto',
  autoRefresh = false,
  autoRefreshInterval = 30000,
  className,
  ...props
}: RefreshButtonWithTimerProps) {
  const [timeSinceLastRefresh, setTimeSinceLastRefresh] = useState(0);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(autoRefresh);

  React.useEffect(() => {
    if (!showTimer) return;

    const interval = setInterval(() => {
      setTimeSinceLastRefresh(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimer]);

  const handleRefresh = async () => {
    if (props.onRefresh) {
      await props.onRefresh();
    }
    setTimeSinceLastRefresh(0);
  };

  const formatTime = (seconds: number) => {
    if (timerFormat === 'seconds') {
      return `${seconds}s`;
    } else if (timerFormat === 'minutes') {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      // auto format
      if (seconds < 60) {
        return `${seconds}s`;
      } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m`;
      } else {
        return `${Math.floor(seconds / 3600)}h`;
      }
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <RefreshButton
        {...props}
        onRefresh={handleRefresh}
        autoRefresh={isAutoRefreshActive}
        autoRefreshInterval={autoRefreshInterval}
      />
      {showTimer && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(timeSinceLastRefresh)}
        </span>
      )}
    </div>
  );
}

// Preset refresh buttons
export function QuickRefreshButton({
  onRefresh,
  loading,
  disabled,
  className,
  size = 'sm',
  variant = 'ghost',
  ...props
}: Omit<RefreshButtonProps, 'children'>) {
  return (
    <RefreshButton
      onRefresh={onRefresh}
      loading={loading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
      icon="refresh"
      {...props}
    />
  );
}

export function FullRefreshButton({
  onRefresh,
  loading,
  disabled,
  className,
  size = 'md',
  variant = 'outline',
  ...props
}: Omit<RefreshButtonProps, 'children'>) {
  return (
    <RefreshButton
      onRefresh={onRefresh}
      loading={loading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
      icon="rotate-ccw"
      {...props}
    >
      Refresh Data
    </RefreshButton>
  );
}
