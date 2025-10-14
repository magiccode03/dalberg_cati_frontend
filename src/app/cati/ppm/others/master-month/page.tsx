'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
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
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">
              WB CATI | PMT | Months | West Bengal Telephonic Survey 2024
            </Heading>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddNewMonth}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Month
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Month ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Month Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Start Date</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">End Date</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Current Month</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Update</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Progress</th>
              </tr>
            </thead>
            <tbody>
              {monthData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.monthId}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.monthName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.startDate}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.endDate}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    {item.isCurrentMonth ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className={getStatusColor(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <button
                      onClick={() => handleUpdateMonth(item.monthId)}
                      className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-2 flex items-center text-white"
                      title="Update Month"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      
                    </button>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                    <button
                      onClick={() => handleRefreshProgress(item.monthId)}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
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

        {/* Table Footer */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Total <span className="font-semibold">{monthData.length}</span> items.
          </div>
          <div className="text-sm text-gray-500">
            {/* Pagination would go here if needed */}
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default MasterMonthPage;
