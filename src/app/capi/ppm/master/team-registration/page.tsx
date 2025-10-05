'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Edit, Loader2, Plus } from 'lucide-react';
import { useTeamRegistration, useToggleReQcStatus } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import Switch from '@/components/ui/Switch';
import PaginationStandard from '@/components/ui/PaginationStandard';

// TypeScript interfaces for API response
interface TeamRegistrationData {
  agency_id: number;
  agency_name: string;
  username: string;
  qc_agency: string;
  total_ac: number;
  total_interviews_conducted: number;
  valid: number;
  rejected: number;
  under_qc: number;
  show_second_level_column: boolean;
  status: string;
  data_send_for_reqc?: number; // Re-QC status field
}

interface TeamRegistrationResponse {
  team_registrations: TeamRegistrationData[];
  total_count: number;
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  totals: {
    total_interview: number;
    valid_interview: string;
    reject_interview: string;
    interview_under_qc: string;
  };
}

const TeamRegistrationPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Fetch team registration data from API
  const { data, loading, error, refetch } = useTeamRegistration(currentPage, pageSize);
  
  // Toggle Re-QC status hook
  const { toggleReQc, loading: toggleLoading, error: toggleError } = useToggleReQcStatus();
  
  // Toast notifications
  const { success, error: showError } = useToast();
  
  // Type the data properly
  const typedData = data as TeamRegistrationResponse | null;

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

  const handleUpdateAgency = (agencyId: number) => {
    // Navigate to the update page with agency ID as dynamic route
    router.push(`/capi/ppm/master/team-registration/${agencyId}`);
  };

  const handleToggleReQc = async (agencyId: number, currentReqcStatus: number | undefined) => {
    try {
      const currentStatus = currentReqcStatus ?? 0;
      const newStatus = currentStatus === 1 ? 0 : 1;
      
      console.log('🔄 Toggle clicked:', { agencyId, currentReqcStatus, currentStatus, newStatus });
      
      const response = await toggleReQc(agencyId, newStatus);
      
      if (response.success) {
        console.log('✅ Toggle success:', response);
        success(`Re-QC status ${newStatus === 1 ? 'enabled' : 'disabled'} successfully!`);
        await refetch();
      } else {
        console.error('❌ Toggle failed:', response);
        showError(response.message || 'Failed to update Re-QC status');
      }
    } catch (err) {
      console.error('❌ Toggle error:', err);
      showError('Failed to update Re-QC status. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading team registration data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Text className="text-red-600 mb-4">Error loading data: {error}</Text>
            <Button onClick={refetch} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Extract data from API response
  const agencyData = typedData?.team_registrations || [];
  const totals = typedData?.totals || {
    total_interview: 0,
    valid_interview: "0",
    reject_interview: "0",
    interview_under_qc: "0"
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={4} className="mb-6">
        Team Registration
      </Heading>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-purple-600 text-white">
          <div className="py-2 px-3 text-center">
            <Heading level={4} className="text-white mb-1">
              Total Interview
            </Heading>
            <Text className="text-white text-xl font-semibold">
              {totals.total_interview.toLocaleString()}
            </Text>
          </div>
        </Card>
        
        <Card className="bg-green-600 text-white">
          <div className="py-2 px-3 text-center">
            <Heading level={4} className="text-white mb-1">
              Valid Interview
            </Heading>
            <Text className="text-white text-xl font-semibold">
              {parseInt(totals.valid_interview).toLocaleString()}
            </Text>
          </div>
        </Card>
        
        <Card className="bg-red-600 text-white">
          <div className="py-2 px-3 text-center">
            <Heading level={4} className="text-white mb-1">
              Reject Interview
            </Heading>
            <Text className="text-white text-xl font-semibold">
              {parseInt(totals.reject_interview).toLocaleString()}
            </Text>
          </div>
        </Card>
        
        <Card className="bg-blue-600 text-white">
          <div className="py-2 px-3 text-center">
            <Heading level={4} className="text-white mb-1">
              Interview Under QC
            </Heading>
            <Text className="text-white text-xl font-semibold">
              {parseInt(totals.interview_under_qc).toLocaleString()}
            </Text>
          </div>
        </Card>
      </div>

      {/* Agency List Table */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4}>Team Registration List</Heading>
          </div>
          <Button 
            variant="primary"
            onClick={() => router.push('/capi/ppm/master/team-registration/newagency')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Team Registration
          </Button>
        </div>

        {/* Error display for toggle operations */}
        {toggleError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <Text className="text-red-700 text-sm">
              Error updating Re-QC status: {toggleError}
            </Text>
          </div>
        )}

        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Total <strong>{typedData?.total_count || 0}</strong> items.
          </Text>
        </div>
                  
        <div className="table-responsive">
          <Table className="table table-vcenter text-nowrap table-bordered border-bottom">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Team ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Team Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Supervisor Username</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">QC Team</th>
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
                        <th className="px-4 py-3 font-semibold text-gray-700">Re-QC Toggle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyData.map((item: TeamRegistrationData, index: number) => (
                        <tr key={item.agency_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.agency_id}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.agency_name}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.username}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.qc_agency}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.total_ac}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.total_interviews_conducted.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-green-600">
                            {item.valid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-red-600">
                            {item.rejected.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.under_qc}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.show_second_level_column ? 'Yes' : 'No'}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <button
                              onClick={() => handleUpdateAgency(item.agency_id)}
                              className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                              title="Update Agency"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <div 
                              className="flex items-center justify-center space-x-2"
                              onClick={() => {
                                console.log('🔄 Container clicked for Agency:', item.agency_id);
                                alert(`Container clicked for Agency ${item.agency_id}!`);
                              }}
                            >
                              <Switch
                                id={`toggle-${item.agency_id}`}
                                checked={(item.data_send_for_reqc ?? 0) === 1}
                                onChange={(checked) => {
                                  console.log('🔄 Switch onChange triggered:', { 
                                    agencyId: item.agency_id, 
                                    currentStatus: item.data_send_for_reqc,
                                    newChecked: checked 
                                  });
                                  alert(`Toggle clicked for Agency ${item.agency_id}! Current: ${item.data_send_for_reqc}, New: ${checked}`);
                                  handleToggleReQc(item.agency_id, item.data_send_for_reqc);
                                }}
                                disabled={toggleLoading}
                                color="success"
                                size="sm"
                              />
                              {toggleLoading && (
                                <Loader2 size={16} className="animate-spin text-gray-500" />
                              )}
                              <span className="text-xs text-gray-600 ml-1">
                                {(item.data_send_for_reqc ?? 0) === 1 ? 'ON' : 'OFF'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

        {/* Pagination Controls */}
        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Showing <strong>{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, typedData?.total_count || 0)}</strong> of <strong>{typedData?.total_count || 0}</strong> items.
          </Text>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <PaginationStandard
            currentPage={currentPage}
            totalPages={typedData?.total_pages || 1}
            totalItems={typedData?.total_count || 0}
            itemsPerPage={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            className="justify-center"
          />
        </div>
      </Card>
    </Container>
  );
};

export default TeamRegistrationPage;
