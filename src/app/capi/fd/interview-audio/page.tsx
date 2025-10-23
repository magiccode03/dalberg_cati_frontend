'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, X, Volume2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import Audio from '@/components/ui/Audio';

interface InterviewData {
  server_id: number;
  ac_code: number;
  ac_name: string;
  interview_date: string;
  interview_audio: string;
  audio_url: string;
}

interface APIResponse {
  success: boolean;
  data: any; // More flexible to handle different response structures
  message?: string;
  timestamp?: string;
}


export default function CAPIInterviewAudioPage() {
  const [filters, setFilters] = useState({
    serverId: '',
    acCode: '',
    acName: '',
    interviewDate: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    serverId: '',
    acCode: '',
    acName: '',
    interviewDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [acOptions, setAcOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [interviewDateOptions, setInterviewDateOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<InterviewData | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, appliedFilters]);

  // Reset to page 1 when applied filters change (but not on initial load)
  useEffect(() => {
    if (Object.values(appliedFilters).some(filter => filter !== '')) {
      setCurrentPage(1);
    }
  }, [appliedFilters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (appliedFilters.serverId) params.server_id = appliedFilters.serverId;
      // Priority: AC Name dropdown takes precedence over AC Code input
      if (appliedFilters.acName) {
        params.ac_code = appliedFilters.acName; // AC Name dropdown stores AC code as value
      } else if (appliedFilters.acCode) {
        params.ac_code = appliedFilters.acCode;
      }
      if (appliedFilters.interviewDate) params.interview_date = appliedFilters.interviewDate;
      
      // Use the existing getInterviewAudio method from apiService
      console.log('API params:', params);
      console.log('Applied filters:', appliedFilters);
      
      const response = await apiService.getInterviewAudio(params) as APIResponse;
      console.log('API Response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);

      // Handle the API response structure
      if (response.success) {
        const responseData = response.data;
        
        if (responseData && responseData.data) {
          // Handle the nested structure from the API
          const interviewData = responseData.data;
          const pagination = responseData.pagination;
          const filters = responseData.filters;
          
          console.log('Setting interview data:', interviewData);
          setInterviewData(interviewData);
          
          if (pagination) {
            setTotalItems(pagination.total_count || pagination.total);
            setTotalPages(pagination.total_pages);
          }
          
          // Set filter options from API filters (only when no filters are applied)
          if (filters && filters.ac_codes && acOptions.length === 0) {
            const acOptionsData = [
              { value: '', label: 'Select ACs' },
              ...filters.ac_codes
                .sort((a: any, b: any) => a.ac_name.localeCompare(b.ac_name))
                .map((ac: any) => ({
                  value: ac.ac_code.toString(),
                  label: `${ac.ac_name} (${ac.ac_code})`
                }))
            ];
            setAcOptions(acOptionsData);
          }
          
          if (filters && filters.interview_dates) {
            const dateOptionsData = [
              { value: '', label: 'Interview Date' },
              ...filters.interview_dates.map((date: string) => ({
                value: date.split('T')[0],
                label: date.split('T')[0]
              }))
            ];
            setInterviewDateOptions(dateOptionsData);
          }
        } else {
          console.error('Unexpected response data structure:', responseData);
          setError('Unexpected response format from server');
        }
      } else {
        console.error('API response not successful:', response);
        setError(`Failed to fetch interview audio data: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(`Error fetching data: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters(filters); // Apply the current filter values
    setCurrentPage(1);
    // fetchData will be called automatically due to useEffect dependency on appliedFilters
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handlePlayAudio = (audioData: InterviewData) => {
    // Use the audio_url directly from the API response
    const processedAudioData = {
      ...audioData,
      audio: audioData.audio_url
    };
    
    console.log('Playing audio:', processedAudioData);
    console.log('Audio URL:', audioData.audio_url);
    
    setCurrentAudio(processedAudioData);
    setShowAudioModal(true);
  };

  const handleCloseModal = () => {
    setShowAudioModal(false);
    setCurrentAudio(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Use interviewData directly since pagination is handled by the API
  const paginatedData = interviewData;

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Interview Audio (F2F)
          </Heading>
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
      <form id="interviewsearch-form" onSubmit={handleSearch}>
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AC Code
              </label>
              <input
                type="text"
                value={filters.acCode}
                onChange={(e) => handleFilterChange('acCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter AC Code"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AC Name
              </label>
              <SelectDropdown
                value={filters.acName}
                onChange={(value) => handleFilterChange('acName', Array.isArray(value) ? value[0] : value)}
                options={acOptions}
                className="w-full"
                placeholder="Select AC"
                searchable={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Server Id
              </label>
              <input
                type="text"
                value={filters.serverId}
                onChange={(e) => handleFilterChange('serverId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Server Id"
              />
            </div>
        
         
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Date
              </label>
              <input
                type="date"
                value={filters.interviewDate}
                onChange={(e) => handleFilterChange('interviewDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const emptyFilters = {
                    serverId: '',
                    acCode: '',
                    acName: '',
                    interviewDate: ''
                  };
                  setFilters(emptyFilters); // Clear the form inputs
                  setAppliedFilters(emptyFilters); // Clear the applied filters
                  setCurrentPage(1);
                }}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600 flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* Interview List */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Interview List (F2F)
            </Heading>
          </div>
        </div>
        
        {/* <div className="bg-white"> */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              Total <strong>{totalItems}</strong> items.
            </span>
          </div>
        
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading interview data...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-lg text-red-600">Error: {error}</div>
              <div className="mt-4 text-sm text-gray-600">
                <details className="cursor-pointer">
                  <summary className="font-semibold">Debug Info (Click to expand)</summary>
                  <div className="mt-2 p-4 bg-gray-100 rounded text-left">
                    <p><strong>Current Page:</strong> {currentPage}</p>
                    <p><strong>Items Per Page:</strong> {itemsPerPage}</p>
                    <p><strong>Total Items:</strong> {totalItems}</p>
                    <p><strong>Total Pages:</strong> {totalPages}</p>
                    <p><strong>Interview Data Length:</strong> {interviewData.length}</p>
                    <p><strong>Server Id Filter:</strong> {appliedFilters.serverId || 'None'}</p>
                    <p><strong>AC Code Filter:</strong> {appliedFilters.acCode || 'None'}</p>
                    <p><strong>AC Name Filter:</strong> {appliedFilters.acName || 'None'}</p>
                    <p><strong>Interview Date Filter:</strong> {appliedFilters.interviewDate || 'None'}</p>
                  </div>
                </details>
              </div>
              <button 
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : interviewData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">No interview data found</div>
              <div className="text-sm text-gray-500 mt-2">Try adjusting your search filters</div>
              <button 
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          ) : (
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Server Id</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">AC Name</th>
                  <th className="text-center">Interview Date</th>
                  <th className="text-center">Interview Audio</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={row.server_id}>
                    <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="text-center">{row.server_id}</td>
                    <td className="text-center">{row.ac_code}</td>
                    <td className="text-left">{row.ac_name}</td>
                    <td className="text-center">{new Date(row.interview_date).toLocaleDateString()}</td>
                    <td className="text-center">
                      <Button
                        onClick={() => handlePlayAudio(row)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 flex items-center justify-center mx-auto"
                        title="Play Audio"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          )}

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Card>

      {/* Audio Modal */}
      {showAudioModal && currentAudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 text-blue-600" />
                <Heading level={3} className="text-lg font-semibold">
                  Interview Audio Player
                </Heading>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Interview Details */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Server ID</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{currentAudio.server_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interview Date</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(currentAudio.interview_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AC Code</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{currentAudio.ac_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AC Name</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{currentAudio.ac_name}</p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
                <Audio
                  src={(currentAudio as any).audio}
                  onPlay={() => console.log('Audio started playing')}
                  onPause={() => console.log('Audio paused')}
                  onTimeUpdate={(currentTime, duration) => {
                    console.log(`Progress: ${((currentTime / duration) * 100).toFixed(1)}%`);
                  }}
                  onEnded={() => {
                    console.log('Audio playback ended');
                    // Optionally auto-close modal after a delay
                    setTimeout(() => {
                      handleCloseModal();
                    }, 2000);
                  }}
                  onError={(error) => {
                    console.error('Audio error:', error);
                  }}
                  className="border border-gray-200 dark:border-gray-600"
                />
              </div>

              {/* Download Link */}
              <div className="text-center">
                <a
                  href={(currentAudio as any).audio}
                  download
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Download Audio
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

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
