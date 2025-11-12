'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { ArrowLeft, Loader2, Phone, X } from 'lucide-react';
import apiClient from '@/lib/api-client';

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
    if (raw?.qc_pass) return 'Pass';
    if (raw?.qc_fail) return 'Fail';
    if (raw?.qc_pending) return 'Pending';
    return raw?.qc_status ?? raw?.status ?? '-';
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
              qc_pending: raw.qc_pending,
              recordings: Array.isArray(raw.recordings) ? raw.recordings : [],
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
      qc_status: stat.qc_completed > 0 ? 'Completed' : stat.qc_pending > 0 ? 'Pending' : '-',
      qc_pass: stat.qc_pass,
      qc_fail: stat.qc_fail,
      qc_pending: stat.qc_pending,
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
    if (!assignment.recordings || assignment.recordings.length === 0) return;
    setSelectedAssignment(assignment);
    setShowAudioModal(true);
  };

  const closeAudioModal = () => {
    setShowAudioModal(false);
    setSelectedAssignment(null);
  };

  const statusBadge = (status?: string | null) => {
    switch ((status || '').toLowerCase()) {
      case 'pass':
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'fail':
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
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

  const resolveAudioUrl = (recordings?: RecordingInfo[]) => {
    if (!recordings || recordings.length === 0) return '';
    const file = recordings[0]?.file;
    if (!file) return '';
    if (file.startsWith('http://') || file.startsWith('https://')) return file;
    return `${apiBaseUrl}${file.startsWith('/') ? '' : '/'}${file}`;
  };

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
              QC Assignments – User {userId}
            </Heading>
          </div>
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
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
                          {formatCell(row.qc_status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        {row.recordings && row.recordings.length > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            title={getAudioTooltip(row.recordings)}
                            aria-label="Audio"
                            className="flex items-center justify-center text-blue-600 border-blue-300 hover:bg-blue-50"
                            onClick={() => openAudioModal(row)}
                          >
                            <Phone className="w-4 h-4" />
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Heading level={3} className="text-lg font-semibold">
                Assignment Audio
              </Heading>
              <button
                onClick={closeAudioModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Server ID</Text>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedAssignment.server_id}</p>
                </div>
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">AC Name</Text>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCell(selectedAssignment.ac_name)}</p>
                </div>
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Completed Date</Text>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDateOnly(selectedAssignment.qc_complete_date ?? selectedAssignment.completed_date ?? selectedAssignment.call_date)}</p>
                </div>
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Duration</Text>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDuration(selectedAssignment.audio_duration ?? selectedAssignment.talk_duration)}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
                {resolveAudioUrl(selectedAssignment.recordings) ? (
                  <audio controls className="w-full" controlsList="nodownload" preload="metadata">
                    <source src={resolveAudioUrl(selectedAssignment.recordings)} type="audio/mpeg" />
                    <source src={resolveAudioUrl(selectedAssignment.recordings)} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div className="text-center py-4 text-gray-500">No audio file available.</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={closeAudioModal} variant="outline" className="px-4 py-2">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
