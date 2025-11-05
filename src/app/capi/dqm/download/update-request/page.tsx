'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';

export default function UpdateRequestPage() {
  const [actionType, setActionType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  
  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      cronId: 'CRON001',
      actionRoute: '/api/download/all',
      actionType: 'Generate Data Download File (all.csv)',
      cronInfo: 'Daily data export',
      plannedAt: '2024-01-15 10:00:00',
      executedAt: '2024-01-15 10:05:00',
      execution: 'Success',
      errors: 'None',
      status: 'Completed'
    },
    {
      id: 2,
      cronId: 'CRON002',
      actionRoute: '/api/download/quality',
      actionType: 'Generate Data Download File (Data Quality Download Section)',
      cronInfo: 'Quality check export',
      plannedAt: '2024-01-15 11:00:00',
      executedAt: '2024-01-15 11:02:00',
      execution: 'Success',
      errors: 'None',
      status: 'Completed'
    },
    {
      id: 3,
      cronId: 'CRON003',
      actionRoute: '/api/download/all-files',
      actionType: 'Generate Data Download File (All files)',
      cronInfo: 'Complete data export',
      plannedAt: '2024-01-15 12:00:00',
      executedAt: 'Pending',
      execution: 'Pending',
      errors: 'None',
      status: 'Pending'
    }
  ];
  
  // Pagination calculations
  const totalPages = Math.ceil(mockData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = mockData.slice(startIndex, endIndex);

  const actionTypeOptions = [
    { value: '', label: 'Select Action Type' },
    { value: '1', label: 'Generate Data Download File (all.csv)' },
    { value: '2', label: 'Generate Data Download File (Data Quality Download Section)' },
    { value: '3', label: 'Generate Data Download File (All files)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { actionType, additionalInfo });
    // In a real application, this would submit the form data
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
            Update Request
          </Heading>
        </div>
      </div>

      {/* Form Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Download Request
            </Heading>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <div className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Action Type <span className="text-red-500">*</span>
                </Text>
                <SelectDropdown
                  value={actionType}
                  onChange={(value) => setActionType(value as string)}
                  options={actionTypeOptions}
                  placeholder="Select Action Type"
                />
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Additional Info <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Additional Info for this Cron"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-12">
              <Button
                type="submit"
                variant="primary"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Generate Request
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Data Download Requests Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of Data Download Requests
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{mockData.length.toLocaleString()}</strong> requests.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Cron ID</th>
                  <th className="text-center">Action/Route</th>
                  <th className="text-center">Action Type</th>
                  <th className="text-center">CRON Info</th>
                  <th className="text-center">Planned At</th>
                  <th className="text-center">Executed At</th>
                  <th className="text-center">Execution</th>
                  <th className="text-center">Errors</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center">{item.cronId}</td>
                      <td className="text-left">{item.actionRoute}</td>
                      <td className="text-left">{item.actionType}</td>
                      <td className="text-left">{item.cronInfo}</td>
                      <td className="text-center">{item.plannedAt}</td>
                      <td className="text-left">{item.executedAt}</td>
                      <td className="text-left">{item.execution}</td>
                      <td className="text-left">{item.errors}</td>
                      <td className="text-center">
                        <span className={`badge ${item.status === 'Completed' ? 'bg-success' : item.status === 'Pending' ? 'bg-warning' : 'bg-danger'} text-white`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          title="View Details"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-8">
                      <div className="text-gray-500">
                        No results found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={mockData.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
