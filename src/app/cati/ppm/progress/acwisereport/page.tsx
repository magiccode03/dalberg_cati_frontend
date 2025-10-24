'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Loader2, Download } from 'lucide-react';
import apiClient from '@/lib/api-client';
import FormattedNumber from '@/components/ui/FormattedNumber';

interface ACWiseReportData {
  id: number;
  sNo: number;
  acCode: number;
  name: string;
  totalInterviews: number;
  totalAssigned: number;
  totalNotAssigned: number;
  totalPass: number;
  totalFail: number;
  totalPending: number;
}

interface APIResponse {
  success: boolean;
  data?: Array<{
    ac_code: number;
    ac_name: string;
    total_interviews: number;
    total_assigned: number;
    total_not_assigned: number;
    total_pass: number;
    total_fail: number;
    total_pending: number;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
  timestamp: string;
}

export default function ACWiseReportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [acWiseReportData, setAcWiseReportData] = useState<ACWiseReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[], currentPage: number, pageSize: number): ACWiseReportData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      sNo: (currentPage - 1) * pageSize + index + 1, // Calculate Sr.No. based on pagination
      acCode: item.ac_code,
      name: item.ac_name,
      totalInterviews: item.total_interviews,
      totalAssigned: item.total_assigned,
      totalNotAssigned: item.total_not_assigned,
      totalPass: item.total_pass,
      totalFail: item.total_fail,
      totalPending: item.total_pending
    }));
  };

  // Fetch data from API
  const fetchACWiseReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /cati/qc/ac-list');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/cati/qc/ac-list${queryString ? `?${queryString}` : ''}`;
      
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
        const transformedData = transformAPIData(data.data, currentPage, pageSize);
        setAcWiseReportData(transformedData);
        
        // Handle pagination info
        if (data.pagination) {
          setTotalCount(data.pagination.total);
          setTotalPages(data.pagination.totalPages);
          setHasNext(data.pagination.page < data.pagination.totalPages);
          setHasPrevious(data.pagination.page > 1);
        } else {
          // Fallback if no pagination info
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
        const fallbackData: ACWiseReportData[] = [
          { id: 1, sNo: 1, acCode: 1, name: 'Mekliganj', totalInterviews: 50, totalAssigned: 0, totalNotAssigned: 50, totalPass: 0, totalFail: 0, totalPending: 0 },
          { id: 2, sNo: 2, acCode: 2, name: 'Mathabhanga', totalInterviews: 18, totalAssigned: 12, totalNotAssigned: 6, totalPass: 6, totalFail: 5, totalPending: 1 },
        ];
        const transformedFallbackData = transformAPIData(fallbackData, currentPage, pageSize);
        setAcWiseReportData(transformedFallbackData);
        setTotalCount(fallbackData.length);
        setTotalPages(1);
        setHasNext(false);
        setHasPrevious(false);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      
      // Better error handling for different error types
      if (err.message === 'Request timeout after 10 seconds') {
        console.error('Request timed out');
        setError('Request timed out. The server may be slow or unavailable.');
      } else if (err.code === 'ECONNABORTED') {
        console.error('Connection aborted');
        setError('Connection was aborted. Please check your network connection.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        console.error('Network error or no response');
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 401) {
        console.error('Authentication error');
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        console.error('Forbidden error');
        setError('Access forbidden. You do not have permission to view this data.');
      } else if (err.response?.data?.error) {
        console.error('API error:', err.response.data.error);
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        console.error('API message:', err.response.data.message);
        setError(err.response.data.message);
      } else {
        console.error('Unknown error:', err.message);
        setError(err.message || 'An error occurred while fetching data');
      }
      
      // Use fallback data on error
      console.log('API request failed, using fallback sample data...');
      const fallbackData: ACWiseReportData[] = [
        { id: 1, sNo: 1, acCode: 1, name: 'Mekliganj', totalInterviews: 50, totalAssigned: 0, totalNotAssigned: 50, totalPass: 0, totalFail: 0, totalPending: 0 },
        { id: 2, sNo: 2, acCode: 2, name: 'Mathabhanga', totalInterviews: 18, totalAssigned: 12, totalNotAssigned: 6, totalPass: 6, totalFail: 5, totalPending: 1 },
        { id: 3, sNo: 3, acCode: 7, name: 'Dinhata', totalInterviews: 44, totalAssigned: 24, totalNotAssigned: 20, totalPass: 13, totalFail: 11, totalPending: 0 },
        { id: 4, sNo: 4, acCode: 8, name: 'Natabari', totalInterviews: 35, totalAssigned: 0, totalNotAssigned: 35, totalPass: 0, totalFail: 0, totalPending: 0 },
        { id: 5, sNo: 5, acCode: 9, name: 'Tufanganj', totalInterviews: 24, totalAssigned: 22, totalNotAssigned: 2, totalPass: 18, totalFail: 4, totalPending: 0 },
      ];
      const transformedFallbackData = transformAPIData(fallbackData, currentPage, pageSize);
      setAcWiseReportData(transformedFallbackData);
      setTotalCount(fallbackData.length);
      setTotalPages(1);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  };

  // Download all data as CSV
  const downloadAllData = async () => {
    try {
      setLoading(true);
      
      console.log('Downloading all AC wise report data...');
      
      // Call API with limit=300 to get all data
      const response = await apiClient.get('/cati/qc/ac-list?limit=300');
      const data: APIResponse = response.data;
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const transformedData = transformAPIData(data.data, 1, data.data.length); // Use page 1 for download
        
        // Convert to CSV
        const csvHeaders = [
          'S.No',
          'AC Code', 
          'AC Name',
          'Total Interviews',
          'Total Assigned',
          'Total Under QC',
          'Total Pass',
          'Total Fail',
          'Total Pending'
        ];
        
        const csvRows = transformedData.map((item) => [
          item.sNo, // Use the calculated Sr.No.
          item.acCode,
          `"${item.name}"`,
          new Intl.NumberFormat('en-IN').format(item.totalInterviews),
          new Intl.NumberFormat('en-IN').format(item.totalAssigned),
          new Intl.NumberFormat('en-IN').format(item.totalNotAssigned),
          new Intl.NumberFormat('en-IN').format(item.totalPass),
          new Intl.NumberFormat('en-IN').format(item.totalFail),
          new Intl.NumberFormat('en-IN').format(item.totalPending)
        ]);
        
        // Create CSV content
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `ac-wise-report-${new Date().toISOString().split('T')[0]}.csv`);
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

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchACWiseReportData();
  }, [currentPage]);


  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = acWiseReportData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              AC Wise Report
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
            <Text className="ml-2 text-gray-600">Loading AC wise report...</Text>
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
                  onClick={fetchACWiseReportData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* AC Wise Report Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                AC Wise Report
              </Heading>
            </div>
            <div className="flex items-center">
              <Button
                variant="primary"
                onClick={downloadAllData}
                className="flex items-center"
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
            Total <strong>{totalCount}</strong> ACs.
          </div>
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead className="sticky-header bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Sr.No.</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interviews</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Assigned</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Under QC</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Pass</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Fail</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Pending</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data, index) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.sNo}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{data.acCode}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
                          <FormattedNumber value={data.totalInterviews} locale="en-IN" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-blue-600 font-medium text-center">
                          <FormattedNumber value={data.totalAssigned} locale="en-IN" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-orange-600 font-medium text-center">
                          <FormattedNumber value={data.totalNotAssigned} locale="en-IN" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-green-600 font-medium text-center">
                          <FormattedNumber value={data.totalPass} locale="en-IN" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-red-600 font-medium text-center">
                          <FormattedNumber value={data.totalFail} locale="en-IN" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-yellow-600 font-medium text-center">
                          <FormattedNumber value={data.totalPending} locale="en-IN" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

          {/* Table Footer with Pagination */}
          <div className="flex justify-between items-center mt-4 px-4 pb-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> results.
            </div>
            {totalPages > 1 && (
              <div>
                <PaginationStandard
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
