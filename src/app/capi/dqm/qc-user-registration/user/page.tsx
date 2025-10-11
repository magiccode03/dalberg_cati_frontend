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
import Checkbox from '@/components/ui/Checkbox';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';
import apiClient from '@/lib/api-client';

interface QCUserCreateRequest {
  qc_id: number;
  name: string;
  mobile_number: string;
  status: number;
  audio: number;
  gps: number;
  tele: number;
  clientaudiocheck: number;
}

interface QCUserCreateResponse {
  success: boolean;
  data?: {
    id: number;
    qc_id: number;
    name: string;
    mobile_number: string;
    status: number;
    audio: number;
    gps: number;
    tele: number;
    clientaudiocheck: number;
  };
  message?: string;
  timestamp?: string;
}

const NewQCUserPage = () => {
  const router = useRouter();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    qc_id: '',
    name: '',
    mobile_number: '',
    status: '1', // Default to Active
    audio: false,
    gps: false,
    tele: false,
    clientaudiocheck: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { success, error: showError } = useToast();

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' }
  ];

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Required field validations
    if (!formData.qc_id.trim()) {
      errors.qc_id = 'QC ID is required';
    } else if (formData.qc_id.trim().length < 2) {
      errors.qc_id = 'QC ID must be at least 2 characters';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'QC User Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'QC User Name must be at least 2 characters';
    }
    
    if (!formData.mobile_number.trim()) {
      errors.mobile_number = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobile_number.trim())) {
      errors.mobile_number = 'Mobile Number must be exactly 10 digits';
    }
    
    if (!formData.status) {
      errors.status = 'Please select a status';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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
      setLoading(true);
      setError(null);

      // Prepare API request data
      const requestData: QCUserCreateRequest = {
        qc_id: parseInt(formData.qc_id),
        name: formData.name,
        mobile_number: formData.mobile_number,
        status: parseInt(formData.status),
        audio: formData.audio ? 1 : 0,
        gps: formData.gps ? 1 : 0,
        tele: formData.tele ? 1 : 0,
        clientaudiocheck: formData.clientaudiocheck ? 1 : 0
      };

      console.log('API Request data:', requestData);

      // Make API call
      const response = await apiClient.post('/qc-user-registration/newregistration', requestData);
      const data: QCUserCreateResponse = response.data;

      console.log('API Response:', data);

      if (data.success && data.data) {
        console.log('QC User created successfully:', data.data);
        setShowSuccessBanner(true);
        success(data.message || 'QC user created successfully');
        
        // Navigate back to QC user registration list after showing success message
        setTimeout(() => {
          router.push('/capi/dqm/qc-user-registration');
        }, 2000); // Show banner for 2 seconds before navigating
      } else {
        throw new Error(data.message || 'Failed to create QC user');
      }
      
    } catch (err: any) {
      console.error('Error creating QC user:', err);
      
      let errorMessage = 'Failed to create QC user. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access forbidden. You do not have permission to create QC users.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
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
          <SuccessBanner message="New QC User Added Successfully" />
        </div>
      )}

      {/* Page Title */}
      <Heading level={3} className="mb-6 text-gray-800">
        New QC User
      </Heading>

      {/* Main Content Card */}
      <Card>
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
            <Heading level={4} className="text-gray-800 font-bold mb-5">
              QC User Registration
            </Heading>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* QC User Details Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              QC User Details
            </Heading>
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  QC ID <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  value={formData.qc_id}
                  onChange={(e) => handleInputChange('qc_id', e.target.value)}
                  placeholder="Enter QC ID"
                  required
                  className={validationErrors.qc_id ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.qc_id && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.qc_id}</Text>
                )}
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  QC User Name <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter QC User Name"
                  maxLength={100}
                  required
                  className={validationErrors.name ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.name && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.name}</Text>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  value={formData.mobile_number}
                  onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  required
                  className={validationErrors.mobile_number ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.mobile_number && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.mobile_number}</Text>
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
                  className={validationErrors.status ? 'border-red-500' : ''}
                />
                {validationErrors.status && (
                  <Text className="text-sm text-red-500 mt-1">{validationErrors.status}</Text>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* QC User Access Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              QC User Access
            </Heading>
            
            {/* Access Permissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Checkbox
                  checked={formData.audio}
                  onCheckedChange={(checked) => handleInputChange('audio', checked as boolean)}
                  label="Audio QC"
                />
              </div>

              <div>
                <Checkbox
                  checked={formData.gps}
                  onCheckedChange={(checked) => handleInputChange('gps', checked as boolean)}
                  label="GPS QC"
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

export default NewQCUserPage;
