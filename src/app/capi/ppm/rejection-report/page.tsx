'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Badge from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, Play, Map, Loader2 } from 'lucide-react';
import { useRejectionReport } from '@/hooks/useApi';

interface RejectionData {
  srNo: number;
  serverId: string;
  acName: string;
  psCode: string;
  interviewDate: string;
  interviewerId: string;
  interviewDuration: string;
  respondentName: string;
  respondentMobile: string;
  failReason: string;
  audioQcId: string;
  audioFailReason: string;
  reAudioFailReason: string;
  hasAudio: boolean;
  hasGps: boolean;
}

export default function RejectionReportPage() {
  const [filters, setFilters] = useState({
    reportDays: 'all',
    customDate: '',
    customDateEnd: '',
    reportLevel: '0',
    interviewerId: '',
    enumeratorId: '',
    acCode: '',
    districtCode: '',
    pcCode: '',
    supervisorId: '',
    serverId: '',
    mobileNo: '',
    failReason: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  
  // Memoize the API parameters to prevent infinite re-renders
  const apiParams = React.useMemo(() => ({
    report_days: filters.reportDays,
    custom_date: filters.customDate,
    custom_date_end: filters.customDateEnd,
    report_level: filters.reportLevel,
    interviewer_id: filters.interviewerId,
    enumerator_id: filters.enumeratorId,
    ac_code: filters.acCode,
    district_code: filters.districtCode,
    pc_code: filters.pcCode,
    supervisor_id: filters.supervisorId,
    server_id: filters.serverId,
    mobile_no: filters.mobileNo,
    fail_reason: filters.failReason,
    page: currentPage,
    per_page: pageSize
  }), [filters, currentPage, pageSize]);
  
  // Fetch rejection report data from API
  const { data, loading, error, refetch } = useRejectionReport(apiParams);

  // Handle page changes
  useEffect(() => {
    if (currentPage > 1) {
      refetch();
    }
  }, [currentPage, refetch]);

  // Transform API data to UI format
  const transformAPIData = (apiData: any[]): RejectionData[] => {
    return apiData.map((item, index) => ({
      srNo: (currentPage - 1) * pageSize + index + 1,
      serverId: item.server_id.toString(),
      acName: item.ac_name,
      psCode: item.ps_code,
      interviewDate: new Date(item.interview_date).toISOString().split('T')[0],
      interviewerId: item.interviewer_id,
      interviewDuration: formatDuration(item.total_duration),
      respondentName: item.respondent_name,
      respondentMobile: item.mobile_no || '',
      failReason: item.fail_reason,
      audioQcId: item.audio_qc_id?.toString() || '',
      audioFailReason: item.audio_fail_reason || '',
      reAudioFailReason: item.qc_recheck_status_audio_label || '',
      hasAudio: item.audio_available,
      hasGps: item.gps_available
    }));
  };

  // Helper function to format duration from seconds to HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    refetch();
  };

  const getFailReasonBadge = (reason: string) => {
    if (reason.includes('N+W+RTA')) {
      return <Badge variant="error" size="sm">N+W+RTA</Badge>;
    } else if (reason.includes('Short Interview')) {
      return <Badge variant="secondary" size="sm">Short Interview</Badge>;
    } else if (reason.includes('Audio reject')) {
      return <Badge variant="outline" size="sm">Audio Reject</Badge>;
    }
    return <Badge variant="secondary" size="sm">{reason}</Badge>;
  };

  // Extract data from API response
  const rejectionData = data?.interviews ? transformAPIData(data.interviews) : [];
  const totalPages = data?.pagination?.total_pages || 0;
  const totalCount = data?.pagination?.total_count || 0;

  // Debug logging
  console.log('API Response:', { data, loading, error });
  console.log('Transformed Data:', rejectionData);

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading rejection report data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Text className="text-red-600 mb-4">Error loading data: {error}</Text>
            <Button onClick={refetch} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="full">
        {/* Page Title */}
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Rejection Report
        </Heading>

        {/* Search Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2">Report Days</Text>
              <SelectDropdown
                value={filters.reportDays}
                onChange={(value) => handleFilterChange('reportDays', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'today', label: 'Today' },
                  { value: 'yesterday', label: 'Yesterday' },
                  { value: 'dby', label: 'Day Before Yesterday' },
                  { value: 'l3', label: 'Last 3 Days' },
                  { value: 'l7', label: 'Last 7 Days' },
                  { value: 'l15', label: 'Last 15 Days' },
                  { value: 'currentmonth', label: 'Current Month' },
                  { value: 'custom', label: 'Custom Date' }
                ]}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Level</Text>
              <SelectDropdown
                value={filters.reportLevel}
                onChange={(value) => handleFilterChange('reportLevel', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '0', label: 'All' },
                  { value: 'ac', label: 'Ac Level' },
                  { value: 'interviewer', label: 'Interviewer Level' },
                  { value: 'polingstation', label: 'Poling Station Level' }
                ]}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Fail Reason</Text>
              <SelectDropdown
                value={filters.failReason}
                onChange={(value) => handleFilterChange('failReason', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Fail Reason' },
                  { value: 'autorejectstatus', label: 'System Fail' },
                  { value: 'shortinterviewstatus', label: 'System Fail : Short Interview' },
                  { value: 'duplicatemobilenumberstatus', label: 'System Fail: Duplicate Mobile Number' },
                  { value: 'noaudionomobilestatus', label: 'System Fail: No Audio' },
                  { value: 'gpsrejectedstatus', label: 'GPS Check Fail' },
                  { value: 'autorejectedstatus', label: 'Audio QC Fail' },
                  { value: 'rtastatus', label: 'N+W+RTA Rejected (Manually)' }
                ]}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Server ID</Text>
              <Input
                type="text"
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Respondent Mobile</Text>
              <Input
                type="text"
                placeholder="Search by Mobile Number"
                value={filters.mobileNo}
                onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Rejection Report Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>  
              <Heading level={4}>Rejection Report</Heading>
            </div>
            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              <Download className="w-4 h-4 mr-2" />
              Download Data
            </Button>
          </div>

          <div className="table-responsive">
            <Table className="table table-centered table-striped dt-responsive nowrap w-100">
              <thead className="table-light">
                <tr>
                  <th>Sr. No</th>
                  <th>Server ID</th>
                  <th>Ac Name</th>
                  <th>PS Code</th>
                  <th>Interview Date</th>
                  <th>Interviewer ID</th>
                  <th>Interview Duration</th>
                  <th>Respondent Name</th>
                  <th>Respondent Mobile</th>
                  <th>Fail Reason</th>
                  <th>Audio QC ID</th>
                  <th>Audio Fail Reason</th>
                  <th>Re-Audio Fail Reason</th>
                  <th>Audio</th>
                  <th>GPS</th>
                </tr>
              </thead>
              <tbody>
                {rejectionData.map((row) => (
                  <tr key={row.srNo}>
                    <td>{row.srNo}</td>
                    <td>
                      <a 
                        href={`/interview-detail?server_id=${row.serverId}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 font-mono"
                      >
                        {row.serverId}
                      </a>
                    </td>
                    <td>{row.acName}</td>
                    <td className="font-mono">{row.psCode}</td>
                    <td>{row.interviewDate}</td>
                    <td>{row.interviewerId}</td>
                    <td className="font-mono">{row.interviewDuration}</td>
                    <td>{row.respondentName}</td>
                    <td>{row.respondentMobile || '-'}</td>
                    <td>
                      {getFailReasonBadge(row.failReason)}
                    </td>
                    <td>{row.audioQcId || '-'}</td>
                    <td>{row.audioFailReason || '-'}</td>
                    <td>{row.reAudioFailReason || '-'}</td>
                    <td>
                      {row.hasAudio ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                          title="Play Audio"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                        title="GPS Map"
                      >
                        <Map className="w-3 h-3" />
                      </Button>
                    </td>
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
        </Card>
      </Container>
  );
}
