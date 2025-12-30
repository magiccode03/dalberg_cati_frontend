'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Input } from './Input';
import { SelectDropdown } from './SelectDropdown';
import { DateRangePicker } from './DateRangePicker';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { Search, Filter, X, RefreshCw } from 'lucide-react';

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'checkbox' | 'radio' | 'switch' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  validation?: z.ZodSchema;
  defaultValue?: any;
  className?: string;
  group?: string;
  order?: number;
}

export interface FilterFormProps {
  fields: FilterField[];
  onSubmit: (data: any) => void;
  onReset?: () => void;
  onClear?: () => void;
  loading?: boolean;
  className?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showReset?: boolean;
  showClear?: boolean;
  showApply?: boolean;
  searchPlaceholder?: string;
  filterPlaceholder?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  sticky?: boolean;
  compact?: boolean;
  responsive?: boolean;
}

const layoutClasses = {
  horizontal: 'flex flex-wrap items-end gap-4',
  vertical: 'space-y-4',
  grid: 'grid gap-4',
};

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export default function FilterForm({
  fields,
  onSubmit,
  onReset,
  onClear,
  loading = false,
  className,
  showSearch = true,
  showFilter = true,
  showReset = true,
  showClear = true,
  showApply = true,
  searchPlaceholder = 'Search...',
  filterPlaceholder = 'Filter...',
  layout = 'horizontal',
  columns = 3,
  gap = 'md',
  collapsible = false,
  defaultCollapsed = false,
  title,
  description,
  actions,
  footer,
  sticky = false,
  compact = false,
  responsive = true,
}: FilterFormProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const validationSchema = z.object(
    fields.reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      } else {
        acc[field.name] = field.required ? z.string().min(1, `${field.label} is required`) : z.string().optional();
      }
      return acc;
    }, {} as Record<string, z.ZodSchema>)
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>),
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  const handleFormReset = () => {
    reset();
    onReset?.();
  };

  const handleFormClear = () => {
    reset();
    setSearchQuery('');
    setFilterQuery('');
    onClear?.();
  };

  const filteredFields = fields.filter(field => {
    const matchesSearch = !searchQuery || 
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterQuery || 
      field.group?.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const sortedFields = filteredFields.sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderField = (field: FilterField) => {
    const fieldProps = {
      ...register(field.name),
      placeholder: field.placeholder,
      disabled: field.disabled || loading,
      className: cn(field.className, compact && 'text-sm'),
    };

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Input
            key={field.name}
            {...fieldProps}
            type={field.type}
            label={field.label}
            error={errors[field.name]?.message}
          />
        );

      case 'select':
        return (
          <SelectDropdown
            key={field.name}
            options={field.options || []}
            value={watchedValues[field.name] || ''}
            onChange={(value) => setValue(field.name, value)}
            placeholder={field.placeholder}
            multiple={field.multiple}
            searchable={field.searchable}
            clearable={field.clearable}
            disabled={field.disabled || loading}
            label={field.label}
            error={errors[field.name]?.message}
            className={field.className}
          />
        );

      case 'date':
        return (
          <Input
            key={field.name}
            {...fieldProps}
            type="date"
            label={field.label}
            error={errors[field.name]?.message}
          />
        );

      case 'dateRange':
        return (
          <DateRangePicker
            key={field.name}
            startDate={watchedValues[field.name]?.startDate || ''}
            endDate={watchedValues[field.name]?.endDate || ''}
            onChange={(startDate, endDate) => setValue(field.name, { startDate, endDate })}
            disabled={field.disabled || loading}
            label={field.label}
            error={errors[field.name]?.message}
            className={field.className}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            key={field.name}
            {...fieldProps}
            label={field.label}
            error={errors[field.name]?.message}
          />
        );

      case 'radio':
        return (
          <Radio
            key={field.name}
            {...fieldProps}
            label={field.label}
            error={errors[field.name]?.message}
          />
        );

      case 'switch':
        return (
          <Switch
            key={field.name}
            checked={watchedValues[field.name] || false}
            onChange={(checked) => setValue(field.name, checked)}
            disabled={field.disabled || loading}
            label={field.label}
            error={errors[field.name]?.message}
            className={field.className}
          />
        );

      default:
        return null;
    }
  };

  const gridCols = responsive 
    ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`
    : `grid-cols-${columns}`;

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        sticky && 'sticky top-4 z-10',
        className
      )}
    >
      {(title || description || collapsible) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="ml-4"
              >
                {isCollapsed ? 'Expand' : 'Collapse'}
              </Button>
            )}
          </div>
        </div>
      )}

      {!isCollapsed && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          {showSearch && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="max-w-md"
              />
            </div>
          )}

          {showFilter && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder={filterPlaceholder}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                icon={<Filter className="h-4 w-4" />}
                className="max-w-md"
              />
            </div>
          )}

          <div
            className={cn(
              layoutClasses[layout],
              layout === 'grid' && gridCols,
              gapClasses[gap]
            )}
          >
            {sortedFields.map(renderField)}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {showReset && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormReset}
                  disabled={loading || !isDirty}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              )}
              {showClear && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormClear}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {actions}
              {showApply && (
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  loading={loading}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Apply Filters</span>
                </Button>
              )}
            </div>
          </div>

          {footer && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {footer}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
