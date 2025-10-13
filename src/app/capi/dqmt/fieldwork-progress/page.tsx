'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { config } from '@/lib/config';

interface ProgressSummary {
  total_sample: number;
  sample_achieved_numbers: number;
  sample_achieved_percentage: number;
  acs_completed: number;
  acs_in_progress: number;
  acs_yet_to_initiate: number;
}

interface ACWiseProgress {
  ac_code: number;
  ac_name: string;
  district_name: string;
  target_sample: number;
  valid_interviews: number;
  under_qc_interviews: number;
  total_achieved: number;
  rejected_interviews: number;
  completion_percentage: string;
  status: string;
}

interface APIResponse {
  success: boolean;
  data: {
    summary: ProgressSummary;
    ac_wise_progress: ACWiseProgress[];
  };
  message: string;
  timestamp: string;
}

export default function FieldworkProgressPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [acProgressData, setAcProgressData] = useState<ACWiseProgress[]>([]);

  useEffect(() => {
    fetchFieldworkProgress();
  }, []);

  const fetchFieldworkProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken') || '';
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${config.api.baseUrl}${config.api.version}/dataquality`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse = await response.json();

      if (result.success && result.data) {
        setSummary(result.data.summary);
        setAcProgressData(result.data.ac_wise_progress);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching fieldwork progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Transform summary data for display
  const progressSummaryData = summary ? [
    { details: 'Total Sample', measure: summary.total_sample.toString() },
    { details: 'Sample Achieved (Numbers)', measure: summary.sample_achieved_numbers.toString() },
    { details: 'Sample Achieved (%)', measure: summary.sample_achieved_percentage.toString() },
    { details: 'ACs completed', measure: summary.acs_completed.toString() },
    { details: 'ACs not completed', measure: summary.acs_in_progress.toString() },
    { details: 'ACs yet to be initiated', measure: summary.acs_yet_to_initiate.toString() },
  ] : [];

  const getRowStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white';
      case 'in_progress':
      return 'bg-orange-500 text-white';
      case 'yet_to_initiate':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-white text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading data</p>
          <p>{error}</p>
          <button 
            onClick={fetchFieldworkProgress}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={2} className="text-2xl font-semibold text-gray-900">
            Fieldwork Progress
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Progress Summary Card */}
      <Card className="p-0 mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              Progress <i>Summary</i>
            </Heading>
            </div>
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
                    <td>{item.measure}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>

      {/* AC Wise Progress Card */}
      <Card className="p-0">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              AC Wise Progress
            </Heading>
            </div>
            <span className="text-end">
              {/* Download button can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <b>243</b> items.
              </Text>
            </div>
            
            <Table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-center">AC Code</th>
                  <th className="text-left">AC Name</th>
                  <th className="text-left">District Name</th>
                  <th className="text-center">Valid+Under QC</th>
                  <th className="text-center">Reject</th>
                  <th className="text-center">% of Completion</th>
                </tr>
              </thead>
              <tbody>
                {acProgressData.map((ac, index) => (
                  <tr key={ac.ac_code} className={getRowStyle(ac.status)}>
                    <td className="text-center">{ac.ac_code}</td>
                    <td className="text-left">{ac.ac_name}</td>
                    <td className="text-left">{ac.district_name}</td>
                    <td className="text-center">{ac.total_achieved}</td>
                    <td className="text-center">{ac.rejected_interviews}</td>
                    <td className="text-center">{ac.completion_percentage}</td>
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
