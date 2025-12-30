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
import { useCreateGroupTeamRegistration } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';


const NewTeamPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    is_active: '1', // Default to Active
  });
  const { createGroupTeamRegistration, loading, error } = useCreateGroupTeamRegistration();
  const { success, error: showError } = useToast();


  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ];
  // Note: Group selection is managed by backend; no client-side group selection.

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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
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
    } else if (formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      showError('Please fix the validation errors below');
      return;
    }

    try {
      const result = await createGroupTeamRegistration({
        is_active: parseInt(formData.is_active || '1', 10),
        username: formData.username, // Use username as unique_id
        name: formData.name,
        password: formData.password,
      });

      if (result) {
        setShowSuccessBanner(true);
        // Navigate back to team registration list after showing success message
        setTimeout(() => {
          router.push('/cati/ppm/team-registration');
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
      {/* Hidden fields to prevent browser autofill of login credentials */}
      <div style={{ position: 'absolute', left: -9999, top: 0, height: 0, width: 0, overflow: 'hidden' }} aria-hidden>
        <input type="text" name="fake-username" autoComplete="username" defaultValue="" readOnly />
        <input type="password" name="fake-password" autoComplete="current-password" defaultValue="" readOnly />
      </div>
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6">
          <SuccessBanner message="New Team User Added Successfully" />
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
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter Team Name"
                  maxLength={500}
                  required
                  className={validationErrors.name ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.name && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.name}</Text>
                )}
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  name="team_username"
                  autoComplete="off"
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
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </Text>
                <div className="flex items-center">
                  <Input
                      type={showPassword ? 'text' : 'password'}
                      name="team_password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter Login Password"
                      className={`rounded-r-none ${validationErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
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
                {validationErrors.password && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.password}</Text>
                )}
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </Text>
                <SelectDropdown
                  value={formData.is_active}
                  onChange={(value) => handleInputChange('is_active', Array.isArray(value) ? String(value[0]) : String(value))}
                  options={statusOptions}
                />
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

export default NewTeamPage;
