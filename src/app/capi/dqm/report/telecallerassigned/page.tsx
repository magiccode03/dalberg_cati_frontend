'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Loader2, Search, X } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface AssignedACData {
  id: number;
  qcId: number;
  qcUserName: string;
  acCode: number;
  acName: string;
  interviewerId: number;
  qcPending: number;
  qcCompleted: number;
  qcTotal: number;
  rowspan?: number;
  isFirstRow?: boolean;
}

interface QCUserAssignment {
  qc_id: number;
  qc_user_name: string;
  assignments: Array<{
    ac_code: number;
    ac_name: string;
    interviewer_id: number;
    qc_pending: number;
    qc_completed: number;
    qc_total: number;
  }>;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

interface APIResponse {
  success: boolean;
  data?: QCUserAssignment[];
  pagination?: PaginationInfo;
  error?: string;
  message?: string;
  timestamp: string;
}

interface FilterOptions {
  qcUsers: Array<{ value: string; label: string }>;
  acCodes: Array<{ value: string; label: string }>;
}

export default function AssignedACPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [assignedACData, setAssignedACData] = useState<AssignedACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Filter states
  const [selectedQCUser, setSelectedQCUser] = useState<string>('');
  const [selectedACCode, setSelectedACCode] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    qcUsers: [],
    acCodes: []
  });
  const [filtersLoading, setFiltersLoading] = useState(false);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    setFiltersLoading(true);
    try {
      // Fetch QC Users (load all data)
      const qcUsersResponse = await apiClient.get('/qc-user-registration?status=1&limit=5000');
      const qcUsersData = qcUsersResponse.data;
      
      if (qcUsersData.success && qcUsersData.data?.qc_users) {
        const qcUsers = qcUsersData.data.qc_users.map((user: any) => ({
          value: user.qc_id.toString(),
          label: `${user.name} (${user.qc_id})`
        }));
        
        // Fetch AC Codes from master AC list (load all data)
        let acCodes: Array<{ value: string; label: string }> = [];
        let currentPage = 1;
        let hasMorePages = true;
        
        while (hasMorePages) {
          const acResponse = await apiClient.get(`/dashboard/master-ac-index/list?page=${currentPage}&pageSize=1000`);
          const acData = acResponse.data;
          
          if (acData.success && acData.data?.master_acs) {
            const pageACs = acData.data.master_acs.map((ac: any) => ({
              value: ac.ac_code.toString(),
              label: `${ac.ac_name} (${ac.ac_code})`
            }));
            acCodes = [...acCodes, ...pageACs];
            
            // Check if there are more pages
            hasMorePages = acData.data.has_next || false;
            currentPage++;
          } else {
            hasMorePages = false;
          }
        }
        
        setFilterOptions({
          qcUsers,
          acCodes
        });
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // Set empty options on error
      setFilterOptions({
        qcUsers: [],
        acCodes: []
      });
    } finally {
      setFiltersLoading(false);
    }
  };

  // Helper function to transform API data to UI format with rowspan support
  const transformAPIData = (apiData: QCUserAssignment[]): AssignedACData[] => {
    const transformedData: AssignedACData[] = [];
    let id = 1;

    apiData.forEach((qcUser) => {
      if (qcUser.assignments && Array.isArray(qcUser.assignments)) {
        const assignmentCount = qcUser.assignments.length;
        
                qcUser.assignments.forEach((assignment, index) => {
                  transformedData.push({
                    id: id++,
                    qcId: qcUser.qc_id,
                    qcUserName: qcUser.qc_user_name,
                    acCode: assignment.ac_code,
                    acName: assignment.ac_name,
                    interviewerId: assignment.interviewer_id,
                    qcPending: assignment.qc_pending,
                    qcCompleted: assignment.qc_completed,
                    qcTotal: assignment.qc_total,
                    rowspan: index === 0 ? assignmentCount : 0, // Only first row gets rowspan
                    isFirstRow: index === 0 // Mark first row for QC ID and Name
                  });
                });
      }
    });

    return transformedData;
  };

  // Fetch data from API
  const fetchAssignedACData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /capi/qc-user-assignments');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      // Add filter parameters
      if (selectedQCUser) {
        queryParams.append('qc_id', selectedQCUser);
      }
      if (selectedACCode) {
        queryParams.append('ac_code', selectedACCode);
      }
      
      const queryString = queryParams.toString();
      const endpoint = `/capi/qc-user-assignments${queryString ? `?${queryString}` : ''}`;
      
      console.log('API endpoint:', endpoint);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });
      
      // Race between API call and timeout
      const response = await Promise.race([
        apiClient.get(endpoint),
        timeoutPromise
      ]) as any;
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const transformedData = transformAPIData(data.data);
        setAssignedACData(transformedData);
        
        // Handle pagination info
        if (data.pagination) {
          setTotalCount(data.pagination.total_count);
          setTotalPages(data.pagination.total_pages);
          setHasNext(data.pagination.has_next);
          setHasPrevious(data.pagination.has_previous);
        } else {
          // Fallback to transformed data length if no pagination info
          setTotalCount(transformedData.length);
          setTotalPages(1);
          setHasNext(false);
          setHasPrevious(false);
        }
        
        console.log('Transformed data:', transformedData);
        console.log('Pagination info:', data.pagination);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: AssignedACData[] = [
          { id: 1, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 101, qcPending: 25, qcCompleted: 75, qcTotal: 100, rowspan: 3, isFirstRow: true },
          { id: 2, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 102, qcPending: 15, qcCompleted: 35, qcTotal: 50, rowspan: 0, isFirstRow: false },
          { id: 3, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 104, qcPending: 10, qcCompleted: 40, qcTotal: 50, rowspan: 0, isFirstRow: false },
          { id: 4, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 1182, qcPending: 30, qcCompleted: 70, qcTotal: 100, rowspan: 2, isFirstRow: true },
          { id: 5, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4002, qcPending: 20, qcCompleted: 30, qcTotal: 50, rowspan: 0, isFirstRow: false },
        ];
        setAssignedACData(fallbackData);
        setTotalCount(fallbackData.length);
        setTotalPages(1);
        setHasNext(false);
        setHasPrevious(false);
      }
    } catch (err: any) {
      console.error('Error in fetchAssignedACData:', err);
      setError('Failed to fetch assigned AC data. Please try again.');
      
      // Use fallback data on error
      console.log('Using fallback sample data due to error...');
      const fallbackApiData: QCUserAssignment[] = [
        {
          qc_id: 109,
          qc_user_name: 'Kundan',
          assignments: [
            { ac_code: 1, ac_name: 'Valmiki Nagar', interviewer_id: 101, qc_pending: 25, qc_completed: 75, qc_total: 100 },
            { ac_code: 1, ac_name: 'Valmiki Nagar', interviewer_id: 102, qc_pending: 15, qc_completed: 35, qc_total: 50 },
            { ac_code: 1, ac_name: 'Valmiki Nagar', interviewer_id: 104, qc_pending: 10, qc_completed: 40, qc_total: 50 }
          ]
        },
        {
          qc_id: 120,
          qc_user_name: 'Supriya',
          assignments: [
            { ac_code: 132, ac_name: 'Warisnagar', interviewer_id: 1182, qc_pending: 30, qc_completed: 70, qc_total: 100 },
            { ac_code: 132, ac_name: 'Warisnagar', interviewer_id: 4002, qc_pending: 20, qc_completed: 30, qc_total: 50 }
          ]
        }
      ];
      
      const transformedData = transformAPIData(fallbackApiData);
      setAssignedACData(transformedData);
      setTotalCount(transformedData.length);
      setTotalPages(1);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchAssignedACData();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedQCUser('');
    setSelectedACCode('');
    setCurrentPage(1);
    fetchAssignedACData();
  };

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchAssignedACData();
  }, [currentPage]);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Calculate display range for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = assignedACData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Assigned AC Interviewer Telecaller
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <Text className="ml-2 text-gray-600">Loading assigned AC data...</Text>
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
                  onClick={fetchAssignedACData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* QC User Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  QC User
                </label>
                <SelectDropdown
                  options={filterOptions.qcUsers}
                  value={selectedQCUser}
                  onChange={(value) => setSelectedQCUser(Array.isArray(value) ? value[0] || '' : value)}
                  placeholder="Select QC User"
                  searchable
                />
              </div>

              {/* AC Code Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  AC Code
                </label>
                <SelectDropdown
                  options={filterOptions.acCodes}
                  value={selectedACCode}
                  onChange={(value) => setSelectedACCode(Array.isArray(value) ? value[0] || '' : value)}
                  placeholder="Select AC Code"
                  searchable
                />
              </div>

              {/* Filter Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleFilterChange}
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Assigned AC Table */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-500 mr-3"></div>  
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    Assigned AC Interviewer Telecaller
                  </Heading>
                </div>
                <span className="text-end"></span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC User Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interviewer ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Completed</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Pending</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        {data.isFirstRow && (
                          <td 
                            rowSpan={data.rowspan || 1} 
                            className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center"
                          >
                            {data.qcId}
                          </td>
                        )}
                        {data.isFirstRow && (
                          <td 
                            rowSpan={data.rowspan || 1} 
                            className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                          >
                            {data.qcUserName}
                          </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.acCode}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.acName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.interviewerId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.qcTotal.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.qcCompleted.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.qcPending.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> items
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
