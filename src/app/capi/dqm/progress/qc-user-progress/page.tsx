'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import { Search, Download, ExternalLink, X } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface QCUserProgressData {
  caller_name: string;
  qc_id: number;
  audio_qc_completed: number;
  audio_qc_pass: number;
  audio_qc_fail: number;
}

interface APIResponse {
  success: boolean;
  data?: QCUserProgressData[];
  message?: string;
  timestamp?: string;
  error?: string;
}

interface QCUserOption {
  qc_id: number;
  name: string;
  mobile_number: string;
}

export default function QCUserProgressPage() {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    qcId: '',
    qcUserStatus: '1', // Default to Active
    acCode: '',
  });

  const [qcUserProgressData, setQcUserProgressData] = useState<QCUserProgressData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qcUserOptions, setQcUserOptions] = useState<QCUserOption[]>([]);
  const [qcUserOptionsLoading, setQcUserOptionsLoading] = useState(false);

  // Fetch QC user options based on status
  const fetchQCUserOptions = async (status: string) => {
    try {
      setQcUserOptionsLoading(true);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });
      
      const response = await Promise.race([
        apiClient.get(`/qc-user-registration?status=${status}`),
        timeoutPromise
      ]) as any;
      
      const data = response.data;
      
      if (data.success && data.data?.qc_users) {
        const options: QCUserOption[] = data.data.qc_users.map((user: any) => ({
          qc_id: user.qc_id,
          name: user.name,
          mobile_number: user.mobile_number
        }));
        setQcUserOptions(options);
      }
    } catch (err) {
      console.error('Error fetching QC user options:', err);
      setQcUserOptions([]);
    } finally {
      setQcUserOptionsLoading(false);
    }
  };

  // Fetch QC user options when status changes
  useEffect(() => {
    if (filters.qcUserStatus) {
      fetchQCUserOptions(filters.qcUserStatus);
    }
  }, [filters.qcUserStatus]);

  // Initial data fetch on page load
  useEffect(() => {
    console.log('Page loaded, fetching initial data...');
    fetchData();
  }, []);


  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Starting API Call ===');
      console.log('Current filters:', filters);
      
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      if (filters.qcUserStatus) queryParams.append('qc_user_status', filters.qcUserStatus);
      if (filters.acCode) queryParams.append('ac_code', filters.acCode);
      if (filters.qcId) queryParams.append('qc_id', filters.qcId);
      if (filters.startDate) queryParams.append('audio_qc_complete_date_from', filters.startDate);
      if (filters.endDate) queryParams.append('audio_qc_complete_date_to', filters.endDate);
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/capi/interview/qc-user-wise-data?${queryString}` : '/capi/interview/qc-user-wise-data';
      
      console.log('Query params:', queryString);
      console.log('Full endpoint:', endpoint);
      console.log('Making API request to:', endpoint);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });
      
      const response = await Promise.race([
        apiClient.get(endpoint),
        timeoutPromise
      ]) as any;
      
      console.log('Raw response:', response);
      const data: APIResponse = response.data;
      console.log('Parsed API Response:', data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        console.log('Success! Data received:', data.data.length, 'items');
        setQcUserProgressData(data.data);
      } else {
        console.log('No data or unsuccessful response');
        setQcUserProgressData([]);
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err: any) {
      console.error('=== API Error ===');
      console.error('Error details:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      
      if (err.message === 'Request timeout after 10 seconds') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.status === 401) {
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
      
      setQcUserProgressData([]);
    } finally {
      console.log('=== API Call Finished ===');
      setLoading(false);
    }
  };

  // Generate QC User options for dropdown
  const generateQCUserDropdownOptions = () => {
    const options = [{ value: '', label: 'Select QC User' }];
    qcUserOptions.forEach(user => {
      options.push({
        value: user.qc_id.toString(),
        label: `${user.name} (${user.qc_id})`
      });
    });
    return options;
  };


  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset QC ID when status changes
    if (field === 'qcUserStatus') {
      setFilters(prev => ({
        ...prev,
        [field]: value,
        qcId: ''
      }));
    }
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    fetchData();
  };

  const handleClear = () => {
    const defaultFilters = {
      startDate: '',
      endDate: '',
      qcId: '',
      qcUserStatus: '1',
      acCode: '',
    };
    setFilters(defaultFilters);
    setQcUserProgressData([]);
  };

  const handleDownload = () => {
    try {
      if (qcUserProgressData.length === 0) {
        alert('No data to download. Please search for data first.');
        return;
      }

      // Create CSV headers
      const headers = [
        'QC User Name',
        'QC ID', 
        'Audio QC Completed',
        'Audio QC Pass',
        'Audio QC Fail'
      ];

      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...qcUserProgressData.map(user => [
          `"${user.caller_name}"`,
          user.qc_id,
          user.audio_qc_completed,
          user.audio_qc_pass,
          user.audio_qc_fail
        ].join(','))
      ];

      // Create CSV content
      const csvContent = csvRows.join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `qc_user_progress_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Error downloading data. Please try again.');
    }
  };

  const handleViewDetail = (qcId: number) => {
    // Navigate to the interview-list page
    router.push('/capi/dqm/progress/interview-list');
  };

  if (loading) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading QC user progress data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
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
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Page Header */}
        <div className="mb-6">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            QC User Progress
          </Heading>
        </div>

        {/* Search Filters */}
        <Card className="p-4 mb-5">
          <div className="flex flex-wrap items-end gap-4">
            {/* Start Date Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* End Date Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* QC User Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QC User Status
              </label>
              <SelectDropdown
                value={filters.qcUserStatus}
                onChange={(value) => handleFilterChange('qcUserStatus', value as string)}
                options={[
                  { value: '1', label: 'Active' },
                  { value: '2', label: 'Inactive' },
                ]}
                placeholder="Select Status"
              />
            </div>

            {/* QC User Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QC User
              </label>
              <SelectDropdown
                value={filters.qcId}
                onChange={(value) => handleFilterChange('qcId', value as string)}
                options={generateQCUserDropdownOptions()}
                placeholder="Select QC User"
                searchable={true}
                clearable={true}
                maxHeight={300}
                disabled={qcUserOptionsLoading}
              />
            </div>

            {/* AC Code Filter */}
            {/* <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AC Code
              </label>
              <input
                type="text"
                value={filters.acCode}
                onChange={(e) => handleFilterChange('acCode', e.target.value)}
                placeholder="Enter AC Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleSearch}
                className="flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={handleClear}
                className="bg-gray-500 text-white hover:bg-gray-600 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* QC User Progress Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                QC User Progress Summary
              </Heading>
            </div>
            <div className="flex items-center">
              <Button
                variant="primary"
                onClick={handleDownload}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
            Total <strong>{qcUserProgressData.length}</strong> QC users.
          </div>

          <div className="overflow-x-auto">
            <Table
              striped
              bordered
              hover
              className="w-full border-collapse"
            >
              <thead className="sticky-header bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC User Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Audio QC : Completed
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Audio QC : Pass
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Audio QC : Fail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qcUserProgressData.map((user, index) => (
                  <tr key={`${user.qc_id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.caller_name || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
                      {user.qc_id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.audio_qc_completed.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.audio_qc_pass.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.audio_qc_fail.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex justify-between items-center mt-4 px-4 pb-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{qcUserProgressData.length}</span> results.
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
