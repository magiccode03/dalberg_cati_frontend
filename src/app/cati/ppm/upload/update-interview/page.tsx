'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Radio from '@/components/ui/Radio';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Eye } from 'lucide-react';

// Interfaces
interface UpdateRequestData {
  id: number;
  cronId: string;
  actionRoute: string;
  additionalInfo: string;
  plannedAt: string;
  executedAt: string;
  execution: string;
  errors: string;
  status: string;
}

const UpdateInterviewPage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // State for upload form
  const [uploadForm, setUploadForm] = useState({
    actionType: '',
    csvFile: null as File | null,
    additionalInfo: '',
  });

  // Sample data for update requests
  const [updateRequestsData] = useState<UpdateRequestData[]>([
    {
      id: 1,
      cronId: '15287',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'Valid interviews(Valid Interviews)',
      plannedAt: '2024-05-20 17:32:12',
      executedAt: 'a year ago',
      execution: '1922',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 2,
      cronId: '14623',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'NWR Rejections(Reject Interviews)',
      plannedAt: '2024-04-17 12:18:17',
      executedAt: 'a year ago',
      execution: '5915',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 3,
      cronId: '14586',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'NWR Rejections(Reject Interviews)',
      plannedAt: '2024-04-15 16:54:22',
      executedAt: 'a year ago',
      execution: '5956',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 4,
      cronId: '14111',
      actionRoute: '/wbtelesurvey/process/filedatavalidationbyac',
      additionalInfo: 'Process Pending data',
      plannedAt: '2024-03-29 17:21:01',
      executedAt: 'a year ago',
      execution: '',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 5,
      cronId: '13154',
      actionRoute: '/wbtelesurvey/process/filedatavalidationbyac',
      additionalInfo: 'Process Pending data',
      plannedAt: '2024-03-20 18:40:03',
      executedAt: 'a year ago',
      execution: '',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 6,
      cronId: '5970',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'Less than 2 Min(Reject Interviews)',
      plannedAt: '2023-12-07 12:07:50',
      executedAt: 'a year ago',
      execution: '2762',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 7,
      cronId: '5784',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'Valid interview 28th nov(Valid Interviews)(Valid Interviews)',
      plannedAt: '2023-11-29 18:25:59',
      executedAt: 'a year ago',
      execution: '71',
      errors: 'No',
      status: 'Cancelled',
    },
    {
      id: 8,
      cronId: '5783',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'Valid interview 28th nov(Valid Interviews)(Valid Interviews)',
      plannedAt: '2023-11-29 18:25:59',
      executedAt: 'a year ago',
      execution: '71',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 9,
      cronId: '5587',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'QC Rejection(Reject Interviews)',
      plannedAt: '2023-11-23 15:10:20',
      executedAt: 'a year ago',
      execution: '56',
      errors: 'No',
      status: 'Completed',
    },
    {
      id: 10,
      cronId: '5506',
      actionRoute: 'wbtelesurvey/process/rundynamicquery',
      additionalInfo: 'Valid interview 18th nov(Valid Interviews)',
      plannedAt: '2023-11-20 11:58:40',
      executedAt: 'a year ago',
      execution: '45',
      errors: 'No',
      status: 'Completed',
    },
  ]);

  // Handlers
  const handleActionTypeChange = (value: string) => {
    setUploadForm(prev => ({
      ...prev,
      actionType: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({
      ...prev,
      csvFile: file,
    }));
  };

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadForm(prev => ({
      ...prev,
      additionalInfo: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update interview form submitted:', uploadForm);
    // Reset form after submission
    setUploadForm({
      actionType: '',
      csvFile: null,
      additionalInfo: '',
    });
  };

  const handleViewRequest = (cronId: string) => {
    console.log('View request for Cron ID:', cronId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  // Pagination calculations
  const totalItems = updateRequestsData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = updateRequestsData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Update Interview
        </Heading>
      </div>

      {/* Upload Form */}
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload File for Reject/Valid
            </Heading>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Action Type */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <div className="space-y-2">
                <Radio
                  id="reject-to-valid"
                  name="actionType"
                  value="1"
                  checked={uploadForm.actionType === '1'}
                  onChange={() => handleActionTypeChange('1')}
                  label="Reject Interviews to Valid Interviews"
                />
                <Radio
                  id="valid-to-reject"
                  name="actionType"
                  value="2"
                  checked={uploadForm.actionType === '2'}
                  onChange={() => handleActionTypeChange('2')}
                  label="Valid Interviews to Reject Interviews"
                />
              </div>
            </div>

            {/* CSV File */}
            <div>
              <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                CSV File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Info <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="additionalInfo"
                value={uploadForm.additionalInfo}
                onChange={handleAdditionalInfoChange}
                placeholder="Additional Info for this Cron"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" variant="primary" className="bg-blue-500 hover:bg-blue-600">
              Submit
            </Button>
          </div>
        </form>
      </Card>

      {/* List of Updating Requests */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of Updating Requests
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
                  <th className="text-center">Cron ID</th>
                  <th className="text-center">Action/Route</th>
                  <th className="text-center">Additional Info</th>
                  <th className="text-center">Planned At</th>
                  <th className="text-center">Executed At</th>
                  <th className="text-center">Execution</th>
                  <th className="text-center">Errors</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{item.cronId}</td>
                    <td className="text-left">{item.actionRoute}</td>
                    <td className="text-left">{item.additionalInfo}</td>
                    <td className="text-center">{item.plannedAt}</td>
                    <td className="text-center">{item.executedAt}</td>
                    <td className="text-center">{item.execution}</td>
                    <td className="text-center">{item.errors}</td>
                    <td className="text-center">
                      <span className={getStatusColor(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleViewRequest(item.cronId)}
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                        title="View Request"
                      >
                        <Eye className="w-4 h-4 text-white" />
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

export default UpdateInterviewPage;
