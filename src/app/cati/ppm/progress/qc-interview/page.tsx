'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search } from 'lucide-react';

// Interfaces
interface SearchFilters {
  reportDays: string;
  customDate: string;
  customDateEnd: string;
  serverId: string;
  telecaller: string;
  checker: string;
  qcStatus: string;
}

interface QCInterviewItem {
  id: number;
  serverId: string;
  telecallerId: string;
  checkerId: string;
  qcCompleteDate: string;
  qcStatus: string;
}

const QCInterviewPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    reportDays: 'all',
    customDate: '',
    customDateEnd: '',
    serverId: '',
    telecaller: '',
    checker: '',
    qcStatus: '',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Sample data for QC interview
  const [qcInterviewData] = useState<QCInterviewItem[]>([
    {
      id: 1,
      serverId: '3059253',
      telecallerId: '3051',
      checkerId: '1508',
      qcCompleteDate: '2024-06-01 17:29:19',
      qcStatus: 'Success',
    },
    {
      id: 2,
      serverId: '3059030',
      telecallerId: '3073',
      checkerId: '1508',
      qcCompleteDate: '2024-06-01 17:28:40',
      qcStatus: 'Rejected',
    },
    {
      id: 3,
      serverId: '3059518',
      telecallerId: '1037',
      checkerId: '1508',
      qcCompleteDate: '2024-06-01 17:26:52',
      qcStatus: 'Success',
    },
    {
      id: 4,
      serverId: '3043020',
      telecallerId: '3073',
      checkerId: '1508',
      qcCompleteDate: '2024-06-01 17:24:52',
      qcStatus: 'Success',
    },
    {
      id: 5,
      serverId: '3061574',
      telecallerId: '3051',
      checkerId: '1508',
      qcCompleteDate: '2024-06-01 17:22:05',
      qcStatus: 'Success',
    },
  ]);

  // Options for dropdowns
  const reportDaysOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'dby', label: 'Day Before Yesterday' },
    { value: 'l3', label: 'Last 3 Days' },
    { value: 'l7', label: 'Last 7 Days' },
    { value: 'l15', label: 'Last 15 Days' },
    { value: 'currentmonth', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date' },
  ];

  const dateOptions = [
    { value: '', label: 'Select Date' },
    { value: '2024-05-31', label: '2024-05-31' },
    { value: '2024-05-30', label: '2024-05-30' },
    { value: '2024-05-29', label: '2024-05-29' },
    { value: '2024-05-28', label: '2024-05-28' },
    { value: '2024-05-27', label: '2024-05-27' },
    { value: '2024-05-26', label: '2024-05-26' },
    { value: '2024-05-25', label: '2024-05-25' },
    { value: '2024-05-24', label: '2024-05-24' },
    { value: '2024-05-23', label: '2024-05-23' },
    { value: '2024-05-22', label: '2024-05-22' },
    { value: '2024-05-21', label: '2024-05-21' },
  ];

  const telecallerOptions = [
    { value: '', label: 'Select Telecaller' },
    { value: '805', label: 'Abhijit Halder (805)' },
    { value: '801', label: 'Debojit Halder (801)' },
    { value: '376', label: 'Manish Mallik (376)' },
    { value: '804', label: 'Riya Tulsyan (804)' },
    { value: '298', label: 'Saira Khatoon (298)' },
  ];

  const checkerOptions = [
    { value: '', label: 'Select Checker' },
    { value: '1521', label: 'AMAN KUMAR DUBEY (1521)' },
    { value: '1522', label: 'Chandusmani Bibi (1522)' },
    { value: '1503', label: 'Eqbal (1503)' },
    { value: '1502', label: 'Krishna shree (1502)' },
    { value: '1506', label: 'Miron Rahaman (1506)' },
    { value: '1520', label: 'RAIHAN AHMED (1520)' },
    { value: '102298300', label: 'RAKHI DOLUI (102298300)' },
    { value: '1504', label: 'Salim (1504)' },
    { value: '1505', label: 'Samiul (1505)' },
    { value: '1508', label: 'Sharmina Saijadi (1508)' },
    { value: '1501', label: 'Shrabanti (1501)' },
    { value: '1509', label: 'SK Sanowar Ali (1509)' },
  ];

  const qcStatusOptions = [
    { value: '', label: 'Select QC Status' },
    { value: '10', label: 'Success' },
    { value: '20', label: 'Rejected' },
  ];

  // Handlers
  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination calculations
  const totalItems = qcInterviewData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = qcInterviewData.slice(startIndex, endIndex);

  // Show/hide custom date fields based on reportDays selection
  const showCustomDates = filters.reportDays === 'custom';

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          QC Interview
        </Heading>
      </div>

      {/* Search Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Report Days */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Days
            </label>
            <SelectDropdown
              value={filters.reportDays}
              onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
              options={reportDaysOptions}
              placeholder="Select Report Days"
            />
          </div>

          {/* Custom Date Start - Show only when custom is selected */}
          {showCustomDates && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <SelectDropdown
                value={filters.customDate}
                onChange={(value) => handleFilterChange('customDate', Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

          {/* Custom Date End - Show only when custom is selected */}
          {showCustomDates && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <SelectDropdown
                value={filters.customDateEnd}
                onChange={(value) => handleFilterChange('customDateEnd', Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                placeholder="Select Date"
              />
            </div>
          )}

          {/* Server ID */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server ID
            </label>
            <Input
              type="text"
              value={filters.serverId}
              onChange={(e) => handleFilterChange('serverId', e.target.value)}
              placeholder="Search by Server ID"
            />
          </div>

          {/* Telecaller */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telecaller
            </label>
            <SelectDropdown
              value={filters.telecaller}
              onChange={(value) => handleFilterChange('telecaller', Array.isArray(value) ? value[0] : value)}
              options={telecallerOptions}
              placeholder="Select Telecaller"
            />
          </div>

          {/* Checker */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checker
            </label>
            <SelectDropdown
              value={filters.checker}
              onChange={(value) => handleFilterChange('checker', Array.isArray(value) ? value[0] : value)}
              options={checkerOptions}
              placeholder="Select Checker"
            />
          </div>

          {/* QC Status */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QC Status
            </label>
            <SelectDropdown
              value={filters.qcStatus}
              onChange={(value) => handleFilterChange('qcStatus', Array.isArray(value) ? value[0] : value)}
              options={qcStatusOptions}
              placeholder="Select QC Status"
            />
          </div>

          {/* View Button */}
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC Interview
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
                  <th className="text-center">Server ID</th>
                  <th className="text-center">Telecaller ID</th>
                  <th className="text-center">Checker ID</th>
                  <th className="text-center">QC Complete Date</th>
                  <th className="text-center">QC Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center">{item.serverId}</td>
                      <td className="text-center">{item.telecallerId}</td>
                      <td className="text-center">{item.checkerId}</td>
                      <td className="text-center">{item.qcCompleteDate}</td>
                      <td className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.qcStatus === 'Success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.qcStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No results found.
                    </td>
                  </tr>
                )}
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

export default QCInterviewPage;
