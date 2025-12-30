'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Plus, 
  Edit, 
  Search, 
  ArrowLeft,
  FileText,
  Smartphone,
  Ban,
  RefreshCw
} from 'lucide-react';

interface Enumerator {
  id: number;
  fullName: string;
  loginId: string;
  createdAt: string;
  uniqueDevice: boolean;
  odkDashboard: boolean;
  totalDataSubmitted: number;
  formsAssigned: number;
  activeDevice: number;
  status: number; // 1: Active, 2: Block, 3: Cascade
}

interface Form {
  id: number;
  name: string;
}

export default function PortalAdminEnumeratorsPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [enumerators, setEnumerators] = useState<Enumerator[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForm, setFilterForm] = useState('');
  const [filterUniqueDevice, setFilterUniqueDevice] = useState('');
  const [filterOdkDashboard, setFilterOdkDashboard] = useState('');
  const [filterStatus, setFilterStatus] = useState('1'); // Default to Active
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Mock data for demonstration
  const mockEnumerators: Enumerator[] = [
    {
      id: 1617,
      fullName: 'SK ROHIT ISLAM',
      loginId: '8597544677',
      createdAt: 'Sep 28, 2025, 19:55:50 PM',
      uniqueDevice: false,
      odkDashboard: true,
      totalDataSubmitted: 0,
      formsAssigned: 0,
      activeDevice: 0,
      status: 1
    },
    {
      id: 1616,
      fullName: 'Himanka Jana',
      loginId: '9382564941',
      createdAt: 'Sep 28, 2025, 17:36:52 PM',
      uniqueDevice: false,
      odkDashboard: true,
      totalDataSubmitted: 0,
      formsAssigned: 0,
      activeDevice: 0,
      status: 1
    },
    {
      id: 1615,
      fullName: 'Nandani Bhanja',
      loginId: '8101734372',
      createdAt: 'Sep 28, 2025, 11:44:56 AM',
      uniqueDevice: false,
      odkDashboard: true,
      totalDataSubmitted: 0,
      formsAssigned: 0,
      activeDevice: 0,
      status: 1
    },
    {
      id: 1614,
      fullName: 'Paritosh Biswas',
      loginId: '8116934239',
      createdAt: 'Sep 28, 2025, 11:36:28 AM',
      uniqueDevice: false,
      odkDashboard: true,
      totalDataSubmitted: 0,
      formsAssigned: 0,
      activeDevice: 0,
      status: 1
    },
    {
      id: 1613,
      fullName: 'SIPRA PRAMANIK',
      loginId: '9775850248',
      createdAt: 'Sep 28, 2025, 08:38:09 AM',
      uniqueDevice: false,
      odkDashboard: true,
      totalDataSubmitted: 0,
      formsAssigned: 0,
      activeDevice: 0,
      status: 1
    }
  ];

  const mockForms: Form[] = [
    { id: 33, name: 'Bihar Opinion Poll Round 2 V1' },
    { id: 35, name: 'Village Survey Instrument Round 2 V1' },
    { id: 36, name: 'Village Survey Instrument Round 2 Test V1' },
    { id: 37, name: 'Swadhaar Survey Instrument Household Round 2 Test V1' },
    { id: 38, name: 'GDI Mizoram V1' },
    { id: 39, name: 'Swadhaar Survey Instrument Household Round 2 V1' },
    { id: 40, name: 'Vaccine Perception Study_Caregivers V1' },
    { id: 41, name: 'Vaccine Perception Study_Influencers and FLW V1' },
    { id: 44, name: 'Vaccine Perception Study_ Screener V1' },
    { id: 45, name: 'Vaccine Perception Study_Influencers and FLW Pilot V1' },
    { id: 46, name: 'Vaccine Perception Study_Caregivers Pilot V1' },
    { id: 47, name: 'Test form one 2025 V1' },
    { id: 48, name: 'Test form two 2025 V1' },
    { id: 49, name: 'West Bengal Public Opinion Poll Track V1' }
  ];

  const fetchEnumerators = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEnumerators(mockEnumerators);
      setForms(mockForms);
      setPagination({
        page: 1,
        limit: 20,
        total: 1206,
        totalPages: 61,
      });
    } catch (err) {
      setError('Error loading enumerators');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnumerators();
  }, []);

  const handleCreateEnumerator = () => {
    router.push('/portal-admin/enumerators/create');
  };

  const handleAssignForm = (enumeratorId: number) => {
    // Navigate to assign form page
    console.log('Assign form for enumerator:', enumeratorId);
  };

  const handleViewDevices = (enumeratorId: number) => {
    // Navigate to view devices page
    console.log('View devices for enumerator:', enumeratorId);
  };

  const handleUpdateEnumerator = (enumeratorId: number) => {
    // Navigate to update enumerator page
    console.log('Update enumerator:', enumeratorId);
  };

  const handleBlockEnumerator = (enumeratorId: number) => {
    if (window.confirm('Are you sure to block this Enumerator?')) {
      // Handle block enumerator
      console.log('Block enumerator:', enumeratorId);
    }
  };

  const handleSearch = () => {
    // Implement search logic
    console.log('Search with filters:', {
      searchTerm,
      filterForm,
      filterUniqueDevice,
      filterOdkDashboard,
      filterStatus
    });
  };

  if (currentUser?.role !== 'portal_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert type="error" title="Access Denied">
          You do not have permission to access enumerator management.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            onClick={() => router.push('/portal-admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            List of Enumerators
          </h1>
          <Button onClick={handleCreateEnumerator}>
            <Plus className="h-4 w-4 mr-2" />
            Create Enumerators
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" title="Error" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" title="Success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Filters and Actions */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search enumerators by name, login ID, or unique ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select
            value={filterForm}
            onChange={(e) => setFilterForm(e.target.value)}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Forms</option>
            {forms.map(form => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
          <select
            value={filterUniqueDevice}
            onChange={(e) => setFilterUniqueDevice(e.target.value)}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Device Status</option>
            <option value="1">Unique Device</option>
            <option value="0">No Unique Device</option>
          </select>
          <select
            value={filterOdkDashboard}
            onChange={(e) => setFilterOdkDashboard(e.target.value)}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All ODK Status</option>
            <option value="1">ODK Dashboard</option>
            <option value="0">No ODK Dashboard</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="2">Block</option>
            <option value="3">Cascade</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Enumerators Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading enumerators..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Login ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unique Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ODK Dashboard
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Data Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Forms Assigned
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Active Device
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Block
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {enumerators.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      No enumerators found.
                    </td>
                  </tr>
                ) : (
                  enumerators.map((enumerator, index) => (
                    <tr key={enumerator.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {enumerator.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {enumerator.loginId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {enumerator.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {enumerator.uniqueDevice ? (
                          <span className="text-green-600 dark:text-green-400">Yes</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {enumerator.odkDashboard ? (
                          <span className="text-green-600 dark:text-green-400">Yes</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                        {enumerator.totalDataSubmitted.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                        {enumerator.formsAssigned.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                        {enumerator.activeDevice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignForm(enumerator.id)}
                            title="Assign Form"
                            className="text-yellow-600 hover:text-yellow-900 border-yellow-300 hover:border-yellow-400"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDevices(enumerator.id)}
                            title="View Devices of Enumerator"
                            className="text-blue-600 hover:text-blue-900 border-blue-300 hover:border-blue-400"
                          >
                            <Smartphone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateEnumerator(enumerator.id)}
                            title="Update Enumerator"
                            className="text-blue-600 hover:text-blue-900 border-blue-300 hover:border-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBlockEnumerator(enumerator.id)}
                          title="Block Enumerator"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* handlePageChange(pagination.page - 1) */}}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* handlePageChange(pagination.page + 1) */}}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
