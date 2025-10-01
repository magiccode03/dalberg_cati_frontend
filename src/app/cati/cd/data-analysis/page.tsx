'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Search, Cross } from 'lucide-react';

// Sample data for the charts
const genderData = [
  { name: 'Male', value: 45, color: '#3B82F6' },
  { name: 'Female', value: 35, color: '#EF4444' },
  { name: 'Other', value: 20, color: '#10B981' }
];

const religionData = [
  { name: 'Hindu', value: 60, color: '#8B5CF6' },
  { name: 'Muslim', value: 25, color: '#F59E0B' },
  { name: 'Christian', value: 10, color: '#06B6D4' },
  { name: 'Other', value: 5, color: '#84CC16' }
];

const socialCategoryData = [
  { name: 'General', value: 75485, color: '#6366F1' },
  { name: 'OBC', value: 90212, color: '#EC4899' },
  { name: 'SC', value: 60142, color: '#14B8A6' },
  { name: 'ST', value: 30197, color: '#F97316' }
];

const ageGroupData = [
  { name: '18-25', value: 45053, color: '#3B82F6' },
  { name: '26-35', value: 75177, color: '#EF4444' },
  { name: '36-45', value: 90212, color: '#10B981' },
  { name: '46-55', value: 60142, color: '#F59E0B' },
  { name: '56+', value: 30197, color: '#8B5CF6' }
];

const localityData = [
  { name: 'Urban', value: 165194, color: '#06B6D4' },
  { name: 'Rural', value: 135587, color: '#84CC16' }
];

const pcData = [
  { name: 'PC1', value: 4250, color: '#3B82F6' },
  { name: 'PC2', value: 5927, color: '#EF4444' },
  { name: 'PC3', value: 6203, color: '#10B981' },
  { name: 'PC4', value: 5564, color: '#F59E0B' },
  { name: 'PC5', value: 6579, color: '#8B5CF6' }
];

const acData = [
  { name: 'Alipurduars', value: 4250, color: '#06B6D4' },
  { name: 'Amdanga', value: 5927, color: '#84CC16' },
  { name: 'Amta', value: 6203, color: '#F97316' },
  { name: 'Arambag', value: 5564, color: '#EC4899' },
  { name: 'Asansol Dakshin', value: 6579, color: '#6366F1' },
  { name: 'Asansol Uttar', value: 7681, color: '#14B8A6' }
];

const zoneData = [
  { name: 'Zone A', value: 75000, color: '#3B82F6' },
  { name: 'Zone B', value: 65000, color: '#EF4444' },
  { name: 'Zone C', value: 55000, color: '#10B981' },
  { name: 'Zone D', value: 50000, color: '#F59E0B' }
];

// Simple Pie Chart Component
const PieChart = ({ data, title, className = '' }: { data: any[], title: string, className?: string }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className={`p-6 ${className}`}>
      <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </Heading>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {item.name}
                </Text>
              </div>
              <div className="flex items-center space-x-2">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  ({percentage}%)
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Simple Column Chart Component
const ColumnChart = ({ data, title, className = '' }: { data: any[], title: string, className?: string }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <Card className={`p-6 ${className}`}>
      <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </Heading>
      <div className="space-y-3">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex items-center">
              <div className="w-16 text-xs text-gray-600 dark:text-gray-400 mr-3">
                {item.name}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                <div 
                  className="h-4 rounded-full flex items-center justify-end pr-2"
                  style={{ 
                    width: `${height}%`, 
                    backgroundColor: item.color 
                  }}
                >
                  <Text className="text-xs text-white font-medium">
                    {item.value}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default function DataAnalysisPage() {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    zone: '',
    pc: '',
    ac: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    ageGroup: ''
  });

  const generateDateOptions = () => {
    const options = [
      { value: '', label: 'Select Date' },
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday' },
      { value: 'last7days', label: 'Last 7 Days' },
      { value: 'last30days', label: 'Last 30 Days' }
    ];
    return options;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    // Implement search logic here
  };

  const handleReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      zone: '',
      pc: '',
      ac: '',
      gender: '',
      locality: '',
      religion: '',
      socialCategory: '',
      ageGroup: ''
    });
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            Data Analysis
          </Heading>
        </div>

        {/* Search Form */}
        <Card className="p-6">
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Filters
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {/* From Date */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                From Date
              </Text>
              <SelectDropdown
                value={filters.fromDate}
                onChange={(value: string | string[]) => handleFilterChange('fromDate', Array.isArray(value) ? value[0] : value)}
                options={generateDateOptions()}
                placeholder="Select From Date"
              />
            </div>

            {/* To Date */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                To Date
              </Text>
              <SelectDropdown
                value={filters.toDate}
                onChange={(value: string | string[]) => handleFilterChange('toDate', Array.isArray(value) ? value[0] : value)}
                options={generateDateOptions()}
                placeholder="Select To Date"
              />
            </div>

            {/* Zone */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Zone
              </Text>
              <SelectDropdown
                value={filters.zone}
                onChange={(value: string | string[]) => handleFilterChange('zone', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Zone' },
                  { value: 'zoneA', label: 'Zone A' },
                  { value: 'zoneB', label: 'Zone B' },
                  { value: 'zoneC', label: 'Zone C' },
                  { value: 'zoneD', label: 'Zone D' }
                ]}
                placeholder="Select Zone"
              />
            </div>

            {/* PC */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                PC
              </Text>
              <SelectDropdown
                value={filters.pc}
                onChange={(value: string | string[]) => handleFilterChange('pc', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select PC' },
                  { value: 'pc1', label: 'PC 1' },
                  { value: 'pc2', label: 'PC 2' },
                  { value: 'pc3', label: 'PC 3' },
                  { value: 'pc4', label: 'PC 4' },
                  { value: 'pc5', label: 'PC 5' }
                ]}
                placeholder="Select PC"
              />
            </div>

            {/* AC */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                AC
              </Text>
              <SelectDropdown
                value={filters.ac}
                onChange={(value: string | string[]) => handleFilterChange('ac', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select AC' },
                  { value: 'alipurduars', label: 'Alipurduars' },
                  { value: 'amdanga', label: 'Amdanga' },
                  { value: 'amta', label: 'Amta' },
                  { value: 'arambag', label: 'Arambag' },
                  { value: 'asansolDakshin', label: 'Asansol Dakshin' },
                  { value: 'asansolUttar', label: 'Asansol Uttar' }
                ]}
                placeholder="Select AC"
              />
            </div>

            {/* Gender */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Gender
              </Text>
              <SelectDropdown
                value={filters.gender}
                onChange={(value: string | string[]) => handleFilterChange('gender', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Gender' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ]}
                placeholder="Select Gender"
              />
            </div>

            {/* Locality */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Locality
              </Text>
              <SelectDropdown
                value={filters.locality}
                onChange={(value: string | string[]) => handleFilterChange('locality', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Locality' },
                  { value: 'urban', label: 'Urban' },
                  { value: 'rural', label: 'Rural' }
                ]}
                placeholder="Select Locality"
              />
            </div>

            {/* Religion */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Religion
              </Text>
              <SelectDropdown
                value={filters.religion}
                onChange={(value: string | string[]) => handleFilterChange('religion', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Religion' },
                  { value: 'hindu', label: 'Hindu' },
                  { value: 'muslim', label: 'Muslim' },
                  { value: 'christian', label: 'Christian' },
                  { value: 'other', label: 'Other' }
                ]}
                placeholder="Select Religion"
              />
            </div>

            {/* Social Category */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Social Category
              </Text>
              <SelectDropdown
                value={filters.socialCategory}
                onChange={(value: string | string[]) => handleFilterChange('socialCategory', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Social Category' },
                  { value: 'general', label: 'General' },
                  { value: 'obc', label: 'OBC' },
                  { value: 'sc', label: 'SC' },
                  { value: 'st', label: 'ST' }
                ]}
                placeholder="Select Social Category"
              />
            </div>

            {/* Age Group */}
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Age Group
              </Text>
              <SelectDropdown
                value={filters.ageGroup}
                onChange={(value: string | string[]) => handleFilterChange('ageGroup', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select Age Group' },
                  { value: '18-25', label: '18-25' },
                  { value: '26-35', label: '26-35' },
                  { value: '36-45', label: '36-45' },
                  { value: '46-55', label: '46-55' },
                  { value: '56+', label: '56+' }
                ]}
                placeholder="Select Age Group"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center"
            >
              <Cross className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Gender Distribution */}
          <PieChart 
            data={genderData} 
            title="Gender Distribution" 
          />

          {/* Religion Distribution */}
          <PieChart 
            data={religionData} 
            title="Religion Distribution" 
          />

          {/* Social Category Distribution */}
          <PieChart 
            data={socialCategoryData} 
            title="Social Category Distribution" 
          />

          {/* Age Group Distribution */}
          <ColumnChart 
            data={ageGroupData} 
            title="Age Group Distribution" 
          />

          {/* Locality Distribution */}
          <PieChart 
            data={localityData} 
            title="Locality Distribution" 
          />

          {/* PC Distribution */}
          <ColumnChart 
            data={pcData} 
            title="PC Distribution" 
          />

          {/* AC Distribution */}
          <ColumnChart 
            data={acData} 
            title="AC Distribution" 
          />

          {/* Zone Distribution */}
          <PieChart 
            data={zoneData} 
            title="Zone Distribution" 
          />
        </div>
      </div>
    </Container>
  );
}
