'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle, X, Filter, Search, MoreVertical } from 'lucide-react';
import NotificationItem, { CompactNotificationItem } from './NotificationItem';
import Button from './Button';
import SearchInput from './SearchInput';
import { NotificationItemProps } from './NotificationItem';

export interface NotificationListProps {
  notifications: NotificationItemProps[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onDeleteAll?: () => void;
  onAction?: (id: string, action: string) => void;
  className?: string;
  title?: string;
  showHeader?: boolean;
  showActions?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  compact?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  groupBy?: 'none' | 'type' | 'priority' | 'date';
  sortBy?: 'newest' | 'oldest' | 'priority' | 'type';
}

const groupByOptions = {
  none: 'All Notifications',
  type: 'By Type',
  priority: 'By Priority',
  date: 'By Date',
};

const sortByOptions = {
  newest: 'Newest First',
  oldest: 'Oldest First',
  priority: 'By Priority',
  type: 'By Type',
};

export default function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onAction,
  className,
  title = 'Notifications',
  showHeader = true,
  showActions = true,
  showSearch = true,
  showFilters = true,
  compact = false,
  maxHeight = '400px',
  emptyMessage = 'No notifications',
  loading = false,
  onLoadMore,
  hasMore = false,
  groupBy = 'none',
  sortBy = 'newest',
}: NotificationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === selectedPriority);
    }

    // Sort notifications
    filtered.sort((a, b) => {
      switch (currentSortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notifications, searchQuery, selectedType, selectedPriority, currentSortBy]);

  // Group notifications
  const groupedNotifications = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All': filteredNotifications };
    }

    const groups: Record<string, NotificationItemProps[]> = {};

    filteredNotifications.forEach(notification => {
      let groupKey = '';

      switch (groupBy) {
        case 'type':
          groupKey = notification.type.charAt(0).toUpperCase() + notification.type.slice(1);
          break;
        case 'priority':
          groupKey = (notification.priority || 'medium').charAt(0).toUpperCase() + (notification.priority || 'medium').slice(1);
          break;
        case 'date':
          const date = new Date(notification.timestamp);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (date.toDateString() === today.toDateString()) {
            groupKey = 'Today';
          } else if (date.toDateString() === yesterday.toDateString()) {
            groupKey = 'Yesterday';
          } else {
            groupKey = date.toLocaleDateString();
          }
          break;
        default:
          groupKey = 'All';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }, [filteredNotifications, groupBy]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleDeleteAll = () => {
    if (onDeleteAll) {
      onDeleteAll();
    }
  };

  const getTypeOptions = () => {
    const types = [...new Set(notifications.map(n => n.type))];
    return [
      { value: 'all', label: 'All Types' },
      ...types.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1)
      }))
    ];
  };

  const getPriorityOptions = () => {
    const priorities = [...new Set(notifications.map(n => n.priority || 'medium'))];
    return [
      { value: 'all', label: 'All Priorities' },
      ...priorities.map(priority => ({
        value: priority,
        label: priority.charAt(0).toUpperCase() + priority.slice(1)
      }))
    ];
  };

  const NotificationComponent = compact ? CompactNotificationItem : NotificationItem;

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      {showHeader && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {hasUnread && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {showActions && (
              <div className="flex items-center space-x-2">
                {hasUnread && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    icon={<CheckCircle className="h-4 w-4" />}
                  >
                    Mark All Read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteAll}
                    icon={<X className="h-4 w-4" />}
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  icon={<Filter className="h-4 w-4" />}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
          {showSearch && (
            <SearchInput
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={setSearchQuery}
              size="sm"
            />
          )}

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {getTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {getPriorityOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={currentSortBy}
                onChange={(e) => setCurrentSortBy(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(sortByOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(groupedNotifications).map(([groupName, groupNotifications]) => (
              <div key={groupName}>
                {groupBy !== 'none' && (
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {groupName}
                    </h4>
                  </div>
                )}
                {groupNotifications.map((notification) => (
                  <NotificationComponent
                    key={notification.id}
                    {...notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                    onAction={onAction}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && onLoadMore && (
          <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={onLoadMore}
              variant="outline"
              size="sm"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Notification Dropdown
export interface NotificationDropdownProps {
  notifications: NotificationItemProps[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
  maxItems?: number;
  className?: string;
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onAction,
  maxItems = 5,
  className,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = notifications.slice(0, maxItems);

  return (
    <div className={cn('w-80', className)}>
      <NotificationList
        notifications={displayNotifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onDelete={onDelete}
        onAction={onAction}
        showHeader={false}
        showActions={false}
        showSearch={false}
        showFilters={false}
        compact={true}
        maxHeight="320px"
        emptyMessage="No new notifications"
      />
    </div>
  );
}
