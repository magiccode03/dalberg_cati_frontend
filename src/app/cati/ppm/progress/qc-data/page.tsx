'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
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
  const [itemsPerPage] = useState(30);

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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = qcData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
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
        <div className="mb-4">
          <Heading level={2} className="text-xl font-semibold text-gray-900">
            QC Data
          </Heading>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Server ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Code</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Call Date</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC Complete Date</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC Telecaller</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Introduction</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Q.12 Vidhan Sabha</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Q.11 Lok Sabha</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Q.16 Assembly</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Q.14 Lok Sabha</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Q.28 CM</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Remark</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC Status</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Audio file</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">{indexOfFirstItem + index + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.serverId}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.acName}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.acCode}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.telecaller}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.telecallerId}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.callDate}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.qcCompleteDate}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.qcTelecaller}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.introduction}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.q12VidhanSabha}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.q11LokSabha}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.q16AssemblyElections}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.q14LokSabhaElections}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.q28ChiefMinister}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.remark}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.qcStatus === 'Success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.qcStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAudioPlay(item.audioFile)}
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Audio
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={18} className="px-4 py-8 text-center text-gray-500">
                    No results found.
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
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>

      </Card>
    </FluidContainer>
  );
};

export default QCDataPage;
