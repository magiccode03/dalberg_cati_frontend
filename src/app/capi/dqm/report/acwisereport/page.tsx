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
    current_page: number;
    total_pages: number;
    total_count: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
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

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): ACWiseReportData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      sNo: index + 1,
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
      
      console.log('Making API request to: /capi/ac-qc-statistics');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/capi/ac-qc-statistics${queryString ? `?${queryString}` : ''}`;
      
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
        setAcWiseReportData(transformedData);
        setTotalCount(data.pagination?.total_count || transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: ACWiseReportData[] = [
          { id: 1, sNo: 1, acCode: 0, name: 'WB', agencyName: '', sample: 0, checker: '-', alloted: 0, completed: 0, accepted: 0, rejected: 0, underQc: 0 },
          { id: 2, sNo: 2, acCode: 1, name: 'Mekliganj', agencyName: 'Ajit Barman', sample: 0, checker: '100, 109, 114, 117, 123, 999', alloted: 97, completed: 95, accepted: 34, rejected: 62, underQc: 7 },
        ];
        setAcWiseReportData(fallbackData);
        setTotalCount(fallbackData.length);
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
      setAcWiseReportData(fallbackData);
      setTotalCount(fallbackData.length);
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
      const response = await apiClient.get('/capi/ac-qc-statistics?limit=300');
      const data: APIResponse = response.data;
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const transformedData = transformAPIData(data.data);
        
        // Convert to CSV
        const csvHeaders = [
          'S.No',
          'AC Code', 
          'Name',
          'Team',
          'Checker',
          'Alloted',
          'Completed',
          'Accepted',
          'Rejected',
          'Under QC'
        ];
        
        const csvRows = transformedData.map((item, index) => [
          index + 1,
          item.acCode,
          `"${item.name}"`,
          `"${item.agencyName}"`,
          `"${item.checker}"`,
          new Intl.NumberFormat('en-IN').format(item.alloted),
          new Intl.NumberFormat('en-IN').format(item.completed),
          new Intl.NumberFormat('en-IN').format(item.accepted),
          new Intl.NumberFormat('en-IN').format(item.rejected),
          new Intl.NumberFormat('en-IN').format(item.underQc)
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

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = acWiseReportData;

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            AC Wise Report
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Text className="text-gray-600">Loading AC wise report...</Text>
        </div>
      )}

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
              onClick={fetchACWiseReportData} 
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* AC Wise Report Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              AC Wise Report
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalCount.toLocaleString()}</strong> ACs.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Team</th>
                  <th className="text-center">Alloted</th>
                  <th className="text-center">Completed</th>
                  <th className="text-center">Valid</th>
                  <th className="text-center">Rejected</th>
                  <th className="text-center">Under QC</th>
                  <th className="text-center">Checker</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((data, index) => (
                  <tr key={data.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{data.acCode}</td>
                    <td className="text-left">{data.name}</td>
                    <td className="text-left">
                      {getAgencyBadge(data.agencyName)}
                    </td>
                    <td className="text-center">
                      <FormattedNumber value={data.alloted} locale="en-IN" />
                    </td>
                    <td className="text-center">
                      <FormattedNumber value={data.completed} locale="en-IN" />
                    </td>
                    <td className="text-center text-green-600 font-medium">
                      <FormattedNumber value={data.accepted} locale="en-IN" />
                    </td>
                    <td className="text-center text-red-600 font-medium">
                      <FormattedNumber value={data.rejected} locale="en-IN" />
                    </td>
                    <td className="text-center text-blue-600 font-medium">
                      <FormattedNumber value={data.underQc} locale="en-IN" />
                    </td>
                    <td className="text-left">{data.checker || '-'}</td>
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
        </div>
      </Card>
    </Container>
  );
}
