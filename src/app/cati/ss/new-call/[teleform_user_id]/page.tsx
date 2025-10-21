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
  id: number;
  phone: string;
  ac_code: number;
  ac_name: string;
  ac_district_name?: string;
  ac_zone_name?: string;
  ac_mla_name?: string;
  ac_electorate?: number;
  district_name?: string;
  zone_name?: string;
  mla_name?: string;
  electorate?: number;
  status: number;
  call_attempt: number;
  call_received: number;
}

export default function NewCallPage() {
  const router = useRouter();
  const params = useParams();
  const teleformUserId = params.teleform_user_id as string;
  
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [teleformUserData, setTeleformUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load teleform user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('teleform_user_data');
    
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setTeleformUserData(userData);
        
        // Verify the teleform_user_id matches the URL parameter
        if (userData.teleform_user_id.toString() !== teleformUserId) {
          setError('Teleform User ID mismatch. Please login again.');
          return;
        }
        
        // Auto-fetch interviews when component mounts
        fetchInterviews(userData);
      } catch (err) {
        console.error('Error parsing teleform data:', err);
        setError('Invalid teleform user data. Please login again.');
      }
    } else {
      setError('No teleform user data found. Please login first.');
    }
  }, [teleformUserId]);

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
      const currentUserData = userData || teleformUserData;
      if (!currentUserData) {
        setError('Teleform user data not found');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const apiUrl = `${apiBaseUrl}/api/cati/interviews/teleform-user/${currentUserData.teleform_user_id}?status=0&page=${page}&limit=10`;

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
      
      if (data.success && data.data?.data) {
        // Transform API data to our interface
        const interviewList = data.data.data.map((item: any) => ({
          id: item.id,
          phone: item.phone,
          ac_code: item.ac_code,
          ac_name: item.ac_name,
          // Support both naming conventions from API
          ac_district_name: item.ac_district_name || item.district_name,
          ac_zone_name: item.ac_zone_name || item.zone_name,
          ac_mla_name: item.ac_mla_name || item.mla_name,
          ac_electorate: item.ac_electorate || item.electorate,
          district_name: item.district_name,
          zone_name: item.zone_name,
          mla_name: item.mla_name,
          electorate: item.electorate,
          status: item.status,
          call_attempt: item.call_attempt,
          call_received: item.call_received
        }));
        
        if (append) {
          setInterviews(prev => [...prev, ...interviewList]);
        } else {
          setInterviews(interviewList);
        }
        
        // Update pagination info
        const pagination = data.data?.pagination || {};
        setTotalItems(pagination.total || interviewList.length);
        setHasMore(pagination.page < pagination.totalPages);
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

  const handleConnectToCall = async (interviewId: number, phoneNumber: string, acCode: number) => {
    try {
      console.log('Initiating call:', { interviewId, phoneNumber });
      
      if (!teleformUserData?.mobile_number) {
        alert('User phone number not found');
        return;
      }
      
      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Authentication required');
        return;
      }
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Call click-to-call API
      const callResponse = await fetch(`${apiBaseUrl}/api/click-to-call/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: teleformUserData.mobile_number,
          to: phoneNumber
        })
      });
      
      const callData = await callResponse.json();
      
      if (callData.success) {
        console.log('Call initiated successfully:', callData);
        
        // Update interview status to 1 and include callId from click-to-call response
        const updateResponse = await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 1,
            call_attempt: 1,
            callid: callData.data.callId // Include callid from click-to-call response
          })
        });
        
        const updateData = await updateResponse.json();
        
        if (updateData.success) {
          console.log('Interview status updated successfully');
        } else {
          console.error('Failed to update interview status:', updateData);
        }
        
        // Navigate to tele-form page with interview ID and AC code after successful call initiation
        router.push(`/cati/ss/tele-form/${interviewId}/${acCode}`);
      } else {
        console.error('Call initiation failed:', callData);
        alert(`Call initiation failed: ${callData.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call. Please try again.');
    }
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
    // Clear teleform user data and redirect to login
    localStorage.removeItem('teleform_user_data');
    router.push('/cati/ss/start-form-filling');
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-3 md:space-y-4 px-3 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div>
              <Heading level={1} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                New Call
              </Heading>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Teleform User ID: <span className="font-mono font-semibold">{teleformUserId}</span>
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


        {/* New Call Table */}
        <Card className="md:p-4">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="hidden md:table-cell px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">#</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">Server ID</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">AC Code</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">AC Name</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">District</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="md:hidden text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
                      </div>
                    </td>
                    <td colSpan={6} className="hidden md:table-cell text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={2} className="md:hidden text-center py-4">
                      <div className="text-red-500 dark:text-red-400 text-xs">
                        {error}
                      </div>
                    </td>
                    <td colSpan={6} className="hidden md:table-cell text-center py-4">
                      <div className="text-red-500 dark:text-red-400 text-xs">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : interviews.length > 0 ? (
                  interviews.map((interview, index) => (
                    <tr key={interview.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <td className="hidden md:table-cell px-2 md:px-4 py-3 text-xs text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-2 md:px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                            SRV00{interview.id}
                          </span>
                          {/* Mobile-only additional info */}
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                            <div>AC: {interview.ac_code} - {interview.ac_name}</div>
                            <div>District: {interview.ac_district_name || interview.district_name || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-4 py-3 text-xs text-gray-900 dark:text-white">
                        {interview.ac_code}
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-4 py-3 text-xs text-gray-900 dark:text-white">
                        {interview.ac_name}
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-4 py-3 text-xs text-gray-900 dark:text-white">
                        {interview.ac_district_name || interview.district_name || '-'}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConnectToCall(interview.id, interview.phone, interview.ac_code)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1.5 text-xs"
                          title="Connect to Call"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Call</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="md:hidden text-center py-4">
                      <div className="flex flex-col items-center gap-1">
                        <Phone className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">No interviews found</span>
                      </div>
                    </td>
                    <td colSpan={6} className="hidden md:table-cell text-center py-4">
                      <div className="flex flex-col items-center gap-1">
                        <Phone className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">No interviews found</span>
                      </div>
                    </td>
                  </tr>
                )}
                
                {/* Load More Row */}
                {interviews.length > 0 && hasMore && (
                  <tr>
                    <td colSpan={2} className="md:hidden text-center py-4">
                      <Button
                        variant="outline"
                        onClick={loadMoreInterviews}
                        disabled={loadingMore}
                        className="text-xs px-3 py-1.5"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                            Loading...
                          </>
                        ) : (
                          `Load More (${interviews.length}/${totalItems})`
                        )}
                      </Button>
                    </td>
                    <td colSpan={6} className="hidden md:table-cell text-center py-4">
                      <Button
                        variant="outline"
                        onClick={loadMoreInterviews}
                        disabled={loadingMore}
                        className="text-xs px-3 py-1.5"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                            Loading more interviews...
                          </>
                        ) : (
                          `Load More Interviews (${interviews.length}/${totalItems})`
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
        {/*interviews.length > 0 && teleformUserData && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-green-900 dark:text-green-300">
                    Interview Summary
                  </h3>
                  <p className="text-xs md:text-sm text-green-800 dark:text-green-400">
                    Total interviews available: <span className="font-bold">{interviews.length}</span>
                  </p>
                </div>
                <div className="flex flex-col sm:text-right gap-0.5">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">User:</span> {teleformUserData.name}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">Phone:</span> <span className="font-mono">{teleformUserData.mobile_number}</span>
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