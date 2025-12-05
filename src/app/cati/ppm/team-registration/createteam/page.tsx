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
import { useCreateGroupTeamRegistration } from '@/hooks/useApi';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

interface Groups {
  id: number;
  name: string;
  group_name?: string;
}

const NewTeamPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [groups, setGroups] = useState<Groups[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    is_active: '1', // Default to Active
    group: '',
  });
  const { createGroupTeamRegistration, loading, error } = useCreateGroupTeamRegistration();
  const { success, error: showError } = useToast();


  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ];
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

    if (!formData.group) {
      errors.group = 'Please select a Group';
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
        group: formData.group ? parseInt(formData.group, 10) : undefined,
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
                  {validationErrors.group && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.group}
                    </p>
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
                    value={formData.is_active}
                    onChange={(value) => handleInputChange('is_active', Array.isArray(value) ? String(value[0]) : String(value))}
                    options={statusOptions}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            {/* Team User login Details Section */}
            <div>
              <Heading level={5} className="text-gray-800 mb-4">
                Login Details
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
                      type={ showPassword ? 'text' : 'password' }
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
