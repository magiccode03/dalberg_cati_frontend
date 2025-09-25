'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DataTable from '@/components/tables/DataTable';
import { Download, Search, Volume2, MapPin } from 'lucide-react';

interface InterviewData {
  id: number;
  serverId: string;
  interviewDate: string;
  acName: string;
  psName: string;
  deviceId: string;
  interviewerId: string;
  audioQC: string;
  audioFailReason: string;
  outcome: string;
  status: string;
  gender: string;
  hasAudio: boolean;
  hasGPS: boolean;
}

const InterviewDetailPage = () => {
  const [filters, setFilters] = useState({
    serverId: '',
    interviewDate: '',
    acCode: '',
    psCode: '',
    interviewerId: '',
    deviceId: '',
    audioQCStatus: [] as string[],
    status: [] as string[],
    mobileNo: ''
  });

  // Generate comprehensive mock data for interviews
  const generateInterviewData = (): InterviewData[] => {
    const data: InterviewData[] = [];
    const acNames = [
      'Cheria Bariarpur (141)', 'Chenari (SC) (207)', 'Riga (23)', 'Simri Bakhtiarpur (76)', 
      'Bihariganj (71)', 'Araria (49)', 'Patna Sahib (184)', 'Darbhanga (83)', 
      'Muzaffarpur (94)', 'Gaya Town (230)', 'Bhagalpur (156)', 'Purnia (62)',
      'Sitamarhi (28)', 'Madhubani (36)', 'Samastipur (133)', 'Begusarai (146)',
      'Munger (165)', 'Nalanda (176)', 'Buxar (200)', 'Sasaram (208)'
    ];
    
    const psNames = [
      'Primary School, Rajani Milik', 'Utkramit Madhya Vidyalaya', 'State Middle School',
      'Agricultural Production Market Committee', 'High School Complex', 'Government School',
      'Municipal School', 'Private School', 'Community Center', 'Village Panchayat Office'
    ];
    
    const outcomes = ['Fail', 'Pass'];
    const statuses = [
      'Terminated', 'Rejected (N+W+RTA)', 'Rejected (Short Interview - 0 sec)', 
      'Rejected (Audio reject)', 'Under QC', 'QC Completed', 'Valid', 'Under Re-QC'
    ];
    const audioQCStatuses = ['NA', 'Pass', 'Fail', 'Pending'];
    const audioFailReasons = [
      '', 'Interviewer acting as respondent', 'No Conversation', 'Irrelevant Conversation',
      'Survey Conversation can be heard /Reject on Not Matched Logic',
      'Survey Conversation can be heard /Reject on Caste',
      'Survey Conversation can be heard /Reject on Gender'
    ];
    const genders = ['Male', 'Female', ''];
    
    const deviceIds = [
      '9b565985d11c4d77', '5e47ae85d3f83fa7', 'a8d995531de8e844', '86c300377b0bbc5b',
      '777a4fc95e87112f', 'e89d385e3b5e7920', 'e0bf4494f7d68a78', 'f8a2b3c4d5e6f7g8',
      'a1b2c3d4e5f6g7h8', 'i9j0k1l2m3n4o5p6', 'q7r8s9t0u1v2w3x4', 'y5z6a7b8c9d0e1f2'
    ];
    
    const interviewerIds = [
      '', '935', '721', '1100', '811', '214', '104', '775', '1001', '1002', '1003', '1004',
      '101', '1011', '1014', '1015', '1016', '1017', '1018', '102', '1020', '1027', '1028'
    ];

    for (let i = 1; i <= 108333; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
      
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const audioQC = audioQCStatuses[Math.floor(Math.random() * audioQCStatuses.length)];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      
      data.push({
        id: i,
        serverId: (300000 + i).toString(),
        interviewDate: randomDate.toISOString().split('T')[0],
        acName: acNames[Math.floor(Math.random() * acNames.length)],
        psName: `${Math.floor(Math.random() * 200) + 1}. ${psNames[Math.floor(Math.random() * psNames.length)]}`,
        deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
        interviewerId: interviewerIds[Math.floor(Math.random() * interviewerIds.length)],
        audioQC: audioQC,
        audioFailReason: audioQC === 'Fail' ? audioFailReasons[Math.floor(Math.random() * audioFailReasons.length)] : '',
        outcome: outcome,
        status: status,
        gender: gender,
        hasAudio: Math.random() > 0.3, // 70% chance of having audio
        hasGPS: true // All records have GPS
      });
    }
    
    return data;
  };

  const interviewData = generateInterviewData();

  // Generate date options for the last 3 months
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Interview Date' }];
    const today = new Date();
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    
    return options;
  };

  // AC options
  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '195', label: 'Agiaon (SC) (195)' },
    { value: '70', label: 'Alamnagar (70)' },
    { value: '148', label: 'Alauli (SC) (148)' },
    { value: '81', label: 'Alinagar (81)' },
    { value: '159', label: 'Amarpur (159)' },
    { value: '120', label: 'Amnour (120)' },
    { value: '56', label: 'Amour (56)' },
    { value: '49', label: 'Araria (49)' },
    { value: '194', label: 'Arrah (194)' },
    { value: '214', label: 'Arwal (214)' },
    { value: '171', label: 'Asthawan (171)' },
    { value: '233', label: 'Atri (233)' },
    { value: '89', label: 'Aurai (89)' },
    { value: '223', label: 'Aurangabad (223)' }
  ];

  // Interviewer ID options
  const interviewerOptions = [
    { value: '', label: 'Select Interviewer ID' },
    { value: '1001', label: '1001' },
    { value: '1002', label: '1002' },
    { value: '1003', label: '1003' },
    { value: '1004', label: '1004' },
    { value: '101', label: '101' },
    { value: '1011', label: '1011' },
    { value: '1014', label: '1014' },
    { value: '1015', label: '1015' },
    { value: '1016', label: '1016' },
    { value: '1017', label: '1017' },
    { value: '1018', label: '1018' },
    { value: '102', label: '102' },
    { value: '1020', label: '1020' },
    { value: '1027', label: '1027' },
    { value: '1028', label: '1028' },
    { value: '1029', label: '1029' },
    { value: '103', label: '103' },
    { value: '1030', label: '1030' },
    { value: '1034', label: '1034' },
    { value: '1035', label: '1035' }
  ];

  // Audio QC Status options
  const audioQCStatusOptions = [
    { value: '1', label: 'Pass' },
    { value: '2', label: 'Fail' },
    { value: '3', label: 'Pending' },
    { value: '0', label: 'NA' }
  ];

  // Status options
  const statusOptions = [
    { value: '40', label: 'Under QC' },
    { value: '60', label: 'QC Completed' },
    { value: '70', label: 'Under Re-QC' },
    { value: '80', label: 'Re-QC Completed' },
    { value: '10', label: 'Valid' },
    { value: '20', label: 'Rejected' },
    { value: '0', label: 'Terminated' }
  ];

  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with filters:', filters);
  };

  const handleDownload = () => {
    // Implement download logic here
    const csvContent = [
      ['#', 'Server ID', 'Interview Date', 'AC Name', 'PS Name', 'Device ID', 'Interviewer ID', 'Audio QC', 'Audio Fail Reason', 'Outcome', 'Status', 'Gender'],
      ...interviewData.map((item, index) => [
        index + 1,
        item.serverId,
        item.interviewDate,
        item.acName,
        item.psName,
        item.deviceId,
        item.interviewerId,
        item.audioQC,
        item.audioFailReason,
        item.outcome,
        item.status,
        item.gender
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-detail.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePlayAudio = (serverId: string) => {
    // Implement audio playback logic
    console.log('Playing audio for server ID:', serverId);
  };

  const handleGPSMap = (serverId: string) => {
    // Implement GPS map logic
    console.log('Opening GPS map for server ID:', serverId);
  };

  const columns = [
    {
      key: 'id' as keyof InterviewData,
      label: '#',
      sortable: true
    },
    {
      key: 'serverId' as keyof InterviewData,
      label: 'Server ID',
      sortable: true
    },
    {
      key: 'interviewDate' as keyof InterviewData,
      label: 'Interview Date',
      sortable: true
    },
    {
      key: 'acName' as keyof InterviewData,
      label: 'AC Name',
      sortable: true
    },
    {
      key: 'psName' as keyof InterviewData,
      label: 'PS Name',
      sortable: true
    },
    {
      key: 'deviceId' as keyof InterviewData,
      label: 'Device ID',
      sortable: true
    },
    {
      key: 'interviewerId' as keyof InterviewData,
      label: 'Interviewer ID',
      sortable: true
    },
    {
      key: 'audioQC' as keyof InterviewData,
      label: 'Audio QC',
      sortable: true
    },
    {
      key: 'audioFailReason' as keyof InterviewData,
      label: 'Audio Fail Reason',
      sortable: true
    },
    {
      key: 'outcome' as keyof InterviewData,
      label: 'Outcome',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Fail' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status' as keyof InterviewData,
      label: 'Status',
      sortable: true
    },
    {
      key: 'gender' as keyof InterviewData,
      label: 'Gender',
      sortable: true
    },
    {
      key: 'hasAudio' as keyof InterviewData,
      label: 'Play Audio',
      sortable: false,
      render: (value: boolean, row: InterviewData) => (
        value ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePlayAudio(row.serverId)}
            className="p-1"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        ) : null
      )
    },
    {
      key: 'hasGPS' as keyof InterviewData,
      label: 'GPS Map',
      sortable: false,
      render: (value: boolean, row: InterviewData) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleGPSMap(row.serverId)}
          className="p-1"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Interview Detail</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <div className="p-4 border-b">
              <h4 className="text-lg font-semibold">Filters</h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Input
                  placeholder="Search by Server ID"
                  value={filters.serverId}
                  onChange={(e) => handleFilterChange('serverId', e.target.value)}
                />
              </div>

              <div>
                <SelectDropdown
                  options={generateDateOptions()}
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', Array.isArray(value) ? value[0] : value)}
                  placeholder="Select Interview Date"
                />
              </div>

              <div>
                <SelectDropdown
                  options={acOptions}
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', Array.isArray(value) ? value[0] : value)}
                  placeholder="Select AC"
                />
              </div>

              <div>
                <SelectDropdown
                  options={[{ value: '', label: 'Select Poling Station' }]}
                  value={filters.psCode}
                  onChange={(value) => handleFilterChange('psCode', Array.isArray(value) ? value[0] : value)}
                  placeholder="Select Poling Station"
                />
              </div>

              <div>
                <SelectDropdown
                  options={interviewerOptions}
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', Array.isArray(value) ? value[0] : value)}
                  placeholder="Select Interviewer ID"
                />
              </div>

              <div>
                <Input
                  placeholder="Search by Device ID"
                  value={filters.deviceId}
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio QC Status
                </label>
                <div className="space-y-2">
                  {audioQCStatusOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.audioQCStatus.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('audioQCStatus', [...filters.audioQCStatus, option.value]);
                          } else {
                            handleFilterChange('audioQCStatus', filters.audioQCStatus.filter(s => s !== option.value));
                          }
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.status.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('status', [...filters.status, option.value]);
                          } else {
                            handleFilterChange('status', filters.status.filter(s => s !== option.value));
                          }
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  placeholder="Search by Respondent Mobile"
                  value={filters.mobileNo}
                  onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
                />
              </div>

              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <h4 className="text-lg font-semibold">Interview Detail</h4>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div>
              <DataTable
                data={interviewData}
                columns={columns}
                searchable={true}
                sortable={true}
                pagination={true}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPage;
