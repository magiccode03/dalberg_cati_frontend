'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Calendar, X, Eye, Download } from 'lucide-react';

interface BroadcastRecord {
  id: number;
  broadcastTitle: string;
  apiAnnouncementId: string;
  apiStatus: string;
  apiCode: string;
  apiDesc: string;
  uploadAt: string;
}

export default function BroadcastsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    broadcastTitle: '',
    broadcastId: '',
    broadcastDate: '2025-09-25'
  });

  // Mock data for demonstration
  const mockBroadcasts: BroadcastRecord[] = [
    {
      id: 1,
      broadcastTitle: 'Daily Field Update',
      apiAnnouncementId: 'ANN001',
      apiStatus: 'Active',
      apiCode: '200',
      apiDesc: 'Success',
      uploadAt: '2025-09-25 10:30:00'
    },
    {
      id: 2,
      broadcastTitle: 'Quality Check Reminder',
      apiAnnouncementId: 'ANN002',
      apiStatus: 'Pending',
      apiCode: '201',
      apiDesc: 'Created',
      uploadAt: '2025-09-24 15:45:00'
    },
    {
      id: 3,
      broadcastTitle: 'System Maintenance Notice',
      apiAnnouncementId: 'ANN003',
      apiStatus: 'Completed',
      apiCode: '200',
      apiDesc: 'Success',
      uploadAt: '2025-09-23 09:15:00'
    }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching with filters:', filters);
  };

  const handleViewDetail = (broadcastId: number) => {
    // Implement view detail functionality
    console.log('Viewing detail for broadcast:', broadcastId);
  };

  const handleFetch = (broadcastId: number) => {
    // Implement fetch functionality
    console.log('Fetching broadcast:', broadcastId);
  };

  const clearDate = () => {
    setFilters(prev => ({ ...prev, broadcastDate: '' }));
  };

  if (user?.role !== 'pmt' && user?.role !== 'super_admin') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access the Broadcasts page.
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
          Broadcasts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and monitor system broadcasts and announcements.
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search By Broadcast Title"
                  value={filters.broadcastTitle}
                  onChange={(e) => handleFilterChange('broadcastTitle', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search By Broadcast ID"
                  value={filters.broadcastId}
                  onChange={(e) => handleFilterChange('broadcastId', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.broadcastDate}
                    onChange={(e) => handleFilterChange('broadcastDate', e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {filters.broadcastDate && (
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
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">List of Broadcasts</h4>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Broadcast Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Announcement ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">API Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Api Desc</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">UploadAt</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detail</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fetch</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {mockBroadcasts.length > 0 ? (
                  mockBroadcasts.map((broadcast, index) => (
                    <tr key={broadcast.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {broadcast.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {broadcast.broadcastTitle}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {broadcast.apiAnnouncementId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          broadcast.apiStatus === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : broadcast.apiStatus === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {broadcast.apiStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {broadcast.apiCode}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {broadcast.apiDesc}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {broadcast.uploadAt}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(broadcast.id)}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFetch(broadcast.id)}
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Fetch
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center">
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
