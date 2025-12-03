'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface SecondChoiceBreakdown {
  AITC: number;
  BJP: number;
  INC: number;
  "Left Front": number;
  Independent: number;
  AJSU: number;
  Others: number;
  NOTA: number;
}

interface SecondChoiceData {
  upcoming: string;
  second_choice: SecondChoiceBreakdown;
}

interface ZoneData {
  zone_code: number;
  zone_name: string;
  data: SecondChoiceData[];
}

interface ApiResponse {
  page_info: {
    page_name: string;
    page_title: string;
    total_interviews: number;
  };
  state_level: {
    title: string;
    data: SecondChoiceData[];
  };
  zone_breakdown: ZoneData[];
  zone_pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export default function SecondChoicePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);

  // Fetch data from API
  const fetchSecondChoiceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSecondChoiceData();
      
      if (response.success && response.data) {
        setApiData(response.data);
      } else {
        setError('Failed to fetch second choice data');
      }
    } catch (err: any) {
      console.error('Error fetching second choice data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecondChoiceData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading second choice data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
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
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-gray-600">No data available</Text>
          </Card>
        </div>
      </Container>
    );
  }

  const renderTable = (title: string, data: SecondChoiceData[]) => (
    <Card className="mb-6">
      <div className="w-full">
        <h4 className="text-center mb-4 text-lg font-semibold">{title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-gray-300"></th>
                <th colSpan={9} className="text-center bg-blue-100 border border-gray-300 font-semibold">Second Choice Preferences</th>
              </tr>
            </thead>
            <tbody>
                     <tr>
                       <th rowSpan={9} style={{ width: '2%', writingMode: 'sideways-lr', textAlign: 'center' }} className="bg-blue-100 border border-gray-300 font-semibold">Upcoming Elections</th>
                <th className="bg-blue-100 border border-gray-300 font-semibold">Party Name</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#6189e6ff' }}>AITC</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#e97132' }}>BJP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#00b0f0' }}>INC</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#ff0000' }}>Left Front</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#92d050' }}>Independent</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#dce119' }}>AJSU</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#aeaeae' }}>Others</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '10%', color: 'black', backgroundColor: '#aeaeae' }}>NOTA</th>
              </tr>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <th className="text-center font-medium border border-gray-300" style={{ width: '8%', color: 'black', backgroundColor: getPartyColor(row.upcoming) }}>
                    {row.upcoming}
                  </th>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.AITC}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.BJP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.INC}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice['Left Front']}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.Independent}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.AJSU}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.Others}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice.NOTA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );

  const getPartyColor = (party: string): string => {
    const colors: { [key: string]: string } = {
      'AITC': '#6189e6ff',
      'BJP': '#e97132',
      'INC': '#00b0f0',
      'Left Front': '#ff0000',
      'Independent': '#92d050',
      'AJSU': '#dce119',
      'Others': '#aeaeae',
      'NOTA': '#aeaeae',
    };
    return colors[party] || '#aeaeae';
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={2} className="text-2xl font-semibold text-gray-900">
            {apiData?.page_info.page_title || 'Second Choice'}
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* State Level Table */}
      {apiData?.state_level && renderTable(apiData.state_level.title, apiData.state_level.data)}

      {/* Zone Tables */}
      {apiData?.zone_breakdown.map((zone, index) => (
        <div key={zone.zone_code || `zone-${index}`}>
          {renderTable(`Zone - ${zone.zone_code} ${zone.zone_name}`, zone.data)}
        </div>
      ))}

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
      `}</style>
    </Container>
  );
}
