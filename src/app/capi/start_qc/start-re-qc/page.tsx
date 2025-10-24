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
import { Search, Volume2, Eye, RotateCcw } from 'lucide-react';

interface AudioQCRecheckingData {
  srNo: number;
  serverId: string;
  interviewerId: string;
  acCode: string;
  interviewDate: string;
}

export default function StartReQCPage() {
  const [filters, setFilters] = useState({
    interviewerId: '',
    interviewDate: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Sample Audio QC-Rechecking data
  const audioQCRecheckingData: AudioQCRecheckingData[] = [
    {
      srNo: 1,
      serverId: '301767',
      interviewerId: '935',
      acCode: '207',
      interviewDate: '2025-06-17'
    },
    {
      srNo: 2,
      serverId: '301745',
      interviewerId: '721',
      acCode: '207',
      interviewDate: '2025-06-17'
    },
    {
      srNo: 3,
      serverId: '301739',
      interviewerId: '935',
      acCode: '207',
      interviewDate: '2025-06-15'
    },
    {
      srNo: 4,
      serverId: '301705',
      interviewerId: '721',
      acCode: '207',
      interviewDate: '2025-06-15'
    },
    {
      srNo: 5,
      serverId: '301702',
      interviewerId: '935',
      acCode: '207',
      interviewDate: '2025-06-14'
    },
    {
      srNo: 6,
      serverId: '301700',
      interviewerId: '721',
      acCode: '207',
      interviewDate: '2025-06-14'
    },
    {
      srNo: 7,
      serverId: '301698',
      interviewerId: '935',
      acCode: '207',
      interviewDate: '2025-06-13'
    },
    {
      srNo: 8,
      serverId: '301695',
      interviewerId: '721',
      acCode: '207',
      interviewDate: '2025-06-13'
    }
  ];

  // Generate date options for the dropdown
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Interview Date' }];
    const startDate = new Date('2025-04-05');
    const endDate = new Date('2025-06-17');
    
    for (let d = new Date(endDate); d >= startDate; d.setDate(d.getDate() - 1)) {
      const dateStr = d.toISOString().split('T')[0];
      options.push({ value: dateStr, label: dateStr });
    }
    
    return options;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching with filters:', filters);
  };

  const handleRecheckAudio = (data: AudioQCRecheckingData) => {
    // Implement Audio QC rechecking logic
    console.log('Rechecking Audio QC for:', data);
  };

  const totalPages = Math.ceil(audioQCRecheckingData.length / pageSize);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Audio QC-Rechecking
          </Heading>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Interviewer ID
              </Text>
              <Input
                type="text"
                placeholder="Search By Interviewer ID"
                value={filters.interviewerId}
                onChange={(e) => handleFilterChange('interviewerId', e.target.value)}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Interview Date
              </Text>
              <SelectDropdown
                value={filters.interviewDate}
                onChange={(value: string | string[]) => handleFilterChange('interviewDate', Array.isArray(value) ? value[0] : value)}
                options={generateDateOptions()}
                placeholder="Select Interview Date"
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Audio QC-Rechecking Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Audio QC-Rechecking
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{audioQCRecheckingData.length.toLocaleString()}</strong> records.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Server ID</th>
                  <th className="text-center">Interviewer ID</th>
                  <th className="text-center">Ac Code</th>
                  <th className="text-center">Interview Date</th>
                  <th className="text-center">Check Audio</th>
                </tr>
              </thead>
              <tbody>
                {audioQCRecheckingData.length > 0 ? (
                  audioQCRecheckingData.map((row, index) => (
                    <tr key={row.srNo}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <a 
                          href={`/interview-detail?server_id=${row.serverId}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          {row.serverId}
                        </a>
                      </td>
                      <td className="text-center">{row.interviewerId}</td>
                      <td className="text-center">{row.acCode}</td>
                      <td className="text-center">{row.interviewDate}</td>
                      <td className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRecheckAudio(row)}
                            className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Recheck
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        <RotateCcw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <Text className="text-lg font-medium">No results found.</Text>
                        <Text className="text-sm">Try adjusting your search criteria.</Text>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={audioQCRecheckingData.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
