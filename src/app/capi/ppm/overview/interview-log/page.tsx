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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      <Heading level={1} className="mb-6">
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
              <Heading level={4}>
                Interview Details
              </Heading>
              <Button variant="outline" className="flex items-center gap-2">
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
                        <TableRow key={interview.id} className="hover:bg-gray-50">
                          <TableCell className="text-center text-gray-500 font-medium w-16">
                            {index + 1}
                          </TableCell>
                          <TableCell className="w-32">
                            <span className="font-mono text-sm font-medium text-blue-600">
                              {interview.serverId}
                            </span>
                          </TableCell>
                          <TableCell className="w-32">{interview.interviewDate}</TableCell>
                          <TableCell className="w-24">{interview.sampleType}</TableCell>
                          <TableCell className="w-48">{interview.acName}</TableCell>
                          <TableCell className="w-64">{interview.psName}</TableCell>
                          <TableCell className="w-40">{interview.deviceId}</TableCell>
                          <TableCell className="w-32">{interview.interviewerId}</TableCell>
                          <TableCell className="w-24">{interview.audioQc}</TableCell>
                          <TableCell className="w-32">{interview.audioQcId}</TableCell>
                          <TableCell className="w-40">{interview.audioFailReason}</TableCell>
                          <TableCell className="text-center w-32">
                            {getQcOutcomeBadge(interview.qcOutcome)}
                          </TableCell>
                          <TableCell className="w-48">{interview.status}</TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                              {interview.psImage ? (
                                <img src={interview.psImage} alt="PS Image" className="w-8 h-8 rounded object-cover" />
                              ) : (
                                <Image className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                              {interview.selfieImage ? (
                                <img src={interview.selfieImage} alt="Selfie Image" className="w-8 h-8 rounded object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center w-20">
                            <span className={`font-medium ${interview.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>
                              {interview.gender}
                            </span>
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                              <button 
                                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors duration-200" 
                                title="Play Audio"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center w-24">
                            <div className="flex justify-center items-center">
                              <button 
                                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors duration-200" 
                                title="GPS Map"
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
