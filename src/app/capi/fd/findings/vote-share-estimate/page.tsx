'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import { apiService } from '@/lib/api-service';


interface DemographicData {
  category: string;
  subcategory: string;
  aitc: number;
  bjp: number;
  inc: number;
  leftFront: number;
  independent: number;
  ajsu: number;
  others: number;
  nota: number;
}

interface VoteShareData {
  page_info: {
    page_name: string;
    page_title: string;
    total_interviews: number;
    progress_type?: string;
  };
  charts?: {
    '2025_preference': {
      chart_type: string;
      chart_id: string;
      question_id: string;
      total_sample: number;
      data: Array<{
        name: string;
        y: number;
        count: string;
      }>;
      colors: string[];
    };
    '2021_ae'?: {
      chart_type: string;
      chart_id: string;
      question_id: string;
      total_sample: number;
      data: Array<{
        name: string;
        y: number;
        count: string;
      }>;
      colors: string[];
    };
    '2020_ae'?: {
      chart_type: string;
      chart_id: string;
      question_id: string;
      total_sample: number;
      data: Array<{
        name: string;
        y: number;
        count: string;
      }>;
      colors: string[];
    };
  };
  demographic_breakdown?: {
    gender: Record<string, Record<string, number>>;
    locality: Record<string, Record<string, number>>;
    social_category: Record<string, Record<string, number>>;
    age_group: Record<string, Record<string, number>>;
    religion: Record<string, Record<string, number>>;
  };
  ac_data?: Array<{
    ac_code?: number;
    pc_code?: number;
    district_code?: number;
    region_code?: number;
    ac_name?: string;
    pc_name?: string;
    district?: string;
    region_name?: string;
    sample: string;
    years: {
      '2021_ae'?: Record<string, number>;
      '2025_preference': Record<string, number>;
    };
  }>;
}

export default function VoteShareEstimatePage() {
  const [progressType, setProgressType] = useState('');
  const [voteShareData, setVoteShareData] = useState<VoteShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vote share estimates data
  const fetchVoteShareData = async (type: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getVoteShareEstimates(type);
      if (response.success && response.data) {
        setVoteShareData(response.data);
      } else {
        setError('Failed to fetch vote share data');
      }
    } catch (err) {
      console.error('Error fetching vote share data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteShareData(progressType);
  }, [progressType]);

  // Transform API data for charts
  const getChartData = (chartData: any) => {
    if (!chartData) return null;

    return {
      categories: chartData.data.map((item: any) => item.name).reverse(),
      values: chartData.data.map((item: any) => item.y).reverse(),
      // colors: chartData.colors.reverse(),
      colors: [...chartData.colors].reverse(),
      interviewsAchieved: chartData.total_sample
    };

  };

  const preference2025Data = voteShareData?.charts ? getChartData(voteShareData.charts['2025_preference']) : null;
  // Try both 2021_ae and 2020_ae for backward compatibility
  const ae2021Data = voteShareData?.charts ?
    (getChartData(voteShareData.charts['2021_ae']) || getChartData(voteShareData.charts['2020_ae'])) : null;



  // Transform API demographic data to table format
  const getDemographicData = (): DemographicData[] => {
    if (!voteShareData?.demographic_breakdown) return [];

    const demographicData: DemographicData[] = [];
    const breakdown = voteShareData.demographic_breakdown;

    // Helper function to map party names to our interface
    const mapPartyData = (data: Record<string, number>) => ({
      aitc: data['AITC'] || 0,
      bjp: data['BJP'] || 0,
      inc: data['INC'] || 0,
      leftFront: data['Left Front'] || 0,
      independent: data['Independent'] || 0,
      ajsu: data['AJSU'] || 0,
      others: data['Others'] || 0,
      nota: data['NOTA'] || 0,
    });

    // Gender
    Object.entries(breakdown.gender).forEach(([subcategory, data]) => {
      demographicData.push({
        category: 'Gender',
        subcategory,
        ...mapPartyData(data)
      });
    });

    // Locality
    Object.entries(breakdown.locality).forEach(([subcategory, data]) => {
      demographicData.push({
        category: 'Locality',
        subcategory,
        ...mapPartyData(data)
      });
    });

    // Social Category
    Object.entries(breakdown.social_category).forEach(([subcategory, data]) => {
      demographicData.push({
        category: 'Social Category',
        subcategory,
        ...mapPartyData(data)
      });
    });

    // Age Group
    Object.entries(breakdown.age_group).forEach(([subcategory, data]) => {
      demographicData.push({
        category: 'Age',
        subcategory,
        ...mapPartyData(data)
      });
    });

    // Religion
    Object.entries(breakdown.religion).forEach(([subcategory, data]) => {
      demographicData.push({
        category: 'Religion',
        subcategory,
        ...mapPartyData(data)
      });
    });

    return demographicData;
  };

  const demographicData = getDemographicData();

  const handleCardClick = (type: string) => {
    setProgressType(type);
    console.log('Progress type changed to:', type);
  };

  // Render AC Level table
  const renderACLevelTable = () => {
    if (!voteShareData?.ac_data) return null;

    return (
      <div className="card-border p-3">
        <h4 className="text-center mb-4">{voteShareData.page_info.page_title}</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th rowSpan={2} style={{ width: '5%' }} className="bg-tableheader">AC Code</th>
                <th rowSpan={2} style={{ width: '15%' }} className="bg-tableheader">AC Name</th>
                <th rowSpan={2} style={{ width: '8%' }} className="bg-tableheader">Sample</th>
                <th rowSpan={2} style={{ width: '8%' }} className="bg-tableheader">Year</th>
                <th colSpan={8} className="bg-tableheader text-center">Vote Share (%)</th>
              </tr>
              <tr>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#6189e6ff' }}>AITC</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#e97132' }}>BJP</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#00b0f0' }}>INC</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#ff0000' }}>Left Front</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#92d050' }}>Independent</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#dce119' }}>AJSU</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#aeaeae' }}>Others</th>
                <th className="number" style={{ width: '6%', color: 'black', backgroundColor: '#aeaeae' }}>NOTA</th>
              </tr>
            </thead>
            <tbody>
              {voteShareData.ac_data.map((ac, index) => (
                <React.Fragment key={ac.ac_code || `ac-${index}`}>
                  {/* 2021 AE Row */}
                  <tr>
                    <td rowSpan={2} className="text-center">{ac.ac_code}</td>
                    <td rowSpan={2}>{ac.ac_name}</td>
                    <td rowSpan={2} className="text-center">{ac.sample}</td>
                    <td className="text-center">2021 AE</td>
                    <td className="number">{ac.years['2021_ae']?.['AITC']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['BJP']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['INC']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['Left Front']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['Independent']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['AJSU']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['Others']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2021_ae']?.['NOTA']?.toFixed(1) || '0.0'}</td>
                  </tr>
                  {/* 2025 Preference Row */}
                  <tr>
                    <td className="text-center">2025 Preference</td>
                    <td className="number">{ac.years['2025_preference']['AITC']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['BJP']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['INC']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['Left Front']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['Independent']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['AJSU']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['Others']?.toFixed(1) || '0.0'}</td>
                    <td className="number">{ac.years['2025_preference']['NOTA']?.toFixed(1) || '0.0'}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render PC Level table
  const renderPCLevelTable = () => {
    if (!voteShareData?.ac_data) return null;

    return (
      <div className="card-border p-3">
        <h4 className="text-center mb-4">{voteShareData.page_info.page_title}</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th style={{ width: '5%' }} className="bg-tableheader">PC Code</th>
                <th style={{ width: '20%' }} className="bg-tableheader">PC Name</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#6189e6ff' }} className="number">AITC</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#e97132' }} className="number">BJP</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#00b0f0' }} className="number">INC</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#ff0000' }} className="number">Left Front</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#92d050' }} className="number">Independent</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#dce119' }} className="number">AJSU</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }} className="number">Others</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }} className="number">NOTA</th>
              </tr>
            </thead>
            <tbody>
              {voteShareData.ac_data.map((pc, index) => (
                <tr key={pc.pc_code || `pc-${index}`}>
                  <td className="text-center">{pc.pc_code}</td>
                  <td>{pc.pc_name}</td>
                  <td className="number">{pc.years['2025_preference']['AITC']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['BJP']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['INC']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['Left Front']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['Independent']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['AJSU']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['Others']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{pc.years['2025_preference']['NOTA']?.toFixed(1) || '0.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render District Level table
  const renderDistrictLevelTable = () => {
    if (!voteShareData?.ac_data) return null;

    return (
      <div className="card-border p-3">
        <h4 className="text-center mb-4">{voteShareData.page_info.page_title}</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th style={{ width: '5%' }} className="bg-tableheader">District Code</th>
                <th style={{ width: '20%' }} className="bg-tableheader">District Name</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#6189e6ff' }} className="number">AITC</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#e97132' }} className="number">BJP</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#00b0f0' }} className="number">INC</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#ff0000' }} className="number">Left Front</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#92d050' }} className="number">Independent</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#dce119' }} className="number">AJSU</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }} className="number">Others</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }} className="number">NOTA</th>
              </tr>
            </thead>
            <tbody>
              {voteShareData.ac_data.map((district, index) => (
                <tr key={district.district_code || `district-${index}`}>
                  <td className="text-center">{district.district_code}</td>
                  <td>{district.district}</td>
                  <td className="number">{district.years['2025_preference']['AITC']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['BJP']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['INC']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['Left Front']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['Independent']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['AJSU']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['Others']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{district.years['2025_preference']['NOTA']?.toFixed(1) || '0.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Zone Level table
  const renderZoneLevelTable = () => {
    if (!voteShareData?.ac_data) return null;

    return (
      <div className="card-border p-3">
        <h4 className="text-center mb-4">{voteShareData.page_info.page_title}</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th style={{ width: '5%' }} className="bg-tableheader">Zone Code</th>
                <th style={{ width: '20%' }} className="bg-tableheader">Zone Name</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#6189e6ff' }} className="number">AITC</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#e97132' }} className="number">BJP</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#00b0f0' }} className="number">INC</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#ff0000' }} className="number">Left Front</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#92d050' }} className="number">Independent</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#dce119' }} className="number">AJSU</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }} className="number">Others</th>
                <th style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }} className="number">NOTA</th>
              </tr>
            </thead>
            <tbody>
              {voteShareData.ac_data.map((zone, index) => (
                <tr key={zone.region_code || `zone-${index}`}>
                  <td className="text-center">{zone.region_code}</td>
                  <td>{zone.region_name}</td>
                  <td className="number">{zone.years['2025_preference']['AITC']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['BJP']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['INC']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['Left Front']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['Independent']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['AJSU']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['Others']?.toFixed(1) || '0.0'}</td>
                  <td className="number">{zone.years['2025_preference']['NOTA']?.toFixed(1) || '0.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  const renderDemographicTable = () => {
    if (!demographicData.length) return null;

    const categories = [...new Set(demographicData.map(item => item.category))];

    return (
      <div className="card-border p-3">
        <h4 className="text-center mb-4">Vote Share Estimate - 2025 Preference Demographics (%)</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <tbody>
              {categories.map((category, categoryIndex) => {
                const categoryData = demographicData.filter(item => item.category === category);
                return (
                  <React.Fragment key={`category-${categoryIndex}`}>
                    {/* Category Header */}
                    <tr>
                      <th style={{ width: '10%' }} className="bg-tableheader">{category}</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#6189e6ff' }}>AITC</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#e97132' }}>BJP</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#00b0f0' }}>INC</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#ff0000' }}>Left Front</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#92d050' }}>Independent</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#dce119' }}>AJSU</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }}>Others</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }}>NOTA</th>
                    </tr>

                    {/* Category Data Rows */}
                    {categoryData.map((row, rowIndex) => (
                      <tr key={`${category}-${rowIndex}`}>
                        <td style={{ width: '10%' }}>{row.subcategory}</td>
                        <td className="number">{row.aitc.toFixed(1)}</td>
                        <td className="number">{row.bjp.toFixed(1)}</td>
                        <td className="number">{row.inc.toFixed(1)}</td>
                        <td className="number">{row.leftFront.toFixed(1)}</td>
                        <td className="number">{row.independent.toFixed(1)}</td>
                        <td className="number">{row.ajsu.toFixed(1)}</td>
                        <td className="number">{row.others.toFixed(1)}</td>
                        <td className="number">{row.nota.toFixed(1)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vote share estimates...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={2} className="text-2xl font-semibold text-gray-900">
            {voteShareData?.page_info?.page_title || 'Vote Share Estimates'}
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Progress Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${progressType === 'ac' ? 'opacity-100' : 'opacity-50'
            }`}
          onClick={() => handleCardClick('ac')}
          data-progress-type="ac"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">AC Level</h2>
            </div>
          </div>
        </div>

        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${progressType === 'pc' ? 'opacity-100' : 'opacity-50'
            }`}
          onClick={() => handleCardClick('pc')}
          data-progress-type="pc"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">PC Level</h2>
            </div>
          </div>
        </div>

        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${progressType === 'district' ? 'opacity-100' : 'opacity-50'
            }`}
          onClick={() => handleCardClick('district')}
          data-progress-type="district"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">District Level</h2>
            </div>
          </div>
        </div>

        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${progressType === 'zone' ? 'opacity-100' : 'opacity-50'
            }`}
          onClick={() => handleCardClick('zone')}
          data-progress-type="zone"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">Zone Level</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Progress Type */}
      {progressType === 'ac' ? (
        /* AC Level Table */
        <Card className="">
          <div className="row">
            <div className="col-md-12">
              {renderACLevelTable()}
            </div>
          </div>
        </Card>
      ) : progressType === 'pc' ? (
        /* PC Level Table */
        <Card className="">
          <div className="row">
            <div className="col-md-12">
              {renderPCLevelTable()}
            </div>
          </div>
        </Card>
      ) : progressType === 'district' ? (
        /* District Level Table */
        <Card className="">
          <div className="row">
            <div className="col-md-12">
              {renderDistrictLevelTable()}
            </div>
          </div>
        </Card>
      ) : progressType === 'zone' ? (
        /* Zone Level Table */
        <Card className="">
          <div className="row">
            <div className="col-md-12">
              {renderZoneLevelTable()}
            </div>
          </div>
        </Card>
      ) : (
        /* Default: Charts and Demographic Table */
        <>
          {/* Charts Section */}
          {preference2025Data && ae2021Data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <HorizontalBarChart
                title="2025 Preference"
                data={preference2025Data}
                height={450}
              />
              <HorizontalBarChart
                title="2021 AE"
                data={ae2021Data}
                height={450}
              />
            </div>
          )}

          {/* Demographic Table Section */}
          <Card className="">
            <div className="row">
              <div className="col-md-12">
                {renderDemographicTable()}
              </div>
            </div>
          </Card>
        </>
      )}

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
        .card-border {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: white;
          margin-bottom: 1rem;
        }
        .bg-tableheader {
          background-color: #d1eaef !important;
          font-weight: 600;
        }
        .chart-container {
          overflow-x: auto;
          padding: 0.5rem 0;
        }
        .chart-bar-item {
          margin-bottom: 1rem;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid #a0a0a3;
          padding: 0.75rem 0.5rem;
        }
        .table > :not(:last-child) > :last-child > * {
          border-bottom-color: #a0a0a3;
        }
        .number {
          text-align: center;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .d-flex {
          display: flex;
        }
        .justify-content-end {
          justify-content: flex-end;
        }
        .justify-content-center {
          justify-content: center;
        }
        .text-center {
          text-align: center;
        }
        .mb-0 {
          margin-bottom: 0;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .mb-3 {
          margin-bottom: 1rem;
        }
        .mb-4 {
          margin-bottom: 1.5rem;
        }
        .mb-6 {
          margin-bottom: 2rem;
        }
        .p-3 {
          padding: 1rem;
        }
        .p-6 {
          padding: 1.5rem;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -0.75rem;
        }
        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0.75rem;
        }
        .col-md-12 {
          flex: 0 0 100%;
          max-width: 100%;
          padding: 0.75rem;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          margin-bottom: 0;
        }
        .table th,
        .table td {
          padding: 0.75rem 0.5rem;
          vertical-align: middle;
        }
        .table th {
          font-weight: 600;
          background-color: #f8f9fa;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.075);
        }
        @media (max-width: 768px) {
          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </Container>
  );
}
