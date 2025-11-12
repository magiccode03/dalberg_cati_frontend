'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Alert from '@/components/ui/Alert';
import { Search, Users, Clock, PhoneCall, PhoneOff, CheckCircle } from 'lucide-react';
import Audio from '@/components/ui/Audio';

// Interfaces
interface SearchFilters {
  reportDays: string;
  customDate: string;
  customDateEnd: string;
  telecaller: string;
  callerResponse: string;
  apiResponse: string;
  callReceived: string;
  talkDurationOver2: boolean;
}

interface CallDetailData {
  id: number;
  caller_id: number;
  caller_name: string;
  phone: string;
  ac_code: number;
  call_time: string | null;
  call_received: number;
  ivr_duration: number | null;
  talk_duration: number | null;
  audio: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PerformanceMetrics {
  totalCallers: number;
  daysTillNow: number;
  numberOfDials: number;
  totalIvrDuration: string;
  callerDidNotPick: number;
  totalTalkDuration: string;
}

interface CallOutcomeMetrics {
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  respondentPickedCall: number;
  pickedAndRefused: number;
  totalNumberExhausted: number;
  pickedAndCallContinue: number;
}

const TelecallerDailyCallDetailPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    reportDays: 'today',
    customDate: '',
    customDateEnd: '',
    telecaller: '',
    callerResponse: '',
    apiResponse: '',
    callReceived: '',
    talkDurationOver2: false,
  });

  // State for performance metrics
  const [performanceMetrics] = useState<PerformanceMetrics>({
    totalCallers: 0,
    daysTillNow: 0,
    numberOfDials: 0,
    totalIvrDuration: '00:00:00',
    callerDidNotPick: 0,
    totalTalkDuration: '00:00:00',
  });

  const [callOutcomeMetrics] = useState<CallOutcomeMetrics>({
    numberDoesNotExist: 0,
    respondentDidNotPick: 0,
    respondentPickedCall: 0,
    pickedAndRefused: 0,
    totalNumberExhausted: 0,
    pickedAndCallContinue: 0,
  });

  // API state for call details
  const [callDetailData, setCallDetailData] = useState<CallDetailData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  // Options for dropdowns
  const reportDaysOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'dby', label: 'Day Before Yesterday' },
    { value: 'l3', label: 'Last 3 Days' },
    { value: 'l7', label: 'Last 7 Days' },
    { value: 'l15', label: 'Last 15 Days' },
    { value: 'currentmonth', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date' },
  ];

  const telecallerOptions = [
    { value: '', label: 'Select Telecaller' },
    { value: 'tc001', label: 'John Doe' },
    { value: 'tc002', label: 'Jane Smith' },
    { value: 'tc003', label: 'Mike Johnson' },
  ];

  const callerResponseOptions = [
    { value: '', label: 'Select Caller Response' },
    { value: '1', label: 'Picked and Call Continue' },
    { value: '2', label: 'Number does not exist' },
    { value: '3', label: 'Respondent did not pick' },
    { value: '4', label: 'Picked and Refused' },
    { value: '10', label: 'Form Not Fill' },
  ];

  const apiResponseOptions = [
    { value: '', label: 'Select API Response' },
    { value: '3', label: 'Both Answered (Respondent Picked the call)' },
    { value: '4', label: 'To Ans. - From Unans. (Respondent did not pick)' },
    { value: '7', label: 'From Unanswered (Caller did not pick)' },
  ];

  const callReceivedOptions = [
    { value: '', label: 'Select Call Received' },
    { value: '2', label: 'No' },
    { value: '1', label: 'Yes' },
  ];

  // Generate date options
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Date' }];
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
  const handleFilterChange = (field: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    fetchCallDetails(1);
  };

  // Fetch call details from API
  const fetchCallDetails = async (page: number = 1) => {
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
      const response = await fetch(
        `${apiBaseUrl}/api/cati/interviews/call-details?page=${page}&limit=${pagination.limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setCallDetailData(result.data.data || []);
        setPagination(result.data.pagination || pagination);
      } else {
        throw new Error(result.message || 'Failed to fetch call details');
      }
    } catch (err) {
      console.error('Error fetching call details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch call details');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCallDetails(newPage);
  };

  const handlePlayAudio = (audioUrl: string) => {
    setCurrentAudio(audioUrl);
    setShowAudioModal(true);
  };

  const handleCloseAudioModal = () => {
    setShowAudioModal(false);
    setCurrentAudio(null);
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '-';
    try {
      return new Date(dateTime).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  useEffect(() => {
    fetchCallDetails(1);
  }, []);

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    bgColor = 'bg-blue-500',
    iconColor = 'text-white'
  }: {
    icon: any;
    title: string;
    value: string | number;
    bgColor?: string;
    iconColor?: string;
  }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-bold text-gray-900">
          Daily Call Detail <span className='text-5xl'>(coming soon)</span>
        </Heading>
        <div className="text-sm text-gray-500">
          {/* Additional header content if needed */}
        </div>
      </div>

      {/* Search Filters */}
      {/* <Card className="p-6 mb-5">
        <div className="flex flex-wrap items-end gap-4">
      
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Days
            </label>
            <SelectDropdown
              value={filters.reportDays}
              onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
              options={reportDaysOptions}
              placeholder="Select Report Days"
            />
          </div>

          {filters.reportDays === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <SelectDropdown
                value={filters.customDate}
                onChange={(value) => handleFilterChange('customDate', Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

    
          {filters.reportDays === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <SelectDropdown
                value={filters.customDateEnd}
                onChange={(value) => handleFilterChange('customDateEnd', Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

    
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telecaller
            </label>
            <SelectDropdown
              value={filters.telecaller}
              onChange={(value) => handleFilterChange('telecaller', Array.isArray(value) ? value[0] : value)}
              options={telecallerOptions}
              placeholder="Select Telecaller"
            />
          </div>

       
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caller Response
            </label>
            <SelectDropdown
              value={filters.callerResponse}
              onChange={(value) => handleFilterChange('callerResponse', Array.isArray(value) ? value[0] : value)}
              options={callerResponseOptions}
              placeholder="Select Caller Response"
            />
          </div>

       
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Response
            </label>
            <SelectDropdown
              value={filters.apiResponse}
              onChange={(value) => handleFilterChange('apiResponse', Array.isArray(value) ? value[0] : value)}
              options={apiResponseOptions}
              placeholder="Select API Response"
            />
          </div>

      
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Received
            </label>
            <SelectDropdown
              value={filters.callReceived}
              onChange={(value) => handleFilterChange('callReceived', Array.isArray(value) ? value[0] : value)}
              options={callReceivedOptions}
              placeholder="Select Call Received"
            />
          </div>

      
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talk Duration (&gt;=2 Min)
            </label>
            <div className="mt-2">
              <Checkbox
                checked={filters.talkDurationOver2}
                onCheckedChange={(checked) => handleFilterChange('talkDurationOver2', checked)}
                label="Talk Duration"
              />
            </div>
          </div>

     
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </Card> */}

      {/* Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
        {/* Caller Performance */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Caller Performance (coming soon)
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={Users}
              title="Total Callers"
              value={performanceMetrics.totalCallers}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={Clock}
              title="Days till now"
              value={performanceMetrics.daysTillNow}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Number of dials"
              value={performanceMetrics.numberOfDials}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={Clock}
              title="Total IVR Duration"
              value={performanceMetrics.totalIvrDuration}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Caller did not pick"
              value={performanceMetrics.callerDidNotPick}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Total Talk Duration"
              value={performanceMetrics.totalTalkDuration}
              bgColor="bg-blue-500"
            />
          </div>
        </Card>

        {/* Call Outcome */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-green-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Call Outcome (coming soon)
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={PhoneOff}
              title="Number does not exist"
              value={callOutcomeMetrics.numberDoesNotExist}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Respondent did not pick"
              value={callOutcomeMetrics.respondentDidNotPick}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Respondent Picked the call"
              value={callOutcomeMetrics.respondentPickedCall}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Picked and Refused"
              value={callOutcomeMetrics.pickedAndRefused}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Total Number Exhausted"
              value={callOutcomeMetrics.totalNumberExhausted}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Picked and Call Continue"
              value={callOutcomeMetrics.pickedAndCallContinue}
              bgColor="bg-green-500"
            />
          </div>
        </Card>
      </div>

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
                onClick={() => fetchCallDetails(pagination.page)}
                className="ml-4"
              >
                <i className="fa fa-refresh mr-2"></i>
                Retry
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Call Detail
            </Heading>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{pagination.total.toLocaleString()}</strong> items.
            </Text>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <i className="fa fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Loading call details...</p>
            </div>
          ) : callDetailData.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa fa-inbox text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">No call details found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-left">Caller Name</th>
                    <th className="text-center">Caller ID</th>
                    <th className="text-left">Call Time</th>
                    <th className="text-center">Call Received</th>
                    <th className="text-center">Caller Response</th>
                    <th className="text-center">API Response</th>
                    <th className="text-center">IVR Duration</th>
                    <th className="text-center">Talk Duration</th>
                    <th className="text-center">Audio file</th>
                  </tr>
                </thead>
                <tbody>
                  {callDetailData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td className="text-left">{item.caller_name || '-'}</td>
                      <td className="text-center">{item.caller_id || '-'}</td>
                      <td className="text-left">{formatDateTime(item.call_time)}</td>
                      <td className="text-center">
                        {item.call_received === 1 ? 'Yes' : item.call_received === 0 ? 'No' : '-'}
                      </td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">{formatDuration(item.ivr_duration)}</td>
                      <td className="text-center">{formatDuration(item.talk_duration)}</td>
                      <td className="text-center">
                        {item.audio ? (
                          <Button
                            size="sm"
                            onClick={() => handlePlayAudio(item.audio!)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <i className="fa fa-play mr-1"></i>
                            Play
                          </Button>
                        ) : (
                          '-'
                        )}
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
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Card>

      {/* Audio Modal */}
      {showAudioModal && currentAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Heading level={4} className="text-lg sm:text-xl">
                <i className="fa fa-headphones mr-2 text-blue-600"></i>
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
            <div className="p-6 space-y-4">
              {/* Audio Player */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
                <Audio
                  src={currentAudio}
                  autoPlay={true}
                  onPlay={() => console.log('Audio started playing')}
                  onPause={() => console.log('Audio paused')}
                  onTimeUpdate={(currentTime, duration) => {
                    console.log(`Progress: ${((currentTime / duration) * 100).toFixed(1)}%`);
                  }}
                  onEnded={() => {
                    console.log('Audio playback ended');
                    // Optionally auto-close modal after a delay
                    setTimeout(() => {
                      handleCloseAudioModal();
                    }, 2000);
                  }}
                  onError={(error) => {
                    console.error('Audio error:', error);
                  }}
                  className="border border-gray-200 dark:border-gray-600"
                />
              </div>

              {/* Download and External Links */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <a
                  href={currentAudio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                >
                  <i className="fa fa-external-link mr-2"></i>
                  Open in New Tab
                </a>
                <a
                  href={currentAudio}
                  download
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                >
                  <i className="fa fa-download mr-2"></i>
                  Download Audio
                </a>
              </div>

              {/* Audio URL Info */}
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs break-all">
                <strong>Audio URL:</strong> {currentAudio}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default TelecallerDailyCallDetailPage;
