'use client';

import React from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { CreditCard, Minus, Plus, BarChart3, Clock } from 'lucide-react';

const DataOverviewPage = () => {
  // Sample data for overview metrics
  const overviewData = [
    {
      title: 'Min Sample',
      value: '725',
      icon: Minus,
    },
    {
      title: 'Max Sample',
      value: '1,356',
      icon: Plus,
    },
    {
      title: 'Average',
      value: '1,022',
      icon: BarChart3,
    },
    {
      title: 'Pending Interviews',
      value: '0',
      icon: Clock,
    },
  ];

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
          Data Overview
        </Heading>
      </div>

      {/* Data Overview Cards */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={3} className="text-lg font-semibold text-gray-900">
              Data Overview
            </Heading>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewData.map((item, index) => (
            <MetricCard
              key={index}
              icon={item.icon}
              title={item.title}
              value={item.value}
              bgColor="bg-green-500"
            />
          ))}
        </div>
      </Card>
    </FluidContainer>
  );
};

export default DataOverviewPage;
