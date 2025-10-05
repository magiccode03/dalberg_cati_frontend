'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CallData {
  id: number;
  serverId: string;
  webForm: string;
  respondentName: string;
  callAttempt?: number;
  rescheduleDateTime?: string;
}

interface InterviewData {
  id: number;
  phone: string;
  ac_code: number;
  ac_name: string;
  ac_district_name: string;
  ac_zone_name: string;
  ac_mla_name: string;
  ac_electorate: number;
  status: number;
  call_attempt: number;
  call_received: number;
}

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
  const [showTable, setShowTable] = useState(false);
  const [activeTab, setActiveTab] = useState('new-calls');
  const [showNewCallSection, setShowNewCallSection] = useState(false);
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill form fields if user role is "ss"
  useEffect(() => {
    if (user && user.role === 'ss') {
      setFormData({
        teleform_user_id: user.uniqueId || '',
        user_phone: user.mobile || ''
      });
    }
  }, [user]);

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

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Get user ID from the user object
      const userId = getUserId();
      if (!userId) {
        setError('User ID not found');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cati/interviews/teleform-user/${userId}?status=0&page=1&limit=10`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data?.data) {
        // Transform API data to our interface
        const interviewList = data.data.data.map((item: any) => ({
          id: item.id,
          phone: item.phone,
          ac_code: item.ac_code,
          ac_name: item.ac_name,
          ac_district_name: item.ac_district_name,
          ac_zone_name: item.ac_zone_name,
          ac_mla_name: item.ac_mla_name,
          ac_electorate: item.ac_electorate,
          status: item.status,
          call_attempt: item.call_attempt,
          call_received: item.call_received
        }));
        
        setInterviews(interviewList);
        setIsLoggedIn(true);
        setShowTable(true);
        setShowNewCallSection(true);
      } else {
        setError(data.message || 'Failed to fetch interviews');
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to fetch interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      console.log('Fetching interviews for user ID:', getUserId());
      fetchInterviews();
    }
  };

  const handleClear = () => {
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
    setShowTable(false);
    setShowNewCallSection(false);
    setInterviews([]);
    setError('');
    
    console.log('Form cleared');
  };

  const handleConnectToCall = async (interviewId: number, phoneNumber: string) => {
    try {
      console.log('Initiating call:', { interviewId, phoneNumber });
      
      // Get from phone from form data
      const fromPhone = formData.user_phone;
      
      if (!fromPhone) {
        alert('User phone number not found');
        return;
      }
      
      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Authentication required');
        return;
      }
      
      // Call click-to-call API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/click-to-call/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromPhone,
          to: phoneNumber
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Call initiated successfully:', data);
        alert(`Call initiated successfully! Call ID: ${data.data.callId}`);
        
        // Navigate to tele-form page with interview ID after successful call initiation
        router.push(`/cati/ss/tele-form/${interviewId}`);
      } else {
        console.error('Call initiation failed:', data);
        alert(`Call initiation failed: ${data.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call. Please try again.');
    }
  };

  // Removed handleBackToLogin function

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Enter Teleuser ID Section - Show only when New Call section is hidden */}
        {!showNewCallSection && (
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
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
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


        {/* New Call Section - Show only after form submission */}
        {showNewCallSection && (
          <>
            <div className="mt-10 flex justify-between items-center mb-6">
              <div className="left-content">
                <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
                  New Call
                </Heading>
              </div>
              <div className="right-content">
                <span className="text-sm text-gray-500 dark:text-gray-400"></span>
              </div>
            </div>
        <Card>
          <div className="card-body">
            <div className="table-responsive">
              <Table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Server ID</th>
                    <th className="action-column">Connect To Call</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          Loading interviews...
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <div className="text-red-500 dark:text-red-400">
                          {error}
                        </div>
                      </td>
                    </tr>
                  ) : isLoggedIn && showTable && interviews.length > 0 ? (
                    interviews.map((interview) => (
                      <tr key={interview.id}>
                        <td>{interview.id}</td>
                        <td>SRV00{interview.id}</td>
                        <td className="text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConnectToCall(interview.id, interview.phone)}
                            className="text-white"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          {isLoggedIn && showTable ? 'No interviews found.' : 'Please login to view data.'}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>
          </>
        )}
      </div>
    </Container>
  );
}
