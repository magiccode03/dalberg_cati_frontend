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
import { Search, Download } from 'lucide-react';

// Interfaces
interface SearchFilters {
  checkerId: string;
  checkerName: string;
  qcCompleteDate: string;
}

interface QCSummaryItem {
  id: number;
  checkerName: string;
  checkerId: string;
  totalAlloted: number;
  completed: number;
  accepted: number;
  rejected: number;
}

const QCSummaryPage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    checkerId: '',
    checkerName: '',
    qcCompleteDate: '',
  });

  // Sample data for QC summary
  const [qcSummaryData] = useState<QCSummaryItem[]>([
    {
      id: 1,
      checkerName: 'Shrabanti',
      checkerId: '1501',
      totalAlloted: 10181,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 2,
      checkerName: 'Krishna shree',
      checkerId: '1502',
      totalAlloted: 664,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 3,
      checkerName: 'Eqbal',
      checkerId: '1503',
      totalAlloted: 25971,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 4,
      checkerName: 'Salim',
      checkerId: '1504',
      totalAlloted: 26231,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 5,
      checkerName: 'Samiul',
      checkerId: '1505',
      totalAlloted: 8465,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 6,
      checkerName: 'Sharmina Saijadi',
      checkerId: '1508',
      totalAlloted: 13176,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 7,
      checkerName: 'SK Sanowar Ali',
      checkerId: '1509',
      totalAlloted: 1047,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 8,
      checkerName: 'Miron Rahaman',
      checkerId: '1506',
      totalAlloted: 426,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 9,
      checkerName: 'Miron Rahaman',
      checkerId: '1507',
      totalAlloted: 0,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 10,
      checkerName: 'RAIHAN AHMED',
      checkerId: '1520',
      totalAlloted: 14304,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 11,
      checkerName: 'AMAN KUMAR DUBEY',
      checkerId: '1521',
      totalAlloted: 1174,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 12,
      checkerName: 'Chandusmani Bibi',
      checkerId: '1522',
      totalAlloted: 2130,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
    {
      id: 13,
      checkerName: 'Simran Khatoon',
      checkerId: '1523',
      totalAlloted: 0,
      completed: 0,
      accepted: 0,
      rejected: 0,
    },
  ]);

  // Pagination calculations
  const totalItems = qcSummaryData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = qcSummaryData.slice(startIndex, endIndex);

  // Generate date options (simplified version)
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Date' }];
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const label = dateString;
      options.push({ value: dateString, label });
    }
    
    return options;
  };

  const dateOptions = generateDateOptions();

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

  const handleDownload = () => {
    console.log('Download QC Summary data');
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          QC Summary
        </Heading>
      </div>

      {/* Search Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Checker ID */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checker ID
            </label>
            <Input
              type="text"
              value={filters.checkerId}
              onChange={(e) => handleFilterChange('checkerId', e.target.value)}
              placeholder="Checker ID"
            />
          </div>

          {/* Checker Name */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checker Name
            </label>
            <Input
              type="text"
              value={filters.checkerName}
              onChange={(e) => handleFilterChange('checkerName', e.target.value)}
              placeholder="Name"
            />
          </div>

          {/* QC Complete Date */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QC Complete Date
            </label>
            <SelectDropdown
              value={filters.qcCompleteDate}
              onChange={(value) => handleFilterChange('qcCompleteDate', Array.isArray(value) ? value[0] : value)}
              options={dateOptions}
              placeholder="Select Date"
            />
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
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
              QC Summary
            </Heading>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleDownload}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
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
                  <th className="text-center">Checker Name</th>
                  <th className="text-center">Checker ID</th>
                  <th className="text-center">Total Alloted</th>
                  <th className="text-center">Completed</th>
                  <th className="text-center">Accepted</th>
                  <th className="text-center">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-left">{item.checkerName}</td>
                    <td className="text-center">{item.checkerId}</td>
                    <td className="text-center">{item.totalAlloted.toLocaleString()}</td>
                    <td className="text-center">{item.completed.toLocaleString()}</td>
                    <td className="text-center">{item.accepted.toLocaleString()}</td>
                    <td className="text-center">{item.rejected.toLocaleString()}</td>
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

export default QCSummaryPage;
