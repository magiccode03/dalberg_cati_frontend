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
import { Search } from 'lucide-react';

interface EnumeratorWiseData {
  id: number;
  enumeratorId: number;
  interviewDate: string;
  deviceId: string;
  interviewerIds: string;
  totalInterview: number;
  totalInterviewWithoutPhone: number;
  validInterview: number;
  invalidInterview: number;
  rejectInterview: number;
  rejectInterviewSystem: number;
  underQcInterview: number;
  qcUser: string;
  status: string;
  teleQc: string;
  audioQc: string;
}

export default function EnumeratorWisePage() {
  const [filters, setFilters] = useState({
    userId: '',
    interviewDate: '',
    deviceId: '',
    progressPhase: '',
    teleQcId: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data based on the provided HTML
  const enumeratorWiseData: EnumeratorWiseData[] = [
    { id: 1, enumeratorId: 1224, interviewDate: '2025-04-05', deviceId: 'cd05f858ccd8dc8c', interviewerIds: ',102', totalInterview: 33, totalInterviewWithoutPhone: 0, validInterview: 21, invalidInterview: 2, rejectInterview: 10, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 2, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: '01aa4d572f2065e0', interviewerIds: '141', totalInterview: 8, totalInterviewWithoutPhone: 0, validInterview: 8, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 3, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: '7696b69127cccc7e', interviewerIds: '145', totalInterview: 4, totalInterviewWithoutPhone: 0, validInterview: 4, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 4, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: 'ff6af232e1fd2ac7', interviewerIds: '144', totalInterview: 3, totalInterviewWithoutPhone: 0, validInterview: 3, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 5, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: 'd9ea4b01feb09fc0', interviewerIds: ',142', totalInterview: 9, totalInterviewWithoutPhone: 0, validInterview: 8, invalidInterview: 1, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 6, enumeratorId: 1156, interviewDate: '2025-04-05', deviceId: 'ff8b1a3eed5f9e5a', interviewerIds: '122', totalInterview: 17, totalInterviewWithoutPhone: 0, validInterview: 17, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 7, enumeratorId: 1150, interviewDate: '2025-04-05', deviceId: 'f7f584257d961018', interviewerIds: '', totalInterview: 1, totalInterviewWithoutPhone: 0, validInterview: 0, invalidInterview: 1, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'GPS Check Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 8, enumeratorId: 1317, interviewDate: '2025-04-05', deviceId: '28ec9c24bf8f7512', interviewerIds: ',932,935', totalInterview: 24, totalInterviewWithoutPhone: 0, validInterview: 21, invalidInterview: 1, rejectInterview: 2, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 9, enumeratorId: 1224, interviewDate: '2025-04-05', deviceId: '11f8e71ae84a41f3', interviewerIds: '101', totalInterview: 31, totalInterviewWithoutPhone: 0, validInterview: 30, invalidInterview: 0, rejectInterview: 1, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 10, enumeratorId: 1156, interviewDate: '2025-04-05', deviceId: '982cf23bd57fc839', interviewerIds: '', totalInterview: 4, totalInterviewWithoutPhone: 0, validInterview: 0, invalidInterview: 4, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'GPS Check Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 11, enumeratorId: 1156, interviewDate: '2025-04-05', deviceId: '8fb929c47c007e3e', interviewerIds: '990,121', totalInterview: 32, totalInterviewWithoutPhone: 0, validInterview: 32, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 12, enumeratorId: 1224, interviewDate: '2025-04-06', deviceId: '11f8e71ae84a41f3', interviewerIds: '101,', totalInterview: 55, totalInterviewWithoutPhone: 0, validInterview: 44, invalidInterview: 1, rejectInterview: 10, rejectInterviewSystem: 8, underQcInterview: 0, qcUser: '', status: 'GPS Check Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 13, enumeratorId: 1224, interviewDate: '2025-04-06', deviceId: 'cd05f858ccd8dc8c', interviewerIds: '102,', totalInterview: 51, totalInterviewWithoutPhone: 0, validInterview: 34, invalidInterview: 1, rejectInterview: 16, rejectInterviewSystem: 3, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 14, enumeratorId: 1172, interviewDate: '2025-04-06', deviceId: '687dc868b8b0c64f', interviewerIds: '', totalInterview: 2, totalInterviewWithoutPhone: 0, validInterview: 0, invalidInterview: 2, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'GPS Check Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 15, enumeratorId: 1318, interviewDate: '2025-04-06', deviceId: 'ce277ea2e22cd54e', interviewerIds: '176', totalInterview: 1, totalInterviewWithoutPhone: 0, validInterview: 1, invalidInterview: 0, rejectInterview: 0, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 16, enumeratorId: 1150, interviewDate: '2025-04-06', deviceId: 'd9ea4b01feb09fc0', interviewerIds: ',142', totalInterview: 27, totalInterviewWithoutPhone: 0, validInterview: 17, invalidInterview: 4, rejectInterview: 6, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 17, enumeratorId: 1318, interviewDate: '2025-04-06', deviceId: '26ff8fd34444f846', interviewerIds: '932', totalInterview: 12, totalInterviewWithoutPhone: 0, validInterview: 9, invalidInterview: 0, rejectInterview: 3, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 18, enumeratorId: 1318, interviewDate: '2025-04-06', deviceId: 'e3c06cc5c399eb58', interviewerIds: '932,933', totalInterview: 12, totalInterviewWithoutPhone: 0, validInterview: 11, invalidInterview: 0, rejectInterview: 1, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 19, enumeratorId: 1150, interviewDate: '2025-04-06', deviceId: '01aa4d572f2065e0', interviewerIds: '141,', totalInterview: 23, totalInterviewWithoutPhone: 0, validInterview: 16, invalidInterview: 2, rejectInterview: 5, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
    { id: 20, enumeratorId: 1168, interviewDate: '2025-04-06', deviceId: 'db741df245f48365', interviewerIds: '244', totalInterview: 3, totalInterviewWithoutPhone: 0, validInterview: 0, invalidInterview: 0, rejectInterview: 3, rejectInterviewSystem: 0, underQcInterview: 0, qcUser: '', status: 'Audio/Tele QC Pending', teleQc: 'Tele Not Required', audioQc: 'Audio Not Required' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Interview Date' }];
    const today = new Date();
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    return options;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GPS Check Pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">GPS Check Pending</span>;
      case 'Audio/Tele QC Pending':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Audio/Tele QC Pending</span>;
      case 'QC Completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">QC Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const totalPages = Math.ceil(enumeratorWiseData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = enumeratorWiseData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Field Enumerator Wise Report
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By Enumerator ID"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', value as string)}
                  options={generateDateOptions()}
                  placeholder="Select Interview Date"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By Device ID"
                  value={filters.deviceId}
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.progressPhase}
                  onChange={(value) => handleFilterChange('progressPhase', value as string)}
                  options={[
                    { value: '', label: 'Select Status' },
                    { value: '0', label: 'GPS Check Pending' },
                    { value: '1', label: 'Audio/Tele QC Pending' },
                    { value: '2', label: 'QC Completed' },
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By QC ID"
                  value={filters.teleQcId}
                  onChange={(e) => handleFilterChange('teleQcId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Enumerator Wise Report Table */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Field Enumerator Wise Report
                </Heading>
                <span className="text-end"></span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Enumerator ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interview Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Device Id</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interviewer IDs</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview Without Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Valid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Invalid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview System</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Under QC Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Tele QC</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio QC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data, index) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.enumeratorId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.interviewDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.deviceId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.interviewerIds}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterviewWithoutPhone.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.validInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.invalidInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterviewSystem.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.underQcInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.qcUser || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{getStatusBadge(data.status)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.teleQc}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.audioQc}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, enumeratorWiseData.length)}</span> of <span className="font-semibold">{enumeratorWiseData.length}</span> items
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={enumeratorWiseData.length}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
