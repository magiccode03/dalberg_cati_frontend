'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, ExternalLink, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface QCUserProgressData {
  qc_id: number;
  name: string;
  mobile_number: string;
  audio: number;
  gps: number;
  tele: number;
  agency_id: number;
  status: string;
  statistics: {
    audio_qc_completed: number;
    audio_qc_pass: number;
    audio_qc_fail: number;
    audio_qc_fail_blank_audio: number;
    audio_qc_fail_irrelevant: number;
  };
}

export default function QCUserProgressPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    qcId: '',
    telecallerStatus: '1', // Default to Active
    reportType: 'summary', // Default to Summary
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qcUserProgressData, setQcUserProgressData] = useState<QCUserProgressData[]>([]);
  const [qcUsersList, setQcUsersList] = useState<QCUserProgressData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Generate date options for the last 6 months
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select a Start Date' }];
    const today = new Date();
    
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    
    return options;
  };

  // Generate QC User options from API data
  const generateQCUserOptions = () => {
    const options = [{ value: '', label: 'Select User' }];
    
    qcUsersList.forEach(user => {
      options.push({
        value: user.qc_id.toString(),
        label: `${user.name} (${user.qc_id})`
      });
    });
    
    return options;
  };

  // Fetch QC Users list for dropdown
  const fetchQCUsersList = async () => {
    try {
      const params = {
        telecaller_status: '1', // Get active users
        report_type: 'summary',
      };
      
      const response = await apiService.getQCUserProgress(params);
      
      if (response.success && response.data) {
        setQcUsersList(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching QC users list:', err);
    }
  };

  // Fetch QC User Progress data from API
  const fetchQCUserProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract name from selected QC user option using API data
      const selectedUser = qcUsersList.find(user => user.qc_id.toString() === filters.qcId);
      const selectedUserName = selectedUser ? selectedUser.name : undefined;
      
      const params = {
        qc_id: filters.qcId || undefined,
        name: selectedUserName || undefined,
        telecaller_status: filters.telecallerStatus || undefined,
        report_type: filters.reportType || undefined,
        custom_date: filters.startDate || undefined,
        custom_date_end: filters.endDate || undefined,
        qc_complete_date: undefined, // Not used in current UI
      };
      
      const response = await apiService.getQCUserProgress(params);
      
      if (response.success && response.data) {
        setQcUserProgressData(response.data.data);
        setTotalCount(response.data.pagination.totalCount);
        setSummary(response.data.summary);
      } else {
        setError('Failed to fetch QC user progress data');
      }
    } catch (err) {
      console.error('Error fetching QC user progress data:', err);
      setError('Error fetching QC user progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load QC users list first, then load progress data
    const loadData = async () => {
      await fetchQCUsersList();
      await fetchQCUserProgress();
    };
    
    loadData();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchQCUserProgress();
  };

  const handleRefresh = () => {
    fetchQCUserProgress();
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = qcUserProgressData.slice(startIndex, endIndex);

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading data');
  };

  const handleViewDetail = (qcId: number) => {
    // Implement view detail logic here
    console.log('Viewing detail for QC ID:', qcId);
  };

  if (loading) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <Text>Loading QC user progress data...</Text>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content horizontal-content">
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-6 text-center">
              <Text className="text-red-600 mb-4">{error}</Text>
              <Button onClick={handleRefresh} variant="primary">
                Try Again
              </Button>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* breadcrumb */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
              QC User Progress
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
        {/* /breadcrumb */}

        {/* Search Form */}
        <div className="mb-6">
          <Card className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <SelectDropdown
                  value={filters.startDate}
                  onChange={(value) => handleFilterChange('startDate', value as string)}
                  options={generateDateOptions()}
                  placeholder="Select a Start Date"
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.endDate}
                  onChange={(value) => handleFilterChange('endDate', value as string)}
                  options={generateDateOptions().map(option => ({
                    ...option,
                    label: option.value === '' ? 'Select a End Date' : option.label
                  }))}
                  placeholder="Select a End Date"
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.qcId}
                  onChange={(value) => handleFilterChange('qcId', value as string)}
                  options={generateQCUserOptions()}
                  placeholder="Select User"
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.telecallerStatus}
                  onChange={(value) => handleFilterChange('telecallerStatus', value as string)}
                  options={[
                    { value: '', label: 'Select QC User Status' },
                    { value: '1', label: 'Active' },
                    { value: '2', label: 'Inactive' },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.reportType}
                  onChange={(value) => handleFilterChange('reportType', value as string)}
                  options={[
                    { value: 'summary', label: 'Summary' },
                    { value: 'detail', label: 'Detail' },
                  ]}
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

        {/* QC User Progress Table */}
        <div className="w-full">
          <Card className="p-0">
            <div className="px-0 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                  <Heading level={4} className="text-lg font-semibold text-gray-900">
                    Telecaller Progress Summary
                  </Heading>
                </div>
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="py-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Caller Name</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Completed
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Pass
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Fail
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((user, index) => (
                      <tr key={user.qc_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{user.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
                          <button
                            onClick={() => handleViewDetail(user.qc_id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {user.qc_id}
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.statistics.audio_qc_completed.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.statistics.audio_qc_pass.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">{user.statistics.audio_qc_fail.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> items.
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
