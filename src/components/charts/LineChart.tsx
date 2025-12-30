'use client';

import React, { useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreVertical, Download } from 'lucide-react';

interface LineChartData {
  name: string;
  data: number[];
  color: string;
}

interface LineChartProps {
  data: LineChartData[];
  xAxisData: string[];
  title?: string;
  height?: number;
  className?: string;
  smooth?: boolean;
  area?: boolean;
}

export default function LineChart({ 
  data, 
  xAxisData,
  title = 'Trend Analysis', 
  height = 400,
  className = '',
  smooth = true,
  area = false
}: LineChartProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const chartRef = useRef<ReactECharts>(null);
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
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const option = {
    title: {
      show: false // Hide title as we'll add it manually
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      backgroundColor: '#cb9886',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: data.map(item => item.name),
      top: 5,
      left: 5,
      textStyle: {
        fontSize: 12,
        color: '#373d3f'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        fontSize: 12,
        color: '#373d3f',
        rotate: 0
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(119, 119, 142, 0.05)'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Number of Dials',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontSize: 14,
        color: '#6c757d'
      },
      axisLabel: {
        fontSize: 11,
        color: '#373d3f'
      },
      splitLine: {
        lineStyle: {
          color: '#f2f6f7'
        }
      }
    },
    series: data.map(item => ({
      name: item.name,
      type: 'line',
      smooth: smooth,
      areaStyle: area ? {} : undefined,
      data: item.data,
      itemStyle: {
        color: item.color
      },
      lineStyle: {
        color: item.color,
        width: 3
      },
      emphasis: {
        focus: 'series'
      }
    }))
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title.toUpperCase()}
        </h3>
        
        {/* Download Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Download options"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => handleDownload('jpeg')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JPEG
              </button>
              <button
                onClick={() => handleDownload('png')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ position: 'relative' }}>
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: `${height}px`, width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}
