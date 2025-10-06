'use client';

import { useState, useEffect } from 'react';
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
import { Search, Plus, Edit, Check, Eye, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface QCUserData {
  id: number;
  qc_id: number;
  name: string;
  mobile_number: string;
  gps: number;
  audio: number;
  clientaudiocheck: number;
  status: string;
  agency_id: number;
  tele: number;
  access_permissions: {
    audio_qc: boolean;
    gps_qc: boolean;
    tele_qc: boolean;
    rechecking: boolean;
  };
  assigned_ac_count: number;
  assigned_ac_interviewers: string;
  created_at: number | string;
  updated_at: number | string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qcUserData, setQcUserData] = useState<QCUserData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statistics, setStatistics] = useState({
    total_users: 0,
    active_users: '0',
    inactive_users: '0',
    audio_qc_users: '0',
    gps_qc_users: '0',
    rechecking_users: '0'
  });

  // Fetch QC User data from API
  const fetchQCUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getQCUserRegistration();
      
      if (response.success && response.data) {
        setQcUserData(response.data.qc_users);
        setTotalCount(response.data.pagination.total_count);
        setStatistics(response.data.statistics);
      } else {
        setError('Failed to fetch QC user data');
      }
    } catch (err) {
      console.error('Error fetching QC user data:', err);
      setError('Error fetching QC user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQCUserData();
  }, []);

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    fetchQCUserData();
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

  const renderIcon = (value: number) => {
    return value === 1 ? (
      <span className="text-black text-lg">✓</span>
    ) : (
      <span className="text-black text-lg">✗</span>
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcUserData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <Text>Loading QC user data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-6 text-center">
              <Text className="text-red-600 mb-4">{error}</Text>
              <Button onClick={handleRefresh} variant="primary">
                Try Again
              </Button>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              QC User Registration
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
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
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.qc_id}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.mobile_number}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderIcon(user.gps)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderIcon(user.audio)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderIcon(user.clientaudiocheck)}</td>
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
                  Total <span className="font-semibold">{totalCount}</span> items.
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
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
