'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import Badge from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Eye, Edit, Check, Loader2, Volume2 } from 'lucide-react';
import AudioPlayerModal from '@/components/modals/AudioPlayerModal';
import apiClient from '@/lib/api-client';
import { apiService } from '@/lib/api';

interface InterviewData {
  id: number;
  serverId: number;
  serverDate: string;
  interviewDate: string;
  acCode: number;
  acName: string;
  psName: string;
  deviceId: string;
  interviewerId: string;
  respondentName: string;
  gender: number;
  genderLabel: string;
  status: number;
  statusLabel: string;
  statusValue: string;
  audioQcStatus: number;
  audioQcCompleteDate: string;
  audioQcId: string;
  audio1Status: number;
  teleQcStatus: number;
  gpsQcStatus: number;
  broadcastStatus: number;
  overAchievement: number;
  psCode: string;
  collectDeviceId: string;
  teleQcCompleteDate: string;
  teleQcId: string;
  qcScenario: number;
}

interface APIResponse {
  success: boolean;
  data: {
    data: Array<{
      server_id: number;
      interview_date: string;
      ac_code: number;
      ac_name: string;
      interviewer_id: string;
      respondent_name: string;
      gender: number;
      audio_qc_complete_date: string;
      audio_qc_status: number;
      audio_qc_id: string;
      audio1_status: number;
      status: number;
      statusvalue: string;
      tele_qc_status: number;
      gps_qc_status: number;
      broadcast_status: number;
      over_achievement: number;
      ps_code: string;
      ps_name: string;
      device_id: string;
      collect_device_id: string;
      tele_qc_complete_date: string;
      tele_qc_id: string;
      qc_scenario: number;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
    sort: {
      defaultOrder: {
        server_id: string;
      };
    };
  };
}

export default function InterviewListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    server_id: '',
    interview_date: '',
    ac_code: '',
    interviewer_id: '',
    ps_code: '',
    user_id: '',
    status: '',
    device_id: '',
    over_achievement: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): InterviewData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      serverId: item.server_id,
      serverDate: new Date().toISOString().split('T')[0], // Current date as server date
      interviewDate: new Date(item.interview_date).toISOString().split('T')[0],
      acCode: item.ac_code,
      acName: item.ac_name,
      psName: item.ps_name,
      deviceId: item.device_id,
      interviewerId: item.interviewer_id,
      respondentName: item.respondent_name,
      gender: item.gender,
      genderLabel: item.gender === 1 ? 'Male' : 'Female',
      status: item.status,
      statusLabel: getStatusLabel(item.status),
      statusValue: item.statusvalue,
      audioQcStatus: item.audio_qc_status,
      audioQcCompleteDate: item.audio_qc_complete_date ? new Date(item.audio_qc_complete_date).toISOString().split('T')[0] : '',
      audioQcId: item.audio_qc_id || '',
      audio1Status: item.audio1_status,
      teleQcStatus: item.tele_qc_status,
      gpsQcStatus: item.gps_qc_status,
      broadcastStatus: item.broadcast_status,
      overAchievement: item.over_achievement,
      psCode: item.ps_code,
      collectDeviceId: item.collect_device_id,
      teleQcCompleteDate: item.tele_qc_complete_date ? new Date(item.tele_qc_complete_date).toISOString().split('T')[0] : '',
      teleQcId: item.tele_qc_id || '',
      qcScenario: item.qc_scenario,
    }));
  };

  // Helper function to get status label
  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 20:
        return 'Completed';
      case 10:
        return 'In Progress';
      case 5:
        return 'Started';
      case 0:
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  // Generate date options for dropdowns
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 150; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    return options;
  };

  // Generate AC options - will be populated from API
  const generateACOptions = () => {
    return [
      { value: '', label: 'Select AC' },
    ];
  };

  // Generate QC ID options - will be populated from API
  const generateQCIdOptions = () => {
    return [
      { value: '', label: 'Select QC ID' },
    ];
  };

  const handleFilterChange = (field: string, value: string | string[] | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch data from API
  const fetchInterviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /progress/interview-list');
      
      // Build query parameters
      const queryParams: any = {
        over_achievement: filters.over_achievement ? 1 : 0,
        page: currentPage,
        limit: pageSize
      };
      
      if (filters.server_id) queryParams.server_id = filters.server_id;
      if (filters.interview_date) queryParams.interview_date = filters.interview_date;
      if (filters.ac_code) queryParams.ac_code = filters.ac_code;
      if (filters.interviewer_id) queryParams.interviewer_id = filters.interviewer_id;
      if (filters.ps_code) queryParams.ps_code = filters.ps_code;
      if (filters.user_id) queryParams.user_id = filters.user_id;
      if (filters.status) queryParams.status = filters.status;
      if (filters.device_id) queryParams.device_id = filters.device_id;
      
      console.log('API query params:', queryParams);
      
      const response = await apiClient.get('/progress/interview-list', { params: queryParams });
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        const transformedData = transformAPIData(data.data.data);
        setInterviewData(transformedData);
        setTotalCount(data.data.pagination.total_count);
        console.log('Transformed data:', transformedData);
        console.log('Pagination info:', data.data.pagination);
      } else {
        console.error('Invalid API response structure');
        setError('Invalid response format from server');
        setInterviewData([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      
      if (err.response?.status === 401) {
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
      
      setInterviewData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchInterviewData();
  }, [currentPage, filters]);

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    setCurrentPage(1); // Reset to first page when searching
    fetchInterviewData();
  };

  const handleAudioView = (serverId: number) => {
    setSelectedServerId(String(serverId));
    setAudioModalOpen(true);
  };

  const handleMarkAsValid = (serverId: number) => {
    console.log('Mark as valid for server ID:', serverId);
  };

  const handleEdit = (serverId: number, acCode: number) => {
    router.push(`/capi/dqm/progress/interview-list/interview-list-tele-form/${serverId}/${acCode}`);
  };


  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = interviewData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
              Interview List
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
            <Text className="ml-2 text-gray-600">Loading interview data...</Text>
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
                  onClick={fetchInterviewData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Filter Form */}
        <Card className="mb-6">
          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="row">
                {/* First Row - Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                  {/* Interview Date */}
                  <div className="form-group">
                    <SelectDropdown
                      value={filters.interview_date}
                      onChange={(value) => handleFilterChange('interview_date', value as string)}
                      placeholder="Select Interview Date"
                      options={[
                        { value: '', label: 'Select Interview Date' },
                        ...generateDateOptions()
                      ]}
                    />
                  </div>

                  {/* AC Code */}
                  <div className="form-group">
                    <SelectDropdown
                      value={filters.ac_code}
                      onChange={(value) => handleFilterChange('ac_code', value as string)}
                      placeholder="Select AC"
                      options={generateACOptions()}
                    />
                  </div>

                  {/* Polling Station */}
                  <div className="form-group">
                    <SelectDropdown
                      value={filters.ps_code || ''}
                      onChange={(value) => handleFilterChange('ps_code', value as string)}
                      placeholder="Select Polling Station"
                      options={[
                        { value: '', label: 'Select Polling Station' },
                      ]}
                    />
                  </div>

                  {/* Enumerator ID */}
                  <div className="form-group">
                    <SelectDropdown
                      value={filters.user_id || ''}
                      onChange={(value) => handleFilterChange('user_id', value as string)}
                      placeholder="Select Enumerator ID"
                      options={[
                        { value: '', label: 'Select Enumerator ID' },
                      ]}
                    />
                  </div>

                  {/* Interviewer ID */}
                  <div className="form-group">
                    <SelectDropdown
                      value={filters.interviewer_id}
                      onChange={(value) => handleFilterChange('interviewer_id', value as string)}
                      placeholder="Select Interviewer ID"
                      options={[
                        { value: '', label: 'Select Interviewer ID' },
                      ]}
                    />
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <SelectDropdown
                      value={filters.status || ''}
                      onChange={(value) => handleFilterChange('status', value as string)}
                      placeholder="Select Status"
                      options={[
                        { value: '', label: 'Select Status' },
                        { value: '40', label: 'Under QC' },
                        { value: '50', label: 'GPS Pass' },
                        { value: '60', label: 'QC Completed' },
                        { value: '70', label: 'Under Re-QC' },
                        { value: '80', label: 'Re-QC Completed' },
                        { value: '90', label: 'Remove From QC' },
                        { value: 'Valid', label: 'Valid' },
                        { value: 'Rejected', label: 'Rejected' },
                        { value: 'Terminated', label: 'Terminated' },
                      ]}
                    />
                  </div>
                </div>

                {/* Second Row - Text inputs, checkbox, and search button */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Server ID */}
                  <div className="form-group">
                    <Input
                      type="text"
                      placeholder="Search by Server ID"
                      value={filters.server_id}
                      onChange={(e) => handleFilterChange('server_id', e.target.value)}
                    />
                  </div>

                  {/* Device ID */}
                  <div className="form-group">
                    <Input
                      type="text"
                      placeholder="Search by Device ID"
                      value={filters.device_id || ''}
                      onChange={(e) => handleFilterChange('device_id', e.target.value)}
                    />
                  </div>

                  {/* Over Achievement Checkbox */}
                  <div className="form-group flex items-center">
                    <label className="flex items-center">
                      <Checkbox
                        checked={filters.over_achievement || false}
                        onCheckedChange={(checked) => handleFilterChange('over_achievement', checked as boolean)}
                      />
                      <Text className="text-sm text-gray-700 ml-2">Over Achievement</Text>
                    </label>
                  </div>

                  {/* Search Button */}
                  <div className="form-group">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                    >
                      <Search className="w-4 h-4 mr-1" />
                      Search
                    </Button>
                  </div>

                  {/* Empty columns for spacing */}
                  <div></div>
                  <div></div>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Main Content */}
        <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    Interview Details
                  </Heading>
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
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Server ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Server<br />Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Interview<br />Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">PS Name</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Interviewer<br />ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Device ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Gender</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((interview, index) => (
                        <tr key={interview.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{startIndex + index + 1}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{interview.serverId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{interview.serverDate}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{interview.interviewDate}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{interview.acName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{interview.psName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{interview.interviewerId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-left">{interview.deviceId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                            <span className={interview.genderLabel === 'Male' ? 'text-blue-600' : 'text-pink-600'}>
                              {interview.genderLabel}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                            {interview.statusValue}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <button 
                              className="w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                              title="Play Audio"
                              onClick={() => handleAudioView(interview.serverId)}
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="relative group">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(interview.serverId, interview.acCode)}
                                className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 p-2"
                                title="Edit Response"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Edit
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Table Footer */}
                <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> items.
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
      </Container>
      {/* Audio Player Modal */}
      <AudioPlayerModal
        isOpen={audioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        serverId={selectedServerId}
      />
    </div>
  );
}
