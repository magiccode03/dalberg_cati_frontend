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
import { Eye } from 'lucide-react';

interface CronRequest {
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

export default function CronRequestPage() {
  const [actionRoute, setActionRoute] = useState('');
  const [params, setParams] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Action/Route options
  const actionOptions = [
    { value: '', label: 'Select Action\\Route' },
    { value: '63', label: 'bhpoll202504 : Master Update' },
    { value: '64', label: 'Bihar Round 2 Daily cron' },
    { value: '65', label: 'bhpoll202504 : Change Status' },
    { value: '66', label: 'Bihar Round 2 PS Generate' },
    { value: '67', label: 'bhpoll202504 : Sent to QC' },
    { value: '68', label: 'Bihar Baseline : Upload for Client Review Check' },
    { value: '70', label: 'Re qc distribute bihar' },
    { value: '72', label: 'Bihar Baseline - Client Data File' },
    { value: '75', label: '/bh/poll202504/process/sendtoreqc' }
  ];

  // Sample data for dynamic recoding requests (20 items as shown in HTML)
  const cronRequests: CronRequest[] = [
    { id: 1, cronId: 1045, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-09 10:49:00', executedAt: '3 months ago', execution: 5496, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 2, cronId: 1043, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-07 18:08:00', executedAt: '3 months ago', execution: 5510, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 3, cronId: 1040, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-05 11:54:00', executedAt: '3 months ago', execution: 5506, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 4, cronId: 1031, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-04 15:11:00', executedAt: '3 months ago', execution: 5499, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 5, cronId: 1023, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-03 16:46:00', executedAt: '3 months ago', execution: 5464, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 6, cronId: 1017, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-02 10:25:00', executedAt: '3 months ago', execution: 5476, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 7, cronId: 1015, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-01 10:29:00', executedAt: '3 months ago', execution: 5506, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 8, cronId: 1013, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-06-01 10:19:00', executedAt: '3 months ago', execution: 5506, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 9, cronId: 1007, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-30 09:58:00', executedAt: '3 months ago', execution: 5540, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 10, cronId: 1003, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-29 10:32:00', executedAt: '3 months ago', execution: 5545, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 11, cronId: 1001, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-29 10:19:00', executedAt: '3 months ago', execution: 5545, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 12, cronId: 999, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-28 17:03:00', executedAt: '3 months ago', execution: 5540, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 13, cronId: 997, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-28 13:13:00', executedAt: '3 months ago', execution: 5533, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 14, cronId: 993, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-27 11:59:00', executedAt: '3 months ago', execution: 5519, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 15, cronId: 987, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-26 13:04:00', executedAt: '4 months ago', execution: 5556, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 16, cronId: 984, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-26 11:50:00', executedAt: '4 months ago', execution: 5547, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 17, cronId: 982, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-25 12:23:00', executedAt: '4 months ago', execution: 5561, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 18, cronId: 977, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-24 14:10:00', executedAt: '4 months ago', execution: 5577, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 19, cronId: 973, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-23 14:49:00', executedAt: '4 months ago', execution: 5605, errors: 'No', status: 'Completed', params: '', cronInfo: '' },
    { id: 20, cronId: 971, actionRoute: '/bh/poll202504/parsedata/generatepolingstation', plannedAt: '2025-05-23 13:54:00', executedAt: '4 months ago', execution: 5603, errors: 'No', status: 'Completed', params: '', cronInfo: '' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Action Route:', actionRoute);
    console.log('Params:', params);
    console.log('Planned Date:', plannedDate);
    console.log('Additional Info:', additionalInfo);
  };

  const handleViewRequest = (cronId: number) => {
    // Handle view request logic here
    console.log('View request for cron ID:', cronId);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') {
      return <span className="badge bg-success text-white">{status}</span>;
    } else if (status === 'Failed') {
      return <span className="badge bg-danger text-white">{status}</span>;
    }
    return <span className="badge bg-secondary text-white">{status}</span>;
  };

  const totalItems = 95; // Total items as shown in HTML (1-20 of 95)
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold mb-0">
            Cron Requests
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Cron Request Form Card */}
      <Card className="mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white card-title mg-b-0">
                Cron Requests
              </Heading>
            </div>
            <span className="text-end">
              {/* Sample file download buttons can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <Text className="block text-sm font-medium text-gray-700 mb-2">
                    Action/Route
                  </Text>
                  <SelectDropdown
                    value={actionRoute}
                    onChange={(value) => setActionRoute(value as string)}
                    options={actionOptions}
                    placeholder="Select Action\\Route"
                    className="w-full"
                  />
                </div>
                
                <div className="md:col-span-4">
                  <Text className="block text-sm font-medium text-gray-700 mb-2">
                    Params (Delimeter for multiple params is !#)
                  </Text>
                  <textarea
                    value={params}
                    onChange={(e) => setParams(e.target.value)}
                    rows={3}
                    placeholder="Enter Params (Note : Delimeter for multiple params is !#)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Text className="block text-sm font-medium text-gray-700 mb-2">
                    Cron Execution Planning Time
                  </Text>
                  <Input
                    type="datetime-local"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Text className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Info
                  </Text>
                  <Input
                    type="text"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Additional Info for this Cron"
                    className="w-full"
                  />
                </div>

                <div className="flex items-end">
                  <Button type="submit" variant="primary" className="w-full">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Dynamic Recoding Requests Card */}
      <Card className="">
        <div className="card-header mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              List of Dynamic Recoding Requests
            </Heading>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{totalItems}</strong> items.
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
                {cronRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
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
                        className="mr-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
                        title="View Request"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="text-center">
                      {/* Empty cell as shown in HTML */}
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
                totalItems={totalItems}
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