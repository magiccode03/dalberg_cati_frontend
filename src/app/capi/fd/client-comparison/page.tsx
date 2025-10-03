'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Heading from '@/components/ui/Heading';

interface ConstituencyData {
  acCode: number;
  acName: string;
  targetSample: number;
  validClient: number;
  validPMT: number;
  difference: number;
}

export default function ClientComparisonPage() {
  const constituencyData: ConstituencyData[] = [
    { acCode: 1, acName: 'Valmiki Nagar', targetSample: 300, validClient: 323, validPMT: 310, difference: -13 },
    { acCode: 2, acName: 'Ramnagar (SC)', targetSample: 300, validClient: 341, validPMT: 346, difference: 5 },
    { acCode: 3, acName: 'Narkatiaganj', targetSample: 300, validClient: 281, validPMT: 315, difference: 34 },
  ];

  const getDifferenceColor = (difference: number): string => {
    if (difference <= 0) return '#b4eed4'; // Good - green
    if (difference <= 20) return '#f5bcbc'; // Low Alert - light red
    return '#ff5757'; // High Alert - red
  };

  const getDifferenceIcon = (difference: number): string => {
    if (difference <= 0) return '🟢'; // Good
    if (difference <= 20) return '🟡'; // Low Alert
    return '🔴'; // High Alert
  };

  const totalTargetSample = constituencyData.reduce((sum, item) => sum + item.targetSample, 0);
  const totalValidClient = constituencyData.reduce((sum, item) => sum + item.validClient, 0);
  const totalValidPMT = constituencyData.reduce((sum, item) => sum + item.validPMT, 0);
  const totalDifference = totalValidPMT - totalValidClient;

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Client Comparison
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-purple-600 text-white rounded-lg shadow-lg">
          <div className="p-6 text-center">
            <h3 className="text-white text-xl font-semibold mb-0">
              Interviews Valid (Client) - {totalValidClient.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-green-600 text-white rounded-lg shadow-lg">
          <div className="p-6 text-center">
            <h3 className="text-white text-xl font-semibold mb-0">
              Interviews Valid (PMT) - {totalValidPMT.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              High Alert
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-200 rounded-full mr-2"></span>
              Low Alert
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-200 rounded-full mr-2"></span>
              Good
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-gray-300 font-semibold text-center py-3" style={{ width: '10%' }}>
                  AC Code
                </th>
                <th className="bg-blue-100 border border-gray-300 font-semibold text-left py-3" style={{ width: '10%' }}>
                  AC Name
                </th>
                <th className="bg-blue-100 border border-gray-300 font-semibold text-center py-3" style={{ width: '10%' }}>
                  Target Sample
                </th>
                <th className="bg-blue-100 border border-gray-300 font-semibold text-center py-3" style={{ width: '10%' }}>
                  Valid (Client)
                </th>
                <th className="bg-blue-100 border border-gray-300 font-semibold text-center py-3" style={{ width: '10%' }}>
                  Valid (PMT)
                </th>
                <th className="bg-blue-100 border border-gray-300 font-semibold text-center py-3" style={{ width: '10%' }}>
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              {constituencyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="text-center font-medium border border-gray-300 py-2">{item.acCode}</td>
                  <td className="text-left font-medium border border-gray-300 py-2">{item.acName}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{item.targetSample}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{item.validClient}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{item.validPMT}</td>
                  <td 
                    className="text-center font-medium border border-gray-300 py-2"
                    style={{ backgroundColor: getDifferenceColor(item.difference) }}
                  >
                    {item.difference}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="text-center border border-gray-300 py-2"></td>
                <td className="text-left border border-gray-300 py-2">Total</td>
                <td className="text-center border border-gray-300 py-2">{totalTargetSample.toLocaleString()}</td>
                <td className="text-center border border-gray-300 py-2">{totalValidClient.toLocaleString()}</td>
                <td className="text-center border border-gray-300 py-2">{totalValidPMT.toLocaleString()}</td>
                <td className="text-center border border-gray-300 py-2">{totalDifference.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
      `}</style>
    </Container>
  );
}
