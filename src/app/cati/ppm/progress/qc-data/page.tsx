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
import { Search, Volume2 } from 'lucide-react';

// Interfaces
interface SearchFilters {
  serverId: string;
  acCode: string;
  callDate: string;
  telecaller: string;
  qcStatus: string;
}

interface QCDataItem {
  id: number;
  serverId: string;
  acName: string;
  acCode: number;
  telecaller: string;
  telecallerId: string;
  callDate: string;
  qcCompleteDate: string;
  qcTelecaller: string;
  introduction: string;
  q12VidhanSabha: string;
  q11LokSabha: string;
  q16AssemblyElections: string;
  q14LokSabhaElections: string;
  q28ChiefMinister: string;
  remark: string;
  qcStatus: string;
  audioFile: string;
}

const QCDataPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    serverId: '',
    acCode: '',
    callDate: '',
    telecaller: '',
    qcStatus: '',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Sample data for QC data
  const [qcData] = useState<QCDataItem[]>([
    {
      id: 1,
      serverId: '3059253',
      acName: 'Shyampukur',
      acCode: 166,
      telecaller: 'Gopi Hela',
      telecallerId: '3051',
      callDate: '2024-05-31 17:03:13',
      qcCompleteDate: '2024-06-01 17:29:19',
      qcTelecaller: 'Sharmina Saijadi',
      introduction: 'Yes',
      q12VidhanSabha: 'Yes',
      q11LokSabha: 'Yes',
      q16AssemblyElections: 'Yes',
      q14LokSabhaElections: 'Yes',
      q28ChiefMinister: 'Yes',
      remark: '',
      qcStatus: 'Success',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=988605',
    },
    {
      id: 2,
      serverId: '3059518',
      acName: 'Khardaha',
      acCode: 109,
      telecaller: 'SAHERA BANU',
      telecallerId: '1037',
      callDate: '2024-05-31 20:00:38',
      qcCompleteDate: '2024-06-01 17:26:52',
      qcTelecaller: 'Sharmina Saijadi',
      introduction: 'Yes',
      q12VidhanSabha: 'Yes',
      q11LokSabha: 'Yes',
      q16AssemblyElections: 'Skipped',
      q14LokSabhaElections: 'Skipped',
      q28ChiefMinister: 'Yes',
      remark: '',
      qcStatus: 'Success',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=989385',
    },
    {
      id: 3,
      serverId: '3043020',
      acName: 'Basanti',
      acCode: 128,
      telecaller: 'Roshan Mishra',
      telecallerId: '3073',
      callDate: '2024-05-30 16:11:00',
      qcCompleteDate: '2024-06-01 17:24:52',
      qcTelecaller: 'Sharmina Saijadi',
      introduction: 'Yes',
      q12VidhanSabha: 'Yes',
      q11LokSabha: 'Skipped',
      q16AssemblyElections: 'Skipped',
      q14LokSabhaElections: 'Yes',
      q28ChiefMinister: 'Yes',
      remark: '',
      qcStatus: 'Success',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=984546',
    },
  ]);

  // Options for dropdowns
  const acCodeOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Mekliganj' },
    { value: '2', label: 'Mathabhanga' },
    { value: '3', label: 'Cooch Behar Uttar' },
    { value: '4', label: 'Cooch Behar Dakshin' },
    { value: '5', label: 'Sitalkuchi' },
    { value: '6', label: 'Sitai' },
    { value: '7', label: 'Dinhata' },
  ];

  const callDateOptions = [
    { value: '', label: 'Select Date' },
    { value: '2024-05-31', label: '2024-05-31' },
    { value: '2024-05-30', label: '2024-05-30' },
    { value: '2024-05-29', label: '2024-05-29' },
    { value: '2024-05-28', label: '2024-05-28' },
    { value: '2024-05-27', label: '2024-05-27' },
    { value: '2024-05-26', label: '2024-05-26' },
    { value: '2024-05-25', label: '2024-05-25' },
    { value: '2024-05-24', label: '2024-05-24' },
  ];

  const telecallerOptions = [
    { value: '', label: 'Select Telecaller' },
    { value: '805', label: 'Abhijit Halder (805)' },
    { value: '801', label: 'Debojit Halder (801)' },
    { value: '376', label: 'Manish Mallik (376)' },
    { value: '804', label: 'Riya Tulsyan (804)' },
    { value: '298', label: 'Saira Khatoon (298)' },
    { value: '291', label: 'Sakiron (291)' },
    { value: '250', label: 'SONIA KHATUN (250)' },
    { value: '4002', label: 'susama pachhar (4002)' },
    { value: '7119', label: 'Susmita Das (7119)' },
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

  const handleAudioPlay = (audioUrl: string) => {
    console.log('Play audio:', audioUrl);
  };

  // Pagination calculations
  const totalItems = qcData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = qcData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          QC Data
        </Heading>
      </div>

      {/* Search Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
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

          {/* AC Code */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AC Code
            </label>
            <SelectDropdown
              value={filters.acCode}
              onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
              options={acCodeOptions}
              placeholder="Select AC"
            />
          </div>

          {/* Call Date */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Date
            </label>
            <SelectDropdown
              value={filters.callDate}
              onChange={(value) => handleFilterChange('callDate', Array.isArray(value) ? value[0] : value)}
              options={callDateOptions}
              placeholder="Select Date"
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
              QC Data
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
                  <th className="text-center">AC Name</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">Telecaller</th>
                  <th className="text-center">Telecaller ID</th>
                  <th className="text-center">Call Date</th>
                  <th className="text-center">QC Complete Date</th>
                  <th className="text-center">QC Telecaller</th>
                  <th className="text-center">Introduction</th>
                  <th className="text-center">Q.12 Vidhan Sabha</th>
                  <th className="text-center">Q.11 Lok Sabha</th>
                  <th className="text-center">Q.16 Assembly</th>
                  <th className="text-center">Q.14 Lok Sabha</th>
                  <th className="text-center">Q.28 CM</th>
                  <th className="text-center">Remark</th>
                  <th className="text-center">QC Status</th>
                  <th className="text-center">Audio file</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center">{item.serverId}</td>
                      <td className="text-left">{item.acName}</td>
                      <td className="text-center">{item.acCode}</td>
                      <td className="text-left">{item.telecaller}</td>
                      <td className="text-center">{item.telecallerId}</td>
                      <td className="text-center">{item.callDate}</td>
                      <td className="text-center">{item.qcCompleteDate}</td>
                      <td className="text-left">{item.qcTelecaller}</td>
                      <td className="text-center">{item.introduction}</td>
                      <td className="text-center">{item.q12VidhanSabha}</td>
                      <td className="text-center">{item.q11LokSabha}</td>
                      <td className="text-center">{item.q16AssemblyElections}</td>
                      <td className="text-center">{item.q14LokSabhaElections}</td>
                      <td className="text-center">{item.q28ChiefMinister}</td>
                      <td className="text-center">{item.remark}</td>
                      <td className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.qcStatus === 'Success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.qcStatus}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleAudioPlay(item.audioFile)}
                          className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                          title="Play Audio"
                        >
                          <Volume2 className="w-4 h-4 text-white" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={18} className="text-center py-8 text-gray-500">
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

export default QCDataPage;
