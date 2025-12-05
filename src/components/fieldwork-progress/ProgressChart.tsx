'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ProgressData {
  completed: number;
  inProgress: number;
  yetToBegin: number;
  total: number;
}

interface ProgressChartProps {
  title: string;
  data: ProgressData;
  onChartClick: (progressType: number, progressSubType: number) => void;
  progressType: number;
  isDashboard?: boolean;
}

export default function ProgressChart({
  title,
  data,
  onChartClick,
  progressType,
  isDashboard = false,
}: ProgressChartProps) {
  const chartOptions = {
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
      left: '0%',
      right: '0%',
      bottom: '20%',
      top: isDashboard ? '10%' : '15%',
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
          { 
            value: data.completed, 
            itemStyle: { color: '#54B054' },
            name: 'Completed'
          },
          { 
            value: data.inProgress, 
            itemStyle: { color: '#CFA407' },
            name: 'In Progress'
          },
          { 
            value: data.yetToBegin, 
            itemStyle: { color: '#a3a9a9' },
            name: 'Yet to Begin'
          }
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
    <Card className="p-0 border border-black">
      <Heading level={3} align="center" className="mb-0">
        {title}
      </Heading>
      
      {isDashboard ? (
        // Stacked layout for main dashboard
        <>
          <ReactECharts option={chartOptions} style={{ height: '400px' }} />
          
          {/* Legend Table */}
          <div className="">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 1)}
                >
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{data.completed}</td>
                </tr>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 2)}
                >
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{data.inProgress}</td>
                </tr>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 3)}
                >
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{data.yetToBegin}</td>
                </tr>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 4)}
                >
                  <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{data.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Side-by-side layout for specific progress type pages
        <div className="flex h-[300px]">
          {/* Chart Section - Left Side */}
          <div className="flex-1 border-r border-gray-300">
            <ReactECharts option={chartOptions} style={{ height: '100%' }} />
          </div>
          
          {/* Legend Table Section - Right Side */}
          <div className="w-64 flex flex-col">
            <table className="w-full border-collapse flex-1">
              <tbody>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 1)}
                >
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{data.completed}</td>
                </tr>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 2)}
                >
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{data.inProgress}</td>
                </tr>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 3)}
                >
                  <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{data.yetToBegin}</td>
                </tr>
                <tr 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onChartClick(progressType, 4)}
                >
                  <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{data.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}

