'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Play, X, Volume2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface InterviewAudioData {
  id: number;
  ac_code: number;
  ac_name: string;
  audio: string;
  interview_date: string;
}

interface APIResponse {
  success: boolean;
  data: InterviewAudioData[];
}

export default function CATIInterviewAudioPage() {
  const [acCode, setAcCode] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [interviewData, setInterviewData] = useState<InterviewAudioData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [acOptions, setAcOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [interviewDateOptions, setInterviewDateOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<InterviewAudioData | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, acCode, interviewDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        limit: itemsPerPage
      };
      
      if (acCode) params.ac_code = acCode;
      if (interviewDate) params.interview_date = interviewDate;
      
      // Use the existing getInterviewAudio method from apiService
      const response = await apiService.getInterviewAudio(params);
      
      if (response.success && response.data) {
        setInterviewData(response.data);
        setTotalItems(response.data.length);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        
        // Extract unique AC codes for filter
        const uniqueACs = Array.from(new Set(response.data.map(item => JSON.stringify({ ac_code: item.ac_code, ac_name: item.ac_name }))))
          .map(str => JSON.parse(str));
        const acOptionsData = [
          { value: '', label: 'Select AC' },
          ...uniqueACs.map(ac => ({
            value: ac.ac_code.toString(),
            label: `${ac.ac_name} (${ac.ac_code})`
          }))
        ];
        setAcOptions(acOptionsData);
        
        // Extract unique dates for filter
        const uniqueDates = Array.from(new Set(response.data.map(item => item.interview_date.split('T')[0])));
        const dateOptionsData = [
          { value: '', label: 'Interview Date' },
          ...uniqueDates.map(date => ({
            value: date,
            label: new Date(date).toLocaleDateString()
          }))
        ];
        setInterviewDateOptions(dateOptionsData);
      } else {
        setError('Failed to fetch interview audio data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again.');
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
    setCurrentAudio(audioData);
    setShowAudioModal(true);
    setAudioError(false);
    setUseIframe(false);
  };

  const handleCloseModal = () => {
    setShowAudioModal(false);
    setCurrentAudio(null);
    setAudioError(false);
    setUseIframe(false);
  };

  const handleAudioError = () => {
    console.error('Audio playback failed, switching to iframe mode');
    setAudioError(true);
    setUseIframe(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get paginated data
  const paginatedData = interviewData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <Card className=" mb-6">
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
      </form>

      {/* Interview List */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
                Interview List (CATI)
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
                {paginatedData.map((row, index) => (
                  <tr key={row.id}>
                    <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{row.id}</td>
                    <td className="text-center">{row.ac_code}</td>
                    <td>{row.ac_name}</td>
                    <td>{new Date(row.interview_date).toLocaleDateString()}</td>
                    <td className="text-center">
                      <Button
                        onClick={() => handlePlayAudio(row)}
                        className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1 flex items-center gap-2 mx-auto"
                      >
                        <Play className="h-4 w-4" />
                        Play
                      </Button>
                    </td>
                  </tr>
                ))}
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
                <div className="mb-3 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {useIframe ? 'Using alternative player' : 'Click play to start the audio'}
                  </p>
                  {audioError && !useIframe && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Audio player had an issue. Try the alternative options below.
                    </p>
                  )}
                </div>

                {!useIframe ? (
                  <audio
                    controls
                    className="w-full"
                    controlsList="nodownload"
                    preload="metadata"
                    onError={handleAudioError}
                    onLoadStart={() => console.log('Audio loading started')}
                    onCanPlay={() => console.log('Audio can play')}
                  >
                    <source src={currentAudio.audio} type="audio/mpeg" />
                    <source src={currentAudio.audio} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div className="w-full">
                    <iframe
                      src={currentAudio.audio}
                      className="w-full h-16 border-0 rounded"
                      title="Audio Player"
                      allow="autoplay"
                    />
                  </div>
                )}
                
                {/* Alternative Options */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                  {!useIframe && audioError && (
                    <button
                      onClick={() => setUseIframe(true)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Try Alternative Player
                    </button>
                  )}
                  <a
                    href={currentAudio.audio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                  >
                    Open in new tab
                  </a>
                  <a
                    href={currentAudio.audio}
                    download
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                  >
                    Download audio
                  </a>
                </div>
              </div>

              {/* Audio URL (for debugging/reference) */}
              <div className="text-xs text-gray-500 dark:text-gray-400 break-all">
                <p className="font-semibold mb-1">Audio URL:</p>
                <p className="bg-gray-100 dark:bg-gray-900 p-2 rounded">{currentAudio.audio}</p>
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
