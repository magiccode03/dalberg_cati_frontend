'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Phone } from 'lucide-react';

interface InterviewData {
  server_id: number;
  ac_code: number;
  ac_name: string;
}

export default function NewQCPage() {
  const router = useRouter();
  const params = useParams();
  const qcId = params.qc_id as string;
  
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qcUserData, setQcUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load QC user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('qc_user_data');
    
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setQcUserData(userData);
        
        // Verify the qc_id matches the URL parameter
        if (userData.qc_id.toString() !== qcId) {
          setError('QC User ID mismatch. Please login again.');
          return;
        }
        
        // Auto-fetch interviews when component mounts
        fetchInterviews(userData);
      } catch (err) {
        console.error('Error parsing QC data:', err);
        setError('Invalid QC user data. Please login again.');
      }
    } else {
      setError('No QC user data found. Please login first.');
    }
  }, [qcId]);

  const fetchInterviews = async (userData?: any, page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Use passed userData or state
      const currentUserData = userData || qcUserData;
      if (!currentUserData) {
        setError('QC user data not found');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const apiUrl = `${apiBaseUrl}/api/capi/interviews/qc-user/${currentUserData.qc_id}?audio_qc_status=3&page=${page}&limit=${pageSize}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Transform API data to our interface
        const interviewList = data.data.map((item: any) => ({
          server_id: item.server_id,
          ac_code: item.ac_code,
          ac_name: item.ac_name
        }));
        
        setInterviews(interviewList);
        setTotalItems(interviewList.length);
        setTotalPages(Math.ceil(interviewList.length / pageSize));
        setCurrentPage(page);
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

  const handleOpenForm = (serverId: number) => {
    // Navigate to QC form page with server_id
    router.push(`/capi/capi-qc/qc-form/${serverId}`);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setInterviews([]);
    fetchInterviews(undefined, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchInterviews(undefined, page);
  };

  const handleBackToLogin = () => {
    // Clear QC user data and redirect to login
    localStorage.removeItem('qc_user_data');
    window.dispatchEvent(new Event('qcUserUpdated'));
    router.push('/capi/capi-qc/qc-auth');
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            New QC
          </Heading>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={handleRefresh} 
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}


      {/* QC Interview Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC Interviews
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> interviews. QC User ID: <span className="font-mono font-semibold">{qcId}</span>
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interviews...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">Server ID</th>
                    <th className="text-center">AC Code</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.length > 0 ? (
                    interviews.map((interview, index) => (
                      <tr key={interview.server_id}>
                        <td className="text-center">{((currentPage - 1) * pageSize) + index + 1}</td>
                        <td className="text-center font-mono font-semibold">
                          {interview.server_id}
                        </td>
                        <td className="text-center">{interview.ac_code}</td>
                        <td className="text-center">{interview.ac_name}</td>
                        <td className="text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenForm(interview.server_id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            title="Open QC Form"
                          >
                            Form
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-1">
                          <Phone className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">No pending QC interviews found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
}