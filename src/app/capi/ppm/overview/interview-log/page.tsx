'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Volume2, MapPin, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import AudioPlayerModal from '@/components/modals/AudioPlayerModal';

// TypeScript interfaces for API response
interface InterviewData {
  server_id: number;
  server_time: string;
  server_date: string;
  user_id: number;
  form_id: number;
  agency_id: number;
  agency_name: string | null;
  interviewer_id: string;
  supervisor_id: string;
  interview_date: string;
  device_id: string;
  collect_device_id: string;
  start_time: string;
  end_time: string;
  total_duration: number | null;
  ac_code: number;
  ac_name: string;
  district_name: string;
  pc_name: string;
  ps_code: string;
  ps_name: string;
  respondent_name: string;
  mobile_no: string | null;
  gender: number | null;
  gender_label: string;
  age: number | null;
  religion: number | null;
  social_category: number | null;
  locality_type: number;
  gps: string;
  gps_accuracy: string;
  photo_ps: string | null;
  photo_selfie: string | null;
  status: number;
  status_label: string;
  status_reason_reject: number | null;
  audio_qc: number;
  audio_qc_label: string;
  audio_qc_status: number;
  audio_qc_status_label: string;
  audio_qc_id: string | null;
  audio1_status: number;
  audio1_status_label: string;
  qc_recheck_status_audio: number | null;
  qc_recheck_status_audio_label: string;
  tele_qc: number;
  tele_qc_status: number;
  tele_qc_id: string | null;
  gps_qc_status: number;
  qc_outcome: string;
  qc_id: string | null;
  sample_type: number;
  weight: string;
  over_achievement: number;
  created_at: number;
  updated_at: number;
  gps_available: boolean;
  ps_image_available: boolean;
  selfie_image_available: boolean;
  audio_playback_available: boolean;
  audio1: string;
}

// Display data interface for transformed data
interface DisplayInterviewData {
  server_id: string;
  interview_date: string;
  sample_type: string;
  ac_code: number;
  ac_name: string;
  ps_name: string;
  device_id: string;
  interviewer_id: string;
  audio_qc_label: string;
  audio_qc_id: string;
  audio1_status_label: string;
  qc_outcome: string;
  status_label: string;
  gender_label: string;
  gps_available: boolean;
  ps_image_available: boolean;
  selfie_image_available: boolean;
  audio_playback_available: boolean;
  audio1: string;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

interface APIResponse {
  success: boolean;
  data: {
    interviews: InterviewData[];
    pagination: PaginationData;
    filters_applied: Record<string, any>;
    sorting: {
      field: string;
      direction: string;
    };
    message: string;
  };
  message: string;
  timestamp: string;
}

const InterviewLogPage = () => {
  const [filters, setFilters] = useState({
    agency_id: '',
    server_id: '',
    interview_date: '',
    ac_code: '',
    ps_code: '',
    user_id: '',
    interviewer_id: '',
    device_id: '',
    mobile_no: '',
    audio_qc: [] as string[],
    audio_qc_status: [] as string[],
    audio_qc_status_detailed: [] as string[],
    audio_re_qc_status: [] as string[],
    status: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // API state management
  const [interviewData, setInterviewData] = useState<DisplayInterviewData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // API state management
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Agencies dropdown state
  const [agencies, setAgencies] = useState<{ value: string; label: string }[]>([]);
  const [agenciesLoading, setAgenciesLoading] = useState(false);

  // AC dropdown state
  const [acList, setAcList] = useState<{ value: string; label: string }[]>([]);
  const [acLoading, setAcLoading] = useState(false);

  // Interviewer dropdown state
  const [interviewers, setInterviewers] = useState<{ value: string; label: string }[]>([]);
  const [interviewersLoading, setInterviewersLoading] = useState(false);

  // Users dropdown state
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Polling stations dropdown state
  const [pollingStations, setPollingStations] = useState<{ value: string; label: string }[]>([]);
  const [pollingStationsLoading, setPollingStationsLoading] = useState(false);

  // Audio modal state
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<string>('');

  // Fetch polling stations from API based on selected AC code
  const fetchPollingStations = async (acCode?: string) => {
    try {
      setPollingStationsLoading(true);
      
      // If no AC code is provided, clear the polling stations
      if (!acCode) {
        setPollingStations([{ value: '', label: 'Select Polling Station' }]);
        setPollingStationsLoading(false);
        return;
      }
      
      console.log('🔍 Fetching polling stations for AC code:', acCode);
      
      const response = await apiClient.get(`/dropdown/polling-stations?ac_code=${acCode}`);
      console.log('📊 Polling Stations API Response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        // Transform the API response to dropdown format
        const pollingStationData = Object.entries(response.data.data).map(([id, name]) => ({
          value: id,
          label: name as string,
        }));
        
        // Add the default "Select Polling Station" option
        const pollingStationsWithDefault = [
          { value: '', label: 'Select Polling Station' },
          ...pollingStationData,
        ];
        
        setPollingStations(pollingStationsWithDefault);
        console.log('✅ Polling stations loaded successfully for AC', acCode, ':', pollingStationsWithDefault);
      } else {
        console.error('❌ Invalid polling stations API response:', response.data);
        setPollingStations([{ value: '', label: 'Select Polling Station' }]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching polling stations:', err);
      setPollingStations([{ value: '', label: 'Select Polling Station' }]);
    } finally {
      setPollingStationsLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      console.log('🔍 Fetching users from API...');
      
      const response = await apiClient.get('/dropdown/users');
      console.log('📊 Users API Response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        // Transform the API response to dropdown format
        const userData = Object.entries(response.data.data).map(([id, name]) => ({
          value: id,
          label: String(name),
        }));
        
        // Add the default "Select Enumerator ID" option
        const usersWithDefault = [
          { value: '', label: 'Select Enumerator ID' },
          ...userData,
        ];
        
        setUsers(usersWithDefault);
        console.log('✅ Users loaded successfully:', usersWithDefault);
      } else {
        console.error('❌ Invalid users API response:', response.data);
        setUsers([{ value: '', label: 'Select Enumerator ID' }]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setUsers([{ value: '', label: 'Select Enumerator ID' }]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch interviewers from API
  const fetchInterviewers = async () => {
    try {
      setInterviewersLoading(true);
      console.log('🔍 Fetching interviewers from API...');
      
      const response = await apiClient.get('/dropdown/interviewers');
      console.log('📊 Interviewers API Response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        // Transform the API response to dropdown format
        const interviewerData = Object.entries(response.data.data)
          .filter(([id, name]) => id !== '') // Filter out empty ID
          .map(([id, name]) => ({
            value: id,
            label: name as string,
          }));
        
        // Add the default "Select Interviewer ID" option
        const interviewersWithDefault = [
          { value: '', label: 'Select Interviewer ID' },
          ...interviewerData,
        ];
        
        setInterviewers(interviewersWithDefault);
        console.log('✅ Interviewers loaded successfully:', interviewersWithDefault);
      } else {
        console.error('❌ Invalid interviewers API response:', response.data);
        setInterviewers([{ value: '', label: 'Select Interviewer ID' }]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching interviewers:', err);
      setInterviewers([{ value: '', label: 'Select Interviewer ID' }]);
    } finally {
      setInterviewersLoading(false);
    }
  };

  // Fetch AC list from API
  const fetchAcList = async () => {
    try {
      setAcLoading(true);
      console.log('🔍 Fetching AC list from API...');
      
      const response = await apiClient.get('/dropdown/ac-list');
      console.log('📊 AC List API Response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        // Transform the API response to dropdown format
        const acData = Object.entries(response.data.data).map(([id, name]) => ({
          value: id,
          label: `${name} (${id})`,
        }));
        
        // Add the default "Select AC" option
        const acWithDefault = [
          { value: '', label: 'Select AC' },
          ...acData,
        ];
        
        setAcList(acWithDefault);
        console.log('✅ AC list loaded successfully:', acWithDefault);
      } else {
        console.error('❌ Invalid AC list API response:', response.data);
        setAcList([{ value: '', label: 'Select AC' }]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching AC list:', err);
      setAcList([{ value: '', label: 'Select AC' }]);
    } finally {
      setAcLoading(false);
    }
  };

  // Fetch agencies from API
  const fetchAgencies = async () => {
    try {
      setAgenciesLoading(true);
      console.log('🔍 Fetching agencies from API...');
      
      const response = await apiClient.get('/dropdown/agencies');
      console.log('📊 Agencies API Response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        // Transform the API response to dropdown format
        const agenciesData = Object.entries(response.data.data).map(([id, name]) => ({
          value: id,
          label: name as string,
        }));
        
        // Add the default "Select State Teams" option
        const agenciesWithDefault = [
          { value: '', label: 'Select State Teams' },
          ...agenciesData,
        ];
        
        setAgencies(agenciesWithDefault);
        console.log('✅ Agencies loaded successfully:', agenciesWithDefault);
      } else {
        console.error('❌ Invalid agencies API response:', response.data);
        setAgencies([{ value: '', label: 'Select State Teams' }]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching agencies:', err);
      setAgencies([{ value: '', label: 'Select State Teams' }]);
    } finally {
      setAgenciesLoading(false);
    }
  };

  // Fetch interview logs from API
  const fetchInterviewLogs = async () => {
    try {
      setLoading(true);
      setApiError(null);

      // Debug: Check API configuration
      const token = localStorage.getItem('accessToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      console.log('🔧 API Configuration:', {
        baseUrl: apiBaseUrl,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
      });

      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      
      if (filters.agency_id) queryParams.append('agency_id', filters.agency_id);
      if (filters.server_id) queryParams.append('server_id', filters.server_id);
      if (filters.interview_date) queryParams.append('interview_date', filters.interview_date);
      if (filters.ac_code) queryParams.append('ac_code', filters.ac_code);
      if (filters.ps_code) queryParams.append('ps_code', filters.ps_code);
      if (filters.user_id) queryParams.append('user_id', filters.user_id);
      if (filters.interviewer_id) queryParams.append('interviewer_id', filters.interviewer_id);
      if (filters.device_id) queryParams.append('device_id', filters.device_id);
      if (filters.mobile_no) queryParams.append('mobile_no', filters.mobile_no);
      if (filters.audio_qc.length > 0) queryParams.append('audio_qc', filters.audio_qc.join(','));
      if (filters.audio_qc_status.length > 0) queryParams.append('audio_qc_status', filters.audio_qc_status.join(','));
      if (filters.audio_qc_status_detailed.length > 0) queryParams.append('audio_qc_status_detailed', filters.audio_qc_status_detailed.join(','));
      if (filters.audio_re_qc_status.length > 0) queryParams.append('audio_re_qc_status', filters.audio_re_qc_status.join(','));
      if (filters.status.length > 0) queryParams.append('status', filters.status.join(','));
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('per_page', pageSize.toString());

      console.log('🔍 Making API request to:', `/overview/interview-log?${queryParams.toString()}`);
      
      const response = await apiClient.get(`/overview/interview-log?${queryParams.toString()}`);
      console.log('📊 API Response:', response);
      
      const data: APIResponse = response.data;
      
      if (data.success && data.data.interviews) {
        const transformedData = transformAPIData(data.data.interviews);
        setInterviewData(transformedData);
        // Use the actual count from pagination, or 0 if no data
        const actualCount = transformedData.length > 0 ? data.data.pagination.total_count : 0;
        setTotalCount(actualCount);
        setTotalPages(data.data.pagination.total_pages);
        setError(null);
      } else {
        console.error('API did not return interview data:', data);
        setInterviewData([]);
        setTotalCount(0);
        setTotalPages(0);
        setError('No data received from API');
      }
    } catch (err: any) {
      console.error('❌ Error fetching interview logs:', err);
      
      // Check if it's a JSON parsing error
      if (err.message?.includes('Unexpected token') || err.message?.includes('<!DOCTYPE')) {
        console.error('🚨 JSON Parsing Error - Server returned HTML instead of JSON');
        console.error('Response data:', err.response?.data);
        setApiError('Server returned HTML instead of JSON. Please check authentication and API endpoint.');
      } else if (err.response?.status === 401) {
        console.error('🔐 Authentication Error - Token may be expired');
        setApiError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 404) {
        console.error('🔍 Not Found Error - API endpoint not found');
        setApiError('API endpoint not found. Please check the server configuration.');
      } else {
        console.error('🌐 Network/API Error:', err.response?.data || err.message);
        setApiError(`Failed to load interview data: ${err.response?.data?.message || err.message}`);
      }
      
      // Set empty data when API fails
      setInterviewData([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for dropdowns (other dropdowns remain hardcoded for now)


  // Format date to YYYY-MM-DD format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch {
      return dateString; // Return as-is if parsing fails
    }
  };

  // Transform API data to match UI expectations
  const transformAPIData = (apiData: InterviewData[]): DisplayInterviewData[] => {
    return apiData.map(item => ({
      server_id: item.server_id.toString(),
      interview_date: formatDate(item.server_date), // Use server_date instead of interview_date
      sample_type: getSampleTypeLabel(item.sample_type),
      ac_code: item.ac_code,
      ac_name: item.ac_name,
      ps_name: item.ps_name,
      device_id: item.device_id,
      interviewer_id: item.interviewer_id || '',
      audio_qc_label: item.audio_qc_status_label,
      audio_qc_id: item.audio_qc_id || '',
      audio1_status_label: item.audio1_status_label || '',
      qc_outcome: item.qc_outcome,
      status_label: item.status_label,
      gender_label: item.gender_label,
      gps_available: item.gps_available,
      ps_image_available: item.ps_image_available,
      selfie_image_available: item.selfie_image_available,
      audio_playback_available: item.audio_playback_available,
      audio1: item.audio1 || '',
    }));
  };

  // Helper function to convert sample type number to label
  const getSampleTypeLabel = (sampleType: number): string => {
    switch (sampleType) {
      case 1: return 'Sample';
      case 2: return 'Booster';
      default: return 'Unknown';
    }
  };

  // Load data on component mount and when pagination changes
  useEffect(() => {
    fetchInterviewLogs();
  }, [currentPage, pageSize]);

  // Load agencies, AC list, interviewers, and users on component mount
  useEffect(() => {
    fetchAgencies();
    fetchAcList();
    fetchInterviewers();
    fetchUsers();
  }, []);

  // Fetch polling stations when AC code changes
  useEffect(() => {
    fetchPollingStations(filters.ac_code);
    // Reset polling station selection when AC changes
    if (filters.ps_code) {
      setFilters(prev => ({ ...prev, ps_code: '' }));
    }
  }, [filters.ac_code]);

  // Debounced filter update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInterviewLogs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const getQcOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'Fail':
        return <Badge variant="error" size="sm">Fail</Badge>;
      case 'Pass':
        return <Badge variant="success" size="sm">Pass</Badge>;
      case 'Pending':
        return <Badge variant="secondary" size="sm">Pending</Badge>;
      default:
        return <Badge variant="outline" size="sm">{outcome}</Badge>;
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value),
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePlayAudio = (serverId: string, audioFile: string) => {
    setSelectedServerId(serverId);
    setSelectedAudioFile(audioFile);
    setAudioModalOpen(true);
  };

  const handleCloseAudioModal = () => {
    setAudioModalOpen(false);
    setSelectedServerId('');
    setSelectedAudioFile('');
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className=" text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Interview Log
      </Heading>

      <div className="w-full max-w-9xl mx-auto p-0 main-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2">
          <Card className="sticky top-4">
            <Heading level={4} className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </Heading>
            <div className="space-y-4">
              {/* State Teams */}
              <div>
                <Text className="text-sm font-medium mb-2">State Teams</Text>
                <SelectDropdown
                  options={agencies}
                  value={filters.agency_id}
                  onChange={(value) => handleFilterChange('agency_id', value)}
                  placeholder={agenciesLoading ? "Loading teams..." : "Select State Teams"}
                  disabled={agenciesLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>

              {/* Server ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Server ID</Text>
                <Input
                  type="text"
                  placeholder="Search by Server ID"
                  value={filters.server_id}
                  onChange={(e) => handleFilterChange('server_id', e.target.value)}
                />
              </div>

              {/* Interview Date */}
              <div>
                <Text className="text-sm font-medium mb-2">Interview Date</Text>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Interview Date' },
                    { value: '2025-06-17', label: '2025-06-17' },
                    { value: '2025-06-15', label: '2025-06-15' },
                    { value: '2025-06-14', label: '2025-06-14' },
                    { value: '2025-06-13', label: '2025-06-13' },
                    { value: '2025-06-12', label: '2025-06-12' },
                  ]}
                  value={filters.interview_date}
                  onChange={(value) => handleFilterChange('interview_date', value)}
                  placeholder="Search or select date"
                  searchable={true}
                  clearable={true}
                />
              </div>

              {/* AC Code */}
              <div>
                <Text className="text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  options={acList}
                  value={filters.ac_code}
                  onChange={(value) => handleFilterChange('ac_code', value)}
                  placeholder={acLoading ? "Loading AC list..." : "Search or select AC"}
                  searchable={true}
                  clearable={true}
                  disabled={acLoading}
                />
              </div>

              {/* Poling Station */}
              <div>
                <Text className="text-sm font-medium mb-2">Poling Station</Text>
                <SelectDropdown
                  options={pollingStations}
                  value={filters.ps_code}
                  onChange={(value) => handleFilterChange('ps_code', value)}
                  placeholder={
                    pollingStationsLoading 
                      ? "Loading polling stations..." 
                      : !filters.ac_code 
                        ? "Select AC first" 
                        : "Search or select polling station"
                  }
                  searchable={true}
                  clearable={true}
                  disabled={pollingStationsLoading || !filters.ac_code}
                />
              </div>

              {/* Enumerator ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Enumerator ID</Text>
                <SelectDropdown
                  options={users}
                  value={filters.user_id}
                  onChange={(value) => handleFilterChange('user_id', value)}
                  placeholder={usersLoading ? "Loading enumerators..." : "Search or select enumerator ID"}
                  searchable={true}
                  clearable={true}
                  disabled={usersLoading}
                />
              </div>

              {/* Interviewer ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  options={interviewers}
                  value={filters.interviewer_id}
                  onChange={(value) => handleFilterChange('interviewer_id', value)}
                  placeholder={interviewersLoading ? "Loading interviewers..." : "Search or select interviewer ID"}
                  searchable={true}
                  clearable={true}
                  disabled={interviewersLoading}
                />
              </div>

              {/* Device ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Device ID</Text>
                <Input
                  type="text"
                  placeholder="Search by Device ID"
                  value={filters.device_id}
                  onChange={(e) => handleFilterChange('device_id', e.target.value)}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <Text className="text-sm font-medium mb-2">Mobile Number</Text>
                <Input
                  type="text"
                  placeholder="Search by Respondent Mobile"
                  value={filters.mobile_no}
                  onChange={(e) => handleFilterChange('mobile_no', e.target.value)}
                />
              </div>

              {/* Audio QC */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC</Text>
                <div className="space-y-3">
                  {[
                    { value: '0', label: 'NA' },
                    { value: '1', label: 'Pending' },
                    { value: '2', label: 'Completed' },
                  ].map(option => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`audio_qc_${option.value}`}
                        checked={filters.audio_qc.includes(option.value)}
                        onChange={(e) => 
                          handleCheckboxChange('audio_qc', option.value, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer flex-shrink-0 mt-0.5"
                      />
                      <label 
                        htmlFor={`audio_qc_${option.value}`} 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-5"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio QC Status */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC Status</Text>
                <div className="space-y-3">
                  {[
                    { value: '0', label: 'NA' },
                    { value: '1', label: 'Pass' },
                    { value: '2', label: 'Fail' },
                    { value: '3', label: 'Pending' },
                  ].map(option => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`audio_qc_status_${option.value}`}
                        checked={filters.audio_qc_status.includes(option.value)}
                        onChange={(e) => 
                          handleCheckboxChange('audio_qc_status', option.value, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer flex-shrink-0 mt-0.5"
                      />
                      <label 
                        htmlFor={`audio_qc_status_${option.value}`} 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-5"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio QC Status (Detailed) */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC Status (Detailed)</Text>
                <div className="space-y-3">
                  {[
                    { value: '1', label: 'Survey Conversation can be heard' },
                    { value: '2', label: 'No Conversation' },
                    { value: '3', label: 'Irrelevant Conversation' },
                    { value: '4', label: 'Can hear the interviewer more than the respondent' },
                    { value: '5', label: 'The interviewer is asking questions mechanically' },
                    { value: '6', label: 'Interviewer acting as respondent' },
                  ].map(option => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`audio_qc_${option.value}`}
                        checked={filters.audio_qc_status_detailed.includes(option.value)}
                        onChange={(e) => 
                          handleCheckboxChange('audio_qc_status_detailed', option.value, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer flex-shrink-0 mt-0.5"
                      />
                      <label 
                        htmlFor={`audio_qc_${option.value}`} 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-5"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Re-QC */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio Re-QC</Text>
                <div className="space-y-3">
                  {[
                    { value: '0', label: 'NA' },
                    { value: '1', label: 'Pass' },
                    { value: '2', label: 'Fail' },
                    { value: '3', label: 'Pending' },
                  ].map(option => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`audio_re_qc_${option.value}`}
                        checked={filters.audio_re_qc_status.includes(option.value)}
                        onChange={(e) => 
                          handleCheckboxChange('audio_re_qc_status', option.value, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer flex-shrink-0 mt-0.5"
                      />
                      <label 
                        htmlFor={`audio_re_qc_${option.value}`} 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-5"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Text className="text-sm font-medium mb-2">Status</Text>
                <div className="space-y-3">
                  {[
                    { value: '0', label: 'Terminated' },
                    { value: '10', label: 'Valid' },
                    { value: '20', label: 'Rejected' },
                    { value: '40', label: 'Under QC' },
                    { value: '60', label: 'QC Completed' },
                    { value: '70', label: 'Under Re-QC' },
                    { value: '80', label: 'Re-QC Completed' },
                  ].map(option => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`status_${option.value}`}
                        checked={filters.status.includes(option.value)}
                        onChange={(e) => 
                          handleCheckboxChange('status', option.value, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer flex-shrink-0 mt-0.5"
                      />
                      <label 
                        htmlFor={`status_${option.value}`} 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer leading-5"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-10">
          <Card>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Details
              </Heading>
                </div>
                {/* <Button variant="outline" className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600">
                <i className="fa fa-download"></i>
                Download
              </Button> */}
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <Text className="ml-2 text-gray-600">Loading interview data...</Text>
              </div>
            )}

            {/* Error State */}
            {/* {(error || apiError) && !loading && (
              <div className="flex flex-col items-center py-8 bg-red-50 rounded-lg mb-4">
                <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.822-.833-2.592 0L4.27 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <Text className="text-red-700 font-medium mb-2">Error Loading Data</Text>
                <Text className="text-red-600 text-sm mb-4 text-center">
                  {error || apiError}
                </Text>
                <Button 
                  variant="outline" 
                  onClick={fetchInterviewLogs}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            )} */}
            
            {!loading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <Text className="text-sm text-gray-600">
                      Total <strong>{totalCount.toLocaleString()}</strong> items.
                  </Text>
                </div>
                
                <div className="overflow-x-auto">
                  <Table striped bordered hover className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center w-16">S.No</TableHead>
                        <TableHead className="w-32">Server ID</TableHead>
                        <TableHead className="w-32">Interview Date</TableHead>
                        <TableHead className="w-24">Sample Type</TableHead>
                        <TableHead className="w-48">AC Name</TableHead>
                        <TableHead className="w-64">PS Name</TableHead>
                        <TableHead className="w-40">Device ID</TableHead>
                        <TableHead className="w-32">Interview ID</TableHead>
                        <TableHead className="w-24">Audio QC</TableHead>
                        <TableHead className="w-32">QC User ID</TableHead>
                        <TableHead className="w-40">Audio Fail Reason</TableHead>
                        <TableHead className="text-center w-32">QC Outcome</TableHead>
                        <TableHead className="w-48">Status</TableHead>
                        <TableHead className="text-center w-20">Gender</TableHead>
                        <TableHead className="text-center w-24">Play Audio</TableHead>
                        <TableHead className="text-center w-24">GPS Map</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interviewData.map((interview, index) => (
                        <tr key={`interview-${interview.server_id}-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {((currentPage - 1) * pageSize) + index + 1}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <span className="font-mono text-sm font-medium text-blue-600">
                              {interview.server_id}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-sm">{interview.interview_date}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.sample_type}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.ac_name}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.ps_name}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.device_id}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.interviewer_id || '-'}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.audio_qc_label}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.audio_qc_id || '-'}</td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.audio1_status_label || '-'}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {getQcOutcomeBadge(interview.qc_outcome)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">{interview.status_label}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <span className={`font-medium ${interview.gender_label === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>
                              {interview.gender_label || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <div className="flex justify-center items-center">
                              <button 
                                className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 ${
                                  interview.audio_playback_available 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                title={interview.audio_playback_available ? "Play Audio" : "Audio Not Available"}
                                disabled={!interview.audio_playback_available}
                                onClick={() => interview.audio_playback_available && handlePlayAudio(interview.server_id, interview.audio1)}
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <div className="flex justify-center items-center">
                              <button 
                                className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 ${
                                  interview.gps_available 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                title={interview.gps_available ? "View GPS Map" : "GPS Not Available"}
                                disabled={!interview.gps_available}
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Empty State */}
                {interviewData.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Text className="text-gray-500 text-lg">
                      No interview data found.
                    </Text>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={handlePageChange}
                    className="justify-center"
                  />
                </div>
              </div>
            </div>
            )}
          </Card>
        </div>
        </div>
      </div>

      {/* Audio Player Modal */}
      <AudioPlayerModal
        isOpen={audioModalOpen}
        onClose={handleCloseAudioModal}
        serverId={selectedServerId}
        audioFileName={selectedAudioFile}
      />
    </Container>
  );
};

export default InterviewLogPage;
