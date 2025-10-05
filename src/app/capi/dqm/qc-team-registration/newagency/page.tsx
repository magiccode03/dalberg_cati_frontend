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
import { Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useCreateQCTeamRegistration } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

const NewQCAgencyPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [formData, setFormData] = useState({
    agency_name: '',
    status: '1', // Default to Active
    username: '',
    password: ''
  });
  const { createQCTeamRegistration, loading, error } = useCreateQCTeamRegistration();
  const { success, error: showError } = useToast();

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
    if (!formData.agency_name || !formData.username || !formData.password) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      const apiData = {
        agency_name: formData.agency_name.trim(),
        status: parseInt(formData.status),
        unique_id: formData.username.trim(),
        password: formData.password.trim()
      };
      
      console.log('🚀 Sending QC Team Registration data:', apiData);
      
      const result = await createQCTeamRegistration(apiData);

      if (result) {
        success('QC Team Registration created successfully!');
        setShowSuccessBanner(true);
        // Navigate back to QC agency list after showing success message
        setTimeout(() => {
          router.push('/capi/dqm/qc-team-registration');
        }, 2000); // Show banner for 2 seconds before navigating
      }
    } catch (err) {
      console.error('Error creating QC team registration:', err);
      showError('Failed to create QC team registration. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/capi/dqm/qc-team-registration');
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6">
          <SuccessBanner message="New QC Team Registration Added Successfully" />
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            New Qc Team Registration
          </Heading>
        </div>
        <div className="justify-content-center mt-2">
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Main Content Card */}
      <Card>
        {/* Card Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
            <Heading level={4} className="text-gray-800 font-bold mb-5">
              QC Team Registration
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

export default NewQCAgencyPage;
