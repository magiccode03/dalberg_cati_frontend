'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

const CapiDataPage = () => {
  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        CAPI Data Management
      </Heading>

      <Card className="mb-6">
        <div className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            CAPI Data Overview
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Manage and analyze CAPI (Computer Assisted Personal Interview) data from field surveys.
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                Total Surveys
              </Heading>
              <Text className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                1,250
              </Text>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-green-800 dark:text-green-200 font-semibold mb-2">
                Completed
              </Heading>
              <Text className="text-green-600 dark:text-green-300 text-2xl font-bold">
                1,180
              </Text>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <Heading level={4} className="text-orange-800 dark:text-orange-200 font-semibold mb-2">
                Pending
              </Heading>
              <Text className="text-orange-600 dark:text-orange-300 text-2xl font-bold">
                70
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
            CAPI data management tools and features will be implemented here.
          </Text>
        </div>
      </Card>
    </Container>
  );
};

export default CapiDataPage;
