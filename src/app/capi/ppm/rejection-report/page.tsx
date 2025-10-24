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
    qualityreportstatus: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [appliedFilters, setAppliedFilters] = useState<any>(null); // Track applied filters separately - start with null to prevent initial API call

  // Audio modal state
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<string>('');
  
  // QC details state
  const [qcDetailsCache, setQcDetailsCache] = useState<Record<string, string>>({});
  const [loadingQcDetails, setLoadingQcDetails] = useState<Set<string>>(new Set());
  const [qcDetailsModalOpen, setQcDetailsModalOpen] = useState(false);
  const [qcDetailsContent, setQcDetailsContent] = useState('');
  const [qcDetailsLoaded, setQcDetailsLoaded] = useState<Set<string>>(new Set());
  
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
        interviewDuration: item.interview_duration_human || formatDuration(item.total_duration),
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
      qualityreportstatus: ''
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters); // Apply default filters to reload data
    setCurrentPage(1);
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

    const cacheKey = `${row.serverId}_${row.audioFailReason}`;
    const cachedDetails = qcDetailsCache[cacheKey];
    
    if (cachedDetails) {
      // Extract the selected option from the cached details
      const lines = cachedDetails.split('\n');
      const selectedOptionLine = lines.find(line => line.startsWith('Selected Option: '));
      if (selectedOptionLine) {
        const selectedOption = selectedOptionLine.replace('Selected Option: ', '');
        return selectedOption;
      }
    }
    
    // If no cached details, try to get the option text directly from QC data
    const levelStr = row.audioFailReason?.toString() || '';
    let qcQuestion;
    let qcAnswer;
    
    console.log('Debug Audio Fail Reason:', {
      levelStr,
      qcData: row.qcData,
      serverId: row.serverId
    });
    
    if (levelStr === '1') {
      qcQuestion = formConfig.find(q => q.tag === 'qc_audio_status');
      qcAnswer = row.qcData?.qc_audio_status;
    } else if (levelStr === '4') {
      qcQuestion = formConfig.find(q => q.tag === 'qc_q4');
      qcAnswer = row.qcData?.qc_q4;
    } else {
      qcQuestion = formConfig.find(q => q.key.toString() === levelStr);
      qcAnswer = (row.qcData as any)?.[`qc_q${levelStr}`];
    }
    
    console.log('Debug QC Question and Answer:', {
      qcQuestion: qcQuestion ? { key: qcQuestion.key, tag: qcQuestion.tag, label: qcQuestion.label } : null,
      qcAnswer,
      hasOptions: qcQuestion?.options ? qcQuestion.options.length : 0
    });
    
    if (qcQuestion && qcAnswer !== undefined && qcAnswer !== null) {
      // Handle special case where qcAnswer is 0 (not answered)
      if (qcAnswer === 0) {
        console.log('Debug QC Answer is 0 - Not answered');
        return 'Not Answered';
      }
      
      const selectedOption = qcQuestion.options?.find((opt: any) => opt.value === qcAnswer.toString());
      console.log('Debug Selected Option:', {
        selectedOption,
        qcAnswerString: qcAnswer.toString(),
        allOptions: qcQuestion.options?.map(opt => ({ value: opt.value, label: opt.label }))
      });
      
      if (selectedOption) {
        const optionLabel = typeof selectedOption.label === 'string' ? selectedOption.label : selectedOption.label?.en || '';
        console.log('Debug Final Label:', optionLabel);
        return optionLabel;
      }
    }
    
    // Fallback to raw value
    console.log('Debug Fallback to raw value:', row.audioFailReason?.toString());
    return row.audioFailReason?.toString() || '-';
  };

  // Function to load QC details for display (without showing modal)
  const loadQCDetailsForDisplay = async (serverId: string, audioQcRejectionLevel: string | number, qcData: any) => {
    const cacheKey = `${serverId}_${audioQcRejectionLevel}`;
    
    // Check if already cached
    if (qcDetailsCache[cacheKey]) {
      setQcDetailsLoaded(prev => new Set(prev).add(cacheKey));
      return;
    }
    
    // Check if already loading
    if (loadingQcDetails.has(cacheKey)) {
      return;
    }
    
    // Mark as loading
    setLoadingQcDetails(prev => new Set(prev).add(cacheKey));
    
    try {
      const details = await getDetailedQCInfo(serverId, audioQcRejectionLevel, qcData);
      
      // Cache the result
      setQcDetailsCache(prev => ({
        ...prev,
        [cacheKey]: details
      }));
      
      // Mark as loaded
      setQcDetailsLoaded(prev => new Set(prev).add(cacheKey));
    } catch (error) {
      console.error('Error loading QC details:', error);
    } finally {
      // Remove from loading set
      setLoadingQcDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(cacheKey);
        return newSet;
      });
    }
  };

  // Function to load QC details and show modal
  const loadQCDetails = async (serverId: string, audioQcRejectionLevel: string | number, qcData: any) => {
    const cacheKey = `${serverId}_${audioQcRejectionLevel}`;
    
    console.log('loadQCDetails called with:', { serverId, audioQcRejectionLevel, qcData, cacheKey });
    console.log('Current cache:', qcDetailsCache);
    
    // Check if already cached
    if (qcDetailsCache[cacheKey]) {
      console.log('Using cached details for modal:', qcDetailsCache[cacheKey]);
      setQcDetailsContent(qcDetailsCache[cacheKey]);
      setQcDetailsModalOpen(true);
      return;
    }
    
    // Check if already loading
    if (loadingQcDetails.has(cacheKey)) {
      console.log('Already loading details for:', cacheKey);
      return;
    }
    
    // Mark as loading
    setLoadingQcDetails(prev => new Set(prev).add(cacheKey));
    
    try {
      console.log('Fetching new details for:', cacheKey);
      const details = await getDetailedQCInfo(serverId, audioQcRejectionLevel, qcData);
      console.log('Fetched details:', details);
      
      // Cache the result
      setQcDetailsCache(prev => ({
        ...prev,
        [cacheKey]: details
      }));
      
      // Show modal with details
      setQcDetailsContent(details);
      setQcDetailsModalOpen(true);
    } catch (error) {
      console.error('Error loading QC details:', error);
      setQcDetailsContent('Error loading details');
      setQcDetailsModalOpen(true);
    } finally {
      // Remove from loading set
      setLoadingQcDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(cacheKey);
        return newSet;
      });
    }
  };

  // Function to get detailed QC information
  const getDetailedQCInfo = async (serverId: string, audioQcRejectionLevel: string | number, qcData: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return 'Authentication required';

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Fetch instance data
      const response = await fetch(`${apiBaseUrl}/api/capi/instance/${serverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success || !data.data) {
        return 'Failed to load instance data';
      }

      const instanceData = data.data;
      const levelStr = audioQcRejectionLevel?.toString() || '';

      // Find the QC question based on rejection level
      let qcQuestion;
      let qcAnswer;
      
      if (levelStr === '1') {
        // Level 1 corresponds to qc_audio_status
        qcQuestion = formConfig.find(q => q.tag === 'qc_audio_status');
        qcAnswer = qcData.qc_audio_status;
      } else {
        // Other levels correspond to qc_q{level}
        qcQuestion = formConfig.find(q => q.key.toString() === levelStr);
        qcAnswer = qcData[`qc_q${levelStr}`];
      }
      
      if (!qcQuestion) {
        return `Level ${levelStr}`;
      }

      if (qcAnswer === undefined || qcAnswer === null) {
        return `Level ${levelStr}`;
      }

      // Handle special case where qcAnswer is 0 (not answered)
      if (qcAnswer === 0) {
        return `Level ${levelStr} - Not Answered`;
      }

      // Find the selected QC option
      const selectedQCOption = qcQuestion.options?.find((opt: any) => opt.value === qcAnswer.toString());
      if (!selectedQCOption) {
        return `Level ${levelStr}`;
      }

      // Get survey answer
      let surveyAnswer = '';
      if (qcQuestion.survey_q_tag) {
        if (typeof qcQuestion.survey_q_tag === 'string') {
          // Simple string tag
          surveyAnswer = instanceData[qcQuestion.survey_q_tag] || '';
        } else if (typeof qcQuestion.survey_q_tag === 'object' && qcQuestion.survey_q_tag.tag && qcQuestion.survey_q_tag.options) {
          // Object with tag and options
          const surveyValue = instanceData[qcQuestion.survey_q_tag.tag];
          const matchingOption = qcQuestion.survey_q_tag.options.find((opt: any) => opt.value == surveyValue);
          if (matchingOption && matchingOption.lable) {
            surveyAnswer = matchingOption.lable.en || '';
          } else {
            surveyAnswer = surveyValue || '';
          }
        }
      }

      // Format the result
      const questionLabel = typeof qcQuestion.label === 'string' ? qcQuestion.label : qcQuestion.label.en || '';
      const selectedOptionLabel = typeof selectedQCOption.label === 'string' ? selectedQCOption.label : selectedQCOption.label.en || '';

      return `${questionLabel}\nRespondent: ${surveyAnswer}\nSelected Option: ${selectedOptionLabel}`;

    } catch (error) {
      console.error('Error fetching detailed QC info:', error);
      return `Level ${audioQcRejectionLevel}`;
    }
  };

  // Extract data from API response
  const rejectionData = (data && typeof data === 'object' && 'interviews' in data && Array.isArray(data.interviews)) 
    ? transformAPIData(data.interviews) : [];
  const totalPages = (data && typeof data === 'object' && 'pagination' in data && data.pagination && typeof data.pagination === 'object' && 'total_pages' in data.pagination) 
    ? (data.pagination as any).total_pages || 0 : 0;
  const totalCount = (data && typeof data === 'object' && 'pagination' in data && data.pagination && typeof data.pagination === 'object' && 'total_count' in data.pagination) 
    ? (data.pagination as any).total_count || 0 : 0;

  // Auto-load QC details when rejection data changes
  useEffect(() => {
    if (rejectionData && rejectionData.length > 0) {
      rejectionData.forEach((row) => {
        if (row.audioFailReason && row.qcData) {
          const cacheKey = `${row.serverId}_${row.audioFailReason}`;
          if (!qcDetailsLoaded.has(cacheKey) && !loadingQcDetails.has(cacheKey)) {
            loadQCDetailsForDisplay(row.serverId, row.audioFailReason, row.qcData);
          }
        }
      });
    }
  }, [rejectionData, qcDetailsLoaded, loadingQcDetails]);

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
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            {/* <div>
              <Text className="block text-sm font-medium mb-2">Respondent Mobile</Text>
              <Input
                type="text"
                placeholder="Search by Mobile Number"
                value={filters.mobileNo}
                onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
              />
            </div> */}

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
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            {/* <div>
              <Text className="block text-sm font-medium mb-2">Respondent Mobile</Text>
              <Input
                type="text"
                placeholder="Search by Mobile Number"
                value={filters.mobileNo}
                onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
              />
            </div> */}

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
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            {/* <div>
              <Text className="block text-sm font-medium mb-2">Respondent Mobile</Text>
              <Input
                type="text"
                placeholder="Search by Mobile Number"
                value={filters.mobileNo}
                onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
              />
            </div> */}

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
            <div className="flex items-center mb-2">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>  
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">Rejection Report</Heading>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
              Total <span className="font-bold text-black dark:text-white">{totalCount.toLocaleString()}</span> items
            </div>
          </div>
          

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">Sr. No</th>
                  <th className="text-center">Server ID</th>
                  <th className="text-left">AC Name</th>
                  <th className="text-center">PS Code</th>
                  <th className="text-center">Interview Date</th>
                  <th className="text-center">Interviewer ID</th>
                  <th className="text-center">Interview Duration</th>
                  <th className="text-left">Respondent Name</th>
                  {/* <th className="text-center">Respondent Mobile</th> */}
                  <th className="text-left">Fail Reason</th>
                  <th className="text-center">Audio QC ID</th>
                  <th className="text-left">Audio Fail Reason</th>
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
                        {row.audioFailReason && row.qcData ? (
                          <button
                            onClick={() => loadQCDetails(row.serverId, row.audioFailReason, row.qcData)}
                            className="text-left text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 underline cursor-pointer px-2 py-1 rounded transition-colors duration-200"
                            title="Click to view detailed QC information"
                          >
                            {getAudioFailReasonDisplayText(row)}
                          </button>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400">
                            {row.audioFailReason?.toString() || '-'}
                          </span>
                        )}
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

        {/* QC Details Modal */}
        {qcDetailsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
                  QC Details
                </Heading>
                <button
                  onClick={() => setQcDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                {qcDetailsContent}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setQcDetailsModalOpen(false)}
                  variant="outline"
                  className="bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
  );
}
