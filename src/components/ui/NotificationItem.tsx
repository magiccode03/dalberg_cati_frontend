'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Clock, User, Bell } from 'lucide-react';
import Button from './Button';

export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'system';
  timestamp: string;
  read?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  source?: string;
  avatar?: string;
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
  className?: string;
  showTimestamp?: boolean;
  showSource?: boolean;
  showPriority?: boolean;
  compact?: boolean;
}

const typeConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  system: {
    icon: Bell,
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
};

const priorityConfig = {
  low: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  },
  medium: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  high: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  urgent: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
};

export default function NotificationItem({
  id,
  title,
  message,
  type = 'info',
  timestamp,
  read = false,
  priority = 'medium',
  source,
  avatar,
  icon,
  actions,
  onMarkAsRead,
  onDelete,
  onAction,
  className,
  showTimestamp = true,
  showSource = true,
  showPriority = true,
  compact = false,
}: NotificationItemProps) {
  const config = typeConfig[type];
  const priorityStyle = priorityConfig[priority];
  const IconComponent = config.icon;

  const handleMarkAsRead = () => {
    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleAction = (actionLabel: string) => {
    if (onAction) {
      onAction(id, actionLabel);
    }
  };

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
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md',
        read
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        priority === 'urgent' && 'ring-2 ring-red-500 ring-opacity-50',
        className
      )}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar/Icon */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center',
              config.bg,
              config.iconColor
            )}>
              {icon || <IconComponent className="h-4 w-4" />}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className={cn(
                  'text-sm font-medium truncate',
                  read ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'
                )}>
                  {title}
                </h4>
                {!read && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                )}
              </div>
              
              <p className={cn(
                'text-sm mt-1',
                read ? 'text-gray-600 dark:text-gray-400' : 'text-blue-800 dark:text-blue-200'
              )}>
                {message}
              </p>

              {/* Metadata */}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                {showTimestamp && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(timestamp)}</span>
                  </div>
                )}
                {showSource && source && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{source}</span>
                  </div>
                )}
                {showPriority && priority !== 'medium' && (
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    priorityStyle.bg,
                    priorityStyle.text
                  )}>
                    {priority.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {actions && actions.length > 0 && (
                <div className="flex space-x-1">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant || 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                        handleAction(action.label);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Notification Item
export function CompactNotificationItem({
  id,
  title,
  message,
  type = 'info',
  timestamp,
  read = false,
  onMarkAsRead,
  onDelete,
  className,
}: Pick<NotificationItemProps, 'id' | 'title' | 'message' | 'type' | 'timestamp' | 'read' | 'onMarkAsRead' | 'onDelete' | 'className'>) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleMarkAsRead = () => {
    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm',
        read
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        className
      )}
      onClick={handleMarkAsRead}
    >
      <div className={cn(
        'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0',
        config.bg,
        config.iconColor
      )}>
        <IconComponent className="h-3 w-3" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className={cn(
            'text-sm font-medium truncate',
            read ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'
          )}>
            {title}
          </h4>
          {!read && (
            <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
          )}
        </div>
        <p className={cn(
          'text-xs truncate',
          read ? 'text-gray-600 dark:text-gray-400' : 'text-blue-800 dark:text-blue-200'
        )}>
          {message}
        </p>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
