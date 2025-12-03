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
import ProgressTable from '@/components/fieldwork-progress/ProgressTable';

interface FieldworkProgressData {
  sub_model?: {
    district_code?: number;
    district?: string;
    sample_target: number;
    interviews_attempted: number;
    interviews_attempted_percentage: string;
    valid_underqc_achived: number;
    progress_completion_per: string;
    progress_status: number;
  };
  subdata_provider?: Array<{
    ac_code?: number;
    ac_name?: string;
    pc_name?: string;
    sample_target: number;
    valid_underqc_achived: number;
    progress_completion_per?: string;
    progress_status?: number;
  }>;
}

export default function DistrictDrillDownPage() {
  const router = useRouter();
  const params = useParams();
  const progressSubType = parseInt(params.progress_sub_type as string);
  const districtCode = params.district_code as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<FieldworkProgressData | null>(null);

  useEffect(() => {
    if (progressSubType && districtCode) {
      fetchData();
    }
  }, [progressSubType, districtCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFDFieldworkProgress(2, 4, districtCode);
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch district drill-down data');
      }
    } catch (err: any) {
      console.error('Error fetching district drill-down data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (acCode: string) => {
    router.push(`/capi/fd/fieldwork-progress2/ac/${progressSubType}/${acCode}`);
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading district drill-down data...</Text>
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

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.push(`/capi/fd/fieldwork-progress2/district/${progressSubType}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to District Progress
        </Button>
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          {apiData.sub_model?.district || 'District Drill Down'}
        </Heading>
      </div>

      {/* Statistics Cards */}
      {apiData.sub_model && (
        <SummaryTiles
          targetSample={apiData.sub_model.sample_target}
          interviewsAttempted={apiData.sub_model.interviews_attempted}
          interviewsAttemptedPercentage={apiData.sub_model.interviews_attempted_percentage}
          interviewsAchieved={apiData.sub_model.valid_underqc_achived}
          interviewsAchievedPercentage={apiData.sub_model.progress_completion_per}
        />
      )}

      {/* Table Section */}
      {apiData.subdata_provider && apiData.subdata_provider.length > 0 && (
        <ProgressTable
          title="AC Progress"
          data={apiData.subdata_provider}
          progressType={2}
          progressSubType={progressSubType}
          backUrl={`/capi/fd/fieldwork-progress2/district/${progressSubType}`}
          backLabel={`Back to ${apiData.sub_model?.district || 'District Progress'}`}
          onRowClick={handleRowClick}
          columns={{
            code: { label: 'AC Code', field: 'ac_code' },
            name: { label: 'AC Name', field: 'ac_name' },
            pcName: { label: 'PC Name', field: 'pc_name' },
          }}
        />
      )}
    </Container>
  );
}

