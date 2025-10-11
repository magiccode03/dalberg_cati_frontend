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
  const [pageSize] = useState(5);

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

  const totalPages = Math.ceil(weightRequests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = weightRequests.slice(startIndex, endIndex);

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
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
                Upload Weight
              </Heading>
            </div>
            <span className="text-end">
              {/* Sample file download button can be added here */}
            </span>
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
                <Button type="submit" variant="primary" className="w-full">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Previous Requests Card */}
      <Card className="">
        <div className="card-header mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              List of Previous Requests
            </Heading>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{weightRequests.length}</strong> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Cron ID</th>
                  <th>Action/Route</th>
                  <th>Planned At</th>
                  <th>Executed At</th>
                  <th>Execution</th>
                  <th>Errors</th>
                  <th>Status</th>
                  <th className="action-column">Actions</th>
                  <th className="action-column">UploadedFile</th>
                  <th>Params</th>
                  <th>CRON Info</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{request.cronId}</td>
                    <td>{request.actionRoute}</td>
                    <td>{request.plannedAt}</td>
                    <td>{request.executedAt}</td>
                    <td>{request.execution}</td>
                    <td>{request.errors}</td>
                    <td>
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewRequest(request.cronId)}
                        className="mr-2"
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
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                    <td>{request.params}</td>
                    <td>{request.cronInfo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={weightRequests.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
