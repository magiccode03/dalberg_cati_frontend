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
import { useUpdateTeamRegistration, useGetTeamRegistrationById, useGetTeamRegistrationDropdownOptions } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

const AgencyUpdatePage = ({ params }: { params: Promise<{ agency_id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const agencyId = resolvedParams.agency_id;
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [formData, setFormData] = useState({
    agency_name: '',
    qc_agency_id: '',
    show_second_level_column: '',
    status: '1',
    qa_id: '',
    username: '',
    password: ''
  });
  
  const { updateTeamRegistration, loading: updateLoading, error: updateError } = useUpdateTeamRegistration();
  const { getTeamRegistrationById, loading: fetchLoading, error: fetchError } = useGetTeamRegistrationById();
  const { getDropdownOptions, data: dropdownData, loading: dropdownLoading, error: dropdownError } = useGetTeamRegistrationDropdownOptions();
  const { success, error: showError } = useToast();

  const qcAgencyOptions = [
    { value: '', label: 'Status QC Team' },
    { value: '1', label: 'Internal (bhr2internalqc)' },
    { value: '2', label: 'Kadence (bhr2kadenceqc)' }
  ];

  // Dynamic dropdown options from API
  const showSecondLevelOptions = dropdownData?.show_second_level_column?.map(option => ({
    value: option.value.toString(),
    label: option.label
  })) || [
    { value: '', label: 'Show 2nd Level Column(s)' },
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' }
  ];

  const statusOptions = dropdownData?.status?.map(option => ({
    value: option.value.toString(),
    label: option.label
  })) || [
    { value: '', label: 'Status Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ];

  // Fetch agency data on component mount
  useEffect(() => {
    if (agencyId) {
      fetchAgencyData();
    } else {
      showError('No agency ID provided');
      router.push('/capi/ppm/master/team-registration');
    }
  }, [agencyId]);

  // Fetch dropdown options on component mount
  useEffect(() => {
    getDropdownOptions();
  }, [getDropdownOptions]);

  const fetchAgencyData = async () => {
    if (!agencyId) {
      showError('No agency ID provided');
      router.push('/capi/ppm/master/team-registration');
      return;
    }

    try {
      console.log('🔍 Fetching agency data for ID:', agencyId);
      const agencyData = await getTeamRegistrationById(parseInt(agencyId));
      console.log('📊 Raw API response:', agencyData);
      
      if (agencyData) {
        const mappedData = {
          agency_name: agencyData.agency_name || '',
          qc_agency_id: agencyData.qc_agency_id?.toString() || '',
          show_second_level_column: agencyData.show_second_level_column?.toString() || '',
          status: agencyData.status?.toString() || '1',
          qa_id: agencyData.qa_id?.toString() || '',
          username: agencyData.username || '',
          password: '' // Always blank for update form
        };
        console.log('✅ Mapped form data:', mappedData);
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

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      password: password
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agencyId) {
      showError('No agency ID provided');
      return;
    }
    
    console.log('Updating agency:', agencyId, 'with data:', formData);
    
    // Validate required fields (password is optional for updates)
    if (!formData.agency_name || !formData.username) {
      showError('Please fill in all required fields');
      return;
    }

    // If password is blank, we'll skip updating it
    if (!formData.password.trim()) {
      console.log('Password is blank, will not update password');
    }

    try {
      const result = await updateTeamRegistration(parseInt(agencyId), {
        agency_name: formData.agency_name,
        qc_agency_id: parseInt(formData.qc_agency_id || '1'),
        show_second_level_column: parseInt(formData.show_second_level_column || '1'),
        status: parseInt(formData.status),
        qa_id: parseInt(formData.qa_id || '1'), // Default value since field is hidden
        unique_id: formData.username,
        first_name: formData.username,
        last_name: formData.username,
        email: `${formData.username}@example.com`,
        password: formData.password
      });

      if (result) {
        setShowSuccessBanner(true);
        // Navigate back to team registration list after showing success message
        setTimeout(() => {
          router.push('/capi/ppm/master/team-registration');
        }, 2000); // Show banner for 2 seconds before navigating
      }
    } catch (err) {
      console.error('Error updating agency:', err);
      showError('Failed to update agency. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/capi/ppm/master/team-registration');
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
                onClick={() => fetchAgencyData()} 
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
        Update Agency: {formData.agency_name}
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
                  value={formData.agency_name}
                  onChange={(e) => handleInputChange('agency_name', e.target.value)}
                  placeholder="Enter Team Name"
                  maxLength={500}
                  required
                />
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  QC Team
                </Text>
                <SelectDropdown
                  value={formData.qc_agency_id}
                  onChange={(value) => handleInputChange('qc_agency_id', Array.isArray(value) ? value[0] : value)}
                  options={qcAgencyOptions}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Show Second Level Column <span className="text-red-500">*</span>
                </Text>
                <SelectDropdown
                  value={formData.show_second_level_column}
                  onChange={(value) => handleInputChange('show_second_level_column', Array.isArray(value) ? value[0] : value)}
                  options={showSecondLevelOptions}
                  disabled={dropdownLoading}
                />
                {dropdownLoading && (
                  <Text className="text-sm text-gray-500 mt-1">Loading options...</Text>
                )}
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </Text>
                <SelectDropdown
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', Array.isArray(value) ? value[0] : value)}
                  options={statusOptions}
                  disabled={dropdownLoading}
                />
                {dropdownLoading && (
                  <Text className="text-sm text-gray-500 mt-1">Loading options...</Text>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Team Supervisor User Details Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              Zonal Manager User Details
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
                    onClick={generatePassword}
                    variant="primary"
                    className="rounded-none border-l-0 bg-green-600 hover:bg-green-700"
                    title="Generate Password"
                  >
                    <Key className="w-4 h-4" />
                  </Button>
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

          {/* Dropdown Options Error Display */}
          {dropdownError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                <Text className="text-yellow-700">
                  Warning: Could not load dropdown options. Using default values. ({dropdownError})
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default AgencyUpdatePage;
