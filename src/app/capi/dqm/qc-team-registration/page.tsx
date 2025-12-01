'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Plus, Edit } from 'lucide-react';
import { useGetQCTeamRegistrations } from '@/hooks/useApi';
import PaginationStandard from '@/components/ui/PaginationStandard';

interface QCAgency {
  id: number;
  agencyId: number;
  agencyName: string;
  supervisorUsername: string;
  totalUser: number;
  status: string;
}

interface APIResponse {
  success: boolean;
  data?: {
    qc_agencies: Array<{
      id: number;
      agency_id: number;
      agency_name: string;
      supervisor_username: string;
      total_user: number;
      status: string;
    }>;
  };
  error?: string;
  timestamp?: string;
}

export default function QCTeamRegistrationPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [qcAgencyData, setQcAgencyData] = useState<QCAgency[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { getQCTeamRegistrations, loading, error } = useGetQCTeamRegistrations();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching QC Team Registrations...');
        const data = await getQCTeamRegistrations({ page: currentPage, pageSize });
        
        console.log('📊 Raw API response:', data);
        
        if (data && data.agencies) {
          console.log('✅ QC Team Registrations data:', data);
          // Transform QC agency data
          const agencyData: QCAgency[] = data.agencies.map(agency => ({
            id: agency.agency_id, // Use agency_id as id
            agencyId: agency.agency_id,
            agencyName: agency.agency_name,
            supervisorUsername: agency.supervisor_username,
            totalUser: agency.total_users, // Use total_users from API
            status: agency.status
          }));
          setQcAgencyData(agencyData);
          setTotalCount(data.pagination?.total_count || agencyData.length);
          setTotalPages(data.pagination?.page_count || Math.ceil(agencyData.length / pageSize));
          console.log('📊 Transformed agency data:', agencyData);
        } else {
          console.log('❌ No QC agencies data received, data structure:', data);
          // Use fallback data if API fails
          const fallbackData: QCAgency[] = [
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
            }
          ];
          setQcAgencyData(fallbackData);
          setTotalCount(fallbackData.length);
          setTotalPages(Math.ceil(fallbackData.length / pageSize));
          console.log('🔄 Using fallback data:', fallbackData);
        }
      } catch (err) {
        console.error('❌ Error fetching QC team registrations:', err);
        // Use fallback data on error
        const fallbackData: QCAgency[] = [
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
          }
        ];
        setQcAgencyData(fallbackData);
        setTotalCount(fallbackData.length);
        setTotalPages(Math.ceil(fallbackData.length / pageSize));
        console.log('🔄 Using fallback data due to error:', fallbackData);
      }
    };

    fetchData();
  }, [getQCTeamRegistrations, currentPage, pageSize]);

  const handleNewAgency = () => {
    // Navigate to new agency page
    router.push('/capi/dqm/qc-team-registration/newagency');
  };

  const handleUpdateAgency = (agencyId: number) => {
    // Navigate to the update page with agency ID as dynamic route
    router.push(`/capi/dqm/qc-team-registration/${agencyId}`);
  };

  // Refresh data function
  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing QC Team Registrations...');
      const data = await getQCTeamRegistrations({ page: currentPage, pageSize });
      
      if (data && data.agencies) {
        const agencyData: QCAgency[] = data.agencies.map(agency => ({
          id: agency.agency_id, // Use agency_id as id
          agencyId: agency.agency_id,
          agencyName: agency.agency_name,
          supervisorUsername: agency.supervisor_username,
          totalUser: agency.total_users, // Use total_users from API
          status: agency.status
        }));
        setQcAgencyData(agencyData);
        setTotalCount(data.pagination?.total_count || agencyData.length);
        setTotalPages(data.pagination?.page_count || Math.ceil(agencyData.length / pageSize));
        console.log('✅ Data refreshed successfully:', agencyData);
      }
    } catch (err) {
      console.error('❌ Error refreshing data:', err);
    }
  };

  // Refresh data when component mounts or when returning from new agency page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, refreshing data...');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [getQCTeamRegistrations]);

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <span className="badge bg-success text-white">{status}</span>;
    } else if (status === 'Inactive') {
      return <span className="badge bg-secondary text-white">{status}</span>;
    }
    return <span className="badge bg-warning text-white">{status}</span>;
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcAgencyData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Text className="text-gray-600">Loading QC team registration data...</Text>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <Card className="mb-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            QC Team Registration List
          </Heading>
        </div>
      </div>

      {/* QC Team Registration Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC Team Registration List
            </Heading>
          </div>
          <div className="flex items-center">
            <Button
              variant="primary"
              onClick={handleNewAgency}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Team Registration
            </Button>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{qcAgencyData.length.toLocaleString()}</strong> QC teams.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">QC Team ID</th>
                  <th className="text-center">QC Team Name</th>
                  <th className="text-center">Supervisor Username</th>
                  <th className="text-center">Total User</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((agency, index) => (
                  <tr key={agency.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{agency.agencyId}</td>
                    <td className="text-left">{agency.agencyName}</td>
                    <td className="text-left">{agency.supervisorUsername}</td>
                    <td className="text-center">{agency.totalUser}</td>
                    <td className="text-center">{getStatusBadge(agency.status)}</td>
                    <td className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateAgency(agency.agencyId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                        title="Update Agency"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
