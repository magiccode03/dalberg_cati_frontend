'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Heading from '@/components/ui/Heading';
import { Loader2 } from 'lucide-react';
import Text from '@/components/ui/Text';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { apiService } from '@/lib/api-service';
import SummaryTiles from '@/components/fieldwork-progress/SummaryTiles';
import ProgressChart from '@/components/fieldwork-progress/ProgressChart';
import ProgressTable from '@/components/fieldwork-progress/ProgressTable';

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
    pc_progress?: {
      completed: number;
      in_progress: number;
      yet_to_begin: number;
      total: number;
    };
  };
  data_provider?: Array<{
    pc_code?: number;
    pc_name?: string;
    sample_target: number;
    valid_underqc_achived: number;
    progress_completion_per: string;
    progress_status: number;
  }>;
}

export default function PCProgressPage() {
  const router = useRouter();
  const params = useParams();
  const progressSubType = parseInt(params.progress_sub_type as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<FieldworkProgressData | null>(null);

  useEffect(() => {
    if (progressSubType) {
      fetchData();
    }
  }, [progressSubType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFDFieldworkProgress(1, progressSubType);
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch PC progress data');
      }
    } catch (err: any) {
      console.error('Error fetching PC progress data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleChartClick = (progressType: number, progressSubType: number) => {
    router.push(`/capi/fd/fieldwork-progress2/pc/${progressSubType}`);
  };

  const handleRowClick = (pcCode: string) => {
    router.push(`/capi/fd/fieldwork-progress2/pc/${progressSubType}/${pcCode}`);
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading PC progress data...</Text>
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

  const pcData = {
    completed: apiData.progress_charts?.pc_progress?.completed || 0,
    inProgress: apiData.progress_charts?.pc_progress?.in_progress || 0,
    yetToBegin: apiData.progress_charts?.pc_progress?.yet_to_begin || 0,
    total: apiData.progress_charts?.pc_progress?.total || 0
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/capi/fd/fieldwork-progress2')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          {apiData.progress_label || 'PC Progress'}
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

      {/* Chart Section */}
      <div className="mb-8">
        <ProgressChart
          title="Field Status - PC"
          data={pcData}
          onChartClick={handleChartClick}
          progressType={1}
          isDashboard={false}
        />
      </div>

      {/* Table Section */}
      {apiData.data_provider && apiData.data_provider.length > 0 && (
        <ProgressTable
          title="PC Progress Details"
          data={apiData.data_provider}
          progressType={1}
          progressSubType={progressSubType}
          backUrl="/capi/fd/fieldwork-progress2"
          backLabel="Back to Dashboard"
          onRowClick={handleRowClick}
          columns={{
            code: { label: 'PC Code', field: 'pc_code' },
            name: { label: 'PC Name', field: 'pc_name' },
          }}
        />
      )}
    </Container>
  );
}

