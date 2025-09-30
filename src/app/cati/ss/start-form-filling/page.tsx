'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function StartFormFillingPage() {
  const [formData, setFormData] = useState({
    teleform_user_id: '',
    user_phone: ''
  });

  const [errors, setErrors] = useState({
    teleform_user_id: '',
    user_phone: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Implement form submission logic here
      // You can redirect to the next page or make an API call
    }
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            Enter Teleuser ID
          </Heading>
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              {/* Report Days Label */}
              <div>
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Days
                </Text>
              </div>
              
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

                {/* Submit Button */}
                <div className="w-full sm:w-1/3">
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
}
