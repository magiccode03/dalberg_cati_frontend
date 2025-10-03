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

interface SendToQcRequest {
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

export default function SendToQcPage() {
  const [actionType, setActionType] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(16);

  // Sample data for previous requests
  const sendToQcRequests: SendToQcRequest[] = [
    {
      id: 1,
      cronId: 1100,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-06-30 14:53:09',
      executedAt: '2 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 2,
      cronId: 1038,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-06-05 11:47:22',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 3,
      cronId: 1018,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-06-02 14:46:28',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 4,
      cronId: 1010,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-30 12:57:27',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 5,
      cronId: 1008,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-30 12:48:43',
      executedAt: '3 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 6,
      cronId: 928,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-15 18:56:06',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-11'
    },
    {
      id: 7,
      cronId: 919,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-14 20:46:25',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-11'
    },
    {
      id: 8,
      cronId: 917,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-14 12:34:30',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-11'
    },
    {
      id: 9,
      cronId: 914,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-13 19:03:36',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-11'
    },
    {
      id: 10,
      cronId: 912,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-13 18:24:30',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-11'
    },
    {
      id: 11,
      cronId: 911,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-13 17:23:10',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'Yes',
      status: 'Failed',
      params: '',
      cronInfo: 'Type Id-11'
    },
    {
      id: 12,
      cronId: 892,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-09 16:26:48',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 13,
      cronId: 868,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-05 17:56:56',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 14,
      cronId: 844,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-05-02 11:29:57',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 15,
      cronId: 833,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-04-30 15:02:46',
      executedAt: '4 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    },
    {
      id: 16,
      cronId: 758,
      actionRoute: '/bh/poll202504/dynamic-process/sendtoqc',
      plannedAt: '2025-04-15 18:44:00',
      executedAt: '5 months ago',
      execution: 1,
      errors: 'No',
      status: 'Completed',
      params: '',
      cronInfo: 'Type Id-9'
    }
  ];

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: '9', label: 'Type 9 : Any Interview Send to Audio QC' },
    { value: '11', label: 'Type 11 : Any Interview Send to Kadence' }
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

  const totalPages = Math.ceil(sendToQcRequests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = sendToQcRequests.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            Send to QC
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Upload Form Card */}
      <Card className="p-6 mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              Send to QC
            </Heading>
            <span className="text-end">
              {/* Sample file download button can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            </div>
            
            <div className="form-group">
              <div className="col-lg-offset-3 col-lg-11">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Previous Requests Card */}
      <Card className="p-6">
        <div className="card-header mb-6">
          <Heading level={4} className="card-title">
            List of Previous Requests
          </Heading>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Showing <b>{startIndex + 1}-{Math.min(endIndex, sendToQcRequests.length)}</b> of <b>{sendToQcRequests.length}</b> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead>
                <tr>
                  <th>#</th>
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
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request.cronId)}
                        className="mr-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline"
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
                totalItems={sendToQcRequests.length}
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
