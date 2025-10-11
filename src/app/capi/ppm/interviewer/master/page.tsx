'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Loader2, Eye, Search } from 'lucide-react';
import { apiService, InterviewMaster, InterviewMastersResponse } from '@/lib/api';

const MasterInterviewerContent = () => {
  const router = useRouter();
  const [interviewerData, setInterviewerData] = useState<InterviewMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    fullName: '',
    loginId: '',
  });

  // Fetch data from API with comprehensive filtering
  const fetchInterviewerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we need comprehensive filtering
      const needsComprehensiveFiltering = filters.fullName.trim() !== '' || filters.loginId.trim() !== '';
      
      if (needsComprehensiveFiltering) {
        // Fetch multiple pages to get comprehensive results
        await fetchAllDataForFiltering();
      } else {
        // Normal pagination
        await fetchPageData();
      }
    } catch (err) {
      console.error('Error fetching interviewer data:', err);
      setError('Error fetching interviewer data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data for a specific page
  const fetchPageData = async () => {
    const apiParams = {
      page: currentPage,
      limit: pageSize
    };
    
    console.log('Fetching page data:', apiParams);
    
    const response = await apiService.getInterviewMasters(apiParams);
    
    if (response.success && response.data) {
      setInterviewerData(response.data.data);
      setTotalCount(response.data.total);
      setTotalPages(response.data.total_pages);
    } else {
      console.error('API Error:', response);
      setError('Failed to fetch interviewer data');
    }
  };

  // Fetch all data for comprehensive filtering
  const fetchAllDataForFiltering = async () => {
    console.log('Fetching all data for filtering...');
    
    let allData: any[] = [];
    let currentPageNum = 1;
    let hasMoreData = true;
    const maxPages = 10; // Limit to prevent infinite loops
    
    while (hasMoreData && currentPageNum <= maxPages) {
      try {
        const apiParams = {
          page: currentPageNum,
          limit: pageSize
        };
        
        console.log(`Fetching page ${currentPageNum}:`, apiParams);
        
        const response = await apiService.getInterviewMasters(apiParams);
        
        if (response.success && response.data) {
          allData = [...allData, ...response.data.data];
          
          // Check if there are more pages
          hasMoreData = currentPageNum < response.data.total_pages;
          currentPageNum++;
        } else {
          hasMoreData = false;
        }
      } catch (err) {
        console.error(`Error fetching page ${currentPageNum}:`, err);
        hasMoreData = false;
      }
    }
    
    console.log(`Fetched ${allData.length} total records`);
    
    // Remove duplicates based on id
    const uniqueData = allData.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    
    console.log(`After removing duplicates: ${uniqueData.length} records`);
    
    // Apply filtering
    let filteredData = uniqueData;
    
    if (filters.fullName.trim() !== '') {
      filteredData = filteredData.filter(item => 
        item.fullname.toLowerCase().includes(filters.fullName.toLowerCase())
      );
    }
    
    if (filters.loginId.trim() !== '') {
      filteredData = filteredData.filter(item => 
        item.login_id.toLowerCase().includes(filters.loginId.toLowerCase())
      );
    }
    
    console.log(`Filtered to ${filteredData.length} records`);
    
    setInterviewerData(filteredData);
    setTotalCount(filteredData.length);
    setTotalPages(1); // Show all filtered results
  };

  useEffect(() => {
    fetchInterviewerData();
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchInterviewerData();
  };


  const handleViewACs = async (userId: string) => {
    try {
      setLoadingUserId(userId);
      // Fetch user data first to ensure the user exists and get their details
      const response = await apiService.getInterviewMasterForUpdate(userId);
      
      if (response.success && response.data) {
        // Navigate to the assigned AC page with user data
        router.push(`/capi/ppm/interviewer/master/assigned-ac?user_id=${userId}`);
      } else {
        console.error('Failed to fetch user data:', response);
        // Still navigate but show error on the target page
        router.push(`/capi/ppm/interviewer/master/assigned-ac?user_id=${userId}`);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Still navigate but show error on the target page
      router.push(`/capi/ppm/interviewer/master/assigned-ac?user_id=${userId}`);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading interviewer data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Title */}
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Master Interviewers
      </Heading>

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
                onClick={fetchInterviewerData}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search Form */}
      <Card className="mb-3">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">Full Name</Text>
              <Input
                type="text"
                placeholder="Search by full name"
                value={filters.fullName}
                onChange={(e) => handleFilterChange('fullName', e.target.value)}
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-2">Mobile Number</Text>
              <Input
                type="text"
                placeholder="Search by Mobile Number"
                value={filters.loginId}
                onChange={(e) => handleFilterChange('loginId', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card>
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">Master Interviewers List</Heading>
          </div>
        </div>

        {/* Data Summary */}
        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Total <strong>{totalCount}</strong> items.
          </Text>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <Table className="table table-bordered table-striped table-hover">
            <thead className="sticky-header bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Sr No</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Login Id</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Total Data Submit</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Assigned ACS</th>
              </tr>
            </thead>
            <tbody>
              {interviewerData.map((item, index) => (
                <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200 font-medium">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    {item.fullname}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 font-mono">
                    {item.login_id}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {item.total_data_submitted}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      onClick={() => handleViewACs(item.id.toString())}
                      disabled={loadingUserId === item.id.toString()}
                      title="View ACs"
                    >
                      {loadingUserId === item.id.toString() ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Empty State */}
        {interviewerData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Text className="text-gray-500 text-lg">
              No master interviewers found.
            </Text>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <PaginationStandard
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            className="justify-center"
          />
        </div>
      </Card>
    </Container>
  );
};

const MasterInterviewerPage = () => {
  return (
    <Suspense fallback={
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading...</Text>
          </div>
        </div>
      </Container>
    }>
      <MasterInterviewerContent />
    </Suspense>
  );
};

export default MasterInterviewerPage;
