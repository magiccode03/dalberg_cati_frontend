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
import { Search } from 'lucide-react';

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

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Daily Call Detail
        </Heading>
        <div className="text-sm text-gray-500">
          {/* Additional header content if needed */}
        </div>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Report Days */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Days
            </label>
            <SelectDropdown
              value={filters.reportDays}
              onChange={(value) => handleFilterChange('reportDays', value)}
              options={reportDaysOptions}
              placeholder="Select Report Days"
            />
          </div>

          {/* Custom Date Start */}
          {filters.reportDays === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <SelectDropdown
                value={filters.customDate}
                onChange={(value) => handleFilterChange('customDate', value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

          {/* Custom Date End */}
          {filters.reportDays === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <SelectDropdown
                value={filters.customDateEnd}
                onChange={(value) => handleFilterChange('customDateEnd', value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

          {/* Telecaller */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telecaller
            </label>
            <SelectDropdown
              value={filters.telecaller}
              onChange={(value) => handleFilterChange('telecaller', value)}
              options={telecallerOptions}
              placeholder="Select Telecaller"
            />
          </div>

          {/* Caller Response */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caller Response
            </label>
            <SelectDropdown
              value={filters.callerResponse}
              onChange={(value) => handleFilterChange('callerResponse', value)}
              options={callerResponseOptions}
              placeholder="Select Caller Response"
            />
          </div>

          {/* API Response */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Response
            </label>
            <SelectDropdown
              value={filters.apiResponse}
              onChange={(value) => handleFilterChange('apiResponse', value)}
              options={apiResponseOptions}
              placeholder="Select API Response"
            />
          </div>

          {/* Call Received */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Received
            </label>
            <SelectDropdown
              value={filters.callReceived}
              onChange={(value) => handleFilterChange('callReceived', value)}
              options={callReceivedOptions}
              placeholder="Select Call Received"
            />
          </div>

          {/* Talk Duration Checkbox */}
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

          {/* View Button */}
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
      </Card>

      {/* Performance Cards */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Caller Performance */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={3} className="text-lg font-bold text-gray-900 uppercase">
                CALLER PERFORMANCE
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Total Callers */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  1
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Total Callers</Text>
                  <Text className="text-xl font-semibold text-gray-900">{performanceMetrics.totalCallers}</Text>
                </div>
              </div>

              {/* Days till now */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  2
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Days till now</Text>
                  <Text className="text-xl font-semibold text-gray-900">{performanceMetrics.daysTillNow}</Text>
                </div>
              </div>

              {/* Number of dials */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  3
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Number of dials</Text>
                  <Text className="text-xl font-semibold text-gray-900">{performanceMetrics.numberOfDials}</Text>
                </div>
              </div>

              {/* Total IVR Duration */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  4
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Total IVR Duration</Text>
                  <Text className="text-xl font-semibold text-gray-900">{performanceMetrics.totalIvrDuration}</Text>
                </div>
              </div>

              {/* Caller did not pick */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  5
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Caller did not pick</Text>
                  <Text className="text-xl font-semibold text-gray-900">{performanceMetrics.callerDidNotPick}</Text>
                </div>
              </div>

              {/* Total Talk Duration */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  6
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Total Talk Duration</Text>
                  <Text className="text-xl font-semibold text-gray-900">{performanceMetrics.totalTalkDuration}</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Call Outcome */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-green-500 mr-3"></div>
              <Heading level={3} className="text-lg font-bold text-gray-900 uppercase">
                CALL OUTCOME
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Number does not exist */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  7
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Number does not exist</Text>
                  <Text className="text-xl font-semibold text-gray-900">{callOutcomeMetrics.numberDoesNotExist}</Text>
                </div>
              </div>

              {/* Respondent did not pick */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  8
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Respondent did not pick</Text>
                  <Text className="text-xl font-semibold text-gray-900">{callOutcomeMetrics.respondentDidNotPick}</Text>
                </div>
              </div>

              {/* Respondent Picked the call */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  9
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Respondent Picked the call</Text>
                  <Text className="text-xl font-semibold text-gray-900">{callOutcomeMetrics.respondentPickedCall}</Text>
                </div>
              </div>

              {/* Picked and Refused */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  10
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Picked and Refused</Text>
                  <Text className="text-xl font-semibold text-gray-900">{callOutcomeMetrics.pickedAndRefused}</Text>
                </div>
              </div>

              {/* Total Number Exhausted */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  11
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Total Number Exhausted</Text>
                  <Text className="text-xl font-semibold text-gray-900">{callOutcomeMetrics.totalNumberExhausted}</Text>
                </div>
              </div>

              {/* Picked and Call Continue */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  12
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Picked and Call Continue</Text>
                  <Text className="text-xl font-semibold text-gray-900">{callOutcomeMetrics.pickedAndCallContinue}</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Heading level={2} className="text-xl font-semibold text-gray-900">
            Call Detail
          </Heading>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Caller Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Caller ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Call Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Call Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Caller Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  API Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  IVR Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Talk Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Audio file
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callDetailData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                callDetailData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callReceived}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callerResponse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.apiResponse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.ivrDuration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.talkDuration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.audioFile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </FluidContainer>
  );
};

export default TelecallerDailyCallDetailPage;
