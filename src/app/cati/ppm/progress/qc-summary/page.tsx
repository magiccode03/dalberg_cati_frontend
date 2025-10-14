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
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">
              QC Summary
            </Heading>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleDownload}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Total <span className="font-semibold">{qcSummaryData.length}</span> items.
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Checker Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Checker ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Total Alloted</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Completed</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Accepted</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {qcSummaryData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.checkerName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.checkerId}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalAlloted.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.completed.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.accepted.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.rejected.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default QCSummaryPage;
