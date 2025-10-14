'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Heading from '@/components/ui/Heading';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function BasicDemographicsPage() {
  // Filter state
  const [filters, setFilters] = useState({
    acNameCode: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    age: ''
  });

  const handleFilterChange = (field: string, value: string | string[]) => {
    const finalValue = Array.isArray(value) ? value[0] : value;
    setFilters(prev => ({ ...prev, [field]: finalValue }));
  };

  // Filter options
  const genderOptions = [
    { value: '', label: 'All ACs' },
    { value: '1', label: 'ACs with Low Female Coverage' }
  ];

  const localityOptions = [
    { value: '', label: 'All ACs' },
    { value: '1', label: 'ACs with Low Urban Coverage' }
  ];

  const religionOptions = [
    { value: '', label: 'All ACs' },
    { value: '1', label: 'ACs with Low Muslim Coverage' }
  ];

  const socialCategoryOptions = [
    { value: '', label: 'All ACs' },
    { value: '1', label: 'ACs with Low G+O+E Coverage' },
    { value: '2', label: 'ACs with Low SC Coverage' },
    { value: '3', label: 'ACs with Low ST Coverage' }
  ];

  const ageOptions = [
    { value: '', label: 'All ACs' },
    { value: '1', label: 'ACs with Low 18-24 years Coverage' },
    { value: '2', label: 'ACs with Low 25-34 years Coverage' },
    { value: '3', label: 'ACs with Low 35-50 years Coverage' },
    { value: '4', label: 'ACs with Low 50+ years Coverage' }
  ];

  // Gender Coverage Chart
  const genderChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage']
    },
    xAxis: {
      type: 'category',
      data: ['Male', 'Female']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [53, 47],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: 66, itemStyle: { color: '#2da9d9' } },
          { value: 34, itemStyle: { color: '#b73377' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Locality Coverage Chart
  const localityChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage']
    },
    xAxis: {
      type: 'category',
      data: ['Urban', 'Rural']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [12, 88],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: 7, itemStyle: { color: 'yellow' } },
          { value: 93, itemStyle: { color: 'green' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Social Category Coverage Chart
  const socialCategoryChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage']
    },
    xAxis: {
      type: 'category',
      data: ['General+OBC+EBC', 'SC', 'ST']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [83, 16, 1],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: 77, itemStyle: { color: '#FF9800' } },
          { value: 16, itemStyle: { color: '#4CAF50' } },
          { value: 7, itemStyle: { color: '#3F51B5' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Age Coverage Chart
  const ageChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage']
    },
    xAxis: {
      type: 'category',
      data: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [21, 26, 32, 21],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: 14, itemStyle: { color: '#4CAF50' } },
          { value: 30, itemStyle: { color: '#2196F3' } },
          { value: 36, itemStyle: { color: '#FF9800' } },
          { value: 20, itemStyle: { color: '#9C27B0' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Religion Coverage Chart
  const religionChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage']
    },
    xAxis: {
      type: 'category',
      data: ['Hindu', 'Muslim', 'Others']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [84, 10, 6],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: 99, itemStyle: { color: 'orange' } },
          { value: 0, itemStyle: { color: 'green' } },
          { value: 0, itemStyle: { color: 'grey' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">Demographic</Heading>
      </div>

        {/* First Row - 3 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Gender Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Gender Coverage
            </Heading>
            <ReactECharts option={genderChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Locality Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Locality Coverage
            </Heading>
            <ReactECharts option={localityChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Social Category Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Social Category Coverage
            </Heading>
            <ReactECharts option={socialCategoryChartOptions} style={{ height: '400px' }} />
          </Card>
        </div>

        {/* Second Row - 2 Charts (50%-50%) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Age Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Age Coverage
            </Heading>
            <ReactECharts option={ageChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Religion Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Religion Coverage
            </Heading>
            <ReactECharts option={religionChartOptions} style={{ height: '400px' }} />
          </Card>
        </div>

        {/* Third Row - Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PCs Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">PCs</h2>
              <h4 className="text-white text-2xl font-semibold">40</h4>
            </div>
          </div>

          {/* Districts Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Districts</h2>
              <h4 className="text-white text-2xl font-semibold">38</h4>
            </div>
          </div>

          {/* Zones Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Zones</h2>
              <h4 className="text-white text-2xl font-semibold">9</h4>
            </div>
          </div>

          {/* ACs Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">ACs</h2>
              <h4 className="text-white text-2xl font-semibold">311</h4>
            </div>
          </div>
        </div>

        {/* Fourth Row - Filter Card */}
        <Card className="mt-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* AC Name/Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AC Name/Code
                </label>
                <Input
                  type="text"
                  placeholder="Search by AC Name/Code"
                  value={filters.acNameCode}
                  onChange={(e) => handleFilterChange('acNameCode', e.target.value)}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <SelectDropdown
                  options={genderOptions}
                  value={filters.gender}
                  onChange={(value) => handleFilterChange('gender', value)}
                  placeholder="All ACs"
                />
              </div>

              {/* Locality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Locality
                </label>
                <SelectDropdown
                  options={localityOptions}
                  value={filters.locality}
                  onChange={(value) => handleFilterChange('locality', value)}
                  placeholder="All ACs"
                />
              </div>

              {/* Religion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Religion
                </label>
                <SelectDropdown
                  options={religionOptions}
                  value={filters.religion}
                  onChange={(value) => handleFilterChange('religion', value)}
                  placeholder="All ACs"
                />
              </div>

              {/* Social Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Category
                </label>
                <SelectDropdown
                  options={socialCategoryOptions}
                  value={filters.socialCategory}
                  onChange={(value) => handleFilterChange('socialCategory', value)}
                  placeholder="All ACs"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <SelectDropdown
                  options={ageOptions}
                  value={filters.age}
                  onChange={(value) => handleFilterChange('age', value)}
                  placeholder="All ACs"
                />
              </div>
            </div>
          </div>
        </Card>
    </div>
  );
}