'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateTeamRegistration, useGetQCAgencies } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

const NewAgencyPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    agency_name: '',
    qc_agency_id: '',
    show_second_level_column: '',
    status: '1', // Default to Active
    qa_id: '',
    username: '',
    password: ''
  });
  const { createTeamRegistration, loading, error } = useCreateTeamRegistration();
  const { getQCAgencies, data: qcAgenciesData, loading: qcAgenciesLoading, error: qcAgenciesError } = useGetQCAgencies();
  const { success, error: showError } = useToast();

  // Dynamic QC agency options from API
  const qcAgencyOptions = qcAgenciesData ? [
    { value: '', label: 'Select QC Team' },
    ...qcAgenciesData.map(agency => ({
      value: agency.id.toString(),
      label: `${agency.agency_name} (${agency.username})`
    }))
  ] : [
    { value: '', label: 'Select QC Team' },
    { value: '1', label: 'Internal (bhr2internalqc)' },
    { value: '2', label: 'Kadence (bhr2kadenceqc)' }
  ];

  const showSecondLevelOptions = [
    { value: '', label: 'Show 2nd Level Column(s)' },
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' }
  ];

  const statusOptions = [
    { value: '', label: 'Status Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ];

  // Fetch QC agencies on component mount
  useEffect(() => {
    getQCAgencies();
  }, [getQCAgencies]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Required field validations
    if (!formData.agency_name.trim()) {
      errors.agency_name = 'Team Name is required';
    } else if (formData.agency_name.trim().length < 2) {
      errors.agency_name = 'Team Name must be at least 2 characters';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.qc_agency_id) {
      errors.qc_agency_id = 'Please select a QC Team';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data:', formData); // Debug log
    
    // Validate form before submission
    if (!validateForm()) {
      showError('Please fix the validation errors below');
      return;
    }

    try {
      const result = await createTeamRegistration({
        agency_name: formData.agency_name,
        qc_agency_id: parseInt(formData.qc_agency_id || '1'),
        show_second_level_column: 1, // Default value since field is hidden
        status: parseInt(formData.status),
        qa_id: parseInt(formData.qa_id || '1'), // Default value since field is hidden
        unique_id: formData.username, // Use username as unique_id
        first_name: formData.username, // Use username as first_name
        last_name: formData.username, // Use username as last_name
        email: `${formData.username}@example.com`, // Generate email from username
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
      console.error('Error creating team registration:', err);
      showError('Failed to create team registration. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6">
          <SuccessBanner message="New Agency Added Successfully" />
        </div>
      )}

      {/* Page Title */}
      <Heading level={3} className="mb-6 text-gray-800">
        New Team
      </Heading>

      {/* Main Content Card */}
      <Card>
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
            <Heading level={4} className="text-gray-800 font-bold mb-5">
              Team Registration
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
                  className={validationErrors.agency_name ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.agency_name && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.agency_name}</Text>
                )}
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  QC Team <span className="text-red-500">*</span>
                </Text>
                <SelectDropdown
                  value={formData.qc_agency_id}
                  onChange={(value) => handleInputChange('qc_agency_id', Array.isArray(value) ? value[0] : value)}
                  options={qcAgencyOptions}
                  disabled={qcAgenciesLoading}
                  placeholder={qcAgenciesLoading ? "Loading QC teams..." : "Select QC Team"}
                  className={validationErrors.qc_agency_id ? 'border-red-500' : ''}
                />
                {validationErrors.qc_agency_id && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.qc_agency_id}</Text>
                )}
                {qcAgenciesLoading && (
                  <Text className="text-sm text-gray-500 mt-1">Loading QC teams...</Text>
                )}
                {qcAgenciesError && (
                  <Text className="text-sm text-red-500 mt-1">Failed to load QC teams</Text>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Status
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
                  className={validationErrors.username ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.username && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.username}</Text>
                )}
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </Text>
                <div className="flex items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter Login Password"
                    className={`rounded-r-none ${validationErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="primary"
                    className="rounded-none border-l-0 bg-green-600 hover:bg-green-700"
                    title="Password"
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
                {validationErrors.password && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.password}</Text>
                )}
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
                  Saving...
                </div>
              ) : (
                'Save'
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

          {/* QC Agencies Error Display */}
          {qcAgenciesError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                <Text className="text-yellow-700">
                  Warning: Could not load QC teams. Using default values. ({qcAgenciesError})
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default NewAgencyPage;
