'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function ReportsPage() {
  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports
          </Heading>
        </div>

        {/* Report Files Card */}
        <Card>
          {/* Card Header */}
          <div className="flex justify-between items-center mb-3">
            <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
              Report Files
            </Heading>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    #
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Title
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Report Date
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    File
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      No results found.
                    </div>
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
