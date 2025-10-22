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
import { Loader2, Edit, Plus, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
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

  const [acData, setAcData] = useState<ACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [agencyOptions, setAgencyOptions] = useState([{ value: '', label: 'Select State Teams' }]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ACData; direction: 'asc' | 'desc' } | null>(null);

  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '20', label: 'Chiraia (20)' },
    { value: '14', label: 'Govindganj (14)' },
    { value: '13', label: 'Harsidhi (SC) (13)' },
    { value: '15', label: 'Kesaria (15)' },
    { value: '16', label: 'Kalyanpur (16)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '18', label: 'Madhuban (18)' },
    { value: '19', label: 'Motihari (19)' },
    { value: '12', label: 'Narkatia (12)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '17', label: 'Pipra (17)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '10', label: 'Raxaul (10)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '11', label: 'Sugauli (11)' },
    { value: '1', label: 'Valmiki Nagar (1)' },
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
    return fetchACDataWithFilters(filters);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAgencies(); // Load agencies first
    fetchACData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchACData();
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    // Reset filters to empty values
    const clearedFilters = {
      agencyId: '',
      acCode: '',
    };
    
    setFilters(clearedFilters);
    
    // Fetch data with cleared filters immediately
    fetchACDataWithFilters(clearedFilters);
  };

  // Helper function to fetch data with specific filters
  const fetchACDataWithFilters = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Making API request to: /api/dashboard/master-ac-index/list');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (customFilters.agencyId) queryParams.append('agency_id', customFilters.agencyId);
      if (customFilters.acCode) queryParams.append('ac_code', customFilters.acCode);
      
      // Force fetch all pages to get all 295 records
      let allMasterAcs: any[] = [];
      let currentPage = 1;
      let totalPages = 1;
      let totalCount = 0;
      
      console.log('Starting to fetch all pages to get all 295 records...');
      
      // First, get page 1 to understand the structure
      queryParams.append('page', '1');
      queryParams.append('limit', '20'); // Use the working limit from your curl
      
      const queryString = queryParams.toString();
      const baseEndpoint = `/api/dashboard/master-ac-index/list`;
      
      console.log('Base endpoint:', baseEndpoint);
      
      // Try multiple approaches to handle different base URLs
      let workingEndpoint = '';
      const endpoints = [
        `${baseEndpoint}?${queryString}`, // Try the original endpoint first
        `http://localhost:4001${baseEndpoint}?${queryString}`, // Try with localhost:4001
        `/dashboard/master-ac-index/list?${queryString}`, // Try without /api prefix
      ];
      
      for (const testEndpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${testEndpoint}`);
          const testResponse = await apiClient.get(testEndpoint, { timeout: 10000 });
          console.log(`Success with endpoint: ${testEndpoint}`);
          workingEndpoint = testEndpoint.replace(`?${queryString}`, ''); // Get base endpoint
          break;
        } catch (err: any) {
          console.log(`Failed with endpoint ${testEndpoint}:`, err.message);
          if (testEndpoint === endpoints[endpoints.length - 1]) {
            // If this was the last attempt, throw the error
            throw err;
          }
          continue;
        }
      }
      
      if (!workingEndpoint) {
        throw new Error('All API endpoints failed');
      }
      
      // Now fetch all pages
      while (currentPage <= 20) { // Safety limit to prevent infinite loops
        try {
          const pageQueryParams = new URLSearchParams();
          if (customFilters.agencyId) pageQueryParams.append('agency_id', customFilters.agencyId);
          if (customFilters.acCode) pageQueryParams.append('ac_code', customFilters.acCode);
          pageQueryParams.append('page', currentPage.toString());
          pageQueryParams.append('limit', '20');
          
          const pageQueryString = pageQueryParams.toString();
          const pageEndpoint = `${workingEndpoint}?${pageQueryString}`;
          
          console.log(`Fetching page ${currentPage}: ${pageEndpoint}`);
          
          const pageResponse = await apiClient.get(pageEndpoint, { timeout: 10000 });
          const pageData = pageResponse.data;
          
          console.log(`Page ${currentPage} response:`, pageData);
          
          if (pageData.success && pageData.data && Array.isArray(pageData.data.master_acs)) {
            allMasterAcs = [...allMasterAcs, ...pageData.data.master_acs];
            totalPages = pageData.data.total_pages;
            totalCount = pageData.data.total_count;
            
            console.log(`Page ${currentPage} fetched. Records: ${pageData.data.master_acs.length}, Total so far: ${allMasterAcs.length}, Total count: ${totalCount}`);
            
            // If we've got all records or no more pages, break
            if (!pageData.data.has_next || allMasterAcs.length >= totalCount) {
              console.log(`All pages fetched. Total records: ${allMasterAcs.length}`);
              break;
            }
          } else {
            console.log(`Page ${currentPage} failed or no data`);
            break;
          }
          
          currentPage++;
        } catch (pageErr: any) {
          console.error(`Error fetching page ${currentPage}:`, pageErr);
          break;
        }
      }
      
      console.log(`Final result: ${allMasterAcs.length} records fetched out of ${totalCount} total`);
      
      if (allMasterAcs.length > 0) {
        const transformedData = transformAPIData(allMasterAcs);
        setAcData(transformedData);
        setTotalCount(allMasterAcs.length);
        console.log('Transformed data:', transformedData);
      } else {
        setError('No data received from API');
        setAcData([]);
        setTotalCount(0);
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
          acName: 'Mekliganj',
          agencyId: 1,
          agencyName: 'Ajit Barman',
          totalInterview: 15,
          validInterview: 8,
        },
        {
          id: 2,
          acCode: 2,
          acName: 'Mathabhanga',
          agencyId: 1,
          agencyName: 'Ajit Barman',
          totalInterview: 0,
          validInterview: 0,
        }
      ];
      setAcData(sampleData);
      setTotalCount(sampleData.length);
    } finally {
      setLoading(false);
    }
  };

  // Sorting functionality
  const handleSort = (key: keyof ACData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return acData;

    return [...acData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  // Navigation functions
  const handleUpdateAgency = (acItem: ACData) => {
    router.push(`/capi/ppm/master/aclist/acupdate?ac_code=${acItem.acCode}`);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
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
                placeholder="Search or select state teams"
                searchable={true}
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-2">AC</Text>
              <SelectDropdown
                options={acOptions}
                value={filters.acCode}
                onChange={(value) => handleFilterChange('acCode', value as string)}
                placeholder="Search or select AC"
                searchable={true}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600 border-gray-500"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
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
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">AC List</Heading>
          </div>
          {/* <Button variant="primary" className="bg-blue-600 text-white hover:bg-blue-500">
          <Plus className="w-4 h-4 mr-2" />
            Update Data Team Wise
          </Button> */}
        </div>

        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Total <strong>{totalCount}</strong> items.
          </Text>
        </div>
                
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <Table className="table table-bordered table-striped table-hover">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('acCode')}
                >
                  <div className="flex items-center justify-center">
                    <span>AC Code</span>
                    <div className="ml-1 flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${sortConfig?.key === 'acCode' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'acCode' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('acName')}
                >
                  <div className="flex items-center justify-center">
                    <span>AC Name</span>
                    <div className="ml-1 flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${sortConfig?.key === 'acName' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'acName' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('agencyId')}
                >
                  <div className="flex items-center justify-center">
                    <span>Zonal Manager ID</span>
                    <div className="ml-1 flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${sortConfig?.key === 'agencyId' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'agencyId' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('agencyName')}
                >
                  <div className="flex items-center justify-center">
                    <span>Zonal Manager Name</span>
                    <div className="ml-1 flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${sortConfig?.key === 'agencyName' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'agencyName' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalInterview')}
                >
                  <div className="flex items-center justify-center">
                    <span>Total Interview</span>
                    <div className="ml-1 flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${sortConfig?.key === 'totalInterview' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'totalInterview' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('validInterview')}
                >
                  <div className="flex items-center justify-center">
                    <span>Valid Interview</span>
                    <div className="ml-1 flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${sortConfig?.key === 'validInterview' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                      <ChevronDown 
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'validInterview' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                      />
                    </div>
                  </div>
                </th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedData().map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center">{item.acCode}</td>
                  <td>{item.acName}</td>
                  <td className="text-center">{item.agencyId}</td>
                  <td>{item.agencyName}</td>
                  <td className="text-center">{item.totalInterview}</td>
                  <td className="text-center">{item.validInterview}</td>
                  <td className="text-center">
                    <div className="relative group">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        onClick={() => handleUpdateAgency(item)}
                        title="Update Zonal Manager"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

      </Card>
        </>
      )}
    </Container>
  );
};

export default ACListPage;

