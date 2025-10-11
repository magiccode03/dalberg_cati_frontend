'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  subtitle?: string;
  trend?: {
    data: number[];
    period: string;
  };
  format?: 'number' | 'currency' | 'percentage' | 'text';
  precision?: number;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    icon: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

const changeClasses = {
  increase: {
    text: 'text-green-600 dark:text-green-400',
    icon: TrendingUp,
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  decrease: {
    text: 'text-red-600 dark:text-red-400',
    icon: TrendingDown,
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  neutral: {
    text: 'text-gray-600 dark:text-gray-400',
    icon: Minus,
    bg: 'bg-gray-50 dark:bg-gray-800',
  },
};

export default function MetricCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
  loading = false,
  className,
  onClick,
  subtitle,
  trend,
  format = 'number',
  precision = 0,
}: MetricCardProps) {
  const colorConfig = colorClasses[color];

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(precision)}%`;
      case 'number':
        return new Intl.NumberFormat('en-IN', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val);
      default:
        return val.toString();
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    const IconComponent = changeClasses[change.type].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  const getChangeColor = () => {
    if (!change) return '';
    return changeClasses[change.type].text;
  };

  const getChangeBg = () => {
    if (!change) return '';
    return changeClasses[change.type].bg;
  };

  if (loading) {
    return (
      <div className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="mt-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-2 rounded-lg',
            colorConfig.bg,
            colorConfig.icon
          )}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
          {change && (
            <div className={cn(
              'ml-2 flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getChangeBg(),
              getChangeColor()
            )}>
              {getChangeIcon()}
              <span className="ml-1">
                {Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>

        {change && change.period && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {change.type === 'increase' ? 'vs' : 'vs'} {change.period}
          </p>
        )}

        {trend && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Trend over {trend.period}</span>
              <div className="flex items-center space-x-1">
                {trend.data.map((point, index) => (
                  <div
                    key={index}
                    className="w-1 bg-gray-300 dark:bg-gray-600 rounded-full"
                    style={{ height: `${Math.max(4, (point / Math.max(...trend.data)) * 16)}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Preset metric cards for common use cases
export function RevenueMetricCard({
  value,
  change,
  loading,
  className,
  onClick,
}: {
  value: number;
  change?: MetricCardProps['change'];
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <MetricCard
      title="Total Revenue"
      value={value}
      change={change}
      format="currency"
      precision={0}
      color="green"
      icon={<TrendingUp className="h-5 w-5" />}
      loading={loading}
      className={className}
      onClick={onClick}
    />
  );
}

export function UsersMetricCard({
  value,
  change,
  loading,
  className,
  onClick,
}: {
  value: number;
  change?: MetricCardProps['change'];
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <MetricCard
      title="Total Users"
      value={value}
      change={change}
      format="number"
      color="blue"
      icon={<TrendingUp className="h-5 w-5" />}
      loading={loading}
      className={className}
      onClick={onClick}
    />
  );
}

export function ConversionMetricCard({
  value,
  change,
  loading,
  className,
  onClick,
}: {
  value: number;
  change?: MetricCardProps['change'];
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <MetricCard
      title="Conversion Rate"
      value={value}
      change={change}
      format="percentage"
      precision={1}
      color="purple"
      icon={<TrendingUp className="h-5 w-5" />}
      loading={loading}
      className={className}
      onClick={onClick}
    />
  );
}

export function ErrorMetricCard({
  value,
  change,
  loading,
  className,
  onClick,
}: {
  value: number;
  change?: MetricCardProps['change'];
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <MetricCard
      title="Error Rate"
      value={value}
      change={change}
      format="percentage"
      precision={2}
      color="red"
      icon={<TrendingDown className="h-5 w-5" />}
      loading={loading}
      className={className}
      onClick={onClick}
    />
  );
}

// Metric Card Grid
export interface MetricCardGridProps {
  metrics: MetricCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetricCardGrid({
  metrics,
  columns = 4,
  className,
}: MetricCardGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
