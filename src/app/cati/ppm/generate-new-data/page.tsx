'use client';

import React from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { CreditCard, Database, BarChart3 } from 'lucide-react';

const GenerateNewDataPage = () => {
  const handleACWiseData = () => {
    console.log('Generate AC Wise Data');
  };

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    description, 
    bgColor = 'bg-blue-500',
    iconColor = 'text-white',
    onClick
  }: {
    icon: any;
    title: string;
    description: string;
    bgColor?: string;
    iconColor?: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
    >
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
              {description}
            </Text>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Generate New Data
        </Heading>
      </div>

      {/* Generate New Data Options */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={3} className="text-lg font-semibold text-gray-900">
              Generate New Data
            </Heading>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            icon={Database}
            title="AC Wise Data"
            description="Generate Average Records from Each AC"
            bgColor="bg-blue-500"
            onClick={handleACWiseData}
          />
        </div>
      </Card>
    </FluidContainer>
  );
};

export default GenerateNewDataPage;
