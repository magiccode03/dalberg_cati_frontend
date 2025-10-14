'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService, GainLossData, GainLossZoneData } from '@/lib/api';


export default function GainAndLossesPage() {
  const [stateLevelData, setStateLevelData] = useState<GainLossData[]>([]);
  const [zoneData, setZoneData] = useState<GainLossZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<{
    page_name: string;
    page_title: string;
    total_interviews: number;
  } | null>(null);

  useEffect(() => {
    fetchGainAndLossesData();
  }, []);

  const fetchGainAndLossesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getGainAndLosses();
      
      if (response.success && response.data) {
        setStateLevelData(response.data.state_level.data);
        setZoneData(response.data.zone_breakdown);
        setPageInfo(response.data.page_info);
      } else {
        setError('Failed to fetch gain and losses data');
      }
    } catch (err) {
      console.error('Error fetching gain and losses data:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };


  const renderTable = (title: string, data: GainLossData[]) => {
    const getPartyName = (row: GainLossData) => row['2020_party'];
    const getPreference = (row: GainLossData) => row['2025_preference'];
    
    return (
    <Card className="p-6 mb-6">
      <div className="w-full">
        <h4 className="text-center mb-4 text-lg font-semibold">{title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-gray-300"></th>
                <th colSpan={12} className="text-center bg-blue-100 border border-gray-300 font-semibold">Upcoming Elections</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowSpan={12} style={{ width: '2%', writingMode: 'sideways-lr', textAlign: 'center' }} className="bg-blue-100 border border-gray-300 font-semibold">2020 AE</th>
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
              {data.map((row, index) => {
                const partyName = getPartyName(row);
                const preference = getPreference(row);
                return (
                <tr key={index} className="hover:bg-gray-50">
                  <th className="text-center font-medium border border-gray-300" style={{ width: '8%', color: 'black', backgroundColor: getPartyColor(partyName) }}>
                    {partyName}
                  </th>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.BJP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.JDU}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.HAMS}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.VSIP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference['LJP(RV)']}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.INC}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.RJD}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference['CPI(M)']}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.JSP}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.Others}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{preference.NWR}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
    );
  };

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
          <Heading level={2} className="text-2xl font-semibold text-gray-900">
            Gain and Losses
          </Heading>
          {pageInfo && (
            <Text className="text-sm text-gray-600 mt-1">
              Total Interviews: {pageInfo.total_interviews.toLocaleString()}
            </Text>
          )}
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <Text className="ml-2">Loading gain and losses data...</Text>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 mb-6">
          <div className="text-center">
            <Text className="text-red-600 mb-4">{error}</Text>
            <button
              onClick={fetchGainAndLossesData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* State Level Table */}
      {!loading && !error && stateLevelData.length > 0 && (
        renderTable('State Level', stateLevelData)
      )}

      {/* Zone Tables */}
      {!loading && !error && zoneData.map((zone, index) => (
        <div key={index}>
          {renderTable(`Zone - ${zone.zone_code} ${zone.zone_name}`, zone.data)}
        </div>
      ))}

      {/* Empty State */}
      {!loading && !error && stateLevelData.length === 0 && (
        <Card className="p-6 mb-6">
          <div className="text-center">
            <Text className="text-gray-600">No gain and losses data available</Text>
          </div>
        </Card>
      )}

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
      `}</style>
    </Container>
  );
}
