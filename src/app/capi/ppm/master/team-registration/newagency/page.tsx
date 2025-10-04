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
import { Key, Eye, EyeOff } from 'lucide-react';

const NewAgencyPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    agency_name: '',
    qc_agency_id: '',
    show_second_level_column: '',
    status: '1', // Default to Active
    qa_id: '',
    username: '',
    password: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement API call to save agency
    // For now, just log the data
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
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
                  Team Name
                </Text>
                <Input
                  type="text"
                  value={formData.agency_name}
                  onChange={(e) => handleInputChange('agency_name', e.target.value)}
                  placeholder="Enter Team Name"
                  maxLength={500}
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-2">
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Show Second Level Column
                </Text>
                <SelectDropdown
                  value={formData.show_second_level_column}
                  onChange={(value) => handleInputChange('show_second_level_column', Array.isArray(value) ? value[0] : value)}
                  options={showSecondLevelOptions}
                />
              </div>

              <div className="md:col-span-2">
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </Text>
                <SelectDropdown
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', Array.isArray(value) ? value[0] : value)}
                  options={statusOptions}
                />
              </div>

              <div className="md:col-span-6">
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Assurance
                </Text>
                <Input
                  type="number"
                  value={formData.qa_id}
                  onChange={(e) => handleInputChange('qa_id', e.target.value)}
                  placeholder="Enter Quality Assurance ID"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </Text>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter Team Login ID"
                />
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>
                <div className="flex items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter Login Password"
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
            >
              Save
            </Button>
            <Button
              onClick={handleBack}
              variant="destructive"
              className="flex-1"
            >
              Back
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default NewAgencyPage;
