'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Download } from 'lucide-react';

export default function RawDataPage() {
  const handleDownload = (type: string) => {
    // Implement download logic here
    console.log(`Downloading ${type} data`);
    // You can implement actual download functionality here
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            Raw Data
          </Heading>
        </div>

        {/* Download Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Action
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white">
                    Download All Call Data
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                    <button
                      onClick={() => handleDownload('all')}
                      className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white">
                    Download Successful Call Data
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                    <button
                      onClick={() => handleDownload('successful')}
                      className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Container>
  );
}
