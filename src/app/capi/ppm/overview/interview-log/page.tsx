'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Checkbox from '@/components/ui/Checkbox';
import Badge from '@/components/ui/Badge';
import DataGrid from '@/components/ui/DataGrid';
import PaginationStandard from '@/components/ui/PaginationStandard';

const InterviewLogPage = () => {
  const [filters, setFilters] = useState({
    agencyId: '',
    serverId: '',
    interviewDate: '',
    acCode: '',
    psCode: '',
    userId: '',
    interviewerId: '',
    deviceId: '',
    mobileNo: '',
    audioQc: [] as string[],
    audioQcStatus: [] as string[],
    audio1Status: [] as string[],
    qcRecheckStatusAudio: [] as string[],
    status: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Sample data for dropdowns
  const agencyOptions = [
    { value: '', label: 'Select State Teams' },
    { value: '1', label: 'Kadence' },
    { value: '2', label: 'Chandan' },
    { value: '3', label: 'Rohit' },
    { value: '4', label: 'Parbhat' },
    { value: '5', label: 'Navin' },
    { value: '6', label: 'Aeon' },
    { value: '7', label: 'Abhinav' },
    { value: '8', label: 'Inhouse' },
  ];

  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Valmiki Nagar (1)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '10', label: 'Raxaul (10)' },
  ];

  // Sample interview data
  const interviewData = [
    {
      id: 1,
      serverId: '302275',
      interviewDate: '2025-06-17',
      sampleType: 'Sample',
      acName: 'Cheria Bariarpur (141)',
      psName: '111. Utkramit Madhya Vidyalaya,Shekha Tola',
      deviceId: '9b565985d11c4d77',
      interviewerId: '',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Terminated',
      psImage: '',
      selfieImage: '',
      gender: '',
    },
    {
      id: 2,
      serverId: '301767',
      interviewDate: '2025-06-15',
      sampleType: 'Booster',
      acName: 'Chenari (SC) (207)',
      psName: '100. Primary School, Kekai',
      deviceId: '5e47ae85d3f83fa7',
      interviewerId: '935',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Rejected (N+W+RTA)',
      psImage: '',
      selfieImage: '',
      gender: 'Male',
    },
    {
      id: 3,
      serverId: '301745',
      interviewDate: '2025-06-15',
      sampleType: 'Booster',
      acName: 'Chenari (SC) (207)',
      psName: '100. Primary School, Kekai',
      deviceId: '5e47ae85d3f83fa7',
      interviewerId: '935',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Rejected (Short Interview - 0 sec)',
      psImage: '',
      selfieImage: '',
      gender: 'Male',
    },
    {
      id: 4,
      serverId: '301739',
      interviewDate: '2025-06-15',
      sampleType: 'Booster',
      acName: 'Chenari (SC) (207)',
      psName: '100. Primary School, Kekai',
      deviceId: '5e47ae85d3f83fa7',
      interviewerId: '721',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Rejected (Short Interview - 0 sec)',
      psImage: '',
      selfieImage: '',
      gender: 'Male',
    },
    {
      id: 5,
      serverId: '301705',
      interviewDate: '2025-06-15',
      sampleType: 'Booster',
      acName: 'Chenari (SC) (207)',
      psName: '100. Primary School, Kekai',
      deviceId: '5e47ae85d3f83fa7',
      interviewerId: '935',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Rejected (N+W+RTA)',
      psImage: '',
      selfieImage: '',
      gender: 'Female',
    },
  ];

  // DataGrid columns configuration
  const columns = [
    {
      key: 'index',
      title: '#',
      dataIndex: 'index',
      width: 60,
      align: 'center' as const,
      render: (value: any, record: any, index: number) => (
        <span className="text-gray-500 font-medium">{index + 1}</span>
      ),
    },
    {
      key: 'serverId',
      title: 'Server ID',
      dataIndex: 'serverId',
      width: 120,
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-blue-600">{value}</span>
      ),
    },
    {
      key: 'interviewDate',
      title: 'Interview Date',
      dataIndex: 'interviewDate',
      width: 120,
    },
    {
      key: 'sampleType',
      title: 'Sample Type',
      dataIndex: 'sampleType',
      width: 100,
    },
    {
      key: 'acName',
      title: 'AC Name',
      dataIndex: 'acName',
      width: 200,
    },
    {
      key: 'psName',
      title: 'PS Name',
      dataIndex: 'psName',
      width: 250,
    },
    {
      key: 'deviceId',
      title: 'Device ID',
      dataIndex: 'deviceId',
      width: 150,
    },
    {
      key: 'interviewerId',
      title: 'Interviewer ID',
      dataIndex: 'interviewerId',
      width: 120,
    },
    {
      key: 'audioQc',
      title: 'Audio QC',
      dataIndex: 'audioQc',
      width: 100,
    },
    {
      key: 'audioQcId',
      title: 'Audio QC ID',
      dataIndex: 'audioQcId',
      width: 120,
    },
    {
      key: 'audioFailReason',
      title: 'Audio Fail Reason',
      dataIndex: 'audioFailReason',
      width: 150,
    },
    {
      key: 'qcOutcome',
      title: 'QC Outcome',
      dataIndex: 'qcOutcome',
      width: 120,
      align: 'center' as const,
      render: (value: string) => getQcOutcomeBadge(value),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 150,
    },
    {
      key: 'psImage',
      title: 'PS Image',
      dataIndex: 'psImage',
      width: 100,
      align: 'center' as const,
      render: (value: string) => (
        <div className="flex justify-center">
          {value ? (
            <img src={value} alt="PS Image" className="w-8 h-8 rounded object-cover" />
          ) : (
            <i className="fa fa-image text-gray-400 text-lg"></i>
          )}
        </div>
      ),
    },
    {
      key: 'selfieImage',
      title: 'Selfie Image',
      dataIndex: 'selfieImage',
      width: 100,
      align: 'center' as const,
      render: (value: string) => (
        <div className="flex justify-center">
          {value ? (
            <img src={value} alt="Selfie Image" className="w-8 h-8 rounded object-cover" />
          ) : (
            <i className="fa fa-user-circle text-gray-400 text-lg"></i>
          )}
        </div>
      ),
    },
    {
      key: 'gender',
      title: 'Gender',
      dataIndex: 'gender',
      width: 80,
      align: 'center' as const,
      render: (value: string) => (
        <span className={`font-medium ${value === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'playAudio',
      title: 'Play Audio',
      dataIndex: 'playAudio',
      width: 100,
      align: 'center' as const,
      render: (value: any, record: any) => (
        <Button size="sm" className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600 text-white border-0" title="Play Audio">
          <i className="fa fa-volume-up text-white text-sm"></i>
        </Button>
      ),
    },
    {
      key: 'gpsMap',
      title: 'GPS Map',
      dataIndex: 'gpsMap',
      width: 100,
      align: 'center' as const,
      render: (value: any, record: any) => (
        <Button size="sm" className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600 text-white border-0" title="GPS Map">
          <i className="fa fa-map text-white text-sm"></i>
        </Button>
      ),
    },
  ];

  const getQcOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'Fail':
        return <Badge variant="error" size="sm">Fail</Badge>;
      case 'Pass':
        return <Badge variant="success" size="sm">Pass</Badge>;
      case 'Pending':
        return <Badge variant="secondary" size="sm">Pending</Badge>;
      default:
        return <Badge variant="outline" size="sm">{outcome}</Badge>;
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value),
    }));
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={4} className="mb-6">
        Interview Log
      </Heading>

      <div className="w-full max-w-9xl mx-auto p-0 main-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2">
          <Card className="sticky top-4">
            <Heading level={4} className="mb-4">
              Filters
            </Heading>
            <div className="space-y-4">
              {/* State Teams */}
              <div>
                <Text className="text-sm font-medium mb-2">State Teams</Text>
                <SelectDropdown
                  options={agencyOptions}
                  value={filters.agencyId}
                  onChange={(value) => handleFilterChange('agencyId', value)}
                  placeholder="Select State Teams"
                />
              </div>

              {/* Server ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Server ID</Text>
                <Input
                  type="text"
                  placeholder="Search by Server ID"
                  value={filters.serverId}
                  onChange={(e) => handleFilterChange('serverId', e.target.value)}
                />
              </div>

              {/* Interview Date */}
              <div>
                <Text className="text-sm font-medium mb-2">Interview Date</Text>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Interview Date' },
                    { value: '2025-09-26', label: '2025-09-26' },
                    { value: '2025-09-25', label: '2025-09-25' },
                    { value: '2025-09-24', label: '2025-09-24' },
                    { value: '2025-09-23', label: '2025-09-23' },
                    { value: '2025-09-22', label: '2025-09-22' },
                  ]}
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', value)}
                  placeholder="Select Interview Date"
                />
              </div>

              {/* AC Code */}
              <div>
                <Text className="text-sm font-medium mb-2">AC Code</Text>
                <SelectDropdown
                  options={acOptions}
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', value)}
                  placeholder="Select AC"
                />
              </div>

              {/* Poling Station */}
              <div>
                <Text className="text-sm font-medium mb-2">Poling Station</Text>
                <SelectDropdown
                  options={[{ value: '', label: 'Select Poling Station' }]}
                  value={filters.psCode}
                  onChange={(value) => handleFilterChange('psCode', value)}
                  placeholder="Select Poling Station"
                />
              </div>

              {/* Enumerator ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Enumerator ID</Text>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Enumerator ID' },
                    { value: '1146', label: '1146' },
                    { value: '1147', label: '1147' },
                    { value: '1148', label: '1148' },
                    { value: '1149', label: '1149' },
                    { value: '1150', label: '1150' },
                  ]}
                  value={filters.userId}
                  onChange={(value) => handleFilterChange('userId', value)}
                  placeholder="Select Enumerator ID"
                />
              </div>

              {/* Interviewer ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Interviewer ID</Text>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Interviewer ID' },
                    { value: '1001', label: '1001' },
                    { value: '1002', label: '1002' },
                    { value: '1003', label: '1003' },
                    { value: '1004', label: '1004' },
                    { value: '101', label: '101' },
                  ]}
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', value)}
                  placeholder="Select Interviewer ID"
                />
              </div>

              {/* Device ID */}
              <div>
                <Text className="text-sm font-medium mb-2">Device ID</Text>
                <Input
                  type="text"
                  placeholder="Search by Device ID"
                  value={filters.deviceId}
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <Text className="text-sm font-medium mb-2">Mobile Number</Text>
                <Input
                  type="text"
                  placeholder="Search by Respondent Mobile"
                  value={filters.mobileNo}
                  onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
                />
              </div>

              {/* Audio QC */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Pending' },
                    { value: '2', label: 'Completed' },
                    { value: '0', label: 'NA' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audioQc.includes(option.value)}
                      onChange={(e) => 
                        handleCheckboxChange('audioQc', option.value, e.target.checked)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Audio QC Status */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC Status</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Pass' },
                    { value: '2', label: 'Fail' },
                    { value: '3', label: 'Pending' },
                    { value: '0', label: 'NA' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audioQcStatus.includes(option.value)}
                      onChange={(e) => 
                        handleCheckboxChange('audioQcStatus', option.value, e.target.checked)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Audio QC Status (Detailed) */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio QC Status (Detailed)</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Survey Conversation can be heard' },
                    { value: '2', label: 'No Conversation' },
                    { value: '3', label: 'Irrelevant Conversation' },
                    { value: '6', label: 'Interviewer acting as respondent' },
                    { value: '4', label: 'Can hear the interviewer more than the respondent' },
                    { value: '5', label: 'The interviewer is asking questions mechanically' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.audio1Status.includes(option.value)}
                      onChange={(e) => 
                        handleCheckboxChange('audio1Status', option.value, e.target.checked)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Audio Re-QC */}
              <div>
                <Text className="text-sm font-medium mb-2">Audio Re-QC</Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Pass' },
                    { value: '2', label: 'Fail' },
                    { value: '3', label: 'Pending' },
                    { value: '0', label: 'NA' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.qcRecheckStatusAudio.includes(option.value)}
                      onChange={(e) => 
                        handleCheckboxChange('qcRecheckStatusAudio', option.value, e.target.checked)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Text className="text-sm font-medium mb-2">Status</Text>
                <div className="space-y-2">
                  {[
                    { value: '40', label: 'Under QC' },
                    { value: '60', label: 'QC Completed' },
                    { value: '70', label: 'Under Re-QC' },
                    { value: '80', label: 'Re-QC Completed' },
                    { value: '10', label: 'Valid' },
                    { value: '20', label: 'Rejected' },
                    { value: '0', label: 'Terminated' },
                  ].map(option => (
                    <Checkbox
                      key={option.value}
                      checked={filters.status.includes(option.value)}
                      onChange={(e) => 
                        handleCheckboxChange('status', option.value, e.target.checked)
                      }
                      label={option.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-10">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Heading level={4}>
                Interview Details
              </Heading>
              <Button variant="outline" className="flex items-center gap-2">
                <i className="fa fa-download"></i>
                Download
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="mb-4">
                  <Text className="text-sm text-gray-600">
                    Showing <strong>{((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, 108333)}</strong> of <strong>108,333</strong> items.
                  </Text>
                </div>
                
                <DataGrid
                  data={interviewData}
                  columns={columns}
                  loading={false}
                  size="small"
                  className="border-0"
                />
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={Math.ceil(108333 / pageSize)}
                    totalItems={108333}
                    itemsPerPage={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    className="justify-center"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </Container>
  );
};

export default InterviewLogPage;
