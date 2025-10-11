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

interface ChangeStatusRequest {
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

export default function ChangeStatusPage() {
  const [actionType, setActionType] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data for previous requests
  const changeStatusRequests: ChangeStatusRequest[] = [
    {
      id: 1,
      cronId: 1122,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-07-02 16:56:10',
      executedAt: '2 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 2,
      cronId: 1009,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-30 12:54:45',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 3,
      cronId: 1004,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-29 11:04:09',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 4,
      cronId: 994,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-27 17:24:13',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 5,
      cronId: 991,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-27 10:17:52',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 6,
      cronId: 985,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-26 12:16:00',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 7,
      cronId: 978,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-24 14:14:46',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 8,
      cronId: 975,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-24 11:52:42',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 9,
      cronId: 960,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-22 12:51:59',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-15'
    },
    {
      id: 10,
      cronId: 955,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-21 18:15:26',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 11,
      cronId: 953,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-21 16:47:38',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 12,
      cronId: 946,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-20 08:12:24',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 13,
      cronId: 945,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-20 08:02:25',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 14,
      cronId: 932,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-16 14:09:55',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 15,
      cronId: 924,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-15 13:09:21',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 16,
      cronId: 921,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-15 12:40:07',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 17,
      cronId: 918,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-14 15:17:33',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-2'
    },
    {
      id: 18,
      cronId: 916,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-14 10:27:52',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-15'
    },
    {
      id: 19,
      cronId: 915,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-13 19:34:55',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    },
    {
      id: 20,
      cronId: 913,
      actionRoute: '/bh/poll202504/dynamic-process/changestatus',
      plannedAt: '2025-05-13 18:40:04',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-1'
    }
  ];

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: '1', label: 'Type 1 : Reject Interview (N+W+RTA)' },
    { value: '6', label: 'Type 6 : Reject Interview (Short Interview)' },
    { value: '2', label: 'Type 2 : Valid Interview' },
    { value: '11', label: 'Type 11 : Reject Interview - Audio (3 : Irrelevant Conversation)' },
    { value: '15', label: 'Type 15 : Valid for Client' }
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

  const totalPages = Math.ceil(changeStatusRequests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = changeStatusRequests.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Change Status of Interviews
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
              <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
                Change Status of Interviews
              </Heading>
            </div>
            <span className="text-end">
              {/* Sample file download button can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
                Total <strong>{changeStatusRequests.length}</strong> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead>
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Cron ID</th>
                  <th className="text-left">Action/Route</th>
                  <th className="text-center">Planned At</th>
                  <th className="text-center">Executed At</th>
                  <th className="text-center">Execution</th>
                  <th className="text-left">Errors</th>
                  <th className="text-center">Status</th>
                  <th className="text-center action-column">Actions</th>
                  <th className="text-center action-column">UploadedFile</th>
                  <th className="text-left">Params</th>
                  <th className="text-left">CRON Info</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{request.cronId}</td>
                    <td className="text-left">{request.actionRoute}</td>
                    <td className="text-center">{request.plannedAt}</td>
                    <td className="text-center">{request.executedAt}</td>
                    <td className="text-center">{request.execution}</td>
                    <td className="text-left">{request.errors}</td>
                    <td className="text-center">
                      <span className="badge bg-success text-white">
                        {request.status}
                      </span>
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
                    <td className="text-left">{request.params}</td>
                    <td className="text-left">{request.cronInfo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={changeStatusRequests.length}
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
