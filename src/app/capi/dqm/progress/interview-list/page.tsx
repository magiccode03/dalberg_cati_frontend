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
import { apiService } from '@/lib/api';

interface InterviewData {
  id: number;
  serverId: number;
  interviewDate: string;
  sampleType: string;
  acCode: number;
  acName: string;
  psName: string;
  deviceId: string;
  interviewerId: string;
  audioQcLabel: string;
  audioQcId: string;
  audioFailReason: string;
  qcOutcome: string;
  statusLabel: string;
  genderLabel: string;
  gpsAvailable: boolean;
  psImageAvailable: boolean;
  selfieImageAvailable: boolean;
  audioPlaybackAvailable: boolean;
}

interface APIResponse {
  success: boolean;
  data: {
    interviews: Array<{
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
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
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

export default function InterviewListPage() {
  const [filters, setFilters] = useState({
    server_id: '',
    interview_date: '',
    ac_code: '',
    interviewer_id: '',
    qc_date: '',
    qc_id: '',
    audio_qc_status: [] as string[],
    audio1_status: [] as string[],
    qc_scenario_color: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
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
      sampleType: item.sample_type,
      acCode: item.ac_code,
      acName: item.ac_name,
      psName: item.ps_name,
      deviceId: item.device_id,
      interviewerId: item.interviewer_id,
      audioQcLabel: item.audio_qc_label,
      audioQcId: item.audio_qc_id,
      audioFailReason: item.audio1_status_label,
      qcOutcome: item.qc_outcome,
      statusLabel: item.status_label,
      genderLabel: item.gender_label,
      gpsAvailable: item.gps_available,
      psImageAvailable: item.ps_image_available,
      selfieImageAvailable: item.selfie_image_available,
      audioPlaybackAvailable: item.audio_playback_available,
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
      
      console.log('Making API request to: /overview/interview-log');
      
      // Build query parameters
      const queryParams: any = {
        page: currentPage,
        per_page: pageSize,
        sort_field: 'interview_date',
        sort_direction: 'DESC'
      };
      
      if (filters.server_id) queryParams.server_id = filters.server_id;
      if (filters.interview_date) queryParams.interview_date = filters.interview_date;
      if (filters.ac_code) queryParams.ac_code = filters.ac_code;
      if (filters.interviewer_id) queryParams.interviewer_id = filters.interviewer_id;
      if (filters.qc_date) queryParams.qc_date = filters.qc_date;
      if (filters.qc_id) queryParams.qc_id = filters.qc_id;
      if (filters.audio_qc_status.length > 0) queryParams.audio_qc_status = filters.audio_qc_status.join(',');
      if (filters.audio1_status.length > 0) queryParams.audio1_status = filters.audio1_status.join(',');
      if (filters.qc_scenario_color.length > 0) queryParams.qc_scenario_color = filters.qc_scenario_color.join(',');
      
      console.log('API query params:', queryParams);
      
      const response = await apiService.getInterviewLog(queryParams);
      
      const data: APIResponse = response;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.interviews)) {
        const transformedData = transformAPIData(data.data.interviews);
        setInterviewData(transformedData);
        setTotalCount(data.data.pagination.total_count);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure');
        setError('Invalid response format from server');
        // Use fallback data
        const fallbackData: InterviewData[] = [
          { 
            id: 1, 
            serverId: 188970, 
            interviewDate: '2025-04-05', 
            sampleType: 'Sample',
            acCode: 11,
            acName: 'Sugauli (11)', 
            psName: 'Government School',
            deviceId: 'DEVICE001',
            interviewerId: '990', 
            audioQcLabel: 'Pass', 
            audioQcId: '101', 
            audioFailReason: 'Survey Conversation can be heard', 
            qcOutcome: 'Pass',
            statusLabel: 'Valid',
            genderLabel: 'Male',
            gpsAvailable: true,
            psImageAvailable: true,
            selfieImageAvailable: true,
            audioPlaybackAvailable: true
          },
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
        { 
          id: 1, 
          serverId: 188970, 
          interviewDate: '2025-04-05', 
          sampleType: 'Sample',
          acCode: 11,
          acName: 'Sugauli (11)', 
          psName: 'Government School',
          deviceId: 'DEVICE001',
          interviewerId: '990', 
          audioQcLabel: 'Pass', 
          audioQcId: '101', 
          audioFailReason: 'Survey Conversation can be heard', 
          qcOutcome: 'Pass',
          statusLabel: 'Valid',
          genderLabel: 'Male',
          gpsAvailable: true,
          psImageAvailable: true,
          selfieImageAvailable: true,
          audioPlaybackAvailable: true
        },
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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Interview List
          </Heading>
        </div>
      </div>


      {/* Interview List Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Interview Details
            </Heading>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalCount.toLocaleString()}</strong> items.
            </Text>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <Text className="text-gray-600">Loading interview data...</Text>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Text className="text-lg text-red-600">Error: {error}</Text>
              <Button 
                onClick={fetchInterviewData}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">Server ID</th>
                    <th className="text-center">Interview Date</th>
                    <th className="text-center">Sample Type</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">PS Name</th>
                    <th className="text-center">Interviewer ID</th>
                    <th className="text-center">Gender</th>
                    <th className="text-center">Audio QC</th>
                    <th className="text-center">Audio QC ID</th>
                    <th className="text-center">Audio Fail Reason</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">QC Outcome</th>
                    <th className="text-center">Audio</th>
                    <th className="text-center">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((interview, index) => (
                    <tr key={interview.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center">{interview.serverId}</td>
                      <td className="text-left">{interview.interviewDate}</td>
                      <td className="text-left">{interview.sampleType}</td>
                      <td className="text-left">{interview.acName}</td>
                      <td className="text-left">{interview.psName}</td>
                      <td className="text-center">{interview.interviewerId}</td>
                      <td className="text-left">
                        <span className={interview.genderLabel === 'Male' ? 'text-blue-600' : 'text-pink-600'}>
                          {interview.genderLabel}
                        </span>
                      </td>
                      <td className="text-left">{interview.audioQcLabel}</td>
                      <td className="text-center">{interview.audioQcId}</td>
                      <td className="text-left">{interview.audioFailReason}</td>
                      <td className="text-left">
                        <Badge variant={interview.statusLabel === 'Valid' ? 'success' : 'secondary'} size="sm">
                          {interview.statusLabel}
                        </Badge>
                      </td>
                      <td className="text-left">
                        {getQcOutcomeBadge(interview.qcOutcome)}
                      </td>
                      <td className="text-center">
                        {interview.audioQcLabel === 'Fail' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleMarkAsValid(interview.serverId)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            title="Mark as Valid"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioView(interview.serverId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                            title="View Audio"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(interview.serverId)}
                          className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                          title="Edit Response"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
