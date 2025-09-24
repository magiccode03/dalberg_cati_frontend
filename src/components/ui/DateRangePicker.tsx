'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (value: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  label?: string;
  required?: boolean;
  clearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  presets?: Array<{
    label: string;
    value: { startDate: Date; endDate: Date };
  }>;
}

export default function DateRangePicker({
  value = { startDate: null, endDate: null },
  onChange,
  placeholder = 'Select date range...',
  disabled = false,
  error,
  className,
  label,
  required = false,
  clearable = true,
  minDate,
  maxDate,
  format = 'MMM dd, yyyy',
  presets = [
    {
      label: 'Today',
      value: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
    {
      label: 'Yesterday',
      value: {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    {
      label: 'Last 7 days',
      value: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    },
    {
      label: 'Last 30 days',
      value: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    },
    {
      label: 'This month',
      value: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      },
    },
    {
      label: 'Last month',
      value: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ],
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Get display value
  const getDisplayValue = () => {
    if (!value.startDate && !value.endDate) return placeholder;
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    }
    if (value.startDate) {
      return `${formatDate(value.startDate)} - ...`;
    }
    return '';
  };

  // Check if date is in range
  const isDateInRange = (date: Date) => {
    if (!value.startDate || !value.endDate) return false;
    return date >= value.startDate && date <= value.endDate;
  };

  // Check if date is start or end of range
  const isRangeStart = (date: Date) => {
    return value.startDate && date.getTime() === value.startDate.getTime();
  };

  const isRangeEnd = (date: Date) => {
    return value.endDate && date.getTime() === value.endDate.getTime();
  };

  // Check if date is between start and end
  const isInRange = (date: Date) => {
    if (!value.startDate || !value.endDate) return false;
    return date > value.startDate && date < value.endDate;
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!value.startDate || (value.startDate && value.endDate)) {
      // Start new selection
      onChange({ startDate: date, endDate: null });
    } else if (value.startDate && !value.endDate) {
      // Complete selection
      if (date < value.startDate) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
      setIsOpen(false);
    }
  };

  // Handle preset selection
  const handlePresetClick = (preset: typeof presets[0]) => {
    onChange({
      startDate: preset.value.startDate,
      endDate: preset.value.endDate,
    });
    setIsOpen(false);
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: null, endDate: null });
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        ref={pickerRef}
        className="relative"
      >
        <div
          className={cn(
            'relative w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-colors duration-200',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            isOpen && 'ring-2 ring-blue-500 border-blue-500'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className={cn(
                'block truncate',
                !value.startDate && !value.endDate && 'text-gray-500 dark:text-gray-400'
              )}>
                {getDisplayValue()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {clearable && (value.startDate || value.endDate) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            <div className="flex">
              {/* Presets */}
              <div className="w-48 p-3 border-r border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Quick Select
                </h4>
                <div className="space-y-1">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetClick(preset)}
                      className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="p-3">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = isRangeStart(date) || isRangeEnd(date);
                    const isInRangeSelection = isInRange(date);
                    const isDisabled = isDateDisabled(date);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        onMouseEnter={() => setHoveredDate(date)}
                        onMouseLeave={() => setHoveredDate(null)}
                        disabled={isDisabled}
                        className={cn(
                          'h-8 w-8 text-xs rounded-md transition-colors',
                          'hover:bg-gray-100 dark:hover:bg-gray-700',
                          !isCurrentMonth && 'text-gray-400 dark:text-gray-600',
                          isToday && 'font-semibold',
                          isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                          isInRangeSelection && 'bg-blue-100 dark:bg-blue-900/20',
                          isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                          hoveredDate && hoveredDate.getTime() === date.getTime() && !isSelected && 'bg-gray-100 dark:bg-gray-700'
                        )}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
