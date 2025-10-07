'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface EnumeratorWiseData {
  id: number;
  enumeratorId: number;
  interviewDate: string;
  deviceId: string;
  interviewerIds: string;
  totalInterview: number;
  totalInterviewWithoutPhone: number;
  validInterview: number;
  invalidInterview: number;
  rejectInterview: number;
  rejectInterviewSystem: number;
  underQcInterview: number;
  qcUser: string;
  status: string;
  teleQc: string;
  audioQc: string;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: Array<{
      id: number;
      user_id: number;
      interview_date: string;
      device_id: string;
      interviewerids: string;
      total_interview: number;
      total_interview_without_phone: number;
      valid_interview: number;
      invalid_interview: number;
      reject_interview: number;
      reject_interview_system: number;
      underqc_interview: number;
      progress_phase: number;
      progressphase: string;
      teleqcstatus: string;
      audioqcstatus: string;
      qcuser: {
        qc_id: number;
        name: string;
        qcnameandid: string;
      } | null;
    }>;
    pagination?: {
      page: number;
      pageSize: number;
      totalCount: number;
      pageCount: number;
    };
  };
  error?: string;
  message?: string;
  timestamp: string;
}

export default function EnumeratorWisePage() {
  const [filters, setFilters] = useState({
    userId: '',
    interviewDate: '',
    deviceId: '',
    progressPhase: '',
    qcUserId: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [enumeratorWiseData, setEnumeratorWiseData] = useState<EnumeratorWiseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to format date to simple YYYY-MM-DD format
  const formatDateToSimple = (dateString: string): string => {
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // If it contains time information, extract just the date part
      if (dateString.includes('T')) {
        const datePart = dateString.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }
      
      // Try parsing as Date and extract date part
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      // If all parsing fails, try to extract the date pattern
      const match = dateString.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : dateString;
    } catch {
      // If all parsing fails, try to extract the date pattern
      const match = dateString.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : dateString;
    }
  };

  // Helper function to transform API data to UI format
  const transformAPIData = (apiData: any[]): EnumeratorWiseData[] => {
    return apiData.map((item) => ({
      id: item.id,
      enumeratorId: item.user_id,
      interviewDate: formatDateToSimple(item.interview_date),
      deviceId: item.device_id,
      interviewerIds: item.interviewerids,
      totalInterview: item.total_interview,
      totalInterviewWithoutPhone: item.total_interview_without_phone,
      validInterview: item.valid_interview,
      invalidInterview: item.invalid_interview,
      rejectInterview: item.reject_interview,
      rejectInterviewSystem: item.reject_interview_system,
      underQcInterview: item.underqc_interview,
      qcUser: item.qcuser ? item.qcuser.qcnameandid : '',
      status: item.progressphase,
      teleQc: item.teleqcstatus,
      audioQc: item.audioqcstatus
    }));
  };

  const handleFilterChange = (field: string, value: string) => {
    console.log(`Filter changed - ${field}:`, value);
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch data from API
  const fetchEnumeratorWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        user_id: filters.userId || undefined,
        interview_date: filters.interviewDate || undefined,
        device_id: filters.deviceId || undefined,
        progressphase: filters.progressPhase || undefined,
        progress_phase: filters.progressPhase || undefined, // Alternative parameter name
        qcuser_qc_id: filters.qcUserId || undefined,
        page: currentPage,
        pageSize: pageSize,
      };
      
      console.log('API Parameters:', params);
      console.log('Progress Phase Filter Value:', filters.progressPhase);
      console.log('Progress Phase API Parameter:', params.progressphase);
      
      const response = await apiService.getEnumeratorWiseReport(params);
      
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        const transformedData = transformAPIData(response.data.data);
        setEnumeratorWiseData(transformedData);
        setTotalCount(response.data.pagination?.totalCount || transformedData.length);
        console.log('Transformed data:', transformedData);
      } else {
        console.error('API error:', response.message);
        setError(response.message || 'Failed to fetch enumerator wise data');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchEnumeratorWiseData();
  }, [currentPage, filters]);

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    console.log('Current progressPhase filter:', filters.progressPhase);
    setCurrentPage(1); // Reset to first page when searching
    fetchEnumeratorWiseData();
  };

  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Interview Date' }];
    const today = new Date();
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    return options;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GPS Check Pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">GPS Check Pending</span>;
      case 'Audio/Tele QC Pending':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Audio/Tele QC Pending</span>;
      case 'QC Completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">QC Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = enumeratorWiseData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Field Enumerator Wise Report
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <Text className="ml-2 text-gray-600">Loading enumerator wise report...</Text>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={4} className="text-lg font-semibold text-red-600 mb-2">
                    Error Loading Data
                  </Heading>
                  <Text className="text-gray-600">{error}</Text>
                </div>
                <Button
                  onClick={fetchEnumeratorWiseData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search Form */}
        <div className="mb-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By Enumerator ID"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', value as string)}
                  options={generateDateOptions()}
                  placeholder="Select Interview Date"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By Device ID"
                  value={filters.deviceId}
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.progressPhase}
                  onChange={(value) => handleFilterChange('progressPhase', value as string)}
                  options={[
                    { value: '', label: 'Select Status' },
                    { value: '0', label: 'GPS Check Pending' },
                    { value: '1', label: 'Audio/Tele QC Pending' },
                    { value: '2', label: 'QC Completed' },
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search By QC ID"
                  value={filters.qcUserId}
                  onChange={(e) => handleFilterChange('qcUserId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Enumerator Wise Report Table */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>   
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Field Enumerator Wise Report
                </Heading>
                <span className="text-end"></span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Enumerator ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interview Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Device Id</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interviewer IDs</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview Without Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Valid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Invalid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview System</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Under QC Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Tele QC</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio QC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data, index) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.enumeratorId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.interviewDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.deviceId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.interviewerIds}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterviewWithoutPhone.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.validInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.invalidInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterviewSystem.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.underQcInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.qcUser || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{getStatusBadge(data.status)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.teleQc}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.audioQc}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> items
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
