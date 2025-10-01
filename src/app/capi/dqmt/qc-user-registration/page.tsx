'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Plus, Edit, Check, Eye } from 'lucide-react';

interface QCUserData {
  id: number;
  qcId: number;
  name: string;
  mobileNumber: string;
  gps: boolean;
  audio: boolean;
  reChecking: boolean;
  status: string;
}

export default function QCUserRegistrationPage() {
  const [filters, setFilters] = useState({
    qcId: '',
    name: '',
    mobileNumber: '',
    status: '1', // Default to Active
    gps: false,
    audio: false,
    reChecking: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data based on the provided HTML
  const qcUserData: QCUserData[] = [
    { id: 9, qcId: 109, name: 'Kundan', mobileNumber: '8851258589', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 27, qcId: 117, name: 'Riya', mobileNumber: '8287465958', gps: false, audio: true, reChecking: true, status: 'Active' },
    { id: 28, qcId: 119, name: 'Mohd Usman', mobileNumber: '8799770442', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 29, qcId: 120, name: 'Supriya', mobileNumber: '8130510620', gps: true, audio: true, reChecking: true, status: 'Active' },
    { id: 30, qcId: 121, name: 'Ashifa', mobileNumber: '9315606691', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 31, qcId: 122, name: 'Rama', mobileNumber: '9625885362', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 37, qcId: 135, name: 'Parveen Sharma', mobileNumber: '7011783380', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 38, qcId: 128, name: 'Kumudmessey', mobileNumber: '9990744898', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 39, qcId: 127, name: 'Faizal Saifi', mobileNumber: '7290857388', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 51, qcId: 130, name: 'Himanshi', mobileNumber: '8802624605', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 52, qcId: 136, name: 'Muskan', mobileNumber: '8448096724', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 53, qcId: 137, name: 'Muskan Siddiqui', mobileNumber: '7398814662', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 55, qcId: 139, name: 'Himanshi-2', mobileNumber: '8920180129', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 56, qcId: 140, name: 'Priyanka', mobileNumber: '8076066334', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 57, qcId: 2001, name: 'Vijay Sharma', mobileNumber: '8423257507', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 58, qcId: 2002, name: 'Mehul Kapoor', mobileNumber: '7275477996', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 59, qcId: 2003, name: 'Nishi', mobileNumber: '8953989468', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 60, qcId: 2004, name: 'Asha Chaurasiya', mobileNumber: '6386460589', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 61, qcId: 2011, name: 'Sucharita Das', mobileNumber: '9123306043', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 62, qcId: 2012, name: 'Srabani Mondal', mobileNumber: '8585862838', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 63, qcId: 2013, name: 'Kiran Naskar', mobileNumber: '8777043262', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 64, qcId: 2014, name: 'Mousimi Parida', mobileNumber: '9804022156', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 65, qcId: 2015, name: 'Rohini Das', mobileNumber: '9163792436', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 66, qcId: 2006, name: 'Deepanjali Trivedi', mobileNumber: '6388846837', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 67, qcId: 2007, name: 'Puja Pandey', mobileNumber: '9792822296', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 68, qcId: 2008, name: 'Archana Singh', mobileNumber: '8887176399', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 69, qcId: 2009, name: 'Seema', mobileNumber: '9721518355', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 70, qcId: 2005, name: 'Meenu Trivedi', mobileNumber: '9454271142', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 71, qcId: 2010, name: 'Shashi Tiwari', mobileNumber: '9161054887', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 72, qcId: 2016, name: 'Dwipannita Sanyanal', mobileNumber: '9874382415', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 73, qcId: 2017, name: 'Rupa Mondal', mobileNumber: '8240170825', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 74, qcId: 2020, name: 'Pratishtha Mishra', mobileNumber: '9450458554', gps: false, audio: true, reChecking: false, status: 'Active' },
    { id: 75, qcId: 1022, name: 'Priyanak Mondal', mobileNumber: '8910346616', gps: false, audio: true, reChecking: false, status: 'Active' },
  ];

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with filters:', filters);
  };

  const handleAddNewUser = () => {
    // Implement add new user logic here
    console.log('Add new user');
  };

  const handleEditUser = (userId: number) => {
    // Implement edit user logic here
    console.log('Edit user:', userId);
  };

  const handleAssignAC = (userId: number) => {
    // Implement assign AC logic here
    console.log('Assign AC for user:', userId);
  };

  const handleViewAssignedAC = (userId: number) => {
    // Implement view assigned AC logic here
    console.log('View assigned AC for user:', userId);
  };

  const renderIcon = (value: boolean) => {
    return value ? (
      <span className="text-black text-lg">✓</span>
    ) : (
      <span className="text-black text-lg">✗</span>
    );
  };

  const totalPages = Math.ceil(qcUserData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcUserData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              QC User Registration
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <Card className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="QC ID"
                  value={filters.qcId}
                  onChange={(e) => handleFilterChange('qcId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Mobile Number"
                  value={filters.mobileNumber}
                  onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value as string)}
                  options={[
                    { value: '', label: 'Select User Status' },
                    { value: '1', label: 'Active' },
                    { value: '2', label: 'Inactive' },
                  ]}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.gps}
                  onCheckedChange={(checked) => handleFilterChange('gps', checked as boolean)}
                />
                <Text className="text-sm text-gray-700">GPS</Text>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.audio}
                  onCheckedChange={(checked) => handleFilterChange('audio', checked as boolean)}
                />
                <Text className="text-sm text-gray-700">Audio</Text>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.reChecking}
                  onCheckedChange={(checked) => handleFilterChange('reChecking', checked as boolean)}
                />
                <Text className="text-sm text-gray-700">Re-Checking</Text>
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* QC User Table */}
        <div className="w-full">
          <Card className="p-0">
            <div className="py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    QC USER INFO
                  </Heading>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddNewUser}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New User
                </Button>
              </div>
            </div>
            <div className="py-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Re-Checking</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign AC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.qcId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.mobileNumber}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderIcon(user.gps)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderIcon(user.audio)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderIcon(user.reChecking)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.status}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignAC(user.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAssignedAC(user.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Total <span className="font-semibold">{qcUserData.length}</span> items.
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={qcUserData.length}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
