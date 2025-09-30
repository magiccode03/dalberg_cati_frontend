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
import Checkbox from '@/components/ui/Checkbox';
import { Edit, Plus, Search } from 'lucide-react';

interface TeleUserData {
  id: number;
  callerAgency: string;
  teleformUserId: string;
  name: string;
  mobileNumber: string;
  underTraining: boolean;
  userFillForm: boolean;
  qcUser: boolean;
  qcRecheck: boolean;
  teleCallingGroup: string;
  status: string;
  pendingData: number;
}

interface SearchFilters {
  teleformUserId: string;
  name: string;
  mobileNumber: string;
  status: string;
  telecallingGroupId: string;
  underTraining: boolean;
  fillForm: boolean;
  qc: boolean;
  qcRecheck: boolean;
}

const TeleUserInfoPage: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    teleformUserId: '',
    name: '',
    mobileNumber: '',
    status: '1',
    telecallingGroupId: '',
    underTraining: false,
    fillForm: false,
    qc: false,
    qcRecheck: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // Sample data
  const teleUserData: TeleUserData[] = [
    {
      id: 43,
      callerAgency: 'labani',
      teleformUserId: '801',
      name: 'Debojit Halder',
      mobileNumber: '9330119691',
      underTraining: false,
      userFillForm: true,
      qcUser: false,
      qcRecheck: false,
      teleCallingGroup: 'Group 2',
      status: 'Active',
      pendingData: 0,
    },
    {
      id: 46,
      callerAgency: 'labani',
      teleformUserId: '804',
      name: 'Riya Tulsyan',
      mobileNumber: '9330300187',
      underTraining: false,
      userFillForm: true,
      qcUser: false,
      qcRecheck: false,
      teleCallingGroup: 'Group 2',
      status: 'Active',
      pendingData: 0,
    },
    {
      id: 53,
      callerAgency: 'labani',
      teleformUserId: '810',
      name: 'Chandana Haldar',
      mobileNumber: '6289348512',
      underTraining: false,
      userFillForm: true,
      qcUser: false,
      qcRecheck: false,
      teleCallingGroup: 'Group 2',
      status: 'Active',
      pendingData: 0,
    },
  ];

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' },
  ];

  const callingGroupOptions = [
    { value: '', label: 'Select Calling Group' },
    { value: '2', label: 'Group 2' },
  ];

  const handleInputChange = (field: keyof SearchFilters, value: string | boolean) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search filters:', searchFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalItems = 273; // Total items from the original data
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <FluidContainer>
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center">
          <div>
            <Heading level={1} className="text-2xl font-bold text-gray-900">
              Tele Caller
            </Heading>
          </div>
          <div className="text-sm text-gray-500">
            {/* Additional header content if needed */}
          </div>
        </div>

        {/* Search Form */}
        <Card className="">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="Teleform User ID"
                  value={searchFilters.teleformUserId}
                  onChange={(e) => handleInputChange('teleformUserId', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  value={searchFilters.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Mobile Number"
                  value={searchFilters.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <SelectDropdown
                  options={statusOptions}
                  value={searchFilters.status}
                  onChange={(value) => handleInputChange('status', Array.isArray(value) ? value[0] : value)}
                  className="w-full"
                />
              </div>
              <div>
                <SelectDropdown
                  options={callingGroupOptions}
                  value={searchFilters.telecallingGroupId}
                  onChange={(value) => handleInputChange('telecallingGroupId', Array.isArray(value) ? value[0] : value)}
                  className="w-full"
                />
              </div>
              <div>
                <Button type="submit" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Checkbox Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={searchFilters.underTraining}
                  onCheckedChange={(checked: boolean) => handleInputChange('underTraining', checked)}
                  id="under-training"
                  label="Under Training"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={searchFilters.fillForm}
                  onCheckedChange={(checked: boolean) => handleInputChange('fillForm', checked)}
                  id="fill-form"
                  label="User Fill Form"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={searchFilters.qc}
                  onCheckedChange={(checked: boolean) => handleInputChange('qc', checked)}
                  id="qc"
                  label="QC User"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={searchFilters.qcRecheck}
                  onCheckedChange={(checked: boolean) => handleInputChange('qcRecheck', checked)}
                  id="qc-recheck"
                  label="QC Recheck"
                />
              </div>
            </div>
          </form>
        </Card>

        {/* Data Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={2} className="text-xl font-semibold text-gray-900">
                Tele Caller
              </Heading>
            </div>
            <div className="flex space-x-2">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add New User
              </Button>
              <Button variant="secondary" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Search className="w-4 h-4 mr-1" />
                Calling User Check
              </Button>
              <Button variant="secondary" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <Edit className="w-4 h-4 mr-1" />
                Redistribute Pending Data
              </Button>
              <Button variant="secondary" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Refresh Progress Data
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Caller Agency</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Teleform User ID</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Mobile Number</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Under Training</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">User Fill Form</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC User</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC Recheck</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Tele Calling Group</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    Actions <Edit className="inline w-4 h-4 ml-1" />
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Pending Data</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    Add Data <Plus className="inline w-4 h-4 ml-1" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {teleUserData.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{user.callerAgency}</td>
                    <td className="px-4 py-3 border-b border-gray-200 font-mono">{user.teleformUserId}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{user.name}</td>
                    <td className="px-4 py-3 border-b border-gray-200 font-mono">{user.mobileNumber}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <i className={`fe ${user.underTraining ? 'fe-check text-green-500' : 'fe-x text-red-500'}`}></i>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <i className={`fe ${user.userFillForm ? 'fe-check text-green-500' : 'fe-x text-red-500'}`}></i>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <i className={`fe ${user.qcUser ? 'fe-check text-green-500' : 'fe-x text-red-500'}`}></i>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <i className={`fe ${user.qcRecheck ? 'fe-check text-green-500' : 'fe-x text-red-500'}`}></i>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">{user.teleCallingGroup}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                      <Button variant="primary" size="sm" title="Edit Telecaller">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">{user.pendingData}</td>
                    <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                      <Button variant="secondary" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" title="Add Data">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">1-30</span> of <span className="font-semibold">273</span> items.
            </div>
            <div>
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </Card>
      </div>
    </FluidContainer>
  );
};

export default TeleUserInfoPage;
