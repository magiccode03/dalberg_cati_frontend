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
import { Volume2, MapPin, Image, User, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

// TypeScript interfaces for API response
interface InterviewData {
  server_id: number;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample data for dropdowns
  const agencyOptions = [
    { value: '', label: 'Select State Teams' },
    { value: '1', label: 'Kadence' },
    { value: '2', label: 'Chandan' },
    { value: '3', label: 'Rohit' },
    { value: '4', label: 'Parbhat' },
    { value: '5', label: 'Navin' },
    { value: '6', label: 'Aeon' },
    { value: '7', label: 'Abhinav' },
    { value: '8', label: 'Inhouse' },
  ];

  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Valmiki Nagar (1)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '10', label: 'Raxaul (10)' },
  ];

  // Sample data fallback for when API fails
  const sampleInterviewData = [
    {
      server_id: 302275,
      interview_date: '2025-06-17',
      sample_type: 'Sample',
      ac_code: 141,
      ac_name: 'Cheria Bariarpur (141)',
      ps_name: '111. Utkramit Madhya Vidyalaya,Shekha Tola',
      device_id: '9b565985d11c4d77',
      interviewer_id: '',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Terminated',
      gender_label: '',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: 301767,
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '935',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (N+W+RTA)',
      gender_label: 'Male',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: 301745,
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '935',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (Short Interview - 0 sec)',
      gender_label: 'Male',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: 301739,
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '721',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (Short Interview - 0 sec)',
      gender_label: 'Male',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: 301705,
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '935',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (N+W+RTA)',
      gender_label: 'Female',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
  ];

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
      ...item,
      // Convert numbers to strings for display
      server_id: item.server_id.toString(),
      interviewer_id: item.interviewer_id?.toString() || '',
      audio_qc_id: item.audio_qc_id || '',
      // Ensure date is in YYYY-MM-DD format
      interview_date: formatDate(item.interview_date),
    }));
  };

  // Fetch interview logs from API
  const fetchInterviewLogs = async () => {
    try {
      setLoading(true);
      setError(null);

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
        setInterviewData(transformAPIData(data.data.interviews));
        setTotalCount(data.data.pagination.total_count);
        setTotalPages(data.data.pagination.total_pages);
        setError(null);
      } else {
        console.error('API did not return interview data:', data);
        setInterviewData(transformAPIData(sampleInterviewData));
        setError('No data received from API, using sample data');
      }
    } catch (err: any) {
      console.error('❌ Error fetching interview logs:', err);
      
      // Check if it's a JSON parsing error
      if (err.message?.includes('Unexpected token') || err.message?.includes('<!DOCTYPE')) {
        console.error('🚨 JSON Parsing Error - Server returned HTML instead of JSON');
        console.error('Response data:', err.response?.data);
        setError('Server returned HTML instead of JSON. Please check authentication and API endpoint.');
      } else if (err.response?.status === 401) {
        console.error('🔐 Authentication Error - Token may be expired');
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 404) {
        console.error('🔍 Not Found Error - API endpoint not found');
        setError('API endpoint not found. Please check the server configuration.');
      } else {
        console.error('🌐 Network/API Error:', err.response?.data || err.message);
        setError(`Failed to load interview data: ${err.response?.data?.message || err.message}`);
      }
      
      // Use sample data as fallback
      setInterviewData(transformAPIData(sampleInterviewData));
      setTotalCount(108333);
      setTotalPages(25);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when pagination changes
  useEffect(() => {
    fetchInterviewLogs();
  }, [currentPage, pageSize]);

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

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
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
                  options={agencyOptions}
                  value={filters.agency_id}
                  onChange={(value) => handleFilterChange('agency_id', value)}
                  placeholder="Select State Teams"
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
                  placeholder="Select Interview Date"
                />
              </div>

              {/* AC Code */}
              <div>
                <Text className="text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  options={acOptions}
                  value={filters.ac_code}
                  onChange={(value) => handleFilterChange('ac_code', value)}
                  placeholder="Select AC"
                />
              </div>

              {/* Poling Station */}
              <div>
                <Text className="text-sm font-medium mb-2">Poling Station</Text>
                <SelectDropdown
                  options={[{ value: '', label: 'Select Poling Station' }]}
                  value={filters.ps_code}
                  onChange={(value) => handleFilterChange('ps_code', value)}
                  placeholder="Select Poling Station"
                />
              </div>

              {/* Enumerator ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Enumerator ID</Text>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Enumerator ID' },
                    { value: '1146', label: '1146' },
                    { value: '1147', label: '1147' },
                    { value: '1148', label: '1148' },
                    { value: '1149', label: '1149' },
                    { value: '1150', label: '1150' },
                  ]}
                  value={filters.user_id}
                  onChange={(value) => handleFilterChange('user_id', value)}
                  placeholder="Select Enumerator ID"
                />
              </div>

              {/* Interviewer ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Interviewer ID' },
                    { value: '1001', label: '1001' },
                    { value: '1002', label: '1002' },
                    { value: '1003', label: '1003' },
                    { value: '1004', label: '1004' },
                    { value: '101', label: '101' },
                  ]}
                  value={filters.interviewer_id}
                  onChange={(value) => handleFilterChange('interviewer_id', value)}
                  placeholder="Select Interviewer ID"
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
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Pending' },
                    { value: '2', label: 'Completed' },
                    { value: '0', label: 'NA' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audio_qc.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audio_qc', option.value, checked as boolean)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Audio QC Status */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC Status</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Pass' },
                    { value: '2', label: 'Fail' },
                    { value: '3', label: 'Pending' },
                    { value: '0', label: 'NA' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audio_qc_status.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audio_qc_status', option.value, checked as boolean)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Audio QC Status (Detailed) */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC Status (Detailed)</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Survey Conversation can be heard' },
                    { value: '2', label: 'No Conversation' },
                    { value: '3', label: 'Irrelevant Conversation' },
                    { value: '6', label: 'Interviewer acting as respondent' },
                    { value: '4', label: 'Can hear the interviewer more than the respondent' },
                    { value: '5', label: 'The interviewer is asking questions mechanically' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audio_qc_status_detailed.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audio_qc_status_detailed', option.value, checked as boolean)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Audio Re-QC */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio Re-QC</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Pass' },
                    { value: '2', label: 'Fail' },
                    { value: '3', label: 'Pending' },
                    { value: '0', label: 'NA' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audio_re_qc_status.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audio_re_qc_status', option.value, checked as boolean)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Text className="text-sm font-medium mb-2">Status</Text>
                <div className="space-y-2">
                  {[
                    { value: '40', label: 'Under QC' },
                    { value: '60', label: 'QC Completed' },
                    { value: '70', label: 'Under Re-QC' },
                    { value: '80', label: 'Re-QC Completed' },
                    { value: '10', label: 'Valid' },
                    { value: '20', label: 'Rejected' },
                    { value: '0', label: 'Terminated' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('status', option.value, checked as boolean)
                      }
                      label={option.label}
                    />
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
                <Button variant="outline" className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600">
                <i className="fa fa-download"></i>
                Download
              </Button>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <Text className="ml-2 text-gray-600">Loading interview data...</Text>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center py-8 bg-red-50 rounded-lg mb-4">
                <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.822-.833-2.592 0L4.27 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <Text className="text-red-700 font-medium mb-2">Error Loading Data</Text>
                <Text className="text-red-600 text-sm mb-4 text-center">
                  {error}
                </Text>
                <Button 
                  variant="outline" 
                  onClick={fetchInterviewLogs}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            )}
            
            {!loading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <Text className="text-sm text-gray-600">
                      Showing <strong>{((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)}</strong> of <strong>{totalCount.toLocaleString()}</strong> items.
                  </Text>
                </div>
                
                <div className="overflow-x-auto">
                  <Table className="table table-bordered table-striped table-hover">
                    <thead className="sticky-header bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">S.No</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Server ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">Interview Date</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">Sample Type</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">AC Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">PS Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Device ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Interviewer ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">Audio QC</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Audio QC ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">Audio Fail Reason</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">QC Outcome</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-left">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">PS Image</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Selfie Image</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Gender</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">Play Audio</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 text-center">GPS Map</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviewData.map((interview, index) => (
                        <tr key={`interview-${interview.server_id}-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                            {((currentPage - 1) * pageSize) + index + 1}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-center">
                            <span className="text-sm font-medium text-blue-600">
                              {interview.server_id}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-sm text-left">{interview.interview_date}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">{interview.sample_type}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">{interview.ac_name}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">{interview.ps_name}</td>
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-center">{interview.device_id}</td>
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-center">{interview.interviewer_id || '-'}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">{interview.audio_qc_label}</td>
                          <td className="px-4 py-3 border-b border-gray-200 font-mono text-center">{interview.audio_qc_id || '-'}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">{interview.audio1_status_label || '-'}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            {getQcOutcomeBadge(interview.qc_outcome)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-left">{interview.status_label}</td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <div className="flex justify-center items-center">
                              {interview.ps_image_available ? (
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <Image className="w-4 h-4 text-green-600" />
                                </div>
                              ) : (
                                <Image className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <div className="flex justify-center items-center">
                              {interview.selfie_image_available ? (
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-green-600" />
                                </div>
                              ) : (
                                <User className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
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
                    </tbody>
                  </Table>
                </div>
                
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
    </Container>
  );
};

export default InterviewLogPage;