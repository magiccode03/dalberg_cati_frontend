'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import { useFieldworkProgress } from '@/hooks/useApi';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ProgressSummary {
  details: string;
  measure: string | number;
}

interface ACProgress {
  acCode: number;
  acName: string;
  districtName: string;
  validUnderQc: number;
  reject: number;
  completionPercent: number;
}


export default function FieldworkProgressPage() {
  const [progressSummaryData, setProgressSummaryData] = useState<ProgressSummary[]>([]);
  const [acProgressData, setAcProgressData] = useState<ACProgress[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ACProgress; direction: 'asc' | 'desc' } | null>(null);
  const { getFieldworkProgress, loading, error } = useFieldworkProgress();

  useEffect(() => {
    fetchFieldworkProgress();
  }, []);

  const fetchFieldworkProgress = async () => {
    try {
      const result = await getFieldworkProgress();

      if (result) {
        // Transform summary data
        const summaryData: ProgressSummary[] = [
          { details: 'Total Sample', measure: result.summary.total_sample },
          { details: 'Sample Achieved (Numbers)', measure: result.summary.sample_achieved_numbers },
          { details: 'Sample Achieved (%)', measure: result.summary.sample_achieved_percentage },
          { details: 'ACs completed', measure: result.summary.acs_completed },
          { details: 'ACs not completed', measure: result.summary.acs_in_progress },
          { details: 'ACs yet to be initiated', measure: result.summary.acs_yet_to_initiate }
        ];
        setProgressSummaryData(summaryData);

        // Transform AC progress data
        const acData: ACProgress[] = result.ac_wise_progress.map(ac => ({
          acCode: ac.ac_code,
          acName: ac.ac_name,
          districtName: ac.district_name,
          validUnderQc: ac.total_achieved,
          reject: ac.rejected_interviews,
          completionPercent: parseFloat(ac.completion_percentage)
        }));
        setAcProgressData(acData);
      }
    } catch (err) {
      console.error('Error fetching fieldwork progress:', err);
    }
  };

  const handleSort = (key: keyof ACProgress) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return acProgressData;

    return [...acProgressData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  const getRowStyle = (completionPercent: number) => {
    if (completionPercent >= 100) {
      return 'bg-green-600 text-white';
    } else if (completionPercent >= 50) {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-gray-200 text-gray-900';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Text className="text-gray-600">Loading fieldwork progress data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <Card className="mb-6">
          <div className="card-body text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Fieldwork Progress
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Progress Summary Card */}
      <Card className="mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              Progress <i>Summary</i>
            </Heading>
          </div>
        </div>
        
        <div className="card-body">
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Details</th>
                  <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold">Measure</th>
                </tr>
              </thead>
              <tbody>
                {progressSummaryData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.details}</td>
                    <td>{item.measure}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>

      {/* AC Wise Progress Card */}
      <Card>
        <div className="card-header pb-0 mb-6">
          <div className="flex items-center">
          <div className="w-1 h-6 bg-green-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              AC Wise Progress
            </Heading>
            <span className="text-end">
              {/* Download button can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <b>{acProgressData.length}</b> items.
              </Text>
            </div>
            
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <Table className="table table-bordered table-striped table-hover">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('acCode')}
                  >
                    <div className="flex items-center justify-between">
                      <span className='text-center d-block w-full'>AC Code</span>
                      <div className="ml-1 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${sortConfig?.key === 'acCode' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'acCode' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    </div>
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('acName')}
                  >
                    <div className="flex items-center justify-between">
                      <span>AC Name</span>
                      <div className="ml-1 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${sortConfig?.key === 'acName' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'acName' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    </div>
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('districtName')}
                  >
                    <div className="flex items-center justify-between">
                      <span>District Name</span>
                      <div className="ml-1 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${sortConfig?.key === 'districtName' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'districtName' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    </div>
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('validUnderQc')}
                  >
                    <div className="flex items-center justify-between">
                      <span className='text-center d-block w-full'>Valid+Under QC</span>
                      <div className="ml-1 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${sortConfig?.key === 'validUnderQc' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'validUnderQc' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    </div>
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('reject')}
                  >
                    <div className="flex items-center justify-between">
                      <span className='text-center d-block w-full'>Reject</span>
                      <div className="ml-1 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${sortConfig?.key === 'reject' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'reject' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    </div>
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('completionPercent')}
                  >
                    <div className="flex items-center justify-between">
                      <span className='text-center d-block w-full'>% of Completion</span>
                      <div className="ml-1 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${sortConfig?.key === 'completionPercent' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'completionPercent' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().map((ac, index) => (
                  <tr key={ac.acCode} className={getRowStyle(ac.completionPercent)}>
                    <td className="text-center">{ac.acCode}</td>
                    <td>{ac.acName}</td>
                    <td>{ac.districtName}</td>
                    <td className="text-center">{ac.validUnderQc}</td>
                    <td className="text-center">{ac.reject}</td>
                    <td className="text-center">{ac.completionPercent}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Container>
  );
}
