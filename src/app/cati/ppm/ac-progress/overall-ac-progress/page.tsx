'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { Download, Search, CheckCircle, PhoneOff, PhoneForwarded, Phone } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';
import Input from '@/components/ui/Input';

export default function CATIACWiseDataPage() {
  const [acData, setAcData] = useState<CATIACData[]>([]);
  const [filteredData, setFilteredData] = useState<CATIACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAcCode, setSelectedAcCode] = useState<string>('');
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);
  const [callingDates, setCallingDates] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  interface DashboardMetrics {
    numberOfDials: number;
    pickedUp: number;
    completedInterview: number;
    terminatedInterview: number;
    incompleteInterview: number;
    ineligibleInterview: number;
    pickedAndCallContinue: number;
  }

  const [callOutcomeMetrics, setCallOutcomeMetrics] = useState<DashboardMetrics>({
    numberOfDials: 0,
    pickedUp: 0,
    completedInterview: 0,
    terminatedInterview: 0,
    incompleteInterview: 0,
    ineligibleInterview: 0,
    pickedAndCallContinue: 0,
  });

  useEffect(() => {
    fetchCATIData();
    fetchDashboardMetrics();
  }, []);

  const fetchCATIData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const params = new URLSearchParams();
      // Date filter
      const dateRange = getDateRangeForAPI(callingDates, fromDate, toDate);
      if (dateRange.start_date && dateRange.end_date) {
        params.append('start_date', dateRange.start_date);
        params.append('end_date', dateRange.end_date);
      }
      // Optional AC filter (if a single AC selected)
      if (selectedAcCode) {
        params.append('ac_code', selectedAcCode);
      }
      const url = `${apiBaseUrl}/api/cati/ac-progress-report${params.toString() ? `?${params.toString()}` : ''}`;
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
      if (result.success && Array.isArray(result.data)) {
        setAcData(result.data);
        // If AC selected, keep server filtered; else show full list
        setFilteredData(result.data);
      } else {
        setError(result.message || 'Failed to fetch CATI AC data');
      }
    } catch (err) {
      console.error('Error fetching CATI AC data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert calling dates option to start_date and end_date
  const getDateRangeForAPI = (callingDates: string, fromDate?: string, toDate?: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (callingDates) {
      case 'all':
        return { start_date: '', end_date: '' };
      case 'today':
        return { start_date: todayStr, end_date: todayStr };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        return { start_date: yesterdayStr, end_date: yesterdayStr };
      case 'dby':
        const dby = new Date(today);
        dby.setDate(dby.getDate() - 2);
        const dbyStr = dby.toISOString().split('T')[0];
        return { start_date: dbyStr, end_date: dbyStr };
      case 'l3':
        const l3Start = new Date(today);
        l3Start.setDate(l3Start.getDate() - 2);
        return { start_date: l3Start.toISOString().split('T')[0], end_date: todayStr };
      case 'l7':
        const l7Start = new Date(today);
        l7Start.setDate(l7Start.getDate() - 6);
        return { start_date: l7Start.toISOString().split('T')[0], end_date: todayStr };
      case 'l15':
        const l15Start = new Date(today);
        l15Start.setDate(l15Start.getDate() - 14);
        return { start_date: l15Start.toISOString().split('T')[0], end_date: todayStr };
      case 'currentmonth':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start_date: monthStart.toISOString().split('T')[0], end_date: todayStr };
      case 'custom':
        return { start_date: fromDate || '', end_date: toDate || '' };
      default:
        return { start_date: '', end_date: '' };
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      setMetricsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setMetricsLoading(false);
        return;
      }
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with date filters and optional AC filter
      const params = new URLSearchParams();
      const dateRange = getDateRangeForAPI(callingDates, fromDate, toDate);
      if (dateRange.start_date && dateRange.end_date) {
        params.append('start_date', dateRange.start_date);
        params.append('end_date', dateRange.end_date);
      }
      if (selectedAcCode) {
        params.append('ac_code', selectedAcCode);
      }
      
      const url = `${apiBaseUrl}/api/cati/dashboard${params.toString() ? `?${params.toString()}` : ''}`;
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
        setCallOutcomeMetrics({
          numberOfDials: result.data.number_of_dials || 0,
          pickedUp: result.data.picked_up || 0,
          completedInterview: result.data.completed_interview || 0,
          terminatedInterview: result.data.terminated_interview || 0,
          incompleteInterview: result.data.incomplete_interview || 0,
          ineligibleInterview: result.data.ineligible_interview || 0,
          pickedAndCallContinue: result.data.picked_and_call_continue || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    bgColor = 'bg-orange-500',
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

  const handleSearch = () => {
    fetchCATIData();
    fetchDashboardMetrics(); // Always refresh metrics when searching
  };

  const handleAcChange = (value: string | string[]) => {
    const acCode = Array.isArray(value) ? value[0] : value;
    setSelectedAcCode(acCode);
  };

  const handleCallingDatesChange = (value: string | string[]) => {
    const callingDatesValue = Array.isArray(value) ? value[0] : value;
    setCallingDates(callingDatesValue);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedAcCode('');
    setCallingDates('all');
    setFromDate('');
    setToDate('');
    fetchCATIData();
    fetchDashboardMetrics();
  };

  // Create dropdown options from AC data
  const acOptions = [
    { value: '', label: 'All ACs' },
    ...acData
      .sort((a, b) => a.ac_name.localeCompare(b.ac_name))
      .map(ac => ({
        value: ac.ac_code.toString(),
        label: `${ac.ac_name} (${ac.ac_code})`
      }))
  ];

  const callingDatesOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'dby', label: 'Day Before Yesterday' },
    { value: 'l3', label: 'Last 3 Days' },
    { value: 'l7', label: 'Last 7 Days' },
    { value: 'l15', label: 'Last 15 Days' },
    { value: 'currentmonth', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date Range' },
  ];

  const handleDownload = () => {
    if (filteredData.length === 0) return;

    // Create CSV content
    const headers = ['S.No', 'AC Name', 'Call Attempted', 'Call Connected', 'Completed'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((item, index) => [
        index + 1,
        `"${item.ac_name}"`,
        item.call_attempt,
        item.call_connected,
        item.success
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const selectedAc = selectedAcCode ? acData.find(ac => ac.ac_code.toString() === selectedAcCode)?.ac_name : 'All';
    const filename = `AC-Wise-Report-${selectedAc}-${currentDate}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold mb-6">
       AC-Wise Report
      </Heading>

      {/* Search Filter */}
      <Card className="mb-6">
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <div className="col-span-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                AC Name
              </label>
              <SelectDropdown
                options={acOptions}
                value={selectedAcCode}
                onChange={handleAcChange}
                className="w-full"
                placeholder="Select AC Name"
              />
            </div>
          </div>
          <div className="col-span-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Calling Dates
              </label>
              <SelectDropdown
                options={callingDatesOptions}
                value={callingDates}
                onChange={handleCallingDatesChange}
                className="w-full"
                placeholder="Select Date Range"
                searchable={false}
                clearable={true}
              />
            </div>
          </div>
          {callingDates === 'custom' && (
            <>
              <div className="col-span-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    placeholder="Select From Date"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={handleToDateChange}
                    placeholder="Select To Date"
                  />
                </div>
              </div>
            </>
          )}
          <div className="col-span-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0">
                Action
              </label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={loading}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/*        "completed_interview": 1500,
        "terminated_interview": 3907,
        "incomplete_interview": 4368,
        "ineligible_interview": 692, */}
        <Card className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-orange-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Interview Metrics
            </Heading>
          </div>
          {metricsLoading ? (
            <div className="text-center py-12">
              <i className="fa fa-spinner fa-spin text-3xl text-orange-600 mb-3"></i>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading metrics...</p>
            </div>
          ) : (
            <>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                icon={Phone}
                title="Number of Dials"
                value={callOutcomeMetrics.numberOfDials}
                bgColor="bg-blue-500"
              />
              <MetricCard
                icon={Phone}
                title="Calls Connected"
                value={callOutcomeMetrics.pickedUp}
                bgColor="bg-orange-500"
              />
              <MetricCard
                icon={Phone}
                title="Continue"
                value={callOutcomeMetrics.pickedAndCallContinue}
                bgColor="bg-green-500"
              />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <MetricCard
                icon={CheckCircle}
                title="Completed Interview"
                value={callOutcomeMetrics.completedInterview}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Terminated Interview"
                value={callOutcomeMetrics.terminatedInterview}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Incomplete Interview"
                value={callOutcomeMetrics.incompleteInterview}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Ineligible Interview"
                value={callOutcomeMetrics.ineligibleInterview}
                bgColor="bg-gray-500"
              />
            </div>
            </>
          )}
        </Card>

      {/* CATI AC Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">AC-Wise Call Progress Report</Heading>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              disabled={loading || filteredData.length === 0}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Text>Loading CATI AC data...</Text>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <Text>{error}</Text>
          </div>
        ) : (
          <div className="table-responsive max-h-[600px] overflow-y-auto">
            <Table className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="bg-gray-50 sticky top-0 z-20 dark:bg-gray-800 shadow-sm">
                <tr>
                  <th className="border border-gray-300 w-16 bg-white dark:bg-gray-800 text-center">S.No</th>
                  <th className="border border-gray-300 w-32 bg-white dark:bg-gray-800 text-left">AC Name</th>
                  <th className="border border-gray-300 w-24 bg-white dark:bg-gray-800 text-center">Call Attempted</th>
                  <th className="border border-gray-300 w-24 bg-white dark:bg-gray-800 text-center">Call Connected</th>
                  <th className="border border-gray-300 w-20 bg-white dark:bg-gray-800 text-center">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 border border-gray-300">
                      {selectedAcCode ? 'No AC data found matching your selection' : 'No CATI AC data found'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.ac_code}>
                      <td className="border border-gray-300 text-center">{index + 1}</td>
                      <td className="border border-gray-300 text-left">{item.ac_name}</td>
                      <td className="border border-gray-300 text-center">{item.call_attempt}</td>
                      <td className="border border-gray-300 text-center">{item.call_connected}</td>
                      <td className="border border-gray-300 text-center">{item.success}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}

      </Card>
    </Container>
  );
}
