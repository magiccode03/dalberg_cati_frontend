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


export default function DataEntryLandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    data_entry_id: '',
    user_phone: ''
  });

  const [errors, setErrors] = useState({
    data_entry_id: '',
    user_phone: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for data entry user data and auto-fill if exists
  useEffect(() => {
    const savedData = localStorage.getItem('data_entry_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setFormData({
          data_entry_id: userData.data_entry_user_id.toString(),
          user_phone: userData.mobile_number
        });
      } catch (err) {
        console.error('Error loading data entry user data:', err);
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
      data_entry_id: '',
      user_phone: ''
    };

    if (!formData.data_entry_id.trim()) {
      newErrors.data_entry_id = 'Data Entry ID is required';
    }

    if (!formData.user_phone.trim()) {
      newErrors.user_phone = 'User Phone No is required';
    } else if (!/^\d{10}$/.test(formData.user_phone.replace(/\D/g, ''))) {
      newErrors.user_phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const verifyDataEntryUser = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return false;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiBaseUrl}/api/data-entry-users/verify`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data_entry_user_id: parseInt(formData.data_entry_id),
          mobile_number: formData.user_phone
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Save response data to localStorage
        localStorage.setItem('data_entry_user_data', JSON.stringify(data.data));
        
        // Dispatch custom event to update header
        window.dispatchEvent(new Event('dataEntryUserUpdated'));
        
        // Determine redirect based on user permissions
        const userData = data.data;
        const fillForm = userData.fill_form === 1;
        const qc = userData.qc === 1;
        
        if (fillForm && !qc) {
          // Only Fill Form permission - redirect to data-entry-list
          router.push(`/cati/ss/data-entry-list/${formData.data_entry_id}`);
        } else if (!fillForm && qc) {
          // Only QC permission - redirect to data-entry-list
          router.push(`/cati/ss/data-entry-list/${formData.data_entry_id}`);
        } else if (fillForm && qc) {
          // Both permissions - default to data-entry-list (Fill Form)
          router.push(`/cati/ss/data-entry-list/${formData.data_entry_id}`);
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
      console.error('Error verifying data entry user:', err);
      setError('Failed to verify data entry user. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      await verifyDataEntryUser();
    }
  };

  const handleClear = () => {
    // Clear data entry user data from localStorage
    localStorage.removeItem('data_entry_user_data');
    
    // Dispatch custom event to update header
    window.dispatchEvent(new Event('dataEntryUserUpdated'));
    
    // Reset form data
    setFormData({
      data_entry_id: '',
      user_phone: ''
    });
    
    // Clear errors
    setErrors({
      data_entry_id: '',
      user_phone: ''
    });
    
    // Reset other states
    setIsLoggedIn(false);
    setError('');
    
    console.log('Form cleared and data entry user data removed');
  };

  const handleGoToNewCall = () => {
    // Get data_entry_id from localStorage or form data
    const dataEntryUserData = localStorage.getItem('data_entry_user_data');
    if (dataEntryUserData) {
      const userData = JSON.parse(dataEntryUserData);
      const dataEntryId = userData.data_entry_user_id;
      const fillForm = userData.fill_form === 1;
      const qc = userData.qc === 1;
      
      if (fillForm && !qc) {
        // Only Fill Form permission - redirect to data-entry-list
        router.push(`/cati/ss/data-entry-list/${dataEntryId}`);
      } else if (!fillForm && qc) {
        // Only QC permission - redirect to data-entry-list
        router.push(`/cati/ss/data-entry-list/${dataEntryId}`);
      } else if (fillForm && qc) {
        // Both permissions - default to data-entry-list (Fill Form)
        router.push(`/cati/ss/data-entry-list/${dataEntryId}`);
      }
    } else {
      // Fallback to form data
      router.push(`/cati/ss/data-entry-list/${formData.data_entry_id}`);
    }
  };

  // Removed handleBackToLogin function

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Enter Data Entry ID Section */}
        {!isLoggedIn && (
          <>
            {/* Breadcrumb Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="left-content">
                <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
                    Enter Data Entry ID
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
                    {/* Data Entry ID Input */}
                    <div className="w-full sm:w-1/3">
                      <Input
                        type="text"
                        id="selectdataentry-data_entry_id"
                        name="data_entry_id"
                        value={formData.data_entry_id}
                        onChange={handleInputChange}
                        placeholder="Enter Data Entry ID"
                        className={`w-full ${errors.data_entry_id ? 'border-red-500' : ''}`}
                        autoComplete="off"
                        required
                      />
                      {errors.data_entry_id && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.data_entry_id}
                        </Text>
                      )}
                    </div>

                    {/* User Phone Input */}
                    <div className="w-full sm:w-1/3">
                      <Input
                        type="text"
                        id="selectdataentry-user_phone"
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
                    Welcome, {formData.data_entry_id}! You can now proceed to view your assigned calls.
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