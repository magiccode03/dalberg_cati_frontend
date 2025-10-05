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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Volume2, MapPin, Image, User } from 'lucide-react';

// Display data interface for transformed data
interface DisplayInterviewData {
  server_id: string;
  interview_date: string;
  sample_type: string;
  ac_code: number;
  ac_name: string;
  ps_name: string;
  device_id: string;
  interviewer_id: string;
  audio_qc_label: string;
  audio_qc_id: string;
  audio1_status_label: string;
  qc_outcome: string;
  status_label: string;
  gender_label: string;
  gps_available: boolean;
  ps_image_available: boolean;
  selfie_image_available: boolean;
  audio_playback_available: boolean;
}

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
  const interviewData: DisplayInterviewData[] = [
    {
      server_id: '302275',
      interview_date: '2025-06-17',
      sample_type: 'Sample',
      ac_code: 141,
      ac_name: 'Cheria Bariarpur (141)',
      ps_name: '111. Utkramit Madhya Vidyalaya,Shekha Tola',
      device_id: '9b565985d11c4d77',
      interviewer_id: '',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Terminated',
      gender_label: '',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: '301767',
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '935',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (N+W+RTA)',
      gender_label: 'Male',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: '301745',
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '935',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (Short Interview - 0 sec)',
      gender_label: 'Male',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: '301739',
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '721',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (Short Interview - 0 sec)',
      gender_label: 'Male',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
    },
    {
      server_id: '301705',
      interview_date: '2025-06-15',
      sample_type: 'Booster',
      ac_code: 207,
      ac_name: 'Chenari (SC) (207)',
      ps_name: '100. Primary School, Kekai',
      device_id: '5e47ae85d3f83fa7',
      interviewer_id: '935',
      audio_qc_label: 'NA',
      audio_qc_id: '',
      audio1_status_label: '',
      qc_outcome: 'Fail',
      status_label: 'Rejected (N+W+RTA)',
      gender_label: 'Female',
      gps_available: true,
      ps_image_available: false,
      selfie_image_available: false,
      audio_playback_available: true,
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
                    { value: '2025-06-17', label: '2025-06-17' },
                    { value: '2025-06-15', label: '2025-06-15' },
                    { value: '2025-06-14', label: '2025-06-14' },
                    { value: '2025-06-13', label: '2025-06-13' },
                    { value: '2025-06-12', label: '2025-06-12' },
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
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audioQc', option.value, checked as boolean)
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
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audioQcStatus', option.value, checked as boolean)
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
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('audio1Status', option.value, checked as boolean)
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
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('qcRecheckStatusAudio', option.value, checked as boolean)
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
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('status', option.value, checked as boolean)
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
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4}>
                Interview Details
              </Heading>
                </div>
                <Button variant="outline" className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600">
                <i className="fa fa-download"></i>
                Download
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <Text className="text-sm text-gray-600">
                      Showing <strong>{((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, 108333)}</strong> of <strong>108,333</strong> items.
                  </Text>
                </div>
                
                <div className="overflow-x-auto">
                  <Table striped bordered hover className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center w-16">#</TableHead>
                        <TableHead className="w-32">Server ID</TableHead>
                        <TableHead className="w-32">Interview Date</TableHead>
                        <TableHead className="w-24">Sample Type</TableHead>
                        <TableHead className="w-48">AC Name</TableHead>
                        <TableHead className="w-64">PS Name</TableHead>
                        <TableHead className="w-40">Device ID</TableHead>
                        <TableHead className="w-32">Interviewer ID</TableHead>
                        <TableHead className="w-24">Audio QC</TableHead>
                        <TableHead className="w-32">Audio QC ID</TableHead>
                        <TableHead className="w-40">Audio Fail Reason</TableHead>
                        <TableHead className="text-center w-32">QC Outcome</TableHead>
                        <TableHead className="w-48">Status</TableHead>
                        <TableHead className="text-center w-24">PS Image</TableHead>
                        <TableHead className="text-center w-24">Selfie Image</TableHead>
                        <TableHead className="text-center w-20">Gender</TableHead>
                        <TableHead className="text-center w-24">Play Audio</TableHead>
                        <TableHead className="text-center w-24">GPS Map</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interviewData.map((interview, index) => (
                          <TableRow key={`interview-${interview.server_id}-${index}`} className="hover:bg-gray-50">
                          <TableCell className="text-center text-gray-500 font-medium w-16">
                              {((currentPage - 1) * pageSize) + index + 1}
                          </TableCell>
                          <TableCell className="w-32">
                            <span className="font-mono text-sm font-medium text-blue-600">
                                {interview.server_id}
                            </span>
                          </TableCell>
                            <TableCell className="w-32 font-mono text-sm">{interview.interview_date}</TableCell>
                            <TableCell className="w-24">{interview.sample_type}</TableCell>
                            <TableCell className="w-48">{interview.ac_name}</TableCell>
                            <TableCell className="w-64">{interview.ps_name}</TableCell>
                            <TableCell className="w-40">{interview.device_id}</TableCell>
                            <TableCell className="w-32">{interview.interviewer_id || '-'}</TableCell>
                            <TableCell className="w-24">{interview.audio_qc_label}</TableCell>
                            <TableCell className="w-32">{interview.audio_qc_id || '-'}</TableCell>
                            <TableCell className="w-40">{interview.audio1_status_label || '-'}</TableCell>
                          <TableCell className="text-center w-32">
                              {getQcOutcomeBadge(interview.qc_outcome)}
                          </TableCell>
                            <TableCell className="w-48">{interview.status_label}</TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                                {interview.ps_image_available ? (
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Image className="w-4 h-4 text-green-600" />
                                  </div>
                              ) : (
                                <Image className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                                {interview.selfie_image_available ? (
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-green-600" />
                                  </div>
                              ) : (
                                <User className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center w-20">
                              <span className={`font-medium ${interview.gender_label === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>
                                {interview.gender_label || '-'}
                            </span>
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                              <button 
                                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 ${
                                    interview.audio_playback_available 
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                  title={interview.audio_playback_available ? "Play Audio" : "Audio Not Available"}
                                  disabled={!interview.audio_playback_available}
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                              <button 
                                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 ${
                                    interview.gps_available 
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                  title={interview.gps_available ? "View GPS Map" : "GPS Not Available"}
                                  disabled={!interview.gps_available}
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
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