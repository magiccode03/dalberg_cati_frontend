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
import { Search, Download, ExternalLink } from 'lucide-react';
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
  const [pageSize] = useState(25);

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
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
              QC User Progress
            </Heading>
          </div>
        </div>

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
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Telecaller Progress Summary
              </Heading>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="bg-white">
            <div className="mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{totalCount.toLocaleString()}</strong> items.
              </Text>
            </div>
            
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">Caller Name</th>
                    <th className="text-center">QC ID</th>
                    <th className="text-center">Audio QC Completed</th>
                    <th className="text-center">Audio QC Pass</th>
                    <th className="text-center">Audio QC Fail</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((user, index) => (
                    <tr key={user.qc_id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{user.name}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleViewDetail(user.qc_id)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-mono font-semibold"
                        >
                          {user.qc_id}
                          <ExternalLink className="w-3 h-3 ml-1 inline" />
                        </button>
                      </td>
                      <td className="text-center">{user.statistics.audio_qc_completed.toLocaleString()}</td>
                      <td className="text-center">{user.statistics.audio_qc_pass.toLocaleString()}</td>
                      <td className="text-center">{user.statistics.audio_qc_fail.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </Card>
    </Container>
  );
}
