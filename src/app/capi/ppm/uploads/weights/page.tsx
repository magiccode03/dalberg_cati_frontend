'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Eye, Download } from 'lucide-react';

interface WeightRequest {
  id: number;
  cronId: number;
  actionRoute: string;
  plannedAt: string;
  executedAt: string;
  execution: number;
  errors: string;
  status: string;
  params: string;
  cronInfo: string;
}

export default function WeightsPage() {
  const [actionType, setActionType] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Sample data for previous requests
  const weightRequests: WeightRequest[] = [
    {
      id: 1,
      cronId: 1062,
      actionRoute: '/bh/poll202504/dynamic-process/uploadweight',
      plannedAt: '2025-06-13 11:30:33',
      executedAt: '3 months ago',
      execution: 163,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 2,
      cronId: 1049,
      actionRoute: '/bh/poll202504/dynamic-process/uploadweight',
      plannedAt: '2025-06-12 13:24:40',
      executedAt: '3 months ago',
      execution: 162,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 3,
      cronId: 1027,
      actionRoute: '/bh/poll202504/dynamic-process/uploadweight',
      plannedAt: '2025-06-04 11:24:37',
      executedAt: '3 months ago',
      execution: 150,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 4,
      cronId: 1024,
      actionRoute: '/bh/poll202504/dynamic-process/uploadweight',
      plannedAt: '2025-06-03 18:12:54',
      executedAt: '3 months ago',
      execution: 2,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 5,
      cronId: 827,
      actionRoute: '/bh/poll202504/dynamic-process/uploadweight',
      plannedAt: '2025-04-29 11:29:46',
      executedAt: '4 months ago',
      execution: 33,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    }
  ];

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: '1', label: 'Upload Weight' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Action Type:', actionType);
    console.log('CSV File:', csvFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCsvFile(file);
  };

  const handleViewRequest = (cronId: number) => {
    // Handle view request logic here
    console.log('View request for cron ID:', cronId);
  };

  const handleDownloadFile = (cronId: number) => {
    // Handle download file logic here
    console.log('Download file for cron ID:', cronId);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') {
      return <span className="badge bg-success text-white">{status}</span>;
    } else if (status === 'Failed') {
      return <span className="badge bg-danger text-white">{status}</span>;
    }
    return <span className="badge bg-secondary text-white">{status}</span>;
  };

  // Pagination calculations
  const totalItems = weightRequests.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = weightRequests.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Weight
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Upload Form Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload Weight
            </Heading>
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                CSV Format
              </Text>
              <Text className="text-xs text-gray-500 mb-3">
                server_id,valid_for_report,weight_demographic,weight_voteshare
              </Text>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group">
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Select Action
                </Text>
                <SelectDropdown
                  value={actionType}
                  onChange={(value) => setActionType(value as string)}
                  options={actionOptions}
                  placeholder="Select Action"
                  className="w-full"
                />
              </div>
              
              <div className="form-group">
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  CSV File
                </Text>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
              
              <div className="form-group flex items-end">
                <Button type="submit" variant="primary" className="w-full bg-blue-500 hover:bg-blue-600">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Previous Requests Card */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of Previous Requests
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
                  <th className="text-center">Planned At</th>
                  <th className="text-center">Executed At</th>
                  <th className="text-center">Execution</th>
                  <th className="text-center">Errors</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                  <th className="text-center">UploadedFile</th>
                  <th className="text-center">Params</th>
                  <th className="text-center">CRON Info</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((request, index) => (
                  <tr key={request.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{request.cronId}</td>
                    <td className="text-left">{request.actionRoute}</td>
                    <td className="text-center">{request.plannedAt}</td>
                    <td className="text-center">{request.executedAt}</td>
                    <td className="text-center">{request.execution}</td>
                    <td className="text-center">{request.errors}</td>
                    <td className="text-center">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewRequest(request.cronId)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownloadFile(request.cronId)}
                        title="Download Uploaded File"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="text-center">{request.params}</td>
                    <td className="text-center">{request.cronInfo}</td>
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
}
