'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';

// Dynamically import Apache ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function FieldworkProgress2Page() {
  // Sample data for the charts
  const acData = {
    completed: 56,
    inProgress: 175,
    yetToBegin: 12,
    total: 243
  };

  const pcData = {
    completed: 5,
    inProgress: 35,
    yetToBegin: 0,
    total: 40
  };

  const districtData = {
    completed: 6,
    inProgress: 32,
    yetToBegin: 0,
    total: 38
  };

  const zoneData = {
    completed: 0,
    inProgress: 9,
    yetToBegin: 0,
    total: 9
  };

  // Chart options for AC
  const acChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: acData.completed, itemStyle: { color: '#54B054' } },
          { value: acData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: acData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  // Chart options for PC
  const pcChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: pcData.completed, itemStyle: { color: '#54B054' } },
          { value: pcData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: pcData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  // Chart options for District
  const districtChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: districtData.completed, itemStyle: { color: '#54B054' } },
          { value: districtData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: districtData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  // Chart options for Zone
  const zoneChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: zoneData.completed, itemStyle: { color: '#54B054' } },
          { value: zoneData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: zoneData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Fieldwork Progress2
        </Heading>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Target Sample */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#4ec2f0' }}>
          <div className="p-6 text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Target Sample</h3>
            <h5 className="text-white text-sm mb-2">(Sample To Be Achieved)</h5>
            <h4 className="text-white text-2xl font-bold">72,900</h4>
          </div>
        </div>

        {/* Interviews Attempted */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#ad4ffa' }}>
          <div className="p-6 text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Interviews Attempted</h3>
            <h5 className="text-white text-sm mb-2">(Valid + Under QC + Invalid)</h5>
            <h4 className="text-white text-2xl font-bold">1,08,333 (149%)</h4>
          </div>
        </div>

        {/* Interviews Achieved */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#016a59' }}>
          <div className="p-6 text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Interviews Achieved</h3>
            <h5 className="text-white text-sm mb-2">(Valid + Under QC)</h5>
            <h4 className="text-white text-2xl font-bold">50,320 (69%)</h4>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Field Status - AC */}
        <Card className="p-0 border border-black">
          <Heading level={3} align="center" className="mb-0">
            Field Status - AC
          </Heading>
          <ReactECharts option={acChartOptions} style={{ height: '400px' }} />
          
          {/* Legend Table */}
          <div className="">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{acData.completed}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{acData.inProgress}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{acData.yetToBegin}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total ACs</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{acData.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Field Status - PC */}
        <Card className="p-0 border border-black">
          <Heading level={3} align="center" className="mb-0">
            Field Status - PC
          </Heading>
          <ReactECharts option={pcChartOptions} style={{ height: '400px' }} />
          
          {/* Legend Table */}
          <div className="">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{pcData.completed}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{pcData.inProgress}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{pcData.yetToBegin}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total PCs</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{pcData.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Field Status - District */}
        <Card className="p-0 border border-black">
          <Heading level={3} align="center" className="mb-0">
            Field Status - District
          </Heading>
          <ReactECharts option={districtChartOptions} style={{ height: '400px' }} />
          
          {/* Legend Table */}
          <div className="">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{districtData.completed}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{districtData.inProgress}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{districtData.yetToBegin}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total Districts</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{districtData.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Field Status - Zone */}
        <Card className="p-0 border border-black">
          <Heading level={3} align="center" className="mb-0">
            Field Status - Zone
          </Heading>
          <ReactECharts option={zoneChartOptions} style={{ height: '400px' }} />
          
          {/* Legend Table */}
          <div className="">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{zoneData.completed}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{zoneData.inProgress}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{zoneData.yetToBegin}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total Zones</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{zoneData.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Container>
  );
}
