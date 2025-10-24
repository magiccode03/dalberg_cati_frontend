'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';
import apiClient from '@/lib/api-client';

interface QCUserUpdateRequest {
  qc_id: number;
  name: string;
  mobile_number: string;
  status: number;
  audio: number;
  gps: number;
  tele: number;
  clientaudiocheck: number;
}

interface QCUserUpdateRequestBody {
  qc_id: number;
  name: string;
  mobile_number: string;
  status: number;
  audio: number;
  gps: number;
  tele: number;
  clientaudiocheck: number;
}

interface QCUserUpdateResponse {
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
    updated_at: string;
  };
  message?: string;
  error?: string;
  timestamp?: string;
}

const QCUserUpdatePage = ({ params }: { params: Promise<{ qc_user_id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const qcUserId = resolvedParams.qc_user_id;
  
  const [loading, setLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [formData, setFormData] = useState({
    qc_id: '',
    name: '',
    mobile_number: '',
    status: '1',
    audio: false,
    gps: false,
    tele: false,
    clientaudiocheck: false
  });
  
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { success, error: showError } = useToast();
  
  // Ref to prevent multiple simultaneous API calls
  const fetchDataRef = useRef(false);

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' }
  ];

  // Fetch QC user data on component mount - only once
  useEffect(() => {
    if (qcUserId && !fetchDataRef.current && fetchLoading) {
      fetchDataRef.current = true;
      fetchQCUserData();
    } else if (!qcUserId) {
      showError('No QC user ID provided');
      router.push('/capi/dqm/qc-user-registration');
    }
  }, [qcUserId]); // Only depend on qcUserId

  const fetchQCUserData = async () => {
    if (!qcUserId) {
      showError('No QC user ID provided');
      router.push('/capi/dqm/qc-user-registration');
      return;
    }

    try {
      setFetchLoading(true);
      setFetchError(null);
      
      console.log('🔍 Fetching QC user data for ID:', qcUserId);
      
      // Make API call to fetch QC user data
      const response = await apiClient.get(`/qc-user-registration/${qcUserId}`);
      const data = response.data;
      
      console.log('📊 API Response:', data);
      
      if (data.success && data.data) {
        const qcUserData = data.data;
        console.log('✅ QC user data received:', qcUserData);
        
        // Map API response to form data
        const mappedData = {
          qc_id: qcUserData.qc_id?.toString() || '',
          name: qcUserData.name || '',
          mobile_number: qcUserData.mobile_number || '',
          status: qcUserData.status === 'Active' ? '1' : '2',
          audio: qcUserData.access_permissions?.audio_qc || false,
          gps: qcUserData.access_permissions?.gps_qc || false,
          tele: qcUserData.access_permissions?.tele_qc || false,
          clientaudiocheck: qcUserData.access_permissions?.rechecking || false
        };
        
        console.log('✅ Mapped form data:', mappedData);
        setFormData(mappedData);
      } else {
        console.error('❌ No QC user data received from API');
        setFetchError('Failed to fetch QC user data - no data returned');
      }
    } catch (err: any) {
      console.error('❌ Error fetching QC user data:', err);
      
      let errorMessage = 'Failed to fetch QC user data';
      
      if (err.response?.status === 404) {
        errorMessage = `QC User with ID ${qcUserId} not found`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setFetchError(errorMessage);
     } finally {
       setFetchLoading(false);
       fetchDataRef.current = false; // Reset the flag after completion
     }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.qc_id.trim()) {
      errors.qc_id = 'QC ID is required';
    } else if (!/^\d+$/.test(formData.qc_id.trim())) {
      errors.qc_id = 'QC ID must be a number';
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
    } else if (!['1', '2'].includes(formData.status)) {
      errors.status = 'Status must be Active (1) or Inactive (2)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qcUserId) {
      showError('No QC user ID provided');
      return;
    }
    
    // Validate QC user ID format
    if (!/^\d+$/.test(qcUserId)) {
      showError('Invalid QC user ID format');
      return;
    }
    
    console.log('Updating QC user:', qcUserId, 'with data:', formData);
    
    // Validate form
    if (!validateForm()) {
      showError('Please fix the validation errors below');
      return;
    }

    try {
      setLoading(true);
      setUpdateError(null);

      // Prepare API request data
      const requestData: QCUserUpdateRequestBody = {
        qc_id: parseInt(formData.qc_id),
        name: formData.name.trim(),
        mobile_number: formData.mobile_number.trim(),
        status: parseInt(formData.status),
        audio: formData.audio ? 1 : 0,
        gps: formData.gps ? 1 : 0,
        tele: formData.tele ? 1 : 0,
        clientaudiocheck: formData.clientaudiocheck ? 1 : 0
      };

      console.log('API Request data:', requestData);
      console.log('API Endpoint:', `/qc-user-registration/${qcUserId}`);
      console.log('Form data before processing:', formData);
      console.log('QC User ID from URL:', qcUserId);

      // Make API call
      const response = await apiClient.put(`/qc-user-registration/${qcUserId}`, requestData);
      const data: QCUserUpdateResponse = response.data;

      console.log('API Response:', data);

      if (data.success && data.data) {
        console.log('QC User updated successfully:', data.data);
        setShowSuccessBanner(true);
        success(data.message || 'QC user updated successfully');
        
        // Navigate back to QC user registration list after showing success message
        setTimeout(() => {
          router.push('/capi/dqm/qc-user-registration');
        }, 2000); // Show banner for 2 seconds before navigating
      } else {
        throw new Error(data.error || data.message || 'Failed to update QC user');
      }
      
    } catch (err: any) {
      console.error('Error updating QC user:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Full error object:', err);
      
      // Log validation errors if they exist
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
      }
      if (err.response?.data?.validation_errors) {
        console.error('Validation errors (alt):', err.response.data.validation_errors);
      }
      
      let errorMessage = 'Failed to update QC user. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access forbidden. You do not have permission to update QC users.';
      } else if (err.response?.status === 409) {
        // Handle conflict errors (like QC ID already exists)
        errorMessage = err.response?.data?.error || err.response?.data?.message || 'Conflict: The QC ID already exists. Please choose a different QC ID.';
      } else if (err.response?.status === 422) {
        // Handle validation errors
        const validationErrors = err.response?.data?.errors || err.response?.data?.validation_errors;
        if (validationErrors && typeof validationErrors === 'object') {
          const errorMessages = Object.entries(validationErrors).map(([field, messages]) => {
            const fieldMessages = Array.isArray(messages) ? messages.join(', ') : messages;
            return `${field}: ${fieldMessages}`;
          });
          errorMessage = `Validation failed: ${errorMessages.join('; ')}`;
        } else {
          errorMessage = err.response?.data?.error || err.response?.data?.message || 'Validation failed. Please check your input.';
        }
      } else if (err.response?.status === 404) {
        // Handle not found errors
        errorMessage = err.response?.data?.error || err.response?.data?.message || `QC User with ID ${qcUserId} not found. Please check if the user exists or if you have permission to access it.`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setUpdateError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/capi/dqm/qc-user-registration');
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading QC user data...</Text>
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
            <Heading level={3} className="text-red-600 mb-2">Error Loading QC User Data</Heading>
            <Text className="text-gray-600 mb-4">{fetchError}</Text>
            <div className="flex space-x-3 justify-center">
              <Button 
                onClick={() => fetchQCUserData()} 
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
          <SuccessBanner message="QC User Updated Successfully" />
        </div>
      )}

      {/* Page Title */}
      <Heading level={3} className="mb-6 text-gray-800">
        Update QC User: {formData.name}
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
                  QC ID <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(Cannot be changed)</span>
                </Text>
                <Input
                  type="text"
                  value={formData.qc_id}
                  onChange={(e) => handleInputChange('qc_id', e.target.value)}
                  placeholder="Enter QC ID"
                  required
                  readOnly
                  className={`bg-gray-100 ${validationErrors.qc_id ? 'border-red-500' : ''}`}
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
                  className={validationErrors.name ? 'border-red-500' : ''}
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
                  className={validationErrors.mobile_number ? 'border-red-500' : ''}
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
          {updateError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <Text className="text-red-700">{updateError}</Text>
              </div>
              {updateError.includes('not found') && (
                <div className="mt-3">
                  <Button
                    onClick={handleBack}
                    variant="secondary"
                    size="sm"
                  >
                    Go Back to QC User List
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default QCUserUpdatePage;
