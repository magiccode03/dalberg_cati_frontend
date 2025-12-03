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

interface ProgressData {
  completed: number;
  in_progress: number;
  yet_to_begin: number;
  total: number;
}

interface FieldworkProgressData {
  view_type: string;
  progress_type?: number;
  progress_sub_type?: number;
  progress_sub_type_code?: string;
  progress_page?: string;
  progress_label?: string;
  progress_sub_type_label?: string;
  progress_bg_color_label?: string;
  summary_tiles?: {
    target_sample: string;
    interviews_attempted: string;
    interviews_attempted_percentage: number;
    interviews_achieved: string;
    interviews_achieved_percentage: number;
  };
  sub_model?: {
    ac_code?: number;
    ac_name?: string;
    pc_code?: number;
    pc_name?: string;
    district_code?: number;
    district?: string;
    region_code?: number;
    region_name?: string;
    sample_target: number;
    interviews_attempted: number;
    interviews_attempted_percentage: string;
    valid_underqc_achived: number;
    progress_completion_per: string;
    progress_status: number;
  };
  progress_charts?: {
    ac_progress?: ProgressData;
    pc_progress?: ProgressData;
    district_progress?: ProgressData;
    zone_progress?: ProgressData;
  };
  data_provider?: Array<{
    ac_code?: number;
    ac_name?: string;
    pc_code?: number;
    pc_name?: string;
    district_code?: number;
    district?: string;
    region_code?: number;
    region_name?: string;
    sample_target: number;
    valid_underqc_achived: number;
    progress_completion_per: string;
    progress_status: number;
  }>;
  subdata_provider?: Array<{
    // For AC drill-down (polling stations)
    polling_station_no?: string;
    polling_station_name?: string;
    percentage_completion?: number;
    // For PC/District drill-down (ACs)
    ac_code?: number;
    ac_name?: string;
    pc_name?: string;
    // For Zone drill-down (Districts)
    district_code?: number;
    district?: string;
    // Common fields
    sample_target: number;
    valid_underqc_achived: number;
    progress_completion_per?: string;
    progress_status?: number;
    interviews_attempted?: number;
    interviews_attempted_percentage?: string;
  }>;
}

export default function FieldworkProgress2Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<FieldworkProgressData | null>(null);
  const [mainDashboardData, setMainDashboardData] = useState<FieldworkProgressData | null>(null);
  const [selectedProgressType, setSelectedProgressType] = useState<number | null>(null);
  const [selectedProgressSubType, setSelectedProgressSubType] = useState<number | null>(null);
  const [selectedProgressSubTypeCode, setSelectedProgressSubTypeCode] = useState<string | null>(null);

  // Fetch data from API
  const fetchFieldworkProgressData = async (progressType?: number, progressSubType?: number, progressSubTypeCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFDFieldworkProgress(progressType, progressSubType, progressSubTypeCode);
      
      if (response.success && response.data) {
        if (!progressType && !progressSubType && !progressSubTypeCode) {
          // Main dashboard data - store it separately
          setMainDashboardData(response.data);
          setApiData(response.data);
        } else {
          // Detailed view data - keep main dashboard data for summary tiles
          setApiData(response.data);
        }
      } else {
        setError('Failed to fetch fieldwork progress data');
      }
    } catch (err: any) {
      console.error('Error fetching fieldwork progress data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldworkProgressData();
  }, []);

  // Handle chart section clicks
  const handleChartClick = (progressType: number, progressSubType: number) => {
    setSelectedProgressType(progressType);
    setSelectedProgressSubType(progressSubType);
    fetchFieldworkProgressData(progressType, progressSubType);
  };

  // Handle drill-down click
  const handleDrillDown = (progressType: number, progressSubType: number, progressSubTypeCode: string) => {
    setSelectedProgressType(progressType);
    setSelectedProgressSubType(4); // Always use progress_sub_type=4 for drill-down
    setSelectedProgressSubTypeCode(progressSubTypeCode);
    fetchFieldworkProgressData(progressType, 4, progressSubTypeCode); // Always use 4 for drill-down
  };

  // Handle back to main dashboard
  const handleBackToMain = () => {
    setSelectedProgressType(null);
    setSelectedProgressSubType(null);
    setSelectedProgressSubTypeCode(null);
    fetchFieldworkProgressData();
  };

  // Handle back to parent view (from drill-down to detailed view)
  const handleBackToParent = () => {
    setSelectedProgressSubTypeCode(null);
    if (selectedProgressType && selectedProgressSubType) {
      fetchFieldworkProgressData(selectedProgressType, selectedProgressSubType);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading fieldwork progress data...</Text>
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

  // Use appropriate data source based on current view
  const getChartData = (progressType: 'ac_progress' | 'pc_progress' | 'district_progress' | 'zone_progress') => {
    // If we're in a specific progress type view, use that data
    if (selectedProgressType && selectedProgressSubType && apiData?.progress_charts?.[progressType]) {
      return apiData.progress_charts[progressType];
    }
    // Otherwise use main dashboard data
    return mainDashboardData?.progress_charts?.[progressType];
  };

  const acData = {
    completed: getChartData('ac_progress')?.completed || 0,
    inProgress: getChartData('ac_progress')?.in_progress || 0,
    yetToBegin: getChartData('ac_progress')?.yet_to_begin || 0,
    total: getChartData('ac_progress')?.total || 0
  };

  const pcData = {
    completed: getChartData('pc_progress')?.completed || 0,
    inProgress: getChartData('pc_progress')?.in_progress || 0,
    yetToBegin: getChartData('pc_progress')?.yet_to_begin || 0,
    total: getChartData('pc_progress')?.total || 0
  };

  const districtData = {
    completed: getChartData('district_progress')?.completed || 0,
    inProgress: getChartData('district_progress')?.in_progress || 0,
    yetToBegin: getChartData('district_progress')?.yet_to_begin || 0,
    total: getChartData('district_progress')?.total || 0
  };

  const zoneData = {
    completed: getChartData('zone_progress')?.completed || 0,
    inProgress: getChartData('zone_progress')?.in_progress || 0,
    yetToBegin: getChartData('zone_progress')?.yet_to_begin || 0,
    total: getChartData('zone_progress')?.total || 0
  };

  // Chart options for AC
  const acChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '20%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
        series: [
          {
            name: 'Field Status',
            type: 'bar',
            data: [
              { 
                value: acData.completed, 
                itemStyle: { color: '#54B054' },
                name: 'Completed'
              },
              { 
                value: acData.inProgress, 
                itemStyle: { color: '#CFA407' },
                name: 'In Progress'
              },
              { 
                value: acData.yetToBegin, 
                itemStyle: { color: '#a3a9a9' },
                name: 'Yet to Begin'
              }
            ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  // Chart options for PC
  const pcChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: pcData.completed, itemStyle: { color: '#54B054' } },
          { value: pcData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: pcData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  // Chart options for District
  const districtChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: districtData.completed, itemStyle: { color: '#54B054' } },
          { value: districtData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: districtData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  // Chart options for Zone
  const zoneChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>Count: ${data.value}`;
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Completed', 'In Progress', 'Yet to begin'],
      axisLabel: {
        fontSize: 11,
        color: '#333',
        margin: 15
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    series: [
      {
        name: 'Field Status',
        type: 'bar',
        data: [
          { value: zoneData.completed, itemStyle: { color: '#54B054' } },
          { value: zoneData.inProgress, itemStyle: { color: '#CFA407' } },
          { value: zoneData.yetToBegin, itemStyle: { color: '#a3a9a9' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          color: '#000',
          fontSize: 11
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          {selectedProgressType && selectedProgressSubType 
            ? (apiData?.progress_label || 'Fieldwork Progress2')
            : (mainDashboardData?.progress_label || 'Fieldwork Progress2')
          }
        </Heading>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Target Sample */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#4ec2f0' }}>
          <div className="p-6 text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Target Sample</h3>
            <h5 className="text-white text-sm mb-2">(Sample To Be Achieved)</h5>
            <h4 className="text-white text-2xl font-bold">
              {selectedProgressSubTypeCode && apiData?.sub_model 
                ? apiData.sub_model.sample_target.toLocaleString()
                : parseInt(mainDashboardData?.summary_tiles?.target_sample || '0').toLocaleString()
              }
            </h4>
          </div>
        </div>

        {/* Interviews Attempted */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#ad4ffa' }}>
          <div className="p-6 text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Interviews Attempted</h3>
            <h5 className="text-white text-sm mb-2">(Valid + Under QC + Invalid)</h5>
            <h4 className="text-white text-2xl font-bold">
              {selectedProgressSubTypeCode && apiData?.sub_model 
                ? `${apiData.sub_model.interviews_attempted.toLocaleString()} (${apiData.sub_model.interviews_attempted_percentage}%)`
                : `${parseInt(mainDashboardData?.summary_tiles?.interviews_attempted || '0').toLocaleString()} (${mainDashboardData?.summary_tiles?.interviews_attempted_percentage || 0}%)`
              }
            </h4>
          </div>
        </div>

        {/* Interviews Achieved */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#016a59' }}>
          <div className="p-6 text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Interviews Achieved</h3>
            <h5 className="text-white text-sm mb-2">(Valid + Under QC)</h5>
            <h4 className="text-white text-2xl font-bold">
              {selectedProgressSubTypeCode && apiData?.sub_model 
                ? `${apiData.sub_model.valid_underqc_achived.toLocaleString()} (${apiData.sub_model.progress_completion_per}%)`
                : `${parseInt(mainDashboardData?.summary_tiles?.interviews_achieved || '0').toLocaleString()} (${mainDashboardData?.summary_tiles?.interviews_achieved_percentage || 0}%)`
              }
            </h4>
          </div>
        </div>
      </div>

      {/* Charts Section - Hide when in drill-down mode */}
      {!selectedProgressSubTypeCode && (
        <div className={`grid gap-3 ${selectedProgressType && selectedProgressSubType ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {/* Field Status - AC */}
        {(!selectedProgressType || selectedProgressType === 4) && (
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Field Status - AC
            </Heading>
            
            {/* Conditional Layout: Side-by-side for specific progress type, stacked for main dashboard */}
            {selectedProgressType && selectedProgressSubType ? (
              // Side-by-side layout for specific progress type pages
              <div className="flex h-[300px]">
                {/* Chart Section - Left Side */}
                <div className="flex-1 border-r border-gray-300">
                  <ReactECharts option={acChartOptions} style={{ height: '100%' }} />
                </div>
                
                {/* Legend Table Section - Right Side */}
                <div className="w-64 flex flex-col">
                  <table className="w-full border-collapse flex-1">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{acData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{acData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{acData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total ACs</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{acData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Stacked layout for main dashboard
              <>
                <ReactECharts option={acChartOptions} style={{ height: '400px' }} />
                
                {/* Legend Table */}
                <div className="">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{acData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{acData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{acData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(4, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total ACs</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{acData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Field Status - PC */}
        {(!selectedProgressType || selectedProgressType === 1) && (
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Field Status - PC
            </Heading>
            
            {/* Conditional Layout: Side-by-side for specific progress type, stacked for main dashboard */}
            {selectedProgressType && selectedProgressSubType ? (
              // Side-by-side layout for specific progress type pages
              <div className="flex h-[300px]">
                {/* Chart Section - Left Side */}
                <div className="flex-1 border-r border-gray-300">
                  <ReactECharts option={pcChartOptions} style={{ height: '100%' }} />
                </div>
                
                {/* Legend Table Section - Right Side */}
                <div className="w-64 flex flex-col">
                  <table className="w-full border-collapse flex-1">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{pcData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{pcData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{pcData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total PCs</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{pcData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Stacked layout for main dashboard
              <>
                <ReactECharts option={pcChartOptions} style={{ height: '400px' }} />
                
                {/* Legend Table */}
                <div className="">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{pcData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{pcData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{pcData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(1, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total PCs</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{pcData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Field Status - District */}
        {(!selectedProgressType || selectedProgressType === 2) && (
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Field Status - District
            </Heading>
            
            {/* Conditional Layout: Side-by-side for specific progress type, stacked for main dashboard */}
            {selectedProgressType && selectedProgressSubType ? (
              // Side-by-side layout for specific progress type pages
              <div className="flex h-[300px]">
                {/* Chart Section - Left Side */}
                <div className="flex-1 border-r border-gray-300">
                  <ReactECharts option={districtChartOptions} style={{ height: '100%' }} />
                </div>
                
                {/* Legend Table Section - Right Side */}
                <div className="w-64 flex flex-col">
                  <table className="w-full border-collapse flex-1">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{districtData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{districtData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{districtData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total Districts</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{districtData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Stacked layout for main dashboard
              <>
                <ReactECharts option={districtChartOptions} style={{ height: '400px' }} />
                
                {/* Legend Table */}
                <div className="">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{districtData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{districtData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{districtData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(2, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total Districts</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{districtData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Field Status - Zone */}
        {(!selectedProgressType || selectedProgressType === 3) && (
          <Card className="p-0 border border-black">
            <Heading level={3} align="center" className="mb-0">
              Field Status - Zone
            </Heading>
            
            {/* Conditional Layout: Side-by-side for specific progress type, stacked for main dashboard */}
            {selectedProgressType && selectedProgressSubType ? (
              // Side-by-side layout for specific progress type pages
              <div className="flex h-[300px]">
                {/* Chart Section - Left Side */}
                <div className="flex-1 border-r border-gray-300">
                  <ReactECharts option={zoneChartOptions} style={{ height: '100%' }} />
                </div>
                
                {/* Legend Table Section - Right Side */}
                <div className="w-64 flex flex-col">
                  <table className="w-full border-collapse flex-1">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{zoneData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{zoneData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{zoneData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total Zones</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{zoneData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Stacked layout for main dashboard
              <>
                <ReactECharts option={zoneChartOptions} style={{ height: '400px' }} />
                
                {/* Legend Table */}
                <div className="">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 1)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>Completed</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#54B054', color: 'white' }}>{zoneData.completed}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 2)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>In Progress</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#CFA407', color: 'white' }}>{zoneData.inProgress}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 3)}
                      >
                        <td className="border border-gray-300 p-2 text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>Yet to Begin</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm" style={{ backgroundColor: '#a3a9a9', color: 'white' }}>{zoneData.yetToBegin}</td>
                      </tr>
                      <tr 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleChartClick(3, 4)}
                      >
                        <td className="border border-gray-300 p-2 font-semibold text-sm bg-white">Total Zones</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-sm bg-white">{zoneData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}
        </div>
      )}

      {/* Detailed Table Section - Show when specific progress type is selected */}
      {selectedProgressType && selectedProgressSubType && (apiData?.data_provider || apiData?.subdata_provider) && (
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Heading level={3} className="text-xl font-semibold">
                {apiData.progress_label || 'Progress Details'}
              </Heading>
              <button
                onClick={selectedProgressSubTypeCode ? handleBackToParent : handleBackToMain}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {selectedProgressSubTypeCode ? `← ${apiData.sub_model?.ac_name || apiData.sub_model?.pc_name || apiData.sub_model?.district || apiData.sub_model?.region_name || 'Back'}` : '← Back to Progress'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {selectedProgressSubTypeCode ? (
                      // Drill-down Data - Show appropriate columns based on progress type
                      selectedProgressType === 4 ? (
                        // AC drill-down - Show PS Code and PS Name
                        <>
                          <th className="border border-gray-300 p-3 text-left font-semibold">PS Code</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">PS Name</th>
                        </>
                      ) : selectedProgressType === 3 ? (
                        // Zone drill-down - Show District Code and District Name
                        <>
                          <th className="border border-gray-300 p-3 text-left font-semibold">District Code</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">District Name</th>
                        </>
                      ) : (
                        // PC/District drill-down - Show AC Code, AC Name, PC Name
                        <>
                          <th className="border border-gray-300 p-3 text-left font-semibold">AC Code</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">AC Name</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">PC Name</th>
                        </>
                      )
                    ) : selectedProgressType === 1 ? (
                      // PC Progress - Show PC Code and PC Name
                      <>
                        <th className="border border-gray-300 p-3 text-left font-semibold">PC Code</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">PC Name</th>
                      </>
                    ) : selectedProgressType === 2 ? (
                      // District Progress - Show District Code and District Name
                      <>
                        <th className="border border-gray-300 p-3 text-left font-semibold">District Code</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">District Name</th>
                      </>
                    ) : selectedProgressType === 3 ? (
                      // Zone Progress - Show Region Code and Region Name
                      <>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Region Code</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Region Name</th>
                      </>
                    ) : (
                      // AC Progress - Show AC Code and AC Name
                      <>
                        <th className="border border-gray-300 p-3 text-left font-semibold">AC Code</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">AC Name</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">PC Name</th>
                      </>
                    )}
                    <th className="border border-gray-300 p-3 text-center font-semibold">Target</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Achieved</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">% Of Completion</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProgressSubTypeCode && apiData.subdata_provider ? (
                    // Drill-down Data
                    apiData.subdata_provider.map((item, index) => {
                      // Determine status based on progress_status or percentage completion
                      const getStatus = () => {
                        if (item.progress_status !== undefined) {
                          // Use progress_status if available
                          if (item.progress_status === 1) return { status: 'Completed', class: 'bg-green-100 text-green-800' };
                          if (item.progress_status === 2) return { status: 'In Progress', class: 'bg-yellow-100 text-yellow-800' };
                          return { status: 'Yet to Begin', class: 'bg-gray-100 text-gray-800' };
                        } else if (item.percentage_completion !== undefined) {
                          // Fallback to percentage completion for polling stations
                          if (item.percentage_completion >= 100) return { status: 'Completed', class: 'bg-green-100 text-green-800' };
                          if (item.percentage_completion >= 75) return { status: 'In Progress', class: 'bg-yellow-100 text-yellow-800' };
                          return { status: 'Yet to Begin', class: 'bg-gray-100 text-gray-800' };
                        }
                        return { status: 'Unknown', class: 'bg-gray-100 text-gray-800' };
                      };
                      
                      const statusInfo = getStatus();
                      const key = item.polling_station_no || item.ac_code || item.district_code || index;
                      const completionPercentage = item.percentage_completion || parseFloat(item.progress_completion_per || '0');
                      
                      return (
                        <tr key={key} className="hover:bg-gray-50">
                          {selectedProgressType === 4 ? (
                            // AC drill-down - Show PS Code and PS Name
                            <>
                              <td className="border border-gray-300 p-3">{item.polling_station_no}</td>
                              <td className="border border-gray-300 p-3">{item.polling_station_name}</td>
                            </>
                          ) : selectedProgressType === 3 ? (
                            // Zone drill-down - Show District Code and District Name
                            <>
                              <td className="border border-gray-300 p-3">{item.district_code}</td>
                              <td className="border border-gray-300 p-3">{item.district}</td>
                            </>
                          ) : (
                            // PC/District drill-down - Show AC Code, AC Name, PC Name
                            <>
                              <td className="border border-gray-300 p-3">{item.ac_code}</td>
                              <td className="border border-gray-300 p-3">{item.ac_name}</td>
                              <td className="border border-gray-300 p-3">{item.pc_name}</td>
                            </>
                          )}
                          <td className="border border-gray-300 p-3 text-center">{item.sample_target}</td>
                          <td className="border border-gray-300 p-3 text-center">{item.valid_underqc_achived}</td>
                          <td className="border border-gray-300 p-3 text-center">{completionPercentage}%</td>
                          <td className="border border-gray-300 p-3 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${statusInfo.class}`}>
                              {statusInfo.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    // Regular Data (AC, PC, District, Zone)
                    apiData.data_provider?.map((item, index) => (
                      <tr key={
                        selectedProgressType === 1 ? (item.pc_code || index) : 
                        selectedProgressType === 2 ? (item.district_code || index) : 
                        selectedProgressType === 3 ? (item.region_code || index) :
                        (item.ac_code || index)
                      } 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // Only allow drill-down if not already in drill-down mode
                        if (!selectedProgressSubTypeCode) {
                          const code = selectedProgressType === 1 ? item.pc_code?.toString() :
                                     selectedProgressType === 2 ? item.district_code?.toString() :
                                     selectedProgressType === 3 ? item.region_code?.toString() :
                                     item.ac_code?.toString();
                          if (code) {
                            handleDrillDown(selectedProgressType, selectedProgressSubType, code);
                          }
                        }
                      }}>
                        {selectedProgressType === 1 ? (
                          // PC Progress - Show PC Code and PC Name
                          <>
                            <td className="border border-gray-300 p-3">{item.pc_code}</td>
                            <td className="border border-gray-300 p-3">{item.pc_name}</td>
                          </>
                        ) : selectedProgressType === 2 ? (
                          // District Progress - Show District Code and District Name
                          <>
                            <td className="border border-gray-300 p-3">{item.district_code}</td>
                            <td className="border border-gray-300 p-3">{item.district}</td>
                          </>
                        ) : selectedProgressType === 3 ? (
                          // Zone Progress - Show Region Code and Region Name
                          <>
                            <td className="border border-gray-300 p-3">{item.region_code}</td>
                            <td className="border border-gray-300 p-3">{item.region_name}</td>
                          </>
                        ) : (
                          // AC Progress - Show AC Code, AC Name, and PC Name
                          <>
                            <td className="border border-gray-300 p-3">{item.ac_code}</td>
                            <td className="border border-gray-300 p-3">{item.ac_name}</td>
                            <td className="border border-gray-300 p-3">{item.pc_name}</td>
                          </>
                        )}
                        <td className="border border-gray-300 p-3 text-center">{item.sample_target}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.valid_underqc_achived}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.progress_completion_per}%</td>
                        <td className="border border-gray-300 p-3 text-center">
                          <span className={`px-2 py-1 rounded text-sm ${
                            item.progress_status === 1 ? 'bg-green-100 text-green-800' : 
                            item.progress_status === 2 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.progress_status === 1 ? 'Completed' : 
                             item.progress_status === 2 ? 'In Progress' : 'Yet to Begin'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
}
