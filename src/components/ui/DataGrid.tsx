'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Input from './Input';
import Checkbox from './Checkbox';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export interface DataGridColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  resizable?: boolean;
  ellipsis?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number';
    options?: { label: string; value: any }[];
    placeholder?: string;
  };
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataGridProps {
  data: any[];
  columns: DataGridColumn[];
  loading?: boolean;
  error?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    type: 'single' | 'multiple';
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => void;
  };
  sorting?: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    onChange: (sortField: string, sortOrder: 'asc' | 'desc') => void;
  };
  filtering?: {
    filters: Record<string, any>;
    onChange: (filters: Record<string, any>) => void;
  };
  searching?: {
    searchText: string;
    onChange: (searchText: string) => void;
  };
  actions?: {
    title: string;
    items: {
      key: string;
      label: string;
      icon?: React.ReactNode;
      onClick: (record: any) => void;
      disabled?: (record: any) => boolean;
      hidden?: (record: any) => boolean;
    }[];
  };
  rowKey?: string | ((record: any) => string);
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((record: any, index: number) => string);
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
  virtual?: boolean;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  theme?: 'light' | 'dark' | 'auto';
  onRowClick?: (record: any, index: number) => void;
  onRowDoubleClick?: (record: any, index: number) => void;
  onRowContextMenu?: (record: any, index: number) => void;
  onRowHover?: (record: any, index: number) => void;
  onRowLeave?: (record: any, index: number) => void;
}

const sizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

export default function DataGrid({
  data,
  columns,
  loading = false,
  error,
  emptyState,
  pagination,
  selection,
  sorting,
  filtering,
  searching,
  actions,
  rowKey = 'id',
  className,
  headerClassName,
  bodyClassName,
  rowClassName,
  size = 'medium',
  bordered = true,
  striped = false,
  hoverable = true,
  compact = false,
  responsive = true,
  sticky = false,
  virtual = false,
  height,
  maxHeight,
  minHeight,
  theme = 'auto',
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  onRowHover,
  onRowLeave,
}: DataGridProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>(sorting?.sortField || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(sorting?.sortOrder || 'asc');
  const [searchText, setSearchText] = useState<string>(searching?.searchText || '');
  const [filters, setFilters] = useState<Record<string, any>>(filtering?.filters || {});

  const getRowKey = (record: any, index: number) => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchText) {
      result = result.filter(record =>
        columns.some(column =>
          column.searchable !== false &&
          String(record[column.dataIndex] || '').toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter(record => {
          const recordValue = record[key];
          if (typeof value === 'string') {
            return String(recordValue || '').toLowerCase().includes(value.toLowerCase());
          }
          return recordValue === value;
        });
      }
    });

    return result;
  }, [data, searchText, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    const column = columns.find(col => col.key === sortField);
    if (!column || !column.sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (column.sorter) {
        return column.sorter(aValue, bValue);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortField, sortOrder, columns]);

  const handleSort = (column: DataGridColumn) => {
    if (!column.sortable) return;

    const newSortField = column.key;
    const newSortOrder = sortField === newSortField && sortOrder === 'asc' ? 'desc' : 'asc';

    setSortField(newSortField);
    setSortOrder(newSortOrder);
    sorting?.onChange(newSortField, newSortOrder);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    searching?.onChange(value);
  };

  const handleFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    filtering?.onChange(newFilters);
  };

  const handleRowClick = (record: any, index: number) => {
    onRowClick?.(record, index);
  };

  const handleRowDoubleClick = (record: any, index: number) => {
    onRowDoubleClick?.(record, index);
  };

  const handleRowContextMenu = (record: any, index: number) => {
    onRowContextMenu?.(record, index);
  };

  const handleRowHover = (record: any, index: number) => {
    setHoveredRow(index);
    onRowHover?.(record, index);
  };

  const handleRowLeave = (record: any, index: number) => {
    setHoveredRow(null);
    onRowLeave?.(record, index);
  };

  const renderHeader = () => {
    return (
      <thead className={cn('bg-gray-50 dark:bg-gray-800', headerClassName)}>
        <tr>
          {selection && (
            <th className="px-4 py-3 text-left">
              <Checkbox
                checked={selection.selectedRowKeys.length === sortedData.length}
                onChange={(checked) => {
                  if (checked) {
                    const allKeys = sortedData.map((record, index) => getRowKey(record, index));
                    selection.onChange(allKeys, sortedData);
                  } else {
                    selection.onChange([], []);
                  }
                }}
              />
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(
                'px-4 py-3 text-left font-medium text-gray-900 dark:text-white',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
                column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                column.headerClassName
              )}
              style={{
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              }}
              onClick={() => handleSort(column)}
            >
              <div className="flex items-center space-x-2">
                <span>{column.title}</span>
                {column.sortable && (
                  <div className="flex flex-col">
                    {sortField === column.key ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                )}
              </div>
            </th>
          ))}
          {actions && (
            <th className="px-4 py-3 text-right">Actions</th>
          )}
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8 text-center">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (error) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8 text-center">
              <div className="text-red-600 dark:text-red-400">
                <p className="font-medium">Error loading data</p>
                <p className="text-sm">{error}</p>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (sortedData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <p className="font-medium">{emptyState?.title || 'No data'}</p>
                <p className="text-sm">{emptyState?.description || 'No records found'}</p>
                {emptyState?.action && (
                  <Button
                    variant="outline"
                    onClick={emptyState.action.onClick}
                    className="mt-2"
                  >
                    {emptyState.action.label}
                  </Button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-700', bodyClassName)}>
        {sortedData.map((record, index) => {
          const key = getRowKey(record, index);
          const isSelected = selection?.selectedRowKeys.includes(key) || false;
          const isHovered = hoveredRow === index;

          return (
            <tr
              key={key}
              className={cn(
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                striped && index % 2 === 0 && 'bg-gray-50 dark:bg-gray-800',
                isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                isHovered && hoverable && 'bg-gray-100 dark:bg-gray-700',
                typeof rowClassName === 'function' ? rowClassName(record, index) : rowClassName
              )}
              onClick={() => handleRowClick(record, index)}
              onDoubleClick={() => handleRowDoubleClick(record, index)}
              onContextMenu={() => handleRowContextMenu(record, index)}
              onMouseEnter={() => handleRowHover(record, index)}
              onMouseLeave={() => handleRowLeave(record, index)}
            >
              {selection && (
                <td className="px-4 py-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={(checked) => {
                      if (checked) {
                        const newKeys = [...selection.selectedRowKeys, key];
                        const newRows = [...(selection.selectedRowKeys.map(key => 
                          sortedData.find((record, index) => getRowKey(record, index) === key)
                        )), record];
                        selection.onChange(newKeys, newRows);
                      } else {
                        const newKeys = selection.selectedRowKeys.filter(k => k !== key);
                        const newRows = selection.selectedRowKeys
                          .filter(k => k !== key)
                          .map(key => sortedData.find((record, index) => getRowKey(record, index) === key));
                        selection.onChange(newKeys, newRows);
                      }
                    }}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-3',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.ellipsis && 'truncate',
                    column.cellClassName
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                >
                  {column.render ? column.render(record[column.dataIndex], record, index) : record[column.dataIndex]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {actions.items
                      .filter(item => !item.hidden?.(record))
                      .map((item) => (
                        <Button
                          key={item.key}
                          variant="ghost"
                          size="sm"
                          onClick={() => item.onClick(record)}
                          disabled={item.disabled?.(record)}
                          className="p-1"
                        >
                          {item.icon || <MoreHorizontal className="h-4 w-4" />}
                        </Button>
                      ))}
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderToolbar = () => {
    if (!searching && !filtering) return null;

    return (
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {searching && (
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
          )}
          {filtering && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement filter modal */}}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { current, pageSize, total, showSizeChanger, showQuickJumper, showTotal } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showTotal && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((current - 1) * pageSize) + 1} to {Math.min(current * pageSize, total)} of {total} entries
              </span>
            )}
            {showSizeChanger && (
              <select
                value={pageSize}
                onChange={(e) => pagination.onChange(1, parseInt(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onChange(current - 1, pageSize)}
              disabled={current <= 1}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {current} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onChange(current + 1, pageSize)}
              disabled={current >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {renderToolbar()}
      <div className="overflow-x-auto">
        <table
          className={cn(
            'w-full',
            sizeClasses[size],
            bordered && 'border border-gray-200 dark:border-gray-700',
            compact && 'text-sm'
          )}
          style={{
            height,
            maxHeight,
            minHeight,
          }}
        >
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}
