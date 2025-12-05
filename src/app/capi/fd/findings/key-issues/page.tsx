'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ChartDatum {
  name: string;
  y: number;
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
    data: [
      { name: 'Leadership of MB', y: 88.4, count: '8840' },
      { name: 'Local development', y: 26.1, count: '2610' },
      { name: 'Welfare schemes', y: 78.7, count: '7870' },
      { name: 'Law & order', y: 49.8, count: '4980' },
      { name: 'Other reasons', y: 17.0, count: '1700' },
    ],
    colors: ['#2da9d9', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B'],
  },
  top_reason_bjp: {
    title: 'Top reason for choosing BJP',
    data: [
      { name: 'Leadership of NM', y: 99.5, count: '9950' },
      { name: 'Corruption-free', y: 24.6, count: '2460' },
      { name: 'National security', y: 78.2, count: '7820' },
      { name: 'Economic growth', y: 54.1, count: '5410' },
      { name: 'Other reasons', y: 10.6, count: '1060' },
    ],
    colors: ['#F2994A', '#27AE60', '#2F80ED', '#BB6BD9', '#95A5A6'],
  },
  pressing_investment: {
    title: 'Pressing Issue – Investment',
    data: [
      { name: 'Job creation', y: 92.3, count: '9230' },
      { name: 'Industrial growth', y: 78.7, count: '7870' },
      { name: 'MSME support', y: 64.9, count: '6490' },
      { name: 'Infrastructure', y: 59.6, count: '5960' },
      { name: 'Other priorities', y: 44.5, count: '4450' },
    ],
    colors: ['#2F80ED', '#56CCF2', '#6FCF97', '#F2C94C', '#BDBDBD'],
  },
};

const buildBarOptions = (block: ChartBlock) => {
  const categories = block.data.map((item) => item.name);
  const values = block.data.map((item) => item.y);
  const colors = block.colors || [];

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        const d = block.data[p.dataIndex];
        return `${p.name}<br/>${p.value}%${d?.count ? `<br/>Count: ${d.count}` : ''}`;
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 0,
        interval: 0, // force showing every category label
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
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
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold',
        },
      },
    ],
  };
};

export default function KeyIssuesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-8">
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          Key Issues
        </Heading>
      </div>

      {/* First row: two charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {CHARTS.top_reason_aitc.title}
          </Heading>
          <ReactECharts option={buildBarOptions(CHARTS.top_reason_aitc)} style={{ height: '420px' }} />
        </Card>

        <Card className="p-6">
          <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {CHARTS.top_reason_bjp.title}
          </Heading>
          <ReactECharts option={buildBarOptions(CHARTS.top_reason_bjp)} style={{ height: '420px' }} />
        </Card>
      </div>

      {/* Second row: single chart */}
      <Card className="p-6">
        <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {CHARTS.pressing_investment.title}
        </Heading>
        <ReactECharts option={buildBarOptions(CHARTS.pressing_investment)} style={{ height: '420px' }} />
      </Card>
    </div>
  );
}

