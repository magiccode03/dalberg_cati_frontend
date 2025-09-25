'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Filter, Search, Map, Play, Eye } from 'lucide-react';

interface InterviewRecord {
  id: number;
  serverId: string;
  interviewDate: string;
  sampleType: string;
  acName: string;
  psName: string;
  deviceId: string;
  interviewerId: string;
  audioQc: string;
  audioQcId: string;
  audioFailReason: string;
  qcOutcome: 'Pass' | 'Fail' | 'Pending';
  status: string;
  gender: string;
  hasAudio: boolean;
  hasGps: boolean;
  hasPsImage: boolean;
  hasSelfieImage: boolean;
}

export default function InterviewLogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    agencyId: '',
    serverId: '',
    interviewDate: '',
    acCode: '',
    psCode: '',
    userId: '',
    interviewerId: '',
    deviceId: '',
    audioQc: '',
    audioQcStatus: '',
    audio1Status: '',
    qcRecheckStatusAudio: '',
    status: '',
    mobileNo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Mock data for demonstration - matching the image exactly
  const mockInterviews: InterviewRecord[] = [
    {
      id: 1,
      serverId: '302275',
      interviewDate: '2025-06-17',
      sampleType: 'Sample',
      acName: 'Cheria Bariarpur (141)',
      psName: '111. Utkramit Madhya Vidyalaya, Shekha Tola',
      deviceId: '9b565985d11c4d77',
      interviewerId: '',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Terminated',
      gender: '',
      hasAudio: false,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
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
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
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
      status: 'Rejected (N+W+RTA)',
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
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
      status: 'Rejected (N+W+RTA)',
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
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
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
    },
    {
      id: 6,
      serverId: '301702',
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
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
    },
    {
      id: 7,
      serverId: '301683',
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
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
    },
    {
      id: 8,
      serverId: '301680',
      interviewDate: '2025-06-14',
      sampleType: 'Booster',
      acName: 'Riga (23)',
      psName: '23. Agricultural Production Market Committee',
      deviceId: 'a8d995531de8e844',
      interviewerId: '104',
      audioQc: 'NA',
      audioQcId: '',
      audioFailReason: '',
      qcOutcome: 'Fail',
      status: 'Rejected (N+W+RTA)',
      gender: 'Male',
      hasAudio: true,
      hasGps: true,
      hasPsImage: false,
      hasSelfieImage: false
    }
  ];


  const agencyOptions = [
    { value: '', label: 'Select State Teams' },
    { value: '1', label: 'Kadence' },
    { value: '2', label: 'Chandan' },
    { value: '3', label: 'Rohit' },
    { value: '4', label: 'Parbhat' },
    { value: '5', label: 'Navin' },
    { value: '6', label: 'Aeon' },
    { value: '7', label: 'Abhinav' },
    { value: '8', label: 'Inhouse' }
  ];

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
    { value: '214', label: 'Arwal (214)' }
  ];

  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select Interview Date' }];
    const today = new Date();
    for (let i = 0; i < 150; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      options.push({ value: dateStr, label: dateStr });
    }
    return options;
  };

  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [field]: Array.isArray(value) ? value[0] : value }));
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading interview data...');
  };

  const handlePlayAudio = (serverId: string) => {
    // Implement audio playback
    console.log('Playing audio for server ID:', serverId);
  };

  const handleViewGps = (serverId: string) => {
    // Implement GPS map view
    console.log('Viewing GPS map for server ID:', serverId);
  };

  const getQcOutcomeBadge = (outcome: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (outcome) {
      case 'Pass':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'Fail':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  if (user?.role !== 'pmt' && user?.role !== 'super_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access the Interview Log.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Interview Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and filter interview details and quality control information.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Filters Sidebar - 2 columns on large screens, 12 on mobile */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="sticky top-4 overflow-y-auto max-h-screen">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h4>
                <Filter className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="space-y-4">
              {/* State Teams */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State Teams
                </label>
                <SelectDropdown
                  options={agencyOptions}
                  value={filters.agencyId}
                  onChange={(value) => handleFilterChange('agencyId', value)}
                  placeholder="Select State Teams"
                />
              </div>

              {/* Server ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Server ID
                </label>
                <Input
                  type="text"
                  placeholder="Search by Server ID"
                  value={filters.serverId}
                  onChange={(e) => handleFilterChange('serverId', e.target.value)}
                />
              </div>

              {/* Interview Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Date
                </label>
                <SelectDropdown
                  options={generateDateOptions()}
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', value)}
                  placeholder="Select Interview Date"
                />
              </div>

              {/* AC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AC Code
                </label>
                <SelectDropdown
                  options={acOptions}
                  value={filters.acCode}
                  onChange={(value) => handleFilterChange('acCode', value)}
                  placeholder="Select AC"
                />
              </div>

              {/* Polling Station */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Polling Station
                </label>
                <SelectDropdown
                  options={[{ value: '', label: 'Select Polling Station' }]}
                  value={filters.psCode}
                  onChange={(value) => handleFilterChange('psCode', value)}
                  placeholder="Select Polling Station"
                />
              </div>

              {/* Enumerator ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enumerator ID
                </label>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Enumerator ID' },
                    { value: '1146', label: '1146' },
                    { value: '1147', label: '1147' },
                    { value: '1148', label: '1148' }
                  ]}
                  value={filters.userId}
                  onChange={(value) => handleFilterChange('userId', value)}
                  placeholder="Select Enumerator ID"
                />
              </div>

              {/* Interviewer ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interviewer ID
                </label>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Interviewer ID' },
                    { value: '1001', label: '1001' },
                    { value: '1002', label: '1002' },
                    { value: '1003', label: '1003' }
                  ]}
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', value)}
                  placeholder="Select Interviewer ID"
                />
              </div>

              {/* Device ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device ID
                </label>
                <Input
                  type="text"
                  placeholder="Search by Device ID"
                  value={filters.deviceId}
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                />
              </div>

              {/* Audio QC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audio Qc
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Pending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">NA</span>
                  </label>
                </div>
              </div>

              {/* Audio Qc Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audio Qc Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Pass</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Fail</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Pending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">NA</span>
                  </label>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <Input
                  type="text"
                  placeholder="Search by Respondent Mobile"
                  value={filters.mobileNo}
                  onChange={(e) => handleFilterChange('mobileNo', e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content - 10 columns on large screens, 12 on mobile */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Details</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Server ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
                        Interview Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sample Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">AC Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PS Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interviewer ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Audio QC</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Audio QC ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Audio Fail Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockInterviews.map((interview, index) => (
                      <tr key={interview.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.serverId}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.interviewDate}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.sampleType}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.acName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.psName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.deviceId}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.interviewerId}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.audioQc}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.audioQcId}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {interview.audioFailReason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">1-50</span> of <span className="font-medium">108,333</span> items
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" disabled>First</Button>
                    <Button variant="outline" size="sm" disabled>«</Button>
                    <Button variant="primary" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">4</Button>
                    <Button variant="outline" size="sm">5</Button>
                    <Button variant="outline" size="sm">»</Button>
                    <Button variant="outline" size="sm">Last</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
