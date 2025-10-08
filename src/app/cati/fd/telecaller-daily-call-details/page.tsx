'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Search, Users, Clock, PhoneCall, PhoneOff, CheckCircle } from 'lucide-react';

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
  callerName: string;
  callerId: string;
  callTime: string;
  callReceived: string;
  callerResponse: string;
  apiResponse: string;
  ivrDuration: string;
  talkDuration: string;
  audioFile: string;
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

  // Sample data for call details
  const [callDetailData] = useState<CallDetailData[]>([]);

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
    // Implement search logic here
  };

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
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
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
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
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
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
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

      {/* Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={2} className="text-xl font-semibold text-gray-900">
              Call Detail (coming soon)
            </Heading>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Caller Name</TableHead>
                <TableHead>Caller ID</TableHead>
                <TableHead>Call Time</TableHead>
                <TableHead>Call Received</TableHead>
                <TableHead>Caller Response</TableHead>
                <TableHead>API Response</TableHead>
                <TableHead>IVR Duration</TableHead>
                <TableHead>Talk Duration</TableHead>
                <TableHead>Audio file</TableHead>
                <TableHead>Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callDetailData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                callDetailData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.callerName}</TableCell>
                    <TableCell>{item.callerId}</TableCell>
                    <TableCell>{item.callTime}</TableCell>
                    <TableCell>{item.callReceived}</TableCell>
                    <TableCell>{item.callerResponse}</TableCell>
                    <TableCell>{item.apiResponse}</TableCell>
                    <TableCell>{item.ivrDuration}</TableCell>
                    <TableCell>{item.talkDuration}</TableCell>
                    <TableCell>{item.audioFile}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </FluidContainer>
  );
};

export default TelecallerDailyCallDetailPage;
