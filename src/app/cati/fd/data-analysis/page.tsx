'use client';

import React, { useState, useRef, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Search, Cross } from 'lucide-react';
import * as echarts from 'echarts';

// Sample data for the charts
const genderData = [
  { name: 'Male', value: 45, color: '#3B82F6' },
  { name: 'Female', value: 35, color: '#EF4444' },
  { name: 'Other', value: 20, color: '#10B981' }
];

const religionData = [
  { name: 'Hindu', value: 60, color: '#8B5CF6' },
  { name: 'Muslim', value: 25, color: '#F59E0B' },
  { name: 'Christian', value: 10, color: '#06B6D4' },
  { name: 'Other', value: 5, color: '#84CC16' }
];

const socialCategoryData = [
  { name: 'General', value: 75485, color: '#6366F1' },
  { name: 'OBC', value: 90212, color: '#EC4899' },
  { name: 'SC', value: 60142, color: '#14B8A6' },
  { name: 'ST', value: 30197, color: '#F97316' }
];

const ageGroupData = [
  { name: '18-25', value: 45053, color: '#3B82F6' },
  { name: '26-35', value: 75177, color: '#EF4444' },
  { name: '36-45', value: 90212, color: '#10B981' },
  { name: '46-55', value: 60142, color: '#F59E0B' },
  { name: '56+', value: 30197, color: '#8B5CF6' }
];

const localityData = [
  { name: 'Urban', value: 21.9, color: '#FF5722' },
  { name: 'Rural', value: 78.1, color: '#4CAF50' }
];

const pcData = [
  { name: 'PC1', value: 4250, color: '#3B82F6' },
  { name: 'PC2', value: 5927, color: '#EF4444' },
  { name: 'PC3', value: 6203, color: '#10B981' },
  { name: 'PC4', value: 5564, color: '#F59E0B' },
  { name: 'PC5', value: 6579, color: '#8B5CF6' }
];

const acData = [
  { name: 'Alipurduars', value: 4250, color: '#06B6D4' },
  { name: 'Amdanga', value: 5927, color: '#84CC16' },
  { name: 'Amta', value: 6203, color: '#F97316' },
  { name: 'Arambag', value: 5564, color: '#EC4899' },
  { name: 'Asansol Dakshin', value: 6579, color: '#6366F1' },
  { name: 'Asansol Uttar', value: 7681, color: '#14B8A6' }
];

const zoneData = [
  { name: 'Zone A', value: 75000, color: '#3B82F6' },
  { name: 'Zone B', value: 65000, color: '#EF4444' },
  { name: 'Zone C', value: 55000, color: '#10B981' },
  { name: 'Zone D', value: 50000, color: '#F59E0B' }
];

// Distribution data for column charts
const genderDistributionData = {
  categories: ['Male', 'Female'],
  series: [
    { name: 'Urban', data: [21.4, 23.7], color: '#FF5722' },
    { name: 'Rural', data: [78.6, 76.3], color: '#4CAF50' }
  ]
};

const religionDistributionData = {
  categories: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Others'],
  series: [
    { name: 'Urban', data: [23.6, 16.8, 39.5, 40.6, 32.1], color: '#FF5722' },
    { name: 'Rural', data: [76.4, 83.2, 60.5, 59.4, 67.9], color: '#4CAF50' }
  ]
};

const socialCategoryDistributionData = {
  categories: ['General/OC', 'Schedule Castes', 'Schedule Tribes', 'OBC', 'No response'],
  series: [
    { name: 'Urban', data: [22, 21.7, 24.3, 31.7, 0], color: '#FF5722' },
    { name: 'Rural', data: [78, 78.3, 75.7, 68.3, 0], color: '#4CAF50' }
  ]
};

const ageGroupDistributionData = {
  categories: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years'],
  series: [
    { name: 'Urban', data: [21.1, 17.9, 21.2, 23.2], color: '#FF5722' },
    { name: 'Rural', data: [78.9, 82.1, 78.8, 76.8], color: '#4CAF50' }
  ]
};

const localityDistributionData = {
  categories: ['Urban', 'Rural'],
  series: [
    { name: 'Urban', data: [100, 0], color: '#FF5722' },
    { name: 'Rural', data: [0, 100], color: '#4CAF50' }
  ]
};

// Gender data for the new section
const genderDataNew = [
  { name: 'Male', value: 77.5, color: '#2CA4D2' },
  { name: 'Female', value: 22.5, color: '#B13173' }
];

// Gender distribution data for column charts
const genderReligionDistributionData = {
  categories: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Others'],
  series: [
    { name: 'Male', data: [77.6, 78.6, 63.3, 56.4, 68.9], color: '#2CA4D2' },
    { name: 'Female', data: [22.4, 21.4, 36.7, 43.6, 31.1], color: '#B13173' }
  ]
};

const genderSocialCategoryDistributionData = {
  categories: ['General/OC', 'Schedule Castes', 'Schedule Tribes', 'OBC', 'No response'],
  series: [
    { name: 'Male', data: [78.8, 76.5, 72.2, 73.8, 0], color: '#2CA4D2' },
    { name: 'Female', data: [21.2, 23.5, 27.8, 26.2, 0], color: '#B13173' }
  ]
};

const genderAgeGroupDistributionData = {
  categories: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years'],
  series: [
    { name: 'Male', data: [70.9, 75.3, 76.5, 85.9], color: '#2CA4D2' },
    { name: 'Female', data: [29.1, 24.7, 23.5, 14.1], color: '#B13173' }
  ]
};

const genderLocalityDistributionData = {
  categories: ['Urban', 'Rural'],
  series: [
    { name: 'Male', data: [75.7, 78], color: '#2CA4D2' },
    { name: 'Female', data: [24.3, 22], color: '#B13173' }
  ]
};

// Religion data for the new section
const religionDataNew = [
  { name: 'Hindu', value: 64.1, color: '#f7a35c' },
  { name: 'Muslim', value: 23.4, color: '#6c9165' },
  { name: 'Christian', value: 1.1, color: '#33B4FF' },
  { name: 'Sikh', value: 0.3, color: '#0856BA' },
  { name: 'Jain', value: 0.1, color: '#9DCFEE' },
  { name: 'Buddhist', value: 0.2, color: '#FFD900' },
  { name: 'No response', value: 0, color: '#D9D9D9' },
  { name: 'Others', value: 0, color: '#D9D9D9' }
];

// Religion distribution data for column charts
const religionGenderDistributionData = {
  categories: ['Male', 'Female'],
  series: [
    { name: 'Hindu', data: [64.2, 63.6], color: '#f7a35c' },
    { name: 'Muslim', data: [23.8, 22.2], color: '#6c9165' },
    { name: 'Christian', data: [0.9, 1.7], color: '#33B4FF' },
    { name: 'Sikh', data: [0.2, 0.6], color: '#0856BA' },
    { name: 'Jain', data: [0.1, 0.2], color: '#9DCFEE' },
    { name: 'Buddhist', data: [0.2, 0.2], color: '#FFD900' },
    { name: 'No response', data: [0, 0], color: '#D9D9D9' },
    { name: 'Others', data: [0, 0], color: '#D9D9D9' }
  ]
};

const religionSocialCategoryDistributionData = {
  categories: ['General/OC', 'Schedule Castes', 'Schedule Tribes', 'OBC', 'No response'],
  series: [
    { name: 'Hindu', data: [69.1, 82.7, 67.3, 46.5, 0], color: '#f7a35c' },
    { name: 'Muslim', data: [28.9, 12.6, 19.1, 37.2, 0], color: '#6c9165' },
    { name: 'Christian', data: [0.5, 2, 6.4, 3.8, 0], color: '#33B4FF' },
    { name: 'Sikh', data: [0.1, 0.6, 2.3, 1.9, 0], color: '#0856BA' },
    { name: 'Jain', data: [0, 0.3, 1, 1.1, 0], color: '#9DCFEE' },
    { name: 'Buddhist', data: [0.1, 0.2, 1.1, 1, 0], color: '#FFD900' },
    { name: 'No response', data: [0, 0, 0, 0, 0], color: '#D9D9D9' },
    { name: 'Others', data: [0, 0, 0, 0, 0], color: '#D9D9D9' }
  ]
};

const religionAgeGroupDistributionData = {
  categories: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years'],
  series: [
    { name: 'Hindu', data: [64.8, 60.1, 65.8, 68.8], color: '#f7a35c' },
    { name: 'Muslim', data: [22.8, 25.7, 22.5, 21.5], color: '#6c9165' },
    { name: 'Christian', data: [0.6, 0.7, 0.6, 1.4], color: '#33B4FF' },
    { name: 'Sikh', data: [0.2, 0.1, 0.2, 0.3], color: '#0856BA' },
    { name: 'Jain', data: [0.1, 0.1, 0.1, 0.1], color: '#9DCFEE' },
    { name: 'Buddhist', data: [0.2, 0.1, 0.2, 0.2], color: '#FFD900' },
    { name: 'No response', data: [0, 0, 0, 0], color: '#D9D9D9' },
    { name: 'Others', data: [0, 0, 0, 0], color: '#D9D9D9' }
  ]
};

const religionLocalityDistributionData = {
  categories: ['Urban', 'Rural'],
  series: [
    { name: 'Hindu', data: [69, 62.7], color: '#f7a35c' },
    { name: 'Muslim', data: [17.9, 24.9], color: '#6c9165' },
    { name: 'Christian', data: [1.9, 0.8], color: '#33B4FF' },
    { name: 'Sikh', data: [0.6, 0.2], color: '#0856BA' },
    { name: 'Jain', data: [0.3, 0.1], color: '#9DCFEE' },
    { name: 'Buddhist', data: [0.3, 0.2], color: '#FFD900' },
    { name: 'No response', data: [0, 0], color: '#D9D9D9' },
    { name: 'Others', data: [0, 0], color: '#D9D9D9' }
  ]
};

// Social Category data for the new section
const socialCategoryDataNew = [
  { name: 'General/OC', value: 60, color: '#f7a35c' },
  { name: 'Schedule Castes', value: 16.6, color: '#6c9165' },
  { name: 'Schedule Tribes', value: 4, color: '#8085e9' },
  { name: 'OBC', value: 2, color: '#f15c80' },
  { name: 'No response', value: 0, color: '#b7ab50' }
];

// Social Category distribution data for column charts
const socialCategoryGenderDistributionData = {
  categories: ['Male', 'Female'],
  series: [
    { name: 'General/OC', data: [61, 56.6], color: '#f7a35c' },
    { name: 'Schedule Castes', data: [16.4, 17.4], color: '#6c9165' },
    { name: 'Schedule Tribes', data: [3.7, 4.9], color: '#8085e9' },
    { name: 'OBC', data: [1.9, 2.3], color: '#f15c80' },
    { name: 'No response', data: [0, 0], color: '#b7ab50' }
  ]
};

const socialCategoryReligionDistributionData = {
  categories: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Others'],
  series: [
    { name: 'General/OC', data: [64.7, 74, 30.1, 22.3, 25.9], color: '#f7a35c' },
    { name: 'Schedule Castes', data: [21.5, 9, 31.2, 30.1, 22.4], color: '#6c9165' },
    { name: 'Schedule Tribes', data: [4.2, 3.2, 23.9, 29.5, 24.4], color: '#8085e9' },
    { name: 'OBC', data: [1.4, 3.1, 7, 12.1, 11.2], color: '#f15c80' },
    { name: 'No response', data: [0, 0, 0, 0, 0], color: '#b7ab50' }
  ]
};

const socialCategoryAgeGroupDistributionData = {
  categories: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years'],
  series: [
    { name: 'General/OC', data: [62.2, 59.8, 59.9, 63.9], color: '#f7a35c' },
    { name: 'Schedule Castes', data: [15.2, 15.6, 16.2, 17.3], color: '#6c9165' },
    { name: 'Schedule Tribes', data: [3.1, 3.2, 3.3, 4.2], color: '#8085e9' },
    { name: 'OBC', data: [1.8, 1.6, 1.7, 1.6], color: '#f15c80' },
    { name: 'No response', data: [0, 0, 0, 0], color: '#b7ab50' }
  ]
};

const socialCategoryLocalityDistributionData = {
  categories: ['Urban', 'Rural'],
  series: [
    { name: 'General/OC', data: [60.2, 60], color: '#f7a35c' },
    { name: 'Schedule Castes', data: [16.5, 16.7], color: '#6c9165' },
    { name: 'Schedule Tribes', data: [4.4, 3.9], color: '#8085e9' },
    { name: 'OBC', data: [2.9, 1.7], color: '#f15c80' },
    { name: 'No response', data: [0, 0], color: '#b7ab50' }
  ]
};

// Age data for the new section
const ageDataNew = [
  { name: '18-24 Years', value: 16.8, color: '#6c9165' },
  { name: '25-34 Years', value: 30, color: '#f7a35c' },
  { name: '35-50 Years', value: 35.9, color: '#8085e9' },
  { name: '50+ Years', value: 20.8, color: '#f15c80' }
];

// Age distribution data for column charts
const ageGenderDistributionData = {
  categories: ['Male', 'Female'],
  series: [
    { name: '18-24 Years', data: [15.4, 21.1], color: '#6c9165' },
    { name: '25-34 Years', data: [29.8, 30.8], color: '#f7a35c' },
    { name: '35-50 Years', data: [36, 35.6], color: '#8085e9' },
    { name: '50+ Years', data: [22.3, 15.9], color: '#f15c80' }
  ]
};

const ageReligionDistributionData = {
  categories: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Others'],
  series: [
    { name: '18-24 Years', data: [16.4, 16.3, 16.1, 15.6, 14.4], color: '#6c9165' },
    { name: '25-34 Years', data: [29, 32.7, 28.4, 29.2, 23.4], color: '#f7a35c' },
    { name: '35-50 Years', data: [36.6, 35.4, 28.8, 24.7, 35.9], color: '#8085e9' },
    { name: '50+ Years', data: [21.7, 19, 28.3, 32.1, 29.7], color: '#f15c80' }
  ]
};

const ageSocialCategoryDistributionData = {
  categories: ['General/OC', 'Schedule Castes', 'Schedule Tribes', 'OBC', 'No response'],
  series: [
    { name: '18-24 Years', data: [16.1, 15.8, 14.5, 17, 0], color: '#6c9165' },
    { name: '25-34 Years', data: [30.1, 30.4, 30.4, 28.6, 0], color: '#f7a35c' },
    { name: '35-50 Years', data: [36.3, 36.3, 35.3, 34, 0], color: '#8085e9' },
    { name: '50+ Years', data: [21.2, 20.7, 22.7, 24, 0], color: '#f15c80' }
  ]
};

const ageLocalityDistributionData = {
  categories: ['Urban', 'Rural'],
  series: [
    { name: '18-24 Years', data: [15.9, 17.1], color: '#6c9165' },
    { name: '25-34 Years', data: [29.5, 30.2], color: '#f7a35c' },
    { name: '35-50 Years', data: [35.1, 36.1], color: '#8085e9' },
    { name: '50+ Years', data: [22.7, 20.3], color: '#f15c80' }
  ]
};

// ECharts Pie Chart Component
const EChartsPieChart = ({ data, title, className = '' }: { data: any[], title: string, className?: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: title.toUpperCase(),
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: '#fff',
          borderColor: '#ccc',
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: '50%',
            center: ['60%', '50%'],
            data: data.map(item => ({
              value: item.value,
              name: item.name,
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
              show: true,
              formatter: '{d}%',
              fontSize: 12,
              fontWeight: 'bold'
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 5
            }
          }
        ]
      };

      chartInstance.current.setOption(option);

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [data, title]);
  
  return (
    <Card className={`${className}`}>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </Card>
  );
};

// ECharts Column Chart Component
const EChartsColumnChart = ({ data, title, className = '' }: { data: any, title: string, className?: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: title.toUpperCase(),
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: '#fff',
          borderColor: '#ccc',
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          data: data.series.map((s: any) => s.name),
          top: 'bottom',
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.categories,
          axisLabel: {
            fontSize: 12,
            color: '#4a4a69'
          }
        },
        yAxis: {
          type: 'value',
          name: 'Distribution Level %',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontSize: 15,
            color: '#4a4a69'
          },
          axisLabel: {
            fontSize: 12,
            color: '#4a4a69'
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#e6e6e6'
            }
          }
        },
        series: data.series.map((series: any) => ({
          name: series.name,
          type: 'bar',
          data: series.data,
          itemStyle: {
            color: series.color
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }))
      };

      chartInstance.current.setOption(option);

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [data, title]);
  
  return (
    <Card className={`${className}`}>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </Card>
  );
};

export default function DataAnalysisPage() {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    zone: '',
    pc: '',
    ac: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    ageGroup: ''
  });

  const generateDateOptions = () => {
    const options = [
      { value: '', label: 'Select Date' },
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday' },
      { value: 'last7days', label: 'Last 7 Days' },
      { value: 'last30days', label: 'Last 30 Days' }
    ];
    return options;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    // Implement search logic here
  };

  const handleReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      zone: '',
      pc: '',
      ac: '',
      gender: '',
      locality: '',
      religion: '',
      socialCategory: '',
      ageGroup: ''
    });
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="breadcrumb-header justify-content-between mb-6">
          <div className="left-content">
            <span className="main-content-title mg-b-0 mg-b-lg-1 text-2xl font-bold text-gray-900 dark:text-white">
              Data Analysis : State Survey
            </span>
          </div>
          <div className="justify-content-center mt-2">
          </div>
          <div className="right-content">
            <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
          </div>
        </div>

        {/* Search Form */}
        <Card>
        <form id="searchform" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          {/* Top Row - Select Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Start Date */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="start_date">
                  Start Date
                </label>
              <SelectDropdown
                value={filters.fromDate}
                onChange={(value: string | string[]) => handleFilterChange('fromDate', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: 'Select Date' },
                    { value: '2024-05-31', label: '2024-05-31' },
                    { value: '2024-05-30', label: '2024-05-30' },
                    { value: '2024-05-29', label: '2024-05-29' },
                    { value: '2024-05-28', label: '2024-05-28' },
                    { value: '2024-05-27', label: '2024-05-27' },
                    { value: '2024-05-26', label: '2024-05-26' },
                    { value: '2024-05-25', label: '2024-05-25' },
                    { value: '2024-05-24', label: '2024-05-24' },
                    { value: '2024-05-23', label: '2024-05-23' },
                    { value: '2024-05-22', label: '2024-05-22' },
                    { value: '2024-05-21', label: '2024-05-21' },
                    { value: '2024-05-20', label: '2024-05-20' },
                    { value: '2024-05-19', label: '2024-05-19' },
                    { value: '2024-05-18', label: '2024-05-18' }
                  ]}
                  placeholder="Select Date"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="end_date">
                  End Date
                </label>
              <SelectDropdown
                value={filters.toDate}
                onChange={(value: string | string[]) => handleFilterChange('toDate', Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: 'Select Date' },
                    { value: '2024-05-31', label: '2024-05-31' },
                    { value: '2024-05-30', label: '2024-05-30' },
                    { value: '2024-05-29', label: '2024-05-29' },
                    { value: '2024-05-28', label: '2024-05-28' },
                    { value: '2024-05-27', label: '2024-05-27' },
                    { value: '2024-05-26', label: '2024-05-26' },
                    { value: '2024-05-25', label: '2024-05-25' },
                    { value: '2024-05-24', label: '2024-05-24' },
                    { value: '2024-05-23', label: '2024-05-23' },
                    { value: '2024-05-22', label: '2024-05-22' },
                    { value: '2024-05-21', label: '2024-05-21' },
                    { value: '2024-05-20', label: '2024-05-20' },
                    { value: '2024-05-19', label: '2024-05-19' },
                    { value: '2024-05-18', label: '2024-05-18' },
                    { value: '2024-05-17', label: '2024-05-17' }
                  ]}
                  placeholder="Select Date"
                />
              </div>
            </div>

            {/* Zone */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Zone</label>
              <SelectDropdown
                value={filters.zone}
                onChange={(value: string | string[]) => handleFilterChange('zone', Array.isArray(value) ? value[0] : value)}
                options={[
                    { value: '', label: 'Select a Zone' },
                    { value: '1', label: 'Burdwan' },
                    { value: '2', label: 'Jalpaiguri' },
                    { value: '3', label: 'Malda' },
                    { value: '4', label: 'Medinipur' },
                    { value: '5', label: 'Presidency' }
                  ]}
                  placeholder="Select a Zone"
                />
              </div>
            </div>

            {/* PC */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">PC</label>
              <SelectDropdown
                value={filters.pc}
                onChange={(value: string | string[]) => handleFilterChange('pc', Array.isArray(value) ? value[0] : value)}
                options={[
                    { value: '', label: 'Select a PC' },
                    { value: '2', label: 'Alipurduars' },
                    { value: '29', label: 'Arambagh (SC)' },
                    { value: '40', label: 'Asansol' },
                    { value: '10', label: 'Baharampur' },
                    { value: '6', label: 'Balurghat' },
                    { value: '14', label: 'Bangaon (SC)' },
                    { value: '36', label: 'Bankura' },
                    { value: '17', label: 'Barasat' },
                    { value: '38', label: 'Bardhaman Pur' },
                    { value: '39', label: 'Bardhaman-Dur' }
                  ]}
                  placeholder="Select a PC"
                />
              </div>
            </div>
            </div>

          {/* AC Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* AC */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">AC</label>
              <SelectDropdown
                value={filters.ac}
                onChange={(value: string | string[]) => handleFilterChange('ac', Array.isArray(value) ? value[0] : value)}
                options={[
                    { value: '', label: 'Select a AC' },
                    { value: '12', label: 'Alipurduars' },
                    { value: '102', label: 'Amdanga' },
                    { value: '181', label: 'Amta' },
                    { value: '200', label: 'Arambag' },
                    { value: '280', label: 'Asansol Dakshin' },
                    { value: '281', label: 'Asansol Uttar' },
                    { value: '101', label: 'Ashoknagar' },
                    { value: '273', label: 'Ausgram' },
                    { value: '99', label: 'Baduria' },
                    { value: '94', label: 'Bagda' },
                    { value: '240', label: 'Baghmundi' },
                    { value: '180', label: 'Bagnan' },
                    { value: '72', label: 'Baharampur' },
                    { value: '54', label: 'Baisnabnagar' },
                    { value: '191', label: 'Balagarh' },
                    { value: '239', label: 'Balarampur' },
                    { value: '169', label: 'Bally' },
                    { value: '161', label: 'Ballygunge' }
                  ]}
                  placeholder="Select a AC"
                />
              </div>
            </div>
            </div>

          {/* Bottom Row - Checkbox Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {/* Gender */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Gender</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="gender[]" 
                      value="1"
                      checked={filters.gender === 'male'}
                      onChange={(e) => handleFilterChange('gender', e.target.checked ? 'male' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="gender[]" 
                      value="2"
                      checked={filters.gender === 'female'}
                      onChange={(e) => handleFilterChange('gender', e.target.checked ? 'female' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Female</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Locality */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Locality</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="locality[]" 
                      value="1"
                      checked={filters.locality === 'urban'}
                      onChange={(e) => handleFilterChange('locality', e.target.checked ? 'urban' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Urban</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="locality[]" 
                      value="2"
                      checked={filters.locality === 'rural'}
                      onChange={(e) => handleFilterChange('locality', e.target.checked ? 'rural' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Rural</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Religion */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Religion</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="religion[]" 
                      value="1"
                      checked={filters.religion === 'hindu'}
                      onChange={(e) => handleFilterChange('religion', e.target.checked ? 'hindu' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Hindu</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="religion[]" 
                      value="2"
                      checked={filters.religion === 'muslim'}
                      onChange={(e) => handleFilterChange('religion', e.target.checked ? 'muslim' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Muslim</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="religion[]" 
                      value="3"
                      checked={filters.religion === 'christian'}
                      onChange={(e) => handleFilterChange('religion', e.target.checked ? 'christian' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Christian</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="religion[]" 
                      value="4"
                      checked={filters.religion === 'sikh'}
                      onChange={(e) => handleFilterChange('religion', e.target.checked ? 'sikh' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sikh</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="religion[]" 
                      value="5"
                      checked={filters.religion === 'others'}
                      onChange={(e) => handleFilterChange('religion', e.target.checked ? 'others' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Others</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Social Category */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Social Category</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="social_category[]" 
                      value="1"
                      checked={filters.socialCategory === 'general'}
                      onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'general' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">General/OC</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="social_category[]" 
                      value="2"
                      checked={filters.socialCategory === 'sc'}
                      onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'sc' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Schedule Castes</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="social_category[]" 
                      value="3"
                      checked={filters.socialCategory === 'st'}
                      onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'st' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Schedule Tribes</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="social_category[]" 
                      value="4"
                      checked={filters.socialCategory === 'obc'}
                      onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'obc' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Other Backward Castes</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="social_category[]" 
                      value="5"
                      checked={filters.socialCategory === 'no_response'}
                      onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'no_response' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">No response</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Age Group */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Age Group</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="age[]" 
                      value="18_24"
                      checked={filters.ageGroup === '18-24'}
                      onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '18-24' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">18-24 Years</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="age[]" 
                      value="25_34"
                      checked={filters.ageGroup === '25-34'}
                      onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '25-34' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">25-34 Years</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="age[]" 
                      value="35_50"
                      checked={filters.ageGroup === '35-50'}
                      onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '35-50' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">35-50 Years</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="age[]" 
                      value="51_80"
                      checked={filters.ageGroup === '50+'}
                      onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '50+' : '')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">50+ Years</span>
                  </label>
            </div>
          </div>
          </div>
          </div>
        </form>
        </Card>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Respondent's Residential Locality */}
          <Card>
            <div className="card-header pb-0">
              <div className="flex justify-between items-center">
                <div className="w-1 h-6 bg-green-500 mr-3"></div>
                <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
                  4. RESPONDENT'S RESIDENTIAL LOCALITY
                </Heading>
                <div className="text-end ms-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    SAMPLE SIZE : 2,83,403
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#FF5722', color:'#fff', opacity: 1}}>URBAN</span>
                <span className="btn btn-sm btnoption px-3 py-1" style={{backgroundColor:'#4CAF50', color:'#fff', opacity: 1}}>RURAL</span>
              </div>
            </div>
            <div className="card-body p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Row 1 */}
                <div className="space-y-4">
                  <Heading level={6} className="text-lg font-semibold mb-4">
                    Simple Frequency
                  </Heading>
                  <EChartsPieChart 
                    data={localityData} 
                    title="Simple Frequency" 
                  />
                </div>
                <div className="space-y-4">
                  <Heading level={6} className="text-lg font-semibold mb-4">
                    Distribution <span className="font-normal italic">Gender</span> Wise
                  </Heading>
                  <EChartsColumnChart 
                    data={genderDistributionData} 
                    title="Distribution Level" 
                  />
                </div>
                
                {/* Row 2 */}
                <div className="space-y-4">
                  <Heading level={6} className="text-lg font-semibold mb-4">
                    Distribution <span className="font-normal italic">Religion</span> Wise
                  </Heading>
                  <EChartsColumnChart 
                    data={religionDistributionData} 
                    title="Distribution Level" 
                  />
                </div>
                <div className="space-y-4">
                  <Heading level={6} className="text-lg font-semibold mb-4">
                    Distribution <span className="font-normal italic">Social Category</span> Wise
                  </Heading>
                  <EChartsColumnChart 
                    data={socialCategoryDistributionData} 
                    title="Distribution Level" 
                  />
                </div>
                
                {/* Row 3 */}
                <div className="space-y-4">
                  <Heading level={6} className="text-lg font-semibold mb-4">
                    Distribution <span className="font-normal italic">Age Group</span> Wise
                  </Heading>
                  <EChartsColumnChart 
                    data={ageGroupDistributionData} 
                    title="Distribution Level" 
                  />
                </div>
                <div className="space-y-4">
                  <Heading level={6} className="text-lg font-semibold mb-4">
                    Distribution <span className="font-normal italic">Locality</span> Wise
                  </Heading>
                  <EChartsColumnChart 
                    data={localityDistributionData} 
                    title="Distribution Level" 
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Respondent's Gender */}
          <Card>
            <div className="card-header pb-0">
              <div className="flex justify-between items-center">
                <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
                  5. RESPONDENT'S GENDER
                </Heading>
                <div className="text-end ms-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    SAMPLE SIZE : 2,81,888
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#2CA4D2', color:'#fff', opacity: 1}}>MALE</span>
                <span className="btn btn-sm btnoption px-3 py-1" style={{backgroundColor:'#B13173', color:'#fff', opacity: 1}}>FEMALE</span>
              </div>
            </div>
            <div className="card-body p-6">
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Simple Frequency
                    </Heading>
                    <EChartsPieChart 
                      data={genderDataNew} 
                      title="Simple Frequency" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Religion</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={genderReligionDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Social Category</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={genderSocialCategoryDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Age Group</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={genderAgeGroupDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 3 - Only left side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Locality</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={genderLocalityDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Respondent's Religion Section */}
          <Card>
            <div className="card-header pb-0">
              <div className="flex justify-between items-center">
                <div className="w-1 h-6 bg-green-500 mr-3"></div>
                <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
                  6. RESPONDENT'S RELIGION
                </Heading>
                <div className="text-end ms-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    SAMPLE SIZE : 2,81,878
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#f7a35c', color:'#fff', opacity: 1}}>HINDU</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#6c9165', color:'#fff', opacity: 1}}>MUSLIM</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#33B4FF', color:'#fff', opacity: 1}}>CHRISTIAN</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#0856BA', color:'#fff', opacity: 1}}>SIKH</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#9DCFEE', color:'#000', opacity: 1}}>JAIN</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#FFD900', color:'#000', opacity: 1}}>BUDDHIST</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#D9D9D9', color:'#000', opacity: 1}}>NO RESPONSE</span>
                <span className="btn btn-sm btnoption px-3 py-1" style={{backgroundColor:'#D9D9D9', color:'#000', opacity: 1}}>OTHERS</span>
              </div>
            </div>
            <div className="card-body p-6">
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Simple Frequency
                    </Heading>
                    <EChartsPieChart 
                      data={religionDataNew} 
                      title="Simple Frequency" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Gender</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={religionGenderDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Social Category</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={religionSocialCategoryDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Age Group</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={religionAgeGroupDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 3 - Only left side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Locality</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={religionLocalityDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Respondent's Social Category Section */}
          <Card>
            <div className="card-header pb-0">
              <div className="flex justify-between items-center">
                <div className="w-1 h-6 bg-green-500 mr-3"></div>
                <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
                  7. RESPONDENT'S SOCIAL CATEGORY
                </Heading>
                <div className="text-end ms-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    SAMPLE SIZE : 2,81,878
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#f7a35c', color:'#fff', opacity: 1}}>GENERAL/OC</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#6c9165', color:'#fff', opacity: 1}}>SCHEDULE CASTES</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#8085e9', color:'#fff', opacity: 1}}>SCHEDULE TRIBES</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#f15c80', color:'#fff', opacity: 1}}>OBC</span>
                <span className="btn btn-sm btnoption px-3 py-1" style={{backgroundColor:'#b7ab50', color:'#fff', opacity: 1}}>NO RESPONSE</span>
              </div>
            </div>
            <div className="card-body p-6">
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Simple Frequency
                    </Heading>
                    <EChartsPieChart 
                      data={socialCategoryDataNew} 
                      title="Simple Frequency" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Gender</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={socialCategoryGenderDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Religion</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={socialCategoryReligionDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Age Group</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={socialCategoryAgeGroupDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 3 - Only left side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Locality</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={socialCategoryLocalityDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Respondent's Age Section */}
          <Card>
            <div className="card-header pb-0">
              <div className="flex justify-between items-center">
                <div className="w-1 h-6 bg-green-500 mr-3"></div>
                <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
                  8. RESPONDENT'S AGE
                </Heading>
                <div className="text-end ms-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    SAMPLE SIZE : 2,83,404
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#6c9165', color:'#fff', opacity: 1}}>18-24 YEARS</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#f7a35c', color:'#fff', opacity: 1}}>25-34 YEARS</span>
                <span className="btn btn-sm btnoption mr-2 px-3 py-1" style={{backgroundColor:'#8085e9', color:'#fff', opacity: 1}}>35-50 YEARS</span>
                <span className="btn btn-sm btnoption px-3 py-1" style={{backgroundColor:'#f15c80', color:'#fff', opacity: 1}}>50+ YEARS</span>
              </div>
            </div>
            <div className="card-body p-6">
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Simple Frequency
                    </Heading>
                    <EChartsPieChart 
                      data={ageDataNew} 
                      title="Simple Frequency" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Gender</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={ageGenderDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Religion</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={ageReligionDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Social Category</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={ageSocialCategoryDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                </div>
                
                {/* Row 3 - Only left side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Heading level={6} className="text-lg font-semibold mb-4">
                      Distribution <span className="font-normal italic">Locality</span> Wise
                    </Heading>
                    <EChartsColumnChart 
                      data={ageLocalityDistributionData} 
                      title="Distribution Level" 
                    />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
