'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';


export default function StartFormFillingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    teleform_user_id: '',
    user_phone: ''
  });

  const [errors, setErrors] = useState({
    teleform_user_id: '',
    user_phone: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for teleform user data and auto-fill if exists
  useEffect(() => {
    const savedData = localStorage.getItem('teleform_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setFormData({
          teleform_user_id: userData.teleform_user_id.toString(),
          user_phone: userData.mobile_number
        });
      } catch (err) {
        console.error('Error loading teleform user data:', err);
      }
    }
  }, []);

  // Get user ID from user object
  const getUserId = () => {
    return user?.id || '';
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      teleform_user_id: '',
      user_phone: ''
    };

    if (!formData.teleform_user_id.trim()) {
      newErrors.teleform_user_id = 'Teleuser ID is required';
    }

    if (!formData.user_phone.trim()) {
      newErrors.user_phone = 'User Phone No is required';
    } else if (!/^\d{10}$/.test(formData.user_phone.replace(/\D/g, ''))) {
      newErrors.user_phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const verifyTeleformUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return false;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiBaseUrl}/api/teleform-users/verify`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teleform_user_id: parseInt(formData.teleform_user_id),
          mobile_number: formData.user_phone
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Save response data to localStorage
        localStorage.setItem('teleform_user_data', JSON.stringify(data.data));
        
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('teleformUserUpdated'));
        
        // Determine redirect based on user permissions
        const userData = data.data;
        const fillForm = userData.fill_form === 1;
        const qc = userData.qc === 1;
        
        if (fillForm && !qc) {
          // Only Fill Form permission - redirect to new-call
          router.push(`/cati/ss/new-call/${formData.teleform_user_id}`);
        } else if (!fillForm && qc) {
          // Only QC permission - redirect to qc-call
          router.push(`/cati/ss/qc-call/${formData.teleform_user_id}`);
        } else if (fillForm && qc) {
          // Both permissions - default to new-call (Fill Form)
          router.push(`/cati/ss/new-call/${formData.teleform_user_id}`);
        } else {
          // No permissions - show error
          setError('User does not have required permissions');
          return false;
        }
        
        return true;
      } else {
        setError(data.message || 'Verification failed');
        return false;
      }
    } catch (err) {
      console.error('Error verifying teleform user:', err);
      setError('Failed to verify teleform user. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      await verifyTeleformUser();
    }
  };

  const handleClear = () => {
    // Clear teleform user data from localStorage
    localStorage.removeItem('teleform_user_data');
    
    // Dispatch custom event to update header
    window.dispatchEvent(new Event('teleformUserUpdated'));
    
    // Reset form data
    setFormData({
      teleform_user_id: '',
      user_phone: ''
    });
    
    // Clear errors
    setErrors({
      teleform_user_id: '',
      user_phone: ''
    });
    
    // Reset other states
    setIsLoggedIn(false);
    setError('');
    
    console.log('Form cleared and teleform user data removed');
  };

  const handleGoToNewCall = () => {
    // Get teleform_user_id from localStorage or form data
    const teleformUserData = localStorage.getItem('teleform_user_data');
    if (teleformUserData) {
      const userData = JSON.parse(teleformUserData);
      const teleformUserId = userData.teleform_user_id;
      const fillForm = userData.fill_form === 1;
      const qc = userData.qc === 1;
      
      if (fillForm && !qc) {
        // Only Fill Form permission - redirect to new-call
        router.push(`/cati/ss/new-call/${teleformUserId}`);
      } else if (!fillForm && qc) {
        // Only QC permission - redirect to qc-call
        router.push(`/cati/ss/qc-call/${teleformUserId}`);
      } else if (fillForm && qc) {
        // Both permissions - default to new-call (Fill Form)
        router.push(`/cati/ss/new-call/${teleformUserId}`);
      }
    } else {
      // Fallback to form data
      router.push(`/cati/ss/new-call/${formData.teleform_user_id}`);
    }
  };

  // Removed handleBackToLogin function

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Enter Teleuser ID Section */}
        {!isLoggedIn && (
          <>
            {/* Breadcrumb Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="left-content">
                <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
                    Enter Teleuser ID
                </Heading>
              </div>
              <div className="right-content">
                <span className="text-sm text-gray-500 dark:text-gray-400"></span>
              </div>
            </div>

            {/* Form Card */}
            <Card>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                  {/* Report Days Label */}
                  {/* <div>
                    <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Report Days
                    </Text>
                  </div> */}
                  
                  {/* Form Elements Row */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    {/* Teleuser ID Input */}
                    <div className="w-full sm:w-1/3">
                      <Input
                        type="text"
                        id="selectteleform-teleform_user_id"
                        name="teleform_user_id"
                        value={formData.teleform_user_id}
                        onChange={handleInputChange}
                        placeholder="Enter Teleuser ID"
                        className={`w-full ${errors.teleform_user_id ? 'border-red-500' : ''}`}
                        autoComplete="off"
                        required
                      />
                      {errors.teleform_user_id && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.teleform_user_id}
                        </Text>
                      )}
                    </div>

                    {/* User Phone Input */}
                    <div className="w-full sm:w-1/3">
                      <Input
                        type="text"
                        id="selectteleform-user_phone"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleInputChange}
                        placeholder="Enter User Phone No"
                        className={`w-full ${errors.user_phone ? 'border-red-500' : ''}`}
                        autoComplete="off"
                        required
                      />
                      {errors.user_phone && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.user_phone}
                        </Text>
                      )}
                    </div>

                    {/* Submit and Clear Buttons */}
                    <div className="w-full sm:w-1/3 flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={loading}
                        loading={loading}
                      >
                        {loading ? 'Verifying...' : 'Submit'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
                        disabled={loading}
                        className="flex-1 bg-red-50 hover:bg-red-100 border-red-300 text-red-700 hover:text-red-800"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          </Card>
        )}

        {/* Success Section - Show after successful login */}
        {isLoggedIn && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                    Login Successful!
                  </h3>
                  <p className="text-green-800 dark:text-green-400">
                    Welcome, {formData.teleform_user_id}! You can now proceed to view your assigned calls.
                  </p>
                </div>
                <Button
                  onClick={handleGoToNewCall}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  View New Calls
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
