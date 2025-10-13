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
import { Search, Volume2, Eye } from 'lucide-react';

interface PendingAudioQCData {
  srNo: number;
  serverId: string;
  interviewerId: string;
  acCode: string;
  interviewDate: string;
}

export default function StartAudioQCPage() {
  const [filters, setFilters] = useState({
    interviewerId: '',
    interviewDate: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);

  // Sample pending Audio QC data
  const pendingAudioQCData: PendingAudioQCData[] = [
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

  const handleCheckAudio = (data: PendingAudioQCData) => {
    // Implement Audio QC check logic
    console.log('Checking Audio QC for:', data);
  };

  const totalPages = Math.ceil(pendingAudioQCData.length / pageSize);

  return (
    <Container maxWidth="full">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
            Pending Audio QC
          </Heading>
        </div>
        <div className="text-right">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Start Audio QC Process
          </Text>
        </div>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2 !hidden text-gray-700 dark:text-gray-300">
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
              <Text className="block text-sm font-medium mb-2 !hidden text-gray-700 dark:text-gray-300">
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

      {/* Pending Audio QC Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Audio QC
          </Heading>
          <div className="text-sm text-gray-500 !hidden dark:text-gray-400">
            Total Records: {pendingAudioQCData.length}
          </div>
        </div>

        <div className="table-responsive">
          <Table className="table table-centered table-striped dt-responsive nowrap w-100">
            <thead className="table-light dark:bg-gray-800">
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">Server ID</th>
                <th className="text-center">Interviewer ID</th>
                <th className="text-center">Ac Code</th>
                <th className="text-left">Interview Date</th>
                <th className="text-center">Check Audio</th>
              </tr>
            </thead>
            <tbody>
              {pendingAudioQCData.length > 0 ? (
                pendingAudioQCData.map((row) => (
                  <tr key={row.srNo} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="text-center">{row.srNo}</td>
                    <td className="text-center">
                      <a 
                        href={`/interview-detail?server_id=${row.serverId}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 font-mono"
                      >
                        {row.serverId}
                      </a>
                    </td>
                    <td className="text-center font-mono text-gray-700 dark:text-gray-300">{row.interviewerId}</td>
                    <td className="font-mono text-gray-700 dark:text-gray-300 text-center">{row.acCode}</td>
                    <td className="text-gray-700 dark:text-gray-300 text-left">{row.interviewDate}</td>
                    <td className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckAudio(row)}
                          className="bg-green-500 hover:bg-green-600 text-white border-0"
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Check Audio
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
                      <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
        {pendingAudioQCData.length > 0 && (
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={pendingAudioQCData.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </Container>
  );
}
