'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download } from 'lucide-react';

// Interfaces
interface SearchFilters {
  month: string;
  telecaller: string;
  reportType: string;
}

interface CallerSummaryData {
  id: number;
  callerName: string;
  callerId: string;
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
  numberPickedTheCall: number;
  numberDoesNotWorking: number;
  numberNoResponse: number;
  numberRefused: number;
  callerFormNotFill: number;
  callerFormNotFillRespondentPicked: number;
}

interface PerformanceMetrics {
  totalCallers: number;
  month: string;
  numberOfDials: number;
  totalIvrDuration: string;
  callerDidNotPick: number;
  totalTalkDuration: string;
}

interface CallOutcomeMetrics {
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  pickedAndRefused: number;
  pickedAndCallContinue: number;
  totalFormNotFill: number;
}

interface NumberSummaryMetrics {
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  pickedAndRefused: number;
  pickedAndCallContinue: number;
  totalNumberExhausted: number;
  successfulInterviews: number;
}

const MonthlyReportPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    month: '2024-05',
    telecaller: '',
    reportType: 'summary',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  // Sample data for caller summary
  const [callerSummaryData] = useState<CallerSummaryData[]>([
    {
      id: 1,
      callerName: 'RAKHI DOLUI',
      callerId: '102298300',
      numberOfDials: 19,
      ivrDuration: '00:9:23',
      talkDuration: '00:02:17',
      callerDidNotPick: 1,
      numberDoesNotExist: 1,
      respondentDidNotPick: 0,
      respondentPickedCall: 4,
      pickedAndRefused: 0,
      numberExhausted: 4,
      successfulInterviews: 0,
      numberPickedTheCall: 0,
      numberDoesNotWorking: 0,
      numberNoResponse: 1,
      numberRefused: 3,
      callerFormNotFill: 12,
      callerFormNotFillRespondentPicked: 2,
    },
    {
      id: 100,
      callerName: 'Sabina khatun',
      callerId: '5101',
      numberOfDials: 678,
      ivrDuration: '13:35:14',
      talkDuration: '9:9:54',
      callerDidNotPick: 8,
      numberDoesNotExist: 178,
      respondentDidNotPick: 175,
      respondentPickedCall: 259,
      pickedAndRefused: 95,
      numberExhausted: 565,
      successfulInterviews: 129,
      numberPickedTheCall: 124,
      numberDoesNotWorking: 176,
      numberNoResponse: 171,
      numberRefused: 94,
      callerFormNotFill: 71,
      callerFormNotFillRespondentPicked: 12,
    },
  ]);

  // Performance metrics data
  const [performanceMetrics] = useState<PerformanceMetrics>({
    totalCallers: 330,
    month: 'May 2024',
    numberOfDials: 264707,
    totalIvrDuration: '4550:38:19',
    callerDidNotPick: 6458,
    totalTalkDuration: '2980:25:40',
  });

  const [callOutcomeMetrics] = useState<CallOutcomeMetrics>({
    numberDoesNotExist: 22069,
    respondentDidNotPick: 71712,
    pickedAndRefused: 65935,
    pickedAndCallContinue: 49021,
    totalFormNotFill: 55970,
  });

  const [numberSummaryMetrics] = useState<NumberSummaryMetrics>({
    numberDoesNotExist: 20534,
    respondentDidNotPick: 68774,
    pickedAndRefused: 63288,
    pickedAndCallContinue: 31882,
    totalNumberExhausted: 184478,
    successfulInterviews: 29907,
  });

  // Options for dropdowns
  const monthOptions = [
    { value: '', label: 'Months Till now' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-04', label: 'Apr 2024' },
    { value: '2024-03', label: 'Mar 2024' },
    { value: '2024-02', label: 'Feb 2024' },
    { value: '2024-01', label: 'Jan 2024' },
    { value: '2023-12', label: 'Dec 2023' },
    { value: '2023-11', label: 'Nov 2023' },
    { value: '2023-10', label: 'Oct 2023' },
    { value: '2023-09', label: 'Sep 2023' },
  ];

  const telecallerOptions = [
    { value: '', label: 'Select Telecaller' },
    { value: '298', label: 'Saira Khatoon' },
    { value: '291', label: 'Sakiron' },
    { value: '1731', label: '7908296234' },
  ];

  const reportTypeOptions = [
    { value: 'summary', label: 'Summary' },
    { value: 'detail', label: 'Detail' },
  ];

  // Handlers
  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownload = () => {
    console.log('Download data');
  };

  // Pagination calculations
  const totalItems = callerSummaryData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = callerSummaryData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Monthly Report
        </Heading>
      </div>

      {/* Search Filters */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Month */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <SelectDropdown
              value={filters.month}
              onChange={(value) => handleFilterChange('month', Array.isArray(value) ? value[0] : value)}
              options={monthOptions}
              placeholder="Select Month"
            />
          </div>

          {/* Telecaller */}
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

          {/* Type of Report */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Report
            </label>
            <SelectDropdown
              value={filters.reportType}
              onChange={(value) => handleFilterChange('reportType', Array.isArray(value) ? value[0] : value)}
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
      <Card className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Caller Performance */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={3} className="text-lg font-bold uppercase text-gray-900">
                Caller Performance
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Total Callers */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  1
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Total Callers</Text>
                  <Text className="text-lg font-semibold text-gray-900">{performanceMetrics.totalCallers.toLocaleString()}</Text>
                </div>
              </div>

              {/* Month */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  2
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Month</Text>
                  <Text className="text-lg font-semibold text-gray-900">{performanceMetrics.month}</Text>
                </div>
              </div>

              {/* Number of dials */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  3
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Number of dials</Text>
                  <Text className="text-lg font-semibold text-gray-900">{performanceMetrics.numberOfDials.toLocaleString()}</Text>
                </div>
              </div>

              {/* Total IVR Duration */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  4
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Total IVR Duration</Text>
                  <Text className="text-lg font-semibold text-gray-900">{performanceMetrics.totalIvrDuration}</Text>
                </div>
              </div>

              {/* Caller did not pick */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  5
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Caller did not pick</Text>
                  <Text className="text-lg font-semibold text-gray-900">{performanceMetrics.callerDidNotPick.toLocaleString()}</Text>
                </div>
              </div>

              {/* Total Talk Duration */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  6
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Total Talk Duration</Text>
                  <Text className="text-lg font-semibold text-gray-900">{performanceMetrics.totalTalkDuration}</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Call Outcome */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-green-600 mr-3"></div>
              <Heading level={3} className="text-lg font-bold uppercase text-gray-900">
                Call Outcome
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Number does not exist */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  7
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Number does not exist</Text>
                  <Text className="text-lg font-semibold text-gray-900">{callOutcomeMetrics.numberDoesNotExist.toLocaleString()}</Text>
                </div>
              </div>

              {/* Respondent did not pick */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  8
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Respondent did not pick</Text>
                  <Text className="text-lg font-semibold text-gray-900">{callOutcomeMetrics.respondentDidNotPick.toLocaleString()}</Text>
                </div>
              </div>

              {/* Picked and Refused */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  9
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Picked and Refused</Text>
                  <Text className="text-lg font-semibold text-gray-900">{callOutcomeMetrics.pickedAndRefused.toLocaleString()}</Text>
                </div>
              </div>

              {/* Picked and Call Continue */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  10
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Picked and Call Continue</Text>
                  <Text className="text-lg font-semibold text-gray-900">{callOutcomeMetrics.pickedAndCallContinue.toLocaleString()}</Text>
                </div>
              </div>

              {/* Total Form Not Fill */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  11
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Total Form Not Fill</Text>
                  <Text className="text-lg font-semibold text-gray-900">{callOutcomeMetrics.totalFormNotFill.toLocaleString()}</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Number Summary */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={3} className="text-lg font-bold uppercase text-gray-900">
                Number Summary
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Number does not exist */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  12
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Number does not exist</Text>
                  <Text className="text-lg font-semibold text-gray-900">{numberSummaryMetrics.numberDoesNotExist.toLocaleString()}</Text>
                </div>
              </div>

              {/* Respondent did not pick */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  13
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Respondent did not pick</Text>
                  <Text className="text-lg font-semibold text-gray-900">{numberSummaryMetrics.respondentDidNotPick.toLocaleString()}</Text>
                </div>
              </div>

              {/* Picked and Refused */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  14
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Picked and Refused</Text>
                  <Text className="text-lg font-semibold text-gray-900">{numberSummaryMetrics.pickedAndRefused.toLocaleString()}</Text>
                </div>
              </div>

              {/* Picked and Call Continue */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  15
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Picked and Call Continue</Text>
                  <Text className="text-lg font-semibold text-gray-900">{numberSummaryMetrics.pickedAndCallContinue.toLocaleString()}</Text>
                </div>
              </div>

              {/* Total Number Exhausted */}
              <div className="flex items-center p-3 border-r border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  16
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Total Number Exhausted</Text>
                  <Text className="text-lg font-semibold text-gray-900">{numberSummaryMetrics.totalNumberExhausted.toLocaleString()}</Text>
                </div>
              </div>

              {/* Successful Interviews */}
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  17
                </div>
                <div>
                  <Text className="text-xs text-gray-600 mb-1">Successful Interviews</Text>
                  <Text className="text-lg font-semibold text-gray-900">{numberSummaryMetrics.successfulInterviews.toLocaleString()}</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={2} className="text-xl font-semibold text-gray-900">
              Caller Summary
            </Heading>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleDownload}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Data
          </Button>
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
                  Number of dials
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  IVR Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Talk Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Caller did not pick
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Number does not exist
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Respondent did not pick
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Respondent Picked the call
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Picked and Refused
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Number Exhausted
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Successful Interviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Number: Picked The Call
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Number: Does Not Working
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Number: No Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Number: Refused
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Caller Form not Fill
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Caller Form not Fill and Respondent Picked
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.callerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.callerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {item.numberOfDials}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.ivrDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.talkDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.callerDidNotPick}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.numberDoesNotExist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.respondentDidNotPick}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.respondentPickedCall}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.pickedAndRefused}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.numberExhausted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.successfulInterviews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.numberPickedTheCall}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.numberDoesNotWorking}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.numberNoResponse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.numberRefused}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {item.callerFormNotFill}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {item.callerFormNotFillRespondentPicked}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <PaginationStandard
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>

      </Card>
    </FluidContainer>
  );
};

export default MonthlyReportPage;
