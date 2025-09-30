'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';

const ACListPage = () => {
  const [filters, setFilters] = useState({
    agencyId: '',
    acCode: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Sample data for dropdowns
  const agencyOptions = [
    { value: '', label: 'Select State Teams' },
    { value: '1', label: 'Kadence' },
    { value: '2', label: 'Chandan' },
    { value: '3', label: 'Rohit' },
    { value: '4', label: 'Parbhat' },
    { value: '5', label: 'Navin' },
    { value: '6', label: 'Aeon' },
    { value: '7', label: 'Abhinav' },
    { value: '8', label: 'Inhouse' },
  ];

  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Valmiki Nagar (1)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '10', label: 'Raxaul (10)' },
    { value: '11', label: 'Sugauli (11)' },
    { value: '12', label: 'Narkatia (12)' },
    { value: '13', label: 'Harsidhi (SC) (13)' },
    { value: '14', label: 'Govindganj (14)' },
    { value: '15', label: 'Kesaria (15)' },
    { value: '16', label: 'Kalyanpur (16)' },
    { value: '17', label: 'Pipra (17)' },
    { value: '18', label: 'Madhuban (18)' },
    { value: '19', label: 'Motihari (19)' },
    { value: '20', label: 'Chiraia (20)' },
  ];

  // Sample AC data
  const acData = [
    {
      id: 1,
      acCode: 1,
      acName: 'Valmiki Nagar',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 330,
      validInterview: 310,
    },
    {
      id: 2,
      acCode: 2,
      acName: 'Ramnagar (SC)',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 395,
      validInterview: 346,
    },
    {
      id: 3,
      acCode: 3,
      acName: 'Narkatiaganj',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 400,
      validInterview: 315,
    },
    {
      id: 4,
      acCode: 4,
      acName: 'Bagaha',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 345,
      validInterview: 306,
    },
    {
      id: 5,
      acCode: 5,
      acName: 'Lauriya',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 462,
      validInterview: 337,
    },
    {
      id: 6,
      acCode: 6,
      acName: 'Nautan',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 408,
      validInterview: 326,
    },
    {
      id: 7,
      acCode: 7,
      acName: 'Chanpatia',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 388,
      validInterview: 314,
    },
    {
      id: 8,
      acCode: 8,
      acName: 'Bettiah',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 738,
      validInterview: 318,
    },
    {
      id: 9,
      acCode: 9,
      acName: 'Sikta',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 393,
      validInterview: 351,
    },
    {
      id: 10,
      acCode: 10,
      acName: 'Raxaul',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 447,
      validInterview: 325,
    },
    {
      id: 11,
      acCode: 11,
      acName: 'Sugauli',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 466,
      validInterview: 238,
    },
    {
      id: 12,
      acCode: 12,
      acName: 'Narkatia',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 325,
      validInterview: 303,
    },
    {
      id: 13,
      acCode: 13,
      acName: 'Harsidhi (SC)',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 361,
      validInterview: 171,
    },
    {
      id: 14,
      acCode: 14,
      acName: 'Govindganj',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 352,
      validInterview: 148,
    },
    {
      id: 15,
      acCode: 15,
      acName: 'Kesaria',
      agencyId: 1,
      agencyName: 'Kadence',
      totalInterview: 575,
      validInterview: 291,
    },
    {
      id: 16,
      acCode: 16,
      acName: 'Kalyanpur',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 518,
      validInterview: 192,
    },
    {
      id: 17,
      acCode: 17,
      acName: 'Pipra',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 573,
      validInterview: 189,
    },
    {
      id: 18,
      acCode: 18,
      acName: 'Madhuban',
      agencyId: 5,
      agencyName: 'Navin',
      totalInterview: 313,
      validInterview: 209,
    },
    {
      id: 19,
      acCode: 19,
      acName: 'Motihari',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 356,
      validInterview: 118,
    },
    {
      id: 20,
      acCode: 20,
      acName: 'Chiraia',
      agencyId: 2,
      agencyName: 'Chandan',
      totalInterview: 578,
      validInterview: 89,
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search filters:', filters);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      <Heading level={1} className="mb-6">
        AC List
      </Heading>

      {/* Search Form */}
      <Card className="mb-6 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text className="text-sm font-medium mb-2">State Teams</Text>
              <SelectDropdown
                options={agencyOptions}
                value={filters.agencyId}
                onChange={(value) => handleFilterChange('agencyId', value as string)}
                placeholder="Select State Teams"
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-2">AC</Text>
              <SelectDropdown
                options={acOptions}
                value={filters.acCode}
                onChange={(value) => handleFilterChange('acCode', value as string)}
                placeholder="Select AC"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <i className="fa fa-search mr-2"></i>
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* AC List Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Heading level={4}>AC List</Heading>
          <Button variant="primary">
            Update Data Agency Wise
          </Button>
        </div>

        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Showing <strong>1-20</strong> of <strong>243</strong> items.
          </Text>
        </div>
                
                <div className="table-responsive">
                  <Table className="table table-bordered table-striped table-hover">
                    <thead className="sticky-header bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">AC Code</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">AC Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total Interview</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Valid Interview</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.acCode}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.acName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.agencyId}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.agencyName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalInterview}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.validInterview}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <button
                              className="btn btn-info"
                              onClick={() => console.log(`Update Agency for AC ${item.acCode}`)}
                            >
                              Update Agency
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <PaginationStandard
            currentPage={currentPage}
            totalPages={Math.ceil(243 / pageSize)}
            totalItems={243}
            itemsPerPage={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            className="justify-center"
          />
        </div>
      </Card>
    </Container>
  );
};

export default ACListPage;
