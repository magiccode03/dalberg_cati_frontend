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
import { useRejectionReport, useACDropdown, useRejectionReportFilterOptions, useInterviewerDropdown } from '@/hooks/useApi';

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
    failReason: '',
    qualityreportstatus: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  
  // Memoize the API parameters to prevent infinite re-renders
  const apiParams = React.useMemo(() => {
    const params: any = {
      report_days: filters.reportDays,
      custom_date: filters.customDate,
      custom_date_end: filters.customDateEnd,
      report_level: filters.reportLevel,
      interviewer_id: filters.interviewerId,
      enumerator_id: filters.enumeratorId,
      district_code: filters.districtCode,
      pc_code: filters.pcCode,
      supervisor_id: filters.supervisorId,
      server_id: filters.serverId,
      mobile_no: filters.mobileNo,
      fail_reason: filters.failReason,
      qualityreportstatus: filters.qualityreportstatus,
      page: currentPage,
      per_page: pageSize
    };

    // Only include ac_code if it has a value
    if (filters.acCode && filters.acCode.trim() !== '') {
      params.ac_code = filters.acCode;
    }

    return params;
  }, [filters, currentPage, pageSize]);
  
  // Check if we should make the API call based on required parameters for each level
  const shouldMakeApiCall = React.useMemo(() => {
    // For AC level: ac_code is required
    if ((filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (!filters.acCode || filters.acCode.trim() === '')) {
      return false;
    }
    
    // For Poling Station level: ac_code is required
    if (filters.reportLevel === 'polingstation' && (!filters.acCode || filters.acCode.trim() === '')) {
      return false;
    }
    
    // For Interviewer level: interviewer_id is required
    if (filters.reportLevel === 'interviewer' && (!filters.interviewerId || filters.interviewerId.trim() === '')) {
      return false;
    }
    
    return true;
  }, [filters.reportLevel, filters.acCode, filters.interviewerId]);

  // Fetch rejection report data from API
  const { data, loading, error, refetch } = useRejectionReport(shouldMakeApiCall ? apiParams : null);
  
  // Fetch AC dropdown data
  const { data: acDropdownData, loading: acDropdownLoading } = useACDropdown();

  // Fetch interviewer dropdown data
  const { data: interviewerDropdownData, loading: interviewerDropdownLoading } = useInterviewerDropdown();

  // Fetch filter options data
  const { data: filterOptionsData, loading: filterOptionsLoading } = useRejectionReportFilterOptions();

  // Transform AC dropdown data to options format
  const acDropdownOptions = React.useMemo(() => {
    if (!acDropdownData) return [];
    return Object.entries(acDropdownData).map(([code, name]) => ({
      value: code,
      label: `${code} - ${name}`
    }));
  }, [acDropdownData]);

  // Transform interviewer dropdown data to options format
  const interviewerDropdownOptions = React.useMemo(() => {
    if (!interviewerDropdownData) return [];
    return Object.entries(interviewerDropdownData)
      .filter(([id, name]) => id !== '') // Filter out empty entries
      .map(([id, name]) => ({
        value: id,
        label: `${id} - ${name}`
      }));
  }, [interviewerDropdownData]);

  // Transform filter options data to dropdown options format
  const reportDaysOptions = React.useMemo(() => {
    if (!filterOptionsData?.report_days) return [];
    return Object.entries(filterOptionsData.report_days).map(([value, label]) => ({
      value,
      label
    }));
  }, [filterOptionsData]);

  const reportLevelsOptions = React.useMemo(() => {
    if (!filterOptionsData?.report_levels) return [];
    return Object.entries(filterOptionsData.report_levels).map(([value, label]) => ({
      value,
      label
    }));
  }, [filterOptionsData]);

  const failReasonOptions = React.useMemo(() => {
    if (!filterOptionsData?.quality_statuses) return [];
    return [
      { value: '', label: 'Select Fail Reason' },
      ...Object.entries(filterOptionsData.quality_statuses).map(([value, label]) => ({
        value,
        label
      }))
    ];
  }, [filterOptionsData]);

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
      interviewDuration: item.interview_duration_human || formatDuration(item.total_duration),
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
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Clear AC code when level changes away from 'ac' or 'polingstation'
      if (field === 'reportLevel' && 
          !['ac', 'polingstation'].includes(value) && 
          ['ac', 'polingstation'].includes(prev.reportLevel)) {
        newFilters.acCode = '';
      }
      
      // Clear interviewer_id when level changes away from 'interviewer'
      if (field === 'reportLevel' && 
          value !== 'interviewer' && 
          prev.reportLevel === 'interviewer') {
        newFilters.interviewerId = '';
      }
      
      return newFilters;
    });
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
    } else if (reason.includes('System Fail')) {
      return <Badge variant="error" size="sm">System Fail</Badge>;
    } else if (reason.includes('GPS Check Fail')) {
      return <Badge variant="warning" size="sm">GPS Fail</Badge>;
    } else if (reason.includes('Audio QC Fail')) {
      return <Badge variant="outline" size="sm">Audio QC Fail</Badge>;
    }
    return <Badge variant="secondary" size="sm">{reason}</Badge>;
  };

  // Extract data from API response
  const rejectionData = (data && typeof data === 'object' && 'interviews' in data && Array.isArray(data.interviews)) 
    ? transformAPIData(data.interviews) : [];
  const totalPages = (data && typeof data === 'object' && 'pagination' in data && data.pagination && typeof data.pagination === 'object' && 'total_pages' in data.pagination) 
    ? (data.pagination as any).total_pages || 0 : 0;
  const totalCount = (data && typeof data === 'object' && 'pagination' in data && data.pagination && typeof data.pagination === 'object' && 'total_count' in data.pagination) 
    ? (data.pagination as any).total_count || 0 : 0;

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

  // Show message when required parameters are missing for specific levels
  if (
    ((filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (!filters.acCode || filters.acCode.trim() === '')) ||
    (filters.reportLevel === 'interviewer' && (!filters.interviewerId || filters.interviewerId.trim() === ''))
  ) {
    return (
      <Container maxWidth="full">
        <Heading level={1} className="text-2xl font-bold mb-6">
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
                options={reportDaysOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {filters.reportDays === 'custom' && (
              <>
                <div>
                  <Text className="block text-sm font-medium mb-2">Start Date</Text>
                  <Input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) => handleFilterChange('customDate', e.target.value)}
                  />
                </div>
                <div>
                  <Text className="block text-sm font-medium mb-2">End Date</Text>
                  <Input
                    type="date"
                    value={filters.customDateEnd}
                    onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Level</Text>
              <SelectDropdown
                value={filters.reportLevel}
                onChange={(value) => handleFilterChange('reportLevel', Array.isArray(value) ? value[0] : value)}
                options={reportLevelsOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Fail Reason</Text>
              <SelectDropdown
                value={filters.failReason}
                onChange={(value) => handleFilterChange('failReason', Array.isArray(value) ? value[0] : value)}
                options={failReasonOptions}
                disabled={filterOptionsLoading}
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

            {filters.reportLevel === 'interviewer' && (
              <div>
                <Text className="block text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: interviewerDropdownLoading ? 'Loading Interviewers...' : 'Select Interviewer ID' },
                    ...interviewerDropdownOptions
                  ]}
                  disabled={interviewerDropdownLoading || filterOptionsLoading}
                />
              </div>
            )}

            {(filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (
              <div>
                <Text className="block text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: acDropdownLoading ? 'Loading AC List...' : 'Select AC Code' },
                    ...acDropdownOptions
                  ]}
                  disabled={acDropdownLoading || filterOptionsLoading}
                />
              </div>
            )}

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Message when required parameters are missing */}
        <Card>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Text className="text-blue-600 mb-4 text-lg">
                {filters.reportLevel === 'interviewer' 
                  ? 'Please enter an Interviewer ID to view the rejection report'
                  : 'Please select an AC Code to view the rejection report'
                }
              </Text>
              <Text className="text-gray-600">
                {filters.reportLevel === 'interviewer'
                  ? 'Enter the Interviewer ID in the field above to filter the data.'
                  : 'Choose an Assembly Constituency from the dropdown above to filter the data.'
                }
              </Text>
            </div>
          </div>
        </Card>
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
        <Heading level={1} className="text-2xl font-bold mb-6">
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
                options={reportDaysOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            {filters.reportDays === 'custom' && (
              <>
                <div>
                  <Text className="block text-sm font-medium mb-2">Start Date</Text>
                  <Input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) => handleFilterChange('customDate', e.target.value)}
                  />
                </div>
                <div>
                  <Text className="block text-sm font-medium mb-2">End Date</Text>
                  <Input
                    type="date"
                    value={filters.customDateEnd}
                    onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Text className="block text-sm font-medium mb-2">Level</Text>
              <SelectDropdown
                value={filters.reportLevel}
                onChange={(value) => handleFilterChange('reportLevel', Array.isArray(value) ? value[0] : value)}
                options={reportLevelsOptions}
                disabled={filterOptionsLoading}
              />
            </div>

            <div>
              <Text className="block text-sm font-medium mb-2">Fail Reason</Text>
              <SelectDropdown
                value={filters.failReason}
                onChange={(value) => handleFilterChange('failReason', Array.isArray(value) ? value[0] : value)}
                options={failReasonOptions}
                disabled={filterOptionsLoading}
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

            {filters.reportLevel === 'interviewer' && (
              <div>
                <Text className="block text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: interviewerDropdownLoading ? 'Loading Interviewers...' : 'Select Interviewer ID' },
                    ...interviewerDropdownOptions
                  ]}
                  disabled={interviewerDropdownLoading || filterOptionsLoading}
                />
              </div>
            )}

            {(filters.reportLevel === 'ac' || filters.reportLevel === 'polingstation') && (
              <div>
                <Text className="block text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: acDropdownLoading ? 'Loading AC List...' : 'Select AC Code' },
                    ...acDropdownOptions
                  ]}
                  disabled={acDropdownLoading || filterOptionsLoading}
                />
              </div>
            )}

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
                  <th>AC Name</th>
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
