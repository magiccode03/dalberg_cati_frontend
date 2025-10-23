'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api-service';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function ApprovalRatingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);

  // Fetch approval ratings data
  const fetchApprovalRatingsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getApprovalRatings();
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch approval ratings data');
      }
    } catch (err: any) {
      console.error('Error fetching approval ratings data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalRatingsData();
  }, []);

  // Pie chart options for Satisfaction with State Govt
  const getSatisfactionPieChartOptions = () => {
    if (!apiData?.charts?.satisfaction_state_govt) return {};

    const chartData = apiData.charts.satisfaction_state_govt;
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}% <br/>Achieved - <b>{d}</b>',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: chartData.data.map((item: any) => item.name)
      },
      series: [
        {
          name: 'Percentage',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: chartData.data.map((item: any, index: number) => ({
            value: item.y,
            name: item.name,
            count: item.count,
            itemStyle: {
              color: chartData.colors[index]
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
            formatter: '{b}: {c}%',
            fontSize: 12
          },
          labelLine: {
            show: true
          }
        }
      ]
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading approval ratings data...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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

  // No data state
  if (!apiData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-gray-600">No data available</Text>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          {apiData.page_info?.page_title || 'Approval Ratings'}
        </Heading>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        {/* Satisfaction with State Govt Pie Chart */}
        <Card className="p-6 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1">
              Satisfaction with State Govt. led by MB (Mamta Banerjee)
            </Heading>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Interviews Achieved - {apiData.page_info?.total_interviews?.toLocaleString() || 0}
            </div>
          </div>
          <ReactECharts 
            option={getSatisfactionPieChartOptions()} 
            style={{ height: '500px' }} 
          />
        </Card>
      </div>

      {/* MLA Satisfaction Table */}
      <Card className="p-6 border border-gray-300">
        <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">
          {apiData.mla_satisfaction?.title || 'Satisfaction with current MLA'}
        </Heading>
        
        {apiData.mla_satisfaction?.ac_data && apiData.mla_satisfaction.ac_data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{width: '8%'}}>
                    AC Code
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{width: '15%'}}>
                    AC Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{width: '20%'}}>
                    MLA Name
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{width: '12%', backgroundColor: '#61c296'}}>
                    Highly Satisfied
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{width: '12%', backgroundColor: '#9bdb4a'}}>
                    Somewhat Satisfied
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{width: '12%', backgroundColor: '#a3a9a9'}}>
                    Neither Satisfied Nor Dissatisfied
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{width: '12%', backgroundColor: '#c79e96'}}>
                    Somewhat Dissatisfied
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{width: '12%', backgroundColor: '#c02453'}}>
                    Highly Dissatisfied
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiData.mla_satisfaction.ac_data.map((item: any, index: number) => (
                  <tr key={item.ac_code || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="border border-gray-300 p-3 text-center font-medium text-gray-900 dark:text-white">
                      {item.ac_code}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900 dark:text-white">
                      {item.ac_name}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900 dark:text-white">
                      {item.mla_name}
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                      {item.satisfaction_breakdown?.['Highly Satisfied'] || 0}%
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                      {item.satisfaction_breakdown?.['Somewhat satisfied'] || 0}%
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                      {item.satisfaction_breakdown?.['Neither satisfied nor dissatisfied'] || 0}%
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                      {item.satisfaction_breakdown?.['Somewhat dissatisfied'] || 0}%
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                      {item.satisfaction_breakdown?.['Highly Dissatisfied'] || 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No MLA satisfaction data available</p>
          </div>
        )}
      </Card>
    </div>
  );
}
