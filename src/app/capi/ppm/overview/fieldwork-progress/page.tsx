'use client';

import React, { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
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

const FieldworkProgressPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [acWiseProgressData, setAcWiseProgressData] = useState<ACWiseProgress[]>([]);

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
        setAcWiseProgressData(result.data.ac_wise_progress);
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
      <div className="main-container container mx-auto px-4 py-6">
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
      </div>
    );
  }

  return (
    <div className="main-container mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="mb-6">
        <Heading level={4}>Fieldwork Progress</Heading>
      </div>

      {/* Progress Summary Card */}
      <div className="row mb-6">
        <div className="col-xl-12">
          <div className="card shadow-sm bg-white rounded-lg border border-gray-200 p-6">
            <div className="card-header pb-0">
              <div className="d-flex justify-content-between">
                <h4 className="card-title mg-b-0 text-lg font-semibold">
                  Progress <em>Summary</em>
                </h4>
                <span className="text-end"></span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">Details</th>
                      <th className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">Measure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressSummaryData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b border-gray-200">{item.details}</td>
                        <td className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">
                          {item.measure}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AC Wise Progress Card */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card shadow-sm bg-white rounded-lg border border-gray-200 p-6">
            <div className="card-header pb-0">
              <div className="d-flex justify-content-between">
                <h4 className="card-title mg-b-0 text-lg font-semibold">
                  AC Wise Progress
                </h4>
                <span className="text-end">
                  <span className="text-sm text-gray-500">
                    Total <strong>243</strong> items.
                  </span>
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <Table bordered striped hover>
                  <thead className="sticky-header bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">AC Code</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">AC Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">District Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">Valid+Under QC</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">Reject</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">% of Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acWiseProgressData.map((item, index) => (
                      <tr key={index} className={`${getRowStyle(item.status)} hover:opacity-90`}>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.ac_code}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 font-medium">
                          {item.ac_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200">
                          {item.district_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.total_achieved}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.rejected_interviews}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.completion_percentage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldworkProgressPage;
