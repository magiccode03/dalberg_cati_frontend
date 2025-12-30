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

interface ACWisePendingData {
  id: number;
  srNo: number;
  acCode: number;
  acName: string;
  pendingInterview: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: Array<{
      sr_no: number;
      ac_code: number;
      ac_name: string;
      pending_interview: number;
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

export default function ACWisePendingDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [acWisePendingData, setAcWisePendingData] = useState<ACWisePendingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): ACWisePendingData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      srNo: item.sr_no,
      acCode: item.ac_code,
      acName: item.ac_name,
      pendingInterview: item.pending_interview
    }));
  };

  // Fetch data from API
  const fetchACWisePendingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /ac-wise-pending-data');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });
      
      // Race between API call and timeout
      const response = await Promise.race([
        apiClient.get('/ac-wise-pending-data'),
        timeoutPromise
      ]) as any;
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        const transformedData = transformAPIData(data.data.data);
        setAcWisePendingData(transformedData);
        setTotalCount(data.data.pagination?.totalCount || transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: ACWisePendingData[] = [
          { id: 1, srNo: 1, acCode: 1, acName: 'Valmiki Nagar (1)', pendingInterview: 0 },
          { id: 2, srNo: 2, acCode: 2, acName: 'Ramnagar (SC) (2)', pendingInterview: 0 },
          { id: 3, srNo: 3, acCode: 3, acName: 'Narkatiaganj (3)', pendingInterview: 0 },
          { id: 4, srNo: 4, acCode: 4, acName: 'Bagaha (4)', pendingInterview: 0 },
          { id: 5, srNo: 5, acCode: 5, acName: 'Lauriya (5)', pendingInterview: 0 },
        ];
        setAcWisePendingData(fallbackData);
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
      const fallbackData: ACWisePendingData[] = [
        { id: 1, srNo: 1, acCode: 1, acName: 'Valmiki Nagar (1)', pendingInterview: 0 },
        { id: 2, srNo: 2, acCode: 2, acName: 'Ramnagar (SC) (2)', pendingInterview: 0 },
        { id: 3, srNo: 3, acCode: 3, acName: 'Narkatiaganj (3)', pendingInterview: 0 },
        { id: 4, srNo: 4, acCode: 4, acName: 'Bagaha (4)', pendingInterview: 0 },
        { id: 5, srNo: 5, acCode: 5, acName: 'Lauriya (5)', pendingInterview: 0 },
        { id: 6, srNo: 6, acCode: 6, acName: 'Nautan (6)', pendingInterview: 0 },
        { id: 7, srNo: 7, acCode: 7, acName: 'Chanpatia (7)', pendingInterview: 0 },
        { id: 8, srNo: 8, acCode: 8, acName: 'Bettiah (8)', pendingInterview: 0 },
        { id: 9, srNo: 9, acCode: 9, acName: 'Sikta (9)', pendingInterview: 0 },
        { id: 10, srNo: 10, acCode: 10, acName: 'Raxaul (10)', pendingInterview: 0 },
        { id: 11, srNo: 11, acCode: 11, acName: 'Sugauli (11)', pendingInterview: 0 },
        { id: 12, srNo: 12, acCode: 12, acName: 'Narkatia (12)', pendingInterview: 0 },
        { id: 13, srNo: 13, acCode: 13, acName: 'Harsidhi (SC) (13)', pendingInterview: 0 },
        { id: 14, srNo: 14, acCode: 14, acName: 'Govindganj (14)', pendingInterview: 0 },
        { id: 15, srNo: 15, acCode: 15, acName: 'Kesaria (15)', pendingInterview: 0 },
        { id: 16, srNo: 16, acCode: 16, acName: 'Kalyanpur (16)', pendingInterview: 0 },
        { id: 17, srNo: 17, acCode: 17, acName: 'Pipra (17)', pendingInterview: 0 },
        { id: 18, srNo: 18, acCode: 18, acName: 'Madhuban (18)', pendingInterview: 0 },
        { id: 19, srNo: 19, acCode: 19, acName: 'Motihari (19)', pendingInterview: 0 },
        { id: 20, srNo: 20, acCode: 20, acName: 'Chiraia (20)', pendingInterview: 0 },
      ];
      setAcWisePendingData(fallbackData);
      setTotalCount(fallbackData.length);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchACWisePendingData();
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = acWisePendingData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending QC Data AC Wise
          </Heading>
        </div>
      </div>


      {/* AC Wise Pending Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending QC Data AC Wise
            </Heading>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalCount.toLocaleString()}</strong> items.
            </Text>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <Text className="text-gray-600">Loading AC wise pending data...</Text>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Text className="text-lg text-red-600">Error: {error}</Text>
              <Button 
                onClick={fetchACWisePendingData}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">AC Code</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">Pending Interview</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((acData, index) => (
                    <tr key={acData.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center">{acData.acCode}</td>
                      <td className="text-left">{acData.acName}</td>
                      <td className="text-center">{acData.pendingInterview}</td>
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
