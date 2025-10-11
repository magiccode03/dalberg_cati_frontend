'use client';

import React, { useState, useEffect } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Calendar, BarChart3, Phone, Clock, Users, TrendingUp, TrendingDown, Activity, Filter, Search, Download, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import TelecallerList from '@/components/telecaller/TelecallerList';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Text from '@/components/ui/Text';

// Interface for performance metrics
interface PerformanceMetrics {
  // Caller Performance
  total_callers: number;
  number_of_dials: number;
  caller_did_not_pick: number;
  days_till_now: number;
  total_ivr_duration: string;
  total_talk_duration: string;
  call_connected: number;
  
  // Call Dial Status
  call_not_received: number;
  ringing: number;
  not_ringing: number;
  no_response: number;
  
  // Not Ringing Breakdown
  switch_off: number;
  number_not_reachable: number;
  number_does_not_exist: number;
  not_ringing_no_response: number;
  
  // Ringing Breakdown
  picked: number;
  did_not_picked: number;
  ringing_no_response: number;
  
  // Ringing Picked Breakdown
  call_continue: number;
  wrong_number: number;
  reschedule_call: number;
  picked_no_response: number;
  
  // General Metrics
  number_exhausted: number;
  successful_interview: number;
  incomplete_interview: number;
  reject_interview: number;
}

// Day-wise performance interface
interface DayWisePerformance {
  date: string;
  metrics: PerformanceMetrics;
}

// Telecaller interface
interface Telecaller {
  teleform_user_id: number;
  name: string;
  mobile_number: string;
}

// AC interface
interface ACData {
  ac_code: number;
  ac_name: string;
  district_name: string;
}

// Telecaller Wise Data interface
interface TelecallerWiseData {
  telecaller_id: number;
  caller_name: string;
  number_of_dials: number;
  ivr_duration: string;
  talk_duration: string;
  caller_did_not_pick: number;
  number_does_not_exist: number;
  respondent_picked_call: number;
  picked_and_refused: number;
  number_exhausted: number;
  successful_interviews: number;
  rejected_interviews: number;
  incomplete_interviews: number;
  number_picked_the_call: number;
  number_does_not_working: number;
}

// Pagination interface for telecaller data
interface TelecallerDataPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const TelecallerProgressPage: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [dayWiseData, setDayWiseData] = useState<DayWisePerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overall' | 'daywise'>('overall');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Telecaller filter states
  const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
  const [loadingTelecallers, setLoadingTelecallers] = useState(false);
  
  // AC filter states
  const [acList, setAcList] = useState<ACData[]>([]);
  const [loadingACs, setLoadingACs] = useState(false);

  // Search filters state
  const [filters, setFilters] = useState({
    serverId: '',
    acCode: '',
    callingDates: '',
    customDateFrom: '',
    customDateTo: '',
    telecaller: '',
    phone: '',
    callOutcome: '',
    talkDuration: '',
  });

  // Telecaller-wise data states
  const [telecallerWiseData, setTelecallerWiseData] = useState<TelecallerWiseData[]>([]);
  const [telecallerDataPagination, setTelecallerDataPagination] = useState<TelecallerDataPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [telecallerDataLoading, setTelecallerDataLoading] = useState(false);
  const [telecallerDataError, setTelecallerDataError] = useState<string | null>(null);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  // Table sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TelecallerWiseData | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Dropdown options
  const acCodeOptions = [
    { value: '', label: 'All ACs' },
    ...acList
      .sort((a, b) => a.ac_name.localeCompare(b.ac_name))
      .map((ac) => ({
      value: ac.ac_code.toString(),
        label: `${ac.ac_name} - (${ac.ac_code})`,
    })),
  ];

  const telecallerOptions = [
    { value: '', label: 'All Telecallers' },
    ...telecallers
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((tc) => ({
      value: tc.teleform_user_id.toString(),
      label: `${tc.name} (${tc.mobile_number})`,
    })),
  ];

  const callOutcomeOptions = [
    { value: '', label: 'All Outcomes' },
    { value: '2', label: 'Incomplete Interview' },
    { value: '4', label: 'Number Exhausted' },
    { value: '3', label: 'Reject Interview' },
    { value: '1', label: 'Successful Interview' },
  ];

  const talkDurationOptions = [
    { value: '', label: 'All Durations' },
    { value: '0-60', label: '0-1 minute' },
    { value: '60-120', label: '1-2 minutes' },
    { value: '120-180', label: '2-3 minutes' },
    { value: '180+', label: '3+ minutes' },
  ];

  const callingDatesOptions = [
    { value: '', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'dby', label: 'Day Before Yesterday' },
    { value: 'l3', label: 'Last 3 Days' },
    { value: 'l7', label: 'Last 7 Days' },
    { value: 'l15', label: 'Last 15 Days' },
    { value: 'currentmonth', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date Range' },
  ];

  // Helper function to convert date range to actual dates for performance API
  const getDateRangeForPerformanceAPI = (dateValue: string, customDateFrom?: string, customDateTo?: string) => {
    if (dateValue === 'custom' && customDateFrom && customDateTo) {
      return {
        start_date: customDateFrom,
        end_date: customDateTo
      };
    } else if (dateValue && dateValue !== 'custom') {
      // Convert predefined ranges to actual date strings
      const today = new Date();
      let startDate: string;
      let endDate: string;

      switch (dateValue) {
        case 'today':
          startDate = endDate = today.toISOString().split('T')[0];
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          startDate = endDate = yesterday.toISOString().split('T')[0];
          break;
        case 'dby': // Day Before Yesterday
          const dby = new Date(today);
          dby.setDate(today.getDate() - 2);
          startDate = endDate = dby.toISOString().split('T')[0];
          break;
        case 'l3': // Last 3 Days
          const l3Start = new Date(today);
          l3Start.setDate(today.getDate() - 2);
          startDate = l3Start.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'l7': // Last 7 Days
          const l7Start = new Date(today);
          l7Start.setDate(today.getDate() - 6);
          startDate = l7Start.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'l15': // Last 15 Days
          const l15Start = new Date(today);
          l15Start.setDate(today.getDate() - 14);
          startDate = l15Start.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'currentmonth':
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate = firstDayOfMonth.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        default:
          return {};
      }

      return {
        start_date: startDate,
        end_date: endDate
      };
    }
    return {};
  };

  // Helper function to convert date range to actual dates for other APIs (telecaller-wise)
  const getDateRangeForOtherAPI = (dateValue: string, customDateFrom?: string, customDateTo?: string) => {
    if (dateValue === 'custom' && customDateFrom && customDateTo) {
      return {
        date_from: customDateFrom,
        date_to: customDateTo
      };
    } else if (dateValue && dateValue !== 'custom') {
      // Convert predefined ranges to actual date strings
      const today = new Date();
      let startDate: string;
      let endDate: string;

      switch (dateValue) {
        case 'today':
          startDate = endDate = today.toISOString().split('T')[0];
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          startDate = endDate = yesterday.toISOString().split('T')[0];
          break;
        case 'dby': // Day Before Yesterday
          const dby = new Date(today);
          dby.setDate(today.getDate() - 2);
          startDate = endDate = dby.toISOString().split('T')[0];
          break;
        case 'l3': // Last 3 Days
          const l3Start = new Date(today);
          l3Start.setDate(today.getDate() - 2);
          startDate = l3Start.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'l7': // Last 7 Days
          const l7Start = new Date(today);
          l7Start.setDate(today.getDate() - 6);
          startDate = l7Start.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'l15': // Last 15 Days
          const l15Start = new Date(today);
          l15Start.setDate(today.getDate() - 14);
          startDate = l15Start.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'currentmonth':
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate = firstDayOfMonth.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        default:
          return {};
      }

      return {
        date_from: startDate,
        date_to: endDate
      };
    }
    return {};
  };

  // Filter change handler
  const handleFilterChange = (field: string, value: string | string[]) => {
    const newValue = Array.isArray(value) ? value[0] || '' : value;
    setFilters((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  // Search handler
  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    // Trigger API calls with current filters
    if (viewMode === 'overall') {
    fetchPerformanceData();
    } else {
      fetchDayWiseData();
    }
    fetchTelecallerWiseData(); // Fetch all data when filtering
  };

  // Fetch performance data
  const fetchPerformanceData = async (date?: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with filters
      const params = new URLSearchParams();
      
      // Apply filters from UI
      // Telecaller filter
      if (filters.telecaller && filters.telecaller !== '') {
        params.append('teleform_user_id', filters.telecaller);
      }
      
      // AC Code filter
      if (filters.acCode && filters.acCode !== '') {
        params.append('ac_code', filters.acCode);
      }
      
      // Date filter - handle custom dates and predefined ranges (performance API uses start_date/end_date)
      const dateRange = getDateRangeForPerformanceAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
      Object.entries(dateRange).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Legacy date parameter (for backward compatibility)
      if (date) {
        params.append('date', date);
      }
      
      const url = `${apiUrl}/api/cati/telecaller-performance${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Debug log for API calls
      console.log('Performance API URL:', url);
      console.log('Date range:', dateRange);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('API endpoint not available. Please check if the backend server is running.');
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        if (viewMode === 'overall') {
          setMetrics(result.data);
        } else {
          setDayWiseData(result.data);
        }
        setError(null); // Clear any previous errors
      } else {
        setError(result.message || 'Failed to fetch performance data');
      }
    } catch (err: any) {
      console.error('Error fetching performance data:', err);
      
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('An error occurred while fetching performance data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch day-wise data
  const fetchDayWiseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with filters for day-wise data
      const params = new URLSearchParams();
      
      // Apply filters from UI
      // Telecaller filter
      if (filters.telecaller && filters.telecaller !== '') {
        params.append('teleform_user_id', filters.telecaller);
      }
      
      // AC Code filter
      if (filters.acCode && filters.acCode !== '') {
        params.append('ac_code', filters.acCode);
      }
      
      // Date filter - handle custom dates and predefined ranges (day-wise API also uses start_date/end_date)
      const dateRange = getDateRangeForPerformanceAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
      Object.entries(dateRange).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      params.append('days', '7'); // Default to 7 days
      
      const url = `${apiUrl}/api/cati/telecaller-performance/daywise${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Debug log for day-wise API calls
      console.log('Day-wise API URL:', url);
      console.log('Date range:', dateRange);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('Day-wise API endpoint not available. Please check if the backend server is running.');
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        setDayWiseData(result.data);
        setError(null); // Clear any previous errors
      } else {
        setError(result.message || 'Failed to fetch day-wise performance data');
      }
    } catch (err: any) {
      console.error('Error fetching day-wise data:', err);
      
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('An error occurred while fetching day-wise performance data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch telecallers list
  const fetchTelecallers = async () => {
    setLoadingTelecallers(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiUrl}/api/teleform-users?status=1&limit=1000`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok && result.success) {
          setTelecallers(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching telecallers:', err);
    } finally {
      setLoadingTelecallers(false);
    }
  };

  // Fetch AC list
  const fetchACList = async () => {
    setLoadingACs(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiUrl}/api/cati/ac-details?limit=1000`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok && result.success) {
          const acData = Array.isArray(result.data?.data) ? result.data.data : [];
          setAcList(acData);
        }
      }
    } catch (err) {
      console.error('Error fetching AC list:', err);
    } finally {
      setLoadingACs(false);
    }
  };

  // Fetch telecaller-wise data - fetch all pages to get complete data
  const fetchTelecallerWiseData = async () => {
    setTelecallerDataLoading(true);
    setTelecallerDataError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setTelecallerDataError('Authentication token not found');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Fetch all data by making multiple API calls
      let allData: TelecallerWiseData[] = [];
      let currentPage = 1;
      let hasMoreData = true;
      const limit = 100; // API maximum limit

      while (hasMoreData) {
        // Build query parameters for current page
      const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
      });
      
      // Add filters (only if they have values)
      if (filters.acCode && filters.acCode !== '') {
        params.append('ac_code', filters.acCode);
      }
      
      if (filters.telecaller && filters.telecaller !== '') {
        params.append('teleform_user_id', filters.telecaller);
      }
      
        // Date filter - handle custom dates and predefined ranges
        const dateRange = getDateRangeForPerformanceAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
        Object.entries(dateRange).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      
      const url = `${apiUrl}/api/cati/telecaller-wise-data?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

        // Debug log for telecaller-wise API calls
        console.log('Telecaller-wise API URL:', url);
        console.log('Date range:', dateRange);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
          const pageData = result.data.data || [];
          allData = [...allData, ...pageData];

          // Check if there are more pages
          const pagination = result.data.pagination;
          hasMoreData = pagination && currentPage < pagination.totalPages;
          currentPage++;
      } else {
        throw new Error(result.message || 'Failed to fetch telecaller-wise data');
      }
      } // End of while loop

      setTelecallerWiseData(allData);
    } catch (err) {
      console.error('Error fetching telecaller-wise data:', err);
      setTelecallerDataError(err instanceof Error ? err.message : 'Failed to fetch telecaller-wise data');
    } finally {
      setTelecallerDataLoading(false);
    }
  };

  // Handle page change for telecaller data (no longer needed since pagination is removed)
  const handleTelecallerDataPageChange = (newPage: number) => {
    fetchTelecallerWiseData();
  };

  // Handle table sorting
  const handleSort = (key: keyof TelecallerWiseData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted data
  const getSortedData = () => {
    if (!sortConfig.key) return telecallerWiseData;

    return [...telecallerWiseData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Download telecaller data as CSV (limit 200 records with current filters)
  const handleDownloadTelecallerCSV = async () => {
    setDownloadingCSV(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build query parameters with API maximum limit
      const params = new URLSearchParams({
        page: '1',
        limit: '100', // API maximum limit
      });
      
      // Add filters (only if they have values)
      if (filters.acCode && filters.acCode !== '') {
        params.append('ac_code', filters.acCode);
      }
      
      if (filters.telecaller && filters.telecaller !== '') {
        params.append('teleform_user_id', filters.telecaller);
      }
      
      // Date filter - handle custom dates and predefined ranges (CSV download uses date_from/date_to)
      const dateRange = getDateRangeForOtherAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
      Object.entries(dateRange).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const url = `${apiUrl}/api/cati/telecaller-wise-data?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && result.data.data) {
        const data = result.data.data;
        
        // Convert to CSV
        const headers = [
          'Sr. No.',
          'Caller Name',
          'Number of Dials',
          'IVR Duration',
          'Talk Duration',
          'Caller Did Not Pick',
          'Number Does Not Exist',
          'Respondent Picked Call',
          'Picked and Refused',
          'Number Exhausted',
          'Successful Interviews',
          'Rejected Interviews',
          'Incomplete Interviews',
          'Number: Picked The Call',
          'Number: Does Not Working',
        ];

        const csvRows = [
          headers.join(','),
          ...data.map((item: TelecallerWiseData, index: number) => [
            index + 1,
            `"${item.caller_name || '-'}"`,
            item.number_of_dials || 0,
            `"${item.ivr_duration || '00:00:00'}"`,
            `"${item.talk_duration || '00:00:00'}"`,
            item.caller_did_not_pick || 0,
            item.number_does_not_exist || 0,
            item.respondent_picked_call || 0,
            item.picked_and_refused || 0,
            item.number_exhausted || 0,
            item.successful_interviews || 0,
            item.rejected_interviews || 0,
            item.incomplete_interviews || 0,
            item.number_picked_the_call || 0,
            item.number_does_not_working || 0,
          ].join(','))
        ];

        const csvContent = csvRows.join('\n');

        // Generate filename with current date
        const today = new Date().toISOString().split('T')[0];
        const filename = `Telecaller_Wise_Data_${today}.csv`;

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const csvUrl = URL.createObjectURL(blob);
        
        link.setAttribute('href', csvUrl);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(csvUrl);

        console.log(`Downloaded ${data.length} records to ${filename}`);
      } else {
        throw new Error(result.message || 'Failed to fetch data for download');
      }
    } catch (err) {
      console.error('Error downloading CSV:', err);
      alert(err instanceof Error ? err.message : 'Failed to download CSV');
    } finally {
      setDownloadingCSV(false);
    }
  };

  // Fetch telecallers and ACs on mount
  useEffect(() => {
    fetchTelecallers();
    fetchACList();
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    if (viewMode === 'overall') {
      fetchPerformanceData();
    } else {
      fetchDayWiseData();
    }
    // Fetch telecaller-wise data
    fetchTelecallerWiseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - filters are applied via "View" button

  const formatDuration = (duration: string) => {
    return duration || '00:00:00';
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    textColor?: string;
  }> = ({ title, value, icon, color, bgColor, textColor = 'text-white' }) => (
    <div className={`${bgColor} rounded-lg p-3 md:p-4 border-l-4 ${color} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-xs md:text-sm font-medium ${textColor} opacity-90 truncate`}>{title}</p>
          <p className={`text-lg md:text-2xl font-bold ${textColor} mt-1 break-all`}>{value}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
        {icon}
      </div>
      <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </Heading>
    </div>
  );

  const renderMetrics = (data: PerformanceMetrics) => (
    <>
      {/* Caller Performance Section */}
      <div className="mb-8">
        <SectionHeader title="CALLER PERFORMANCE" icon={<Activity className="h-6 w-6 text-blue-600" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            title="Total Callers"
            value={data.total_callers}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="border-blue-500"
            bgColor="bg-blue-500"
          />
          <MetricCard
            title="Number of Dials Attempted"
            value={data.number_of_dials}
            // value={4790}
            icon={<Phone className="h-6 w-6 text-orange-600" />}
            color="border-orange-500"
            bgColor="bg-orange-500"
          />
          {/* <MetricCard
            title="Caller did not pick"
            value={data.caller_did_not_pick}
            icon={<TrendingDown className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          /> */}
          <MetricCard
            title="Number of Calls Connected"
            value={data.call_connected}
            // value={2124}
            icon={<Calendar className="h-6 w-6 text-indigo-600" />}
            color="border-indigo-500"
            bgColor="bg-indigo-500"
          />
          {/* <MetricCard
            title="Total IVR Duration"
            value={formatDuration(data.total_ivr_duration)}
            icon={<Clock className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          /> */}
          <MetricCard
            title="Total Talk Duration"
            value={formatDuration(data.total_talk_duration)}
            icon={<Clock className="h-6 w-6 text-emerald-600" />}
            color="border-emerald-500"
            bgColor="bg-emerald-500"
          />
        </div>
      </div>

      {/* Call Dial Status Section */}
      <div className="mb-8">
        <SectionHeader title="CALL DIAL STATUS" icon={<BarChart3 className="h-6 w-6 text-blue-600" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* <MetricCard
            title="Call not Received"
            value={data.call_not_received}
            icon={<Phone className="h-6 w-6 text-amber-600" />}
            color="border-amber-500"
            bgColor="bg-amber-500"
          /> */}
          <MetricCard
            title="Ringing"
            value={data.ringing}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          <MetricCard
            title="Not Ringing"
            value={data.not_ringing}
            icon={<Phone className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          />
          <MetricCard
            title="No Response"
            // value={data.no_response}
            value={0}
            icon={<Phone className="h-6 w-6 text-teal-600" />}
            color="border-teal-500"
            bgColor="bg-teal-500"
          />
        </div>
      </div>

      {/* Call Dial: Not Ringing Section */}
      {/* <div className="mb-8">
        <SectionHeader title="CALL DIAL : NOT RINGING" icon={<TrendingDown className="h-6 w-6 text-red-600" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            title="Switch Off"
            value={data.switch_off}
            icon={<Phone className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          />
          <MetricCard
            title="Number Not Reachable"
            value={data.number_not_reachable}
            icon={<Phone className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          />
          <MetricCard
            title="Number Does Not Exist"
            value={data.number_does_not_exist}
            icon={<Phone className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          />
          <MetricCard
            title="No Response"
            value={data.not_ringing_no_response}
            icon={<Phone className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          />
        </div>
      </div> */}

      {/* Call Dial: Ringing Section */}
      {/* <div className="mb-8">
        <SectionHeader title="CALL DIAL : RINGING" icon={<TrendingUp className="h-6 w-6 text-green-600" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Picked"
            value={data.picked}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          <MetricCard
            title="Did not picked"
            value={data.did_not_picked}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          <MetricCard
            title="No Response"
            value={data.ringing_no_response}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
        </div>
      </div> */}

      {/* Call Dial: Ringing (Picked) Section */}
      {/* <div className="mb-8">
        <SectionHeader title="CALL DIAL : RINGING (PICKED)" icon={<BarChart3 className="h-6 w-6 text-green-600" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            title="Call Continue"
            value={data.call_continue}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          <MetricCard
            title="Wrong Number"
            value={data.wrong_number}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          <MetricCard
            title="Reschedule Call"
            value={data.reschedule_call}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          <MetricCard
            title="No Response"
            value={data.picked_no_response}
            icon={<Phone className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
        </div>
      </div> */}

      {/* General Metrics Section */}
      <div className="mb-8">
        <SectionHeader title="INTERVIEW METRICS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
          {/* <MetricCard
            title="Number Exhausted"
            value={data.number_exhausted}
            icon={<Phone className="h-6 w-6 text-blue-600" />}
            color="border-blue-500"
            bgColor="bg-blue-500"
          /> */}
          <MetricCard
            title="Successful Interview"
            value={data.successful_interview}
            // value={406}
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            color="border-green-500"
            bgColor="bg-green-500"
          />
          {/* <MetricCard
            title="Incomplete Interview"
            value={data.incomplete_interview}
            icon={<TrendingDown className="h-6 w-6 text-amber-600" />}
            color="border-amber-500"
            bgColor="bg-amber-500"
          /> */}
          {/* <MetricCard
            title="Reject Interview"
            // value={data.reject_interview}
            value={1725}
            icon={<TrendingDown className="h-6 w-6 text-red-600" />}
            color="border-red-500"
            bgColor="bg-red-500"
          /> */}
        </div>
      </div>
    </>
  );

  return (
    <FluidContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          {/* Header Section - Responsive */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Title Section */}
            <div className="flex-1">
              <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
                Caller Performance Dashboard
              </Heading>
              {/* <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                Real-time telecaller performance metrics and analytics
              </p> */}
            </div>

            
            {/* View Mode Toggle and Refresh - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              {/* View Mode Toggle Buttons */}
              {/* <div className="flex gap-2 flex-1 sm:flex-initial">
                <Button
                  variant={viewMode === 'overall' ? 'primary' : 'outline'}
                  onClick={() => setViewMode('overall')}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-3 py-2"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden xs:inline">Overall</span>
                  <span className="xs:hidden">Overall</span>
                </Button>
                <Button
                  variant={viewMode === 'daywise' ? 'primary' : 'outline'}
                  onClick={() => setViewMode('daywise')}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-3 py-2"
                  size="sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden xs:inline">Day-wise</span>
                  <span className="xs:hidden">Day</span>
                </Button>
              </div> */}
              
              {/* Refresh Button */}
              {/* <Button
                variant="outline"
                onClick={() => {
                  if (viewMode === 'overall') {
                    fetchPerformanceData();
                  } else {
                    fetchDayWiseData();
                  }
                }}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2"
                size="sm"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden xs:inline">{loading ? 'Loading...' : 'Refresh'}</span>
                <span className="xs:hidden">{loading ? '...' : '↻'}</span>
              </Button> */}
            </div>
          </div>

        </div>

        
        {/* Search Filters */}
        <Card className="mb-4">
          <div className="flex flex-wrap items-end gap-4">

            {/* AC Code */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AC Code
              </label>
              <SelectDropdown
                value={filters.acCode}
                onChange={(value) => handleFilterChange('acCode', value)}
                options={acCodeOptions}
                placeholder="Select AC"
                searchable={true}
                clearable={true}
                maxHeight={300}
              />
            </div>

            {/* Calling Dates */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calling Dates
              </label>
              <SelectDropdown
                value={filters.callingDates}
                onChange={(value) => handleFilterChange('callingDates', value)}
                options={callingDatesOptions}
                placeholder="Select Date Range"
                searchable={false}
                clearable={true}
                maxHeight={300}
              />
            </div>

            {/* Custom Date Range Inputs - Only show when "Custom Date Range" is selected */}
            {filters.callingDates === 'custom' && (
              <>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                    value={filters.customDateFrom}
                    onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                    placeholder="Select From Date"
              />
            </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={filters.customDateTo}
                    onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                    placeholder="Select To Date"
                  />
                </div>
              </>
            )}

            {/* Telecaller */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telecaller
              </label>
              <SelectDropdown
                value={filters.telecaller}
                onChange={(value) => handleFilterChange('telecaller', value)}
                options={telecallerOptions}
                placeholder="Select Telecaller"
                searchable={true}
                clearable={true}
                maxHeight={300}
              />
            </div>

            

            {/* Call Outcome */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Outcome
              </label>
              <SelectDropdown
                value={filters.callOutcome}
                onChange={(value) => handleFilterChange('callOutcome', value)}
                options={callOutcomeOptions}
                placeholder="Select Call Outcome"
                searchable={true}
                clearable={true}
                maxHeight={300}
              />
            </div>

            {/* View and Clear Buttons */}
            <div className="flex-shrink-0 flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleSearch}
                className="flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              
              {/* Clear Filters Button */}
              {/* <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({
                    serverId: '',
                    acCode: '',
                    callingDates: '',
                    customDateFrom: '',
                    customDateTo: '',
                    telecaller: '',
                    phone: '',
                    callOutcome: '',
                    talkDuration: '',
                  });
                }}
                className="flex items-center"
                title="Clear all filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button> */}
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm md:text-base">Unable to Load Performance Data</h4>
                <p className="mt-1 text-sm">{error}</p>
                <p className="mt-2 text-xs md:text-sm opacity-90">
                  Make sure the backend server is running on <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">http://localhost:4001</code>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (viewMode === 'overall') {
                    fetchPerformanceData();
                  } else {
                    fetchDayWiseData();
                  }
                }}
                className="w-full sm:w-auto flex-shrink-0"
              >
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Success Message */}
            {/* {metrics && viewMode === 'overall' && (
              <Alert type="success" className="mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    <span className="hidden sm:inline">Performance data loaded successfully. Last updated: {new Date().toLocaleTimeString()}</span>
                    <span className="sm:hidden">Data loaded • {new Date().toLocaleTimeString()}</span>
                  </span>
                </div>
              </Alert>
            )} */}
            
            {dayWiseData.length > 0 && viewMode === 'daywise' && (
              <Alert type="success" className="mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    <span className="hidden sm:inline">Day-wise performance data loaded successfully. Showing {dayWiseData.length} days of data.</span>
                    <span className="sm:hidden">Day-wise data • {dayWiseData.length} days</span>
                  </span>
                </div>
              </Alert>
            )}

            {viewMode === 'overall' && metrics && (
              <Card className="p-4 md:p-6">
                {renderMetrics(metrics)}
              </Card>
            )}

            {viewMode === 'daywise' && dayWiseData.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                {dayWiseData.map((dayData, index) => (
                  <Card key={dayData.date} className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        <span className="hidden sm:inline">
                          {new Date(dayData.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="sm:hidden">
                          {new Date(dayData.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </h3>
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        Day {dayData.metrics.days_till_now}
                      </span>
                    </div>
                    {renderMetrics(dayData.metrics)}
                  </Card>
                ))}
              </div>
            )}

            {viewMode === 'daywise' && dayWiseData.length === 0 && !loading && (
              <Alert type="info" className="mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>No day-wise data available for the selected filters.</span>
                </div>
              </Alert>
            )}
          </>
        )}
      </div>
      
      {/* Telecaller Wise Data Table */}
      <Card className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <div>
            <Heading level={2} className="text-xl font-semibold text-gray-900 dark:text-white">
              Telecaller Wise Data
            </Heading>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total {telecallerWiseData.length} items.
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadTelecallerCSV}
            disabled={downloadingCSV || telecallerDataLoading}
            loading={downloadingCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">
              {downloadingCSV ? 'Downloading...' : 'Download'}
            </span>
            {/* <span className="sm:hidden">CSV</span> */}
          </Button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 my-1">
          Total <strong>{telecallerWiseData.length}</strong> items.
        </div>

        {/* Error Alert */}
        {telecallerDataError && (
          <div className="mb-4">
            <Alert type="error">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Error:</strong> {telecallerDataError}
                </div>
                <Button
                  size="sm"
                  onClick={() => fetchTelecallerWiseData()}
                  className="ml-4"
                >
                  Retry
                </Button>
              </div>
            </Alert>
          </div>
        )}

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {telecallerDataLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading telecaller data...</p>
            </div>
          ) : telecallerWiseData.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No telecaller data found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <Table striped bordered hover>
              <TableHeader className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
                <TableRow>
                  <TableHead className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300">#</TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('caller_name')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Caller Name</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'caller_name' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'caller_name' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('number_of_dials')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Number of Dials</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'number_of_dials' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'number_of_dials' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('ivr_duration')}
                  >
                    <div className="flex items-center justify-between">
                      <span>IVR Duration</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'ivr_duration' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'ivr_duration' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('talk_duration')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Talk Duration</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'talk_duration' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'talk_duration' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('caller_did_not_pick')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Caller Did Not Pick</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'caller_did_not_pick' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'caller_did_not_pick' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('number_does_not_exist')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Number Does Not Exist</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'number_does_not_exist' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'number_does_not_exist' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('respondent_picked_call')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Respondent Picked Call</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'respondent_picked_call' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'respondent_picked_call' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('picked_and_refused')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Picked and Refused</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'picked_and_refused' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'picked_and_refused' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('number_exhausted')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Number Exhausted</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'number_exhausted' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'number_exhausted' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('successful_interviews')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Successful Interviews</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'successful_interviews' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'successful_interviews' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('rejected_interviews')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Rejected Interviews</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'rejected_interviews' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'rejected_interviews' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('incomplete_interviews')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Incomplete Interviews</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'incomplete_interviews' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'incomplete_interviews' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('number_picked_the_call')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Number: Picked The Call</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'number_picked_the_call' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'number_picked_the_call' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap bg-white dark:bg-gray-800 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort('number_does_not_working')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Number: Does Not Working</span>
                      <div className="flex flex-col">
                        <span className={`text-xs ${sortConfig.key === 'number_does_not_working' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}>▲</span>
                        <span className={`text-xs ${sortConfig.key === 'number_does_not_working' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}>▼</span>
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedData().map((item, index) => (
                  <TableRow key={item.telecaller_id}>
                    <TableCell>
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {item.caller_name || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.number_of_dials?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ivr_duration || '00:00:00'}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.talk_duration || '00:00:00'}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.caller_did_not_pick?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.number_does_not_exist?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.respondent_picked_call?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.picked_and_refused?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.number_exhausted?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400 font-semibold">
                      {item.successful_interviews?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-400 font-semibold">
                      {item.rejected_interviews?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right text-amber-600 dark:text-amber-400 font-semibold">
                      {item.incomplete_interviews?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.number_picked_the_call?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.number_does_not_working?.toLocaleString() || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

      </Card>
    </FluidContainer>
  );
};

export default TelecallerProgressPage;
