'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Badge from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, Play, Map, Loader2, Volume2, X } from 'lucide-react';
import { useRejectionReport, useACDropdown, useRejectionReportFilterOptions, useInterviewerDropdown } from '@/hooks/useApi';                                                                 
import AudioPlayerModal from '@/components/modals/AudioPlayerModal';
import formConfig from '@/app/capi/capi-qc/qc-form/form-config.json';
import apiClient from '@/lib/api-client';
import { apiService } from '@/lib/api';

interface RejectionData {
  srNo: number;
  serverId: string;
  acName: string;
  psCode: string;
  interviewDate: string;
  interviewerId: string;
  interviewDuration: string;
  respondentName: string;
  // respondentMobile: string;
  failReason: string;
  audioQcId: string;
  audioFailReason: string;
  reAudioFailReason: string;
  hasAudio: boolean;
  hasGps: boolean;
  audio1: string;
  qcData?: {
    qc_audio_status?: number;
    qc_q2?: number;
    qc_q3?: number;
    qc_q4?: number;
    qc_q5?: number;
    qc_q6?: number;
    qc_q7?: number;
    qc_q8?: number;
    qc_q9?: number;
  };
}

export default function RejectionReportPage() {
  const [filters, setFilters] = useState({
    reportDays: 'all',
    customDate: '',
    customDateEnd: '',
    reportLevel: '0',
    interviewerId: '',
    enumeratorId: '',
    acCode: '',
    districtCode: '',
    pcCode: '',
    supervisorId: '',
    serverId: '',
    mobileNo: '',
    failReason: '',
    qualityreportstatus: '',
    audioFailReason: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [appliedFilters, setAppliedFilters] = useState<any>(null); // Track applied filters separately - start with null to prevent initial API call

  // Audio modal state
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<any>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<string>('');
  
  
  // Memoize the API parameters based on applied filters (not current filters)
  const apiParams = React.useMemo(() => {
    if (!appliedFilters) {
      return null;
    }

    const params: any = {
      report_days: appliedFilters.reportDays,
      report_level: appliedFilters.reportLevel,
      interviewer_id: appliedFilters.interviewerId,
      enumerator_id: appliedFilters.enumeratorId,
      district_code: appliedFilters.districtCode,
      pc_code: appliedFilters.pcCode,
      supervisor_id: appliedFilters.supervisorId,
      server_id: appliedFilters.serverId,
      mobile_no: appliedFilters.mobileNo,
      fail_reason: appliedFilters.failReason,
      qualityreportstatus: appliedFilters.qualityreportstatus,
      audio_fail_reason: appliedFilters.audioFailReason,
      page: currentPage,
      per_page: pageSize
    };

    // Only include custom_date and custom_date_end if report_days is 'custom' and they have values
    if (appliedFilters.reportDays === 'custom') {
      if (appliedFilters.customDate && appliedFilters.customDate.trim() !== '') {
        params.custom_date = appliedFilters.customDate;
      }
      if (appliedFilters.customDateEnd && appliedFilters.customDateEnd.trim() !== '') {
        params.custom_date_end = appliedFilters.customDateEnd;
      }
    }

    // Only include ac_code if it has a value
    if (appliedFilters.acCode && appliedFilters.acCode.trim() !== '') {
      params.ac_code = appliedFilters.acCode;
    }

    return params;
  }, [appliedFilters, currentPage, pageSize]);
  
  // Check if we should make the API call based on required parameters for each level
  const shouldMakeApiCall = React.useMemo(() => {
    // Don't make API call if no filters have been applied yet
    if (!appliedFilters) {
      return false;
    }

    // For custom date range: both custom_date and custom_date_end are required
    if (appliedFilters.reportDays === 'custom') {
      if (!appliedFilters.customDate || appliedFilters.customDate.trim() === '' || 
          !appliedFilters.customDateEnd || appliedFilters.customDateEnd.trim() === '') {
        return false;
      }
    }
    
    // For AC level: ac_code is required
    if ((appliedFilters.reportLevel === 'ac' || appliedFilters.reportLevel === 'polingstation') && (!appliedFilters.acCode || appliedFilters.acCode.trim() === '')) {
      return false;
    }
    
    // For Poling Station level: ac_code is required
    if (appliedFilters.reportLevel === 'polingstation' && (!appliedFilters.acCode || appliedFilters.acCode.trim() === '')) {
      return false;
    }
    
    // For Interviewer level: interviewer_id is required
    if (appliedFilters.reportLevel === 'interviewer' && (!appliedFilters.interviewerId || appliedFilters.interviewerId.trim() === '')) {
      return false;
    }
    
    return true;
  }, [appliedFilters]);

  // Fetch rejection report data from API
  const { data, loading, error, refetch } = useRejectionReport(shouldMakeApiCall ? apiParams : null);
  
  // Fetch AC dropdown data
  const { data: acDropdownData, loading: acDropdownLoading } = useACDropdown();

  // Fetch interviewer dropdown data
  const { data: interviewerDropdownData, loading: interviewerDropdownLoading } = useInterviewerDropdown();

  // Fetch filter options data
  const { data: filterOptionsData, loading: filterOptionsLoading } = useRejectionReportFilterOptions();

  // Transform AC dropdown data to options format
  const acDropdownOptions = React.useMemo(() => {
    if (!acDropdownData) return [];
    return Object.entries(acDropdownData).map(([code, name]) => ({
      value: code,
      label: `${name} (${code})`
    }));
  }, [acDropdownData]);

  // Transform interviewer dropdown data to options format
  const interviewerDropdownOptions = React.useMemo(() => {
    if (!interviewerDropdownData) return [];
    return Object.entries(interviewerDropdownData)
      .filter(([id, name]) => id !== '') // Filter out empty entries
      .map(([id, name]) => ({
        value: id,
        label: id // Show just the ID since API returns same value for key and value
      }));
  }, [interviewerDropdownData]);

  // Transform filter options data to dropdown options format
  const reportDaysOptions = React.useMemo(() => {
    if (!filterOptionsData?.report_days) {
      // Fallback options if API data is not available
      return [
        { value: 'all', label: 'All' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'dby', label: 'Day Before Yesterday' },
        { value: 'l3', label: 'Last 3 Days' },
        { value: 'l7', label: 'Last 7 Days' },
        { value: 'l15', label: 'Last 15 Days' },
        { value: 'currentmonth', label: 'Current Month' },
        { value: 'custom', label: 'Custom Date' }
      ];
    }
    return Object.entries(filterOptionsData.report_days).map(([value, label]) => ({
      value,
      label
    }));
  }, [filterOptionsData]);

  const reportLevelsOptions = React.useMemo(() => {
    if (!filterOptionsData?.report_levels) return [];
    return Object.entries(filterOptionsData.report_levels).map(([value, label]) => ({
      value,
      label
    }));
  }, [filterOptionsData]);

  const failReasonOptions = React.useMemo(() => {
    if (!filterOptionsData?.quality_statuses) return [];
    return [
      { value: '', label: 'Select Fail Reason' },
      ...Object.entries(filterOptionsData.quality_statuses).map(([value, label]) => ({
        value,
        label
      }))
    ];
  }, [filterOptionsData]);

  const audioFailReasonOptions = React.useMemo(() => {
    return [
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
  }, []);

  // Auto-load data with default parameters when component mounts
  useEffect(() => {
    // Only auto-load if no filters have been applied yet
    if (!appliedFilters) {
      setAppliedFilters(filters); // Apply default filters to load initial data
    }
  }, []); // Empty dependency array - only run once on mount

  // Handle page changes
  useEffect(() => {
    if (currentPage > 1) {
      refetch();
    }
  }, [currentPage, refetch]);

  // Handle applied filters changes - trigger refetch when filters are applied
  useEffect(() => {
    if (shouldMakeApiCall) {
      refetch();
    }
  }, [appliedFilters, refetch, shouldMakeApiCall]);


  // Transform API data to UI format
  const transformAPIData = (apiData: any[]): RejectionData[] => {
    return apiData.map((item, index) => {
      const qcData = {
        qc_audio_status: item.qc_audio_status,
        qc_q2: item.qc_q2,
        qc_q3: item.qc_q3,
        qc_q4: item.qc_q4,
        qc_q5: item.qc_q5,
        qc_q6: item.qc_q6,
        qc_q7: item.qc_q7,
        qc_q8: item.qc_q8,
        qc_q9: item.qc_q9
      };
      
      
      return {
        srNo: (currentPage - 1) * pageSize + index + 1,
        serverId: item.server_id.toString(),
        acName: item.ac_name,
        psCode: item.ps_code,
        interviewDate: new Date(item.interview_date).toISOString().split('T')[0],
        interviewerId: item.interviewer_id,
        interviewDuration: item.interview_duration_human || formatDuration(item.audio_duration),
        respondentName: item.respondent_name,
        // respondentMobile: item.mobile_no || '',
        failReason: item.fail_reason,
        audioQcId: item.qc_id?.toString() || '',
        audioFailReason: item.audio_qc_rejection_level || '',
        reAudioFailReason: item.qc_recheck_status_audio_label || '',
        hasAudio: item.audio_available,
        hasGps: item.gps_available,
        audio1: item.audio1 || '',
        // Include QC data for detailed analysis
        qcData: qcData
      };
    });
  };

  // Helper function to format duration from seconds to HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Clear AC code when level changes away from 'ac' or 'polingstation'
      if (field === 'reportLevel' && 
          !['ac', 'polingstation'].includes(value) && 
          ['ac', 'polingstation'].includes(prev.reportLevel)) {
        newFilters.acCode = '';
      }
      
      // Clear interviewer_id when level changes away from 'interviewer'
      if (field === 'reportLevel' && 
          value !== 'interviewer' && 
          prev.reportLevel === 'interviewer') {
        newFilters.interviewerId = '';
      }
      
      return newFilters;
    });
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setAppliedFilters(filters); // Apply current filters
    // The refetch will be triggered automatically by the useEffect when appliedFilters changes
  };

  const handleClear = () => {
    const defaultFilters = {
      reportDays: 'all',
      customDate: '',
      customDateEnd: '',
      reportLevel: '0',
      interviewerId: '',
      enumeratorId: '',
      acCode: '',
      districtCode: '',
      pcCode: '',
      supervisorId: '',
      serverId: '',
      mobileNo: '',
      failReason: '',
      qualityreportstatus: '',
      audioFailReason: ''
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters); // Apply default filters to reload data
    setCurrentPage(1);
  };

  const fetchAudioData = async (serverId: string, audioFileName: string) => {
    try {
      setAudioLoading(true);
      setAudioError(null);
      
      console.log('🔍 Fetching audio data for server_id:', serverId, 'audioFileName:', audioFileName);
      
      // Use the actual audio file name from the interview data, or fallback to 'audio1'
      const imageParam = audioFileName && audioFileName.trim() !== '' ? audioFileName : 'audio1';
      
      const response = await apiClient.get(`/overview/interview-log/audio-data?server_id=${serverId}&image=${imageParam}`);
      console.log('📊 Audio Data API Response:', response);
      
      if (response.data.success && response.data.data) {
        const audioData = response.data.data;
        const processedAudioData = {
          ...audioData,
          audio: audioData.audio1 && audioData.audio1.trim() !== '' 
            ? `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`
            : `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=audio1`
        };
        
        setCurrentAudio(processedAudioData);
        setShowAudioModal(true);
      } else {
        setAudioError('Failed to load audio data');
      }
    } catch (err: any) {
      console.error('❌ Error fetching audio data:', err);
      setAudioError(`Failed to load audio data: ${err.response?.data?.message || err.message}`);
    } finally {
      setAudioLoading(false);
    }
  };

  const handlePlayAudio = (serverId: string, audioFile: string) => {
    setSelectedServerId(serverId);
    setSelectedAudioFile(audioFile);
    setAudioModalOpen(true);
    setAudioError(null);
    fetchAudioData(serverId, audioFile);
  };

  const handleCloseAudioModal = () => {
    setAudioModalOpen(false);
    setSelectedServerId('');
    setSelectedAudioFile('');
    setAudioError(null);
  };

  const handleCloseModal = () => {
    setShowAudioModal(false);
    setCurrentAudio(null);
    setAudioError(null);
  };

  const handleDownloadReport = async () => {
    try {
      // Use applied filters for download parameters
      if (!appliedFilters) {
        console.error('No filters applied');
        return;
      }

      const downloadParams: any = {
        report_days: appliedFilters.reportDays,
        report_level: appliedFilters.reportLevel,
        interviewer_id: appliedFilters.interviewerId,
        enumerator_id: appliedFilters.enumeratorId,
        district_code: appliedFilters.districtCode,
        pc_code: appliedFilters.pcCode,
        supervisor_id: appliedFilters.supervisorId,
        server_id: appliedFilters.serverId,
        mobile_no: appliedFilters.mobileNo,
        fail_reason: appliedFilters.failReason,
        qualityreportstatus: appliedFilters.qualityreportstatus,
        audio_fail_reason: appliedFilters.audioFailReason
      };

      // Add custom date parameters if applicable
      if (appliedFilters.reportDays === 'custom') {
        if (appliedFilters.customDate && appliedFilters.customDate.trim() !== '') {
          downloadParams.custom_date = appliedFilters.customDate;
        }
        if (appliedFilters.customDateEnd && appliedFilters.customDateEnd.trim() !== '') {
          downloadParams.custom_date_end = appliedFilters.customDateEnd;
        }
      }

      // Add AC code if applicable
      if (appliedFilters.acCode && appliedFilters.acCode.trim() !== '') {
        downloadParams.ac_code = appliedFilters.acCode;
      }

      // Call the download API
      const blob = await apiService.downloadRejectionReport(downloadParams);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rejection-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading rejection report:', error);
      // You could add a toast notification here
    }
  };

  const getFailReasonBadge = (reason: string) => {
    if (reason.includes('N+W+RTA')) {
      return <Badge variant="error" size="sm">N+W+RTA</Badge>;
    } else if (reason.includes('Short Interview')) {
      return <Badge variant="secondary" size="sm">Short Interview</Badge>;
    } else if (reason.includes('Audio reject')) {
      return <Badge variant="outline" size="sm">Audio Reject</Badge>;
    } else if (reason.includes('System Fail')) {
      return <Badge variant="error" size="sm">System Fail</Badge>;
    } else if (reason.includes('GPS Check Fail')) {
      return <Badge variant="warning" size="sm">GPS Fail</Badge>;
    } else if (reason.includes('Audio QC Fail')) {
      return <Badge variant="outline" size="sm">Audio QC Fail</Badge>;
    }
    return <Badge variant="secondary" size="sm">{reason}</Badge>;
  };


  // Function to get the display text for Audio Fail Reason column
  const getAudioFailReasonDisplayText = (row: RejectionData) => {
    if (!row.audioFailReason || !row.qcData) {
      return row.audioFailReason?.toString() || '-';
    }

    const audioQcRejectionLevel = parseInt(row.audioFailReason.toString());
    const qcAudioStatus = row.qcData?.qc_audio_status;

    // Handle specific mappings based on audio_qc_rejection_level and qc_audio_status
    if (audioQcRejectionLevel === 2 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | Gender Rejection';
    }
    
    if (audioQcRejectionLevel === 3 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | Upcoming Election Rejection';
    }
    
    if (audioQcRejectionLevel === 4 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | 2021 AE Rejection';
    }
    
    if (audioQcRejectionLevel === 5 && qcAudioStatus === 1) {
      return 'Survey Conversation can be heard | 2024 Election Rejection';
    }
    
    if (audioQcRejectionLevel === 1 && qcAudioStatus === 2) {
      return 'No Conversation';
    }
    
    if (audioQcRejectionLevel === 1 && qcAudioStatus === 3) {
      return 'Irrelevant Conversation';
    }
    
    if (audioQcRejectionLevel === 2 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | Gender Rejection';
    }
    
    if (audioQcRejectionLevel === 3 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | Upcoming Election Rejection';
    }
    
    if (audioQcRejectionLevel === 4 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | 2021 AE Rejection';
    }
    
    if (audioQcRejectionLevel === 5 && qcAudioStatus === 4) {
      return 'Can hear the interviewer more than the respondent | 2024 Election Rejection';
    }
    
    if (audioQcRejectionLevel === 2 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | Gender Rejection';
    }
    
    if (audioQcRejectionLevel === 3 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | Upcoming Election Rejection';
    }
    
    if (audioQcRejectionLevel === 4 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | 2021 AE Rejection';
    }
    
    if (audioQcRejectionLevel === 5 && qcAudioStatus === 7) {
      return 'Cannot hear the response clearly | 2024 Election Rejection';
    }
    
    if (audioQcRejectionLevel === 1 && qcAudioStatus === 8) {
      return 'Duplicate Audio';
    }
    
    if (audioQcRejectionLevel === 1 && qcAudioStatus === 9) {
      return 'Interviewer acting as respondent';
    }
    
    if (audioQcRejectionLevel === 1 && qcAudioStatus === 10) {
      return 'Same respondent as before';
    }
    
    if (audioQcRejectionLevel === 1 && qcAudioStatus === 7) {
      return 'Survey Conversation can be heard | Cannot hear the response clearly (Previous)';
    }

    // Fallback to raw value if no mapping matches
    return row.audioFailReason?.toString() || '-';
  };


  // Extract data from API response
  const rejectionData = (data && typeof data === 'object' && 'interviews' in data && Array.isArray(data.interviews)) 
    ? transformAPIData(data.interviews) : [];
  const totalPages = (data && typeof data === 'object' && 'pagination' in data && data.pagination && typeof data.pagination === 'object' && 'total_pages' in data.pagination) 
    ? (data.pagination as any).total_pages || 0 : 0;
  const totalCount = (data && typeof data === 'object' && 'pagination' in data && data.pagination && typeof data.pagination === 'object' && 'total_count' in data.pagination) 
    ? (data.pagination as any).total_count || 0 : 0;


  // Debug logging
  console.log('API Response:', { data, loading, error });
  console.log('Transformed Data:', rejectionData);

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading rejection report data...</Text>
          </div>
        </div>
      </Container>
    );
  }


  // Show message when no search has been performed yet
  if (!appliedFilters) {
    return (
      <Container maxWidth="full">
        <Heading level={2} className="text-2xl font-semibold mb-6">
          Rejection Report
        </Heading>

        {/* Search Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2">Report Days</Text>
              <SelectDropdown
                value={filters.reportDays}
                onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
                options={reportDaysOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {filters.reportDays === 'custom' && (
              <>
                <div>
                  <Text className="block text-sm font-medium mb-2">Start Date</Text>
                  <Input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) => handleFilterChange('customDate', e.target.value)}
                  />
                </div>
                <div>
                  <Text className="block text-sm font-medium mb-2">End Date</Text>
                  <Input
                    type="date"
                    value={filters.customDateEnd}
                    onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Level</Text>
              <SelectDropdown
                value={filters.reportLevel}
                onChange={(value) => handleFilterChange('reportLevel', Array.isArray(value) ? value[0] : value)}
                options={reportLevelsOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {/* AC Code - Show immediately after Level when level is 'ac' or 'polingstation' */}
            {(filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (
              <div>
                <Text className="block text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: acDropdownLoading ? 'Loading AC List...' : 'Select All AC Code' },
                    ...acDropdownOptions
                  ]}
                  disabled={acDropdownLoading || filterOptionsLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>
            )}

            {/* Interviewer ID - Show immediately after Level when level is 'interviewer' */}
            {filters.reportLevel === 'interviewer' && (
              <div>
                <Text className="block text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: interviewerDropdownLoading ? 'Loading Interviewers...' : 'Select Interviewer ID' },
                    ...interviewerDropdownOptions
                  ]}
                  disabled={interviewerDropdownLoading || filterOptionsLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Fail Reason</Text>
              <SelectDropdown
                value={filters.qualityreportstatus}
                onChange={(value) => handleFilterChange('qualityreportstatus', Array.isArray(value) ? value[0] : value)}
                options={failReasonOptions}
                disabled={filterOptionsLoading}
                clearable={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Audio Fail Reason</Text>
              <SelectDropdown
                value={filters.audioFailReason}
                onChange={(value) => handleFilterChange('audioFailReason', Array.isArray(value) ? value[0] : value)}
                options={audioFailReasonOptions}
                clearable={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                onClick={handleClear}
                variant="outline"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Message when no search has been performed */}
        <Card>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Text className="text-blue-600 mb-4 text-lg">
                Please configure your filters and click Search to view the rejection report
              </Text>
              <Text className="text-gray-600">
                Use the filters above to specify the criteria for your rejection report search.
              </Text>
            </div>
          </div>
        </Card>
      </Container>
    );
  }

  // Show message when required parameters are missing for specific levels
  if (
    ((appliedFilters.reportLevel === 'ac' || appliedFilters.reportLevel === 'polingstation') && (!appliedFilters.acCode || appliedFilters.acCode.trim() === '')) ||
    (appliedFilters.reportLevel === 'interviewer' && (!appliedFilters.interviewerId || appliedFilters.interviewerId.trim() === ''))
  ) {
    return (
      <Container maxWidth="full">
        <Heading level={2} className="text-2xl font-semibold mb-6">
          Rejection Report
        </Heading>

        {/* Search Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2">Report Days</Text>
              <SelectDropdown
                value={filters.reportDays}
                onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
                options={reportDaysOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {filters.reportDays === 'custom' && (
              <>
                <div>
                  <Text className="block text-sm font-medium mb-2">Start Date</Text>
                  <Input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) => handleFilterChange('customDate', e.target.value)}
                  />
                </div>
                <div>
                  <Text className="block text-sm font-medium mb-2">End Date</Text>
                  <Input
                    type="date"
                    value={filters.customDateEnd}
                    onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Level</Text>
              <SelectDropdown
                value={filters.reportLevel}
                onChange={(value) => handleFilterChange('reportLevel', Array.isArray(value) ? value[0] : value)}
                options={reportLevelsOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {/* AC Code - Show immediately after Level when level is 'ac' or 'polingstation' */}
            {(filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (
              <div>
                <Text className="block text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: acDropdownLoading ? 'Loading AC List...' : 'Select All AC Code' },
                    ...acDropdownOptions
                  ]}
                  disabled={acDropdownLoading || filterOptionsLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>
            )}

            {/* Interviewer ID - Show immediately after Level when level is 'interviewer' */}
            {filters.reportLevel === 'interviewer' && (
              <div>
                <Text className="block text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: interviewerDropdownLoading ? 'Loading Interviewers...' : 'Select Interviewer ID' },
                    ...interviewerDropdownOptions
                  ]}
                  disabled={interviewerDropdownLoading || filterOptionsLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Fail Reason</Text>
              <SelectDropdown
                value={filters.qualityreportstatus}
                onChange={(value) => handleFilterChange('qualityreportstatus', Array.isArray(value) ? value[0] : value)}
                options={failReasonOptions}
                disabled={filterOptionsLoading}
                clearable={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Audio Fail Reason</Text>
              <SelectDropdown
                value={filters.audioFailReason}
                onChange={(value) => handleFilterChange('audioFailReason', Array.isArray(value) ? value[0] : value)}
                options={audioFailReasonOptions}
                clearable={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                onClick={handleClear}
                variant="outline"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Message when required parameters are missing */}
        <Card>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Text className="text-blue-600 mb-4 text-lg">
                {filters.reportLevel === 'interviewer' 
                  ? 'Please enter an Interviewer ID to view the rejection report'
                  : 'Please select an AC Code to view the rejection report'
                }
              </Text>
              <Text className="text-gray-600">
                {filters.reportLevel === 'interviewer'
                  ? 'Enter the Interviewer ID in the field above to filter the data.'
                  : 'Choose an Assembly Constituency from the dropdown above to filter the data.'
                }
              </Text>
            </div>
          </div>
        </Card>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Text className="text-red-600 mb-4">Error loading data: {error}</Text>
            <Button onClick={refetch} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="full">
        {/* Page Title */}
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Rejection Report
        </Heading>

        {/* Search Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2">Report Days</Text>
              <SelectDropdown
                value={filters.reportDays}
                onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
                options={reportDaysOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {filters.reportDays === 'custom' && (
              <>
                <div>
                  <Text className="block text-sm font-medium mb-2">Start Date</Text>
                  <Input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) => handleFilterChange('customDate', e.target.value)}
                  />
                </div>
                <div>
                  <Text className="block text-sm font-medium mb-2">End Date</Text>
                  <Input
                    type="date"
                    value={filters.customDateEnd}
                    onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Level</Text>
              <SelectDropdown
                value={filters.reportLevel}
                onChange={(value) => handleFilterChange('reportLevel', Array.isArray(value) ? value[0] : value)}
                options={reportLevelsOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {/* AC Code - Show immediately after Level when level is 'ac' or 'polingstation' */}
            {(filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (
              <div>
                <Text className="block text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: acDropdownLoading ? 'Loading AC List...' : 'Select All AC Code' },
                    ...acDropdownOptions
                  ]}
                  disabled={acDropdownLoading || filterOptionsLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>
            )}

            {/* Interviewer ID - Show immediately after Level when level is 'interviewer' */}
            {filters.reportLevel === 'interviewer' && (
              <div>
                <Text className="block text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: interviewerDropdownLoading ? 'Loading Interviewers...' : 'Select Interviewer ID' },
                    ...interviewerDropdownOptions
                  ]}
                  disabled={interviewerDropdownLoading || filterOptionsLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Fail Reason</Text>
              <SelectDropdown
                value={filters.qualityreportstatus}
                onChange={(value) => handleFilterChange('qualityreportstatus', Array.isArray(value) ? value[0] : value)}
                options={failReasonOptions}
                disabled={filterOptionsLoading}
                clearable={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Audio Fail Reason</Text>
              <SelectDropdown
                value={filters.audioFailReason}
                onChange={(value) => handleFilterChange('audioFailReason', Array.isArray(value) ? value[0] : value)}
                options={audioFailReasonOptions}
                clearable={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                onClick={handleClear}
                variant="outline"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Rejection Report Table */}
        <Card className="">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-blue-500 mr-3"></div>  
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">Rejection Report</Heading>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadReport}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
              Total <span className="font-bold text-black dark:text-white">{totalCount.toLocaleString()}</span> items
            </div>
          </div>
          
          <div className="summary mb-4">
            <Text className="text-sm text-gray-600">
              Total <b>{totalCount}</b> items.
            </Text>
          </div>
          

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Server ID</th>
                  <th className="text-center">AC Name</th>
                  <th className="text-center">PS Code</th>
                  <th className="text-center">Interview Date</th>
                  <th className="text-center">Interviewer ID</th>
                  <th className="text-center">Interview Duration</th>
                  <th className="text-center">Respondent Name</th>
                  <th className="text-center">Respondent Mobile</th>
                  <th className="text-center">Fail Reason</th>
                  <th className="text-center">Audio QC ID</th>
                  <th className="text-center">Audio Fail Reason</th>
                  <th className="text-left">QC Remark</th>
                  <th className="text-center">Audio</th>
                  <th className="text-center">GPS</th>
                </tr>
              </thead>
              <tbody>
                {rejectionData.map((row) => (
                  <tr key={row.srNo}>
                    <td className="text-center">{row.srNo}</td>
                    <td className="text-center">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {row.serverId}
                      </span>
                    </td>
                    <td>{row.acName}</td>
                    <td className="font-mono">{row.psCode}</td>
                    <td>{row.interviewDate}</td>
                    <td>{row.interviewerId}</td>
                    <td className="font-mono">{row.interviewDuration}</td>
                    <td>{row.respondentName}</td>
                    {/* <td>{row.respondentMobile || '-'}</td> */}
                    <td>{row.failReason}</td>
                    <td>{row.audioQcId || '-'}</td>
                    <td>
                      <div className="max-w-xs">
                        <span className="text-gray-900 dark:text-gray-100 text-sm">
                          {getAudioFailReasonDisplayText(row)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="max-w-xs">
                        <span className="text-gray-900 dark:text-gray-100 text-sm">
                          {row.qcData?.qc_q9 || '-'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                        title="Play Audio"
                        onClick={() => handlePlayAudio(row.serverId, row.audio1)}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                        title="GPS Map"
                      >
                        <Map className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

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
        </Card>

        {/* Audio Player Modal */}
        <AudioPlayerModal
          isOpen={audioModalOpen}
          onClose={handleCloseAudioModal}
          serverId={selectedServerId}
          audioFileName={selectedAudioFile}
        />

      </Container>
  );
}
