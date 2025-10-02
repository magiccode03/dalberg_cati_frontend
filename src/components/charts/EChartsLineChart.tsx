'use client';

import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MoreVertical, Download } from 'lucide-react';

interface EChartsLineChartProps {
  title: string;
  data: {
    categories: string[];
    series: Array<{
      name: string;
      data: number[];
      color: string;
    }>;
  };
  height?: number;
}

const EChartsLineChart: React.FC<EChartsLineChartProps> = ({ 
  title, 
  data, 
  height = 400 
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
      backgroundColor: '#cb9886',
      borderColor: '#cb9886',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      top: 'top',
      left: 'left',
      textStyle: {
        fontSize: 12,
        color: '#373d3f'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '60px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.categories,
      axisLabel: {
        rotate: 0,
        fontSize: 12,
        color: '#373d3f'
      },
      axisLine: {
        lineStyle: {
          color: '#b6b6b6'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Vote Share',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 12,
        color: '#373d3f'
      },
      axisLabel: {
        fontSize: 12,
        color: '#373d3f',
        formatter: '{value}%'
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
      },
      min: 0,
      max: 100
    },
    series: data.series.map(series => ({
      name: series.name,
      type: 'line',
      data: series.data,
      smooth: true,
      lineStyle: {
        color: series.color,
        width: 3
      },
      itemStyle: {
        color: series.color
      },
      symbol: 'circle',
      symbolSize: 6,
      emphasis: {
        focus: 'series'
      }
    }))
  };

  return (
    <div className="relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-orange-500 mr-4"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            {title}
          </h3>
        </div>
        
        {/* Download Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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

      {/* Chart Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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

export default EChartsLineChart;
