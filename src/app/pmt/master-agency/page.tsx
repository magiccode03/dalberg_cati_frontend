'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/tables/DataTable';
import MetricCard from '@/components/ui/MetricCard';
import { Plus, RefreshCw, Download } from 'lucide-react';

interface AgencyData {
  agencyId: number;
  agencyName: string;
  supervisorUsername: string;
  qcAgency: string;
  totalAC: number;
  totalInterviewsConducted: number;
  valid: number;
  rejected: number;
  underQC: number;
  showSecondLevelColumn: string;
  status: string;
  action?: any;
  reQCStatus?: any;
}

// Mock data - replace with actual API call
const mockAgencyData: AgencyData[] = [
  {
    agencyId: 1,
    agencyName: 'Kadence',
    supervisorUsername: 'bhr2kadence',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 47,
    totalInterviewsConducted: 19916,
    valid: 9141,
    rejected: 10775,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 2,
    agencyName: 'Chandan',
    supervisorUsername: 'bhr2chandan',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 56,
    totalInterviewsConducted: 27388,
    valid: 11527,
    rejected: 15861,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 3,
    agencyName: 'Rohit',
    supervisorUsername: 'bhr2rohit',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 17,
    totalInterviewsConducted: 7164,
    valid: 4865,
    rejected: 2299,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 4,
    agencyName: 'Parbhat',
    supervisorUsername: 'bhr2parbhat',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 37,
    totalInterviewsConducted: 16237,
    valid: 10348,
    rejected: 5889,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 5,
    agencyName: 'Navin',
    supervisorUsername: 'bhr2navin',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 4,
    totalInterviewsConducted: 1227,
    valid: 831,
    rejected: 396,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 6,
    agencyName: 'Aeon',
    supervisorUsername: 'bhr2aeon',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 8,
    totalInterviewsConducted: 4190,
    valid: 1744,
    rejected: 2446,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 7,
    agencyName: 'Abhinav',
    supervisorUsername: 'abhinavbihar',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 5,
    totalInterviewsConducted: 1748,
    valid: 1023,
    rejected: 725,
    underQC: 0,
    showSecondLevelColumn: 'No',
    status: 'Active'
  },
  {
    agencyId: 8,
    agencyName: 'Inhouse',
    supervisorUsername: 'bhr2inhouse',
    qcAgency: 'Internal (bhr2internalqc)',
    totalAC: 69,
    totalInterviewsConducted: 30463,
    valid: 10546,
    rejected: 19917,
    underQC: 0,
    showSecondLevelColumn: 'Yes',
    status: 'Active'
  }
];

export default function MasterAgencyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleNewAgency = () => {
    // Navigate to new agency page
    window.location.href = '/pmt/master-agency/newagency';
  };

  const handleUpdateAgency = (agencyId: number) => {
    // Navigate to update agency page
    window.location.href = `/pmt/master-agency/agencyupdate?agency_id=${agencyId}`;
  };

  const handleReQCStatus = (agencyId: number, currentStatus: string) => {
    // Toggle Re-QC status
    const newStatus = currentStatus === 'Enable' ? 'Disable' : 'Enable';
    window.location.href = `/pmt/master-agency/enablereqc?agency_id=${agencyId}&data_send_for_reqc=${newStatus === 'Enable' ? '1' : '2'}`;
  };

  const tableColumns = [
    { key: 'agencyId' as keyof AgencyData, label: 'Agency ID', sortable: true },
    { key: 'agencyName' as keyof AgencyData, label: 'Agency Name', sortable: true },
    { key: 'supervisorUsername' as keyof AgencyData, label: 'Supervisor Username', sortable: true },
    { key: 'qcAgency' as keyof AgencyData, label: 'QC Agency', sortable: true },
    { key: 'totalAC' as keyof AgencyData, label: 'Total AC', sortable: true },
    { key: 'totalInterviewsConducted' as keyof AgencyData, label: 'Total Interviews Conducted', sortable: true },
    { key: 'valid' as keyof AgencyData, label: 'Valid', sortable: true },
    { key: 'rejected' as keyof AgencyData, label: 'Rejected', sortable: true },
    { key: 'underQC' as keyof AgencyData, label: 'Under QC', sortable: true },
    { key: 'showSecondLevelColumn' as keyof AgencyData, label: 'Show Second Level Column', sortable: true },
    { key: 'status' as keyof AgencyData, label: 'Status', sortable: true },
    { 
      key: 'action' as keyof AgencyData, 
      label: 'Action', 
      render: (value: any, row: AgencyData) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleUpdateAgency(row.agencyId)}
        >
          Update
        </Button>
      )
    },
    { 
      key: 'reQCStatus' as keyof AgencyData, 
      label: 'Re-QC Status', 
      render: (value: any, row: AgencyData) => {
        const isEnabled = row.agencyId === 1; // Based on the data, agency 1 has "Disable" button
        return (
          <Button
            size="sm"
            variant={isEnabled ? "destructive" : "primary"}
            onClick={() => handleReQCStatus(row.agencyId, isEnabled ? 'Disable' : 'Enable')}
            title={`${isEnabled ? 'Disable' : 'Enable'} Re-QC for this agency`}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </Button>
        );
      }
    },
  ];

  // Calculate totals
  const totalInterviews = mockAgencyData.reduce((sum, agency) => sum + agency.totalInterviewsConducted, 0);
  const totalValid = mockAgencyData.reduce((sum, agency) => sum + agency.valid, 0);
  const totalRejected = mockAgencyData.reduce((sum, agency) => sum + agency.rejected, 0);
  const totalUnderQC = mockAgencyData.reduce((sum, agency) => sum + agency.underQC, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Agency List
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage agency data and quality control settings
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-purple-600 text-white">
            <div className="p-6 text-center">
              <h3 className="text-white text-lg font-medium mb-2">Total Interview</h3>
              <h4 className="text-3xl font-bold text-white">
                {totalInterviews.toLocaleString()}
              </h4>
            </div>
          </Card>
          
          <Card className="bg-green-600 text-white">
            <div className="p-6 text-center">
              <h3 className="text-white text-lg font-medium mb-2">Valid Interview</h3>
              <h4 className="text-3xl font-bold text-white">
                {totalValid.toLocaleString()}
              </h4>
            </div>
          </Card>
          
          <Card className="bg-red-600 text-white">
            <div className="p-6 text-center">
              <h3 className="text-white text-lg font-medium mb-2">Reject Interview</h3>
              <h4 className="text-3xl font-bold text-white">
                {totalRejected.toLocaleString()}
              </h4>
            </div>
          </Card>
          
          <Card className="bg-blue-600 text-white">
            <div className="p-6 text-center">
              <h3 className="text-white text-lg font-medium mb-2">Interview Under QC</h3>
              <h4 className="text-3xl font-bold text-white">
                {totalUnderQC.toLocaleString()}
              </h4>
            </div>
          </Card>
        </div>

        {/* Agency List Table */}
        <Card>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agency List
              </h2>
              <Button
                variant="primary"
                onClick={handleNewAgency}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Agency
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total <span className="font-semibold">{mockAgencyData.length}</span> items.
              </p>
            </div>

            <DataTable
              data={mockAgencyData}
              columns={tableColumns}
              loading={loading}
              className="w-full"
              searchable={false}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
