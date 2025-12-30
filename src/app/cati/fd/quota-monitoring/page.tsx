'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import Card from '@/components/ui/Card';

// Dummy data
const borrowersData = [
  { name: 'Approved', value: 120, target: 100 },
  { name: 'Rejected', value: 80, target: 100 },
];

const genderData = [
  { name: 'Male', value: 110, target: 100 },
  { name: 'Female', value: 90, target: 100 },
];

const ageData = [
  { category: '18-24', value: 45, target: 100 },
  { category: '25-34', value: 78, target: 100 },
  { category: '35-44', value: 92, target: 100 },
  { category: '45-54', value: 65, target: 100 },
  { category: '55-64', value: 38, target: 100 },
  { category: '65+', value: 22, target: 100 },
];

const stateData = [
  { category: 'MH', value: 150, target: 100 },
  { category: 'UP', value: 130, target: 100 },
];

const fspData = [
  { category: 'FSP 1', value: 75, target: 67 },
  { category: 'FSP 2', value: 82, target: 67 },
  { category: 'FSP 3', value: 68, target: 67 },
];

export default function QuotaMonitoringPage() {
  // Borrowers Pie Chart Options
  const borrowersChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>Interviews: <b>${params.value}</b>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: 'Borrowers',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            return `${params.name}\n${params.value}`;
          },
          fontSize: 12,
          fontWeight: 'bold'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: borrowersData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: index === 0 ? '#10b981' : '#ef4444'
          }
        }))
      }
    ]
  };

  // Gender Pie Chart Options
  const genderChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>Interviews: <b>${params.value}</b>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: 'Gender',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            return `${params.name}\n${params.value}`;
          },
          fontSize: 12,
          fontWeight: 'bold'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: genderData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: index === 0 ? '#3b82f6' : '#ec4899'
          }
        }))
      }
    ]
  };

  // Age Bar Chart Options
  const ageChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const param = params[0];
        return `${param.name}<br/>Interviews: <b>${param.value}</b>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ageData.map(item => item.category),
      axisLabel: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12
      },
      name: 'Number of Interviews',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [
      {
        name: 'Interviews',
        type: 'bar',
        data: ageData.map(item => ({
          value: item.value,
          target: item.target,
          itemStyle: {
            color: item.value >= item.target ? '#10b981' : '#f59e0b'
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return `${params.value}\n`;
          },
          fontSize: 11
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // State Bar Chart Options
  const stateChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const param = params[0];
        return `${param.name}<br/>Interviews: <b>${param.value}</b>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: stateData.map(item => item.category),
      axisLabel: {
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12
      },
      name: 'Number of Interviews',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [
      {
        name: 'Interviews',
        type: 'bar',
        data: stateData.map(item => ({
          value: item.value,
          target: item.target,
          itemStyle: {
            color: item.value >= item.target ? '#10b981' : '#f59e0b'
          }
        })),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return `${params.value}\n`;
          },
          fontSize: 12,
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // FSP Bar Chart Options
  const fspChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const param = params[0];
        return `${param.name}<br/>Interviews: <b>${param.value}</b>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: fspData.map(item => item.category),
      axisLabel: {
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12
      },
      name: 'Number of Interviews',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [
      {
        name: 'Interviews',
        type: 'bar',
        data: fspData.map(item => ({
          value: item.value,
          target: item.target,
          itemStyle: {
            color: item.value >= item.target ? '#10b981' : '#f59e0b'
          }
        })),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return `${params.value}\n`;
          },
          fontSize: 12,
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Borrowers Pie Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Borrowers
            </h2>
            <ReactECharts
              option={borrowersChartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>

          {/* 2. Gender Pie Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Gender
            </h2>
            <ReactECharts
              option={genderChartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>

          {/* 3. Age Bar Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Age
            </h2>
            <ReactECharts
              option={ageChartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>

          {/* 4. State Bar Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              State Wise
            </h2>
            <ReactECharts
              option={stateChartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>

          {/* 5. FSP Bar Chart */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              FSP (Financial Service Provider)
            </h2>
            <ReactECharts
              option={fspChartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

