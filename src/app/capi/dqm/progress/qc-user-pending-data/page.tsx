'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { RefreshCw } from 'lucide-react';

interface QCPendingData {
  id: number;
  qcId: number;
  name: string;
  pendingInterview: number;
}

export default function QCUserPendingDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data based on the provided HTML
  const qcPendingData: QCPendingData[] = [
    { id: 1, qcId: 109, name: 'Kundan', pendingInterview: 0 },
    { id: 2, qcId: 117, name: 'Riya', pendingInterview: 0 },
    { id: 3, qcId: 119, name: 'Mohd Usman', pendingInterview: 0 },
    { id: 4, qcId: 120, name: 'Supriya', pendingInterview: 0 },
    { id: 5, qcId: 121, name: 'Ashifa', pendingInterview: 0 },
    { id: 6, qcId: 122, name: 'Rama', pendingInterview: 0 },
    { id: 7, qcId: 135, name: 'Parveen Sharma', pendingInterview: 0 },
    { id: 8, qcId: 128, name: 'Kumudmessey', pendingInterview: 0 },
    { id: 9, qcId: 127, name: 'Faizal Saifi', pendingInterview: 0 },
    { id: 10, qcId: 130, name: 'Himanshi', pendingInterview: 0 },
    { id: 11, qcId: 136, name: 'Muskan', pendingInterview: 0 },
    { id: 12, qcId: 137, name: 'Muskan Siddiqui', pendingInterview: 0 },
    { id: 13, qcId: 139, name: 'Himanshi-2', pendingInterview: 0 },
    { id: 14, qcId: 140, name: 'Priyanka', pendingInterview: 0 },
    { id: 15, qcId: 2001, name: 'Vijay Sharma', pendingInterview: 0 },
    { id: 16, qcId: 2002, name: 'Mehul Kapoor', pendingInterview: 0 },
    { id: 17, qcId: 2003, name: 'Nishi', pendingInterview: 0 },
    { id: 18, qcId: 2004, name: 'Asha Chaurasiya', pendingInterview: 0 },
    { id: 19, qcId: 2011, name: 'Sucharita Das', pendingInterview: 0 },
    { id: 20, qcId: 2012, name: 'Srabani Mondal', pendingInterview: 0 },
    { id: 21, qcId: 2013, name: 'Kiran Naskar', pendingInterview: 0 },
    { id: 22, qcId: 2014, name: 'Mousimi Parida', pendingInterview: 0 },
    { id: 23, qcId: 2015, name: 'Rohini Das', pendingInterview: 0 },
    { id: 24, qcId: 2006, name: 'Deepanjali Trivedi', pendingInterview: 0 },
    { id: 25, qcId: 2007, name: 'Puja Pandey', pendingInterview: 0 },
    { id: 26, qcId: 2008, name: 'Archana Singh', pendingInterview: 0 },
    { id: 27, qcId: 2009, name: 'Seema', pendingInterview: 0 },
    { id: 28, qcId: 2005, name: 'Meenu Trivedi', pendingInterview: 0 },
    { id: 29, qcId: 2010, name: 'Shashi Tiwari', pendingInterview: 0 },
    { id: 30, qcId: 2016, name: 'Dwipannita Sanyanal', pendingInterview: 0 },
    { id: 31, qcId: 2017, name: 'Rupa Mondal', pendingInterview: 0 },
    { id: 32, qcId: 2020, name: 'Pratishtha Mishra', pendingInterview: 0 },
    { id: 33, qcId: 1022, name: 'Priyanak Mondal', pendingInterview: 0 },
  ];

  const handleDistributeQC = () => {
    console.log('Distribute QC');
  };

  const handleDistributeReCheckingQC = () => {
    console.log('Distribute Re-Checking QC');
  };

  const totalPages = Math.ceil(qcPendingData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcPendingData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Pending QC Data
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
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Pending QC Data
                </Heading>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Pending Interview</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((qcUser) => (
                      <tr key={qcUser.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{qcUser.qcId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{qcUser.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{qcUser.pendingInterview}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Total <span className="font-semibold">{qcPendingData.length}</span> items.
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={qcPendingData.length}
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
