'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { X } from 'lucide-react';

// Interfaces
interface InvalidNumberData {
  id: number;
  acName: string;
  acCode: string;
  telecaller: string;
  callTryDate: string;
  phoneNumber: string;
}

const InvalidNumbersPage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Empty data for invalid numbers (no invalid numbers currently)
  const [invalidNumbersData] = useState<InvalidNumberData[]>([]);

  const handleMarkAsWrongNumber = (phoneNumber: string) => {
    console.log('Mark as wrong number:', phoneNumber);
  };

  // Pagination calculations
  const totalItems = invalidNumbersData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = invalidNumbersData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Invalid Numbers
        </Heading>
      </div>

      {/* Invalid Numbers Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Invalid Numbers
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">AC Name</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">Telecaller</th>
                  <th className="text-center">Call Try Date</th>
                  <th className="text-center">Phone Number</th>
                  <th className="text-center">Mark as Wrong Number</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{item.acName}</td>
                      <td className="text-center">{item.acCode}</td>
                      <td className="text-left">{item.telecaller}</td>
                      <td className="text-center">{item.callTryDate}</td>
                      <td className="text-center">{item.phoneNumber}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleMarkAsWrongNumber(item.phoneNumber)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Mark as Wrong Number
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default InvalidNumbersPage;
