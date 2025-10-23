'use client';

import React, { useState, useEffect } from 'react';
import CommonFilter, { FilterConfig, FilterField, DefaultFilters } from './CommonFilter';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Search, Download, RefreshCw } from 'lucide-react';

// Example of converting telecaller-progress page to use CommonFilter
const CommonFilterTelecallerProgressExample: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // Filter configuration for telecaller progress page
  const filterConfig: FilterConfig = {
    fields: [
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
        key: 'callingDateFrom',
        label: 'Calling Date From',
        type: 'date',
        required: false
      },
      {
        key: 'callingDateTo',
        label: 'Calling Date To',
        type: 'date',
        required: false
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
          { value: 'continue', label: 'Continue' },
          { value: 'refuse_to_respond', label: 'Refuse to Respond' },
          { value: 'call_back_later', label: 'Call Back Later' },
          { value: 'successful', label: 'Successful' },
          { value: 'terminated', label: 'Terminated' },
          { value: 'incompleted', label: 'Incompleted' }
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
    // Set default values if needed
  };

  // Handle search
  function handleSearch(searchFilters: Record<string, any>) {
    setLoading(true);
    setFilters(searchFilters);
    
    // Build API parameters
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    // Make API call
    fetchTelecallerProgressData(params.toString())
      .finally(() => setLoading(false));
  }

  // Handle clear
  function handleClear() {
    setFilters({});
    setData([]);
    console.log('Filters cleared');
  }

  // Handle individual filter changes
  function handleFilterChange(key: string, value: any) {
    console.log(`Filter ${key} changed to:`, value);
  }

  // Fetch telecaller progress data
  const fetchTelecallerProgressData = async (queryParams: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const url = `${apiBaseUrl}/telecaller-progress${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
      } else {
        console.error('Failed to fetch telecaller progress data');
      }
    } catch (error) {
      console.error('Error fetching telecaller progress data:', error);
    }
  };

  // Handle download
  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading data with filters:', filters);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (Object.keys(filters).length > 0) {
      handleSearch(filters);
    }
  };

  return (
    <FluidContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            Telecaller Progress
          </Heading>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={loading || data.length === 0}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <CommonFilter
          config={filterConfig}
          defaultValues={defaultFilters}
          loading={loading}
          disabled={false}
        />

        {/* Data Display Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Telecaller Progress Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total <strong>{data.length}</strong> records found.
              </p>
            </div>
          </div>

          {/* Data Table or Chart would go here */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
              </div>
            </div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Telecaller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      AC Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Calls
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.caller_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.ac_code || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.number_of_calls_connected || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.talk_duration || '00:00:00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No data found. Try adjusting your filters.
              </p>
            </div>
          )}
        </Card>

        {/* Debug Section - Remove in production */}
        <Card className="p-4 bg-gray-100 dark:bg-gray-800">
          <h4 className="text-sm font-semibold mb-2">Current Filters (Debug):</h4>
          <pre className="text-xs text-gray-700 dark:text-gray-300">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </Card>
      </div>
    </FluidContainer>
  );
};

export default CommonFilterTelecallerProgressExample;
