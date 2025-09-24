'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

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
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: data.map(item => item.name),
      top: 'bottom',
      left: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        fontSize: 12,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12
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
      <ReactECharts
        option={option}
        style={{ height: `${height}px`, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
