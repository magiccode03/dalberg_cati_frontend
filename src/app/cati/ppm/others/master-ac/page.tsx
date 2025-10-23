'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Edit } from 'lucide-react';

// Interfaces
interface MasterACData {
  acCode: string;
  acName: string;
  dateOfElection: string;
  lastDateOfCati: string;
}

const MasterACPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  
  // Sample data for Master AC
  const [masterACData] = useState<MasterACData[]>([
    {
      acCode: '1',
      acName: 'Mekliganj',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
    {
      acCode: '2',
      acName: 'Mathabhanga',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
    {
      acCode: '3',
      acName: 'Cooch Behar Uttar',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
    {
      acCode: '4',
      acName: 'Cooch Behar Dakshin',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
    {
      acCode: '5',
      acName: 'Sitalkuchi',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
    {
      acCode: '6',
      acName: 'Sitai',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
    {
      acCode: '7',
      acName: 'Dinhata',
      dateOfElection: '2024-04-19',
      lastDateOfCati: '2024-04-17',
    },
  ]);

  const handleUpdateAC = (acCode: string) => {
    console.log('Update AC:', acCode);
  };

  // Pagination calculations
  const totalItems = masterACData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = masterACData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Master AC
        </Heading>
      </div>

      {/* Master AC Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Master AC
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
                  <th className="text-center">Ac Code</th>
                  <th className="text-center">Ac Name</th>
                  <th className="text-center">Date Of Election</th>
                  <th className="text-center">Last Date Of Cati</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.acCode}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{item.acCode}</td>
                    <td className="text-left">{item.acName}</td>
                    <td className="text-center">{item.dateOfElection}</td>
                    <td className="text-center">{item.lastDateOfCati}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleUpdateAC(item.acCode)}
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                        title="Update AC"
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
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

export default MasterACPage;
