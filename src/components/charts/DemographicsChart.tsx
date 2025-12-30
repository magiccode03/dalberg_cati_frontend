'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface DemographicsData {
  category: string;
  value: number;
  color: string;
}

interface DemographicsChartProps {
  data: DemographicsData[];
  title?: string;
  type?: 'bar' | 'pie' | 'doughnut';
  height?: number;
  className?: string;
}

export default function DemographicsChart({ 
  data, 
  title = 'Demographics Analysis', 
  type = 'bar',
  height = 400,
  className = ''
}: DemographicsChartProps) {
  const getOption = () => {
    const baseOption = {
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
      }
    };

    if (type === 'bar') {
      return {
        ...baseOption,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}: {c}',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'transparent',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.category),
          axisLabel: {
            rotate: 45,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 12
          }
        },
        series: [
          {
            name: 'Count',
            type: 'bar',
            data: data.map(item => ({
              value: item.value,
              itemStyle: {
                color: item.color
              }
            })),
            barWidth: '60%',
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
    }

    // Pie or Doughnut chart
    return {
      ...baseOption,
      series: [
        {
          name: 'Demographics',
          type: 'pie',
          radius: type === 'doughnut' ? ['40%', '70%'] : '60%',
          center: ['50%', '45%'],
          data: data.map(item => ({
            value: item.value,
            name: item.category,
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
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <ReactECharts
        option={getOption()}
        style={{ height: `${height}px`, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
