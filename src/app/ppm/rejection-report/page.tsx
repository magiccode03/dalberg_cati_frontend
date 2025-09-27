'use client';

import React, { useState } from 'react';
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
import { Search, Download, Play, Map } from 'lucide-react';

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
  const [pageSize] = useState(100);

  // Sample rejection data
  const rejectionData: RejectionData[] = [
    {
      srNo: 1,
      serverId: '301767',
      acName: 'Chenari (SC)(207)',
      psCode: '207_100',
      interviewDate: '2025-06-15',
      interviewerId: '935',
      interviewDuration: '00:08:02',
      respondentName: 'Anand mahto',
      respondentMobile: '',
      failReason: 'Rejected (N+W+RTA)',
      audioQcId: '',
      audioFailReason: '',
      reAudioFailReason: '',
      hasAudio: true,
      hasGps: true
    },
    {
      srNo: 2,
      serverId: '301745',
      acName: 'Chenari (SC)(207)',
      psCode: '207_100',
      interviewDate: '2025-06-15',
      interviewerId: '935',
      interviewDuration: '00:07:27',
      respondentName: 'Golu thakur',
      respondentMobile: '',
      failReason: 'Rejected (Short Interview - 0 sec)',
      audioQcId: '',
      audioFailReason: '',
      reAudioFailReason: '',
      hasAudio: false,
      hasGps: true
    },
    {
      srNo: 3,
      serverId: '301739',
      acName: 'Chenari (SC)(207)',
      psCode: '207_100',
      interviewDate: '2025-06-15',
      interviewerId: '721',
      interviewDuration: '00:06:39',
      respondentName: 'Vishal thakur',
      respondentMobile: '',
      failReason: 'Rejected (Short Interview - 0 sec)',
      audioQcId: '',
      audioFailReason: '',
      reAudioFailReason: '',
      hasAudio: false,
      hasGps: true
    },
    {
      srNo: 4,
      serverId: '301705',
      acName: 'Chenari (SC)(207)',
      psCode: '207_100',
      interviewDate: '2025-06-15',
      interviewerId: '935',
      interviewDuration: '00:9:27',
      respondentName: 'Manju Devi',
      respondentMobile: '',
      failReason: 'Rejected (N+W+RTA)',
      audioQcId: '',
      audioFailReason: '',
      reAudioFailReason: '',
      hasAudio: true,
      hasGps: true
    },
    {
      srNo: 5,
      serverId: '301702',
      acName: 'Chenari (SC)(207)',
      psCode: '207_100',
      interviewDate: '2025-06-15',
      interviewerId: '935',
      interviewDuration: '00:08:33',
      respondentName: 'Rina Devi',
      respondentMobile: '',
      failReason: 'Rejected (N+W+RTA)',
      audioQcId: '',
      audioFailReason: '',
      reAudioFailReason: '',
      hasAudio: true,
      hasGps: true
    }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching with filters:', filters);
  };

  const getFailReasonBadge = (reason: string) => {
    if (reason.includes('N+W+RTA')) {
      return <Badge variant="destructive" size="sm">N+W+RTA</Badge>;
    } else if (reason.includes('Short Interview')) {
      return <Badge variant="secondary" size="sm">Short Interview</Badge>;
    } else if (reason.includes('Audio reject')) {
      return <Badge variant="outline" size="sm">Audio Reject</Badge>;
    }
    return <Badge variant="secondary" size="sm">{reason}</Badge>;
  };

  const totalPages = Math.ceil(55747 / pageSize);

  return (
    <Container maxWidth="9xl">
        {/* Page Title */}
        <Heading level={1} className="text-2xl font-bold mb-6">
          Rejection Report
        </Heading>

        {/* Search Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2">Report Days</Text>
              <SelectDropdown
                value={filters.reportDays}
                onValueChange={(value) => handleFilterChange('reportDays', value)}
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
                onValueChange={(value) => handleFilterChange('reportLevel', value)}
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
                onValueChange={(value) => handleFilterChange('failReason', value)}
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
          </div>
          
          <div className="mt-4">
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Rejection Report Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Heading level={4}>Rejection Report</Heading>
            <Button variant="outline">
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
                          className="bg-teal-500 hover:bg-teal-600 text-white border-0"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Play Audio
                        </Button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white border-0"
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
              totalItems={55747}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      </Container>
  );
}
