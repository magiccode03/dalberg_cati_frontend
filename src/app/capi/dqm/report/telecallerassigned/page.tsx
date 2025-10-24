'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Loader2, Search, X, Download } from 'lucide-react';
import apiClient from '@/lib/api-client';
import FormattedNumber from '@/components/ui/FormattedNumber';

interface AssignedACData {
  id: number;
  qcId: number;
  qcUserName: string;
  acCode: number;
  acName: string;
  qcPending: number;
  qcCompleted: number;
  qcTotal: number;
  rowspan?: number;
  isFirstRow?: boolean;
  isSummaryRow?: boolean;
}

interface QCUserAssignment {
  qc_id: number;
  qc_user_name: string;
  qc_total: number;
  qc_pending: number;
  qc_completed: number;
  assignments: Array<{
    ac_code: number;
    ac_name: string;
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
  const [pageSize] = useState(25);
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
  
  // Refs to prevent multiple simultaneous API calls
  const fetchDataRef = useRef(false);
  const fetchFiltersRef = useRef(false);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    if (fetchFiltersRef.current) return; // Prevent multiple simultaneous calls
    fetchFiltersRef.current = true;
    
    setFiltersLoading(true);
    try {
      // Fetch QC Users (load all data)
      const qcUsersResponse = await apiClient.get('/qc-user-registration?status=1&limit=1000');
      const qcUsersData = qcUsersResponse.data;
      
      if (qcUsersData.success && qcUsersData.data?.qc_users) {
        const qcUsers = qcUsersData.data.qc_users.map((user: any) => ({
          value: user.qc_id.toString(),
          label: `${user.name} (${user.qc_id})`
        }));
        
        // Fetch AC Codes from master AC list (single call with limit)
        const acResponse = await apiClient.get('/dashboard/master-ac-index/list?limit=300');
        const acData = acResponse.data;
        
        let acCodes: Array<{ value: string; label: string }> = [];
        if (acData.success && acData.data?.master_acs) {
          acCodes = acData.data.master_acs.map((ac: any) => ({
            value: ac.ac_code.toString(),
            label: `${ac.ac_name} (${ac.ac_code})`
          }));
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
      fetchFiltersRef.current = false; // Reset the flag
    }
  }, []); // Empty dependency array since this should only run once

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
            qcPending: assignment.qc_pending,
            qcCompleted: assignment.qc_completed,
            qcTotal: assignment.qc_total,
            rowspan: index === 0 ? assignmentCount+1 : 0, // Only first row gets rowspan
            isFirstRow: index === 0 // Mark first row for QC ID and Name
          });
        });

        // Add summary row for each QC user
        transformedData.push({
          id: id++,
          qcId: qcUser.qc_id,
          qcUserName: qcUser.qc_user_name,
          acCode: 0, // Special code for summary row
          acName: 'TOTAL',
          qcPending: qcUser.qc_pending,
          qcCompleted: qcUser.qc_completed,
          qcTotal: qcUser.qc_total,
          rowspan: 0,
          isFirstRow: false,
          isSummaryRow: true // Mark as summary row
        });
      }
    });

    return transformedData;
  };

  // Fetch data from API
  const fetchAssignedACData = useCallback(async () => {
    if (fetchDataRef.current) return; // Prevent multiple simultaneous calls
    fetchDataRef.current = true;
    
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
          { id: 1, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', qcPending: 25, qcCompleted: 75, qcTotal: 100, rowspan: 3, isFirstRow: true },
          { id: 2, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', qcPending: 15, qcCompleted: 35, qcTotal: 50, rowspan: 0, isFirstRow: false },
          { id: 3, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', qcPending: 10, qcCompleted: 40, qcTotal: 50, rowspan: 0, isFirstRow: false },
          { id: 4, qcId: 109, qcUserName: 'Kundan', acCode: 0, acName: 'TOTAL', qcPending: 50, qcCompleted: 150, qcTotal: 200, rowspan: 0, isFirstRow: false, isSummaryRow: true },
          { id: 5, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', qcPending: 30, qcCompleted: 70, qcTotal: 100, rowspan: 2, isFirstRow: true },
          { id: 6, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', qcPending: 20, qcCompleted: 30, qcTotal: 50, rowspan: 0, isFirstRow: false },
          { id: 7, qcId: 120, qcUserName: 'Supriya', acCode: 0, acName: 'TOTAL', qcPending: 50, qcCompleted: 100, qcTotal: 150, rowspan: 0, isFirstRow: false, isSummaryRow: true },
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
          qc_total: 200,
          qc_pending: 50,
          qc_completed: 150,
          assignments: [
            { ac_code: 1, ac_name: 'Valmiki Nagar', qc_pending: 25, qc_completed: 75, qc_total: 100 },
            { ac_code: 1, ac_name: 'Valmiki Nagar', qc_pending: 15, qc_completed: 35, qc_total: 50 },
            { ac_code: 1, ac_name: 'Valmiki Nagar', qc_pending: 10, qc_completed: 40, qc_total: 50 }
          ]
        },
        {
          qc_id: 120,
          qc_user_name: 'Supriya',
          qc_total: 150,
          qc_pending: 50,
          qc_completed: 100,
          assignments: [
            { ac_code: 132, ac_name: 'Warisnagar', qc_pending: 30, qc_completed: 70, qc_total: 100 },
            { ac_code: 132, ac_name: 'Warisnagar', qc_pending: 20, qc_completed: 30, qc_total: 50 }
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
      fetchDataRef.current = false; // Reset the flag
    }
  }, [currentPage, selectedQCUser, selectedACCode, pageSize]); // Include all dependencies

  // Handle filter changes
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchAssignedACData();
  }, [fetchAssignedACData]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedQCUser('');
    setSelectedACCode('');
    setCurrentPage(1);
    fetchAssignedACData();
  }, [fetchAssignedACData]);

  // Download all data as CSV
  const downloadAllData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for all data (no pagination)
      const queryParams = new URLSearchParams();
      
      // Add filter parameters
      if (selectedQCUser) {
        queryParams.append('qc_id', selectedQCUser);
      }
      if (selectedACCode) {
        queryParams.append('ac_code', selectedACCode);
      }
      
      // Set a large page size to get all data (within API limits)
      queryParams.append('page', '1');
      queryParams.append('pageSize', '1000');
      
      const queryString = queryParams.toString();
      const endpoint = `/capi/qc-user-assignments${queryString ? `?${queryString}` : ''}`;
      
      console.log('Downloading all data from:', endpoint);
      
      const response = await apiClient.get(endpoint);
      const data: APIResponse = response.data;
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const transformedData = transformAPIData(data.data);
        
        // Convert to CSV (exclude summary rows)
        const csvHeaders = ['QC ID', 'QC User Name', 'AC Code', 'AC Name', 'QC Total', 'QC Completed', 'QC Pending'];
        const csvRows = transformedData
          .filter(item => !item.isSummaryRow) // Exclude summary rows from CSV
          .map(item => [
            item.qcId,
            item.qcUserName,
            item.acCode,
            item.acName,
            new Intl.NumberFormat('en-IN').format(item.qcTotal),
            new Intl.NumberFormat('en-IN').format(item.qcCompleted),
            new Intl.NumberFormat('en-IN').format(item.qcPending)
          ]);
        
        // Create CSV content
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `assigned-ac-telecaller-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('CSV download completed');
      } else {
        console.error('Failed to fetch data for download:', data.error);
        setError('Failed to fetch data for download');
      }
    } catch (err: any) {
      console.error('Error downloading data:', err);
      setError('Failed to download data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchAssignedACData();
  }, [fetchAssignedACData]);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Calculate display range for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = assignedACData;

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Assigned AC - Telecaller
          </Heading>
        </div>
        <div className="flex items-center">
          <Button
            variant="primary"
            onClick={downloadAllData}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>


      {/* Error State */}
      {error && (
        <Card className="mb-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <Button 
              onClick={fetchAssignedACData} 
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
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
      </Card>

      {/* Assigned AC Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Assigned AC - Telecaller
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalCount.toLocaleString()}</strong> QC Users.
            </Text>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading assigned AC data...</Text>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">QC ID</th>
                    <th className="text-center">QC User Name</th>
                    <th className="text-center">AC Code</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">QC Total</th>
                    <th className="text-center">QC Completed</th>
                    <th className="text-center">QC Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data, index) => (
                    <tr 
                      key={data.id} 
                      className={`${
                        data.isSummaryRow 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-200 dark:border-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="text-center">{startIndex + index + 1}</td>
                      {data.isFirstRow && !data.isSummaryRow && (
                        <td 
                          rowSpan={data.rowspan || 1} 
                          className="text-center"
                        >
                          {data.qcId}
                        </td>
                      )}
                      {data.isFirstRow && !data.isSummaryRow && (
                        <td 
                          rowSpan={data.rowspan || 1} 
                          className="text-left font-medium"
                        >
                          {data.qcUserName}
                        </td>
                      )}
                      <td className={`text-center ${
                        data.isSummaryRow 
                          ? 'text-blue-800 dark:text-blue-200 font-bold' 
                          : ''
                      }`}>
                        {data.isSummaryRow ? '-' : data.acCode}
                      </td>
                      <td className={`text-left ${
                        data.isSummaryRow 
                          ? 'text-blue-800 dark:text-blue-200 font-bold' 
                          : ''
                      }`}>
                        {data.acName}
                      </td>
                      <td className={`text-center ${
                        data.isSummaryRow 
                          ? 'text-blue-800 dark:text-blue-200 font-bold' 
                          : ''
                      }`}>
                        <FormattedNumber value={data.qcTotal} locale="en-IN" />
                      </td>
                      <td className={`text-center ${
                        data.isSummaryRow 
                          ? 'text-blue-800 dark:text-blue-200 font-bold' 
                          : ''
                      }`}>
                        <FormattedNumber value={data.qcCompleted} locale="en-IN" />
                      </td>
                      <td className={`text-center ${
                        data.isSummaryRow 
                          ? 'text-blue-800 dark:text-blue-200 font-bold' 
                          : ''
                      }`}>
                        <FormattedNumber value={data.qcPending} locale="en-IN" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
