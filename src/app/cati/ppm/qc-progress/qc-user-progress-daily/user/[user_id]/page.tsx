'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { ArrowLeft, Loader2, Volume2, X } from 'lucide-react';
import apiClient from '@/lib/api-client';
import AudioPlayerModal from '@/components/modals/AudioPlayerModal';

interface RecordingInfo {
  file?: string;
  duration?: number;
  time?: string;
  nodeid?: string;
  visitId?: string;
}

interface AssignmentRow {
  server_id: string | number;
  ac_name: string | number;
  ac_code: string | number;
  qc_complete_date?: string | null;
  completed_date?: string | null;
  call_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  talk_duration?: string | number | null;
  audio_duration?: string | number | null;
  qc_status?: string | null;
  qc_pass?: number;
  qc_fail?: number;
  qc_pending?: number;
  recordings?: RecordingInfo[];
  audio_file?: string;
}

interface APIResponse {
  success: boolean;
  data?: AssignmentRow[];
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export default function QCUserAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const userId = useMemo(() => (Array.isArray(params?.user_id) ? params?.user_id[0] : params?.user_id), [params]);

  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentRow | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  const cachedSummary = useMemo(() => {
    if (!userId) return null;
    try {
      const raw = sessionStorage.getItem(`qc-user-progress-detail-${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('Unable to read cached QC user detail', err);
      return null;
    }
  }, [userId]);

  const deriveStatus = useCallback((raw: Record<string, any>) => {
    // Prioritize qc_pass and qc_fail flags
    if (raw?.qc_pass === 1 || raw?.qc_pass === true) return 'Pass';
    if (raw?.qc_fail === 1 || raw?.qc_fail === true) return 'Fail';

    // Normalize fallback status values
    const status = (raw?.qc_status ?? raw?.status ?? '').toString().toLowerCase();
    if (status === 'completed' || status === 'pass') return 'Pass';
    if (status === 'failed' || status === 'fail') return 'Fail';

    return '-';
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!userId) {
        setError('Invalid user id.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({
          user_id: userId.toString(),
          teleform_user_id: userId.toString(),
          page: currentPage.toString(),
          limit: pageSize.toString(),
        });

        const response = await apiClient.get(`/cati/qc/unified-user-statistics/details?${query.toString()}`) as any;
        const data: APIResponse = response.data;

        if (data.success && Array.isArray(data.data)) {
          const mappedRows: AssignmentRow[] = data.data.map((item) => {
            const raw = item as Record<string, any>;

            // Prefer explicit audio_file from API; otherwise fallback to first recording.file
            const rawAudioPath: string | undefined = raw.audio_file ?? (Array.isArray(raw.recordings) && raw.recordings[0]?.file) ?? undefined;
            let resolvedAudioFile: string | undefined = undefined;
            if (rawAudioPath) {
              if (rawAudioPath.startsWith('http://') || rawAudioPath.startsWith('https://')) {
                resolvedAudioFile = rawAudioPath;
              } else {
                resolvedAudioFile = `${apiBaseUrl}${rawAudioPath.startsWith('/') ? '' : '/'}${rawAudioPath}`;
              }
            }

            return {
              server_id: raw.server_id ?? raw.teleform_server_id ?? raw.serverId ?? '-',
              ac_name: raw.ac_name ?? raw.acName ?? '-',
              ac_code: raw.ac_code ?? raw.acCode ?? '-',
              qc_complete_date: raw.qc_complete_date ?? raw.qcCompleteDate ?? null,
              completed_date: raw.completed_date ?? raw.completedDate ?? null,
              call_date: raw.call_date ?? raw.callDate ?? null,
              start_time: raw.start_time ?? raw.qc_start_time ?? raw.startTime ?? null,
              end_time: raw.end_time ?? raw.qc_end_time ?? raw.endTime ?? null,
              talk_duration: raw.talk_duration ?? raw.talkDuration ?? null,
              audio_duration: raw.audio_duration ?? raw.audioDuration ?? null,
              qc_status: deriveStatus(raw),
              qc_pass: raw.qc_pass,
              qc_fail: raw.qc_fail,
              recordings: Array.isArray(raw.recordings) ? raw.recordings : [],
              audio_file: resolvedAudioFile,
            };
          });

          setRows(mappedRows);
          const total = data.pagination?.total ?? mappedRows.length;
          const pages = (data.pagination?.totalPages ?? Math.ceil(total / pageSize)) || (total > 0 ? 1 : 0);
          setTotalItems(total);
          setTotalPages(pages);
        } else {
          setRows([]);
          setTotalItems(0);
          setTotalPages(0);
          setError(data.message || data.error || 'Unable to load assignments.');
        }
      } catch (err: any) {
        console.error('Error fetching QC assignments:', err);
        const message = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Unable to load assignments.';
        setError(message);
        setRows([]);
        setTotalItems(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userId, currentPage, pageSize, deriveStatus]);

  useEffect(() => {
    if (loading) return;
    if (rows.length > 0) {
      setFallbackLoaded(true);
      return;
    }
    if (fallbackLoaded) return;
    if (!cachedSummary?.ac_wise_statistics || cachedSummary.ac_wise_statistics.length === 0) {
      setFallbackLoaded(true);
      return;
    }

    const mapped = cachedSummary.ac_wise_statistics.map((stat: any) => ({
      server_id: '-',
      ac_name: stat.ac_name ?? '-',
      ac_code: stat.ac_code ?? '-',
      qc_complete_date: null,
      completed_date: null,
      call_date: null,
      start_time: null,
      end_time: null,
      talk_duration: stat.qc_completed ?? null,
      audio_duration: null,
      qc_status: stat.qc_pass > 0 ? 'Pass' : stat.qc_fail > 0 ? 'Fail' : '-',
      recordings: [],
    }));

    setRows(mapped);
    setTotalItems(mapped.length);
    setTotalPages(mapped.length > 0 ? 1 : 0);
    setCurrentPage(1);
    setFallbackLoaded(true);
  }, [cachedSummary, fallbackLoaded, loading, rows.length]);

  const handleBack = () => {
    router.push('/cati/ppm/qc-progress/qc-user-progress-daily');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openAudioModal = (assignment: AssignmentRow) => {
    const resolved = resolveAudioUrl(assignment.recordings, assignment.audio_file);
    if (!resolved) return;
    console.debug('Opening audio modal with URL:', resolved);
    setSelectedAssignment(assignment);
    setShowAudioModal(true);
  };

  const closeAudioModal = () => {
    setShowAudioModal(false);
    setSelectedAssignment(null);
  };

  // Mirror interview-list modal audio behavior
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  const [fetchedAudioUrl, setFetchedAudioUrl] = useState<string | null>(null);
  const [fetchingAudio, setFetchingAudio] = useState(false);
  const handleAudioError = () => {
    console.error('Audio playback error (assignment modal)');
    setAudioError(true);
  };
  const handleIframeError = () => {
    console.error('Iframe audio playback error (assignment modal)');
    setAudioError(true);
  };
  const openAudioInNewTab = (url: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  // Try fetching audio via XHR/fetch with Authorization header and createObjectURL
  const fetchAudioWithAuth = async (url: string) => {
    if (!url) return;
    try {
      setFetchingAudio(true);
      setAudioError(false);
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const resp = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        method: 'GET',
        mode: 'cors',
      });

      if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);

      const blob = await resp.blob();
      const objUrl = window.URL.createObjectURL(blob);
      // Clean up any previous fetched URL
      if (fetchedAudioUrl) {
        window.URL.revokeObjectURL(fetchedAudioUrl);
      }
      setFetchedAudioUrl(objUrl);
      setUseIframe(false);
      setAudioError(false);
    } catch (err) {
      console.error('Authenticated audio fetch failed', err);
      setAudioError(true);
    } finally {
      setFetchingAudio(false);
    }
  };

  // Revoke object URL when modal closes or assignment changes
  useEffect(() => {
    if (!showAudioModal) {
      if (fetchedAudioUrl) {
        window.URL.revokeObjectURL(fetchedAudioUrl);
        setFetchedAudioUrl(null);
      }
    }
  }, [showAudioModal, fetchedAudioUrl]);

  const formatStatusDisplay = (status?: string | null) => {
    if (!status) return '-';
    const normalized = status.toString().toLowerCase();
    if (normalized === 'pass' || normalized === 'completed') return 'Pass';
    if (normalized === 'fail' || normalized === 'failed') return 'Fail';
    return status; // Return as-is if not recognized
  };

  const statusBadge = (status?: string | null) => {
    switch ((status || '').toLowerCase()) {
      case 'pass':
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'fail':
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatCell = (value?: string | number | null) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return value;
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().split('T')[0];
  };

  const formatDuration = (value?: string | number | null) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (Number.isNaN(num)) return value.toString();
    const minutes = Math.floor(num / 60);
    const seconds = Math.floor(num % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAudioTooltip = (recordings?: RecordingInfo[]) => {
    if (!recordings || recordings.length === 0) return 'Audio not available';
    const first = recordings[0] ?? {};
    const durationLabel = first.duration ? `${first.duration}s` : 'Unknown duration';
    return first.file ? `${first.file} (${durationLabel})` : `Audio (${durationLabel})`;
  };

  // Resolve an audio URL. Prefer an explicit audio_file (absolute), then recordings[].file
  const resolveAudioUrl = (recordings?: RecordingInfo[], audioFile?: string) => {
    if (audioFile) return audioFile;
    if (!recordings || recordings.length === 0) return '';
    const file = recordings[0]?.file;
    if (!file) return '';
    if (file.startsWith('http://') || file.startsWith('https://')) return file;
    return `${apiBaseUrl}${file.startsWith('/') ? '' : '/'}${file}`;
  };

  const extractAudioFileName = (recordings?: RecordingInfo[]): string | undefined => {
    if (!recordings || recordings.length === 0) return undefined;
    const file = recordings[0]?.file;
    if (!file) return undefined;
    
    // If it's a full URL, extract the filename from the path
    if (file.startsWith('http://') || file.startsWith('https://')) {
      try {
        const url = new URL(file);
        const pathParts = url.pathname.split('/');
        const filename = pathParts[pathParts.length - 1];
        return filename || undefined;
      } catch (e) {
        // If URL parsing fails, try to extract from the string
        const parts = file.split('/');
        return parts[parts.length - 1] || undefined;
      }
    }
    
    // If it's a relative path, extract just the filename
    const parts = file.split('/');
    return parts[parts.length - 1] || undefined;
  };

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
              QC Assignments – User {userId}
            </Heading>
          </div>
        </div>

        <Card>
          <div className="flex items-center mb-6">
            <div className="w-1 h-6 bg-blue-600 mr-3" />
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Assignment Summary
            </Heading>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {loading ? 'Loading assignments…' : (
              <>
                Total <strong>{totalItems}</strong> records.
                {rows.length === 0 && cachedSummary?.ac_wise_statistics?.length ? (
                  <span className="ml-2 text-xs text-gray-500">
                    Showing cached AC-wise statistics because the API returned no data.
                  </span>
                ) : null}
              </>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table
              striped
              bordered
              hover
              className="w-full border-collapse"
            >
              <thead className="sticky-header bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">S.No.</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Server ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Completed Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Start Time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">End Time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio Duration</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Audio</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching assignments…
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                      No data available for this user.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr key={`${row.server_id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{formatCell(row.server_id)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatCell(row.ac_name)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{formatCell(row.ac_code)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{formatDateOnly(row.qc_complete_date ?? row.completed_date ?? row.call_date)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{formatDateTime(row.start_time)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{formatDateTime(row.end_time)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-center">{formatDuration(row.audio_duration ?? row.talk_duration)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge(row.qc_status)}`}>
                          {formatStatusDisplay(row.qc_status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        {resolveAudioUrl(row.recordings, row.audio_file) ? (
                          <Button
                            size="sm"
                            title={getAudioTooltip(row.recordings)}
                            aria-label="Audio"
                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white border-0"
                            onClick={() => openAudioModal(row)}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {!loading && totalPages > 1 && (
            <div className="mt-4 flex justify-end">
              <PaginationStandard
                currentPage={currentPage}
                totalItems={totalItems}
                totalPages={totalPages}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </Container>

      {showAudioModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 text-blue-600" />
                <Heading level={3} className="text-lg font-semibold">
                  Assignment Audio Player
                </Heading>
              </div>
              <button
                onClick={closeAudioModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Assignment Details */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Server ID</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAssignment.server_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AC Name</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCell(selectedAssignment.ac_name)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed Date</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDateOnly(selectedAssignment.qc_complete_date ?? selectedAssignment.completed_date ?? selectedAssignment.call_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDuration(selectedAssignment.audio_duration ?? selectedAssignment.talk_duration)}</p>
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

                {(() => {
                  const audioUrl = fetchedAudioUrl ?? resolveAudioUrl(selectedAssignment.recordings, selectedAssignment.audio_file);
                  return !useIframe ? (
                    audioUrl ? (
                      <audio
                        controls
                        className="w-full"
                        controlsList="nodownload"
                        preload="metadata"
                        onError={handleAudioError}
                        onLoadStart={() => console.log('Audio loading started')}
                        onCanPlay={() => console.log('Audio can play')}
                      >
                        <source src={audioUrl} type="audio/mpeg" />
                        <source src={audioUrl} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No audio file available for this assignment.
                      </div>
                    )
                  ) : (
                    audioUrl ? (
                      <div className="w-full">
                        <iframe
                          src={audioUrl}
                          className="w-full h-16 border-0 rounded"
                          title="Audio Player"
                          allow="autoplay"
                          onError={handleIframeError}
                          onLoad={() => {
                            // Check if iframe content is just text (not audio player)
                            setTimeout(() => {
                              try {
                                const iframe = document.querySelector('iframe[title="Audio Player"]') as HTMLIFrameElement;
                                if (iframe && iframe.contentDocument) {
                                  const bodyText = iframe.contentDocument.body?.textContent?.trim();
                                  if (bodyText && bodyText.includes('recording for v2 is working fine')) {
                                    console.warn('Iframe returned text instead of audio player');
                                    setAudioError(true);
                                  }
                                }
                              } catch (e) {
                                // Cross-origin restrictions, can't access iframe content
                                console.log('Cannot access iframe content due to CORS');
                              }
                            }, 1000);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No audio file available for this assignment.
                      </div>
                    )
                  );
                })()}

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
                          The audio URL is not serving playable content. The server returned: "recording for v2 is working fine."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Alternative Options */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                  {!useIframe && audioError && (
                    <Button
                      onClick={() => setUseIframe(true)}
                      variant="outline"
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Try Alternative Player
                    </Button>
                  )}
                  <a
                    href={resolveAudioUrl(selectedAssignment.recordings, selectedAssignment.audio_file) || ''}
                    download
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                    style={{ display: resolveAudioUrl(selectedAssignment.recordings, selectedAssignment.audio_file) ? 'inline' : 'none' }}
                  >
                    Download audio
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={closeAudioModal}
                variant="outline"
                className="px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
