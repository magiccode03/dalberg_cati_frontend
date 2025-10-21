'use client';

import React, { useState, useEffect } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Calendar, BarChart3, Phone, Clock, Users, TrendingUp, TrendingDown, Activity, Filter } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

// Interface for performance metrics
interface PerformanceMetrics {
  number_status: {
    call_not_received_to_telecaller: number;
    ringing: number;
    not_ringing: number;
  };
  call_not_ring_status: {
    switch_off: number;
    number_not_reachable: number;
    number_does_not_exist: number;
    call_not_ring_no_response: number;
  };
  call_ring_status: {
    picked: number;
    did_not_picked: number;
    call_ring_no_response: number;
  };
  call_status: {
    continue: number;
    refuse_to_respond: number;
    call_back_later: number;
  };
  caller_performance: {
    total_callers: number;
    number_of_dials_attempted: number;
    number_of_calls_connected: number;
    total_talk_duration: string;
  };
  interview_metrics: {
    successful: number;
    terminated: number;
    incompleted: number;
  };
  status_metrics: {
    tele_no_response: number;
    partial_system: number;
    partial_tele: number;
    submitted: number;
  };
}

// Day-wise performance interface
interface DayWisePerformance {
  date: string;
  metrics: PerformanceMetrics;
}

// Telecaller interface
interface Telecaller {
  teleform_user_id: number;
  name: string;
  mobile_number: string;
}

// AC interface
interface ACData {
  ac_code: number;
  ac_name: string;
  district_name: string;
}

const TelecallerProgressPage: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [dayWiseData, setDayWiseData] = useState<DayWisePerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overall' | 'daywise'>('overall');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Telecaller filter states
  const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
  const [selectedTelecaller, setSelectedTelecaller] = useState<string>('all');
  const [loadingTelecallers, setLoadingTelecallers] = useState(false);
  
  // AC filter states
  const [acList, setAcList] = useState<ACData[]>([]);
  const [selectedAC, setSelectedAC] = useState<string>('all');
  const [loadingACs, setLoadingACs] = useState(false);

  // Fetch performance data
  const fetchPerformanceData = async (date?: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with filters
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (selectedTelecaller !== 'all') params.append('teleform_user_id', selectedTelecaller);
      if (selectedAC !== 'all') params.append('ac_code', selectedAC);
      
      const url = `${apiUrl}/api/cati/telecaller-metrics${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('API endpoint not available. Please check if the backend server is running.');
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        if (viewMode === 'overall') {
          setMetrics(result.data);
        } else {
          setDayWiseData(result.data);
        }
        setError(null); // Clear any previous errors
      } else {
        setError(result.message || 'Failed to fetch performance data');
      }
    } catch (err: any) {
      console.error('Error fetching performance data:', err);
      
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('An error occurred while fetching performance data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch day-wise data
  const fetchDayWiseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with filters for day-wise data
      const params = new URLSearchParams();
      if (selectedTelecaller !== 'all') params.append('teleform_user_id', selectedTelecaller);
      if (selectedAC !== 'all') params.append('ac_code', selectedAC);
      params.append('days', '7'); // Default to 7 days
      
      const url = `${apiUrl}/api/cati/telecaller-metrics/daywise${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('Day-wise API endpoint not available. Please check if the backend server is running.');
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        setDayWiseData(result.data);
        setError(null); // Clear any previous errors
      } else {
        setError(result.message || 'Failed to fetch day-wise performance data');
      }
    } catch (err: any) {
      console.error('Error fetching day-wise data:', err);
      
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('An error occurred while fetching day-wise performance data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch telecallers list
  const fetchTelecallers = async () => {
    setLoadingTelecallers(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiUrl}/api/teleform-users?status=1&limit=1000`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok && result.success) {
          setTelecallers(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching telecallers:', err);
    } finally {
      setLoadingTelecallers(false);
    }
  };

  // Fetch AC list
  const fetchACList = async () => {
    setLoadingACs(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiUrl}/api/cati/ac-details?limit=1000`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok && result.success) {
          const acData = Array.isArray(result.data?.data) ? result.data.data : [];
          setAcList(acData);
        }
      }
    } catch (err) {
      console.error('Error fetching AC list:', err);
    } finally {
      setLoadingACs(false);
    }
  };

  // Fetch telecallers and ACs on mount
  useEffect(() => {
    fetchTelecallers();
    fetchACList();
  }, []);

  // Fetch data when view mode, telecaller, or AC changes
  useEffect(() => {
    if (viewMode === 'overall') {
      fetchPerformanceData();
    } else {
      fetchDayWiseData();
    }
  }, [viewMode, selectedTelecaller, selectedAC]);

  const formatDuration = (duration: string) => {
    return duration || '00:00:00';
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    textColor?: string;
  }> = ({ title, value, icon, color, bgColor, textColor = 'text-white' }) => (
    <div className={`${bgColor} rounded-lg p-3 md:p-4 border-l-4 ${color} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-xs md:text-sm font-medium ${textColor} opacity-90 truncate`}>{title}</p>
          <p className={`text-lg md:text-2xl font-bold ${textColor} mt-1 break-all`}>{value}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
        {icon}
      </div>
      <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </Heading>
    </div>
  );

  const renderMetrics = (data: PerformanceMetrics | null) => {
    // Helper function to safely get value or show placeholder
    const getValue = (value: any) => {
      if (value === null || value === undefined) return '—';
      return value;
    };

    return (
      <>
        {/* Caller Performance Section */}
        <div className="mb-8">
          <SectionHeader title="CALLER PERFORMANCE" icon={<Activity className="h-6 w-6 text-blue-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Total Callers"
              value={getValue(data?.caller_performance?.total_callers)}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              color="border-blue-500"
              bgColor="bg-blue-500"
            />
            <MetricCard
              title="Number of Dials Attempted"
              value={getValue(data?.caller_performance?.number_of_dials_attempted)}
              icon={<Phone className="h-6 w-6 text-orange-600" />}
              color="border-orange-500"
              bgColor="bg-orange-500"
            />
            <MetricCard
              title="Number of Calls Connected"
              value={getValue(data?.caller_performance?.number_of_calls_connected)}
              icon={<Phone className="h-6 w-6 text-indigo-600" />}
              color="border-indigo-500"
              bgColor="bg-indigo-500"
            />
            <MetricCard
              title="Total Talk Duration"
              value={data?.caller_performance?.total_talk_duration ? formatDuration(data.caller_performance.total_talk_duration) : '—'}
              icon={<Clock className="h-6 w-6 text-emerald-600" />}
              color="border-emerald-500"
              bgColor="bg-emerald-500"
            />
          </div>
        </div>

        {/* Number Status Section */}
        <div className="mb-8">
          <SectionHeader title="NUMBER STATUS" icon={<BarChart3 className="h-6 w-6 text-blue-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Call Not Received to Telecaller"
              value={getValue(data?.number_status?.call_not_received_to_telecaller)}
              icon={<Phone className="h-6 w-6 text-gray-500" />}
              color="border-gray-400"
              bgColor="bg-gray-400"
            />
            <MetricCard
              title="Ringing"
              value={getValue(data?.number_status?.ringing)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="Not Ringing"
              value={getValue(data?.number_status?.not_ringing)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.caller_performance?.number_of_dials_attempted || 0) - (data?.number_status?.ringing || 0) - (data?.number_status?.not_ringing || 0) - (data?.number_status?.call_not_received_to_telecaller || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Call Not Ring Status Section */}
        <div className="mb-8">
          <SectionHeader title="CALL NOT RING STATUS" icon={<TrendingDown className="h-6 w-6 text-red-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Switch Off"
              value={getValue(data?.call_not_ring_status?.switch_off)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="Number Not Reachable"
              value={getValue(data?.call_not_ring_status?.number_not_reachable)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="Number Does Not Exist"
              value={getValue(data?.call_not_ring_status?.number_does_not_exist)}
              icon={<Phone className="h-6 w-6 text-red-600" />}
              color="border-red-500"
              bgColor="bg-red-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.number_status?.not_ringing || 0) - (data?.call_not_ring_status?.switch_off || 0) - (data?.call_not_ring_status?.number_not_reachable || 0) - (data?.call_not_ring_status?.number_does_not_exist || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Call Ring Status Section */}
        <div className="mb-8">
          <SectionHeader title="CALL RING STATUS" icon={<TrendingUp className="h-6 w-6 text-green-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <MetricCard
              title="Number of Calls Connected"
              value={getValue(data?.call_ring_status?.picked)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="Number of Calls Not Connected"
              value={getValue(data?.call_ring_status?.did_not_picked)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.number_status?.ringing || 0) - (data?.call_ring_status?.picked || 0) - (data?.call_ring_status?.did_not_picked || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Call Status Section */}
        <div className="mb-8">
          <SectionHeader title="CALL STATUS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Continue"
              value={getValue(data?.call_status?.continue)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="Refuse to Respond"
              value={getValue(data?.call_status?.refuse_to_respond)}
              icon={<Phone className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="Call Back Later"
              value={getValue(data?.call_status?.call_back_later)}
              icon={<Clock className="h-6 w-6 text-green-600" />}
              color="border-green-500"
              bgColor="bg-green-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.call_ring_status?.picked || 0) - (data?.call_status?.continue || 0) - (data?.call_status?.refuse_to_respond || 0) - (data?.call_status?.call_back_later || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>

        {/* Interview Metrics Section */}
        <div className="mb-8">
          <SectionHeader title="INTERVIEW METRICS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard
              title="Completed"
              value={getValue(data?.interview_metrics?.successful)}
              icon={<TrendingUp className="h-6 w-6 text-cyan-600" />}
              color="border-cyan-500"
              bgColor="bg-cyan-500"
            />
            <MetricCard
              title="Terminated"
              value={getValue(data?.interview_metrics?.terminated)}
              icon={<TrendingDown className="h-6 w-6 text-fuchsia-600" />}
              color="border-fuchsia-500"
              bgColor="bg-fuchsia-500"
            />
            <MetricCard
              title="Incompleted"
              value={getValue(data?.interview_metrics?.incompleted)}
              icon={<TrendingDown className="h-6 w-6 text-sky-600" />}
              color="border-sky-500"
              bgColor="bg-sky-500"
            />
            <MetricCard
              title="No response by Telecaller"
              value={getValue(Math.max(0, (data?.call_status?.continue || 0) - (data?.interview_metrics?.successful || 0) - (data?.interview_metrics?.terminated || 0) - (data?.interview_metrics?.incompleted || 0)))}
              icon={<Phone className="h-6 w-6 text-gray-600" />}
              color="border-gray-600"
              bgColor="bg-gray-600"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <FluidContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          {/* Header Section - Responsive */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Title Section */}
            <div className="flex-1">
              <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
                Telecaller Progress
              </Heading>
              {/* <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                Real-time telecaller performance metrics and analytics
              </p> */}
            </div>
            
            {/* View Mode Toggle and Refresh - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              {/* View Mode Toggle Buttons */}
              {/* <div className="flex gap-2 flex-1 sm:flex-initial">
                <Button
                  variant={viewMode === 'overall' ? 'primary' : 'outline'}
                  onClick={() => setViewMode('overall')}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-3 py-2"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden xs:inline">Overall</span>
                  <span className="xs:hidden">Overall</span>
                </Button>
                <Button
                  variant={viewMode === 'daywise' ? 'primary' : 'outline'}
                  onClick={() => setViewMode('daywise')}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-3 py-2"
                  size="sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden xs:inline">Day-wise</span>
                  <span className="xs:hidden">Day</span>
                </Button>
              </div> */}
              
              {/* Refresh Button */}
              {/* <Button
                variant="outline"
                onClick={() => {
                  if (viewMode === 'overall') {
                    fetchPerformanceData();
                  } else {
                    fetchDayWiseData();
                  }
                }}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2"
                size="sm"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden xs:inline">{loading ? 'Loading...' : 'Refresh'}</span>
                <span className="xs:hidden">{loading ? '...' : '↻'}</span>
              </Button> */}
            </div>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm md:text-base">Unable to Load Performance Data</h4>
                <p className="mt-1 text-sm">{error}</p>
                <p className="mt-2 text-xs md:text-sm opacity-90">
                  Make sure the backend server is running on <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">http://localhost:4001</code>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (viewMode === 'overall') {
                    fetchPerformanceData();
                  } else {
                    fetchDayWiseData();
                  }
                }}
                className="w-full sm:w-auto flex-shrink-0"
              >
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Success Message */}
            {/* {metrics && viewMode === 'overall' && (
              <Alert type="success" className="mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    <span className="hidden sm:inline">Performance data loaded successfully. Last updated: {new Date().toLocaleTimeString()}</span>
                    <span className="sm:hidden">Data loaded • {new Date().toLocaleTimeString()}</span>
                  </span>
                </div>
              </Alert>
            )} */}
            
            {dayWiseData.length > 0 && viewMode === 'daywise' && (
              <Alert type="success" className="mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    <span className="hidden sm:inline">Day-wise performance data loaded successfully. Showing {dayWiseData.length} days of data.</span>
                    <span className="sm:hidden">Day-wise data • {dayWiseData.length} days</span>
                  </span>
                </div>
              </Alert>
            )}

            {viewMode === 'overall' && (
              <Card className="p-4 md:p-6">
                {renderMetrics(metrics)}
              </Card>
            )}

            {viewMode === 'daywise' && dayWiseData.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                {dayWiseData.map((dayData, index) => (
                  <Card key={dayData.date} className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        <span className="hidden sm:inline">
                          {new Date(dayData.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="sm:hidden">
                          {new Date(dayData.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </h3>
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {/* Day {dayData.metrics.days_till_now} */}
                      </span>
                    </div>
                    {renderMetrics(dayData.metrics)}
                  </Card>
                ))}
              </div>
            )}

            {viewMode === 'daywise' && dayWiseData.length === 0 && !loading && (
              <Alert type="info" className="mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>No day-wise data available for the selected filters.</span>
                </div>
              </Alert>
            )}
          </>
        )}
      </div>
    </FluidContainer>
  );
};

export default TelecallerProgressPage;
