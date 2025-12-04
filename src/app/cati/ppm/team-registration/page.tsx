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
import { useCatiTeamRegistration } from '@/hooks/useApi';
import PaginationStandard from '@/components/ui/PaginationStandard';

// TypeScript interfaces for API response
interface TeamRegistrationData {
  id: number;
  username?: string;
  email?: string;
  name?: string;
  first_name?: string;
  lastName?: string;
  portalSlug?: string;
  roleId?: number;
  group?: number;
  isActive?: number; // API uses `is_active` or `isActive`
  is_active?: number;
  createdAt?: string;
  updatedAt?: string;
  totalCallers?: number;
}

// When used with `useApi`, the hook returns `response.data` (not the full response).
interface TeamRegistrationHookData {
  data: TeamRegistrationData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const TeamRegistrationPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Fetch team registration data from API
  const { data, loading, error, refetch } = useCatiTeamRegistration(currentPage, pageSize);

  // The `useApi` hook sets `data` to `response.data`, so `data` here is
  // the inner object that contains `{ data: TeamRegistrationData[], pagination: {...} }`.
  const typedData = data as TeamRegistrationHookData | null;

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
    router.push(`/capi/ppm/create-team/${agencyId}`);
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

  // Extract data from hook response
  const agencyData = typedData?.data || [];
  const pagination = typedData?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className=" text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Team Registration
      </Heading>


      {/* Agency List Table */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">Team Registration List</Heading>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/capi/ppm/team-registration/newagency')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Team Registration
          </Button>
        </div>

        <div className="mb-4">
          <Text className="text-sm text-gray-600">
            Total <strong>{pagination.total || 0}</strong> items.
          </Text>
        </div>

        <div className="table-responsive">
          <Table className="table table-vcenter text-nowrap table-bordered border-bottom">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">S.No.</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Team ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Team Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Total Callers</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {agencyData.map((item: TeamRegistrationData, index: number) => {
                const teamId = item.id;
                const teamName = item.name || item.first_name || item.username || '';
                const totalCallers = item.totalCallers ?? 0;
                const isActive = typeof item.is_active !== 'undefined' ? item.is_active : item.isActive;

                return (
                  <tr key={teamId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                      {index + 1 + (pagination.page - 1) * pagination.limit}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-left">
                      {teamId}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-left">
                      {teamName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-left">
                      {totalCallers}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-center">
                      {getStatusBadge(isActive ? 'Active' : 'Inactive')}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-center">
                      <button
                        onClick={() => handleUpdateAgency(teamId as number)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        title="Update Agency"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>


        <div className="mt-6 pt-4 border-t border-gray-200">
          <PaginationStandard
            currentPage={pagination.page || currentPage}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.total || 0}
            itemsPerPage={pagination.limit || pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            className="justify-center"
          />
        </div>
      </Card>
    </Container>
  );
};

export default TeamRegistrationPage;
