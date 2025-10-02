'use client';

import { useState, useEffect } from 'react';
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
import { Search, Eye, Edit, Check, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface InterviewData {
  id: number;
  serverId: number;
  interviewDate: string;
  acName: string;
  interviewerId: number;
  respondentName: string;
  gender: string;
  audioQcDate: string;
  audioQc: string;
  audioQcId: number;
  audioFailReason: string;
  qcOutcome: string;
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
      audio_qc_id: number;
      audio1_status: number;
      status: number;
      qc_scenario_color: string;
    }>;
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      pageCount: number;
    };
  };
  message: string;
  timestamp: string;
}

export default function InterviewListPage() {
  const [filters, setFilters] = useState({
    serverId: '',
    interviewDate: '',
    acCode: '',
    interviewerId: '',
    qcDate: '',
    qcId: '',
    audioQcStatus: [] as string[],
    audio1Status: [] as string[],
    qcScenarioColor: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): InterviewData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      serverId: item.server_id,
      interviewDate: new Date(item.interview_date).toISOString().split('T')[0],
      acName: item.ac_name,
      interviewerId: parseInt(item.interviewer_id),
      respondentName: item.respondent_name,
      gender: item.gender === 1 ? 'Male' : 'Female',
      audioQcDate: new Date(item.audio_qc_complete_date).toISOString().split('T')[0],
      audioQc: item.audio_qc_status === 1 ? 'Pass' : 'Fail',
      audioQcId: item.audio_qc_id,
      audioFailReason: item.audio1_status === 1 ? 'Survey Conversation can be heard' : 'No Conversation',
      qcOutcome: item.qc_scenario_color === 'green' ? 'Pass' : item.qc_scenario_color === 'red' ? 'Fail' : 'Pending'
    }));
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

  // Generate AC options
  const generateACOptions = () => {
    return [
      { value: '', label: 'Select AC' },
      { value: '195', label: 'Agiaon (SC) (195)' },
      { value: '70', label: 'Alamnagar (70)' },
      { value: '148', label: 'Alauli (SC) (148)' },
      { value: '11', label: 'Sugauli (11)' },
      { value: '79', label: 'Gaura Bauram (79)' },
      { value: '172', label: 'Biharsharif (172)' },
      { value: '5', label: 'Lauriya (5)' },
    ];
  };

  // Generate QC ID options
  const generateQCIdOptions = () => {
    return [
      { value: '', label: 'Select QC ID' },
      { value: '101', label: 'Komal (101)' },
      { value: '102', label: 'Priyanshi (102)' },
      { value: '103', label: 'Sonu Kumari (103)' },
      { value: '105', label: 'Simran (105)' },
      { value: '106', label: 'Swati (106)' },
      { value: '109', label: 'Kundan (109)' },
      { value: '121', label: 'Ashifa (121)' },
      { value: '122', label: 'Rama (122)' },
    ];
  };

  const handleFilterChange = (field: string, value: string | string[]) => {
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
      const queryParams = new URLSearchParams();
      
      if (filters.serverId) queryParams.append('server_id', filters.serverId);
      if (filters.interviewDate) queryParams.append('interview_date', filters.interviewDate);
      if (filters.acCode) queryParams.append('ac_code', filters.acCode);
      if (filters.interviewerId) queryParams.append('interviewer_id', filters.interviewerId);
      if (filters.qcDate) queryParams.append('qc_date', filters.qcDate);
      if (filters.qcId) queryParams.append('qc_id', filters.qcId);
      if (filters.audioQcStatus.length > 0) queryParams.append('audio_qc_status', filters.audioQcStatus.join(','));
      if (filters.audio1Status.length > 0) queryParams.append('audio1_status', filters.audio1Status.join(','));
      if (filters.qcScenarioColor.length > 0) queryParams.append('qc_scenario_color', filters.qcScenarioColor.join(','));
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/progress/interview-list${queryString ? `?${queryString}` : ''}`;
      
      console.log('API endpoint:', endpoint);
      
      const response = await apiClient.get(endpoint);
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        const transformedData = transformAPIData(data.data.data);
        setInterviewData(transformedData);
        setTotalCount(data.data.pagination.totalCount);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure');
        setError('Invalid response format from server');
        // Use fallback data
        const fallbackData: InterviewData[] = [
          { id: 1, serverId: 188970, interviewDate: '2025-04-05', acName: 'Sugauli (11)', interviewerId: 990, respondentName: 'Amitabh kumar ojha', gender: 'Male', audioQcDate: '2025-04-10', audioQc: 'Pass', audioQcId: 101, audioFailReason: 'Survey Conversation can be heard', qcOutcome: 'Pass' },
          { id: 2, serverId: 188971, interviewDate: '2025-04-05', acName: 'Sugauli (11)', interviewerId: 990, respondentName: 'Suresh ojha', gender: 'Male', audioQcDate: '2025-04-07', audioQc: 'Pass', audioQcId: 101, audioFailReason: 'Survey Conversation can be heard', qcOutcome: 'Pass' },
          { id: 3, serverId: 188972, interviewDate: '2025-04-05', acName: 'Sugauli (11)', interviewerId: 121, respondentName: 'Sandip singh', gender: 'Male', audioQcDate: '2025-04-16', audioQc: 'Pass', audioQcId: 109, audioFailReason: 'Survey Conversation can be heard', qcOutcome: 'Pass' },
        ];
        setInterviewData(fallbackData);
        setTotalCount(fallbackData.length);
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
      
      // Use fallback data on error
      console.log('API request failed, using fallback sample data...');
      const fallbackData: InterviewData[] = [
        { id: 1, serverId: 188970, interviewDate: '2025-04-05', acName: 'Sugauli (11)', interviewerId: 990, respondentName: 'Amitabh kumar ojha', gender: 'Male', audioQcDate: '2025-04-10', audioQc: 'Pass', audioQcId: 101, audioFailReason: 'Survey Conversation can be heard', qcOutcome: 'Pass' },
        { id: 2, serverId: 188971, interviewDate: '2025-04-05', acName: 'Sugauli (11)', interviewerId: 990, respondentName: 'Suresh ojha', gender: 'Male', audioQcDate: '2025-04-07', audioQc: 'Pass', audioQcId: 101, audioFailReason: 'Survey Conversation can be heard', qcOutcome: 'Pass' },
        { id: 3, serverId: 188972, interviewDate: '2025-04-05', acName: 'Sugauli (11)', interviewerId: 121, respondentName: 'Sandip singh', gender: 'Male', audioQcDate: '2025-04-16', audioQc: 'Pass', audioQcId: 109, audioFailReason: 'Survey Conversation can be heard', qcOutcome: 'Pass' },
      ];
      setInterviewData(fallbackData);
      setTotalCount(fallbackData.length);
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
    console.log('View audio for server ID:', serverId);
  };

  const handleMarkAsValid = (serverId: number) => {
    console.log('Mark as valid for server ID:', serverId);
  };

  const handleEdit = (serverId: number) => {
    console.log('Edit interview for server ID:', serverId);
  };

  const getQcOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'Pass':
        return <Badge variant="success" size="sm">Pass</Badge>;
      case 'Fail':
        return <Badge variant="error" size="sm">Fail</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{outcome}</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = interviewData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-2">
            <Card className="sticky top-0 overflow-scroll z-10">
              <div className="py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    Filters
                  </Heading>
                </div>
              </div>
              <div className="p-0">
                <div className="space-y-4">
                  {/* Server ID */}
                  <div>
                    <Input
                      type="text"
                      placeholder="Search by Server ID"
                      value={filters.serverId}
                      onChange={(e) => handleFilterChange('serverId', e.target.value)}
                    />
                  </div>

                  {/* Interview Date */}
                  <div>
                    <SelectDropdown
                      value={filters.interviewDate}
                      onChange={(value) => handleFilterChange('interviewDate', value as string)}
                      placeholder="Select Interview Date"
                      options={[
                        { value: '', label: 'Select Interview Date' },
                        ...generateDateOptions()
                      ]}
                    />
                  </div>

                  {/* AC Code */}
                  <div>
                    <SelectDropdown
                      value={filters.acCode}
                      onChange={(value) => handleFilterChange('acCode', value as string)}
                      placeholder="Select AC"
                      options={[
                        { value: '', label: 'Select AC' },
                        { value: '195', label: 'Agiaon (SC) (195)' },
                        { value: '70', label: 'Alamnagar (70)' },
                        { value: '148', label: 'Alauli (SC) (148)' },
                        { value: '11', label: 'Sugauli (11)' },
                        { value: '79', label: 'Gaura Bauram (79)' },
                        { value: '172', label: 'Biharsharif (172)' },
                        { value: '5', label: 'Lauriya (5)' },
                      ]}
                    />
                  </div>

                  {/* Interviewer ID */}
                  <div>
                    <SelectDropdown
                      value={filters.interviewerId}
                      onChange={(value) => handleFilterChange('interviewerId', value as string)}
                      placeholder="Select Interviewer ID"
                      options={[
                        { value: '', label: 'Select Interviewer ID' },
                        { value: '101', label: '101' },
                        { value: '102', label: '102' },
                        { value: '103', label: '103' },
                        { value: '105', label: '105' },
                        { value: '106', label: '106' },
                        { value: '109', label: '109' },
                        { value: '121', label: '121' },
                        { value: '122', label: '122' },
                        { value: '990', label: '990' },
                        { value: '932', label: '932' },
                      ]}
                    />
                  </div>

                  {/* QC Date */}
                  <div>
                    <SelectDropdown
                      value={filters.qcDate}
                      onChange={(value) => handleFilterChange('qcDate', value as string)}
                      placeholder="Select QC Date"
                      options={[
                        { value: '', label: 'Select QC Date' },
                        ...generateDateOptions()
                      ]}
                    />
                  </div>

                  {/* QC ID */}
                  <div>
                    <SelectDropdown
                      value={filters.qcId}
                      onChange={(value) => handleFilterChange('qcId', value as string)}
                      placeholder="Select QC ID"
                      options={[
                        { value: '', label: 'Select QC ID' },
                        { value: '101', label: 'Komal (101)' },
                        { value: '102', label: 'Priyanshi (102)' },
                        { value: '103', label: 'Sonu Kumari (103)' },
                        { value: '105', label: 'Simran (105)' },
                        { value: '106', label: 'Swati (106)' },
                        { value: '109', label: 'Kundan (109)' },
                        { value: '121', label: 'Ashifa (121)' },
                        { value: '122', label: 'Rama (122)' },
                      ]}
                    />
                  </div>

                  {/* Audio QC Status */}
                  <div>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Audio QC Status</Text>
                    <div className="space-y-2">
                      {[
                        { value: '1', label: 'Pass' },
                        { value: '2', label: 'Fail' },
                        { value: '3', label: 'Pending' },
                        { value: '0', label: 'NA' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <Checkbox
                            checked={filters.audioQcStatus.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('audioQcStatus', [...filters.audioQcStatus, option.value]);
                              } else {
                                handleFilterChange('audioQcStatus', filters.audioQcStatus.filter(status => status !== option.value));
                              }
                            }}
                          />
                          <Text className="text-sm text-gray-600 ml-2">{option.label}</Text>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Audio QC Status Details */}
                  <div>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Audio QC Status</Text>
                    <div className="space-y-2">
                      {[
                        { value: '1', label: 'Survey Conversation can be heard' },
                        { value: '2', label: 'No Conversation' },
                        { value: '3', label: 'Irrelevant Conversation' },
                        { value: '6', label: 'Interviewer acting as respondent' },
                        { value: '4', label: 'Can hear the interviewer more than the respondent' },
                        { value: '5', label: 'The interviewer is asking questions mechanically' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <Checkbox
                            checked={filters.audio1Status.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('audio1Status', [...filters.audio1Status, option.value]);
                              } else {
                                handleFilterChange('audio1Status', filters.audio1Status.filter(status => status !== option.value));
                              }
                            }}
                          />
                          <Text className="text-sm text-gray-600 ml-2">{option.label}</Text>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* QC Outcome */}
                  <div>
                    <Text className="text-sm font-medium text-gray-700 mb-2">QC Outcome</Text>
                    <div className="space-y-2">
                      {[
                        { value: 'blue', label: 'Pending' },
                        { value: 'red', label: 'Fail' },
                        { value: 'green', label: 'Pass' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <Checkbox
                            checked={filters.qcScenarioColor.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('qcScenarioColor', [...filters.qcScenarioColor, option.value]);
                              } else {
                                handleFilterChange('qcScenarioColor', filters.qcScenarioColor.filter(color => color !== option.value));
                              }
                            }}
                          />
                          <Text className="text-sm text-gray-600 ml-2">{option.label}</Text>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10">
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
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Server ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Interview<br />Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Interviewer<br />ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Respondent<br />Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Gender</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio QC Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Audio<br />QC
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Audio<br />QC ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Audio<br />Fail Reason
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Outcome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((interview, index) => (
                        <tr key={interview.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{interview.serverId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{interview.interviewDate}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{interview.acName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{interview.interviewerId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{interview.respondentName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={interview.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'}>
                              {interview.gender}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{interview.audioQcDate}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{interview.audioQc}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{interview.audioQcId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{interview.audioFailReason}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {interview.audioQc === 'Fail' ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleMarkAsValid(interview.serverId)}
                                title="Mark as Valid"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAudioView(interview.serverId)}
                                title="View Audio"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getQcOutcomeBadge(interview.qcOutcome)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="relative group">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(interview.serverId)}
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
          </div>
        </div>
      </Container>
    </div>
  );
}
