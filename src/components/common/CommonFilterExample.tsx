'use client';

import React, { useState } from 'react';
import CommonFilter, { FilterConfig, FilterField, DefaultFilters } from './CommonFilter';

// Example usage of CommonFilter component
const CommonFilterExample: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Example filter configuration
  const filterConfig: FilterConfig = {
    fields: [
      {
        key: 'search',
        label: 'Search',
        type: 'text',
        placeholder: 'Enter search term...',
        required: false
      },
      {
        key: 'reportDays',
        label: 'Report Days',
        type: 'dateRange',
        placeholder: 'Select Date Range',
        required: false,
        dateRangeFields: {
          from: 'dateFrom',
          to: 'dateTo'
        }
      },
      {
        key: 'qcUserId',
        label: 'QC User',
        type: 'select',
        placeholder: 'Select QC User',
        required: false,
        searchable: true,
        clearable: true,
        apiConfig: {
          endpoint: '/qc-user-registration',
          dataPath: 'data',
          valueField: 'id',
          labelField: 'name',
          params: { status: '1', limit: '1000' }
        }
      },
      {
        key: 'acCode',
        label: 'AC Code',
        type: 'select',
        placeholder: 'Select AC Code',
        required: false,
        searchable: true,
        clearable: true,
        apiConfig: {
          endpoint: '/ac-list',
          dataPath: 'data',
          valueField: 'ac_code',
          labelField: 'ac_name',
          params: { limit: '300' }
        }
      },
      {
        key: 'teleformUserId',
        label: 'Telecaller',
        type: 'select',
        placeholder: 'Select Telecaller',
        required: false,
        searchable: true,
        clearable: true,
        apiConfig: {
          endpoint: '/teleform-users',
          dataPath: 'data',
          valueField: 'teleform_user_id',
          labelField: 'name',
          params: { limit: '1000' }
        }
      },
      {
        key: 'callOutcome',
        label: 'Call Outcome',
        type: 'select',
        placeholder: 'Select Call Outcome',
        required: false,
        clearable: true,
        options: [
          { value: '', label: 'All' },
          { value: 'completed', label: 'Completed' },
          { value: 'busy', label: 'Busy' },
          { value: 'no_answer', label: 'No Answer' },
          { value: 'invalid', label: 'Invalid' },
          { value: 'refused', label: 'Refused' }
        ]
      },
      {
        key: 'talkDuration',
        label: 'Talk Duration (minutes)',
        type: 'number',
        placeholder: 'Enter duration',
        required: false,
        min: 0,
        max: 60,
        step: 1
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        placeholder: 'Select Status',
        required: false,
        clearable: true,
        options: [
          { value: '', label: 'All' },
          { value: '1', label: 'Active' },
          { value: '0', label: 'Inactive' }
        ]
      }
    ],
    layout: 'flex',
    showSearchButton: true,
    showClearButton: true,
    searchButtonText: 'Search',
    clearButtonText: 'Clear',
    onSearch: handleSearch,
    onClear: handleClear,
    onFilterChange: handleFilterChange
  };

  // Default filter values
  const defaultFilters: DefaultFilters = {
    reportDays: 'l7', // Default to last 7 days
    status: '1' // Default to active status
  };

  // Handle search
  function handleSearch(searchFilters: Record<string, any>) {
    setLoading(true);
    setFilters(searchFilters);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Searching with filters:', searchFilters);
      setLoading(false);
    }, 1000);
  }

  // Handle clear
  function handleClear() {
    setFilters({});
    console.log('Filters cleared');
  }

  // Handle individual filter changes
  function handleFilterChange(key: string, value: any) {
    console.log(`Filter ${key} changed to:`, value);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Common Filter Example</h1>
      
      <CommonFilter
        config={filterConfig}
        defaultValues={defaultFilters}
        loading={loading}
        disabled={false}
      />

      {/* Display current filters */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Filters:</h3>
        <pre className="text-sm text-gray-700 dark:text-gray-300">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CommonFilterExample;
