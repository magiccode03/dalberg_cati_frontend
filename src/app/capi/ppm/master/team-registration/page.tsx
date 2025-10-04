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
import { Edit, RefreshCw, XCircle, Loader2 } from 'lucide-react';
import { useTeamRegistration, useToggleReQcStatus } from '@/hooks/useApi';

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
  
  // Type the data properly
  const typedData = data as TeamRegistrationResponse | null;

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

  const handleToggleReQc = async (agencyId: number, currentStatus: boolean) => {
    try {
      const newStatus = currentStatus ? 0 : 1; // Toggle between 0 and 1
      
      console.log('Handling toggle Re-QC:', {
        agencyId,
        currentStatus,
        newStatus,
        requestData: {
          agency_id: agencyId,
          data_send_for_reqc: newStatus
        }
      });
      
      const response = await toggleReQc(agencyId, newStatus);
      
      if (response.success) {
        // Refresh the data to get updated status
        refetch();
        console.log('Re-QC status updated successfully:', response.data.message);
      }
    } catch (err) {
      console.error('Failed to toggle Re-QC status:', err);
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
            <Heading level={4}>Agency List</Heading>
          </div>
          <Button 
            variant="primary"
            onClick={() => router.push('/capi/ppm/master/team-registration/newagency')}
          >
            <i className="fa fa-plus mr-2"></i>
            New Agency
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
                              onClick={() => console.log(`Update Agency ${item.agency_id}`)}
                              className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                              title="Update Agency"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 text-center">
                            <button
                              onClick={() => handleToggleReQc(item.agency_id, item.show_second_level_column)}
                              disabled={toggleLoading}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded transition-colors ${
                                toggleLoading 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : item.show_second_level_column 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                              }`}
                              title={item.show_second_level_column ? "Disable Re-QC for this agency" : "Enable Re-QC for this agency"}
                            >
                              {toggleLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <RefreshCw size={16} />
                              )}
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

export default TeamRegistrationPage;
