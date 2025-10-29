'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Phone, ArrowLeft, RefreshCw } from 'lucide-react';

interface DataEntryItem {
  id: number;
  data_entry_user_id: number;
  ac_code: number;
  ac_name: string;
  phone: string;
  status: number;
  data_entry_status: number;
  assign_date: string;
  updated_at: number;
}

export default function DataEntryListPage() {
  const router = useRouter();
  const params = useParams();
  const dataEntryUserId = params.data_entry_user_id as string;
  
  const [dataEntries, setDataEntries] = useState<DataEntryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [dataEntryUserData, setDataEntryUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load data entry user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('data_entry_user_data');
    
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setDataEntryUserData(userData);
        
        // Debug logging
        console.log('URL parameter dataEntryUserId:', dataEntryUserId);
        console.log('User data from localStorage:', userData);
        console.log('User data id:', userData.data_entry_user_id);
        
        // Verify the id matches the URL parameter
        if (userData.data_entry_user_id.toString() !== dataEntryUserId) {
          console.log('ID mismatch - URL:', dataEntryUserId, 'LocalStorage:', userData.data_entry_user_id);
          setError('Data Entry User ID mismatch. Please login again.');
          return;
        }
        
        // Auto-fetch data entries when component mounts
        fetchDataEntries(userData);
      } catch (err) {
        console.error('Error parsing data entry user data:', err);
        setError('Invalid data entry user data. Please login again.');
      }
    } else {
      setError('No data entry user data found. Please login first.');
    }
  }, [dataEntryUserId]);

  const fetchDataEntries = async (userData?: any, page: number = 1, append: boolean = false) => {
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
      const currentUserData = userData || dataEntryUserData;
      if (!currentUserData) {
        setError('Data entry user data not found');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const apiUrl = `${apiBaseUrl}/api/cati/qc/data-entry-list?qc_teleform_user_id=${currentUserData.data_entry_user_id}&page=${page}&limit=20`;

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
      
      if (data.success && data.data && Array.isArray(data.data.interviews)) {
        // Transform API data to our interface
        const dataEntryList = data.data.interviews.map((item: any) => ({
          id: item.id,
          data_entry_user_id: item.data_entry_user_id,
          ac_code: item.ac_code,
          ac_name: item.ac_name,
          phone: item.phone,
          status: item.status,
          data_entry_status: item.data_entry_status,
          assign_date: item.assign_date,
          updated_at: item.updated_at
        }));
        
        if (append) {
          setDataEntries(prev => [...prev, ...dataEntryList]);
        } else {
          setDataEntries(dataEntryList);
        }
        
        // Handle pagination from API response
        if (data.data.pagination) {
          const pagination = data.data.pagination;
          setTotalItems(pagination.total_count);
          setHasMore(pagination.has_next);
          setCurrentPage(pagination.current_page);
        } else {
          setTotalItems(dataEntryList.length);
          setHasMore(false);
          setCurrentPage(page);
        }
      } else {
        setError(data.message || 'Failed to fetch data entries');
      }
    } catch (err) {
      console.error('Error fetching data entries:', err);
      setError('Failed to fetch data entries. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleOpenForm = (dataEntryId: number, acCode: number) => {
    // Navigate to data entry form page with data entry id and ac_code
    router.push(`/cati/ss/tele-form-data-entry/${dataEntryId}/${acCode}`);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setDataEntries([]);
    fetchDataEntries(undefined, 1, false);
  };

  const loadMoreDataEntries = () => {
    if (hasMore && !loadingMore) {
      fetchDataEntries(undefined, currentPage + 1, true);
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
        loadMoreDataEntries();
      }
    }, 100);
  };

  const handleBackToLogin = () => {
    // Clear data entry user data and redirect to start form filling
    localStorage.removeItem('data_entry_user_data');
    window.dispatchEvent(new Event('dataEntryUserUpdated'));
    router.push('/cati/data-entry');
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-3 md:space-y-4 px-3 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div>
              <Heading level={1} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Data Entry List
              </Heading>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Data Entry User ID: <span className="font-mono font-semibold">{dataEntryUserId}</span>
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


        {/* Data Entry Table */}
        <Card className="md:p-4">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">ID</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">AC Code</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left text-sm">AC Name</th>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="text-red-500 dark:text-red-400 text-xs">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : dataEntries.length > 0 ? (
                  dataEntries.map((dataEntry, index) => (
                    <tr key={dataEntry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <td className="px-2 md:px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-semibold">
                        {dataEntry.id}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {dataEntry.ac_code}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {dataEntry.ac_name}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenForm(dataEntry.id, dataEntry.ac_code)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs"
                          title="Open Data Entry Form"
                        >
                          <span>Form</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="flex flex-col items-center gap-1">
                        <Phone className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">No data entry items found</span>
                      </div>
                    </td>
                  </tr>
                )}
                
                {/* Load More Row */}
                {dataEntries.length > 0 && hasMore && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <Button
                        variant="outline"
                        onClick={loadMoreDataEntries}
                        disabled={loadingMore}
                        className="text-xs px-3 py-1.5"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                            Loading more...
                          </>
                        ) : (
                          `Load More (${dataEntries.length})`
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
        {/*dataEntries.length > 0 && dataEntryUserData && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-green-900 dark:text-green-300">
                    Data Entry Summary
                  </h3>
                  <p className="text-xs md:text-sm text-green-800 dark:text-green-400">
                    Total data entries available: <span className="font-bold">{dataEntries.length}</span>
                  </p>
                </div>
                <div className="flex flex-col sm:text-right gap-0.5">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">User:</span> {dataEntryUserData.name}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">Phone:</span> <span className="font-mono">{dataEntryUserData.mobile_number}</span>
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
