'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

const CombineDataPage = () => {
  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Combined Data Management
      </Heading>

      <Card className="mb-6">
        <div className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Combined Data Overview
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Analyze and manage combined data from both CAPI and CATI surveys for comprehensive insights.
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                Total Responses
              </Heading>
              <Text className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                6,670
              </Text>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-purple-800 dark:text-purple-200 font-semibold mb-2">
                CAPI Data
              </Heading>
              <Text className="text-purple-600 dark:text-purple-300 text-2xl font-bold">
                1,180
              </Text>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-green-800 dark:text-green-200 font-semibold mb-2">
                CATI Data
              </Heading>
              <Text className="text-green-600 dark:text-green-300 text-2xl font-bold">
                3,850
              </Text>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-orange-800 dark:text-orange-200 font-semibold mb-2">
                Completion Rate
              </Heading>
              <Text className="text-orange-600 dark:text-orange-300 text-2xl font-bold">
                75.4%
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Combined Analysis Tools
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400">
            Combined data analysis tools and cross-platform insights will be implemented here.
          </Text>
        </div>
      </Card>
    </Container>
  );
};

export default CombineDataPage;
