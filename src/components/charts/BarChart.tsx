'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface BarChartData {
  name: string;
  data: number[];
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  xAxisData: string[];
  title?: string;
  height?: number;
  className?: string;
  horizontal?: boolean;
  stacked?: boolean;
}

export default function BarChart({ 
  data, 
  xAxisData,
  title = 'Bar Chart Analysis', 
  height = 400,
  className = '',
  horizontal = false,
  stacked = false
}: BarChartProps) {
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
        type: 'shadow'
      },
      formatter: function(params: any) {
        let result = params[0].name + '<br/>';
        params.forEach((param: any) => {
          result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
        });
        return result;
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
      type: horizontal ? 'value' : 'category',
      data: horizontal ? undefined : xAxisData,
      axisLabel: {
        fontSize: 12,
        rotate: horizontal ? 0 : 45
      }
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      data: horizontal ? xAxisData : undefined,
      axisLabel: {
        fontSize: 12
      }
    },
    series: data.map(item => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      itemStyle: {
        color: item.color
      },
      stack: stacked ? 'total' : undefined,
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
