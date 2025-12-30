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
import { Search, Download, X } from 'lucide-react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { MouseEvent } from 'react';

// Parse ISO like "2025-11-11T16:17:00.000Z" WITHOUT timezone conversion
// Output: "2025-11-11 04:17:00 PM"
function formatIsoTo12h(value?: string | null) {
  if (!value) return '-';
  const m = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (!m) return '-';
  const date = m[1];
  let hour = parseInt(m[2], 10);
  const minute = m[3];
  const second = m[4];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const hh = hour.toString().padStart(2, '0');
  return `${date} ${hh}:${minute}:${second} ${ampm}`;
}

// CSV-safe (empty string for missing)
function formatIsoTo12hCsv(value?: string | null) {
  const r = formatIsoTo12h(value);
  return r === '-' ? '' : r;
}

interface QCUserProgressData {
  user_id: number;
  user_name: string;
  mobile_number: string;
  user_type: string;
  agency_id: number;
  agency_name: string;
  status: number;
  start_time?: string | null;
  end_time?: string | null;
  total_qc_assigned: number;
  total_qc_pass: number;
  total_qc_fail: number;
  total_qc_pending: number;
  ac_wise_statistics: ACWiseStatistics[];
}

interface ACWiseStatistics {
  ac_code: number;
  ac_name: string;
  qc_total_assigned: number;
  qc_completed: number;
  qc_pass: number;
  qc_fail: number;
  qc_pending: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface APIResponse {
  success: boolean;
  data?: QCUserProgressData[];
  pagination?: PaginationInfo;
  message?: string;
  timestamp?: string;
  error?: string;
}

interface QCUserOption {
  id: number;
  teleform_user_id: number;
  name: string;
  mobile_number: string;
  form_id: number;
  fill_form: number;
  qc: number;
  supervisor_id: number;
  agency_id: number;
  telecalling_group_id: number;
  under_training: number;
  status: number;
  created_at: number;
  updated_at: number;
}

export default function QCUserProgressPage() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    reportDays: '',
    customDateFrom: '',
    customDateTo: '',
    teleformUserId: '',
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
  const [pageSize] = useState(20);
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
        apiClient.get(`/teleform-users?qc=1&status=${status}&limit=500`),
        timeoutPromise
      ]) as any;

      const data = response.data;

      if (data.success && data.data) {
        const options: QCUserOption[] = data.data.map((user: any) => ({
          id: user.id,
          teleform_user_id: user.teleform_user_id,
          name: user.name,
          mobile_number: user.mobile_number,
          form_id: user.form_id,
          fill_form: user.fill_form,
          qc: user.qc,
          supervisor_id: user.supervisor_id,
          agency_id: user.agency_id,
          telecalling_group_id: user.telecalling_group_id,
          under_training: user.under_training,
          status: user.status,
          created_at: user.created_at,
          updated_at: user.updated_at
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
  const fetchData = async (page: number = 1, filtersToUse?: typeof filters) => {
    try {
      setLoading(true);
      setError(null);

      // Use provided filters or current filters
      const activeFilters = filtersToUse || filters;

      console.log('=== Starting API Call ===');
      console.log('Current filters:', activeFilters);
      console.log('Current page:', page);

      // Build query parameters from filters
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());

      // Add filter parameters
      if (activeFilters.acCode) queryParams.append('ac_code', activeFilters.acCode);
      if (activeFilters.teleformUserId) queryParams.append('teleform_user_id', activeFilters.teleformUserId);
      if (activeFilters.qcUserStatus) queryParams.append('status', activeFilters.qcUserStatus);

      // Handle date filters - use qc_complete_start_date and qc_complete_end_date
      if (activeFilters.reportDays === 'custom' && activeFilters.customDateFrom && activeFilters.customDateTo) {
        queryParams.append('qc_complete_start_date', activeFilters.customDateFrom);
        queryParams.append('qc_complete_end_date', activeFilters.customDateTo);
      } else if (activeFilters.reportDays && activeFilters.reportDays !== 'custom') {
        // Calculate date range based on reportDays selection
        const today = new Date();
        let fromDate: string;
        let toDate: string = today.toISOString().split('T')[0]; // YYYY-MM-DD format

        switch (activeFilters.reportDays) {
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

        queryParams.append('qc_complete_start_date', fromDate);
        queryParams.append('qc_complete_end_date', toDate);

        console.log(`Date range for ${activeFilters.reportDays}: ${fromDate} to ${toDate}`);
      }

      const queryString = queryParams.toString();
      const endpoint = `/cati/qc/unified-user-statistics?${queryString}`;

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

      if (data.success && data.data && Array.isArray(data.data)) {
        console.log('Success! Data received:', data.data.length, 'items');
        setQcUserProgressData(data.data);

        // Handle pagination info
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.total);
          setHasNext(data.pagination.page < data.pagination.totalPages);
          setHasPrevious(data.pagination.page > 1);
          setCurrentPage(data.pagination.page);
        } else {
          // Fallback if no pagination info
          setTotalPages(1);
          setTotalCount(data.data.length);
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
        value: user.teleform_user_id.toString(),
        label: `${user.name} (${user.teleform_user_id})`
      });
    });
    return options;
  };

  const handleRowLinkClick = (event: MouseEvent<HTMLAnchorElement>, user: QCUserProgressData) => {
    try {
      sessionStorage.setItem(`qc-user-progress-detail-${user.user_id}`, JSON.stringify(user));
    } catch (err) {
      console.warn('Unable to cache QC user detail', err);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset QC User ID when status changes
    if (field === 'qcUserStatus') {
      setFilters(prev => ({
        ...prev,
        [field]: value,
        teleformUserId: ''
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
      teleformUserId: '',
      qcUserStatus: '1',
      acCode: '',
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    // Fetch data with default filters (only status=1 and pagination)
    fetchData(1, defaultFilters);
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
      queryParams.append('limit', '1000');

      // Add filter parameters
      if (filters.acCode) queryParams.append('ac_code', filters.acCode);
      if (filters.teleformUserId) queryParams.append('teleform_user_id', filters.teleformUserId);
      if (filters.qcUserStatus) queryParams.append('status', filters.qcUserStatus);

      // Handle date filters
      if (filters.reportDays === 'custom' && filters.customDateFrom && filters.customDateTo) {
        queryParams.append('qc_complete_start_date', filters.customDateFrom);
        queryParams.append('qc_complete_end_date', filters.customDateTo);
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

        queryParams.append('qc_complete_start_date', fromDate);
        queryParams.append('qc_complete_end_date', toDate);
      }

      const queryString = queryParams.toString();
      const endpoint = `/cati/qc/unified-user-statistics?${queryString}`;

      console.log('Downloading data from:', endpoint);

      // Fetch all data for download
      const response = await apiClient.get(endpoint) as any;
      const data: APIResponse = response.data;

      if (!data.success || !data.data || !Array.isArray(data.data)) {
        alert('No data available for download.');
        return;
      }

      const downloadData = data.data;

      // Create CSV headers
      const headers = [
        'S.No',
        'User ID',
        'User Name',
        'Mobile Number',
        'Start time',
        'End time',
        'Total Assigned',
        'QC Pass',
        'QC Fail',
        'QC Pending'
      ];

      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...downloadData.map((user, index) => [
          index + 1,
          user.user_id,
          `"${user.user_name}"`,
          `"${user.mobile_number}"`,
          `"${formatIsoTo12hCsv(user.start_time)}"`,
          `"${formatIsoTo12hCsv(user.end_time)}"`,
          user.total_qc_assigned,
          user.total_qc_pass,
          user.total_qc_fail,
          user.total_qc_pending
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
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading QC user progress data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <Card className="mb-6">
            <div className="card-body text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
              <Text className="text-gray-600 mb-4">{error}</Text>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Page Header */}
        <div className="mb-6">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            QC User Progress
          </Heading>
        </div>

        {/* Search Filters */}
        <Card className=" mb-5">
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
                  { value: '0', label: 'Inactive' },
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
                value={filters.teleformUserId}
                onChange={(value) => handleFilterChange('teleformUserId', value as string)}
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
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

          <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
            Total <strong>{totalCount}</strong> QC users.
          </div>

          <div className="overflow-x-auto">
            <Table
              striped
              bordered
              hover
              className="w-full border-collapse"
            >
              <thead className="sticky-header bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">User ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">User Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Start time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">End time</th>
                  {/* <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Total Assigned
                  </th> */}
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    QC Pass
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    QC Fail
                  </th>
                  {/* <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    QC Pending
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qcUserProgressData.map((user, index) => (
                  <tr key={`${user.user_id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
                      <Link
                        href={`/cati/ppm/qc-progress/qc-user-progress-daily/user/${user.user_id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(event) => handleRowLinkClick(event, user)}
                      >
                        {user.user_id}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.user_name || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.mobile_number || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{formatIsoTo12h(user.start_time)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{formatIsoTo12h(user.end_time)}</td>
                    {/* <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.total_qc_assigned.toLocaleString()}</td> */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.total_qc_pass.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.total_qc_fail.toLocaleString()}</td>
                    {/* <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.total_qc_pending.toLocaleString()}</td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex justify-between items-center mt-4 px-4 pb-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{((currentPage - 1) * pageSize) + 1}</span> - <span className="font-semibold">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> results.
            </div>
            {totalPages > 1 && (
              <div>
                <PaginationStandard
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={pageSize}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
