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
  const [pageSize] = useState(25);
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
        <div className="summary mb-4">
          <Text className="text-sm text-gray-600">
            Total <b>{totalCount}</b> items.
          </Text>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
            <thead className="table-light bg-gray-50">
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">ID</th>
                <th className="text-center">Full Name</th>
                <th className="text-center">AC Codes</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviewerData.map((item, index) => (
                <tr key={item.user_id}>
                  <td className="text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="text-center font-mono">{item.login_id}</td>
                  <td className="text-left">{item.fullname}</td>
                  <td className="text-center">{item.assigned_ac.join(', ')}</td>
                  <td className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                      onClick={() => router.push(`/capi/ppmt/interviewer/assigned/update?user_id=${item.user_id}`)}
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
