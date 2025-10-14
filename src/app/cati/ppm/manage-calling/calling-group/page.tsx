'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Edit, Plus } from 'lucide-react';

interface TelecallingGroupData {
  id: number;
  groupName: string;
  sarvAccountType: string;
  assignedCallers: number;
  status: string;
}

const TelecallingGroupPage: React.FC = () => {
  // Sample data
  const telecallingGroupData: TelecallingGroupData[] = [
    {
      id: 1,
      groupName: 'Group 1',
      sarvAccountType: '2',
      assignedCallers: 0,
      status: 'Inactive',
    },
    {
      id: 2,
      groupName: 'Group 2',
      sarvAccountType: '7891544544@parken.com(3)',
      assignedCallers: 273,
      status: 'Active',
    },
  ];

  const totalItems = telecallingGroupData.length;

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center">
          <div>
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
              Calling Group
            </Heading>
          </div>
          <div className="text-sm text-gray-500">
            {/* Additional header content if needed */}
          </div>
        </div>

        {/* Data Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900">
                Calling Group
              </Heading>
            </div>
            <div className="flex space-x-2">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add New Group
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Group Name</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Sarv Account Type</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Assigned Callers</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    Actions <Edit className="inline w-4 h-4 ml-1" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {telecallingGroupData.map((group, index) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{group.groupName}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{group.sarvAccountType}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{group.assignedCallers}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        group.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                      <Button variant="primary" size="sm" title="Edit Group">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Total <span className="font-semibold">{totalItems}</span> items.
            </div>
            <div>
              {/* Pagination can be added here if needed */}
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default TelecallingGroupPage;
