'use client';

import React from 'react';

interface DateFormatterProps {
  date: string | Date;
  format?: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  className?: string;
}

/**
 * DateFormatter component for consistent date display across the application
 * Supports multiple date formats with dd/mm/yyyy as default
 */
export default function DateFormatter({ 
  date, 
  format = 'dd/mm/yyyy', 
  className = '' 
}: DateFormatterProps) {
  if (!date) {
    return <span className={className}>-</span>;
  }

  const formatDate = (dateInput: string | Date, formatType: string): string => {
    try {
      const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return '-';
      }

      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();

      switch (formatType) {
        case 'dd/mm/yyyy':
          return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
          return `${month}/${day}/${year}`;
        case 'yyyy-mm-dd':
          return `${year}-${month}-${day}`;
        default:
          return `${day}/${month}/${year}`;
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  return (
    <span className={className}>
      {formatDate(date, format)}
    </span>
  );
}

/**
 * Hook for date formatting
 */
export const useDateFormatter = () => {
  const formatDate = (date: string | Date, format: string = 'dd/mm/yyyy'): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      if (isNaN(dateObj.getTime())) {
        return '-';
      }

      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();

      switch (format) {
        case 'dd/mm/yyyy':
          return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
          return `${month}/${day}/${year}`;
        case 'yyyy-mm-dd':
          return `${year}-${month}-${day}`;
        default:
          return `${day}/${month}/${year}`;
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  return { formatDate };
};

/**
 * Utility function for date formatting
 */
export const formatDate = (date: string | Date, format: string = 'dd/mm/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    switch (format) {
      case 'dd/mm/yyyy':
        return `${day}/${month}/${year}`;
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};
