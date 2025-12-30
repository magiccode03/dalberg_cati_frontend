'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, ExternalLink, X } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface QCUserProgressData {
  caller_name: string;
  qc_id: number;
  audio_qc_total: number;
  audio_qc_completed: number;
  audio_qc_pass: number;
  audio_qc_fail: number;
  audio_qc_pending: number;
  assigned_ac?: any[];
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: QCUserProgressData[];
    pagination: PaginationInfo;
  };
  message?: string;
  timestamp?: string;
  error?: string;
}

interface QCUserOption {
      qc_id: number;
      name: string;
      mobile_number: string;
}

export default function QCUserProgressPage() {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    reportDays: '',
    customDateFrom: '',
    customDateTo: '',
    qcId: '',
    qcUserStatus: '1', // Default to Active
    acCode: '',
  });

  const [qcUserProgressData, setQcUserProgressData] = useState<QCUserProgressData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qcUserOptions, setQcUserOptions] = useState<QCUserOption[]>([]);
  const [qcUserOptionsLoading, setQcUserOptionsLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Fetch QC user options based on status
  const fetchQCUserOptions = async (status: string) => {
    try {
      setQcUserOptionsLoading(true);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });
      
      const response = await Promise.race([
        apiClient.get(`/qc-user-registration?status=${status}&limit=1000`),
        timeoutPromise
      ]) as any;
      
      const data = response.data;
      
      if (data.success && data.data?.qc_users) {
        const options: QCUserOption[] = data.data.qc_users.map((user: any) => ({
          qc_id: user.qc_id,
          name: user.name,
          mobile_number: user.mobile_number
        }));
        setQcUserOptions(options);
      }
    } catch (err) {
      console.error('Error fetching QC user options:', err);
      setQcUserOptions([]);
    } finally {
      setQcUserOptionsLoading(false);
    }
  };

  // Fetch QC user options when status changes
  useEffect(() => {
    if (filters.qcUserStatus) {
      fetchQCUserOptions(filters.qcUserStatus);
    }
  }, [filters.qcUserStatus]);

  // Initial data fetch on page load
  useEffect(() => {
    console.log('Page loaded, fetching initial data...');
    fetchData();
  }, []);


  // Fetch data from API
  const fetchData = async (page: number = currentPage) => {
      try {
        setLoading(true);
        setError(null);
        
      console.log('=== Starting API Call ===');
      console.log('Current filters:', filters);
      console.log('Current page:', page);
        
        // Build query parameters from filters
        const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      // Add filter parameters
      if (filters.qcUserStatus) queryParams.append('qc_user_status', filters.qcUserStatus);
      if (filters.acCode) queryParams.append('ac_code', filters.acCode);
        if (filters.qcId) queryParams.append('qc_id', filters.qcId);
      
      // Handle date filters - always use audio_qc_complete_date_from and audio_qc_complete_date_to
      if (filters.reportDays === 'custom' && filters.customDateFrom && filters.customDateTo) {
        queryParams.append('audio_qc_complete_date_from', filters.customDateFrom);
        queryParams.append('audio_qc_complete_date_to', filters.customDateTo);
      } else if (filters.reportDays && filters.reportDays !== 'custom') {
        // Calculate date range based on reportDays selection
        const today = new Date();
        let fromDate: string;
        let toDate: string = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        switch (filters.reportDays) {
          case 'today':
            fromDate = toDate;
            break;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            fromDate = yesterday.toISOString().split('T')[0];
            toDate = fromDate;
            break;
          case 'dby': // Day before yesterday
            const dby = new Date(today);
            dby.setDate(dby.getDate() - 2);
            fromDate = dby.toISOString().split('T')[0];
            toDate = fromDate;
            break;
          case 'l3': // Last 3 days
            const l3 = new Date(today);
            l3.setDate(l3.getDate() - 2);
            fromDate = l3.toISOString().split('T')[0];
            break;
          case 'l7': // Last 7 days
            const l7 = new Date(today);
            l7.setDate(l7.getDate() - 6);
            fromDate = l7.toISOString().split('T')[0];
            break;
          case 'l15': // Last 15 days
            const l15 = new Date(today);
            l15.setDate(l15.getDate() - 14);
            fromDate = l15.toISOString().split('T')[0];
            break;
          case 'currentmonth': // Current month
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            fromDate = firstDay.toISOString().split('T')[0];
            break;
          default:
            fromDate = toDate;
        }
        
        queryParams.append('audio_qc_complete_date_from', fromDate);
        queryParams.append('audio_qc_complete_date_to', toDate);
        
        console.log(`Date range for ${filters.reportDays}: ${fromDate} to ${toDate}`);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `/capi/interview/qc-user-wise-data?${queryString}`;
      
      console.log('Query params:', queryString);
      console.log('Full endpoint:', endpoint);
        console.log('Making API request to:', endpoint);
        
      // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
        });
        
        const response = await Promise.race([
          apiClient.get(endpoint),
          timeoutPromise
        ]) as any;
        
      console.log('Raw response:', response);
        const data: APIResponse = response.data;
      console.log('Parsed API Response:', data);
      
      if (data.success && data.data && data.data.data && Array.isArray(data.data.data)) {
        console.log('Success! Data received:', data.data.data.length, 'items');
        setQcUserProgressData(data.data.data);
        
        // Handle pagination info
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.total_pages);
          setTotalCount(data.data.pagination.total_count);
          setHasNext(data.data.pagination.has_next);
          setHasPrevious(data.data.pagination.has_previous);
          setCurrentPage(data.data.pagination.current_page);
        } else {
          // Fallback if no pagination info
          setTotalPages(1);
          setTotalCount(data.data.data.length);
          setHasNext(false);
          setHasPrevious(false);
          setCurrentPage(1);
        }
          } else {
        console.log('No data or unsuccessful response');
        setQcUserProgressData([]);
        setTotalPages(0);
        setTotalCount(0);
        setHasNext(false);
        setHasPrevious(false);
        if (data.error) {
          setError(data.error);
        }
        }
      } catch (err: any) {
      console.error('=== API Error ===');
      console.error('Error details:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
        
        if (err.message === 'Request timeout after 10 seconds') {
        setError('Request timed out. Please try again.');
        } else if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access forbidden. You do not have permission to view this data.');
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || 'An error occurred while fetching data');
        }
        
      setQcUserProgressData([]);
      setTotalPages(0);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
      } finally {
      console.log('=== API Call Finished ===');
        setLoading(false);
      }
    };

  // Generate QC User options for dropdown
  const generateQCUserDropdownOptions = () => {
    const options = [{ value: '', label: 'Select QC User' }];
    qcUserOptions.forEach(user => {
      options.push({
        value: user.qc_id.toString(),
        label: `${user.name} (${user.qc_id})`
      });
    });
    return options;
  };


  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset QC ID when status changes
    if (field === 'qcUserStatus') {
      setFilters(prev => ({
        ...prev,
        [field]: value,
        qcId: ''
      }));
    }
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    setCurrentPage(1); // Reset to first page when searching
    fetchData(1);
  };

  const handleClear = () => {
    const defaultFilters = {
      reportDays: '',
      customDateFrom: '',
      customDateTo: '',
      qcId: '',
      qcUserStatus: '1',
      acCode: '',
    };
    setFilters(defaultFilters);
    setQcUserProgressData([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalCount(0);
    setHasNext(false);
    setHasPrevious(false);
  };

  const handlePageChange = (newPage: number) => {
    console.log('Page changed to:', newPage);
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const handleDownload = async () => {
    try {
      // Build query parameters from current filters
      const queryParams = new URLSearchParams();
      
      // Add limit for download
      queryParams.append('limit', '300');
      
      // Add filter parameters
      if (filters.qcUserStatus) queryParams.append('qc_user_status', filters.qcUserStatus);
      if (filters.acCode) queryParams.append('ac_code', filters.acCode);
      if (filters.qcId) queryParams.append('qc_id', filters.qcId);
      
      // Handle date filters
      if (filters.reportDays === 'custom' && filters.customDateFrom && filters.customDateTo) {
        queryParams.append('audio_qc_complete_date_from', filters.customDateFrom);
        queryParams.append('audio_qc_complete_date_to', filters.customDateTo);
      } else if (filters.reportDays && filters.reportDays !== 'custom') {
        // Calculate date range based on reportDays selection
        const today = new Date();
        let fromDate: string;
        let toDate: string = today.toISOString().split('T')[0];
        
        switch (filters.reportDays) {
          case 'today':
            fromDate = toDate;
            break;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            fromDate = yesterday.toISOString().split('T')[0];
            toDate = fromDate;
            break;
          case 'dby':
            const dby = new Date(today);
            dby.setDate(dby.getDate() - 2);
            fromDate = dby.toISOString().split('T')[0];
            toDate = fromDate;
            break;
          case 'l3':
            const l3 = new Date(today);
            l3.setDate(l3.getDate() - 2);
            fromDate = l3.toISOString().split('T')[0];
            break;
          case 'l7':
            const l7 = new Date(today);
            l7.setDate(l7.getDate() - 6);
            fromDate = l7.toISOString().split('T')[0];
            break;
          case 'l15':
            const l15 = new Date(today);
            l15.setDate(l15.getDate() - 14);
            fromDate = l15.toISOString().split('T')[0];
            break;
          case 'currentmonth':
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            fromDate = firstDay.toISOString().split('T')[0];
            break;
          default:
            fromDate = toDate;
        }
        
        queryParams.append('audio_qc_complete_date_from', fromDate);
        queryParams.append('audio_qc_complete_date_to', toDate);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `/capi/interview/qc-user-wise-data?${queryString}`;
      
      console.log('Downloading data from:', endpoint);
      
      // Fetch all data for download
      const response = await apiClient.get(endpoint) as any;
      const data: APIResponse = response.data;
      
      if (!data.success || !data.data?.data || !Array.isArray(data.data.data)) {
        alert('No data available for download.');
        return;
      }

      const downloadData = data.data.data;

      // Create CSV headers
      const headers = [
        'Sr.No.',
        'QC ID', 
        'QC User Name',
        'Total Assigned',
        'Audio QC Completed',
        'Audio QC Pass',
        'Audio QC Fail',
        'Audio QC Pending'
      ];

      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...downloadData.map((user, index) => [
          index + 1,
          user.qc_id,
          `"${user.caller_name}"`,
          user.audio_qc_total,
          user.audio_qc_completed,
          user.audio_qc_pass,
          user.audio_qc_fail,
          user.audio_qc_pending
        ].join(','))
      ];

      // Create CSV content
      const csvContent = csvRows.join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `qc_user_progress_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Error downloading data. Please try again.');
    }
  };

  const handleViewDetail = (qcId: number) => {
    // Navigate to the interview-list page
    router.push('/capi/dqm/progress/interview-list');
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Text className="text-gray-600">Loading QC user progress data...</Text>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <Card className="mb-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            QC User Progress
          </Heading>
        </div>
      </div>

        {/* Search Filters */}
        <Card className="p-4 mb-5">
          <div className="flex flex-wrap items-end gap-4">
            {/* Report Days Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Days
              </label>
                <SelectDropdown
                value={filters.reportDays}
                onChange={(value) => handleFilterChange('reportDays', value as string)}
                options={[
                  { value: '', label: 'All' },
                  { value: 'today', label: 'Today' },
                  { value: 'yesterday', label: 'Yesterday' },
                  { value: 'dby', label: 'Day Before Yesterday' },
                  { value: 'l3', label: 'Last 3 Days' },
                  { value: 'l7', label: 'Last 7 Days' },
                  { value: 'l15', label: 'Last 15 Days' },
                  { value: 'currentmonth', label: 'Current Month' },
                  { value: 'custom', label: 'Custom Date' },
                ]}
                placeholder="Select Report Days"
                searchable={false}
                clearable={true}
                />
              </div>

            {/* Custom Date Range Inputs - Only show when "Custom Date" is selected */}
            {filters.reportDays === 'custom' && (
              <>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={filters.customDateFrom}
                    onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={filters.customDateTo}
                    onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              </>
            )}

            {/* QC User Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QC User Status
              </label>
                <SelectDropdown
                value={filters.qcUserStatus}
                onChange={(value) => handleFilterChange('qcUserStatus', value as string)}
                  options={[
                    { value: '1', label: 'Active' },
                    { value: '2', label: 'Inactive' },
                  ]}
                placeholder="Select Status"
                />
              </div>

            {/* QC User Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QC User
              </label>
                <SelectDropdown
                value={filters.qcId}
                onChange={(value) => handleFilterChange('qcId', value as string)}
                options={generateQCUserDropdownOptions()}
                placeholder="Select QC User"
                searchable={true}
                clearable={true}
                maxHeight={300}
                disabled={qcUserOptionsLoading}
              />
            </div>

            {/* AC Code Filter */}
            {/* <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AC Code
              </label>
              <input
                type="text"
                value={filters.acCode}
                onChange={(e) => handleFilterChange('acCode', e.target.value)}
                placeholder="Enter AC Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div> */}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                className="flex items-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              <Button
                onClick={handleClear}
                className="bg-gray-500 text-white hover:bg-gray-600 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            </div>
          </Card>

      {/* QC User Progress Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC User Progress Summary
            </Heading>
          </div>
          <div className="flex items-center">
            <Button
              variant="primary"
              onClick={handleDownload}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalCount.toLocaleString()}</strong> QC users.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">QC ID</th>
                  <th className="text-center">QC User Name</th>
                  <th className="text-center">Total Assigned</th>
                  <th className="text-center">Audio QC : Completed</th>
                  <th className="text-center">Audio QC : Pass</th>
                  <th className="text-center">Audio QC : Fail</th>
                  <th className="text-center">Audio QC : Pending</th>
                </tr>
              </thead>
              <tbody>
                {qcUserProgressData.map((user, index) => (
                  <tr key={`${user.qc_id}-${index}`}>
                    <td className="text-center">{((currentPage - 1) * pageSize) + index + 1}</td>
                    <td className="text-center">{user.qc_id}</td>
                    <td className="text-left">{user.caller_name || '-'}</td>
                    <td className="text-center">{user.audio_qc_total.toLocaleString()}</td>
                    <td className="text-center">{user.audio_qc_completed.toLocaleString()}</td>
                    <td className="text-center">{user.audio_qc_pass.toLocaleString()}</td>
                    <td className="text-center">{user.audio_qc_fail.toLocaleString()}</td>
                    <td className="text-center">{user.audio_qc_pending.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
