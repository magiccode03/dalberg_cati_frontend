'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import apiClient from '@/lib/api-client';

interface ProgressSummary {
  details: string;
  measure: string | number;
}

interface ACProgress {
  acCode: number;
  acName: string;
  districtName: string;
  validUnderQc: number;
  reject: number;
  completionPercent: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    summary: {
      total_sample: number;
      sample_achieved_numbers: number;
      sample_achieved_percentage: number;
      acs_completed: number;
      acs_in_progress: number;
      acs_yet_to_initiate: number;
    };
    ac_wise_progress: Array<{
      ac_code: number;
      ac_name: string;
      district_name: string;
      valid_interviews: number;
      rejected_interviews: number;
      completion_percentage: number;
    }>;
  };
  error?: string;
  timestamp?: string;
}

export default function FieldworkProgressPage() {
  const [progressSummaryData, setProgressSummaryData] = useState<ProgressSummary[]>([]);
  const [acProgressData, setAcProgressData] = useState<ACProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug: Check if token exists
        const token = localStorage.getItem('accessToken');
        console.log('Access token exists:', !!token);
        console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
        
        // Try different possible endpoints
        let response;
        let data: APIResponse;
        
        try {
          response = await apiClient.get('/dataquality');
          data = response.data;
        } catch (firstError) {
          console.log('First endpoint failed, trying alternatives...');
          try {
            response = await apiClient.get('/fieldwork-progress');
            data = response.data;
          } catch (secondError) {
            response = await apiClient.get('/progress');
            data = response.data;
          }
        }
        
        console.log('API Response:', data);
        console.log('Response success:', data.success);
        console.log('Response data:', data.data);
        
        // Handle different response structures
        if (data.success && data.data) {
          // Transform summary data
          const summaryData: ProgressSummary[] = [
            { details: 'Total Sample', measure: data.data.summary.total_sample },
            { details: 'Sample Achieved (Numbers)', measure: data.data.summary.sample_achieved_numbers },
            { details: 'Sample Achieved (%)', measure: data.data.summary.sample_achieved_percentage },
            { details: 'ACs completed', measure: data.data.summary.acs_completed },
            { details: 'ACs not completed', measure: data.data.summary.acs_in_progress },
            { details: 'ACs yet to be initiated', measure: data.data.summary.acs_yet_to_initiate }
          ];
          setProgressSummaryData(summaryData);

          // Transform AC progress data
          const acData: ACProgress[] = data.data.ac_wise_progress.map(ac => ({
            acCode: ac.ac_code,
            acName: ac.ac_name,
            districtName: ac.district_name,
            validUnderQc: ac.valid_interviews,
            reject: ac.rejected_interviews,
            completionPercent: ac.completion_percentage
          }));
          setAcProgressData(acData);
        } else if (data.error) {
          setError(data.error);
        } else {
          // Try alternative endpoints or data structures
          console.log('Trying alternative data structure...');
          setError('No data available or unexpected response format');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access forbidden. You do not have permission to view this data.');
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || 'An error occurred while fetching data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRowStyle = (completionPercent: number) => {
    if (completionPercent >= 100) {
      return 'bg-green-500 text-white';
    } else if (completionPercent >= 50) {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-gray-100 text-gray-900';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Text className="text-gray-600">Loading fieldwork progress data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <Card className="mb-6">
          <div className="card-body text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Fieldwork Progress
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Progress Summary Card */}
      <Card className="mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3"></div> 
            <Heading level={4} className="card-title mg-b-0">
              Progress <i>Summary</i>
            </Heading>
            <span className="text-end">
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Measure</th>
                </tr>
              </thead>
              <tbody>
                {progressSummaryData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.details}</td>
                    {/* <td>{item.measure}</td> */}
                    <td>0</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>

      {/* AC Wise Progress Card */}
      <Card>
        <div className="card-header pb-0 mb-6">
          <div className="flex items-center">
          <div className="w-1 h-6 bg-green-500 mr-3"></div> 
            <Heading level={4} className="card-title mg-b-0">
              AC Wise Progress
            </Heading>
            <span className="text-end">
              {/* Download button can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <b>{acProgressData.length}</b> items.
              </Text>
            </div>
            
            <Table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-center">AC Code</th>
                  <th>AC Name</th>
                  <th>District Name</th>
                  <th className="text-center">Valid+Under QC</th>
                  <th className="text-center">Reject</th>
                  <th className="text-center">% of Completion</th>
                </tr>
              </thead>
              <tbody>
                {acProgressData.map((ac, index) => (
                  <tr key={ac.acCode} className={getRowStyle(ac.completionPercent)}>
                    <td className="text-center">{ac.acCode}</td>
                    <td>{ac.acName}</td>
                    <td>{ac.districtName}</td>
                    <td className="text-center">{ac.validUnderQc}</td>
                    <td className="text-center">{ac.reject}</td>
                    <td className="text-center">{ac.completionPercent}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Container>
  );
}
