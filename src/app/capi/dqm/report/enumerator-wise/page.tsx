'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface EnumeratorWiseData {
  id: number;
  enumeratorId: number;
  interviewDate: string;
  deviceId: string;
  interviewerIds: string;
  totalInterview: number;
  totalInterviewWithoutPhone: number;
  validInterview: number;
  invalidInterview: number;
  rejectInterview: number;
  rejectInterviewSystem: number;
  underQcInterview: number;
  qcUser: string;
  status: string;
  teleQc: string;
  audioQc: string;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: Array<{
      id: number;
      user_id: number;
      interview_date: string;
      device_id: string;
      interviewerids: string;
      total_interview: number;
      total_interview_without_phone: number;
      valid_interview: number;
      invalid_interview: number;
      reject_interview: number;
      reject_interview_system: number;
      underqc_interview: number;
      progress_phase: number;
      progressphase: string;
      teleqcstatus: string;
      audioqcstatus: string;
      qcuser: {
        qc_id: number;
        name: string;
        qcnameandid: string;
      } | null;
    }>;
    pagination?: {
      page: number;
      pageSize: number;
      totalCount: number;
      pageCount: number;
    };
  };
  error?: string;
  message?: string;
  timestamp: string;
}

export default function EnumeratorWisePage() {
  const [filters, setFilters] = useState({
    userId: '',
    interviewDate: '',
    deviceId: '',
    progressPhase: '',
    teleQcId: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [enumeratorWiseData, setEnumeratorWiseData] = useState<EnumeratorWiseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): EnumeratorWiseData[] => {
    return apiData.map((item) => ({
      id: item.id,
      enumeratorId: item.user_id,
      interviewDate: item.interview_date,
      deviceId: item.device_id,
      interviewerIds: item.interviewerids,
      totalInterview: item.total_interview,
      totalInterviewWithoutPhone: item.total_interview_without_phone,
      validInterview: item.valid_interview,
      invalidInterview: item.invalid_interview,
      rejectInterview: item.reject_interview,
      rejectInterviewSystem: item.reject_interview_system,
      underQcInterview: item.underqc_interview,
      qcUser: item.qcuser ? item.qcuser.qcnameandid : '',
      status: item.progressphase,
      teleQc: item.teleqcstatus,
      audioQc: item.audioqcstatus
    }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch data from API
  const fetchEnumeratorWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /report/enumerator-wise');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.userId) queryParams.append('user_id', filters.userId);
      if (filters.interviewDate) queryParams.append('interview_date', filters.interviewDate);
      if (filters.deviceId) queryParams.append('device_id', filters.deviceId);
      if (filters.progressPhase) queryParams.append('progress_phase', filters.progressPhase);
      if (filters.teleQcId) queryParams.append('tele_qc_id', filters.teleQcId);
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/report/enumerator-wise${queryString ? `?${queryString}` : ''}`;
      
      console.log('API endpoint:', endpoint);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });
      
      // Race between API call and timeout
      const response = await Promise.race([
        apiClient.get(endpoint),
        timeoutPromise
      ]) as any;
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        const transformedData = transformAPIData(data.data.data);
        setEnumeratorWiseData(transformedData);
        setTotalCount(data.data.pagination?.totalCount || transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: EnumeratorWiseData[] = [
          { id: 1, enumeratorId: 1224, interviewDate: '2025-04-05', deviceId: 'cd05f858ccd8dc8c', interviewerIds: ',102', totalInterview: 33, totalInterviewWithoutPhone: 0, validInterview: 21, invalidInterview: 2, rejectInterview: 10, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
          { id: 2, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: '01aa4d572f2065e0', interviewerIds: '141', totalInterview: 8, totalInterviewWithoutPhone: 0, validInterview: 8, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
        ];
        setEnumeratorWiseData(fallbackData);
        setTotalCount(fallbackData.length);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      
      // Better error handling for different error types
      if (err.message === 'Request timeout after 10 seconds') {
        console.error('Request timed out');
        setError('Request timed out. The server may be slow or unavailable.');
      } else if (err.code === 'ECONNABORTED') {
        console.error('Connection aborted');
        setError('Connection was aborted. Please check your network connection.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        console.error('Network error or no response');
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 401) {
        console.error('Authentication error');
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        console.error('Forbidden error');
        setError('Access forbidden. You do not have permission to view this data.');
      } else if (err.response?.data?.error) {
        console.error('API error:', err.response.data.error);
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        console.error('API message:', err.response.data.message);
        setError(err.response.data.message);
      } else {
        console.error('Unknown error:', err.message);
        setError(err.message || 'An error occurred while fetching data');
      }
      
      // Use fallback data on error
      console.log('API request failed, using fallback sample data...');
      const fallbackData: EnumeratorWiseData[] = [
        { id: 1, enumeratorId: 1224, interviewDate: '2025-04-05', deviceId: 'cd05f858ccd8dc8c', interviewerIds: ',102', totalInterview: 33, totalInterviewWithoutPhone: 0, validInterview: 21, invalidInterview: 2, rejectInterview: 10, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
        { id: 2, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: '01aa4d572f2065e0', interviewerIds: '141', totalInterview: 8, totalInterviewWithoutPhone: 0, validInterview: 8, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
        { id: 3, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: '7696b69127cccc7e', interviewerIds: '145', totalInterview: 4, totalInterviewWithoutPhone: 0, validInterview: 4, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
        { id: 4, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: 'ff6af232e1fd2ac7', interviewerIds: '144', totalInterview: 3, totalInterviewWithoutPhone: 0, validInterview: 3, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
        { id: 5, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: 'd9ea4b01feb09fc0', interviewerIds: ',142', totalInterview: 9, totalInterviewWithoutPhone: 0, validInterview: 8, invalidInterview: 1, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
      ];
      setEnumeratorWiseData(fallbackData);
      setTotalCount(fallbackData.length);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchEnumeratorWiseData();
  }, [currentPage, filters]);

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    setCurrentPage(1); // Reset to first page when searching
    fetchEnumeratorWiseData();
  };

  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Interview Date' }];
    const today = new Date();
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    return options;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GPS Check Pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">GPS Check Pending</span>;
      case 'Audio/Tele QC Pending':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Audio/Tele QC Pending</span>;
      case 'QC Completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">QC Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = enumeratorWiseData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Field Enumerator Wise Report
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <Text className="ml-2 text-gray-600">Loading enumerator wise report...</Text>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={4} className="text-lg font-semibold text-red-600 mb-2">
                    Error Loading Data
                  </Heading>
                  <Text className="text-gray-600">{error}</Text>
                </div>
                <Button
                  onClick={fetchEnumeratorWiseData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search Form */}
        <div className="mb-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By Enumerator ID"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', value as string)}
                  options={generateDateOptions()}
                  placeholder="Select Interview Date"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By Device ID"
                  value={filters.deviceId}
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.progressPhase}
                  onChange={(value) => handleFilterChange('progressPhase', value as string)}
                  options={[
                    { value: '', label: 'Select Status' },
                    { value: '0', label: 'GPS Check Pending' },
                    { value: '1', label: 'Audio/Tele QC Pending' },
                    { value: '2', label: 'QC Completed' },
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By QC ID"
                  value={filters.teleQcId}
                  onChange={(e) => handleFilterChange('teleQcId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Enumerator Wise Report Table */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>   
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Field Enumerator Wise Report
                </Heading>
                <span className="text-end"></span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Enumerator ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interview Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Device Id</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interviewer IDs</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview Without Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Valid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Invalid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview System</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Under QC Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Tele QC</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio QC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data, index) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.enumeratorId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.interviewDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.deviceId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.interviewerIds}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterviewWithoutPhone.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.validInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.invalidInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterviewSystem.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.underQcInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.qcUser || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{getStatusBadge(data.status)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.teleQc}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.audioQc}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> items
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
