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
    qc_id: '',
    mobile_number: ''
  });

  const [errors, setErrors] = useState({
    qc_id: '',
    mobile_number: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for QC user data and set login state if exists
  useEffect(() => {
    const savedData = localStorage.getItem('qc_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        // Set login state to show success section
        setIsLoggedIn(true);
        setFormData(prev => ({
          ...prev,
          qc_id: userData.qc_id || ''
        }));
      } catch (err) {
        console.error('Error loading QC user data:', err);
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
      qc_id: '',
      mobile_number: ''
    };

    if (!formData.qc_id.trim()) {
      newErrors.qc_id = 'QC User ID is required';
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'User Phone No is required';
    } else if (!/^\d{10}$/.test(formData.mobile_number.replace(/\D/g, ''))) {
      newErrors.mobile_number = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const verifyQCUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return false;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qc-user-registration/verify`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qc_id: parseInt(formData.qc_id),
          mobile_number: formData.mobile_number
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.data) {
        // Save response data to localStorage
        localStorage.setItem('qc_user_data', JSON.stringify(data.data.data));
        
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('qcUserUpdated'));
        
        // Set login state to show success section
        setIsLoggedIn(true);
        
        return true;
      } else {
        setError(data.message || data.data?.message || 'Verification failed');
        return false;
      }
    } catch (err) {
      console.error('Error verifying QC user:', err);
      setError('Failed to verify QC user. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      await verifyQCUser();
    }
  };

  const handleClear = () => {
    // Clear QC user data from localStorage
    localStorage.removeItem('qc_user_data');
    
    // Dispatch custom event to update header
    window.dispatchEvent(new Event('qcUserUpdated'));
    
    // Reset form data
    setFormData({
      qc_id: '',
      mobile_number: ''
    });
    
    // Clear errors
    setErrors({
      qc_id: '',
      mobile_number: ''
    });
    
    // Reset other states
    setIsLoggedIn(false);
    setError('');
    
    console.log('Form cleared and QC user data removed');
  };

  const handleContinue = () => {
    // Get qc_id from localStorage or form data
    const qcUserData = localStorage.getItem('qc_user_data');
    const qcId = qcUserData 
      ? JSON.parse(qcUserData).qc_id 
      : formData.qc_id;
    
    router.push(`/capi/capi-qc/new-qc/${qcId}`);
  };

  // Removed handleBackToLogin function

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Enter QC User ID Section */}
        {!isLoggedIn && (
          <>
            {/* Breadcrumb Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="left-content">
                <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
                    Enter QC User ID
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
                    {/* QC User ID Input */}
                    <div className="w-full sm:w-1/3">
                      <Input
                        type="text"
                        id="selectteleform-qc_id"
                        name="qc_id"
                        value={formData.qc_id}
                        onChange={handleInputChange}
                        placeholder="Enter QC User ID"
                        className={`w-full ${errors.qc_id ? 'border-red-500' : ''}`}
                        autoComplete="off"
                        required
                      />
                      {errors.qc_id && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.qc_id}
                        </Text>
                      )}
                    </div>

                    {/* User Phone Input */}
                    <div className="w-full sm:w-1/3">
                      <Input
                        type="text"
                        id="selectteleform-mobile_number"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleInputChange}
                        placeholder="Enter User Phone No"
                        className={`w-full ${errors.mobile_number ? 'border-red-500' : ''}`}
                        autoComplete="off"
                        required
                      />
                      {errors.mobile_number && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.mobile_number}
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
                    Verification Successful!
                  </h3>
                  <p className="text-green-800 dark:text-green-400">
                    Welcome! QC User ID: {formData.qc_id} has been verified successfully.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="border-green-600 text-green-700 hover:bg-green-100"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
