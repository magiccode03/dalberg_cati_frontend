'use client';

import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreVertical, Download } from 'lucide-react';

interface HorizontalBarChartProps {
  title: string;
  data: {
    categories: string[];
    values: number[];
    colors: string[];
    interviewsAchieved: number;
  };
  height?: number;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ 
  title, 
  data, 
  height = 450 
}) => {
  const chartRef = useRef<ReactECharts>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDownload = (format: 'jpeg' | 'png') => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      const url = chartInstance.getDataURL({
        type: format,
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowDropdown(false);
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      },
      formatter: function(params: any) {
        const dataIndex = params[0].dataIndex;
        const category = data.categories[dataIndex];
        const value = params[0].value;
        return `${category}: <b>${value}%</b>`;
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 12,
        color: '#373d3f'
      },
      axisLine: {
        lineStyle: {
          color: '#b6b6b6'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f2f6f7'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        fontSize: 11,
        color: '#373d3f',
        formatter: function(value: string) {
          // Truncate long party names for better display
          if (value.length > 25) {
            return value.substring(0, 22) + '...';
          }
          return value;
        }
      },
      axisLine: {
        lineStyle: {
          color: '#b6b6b6'
        }
      }
    },
    series: [{
      type: 'bar',
      data: data.values.map((value, index) => ({
        value: value,
        itemStyle: {
          color: data.colors[index]
        }
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%',
        fontSize: 11,
        color: '#373d3f',
        fontWeight: 'bold'
      }
    }],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-center text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {title}
        </h4>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Interviews Achieved - {data.interviewsAchieved.toLocaleString()}
          </span>
          
          {/* Download Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleDownload('jpeg')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Download className="w-3 h-3 mr-2" />
                  JPEG
                </button>
                <button
                  onClick={() => handleDownload('png')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Download className="w-3 h-3 mr-2" />
                  PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: `${height}px`, width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};

export default HorizontalBarChart;
