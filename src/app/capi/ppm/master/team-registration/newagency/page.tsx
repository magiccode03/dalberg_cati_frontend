'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateTeamRegistration } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

const NewAgencyPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
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
  const { success, error: showError } = useToast();

  const qcAgencyOptions = [
    { value: '', label: 'Status QC Team' },
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
    if (!formData.agency_name || !formData.show_second_level_column || 
        !formData.username || !formData.password) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      const result = await createTeamRegistration({
        agency_name: formData.agency_name,
        qc_agency_id: parseInt(formData.qc_agency_id || '1'),
        show_second_level_column: parseInt(formData.show_second_level_column),
        status: parseInt(formData.status),
        qa_id: parseInt(formData.qa_id || '0'),
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
                />
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Show Second Level Column <span className="text-red-500">*</span>
                </Text>
                <SelectDropdown
                  value={formData.show_second_level_column}
                  onChange={(value) => handleInputChange('show_second_level_column', Array.isArray(value) ? value[0] : value)}
                  options={showSecondLevelOptions}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Assurance ID
                </Text>
                <Input
                  type="number"
                  value={formData.qa_id}
                  onChange={(e) => handleInputChange('qa_id', e.target.value)}
                  placeholder="Enter QA ID"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Team Supervisor User Details Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              Team Supervisor User Details
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
                  Password <span className="text-red-500">*</span>
                </Text>
                <div className="flex items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter Login Password"
                    className="rounded-r-none"
                    required
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
        </div>
      </Card>
    </Container>
  );
};

export default NewAgencyPage;
