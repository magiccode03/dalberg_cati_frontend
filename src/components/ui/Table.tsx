'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  responsive?: boolean;
}

export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hover?: boolean;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped, hover, bordered, responsive, children, ...props }, ref) => {
    const tableClasses = cn(
      'w-full text-sm text-left text-gray-500 dark:text-gray-400',
      striped && 'table-striped',
      hover && 'table-hover',
      bordered && 'table-bordered',
      className
    );

    if (responsive) {
      return (
        <div className="overflow-x-auto">
          <table ref={ref} className={tableClasses} {...props}>
            {children}
          </table>
        </div>
      );
    }

    return (
      <table ref={ref} className={tableClasses} {...props}>
        {children}
      </table>
    );
  }
);

const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn('text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400', className)} {...props}>
      {children}
    </thead>
  )
);

const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)} {...props}>
      {children}
    </tbody>
  )
);

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hover, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'bg-white dark:bg-gray-800 border-b dark:border-gray-700',
        hover && 'hover:bg-gray-50 dark:hover:bg-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
);

const TableHead = forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ className, sortable, sorted, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'px-6 py-3 font-medium text-gray-900 dark:text-white',
        sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <svg
              className={`w-3 h-3 ${
                sorted === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
            <svg
              className={`w-3 h-3 -mt-1 ${
                sorted === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
            </svg>
          </div>
        )}
      </div>
    </th>
  )
);

const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white', className)}
      {...props}
    >
      {children}
    </td>
  )
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
