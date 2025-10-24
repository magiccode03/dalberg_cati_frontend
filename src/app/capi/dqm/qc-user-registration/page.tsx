'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import { Table } from '@/components/ui/Table';
import { Search, Plus, Edit, Check, Eye, X, MapPin, Speaker } from 'lucide-react';
import apiClient from '@/lib/api-client';
import QCUserViewModal from '@/components/modals/QCUserViewModal';
import CapiQCACAssignModal from '@/components/modals/CapiQCACAssignModal';
import CapiGPSQCACAssignModal from '@/components/modals/CapiGPSQCACAssignModal';

interface QCUserData {
  id: number;
  qcId: number;
  name: string;
  mobileNumber: string;
  gps: boolean;
  audio: boolean;
  reChecking: boolean;
  status: string;
  agencyId?: number;
  assignedAcCount?: number;
  assignedAcInterviewers?: string;
  accessPermissions?: {
    audio_qc: boolean;
    gps_qc: boolean;
    tele_qc: boolean;
    rechecking: boolean;
  };
}

interface QCUserAssignment {
  acCode: string;
  acName: string;
  interviewerId: string;
}

interface APIResponse {
  success: boolean;
  data?: {
    qc_users: Array<{
      id: number;
      qc_id: number;
      name: string;
      mobile_number: string;
      audio: number;
      gps: number;
      tele: number;
      agency_id: number;
      status: string;
      clientaudiocheck: number;
      access_permissions: {
        audio_qc: boolean;
        gps_qc: boolean;
        tele_qc: boolean;
        rechecking: boolean;
      };
      assigned_ac_count: number;
      assigned_ac_interviewers: string;
      created_at: string | number;
      updated_at: string | number;
    }>;
    statistics: {
      total_users: number;
      active_users: string;
      inactive_users: string;
      audio_qc_users: string;
      gps_qc_users: string;
      rechecking_users: string;
    };
    filters_applied: {
      status: number;
    };
    pagination: {
      total_count: number;
      page_count: number;
      current_page: number;
      per_page: number;
    };
  };
  message?: string;
  timestamp?: string;
  error?: string;
}

export default function QCUserRegistrationPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    qcId: '',
    name: '',
    mobileNumber: '',
    status: '1', // Default to Active
    gps: false,
    audio: false,
    reChecking: false,
  });

  // Separate state for applied filters (what actually filters the data)
  const [appliedFilters, setAppliedFilters] = useState({
    qcId: '',
    name: '',
    mobileNumber: '',
    status: '1',
    gps: false,
    audio: false,
    reChecking: false,
  });

  const [qcUserData, setQcUserData] = useState<QCUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_users: 0,
    active_users: '0',
    inactive_users: '0',
    audio_qc_users: '0',
    gps_qc_users: '0',
    rechecking_users: '0'
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<QCUserData | null>(null);
  const [userAssignments, setUserAssignments] = useState<QCUserAssignment[]>([]);
  
  // AC Assignment Modal state
  const [isACAssignModalOpen, setIsACAssignModalOpen] = useState(false);
  const [selectedQCId, setSelectedQCId] = useState<number | null>(null);
  const [selectedQCName, setSelectedQCName] = useState<string>('');
  
  // GPS AC Assignment Modal state
  const [isGPSACAssignModalOpen, setIsGPSACAssignModalOpen] = useState(false);
  const [selectedGPSQCId, setSelectedGPSQCId] = useState<number | null>(null);
  const [selectedGPSQCName, setSelectedGPSQCName] = useState<string>('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters from applied filters
        const queryParams = new URLSearchParams();
        if (appliedFilters.qcId) queryParams.append('qc_id', appliedFilters.qcId);
        if (appliedFilters.name) queryParams.append('name', appliedFilters.name);
        if (appliedFilters.mobileNumber) queryParams.append('mobile_number', appliedFilters.mobileNumber);
        if (appliedFilters.status) queryParams.append('status', appliedFilters.status);
        if (appliedFilters.gps) queryParams.append('gps', '1');
        if (appliedFilters.audio) queryParams.append('audio', '1');
        if (appliedFilters.reChecking) queryParams.append('clientaudiocheck', '1');
        queryParams.append('limit', '1000'); // Fetch all users at once
        
        const queryString = queryParams.toString();
        const endpoint = `/qc-user-registration?${queryString}`;
        
        const response = await apiClient.get(endpoint);
        const data: APIResponse = response.data;
        
        if (data.success && data.data?.qc_users) {
            // Transform QC user data
            const userData: QCUserData[] = data.data.qc_users.map(user => ({
              id: user.id,
              qcId: user.qc_id,
              name: user.name,
              mobileNumber: user.mobile_number,
            gps: user.gps === 1,
            audio: user.audio === 1,
            reChecking: user.clientaudiocheck === 1,
            status: user.status,
            agencyId: user.agency_id,
            assignedAcCount: user.assigned_ac_count,
            assignedAcInterviewers: user.assigned_ac_interviewers,
            accessPermissions: user.access_permissions
            }));
            setQcUserData(userData);
          
          // Set statistics
          if (data.data.statistics) {
            setStatistics(data.data.statistics);
          }
        } else {
          setError(data.error || 'No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching QC user data:', err);
        
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access forbidden. You do not have permission to view this data.');
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError(err.message || 'An error occurred while fetching data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedFilters]);


  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Apply the current filter values to trigger the search
    setAppliedFilters(filters);
    console.log('Searching with filters:', filters);
  };

  const handleClear = () => {
    // Reset all filters to default values
    const defaultFilters = {
      qcId: '',
      name: '',
      mobileNumber: '',
      status: '1', // Default to Active
      gps: false,
      audio: false,
      reChecking: false,
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const handleAddNewUser = () => {
    // Navigate to the new user form page
    router.push('/capi/dqm/qc-user-registration/user');
  };

  const handleEditUser = (userId: number) => {
    // Navigate to the update user form page
    console.log('Editing user:', userId);
    router.push(`/capi/dqm/qc-user-registration/${userId}`);

  };

  const handleAssignAC = (userId: number) => {
    // Find the user data
    const user = qcUserData.find(u => u.id === userId);
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    // Open AC Assignment Modal
    setSelectedQCId(user.qcId);
    setSelectedQCName(user.name);
    setIsACAssignModalOpen(true);
  };

  const handleAssignGPSAC = (userId: number) => {
    // Find the user data
    const user = qcUserData.find(u => u.id === userId);
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    // Open GPS AC Assignment Modal
    setSelectedGPSQCId(user.qcId);
    setSelectedGPSQCName(user.name);
    setIsGPSACAssignModalOpen(true);
  };

  const handleACAssignSuccess = () => {
    // Refresh the data after successful assignment
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters from appliedFilters
        const queryParams = new URLSearchParams();
        if (appliedFilters.qcId) queryParams.append('qc_id', appliedFilters.qcId);
        if (appliedFilters.name) queryParams.append('name', appliedFilters.name);
        if (appliedFilters.mobileNumber) queryParams.append('mobile_number', appliedFilters.mobileNumber);
        if (appliedFilters.status) queryParams.append('status', appliedFilters.status);
        if (appliedFilters.gps) queryParams.append('gps', '1');
        if (appliedFilters.audio) queryParams.append('audio', '1');
        if (appliedFilters.reChecking) queryParams.append('clientaudiocheck', '1');
        queryParams.append('limit', '1000'); // Fetch all users at once
        
        const queryString = queryParams.toString();
        const endpoint = `/qc-user-registration?${queryString}`;
        
        const response = await apiClient.get(endpoint);
        const data: APIResponse = response.data;
        
        if (data.success && data.data?.qc_users) {
          const userData: QCUserData[] = data.data.qc_users.map(user => ({
            id: user.id,
            qcId: user.qc_id,
            name: user.name,
            mobileNumber: user.mobile_number,
            gps: user.gps === 1,
            audio: user.audio === 1,
            reChecking: user.clientaudiocheck === 1,
            status: user.status,
            agencyId: user.agency_id,
            assignedAcCount: user.assigned_ac_count,
            assignedAcInterviewers: user.assigned_ac_interviewers,
            accessPermissions: user.access_permissions
          }));
          setQcUserData(userData);
          
          if (data.data.statistics) {
            setStatistics(data.data.statistics);
          }
        }
      } catch (err: any) {
        console.error('Error refreshing QC user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const handleGPSACAssignSuccess = () => {
    // Refresh the data after successful GPS AC assignment
    handleACAssignSuccess(); // Reuse the same refresh logic
  };

  const handleViewAssignedAC = (userId: number) => {
    const user = qcUserData.find(u => u.id === userId);
    if (!user) {
      console.error('User not found:', userId);
      return;
    }

    // Parse assigned AC interviewers string
    const assignments: QCUserAssignment[] = [];
    if (user.assignedAcInterviewers) {
      const pairs = user.assignedAcInterviewers.split(',');
      pairs.forEach(pair => {
        const [acCode, interviewerId] = pair.split(':');
        if (acCode && interviewerId) {
          assignments.push({
            acCode: acCode.trim(),
            acName: `AC ${acCode.trim()}`, // This should come from API
            interviewerId: interviewerId.trim()
          });
        }
      });
    }

    setSelectedUser(user);
    setUserAssignments(assignments);
    setIsModalOpen(true);
  };

  const renderIcon = (value: boolean) => {
    return value ? (
      <span className="text-black text-lg">✓</span>
    ) : (
      <span className="text-black text-lg">✗</span>
    );
  };

  if (loading) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading QC user data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <Card className="mb-6">
            <div className="card-body text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
              <Text className="text-gray-600 mb-4">{error}</Text>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Page Header */}
        <div className="mb-6">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
            QC User Registration
            </Heading>
        </div>

        {/* Search Filters */}
        <Card className="p-4 mb-5">
          <div className="flex flex-wrap items-end gap-4">
            {/* QC ID Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QC ID
              </label>
              <Input
                type="text"
                placeholder="Enter QC ID"
                value={filters.qcId}
                onChange={(e) => handleFilterChange('qcId', e.target.value)}
              />
            </div>

            {/* Name Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <Input
                type="text"
                placeholder="Enter Name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>

            {/* Mobile Number Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number
              </label>
              <Input
                type="text"
                placeholder="Enter Mobile Number"
                value={filters.mobileNumber}
                onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <SelectDropdown
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value as string)}
                options={[
                  { value: '', label: 'Select User Status' },
                  { value: '1', label: 'Active' },
                  { value: '2', label: 'Inactive' },
                ]}
              />
            </div>

            {/* GPS Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GPS
              </label>
              <SelectDropdown
                value={filters.gps ? '1' : ''}
                onChange={(value) => handleFilterChange('gps', value === '1')}
                options={[
                  { value: '', label: 'All' },
                  { value: '1', label: 'Enabled' },
                  { value: '0', label: 'Disabled' },
                ]}
              />
            </div>

            {/* Audio Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Audio
              </label>
              <SelectDropdown
                value={filters.audio ? '1' : ''}
                onChange={(value) => handleFilterChange('audio', value === '1')}
                options={[
                  { value: '', label: 'All' },
                  { value: '1', label: 'Enabled' },
                  { value: '0', label: 'Disabled' },
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleSearch}
                className="flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={handleClear}
                className="bg-gray-500 text-white hover:bg-gray-600 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* QC User Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                QC User Registration
                  </Heading>
                </div>
            <div className="flex items-center">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddNewUser}
                className="flex items-center"
                >
                <Plus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
            Total <strong>{qcUserData.length}</strong> QC users.
          </div>

              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
              <thead className="sticky-header bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">GPS</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Assign AC</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {qcUserData.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.qcId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.mobileNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{renderIcon(user.gps)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{renderIcon(user.audio)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleEditUser(user.id)}
                        // className="flex items-center justify-center"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                              {/* <div className="flex flex-row gap-2 items-center"> */}
                                
                                {/* GPS Assign AC Button */}
                                {/* <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleAssignGPSAC(user.id)}
                                  title={user.gps ? "Assign GPS AC" : "GPS not enabled"}
                                  disabled={!user.gps}
                                  className={`w-full ${!user.gps ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <MapPin className="w-4 h-4 mr-1" />
                                </Button> */}

                                {/* Regular Assign AC Button */}
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleAssignAC(user.id)}
                                  title="Assign AC"
                                  // className="w-full"
                                >
                                  <Speaker className="w-4 h-4" />
                                </Button>
                              {/* </div> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

          </Card>
      </Container>

      {/* QC User View Modal */}
      <QCUserViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qcUserName={selectedUser?.name || ''}
        assignments={userAssignments}
      />

      {/* AC Assignment Modal */}
      {selectedQCId && (
        <CapiQCACAssignModal
          isOpen={isACAssignModalOpen}
          onClose={() => {
            setIsACAssignModalOpen(false);
            setSelectedQCId(null);
            setSelectedQCName('');
          }}
          teleformUserId={selectedQCId}
          telecallerName={selectedQCName}
          onSuccess={handleACAssignSuccess}
        />
      )}

      {/* GPS AC Assignment Modal */}
      {selectedGPSQCId && (
        <CapiGPSQCACAssignModal
          isOpen={isGPSACAssignModalOpen}
          onClose={() => {
            setIsGPSACAssignModalOpen(false);
            setSelectedGPSQCId(null);
            setSelectedGPSQCName('');
          }}
          teleformUserId={selectedGPSQCId}
          telecallerName={selectedGPSQCName}
          onSuccess={handleGPSACAssignSuccess}
        />
      )}
    </div>
  );
}
