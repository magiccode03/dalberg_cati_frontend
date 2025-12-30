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

interface ChartDataItem {
  name: string;
  y?: number;
  achieved?: number;
  count: string;
}

export default function ApprovalRatingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mlaData, setMlaData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mpData, setMpData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'mla' | 'mp'>('mla');

  // Fetch approval ratings data
  const fetchApprovalRatingsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [mlaResponse, mpResponse] = await Promise.all([
        apiService.getApprovalRatings(),
        apiService.getApprovalRatingsPcWise(),
      ]);

      if (mlaResponse.success && mlaResponse.data) {
        setMlaData(mlaResponse.data);
      } else {
        throw new Error('Failed to fetch MLA approval ratings data');
      }

      if (mpResponse.success && mpResponse.data) {
        setMpData(mpResponse.data);
      } else {
        throw new Error('Failed to fetch MP approval ratings data');
      }
    } catch (err: unknown) {
      console.error('Error fetching approval ratings data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalRatingsData();
  }, []);

  // Pie chart options for Satisfaction with State Govt
  const getSatisfactionPieChartOptions = () => {
    if (!mlaData?.charts?.satisfaction_state_govt) return {};

    const chartData = mlaData.charts.satisfaction_state_govt;

    return {
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `${params.name}<br/>Percentage: ${params.value}%<br/>Total: ${params.data.count}`;
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: chartData.data.map((item: any) => item.name)
      },
      series: [
        {
          name: 'Percentage',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Pie chart options for Satisfaction with BJP Govt (MP)
  const getBjpGovtPieChartOptions = () => {
    if (!mpData?.charts?.satisfaction_bjp_govt) return {};

    const chartData = mpData.charts.satisfaction_bjp_govt;

    return {
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `${params.name}<br/>Percentage: ${params.value}%<br/>Tota: ${params.data.count}`;
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: chartData.data.map((item: any) => item.name)
      },
      series: [
        {
          name: 'Percentage',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: chartData.data.map((item: any, index: number) => ({
            value: item.achieved,
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
  if (!mlaData && !mpData) {
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
          {mlaData?.page_info?.page_title || mpData?.page_info?.page_title || 'Approval Ratings'}
        </Heading>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Satisfaction with State Govt Pie Chart */}
        <Card className="p-6 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1 text-left">
              Satisfaction with State Govt. led by MB (Mamta Banerjee)
            </Heading>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
              Interviews Achieved - {mlaData?.page_info?.total_interviews?.toLocaleString() || 0}
            </div>
          </div>
          <ReactECharts
            option={getSatisfactionPieChartOptions()}
            style={{ height: '500px' }}
          />
        </Card>


        <Card className="p-6 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1 text-left">
              Satisfaction with BJP Govt. with opposition
            </Heading>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
              Interviews Achieved - {mpData?.page_info?.total_interviews?.toLocaleString() || 0}
            </div>
          </div>
          <ReactECharts
            option={getBjpGovtPieChartOptions()}
            style={{ height: '500px' }}
          />
        </Card>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        {/* MLA Card */}
        <div
          className={`transition-all duration-200 rounded-lg shadow-md cursor-pointer 
            ${selectedTab === 'mla'
              ? 'bg-green-600'
              : 'bg-green-500 bg-opacity-50 hover:bg-opacity-100'
            }
            `}
          onClick={() => setSelectedTab('mla')}
        >
          <div className="p-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-2">MLA</h2>
            <h4 className="text-white text-2xl font-semibold">
             ACs -  {mlaData?.mla_satisfaction?.ac_data?.length || 0}
            </h4>
          </div>
        </div>
        {/* MP Card */}
        <div
          className={`transition-all duration-200 rounded-lg shadow-md cursor-pointer ${selectedTab === 'mp'
              ? 'bg-green-600'
              : 'bg-green-500 bg-opacity-50 hover:bg-opacity-100'
            }`}
          onClick={() => setSelectedTab('mp')}
        >
          <div className="p-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-2">MP</h2>
            <h4 className="text-white text-2xl font-semibold">
             PCs -  {mpData?.mp_satisfaction?.pc_data?.length || 0}
            </h4>
          </div>
        </div>

      </div>

      {/* Satisfaction Table - MLA or MP */}
      <Card className="p-6 border border-gray-300">
        <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">
          {selectedTab === 'mla' 
            ? (mlaData?.mla_satisfaction?.title || 'Satisfaction with current MLA')
            : (mpData?.mp_satisfaction?.title || 'Satisfaction with current MP')
          }
        </Heading>

        {selectedTab === 'mla' ? (
          // MLA Table
          mlaData?.mla_satisfaction?.ac_data && mlaData.mla_satisfaction.ac_data.length > 0 ? (
            <div className="overflow-x-auto">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{ width: '8%' }}>
                      AC Code
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{ width: '15%' }}>
                      AC Name
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{ width: '20%' }}>
                      MLA Name
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#61c296' }}>
                      Fully Satisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#9bdb4a' }}>
                      Somewhat Satisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#a3a9a9' }}>
                      Neither Satisfied Nor Dissatisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#c79e96' }}>
                      Somewhat Dissatisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#c02453' }}>
                      Fully Dissatisfied
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mlaData.mla_satisfaction.ac_data.map((item: any, index: number) => (
                    <tr key={`${(item as any).ac_code}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-center font-medium text-gray-900 dark:text-white">
                        {(item as any).ac_code}
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-900 dark:text-white">
                        {(item as any).ac_name}
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-900 dark:text-white">
                        {(item as any).mla_name}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Highly Satisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Somewhat satisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Neither satisfied nor dissatisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Somewhat dissatisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Highly Dissatisfied'] || 0}%
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
          )
        ) : (
          // MP Table
          mpData?.mp_satisfaction?.pc_data && mpData.mp_satisfaction.pc_data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{ width: '8%' }}>
                      PC Code
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{ width: '15%' }}>
                      PC Name
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-900 dark:text-white" style={{ width: '20%' }}>
                      MP Name
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#61c296' }}>
                      Fully Satisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#9bdb4a' }}>
                      Somewhat Satisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#a3a9a9' }}>
                      Neither Satisfied Nor Dissatisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#c79e96' }}>
                      Somewhat Dissatisfied
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-white" style={{ width: '12%', backgroundColor: '#c02453' }}>
                      Highly Dissatisfied
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {mpData.mp_satisfaction.pc_data.map((item: any, index: number) => (
                    <tr key={`${(item as any).pc_code}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-center font-medium text-gray-900 dark:text-white">
                        {(item as any).pc_code}
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-900 dark:text-white">
                        {(item as any).pc_name}
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-900 dark:text-white">
                        {(item as any).mp_name}
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Fully satisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Somewhat satisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Neither satisfied nor dissatisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Somewhat dissatisfied'] || 0}%
                      </td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900 dark:text-white">
                        {(item as any).satisfaction_breakdown?.['Fully Dissatisfied'] || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No MP satisfaction data available</p>
            </div>
          )
        )}
      </Card>
    </div>
  );
}
