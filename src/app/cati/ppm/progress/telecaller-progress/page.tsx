'use client';

import React, { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Calendar, BarChart3, Phone, Clock, Users, TrendingUp, TrendingDown, Activity, Filter, Search, Download, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import TelecallerList from '@/components/telecaller/TelecallerList';
import { Table } from '@/components/ui/Table';
import TelecallerMetrics from '@/components/telecaller/TelecallerMetrics';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Text from '@/components/ui/Text';

// Interface for performance metrics
interface PerformanceMetrics {
  number_status: {
    call_not_received_to_telecaller: number;
    ringing: number;
    not_ringing: number;
  };
  call_not_ring_status: {
    switch_off: number;
    number_not_reachable: number;
    number_does_not_exist: number;
    call_not_ring_no_response: number;
  };
  call_ring_status: {
    picked: number;
    did_not_picked: number;
    call_ring_no_response: number;
  };
  call_status: {
    continue: number;
    refuse_to_respond: number;
    call_back_later: number;
  };
  caller_performance: {
    total_callers: number;
    number_of_dials_attempted: number;
    number_of_calls_connected: number;
    total_talk_duration: string;
  };
  interview_metrics: {
    successful: number;
    terminated: number;
    incompleted: number;
    ineligible: number;
  };
  status_metrics: {
    tele_no_response: number;
    partial_system: number;
    partial_tele: number;
    submitted: number;
  };
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

// Telecalling Group interface
interface TelecallingGroup {
  id: number;
  name: string;
}

// Telecaller Summary Data interface
interface TelecallerWiseData {
  caller_id: number;
  caller_name: string;
  caller_mobile_no: string;
  telecalling_group_name?: string;
  number_of_dials: number;
  number_of_calls_connected: number;
  talk_duration: string;
  call_not_received_to_telecaller: number;
  ringing: number;
  not_ringing: number;
  switch_off: number;
  number_not_reachable: number;
  number_does_not_exist: number;
  picked: number;
  did_not_picked: number;
  continue: number;
  refuse_to_respond: number;
  call_back_later: number;
  successful: number;
  terminated: number;
  incompleted: number;
  ineligible: number;
  less_than_180_sec: number;
  greater_than_180_sec: number;
  pass?: number;
  under_qc?: number;
  qc_rejected?: number;
  short_interview?: number;
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

  // Telecalling Group filter states
  interface TelecallingGroup {
    id: number;
    name: string;
  }
  const [telecallingGroups, setTelecallingGroups] = useState<TelecallingGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

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
    telecallerStatus: '1',
    telecallingGroupId: '',
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
  const [metricsTrigger, setMetricsTrigger] = useState<number>(0);

  // Table sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TelecallerWiseData | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Use refs to prevent multiple calls
  const isFetchingTelecallerData = useRef(false);
  const hasInitializedTelecallerData = useRef(false);

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

  const telecallingGroupOptions = [
    { value: '', label: 'All Groups' },
    ...telecallingGroups
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((group) => ({
        value: group.id.toString(),
        label: group.name,
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

  const telecallerStatusOptions = [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
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
    // Reset to first page when searching
    setTelecallerDataPagination(prev => ({ ...prev, page: 1 }));
    // Trigger API calls with current filters
    if (viewMode === 'overall') {
      // For overall view, trigger the TelecallerMetrics component to fetch
      setMetricsTrigger((t) => t + 1);
    } else {
      fetchDayWiseData();
    }
    fetchTelecallerWiseData(1); // Fetch first page when filtering
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

      // Telecaller status filter
      if (filters.telecallerStatus && filters.telecallerStatus !== '') {
        params.append('status', filters.telecallerStatus);
      }

      // Telecalling group filter
      if (filters.telecallingGroupId && filters.telecallingGroupId !== '') {
        params.append('telecalling_group_id', filters.telecallingGroupId);
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

      const url = `${apiUrl}/api/cati/telecaller-metrics${params.toString() ? `?${params.toString()}` : ''}`;

      // Debug log for API calls
      console.log('Telecaller Metrics API URL:', url);
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

      if (filters.telecallerStatus && filters.telecallerStatus !== '') {
        params.append('status', filters.telecallerStatus);
      }

      if (filters.telecallingGroupId && filters.telecallingGroupId !== '') {
        params.append('telecalling_group_id', filters.telecallingGroupId);
      }

      // Date filter - handle custom dates and predefined ranges (day-wise API also uses start_date/end_date)
      const dateRange = getDateRangeForPerformanceAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
      Object.entries(dateRange).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      params.append('days', '7'); // Default to 7 days

      const url = `${apiUrl}/api/cati/telecaller-metrics/daywise${params.toString() ? `?${params.toString()}` : ''}`;

      // Debug log for day-wise API calls
      console.log('Day-wise Telecaller Metrics API URL:', url);
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

  // Fetch telecalling groups
  const fetchTelecallingGroups = async () => {
    setLoadingGroups(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiUrl}/api/teleform-users/telecalling-groups`, {
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
        if (response.ok && result.success && Array.isArray(result.data)) {
          const groups: TelecallingGroup[] = result.data.map((item: any) => ({
            id: item.telecalling_group_id || item.id,
            name: item.telecalling_group_name || item.name || `Group ${item.telecalling_group_id || item.id}`,
          }));
          setTelecallingGroups(groups);
        }
      }
    } catch (err) {
      console.error('Error fetching telecalling groups:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Fetch telecaller-wise data - fetch only current page
  const fetchTelecallerWiseData = async (page: number = telecallerDataPagination.page) => {
    // Prevent multiple simultaneous calls
    if (isFetchingTelecallerData.current) {
      return;
    }

    isFetchingTelecallerData.current = true;
    setTelecallerDataLoading(true);
    setTelecallerDataError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setTelecallerDataError('Authentication token not found');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const limit = 20; // Set limit to 20 as requested

      // Build query parameters for current page
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add status filter (default to active)
      if (filters.telecallerStatus && filters.telecallerStatus !== '') {
        params.append('status', filters.telecallerStatus);
      } else {
        params.append('status', '1'); // Default to active
      }

      // Add filters (only if they have values)
      if (filters.acCode && filters.acCode !== '') {
        params.append('ac_code', filters.acCode);
      }

      if (filters.telecaller && filters.telecaller !== '') {
        params.append('teleform_user_id', filters.telecaller);
      }

      if (filters.telecallingGroupId && filters.telecallingGroupId !== '') {
        params.append('telecalling_group_id', filters.telecallingGroupId);
      }

      // Date filter - handle custom dates and predefined ranges
      const dateRange = getDateRangeForPerformanceAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
      Object.entries(dateRange).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = `${apiUrl}/api/cati/telecaller-summary?${params.toString()}`;

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

      if (result.success && result.data) {
        const pageData = Array.isArray(result.data) ? result.data : [];
        setTelecallerWiseData(pageData);

        // Update pagination from API response
        if (result.pagination) {
          setTelecallerDataPagination({
            page: result.pagination.page || page,
            limit: result.pagination.limit || limit,
            total: result.pagination.total || 0,
            totalPages: result.pagination.totalPages || 1,
          });
        }
      } else {
        throw new Error(result.message || 'Failed to fetch telecaller summary data');
      }
    } catch (err) {
      console.error('Error fetching telecaller-wise data:', err);
      setTelecallerDataError(err instanceof Error ? err.message : 'Failed to fetch telecaller-wise data');
    } finally {
      setTelecallerDataLoading(false);
      isFetchingTelecallerData.current = false;
    }
  };

  // Handle page change for telecaller data
  const handleTelecallerDataPageChange = (newPage: number) => {
    fetchTelecallerWiseData(newPage);
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

  // Get sorted data (no client-side pagination needed, API handles it)
  const getDisplayData = () => {
    return getSortedData();
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
        limit: '1000', // API maximum limit
      });

      // Add filters (only if they have values)
      if (filters.acCode && filters.acCode !== '') {
        params.append('ac_code', filters.acCode);
      }

      if (filters.telecaller && filters.telecaller !== '') {
        params.append('teleform_user_id', filters.telecaller);
      }

      if (filters.telecallerStatus && filters.telecallerStatus !== '') {
        params.append('status', filters.telecallerStatus);
      }

      if (filters.telecallingGroupId && filters.telecallingGroupId !== '') {
        params.append('telecalling_group_id', filters.telecallingGroupId);
      }

      // Date filter - handle custom dates and predefined ranges (CSV download uses date_from/date_to)
      const dateRange = getDateRangeForPerformanceAPI(filters.callingDates, filters.customDateFrom, filters.customDateTo);
      Object.entries(dateRange).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = `${apiUrl}/api/cati/telecaller-summary?${params.toString()}`;

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

      if (result.success && result.data) {
        const data = Array.isArray(result.data) ? result.data : [];

        // Convert to CSV
        const headers = [
          'S.No',
          'Caller ID',
          'Caller Name',
          'Caller Mobile No.',
          'Group',
          'Number of Dials',
          'Completed',
          'Successful',
          'Under QC',
          'Rejected',
          'Number of Calls Connected',
          'Form Duration',
          'Call Not Received to Telecaller',
          'Ringing',
          'Not Ringing',
          'No response by Telecaller (Number Status)',
          'Switch Off',
          'Number Not Reachable',
          'Number Does Not Exist',
          'No response by Telecaller (Call Not Ring)',
          'Picked',
          'Did Not Picked',
          'No response by Telecaller (Call Ring)',
          'Continue',
          'Refuse to Respond',
          'Call Back Later',
          'No response by Telecaller (Call Status)',
          'Completed',
          'Terminated',
          'Incompleted',
          'Ineligible',
          'Short Interview',
        ];

        const csvRows = [
          headers.join(','),
          ...data.map((item: TelecallerWiseData, index: number) => [
            index + 1,
            item.caller_id || '-',
            `"${item.caller_name || '-'}"`,
            `"${item.caller_mobile_no || '-'}"`,
            `"${item.telecalling_group_name || '-'}"`,
            item.number_of_dials || 0,
            item.successful || 0,
            item.pass || 0,
            item.under_qc || 0,
            item.qc_rejected || 0,
            item.number_of_calls_connected || 0,
            `"${item.talk_duration || '00:00:00'}"`,
            item.call_not_received_to_telecaller || 0,
            item.ringing || 0,
            item.not_ringing || 0,
            Math.max(0, (item.number_of_dials || 0) - (item.ringing || 0) - (item.not_ringing || 0) - (item.call_not_received_to_telecaller || 0)),
            item.switch_off || 0,
            item.number_not_reachable || 0,
            item.number_does_not_exist || 0,
            Math.max(0, (item.not_ringing || 0) - (item.switch_off || 0) - (item.number_not_reachable || 0) - (item.number_does_not_exist || 0)),
            item.picked || 0,
            item.did_not_picked || 0,
            Math.max(0, (item.ringing || 0) - (item.picked || 0) - (item.did_not_picked || 0)),
            item.continue || 0,
            item.refuse_to_respond || 0,
            item.call_back_later || 0,
            Math.max(0, (item.picked || 0) - (item.continue || 0) - (item.refuse_to_respond || 0) - (item.call_back_later || 0)),
            item.successful || 0,
            item.terminated || 0,
            item.incompleted || 0,
            item.ineligible || 0,
            item.short_interview || 0
          ].join(','))
        ];

        const csvContent = csvRows.join('\n');

        // Generate filename with current date
        const today = new Date().toISOString().split('T')[0];
        const filename = `Telecaller_Summary_Data_${today}.csv`;

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
    fetchTelecallingGroups();
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitializedTelecallerData.current) {
      return;
    }

    hasInitializedTelecallerData.current = true;

    if (viewMode === 'overall') {
      // Trigger initial metrics load once on mount
      setMetricsTrigger((t) => (t === 0 ? 1 : t));
    } else {
      fetchDayWiseData();
    }
    // Fetch telecaller-wise data (first page only)
    fetchTelecallerWiseData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - filters are applied via "Search" button

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

  const renderMetrics = (data: PerformanceMetrics | null) => {
    // Helper function to safely get value or show placeholder
    const getValue = (value: any) => {
      if (value === null || value === undefined) return '—';
      return value;
    };

    return (
      <>
        {/* Caller Performance Section */}
        <div className="mb-8">
          <SectionHeader title="CALLER PERFORMANCE" icon={<Activity className="h-6 w-6 text-blue-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Total Callers"
              value={getValue(data?.caller_performance?.total_callers)}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              color="border-blue-500"
              bgColor="bg-blue-500"
            />
            <MetricCard
              title="Number of Dials Attempted"
              value={getValue(data?.caller_performance?.number_of_dials_attempted)}
              icon={<Phone className="h-6 w-6 text-orange-600" />}
              color="border-orange-500"
              bgColor="bg-orange-500"
            />
            <MetricCard
              title="Number of Calls Connected"
              value={getValue(data?.caller_performance?.number_of_calls_connected)}
              icon={<Phone className="h-6 w-6 text-indigo-600" />}
              color="border-indigo-500"
              bgColor="bg-indigo-500"
            />
            <MetricCard
              title="Total Form Duration"
              value={data?.caller_performance?.total_talk_duration ? formatDuration(data.caller_performance.total_talk_duration) : '—'}
              icon={<Clock className="h-6 w-6 text-emerald-600" />}
              color="border-emerald-500"
              bgColor="bg-emerald-500"
            />
          </div>
        </div>

        {/* Number Status Section */}
        <div className="mb-8">
          <SectionHeader title="NUMBER OF DIALS ATTEMPTED METRICS" icon={<BarChart3 className="h-6 w-6 text-blue-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Call Not Received to Telecaller"
              value={getValue(data?.number_status?.call_not_received_to_telecaller)}
              icon={<Phone className="h-6 w-6 text-gray-500" />}
              color="border-gray-400"
              bgColor="bg-gray-400"
            />
            <MetricCard
              title="Ringing"
              value={getValue(data?.number_status?.ringing)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="Not Ringing"
              value={getValue(data?.number_status?.not_ringing)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.caller_performance?.number_of_dials_attempted || 0) - (data?.number_status?.ringing || 0) - (data?.number_status?.not_ringing || 0) - (data?.number_status?.call_not_received_to_telecaller || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Call Not Ring Status Section */}
        <div className="mb-8">
          <SectionHeader title="NOT RINGING METRICS" icon={<TrendingDown className="h-6 w-6 text-red-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Switch Off"
              value={getValue(data?.call_not_ring_status?.switch_off)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="Number Not Reachable"
              value={getValue(data?.call_not_ring_status?.number_not_reachable)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="Number Does Not Exist"
              value={getValue(data?.call_not_ring_status?.number_does_not_exist)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.number_status?.not_ringing || 0) - (data?.call_not_ring_status?.switch_off || 0) - (data?.call_not_ring_status?.number_not_reachable || 0) - (data?.call_not_ring_status?.number_does_not_exist || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Call Ring Status Section */}
        <div className="mb-8">
          <SectionHeader title="RINGING METRICS" icon={<TrendingUp className="h-6 w-6 text-green-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <MetricCard
              title="Number of Calls Connected"
              value={getValue(data?.call_ring_status?.picked)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="Number of Calls Not Connected"
              value={getValue(data?.call_ring_status?.did_not_picked)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.number_status?.ringing || 0) - (data?.call_ring_status?.picked || 0) - (data?.call_ring_status?.did_not_picked || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Call Status Section */}
        <div className="mb-8">
          <SectionHeader title="NUMBER OF CALLS CONNECTED METRICS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Call Continue"
              value={getValue(data?.call_status?.continue)}
              icon={<Phone className="h-6 w-6 text-blue-600" />}
              color="border-blue-500"
              bgColor="bg-blue-500"
            />
            <MetricCard
              title="Refuse to Respond"
              value={getValue(data?.call_status?.refuse_to_respond)}
              icon={<Phone className="h-6 w-6 text-amber-600" />}
              color="border-amber-500"
              bgColor="bg-amber-500"
            />
            <MetricCard
              title="Call Back Later"
              value={getValue(data?.call_status?.call_back_later)}
              icon={<Clock className="h-6 w-6 text-teal-600" />}
              color="border-teal-500"
              bgColor="bg-teal-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.call_ring_status?.picked || 0) - (data?.call_status?.continue || 0) - (data?.call_status?.refuse_to_respond || 0) - (data?.call_status?.call_back_later || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Interview Metrics Section */}
        <div className="mb-8">
          <SectionHeader title="CALL CONTINUE METRICS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Completed"
              value={getValue(data?.interview_metrics?.successful)}
              icon={<TrendingUp className="h-6 w-6 text-cyan-600" />}
              color="border-cyan-500"
              bgColor="bg-cyan-500"
            />
            <MetricCard
              title="Terminated"
              value={getValue(data?.interview_metrics?.terminated)}
              icon={<TrendingDown className="h-6 w-6 text-fuchsia-600" />}
              color="border-fuchsia-500"
              bgColor="bg-fuchsia-500"
            />
            <MetricCard
              title="Incompleted"
              value={getValue(data?.interview_metrics?.incompleted)}
              icon={<TrendingDown className="h-6 w-6 text-sky-600" />}
              color="border-sky-500"
              bgColor="bg-sky-500"
            />
            <MetricCard
              title="Ineligible"
              value={getValue(data?.interview_metrics?.ineligible)}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          {/* Header Section - Responsive */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Title Section */}
            <div className="flex-1">
              <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
                Telecaller Progress
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

            {/* Telecalling Group */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group
              </label>
              <SelectDropdown
                value={filters.telecallingGroupId}
                onChange={(value) => handleFilterChange('telecallingGroupId', value)}
                options={telecallingGroupOptions}
                placeholder="Select Group"
                searchable={true}
                clearable={true}
                maxHeight={300}
              />
            </div>

            {/* Telecaller Status */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telecaller Status
              </label>
              <SelectDropdown
                value={filters.telecallerStatus}
                onChange={(value) => handleFilterChange('telecallerStatus', value)}
                options={telecallerStatusOptions}
                placeholder="Select Status"
                searchable={false}
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

        {/* Content - Always show cards even on error */}
        {!loading && (
          <>
            {/* Success Message */}
            {!error && dayWiseData.length > 0 && viewMode === 'daywise' && (
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

            {/* Overall View - Show cards even on error */}
            {viewMode === 'overall' && (
              <TelecallerMetrics
                filters={{
                  telecaller: filters.telecaller,
                  acCode: filters.acCode,
                  callingDates: filters.callingDates,
                  customDateFrom: filters.customDateFrom,
                  customDateTo: filters.customDateTo,
                  telecallerStatus: filters.telecallerStatus,
                  telecallingGroupId: filters.telecallingGroupId,
                }}
                trigger={metricsTrigger}
              />
            )}

            {/* Day-wise View */}
            {viewMode === 'daywise' && !error && dayWiseData.length > 0 && (
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
                        {/* Day {dayData.metrics.days_till_now} */}
                      </span>
                    </div>
                    {renderMetrics(dayData.metrics)}
                  </Card>
                ))}
              </div>
            )}

            {/* Show empty cards in day-wise view when no data */}
            {viewMode === 'daywise' && (error || dayWiseData.length === 0) && (
              <Card className="p-4 md:p-6">
                {renderMetrics(null)}
              </Card>
            )}
          </>
        )}
      </div>

      {/* Telecaller Summary Table */}
      <Card className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Telecaller Summary
              </Heading>
            </div>
          </div>

          {/* Download Button */}
          <Button
            variant="primary"
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

        <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
          Total <strong>{telecallerDataPagination.total}</strong> items.
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

        <div className="overflow-x-auto">
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
            <div className="table-responsive">
              <Table className="table table-bordered table-striped table-hover">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">S.No</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Caller Id</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-left">Caller Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Caller Mobile No.</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center w-32 min-w-[120px]">Group</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center bg-blue-500 text-white">Number of Dials</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center bg-cyan-500 text-white"> Completed</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center bg-green-500 text-white">Successful</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center bg-yellow-500 text-white">Under QC</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center bg-red-500 text-white">Rejected</th>
                    {/* <th className="px-4 py-3 font-semibold text-gray-700 text-center">Short Interview</th> */}
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Caller Performance: Number of Calls Connected</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Caller Performance: Form Duration</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Dials Attempted: Call Not Received to Telecaller</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Dials Attempted: Ringing</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Dials Attempted: Not Ringing</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Dials Attempted: No Response by Telecaller</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Not Ringing: Switch Off</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Not Ringing: Number Not Reachable</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Not Ringing: Number Does Not Exist</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Not Ringing: No Response by Telecaller</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Ringing: Number of Calls Connected</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Ringing: Number of Calls Not Connected</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Ringing: No Response by Telecaller</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Calls Connected: Call Continue</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Calls Connected: Refuse to Respond</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Calls Connected: Call Back Later</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Number of Calls Connected: No Response by Telecaller</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Call Continue: Completed</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Call Continue: Terminated</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Call Continue: Incompleted</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Call Continue: Ineligible</th>
                    {/* <th className="px-4 py-3 font-semibold text-gray-700 text-center">Less Than 180 (Sec)</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Greater Than 180 (Sec)</th> */}
                  </tr>
                </thead>
                <tbody>
                  {getDisplayData().map((item, index) => (
                    <tr key={item.caller_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {(telecallerDataPagination.page - 1) * telecallerDataPagination.limit + index + 1}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.caller_id || '-'}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-left">
                        {item.caller_name || '-'}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">
                        {item.caller_mobile_no || '-'}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center w-32 min-w-[120px]">
                        {item.telecalling_group_name || '-'}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.number_of_dials?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-blue-600 dark:text-blue-400">
                        {item.number_of_calls_connected?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-cyan-600 dark:text-cyan-400">
                        {item.successful?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-green-600 dark:text-green-400">
                        {item.pass?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-yellow-600 dark:text-yellow-400">
                        {item.under_qc?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-red-600 dark:text-red-400">
                        {item.qc_rejected?.toLocaleString() || 0}
                      </td>
                      {/* <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-orange-600 dark:text-orange-400">
                            {item.short_interview?.toLocaleString() || 0}
                          </td> */}
                      <td className="px-4 py-3 border-b border-gray-200 text-center">
                        {item.talk_duration || '00:00:00'}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.call_not_received_to_telecaller?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.ringing?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.not_ringing?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {Math.max(0, (item.number_of_dials || 0) - (item.ringing || 0) - (item.not_ringing || 0) - (item.call_not_received_to_telecaller || 0)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.switch_off?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.number_not_reachable?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.number_does_not_exist?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {Math.max(0, (item.not_ringing || 0) - (item.switch_off || 0) - (item.number_not_reachable || 0) - (item.number_does_not_exist || 0)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.picked?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.did_not_picked?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {Math.max(0, (item.ringing || 0) - (item.picked || 0) - (item.did_not_picked || 0)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.continue?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.refuse_to_respond?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.call_back_later?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {Math.max(0, (item.picked || 0) - (item.continue || 0) - (item.refuse_to_respond || 0) - (item.call_back_later || 0)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-green-600 dark:text-green-400">
                        {item.successful?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-red-600 dark:text-red-400">
                        {item.terminated?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center text-amber-600 dark:text-amber-400">
                        {item.incompleted?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {item.ineligible?.toLocaleString() || 0}
                      </td>
                      {/* <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                            {item.less_than_180_sec?.toLocaleString() || 0}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                            {item.greater_than_180_sec?.toLocaleString() || 0}
                          </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {telecallerDataPagination.totalPages > 0 && (
          <div className="mt-4">
            <PaginationStandard
              currentPage={telecallerDataPagination.page}
              totalItems={telecallerDataPagination.total}
              totalPages={telecallerDataPagination.totalPages}
              itemsPerPage={telecallerDataPagination.limit}
              onPageChange={handleTelecallerDataPageChange}
            />
          </div>
        )}

      </Card>
    </Container>
  );
};

export default TelecallerProgressPage;

