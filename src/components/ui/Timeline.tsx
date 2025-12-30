'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, XCircle, Info, User, Calendar, MapPin } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'pending' | 'cancelled';
  icon?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  location?: string;
  metadata?: Record<string, any>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
}

export interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  showTimestamps?: boolean;
  showUsers?: boolean;
  showLocations?: boolean;
  showActions?: boolean;
  className?: string;
  onEventClick?: (event: TimelineEvent) => void;
  onActionClick?: (event: TimelineEvent, action: string) => void;
  compact?: boolean;
  animated?: boolean;
  showConnectors?: boolean;
  maxEvents?: number;
  onLoadMore?: () => void;
  loading?: boolean;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  pending: {
    icon: Clock,
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
  cancelled: {
    icon: XCircle,
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
};

const sizeConfig = {
  sm: {
    container: 'space-y-4',
    event: 'p-3',
    icon: 'h-4 w-4',
    title: 'text-sm',
    description: 'text-xs',
    timestamp: 'text-xs',
  },
  md: {
    container: 'space-y-6',
    event: 'p-4',
    icon: 'h-5 w-5',
    title: 'text-base',
    description: 'text-sm',
    timestamp: 'text-sm',
  },
  lg: {
    container: 'space-y-8',
    event: 'p-6',
    icon: 'h-6 w-6',
    title: 'text-lg',
    description: 'text-base',
    timestamp: 'text-base',
  },
};

export default function Timeline({
  events,
  orientation = 'vertical',
  size = 'md',
  showTimestamps = true,
  showUsers = true,
  showLocations = true,
  showActions = true,
  className,
  onEventClick,
  onActionClick,
  compact = false,
  animated = true,
  showConnectors = true,
  maxEvents,
  onLoadMore,
  loading = false,
}: TimelineProps) {
  const displayEvents = maxEvents ? events.slice(0, maxEvents) : events;
  const hasMore = maxEvents && events.length > maxEvents;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderVerticalTimeline = () => (
    <div className={cn('relative', sizeConfig[size].container, className)}>
      {displayEvents.map((event, index) => {
        const config = typeConfig[event.type || 'info'];
        const IconComponent = config.icon;
        const isLast = index === displayEvents.length - 1;

        return (
          <div key={event.id} className="relative">
            {/* Connector Line */}
            {showConnectors && !isLast && (
              <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
            )}

            {/* Event */}
            <div className="relative flex items-start space-x-4">
              {/* Icon */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm',
                config.bg,
                config.iconColor,
                animated && 'animate-in fade-in-0 slide-in-from-left-4 duration-300'
              )}>
                {event.icon || <IconComponent className={sizeConfig[size].icon} />}
              </div>

              {/* Content */}
              <div 
                className={cn(
                  'flex-1 min-w-0',
                  sizeConfig[size].event,
                  'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm',
                  onEventClick && 'cursor-pointer hover:shadow-md transition-shadow',
                  animated && 'animate-in fade-in-0 slide-in-from-right-4 duration-300'
                )}
                onClick={() => onEventClick?.(event)}
              >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-medium text-gray-900 dark:text-white',
                    sizeConfig[size].title
                  )}>
                    {event.title}
                  </h3>
                  
                  {event.description && (
                    <p className={cn(
                      'mt-1 text-gray-600 dark:text-gray-400',
                      sizeConfig[size].description
                    )}>
                      {event.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400">
                    {showTimestamps && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className={sizeConfig[size].timestamp}>
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    {showUsers && event.user && (
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span className={sizeConfig[size].timestamp}>
                          {event.user.name}
                        </span>
                      </div>
                    )}
                    
                    {showLocations && event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className={sizeConfig[size].timestamp}>
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {showActions && event.actions && event.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                            onActionClick?.(event, action.label);
                          }}
                          className={cn(
                            'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                            action.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
                            action.variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
                            action.variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                            !action.variant && 'bg-blue-600 text-white hover:bg-blue-700'
                          )}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })}

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );

  const renderHorizontalTimeline = () => (
    <div className={cn('relative', className)}>
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        {displayEvents.map((event, index) => {
          const config = typeConfig[event.type || 'info'];
          const IconComponent = config.icon;

          return (
            <div key={event.id} className="flex-shrink-0 w-64">
              <div 
                className={cn(
                  'relative p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm',
                  onEventClick && 'cursor-pointer hover:shadow-md transition-shadow',
                  animated && 'animate-in fade-in-0 slide-in-from-bottom-4 duration-300'
                )}
                onClick={() => onEventClick?.(event)}
              >
              {/* Icon */}
              <div className={cn(
                'absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm',
                config.bg,
                config.iconColor
              )}>
                {event.icon || <IconComponent className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 className={cn(
                  'font-medium text-gray-900 dark:text-white text-center',
                  sizeConfig[size].title
                )}>
                  {event.title}
                </h3>
                
                {event.description && (
                  <p className={cn(
                    'mt-1 text-gray-600 dark:text-gray-400 text-center',
                    sizeConfig[size].description
                  )}>
                    {event.description}
                  </p>
                )}

                {showTimestamps && (
                  <div className="mt-2 text-center text-gray-500 dark:text-gray-400">
                    <span className={sizeConfig[size].timestamp}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );

  return orientation === 'vertical' ? renderVerticalTimeline() : renderHorizontalTimeline();
}

// Compact Timeline
export function CompactTimeline({
  events,
  className,
  onEventClick,
  ...props
}: Omit<TimelineProps, 'size' | 'showUsers' | 'showLocations' | 'showActions'>) {
  return (
    <Timeline
      events={events}
      size="sm"
      showUsers={false}
      showLocations={false}
      showActions={false}
      onEventClick={onEventClick}
      className={className}
      {...props}
    />
  );
}

// Activity Timeline
export function ActivityTimeline({
  events,
  className,
  ...props
}: Omit<TimelineProps, 'showUsers' | 'showLocations'>) {
  return (
    <Timeline
      events={events}
      showUsers={true}
      showLocations={false}
      className={className}
      {...props}
    />
  );
}

// Event Timeline
export function EventTimeline({
  events,
  className,
  ...props
}: Omit<TimelineProps, 'showUsers' | 'showLocations'>) {
  return (
    <Timeline
      events={events}
      showUsers={false}
      showLocations={true}
      className={className}
      {...props}
    />
  );
}
