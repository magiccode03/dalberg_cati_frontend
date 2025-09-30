'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Radio from '@/components/ui/Radio';
import { Table } from '@/components/ui/Table';
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

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Update Interview
        </Heading>
      </div>

      {/* Upload Form */}
      <Card className="mb-6">
        <div className="mb-4">
          <Heading level={4} className="text-xl font-semibold text-gray-900">
            Upload File for Reject/Valid
          </Heading>
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
            <Button type="submit" variant="primary" className="bg-green-600 hover:bg-green-700">
              Submit
            </Button>
          </div>
        </form>
      </Card>

      {/* List of Updating Requests */}
      <Card>
        <div className="mb-4">
          <Heading level={4} className="text-xl font-semibold text-gray-900">
            List of Updating Requests
          </Heading>
        </div>

        {/* Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">1-{updateRequestsData.length}</span> of <span className="font-semibold">{updateRequestsData.length}</span> items.
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Cron ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Action/Route</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Additional Info</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Planned At</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Executed At</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Execution</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Errors</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {updateRequestsData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.cronId}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.actionRoute}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.additionalInfo}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.plannedAt}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.executedAt}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.execution}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.errors}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className={getStatusColor(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <button
                      onClick={() => handleViewRequest(item.cronId)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </FluidContainer>
  );
};

export default UpdateInterviewPage;
