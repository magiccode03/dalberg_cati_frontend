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

interface InterviewAudioData {
  id: number;
  ac_code: number;
  ac_name: string;
  audio: string;
  interview_date: number | string;
}

interface APIResponse {
  success: boolean;
  data: InterviewAudioData[];
}

// Utility function to format interview date
const formatInterviewDate = (date: number | string): string => {
  if (typeof date === 'number') {
    // Unix timestamp in seconds, convert to milliseconds
    return new Date(date * 1000).toLocaleDateString();
  } else if (typeof date === 'string') {
    // Try to parse as date string
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString();
  }
  return 'Invalid Date';
};

// Utility function to fix audio URL encoding
const fixAudioUrl = (url: string): string => {
  if (!url) return url;
  
  // Check if URL contains unencoded JSON in query parameter
  if (url.includes('data={')) {
    try {
      // Extract base URL and JSON part
      const parts = url.split('data=');
      if (parts.length === 2) {
        const baseUrl = parts[0] + 'data=';
        const jsonStr = parts[1];
        
        // URL encode the JSON part
        const encoded = encodeURIComponent(jsonStr);
        const fixedUrl = baseUrl + encoded;
        
        console.log('Original URL:', url);
        console.log('Fixed URL:', fixedUrl);
        
        return fixedUrl;
      }
    } catch (e) {
      console.error('Error fixing audio URL:', e);
    }
  }
  
  return url;
};

export default function CATIInterviewAudioPage() {
  const [acCode, setAcCode] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [interviewData, setInterviewData] = useState<InterviewAudioData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [acOptions, setAcOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [interviewDateOptions, setInterviewDateOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<InterviewAudioData | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [loadingAC, setLoadingAC] = useState(false);

  // Fetch AC list on mount
  useEffect(() => {
    fetchACList();
  }, []);

  // Fetch data initially
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Fetch AC list from API
  const fetchACList = async () => {
    setLoadingAC(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiBaseUrl}/api/cati/ac-details?limit=1000`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok && result.success) {
          const acData = Array.isArray(result.data?.data) ? result.data.data : [];
          const acOptionsData = [
            { value: '', label: 'All AC' },
            ...acData.map((ac: any) => ({
              value: ac.ac_code.toString(),
              label: `${ac.ac_name} (${ac.ac_code})`,
            })),
          ];
          setAcOptions(acOptionsData);
        }
      }
    } catch (err) {
      console.error('Error fetching AC list:', err);
    } finally {
      setLoadingAC(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      
      if (acCode) params.append('ac_code', acCode);
      if (interviewDate) params.append('date', interviewDate);
      
      const url = `${apiBaseUrl}/api/cati/interviews/ac-audio?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('API Response:', response); // Debug log
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        const interviewData = result.data?.data || [];
        
        setInterviewData(interviewData);
        
        // Handle pagination from API response
        if (result.data?.pagination) {
          setTotalItems(result.data.pagination.total);
          setTotalPages(result.data.pagination.totalPages);
        } else {
          setTotalItems(interviewData.length);
          setTotalPages(Math.ceil(interviewData.length / itemsPerPage));
        }
      } else {
        setError(result.message || 'Failed to fetch interview audio data');
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
    setCurrentPage(1);
    fetchData();
  };

  const handlePlayAudio = (audioData: InterviewAudioData) => {
    // Fix the audio URL encoding
    const processedAudioData = {
      ...audioData,
      audio: fixAudioUrl(audioData.audio)
    };
    
    console.log('Playing audio:', processedAudioData);
    
    setCurrentAudio(processedAudioData);
    setShowAudioModal(true);
    setAudioError(false);
  };

  const handleCloseModal = () => {
    setShowAudioModal(false);
    setCurrentAudio(null);
    setAudioError(false);
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Interview Audio (CATI)
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
      <form id="interviewsearch-form" onSubmit={handleSearch}>
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AC Name
              </label>
              <SelectDropdown
                value={acCode}
                onChange={(value) => setAcCode(Array.isArray(value) ? value[0] : value)}
                options={acOptions}
                placeholder="Select AC"
                searchable={true}
                clearable={true}
                maxHeight={300}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>{loading ? 'Searching...' : 'View'}</span>
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* Interview List */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Interview List (CATI)
            </Heading>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
          Total <strong>{totalItems}</strong> items.
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <i className="fa fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Loading interview data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <i className="fa fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Error: {error}</p>
              <button 
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : interviewData.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa fa-inbox text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">No interview data found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-bordered table-striped table-hover">
                <thead className="sticky-header bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">S.No</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Server Token</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">AC Code</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">AC Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Interview Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Interview Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-200 font-medium text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">
                        {row.id}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">
                        {row.ac_code}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-left">
                        {row.ac_name}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">
                        {formatInterviewDate(row.interview_date)}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">
                        <div className="relative group">
                          <Button
                            size="sm"
                            onClick={() => handlePlayAudio(row)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Play Audio
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalItems > 0 && (
          <div className="mt-4 px-4 pb-4">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Server Token</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{currentAudio.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interview Date</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatInterviewDate(currentAudio.interview_date)}
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
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click play to start the audio
                  </p>
                </div>

                <Audio
                  src={currentAudio.audio}
                  onPlay={() => console.log('Audio started playing')}
                  onPause={() => console.log('Audio paused')}
                  onTimeUpdate={(currentTime, duration) => {
                    console.log(`Progress: ${((currentTime / duration) * 100).toFixed(1)}%`);
                  }}
                  onEnded={() => {
                    console.log('Audio playback ended');
                  }}
                  onError={(error) => {
                    console.error('Audio error:', error);
                    setAudioError(true);
                  }}
                  className="border border-gray-200 dark:border-gray-600"
                />

                {/* Error Message for Failed Audio */}
                {audioError && (
                  <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mt-4">
                    <div className="text-center">
                      <div className="text-red-600 dark:text-red-400 mb-2">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold">Audio Playback Failed</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          The audio URL is not serving playable content.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Download Link */}
                <div className="mt-4 text-center">
                  <a
                    href={currentAudio.audio}
                    download
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Download Audio
                  </a>
                </div>
              </div>

              {/* Audio URL (for debugging/reference) */}
              {/* <div className="text-xs text-gray-500 dark:text-gray-400 break-all">
                <details className="cursor-pointer">
                  <summary className="font-semibold mb-1 hover:text-gray-700 dark:hover:text-gray-300">
                    🔍 Debug Info (Click to expand)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="font-semibold mb-1">Processed Audio URL:</p>
                      <p className="bg-gray-100 dark:bg-gray-900 p-2 rounded font-mono text-[10px]">
                        {currentAudio.audio}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-[10px] text-gray-400">
                        The URL has been automatically encoded for proper playback.
                      </p>
                    </div>
                  </div>
                </details>
              </div> */}
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
