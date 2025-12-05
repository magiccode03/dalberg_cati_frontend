'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUpdateGroupTeamRegistration, useGetGroupTeamRegistrationById } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

interface Groups {
  id: number;
  name: string;
  group_name?: string;
}

const TeamUpdatePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const Id = resolvedParams.id;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [groups, setGroups] = useState<Groups[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    is_active: '',
    group: '',
  });

  const { updateGroupTeamRegistration, loading: updateLoading, error: updateError } = useUpdateGroupTeamRegistration();
  const { getGroupTeamRegistrationById, loading: fetchLoading, error: fetchError } = useGetGroupTeamRegistrationById();
  const { success, error: showError } = useToast();


  // Dynamic dropdown options from API


  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ];

  // Fetch agency data on component mount
  useEffect(() => {
    if (Id) {
      fetchGroupTeamData();
    } else {
      showError('No Group Team ID provided');
      router.push('/cati/ppm/team-registration');
    }
  }, [Id]);

  // Fetch telecalling groups
  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (!token) {
          console.warn('No auth token, using default groups');
          setGroups([{ id: 1, name: 'Group 1' }]);
          return;
        }

        // Fetch groups from the API
        const endpoint = `${apiUrl}/api/teleform-users/telecalling-groups`;
        console.log('Fetching  groups from:', endpoint);

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status, response.statusText);

        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);

          if (result.success && Array.isArray(result.data)) {
            console.log('Groups data array:', result.data);
            const groups: Groups[] = result.data.map((item: any) => ({
              id: item.group || item.id,
              name: item.group || item.name || `Group ${item.group || item.id}`,
            }));
            console.log('Mapped groups:', groups);
            setGroups(groups);
          } else {
            console.warn('Invalid API response format:', result);
            console.warn('Response success:', result.success, 'Data is array:', Array.isArray(result.data));
            setGroups([{ id: 1, name: 'Group 1' }]);
          }
        } else {
          const errorText = await response.text();
          console.warn('Failed to fetch groups. Status:', response.status, 'Response:', errorText);
          setGroups([{ id: 1, name: 'Group 1' }]);
        }
      } catch (err) {
        console.error('Error fetching groups:', err);
        // Fallback to default
        setGroups([{ id: 1, name: 'Group 1' }]);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const fetchGroupTeamData = async () => {
    if (!Id) {
      showError('No agency ID provided');
      router.push('/cati/ppm/team-registration');
      return;
    }

    try {
      console.log('🔍 Fetching agency data for ID:', Id);
      const teamData = await getGroupTeamRegistrationById(parseInt(Id));
      console.log('Raw API response:', teamData);

      if (teamData) {
        const mappedData = {
          name: teamData.name || '',
          username: teamData.username || '',
          password: '',// Always blank for update form
          is_active: teamData.is_active ? String(teamData.is_active) : '',
          group: teamData.group ? String(teamData.group) : '',
        };
        console.log(' Mapped form data:', mappedData);
        setFormData(mappedData);
      } else {
        console.error('❌ No agency data received from API');
        showError('Failed to fetch agency data - no data returned');
      }
    } catch (err) {
      console.error('❌ Error fetching agency data:', err);
      showError(`Failed to fetch agency data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Id) {
      showError('No agency ID provided');
      return;
    }

    console.log('Updating agency:', Id, 'with data:', formData);

    // Validate required fields (password is optional for updates)
    if (!formData.name || !formData.username) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      // Build update data - only send password if it's not empty
      const updateData: any = {
        name: formData.name,
        username: formData.username,
        is_active: formData.is_active ? parseInt(formData.is_active) : 1,
        group: formData.group ? parseInt(formData.group) : undefined,
      };

      // Only include password if it's not empty
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password;
      }

      const result = await updateGroupTeamRegistration(parseInt(Id), updateData);

      if (result) {
        setShowSuccessBanner(true);
        // Navigate back to team registration list after showing success message
        setTimeout(() => {
          router.push('/cati/ppm/team-registration');
        }, 2000); // Show banner for 2 seconds before navigating
      }
    } catch (err) {
      console.error('Error updating agency:', err);
      showError('Failed to update agency. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/cati/ppm/team-registration');
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading agency data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <Card className="mb-6">
          <div className="card-body text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Agency Data</Heading>
            <Text className="text-gray-600 mb-4">{fetchError}</Text>
            <div className="flex space-x-3 justify-center">
              <Button
                onClick={() => fetchGroupTeamData()}
                variant="primary"
              >
                Retry
              </Button>
              <Button
                onClick={handleBack}
                variant="destructive"
              >
                Back to List
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6">
          <SuccessBanner message="Agency Updated Successfully" />
        </div>
      )}

      {/* Page Title */}
      <Heading level={3} className="mb-6 text-gray-800">
        Update Team: {formData.name}
      </Heading>

      {/* Main Content Card */}
      <Card>
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
            <Heading level={4} className="text-gray-800 font-bold mb-5">
              Update Team Registration
            </Heading>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Team Details Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              Team Details
            </Heading>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter Team Name"
                  maxLength={500}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Groups *
                </label>
                <SelectDropdown
                  value={formData.group}
                  onChange={(value) => handleInputChange('group', Array.isArray(value) ? String(value[0]) : String(value))}
                  options={groups.map(group => ({
                    value: String(group.id),
                    label: group.name,
                  }))}
                  placeholder={loadingGroups ? "Loading groups..." : "Select Telecalling Group"}
                  disabled={loadingGroups}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </Text>
                <SelectDropdown
                  value={formData.is_active}
                  onChange={(value) => handleInputChange('is_active', Array.isArray(value) ? value[0] : value)}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Team Supervisor User Details Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              User Login Details
            </Heading>

            {/* Row 1 - Username and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter Team Login ID"
                  required
                />
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-gray-500">(Optional - leave blank to keep current)</span>
                </Text>
                <div className="flex items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter New Password (leave blank to keep current)"
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="secondary"
                    className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white"
                    title={showPassword ? "Hide Password" : "View Password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update'
              )}
            </Button>
            <Button
              onClick={handleBack}
              variant="destructive"
              className="flex-1"
              disabled={updateLoading}
            >
              Back
            </Button>
          </div>

          {/* Error Display */}
          {updateError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <Text className="text-red-700">{updateError}</Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default TeamUpdatePage;
