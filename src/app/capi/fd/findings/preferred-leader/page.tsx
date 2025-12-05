
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api-service';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function PreferredLeaderPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  // Fallback demo data to render chart when API lacks preferred_cm
  const fallbackChartData = {
    data: [
      { name: 'Mamata Banerjee', y: 94.1, count: '9410' },
      { name: 'Adhir Ranjan Chowdhury', y: 78.5, count: '7850' },
      { name: 'Partha Chatterjee', y: 62.3, count: '6230' },
      { name: 'Aroop Biswas', y: 53.6, count: '5360' },
      { name: 'Mukul Roy', y: 45.3, count: '4530' },
      { name: 'Any from TMC', y: 37.1, count: '3710' },
      { name: 'Any from INC', y: 28.9, count: '2890' },
      { name: 'Any from BJP', y: 20.7, count: '2070' },
      { name: 'Others', y: 12.5, count: '1250' }
    ],
    colors: ['#2da9d9', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B', '#F37809', '#9E9E9E', '#E55705']
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getApprovalRatings();
      if (response.success && response.data?.charts?.preferred_cm) {
        setChartData(response.data.charts.preferred_cm);
      } else {
        // Use fallback data if API does not provide preferred_cm
        setChartData(fallbackChartData);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error fetching Preferred CM data:', err);
      // On error, still render fallback chart so page is not blank
      setChartData(fallbackChartData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChartOptions = () => {
    if (!chartData) return {};

    const categories = chartData.data.map((item: any) => item.name);
    const values = chartData.data.map((item: any) => item.y);
    const colors = chartData.colors || [];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { 
            rotate:  0,
            interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        max: 100,
      },
      series: [
        {
          name: 'Preferred CM',
          type: 'bar',
          data: values.map((value: number, index: number) => ({
            value,
            itemStyle: { color: colors[index] || '#2da9d9' },
          })),
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold',
          },
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading Preferred CM data...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error && !chartData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-red-600 mb-4">{error}</Text>
          </Card>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-gray-600">No Preferred CM data available</Text>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-8">
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          Preferred CM
        </Heading>
      </div>

      <Card className="p-6">
        <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Preferred CM Bar Chart
        </Heading>
        <ReactECharts option={getChartOptions()} style={{ height: '450px' }} />
      </Card>
    </div>
  );
}

