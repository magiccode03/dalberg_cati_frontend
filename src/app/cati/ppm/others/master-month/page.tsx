'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Plus, Edit, RefreshCw, Check, X } from 'lucide-react';

// Interfaces
interface MonthData {
  id: number;
  monthId: string;
  monthName: string;
  startDate: string;
  endDate: string;
  isCurrentMonth: boolean;
  status: string;
}

const MasterMonthPage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Sample data for months
  const [monthData] = useState<MonthData[]>([
    {
      id: 1,
      monthId: '92023',
      monthName: 'Sept 2023',
      startDate: '2023-09-01',
      endDate: '2023-09-30',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 2,
      monthId: '102023',
      monthName: 'Oct 2023',
      startDate: '2023-10-01',
      endDate: '2023-10-31',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 3,
      monthId: '112023',
      monthName: 'Nov 2023',
      startDate: '2023-11-01',
      endDate: '2023-11-30',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 4,
      monthId: '122023',
      monthName: 'Dec 2023',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 5,
      monthId: '12024',
      monthName: 'Jan 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 6,
      monthId: '22024',
      monthName: 'Feb 2024',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 7,
      monthId: '32024',
      monthName: 'Mar 2024',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      isCurrentMonth: false,
      status: 'Active',
    },
    {
      id: 8,
      monthId: '42024',
      monthName: 'Apr 2024',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      isCurrentMonth: true,
      status: 'Active',
    },
  ]);

  const handleAddNewMonth = () => {
    console.log('Add new month');
  };

  const handleUpdateMonth = (monthId: string) => {
    console.log('Update month:', monthId);
  };

  const handleRefreshProgress = (monthId: string) => {
    console.log('Refresh progress for month:', monthId);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-600' : 'text-red-600';
  };

  // Pagination calculations
  const totalItems = monthData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = monthData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Master Month
        </Heading>
      </div>

      {/* Month List Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              WB CATI | PMT | Months | West Bengal Telephonic Survey 2024
            </Heading>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddNewMonth}
            className="flex items-center bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Month
          </Button>
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
                  <th className="text-center">Month ID</th>
                  <th className="text-center">Month Name</th>
                  <th className="text-center">Start Date</th>
                  <th className="text-center">End Date</th>
                  <th className="text-center">Current Month</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Update</th>
                  <th className="text-center">Progress</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{item.monthId}</td>
                    <td className="text-left">{item.monthName}</td>
                    <td className="text-center">{item.startDate}</td>
                    <td className="text-center">{item.endDate}</td>
                    <td className="text-center">
                      {item.isCurrentMonth ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="text-center">
                      <span className={getStatusColor(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleUpdateMonth(item.monthId)}
                        className="bg-blue-500 hover:bg-blue-600 rounded px-3 py-2 flex items-center text-white"
                        title="Update Month"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRefreshProgress(item.monthId)}
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                        title="Refresh Progress"
                      >
                        <RefreshCw className="w-4 h-4 text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default MasterMonthPage;
