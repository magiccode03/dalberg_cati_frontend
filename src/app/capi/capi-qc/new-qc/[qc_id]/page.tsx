'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Phone, ArrowLeft, RefreshCw } from 'lucide-react';

interface InterviewData {
  server_id: number;
  ac_code: number;
  ac_name: string;
}

export default function NewQCPage() {
  const router = useRouter();
  const params = useParams();
  const qcId = params.qc_id as string;
  
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [qcUserData, setQcUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load QC user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('qc_user_data');
    
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setQcUserData(userData);
        
        // Verify the qc_id matches the URL parameter
        if (userData.qc_id.toString() !== qcId) {
          setError('QC User ID mismatch. Please login again.');
          return;
        }
        
        // Auto-fetch interviews when component mounts
        fetchInterviews(userData);
      } catch (err) {
        console.error('Error parsing QC data:', err);
        setError('Invalid QC user data. Please login again.');
      }
    } else {
      setError('No QC user data found. Please login first.');
    }
  }, [qcId]);

  const fetchInterviews = async (userData?: any, page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setCurrentPage(1);
      }
      setError('');
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Use passed userData or state
      const currentUserData = userData || qcUserData;
      if (!currentUserData) {
        setError('QC user data not found');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const apiUrl = `${apiBaseUrl}/api/capi/interviews/qc-user/${currentUserData.qc_id}?audio_qc_status=3&page=${page}&limit=10`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Transform API data to our interface
        const interviewList = data.data.map((item: any) => ({
          server_id: item.server_id,
          ac_code: item.ac_code,
          ac_name: item.ac_name
        }));
        
        if (append) {
          setInterviews(prev => [...prev, ...interviewList]);
        } else {
          setInterviews(interviewList);
        }
        
        // For now, disable hasMore since API doesn't return pagination info
        setTotalItems(interviewList.length);
        setHasMore(false);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Failed to fetch interviews');
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to fetch interviews. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleOpenForm = (serverId: number) => {
    // Navigate to QC form page with server_id
    router.push(`/capi/capi-qc/qc-form/${serverId}`);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setInterviews([]);
    fetchInterviews(undefined, 1, false);
  };

  const loadMoreInterviews = () => {
    if (hasMore && !loadingMore) {
      fetchInterviews(undefined, currentPage + 1, true);
    }
  };

  // Scroll-based lazy loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    // Throttle scroll events
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      if (isNearBottom && hasMore && !loadingMore) {
        loadMoreInterviews();
      }
    }, 100);
  };

  const handleBackToLogin = () => {
    // Clear QC user data and redirect to login
    localStorage.removeItem('qc_user_data');
    window.dispatchEvent(new Event('qcUserUpdated'));
    router.push('/capi/capi-qc/qc-auth');
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-3 md:space-y-4 px-3 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div>
              <Heading level={1} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                New QC
              </Heading>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                QC User ID: <span className="font-mono font-semibold">{qcId}</span>
              </p>
            </div>
          </div>
          {/* <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div> */}
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="p-3 md:p-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                    Error
                  </h3>
                  <p className="text-xs md:text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}


        {/* QC Interview Table */}
        <Card className="md:p-4">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">Server ID</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">AC Code</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">AC Name</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="text-red-500 dark:text-red-400 text-xs">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : interviews.length > 0 ? (
                  interviews.map((interview, index) => (
                    <tr key={interview.server_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <td className="px-2 md:px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-semibold">
                        {interview.server_id}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {interview.ac_code}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {interview.ac_name}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenForm(interview.server_id)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs"
                          title="Open QC Form"
                        >
                          <span>Form</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="flex flex-col items-center gap-1">
                        <Phone className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">No pending QC interviews found</span>
                      </div>
                    </td>
                  </tr>
                )}
                
                {/* Load More Row */}
                {interviews.length > 0 && hasMore && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <Button
                        variant="outline"
                        onClick={loadMoreInterviews}
                        disabled={loadingMore}
                        className="text-xs px-3 py-1.5"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                            Loading more...
                          </>
                        ) : (
                          `Load More (${interviews.length})`
                        )}
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Summary Card */}
        {/*interviews.length > 0 && qcUserData && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-green-900 dark:text-green-300">
                    QC Summary
                  </h3>
                  <p className="text-xs md:text-sm text-green-800 dark:text-green-400">
                    Total interviews available: <span className="font-bold">{interviews.length}</span>
                  </p>
                </div>
                <div className="flex flex-col sm:text-right gap-0.5">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">User:</span> {qcUserData.name}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">Phone:</span> <span className="font-mono">{qcUserData.mobile_number}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )*/}
      </div>
    </Container>
  );
}