'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUpdateQCTeamRegistration, useGetQCTeamRegistrations } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

const QCUpdatePage = () => {
  const router = useRouter();
  const params = useParams();
  const agencyId = params.agency_id as string;
  
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    agency_name: '',
    status: '1', // Default to Active
    username: '',
    password: ''
  });
  
  const { updateQCTeamRegistration, loading, error } = useUpdateQCTeamRegistration();
  const { getQCTeamRegistrations } = useGetQCTeamRegistrations();
  const { success, error: showError } = useToast();

  const statusOptions = [
    { value: '', label: 'Status Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ];

  // Fetch agency data to pre-fill the form
  const fetchAgencyData = async () => {
    console.log('🔍 fetchAgencyData called with agencyId:', agencyId);
    
    if (!agencyId) {
      console.log('❌ No agency ID provided, redirecting to list');
      showError('No agency ID provided');
      router.push('/capi/dqm/qc-team-registration');
      return;
    }

    setIsLoadingData(true);
    try {
      console.log('🔍 Fetching QC agency data for ID:', agencyId);
      
      // Get all QC team registrations and find the specific one
      const data = await getQCTeamRegistrations({ page: 1, pageSize: 100 });
      
      if (data && data.agencies) {
        const agency = data.agencies.find(agency => agency.agency_id === parseInt(agencyId));
        
        if (agency) {
          console.log('✅ Found agency data:', agency);
          const mappedData = {
            agency_name: agency.agency_name || '',
            status: agency.status === 'Active' ? '1' : '0',
            username: agency.supervisor_username || '',
            password: '' // Always blank for update form
          };
          console.log('✅ Mapped form data:', mappedData);
          setFormData(mappedData);
        } else {
          console.error('❌ Agency not found with ID:', agencyId);
          showError('Agency not found');
          router.push('/capi/dqm/qc-team-registration');
        }
      } else {
        console.error('❌ No agencies data received');
        showError('Failed to fetch agency data');
      }
    } catch (err) {
      console.error('❌ Error fetching agency data:', err);
      showError(`Failed to fetch agency data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load agency data on component mount
  useEffect(() => {
    console.log('🔄 useEffect triggered, agencyId:', agencyId);
    if (agencyId) {
      fetchAgencyData();
    } else {
      console.log('❌ No agencyId in useEffect, not fetching data');
    }
  }, [agencyId]);

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
    
    console.log('Form data:', formData); // Debug log
    
    // Validate required fields
    if (!formData.agency_name || !formData.username) {
      showError('Please fill in all required fields');
      return;
    }

    // If password is blank, we'll skip updating it
    if (!formData.password.trim()) {
      console.log('Password is blank, will not update password');
    }

    try {
      // Validate and prepare data
      const agencyName = formData.agency_name.trim();
      const status = parseInt(formData.status);
      const uniqueId = formData.username.trim();
      
      // Validate required fields
      if (!agencyName) {
        showError('Agency name is required');
        return;
      }
      if (!uniqueId) {
        showError('Username is required');
        return;
      }
      if (isNaN(status)) {
        showError('Invalid status value');
        return;
      }

      // Include all required fields as per server validation
      const apiData: any = {
        agency_name: agencyName,
        status: status,
        unique_id: uniqueId,
        qc_agency_id: 1, // Required number field
        show_second_level_column: 1, // Required number field
        qa_id: 1, // Required number field
        first_name: uniqueId, // Required string field
        last_name: uniqueId, // Required string field
        email: `${uniqueId}@example.com` // Required valid email field
      };

      // Only add password if it's not empty
      if (formData.password.trim()) {
        apiData.password = formData.password.trim();
      }

      console.log('🔄 Updating QC team registration with data:', apiData);
      console.log('🔄 API endpoint:', `/qc-team-registration/update/${agencyId}`);
      console.log('🔄 Agency ID type:', typeof agencyId, 'Value:', agencyId);
      console.log('🔄 Form data before processing:', formData);
      console.log('🔄 Final API data structure:', JSON.stringify(apiData, null, 2));
      
      // Validate agency ID
      if (!agencyId || isNaN(parseInt(agencyId))) {
        showError('Invalid agency ID');
        return;
      }
      
      const result = await updateQCTeamRegistration(agencyId!, apiData);
      
      if (result) {
        console.log('✅ QC team registration updated successfully:', result);
        success('QC Team Registration updated successfully!');
        setShowSuccessBanner(true);
        // Navigate back to QC agency list after showing success message
        setTimeout(() => {
          router.push('/capi/dqm/qc-team-registration');
        }, 2000); // Show banner for 2 seconds before navigating
      } else {
        console.error('❌ Update failed');
        showError('Failed to update QC team registration. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error updating QC team registration:', err);
      showError('Failed to update QC team registration. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/capi/dqm/qc-team-registration');
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Loading State */}
      {isLoadingData && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Text className="text-gray-600">Loading qc team registration data...</Text>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6">
          <SuccessBanner message="QC Team Registration Updated Successfully" />
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            Update QC Team Registration
          </Heading>
        </div>
        <div className="justify-content-center mt-2">
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Main Content - Only show when not loading */}
      {!isLoadingData && (
        <>
          {/* Main Content Card */}
          <Card>
            {/* Card Header */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
                <Heading level={4} className="text-gray-800 font-bold mb-5">
                  Update QC Team Registration
                </Heading>
              </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
              {/* Agency Details Section */}
              <div className="mb-6">
                <Heading level={5} className="text-gray-800 mb-4">
                  QC Team Details
                </Heading>
                
                {/* Row 1 - Agency Name and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="block text-sm font-medium text-gray-700 mb-2">
                      QC Team Name <span className="text-red-500">*</span>
                    </Text>
                    <Input
                      type="text"
                      value={formData.agency_name}
                      onChange={(e) => handleInputChange('agency_name', e.target.value)}
                      placeholder="Enter Agency Name"
                      maxLength={500}
                      required
                    />
                  </div>

                  <div>
                    <Text className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </Text>
                    <SelectDropdown
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', Array.isArray(value) ? value[0] : value)}
                      options={statusOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="my-6 border-gray-200" />

              {/* Agency Supervisor User Details Section */}
              <div className="mb-6">
                <Heading level={5} className="text-gray-800 mb-4">
                  QC Team Supervisor User Details
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
                      placeholder="Enter Agency Login ID"
                      required
                    />
                  </div>

                  <div>
                    <Text className="block text-sm font-medium text-gray-700 mb-2">
                      Password (Optional - leave blank to keep current)
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
                  disabled={loading}
                >
                  {loading ? (
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
                  disabled={loading}
                >
                  Back
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <Text className="text-red-700">{error}</Text>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </Container>
  );
};

export default QCUpdatePage;
