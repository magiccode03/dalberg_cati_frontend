'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Map, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface PendingGPSQCData {
  id: number;
  ac_name: string;
  ac_code?: number;
  enumerator_id: string;
  enumerator_name?: string;
  interviewer_id: string;
  interview_date: string;
  device_id: string;
  total_interview: number;
  gps_qc_status?: string;
}

interface FilterOptions {
  enumeratorIds: Array<{ value: string; label: string }>;
  interviewDates: Array<{ value: string; label: string }>;
}

export default function GPSQCPage() {
  const router = useRouter();
  const params = useParams();
  const qcId = params.qc_id as string;

  const [filters, setFilters] = useState({
    enumeratorId: [] as string[],
    interviewDate: [] as string[],
    deviceId: '',
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    enumeratorIds: [],
    interviewDates: [],
  });

  const [data, setData] = useState<PendingGPSQCData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qcUserData, setQcUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtersLoading, setFiltersLoading] = useState(false);

  // Load QC user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('qc_user_data');
    
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setQcUserData(userData);
        
        // Verify the qc_id matches the URL parameter
        if (userData.qc_id.toString() !== qcId) {
          setError('QC User ID mismatch. Please login again.');
          return;
        }
        
        // Load filter options and fetch data
        loadFilterOptions();
        fetchGPSQCData();
      } catch (err) {
        console.error('Error parsing QC data:', err);
        setError('Invalid QC user data. Please login again.');
      }
    } else {
      setError('No QC user data found. Please login first.');
    }
  }, [qcId]);

  // Load filter options (Enumerator IDs and Interview Dates)
  const loadFilterOptions = async () => {
    try {
      setFiltersLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Fetch enumerator list
      const enumeratorResponse = await fetch(`${apiBaseUrl}/api/capi/enumerators/list?limit=1000`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (enumeratorResponse.ok) {
        const enumeratorData = await enumeratorResponse.json();
        if (enumeratorData.success && enumeratorData.data?.enumerators) {
          // New API format: enumerators is an array of IDs (numbers)
          const enumeratorIds = enumeratorData.data.enumerators;
          
          setFilterOptions(prev => ({
            ...prev,
            enumeratorIds: enumeratorIds.map((id: number) => ({
              value: id.toString(),
              label: `${id}`
            }))
          }));
        }
      }

      // Generate interview date options (last 365 days)
      const dateOptions: Array<{ value: string; label: string }> = [];
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dateOptions.push({ value: dateString, label: dateString });
      }
      
      setFilterOptions(prev => ({
        ...prev,
        interviewDates: dateOptions
      }));
    } catch (err) {
      console.error('Error loading filter options:', err);
    } finally {
      setFiltersLoading(false);
    }
  };

  // Fetch GPS QC data
  const fetchGPSQCData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Use qc_id from URL params (same as new-qc page)
      if (!qcId) {
        setError('QC ID not found');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        qc_id: qcId,
      });

      // Add filters
      if (filters.enumeratorId.length > 0) {
        filters.enumeratorId.forEach(id => {
          params.append('user_id', id);
        });
      }
      
      if (filters.interviewDate.length > 0) {
        filters.interviewDate.forEach(date => {
          params.append('interview_date', date);
        });
      }
      
      if (filters.deviceId.trim()) {
        params.append('device_id', filters.deviceId.trim());
      }

      // Use the correct API endpoint
      const apiUrl = `${apiBaseUrl}/api/qc/qcchecking/gps-qc?${params.toString()}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success && responseData.data?.dataProvider) {
        const items = responseData.data.dataProvider.models || [];
        const pagination = responseData.data.dataProvider.pagination || {};
        
        // Transform API data to match our interface
        const transformedData: PendingGPSQCData[] = items.map((item: any, index: number) => {
          // Format interview_date from ISO string to YYYY-MM-DD
          let formattedDate = '-';
          if (item.interview_date) {
            try {
              const date = new Date(item.interview_date);
              formattedDate = date.toISOString().split('T')[0];
            } catch (e) {
              formattedDate = item.interview_date;
            }
          }
          
          // Extract AC code - it should be in the item
          const acCode = item.ac_code || (item.ac_name ? parseInt(item.ac_name.split(' ')[0]) : null);
          
          return {
            id: index + 1,
            ac_name: item.ac_name || (acCode ? `AC ${acCode}` : '-'),
            ac_code: acCode,
            enumerator_id: item.user_id?.toString() || '-',
            enumerator_name: undefined,
            interviewer_id: item.interviewer_id?.toString() || '-',
            interview_date: formattedDate,
            device_id: item.device_id || '-',
            total_interview: item.total_interview || 0,
            gps_qc_status: 'Pending',
          };
        });
        
        setData(transformedData);
        setTotalCount(pagination.total_count || 0);
        setTotalPages(pagination.page_count || 1);
        setCurrentPage(pagination.current_page || page);
      } else {
        setError(responseData.message || 'Failed to fetch GPS QC data');
      }
    } catch (err: any) {
      console.error('Error fetching GPS QC data:', err);
      setError(err.message || 'Failed to fetch GPS QC data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchGPSQCData(1);
  };

  const handleClearFilters = () => {
    setFilters({
      enumeratorId: [],
      interviewDate: [],
      deviceId: '',
    });
    setCurrentPage(1);
    // Fetch data with cleared filters after a short delay
    setTimeout(() => {
      fetchGPSQCData(1);
    }, 100);
  };

  const handleViewOnMap = (item: PendingGPSQCData) => {
    // Navigate to GPS QC page with filters
    const queryParams = new URLSearchParams({
      ac_code: item.ac_code?.toString() || '',
      user_id: item.enumerator_id,
      interview_date: item.interview_date,
      device_id: item.device_id,
    });
    
    // Navigate to the GPS QC page
    router.push(`/capi/capi-qc/gps-qc/${qcId}/qcpage?${queryParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchGPSQCData(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900 dark:text-white">
              Pending GPS QC
            </Heading>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={4} className="text-lg font-semibold text-red-600 mb-2">
                    Error
                  </Heading>
                  <Text className="text-gray-600">{error}</Text>
                </div>
                <Button
                  onClick={() => fetchGPSQCData(currentPage)}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search/Filter Section */}
        <Card className="mb-6">
          <div className="p-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Enumerator ID Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enumerator ID
                  </label>
                  <SelectDropdown
                    options={[
                      { value: '', label: 'Select Enumerator ID' },
                      ...filterOptions.enumeratorIds
                    ]}
                    value={filters.enumeratorId}
                    onChange={(value) => handleFilterChange('enumeratorId', Array.isArray(value) ? value : [value])}
                    placeholder="Select Enumerator ID"
                    multiple={true}
                    searchable
                    disabled={filtersLoading}
                  />
                </div>

                {/* Interview Date Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Interview Date
                  </label>
                  <SelectDropdown
                    options={[
                      { value: '', label: 'Select Interview Date' },
                      ...filterOptions.interviewDates
                    ]}
                    value={filters.interviewDate}
                    onChange={(value) => handleFilterChange('interviewDate', Array.isArray(value) ? value : [value])}
                    placeholder="Select Interview Date"
                    multiple={true}
                    searchable
                  />
                </div>

                {/* Device ID Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Device ID
                  </label>
                  <Input
                    type="text"
                    placeholder="Search By Device ID"
                    value={filters.deviceId}
                    onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                  />
                </div>

                {/* Search Button */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClearFilters}
                    variant="outline"
                    disabled={loading}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Data Table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                PENDING GPS QC
              </Heading>
            </div>
          </div>
          <div className="p-6">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <Text className="ml-2 text-gray-600">Loading GPS QC data...</Text>
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Ac Name</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Enumerator ID</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Interviewer ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Interview Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Device ID</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Total Interview</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-left">
                            {item.ac_name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center font-mono">
                            {item.enumerator_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center font-mono">
                            {item.interviewer_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-left">
                            {item.interview_date}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-left font-mono">
                            {item.device_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                            {item.total_interview}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewOnMap(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Map className="w-4 h-4 mr-1" />
                              View on Map
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No pending GPS QC data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalCount > 0 && (
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-semibold">{startIndex + 1}-{endIndex}</span> of <span className="font-semibold">{totalCount}</span> items.
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

