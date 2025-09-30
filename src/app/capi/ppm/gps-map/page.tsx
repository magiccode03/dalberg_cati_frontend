'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Search, MapPin, Filter, RefreshCw } from 'lucide-react';

export default function GPSMapPage() {
  const [filters, setFilters] = useState({
    interviewDate: '',
    acCode: '',
    psCode: '',
    interviewerId: '',
    status: '',
    serverId: ''
  });

  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns
  const interviewDates = [
    { value: '2025-06-17', label: '2025-06-17' },
    { value: '2025-06-15', label: '2025-06-15' },
    { value: '2025-06-14', label: '2025-06-14' },
    { value: '2025-06-13', label: '2025-06-13' },
    { value: '2025-06-12', label: '2025-06-12' },
    { value: '2025-06-11', label: '2025-06-11' },
    { value: '2025-06-10', label: '2025-06-10' },
    { value: '2025-06-09', label: '2025-06-09' },
    { value: '2025-06-08', label: '2025-06-08' },
    { value: '2025-06-07', label: '2025-06-07' },
  ];

  const acOptions = [
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
  ];

  const psOptions = [
    { value: '1', label: 'Polling Station 1' },
    { value: '2', label: 'Polling Station 2' },
    { value: '3', label: 'Polling Station 3' },
    { value: '4', label: 'Polling Station 4' },
    { value: '5', label: 'Polling Station 5' },
  ];

  const interviewerOptions = [
    { value: 'INT001', label: 'Interviewer 001' },
    { value: 'INT002', label: 'Interviewer 002' },
    { value: 'INT003', label: 'Interviewer 003' },
    { value: 'INT004', label: 'Interviewer 004' },
    { value: 'INT005', label: 'Interviewer 005' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFilters({
      interviewDate: '',
      acCode: '',
      psCode: '',
      interviewerId: '',
      status: '',
      serverId: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            GPS Map
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View GPS locations and track interview progress on the map
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Interview Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Date
                </label>
                <SelectDropdown
                  options={interviewDates}
                  value={filters.interviewDate}
                  onChange={(value) => handleFilterChange('interviewDate', value)}
                  placeholder="Select Interview Date"
                />
              </div>

              {/* AC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AC
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
                  options={psOptions}
                  value={filters.psCode}
                  onChange={(value) => handleFilterChange('psCode', value)}
                  placeholder="Select Polling Station"
                />
              </div>

              {/* Interviewer ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interviewer ID
                </label>
                <SelectDropdown
                  options={interviewerOptions}
                  value={filters.interviewerId}
                  onChange={(value) => handleFilterChange('interviewerId', value)}
                  placeholder="Select Interviewer ID"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <SelectDropdown
                  options={statusOptions}
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  placeholder="Select Status"
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
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleSearch}
                loading={loading}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* GPS Map Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                GPS Map
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative">
              <div 
                className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                style={{ minHeight: '400px' }}
              >
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    GPS Map
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Interactive map showing GPS locations and interview progress
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Map integration will be implemented here
                  </div>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
