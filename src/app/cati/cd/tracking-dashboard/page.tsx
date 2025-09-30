'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Search, Calendar, MapPin, Users, User, Home, Clock } from 'lucide-react';

// Custom PieChart component
const PieChart = ({ data, title, colors }: { data: any[], title: string, colors: string[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="p-6">
      <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </Heading>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {item.name}
                </Text>
              </div>
              <div className="text-right">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value.toLocaleString()}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {percentage}%
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Custom ColumnChart component
const ColumnChart = ({ data, title, color }: { data: any[], title: string, color: string }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <Card className="p-6">
      <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </Heading>
      <div className="space-y-3">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={item.name} className="flex items-center">
              <div className="w-20 text-xs text-gray-600 dark:text-gray-400 mr-3 truncate">
                {item.name}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                <div 
                  className="h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ 
                    width: `${height}%`, 
                    backgroundColor: color 
                  }}
                >
                  <Text className="text-xs font-medium text-white">
                    {item.value.toLocaleString()}
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

export default function TrackingDashboardPage() {
  const [filters, setFilters] = useState({
    date: '',
    zone: '',
    pc: '',
    ac: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    ageGroup: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    // Implement search logic here
  };

  const handleReset = () => {
    setFilters({
      date: '',
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

  // Sample data for the charts
  const genderData = [
    { name: 'Male', value: 150177 },
    { name: 'Female', value: 150177 }
  ];

  const religionData = [
    { name: 'Hindu', value: 180212 },
    { name: 'Muslim', value: 120142 }
  ];

  const socialCategoryData = [
    { name: 'General', value: 75485 },
    { name: 'OBC', value: 90212 },
    { name: 'SC', value: 60142 },
    { name: 'ST', value: 30197 }
  ];

  const ageGroupData = [
    { name: '18-25', value: 45053 },
    { name: '26-35', value: 75177 },
    { name: '36-45', value: 90212 },
    { name: '46-55', value: 60142 },
    { name: '56+', value: 30197 }
  ];

  const localityData = [
    { name: 'Urban', value: 165194 },
    { name: 'Rural', value: 135587 }
  ];

  const pcData = [
    { name: 'PC1', value: 4250 },
    { name: 'PC2', value: 5927 },
    { name: 'PC3', value: 6203 },
    { name: 'PC4', value: 5564 },
    { name: 'PC5', value: 6579 }
  ];

  const acData = [
    { name: 'Alipurduars', value: 4250 },
    { name: 'Amdanga', value: 5927 },
    { name: 'Amta', value: 6203 },
    { name: 'Arambag', value: 5564 },
    { name: 'Asansol Dakshin', value: 6579 },
    { name: 'Asansol Uttar', value: 7681 }
  ];

  const zoneData = [
    { name: 'Zone A', value: 75000 },
    { name: 'Zone B', value: 65000 },
    { name: 'Zone C', value: 55000 },
    { name: 'Zone D', value: 50000 }
  ];

  const chartColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
              Tracking Dashboard
            </Heading>
          </div>
        </div>

        {/* Search Form */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Date
              </Text>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full"
              />
            </div>

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

            <div>
              <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                PC
              </Text>
              <SelectDropdown
                value={filters.pc}
                onChange={(value: string | string[]) => handleFilterChange('pc', Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'Select PC' },
                  { value: 'pc1', label: 'PC1' },
                  { value: 'pc2', label: 'PC2' },
                  { value: 'pc3', label: 'PC3' },
                  { value: 'pc4', label: 'PC4' },
                  { value: 'pc5', label: 'PC5' }
                ]}
                placeholder="Select PC"
              />
            </div>

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
                  { value: 'female', label: 'Female' }
                ]}
                placeholder="Select Gender"
              />
            </div>

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
                  { value: 'muslim', label: 'Muslim' }
                ]}
                placeholder="Select Religion"
              />
            </div>

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

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-6"
            >
              Reset
            </Button>
            <Button
              onClick={handleSearch}
              className="px-6 flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <PieChart 
            data={genderData} 
            title="Gender Distribution" 
            colors={['#3B82F6', '#EF4444']} 
          />

          {/* Religion Distribution */}
          <PieChart 
            data={religionData} 
            title="Religion Distribution" 
            colors={['#10B981', '#F59E0B']} 
          />

          {/* Social Category Distribution */}
          <PieChart 
            data={socialCategoryData} 
            title="Social Category Distribution" 
            colors={['#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']} 
          />

          {/* Age Group Distribution */}
          <PieChart 
            data={ageGroupData} 
            title="Age Group Distribution" 
            colors={['#F97316', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6']} 
          />

          {/* Locality Distribution */}
          <ColumnChart 
            data={localityData} 
            title="Locality Distribution" 
            color="#3B82F6" 
          />

          {/* PC Distribution */}
          <ColumnChart 
            data={pcData} 
            title="PC Distribution" 
            color="#10B981" 
          />

          {/* AC Distribution */}
          <ColumnChart 
            data={acData} 
            title="AC Distribution" 
            color="#F59E0B" 
          />

          {/* Zone Distribution */}
          <ColumnChart 
            data={zoneData} 
            title="Zone Distribution" 
            color="#8B5CF6" 
          />
        </div>
      </div>
    </Container>
  );
}
