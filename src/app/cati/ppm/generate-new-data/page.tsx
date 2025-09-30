'use client';

import React from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { CreditCard } from 'lucide-react';

const GenerateNewDataPage = () => {
  const handleACWiseData = () => {
    console.log('Generate AC Wise Data');
  };

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
          {/* AC Wise Data */}
          <div className="border-r border-gray-200 pr-4">
            <button
              onClick={handleACWiseData}
              className="w-full text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center p-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-gray-600 mb-1">AC Wise Data</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    Generate Average Records from Each AC
                  </Text>
                </div>
              </div>
            </button>
          </div>
        </div>
      </Card>
    </FluidContainer>
  );
};

export default GenerateNewDataPage;
