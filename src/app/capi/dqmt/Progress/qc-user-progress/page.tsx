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

  // Generate QC User options
  const generateQCUserOptions = () => {
    return [
      { value: '', label: 'Select User' },
      { value: '101', label: 'Komal (101)' },
      { value: '102', label: 'Priyanshi (102)' },
      { value: '103', label: 'Sonu Kumari (103)' },
      { value: '104', label: 'Varsha (104)' },
      { value: '105', label: 'Simran (105)' },
      { value: '106', label: 'Swati (106)' },
      { value: '108', label: 'Seema (108)' },
      { value: '109', label: 'Kundan (109)' },
      { value: '110', label: 'Nishant (110)' },
      { value: '111', label: 'Shilpa (111)' },
      { value: '112', label: 'Priya (112)' },
      { value: '113', label: 'Kajal Jha (113)' },
      { value: '114', label: 'Khushbu (114)' },
      { value: '115', label: 'Sanjivani Rai (115)' },
      { value: '116', label: 'Sabha Hijab (116)' },
      { value: '117', label: 'Riya (117)' },
      { value: '118', label: 'Sanjivani Rai (118)' },
      { value: '119', label: 'Mohd Usman (119)' },
      { value: '120', label: 'Supriya (120)' },
      { value: '121', label: 'Ashifa (121)' },
      { value: '122', label: 'Rama (122)' },
      { value: '123', label: 'Preeti (123)' },
      { value: '124', label: 'Priya (124)' },
      { value: '125', label: 'Sanjivani Rai (125)' },
      { value: '126', label: 'Radha Rani (126)' },
      { value: '127', label: 'Faizal Saifi (127)' },
      { value: '128', label: 'Kumudmessey (128)' },
      { value: '129', label: 'Ananya (129)' },
      { value: '130', label: 'Himanshi (130)' },
      { value: '135', label: 'Parveen Sharma (135)' },
      { value: '136', label: 'Muskan (136)' },
      { value: '137', label: 'Muskan Siddiqui (137)' },
      { value: '138', label: 'Aman Kumar (138)' },
      { value: '139', label: 'Himanshi-2 (139)' },
      { value: '140', label: 'Priyanka (140)' },
      { value: '201', label: 'Pinky (201)' },
      { value: '202', label: 'Renu (202)' },
      { value: '203', label: 'Sangeeta (203)' },
      { value: '204', label: 'Sanju (204)' },
      { value: '205', label: 'Khelan (205)' },
      { value: '206', label: 'Manish (206)' },
      { value: '999', label: 'Test User (999)' },
      { value: '1001', label: 'KARTICK (1001)' },
      { value: '1002', label: 'RUSHA DUTTA (1002)' },
      { value: '1003', label: 'APARNA MAJIMDER (1003)' },
      { value: '1004', label: 'DISHA NATH (1004)' },
      { value: '1005', label: 'PRITHIJIT (1005)' },
      { value: '1006', label: 'SHREYA MONDAL (1006)' },
      { value: '1007', label: 'DEBARATI AICH (1007)' },
      { value: '1008', label: 'SUSMITA HALDER (1008)' },
      { value: '1009', label: 'NANDITA GHOSH (1009)' },
      { value: '1010', label: 'RINKI ROY (1010)' },
      { value: '1011', label: 'RUKHSAR BEGUM (1011)' },
      { value: '1012', label: 'SHAMMA KHATOON (1012)' },
      { value: '1020', label: 'APARNA SINGH (1020)' },
      { value: '1021', label: 'PRIYANKA MONDAL (1021)' },
      { value: '1022', label: 'Priyanak Mondal (1022)' },
      { value: '2001', label: 'Vijay Sharma (2001)' },
      { value: '2002', label: 'Mehul Kapoor (2002)' },
      { value: '2003', label: 'Nishi (2003)' },
      { value: '2004', label: 'Asha Chaurasiya (2004)' },
      { value: '2005', label: 'Meenu Trivedi (2005)' },
      { value: '2006', label: 'Deepanjali Trivedi (2006)' },
      { value: '2007', label: 'Puja Pandey (2007)' },
      { value: '2008', label: 'Archana Singh (2008)' },
      { value: '2009', label: 'Seema (2009)' },
      { value: '2010', label: 'Shashi Tiwari (2010)' },
      { value: '2011', label: 'Sucharita Das (2011)' },
      { value: '2012', label: 'Srabani Mondal (2012)' },
      { value: '2013', label: 'Kiran Naskar (2013)' },
      { value: '2014', label: 'Mousimi Parida (2014)' },
      { value: '2015', label: 'Rohini Das (2015)' },
      { value: '2016', label: 'Dwipannita Sanyanal (2016)' },
      { value: '2017', label: 'Rupa Mondal (2017)' },
      { value: '2020', label: 'Pratishtha Mishra (2020)' },
    ];
  };

  // Fetch QC User Progress data from API
  const fetchQCUserProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        qc_id: filters.qcId || undefined,
        telecaller_status: filters.telecallerStatus || undefined,
        report_type: filters.reportType || undefined,
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
    fetchQCUserProgress();
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
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
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
                  <Heading level={2} className="text-xl font-semibold text-gray-900">
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Completed
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Pass
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Fail
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((user, index) => (
                      <tr key={user.qc_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          <button
                            onClick={() => handleViewDetail(user.qc_id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {user.qc_id}
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.statistics.audio_qc_completed.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.statistics.audio_qc_pass.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.statistics.audio_qc_fail.toLocaleString()}</td>
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
