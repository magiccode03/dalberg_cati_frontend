'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

const sizeClasses = {
  sm: {
    button: 'h-8 w-8 text-sm',
    info: 'text-sm',
  },
  md: {
    button: 'h-10 w-10 text-base',
    info: 'text-base',
  },
  lg: {
    button: 'h-12 w-12 text-lg',
    info: 'text-lg',
  },
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  size = 'md',
  disabled = false,
  showInfo = false,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const sizeConfig = sizeClasses[size];

  // Calculate visible page range
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  const getPageInfo = () => {
    if (!showInfo || !totalItems || !itemsPerPage) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className={cn('text-gray-600 dark:text-gray-400', sizeConfig.info)}>
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
    );
  };

  if (totalPages <= 1) {
    return showInfo ? (
      <div className={cn('flex items-center justify-between', className)}>
        {getPageInfo()}
        <div />
      </div>
    ) : null;
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* Page Info */}
      {showInfo && getPageInfo()}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        {showFirstLast && currentPage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={disabled}
            className={sizeConfig.button}
          >
            1
          </Button>
        )}

        {/* Start Ellipsis */}
        {showStartEllipsis && (
          <div className="flex items-center justify-center px-2">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        )}

        {/* Previous Button */}
        {showPrevNext && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className={sizeConfig.button}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            className={cn(
              sizeConfig.button,
              page === currentPage && 'bg-blue-600 text-white border-blue-600'
            )}
          >
            {page}
          </Button>
        ))}

        {/* Next Button */}
        {showPrevNext && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className={sizeConfig.button}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* End Ellipsis */}
        {showEndEllipsis && (
          <div className="flex items-center justify-center px-2">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled}
            className={sizeConfig.button}
          >
            {totalPages}
          </Button>
        )}
      </div>
    </div>
  );
}

// Compact pagination for mobile
export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

// Simple pagination with just page numbers
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          disabled={disabled}
          className="h-8 w-8"
        >
          {page}
        </Button>
      ))}
    </div>
  );
}
