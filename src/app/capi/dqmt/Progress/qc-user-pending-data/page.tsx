'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { RefreshCw, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface QCPendingData {
  qc_id: number;
  name: string;
  pending_interview: number;
}

export default function QCUserPendingDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
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
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <Text>Loading QC user pending data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-6 text-center">
              <Text className="text-red-600 mb-4">{error}</Text>
              <Button onClick={() => fetchQCPendingData()} variant="primary">
                Try Again
              </Button>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
              QC User - Pending Data
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    Pending QC Data
                  </Heading>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDistributeQC}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Distribute QC
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDistributeReCheckingQC}
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Distribute Re-Checking QC
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
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Pending Interview</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((qcUser, index) => (
                      <tr key={qcUser.qc_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{qcUser.qc_id}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{qcUser.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{qcUser.pending_interview}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> items.
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
