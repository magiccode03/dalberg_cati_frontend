'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import Button from './Button';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: string;
  type?: 'meeting' | 'deadline' | 'event' | 'reminder';
  allDay?: boolean;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (date: Date) => void;
  className?: string;
  view?: 'month' | 'week' | 'day';
  showWeekends?: boolean;
  showTime?: boolean;
  showEventCount?: boolean;
  maxEvents?: number;
  firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightToday?: boolean;
  showNavigation?: boolean;
  showHeader?: boolean;
  compact?: boolean;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const eventTypeColors = {
  meeting: 'bg-blue-100 text-blue-800 border-blue-200',
  deadline: 'bg-red-100 text-red-800 border-red-200',
  event: 'bg-green-100 text-green-800 border-green-200',
  reminder: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export default function Calendar({
  events = [],
  selectedDate = new Date(),
  onDateSelect,
  onEventClick,
  onEventCreate,
  className,
  view = 'month',
  showWeekends = true,
  showTime = true,
  showEventCount = true,
  maxEvents = 3,
  firstDayOfWeek = 1,
  minDate,
  maxDate,
  disabledDates = [],
  highlightToday = true,
  showNavigation = true,
  showHeader = true,
  compact = false,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust start date based on first day of week
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = (dayOfWeek - firstDayOfWeek + 7) % 7;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay() + firstDayOfWeek) % 7);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    return days;
  }, [currentYear, currentMonth, firstDayOfWeek]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(disabledDate => 
      disabledDate.toDateString() === date.toDateString()
    );
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    onDateSelect?.(date);
    
    if (onEventCreate) {
      onEventCreate(date);
    }
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  // Get event color class
  const getEventColorClass = (event: CalendarEvent) => {
    if (event.color) {
      return `bg-${event.color}-100 text-${event.color}-800 border-${event.color}-200`;
    }
    return eventTypeColors[event.type || 'event'];
  };

  // Render month view
  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
      {/* Day headers */}
      {dayNames.map((day, index) => {
        const dayIndex = (index + firstDayOfWeek) % 7;
        return (
          <div
            key={day}
            className={cn(
              'p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800',
              !showWeekends && (dayIndex === 0 || dayIndex === 6) && 'hidden'
            )}
          >
            {day}
          </div>
        );
      })}

      {/* Calendar days */}
      {calendarDays.map((date, index) => {
        const dateEvents = getEventsForDate(date);
        const isDisabled = isDateDisabled(date);
        const isTodayDate = isToday(date);
        const isSelectedDate = isSelected(date);
        const isCurrentMonthDate = isCurrentMonth(date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        if (!showWeekends && isWeekend) return null;

        return (
          <div
            key={index}
            className={cn(
              'min-h-[100px] p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors',
              isDisabled && 'opacity-50 cursor-not-allowed',
              isTodayDate && highlightToday && 'bg-blue-50 dark:bg-blue-900/20',
              isSelectedDate && 'bg-blue-100 dark:bg-blue-900/40',
              !isCurrentMonthDate && 'text-gray-400 dark:text-gray-600',
              hoveredDate?.toDateString() === date.toDateString() && 'bg-gray-50 dark:bg-gray-800'
            )}
            onClick={() => handleDateClick(date)}
            onMouseEnter={() => setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                'text-sm font-medium',
                isTodayDate && 'text-blue-600 dark:text-blue-400',
                isSelectedDate && 'text-blue-800 dark:text-blue-200'
              )}>
                {date.getDate()}
              </span>
              {showEventCount && dateEvents.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {dateEvents.length}
                </span>
              )}
            </div>

            {/* Events */}
            <div className="space-y-1">
              {dateEvents.slice(0, maxEvents).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity',
                    getEventColorClass(event)
                  )}
                  onClick={(e) => handleEventClick(event, e)}
                >
                  <div className="truncate">{event.title}</div>
                  {showTime && event.startTime && (
                    <div className="text-xs opacity-75">{event.startTime}</div>
                  )}
                </div>
              ))}
              {dateEvents.length > maxEvents && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{dateEvents.length - maxEvents} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const daysToSubtract = (dayOfWeek - firstDayOfWeek + 7) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="space-y-4">
        {weekDays.map((date, index) => {
          const dateEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          if (!showWeekends && isWeekend) return null;

          return (
            <div
              key={index}
              className={cn(
                'p-4 border border-gray-200 dark:border-gray-700 rounded-lg',
                isTodayDate && highlightToday && 'bg-blue-50 dark:bg-blue-900/20',
                isSelectedDate && 'bg-blue-100 dark:bg-blue-900/40'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {dayNamesFull[date.getDay()]}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {date.getDate()} {monthNames[date.getMonth()]}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDateClick(date)}
                >
                  Add Event
                </Button>
              </div>

              <div className="space-y-2">
                {dateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'p-2 rounded border cursor-pointer hover:opacity-80 transition-opacity',
                      getEventColorClass(event)
                    )}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="font-medium">{event.title}</div>
                    {showTime && event.startTime && (
                      <div className="text-sm opacity-75">{event.startTime}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dateEvents = getEventsForDate(currentDate);
    const isTodayDate = isToday(currentDate);

    return (
      <div className="space-y-4">
        <div className={cn(
          'p-4 border border-gray-200 dark:border-gray-700 rounded-lg',
          isTodayDate && highlightToday && 'bg-blue-50 dark:bg-blue-900/20'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {dayNamesFull[currentDate.getDay()]}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {currentDate.getDate()} {monthNames[currentDate.getMonth()]} {currentYear}
              </p>
            </div>
            <Button
              onClick={() => handleDateClick(currentDate)}
            >
              Add Event
            </Button>
          </div>

          <div className="space-y-2">
            {dateEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'p-3 rounded border cursor-pointer hover:opacity-80 transition-opacity',
                  getEventColorClass(event)
                )}
                onClick={(e) => handleEventClick(event, e)}
              >
                <div className="font-medium">{event.title}</div>
                {showTime && event.startTime && (
                  <div className="text-sm opacity-75">{event.startTime}</div>
                )}
                {event.description && (
                  <div className="text-sm opacity-75 mt-1">{event.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      {showHeader && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={goToToday}
              >
                Today
              </Button>
              {showNavigation && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={goToPreviousMonth}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={goToNextMonth}
                    icon={<ChevronRight className="h-4 w-4" />}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Content */}
      <div className="p-4">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
}

// Calendar with Event Management
export interface CalendarWithEventsProps extends CalendarProps {
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

export function CalendarWithEvents({
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  ...props
}: CalendarWithEventsProps) {
  return (
    <Calendar
      {...props}
      onEventClick={(event) => {
        // Handle event click for editing
        console.log('Event clicked:', event);
      }}
      onEventCreate={(date) => {
        // Handle event creation
        console.log('Create event for date:', date);
      }}
    />
  );
}
