'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import { Edit } from 'lucide-react';

// Interfaces
interface MasterACData {
  acCode: string;
  acName: string;
  dateOfElection: string;
  lastDateOfCati: string;
}

const MasterACPage = () => {
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
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">
              Master AC
            </Heading>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Total <span className="font-semibold">{masterACData.length}</span> items.
          </Text>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Ac Code</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Ac Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Date Of Election</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Last Date Of Cati</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Update</th>
              </tr>
            </thead>
            <tbody>
              {masterACData.map((item, index) => (
                <tr key={item.acCode} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{item.acCode}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.acName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.dateOfElection}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.lastDateOfCati}</td>
                  <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                    <button
                      onClick={() => handleUpdateAC(item.acCode)}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
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
      </Card>
    </Container>
  );
};

export default MasterACPage;
