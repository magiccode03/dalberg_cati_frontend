'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Alert from '@/components/ui/Alert';
import { Search, Edit, Volume2 } from 'lucide-react';
import AudioPlayerModal from '@/components/modals/AudioPlayerModal';
import apiClient from '@/lib/api-client';

interface InterviewData {
  server_id: number;
  interview_date: string;
  ac_code: number;
  ac_name: string;
  interviewer_id: string;
  gender: number;
  audio_qc_complete_date: string;
  audio_qc_status: number;
  qc_id: number;
  audio1_status: number;
  qc_outcome: string;
  qc_audio_status: number;
  audio_qc_rejection_level: number | null;
  status: number;
  audio1: string;
}

interface APIResponse {
  success: boolean;
  data: {
    interviews: Array<{
      server_id: number;
      interview_date: string;
      ac_code: number;
      ac_name: string;
      interviewer_id: string;
      gender: number;
      audio_qc_complete_date: string;
      audio_qc_status: number;
      qc_id: number;
      audio1_status: number;
      qc_outcome: string;
      qc_audio_status: number;
      audio_qc_rejection_level: number | null;
      status: number;
      audio1: string;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
    filters_applied: Record<string, any>;
    sorting: {
      field: string;
      direction: string;
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
    qc_date: [] as string[],
    qc_id: '',
    audio_qc_status: [] as string[],
    audio_fail_reason: '',
    audio1_status: [] as string[],
    qc_scenario_color: [] as string[],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');

  // Filter dropdown state
  const [acList, setAcList] = useState<{ value: string; label: string }[]>([]);
  const [acLoading, setAcLoading] = useState(false);
  const [interviewers, setInterviewers] = useState<{ value: string; label: string }[]>([]);
  const [interviewersLoading, setInterviewersLoading] = useState(false);
  const [qcIdList, setQcIdList] = useState<{ value: string; label: string }[]>([]);
  const [qcIdLoading, setQcIdLoading] = useState(false);

  // Checkbox options
  const audioQcStatusOptions = [
    { value: '1', label: 'Pass' },
    { value: '2', label: 'Fail' },
  ];

  const audio1StatusOptions = [
    { value: '1', label: 'Good Quality' },
    { value: '2', label: 'Poor Quality' },
    { value: '3', label: 'No Audio' },
    { value: '4', label: 'Partial Audio' },
  ];

  const qcOutcomeOptions = [
    { value: 'blue', label: 'Pending' },
    { value: 'red', label: 'Fail' },
    { value: 'green', label: 'Pass' },
  ];

  // Audio Fail Reason options (matching rejection report)
  const audioFailReasonOptions = [
    { value: '', label: 'Select Audio Fail Reason' },
    { value: 'survey_conversation_gender', label: 'Survey Conversation can be heard | Gender Rejection' },
    { value: 'survey_conversation_upcoming', label: 'Survey Conversation can be heard | Upcoming Election Rejection' },
    { value: 'survey_conversation_2021_ae', label: 'Survey Conversation can be heard | 2021 AE Rejection' },
    { value: 'survey_conversation_2024_election', label: 'Survey Conversation can be heard | 2024 Election Rejection' },
    { value: 'no_conversation', label: 'No Conversation' },
    { value: 'irrelevant_conversation', label: 'Irrelevant Conversation' },
    { value: 'interviewer_more_than_respondent_gender', label: 'Can hear the interviewer more than the respondent | Gender Rejection' },
    { value: 'interviewer_more_than_respondent_upcoming', label: 'Can hear the interviewer more than the respondent | Upcoming Election Rejection' },
    { value: 'interviewer_more_than_respondent_2021_ae', label: 'Can hear the interviewer more than the respondent | 2021 AE Rejection' },
    { value: 'interviewer_more_than_respondent_2024_election', label: 'Can hear the interviewer more than the respondent | 2024 Election Rejection' },
    { value: 'cannot_hear_response_clearly_gender', label: 'Cannot hear the response clearly | Gender Rejection' },
    { value: 'cannot_hear_response_clearly_upcoming', label: 'Cannot hear the response clearly | Upcoming Election Rejection' },
    { value: 'cannot_hear_response_clearly_2021_ae', label: 'Cannot hear the response clearly | 2021 AE Rejection' },
    { value: 'cannot_hear_response_clearly_2024_election', label: 'Cannot hear the response clearly | 2024 Election Rejection' },
    { value: 'duplicate_audio', label: 'Duplicate Audio' },
    { value: 'interviewer_acting_as_respondent', label: 'Interviewer acting as respondent' },
    { value: 'same_respondent_as_before', label: 'Same respondent as before' }
  ];

  // Generate date options for dropdowns
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    return options;
  };

  const dateOptions = generateDateOptions();

  const handleFilterChange = (field: string, value: string | string[] | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value),
    }));
  };

  // Fetch data from API
  const fetchInterviewData = async (page: number = pagination.page) => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /capi/dqm/qc/interview/progress/detail');
      
      // Build query parameters
      const queryParams: any = {
        page: page,
        pageSize: pagination.limit,
        sortBy: 'server_id',
        sortOrder: 'DESC'
      };
      
      if (filters.server_id) queryParams.server_id = filters.server_id;
      if (filters.interview_date) queryParams.interview_date = filters.interview_date;
      if (filters.ac_code) queryParams.ac_code = filters.ac_code;
      if (filters.interviewer_id) queryParams.interviewer_id = filters.interviewer_id;
      if (filters.qc_date.length > 0) queryParams.qc_date = filters.qc_date.join(',');
      if (filters.qc_id) queryParams.qc_id = filters.qc_id;
      // Send audio_qc_status as array for multi-select (axios will convert to audio_qc_status=1&audio_qc_status=2)
      if (filters.audio_qc_status.length > 0) queryParams.audio_qc_status = filters.audio_qc_status;
      if (filters.audio_fail_reason) queryParams.audio_fail_reason = filters.audio_fail_reason;
      if (filters.audio1_status.length > 0) queryParams.audio1_status = filters.audio1_status.join(',');
      if (filters.qc_scenario_color.length > 0) queryParams.qc_scenario_color = filters.qc_scenario_color.join(',');
      
      console.log('API query params:', queryParams);
      
      // Configure paramsSerializer to handle arrays as repeated parameters (audio_qc_status=1&audio_qc_status=2)
      const response = await apiClient.get('/capi/dqm/qc/interview/progress/detail', { 
        params: queryParams,
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
              // For arrays, add each value as a separate parameter with the same key
              value.forEach((item) => {
                searchParams.append(key, item);
              });
            } else if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        }
      });
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.interviews)) {
        setInterviewData(data.data.interviews);
        setPagination({
          page: data.data.pagination?.current_page || 1,
          limit: data.data.pagination?.per_page || 50,
          total: data.data.pagination?.total_count || 0,
          totalPages: data.data.pagination?.total_pages || 0,
          hasNext: data.data.pagination?.has_next || false,
          hasPrev: data.data.pagination?.has_previous || false,
        });
        console.log('API data:', data.data.interviews);
        console.log('Pagination info:', data.data.pagination);
      } else {
        console.error('Invalid API response structure');
        setError('Invalid response format from server');
        setInterviewData([]);
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
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
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchInterviewData(pagination.page);
  }, [pagination.page, filters]);

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchInterviewData(1);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchInterviewData(newPage);
  };

  const handleAudioView = (serverId: number) => {
    setSelectedServerId(String(serverId));
    setAudioModalOpen(true);
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

  const handleEdit = (serverId: number, acCode: number) => {
    router.push(`/capi/dqm/progress/interview-list/interview-list-qc-form/${serverId}`);
  };

  // Format date to YYYY-MM-DD format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  const getGenderText = (gender: number) => {
    if (gender === 1) return 'Male';
    if (gender === 2) return 'Female';
    return '-';
  };

  const getAudioQcStatusBadge = (status: number) => {
    let label = '-';
    let colorClass = 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 1:
        label = 'Pass';
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 2:
        label = 'Fail';
        colorClass = 'bg-red-100 text-red-800';
        break;
      default:
        label = '-';
        colorClass = 'bg-gray-100 text-gray-800';
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  const getQcOutcomeBadge = (qcOutcome: string) => {
    if (!qcOutcome) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>;
    }

    const outcome = qcOutcome.toLowerCase();
    let colorClass = 'bg-gray-100 text-gray-800';
    
    if (outcome === 'pass') {
      colorClass = 'bg-green-100 text-green-800';
    } else if (outcome === 'fail' || outcome === 'rejected') {
      colorClass = 'bg-red-100 text-red-800';
    } else if (outcome === 'pending') {
      colorClass = 'bg-blue-100 text-blue-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {qcOutcome}
      </span>
    );
  };

  // Function to get the display text for Audio Fail Reason column
  const getAudioFailReasonDisplayText = (item: InterviewData) => {
    if (!item.audio_qc_rejection_level || !item.qc_audio_status) {
      return '-';
    }

    const qcRejectionLevel = item.audio_qc_rejection_level;
    const qcAudioStatus = item.qc_audio_status;

    // Handle specific mappings based on audio_qc_rejection_level and qc_audio_status
    if (qcRejectionLevel === 2 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | Gender Rejection';
    }
    
    if (qcRejectionLevel === 3 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | Upcoming Election Rejection';
    }
    
    if (qcRejectionLevel === 4 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | 2021 AE Rejection';
    }
    
    if (qcRejectionLevel === 5 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | 2024 Election Rejection';
    }
    
    if (qcRejectionLevel === 1 && qcAudioStatus === 2) {
      return 'No Conversation';
    }
    
    if (qcRejectionLevel === 1 && qcAudioStatus === 3) {
      return 'Irrelevant Conversation';
    }
    
    if (qcRejectionLevel === 2 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | Gender Rejection';
    }
    
    if (qcRejectionLevel === 3 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | Upcoming Election Rejection';
    }
    
    if (qcRejectionLevel === 4 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | 2021 AE Rejection';
    }
    
    if (qcRejectionLevel === 5 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | 2024 Election Rejection';
    }
    
    if (qcRejectionLevel === 2 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | Gender Rejection';
    }
    
    if (qcRejectionLevel === 3 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | Upcoming Election Rejection';
    }
    
    if (qcRejectionLevel === 4 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | 2021 AE Rejection';
    }
    
    if (qcRejectionLevel === 5 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | 2024 Election Rejection';
    }
    
    if (qcRejectionLevel === 1 && qcAudioStatus === 8) {
      return 'Duplicate Audio';
    }
    
    if (qcRejectionLevel === 1 && qcAudioStatus === 9) {
      return 'Interviewer acting as respondent';
    }
    
    if (qcRejectionLevel === 1 && qcAudioStatus === 10) {
      return 'Same respondent as before';
    }

    // Fallback to raw value if no mapping matches
    return '-';
  };


  // Fetch QC IDs from API
  const fetchQcIds = async () => {
    try {
      setQcIdLoading(true);
      // TODO: Replace with actual API endpoint for QC IDs
      // For now, using empty list
      setQcIdList([
        { value: '', label: 'Select QC ID' },
      ]);
    } catch (err: any) {
      console.error('❌ Error fetching QC IDs:', err);
      setQcIdList([{ value: '', label: 'Select QC ID' }]);
    } finally {
      setQcIdLoading(false);
    }
  };

  // Load filter dropdowns on component mount
  useEffect(() => {
    fetchAcList();
    fetchInterviewers();
    fetchQcIds();
    fetchInterviewData(1);
  }, []);


  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Interview List
        </Heading>
        <div className="text-sm text-gray-500">
          DQM Progress - Interview List
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </Heading>
            </div>
            <div className="p-4 space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                {/* Server ID */}
                <div>
                  <Input
                    type="text"
                    placeholder="Search by Server ID"
                    value={filters.server_id}
                    onChange={(e) => handleFilterChange('server_id', e.target.value)}
                  />
                </div>

                {/* Interview Date */}
                <div>
                  <SelectDropdown
                    value={filters.interview_date}
                    onChange={(value) => handleFilterChange('interview_date', value as string)}
                    placeholder="Select Interview Date"
                    options={[
                      { value: '', label: 'Select Interview Date' },
                      ...dateOptions
                    ]}
                    searchable={true}
                    clearable={true}
                  />
                </div>

                {/* AC Code */}
                <div>
                  <SelectDropdown
                    value={filters.ac_code}
                    onChange={(value) => handleFilterChange('ac_code', value as string)}
                    placeholder={acLoading ? "Loading ACs..." : "Select AC"}
                    options={acList}
                    searchable={true}
                    clearable={true}
                    disabled={acLoading}
                  />
                </div>

                {/* Interviewer ID */}
                <div>
                  <SelectDropdown
                    value={filters.interviewer_id}
                    onChange={(value) => handleFilterChange('interviewer_id', value as string)}
                    placeholder={interviewersLoading ? "Loading interviewers..." : "Select Interviewer ID"}
                    options={interviewers}
                    searchable={true}
                    clearable={true}
                    disabled={interviewersLoading}
                  />
                </div>

                {/* QC Date */}
                <div>
                  <SelectDropdown
                    value={filters.qc_date}
                    onChange={(value) => handleFilterChange('qc_date', Array.isArray(value) ? value : [value])}
                    placeholder="Select QC Date"
                    options={dateOptions}
                    searchable={true}
                    clearable={true}
                    multiple={true}
                  />
                </div>

                {/* QC ID */}
                <div>
                  <SelectDropdown
                    value={filters.qc_id}
                    onChange={(value) => handleFilterChange('qc_id', value as string)}
                    placeholder={qcIdLoading ? "Loading QC IDs..." : "Select QC ID"}
                    options={qcIdList}
                    searchable={true}
                    clearable={true}
                    disabled={qcIdLoading}
                  />
                </div>

                {/* Audio Fail Reason */}
                <div>
                  <SelectDropdown
                    value={filters.audio_fail_reason}
                    onChange={(value) => handleFilterChange('audio_fail_reason', value as string)}
                    placeholder="Select Audio Fail Reason"
                    options={audioFailReasonOptions}
                    searchable={true}
                    clearable={true}
                  />
                </div>

                {/* Audio QC Status */}
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audio QC Status
                  </Text>
                  <div className="space-y-2">
                    {audioQcStatusOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        checked={filters.audio_qc_status.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxChange('audio_qc_status', option.value, checked)}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>

                {/* QC Outcome */}
                <div>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    QC Outcome
                  </Text>
                  <div className="space-y-2">
                    {qcOutcomeOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        checked={filters.qc_scenario_color.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxChange('qc_scenario_color', option.value, checked)}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <Button 
                  type="submit"
                  variant="primary" 
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                  Interview Details
                </Heading>
              </div>
            </div>

            <div className="p-4">
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
                        onClick={() => fetchInterviewData()}
                        className="ml-4"
                      >
                        Retry
                      </Button>
                    </div>
                  </Alert>
                </div>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto">
                <div className="table-responsive">
                  <Table className="table table-striped table-bordered table-hover">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">S.No</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Server ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Interview Date</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-left">AC Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Interviewer ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Gender</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Audio QC Date</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Audio QC</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Audio QC ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Audio Fail Reason</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">QC Outcome</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Audio</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={13} className="px-4 py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading interview data...</p>
                          </td>
                        </tr>
                      ) : interviewData.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="px-4 py-12 text-center">
                            <div className="text-6xl text-gray-300 mb-4">📋</div>
                            <p className="text-gray-600 dark:text-gray-400">No interview data found</p>
                          </td>
                        </tr>
                      ) : (
                        interviewData.map((item, index) => (
                          <tr key={item.server_id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {(pagination.page - 1) * pagination.limit + index + 1}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center font-medium">
                              {item.server_id}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.interview_date ? formatDate(item.interview_date) : '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left">
                              {item.ac_name || '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.interviewer_id || '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {getGenderText(item.gender)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.audio_qc_complete_date ? formatDate(item.audio_qc_complete_date) : '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {getAudioQcStatusBadge(item.audio_qc_status)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.qc_id || '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center text-sm">
                              {getAudioFailReasonDisplayText(item)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {getQcOutcomeBadge(item.qc_outcome)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              <Button
                                size="sm"
                                onClick={() => handleAudioView(item.server_id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Volume2 className="w-4 h-4" />
                              </Button>
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                                onClick={() => handleEdit(item.server_id, item.ac_code)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {!loading && !error && pagination.total > 0 && (
                <div className="mt-4">
                  <PaginationStandard
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Audio Player Modal */}
      <AudioPlayerModal
        isOpen={audioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        serverId={selectedServerId}
      />
    </FluidContainer>
  );
}
