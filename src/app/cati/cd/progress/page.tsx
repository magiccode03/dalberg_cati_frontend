'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import LineChart from '@/components/charts/LineChart';
import { Search, Phone, Clock, Users, PhoneCall, PhoneOff, CheckCircle } from 'lucide-react';

interface ProgressData {
  totalCallers: number;
  daysTillNow: number;
  numberOfDials: number;
  totalIVRDuration: string;
  callerDidNotPick: number;
  totalTalkDuration: string;
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  pickedAndRefused: number;
  pickedAndCallContinue: number;
  totalNumberExhausted: number;
  successfulInterviews: number;
}

export default function CATIProgressPage() {
  const [filters, setFilters] = useState({
    reportDays: 'today',
    customDate: '',
    customDateEnd: ''
  });

  const [showCustomDate, setShowCustomDate] = useState(false);

  // Sample progress data
  const progressData: ProgressData = {
    totalCallers: 0,
    daysTillNow: 0,
    numberOfDials: 0,
    totalIVRDuration: '00:00:00',
    callerDidNotPick: 0,
    totalTalkDuration: '00:00:00',
    numberDoesNotExist: 0,
    respondentDidNotPick: 0,
    pickedAndRefused: 0,
    pickedAndCallContinue: 0,
    totalNumberExhausted: 0,
    successfulInterviews: 0
  };

  // Sample chart data
  const chartData = [
    {
      name: 'Successful Interviews',
      data: [1000, 875, 180, 111, 222, 381, 372, 84],
      color: '#18b79d'
    },
    {
      name: 'Number of Dials',
      data: [8736, 7372, 1595, 1963, 5120, 6867, 8031, 2104],
      color: '#cb9886'
    },
    {
      name: 'Total Number Exhausted',
      data: [6955, 5871, 1207, 1696, 4429, 5842, 5584, 1431],
      color: '#2e86db'
    }
  ];

  const xAxisData = ['2024-05-24', '2024-05-25', '2024-05-26', '2024-05-27', '2024-05-28', '2024-05-29', '2024-05-30', '2024-05-31'];

  // Generate date options for custom date dropdowns
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Date' }];
    const startDate = new Date('2024-05-02');
    const endDate = new Date('2024-05-31');
    
    for (let d = new Date(endDate); d >= startDate; d.setDate(d.getDate() - 1)) {
      const dateStr = d.toISOString().split('T')[0];
      options.push({ value: dateStr, label: dateStr });
    }
    
    return options;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    
    if (field === 'reportDays') {
      setShowCustomDate(value === 'custom');
    }
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
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
    <Container maxWidth="full">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            Progress
          </Heading>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Report Days
              </Text>
              <SelectDropdown
                value={filters.reportDays}
                onChange={(value: string | string[]) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'today', label: 'Today' },
                  { value: 'yesterday', label: 'Yesterday' },
                  { value: 'dby', label: 'Day Before Yesterday' },
                  { value: 'l3', label: 'Last 3 Days' },
                  { value: 'l7', label: 'Last 7 Days' },
                  { value: 'l15', label: 'Last 15 Days' },
                  { value: 'currentmonth', label: 'Current Month' },
                  { value: 'custom', label: 'Custom Date' }
                ]}
                placeholder="Select Report Days"
              />
            </div>

            {showCustomDate && (
              <>
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Start Date
                  </Text>
                  <SelectDropdown
                    value={filters.customDate}
                    onChange={(value: string | string[]) => handleFilterChange('customDate', Array.isArray(value) ? value[0] : value)}
                    options={generateDateOptions()}
                    placeholder="Select Start Date"
                  />
                </div>

                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    End Date
                  </Text>
                  <SelectDropdown
                    value={filters.customDateEnd}
                    onChange={(value: string | string[]) => handleFilterChange('customDateEnd', Array.isArray(value) ? value[0] : value)}
                    options={generateDateOptions()}
                    placeholder="Select End Date"
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
        {/* Caller Performance */}
        <Card>
          <Heading level={3} className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Caller Performance
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={Users}
              title="Total Callers"
              value={progressData.totalCallers}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={Clock}
              title="Days till now"
              value={progressData.daysTillNow}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Number of dials"
              value={progressData.numberOfDials}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={Clock}
              title="Total IVR Duration"
              value={progressData.totalIVRDuration}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Caller did not pick"
              value={progressData.callerDidNotPick}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={Phone}
              title="Total Talk Duration"
              value={progressData.totalTalkDuration}
              bgColor="bg-blue-500"
            />
          </div>
        </Card>

        {/* Call Outcome */}
        <Card>
          <Heading level={3} className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Call Outcome
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={PhoneOff}
              title="Number does not exist"
              value={progressData.numberDoesNotExist}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Respondent did not pick"
              value={progressData.respondentDidNotPick}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Picked and Refused"
              value={progressData.pickedAndRefused}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneCall}
              title="Picked and Call Continue"
              value={progressData.pickedAndCallContinue}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Total Number Exhausted"
              value={progressData.totalNumberExhausted}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={CheckCircle}
              title="Successful Interviews"
              value={progressData.successfulInterviews}
              bgColor="bg-green-500"
            />
          </div>
        </Card>
      </div>

      {/* Daily Call Outcome Chart */}
      <Card>
        <LineChart
          data={chartData}
          xAxisData={xAxisData}
          title="Daily Call Outcome"
          height={350}
          smooth={true}
          area={false}
        />
      </Card>
    </Container>
  );
}
