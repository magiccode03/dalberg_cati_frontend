'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { apiService } from '@/lib/api-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import ACAssignmentModal from '@/components/modals/ACAssignmentModal';

interface TeleUserData {
  id: number;
  teleform_user_id: number;
  name: string;
  mobile_number: string;
  form_id: number;
  fill_form: number;
  form_data: number;
  qc: number;
  qc_recheck: number;
  supervisor_id: number;
  agency_id: number;
  telecalling_group_id: number;
  under_training: number;
  created_at: number;
  created_by: number;
  updated_at: number;
  updated_by: number;
  status: number;
}

interface SearchFilters {
  teleform_user_id: string;
  name: string;
  mobile_number: string;
  status: string;
}

const TeleUserInfoPage: React.FC = () => {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    teleform_user_id: '',
    name: '',
    mobile_number: '',
    status: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [teleUserData, setTeleUserData] = useState<TeleUserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTelecaller, setSelectedTelecaller] = useState<{id: number, name: string} | null>(null);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ];

  // Fetch telecallers from API
  const fetchTelecallers = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (searchFilters.teleform_user_id) params.teleform_user_id = searchFilters.teleform_user_id;
      if (searchFilters.name) params.name = searchFilters.name;
      if (searchFilters.mobile_number) params.mobile_number = searchFilters.mobile_number;
      if (searchFilters.status) params.status = searchFilters.status;

      console.log('API Call Params:', params); // Debug log to see what's being sent

      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Build query string
      const queryParams = new URLSearchParams(params).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/teleform-users?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTeleUserData(result.data);
        setTotalItems(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } else {
        setError(result.message || 'Failed to fetch telecallers');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching telecallers');
      console.error('Error fetching telecallers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchTelecallers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    fetchTelecallers(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddData = (user: TeleUserData) => {
    setSelectedTelecaller({
      id: user.teleform_user_id,
      name: user.name
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTelecaller(null);
  };

  const handleAssignmentSuccess = () => {
    // Refresh the data or show success message
    fetchTelecallers(currentPage);
  };

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

        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Search Form */}
        <Card className="">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="Teleform User ID"
                  value={searchFilters.teleform_user_id}
                  onChange={(e) => handleInputChange('teleform_user_id', e.target.value)}
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
                  value={searchFilters.mobile_number}
                  onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <SelectDropdown
                  options={statusOptions}
                  value={searchFilters.status}
                  onChange={(value) => handleInputChange('status', Array.isArray(value) ? value[0] : value as string)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
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
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push('/cati/ppm/manage-calling/create-tele-caller')}
              >
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Teleform User ID</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Name</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Mobile Number</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      Actions <Edit className="inline w-4 h-4 ml-1" />
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      Add Data <Plus className="inline w-4 h-4 ml-1" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teleUserData.length > 0 ? (
                    teleUserData.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-mono">
                          {user.teleform_user_id}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-mono">
                          {user.mobile_number}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 1 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            title="Edit Telecaller"
                            onClick={() => router.push(`/cati/ppm/manage-calling/edit-tele-caller/${user.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="bg-blue-500 hover:bg-blue-600 text-white" 
                            title="Add Data"
                            onClick={() => handleAddData(user)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No telecallers found. Try adjusting your search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>

          {/* Table Footer */}
          {!loading && teleUserData.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold">{totalItems}</span> items.
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
          )}
        </Card>

        {/* AC Assignment Modal */}
        {selectedTelecaller && (
          <ACAssignmentModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            teleformUserId={selectedTelecaller.id}
            telecallerName={selectedTelecaller.name}
            onSuccess={handleAssignmentSuccess}
          />
        )}
      </div>
    </FluidContainer>
  );
};

export default TeleUserInfoPage;
