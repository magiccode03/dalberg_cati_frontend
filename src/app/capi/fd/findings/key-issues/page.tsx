'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api-service';
import SelectDropdown from '@/components/ui/SelectDropdown';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ChartDatum {
  name: string;
  y?: number;
  percentage?: number;
  count?: string | number;
}

interface ChartBlock {
  title: string;
  data: ChartDatum[];
  colors?: string[];
}

const CHARTS: { [key: string]: ChartBlock } = {
  top_reason_aitc: {
    title: 'Top reason for choosing AITC',
    data: [],
    colors: [],
  },
  top_reason_bjp: {
    title: 'Top reason for choosing BJP',
    data: [],
    colors: [],
  },
  pressing_investment: {
    title: 'Pressing Issue – Investment',
    data: [],
    colors: [],
  },
};

const buildBarOptions = (block: ChartBlock) => {
  const categories = block.data.map((item) => item.name);
  const values = block.data.map((item) => item.y || item.percentage || 0);
  const colors = block.colors || [];

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        const d = block.data[p.dataIndex];
        return `${p.name}<br/>${p.value}%${d?.count ? `<br/>Total: ${d.count}` : ''}`;
      },
    },
    xAxis: {
      type: 'value',
      max: 100,
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        width: 250,
        overflow: 'truncate',
      },
    },
    grid: {
      left: 280,
      right: 40,
      top: 20,
      bottom: 40,
    },
    series: [
      {
        name: block.title,
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: { color: colors[index] || '#2da9d9' },
        })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
        },
      },
    ],
  };
};

export default function KeyIssuesPage() {
  const [charts, setCharts] = useState<{ [key: string]: ChartBlock }>(CHARTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acList, setAcList] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedAc, setSelectedAc] = useState<string>('');
  const [acLoading, setAcLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch AITC data
        const aitcResponse = await apiService.getTopReasonsForParty('q11', 'top_reasons_for_choosing_aitc');
        
        // Fetch BJP data
        const bjpResponse = await apiService.getTopReasonsForParty('q12', 'top_reasons_for_choosing_bjp');

        // Fetch Investment data
        const investmentResponse = await apiService.getTopReasonsForParty('q13', 'pressing_issue_investment');

        const updatedCharts = { ...CHARTS };

        if (aitcResponse.success && aitcResponse.data) {
          const transformedAITCData = aitcResponse.data.data.map((item) => ({
            name: item.name,
            percentage: item.percentage,
            y: item.percentage,
            count: item.count,
          }));

          updatedCharts.top_reason_aitc = {
            ...updatedCharts.top_reason_aitc,
            data: transformedAITCData,
            colors: aitcResponse.data?.colors || [],
          };
        }

        if (bjpResponse.success && bjpResponse.data) {
          const transformedBJPData = bjpResponse.data.data.map((item) => ({
            name: item.name,
            percentage: item.percentage,
            y: item.percentage,
            count: item.count,
          }));

          updatedCharts.top_reason_bjp = {
            ...updatedCharts.top_reason_bjp,
            data: transformedBJPData,
            colors: bjpResponse.data?.colors || [],
          };
        }

        if (investmentResponse.success && investmentResponse.data) {
          const transformedInvestmentData = investmentResponse.data.data.map((item) => ({
            name: item.name,
            percentage: item.percentage,
            y: item.percentage,
            count: item.count,
          }));

          updatedCharts.pressing_investment = {
            ...updatedCharts.pressing_investment,
            data: transformedInvestmentData,
            colors: investmentResponse.data?.colors || [],
          };
        }

        setCharts(updatedCharts);
        
        // Fetch AC list
        fetchAcList();
      } catch (err: unknown) {
        console.error('Error fetching chart data:', err);
        setError('Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    const fetchAcList = async () => {
      try {
        setAcLoading(true);
        const response = await apiService.getAcList();

        if (response.success && response.data) {
          const options = [
            { value: '', label: 'All ACs' }, // Add "All ACs" option
            ...Object.entries(response.data).map(([code, name]) => ({
              value: code,
              label: `${code} - ${name}`,
            })),
          ];
          setAcList(options);
          if (options.length > 0) {
            setSelectedAc(''); // Set default to "All ACs"
          }
        }
      } catch (err) {
        console.error('Error fetching AC list:', err);
      } finally {
        setAcLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Update chart when selected AC changes
  useEffect(() => {
    const updateInvestmentChart = async () => {
      try {
        // Pass selectedAc only if it's not empty (empty means "All ACs")
        const investmentResponse = await apiService.getTopReasonsForParty(
          'q13',
          'pressing_issue_investment',
          selectedAc || undefined
        );

        if (investmentResponse.success && investmentResponse.data) {
          const transformedInvestmentData = investmentResponse.data.data.map((item) => ({
            name: item.name,
            percentage: item.percentage,
            y: item.percentage,
            count: item.count,
          }));

          setCharts((prevCharts) => ({
            ...prevCharts,
            pressing_investment: {
              ...prevCharts.pressing_investment,
              data: transformedInvestmentData,
              colors: investmentResponse.data?.colors || [],
            },
          }));
        }
      } catch (err) {
        console.error('Error updating investment chart:', err);
      }
    };

    updateInvestmentChart();
  }, [selectedAc]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-8">
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          Key Issues
        </Heading>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading data...</Text>
          </div>
        </div>
      )}

      {error && (
        <Card className="p-6 mb-6 bg-red-50 dark:bg-red-900">
          <Text className="text-red-600 dark:text-red-200">{error}</Text>
        </Card>
      )}

      {!loading && (
        <>
          {/* First row: two charts side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {charts.top_reason_aitc.title}
              </Heading>
              <ReactECharts option={buildBarOptions(charts.top_reason_aitc)} style={{ height: '550px' }} />
            </Card>

            <Card>
              <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {charts.top_reason_bjp.title}
              </Heading>
              <ReactECharts option={buildBarOptions(charts.top_reason_bjp)} style={{ height: '550px' }} />
            </Card>
          </div>

          {/* Second row: single chart */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                {charts.pressing_investment.title}
              </Heading>
              {acList.length > 0 && (
                <div className="mt-4 lg:mt-0 w-full lg:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select AC
                  </label>
                  <SelectDropdown
                    options={acList}
                    value={selectedAc}
                    onChange={(value: string | string[]) => setSelectedAc(Array.isArray(value) ? value[0] : value)}
                    placeholder={acLoading ? "Loading AC list..." : "All ACs"}
                    disabled={acLoading}
                  />
                </div>
              )}
            </div>
            <ReactECharts option={buildBarOptions(charts.pressing_investment)} style={{ height: '550px' }} />
          </Card>
        </>
      )}
    </div>
  );
}

