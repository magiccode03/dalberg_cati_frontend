'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

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
  data?: {
    data: Array<{
      ac_code: number;
      ac_name: string;
      district_code: number;
      district_name: string;
      pc_code: number;
      pc_name: string;
      agency_id: number;
      agency: {
        id: number;
        agency_name: string;
      };
      acsample: number;
      QcCount: number;
      complete: number;
      achieved: number;
      reject: number;
      underqc: number;
      checker: string;
    }>;
    pagination?: {
      page: number;
      pageSize: number;
      totalCount: number;
      pageCount: number;
    };
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

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): ACWiseReportData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      sNo: index + 1,
      acCode: item.ac_code,
      name: item.district_name,
      agencyName: item.agency?.agency_name || '',
      sample: item.acsample,
      checker: item.checker || '',
      alloted: item.QcCount,
      completed: item.complete,
      accepted: item.achieved,
      rejected: item.reject,
      underQc: item.underqc
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
      
      console.log('Making API request to: /report/acwisereport');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/report/acwisereport${queryString ? `?${queryString}` : ''}`;
      
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
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        const transformedData = transformAPIData(data.data.data);
        setAcWiseReportData(transformedData);
        setTotalCount(data.data.pagination?.totalCount || transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: ACWiseReportData[] = [
          { id: 1, sNo: 1, acCode: 0, name: 'Bihar', agencyName: '', sample: 300, checker: '', alloted: 0, completed: 0, accepted: 0, rejected: 0, underQc: 0 },
          { id: 2, sNo: 2, acCode: 1, name: 'Valmiki Nagar', agencyName: 'Parbhat', sample: 300, checker: '122, 116', alloted: 330, completed: 0, accepted: 310, rejected: 9, underQc: 0 },
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
        { id: 1, sNo: 1, acCode: 0, name: 'Bihar', agencyName: '', sample: 300, checker: '', alloted: 0, completed: 0, accepted: 0, rejected: 0, underQc: 0 },
        { id: 2, sNo: 2, acCode: 1, name: 'Valmiki Nagar', agencyName: 'Parbhat', sample: 300, checker: '122, 116', alloted: 330, completed: 0, accepted: 310, rejected: 9, underQc: 0 },
        { id: 3, sNo: 3, acCode: 2, name: 'Ramnagar (SC)', agencyName: 'Parbhat', sample: 300, checker: '101, 127, 139', alloted: 395, completed: 0, accepted: 346, rejected: 30, underQc: 0 },
        { id: 4, sNo: 4, acCode: 3, name: 'Narkatiaganj', agencyName: 'Parbhat', sample: 300, checker: '110, 103, 120, 140', alloted: 400, completed: 0, accepted: 315, rejected: 73, underQc: 0 },
        { id: 5, sNo: 5, acCode: 4, name: 'Bagaha', agencyName: 'Parbhat', sample: 300, checker: '116, 127, 128', alloted: 345, completed: 0, accepted: 306, rejected: 27, underQc: 0 },
      ];
      setAcWiseReportData(fallbackData);
      setTotalCount(fallbackData.length);
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
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
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
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div> 
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  AC Wise Report
                </Heading>
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
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">S.No</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Agency Name</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Sample</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Checker</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Alloted</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Completed</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Accepted</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Rejected</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Under QC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm text-gray-900">{data.sNo}</td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-mono text-gray-900">{data.acCode}</td>
                        <td className="px-4 py-4 text-left whitespace-nowrap text-sm text-gray-900 font-medium">{data.name}</td>
                        <td className="px-4 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                          {getAgencyBadge(data.agencyName)}
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-mono text-gray-900">{data.sample.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm text-gray-900">{data.checker || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.alloted.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-mono text-gray-900">{data.completed.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-mono text-green-600 font-medium">{data.accepted.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-mono text-red-600 font-medium">{data.rejected.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-mono text-blue-600 font-medium">{data.underQc.toLocaleString()}</td>
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
