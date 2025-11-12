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
  agencyName: string;
  sample: number;
  checker: string;
  alloted: number;
  completed: number;
  accepted: number;
  rejected: number;
  underQc: number;
}

interface APIResponse {
  success: boolean;
  data?: Array<{
    ac_code: number;
    ac_name: string;
    agency_name: string | null;
    sample: number;
    checker_ids: string;
    allotted: number;
    completed: number;
    accepted: number;
    rejected: number;
    under_qc: number;
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
  const [pageSize] = useState(25);
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
      sNo: (currentPage - 1) * pageSize + index + 1,
      acCode: item.ac_code,
      name: item.ac_name,
      agencyName: item.agency_name || '',
      sample: item.sample,
      checker: item.checker_ids || '-',
      alloted: item.allotted,
      completed: item.completed,
      accepted: item.accepted,
      rejected: item.rejected,
      underQc: item.under_qc
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
      
      console.log('Making API request to: /teleform-users?qc=1');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', pageSize.toString());
      
      // Add QC filter
      queryParams.append('qc', '1');
      
      const queryString = queryParams.toString();
      const endpoint = `/teleform-users${queryString ? `?${queryString}` : ''}`;
      
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
      console.log('Raw data:', data.data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        console.log('Data length:', data.data.length);
        console.log('First AC data:', data.data[0]);
        
        const transformedData = transformAPIData(data.data, currentPage, pageSize);
        console.log('Transformed data:', transformedData);
        setAcWiseReportData(transformedData);
        
        // Handle pagination info
        if (data.pagination) {
          console.log('Setting pagination from API:', data.pagination);
          setTotalCount(data.pagination.total);
          setTotalPages(data.pagination.totalPages);
          setHasNext(data.pagination.page < data.pagination.totalPages);
          setHasPrevious(data.pagination.page > 1);
        } else {
          // Fallback if no pagination info
          console.log('No pagination info, using fallback');
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
          { id: 1, sNo: 1, acCode: 0, name: 'WB', agencyName: '', sample: 0, checker: '-', alloted: 0, completed: 0, accepted: 0, rejected: 0, underQc: 0 },
          { id: 2, sNo: 2, acCode: 1, name: 'Mekliganj', agencyName: 'Ajit Barman', sample: 0, checker: '100, 109, 114, 117, 123, 999', alloted: 97, completed: 95, accepted: 34, rejected: 62, underQc: 7 },
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
        { id: 1, sNo: 1, acCode: 0, name: 'WB', agencyName: '', sample: 0, checker: '-', alloted: 0, completed: 0, accepted: 0, rejected: 0, underQc: 0 },
        { id: 2, sNo: 2, acCode: 1, name: 'Mekliganj', agencyName: 'Ajit Barman', sample: 0, checker: '100, 109, 114, 117, 123, 999', alloted: 97, completed: 95, accepted: 34, rejected: 62, underQc: 7 },
        { id: 3, sNo: 3, acCode: 7, name: 'Dinhata', agencyName: 'Ajit Barman', sample: 0, checker: '100, 105, 111', alloted: 60, completed: 60, accepted: 48, rejected: 12, underQc: 0 },
        { id: 4, sNo: 4, acCode: 8, name: 'Natabari', agencyName: 'Ajit Barman', sample: 0, checker: '105, 113', alloted: 43, completed: 43, accepted: 37, rejected: 6, underQc: 0 },
        { id: 5, sNo: 5, acCode: 9, name: 'Tufanganj', agencyName: 'Ajit Barman', sample: 0, checker: '100, 103, 115', alloted: 59, completed: 56, accepted: 41, rejected: 15, underQc: 0 },
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
      const response = await apiClient.get('/teleform-users?qc=1&limit=300');
      const data: APIResponse = response.data;
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const transformedData = transformAPIData(data.data, 1, data.data.length); // Use page 1 for download
        
        // Convert to CSV
        const csvHeaders = [
          'S.No',
          'AC Code', 
          'Name',
          'Alloted',
          'Completed',
          'Valid',
          'Rejected',
          'Under QC',
          'Checker'
        ];
        
        const csvRows = transformedData.map((item) => [
          item.sNo, // Use the calculated Sr.No.
          item.acCode,
          `"${item.name}"`,
          new Intl.NumberFormat('en-IN').format(item.alloted),
          new Intl.NumberFormat('en-IN').format(item.completed),
          new Intl.NumberFormat('en-IN').format(item.accepted),
          new Intl.NumberFormat('en-IN').format(item.rejected),
          new Intl.NumberFormat('en-IN').format(item.underQc),
          `"${item.checker}"`
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
  }, [currentPage, pageSize]);

  const getAgencyBadge = (agencyName: string) => {
    if (!agencyName) return <span className="text-gray-400">-</span>;
    
    const agencyColors: { [key: string]: string } = {
      'Parbhat': 'bg-blue-100 text-blue-800',
      'Inhouse': 'bg-green-100 text-green-800',
      'Kadence': 'bg-purple-100 text-purple-800',
      'Navin': 'bg-orange-100 text-orange-800',
    };
    
    const colorClass = agencyColors[agencyName] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {agencyName}
      </span>
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = acWiseReportData;

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        AC Wise Report
      </Heading>

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
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>   
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">AC Wise Report</Heading>
          </div>
          <Button
            variant="primary"
            onClick={downloadAllData}
            className="flex items-center bg-blue-600 text-white hover:bg-blue-500"
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
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
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Sr.No.</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">AC Code</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Name</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Alloted</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Completed</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Valid</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Rejected</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Under QC</th>
                <th className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Checker</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((data, index) => (
                <tr key={data.id}>
                  <td className="text-center">{data.sNo}</td>
                  <td className="text-center">{data.acCode}</td>
                  <td className="text-center">{data.name}</td>
                  <td className="text-center">
                    <FormattedNumber value={data.alloted} locale="en-IN" />
                  </td>
                  <td className="text-center">
                    <FormattedNumber value={data.completed} locale="en-IN" />
                  </td>
                  <td className="text-center">
                    <FormattedNumber value={data.accepted} locale="en-IN" />
                  </td>
                  <td className="text-center">
                    <FormattedNumber value={data.rejected} locale="en-IN" />
                  </td>
                  <td className="text-center">
                    <FormattedNumber value={data.underQc} locale="en-IN" />
                  </td>
                  <td className="text-center">{data.checker || '-'}</td>
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
            onPageChange={setCurrentPage}
          />
        </div>

      </Card>
    </Container>
  );
}
