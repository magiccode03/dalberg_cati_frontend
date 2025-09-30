'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Search } from 'lucide-react';

// Interface for telecaller progress data
interface TelecallerProgressData {
  id: number;
  callerName: string;
  numberOfDials: number;
  ivrDuration: string;
  talkDuration: string;
  callerDidNotPick: number;
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  respondentPickedCall: number;
  pickedAndRefused: number;
  numberExhausted: number;
  successfulInterviews: number;
  rejectedInterviews: number;
  incompleteInterviews: number;
  numberPickedCall: number;
  numberDoesNotWorking: number;
  numberNoResponse: number;
  numberRefused: number;
  callerFormNotFill: number;
}

// Interface for search filters
interface SearchFilters {
  reportDays: string;
  customDate: string;
  customDateEnd: string;
  telecaller: string;
  reportType: string;
}

const TelecallerDailyProgressPage: React.FC = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    reportDays: 'today',
    customDate: '',
    customDateEnd: '',
    telecaller: '',
    reportType: 'summary'
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data for telecaller progress
  const telecallerProgressData: TelecallerProgressData[] = [
    {
      id: 1,
      callerName: 'John Doe',
      numberOfDials: 150,
      ivrDuration: '02:30:45',
      talkDuration: '01:45:30',
      callerDidNotPick: 25,
      numberDoesNotExist: 30,
      respondentDidNotPick: 40,
      respondentPickedCall: 55,
      pickedAndRefused: 15,
      numberExhausted: 85,
      successfulInterviews: 25,
      rejectedInterviews: 10,
      incompleteInterviews: 5,
      numberPickedCall: 55,
      numberDoesNotWorking: 30,
      numberNoResponse: 40,
      numberRefused: 15,
      callerFormNotFill: 5
    },
    {
      id: 2,
      callerName: 'Jane Smith',
      numberOfDials: 200,
      ivrDuration: '03:15:20',
      talkDuration: '02:30:15',
      callerDidNotPick: 35,
      numberDoesNotExist: 45,
      respondentDidNotPick: 50,
      respondentPickedCall: 70,
      pickedAndRefused: 20,
      numberExhausted: 120,
      successfulInterviews: 35,
      rejectedInterviews: 15,
      incompleteInterviews: 8,
      numberPickedCall: 70,
      numberDoesNotWorking: 45,
      numberNoResponse: 50,
      numberRefused: 20,
      callerFormNotFill: 8
    }
  ];

  // Report days options
  const reportDaysOptions = [
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

  // Report type options
  const reportTypeOptions = [
    { value: 'summary', label: 'Summary' },
    { value: 'detail', label: 'Detail' }
  ];

  // Telecaller options (sample)
  const telecallerOptions = [
    { value: '', label: 'Select Telecaller' },
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
    { value: '3', label: 'Mike Johnson' }
  ];

  // Handle filter changes
  const handleFilterChange = (field: keyof SearchFilters, value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    setFilters(prev => ({
      ...prev,
      [field]: stringValue
    }));
  };

  // Handle search
  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    // Implement search logic here
  };

  // Calculate pagination
  const totalItems = telecallerProgressData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = telecallerProgressData.slice(startIndex, endIndex);

  // Performance metrics (sample data)
  const performanceMetrics = {
    totalCallers: 0,
    daysTillNow: 0,
    numberOfDials: '',
    totalIvrDuration: '00:00:00',
    callerDidNotPick: '',
    totalTalkDuration: '00:00:00'
  };

  const callOutcomeMetrics = {
    numberDoesNotExist: '',
    respondentDidNotPick: '',
    pickedAndRefused: '',
    pickedAndCallContinue: '',
    totalFormNotFill: ''
  };

  const numberSummaryMetrics = {
    totalNumberExhausted: '',
    numberDoesNotExist: '',
    respondentDidNotPick: '',
    pickedAndRefused: '',
    pickedAndCallContinue: '',
    validInterviews: '',
    rejected: '',
    incomplete: ''
  };

  return (
    <FluidContainer>
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center">
          <div>
            <Heading level={1} className="text-2xl font-bold text-gray-900">
              Telecaller Daily Progress
            </Heading>
          </div>
          <div className="text-sm text-gray-500">
            {/* Additional header content if needed */}
          </div>
        </div>

        {/* Search Filters */}
        <Card className="">
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
                  options={[
                    { value: '', label: 'Select Date' },
                    { value: '2024-05-31', label: '2024-05-31' },
                    { value: '2024-05-30', label: '2024-05-30' },
                    { value: '2024-05-29', label: '2024-05-29' },
                    { value: '2024-05-28', label: '2024-05-28' },
                    { value: '2024-05-27', label: '2024-05-27' },
                    { value: '2024-05-26', label: '2024-05-26' },
                    { value: '2024-05-25', label: '2024-05-25' },
                    { value: '2024-05-24', label: '2024-05-24' },
                    { value: '2024-05-23', label: '2024-05-23' },
                    { value: '2024-05-22', label: '2024-05-22' },
                    { value: '2024-05-21', label: '2024-05-21' },
                    { value: '2024-05-20', label: '2024-05-20' },
                    { value: '2024-05-19', label: '2024-05-19' },
                    { value: '2024-05-18', label: '2024-05-18' },
                    { value: '2024-05-17', label: '2024-05-17' },
                    { value: '2024-05-16', label: '2024-05-16' },
                    { value: '2024-05-15', label: '2024-05-15' },
                    { value: '2024-05-14', label: '2024-05-14' },
                    { value: '2024-05-13', label: '2024-05-13' },
                    { value: '2024-05-12', label: '2024-05-12' },
                    { value: '2024-05-11', label: '2024-05-11' },
                    { value: '2024-05-10', label: '2024-05-10' },
                    { value: '2024-05-09', label: '2024-05-09' },
                    { value: '2024-05-08', label: '2024-05-08' },
                    { value: '2024-05-07', label: '2024-05-07' },
                    { value: '2024-05-06', label: '2024-05-06' },
                    { value: '2024-05-05', label: '2024-05-05' },
                    { value: '2024-05-04', label: '2024-05-04' },
                    { value: '2024-05-03', label: '2024-05-03' },
                    { value: '2024-05-02', label: '2024-05-02' },
                    { value: '2024-05-01', label: '2024-05-01' }
                  ]}
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
                  options={[
                    { value: '', label: 'Select Date' },
                    { value: '2024-05-31', label: '2024-05-31' },
                    { value: '2024-05-30', label: '2024-05-30' },
                    { value: '2024-05-29', label: '2024-05-29' },
                    { value: '2024-05-28', label: '2024-05-28' },
                    { value: '2024-05-27', label: '2024-05-27' },
                    { value: '2024-05-26', label: '2024-05-26' },
                    { value: '2024-05-25', label: '2024-05-25' },
                    { value: '2024-05-24', label: '2024-05-24' },
                    { value: '2024-05-23', label: '2024-05-23' },
                    { value: '2024-05-22', label: '2024-05-22' },
                    { value: '2024-05-21', label: '2024-05-21' },
                    { value: '2024-05-20', label: '2024-05-20' },
                    { value: '2024-05-19', label: '2024-05-19' },
                    { value: '2024-05-18', label: '2024-05-18' },
                    { value: '2024-05-17', label: '2024-05-17' },
                    { value: '2024-05-16', label: '2024-05-16' },
                    { value: '2024-05-15', label: '2024-05-15' },
                    { value: '2024-05-14', label: '2024-05-14' },
                    { value: '2024-05-13', label: '2024-05-13' },
                    { value: '2024-05-12', label: '2024-05-12' },
                    { value: '2024-05-11', label: '2024-05-11' },
                    { value: '2024-05-10', label: '2024-05-10' },
                    { value: '2024-05-09', label: '2024-05-09' },
                    { value: '2024-05-08', label: '2024-05-08' },
                    { value: '2024-05-07', label: '2024-05-07' },
                    { value: '2024-05-06', label: '2024-05-06' },
                    { value: '2024-05-05', label: '2024-05-05' },
                    { value: '2024-05-04', label: '2024-05-04' },
                    { value: '2024-05-03', label: '2024-05-03' },
                    { value: '2024-05-02', label: '2024-05-02' },
                    { value: '2024-05-01', label: '2024-05-01' }
                  ]}
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

            {/* Report Type */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Report
              </label>
              <SelectDropdown
                value={filters.reportType}
                onChange={(value) => handleFilterChange('reportType', value)}
                options={reportTypeOptions}
                placeholder="Select Report Type"
              />
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
        <Card className="">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Caller Performance */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900">
                  Caller Performance
                </Heading>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 border-r border-gray-200">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Total Callers</Text>
                    <Text className="text-lg font-semibold">{performanceMetrics.totalCallers}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Days till now</Text>
                    <Text className="text-lg font-semibold">{performanceMetrics.daysTillNow}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-r border-gray-200">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Number of dials</Text>
                    <Text className="text-lg font-semibold">{performanceMetrics.numberOfDials}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Total IVR Duration</Text>
                    <Text className="text-lg font-semibold">{performanceMetrics.totalIvrDuration}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-r border-gray-200">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    5
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Caller did not pick</Text>
                    <Text className="text-lg font-semibold">{performanceMetrics.callerDidNotPick}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    6
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Total Talk Duration</Text>
                    <Text className="text-lg font-semibold">{performanceMetrics.totalTalkDuration}</Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Outcome */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900">
                  Call Outcome
                </Heading>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 border-r border-gray-200">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    7
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Number does not exist</Text>
                    <Text className="text-lg font-semibold">{callOutcomeMetrics.numberDoesNotExist}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    8
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Respondent did not pick</Text>
                    <Text className="text-lg font-semibold">{callOutcomeMetrics.respondentDidNotPick}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-r border-gray-200">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    9
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Picked and Refused</Text>
                    <Text className="text-lg font-semibold">{callOutcomeMetrics.pickedAndRefused}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    10
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Picked and Call Continue</Text>
                    <Text className="text-lg font-semibold">{callOutcomeMetrics.pickedAndCallContinue}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-r border-gray-200">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    11
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Total Form Not Fill</Text>
                    <Text className="text-lg font-semibold">{callOutcomeMetrics.totalFormNotFill}</Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Number Summary */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900">
                  Number Summary
                </Heading>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    16
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Total Number Exhausted</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.totalNumberExhausted}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    12
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Number does not exist</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.numberDoesNotExist}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    13
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Respondent did not pick</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.respondentDidNotPick}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    14
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Picked and Refused</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.pickedAndRefused}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    15
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Picked and Call Continue</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.pickedAndCallContinue}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    17
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Valid Interviews</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.validInterviews}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    19
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Rejected</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.rejected}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    20
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600">Incomplete</Text>
                    <Text className="text-sm font-semibold">{numberSummaryMetrics.incomplete}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
            <Heading level={2} className="text-xl font-semibold text-gray-900">
              Caller Summary
            </Heading>
            <Button variant="secondary" size="sm" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download Data
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Caller Name</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number of dials</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">IVR Duration</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Talk Duration</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Caller did not pick</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number does not exist</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Respondent did not pick</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Respondent Picked the call</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Picked and Refused</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number Exhausted</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Successful Interviews</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Rejected Interviews</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Incomplete Interviews</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number: Picked The Call</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number: Does Not Working</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number: No Response</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number: Refused</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Caller Form not Fill</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-200">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.callerName}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberOfDials}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.ivrDuration}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.talkDuration}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.callerDidNotPick}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberDoesNotExist}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.respondentDidNotPick}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.respondentPickedCall}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.pickedAndRefused}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberExhausted}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.successfulInterviews}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.rejectedInterviews}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.incompleteInterviews}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberPickedCall}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberDoesNotWorking}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberNoResponse}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.numberRefused}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.callerFormNotFill}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={19} className="px-4 py-8 text-center text-gray-500">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>
    </FluidContainer>
  );
};

export default TelecallerDailyProgressPage;
