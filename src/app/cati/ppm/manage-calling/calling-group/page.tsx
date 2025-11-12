'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Edit, Plus } from 'lucide-react';

interface TelecallingGroupData {
  id: number;
  groupName: string;
  sarvAccountType: string;
  assignedCallers: number;
  status: string;
}

const TelecallingGroupPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  
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

  // Pagination calculations
  const totalItems = telecallingGroupData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = telecallingGroupData.slice(startIndex, endIndex);

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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
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
                    <th className="text-center">Group Name</th>
                    <th className="text-center">Sarv Account Type</th>
                    <th className="text-center">Assigned Callers</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((group, index) => (
                    <tr key={group.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{group.groupName}</td>
                      <td className="text-left">{group.sarvAccountType}</td>
                      <td className="text-center">{group.assignedCallers}</td>
                      <td className="text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          group.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {group.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <Button variant="primary" size="sm" title="Edit Group" className="text-white bg-blue-500 hover:bg-blue-600 border-0">
                          <Edit className="w-4 h-4" />
                        </Button>
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
      </div>
    </Container>
  );
};

export default TelecallingGroupPage;
