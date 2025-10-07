'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Play, Download } from 'lucide-react';
import { apiService } from '@/lib/api';

interface InterviewData {
  server_token: string;
  ac_code: number;
  ac_name: string;
  interview_date: string;
  interview_audio: string | null;
}

interface APIResponse {
  success: boolean;
  data: {
    success: boolean;
    data: InterviewData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    filters: {
      ac_codes: Array<{
        ac_code: number;
        ac_name: string;
      }>;
      interview_dates: string[];
    };
    message: string;
    timestamp: string;
  };
  message: string;
  timestamp: string;
}

export default function CAPIInterviewAudioPage() {
  const [acCode, setAcCode] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [acOptions, setAcOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [interviewDateOptions, setInterviewDateOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    fetchData();
  }, [currentPage, acCode, interviewDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching CAPI interview audio data...');
      console.log('Current page:', currentPage);
      console.log('AC Code:', acCode);
      console.log('Interview Date:', interviewDate);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (acCode) params.ac_code = acCode;
      if (interviewDate) params.interview_date = interviewDate;
      
      console.log('API params:', params);
      
      const response = await apiService.getInterviewAudio(params) as APIResponse;
      console.log('API Response:', response);

      if (response.success && response.data.success) {
        console.log('Setting interview data:', response.data.data);
        setInterviewData(response.data.data);
        setTotalItems(response.data.pagination.total);
        setTotalPages(response.data.pagination.total_pages);
        
        // Set filter options from API
        const acOptionsData = [
          { value: '', label: 'Select AC' },
          ...response.data.filters.ac_codes.map(ac => ({
            value: ac.ac_code.toString(),
            label: `${ac.ac_name} (${ac.ac_code})`
          }))
        ];
        setAcOptions(acOptionsData);
        
        const dateOptionsData = [
          { value: '', label: 'Interview Date' },
          ...response.data.filters.interview_dates.map(date => ({
            value: date.split('T')[0],
            label: date.split('T')[0]
          }))
        ];
        setInterviewDateOptions(dateOptionsData);
      } else {
        console.error('API response not successful:', response);
        setError('Failed to fetch interview audio data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchData();
  };

  const handleCheckAudio = (serverToken: string) => {
    // Handle audio check functionality
    console.log('Checking CAPI audio for token:', serverToken);
    // This would typically open a modal or navigate to audio player
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Interview Audio (CAPI)
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

      {/* Search Form */}
      {/* <form id="interviewsearch-form" onSubmit={handleSearch}>
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AC Code
              </label>
              <SelectDropdown
                value={acCode}
                onChange={(value) => setAcCode(Array.isArray(value) ? value[0] : value)}
                options={acOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Date
              </label>
              <SelectDropdown
                value={interviewDate}
                onChange={(value) => setInterviewDate(Array.isArray(value) ? value[0] : value)}
                options={interviewDateOptions}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </Card>
      </form> */}

      {/* Interview List */}
      <Card>
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
                Interview List (CAPI)
              </Heading>
            </div>
            <span className="text-end">
              {/* Empty for now */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading interview data...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-lg text-red-600">Error: {error}</div>
              <button 
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
          <div className="table-responsive">
            <Table className="table table-striped table-bordered table-hover" id="export_table">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '2%' }}>#</th>
                  <th style={{ width: '10%' }}>Server Token</th>
                  <th className="text-center" style={{ width: '10%' }}>AC Code</th>
                  <th style={{ width: '10%' }}>AC Name</th>
                  <th style={{ width: '10%' }}>Interview Date</th>
                  <th className="text-center" style={{ width: '8%' }}>Interview Audio</th>
                </tr>
              </thead>
              <tbody>
                {interviewData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      <div className="text-lg text-gray-600">No interview data found</div>
                      <div className="text-sm text-gray-500 mt-2">Try adjusting your search filters</div>
                      {/* <button 
                        onClick={fetchData}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Refresh
                      </button> */}
                    </td>
                  </tr>
                ) : (
                  interviewData.map((row, index) => (
                    <tr key={row.server_token} data-key={row.server_token}>
                      <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{row.server_token}</td>
                      <td className="text-center">{row.ac_code}</td>
                      <td>{row.ac_name}</td>
                      <td>{row.interview_date.split('T')[0]}</td>
                      <td className="text-center">
                        <Button
                          onClick={() => handleCheckAudio(row.server_token)}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1"
                        >
                          Check Audio
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          )}

          {/* Pagination */}
          {!loading && !error && interviewData.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </Card>

      <style jsx>{`
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
          text-align: left;
        }
        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.075);
        }
        .summary {
          margin-bottom: 1rem;
        }
      `}</style>
    </Container>
  );
}
