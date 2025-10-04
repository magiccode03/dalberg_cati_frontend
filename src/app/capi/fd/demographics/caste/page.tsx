'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Download, Search } from 'lucide-react';

interface CasteData {
  acName: string;
  sample: string;
  casteData: {
    caste1: { name: string; population: number; achievement: number; difference: number };
    caste2: { name: string; population: number; achievement: number; difference: number };
    caste3: { name: string; population: number; achievement: number; difference: number };
    caste4: { name: string; population: number; achievement: number; difference: number };
  };
}

export default function CastePage() {
  const [acCode, setAcCode] = useState('');
  const [acName, setAcName] = useState('');
  const [casteNotMet, setCasteNotMet] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ACs');

  // Summary Cards Data
  const summaryCards = [
    { title: 'ACs', value: '243', color: 'bg-green-600', progressType: '4' },
    { title: 'PCs', value: '40', color: 'bg-green-600', progressType: '1' },
    { title: 'Districts', value: '38', color: 'bg-green-600', progressType: '2' },
    { title: 'Zones', value: '9', color: 'bg-green-600', progressType: '3' }
  ];

  // Sample caste data based on the HTML structure
  const casteData: CasteData[] = [
    {
      acName: '1-Valmiki Nagar',
      sample: '311/300',
      casteData: {
        caste1: { name: 'Tharu', population: 15, achievement: 0, difference: -15 },
        caste2: { name: 'Muslim', population: 12, achievement: 16, difference: 5 },
        caste3: { name: 'Yadav / Raut', population: 12, achievement: 9, difference: -2 },
        caste4: { name: 'Others', population: 38, achievement: 29, difference: -9 }
      }
    },
    {
      acName: '243-Chakai',
      sample: '2/300',
      casteData: {
        caste1: { name: 'Yadav / Raut', population: 23, achievement: 0, difference: -23 },
        caste2: { name: 'Muslim', population: 11, achievement: 0, difference: -11 },
        caste3: { name: 'Santhal', population: 11, achievement: 0, difference: -11 },
        caste4: { name: 'Others', population: 13, achievement: 0, difference: -13 }
      }
    }
  ];

  // Sample PCs data
  const pcData: CasteData[] = [
    {
      acName: 'PC-1',
      sample: '150/140',
      casteData: {
        caste1: { name: 'Forward Castes', population: 25, achievement: 18, difference: -7 },
        caste2: { name: 'OBC', population: 35, achievement: 28, difference: -7 },
        caste3: { name: 'SC/ST', population: 20, achievement: 15, difference: -5 },
        caste4: { name: 'Others', population: 20, achievement: 12, difference: -8 }
      }
    },
    {
      acName: 'PC-2',
      sample: '145/140',
      casteData: {
        caste1: { name: 'Forward Castes', population: 30, achievement: 25, difference: -5 },
        caste2: { name: 'OBC', population: 40, achievement: 35, difference: -5 },
        caste3: { name: 'SC/ST', population: 15, achievement: 10, difference: -5 },
        caste4: { name: 'Others', population: 15, achievement: 8, difference: -7 }
      }
    },
    {
      acName: 'PC-3',
      sample: '138/140',
      casteData: {
        caste1: { name: 'Forward Castes', population: 28, achievement: 20, difference: -8 },
        caste2: { name: 'OBC', population: 32, achievement: 28, difference: -4 },
        caste3: { name: 'SC/ST', population: 22, achievement: 18, difference: -4 },
        caste4: { name: 'Others', population: 18, achievement: 10, difference: -8 }
      }
    }
  ];

  // Sample Districts data
  const districtData: CasteData[] = [
    {
      acName: 'Patna',
      sample: '250/240',
      casteData: {
        caste1: { name: 'Forward Castes', population: 30, achievement: 25, difference: -5 },
        caste2: { name: 'OBC', population: 35, achievement: 30, difference: -5 },
        caste3: { name: 'SC/ST', population: 20, achievement: 18, difference: -2 },
        caste4: { name: 'Others', population: 15, achievement: 12, difference: -3 }
      }
    },
    {
      acName: 'Gaya',
      sample: '245/240',
      casteData: {
        caste1: { name: 'Forward Castes', population: 25, achievement: 22, difference: -3 },
        caste2: { name: 'OBC', population: 40, achievement: 35, difference: -5 },
        caste3: { name: 'SC/ST', population: 25, achievement: 20, difference: -5 },
        caste4: { name: 'Others', population: 10, achievement: 8, difference: -2 }
      }
    },
    {
      acName: 'Muzaffarpur',
      sample: '238/240',
      casteData: {
        caste1: { name: 'Forward Castes', population: 28, achievement: 24, difference: -4 },
        caste2: { name: 'OBC', population: 38, achievement: 32, difference: -6 },
        caste3: { name: 'SC/ST', population: 22, achievement: 19, difference: -3 },
        caste4: { name: 'Others', population: 12, achievement: 9, difference: -3 }
      }
    },
    {
      acName: 'Bhagalpur',
      sample: '242/240',
      casteData: {
        caste1: { name: 'Forward Castes', population: 32, achievement: 28, difference: -4 },
        caste2: { name: 'OBC', population: 42, achievement: 36, difference: -6 },
        caste3: { name: 'SC/ST', population: 18, achievement: 15, difference: -3 },
        caste4: { name: 'Others', population: 8, achievement: 6, difference: -2 }
      }
    }
  ];

  // Sample Zones data
  const zonesData: CasteData[] = [
    {
      acName: 'Zone-1',
      sample: '300/295',
      casteData: {
        caste1: { name: 'Forward Castes', population: 28, achievement: 24, difference: -4 },
        caste2: { name: 'OBC', population: 38, achievement: 32, difference: -6 },
        caste3: { name: 'SC/ST', population: 20, achievement: 17, difference: -3 },
        caste4: { name: 'Others', population: 14, achievement: 11, difference: -3 }
      }
    },
    {
      acName: 'Zone-2',
      sample: '298/295',
      casteData: {
        caste1: { name: 'Forward Castes', population: 30, achievement: 26, difference: -4 },
        caste2: { name: 'OBC', population: 35, achievement: 30, difference: -5 },
        caste3: { name: 'SC/ST', population: 22, achievement: 19, difference: -3 },
        caste4: { name: 'Others', population: 13, achievement: 10, difference: -3 }
      }
    },
    {
      acName: 'Zone-3',
      sample: '294/295',
      casteData: {
        caste1: { name: 'Forward Castes', population: 26, achievement: 22, difference: -4 },
        caste2: { name: 'OBC', population: 40, achievement: 34, difference: -6 },
        caste3: { name: 'SC/ST', population: 24, achievement: 20, difference: -4 },
        caste4: { name: 'Others', population: 10, achievement: 8, difference: -2 }
      }
    },
    {
      acName: 'Zone-4',
      sample: '297/295',
      casteData: {
        caste1: { name: 'Forward Castes', population: 32, achievement: 28, difference: -4 },
        caste2: { name: 'OBC', population: 36, achievement: 31, difference: -5 },
        caste3: { name: 'SC/ST', population: 18, achievement: 15, difference: -3 },
        caste4: { name: 'Others', population: 14, achievement: 11, difference: -3 }
      }
    },
    {
      acName: 'Zone-5',
      sample: '293/295',
      casteData: {
        caste1: { name: 'Forward Castes', population: 29, achievement: 25, difference: -4 },
        caste2: { name: 'OBC', population: 37, achievement: 32, difference: -5 },
        caste3: { name: 'SC/ST', population: 21, achievement: 18, difference: -3 },
        caste4: { name: 'Others', population: 13, achievement: 10, difference: -3 }
      }
    }
  ];

  const getDifferenceStyle = (difference: number) => {
    if (difference >= 0) {
      return 'bg-green-600 text-white';
    } else {
      return 'bg-red-600 text-white';
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'PCs':
        return pcData;
      case 'Districts':
        return districtData;
      case 'Zones':
        return zonesData;
      default:
        return casteData;
    }
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
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
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
            <p className="mt-4 text-center">Loading...</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white ${
              activeTab === card.title ? 'opacity-100' : 'opacity-50'
            } cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}
            onClick={() => handleCardClick(card.progressType)}
            data-progress-type={card.progressType}
          >
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-white mb-2">{card.title}</h2>
                <h4 className="text-2xl font-bold text-white">{card.value}</h4>
              </div>
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
            <div className="table-responsive">
              <Table className="table table-bordered" id="acreport" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}></th>
                    <th style={{ width: '10%' }} className="text-center"></th>
                    <th style={{ width: '10%' }} className="text-center"></th>
                    <th style={{ width: '10%' }} className="text-center"></th>
                    <th style={{ width: '10%' }} className="text-center"></th>
                    <th style={{ width: '10%' }} className="text-center"></th>
                    <th style={{ width: '10%' }} className="text-center">
                      <Button 
                        onClick={handleDownload}
                        className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2 float-end"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentData().map((row, index) => (
                    <React.Fragment key={index}>
                      {/* Caste Headers */}
                      <tr>
                        <td className="bg-gray-200 border-t-2 border-black"></td>
                        <td className="bg-gray-200 border-t-2 border-black"></td>
                        <td className="bg-gray-200 border-t-2 border-black"></td>
                        <th className="text-center bg-gray-200 border-t-2 border-black">{row.casteData.caste1.name}</th>
                        <th className="text-center bg-gray-200 border-t-2 border-black">{row.casteData.caste2.name}</th>
                        <th className="text-center bg-gray-200 border-t-2 border-black">{row.casteData.caste3.name}</th>
                        <th className="text-center bg-gray-200 border-t-2 border-black">{row.casteData.caste4.name}</th>
                      </tr>
                      
                      {/* AC Info */}
                      <tr>
                        <td rowSpan={4} className="font-semibold text-center">{row.acName}</td>
                        <td rowSpan={4} className="font-semibold text-center">{row.sample}</td>
                      </tr>
                      
                      {/* Population % */}
                      <tr>
                        <th className="text-center">Population %</th>
                        <td className="text-center">{row.casteData.caste1.population}%</td>
                        <td className="text-center">{row.casteData.caste2.population}%</td>
                        <td className="text-center">{row.casteData.caste3.population}%</td>
                        <td className="text-center">{row.casteData.caste4.population}%</td>
                      </tr>
                      
                      {/* Achievement % */}
                      <tr>
                        <th className="text-center">Achievement %</th>
                        <td className="text-center">{row.casteData.caste1.achievement}%</td>
                        <td className="text-center">{row.casteData.caste2.achievement}%</td>
                        <td className="text-center">{row.casteData.caste3.achievement}%</td>
                        <td className="text-center">{row.casteData.caste4.achievement}%</td>
                      </tr>
                      
                      {/* Difference */}
                      <tr>
                        <th className="text-center">Difference</th>
                        <td className={`text-center ${getDifferenceStyle(row.casteData.caste1.difference)}`}>
                          {row.casteData.caste1.difference}
                        </td>
                        <td className={`text-center ${getDifferenceStyle(row.casteData.caste2.difference)}`}>
                          {row.casteData.caste2.difference}
                        </td>
                        <td className={`text-center ${getDifferenceStyle(row.casteData.caste3.difference)}`}>
                          {row.casteData.caste3.difference}
                        </td>
                        <td className={`text-center ${getDifferenceStyle(row.casteData.caste4.difference)}`}>
                          {row.casteData.caste4.difference}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
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
