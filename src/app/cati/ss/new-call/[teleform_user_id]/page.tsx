'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Phone, ArrowLeft, RefreshCw } from 'lucide-react';

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

export default function NewCallPage() {
  const router = useRouter();
  const params = useParams();
  const teleformUserId = params.teleform_user_id as string;
  
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teleformUserData, setTeleformUserData] = useState<any>(null);

  // Load teleform user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('teleform_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setTeleformUserData(userData);
        
        // Verify the teleform_user_id matches the URL parameter
        if (userData.teleform_user_id.toString() !== teleformUserId) {
          setError('Teleform User ID mismatch. Please login again.');
          return;
        }
        
        // Auto-fetch interviews when component mounts
        fetchInterviews();
      } catch (err) {
        setError('Invalid teleform user data. Please login again.');
      }
    } else {
      setError('No teleform user data found. Please login first.');
    }
  }, [teleformUserId]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      if (!teleformUserData) {
        setError('Teleform user data not found');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cati/interviews/teleform-user/${teleformUserData.id}?status=0&page=1&limit=10`,
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

  const handleConnectToCall = async (interviewId: number, phoneNumber: string) => {
    try {
      console.log('Initiating call:', { interviewId, phoneNumber });
      
      if (!teleformUserData?.mobile_number) {
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
          from: teleformUserData.mobile_number,
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

  const handleRefresh = () => {
    fetchInterviews();
  };

  const handleBackToLogin = () => {
    // Clear teleform user data and redirect to login
    localStorage.removeItem('teleform_user_data');
    router.push('/cati/ss/start-form-filling');
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackToLogin}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
            <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
              New Call - Teleform User ID: {teleformUserId}
            </Heading>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          </Card>
        )}


        {/* New Call Table */}
        <Card>
          <div className="card-body">
            <div className="table-responsive">
              <Table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Server ID</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Phone Number</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Code</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Name</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">District</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Zone</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">MLA</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Electorate</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Call Attempts</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                          <span className="text-gray-500 dark:text-gray-400">Loading interviews...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8">
                        <div className="text-red-500 dark:text-red-400">
                          {error}
                        </div>
                      </td>
                    </tr>
                  ) : interviews.length > 0 ? (
                    interviews.map((interview, index) => (
                      <tr key={interview.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-mono">
                          SRV00{interview.id}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-mono">
                          {interview.phone}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {interview.ac_code}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {interview.ac_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {interview.ac_district_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {interview.ac_zone_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {interview.ac_mla_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {interview.ac_electorate?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            interview.call_attempt > 0 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {interview.call_attempt || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConnectToCall(interview.id, interview.phone)}
                            className="text-white bg-blue-600 hover:bg-blue-700"
                            title="Connect to Call"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          No interviews found.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Summary Card */}
        {interviews.length > 0 && teleformUserData && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
                    Interview Summary
                  </h3>
                  <p className="text-green-800 dark:text-green-400">
                    Total interviews available: <span className="font-bold">{interviews.length}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    User: <span className="font-bold">{teleformUserData.name}</span> | 
                    Phone: <span className="font-mono font-bold">{teleformUserData.mobile_number}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}