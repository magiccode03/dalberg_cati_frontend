'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { ProgressData } from '@/types';

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
  height?: number;
  className?: string;
}

export default function ProgressChart({ 
  data, 
  title = 'Progress Overview', 
  height = 400,
  className = ''
}: ProgressChartProps) {
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
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Progress',
        type: 'pie',
        radius: '60%',
        center: ['50%', '45%'],
        data: data.map(item => ({
          value: item.count,
          name: item.status,
          itemStyle: {
            color: item.color
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {d}%',
          fontSize: 12
        }
      }
    ]
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
