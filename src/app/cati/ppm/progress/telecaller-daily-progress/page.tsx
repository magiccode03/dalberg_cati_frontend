'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Search, Users, Clock, PhoneCall, PhoneOff, CheckCircle } from 'lucide-react';

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
  const itemsPerPage = 25;

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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center">
          <div>
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
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
                onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
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
                  onChange={(value) => handleFilterChange('customDate', Array.isArray(value) ? value[0] : value)}
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
                  onChange={(value) => handleFilterChange('customDateEnd', Array.isArray(value) ? value[0] : value)}
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
                onChange={(value) => handleFilterChange('telecaller', Array.isArray(value) ? value[0] : value)}
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
              Call Outcome
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
                icon={PhoneOff}
                title="Picked and Refused"
                value={callOutcomeMetrics.pickedAndRefused}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneCall}
                title="Picked and Call Continue"
                value={callOutcomeMetrics.pickedAndCallContinue}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Total Form Not Fill"
                value={callOutcomeMetrics.totalFormNotFill}
                bgColor="bg-green-500"
              />
            </div>
          </Card>

          {/* Number Summary */}
          <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Number Summary
            </Heading>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard
                icon={PhoneOff}
                title="Total Number Exhausted"
                value={numberSummaryMetrics.totalNumberExhausted}
                bgColor="bg-blue-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Number does not exist"
                value={numberSummaryMetrics.numberDoesNotExist}
                bgColor="bg-blue-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Respondent did not pick"
                value={numberSummaryMetrics.respondentDidNotPick}
                bgColor="bg-blue-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Picked and Refused"
                value={numberSummaryMetrics.pickedAndRefused}
                bgColor="bg-blue-500"
              />
              <MetricCard
                icon={PhoneCall}
                title="Picked and Call Continue"
                value={numberSummaryMetrics.pickedAndCallContinue}
                bgColor="bg-blue-500"
              />
              <MetricCard
                icon={CheckCircle}
                title="Valid Interviews"
                value={numberSummaryMetrics.validInterviews}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Rejected"
                value={numberSummaryMetrics.rejected}
                bgColor="bg-green-500"
              />
              <MetricCard
                icon={PhoneOff}
                title="Incomplete"
                value={numberSummaryMetrics.incomplete}
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
              <Heading level={4} className="text-lg font-semibold text-gray-900">
                Caller Summary
              </Heading>
            </div>
            <Button variant="secondary" size="sm" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Data
            </Button>
          </div>

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
                  <th className="text-center">Number of Dials</th>
                  <th className="text-center">IVR Duration</th>
                  <th className="text-center">Talk Duration</th>
                  <th className="text-center">Caller Did Not Pick</th>
                  <th className="text-center">Number Does Not Exist</th>
                  <th className="text-center">Respondent Did Not Pick</th>
                  <th className="text-center">Respondent Picked Call</th>
                  <th className="text-center">Picked and Refused</th>
                  <th className="text-center">Number Exhausted</th>
                  <th className="text-center">Successful Interviews</th>
                  <th className="text-center">Rejected Interviews</th>
                  <th className="text-center">Incomplete Interviews</th>
                  <th className="text-center">Number: Picked The Call</th>
                  <th className="text-center">Number: Does Not Working</th>
                  <th className="text-center">Number: No Response</th>
                  <th className="text-center">Number: Refused</th>
                  <th className="text-center">Caller Form Not Fill</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{item.callerName}</td>
                      <td className="text-center">{item.numberOfDials}</td>
                      <td className="text-center">{item.ivrDuration}</td>
                      <td className="text-center">{item.talkDuration}</td>
                      <td className="text-center">{item.callerDidNotPick}</td>
                      <td className="text-center">{item.numberDoesNotExist}</td>
                      <td className="text-center">{item.respondentDidNotPick}</td>
                      <td className="text-center">{item.respondentPickedCall}</td>
                      <td className="text-center">{item.pickedAndRefused}</td>
                      <td className="text-center">{item.numberExhausted}</td>
                      <td className="text-center">{item.successfulInterviews}</td>
                      <td className="text-center">{item.rejectedInterviews}</td>
                      <td className="text-center">{item.incompleteInterviews}</td>
                      <td className="text-center">{item.numberPickedCall}</td>
                      <td className="text-center">{item.numberDoesNotWorking}</td>
                      <td className="text-center">{item.numberNoResponse}</td>
                      <td className="text-center">{item.numberRefused}</td>
                      <td className="text-center">{item.callerFormNotFill}</td>
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
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default TelecallerDailyProgressPage;
