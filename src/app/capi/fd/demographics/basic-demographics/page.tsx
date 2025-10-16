'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api-service';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function BasicDemographicsPage() {
  // API data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);

  // Filter state
  const [filters, setFilters] = useState({
    acNameCode: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    age: ''
  });

  // Fetch data from API
  const fetchDemographicsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getBasicDemographics();
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch demographics data');
      }
    } catch (err: any) {
      console.error('Error fetching demographics data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemographicsData();
  }, []);

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
    xAxis: {
      type: 'category',
      data: ['Male', 'Female']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(apiData?.demographic_charts?.gender_coverage?.male || '53'),
          parseFloat(apiData?.demographic_charts?.gender_coverage?.female || '47')
        ],
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
          { value: parseFloat(apiData?.demographic_charts?.gender_coverage?.male_achievement || '66'), itemStyle: { color: '#2da9d9' } },
          { value: parseFloat(apiData?.demographic_charts?.gender_coverage?.female_achievement || '34'), itemStyle: { color: '#b73377' } }
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
    xAxis: {
      type: 'category',
      data: ['Urban', 'Rural']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(apiData?.demographic_charts?.locality_coverage?.urban || '12'),
          parseFloat(apiData?.demographic_charts?.locality_coverage?.rural || '88')
        ],
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
          { value: parseFloat(apiData?.demographic_charts?.locality_coverage?.urban_achievement || '7'), itemStyle: { color: 'yellow' } },
          { value: parseFloat(apiData?.demographic_charts?.locality_coverage?.rural_achievement || '93'), itemStyle: { color: 'green' } }
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
    xAxis: {
      type: 'category',
      data: ['General+OBC+EBC', 'SC', 'ST']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(apiData?.demographic_charts?.social_category_coverage?.general_obc_achievement || '83'),
          parseFloat(apiData?.demographic_charts?.social_category_coverage?.sc || '16'),
          parseFloat(apiData?.demographic_charts?.social_category_coverage?.st || '1')
        ],
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
          { value: parseFloat(apiData?.demographic_charts?.social_category_coverage?.general_obc_achievement || '77'), itemStyle: { color: '#FF9800' } },
          { value: parseFloat(apiData?.demographic_charts?.social_category_coverage?.sc_achievement || '16'), itemStyle: { color: '#4CAF50' } },
          { value: parseFloat(apiData?.demographic_charts?.social_category_coverage?.st_achievement || '7'), itemStyle: { color: '#3F51B5' } }
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
    xAxis: {
      type: 'category',
      data: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(apiData?.demographic_charts?.age_coverage?.age_18_24 || '21'),
          parseFloat(apiData?.demographic_charts?.age_coverage?.age_25_34 || '26'),
          parseFloat(apiData?.demographic_charts?.age_coverage?.age_35_50 || '32'),
          parseFloat(apiData?.demographic_charts?.age_coverage?.age_50_above || '21')
        ],
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
          { value: parseFloat(apiData?.demographic_charts?.age_coverage?.age_18_24_achievement || '14'), itemStyle: { color: '#4CAF50' } },
          { value: parseFloat(apiData?.demographic_charts?.age_coverage?.age_25_34_achievement || '30'), itemStyle: { color: '#2196F3' } },
          { value: parseFloat(apiData?.demographic_charts?.age_coverage?.age_35_50_achievement || '36'), itemStyle: { color: '#FF9800' } },
          { value: parseFloat(apiData?.demographic_charts?.age_coverage?.age_50_above_achievement || '20'), itemStyle: { color: '#9C27B0' } }
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
    xAxis: {
      type: 'category',
      data: ['Hindu', 'Muslim', 'Others']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(apiData?.demographic_charts?.religion_coverage?.hindu || '84'),
          parseFloat(apiData?.demographic_charts?.religion_coverage?.muslim || '10'),
          parseFloat(apiData?.demographic_charts?.religion_coverage?.christian || '0') + parseFloat(apiData?.demographic_charts?.religion_coverage?.other || '6')
        ],
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
          { value: parseFloat(apiData?.demographic_charts?.religion_coverage?.hindu_achievement || '99'), itemStyle: { color: 'orange' } },
          { value: parseFloat(apiData?.demographic_charts?.religion_coverage?.muslim_achievement || '0'), itemStyle: { color: 'green' } },
          { value: parseFloat(apiData?.demographic_charts?.religion_coverage?.christian_achievement || '0') + parseFloat(apiData?.demographic_charts?.religion_coverage?.other_achievement || '0'), itemStyle: { color: 'grey' } }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading demographics data...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-red-600 mb-4">{error}</Text>
          </Card>
        </div>
      </div>
    );
  }

  // No data state
  if (!apiData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-gray-600">No data available</Text>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2}className='text-2xl font-semibold text-gray-900'>Demographic</Heading>
      </div>

        {/* First Row - 3 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Gender Coverage */}
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Gender Coverage
            </Heading>
            <ReactECharts option={genderChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Locality Coverage */}
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Locality Coverage
            </Heading>
            <ReactECharts option={localityChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Social Category Coverage */}
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Social Category Coverage
            </Heading>
            <ReactECharts option={socialCategoryChartOptions} style={{ height: '400px' }} />
          </Card>
        </div>

        {/* Second Row - 2 Charts (50%-50%) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Age Coverage */}
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Age Coverage
            </Heading>
            <ReactECharts option={ageChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Religion Coverage */}
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
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
              <h4 className="text-white text-2xl font-semibold">{apiData.navigation_tiles?.total_pc_count || 40}</h4>
            </div>
          </div>

          {/* Districts Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Districts</h2>
              <h4 className="text-white text-2xl font-semibold">{apiData.navigation_tiles?.total_district_count || 38}</h4>
            </div>
          </div>

          {/* Zones Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Zones</h2>
              <h4 className="text-white text-2xl font-semibold">{apiData.navigation_tiles?.total_zone_count || 9}</h4>
            </div>
          </div>

          {/* ACs Card */}
          <div className="bg-green-500 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 rounded-lg shadow-md cursor-pointer">
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">ACs</h2>
              <h4 className="text-white text-2xl font-semibold">{apiData.navigation_tiles?.total_ac_count || 241}</h4>
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