'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Loader2 } from 'lucide-react';

interface MasterInterviewerData {
  id: number;
  srNo: number;
  fullName: string;
  loginId: string;
  totalDataSubmit: number;
  assignedACs: string;
}

const MasterInterviewerContent = () => {
  const [interviewerData, setInterviewerData] = useState<MasterInterviewerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sample data for the table
  const sampleData: MasterInterviewerData[] = [
    {
      id: 1,
      srNo: 1,
      fullName: 'Rajesh Kumar Singh',
      loginId: 'INT001',
      totalDataSubmit: 245,
      assignedACs: 'AC-01, AC-05, AC-12'
    },
    {
      id: 2,
      srNo: 2,
      fullName: 'Priya Sharma',
      loginId: 'INT002',
      totalDataSubmit: 189,
      assignedACs: 'AC-03, AC-07, AC-15'
    },
    {
      id: 3,
      srNo: 3,
      fullName: 'Amit Verma',
      loginId: 'INT003',
      totalDataSubmit: 312,
      assignedACs: 'AC-02, AC-09'
    },
    {
      id: 4,
      srNo: 4,
      fullName: 'Sunita Devi',
      loginId: 'INT004',
      totalDataSubmit: 156,
      assignedACs: 'AC-04, AC-08, AC-11, AC-16'
    },
    {
      id: 5,
      srNo: 5,
      fullName: 'Vikash Kumar',
      loginId: 'INT005',
      totalDataSubmit: 278,
      assignedACs: 'AC-06, AC-10, AC-13'
    },
    {
      id: 6,
      srNo: 6,
      fullName: 'Reena Singh',
      loginId: 'INT006',
      totalDataSubmit: 201,
      assignedACs: 'AC-14, AC-17'
    },
    {
      id: 7,
      srNo: 7,
      fullName: 'Arjun Yadav',
      loginId: 'INT007',
      totalDataSubmit: 334,
      assignedACs: 'AC-01, AC-03, AC-05, AC-07'
    },
    {
      id: 8,
      srNo: 8,
      fullName: 'Meera Joshi',
      loginId: 'INT008',
      totalDataSubmit: 167,
      assignedACs: 'AC-09, AC-12, AC-15'
    },
    {
      id: 9,
      srNo: 9,
      fullName: 'Ravi Mishra',
      loginId: 'INT009',
      totalDataSubmit: 289,
      assignedACs: 'AC-02, AC-08, AC-11'
    },
    {
      id: 10,
      srNo: 10,
      fullName: 'Kavita Gupta',
      loginId: 'INT010',
      totalDataSubmit: 223,
      assignedACs: 'AC-04, AC-06, AC-10, AC-13, AC-16'
    },
  ];

  // Simulate API call
  const fetchInterviewerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Paginate the sample data
      const startIndex = (currentPage-1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = sampleData.slice(startIndex, endIndex);
      
      setInterviewerData(paginatedData);
      setTotalCount(sampleData.length);
      setTotalPages(Math.ceil(sampleData.length / pageSize));
    } catch (err) {
      console.error('Error fetching interviewer data:', err);
      setError('Failed to load interviewer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewerData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
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
      <Heading level={3} className="mb-6 text-gray-800">
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
                onClick={handleRefresh}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4}>Master Interviewers List</Heading>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </div>

        {/* Data Summary */}
        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Showing{' '}
            <strong>
              {(currentPage-1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}
            </strong>{' '}
            of <strong>{totalCount}</strong> master interviewers.
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
              {interviewerData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200 font-medium">
                    {item.srNo}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    {item.fullName}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 font-mono">
                    {item.loginId}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {item.totalDataSubmit}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm"
                      onClick={() => console.log(`View ACs for ${item.fullName}`)}
                    >
                      View ACS
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
