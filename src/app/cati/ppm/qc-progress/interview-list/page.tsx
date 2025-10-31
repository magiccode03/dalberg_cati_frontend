'use client';

import React, { useState, useEffect } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Alert from '@/components/ui/Alert';
import { Search, Eye, Edit, Volume2, CheckCircle, XCircle, Clock } from 'lucide-react';

// Interfaces
interface SearchFilters {
  server_id: string;
  interview_date: string;
  custom_date: string;
  custom_date_end: string;
  ac_code: string;
  interviewer_id: string;
  qc_date: string[];
  qc_id: string;
  audio_qc_status: string[];
  audio_fail_reason: string;
  qc_scenario_color: string[];
}

interface InterviewData {
  server_id: number;
  call_date: string | null;
  ac_code: number;
  ac_name: string;
  district_name: string;
  pc_name: string;
  part_no: string | null;
  poling_station_name: string | null;
  teleform_user_id: number;
  supervisor_id: number;
  resp_gender: number;
  resp_age: number;
  phone: string;
  resp_social_cat: number;
  resp_religion: number;
  qc_assign_date: string | null;
  qc_teleform_user_id: number;
  qc_rejection_level: number;
  qc_complete_date: string | null;
  qc_status: number;
  qc_scenario_color: string;
  outcome_color: string;
  q_call_status: number;
  q_consent: number | null;
  agency_id: number;
  qc: number;
  status: number;
  callid: string;
  audio_duration: number;
  start_time: string | null;
  end_time: string | null;
  gps_lat: number | null;
  gps_lng: number | null;
  gps: string;
  qc_audio_status: number;
  recordings?: Array<{
    file: string;
    time: string;
    nodeid: string;
    visitId: string;
  }>;
  audio_file?: string;
  // Additional fields that might be present
  interview_date?: string;
  interviewer_id?: string;
  audio_qc_complete_date?: string;
  audio_qc_id?: number;
  audio_label?: string;
  qc_outcome?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface FilterOptions {
  acList: Array<{ value: string; label: string }>;
  interviewerList: Array<{ value: string; label: string }>;
  qcIdList: Array<{ value: string; label: string }>;
  dateList: Array<{ value: string; label: string }>;
  audioQcStatusOptions: Array<{ value: string; label: string }>;
  audio1StatusOptions: Array<{ value: string; label: string }>;
}

const InterviewListPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    server_id: '',
    interview_date: 'all',
    custom_date: '',
    custom_date_end: '',
    ac_code: '',
    interviewer_id: '',
    qc_date: [],
    qc_id: '',
    audio_qc_status: [],
    audio_fail_reason: '',
    qc_scenario_color: [],
  });

  // State for data
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // State for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    acList: [],
    interviewerList: [],
    qcIdList: [],
    dateList: [],
    audioQcStatusOptions: [],
    audio1StatusOptions: [],
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  // Options for dropdowns
  const audioQcStatusOptions = [
    { value: '1', label: 'Pending' },
    { value: '2', label: 'Pass' },
    { value: '3', label: 'Fail' },
  ];

  const audio1StatusOptions = [
    { value: '1', label: 'Good Quality' },
    { value: '2', label: 'Poor Quality' },
    { value: '3', label: 'No Audio' },
    { value: '4', label: 'Partial Audio' },
  ];

  // Audio Fail Reason options (matching rejection report)
  const audioFailReasonOptions = [
    { value: '', label: 'Select Audio Fail Reason' },
    { value: 'survey_conversation_gender', label: 'Survey Conversation can be heard | Gender Rejection' },
    { value: 'survey_conversation_upcoming', label: 'Survey Conversation can be heard | Upcoming Election Rejection' },
    { value: 'survey_conversation_2021_ae', label: 'Survey Conversation can be heard | 2021 AE Rejection' },
    { value: 'survey_conversation_2024_election', label: 'Survey Conversation can be heard | 2024 Election Rejection' },
    { value: 'survey_conversation_cannot_hear_previous', label: 'Survey Conversation can be heard | Cannot hear the response clearly (Previous)' },
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

  const qcOutcomeOptions = [
    { value: 'blue', label: 'Pending' },
    { value: 'red', label: 'Fail' },
    { value: 'green', label: 'Pass' },
  ];

  // Generate date options
  const generateDateOptions = () => {
    const options = [];
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

  // Handlers
  const handleFilterChange = (field: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    fetchInterviewData(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchInterviewData(newPage);
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

  // Audio error handling
  const handleAudioError = () => {
    console.error('Audio playback error');
    setAudioError(true);
  };

  const handleIframeError = () => {
    console.error('Iframe audio playback error');
    setAudioError(true);
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    } catch {
      return '-';
    }
  };

  // Format date to YYYY-MM-DD format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch {
      return dateString; // Return as-is if parsing fails
    }
  };

  const getGenderText = (gender: string | number) => {
    if (gender === 1 || gender === '1' || gender === 'Male') return 'Male';
    if (gender === 2 || gender === '2' || gender === 'Female') return 'Female';
    return gender?.toString() || '-';
  };

  const getAudioQcStatusText = (status: number): string => {
    const statusMap: { [key: number]: string } = {
      1: 'Pending',
      2: 'Pass',
      3: 'Fail',
    };
    return statusMap[status] || status.toString();
  };

  const getQcOutcomeBadge = (qcScenarioColor: string, qcOutcome?: string) => {
    const outcomeMap: { [key: string]: { color: string; icon: any } } = {
      'blue': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'red': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'green': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    };
    
    const config = outcomeMap[qcScenarioColor] || { color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {qcOutcome || qcScenarioColor}
      </span>
    );
  };

  // Function to get the display text for Audio Fail Reason column
  const getAudioFailReasonDisplayText = (row: InterviewData) => {
    // qc_rejection_level can be 0 (no rejection), so check if it exists and is > 0
    if (row.qc_rejection_level === undefined || row.qc_rejection_level === null || row.qc_rejection_level === 0 || !row.qc_audio_status) {
      return '-';
    }

    const qcRejectionLevel = row.qc_rejection_level;
    const qcAudioStatus = row.qc_audio_status;

    // Handle specific mappings based on qc_rejection_level and qc_audio_status
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
    
    if (qcRejectionLevel === 1 && qcAudioStatus === 7) {
      return 'Survey Conversation can be heard | Cannot hear the response clearly (Previous)';
    }

    // Fallback to raw value if no mapping matches
    return '-';
  };

  // Fetch interview data from API
  const fetchInterviewData = async (page: number = 1) => {
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
        pageSize: pagination.limit.toString(),
        sortBy: 'server_id',
        sortOrder: 'DESC',
        interview_date: filters.interview_date || 'all', // Always include interview_date parameter
      });
      
      // Apply filters
      if (filters.server_id) {
        params.append('server_id', filters.server_id);
      }
      if (filters.interview_date === 'custom') {
        if (filters.custom_date) {
          params.append('custom_date', filters.custom_date);
        }
        if (filters.custom_date_end) {
          params.append('custom_date_end', filters.custom_date_end);
        }
      }
      if (filters.ac_code) {
        params.append('ac_code', filters.ac_code);
      }
      if (filters.interviewer_id) {
        params.append('interviewer_id', filters.interviewer_id);
      }
      // Send qc_date as repeated parameters (qc_date=2025-10-31&qc_date=2025-10-30)
      if (filters.qc_date.length > 0) {
        filters.qc_date.forEach(date => {
          params.append('qc_date', date);
        });
      }
      if (filters.qc_id) {
        params.append('qc_id', filters.qc_id);
      }
      // Send audio_qc_status as repeated parameters (audio_qc_status=1&audio_qc_status=2)
      if (filters.audio_qc_status.length > 0) {
        filters.audio_qc_status.forEach(status => {
          params.append('audio_qc_status', status);
        });
      }
      if (filters.audio_fail_reason) {
        params.append('audio_fail_reason', filters.audio_fail_reason);
      }
      if (filters.qc_scenario_color.length > 0) {
        params.append('qc_scenario_color', filters.qc_scenario_color.join(','));
      }
      
      const url = `${apiBaseUrl}/api/cati/ppm/qc/agency/progress/detail?${params.toString()}`;
      
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
        setInterviewData(result.data.interviews || []);
        setPagination({
          page: result.data.pagination?.current_page || 1,
          limit: result.data.pagination?.per_page || 10,
          total: result.data.pagination?.total_count || 0,
          totalPages: result.data.pagination?.total_pages || 0,
          hasNext: result.data.pagination?.has_next || false,
          hasPrev: result.data.pagination?.has_previous || false,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch interview data');
      }
    } catch (err) {
      console.error('Error fetching interview data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch interview data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Fetch AC list
      const acResponse = await fetch(`${apiBaseUrl}/api/cati/ac-details?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (acResponse.ok) {
        const acData = await acResponse.json();
        if (acData.success) {
          const acList = Array.isArray(acData.data?.data) ? acData.data.data : [];
          setFilterOptions(prev => ({
            ...prev,
            acList: acList.map((ac: any) => ({
              value: ac.ac_code.toString(),
              label: `${ac.ac_name} - (${ac.ac_code})`
            }))
          }));
        }
      }

      // Fetch interviewer list
      const interviewerResponse = await fetch(`${apiBaseUrl}/api/teleform-users?status=1&limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (interviewerResponse.ok) {
        const interviewerData = await interviewerResponse.json();
        if (interviewerData.success) {
          const interviewers = interviewerData.data || [];
          setFilterOptions(prev => ({
            ...prev,
            interviewerList: interviewers.map((interviewer: any) => ({
              value: interviewer.teleform_user_id.toString(),
              label: `${interviewer.name} (${interviewer.mobile_number})`
            }))
          }));
        }
      }

      // Set other options
      setFilterOptions(prev => ({
        ...prev,
        dateList: dateOptions,
        audioQcStatusOptions,
        audio1StatusOptions,
      }));

    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    fetchInterviewData(1);
  }, []);

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Interview List
        </Heading>
      </div>

      {/* Filters Card - Horizontal Layout */}
      <Card className="mb-6">
        <div className="p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="space-y-4">
              {/* First Row - Main Dropdown Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                      { value: 'all', label: 'All' },
                      { value: 'today', label: 'Today' },
                      { value: 'yesterday', label: 'Yesterday' },
                      { value: 'dby', label: 'Day Before Yesterday' },
                      { value: 'l3', label: 'Last 3 Days' },
                      { value: 'l7', label: 'Last 7 Days' },
                      { value: 'l15', label: 'Last 15 Days' },
                      { value: 'currentmonth', label: 'Current Month' },
                      { value: 'custom', label: 'Custom' },
                    ]}
                    searchable={false}
                    clearable={true}
                  />
                </div>

                {/* AC Code */}
                <div>
                  <SelectDropdown
                    value={filters.ac_code}
                    onChange={(value) => handleFilterChange('ac_code', value as string)}
                    options={[
                      { value: '', label: 'Select AC' },
                      ...filterOptions.acList
                    ]}
                    placeholder="Select AC"
                    searchable={true}
                    clearable={true}
                  />
                </div>

                {/* Interviewer ID */}
                <div>
                  <SelectDropdown
                    value={filters.interviewer_id}
                    onChange={(value) => handleFilterChange('interviewer_id', value as string)}
                    options={[
                      { value: '', label: 'Select Interviewer ID' },
                      ...filterOptions.interviewerList
                    ]}
                    placeholder="Select Interviewer ID"
                    searchable={true}
                    clearable={true}
                  />
                </div>

                {/* QC Date */}
                <div>
                  <SelectDropdown
                    value={filters.qc_date}
                    onChange={(value) => handleFilterChange('qc_date', Array.isArray(value) ? value : [value])}
                    placeholder="Select QC Date"
                    options={filterOptions.dateList}
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
                    options={[
                      { value: '', label: 'Select QC ID' },
                      ...filterOptions.qcIdList
                    ]}
                    placeholder="Select QC ID"
                    searchable={true}
                    clearable={true}
                  />
                </div>
              </div>

              {/* Custom Date Fields - Only show when custom is selected */}
              {filters.interview_date === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                      <span className="text-red-500 ml-1">*</span>
                    </Text>
                    <Input
                      type="date"
                      value={filters.custom_date}
                      onChange={(e) => handleFilterChange('custom_date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                      <span className="text-red-500 ml-1">*</span>
                    </Text>
                    <Input
                      type="date"
                      value={filters.custom_date_end}
                      onChange={(e) => handleFilterChange('custom_date_end', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Second Row - Additional Filters and Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <SelectDropdown
                    value={filters.audio_qc_status}
                    onChange={(value) => handleFilterChange('audio_qc_status', Array.isArray(value) ? value : [value])}
                    placeholder="Select Audio Status"
                    options={audioQcStatusOptions}
                    searchable={true}
                    clearable={true}
                    multiple={true}
                  />
                </div>

                {/* QC Outcome */}
                <div>
                  <SelectDropdown
                    value={filters.qc_scenario_color}
                    onChange={(value) => handleFilterChange('qc_scenario_color', Array.isArray(value) ? value : [value])}
                    placeholder="Select QC Outcome"
                    options={qcOutcomeOptions}
                    searchable={true}
                    clearable={true}
                    multiple={true}
                  />
                </div>

                {/* Search Button */}
                <div>
                  <Button 
                    type="submit"
                    variant="primary" 
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Main Content - Table */}
      <div>
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
                        onClick={() => fetchInterviewData(pagination.page)}
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
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Audio</th>
                        <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-center">Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={12} className="px-4 py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading interview data...</p>
                          </td>
                        </tr>
                      ) : interviewData.length === 0 ? (
                        <tr>
                          <td colSpan={12} className="px-4 py-12 text-center">
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
                              {item.call_date || item.interview_date ? formatDate(item.call_date || item.interview_date || '') : '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left">
                              {item.ac_name || '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.teleform_user_id || '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {getGenderText(item.resp_gender)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.qc_complete_date ? formatDate(item.qc_complete_date) : '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {item.qc_status !== undefined ? getAudioQcStatusText(item.qc_status) : '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.qc_teleform_user_id || '-'}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {getAudioFailReasonDisplayText(item)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              {item.audio_file ? (
                                <Button
                                  size="sm"
                                  onClick={() => handlePlayAudio(item.audio_file!)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                                onClick={() => {
                                  window.location.href = `/cati/ss/qc-form/edit/${item.server_id}`;
                                }}
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

      {/* Audio Modal */}
      {showAudioModal && currentAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Heading level={4} className="text-lg sm:text-xl">
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
                      No audio file available for this interview.
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
                        onError={handleIframeError}
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
                      No audio file available for this interview.
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
                <div className="mt-4 flex justify-center items-center">
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
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline ml-4"
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

export default InterviewListPage;
