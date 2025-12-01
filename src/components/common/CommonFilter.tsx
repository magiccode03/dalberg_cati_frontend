'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Search, X, Calendar, User, MapPin, Phone, Filter } from 'lucide-react';

// Filter field types
export type FilterFieldType = 
  | 'text' 
  | 'select' 
  | 'date' 
  | 'dateRange' 
  | 'number' 
  | 'multiselect';

// Filter field configuration
export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  maxHeight?: number;
  min?: number;
  max?: number;
  step?: number;
  // For date range fields
  dateRangeFields?: {
    from: string;
    to: string;
  };
  // For conditional display
  showWhen?: {
    field: string;
    value: string | string[];
  };
  // For API data loading
  apiConfig?: {
    endpoint: string;
    dataPath: string;
    valueField: string;
    labelField: string;
    params?: Record<string, string>;
  };
}

// Filter configuration
export interface FilterConfig {
  fields: FilterField[];
  layout?: 'grid' | 'flex';
  columns?: number;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  searchButtonText?: string;
  clearButtonText?: string;
  searchButtonIcon?: React.ReactNode;
  clearButtonIcon?: React.ReactNode;
  onSearch?: (filters: Record<string, any>) => void;
  onClear?: () => void;
  onFilterChange?: (key: string, value: any) => void;
  className?: string;
  cardClassName?: string;
}

// Default filter values
export interface DefaultFilters {
  [key: string]: any;
}

interface CommonFilterProps {
  config: FilterConfig;
  defaultValues?: DefaultFilters;
  loading?: boolean;
  disabled?: boolean;
}

const CommonFilter: React.FC<CommonFilterProps> = ({
  config,
  defaultValues = {},
  loading = false,
  disabled = false
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(defaultValues);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Array<{ value: string; label: string }>>>({});
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({});

  // Load dynamic options from API
  const loadDynamicOptions = async (field: FilterField) => {
    if (!field.apiConfig) return;

    const { endpoint, dataPath, valueField, labelField, params = {} } = field.apiConfig;
    
    setLoadingOptions(prev => ({ ...prev, [field.key]: true }));

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const queryParams = new URLSearchParams(params);
      const url = `${apiBaseUrl}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = dataPath.split('.').reduce((obj, key) => obj?.[key], result);
        
        if (Array.isArray(data)) {
          const options = data.map((item: any) => ({
            value: item[valueField]?.toString() || '',
            label: item[labelField] || ''
          })).filter(option => option.value && option.label);

          setDynamicOptions(prev => ({ ...prev, [field.key]: options }));
        }
      }
    } catch (error) {
      console.error(`Error loading options for ${field.key}:`, error);
    } finally {
      setLoadingOptions(prev => ({ ...prev, [field.key]: false }));
    }
  };

  // Load dynamic options on mount
  useEffect(() => {
    config.fields.forEach(field => {
      if (field.apiConfig) {
        loadDynamicOptions(field);
      }
    });
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Call external change handler if provided
    if (config.onFilterChange) {
      config.onFilterChange(key, value);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (config.onSearch) {
      config.onSearch(filters);
    }
  };

  // Handle clear
  const handleClear = () => {
    setFilters(defaultValues);
    if (config.onClear) {
      config.onClear();
    }
  };

  // Check if field should be visible
  const isFieldVisible = (field: FilterField): boolean => {
    if (!field.showWhen) return true;
    
    const { field: conditionField, value: conditionValue } = field.showWhen;
    const fieldValue = filters[conditionField];
    
    if (Array.isArray(conditionValue)) {
      return conditionValue.includes(fieldValue);
    }
    
    return fieldValue === conditionValue;
  };

  // Get field options
  const getFieldOptions = (field: FilterField) => {
    if (field.apiConfig) {
      return dynamicOptions[field.key] || [];
    }
    return field.options || [];
  };

  // Render field based on type
  const renderField = (field: FilterField) => {
    if (!isFieldVisible(field)) return null;

    const fieldOptions = getFieldOptions(field);
    const isLoading = loadingOptions[field.key];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="text"
              value={filters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled || field.disabled}
              className="w-full"
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="number"
              value={filters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled || field.disabled}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full"
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.key} className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="date"
              value={filters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              disabled={disabled || field.disabled}
              className="w-full"
            />
          </div>
        );

      case 'dateRange':
        return (
          <div key={field.key} className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <SelectDropdown
              value={filters[field.key] || ''}
              onChange={(value) => handleFilterChange(field.key, Array.isArray(value) ? value[0] : value)}
              options={[
                { value: '', label: 'All' },
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'dby', label: 'Day Before Yesterday' },
                { value: 'l3', label: 'Last 3 Days' },
                { value: 'l7', label: 'Last 7 Days' },
                { value: 'l15', label: 'Last 15 Days' },
                { value: 'currentmonth', label: 'Current Month' },
                { value: 'custom', label: 'Custom Date Range' },
              ]}
              placeholder={field.placeholder || 'Select Date Range'}
              searchable={false}
              clearable={true}
              disabled={disabled || field.disabled}
              className="w-full"
            />
          </div>
        );

      case 'select':
      case 'multiselect':
        return (
          <div key={field.key} className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <SelectDropdown
              value={filters[field.key] || (field.type === 'multiselect' ? [] : '')}
              onChange={(value) => handleFilterChange(field.key, value)}
              options={fieldOptions}
              placeholder={field.placeholder}
              searchable={field.searchable}
              clearable={field.clearable}
              disabled={disabled || field.disabled || isLoading}
              maxHeight={field.maxHeight}
              className="w-full"
            />
            {isLoading && (
              <div className="text-xs text-gray-500 mt-1">Loading options...</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render custom date range fields
  const renderCustomDateFields = () => {
    const dateRangeField = config.fields.find(field => field.type === 'dateRange');
    if (!dateRangeField || filters[dateRangeField.key] !== 'custom') return null;

    const { dateRangeFields } = dateRangeField;
    if (!dateRangeFields) return null;

    return (
      <>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={filters[dateRangeFields.from] || ''}
            onChange={(e) => handleFilterChange(dateRangeFields.from, e.target.value)}
            disabled={disabled}
            className="w-full"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={filters[dateRangeFields.to] || ''}
            onChange={(e) => handleFilterChange(dateRangeFields.to, e.target.value)}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </>
    );
  };

  const layoutClass = config.layout === 'grid' 
    ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${config.columns || 4} gap-4`
    : 'flex flex-wrap items-end gap-4';

  return (
    <Card className={`p-4 ${config.cardClassName || ''}`}>
      <div className={layoutClass}>
        {config.fields.map(renderField)}
        {renderCustomDateFields()}
        
        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {config.showSearchButton !== false && (
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={loading || disabled}
              className="flex items-center"
            >
              {config.searchButtonIcon || <Search className="w-4 h-4 mr-2" />}
              {config.searchButtonText || 'Search'}
            </Button>
          )}
          
          {config.showClearButton !== false && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={loading || disabled}
              className="flex items-center bg-gray-500 text-white hover:bg-gray-600 border-gray-500"
            >
              {config.clearButtonIcon || <X className="w-4 h-4 mr-2" />}
              {config.clearButtonText || 'Clear'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommonFilter;
