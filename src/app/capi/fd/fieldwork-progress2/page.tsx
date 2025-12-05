'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Heading from '@/components/ui/Heading';
import { Loader2 } from 'lucide-react';
import Text from '@/components/ui/Text';
import Card from '@/components/ui/Card';
import { apiService } from '@/lib/api-service';
import SummaryTiles from '@/components/fieldwork-progress/SummaryTiles';
import ProgressChart from '@/components/fieldwork-progress/ProgressChart';

interface ProgressData {
  completed: number;
  in_progress: number;
  yet_to_begin: number;
  total: number;
}

interface FieldworkProgressData {
  progress_label?: string;
  summary_tiles?: {
    target_sample: string;
    interviews_attempted: string;
    interviews_attempted_percentage: number;
    interviews_achieved: string;
    interviews_achieved_percentage: number;
  };
  progress_charts?: {
    ac_progress?: ProgressData;
    pc_progress?: ProgressData;
    district_progress?: ProgressData;
    zone_progress?: ProgressData;
  };
}

export default function FieldworkProgress2DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<FieldworkProgressData | null>(null);

  useEffect(() => {
    fetchFieldworkProgressData();
  }, []);

  const fetchFieldworkProgressData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFDFieldworkProgress();
      
      if (response.success && response.data) {
        setApiData(response.data);
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

  const handleChartClick = (progressType: number, progressSubType: number) => {
    // Navigate to appropriate page based on progress type
    const routes: Record<number, string> = {
      1: 'pc',
      2: 'district',
      3: 'zone',
      4: 'ac',
    };
    
    const route = routes[progressType];
    if (route) {
      router.push(`/capi/fd/fieldwork-progress2/${route}/${progressSubType}`);
    }
  };

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

  const acData = {
    completed: apiData.progress_charts?.ac_progress?.completed || 0,
    inProgress: apiData.progress_charts?.ac_progress?.in_progress || 0,
    yetToBegin: apiData.progress_charts?.ac_progress?.yet_to_begin || 0,
    total: apiData.progress_charts?.ac_progress?.total || 0
  };

  const pcData = {
    completed: apiData.progress_charts?.pc_progress?.completed || 0,
    inProgress: apiData.progress_charts?.pc_progress?.in_progress || 0,
    yetToBegin: apiData.progress_charts?.pc_progress?.yet_to_begin || 0,
    total: apiData.progress_charts?.pc_progress?.total || 0
  };

  const districtData = {
    completed: apiData.progress_charts?.district_progress?.completed || 0,
    inProgress: apiData.progress_charts?.district_progress?.in_progress || 0,
    yetToBegin: apiData.progress_charts?.district_progress?.yet_to_begin || 0,
    total: apiData.progress_charts?.district_progress?.total || 0
  };

  const zoneData = {
    completed: apiData.progress_charts?.zone_progress?.completed || 0,
    inProgress: apiData.progress_charts?.zone_progress?.in_progress || 0,
    yetToBegin: apiData.progress_charts?.zone_progress?.yet_to_begin || 0,
    total: apiData.progress_charts?.zone_progress?.total || 0
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          {apiData.progress_label || 'Fieldwork Progress'}
        </Heading>
      </div>

      {/* Statistics Cards */}
      <SummaryTiles
        targetSample={parseInt(apiData.summary_tiles?.target_sample || '0')}
        interviewsAttempted={parseInt(apiData.summary_tiles?.interviews_attempted || '0')}
        interviewsAttemptedPercentage={apiData.summary_tiles?.interviews_attempted_percentage || 0}
        interviewsAchieved={parseInt(apiData.summary_tiles?.interviews_achieved || '0')}
        interviewsAchievedPercentage={apiData.summary_tiles?.interviews_achieved_percentage || 0}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <ProgressChart
          title="Field Status - AC"
          data={acData}
          onChartClick={handleChartClick}
          progressType={4}
          isDashboard={true}
        />
        
        <ProgressChart
          title="Field Status - PC"
          data={pcData}
          onChartClick={handleChartClick}
          progressType={1}
          isDashboard={true}
        />
        
        <ProgressChart
          title="Field Status - District"
          data={districtData}
          onChartClick={handleChartClick}
          progressType={2}
          isDashboard={true}
        />
        
        <ProgressChart
          title="Field Status - Zone"
          data={zoneData}
          onChartClick={handleChartClick}
          progressType={3}
          isDashboard={true}
        />
      </div>
    </Container>
  );
}
