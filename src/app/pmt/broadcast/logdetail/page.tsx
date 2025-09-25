'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Search, Calendar, X } from 'lucide-react';

interface LogDetailRecord {
  id: number;
  broadcastTitle: string;
  serverId: string;
  apiContactNumber: string;
  apiUniqueId: string;
  apiSystemApiUniqueid: string;
  apiStatus: string;
  apiDesc: string;
  callStatus: string;
  callReport: string;
  callDuration: string;
  callTimeStart: string;
  callTimeConnect: string;
  callTimeEnd: string;
  callDtmf: string;
  callCurrentRetryCount: number;
  callIvrExecuteFlow: string;
  apiFetchResponse: string;
}

export default function BroadcastLogDetailPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    logDate: '2025-09-25',
    callReport: '',
    apiUniqueId: '',
    logDetailId: '',
    serverId: ''
  });

  // Mock data for demonstration
  const mockLogDetails: LogDetailRecord[] = [
    {
      id: 1,
      broadcastTitle: 'Daily Field Update',
      serverId: '188970',
      apiContactNumber: '+919876543210',
      apiUniqueId: 'API001',
      apiSystemApiUniqueid: 'SYS001',
      apiStatus: 'Success',
      apiDesc: 'Call completed successfully',
      callStatus: 'Completed',
      callReport: 'Answered',
      callDuration: '00:02:30',
      callTimeStart: '2025-09-25 10:30:00',
      callTimeConnect: '2025-09-25 10:30:15',
      callTimeEnd: '2025-09-25 10:32:45',
      callDtmf: '1234',
      callCurrentRetryCount: 1,
      callIvrExecuteFlow: 'Standard',
      apiFetchResponse: 'Success'
    },
    {
      id: 2,
      broadcastTitle: 'Quality Check Reminder',
      serverId: '188971',
      apiContactNumber: '+919876543211',
      apiUniqueId: 'API002',
      apiSystemApiUniqueid: 'SYS002',
      apiStatus: 'Failed',
      apiDesc: 'No answer from recipient',
      callStatus: 'Failed',
      callReport: 'No Answer',
      callDuration: '00:00:00',
      callTimeStart: '2025-09-25 11:15:00',
      callTimeConnect: '',
      callTimeEnd: '2025-09-25 11:17:00',
      callDtmf: '',
      callCurrentRetryCount: 3,
      callIvrExecuteFlow: 'Standard',
      apiFetchResponse: 'Failed'
    }
  ];

  const callReportOptions = [
    { value: '', label: 'Select Call Report' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Answered', label: 'Answered' },
    { value: 'No Answer', label: 'No Answer' },
    { value: 'Busy', label: 'Busy' },
    { value: 'Dialed', label: 'Dialed' }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching with filters:', filters);
  };

  const clearDate = () => {
    setFilters(prev => ({ ...prev, logDate: '' }));
  };

  if (user?.role !== 'pmt' && user?.role !== 'super_admin') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access the Broadcasts - Log Detail page.
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
          Broadcasts - Log Detail
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View detailed logs of broadcast calls and their status.
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.logDate}
                    onChange={(e) => handleFilterChange('logDate', e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {filters.logDate && (
                      <button
                        type="button"
                        onClick={clearDate}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <SelectDropdown
                  options={callReportOptions}
                  value={filters.callReport}
                  onChange={(value) => handleFilterChange('callReport', value)}
                  placeholder="Select Call Report"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search By API Unique ID"
                  value={filters.apiUniqueId}
                  onChange={(e) => handleFilterChange('apiUniqueId', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search By Log Detail ID"
                  value={filters.logDetailId}
                  onChange={(e) => handleFilterChange('logDetailId', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search By Server ID"
                  value={filters.serverId}
                  onChange={(e) => handleFilterChange('serverId', e.target.value)}
                />
              </div>
              <div>
                <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </form>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">List of Log</h4>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Broadcast Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Server ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Contact Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Unique ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api System Api Uniqueid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Desc</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Report</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Time Start</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Time Connect</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Time End</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Dtmf</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Current Retry Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Ivr Execute Flow</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Fetch Response</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {mockLogDetails.length > 0 ? (
                  mockLogDetails.map((log, index) => (
                    <tr key={log.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.broadcastTitle}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.serverId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.apiContactNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.apiUniqueId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.apiSystemApiUniqueid}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.apiStatus === 'Success' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {log.apiStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.apiDesc}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.callStatus === 'Completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {log.callStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.callReport === 'Answered' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : log.callReport === 'No Answer'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {log.callReport}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callDuration}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callTimeStart}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callTimeConnect}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callTimeEnd}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callDtmf}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callCurrentRetryCount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {log.callIvrExecuteFlow}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.apiFetchResponse === 'Success' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {log.apiFetchResponse}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={18} className="px-4 py-8 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        No results found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
