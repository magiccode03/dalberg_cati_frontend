'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Loader2, Edit } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { apiService } from '@/lib/api';

interface ACData {
  id: number;
  acCode: number;
  acName: string;
  agencyId: number;
  agencyName: string;
  totalInterview: number;
  validInterview: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    master_acs: Array<{
      ac_code: number;
      ac_name: string;
      agency_id: number;
      agency_name: string;
      total_interview: number;
      valid_interview: number;
    }>;
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

const ACListPage = () => {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    agencyId: '',
    acCode: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [acData, setAcData] = useState<ACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [agencyOptions, setAgencyOptions] = useState([{ value: '', label: 'Select State Teams' }]);

  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Valmiki Nagar (1)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '10', label: 'Raxaul (10)' },
    { value: '11', label: 'Sugauli (11)' },
    { value: '12', label: 'Narkatia (12)' },
    { value: '13', label: 'Harsidhi (SC) (13)' },
    { value: '14', label: 'Govindganj (14)' },
    { value: '15', label: 'Kesaria (15)' },
    { value: '16', label: 'Kalyanpur (16)' },
    { value: '17', label: 'Pipra (17)' },
    { value: '18', label: 'Madhuban (18)' },
    { value: '19', label: 'Motihari (19)' },
    { value: '20', label: 'Chiraia (20)' },
  ];

  // Fetch agencies for dropdown
  const fetchAgencies = async () => {
    try {
      const response = await apiService.getAgencies();
      
      if (response.success && response.data && typeof response.data === 'object') {
        const options = [
          { value: '', label: 'Select State Teams' },
          ...Object.entries(response.data).map(([id, name]) => ({
            value: id,
            label: name as string
          }))
        ];
        setAgencyOptions(options);
      }
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): ACData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      acCode: item.ac_code,
      acName: item.ac_name,
      agencyId: item.agency_id,
      agencyName: item.agency_name,
      totalInterview: item.total_interview,
      validInterview: item.valid_interview
    }));
  };

  // Fetch data from API
  const fetchACData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Making API request to: /dashboard/master-ac-index/list');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.agencyId) queryParams.append('agency_id', filters.agencyId);
      if (filters.acCode) queryParams.append('ac_code', filters.acCode);
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/dashboard/master-ac-index/list${queryString ? `?${queryString}` : ''}`;
      
      console.log('API endpoint:', endpoint);
      
      const response = await apiClient.get(endpoint, { timeout: 10000 });
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      
      if (data.success && data.data && Array.isArray(data.data.master_acs)) {
        const transformedData = transformAPIData(data.data.master_acs);
        setAcData(transformedData);
        setTotalCount(data.data.total_count);
        setTotalPages(data.data.total_pages);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: ACData[] = [
          ...acData
        ];
        setAcData(fallbackData);
        setTotalCount(fallbackData.length);
        setTotalPages(Math.ceil(fallbackData.length / pageSize));
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      
      // Better error handling for different error types
      if (err.message === 'Request timeout after 10 seconds') {
        setError('Request timed out. The server may be slow or unavailable.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Connection was aborted. Please check your network connection.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. You do not have permission to view this data.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while fetching data');
      }
      
      // Use sample data on error
      const sampleData: ACData[] = [
        {
          id: 1,
          acCode: 1,
          acName: 'Valmiki Nagar',
          agencyId: 4,
          agencyName: 'Parbhat',
          totalInterview: 330,
          validInterview: 310,
        },
        {
          id: 2,
          acCode: 2,
          acName: 'Ramnagar (SC)',
          agencyId: 4,
          agencyName: 'Parbhat',
          totalInterview: 395,
          validInterview: 346,
        }
      ];
      setAcData(sampleData);
      setTotalCount(sampleData.length);
      setTotalPages(Math.ceil(sampleData.length / pageSize));
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters/page change
  useEffect(() => {
    fetchAgencies(); // Load agencies first
    fetchACData();
  }, [currentPage, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchACData();
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Navigation functions
  const handleUpdateAgency = (acItem: ACData) => {
    router.push(`/capi/ppm/master/aclist/acupdate?ac_code=${acItem.acCode}`);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={3} className="mb-6">
        AC List
      </Heading>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <Text className="ml-2 text-gray-600">Loading AC data...</Text>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Heading level={4} className="text-lg font-semibold text-red-600 mb-2">
                  Error Loading Data
                </Heading>
                <Text className="text-gray-600">{error}</Text>
              </div>
              <Button
                onClick={fetchACData}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content - Only show when not loading */}
      {!loading && (
        <>
          {/* Search Form */}
          <Card className="mb-3">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">State Teams</Text>
              <SelectDropdown
                options={agencyOptions}
                value={filters.agencyId}
                onChange={(value) => handleFilterChange('agencyId', value as string)}
                placeholder="Select State Teams"
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-2">AC</Text>
              <SelectDropdown
                options={acOptions}
                value={filters.acCode}
                onChange={(value) => handleFilterChange('acCode', value as string)}
                placeholder="Select AC"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <i className="fa fa-search mr-2"></i>
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* AC List Table */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>   
            <Heading level={4}>AC List</Heading>
          </div>
          <Button variant="primary" className="bg-blue-600 text-white hover:bg-blue-500">
            Update Data Agency Wise
          </Button>
        </div>

        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Showing <strong>{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}</strong> of <strong>{totalCount}</strong> items.
          </Text>
        </div>
                
                <div className="table-responsive">
                  <Table className="table table-bordered table-striped table-hover">
                    <thead className="sticky-header bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">AC Code</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">AC Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total Interview</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Valid Interview</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.acCode}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.acName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.agencyId}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.agencyName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalInterview}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.validInterview}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <div className="relative group">
                              <button
                                className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                onClick={() => handleUpdateAgency(item)}
                                title="Update Agency"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Update Agency
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <PaginationStandard
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            className="justify-center"
          />
        </div>
      </Card>
        </>
      )}
    </Container>
  );
};

export default ACListPage;
