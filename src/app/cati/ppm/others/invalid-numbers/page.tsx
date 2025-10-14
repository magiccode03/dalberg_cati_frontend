'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
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
  // Empty data for invalid numbers (no invalid numbers currently)
  const [invalidNumbersData] = useState<InvalidNumberData[]>([]);

  const handleMarkAsWrongNumber = (phoneNumber: string) => {
    console.log('Mark as wrong number:', phoneNumber);
  };

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
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">
              Invalid Numbers
            </Heading>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Code</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Call Try Date</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Phone Number</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Mark as Wrong Number</th>
              </tr>
            </thead>
            <tbody>
              {invalidNumbersData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                invalidNumbersData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.acName}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.acCode}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.telecaller}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.callTryDate}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.phoneNumber}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
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
      </Card>
    </Container>
  );
};

export default InvalidNumbersPage;
