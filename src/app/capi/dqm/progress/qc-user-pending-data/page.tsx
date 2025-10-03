'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { RefreshCw } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface QCPendingData {
  id: number;
  qcId: number;
  name: string;
  pendingInterview: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: Array<{
      qc_id: number;
      name: string;
      pending_interview: number;
    }>;
    pagination: {
      page: number;
      pageSize: boolean;
      totalCount: number;
      pageCount: number;
    };
  };
  message?: string;
  timestamp?: string;
}

export default function QCUserPendingDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [qcPendingData, setQcPendingData] = useState<QCPendingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug: Check if token exists
        const token = localStorage.getItem('accessToken');
        console.log('Access token exists:', !!token);
        console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
        
        console.log('Making API request to: /progress/qc-user-pending-data');
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
        });
        
        // Race between API call and timeout
        const response = await Promise.race([
          apiClient.get('/progress/qc-user-pending-data'),
          timeoutPromise
        ]) as any;
        
        const data: APIResponse = response.data;
        
        console.log('API Response:', data);
        console.log('Response success:', data.success);
        console.log('Response data:', data.data);
        
        // Handle different response structures
        if (data.success && data.data) {
          // Check if data array exists in the response
          if (data.data.data && Array.isArray(data.data.data)) {
            // Transform QC pending data
            const pendingData: QCPendingData[] = data.data.data.map((user, index) => ({
              id: index + 1, // Generate sequential ID since API doesn't provide one
              qcId: user.qc_id,
              name: user.name,
              pendingInterview: user.pending_interview
            }));
            setQcPendingData(pendingData);
            console.log('Successfully loaded', pendingData.length, 'QC users with pending data');
          } else {
            // If data array doesn't exist, use fallback data
            console.log('data array not found in response, using fallback data...');
            const fallbackData: QCPendingData[] = [
              { id: 1, qcId: 109, name: 'Kundan', pendingInterview: 0 },
              { id: 2, qcId: 117, name: 'Riya', pendingInterview: 0 },
              { id: 3, qcId: 119, name: 'Mohd Usman', pendingInterview: 0 },
              { id: 4, qcId: 120, name: 'Supriya', pendingInterview: 0 },
              { id: 5, qcId: 121, name: 'Ashifa', pendingInterview: 0 }
            ];
            setQcPendingData(fallbackData);
          }
        } else {
          // Fallback to sample data if API fails
          console.log('API returned no data, using fallback sample data...');
          const fallbackData: QCPendingData[] = [
            { id: 1, qcId: 109, name: 'Kundan', pendingInterview: 0 },
            { id: 2, qcId: 117, name: 'Riya', pendingInterview: 0 },
            { id: 3, qcId: 119, name: 'Mohd Usman', pendingInterview: 0 },
            { id: 4, qcId: 120, name: 'Supriya', pendingInterview: 0 },
            { id: 5, qcId: 121, name: 'Ashifa', pendingInterview: 0 }
          ];
          setQcPendingData(fallbackData);
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
        
        // Use fallback data on error (always show sample data even if API fails)
        console.log('API request failed, using fallback sample data...');
        const fallbackData: QCPendingData[] = [
          { id: 1, qcId: 109, name: 'Kundan', pendingInterview: 0 },
          { id: 2, qcId: 117, name: 'Riya', pendingInterview: 0 },
          { id: 3, qcId: 119, name: 'Mohd Usman', pendingInterview: 0 },
          { id: 4, qcId: 120, name: 'Supriya', pendingInterview: 0 },
          { id: 5, qcId: 121, name: 'Ashifa', pendingInterview: 0 },
          { id: 6, qcId: 122, name: 'Rama', pendingInterview: 0 },
          { id: 7, qcId: 135, name: 'Parveen Sharma', pendingInterview: 0 },
          { id: 8, qcId: 128, name: 'Kumudmessey', pendingInterview: 0 },
          { id: 9, qcId: 127, name: 'Faizal Saifi', pendingInterview: 0 },
          { id: 10, qcId: 130, name: 'Himanshi', pendingInterview: 0 },
          { id: 11, qcId: 136, name: 'Muskan', pendingInterview: 0 },
          { id: 12, qcId: 137, name: 'Muskan Siddiqui', pendingInterview: 0 },
          { id: 13, qcId: 139, name: 'Himanshi-2', pendingInterview: 0 },
          { id: 14, qcId: 140, name: 'Priyanka', pendingInterview: 0 },
          { id: 15, qcId: 2001, name: 'Vijay Sharma', pendingInterview: 0 },
          { id: 16, qcId: 2002, name: 'Mehul Kapoor', pendingInterview: 0 },
          { id: 17, qcId: 2003, name: 'Nishi', pendingInterview: 0 },
          { id: 18, qcId: 2004, name: 'Asha Chaurasiya', pendingInterview: 0 },
          { id: 19, qcId: 2011, name: 'Sucharita Das', pendingInterview: 0 },
          { id: 20, qcId: 2012, name: 'Srabani Mondal', pendingInterview: 0 },
          { id: 21, qcId: 2013, name: 'Kiran Naskar', pendingInterview: 0 },
          { id: 22, qcId: 2014, name: 'Mousimi Parida', pendingInterview: 0 },
          { id: 23, qcId: 2015, name: 'Rohini Das', pendingInterview: 0 },
          { id: 24, qcId: 2006, name: 'Deepanjali Trivedi', pendingInterview: 0 },
          { id: 25, qcId: 2007, name: 'Puja Pandey', pendingInterview: 0 },
          { id: 26, qcId: 2008, name: 'Archana Singh', pendingInterview: 0 },
          { id: 27, qcId: 2009, name: 'Seema', pendingInterview: 0 },
          { id: 28, qcId: 2005, name: 'Meenu Trivedi', pendingInterview: 0 },
          { id: 29, qcId: 2010, name: 'Shashi Tiwari', pendingInterview: 0 },
          { id: 30, qcId: 2016, name: 'Dwipannita Sanyanal', pendingInterview: 0 },
          { id: 31, qcId: 2017, name: 'Rupa Mondal', pendingInterview: 0 },
          { id: 32, qcId: 2020, name: 'Pratishtha Mishra', pendingInterview: 0 },
          { id: 33, qcId: 1022, name: 'Priyanak Mondal', pendingInterview: 0 }
        ];
        setQcPendingData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDistributeQC = () => {
    console.log('Distribute QC');
  };

  const handleDistributeReCheckingQC = () => {
    console.log('Distribute Re-Checking QC');
  };

  const totalPages = Math.ceil(qcPendingData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcPendingData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading QC pending data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <Card className="mb-6">
            <div className="card-body text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
              <Text className="text-gray-600 mb-4">{error}</Text>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Pending QC Data
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Pending QC Data
                </Heading>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDistributeQC}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Distribute QC
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDistributeReCheckingQC}
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Distribute Re-Checking QC
                  </Button>
                </div>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Pending Interview</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((qcUser) => (
                      <tr key={qcUser.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{qcUser.qcId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{qcUser.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{qcUser.pendingInterview}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Total <span className="font-semibold">{qcPendingData.length}</span> items.
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={qcPendingData.length}
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
