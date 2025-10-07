'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Loader2, Eye } from 'lucide-react';
import { apiService } from '@/lib/api';

interface AssignedInterviewerData {
  user_id: number;
  fullname: string;
  login_id: string;
  assigned_ac: number[];
  agency_name: string;
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


  // Fetch data from API
  const fetchInterviewerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAssignedInterviewers();
      
      if (response.success && response.data) {
        setInterviewerData(response.data.data);
        setTotalCount(response.data.total);
        setTotalPages(Math.ceil(response.data.total / pageSize));
      } else {
        setError('Failed to fetch assigned interviewer data');
      }
    } catch (err) {
      console.error('Error fetching assigned interviewer data:', err);
      setError('Error fetching assigned interviewer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewerData();
  }, [currentPage]);

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

      <Card>
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4}>Assigned Interviewers List</Heading>
          </div>
        </div>

        {/* Data Summary */}
        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Showing{' '}
            <strong>
              {(currentPage-1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}
            </strong>{' '}
            of <strong>{totalCount}</strong> assigned interviewers.
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
                <tr key={item.user_id} className="hover:bg-gray-50">
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
                      {item.agency_name}
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