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
import { Search, Plus, Edit, Check, Eye } from 'lucide-react';
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
    qc_id: '',
    name: '',
    mobile_number: '',
    status: '1', // Default to Active
    gps: false,
    audio: false,
    clientaudiocheck: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
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
  const fetchQCUserData = async (searchFilters?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API parameters from filters
      const apiParams: any = {
        page: currentPage,
        per_page: pageSize,
      };

      // Add filter parameters if provided
      if (searchFilters) {
        // Text-based filters (only add if not empty)
        if (searchFilters.qc_id && searchFilters.qc_id.trim() !== '') {
          apiParams.qc_id = searchFilters.qc_id.trim();
        }
        if (searchFilters.name && searchFilters.name.trim() !== '') {
          apiParams.name = searchFilters.name.trim();
        }
        if (searchFilters.mobile_number && searchFilters.mobile_number.trim() !== '') {
          apiParams.mobile_number = searchFilters.mobile_number.trim();
        }
        if (searchFilters.status && searchFilters.status !== '') {
          apiParams.status = searchFilters.status;
        }
        
        // Boolean filters (only add if true)
        if (searchFilters.gps === true) {
          apiParams.gps = 1;
        }
        if (searchFilters.audio === true) {
          apiParams.audio = 1;
        }
        if (searchFilters.clientaudiocheck === true) {
          apiParams.clientaudiocheck = 1;
        }
      }
      
      console.log('API params:', apiParams);
      
      const response = await apiService.getQCUserRegistration(apiParams);
      
      if (response.success && response.data) {
        setQcUserData(response.data.qc_users);
        setTotalCount(response.data.pagination.total_count);
        setStatistics(response.data.statistics);
        console.log('Filters applied:', response.data.filters_applied);
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
  }, [currentPage]);

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    setCurrentPage(1); // Reset to first page when searching
    fetchQCUserData(filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchQCUserData(filters);
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

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC User Registration
            </Heading>
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
                  value={filters.qc_id}
                  onChange={(e) => handleFilterChange('qc_id', e.target.value)}
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
                  value={filters.mobile_number}
                  onChange={(e) => handleFilterChange('mobile_number', e.target.value)}
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
                  checked={filters.clientaudiocheck}
                  onCheckedChange={(checked) => handleFilterChange('clientaudiocheck', checked as boolean)}
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
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                QC User Info
              </Heading>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNewUser}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </div>
          </div>
          
          <div className="bg-white">
            <div className="mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{totalCount.toLocaleString()}</strong> items.
              </Text>
            </div>
            
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">QC ID</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Mobile Number</th>
                    <th className="text-center">GPS</th>
                    <th className="text-center">Audio</th>
                    <th className="text-center">Re-Checking</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                    <th className="text-center">Assign AC</th>
                  </tr>
                </thead>
                <tbody>
                  {qcUserData.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center font-mono font-semibold">{user.qc_id}</td>
                      <td className="text-left">{user.name}</td>
                      <td className="text-center font-mono">{user.mobile_number}</td>
                      <td className="text-center">{renderIcon(user.gps)}</td>
                      <td className="text-center">{renderIcon(user.audio)}</td>
                      <td className="text-center">{renderIcon(user.clientaudiocheck)}</td>
                      <td className="text-left">{user.status}</td>
                      <td className="text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                      <td className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignAC(user.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            title="Assign AC"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAssignedAC(user.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            title="View Assigned AC"
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

            {/* Pagination */}
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </Card>
    </Container>
  );
}
