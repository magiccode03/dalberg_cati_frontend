'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface InterviewDateWiseData {
  id: number;
  interviewDate: string;
  totalInterview: number;
  validInterview: number;
  rejectInterview: number;
  qcAssigned: number;
  qcPending: number;
  qcCompleted: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: Array<{
      interview_date: string;
      total_interview: number;
      valid_interview: number;
      reject_interview: number;
      qc_assigned: number;
      qc_pending: number;
      qc_completed: number;
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

export default function InterviewDateWisePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [interviewDateWiseData, setInterviewDateWiseData] = useState<InterviewDateWiseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to format date to YYYY-MM-DD format
  const formatDateToSimple = (dateString: string): string => {
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // If it contains time information, extract just the date part
      const datePart = dateString.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }
      
      // Try parsing as Date and extract date part
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      // If all parsing fails, try to extract the date pattern
      const match = dateString.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : dateString;
    }
  };

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): InterviewDateWiseData[] => {
    return apiData.map((item, index) => ({
      id: index + 1,
      interviewDate: formatDateToSimple(item.interview_date),
      totalInterview: item.total_interview,
      validInterview: item.valid_interview,
      rejectInterview: item.reject_interview,
      qcAssigned: item.qc_assigned,
      qcPending: item.qc_pending,
      qcCompleted: item.qc_completed
    }));
  };

  // Fetch data from API
  const fetchInterviewDateWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      console.log('Making API request to: /report/interview-date-wise');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });
      
      // Race between API call and timeout
      const response = await Promise.race([
        apiClient.get('/report/interview-date-wise'),
        timeoutPromise
      ]) as any;
      
      const data: APIResponse = response.data;
      
      console.log('API Response:', data);
      console.log('Response success:', data.success);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        const transformedData = transformAPIData(data.data.data);
        setInterviewDateWiseData(transformedData);
        setTotalCount(data.data.pagination?.totalCount || transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('Invalid API response structure or API error:', data.error);
        setError(data.error || 'Invalid response format from server');
        // Use fallback data
        const fallbackData: InterviewDateWiseData[] = [
          { id: 1, interviewDate: '2025-06-17', totalInterview: 1, validInterview: 0, rejectInterview: 0, qcAssigned: 0, qcPending: 0, qcCompleted: 0 },
          { id: 2, interviewDate: '2025-06-15', totalInterview: 6, validInterview: 0, rejectInterview: 6, qcAssigned: 0, qcPending: 0, qcCompleted: 0 },
          { id: 3, interviewDate: '2025-06-14', totalInterview: 17, validInterview: 0, rejectInterview: 17, qcAssigned: 9, qcPending: 0, qcCompleted: 9 },
        ];
        setInterviewDateWiseData(fallbackData);
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
      const fallbackData: InterviewDateWiseData[] = [
        { id: 1, interviewDate: '2025-06-17', totalInterview: 1, validInterview: 0, rejectInterview: 0, qcAssigned: 0, qcPending: 0, qcCompleted: 0 },
        { id: 2, interviewDate: '2025-06-15', totalInterview: 6, validInterview: 0, rejectInterview: 6, qcAssigned: 0, qcPending: 0, qcCompleted: 0 },
        { id: 3, interviewDate: '2025-06-14', totalInterview: 17, validInterview: 0, rejectInterview: 17, qcAssigned: 9, qcPending: 0, qcCompleted: 9 },
        { id: 4, interviewDate: '2025-06-13', totalInterview: 28, validInterview: 0, rejectInterview: 28, qcAssigned: 15, qcPending: 0, qcCompleted: 15 },
        { id: 5, interviewDate: '2025-06-12', totalInterview: 1042, validInterview: 359, rejectInterview: 681, qcAssigned: 863, qcPending: 0, qcCompleted: 863 },
        { id: 6, interviewDate: '2025-06-11', totalInterview: 1426, validInterview: 561, rejectInterview: 863, qcAssigned: 1179, qcPending: 0, qcCompleted: 1179 },
        { id: 7, interviewDate: '2025-06-10', totalInterview: 1547, validInterview: 653, rejectInterview: 884, qcAssigned: 1247, qcPending: 0, qcCompleted: 1247 },
        { id: 8, interviewDate: '2025-06-09', totalInterview: 963, validInterview: 447, rejectInterview: 515, qcAssigned: 749, qcPending: 0, qcCompleted: 749 },
        { id: 9, interviewDate: '2025-06-08', totalInterview: 1096, validInterview: 323, rejectInterview: 766, qcAssigned: 829, qcPending: 0, qcCompleted: 829 },
        { id: 10, interviewDate: '2025-06-07', totalInterview: 1217, validInterview: 357, rejectInterview: 854, qcAssigned: 955, qcPending: 0, qcCompleted: 955 },
        { id: 11, interviewDate: '2025-06-06', totalInterview: 756, validInterview: 245, rejectInterview: 511, qcAssigned: 623, qcPending: 0, qcCompleted: 623 },
      ];
      setInterviewDateWiseData(fallbackData);
      setTotalCount(fallbackData.length);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInterviewDateWiseData();
  }, []);

  const handleDownload = () => {
    console.log('Download report');
  };

  const handleDateClick = (date: string) => {
    console.log('Navigate to interview details for date:', date);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = interviewDateWiseData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Interview Date Wise Report
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
            <Text className="ml-2 text-gray-600">Loading interview date wise report...</Text>
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
                  onClick={fetchInterviewDateWiseData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="w-full">
          <Card>
            <div className="py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    Interview Date Wise Report
                  </Heading>
                </div>
                <div className="text-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interview Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Valid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Assigned</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Pending</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Completed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleDateClick(data.interviewDate)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium font-mono"
                          >
                            {data.interviewDate}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.validInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcAssigned.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcPending.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcCompleted.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> results
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
