'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function BasicDemographicsPage() {
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Demographic
      </h1>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gender Coverage */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Gender Coverage
            </h3>
            <ReactECharts option={genderChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Locality Coverage */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Locality Coverage
            </h3>
            <ReactECharts option={localityChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Social Category Coverage */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Social Category Coverage
            </h3>
            <ReactECharts option={socialCategoryChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Age Coverage - Spans 2 columns */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Age Coverage
            </h3>
            <ReactECharts option={ageChartOptions} style={{ height: '400px' }} />
          </Card>

          {/* Religion Coverage - Spans 1 column */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Religion Coverage
            </h3>
            <ReactECharts option={religionChartOptions} style={{ height: '400px' }} />
          </Card>
      </div>
    </div>
  );
}