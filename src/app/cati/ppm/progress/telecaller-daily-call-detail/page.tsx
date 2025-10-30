'use client';

import React, { useState, useEffect } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Alert from '@/components/ui/Alert';
import { Search, Users, Clock, PhoneCall, PhoneOff, CheckCircle, Play, Volume2 } from 'lucide-react';
import TelecallerMetrics from '@/components/telecaller/TelecallerMetrics';

// Interfaces
interface SearchFilters {
  reportDays: string;
  customDate: string;
  customDateEnd: string;
  telecaller: string;
  callerResponse: string;
  apiResponse: string;
  callReceived: string;
  talkDurationOver2: boolean;
}

interface CallDetailData {
  id: number;
  caller_id: number;
  caller_name: string;
  phone: string;
  ac_code: number;
  call_time: string | null;
  call_received: number;
  ivr_duration: number | null;
  talk_duration: number | null;
  form_duration: number | null;
  status: number;
  audio: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PerformanceMetrics {
  totalCallers: number;
  daysTillNow: number;
  numberOfDials: number;
  totalIvrDuration: string;
  callerDidNotPick: number;
  totalTalkDuration: string;
  totalFormDuration: string;
}

interface CallOutcomeMetrics {
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  respondentPickedCall: number;
  pickedAndRefused: number;
  totalNumberExhausted: number;
  pickedAndCallContinue: number;
  completedInterview: number;
  terminatedInterview: number;
  incompleteInterview: number;
  ineligibleInterview: number;
}

interface Telecaller {
  teleform_user_id: number;
  name: string;
  mobile_number: string;
}

interface ACData {
  ac_code: number;
  ac_name: string;
}

interface DashboardFilters {
  telecaller: string;
  acCode: string;
  callingDates: string;
  fromDate: string;
  toDate: string;
  duration: string;
}

const TelecallerDailyCallDetailPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    reportDays: 'today',
    customDate: '',
    customDateEnd: '',
    telecaller: '',
    callerResponse: '',
    apiResponse: '',
    callReceived: '',
    talkDurationOver2: false,
  });

  // State for performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalCallers: 0,
    daysTillNow: 0,
    numberOfDials: 0,
    totalIvrDuration: '00:00:00',
    callerDidNotPick: 0,
    totalTalkDuration: '00:00:00',
    totalFormDuration: '00:00:00',
  });

  const [callOutcomeMetrics, setCallOutcomeMetrics] = useState<CallOutcomeMetrics>({
    numberDoesNotExist: 0,
    respondentDidNotPick: 0,
    respondentPickedCall: 0,
    pickedAndRefused: 0,
    totalNumberExhausted: 0,
    pickedAndCallContinue: 0,
    completedInterview: 0,
    terminatedInterview: 0,
    incompleteInterview: 0,
    ineligibleInterview: 0,
  });

  const [metricsLoading, setMetricsLoading] = useState(true);

  // Dashboard filters state
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilters>({
    telecaller: '',
    acCode: '',
    callingDates: 'today',
    fromDate: '',
    toDate: '',
    duration: '',
  });

  // Telecaller and AC list states
  const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
  const [acList, setAcList] = useState<ACData[]>([]);
  const [loadingTelecallers, setLoadingTelecallers] = useState(false);
  const [loadingACs, setLoadingACs] = useState(false);

  // API state for call details
  const [callDetailData, setCallDetailData] = useState<CallDetailData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CallDetailData | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Options for dropdowns
  const reportDaysOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'dby', label: 'Day Before Yesterday' },
    { value: 'l3', label: 'Last 3 Days' },
    { value: 'l7', label: 'Last 7 Days' },
    { value: 'l15', label: 'Last 15 Days' },
    { value: 'currentmonth', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date' },
  ];

  const callerResponseOptions = [
    { value: '', label: 'Select Caller Response' },
    { value: '1', label: 'Picked and Call Continue' },
    { value: '2', label: 'Number does not exist' },
    { value: '3', label: 'Respondent did not pick' },
    { value: '4', label: 'Picked and Refused' },
    { value: '10', label: 'Form Not Fill' },
  ];

  const apiResponseOptions = [
    { value: '', label: 'Select API Response' },
    { value: '3', label: 'Both Answered (Respondent Picked the call)' },
    { value: '4', label: 'To Ans. - From Unans. (Respondent did not pick)' },
    { value: '7', label: 'From Unanswered (Caller did not pick)' },
  ];

  const callReceivedOptions = [
    { value: '', label: 'Select Call Received' },
    { value: '2', label: 'No' },
    { value: '1', label: 'Yes' },
  ];

  // Generate date options
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Date' }];
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const label = dateString;
      options.push({ value: dateString, label });
    }
    
    return options;
  };

  const dateOptions = generateDateOptions();

  // Dashboard filter dropdown options
  const telecallerOptions = [
    { value: '', label: 'All Telecallers' },
    ...telecallers
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((tc) => ({
        value: tc.teleform_user_id.toString(),
        label: `${tc.name} (${tc.mobile_number})`,
      })),
  ];

  const acCodeOptions = [
    { value: '', label: 'All ACs' },
    ...acList
      .sort((a, b) => a.ac_name.localeCompare(b.ac_name))
      .map((ac) => ({
        value: ac.ac_code.toString(),
        label: `${ac.ac_name} - (${ac.ac_code})`,
      })),
  ];

  const durationOptions = [
    { value: '', label: 'All Duration' },
    { value: '180', label: '180 seconds' },
  ];

  const callingDatesOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'dby', label: 'Day Before Yesterday' },
    { value: 'l3', label: 'Last 3 Days' },
    { value: 'l7', label: 'Last 7 Days' },
    { value: 'l15', label: 'Last 15 Days' },
    { value: 'currentmonth', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date Range' },
  ];

  // Helper function to convert calling dates option to start_date and end_date
  const getDateRangeForAPI = (callingDates: string, fromDate?: string, toDate?: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (callingDates) {
      case 'all':
        return { start_date: '', end_date: '' };
      case 'today':
        return { start_date: todayStr, end_date: todayStr };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        return { start_date: yesterdayStr, end_date: yesterdayStr };
      case 'dby':
        const dby = new Date(today);
        dby.setDate(dby.getDate() - 2);
        const dbyStr = dby.toISOString().split('T')[0];
        return { start_date: dbyStr, end_date: dbyStr };
      case 'l3':
        const l3Start = new Date(today);
        l3Start.setDate(l3Start.getDate() - 2);
        return { start_date: l3Start.toISOString().split('T')[0], end_date: todayStr };
      case 'l7':
        const l7Start = new Date(today);
        l7Start.setDate(l7Start.getDate() - 6);
        return { start_date: l7Start.toISOString().split('T')[0], end_date: todayStr };
      case 'l15':
        const l15Start = new Date(today);
        l15Start.setDate(l15Start.getDate() - 14);
        return { start_date: l15Start.toISOString().split('T')[0], end_date: todayStr };
      case 'currentmonth':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start_date: monthStart.toISOString().split('T')[0], end_date: todayStr };
      case 'custom':
        return { start_date: fromDate || '', end_date: toDate || '' };
      default:
        return { start_date: '', end_date: '' };
    }
  };

  // Handlers
  const handleFilterChange = (field: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDashboardFilterChange = (field: keyof DashboardFilters, value: string | string[]) => {
    const newValue = Array.isArray(value) ? value[0] || '' : value;
    setDashboardFilters(prev => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    fetchCallDetails(1);
  };

  const handleDashboardSearch = () => {
    console.log('Dashboard filters:', dashboardFilters);
    fetchDashboardMetrics();
    fetchCallDetails(1); // Also refresh call details table with filters
  };

  // Fetch dashboard metrics from API
  const fetchDashboardMetrics = async () => {
    try {
      setMetricsLoading(true);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Authentication token not found');
        setMetricsLoading(false);
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with filters
      const params = new URLSearchParams();
      
      if (dashboardFilters.telecaller && dashboardFilters.telecaller !== '') {
        params.append('teleform_user_id', dashboardFilters.telecaller);
      }
      
      if (dashboardFilters.acCode && dashboardFilters.acCode !== '') {
        params.append('ac_code', dashboardFilters.acCode);
      }
      
      // Convert calling dates to start_date and end_date
      const dateRange = getDateRangeForAPI(dashboardFilters.callingDates, dashboardFilters.fromDate, dashboardFilters.toDate);
      if (dateRange.start_date && dateRange.end_date) {
        params.append('start_date', dateRange.start_date);
        params.append('end_date', dateRange.end_date);
      }
      
      if (dashboardFilters.duration && dashboardFilters.duration !== '') {
        params.append('duration', dashboardFilters.duration);
      }
      
      const url = `${apiBaseUrl}/api/cati/dashboard${params.toString() ? `?${params.toString()}` : ''}`;
      
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
        // Update performance metrics
        setPerformanceMetrics({
          totalCallers: result.data.total_callers || 0,
          daysTillNow: result.data.days_till_now || 0,
          numberOfDials: result.data.number_of_dials || 0,
          totalIvrDuration: result.data.total_ivr_duration || '00:00:00',
          callerDidNotPick: result.data.caller_did_not_pick || 0,
          totalTalkDuration: result.data.total_talk_duration || '00:00:00',
          totalFormDuration: result.data.total_form_duration || '00:00:00',
        });

        // Update call outcome metrics
        setCallOutcomeMetrics({
          numberDoesNotExist: result.data.number_does_not_exist || 0,
          respondentDidNotPick: result.data.respondent_did_not_pick || 0,
          respondentPickedCall: result.data.respondent_picked_call || 0,
          pickedAndRefused: result.data.picked_and_refused || 0,
          totalNumberExhausted: result.data.total_number_exhausted || 0,
          pickedAndCallContinue: result.data.picked_and_call_continue || 0,
          completedInterview: result.data.completed_interview || 0,
          terminatedInterview: result.data.terminated_interview || 0,
          incompleteInterview: result.data.incomplete_interview || 0,
          ineligibleInterview: result.data.ineligible_interview || 0,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard metrics');
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Fetch call details from API
  const fetchCallDetails = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with filters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      // Apply filters from dashboardFilters
      if (dashboardFilters.telecaller && dashboardFilters.telecaller !== '') {
        params.append('teleform_user_id', dashboardFilters.telecaller);
      }
      
      if (dashboardFilters.acCode && dashboardFilters.acCode !== '') {
        params.append('ac_code', dashboardFilters.acCode);
      }
      
      // Convert calling dates to start_date and end_date
      const dateRange = getDateRangeForAPI(dashboardFilters.callingDates, dashboardFilters.fromDate, dashboardFilters.toDate);
      if (dateRange.start_date && dateRange.end_date) {
        params.append('start_date', dateRange.start_date);
        params.append('end_date', dateRange.end_date);
      }
      
      if (dashboardFilters.duration && dashboardFilters.duration !== '') {
        params.append('duration', dashboardFilters.duration);
      }
      
      // Apply additional filters from the search form (if uncommented later)
      if (filters.callReceived && filters.callReceived !== '') {
        params.append('call_received', filters.callReceived);
      }
      
      const url = `${apiBaseUrl}/api/cati/interviews/call-details?${params.toString()}`;
      
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
        setCallDetailData(result.data.data || []);
        setPagination(result.data.pagination || pagination);
      } else {
        throw new Error(result.message || 'Failed to fetch call details');
      }
    } catch (err) {
      console.error('Error fetching call details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch call details');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCallDetails(newPage);
  };

  const handlePlayAudio = (audioUrl: string) => {
    setCurrentAudio(audioUrl);
    setShowAudioModal(true);
    setAudioError(false);
    setUseIframe(false);
  };

  const handleCloseAudioModal = () => {
    setShowAudioModal(false);
    setCurrentAudio(null);
    setAudioError(false);
    setUseIframe(false);
  };

  const handleAudioError = () => {
    console.error('Audio playback error, switching to iframe');
    setAudioError(true);
    setUseIframe(true);
  };

  const handleIframeError = () => {
    console.error('Iframe audio playback error');
    setAudioError(true);
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '-';
    try {
      // Parse the UTC time and format it without timezone conversion
      const date = new Date(dateTime);
      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC' // Force UTC timezone to prevent conversion
      });
    } catch {
      return '-';
    }
  };

  const getStatusText = (status: number) => {
    const statusMap: { [key: number]: string } = {
      0: 'Default',
      1: 'Call Initiate',
      2: 'Completed',
      3: 'Incomplete',
      4: 'Incomplete',
      5: 'Ineligible',
      6: 'Terminated',
      7: 'Terminated'
    };
    return statusMap[status] || 'Unknown';
  };

  const handleSort = (key: keyof CallDetailData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return callDetailData;

    return [...callDetailData].sort((a, b) => {
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

  useEffect(() => {
    fetchTelecallers();
    fetchACList();
    fetchDashboardMetrics();
    fetchCallDetails(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    bgColor = 'bg-blue-500',
    iconColor = 'text-white'
  }: {
    icon: any;
    title: string;
    value: string | number;
    bgColor?: string;
    iconColor?: string;
  }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Daily Call Detail
        </Heading>
        <div className="text-sm text-gray-500">
          {/* Additional header content if needed */}
        </div>
      </div>

      {/* Dashboard Filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap items-end gap-4">
          {/* Telecaller Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telecaller
            </label>
            <SelectDropdown
              value={dashboardFilters.telecaller}
              onChange={(value) => handleDashboardFilterChange('telecaller', value)}
              options={telecallerOptions}
              placeholder="Select Telecaller"
              searchable={true}
              clearable={true}
              maxHeight={300}
            />
          </div>

          {/* AC Code Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AC Name
            </label>
            <SelectDropdown
              value={dashboardFilters.acCode}
              onChange={(value) => handleDashboardFilterChange('acCode', value)}
              options={acCodeOptions}
              placeholder="Select AC"
              searchable={true}
              clearable={true}
              maxHeight={300}
            />
          </div>

          {/* Calling Dates Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calling Dates
            </label>
            <SelectDropdown
              value={dashboardFilters.callingDates}
              onChange={(value) => handleDashboardFilterChange('callingDates', value)}
              options={callingDatesOptions}
              placeholder="Select Date Range"
              searchable={false}
              clearable={true}
              maxHeight={300}
            />
          </div>

          {/* From Date - Only show when Custom Date Range is selected */}
          {dashboardFilters.callingDates === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={dashboardFilters.fromDate}
                onChange={(e) => handleDashboardFilterChange('fromDate', e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
          )}

          {/* To Date - Only show when Custom Date Range is selected */}
          {dashboardFilters.callingDates === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={dashboardFilters.toDate}
                onChange={(e) => handleDashboardFilterChange('toDate', e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
          )}

          {/* Duration Filter */}
          {/* <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <SelectDropdown
              value={dashboardFilters.duration}
              onChange={(value) => handleDashboardFilterChange('duration', value)}
              options={durationOptions}
              placeholder="Select Duration"
              searchable={false}
              clearable={true}
              maxHeight={300}
            />
          </div> */}

          {/* View Button */}
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleDashboardSearch}
              className="flex items-center"
              disabled={metricsLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              {metricsLoading ? 'Loading...' : 'View'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Filters */}
      {/* <Card className="p-6 mb-5">
        <div className="flex flex-wrap items-end gap-4">
      
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Days
            </label>
            <SelectDropdown
              value={filters.reportDays}
              onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
              options={reportDaysOptions}
              placeholder="Select Report Days"
            />
          </div>

          {filters.reportDays === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <SelectDropdown
                value={filters.customDate}
                onChange={(value) => handleFilterChange('customDate', Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

    
          {filters.reportDays === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <SelectDropdown
                value={filters.customDateEnd}
                onChange={(value) => handleFilterChange('customDateEnd', Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

    
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telecaller
            </label>
            <SelectDropdown
              value={filters.telecaller}
              onChange={(value) => handleFilterChange('telecaller', Array.isArray(value) ? value[0] : value)}
              options={telecallerOptions}
              placeholder="Select Telecaller"
            />
          </div>

       
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caller Response
            </label>
            <SelectDropdown
              value={filters.callerResponse}
              onChange={(value) => handleFilterChange('callerResponse', Array.isArray(value) ? value[0] : value)}
              options={callerResponseOptions}
              placeholder="Select Caller Response"
            />
          </div>

       
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Response
            </label>
            <SelectDropdown
              value={filters.apiResponse}
              onChange={(value) => handleFilterChange('apiResponse', Array.isArray(value) ? value[0] : value)}
              options={apiResponseOptions}
              placeholder="Select API Response"
            />
          </div>

      
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Received
            </label>
            <SelectDropdown
              value={filters.callReceived}
              onChange={(value) => handleFilterChange('callReceived', Array.isArray(value) ? value[0] : value)}
              options={callReceivedOptions}
              placeholder="Select Call Received"
            />
          </div>

      
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talk Duration (&gt;=2 Min)
            </label>
            <div className="mt-2">
              <Checkbox
                checked={filters.talkDurationOver2}
                onCheckedChange={(checked) => handleFilterChange('talkDurationOver2', checked)}
                label="Talk Duration"
              />
            </div>
          </div>

     
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </Card> */}

      {/* Telecaller Progress Metrics */}
      <TelecallerMetrics
        filters={{
          telecaller: dashboardFilters.telecaller,
          acCode: dashboardFilters.acCode,
          callingDates: dashboardFilters.callingDates,
          customDateFrom: dashboardFilters.fromDate,
          customDateTo: dashboardFilters.toDate,
        }}
      />
      {/* Error Alert */}
      {error && (
        <div className="mb-4">
          <Alert type="error">
            <div className="flex items-center justify-between">
              <div>
                <strong>Error:</strong> {error}
              </div>
              <Button
                size="sm"
                onClick={() => fetchCallDetails(pagination.page)}
                className="ml-4"
              >
                <i className="fa fa-refresh mr-2"></i>
                Retry
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Data Table */}
      <Card className="mt-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Call Detail
            </Heading>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
          Total <strong>{pagination.total}</strong> items.
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <i className="fa fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Loading call details...</p>
            </div>
          ) : callDetailData.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa fa-inbox text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">No call details found</p>
            </div>
          ) : (
                <div className="table-responsive">
                  <Table className="table table-bordered table-striped table-hover">
                    <thead className="sticky-header bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">S.No</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">Caller Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Caller ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Call Time</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">IVR Duration</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Talk Duration</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Form Duration</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Audio File</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Form Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedData().map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                            {(pagination.page - 1) * pagination.limit + index + 1}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">
                            {item.caller_name || '-'}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                            {item.caller_id || '-'}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {formatDateTime(item.call_time)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {formatDuration(item.ivr_duration)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {formatDuration(item.talk_duration)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {formatDuration(item.form_duration)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {item.audio ? (
                              <div className="relative group">
                                <Button
                                  size="sm"
                                  onClick={() => handlePlayAudio(item.audio!)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </Button>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                  Play
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {getStatusText(item.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.total > 0 && (
          <div className="mt-4 px-4 pb-4">
            <PaginationStandard
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* Audio Modal */}
      {showAudioModal && currentAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Heading level={4} className="text-lg sm:text-xl">
                <i className="fa fa-headphones mr-2 text-blue-600"></i>
                Audio Player
              </Heading>
              <button
                onClick={handleCloseAudioModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Audio Player */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
                <div className="mb-3 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {useIframe ? 'Using alternative player' : 'Click play to start the audio'}
                  </p>
                  {audioError && !useIframe && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Audio player had an issue. Try the alternative options below.
                    </p>
                  )}
                </div>

                {!useIframe ? (
                  currentAudio ? (
                    <audio
                      controls
                      className="w-full"
                      controlsList="nodownload"
                      preload="metadata"
                      onError={handleAudioError}
                      onLoadStart={() => console.log('Audio loading started')}
                      onCanPlay={() => console.log('Audio can play')}
                    >
                      <source src={currentAudio} type="audio/mpeg" />
                      <source src={currentAudio} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No audio file available for this call.
                    </div>
                  )
                ) : (
                  currentAudio ? (
                    <div className="w-full">
                      <iframe
                        src={currentAudio}
                        className="w-full h-16 border-0 rounded"
                        title="Audio Player"
                        allow="autoplay"
                        onError={handleAudioError}
                        onLoad={() => {
                          // Check if iframe content is just text (not audio player)
                          setTimeout(() => {
                            try {
                              const iframe = document.querySelector('iframe[title="Audio Player"]') as HTMLIFrameElement;
                              if (iframe && iframe.contentDocument) {
                                const bodyText = iframe.contentDocument.body?.textContent?.trim();
                                if (bodyText && bodyText.includes('recording for v2 is working fine')) {
                                  console.warn('Iframe returned text instead of audio player');
                                  setAudioError(true);
                                }
                              }
                            } catch (e) {
                              // Cross-origin restrictions, can't access iframe content
                              console.log('Cannot access iframe content due to CORS');
                            }
                          }, 1000);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No audio file available for this call.
                    </div>
                  )
                )}

                {/* Error Message for Failed Audio */}
                {audioError && (
                  <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mt-4">
                    <div className="text-center">
                      <div className="text-red-600 dark:text-red-400 mb-2">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold">Audio Playback Failed</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          The audio URL is not serving playable content. The server returned: "recording for v2 is working fine."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Alternative Options */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                  {!useIframe && audioError && (
                    <button
                      onClick={() => setUseIframe(true)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Try Alternative Player
                    </button>
                  )}
                  <a
                    href={currentAudio}
                    download
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                    style={{ display: currentAudio ? 'inline' : 'none' }}
                  >
                    Download audio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </FluidContainer>
  );
};

export default TelecallerDailyCallDetailPage;
