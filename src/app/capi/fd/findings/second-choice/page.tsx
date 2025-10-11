'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface SecondChoiceBreakdown {
  BJP: number;
  JDU: number;
  HAMS: number;
  VSIP: number;
  "LJP(RV)": number;
  INC: number;
  RJD: number;
  "CPI(M)": number;
  JSP: number;
  Others: number;
  NWR: number;
}

interface SecondChoiceData {
  first_choice: string;
  second_choice_breakdown: SecondChoiceBreakdown;
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
    <Card className="p-6 mb-6">
      <div className="w-full">
        <h4 className="text-center mb-4 text-lg font-semibold">{title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-gray-300"></th>
                <th colSpan={12} className="text-center bg-blue-100 border border-gray-300 font-semibold">Second Choice Preferences</th>
              </tr>
            </thead>
            <tbody>
                     <tr>
                       <th rowSpan={12} style={{ width: '2%', writingMode: 'sideways-lr', textAlign: 'center' }} className="bg-blue-100 border border-gray-300 font-semibold">Upcoming Elections</th>
                <th className="bg-blue-100 border border-gray-300 font-semibold">Party Name</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#e97132' }}>BJP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#92d050' }}>JDU</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#dce119' }}>HAMS</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'white', backgroundColor: '#275317' }}>VSIP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'white', backgroundColor: '#7030a0' }}>LJP(RV)</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#00b0f0' }}>INC</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'white', backgroundColor: '#548235' }}>RJD</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#ff0000' }}>CPI(M)</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#ffff00' }}>JSP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#aeaeae' }}>Others</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#aeaeae' }}>NWR</th>
              </tr>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <th className="text-center font-medium border border-gray-300" style={{ width: '8%', color: 'black', backgroundColor: getPartyColor(row.first_choice) }}>
                    {row.first_choice}
                  </th>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.BJP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.JDU}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.HAMS}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.VSIP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown["LJP(RV)"]}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.INC}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.RJD}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown["CPI(M)"]}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.JSP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.Others}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.second_choice_breakdown.NWR}</td>
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
      'BJP': '#e97132',
      'JDU': '#92d050',
      'HAMS': '#dce119',
      'VSIP': '#275317',
      'LJP(RV)': '#7030a0',
      'INC': '#00b0f0',
      'RJD': '#548235',
      'CPI(M)': '#ff0000',
      'JSP': '#ffff00',
      'Others': '#aeaeae',
      'NWR': '#aeaeae',
    };
    return colors[party] || '#aeaeae';
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            {apiData?.page_info.page_title || 'Second Choice'}
          </Heading>
          {apiData?.page_info.total_interviews && (
            <Text className="text-sm text-gray-600 mt-1">
              Total Interviews: {apiData.page_info.total_interviews.toLocaleString()}
            </Text>
          )}
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
        <div key={index}>
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
