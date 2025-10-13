'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import { useFieldworkProgress } from '@/hooks/useApi';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [acSortConfig, setAcSortConfig] = useState<{ key: keyof ACProgress; direction: 'asc' | 'desc' } | null>(null);
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

  const getRowStyle = (completionPercent: number) => {
    if (completionPercent >= 100) {
      return 'bg-green-600 text-white';
    } else if (completionPercent >= 50) {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-gray-200 text-gray-900';
    }
  };

  const handleDownloadSummaryCSV = () => {
    const csvHeaders = ['Details', 'Measure'];
    const csvData = progressSummaryData.map(item => [
      item.details, formatIndianNumber(item.measure)
    ]);
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fieldwork-progress-summary-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadACProgressCSV = () => {
    const csvHeaders = [
      'AC Code', 'AC Name', 'District Name', 'Valid+Under QC', 'Reject', '% of Completion'
    ];
    const csvData = getSortedACData().map(ac => [
      ac.acCode, ac.acName, ac.districtName, ac.validUnderQc, ac.reject, ac.completionPercent
    ]);
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fieldwork-ac-progress-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleACSort = (key: keyof ACProgress) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (acSortConfig && acSortConfig.key === key && acSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setAcSortConfig({ key, direction });
  };


  const getSortedACData = () => {
    if (!acSortConfig) return acProgressData;
    
    return [...acProgressData].sort((a, b) => {
      const aValue = a[acSortConfig.key];
      const bValue = b[acSortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return acSortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return acSortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  };

  const formatIndianNumber = (value: string | number): string => {
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return String(value);
    }
    
    // Format with Indian number system (lakhs, crores)
    return new Intl.NumberFormat('en-IN').format(numValue);
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
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
            Fieldwork Progress
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
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
          <div className="table-responsive">
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Measure</th>
                </tr>
              </thead>
              <tbody>
                {progressSummaryData.map((item, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer`}>
                    <td>{item.details}</td>
                    <td>{formatIndianNumber(item.measure)}</td>
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
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-green-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
                AC Wise Progress
              </Heading>
            </div>
            <button
              onClick={handleDownloadACProgressCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Download AC Wise Progress as CSV"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
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
                      className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                      onClick={() => handleACSort('acCode')}
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-center">AC Code</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${acSortConfig?.key === 'acCode' && acSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${acSortConfig?.key === 'acCode' && acSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                      onClick={() => handleACSort('acName')}
                    >
                      <div className="flex items-center">
                        <span>AC Name</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${acSortConfig?.key === 'acName' && acSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${acSortConfig?.key === 'acName' && acSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                      onClick={() => handleACSort('districtName')}
                    >
                      <div className="flex items-center">
                        <span>District Name</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${acSortConfig?.key === 'districtName' && acSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${acSortConfig?.key === 'districtName' && acSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                      onClick={() => handleACSort('validUnderQc')}
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-center">Valid+Under QC</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${acSortConfig?.key === 'validUnderQc' && acSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${acSortConfig?.key === 'validUnderQc' && acSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                      onClick={() => handleACSort('reject')}
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-center">Reject</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${acSortConfig?.key === 'reject' && acSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${acSortConfig?.key === 'reject' && acSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-center sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500 px-3 py-3 font-semibold cursor-pointer hover:bg-gray-100"
                      onClick={() => handleACSort('completionPercent')}
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-center">% of Completion</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${acSortConfig?.key === 'completionPercent' && acSortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-600'}`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${acSortConfig?.key === 'completionPercent' && acSortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
              <tbody>
                {getSortedACData().map((ac, index) => (
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
