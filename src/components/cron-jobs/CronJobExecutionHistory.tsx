'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api-client';
import PaginationStandard from '@/components/ui/PaginationStandard';

interface ExecutionHistory {
  id: string;
  jobId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'success' | 'failed' | 'running' | 'skipped';
  triggeredBy: 'scheduled' | 'manual' | 'retry';
}

interface CronJobExecutionHistoryProps {
  jobId: string;
}

const CronJobExecutionHistory: React.FC<CronJobExecutionHistoryProps> = ({ jobId }) => {
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, [jobId, currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/cron-jobs/${jobId}/history?page=${currentPage}&limit=20`);
      if (response.data.success) {
        setHistory(response.data.data?.data || []);
        if (response.data.data?.pagination) {
          setTotalPages(response.data.data.pagination.totalPages);
          setTotalCount(response.data.data.pagination.total);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch execution history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'skipped':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : history.length > 0 ? (
        <>
          <div className="space-y-2">
            {history.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(execution.status)}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white capitalize">
                      {execution.status}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(execution.startTime).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {execution.triggeredBy === 'manual' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                        Manual
                      </span>
                    )}
                    {execution.triggeredBy === 'retry' && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                        Retry
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Duration: {formatDuration(execution.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={20}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No execution history found
        </div>
      )}
    </div>
  );
};

export default CronJobExecutionHistory;

