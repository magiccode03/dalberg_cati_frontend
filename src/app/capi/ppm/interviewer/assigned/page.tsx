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
import { apiService } from '@/lib/api';

interface AssignedInterviewerData {
  user_id: number;
  fullname: string;
  login_id: string;
  assigned_ac: number[];
  agency_name?: string; // Make optional since it might not be in all responses
}

interface AssignedInterviewersResponse {
  total: number;
  data: AssignedInterviewerData[];
}

const AssignedInterviewerContent = () => {
  const router = useRouter();
  const [interviewerData, setInterviewerData] = useState<AssignedInterviewerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    id: '',
    fullName: '',
    zonalManager: '',
  });


  // Fetch data from API with comprehensive filtering
  const fetchInterviewerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we need comprehensive filtering
      const needsComprehensiveFiltering = filters.id.trim() !== '' || filters.fullName.trim() !== '' || filters.zonalManager.trim() !== '';
      
      if (needsComprehensiveFiltering) {
        // Fetch multiple pages to get comprehensive results
        await fetchAllDataForFiltering();
      } else {
        // Normal pagination
        await fetchPageData();
      }
    } catch (err) {
      console.error('Error fetching assigned interviewer data:', err);
      setError('Error fetching assigned interviewer data');
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
    
    const response = await apiService.getAssignedInterviewers(apiParams);
    
    if (response.success && response.data) {
      setInterviewerData(response.data.data);
      setTotalCount(response.data.total);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } else {
      console.error('API Error:', response);
      setError('Failed to fetch assigned interviewer data');
    }
  };

  // Fetch all data for comprehensive filtering
  const fetchAllDataForFiltering = async () => {
    console.log('Fetching all data for filtering...');
    
    let allData: AssignedInterviewerData[] = [];
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
        
        const response = await apiService.getAssignedInterviewers(apiParams);
        
        if (response.success && response.data) {
          allData = [...allData, ...response.data.data];
          
          // Check if there are more pages
          hasMoreData = currentPageNum < Math.ceil(response.data.total / pageSize);
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
    
    // Remove duplicates based on user_id
    const uniqueData = allData.filter((item, index, self) => 
      index === self.findIndex(t => t.user_id === item.user_id)
    );
    
    console.log(`After removing duplicates: ${uniqueData.length} records`);
    
    // Apply filtering
    let filteredData = uniqueData;
    
    if (filters.id.trim() !== '') {
      filteredData = filteredData.filter(item => 
        item.login_id.toLowerCase().includes(filters.id.toLowerCase())
      );
    }
    
    if (filters.fullName.trim() !== '') {
      filteredData = filteredData.filter(item => 
        item.fullname.toLowerCase().includes(filters.fullName.toLowerCase())
      );
    }
    
    if (filters.zonalManager.trim() !== '') {
      filteredData = filteredData.filter(item => 
        (item.agency_name || '').toLowerCase().includes(filters.zonalManager.toLowerCase())
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
        Assigned Interviewers
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
            </div>
          </div>
        </Card>
      )}

      {/* Search Form */}
      <Card className="mb-3">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">Mobile Number</Text>
              <Input
                type="text"
                placeholder="Search by Mobile Number"
                value={filters.id}
                onChange={(e) => handleFilterChange('id', e.target.value)}
              />
            </div>
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
              <Text className="text-sm font-medium mb-2">Zonal Manager</Text>
              <Input
                type="text"
                placeholder="Search by zonal manager"
                value={filters.zonalManager}
                onChange={(e) => handleFilterChange('zonalManager', e.target.value)}
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
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Assigned Interviewers List
            </Heading>
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
                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Zonal Manager</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Assigned ACS</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviewerData.map((item, index) => (
                <tr key={`${item.user_id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200 font-medium">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 font-mono">
                    {item.login_id}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className="text-gray-800">
                      {item.fullname}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className="text-gray-700">
                      {item.agency_name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className="text-gray-700">
                      {item.assigned_ac.join(', ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      onClick={() => router.push(`/capi/ppm/interviewer/assigned/update?user_id=${item.user_id}`)}
                      title="Update Assigned ACs"
                    >
                      <Eye className="h-4 w-4" />
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
              No assigned interviewers found.
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

const AssignedInterviewerPage = () => {
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
      <AssignedInterviewerContent />
    </Suspense>
  );
};

export default AssignedInterviewerPage;