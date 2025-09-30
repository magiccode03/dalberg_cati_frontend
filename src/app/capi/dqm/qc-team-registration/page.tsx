'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Plus, Edit } from 'lucide-react';

interface QCAgency {
  id: number;
  agencyId: number;
  agencyName: string;
  supervisorUsername: string;
  totalUser: number;
  status: string;
}

export default function QCTeamRegistrationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Sample data for QC Agency List (4 items as shown in HTML)
  const qcAgencyData: QCAgency[] = [
    {
      id: 1,
      agencyId: 1,
      agencyName: 'Internal',
      supervisorUsername: 'bhr2internalqc',
      totalUser: 41,
      status: 'Active'
    },
    {
      id: 2,
      agencyId: 2,
      agencyName: 'Kadence',
      supervisorUsername: 'bhr2kadenceqc',
      totalUser: 34,
      status: 'Active'
    },
    {
      id: 3,
      agencyId: 3,
      agencyName: 'Parbhat',
      supervisorUsername: 'bhr2parbhatqc',
      totalUser: 0,
      status: 'Inactive'
    },
    {
      id: 4,
      agencyId: 4,
      agencyName: 'Rohit',
      supervisorUsername: 'bhr2rohitqc',
      totalUser: 0,
      status: 'Inactive'
    }
  ];

  const handleNewAgency = () => {
    // Handle new agency creation logic here
    console.log('Create New Agency');
  };

  const handleUpdateAgency = (agencyId: number) => {
    // Handle update agency logic here
    console.log('Update Agency ID:', agencyId);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <span className="badge bg-success text-white">{status}</span>;
    } else if (status === 'Inactive') {
      return <span className="badge bg-secondary text-white">{status}</span>;
    }
    return <span className="badge bg-warning text-white">{status}</span>;
  };

  const totalItems = qcAgencyData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentAgencies = qcAgencyData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            QC Agency List
          </Heading>
        </div>
        <div className="justify-content-center mt-2">
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* QC Agency List Card */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              QC Agency List
            </Heading>
            <div className="text-end">
              <Button
                variant="primary"
                onClick={handleNewAgency}
                className="ml-5"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Agency
              </Button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <Table className="table table-vcenter text-nowrap table-bordered border-bottom">
              <thead>
                <tr>
                  <th>Agency ID</th>
                  <th>Agency Name</th>
                  <th>Supervisior Username</th>
                  <th>Total User</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td>{agency.agencyId}</td>
                    <td>{agency.agencyName}</td>
                    <td>{agency.supervisorUsername}</td>
                    <td>{agency.totalUser}</td>
                    <td>{agency.status}</td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateAgency(agency.agencyId)}
                        className="bg-info text-dark border-info hover:bg-info-dark"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="table-footer d-flex justify-content-between mt-4">
              <div className="col-lg-6">
                <div className="table-footer-left">
                  <div className="summary">
                    <Text className="text-sm text-gray-600">
                      Total <b>{totalItems}</b> items.
                    </Text>
                  </div>
                </div>
              </div>
              <div className="table-footer-right">
                <div className="col-lg-6">
                  <div className="main-card mb-3">
                    <nav className="pagination-rounded" aria-label="Page navigation example">
                      <ul className="pagination">
                        {/* Pagination would go here if needed */}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
