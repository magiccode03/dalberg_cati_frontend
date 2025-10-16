'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api-service';

// Dynamically import Apache ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface WisdomOfCrowdsData {
  page_info: {
    page_name: string;
    page_title: string;
    total_interviews: number;
  };
  charts: {
    party_likely_to_win: {
      chart_type: string;
      chart_id: string;
      question_id: string;
      total_sample: number;
      data: Array<{
        name: string;
        y: number;
        count: string;
      }>;
      colors: string[];
      title: string;
    };
  };
}

export default function WisdomOfCrowdsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<WisdomOfCrowdsData | null>(null);

  // Fetch data from API
  const fetchWisdomOfCrowdsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getWisdomOfCrowds();
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch wisdom of crowds data');
      }
    } catch (err: any) {
      console.error('Error fetching wisdom of crowds data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWisdomOfCrowdsData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading wisdom of crowds data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-red-600 mb-4">{error}</Text>
          </Card>
        </div>
      </Container>
    );
  }

  // No data state
  if (!apiData) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-gray-600">No data available</Text>
          </Card>
        </div>
      </Container>
    );
  }

  // Prepare chart data
  const chartData = apiData.charts.party_likely_to_win;
  const pieData = chartData.data.map((item, index) => ({
    name: item.name,
    value: item.y,
    count: item.count,
    itemStyle: {
      color: chartData.colors[index] || '#cccccc'
    }
  }));

  // Chart options
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        return `${params.name}<br/>Percentage: <b>${params.value}%</b><br/>Count: <b>${params.data.count}</b>`;
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 20,
      left: 'center',
      itemGap: 15,
      textStyle: {
        fontSize: 11
      },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [
      {
        name: 'Party Likely to Win',
        type: 'pie',
        radius: ['0%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: true,
          position: 'outside',
          formatter: function(params: any) {
            return `${params.value}%`;
          },
          fontSize: 11,
          fontWeight: 'bold',
          color: '#000'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 5,
          lineStyle: {
            color: '#666'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: pieData
      }
    ]
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          {apiData.page_info.page_title}
        </Heading>
      </div>

      {/* Chart Section */}
      <Card className="p-0">
        <div className="border border-gray-300 p-3">
          {/* Chart Title */}
          <div className="text-center mb-2">
            <Heading level={4} className="text-base font-semibold">
              {chartData.title}
            </Heading>
          </div>
          
          {/* Interviews Achieved */}
          <div className="flex justify-end mb-2">
            <Text className="text-sm font-medium text-gray-600">
              Interviews Achieved - {apiData.page_info.total_interviews.toLocaleString()}
            </Text>
          </div>

          {/* Pie Chart */}
          <div className="w-full">
            <ReactECharts 
              option={chartOptions} 
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
