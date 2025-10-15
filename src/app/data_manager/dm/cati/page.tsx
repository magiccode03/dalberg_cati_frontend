'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

const CatiDataPage = () => {
  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        CATI Data Management
      </Heading>

      <Card className="mb-6">
        <div className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            CATI Data Overview
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Manage and analyze CATI (Computer Assisted Telephone Interview) data from telephonic surveys.
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                Total Calls
              </Heading>
              <Text className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                5,420
              </Text>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-green-800 dark:text-green-200 font-semibold mb-2">
                Successful
              </Heading>
              <Text className="text-green-600 dark:text-green-300 text-2xl font-bold">
                3,850
              </Text>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-red-800 dark:text-red-200 font-semibold mb-2">
                Failed
              </Heading>
              <Text className="text-red-600 dark:text-red-300 text-2xl font-bold">
                1,570
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Management Tools
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400">
            CATI data management tools and features will be implemented here.
          </Text>
        </div>
      </Card>
    </Container>
  );
};

export default CatiDataPage;
