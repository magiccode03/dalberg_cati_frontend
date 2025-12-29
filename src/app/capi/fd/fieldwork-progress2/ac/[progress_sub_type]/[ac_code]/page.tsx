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
    ac_code?: number;
    ac_name?: string;
    sample_target: number;
    interviews_attempted: number;
    interviews_attempted_percentage: string;
    valid_underqc_achived: number;
    progress_completion_per: string;
    progress_status: number;
  };
  subdata_provider?: Array<{
    polling_station_no?: string;
    polling_station_name?: string;
    sample_target: number;
    valid_underqc_achived: number;
    percentage_completion?: number;
    progress_completion_per?: string;
    progress_status?: number;
  }>;
}

export default function ACDrillDownPage() {
  const router = useRouter();
  const params = useParams();
  const progressSubType = parseInt(params.progress_sub_type as string);
  const acCode = params.ac_code as string;
  
  // Get district_code and zone_code from query parameters if coming from district drill-down
  const [districtCode, setDistrictCode] = useState<string | null>(null);
  const [zoneCode, setZoneCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<FieldworkProgressData | null>(null);

  useEffect(() => {
    // Get query parameters from URL
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const districtCodeParam = searchParams.get('district_code');
      const zoneCodeParam = searchParams.get('zone_code');
      if (districtCodeParam) {
        setDistrictCode(districtCodeParam);
      }
      if (zoneCodeParam) {
        setZoneCode(zoneCodeParam);
      }
    }
  }, []);

  useEffect(() => {
    if (progressSubType && acCode) {
      fetchData();
    }
  }, [progressSubType, acCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFDFieldworkProgress(4, 4, acCode);
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch AC drill-down data');
      }
    } catch (err: any) {
      console.error('Error fetching AC drill-down data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading AC drill-down data...</Text>
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
          onClick={() => {
            // If we came from district drill-down, go back to that page
            if (districtCode) {
              const queryParams = new URLSearchParams();
              if (zoneCode) {
                queryParams.append('zone_code', zoneCode);
              }
              router.push(`/capi/fd/fieldwork-progress2/district/${progressSubType}/${districtCode}${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
            } else {
              // Otherwise go to AC list page
              router.push(`/capi/fd/fieldwork-progress2/ac/${progressSubType}`);
            }
          }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {districtCode ? 'Back to District Progress' : 'Back to AC Progress'}
        </Button>
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          {apiData.sub_model?.ac_name || 'AC Drill Down'}
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
          title="PS Progress"
          data={apiData.subdata_provider}
          progressType={4}
          progressSubType={progressSubType}
          backUrl={districtCode ? `/capi/fd/fieldwork-progress2/district/${progressSubType}/${districtCode}${zoneCode ? `?zone_code=${zoneCode}` : ''}` : `/capi/fd/fieldwork-progress2/ac/${progressSubType}`}
          backLabel={districtCode ? 'Back to District Progress' : `Back to ${apiData.sub_model?.ac_name || 'AC Progress'}`}
          columns={{
            code: { label: 'PS Code', field: 'polling_station_no' },
            name: { label: 'PS Name', field: 'polling_station_name' },
          }}
        />
      )}
    </Container>
  );
}

