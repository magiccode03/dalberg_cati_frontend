'use client';

import { useAuth } from '@/contexts/AuthContext';
import Breadcrumb from '@/components/ui/Breadcrumb';
import VoteShareChart from '@/components/charts/VoteShareChart';
import ProgressChart from '@/components/charts/ProgressChart';
import DemographicsChart from '@/components/charts/DemographicsChart';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import Card from '@/components/ui/Card';
import { generateVoteShareData, generateProgressData } from '@/lib/mock-data';

export default function AnalysisPage() {
  const { user } = useAuth();
  // Use mock data for now instead of Redux state
  const voteShareData = generateVoteShareData();
  const progressData = generateProgressData();

  const breadcrumbItems = [
    { label: 'Analysis', active: true }
  ];

  // Mock data for demonstration
  const mockVoteShareData = generateVoteShareData();
  const mockProgressData = generateProgressData();

  // Mock demographic data
  const demographicData = [
    { category: '18-25', value: 450, color: '#3B82F6' },
    { category: '26-35', value: 520, color: '#10B981' },
    { category: '36-45', value: 380, color: '#F59E0B' },
    { category: '46-55', value: 280, color: '#EF4444' },
    { category: '55+', value: 140, color: '#8B5CF6' }
  ];

  // Mock time series data
  const timeSeriesData = [
    {
      name: 'Interviews Conducted',
      data: [120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400],
      color: '#3B82F6'
    },
    {
      name: 'Valid Interviews',
      data: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320],
      color: '#10B981'
    }
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Mock bar chart data
  const barChartData = [
    {
      name: 'District A',
      data: [120, 150, 180, 200],
      color: '#3B82F6'
    },
    {
      name: 'District B',
      data: [100, 130, 160, 190],
      color: '#10B981'
    },
    {
      name: 'District C',
      data: [80, 110, 140, 170],
      color: '#F59E0B'
    }
  ];

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive election data analysis and insights
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vote Share Chart */}
        <VoteShareChart
          data={mockVoteShareData}
          title="Vote Share Analysis"
          height={400}
        />

        {/* Progress Chart */}
        <ProgressChart
          data={mockProgressData}
          title="Fieldwork Progress"
          height={400}
        />

        {/* Demographics Chart - Age Wise */}
        <DemographicsChart
          data={demographicData}
          title="Age-wise Distribution"
          type="bar"
          height={400}
        />

        {/* Demographics Chart - Gender Wise */}
        <DemographicsChart
          data={[
            { category: 'Male', value: 950, color: '#3B82F6' },
            { category: 'Female', value: 820, color: '#EC4899' }
          ]}
          title="Gender Distribution"
          type="pie"
          height={400}
        />

        {/* Time Series Chart */}
        <div className="lg:col-span-2">
          <LineChart
            data={timeSeriesData}
            xAxisData={months}
            title="Interview Progress Over Time"
            height={400}
            smooth={true}
            area={true}
          />
        </div>

        {/* District-wise Comparison */}
        <div className="lg:col-span-2">
          <BarChart
            data={barChartData}
            xAxisData={quarters}
            title="District-wise Performance by Quarter"
            height={400}
            stacked={false}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">105,772</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Interviews</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">47.3%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completion Rate</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">657</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Field Staff</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">52.7%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rejection Rate</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
