'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';

const TeamRegistrationPage = () => {
  // Sample agency data
  const agencyData = [
    {
      id: 1,
      agencyId: 1,
      agencyName: 'Kadence',
      supervisorUsername: 'bhr2kadence',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 47,
      totalInterviewsConducted: 19916,
      valid: 9141,
      rejected: 10775,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Disable',
    },
    {
      id: 2,
      agencyId: 2,
      agencyName: 'Chandan',
      supervisorUsername: 'bhr2chandan',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 56,
      totalInterviewsConducted: 27388,
      valid: 11527,
      rejected: 15861,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 3,
      agencyId: 3,
      agencyName: 'Rohit',
      supervisorUsername: 'bhr2rohit',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 17,
      totalInterviewsConducted: 7164,
      valid: 4865,
      rejected: 2299,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 4,
      agencyId: 4,
      agencyName: 'Parbhat',
      supervisorUsername: 'bhr2parbhat',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 37,
      totalInterviewsConducted: 16237,
      valid: 10348,
      rejected: 5889,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 5,
      agencyId: 5,
      agencyName: 'Navin',
      supervisorUsername: 'bhr2navin',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 4,
      totalInterviewsConducted: 1227,
      valid: 831,
      rejected: 396,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 6,
      agencyId: 6,
      agencyName: 'Aeon',
      supervisorUsername: 'bhr2aeon',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 8,
      totalInterviewsConducted: 4190,
      valid: 1744,
      rejected: 2446,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 7,
      agencyId: 7,
      agencyName: 'Abhinav',
      supervisorUsername: 'abhinavbihar',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 5,
      totalInterviewsConducted: 1748,
      valid: 1023,
      rejected: 725,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 8,
      agencyId: 8,
      agencyName: 'Inhouse',
      supervisorUsername: 'bhr2inhouse',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 69,
      totalInterviewsConducted: 30463,
      valid: 10546,
      rejected: 19917,
      underQc: 0,
      showSecondLevelColumn: 'Yes',
      status: 'Active',
      reQcStatus: 'Enable',
    },
  ];

  const getReQcStatusBadge = (status: string) => {
    switch (status) {
      case 'Enable':
        return <Badge variant="success" size="sm">Enable</Badge>;
      case 'Disable':
        return <Badge variant="error" size="sm">Disable</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'Inactive':
        return <Badge variant="error" size="sm">Inactive</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      <Heading level={1} className="mb-6">
        Agency List
      </Heading>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-purple-600 text-white">
          <div className="p-6 text-center">
            <Heading level={3} className="text-white mb-2">
              Total Interview
            </Heading>
            <Text className="text-white text-2xl font-semibold">
              1,08,333
            </Text>
          </div>
        </Card>
        
        <Card className="bg-green-600 text-white">
          <div className="p-6 text-center">
            <Heading level={3} className="text-white mb-2">
              Valid Interview
            </Heading>
            <Text className="text-white text-2xl font-semibold">
              50,025
            </Text>
          </div>
        </Card>
        
        <Card className="bg-red-600 text-white">
          <div className="p-6 text-center">
            <Heading level={3} className="text-white mb-2">
              Reject Interview
            </Heading>
            <Text className="text-white text-2xl font-semibold">
              58,308
            </Text>
          </div>
        </Card>
        
        <Card className="bg-blue-600 text-white">
          <div className="p-6 text-center">
            <Heading level={3} className="text-white mb-2">
              Interview Under QC
            </Heading>
            <Text className="text-white text-2xl font-semibold">
              0
            </Text>
          </div>
        </Card>
      </div>

      {/* Agency List Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Heading level={4}>Agency List</Heading>
          <Button variant="primary">
            <i className="fa fa-plus mr-2"></i>
            New Agency
          </Button>
        </div>

        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Total <strong>8</strong> items.
          </Text>
        </div>
                  
        <div className="table-responsive">
          <Table className="table table-vcenter text-nowrap table-bordered border-bottom">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Supervisor Username</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">QC Agency</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total AC</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total Interviews Conducted</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Valid</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Rejected</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Under QC</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          <a href="#" className="text-blue-600 hover:text-blue-800">
                            Show Second Level Column
                          </a>
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Re-QC Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.agencyId}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.agencyName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.supervisorUsername}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.qcAgency}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalAc}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalInterviewsConducted.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-green-600">
                            {item.valid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-red-600">
                            {item.rejected.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.underQc}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.showSecondLevelColumn}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log(`Update Agency ${item.agencyId}`)}
                            >
                              Update
                            </Button>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <Button
                              variant={item.reQcStatus === 'Enable' ? 'primary' : 'destructive'}
                              size="sm"
                              onClick={() => console.log(`${item.reQcStatus} Re-QC for Agency ${item.agencyId}`)}
                              title={`${item.reQcStatus} Re-QC for this agency`}
                            >
                              {item.reQcStatus}
                            </Button>
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

export default TeamRegistrationPage;
