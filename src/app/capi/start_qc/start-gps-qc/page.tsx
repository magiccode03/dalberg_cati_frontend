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
import { Search, MapPin, Eye } from 'lucide-react';

interface PendingGPSQCData {
  srNo: number;
  acName: string;
  enumeratorId: string;
  interviewerId: string;
  interviewDate: string;
  deviceId: string;
  totalInterview: number;
}

export default function StartGPSQCPage() {
  const [filters, setFilters] = useState({
    enumeratorId: '',
    interviewDate: '',
    deviceId: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Sample pending GPS QC data
  const pendingGPSQCData: PendingGPSQCData[] = [
    {
      srNo: 1,
      acName: 'Chenari (SC)(207)',
      enumeratorId: 'EN001',
      interviewerId: '935',
      interviewDate: '2025-01-15',
      deviceId: 'DEV001',
      totalInterview: 25
    },
    {
      srNo: 2,
      acName: 'Chenari (SC)(207)',
      enumeratorId: 'EN002',
      interviewerId: '721',
      interviewDate: '2025-01-15',
      deviceId: 'DEV002',
      totalInterview: 18
    },
    {
      srNo: 3,
      acName: 'Chenari (SC)(207)',
      enumeratorId: 'EN003',
      interviewerId: '935',
      interviewDate: '2025-01-14',
      deviceId: 'DEV003',
      totalInterview: 32
    },
    {
      srNo: 4,
      acName: 'Chenari (SC)(207)',
      enumeratorId: 'EN004',
      interviewerId: '721',
      interviewDate: '2025-01-14',
      deviceId: 'DEV004',
      totalInterview: 22
    },
    {
      srNo: 5,
      acName: 'Chenari (SC)(207)',
      enumeratorId: 'EN005',
      interviewerId: '935',
      interviewDate: '2025-01-13',
      deviceId: 'DEV005',
      totalInterview: 28
    }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching with filters:', filters);
  };

  const handleStartQC = (data: PendingGPSQCData) => {
    // Implement GPS QC start logic
    console.log('Starting GPS QC for:', data);
  };

  const totalPages = Math.ceil(pendingGPSQCData.length / pageSize);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending GPS QC
          </Heading>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Enumerator ID
              </Text>
              <SelectDropdown
                value={filters.enumeratorId}
                onChange={(value: string | string[]) => handleFilterChange('enumeratorId', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Enumerator ID' },
                  { value: 'EN001', label: 'EN001' },
                  { value: 'EN002', label: 'EN002' },
                  { value: 'EN003', label: 'EN003' },
                  { value: 'EN004', label: 'EN004' },
                  { value: 'EN005', label: 'EN005' }
                ]}
                placeholder="Select Enumerator ID"
                multiple={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Interview Date
              </Text>
              <SelectDropdown
                value={filters.interviewDate}
                onChange={(value: string | string[]) => handleFilterChange('interviewDate', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Interview Date' },
                  { value: '2025-01-15', label: '2025-01-15' },
                  { value: '2025-01-14', label: '2025-01-14' },
                  { value: '2025-01-13', label: '2025-01-13' },
                  { value: '2025-01-12', label: '2025-01-12' },
                  { value: '2025-01-11', label: '2025-01-11' }
                ]}
                placeholder="Select Interview Date"
                multiple={true}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Device ID
              </Text>
              <Input
                type="text"
                placeholder="Search By Device ID"
                value={filters.deviceId}
                onChange={(e) => handleFilterChange('deviceId', e.target.value)}
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

      {/* Pending GPS QC Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending GPS QC
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{pendingGPSQCData.length.toLocaleString()}</strong> records.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Ac Name</th>
                  <th className="text-center">Enumerator ID</th>
                  <th className="text-center">Interviewer ID</th>
                  <th className="text-center">Interview Date</th>
                  <th className="text-center">Device ID</th>
                  <th className="text-center">Total Interview</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingGPSQCData.length > 0 ? (
                  pendingGPSQCData.map((row, index) => (
                    <tr key={row.srNo}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-left">{row.acName}</td>
                      <td className="text-center">{row.enumeratorId}</td>
                      <td className="text-center">{row.interviewerId}</td>
                      <td className="text-center">{row.interviewDate}</td>
                      <td className="text-center">{row.deviceId}</td>
                      <td className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {row.totalInterview}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartQC(row)}
                            className="bg-green-500 hover:bg-green-600 text-white border-0"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Start QC
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
                    <td colSpan={8} className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
              totalItems={pendingGPSQCData.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
