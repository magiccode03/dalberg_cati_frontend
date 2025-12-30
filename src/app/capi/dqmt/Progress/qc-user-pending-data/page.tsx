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
import { apiService } from '@/lib/api';

interface QCPendingData {
  qc_id: number;
  name: string;
  pending_interview: number;
}

export default function QCUserPendingDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qcPendingData, setQcPendingData] = useState<QCPendingData[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch QC User Pending Data from API
  const fetchQCPendingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getQCUserPendingData();
      
      if (response.success && response.data) {
        setQcPendingData(response.data.data);
        setTotalCount(response.data.pagination.totalCount);
      } else {
        setError('Failed to fetch QC user pending data');
      }
    } catch (err) {
      console.error('Error fetching QC user pending data:', err);
      setError('Error fetching QC user pending data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQCPendingData();
  }, []);

  const handleDistributeQC = () => {
    console.log('Distribute QC');
  };

  const handleDistributeReCheckingQC = () => {
    console.log('Distribute Re-Checking QC');
  };


  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcPendingData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC User - Pending Data
            </Heading>
          </div>
        </div>

        {/* Main Content */}
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending QC Data
              </Heading>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDistributeQC}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Distribute QC
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDistributeReCheckingQC}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Distribute Re-Checking QC
              </Button>
            </div>
          </div>
          
          <div className="bg-white">
            <div className="mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{totalCount.toLocaleString()}</strong> items.
              </Text>
            </div>
            
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">QC ID</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Pending Interview</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((qcUser, index) => (
                    <tr key={qcUser.qc_id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center font-mono font-semibold">{qcUser.qc_id}</td>
                      <td className="text-left">{qcUser.name}</td>
                      <td className="text-center">{qcUser.pending_interview.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

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
          </div>
        </Card>
    </Container>
  );
}
