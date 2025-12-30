'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { apiService } from '@/lib/api';

interface DashboardData {
  survey_start_date: string;
  survey_end_date: string;
  total_no_of_days: number;
  total_sample_to_be_achieved: number;
  total_interviews_conducted: number;
  total_valid_interviews: number;
  balance_sample_to_be_achieved: number;
  interviewers_on_field: number;
  total_rejections: number;
}

interface StatusBreakdown {
  gps_check_pending: number;
  under_qc: number;
  due_to_auto_checks: number;
  due_to_tbc: number;
  due_to_gps_checks: number;
  interviews_without_phone: number;
}

interface ACProgress {
  acs_yet_to_start: number;
  acs_in_progress: number;
  acs_completed: number;
  min_sample_per_ac: number;
  ac_sample: number;
}

interface PollingStations {
  total_polling_stations_sampled: number;
  polling_stations_yet_to_start: number;
  polling_stations_in_progress: number;
  polling_stations_completed: number;
  ps_sample: number;
}

export default function PMTDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown | null>(null);
  const [acProgress, setAcProgress] = useState<ACProgress | null>(null);
  const [pollingStations, setPollingStations] = useState<PollingStations | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [overviewRes, statusRes, acRes, psRes] = await Promise.all([
          apiService.getDashboardOverview(),
          apiService.getStatusBreakdown(),
          apiService.getACProgress(),
          apiService.getPollingStations()
        ]);

        setDashboardData(overviewRes.data);
        setStatusBreakdown(statusRes.data);
        setAcProgress(acRes.data);
        setPollingStations(psRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handlePopup = (type: string, value: string) => {
    console.log(`Opening popup for ${type}:`, value);
    // Implement modal/popup logic here
    alert(`Simulating popup for ${type}: ${value}`);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      return 'N/A';
    }
  };

  if (user?.role !== 'pmt' && user?.role !== 'super_admin') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access the PMT Dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert type="error" title="Error Loading Dashboard">
          {error}
        </Alert>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          PMT Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Performance monitoring and field status reports
        </p>
      </div>

      <div className="row row-sm">
        <div className="col-xl-12">
          <Card>
            <div className="card-body">
              <div className="table-responsive">
                <table id="report" className="table table-bordered mg-b-0 text-md-nowrap">
                  <thead>
                    <tr>
                      <th className="fw-bold bg-primary text-white" style={{width: '50%'}}>
                        Performance Report
                      </th>
                      <th className="text-end bg-primary text-white" style={{width: '25%'}}>
                        Till Date
                      </th>
                      <th className="text-end bg-primary text-white" style={{width: '25%'}}>
                        Yesterday
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Start Date</td>
                      <td className="text-end">{formatDate(dashboardData?.survey_start_date)}</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr>
                      <td>End Date</td>
                      <td className="text-end">{formatDate(dashboardData?.survey_end_date)}</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr>
                      <td>Total number of days pending</td>
                      <td className="text-end">{dashboardData?.total_no_of_days || 'N/A'}</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr>
                      <td>Total Sample to be achieved</td>
                      <td className="text-end">{dashboardData?.total_sample_to_be_achieved?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr className="bg-blue-100 dark:bg-blue-900/30">
                      <th className="text-blue-800 dark:text-blue-200 font-semibold text-sm">Field Status Report-Sample</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>Total interviews conducted</td>
                      <td className="text-end">{dashboardData?.total_interviews_conducted?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Total Valid interviews</td>
                      <td className="text-end">{dashboardData?.total_valid_interviews?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Balance sample to be achieved</td>
                      <td className="text-end">{dashboardData?.balance_sample_to_be_achieved?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">{dashboardData?.total_sample_to_be_achieved?.toLocaleString() || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Interviewers on field</td>
                      <td className="text-end">{dashboardData?.interviewers_on_field?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>

                    <tr className="bg-blue-100 dark:bg-blue-900/30">
                      <th className="text-blue-800 dark:text-blue-200 font-semibold text-sm">Quality Check Status</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>GPS Check Pending</td>
                      <td className="text-end">{statusBreakdown?.gps_check_pending?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Under QC</td>
                      <td className="text-end">{statusBreakdown?.under_qc?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Total rejections</td>
                      <td className="text-end">{dashboardData?.total_rejections?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td className="text-end">due to auto checks (Short Interviews+ Repeated Numbers)</td>
                      <td className="text-end">{statusBreakdown?.due_to_auto_checks?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td className="text-end">due to TBC</td>
                      <td className="text-end">{statusBreakdown?.due_to_tbc?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td className="text-end">due to GPS checks</td>
                      <td className="text-end">{statusBreakdown?.due_to_gps_checks?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Interviews without phone numbers</td>
                      <td className="text-end">{statusBreakdown?.interviews_without_phone?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr className="bg-blue-100 dark:bg-blue-900/30">
                      <th className="text-blue-800 dark:text-blue-200 font-semibold text-sm">AC-wise Progress</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>ACs yet to start</td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePopup('ACs yet to start - till date', acProgress?.acs_yet_to_start?.toString() || '0');
                          }}
                        >
                          {acProgress?.acs_yet_to_start?.toLocaleString() || 'N/A'}
                        </a>
                      </td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePopup('ACs yet to start - yesterday', '0');
                          }}
                        >
                          0
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>ACs in progress</td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePopup('ACs in progress - till date', acProgress?.acs_in_progress?.toString() || '0');
                          }}
                        >
                          {acProgress?.acs_in_progress?.toLocaleString() || 'N/A'}
                        </a>
                      </td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePopup('ACs in progress - yesterday', '0');
                          }}
                        >
                          0
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>ACs completed</td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePopup('ACs completed - till date', acProgress?.acs_completed?.toString() || '0');
                          }}
                        >
                          {acProgress?.acs_completed?.toLocaleString() || 'N/A'}
                        </a>
                      </td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePopup('ACs completed - yesterday', '0');
                          }}
                        >
                          0
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-blue-100 dark:bg-blue-900/30">
                      <th className="text-blue-800 dark:text-blue-200 font-semibold text-sm">Polling Station Coverage</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>Total Polling stations sampled</td>
                      <td className="text-end">{pollingStations?.total_polling_stations_sampled?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">{pollingStations?.total_polling_stations_sampled?.toLocaleString() || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Polling stations yet to start</td>
                      <td className="text-end">{pollingStations?.polling_stations_yet_to_start?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">{pollingStations?.total_polling_stations_sampled?.toLocaleString() || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Polling stations in progress</td>
                      <td className="text-end">{pollingStations?.polling_stations_in_progress?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Polling stations completed</td>
                      <td className="text-end">{pollingStations?.polling_stations_completed?.toLocaleString() || 'N/A'}</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Polling stations with excess sample achieved</td>
                      <td className="text-end">
                        {pollingStations && pollingStations.polling_stations_completed > pollingStations.total_polling_stations_sampled 
                          ? (pollingStations.polling_stations_completed - pollingStations.total_polling_stations_sampled).toLocaleString()
                          : '0'
                        }
                      </td>
                      <td className="text-end">
                        {pollingStations && pollingStations.polling_stations_completed > pollingStations.total_polling_stations_sampled 
                          ? (pollingStations.polling_stations_completed - pollingStations.total_polling_stations_sampled).toLocaleString()
                          : '0'
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}