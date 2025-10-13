'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';

export default function ReportsPage() {
  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
            Reports
          </Heading>
        </div>

        {/* Report Files Card */}
        <Card>
          {/* Card Header */}
          <div className="flex items-center mb-3">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Report Files
            </Heading>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <Table className="table table-bordered table-striped table-hover">
              <thead className="sticky-header bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center">S.No</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-left">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-left">Report Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center">File</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center border-b border-gray-200">
                    <div className="text-gray-500 dark:text-gray-400">
                      No results found.
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </Container>
  );
}
