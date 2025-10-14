'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Download, Search } from 'lucide-react';
import { apiService, DetailedCasteResponse, DetailedCasteACData, DetailedCastePCData, DetailedCasteDistrictData, DetailedCasteZoneData } from '@/lib/api';

export default function CastePage() {
  const [acCode, setAcCode] = useState('');
  const [acName, setAcName] = useState('');
  const [casteNotMet, setCasteNotMet] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ACs');
  const [casteData, setCasteData] = useState<DetailedCasteACData[] | DetailedCastePCData[] | DetailedCasteDistrictData[] | DetailedCasteZoneData[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchCasteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map tab to progress_type
      const tabProgressMap: { [key: string]: number } = {
        'ACs': 4,
        'PCs': 1,
        'Districts': 2,
        'Zones': 3
      };
      
      const params: any = {
        progress_type: tabProgressMap[activeTab] || 4 // Default to ACs
      };
      
      // For ACs tab, use ac_code
      if (activeTab === 'ACs' && acCode) {
        params.ac_code = parseInt(acCode);
      }
      // For PCs tab, use pc_code
      else if (activeTab === 'PCs' && acCode) {
        params.pc_code = parseInt(acCode);
      }
      // For Districts tab, use district_code
      else if (activeTab === 'Districts' && acCode) {
        params.district_code = parseInt(acCode);
      }
      // For Zones tab, use region_code
      else if (activeTab === 'Zones' && acCode) {
        params.region_code = parseInt(acCode);
      }
      
      if (casteNotMet) params.caste_not_met = casteNotMet;
      
      const response = await apiService.getDetailedCasteData(params);
      
      if (response.success && response.data) {
        setCasteData(response.data.data_list);
        setTotalRecords(response.data.total_records);
      } else {
        setError('Failed to fetch caste data');
      }
    } catch (err) {
      setError('Error fetching caste data');
      console.error('Error fetching caste data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCasteData();
  }, [activeTab]); // Only re-fetch when tab changes

  // Summary Cards Data - using dynamic data for ACs and PCs
  const summaryCards = [
    { title: 'ACs', value: activeTab === 'ACs' ? totalRecords.toString() : '243', color: 'bg-green-600', progressType: '4' },
    { title: 'PCs', value: activeTab === 'PCs' ? totalRecords.toString() : '40', color: 'bg-green-600', progressType: '1' },
    { title: 'Districts', value: '38', color: 'bg-green-600', progressType: '2' },
    { title: 'Zones', value: '9', color: 'bg-green-600', progressType: '3' }
  ];

  // Note: The API only supports ACs (progress_type=4) currently
  // When the API is extended for PCs, Districts, and Zones, we'll update this function

  const getDifferenceStyle = (difference: number) => {
    if (difference >= 0) {
      return 'bg-green-600 text-white';
    } else {
      return 'bg-red-600 text-white';
    }
  };

  const getCurrentData = () => {
    // Currently ACs, PCs, Districts, and Zones are supported by the API
    if (activeTab === 'ACs' || activeTab === 'PCs' || activeTab === 'Districts' || activeTab === 'Zones') {
      return casteData;
    }
    return [];
  };

  const handleCardClick = (progressType: string) => {
    // Handle card click to change progress type
    const tabMap: { [key: string]: string } = {
      '1': 'PCs',
      '2': 'Districts', 
      '3': 'Zones',
      '4': 'ACs'
    };
    setActiveTab(tabMap[progressType] || 'ACs');
  };

  const handleDownload = () => {
    // Handle download functionality
    console.log('Downloading caste data...');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCasteData();
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={2} className="text-2xl font-semibold text-gray-900">
            Caste
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-center">Loading caste data...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={fetchCasteData}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white ${
              activeTab === card.title ? 'opacity-100' : 'opacity-50'
            } cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm`}
            onClick={() => handleCardClick(card.progressType)}
            data-progress-type={card.progressType}
          >
            <div className="p-6 text-center">
              <h2 className="text-white mb-2">{card.title}</h2>
              <h4 className="text-2xl font-bold text-white">{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Search Form */}
      <form id="Searchform" onSubmit={handleSearch}>
        <Card className="p-6">
          <div className="card-header pb-0 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {activeTab === 'PCs' ? 'PC Code' : 
                   activeTab === 'Districts' ? 'District Code' : 
                   activeTab === 'Zones' ? 'Zone Code' : 'AC Code'}
                </label>
                <Input
                  type="text"
                  placeholder={activeTab === 'PCs' ? 'Search by PC Code' : 
                             activeTab === 'Districts' ? 'Search by District Code' : 
                             activeTab === 'Zones' ? 'Search by Zone Code' : 
                             'Search by AC Code'}
                  value={acCode}
                  onChange={(e) => setAcCode(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {activeTab === 'PCs' ? 'PC Name' : 
                   activeTab === 'Districts' ? 'District Name' : 
                   activeTab === 'Zones' ? 'Zone Name' : 'AC Name'}
                </label>
                <Input
                  type="text"
                  placeholder={activeTab === 'PCs' ? 'Search by PC Name' : 
                             activeTab === 'Districts' ? 'Search by District Name' : 
                             activeTab === 'Zones' ? 'Search by Zone Name' : 
                             'Search by AC Name'}
                  value={acName}
                  onChange={(e) => setAcName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {(activeTab === 'Districts' || activeTab === 'Zones') ? 'Caste not Meet' : 'Caste not Met'}
              </label>
                <SelectDropdown
                  value={casteNotMet}
                  onChange={(value) => setCasteNotMet(Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: '', label: 'All ACs Caste' },
                    { value: '1', label: 'ACs Where First Caste Not Met' },
                    { value: '2', label: 'ACs Where Second Caste Not Met' },
                    { value: '3', label: 'ACs Where Third Caste Not Met' }
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="card-body">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={handleDownload}
                className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
            <div className="table-responsive">
              <Table className="table table-bordered" id="acreport" style={{ width: '100%', tableLayout: 'fixed' }}>
                <tbody>
                  {getCurrentData().map((row, index) => (
                    <React.Fragment key={index}>
                      {/* Caste Headers */}
                      <tr>
                        <td className="bg-gray-200 border-t-2 border-black"></td>
                        <td className="bg-gray-200 border-t-2 border-black"></td>
                        <td className="bg-gray-200 border-t-2 border-black"></td>
                        {row.castes.slice(0, activeTab === 'ACs' ? 4 : activeTab === 'Zones' ? 8 : 6).map((caste, casteIndex) => (
                          <th key={casteIndex} className="text-center bg-gray-200 border-t-2 border-black">
                            {caste.caste_name}
                          </th>
                        ))}
                      </tr>
                      
                      {/* AC/PC/District/Zone Info */}
                      <tr>
                        <td rowSpan={4} className="font-semibold text-center">
                          {activeTab === 'ACs' ? 
                            `${(row as DetailedCasteACData).ac_name} (${(row as DetailedCasteACData).ac_code})` :
                            activeTab === 'PCs' ?
                            `${(row as DetailedCastePCData).pc_name} (${(row as DetailedCastePCData).pc_code})${(row as DetailedCastePCData).district_name ? ` - ${(row as DetailedCastePCData).district_name}` : ''}` :
                            activeTab === 'Districts' ?
                            `${(row as DetailedCasteDistrictData).district_name} (${(row as DetailedCasteDistrictData).district_code})` :
                            `${(row as DetailedCasteZoneData).region_name} (${(row as DetailedCasteZoneData).region_code})`
                          }
                        </td>
                        <td rowSpan={4} className="font-semibold text-center">
                          {row.valid_underqc_achived}/{row.sample_target}
                        </td>
                      </tr>
                      
                      {/* Population % */}
                      <tr>
                        <th className="text-center">Population %</th>
                        {row.castes.slice(0, activeTab === 'ACs' ? 4 : activeTab === 'Zones' ? 8 : 6).map((caste, casteIndex) => (
                          <td key={casteIndex} className="text-center">
                            {caste.caste}%
                          </td>
                        ))}
                      </tr>
                      
                      {/* Achievement % */}
                      <tr>
                        <th className="text-center">Achievement %</th>
                        {row.castes.slice(0, activeTab === 'ACs' ? 4 : activeTab === 'Zones' ? 8 : 6).map((caste, casteIndex) => (
                          <td key={casteIndex} className="text-center">
                            {caste.achievement}%
                          </td>
                        ))}
                      </tr>
                      
                      {/* Difference */}
                      <tr>
                        <th className="text-center">Difference</th>
                        {row.castes.slice(0, activeTab === 'ACs' ? 4 : activeTab === 'Zones' ? 8 : 6).map((caste, casteIndex) => (
                          <td key={casteIndex} className={`text-center ${getDifferenceStyle(caste.difference)}`}>
                            {caste.difference > 0 ? '+' : ''}{caste.difference}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))}
                  
                  {getCurrentData().length === 0 && !loading && (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-gray-500">
                        {(activeTab === 'ACs' || activeTab === 'PCs' || activeTab === 'Districts' || activeTab === 'Zones') ? 'No caste data available' : 'API support for this tab is coming soon'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>
      </form>

      <style jsx>{`
        .bg-gray-200 {
          background-color: #d6d8d8 !important;
        }
        .border-t-2 {
          border-top: 2px solid black !important;
        }
        .main-container {
          min-height: 100vh;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th,
        .table td {
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          text-align: center;
        }
        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
      `}</style>
    </Container>
  );
}
