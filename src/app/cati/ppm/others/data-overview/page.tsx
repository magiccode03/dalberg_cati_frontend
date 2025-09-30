'use client';

import React from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { CreditCard } from 'lucide-react';

const DataOverviewPage = () => {
  // Sample data for overview metrics
  const overviewData = [
    {
      title: 'Min Sample',
      value: '725',
      icon: CreditCard,
    },
    {
      title: 'Max Sample',
      value: '1,356',
      icon: CreditCard,
    },
    {
      title: 'Average',
      value: '1,022',
      icon: CreditCard,
    },
    {
      title: 'Pending Interviews',
      value: '0',
      icon: CreditCard,
    },
  ];

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Data Overview
        </Heading>
      </div>

      {/* Data Overview Cards */}
      <Card className="p-0">
        <div className="mb-6">
          <Heading level={3} className="text-xl font-semibold text-gray-900 relative">
            <span className="relative">
              Data Overview
              <span className="absolute -left-2 top-0 w-1 h-6 bg-green-700"></span>
            </span>
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {overviewData.map((item, index) => (
            <div 
              key={index} 
              className={`p-6 ${index < overviewData.length - 1 ? 'border-r border-gray-200' : ''}`}
            >
              <div className="flex items-center">
                {/* Icon Circle */}
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2">
                    <Text className="text-sm font-medium text-gray-600">
                      {item.title}
                    </Text>
                  </div>
                  <div className="mt-0">
                    <Heading level={4} className="text-lg font-semibold text-gray-900 mb-0">
                      {item.value}
                    </Heading>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </FluidContainer>
  );
};

export default DataOverviewPage;
