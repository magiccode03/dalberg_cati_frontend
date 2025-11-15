'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Mock data for demonstration
  const reportsData = [
    {
      id: 1,
      title: 'Daily Progress Report',
      reportDate: '2024-01-15',
      fileName: 'daily_progress_2024_01_15.xlsx'
    },
    {
      id: 2,
      title: 'Weekly Summary Report',
      reportDate: '2024-01-14',
      fileName: 'weekly_summary_2024_01_14.pdf'
    },
    {
      id: 3,
      title: 'Monthly Analysis Report',
      reportDate: '2024-01-13',
      fileName: 'monthly_analysis_2024_01_13.xlsx'
    },
    {
      id: 4,
      title: 'Call Detail Report',
      reportDate: '2024-01-12',
      fileName: 'call_detail_2024_01_12.csv'
    },
    {
      id: 5,
      title: 'Performance Metrics Report',
      reportDate: '2024-01-11',
      fileName: 'performance_metrics_2024_01_11.pdf'
    }
  ];

  // Pagination calculations
  const totalItems = reportsData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = reportsData.slice(startIndex, endIndex);

  const handleDownload = (fileName: string) => {
    console.log('Downloading:', fileName);
    // Handle download logic here
  };
  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Reports
          </Heading>
        </div>
      </div>

      {/* Report Files Card */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Report Files
            </Heading>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-left">Title</th>
                  <th className="text-center">Report Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No reports found
                    </td>
                  </tr>
                ) : (
                  currentData.map((report, index) => (
                    <tr key={report.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{report.title}</td>
                      <td className="text-center">{report.reportDate}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(report.fileName)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
