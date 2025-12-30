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

interface AssignedACData {
  id: number;
  qcId: number;
  qcUserName: string;
  acCode: number;
  acName: string;
  interviewerId: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: Array<{
      qc_id: number;
      qc_user_name: string;
      mobile_number: string;
      audio: number;
      tele: number;
      gps: number;
      clientaudiocheck: number;
      status: number;
      agency_id: number;
      assignments: Array<{
        ac_code: number;
        ac_name: string;
        interviewer_id: number;
      }>;
    }>;
  };
  error?: string;
  message?: string;
  timestamp: string;
}

export default function AssignedACPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [assignedACData, setAssignedACData] = useState<AssignedACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): AssignedACData[] => {
    const transformedData: AssignedACData[] = [];
    let id = 1;

    apiData.forEach((qcUser) => {
      if (qcUser.assignments && Array.isArray(qcUser.assignments)) {
        qcUser.assignments.forEach((assignment: any) => {
          transformedData.push({
            id: id++,
            qcId: qcUser.qc_id,
            qcUserName: qcUser.qc_user_name,
            acCode: assignment.ac_code,
            acName: assignment.ac_name,
            interviewerId: assignment.interviewer_id
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
      
      console.log('Making API request to: /report/assigned-ac');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/report/assigned-ac${queryString ? `?${queryString}` : ''}`;
      
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
        setAssignedACData(transformedData);
        setTotalCount(transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: AssignedACData[] = [
          { id: 1, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 101 },
          { id: 2, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 1182 },
        ];
        setAssignedACData(fallbackData);
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
      const fallbackData: AssignedACData[] = [
    { id: 1, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 101 },
    { id: 2, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 102 },
    { id: 3, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 104 },
    { id: 4, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 1182 },
    { id: 5, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4002 },
      ];
      setAssignedACData(fallbackData);
      setTotalCount(fallbackData.length);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchAssignedACData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);
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
            Assigned AC
          </Heading>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Text className="text-gray-600">Loading assigned AC data...</Text>
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
              onClick={fetchAssignedACData} 
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Assigned AC Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Assigned AC
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalCount.toLocaleString()}</strong> assignments.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">QC ID</th>
                  <th className="text-center">QC User Name</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">AC Name</th>
                  <th className="text-center">Interviewer ID</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((data, index) => (
                  <tr key={data.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{data.qcId}</td>
                    <td className="text-left">{data.qcUserName}</td>
                    <td className="text-center">{data.acCode}</td>
                    <td className="text-left">{data.acName}</td>
                    <td className="text-center">{data.interviewerId}</td>
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
