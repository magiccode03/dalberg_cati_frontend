'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ErrorBoundary, { withErrorBoundary, ErrorBoundaryWithFallback } from '@/components/ui/ErrorBoundary';
import Toast, { ToastContainer, useToast, SuccessToast, ErrorToast, WarningToast, InfoToast, LoadingToast } from '@/components/ui/Toast';
import NotificationItem, { CompactNotificationItem } from '@/components/ui/NotificationItem';
import NotificationList, { NotificationDropdown } from '@/components/ui/NotificationList';
import Calendar, { CalendarWithEvents } from '@/components/ui/Calendar';
import Timeline, { CompactTimeline, ActivityTimeline, EventTimeline } from '@/components/ui/Timeline';
import Carousel, { ImageCarousel, ContentCarousel, AutoCarousel } from '@/components/ui/Carousel';
import Button from '@/components/ui/Button';
import { AlertTriangle, CheckCircle, Clock, User, MapPin, Bell, Calendar as CalendarIcon, Play, Pause } from 'lucide-react';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'Advanced Components Demo', active: true }
];

// Error Component for testing ErrorBoundary
function ErrorComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('This is a test error for ErrorBoundary');
  }

  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
      <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Error Test Component</h3>
      <p className="text-sm text-red-600 dark:text-red-400 mb-3">
        Click the button below to trigger an error and test the ErrorBoundary component.
      </p>
      <Button onClick={() => setShouldError(true)} variant="outline" size="sm">
        Trigger Error
      </Button>
    </div>
  );
}

export default function AdvancedComponentsDemoPage() {
  const { toast, success, error, warning, info, loading, dismiss, dismissAll } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Survey Submitted',
      message: 'A new survey has been submitted for review',
      type: 'success' as const,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium' as const,
      source: 'System',
      user: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe' },
    },
    {
      id: '2',
      title: 'Data Sync Failed',
      message: 'Failed to sync data with external API',
      type: 'error' as const,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      priority: 'high' as const,
      source: 'API Service',
      user: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Smith' },
    },
    {
      id: '3',
      title: 'Maintenance Scheduled',
      message: 'System maintenance is scheduled for tonight at 2 AM',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: true,
      priority: 'medium' as const,
      source: 'Admin',
    },
    {
      id: '4',
      title: 'New Feature Available',
      message: 'Check out the new dashboard features',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      read: true,
      priority: 'low' as const,
      source: 'Product Team',
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      description: 'Weekly team standup meeting',
      type: 'meeting' as const,
      color: 'blue',
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: new Date(Date.now() + 86400000),
      startTime: '5:00 PM',
      description: 'Submit final project deliverables',
      type: 'deadline' as const,
      color: 'red',
    },
    {
      id: '3',
      title: 'Client Presentation',
      date: new Date(Date.now() + 172800000),
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      description: 'Present project progress to client',
      type: 'event' as const,
      color: 'green',
    },
  ]);

  const [timelineEvents, setTimelineEvents] = useState([
    {
      id: '1',
      title: 'Project Started',
      description: 'Bihar Election Dashboard project initiated',
      timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
      type: 'success' as const,
      user: { name: 'Project Manager', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PM' },
      location: 'Patna Office',
    },
    {
      id: '2',
      title: 'Requirements Gathered',
      description: 'All requirements collected from stakeholders',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      type: 'success' as const,
      user: { name: 'Business Analyst', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BA' },
    },
    {
      id: '3',
      title: 'Design Phase',
      description: 'UI/UX design completed and approved',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      type: 'info' as const,
      user: { name: 'UI Designer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=UI' },
    },
    {
      id: '4',
      title: 'Development Started',
      description: 'Frontend development phase began',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      type: 'pending' as const,
      user: { name: 'Frontend Developer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FD' },
    },
  ]);

  const [carouselItems, setCarouselItems] = useState([
    {
      id: '1',
      title: 'Bihar Election 2025',
      description: 'Comprehensive election analysis dashboard',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    },
    {
      id: '2',
      title: 'Vote Share Analysis',
      description: 'Detailed vote share breakdown by constituency',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    },
    {
      id: '3',
      title: 'Quality Control',
      description: 'QC management and monitoring system',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleDeleteAllNotifications = () => {
    setNotifications([]);
  };

  const handleToastDemo = () => {
    success('Operation completed successfully!');
    setTimeout(() => error('Something went wrong!'), 1000);
    setTimeout(() => warning('Please check your input!'), 2000);
    setTimeout(() => info('New information available!'), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of advanced components including error boundaries, toasts, notifications, calendar, timeline, and carousel
          </p>
        </div>

        {/* Error Boundary Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Error Boundary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Error Boundary</h3>
              <ErrorBoundaryWithFallback>
                <ErrorComponent />
              </ErrorBoundaryWithFallback>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Error Boundary with Custom Fallback</h3>
              <ErrorBoundary
                fallback={
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Custom Error Fallback
                        </h3>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                          This is a custom error fallback component.
                        </p>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">This component works fine!</p>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Toast Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Toast Notifications</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Toast Controls</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => success('Success message!')} variant="outline">
                  Success Toast
                </Button>
                <Button onClick={() => error('Error message!')} variant="outline">
                  Error Toast
                </Button>
                <Button onClick={() => warning('Warning message!')} variant="outline">
                  Warning Toast
                </Button>
                <Button onClick={() => info('Info message!')} variant="outline">
                  Info Toast
                </Button>
                <Button onClick={() => loading('Loading...')} variant="outline">
                  Loading Toast
                </Button>
                <Button onClick={handleToastDemo} variant="outline">
                  Multiple Toasts
                </Button>
                <Button onClick={dismissAll} variant="outline">
                  Dismiss All
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Toast with Actions</h3>
              <Button
                onClick={() => toast({
                  message: 'File uploaded successfully',
                  type: 'success',
                  actionLabel: 'View',
                  onAction: () => alert('View file clicked'),
                  duration: 0,
                })}
                variant="outline"
              >
                Toast with Action
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification List</h3>
              <NotificationList
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
                onDeleteAll={handleDeleteAllNotifications}
                maxHeight="400px"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Individual Notifications</h3>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    {...notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteNotification}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calendar</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month View</h3>
              <Calendar
                events={calendarEvents}
                onDateSelect={(date) => console.log('Date selected:', date)}
                onEventClick={(event) => console.log('Event clicked:', event)}
                onEventCreate={(date) => console.log('Create event for:', date)}
              />
            </div>
          </div>
        </div>

        {/* Timeline Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Timeline</h3>
              <ActivityTimeline
                events={timelineEvents}
                onEventClick={(event) => console.log('Timeline event clicked:', event)}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compact Timeline</h3>
              <CompactTimeline
                events={timelineEvents.slice(0, 3)}
                onEventClick={(event) => console.log('Compact timeline event clicked:', event)}
              />
            </div>
          </div>
        </div>

        {/* Carousel Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Carousel</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Carousel</h3>
              <ImageCarousel
                images={carouselItems.map(item => item.image!)}
                titles={carouselItems.map(item => item.title)}
                descriptions={carouselItems.map(item => item.description)}
                autoplay={true}
                autoplayInterval={4000}
                showIndicators={true}
                showArrows={true}
                showPlayPause={true}
                showProgress={true}
                size="lg"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Carousel</h3>
              <ContentCarousel
                contents={[
                  <div key="1" className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Bihar Election Dashboard</h3>
                    <p className="text-gray-600 dark:text-gray-400">Comprehensive analysis and monitoring system</p>
                  </div>,
                  <div key="2" className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-time Data</h3>
                    <p className="text-gray-600 dark:text-gray-400">Live updates and real-time monitoring</p>
                  </div>,
                  <div key="3" className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400">Powerful insights and data visualization</p>
                  </div>,
                ]}
                titles={['Welcome', 'Real-time Data', 'Advanced Analytics']}
                autoplay={true}
                autoplayInterval={5000}
                showIndicators={true}
                showArrows={true}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
