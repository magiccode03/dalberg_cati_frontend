'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, Users, Clock, PhoneCall, PhoneOff, CheckCircle } from 'lucide-react';

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
  const [pageSize] = useState(25);

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

  // Pagination calculations
  const totalItems = callerSummaryData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = callerSummaryData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
        {/* Caller Performance */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Caller Performance
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={Users}
              title="Total Callers"
              value={performanceMetrics.totalCallers.toLocaleString()}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={Clock}
              title="Month"
              value={performanceMetrics.month}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Number of dials"
              value={performanceMetrics.numberOfDials.toLocaleString()}
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
              value={performanceMetrics.callerDidNotPick.toLocaleString()}
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
              Call Outcome
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={PhoneOff}
              title="Number does not exist"
              value={callOutcomeMetrics.numberDoesNotExist.toLocaleString()}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Respondent did not pick"
              value={callOutcomeMetrics.respondentDidNotPick.toLocaleString()}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Picked and Refused"
              value={callOutcomeMetrics.pickedAndRefused.toLocaleString()}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Picked and Call Continue"
              value={callOutcomeMetrics.pickedAndCallContinue.toLocaleString()}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Total Form Not Fill"
              value={callOutcomeMetrics.totalFormNotFill.toLocaleString()}
              bgColor="bg-green-500"
            />
          </div>
        </Card>

        {/* Number Summary */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
              Number Summary
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={PhoneOff}
              title="Number does not exist"
              value={numberSummaryMetrics.numberDoesNotExist.toLocaleString()}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Respondent did not pick"
              value={numberSummaryMetrics.respondentDidNotPick.toLocaleString()}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Picked and Refused"
              value={numberSummaryMetrics.pickedAndRefused.toLocaleString()}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Picked and Call Continue"
              value={numberSummaryMetrics.pickedAndCallContinue.toLocaleString()}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Total Number Exhausted"
              value={numberSummaryMetrics.totalNumberExhausted.toLocaleString()}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={CheckCircle}
              title="Successful Interviews"
              value={numberSummaryMetrics.successfulInterviews.toLocaleString()}
              bgColor="bg-green-500"
            />
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
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

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Caller Name</th>
                  <th className="text-center">Caller ID</th>
                  <th className="text-center">Number of dials</th>
                  <th className="text-center">IVR Duration</th>
                  <th className="text-center">Talk Duration</th>
                  <th className="text-center">Caller did not pick</th>
                  <th className="text-center">Number does not exist</th>
                  <th className="text-center">Respondent did not pick</th>
                  <th className="text-center">Respondent Picked the call</th>
                  <th className="text-center">Picked and Refused</th>
                  <th className="text-center">Number Exhausted</th>
                  <th className="text-center">Successful Interviews</th>
                  <th className="text-center">Number: Picked The Call</th>
                  <th className="text-center">Number: Does Not Working</th>
                  <th className="text-center">Number: No Response</th>
                  <th className="text-center">Number: Refused</th>
                  <th className="text-center">Caller Form not Fill</th>
                  <th className="text-center">Caller Form not Fill and Respondent Picked</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-left">{item.callerName}</td>
                    <td className="text-center">{item.callerId}</td>
                    <td className="text-center">
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        {item.numberOfDials.toLocaleString()}
                      </a>
                    </td>
                    <td className="text-center">{item.ivrDuration}</td>
                    <td className="text-center">{item.talkDuration}</td>
                    <td className="text-center">{item.callerDidNotPick.toLocaleString()}</td>
                    <td className="text-center">{item.numberDoesNotExist.toLocaleString()}</td>
                    <td className="text-center">{item.respondentDidNotPick.toLocaleString()}</td>
                    <td className="text-center">{item.respondentPickedCall.toLocaleString()}</td>
                    <td className="text-center">{item.pickedAndRefused.toLocaleString()}</td>
                    <td className="text-center">{item.numberExhausted.toLocaleString()}</td>
                    <td className="text-center">{item.successfulInterviews.toLocaleString()}</td>
                    <td className="text-center">{item.numberPickedTheCall.toLocaleString()}</td>
                    <td className="text-center">{item.numberDoesNotWorking.toLocaleString()}</td>
                    <td className="text-center">{item.numberNoResponse.toLocaleString()}</td>
                    <td className="text-center">{item.numberRefused.toLocaleString()}</td>
                    <td className="text-center">
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        {item.callerFormNotFill.toLocaleString()}
                      </a>
                    </td>
                    <td className="text-center">
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        {item.callerFormNotFillRespondentPicked.toLocaleString()}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default MonthlyReportPage;
