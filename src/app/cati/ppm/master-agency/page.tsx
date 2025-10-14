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
import { Search, Plus, Download, Edit, Trash2 } from 'lucide-react';

// Interfaces
interface AgencyData {
  id: number;
  agencyName: string;
  supervisorLoginId: string;
  trainingManagerMobile: string;
  totalTelecaller: number;
  validInterview: number;
  rejectInterview: number;
  telecallerCanFillForm: string;
  status: string;
}

const MasterAgencyPage = () => {
  // State for search filters
  const [filters, setFilters] = useState({
    agencyName: '',
    trainingManagerMobile: '',
    status: '',
    dateRange: '',
  });

  // Sample data for agencies
  const [agencyData] = useState<AgencyData[]>([
    {
      id: 1,
      agencyName: 'Pallabi',
      supervisorLoginId: 'Pallabi',
      trainingManagerMobile: '8742931524',
      totalTelecaller: 24,
      validInterview: 270,
      rejectInterview: 148,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 2,
      agencyName: 'Pabitra Das',
      supervisorLoginId: 'pabitra_das',
      trainingManagerMobile: '9874335280',
      totalTelecaller: 195,
      validInterview: 66231,
      rejectInterview: 10840,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 3,
      agencyName: 'R.K. Enterprise',
      supervisorLoginId: 'RK_Enterprise',
      trainingManagerMobile: '9330196432',
      totalTelecaller: 71,
      validInterview: 22954,
      rejectInterview: 1820,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 4,
      agencyName: 'ECMI',
      supervisorLoginId: 'Dibyendu_maiti',
      trainingManagerMobile: '9831127172',
      totalTelecaller: 543,
      validInterview: 57771,
      rejectInterview: 17137,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 5,
      agencyName: 'labani',
      supervisorLoginId: 'labanii',
      trainingManagerMobile: '9062002196',
      totalTelecaller: 250,
      validInterview: 23619,
      rejectInterview: 4722,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 6,
      agencyName: 'Premananjan Ghosh',
      supervisorLoginId: 'Ghosh_prem',
      trainingManagerMobile: '9748329982',
      totalTelecaller: 262,
      validInterview: 43667,
      rejectInterview: 23159,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 9,
      agencyName: 'Shubham Deshmukh',
      supervisorLoginId: 'shubham',
      trainingManagerMobile: '9370408655',
      totalTelecaller: 143,
      validInterview: 17492,
      rejectInterview: 6733,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 10,
      agencyName: 'Gopi Hela',
      supervisorLoginId: 'Gopi',
      trainingManagerMobile: '9874220409',
      totalTelecaller: 50,
      validInterview: 29731,
      rejectInterview: 3464,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 12,
      agencyName: 'Manish',
      supervisorLoginId: 'manishsain',
      trainingManagerMobile: '8384983781',
      totalTelecaller: 85,
      validInterview: 24380,
      rejectInterview: 6348,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 13,
      agencyName: 'Inhouse',
      supervisorLoginId: 'inhouse',
      trainingManagerMobile: '9330361587',
      totalTelecaller: 57,
      validInterview: 7584,
      rejectInterview: 3298,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 14,
      agencyName: 'Aloke Majumder',
      supervisorLoginId: 'aloke',
      trainingManagerMobile: '9062002196',
      totalTelecaller: 209,
      validInterview: 5843,
      rejectInterview: 1426,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
    {
      id: 15,
      agencyName: 'Mangu Paul',
      supervisorLoginId: 'mangu',
      trainingManagerMobile: '9123770647',
      totalTelecaller: 18,
      validInterview: 2713,
      rejectInterview: 628,
      telecallerCanFillForm: 'Yes',
      status: 'Active',
    },
  ]);

  // Status options
  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ];

  // Handlers
  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const handleNewAgency = () => {
    console.log('Create new agency');
  };

  const handleDownload = () => {
    console.log('Download agency data');
  };

  const handleUpdateAgency = (agencyId: number) => {
    console.log('Update agency:', agencyId);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Master Agency
        </Heading>
      </div>

      {/* Search Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Agency Name */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agency Name
            </label>
            <Input
              type="text"
              value={filters.agencyName}
              onChange={(e) => handleFilterChange('agencyName', e.target.value)}
              placeholder="Search by Agency Name"
            />
          </div>

          {/* Training Manager Mobile */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Manager Mobile
            </label>
            <Input
              type="text"
              value={filters.trainingManagerMobile}
              onChange={(e) => handleFilterChange('trainingManagerMobile', e.target.value)}
              placeholder="Search by Training Manager Mobile Number"
            />
          </div>

          {/* Status */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <SelectDropdown
              value={filters.status}
              onChange={(value) => handleFilterChange('status', Array.isArray(value) ? value[0] : value)}
              options={statusOptions}
              placeholder="Select Status"
            />
          </div>

          {/* Date Range */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <Input
              type="text"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              placeholder="Select Date Range"
              readOnly
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

      {/* Agency List Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-xl font-semibold text-gray-900">
              Agency List
            </Heading>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="primary" 
              onClick={handleNewAgency}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Agency
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleDownload}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">1-{agencyData.length}</span> of <span className="font-semibold">{agencyData.length}</span> items.
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Agency ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Agency Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Supervisor Login ID</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Training Manager Mobile</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Total Telecaller</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Valid Interview</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Reject Interview</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller Can Fill Form</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {agencyData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{item.id}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.agencyName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.supervisorLoginId}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.trainingManagerMobile}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalTelecaller.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.validInterview.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.rejectInterview.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.telecallerCanFillForm}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className={getStatusColor(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                    <button
                      onClick={() => handleUpdateAgency(item.id)}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                      title="Update Agency"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default MasterAgencyPage;
