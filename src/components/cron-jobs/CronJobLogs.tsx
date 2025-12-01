'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api-client';
import PaginationStandard from '@/components/ui/PaginationStandard';

interface LogEntry {
  id: string;
  jobId: string;
  executionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'success' | 'failed' | 'running';
  output?: string;
  error?: string;
  apiResponse?: {
    statusCode: number;
    body: string;
  };
  sqlSummary?: {
    rowsAffected: number;
    executionTime: number;
  };
}

interface CronJobLogsProps {
  jobId: string;
}

const CronJobLogs: React.FC<CronJobLogsProps> = ({ jobId }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, [jobId, currentPage, statusFilter, dateFrom, dateTo]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await apiClient.get(`/cron-jobs/${jobId}/logs?${params.toString()}`);
      if (response.data.success) {
        setLogs(response.data.data?.data || []);
        if (response.data.data?.pagination) {
          setTotalPages(response.data.data.pagination.totalPages);
          setTotalCount(response.data.data.pagination.total);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
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
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From Date"
          />
        </div>
        <div>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To Date"
          />
        </div>
        <div>
          <SelectDropdown
            options={[
              { value: '', label: 'All Status' },
              { value: 'success', label: 'Success' },
              { value: 'failed', label: 'Failed' },
              { value: 'running', label: 'Running' },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(Array.isArray(value) ? value[0] : value as string)}
            placeholder="Filter by Status"
            clearable
          />
        </div>
        <div>
          <Button variant="outline" onClick={fetchLogs} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(log.startTime).toLocaleString('en-IN')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    log.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    log.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {formatDuration(log.duration)}
                </span>
              </div>
              
              {log.error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-300">
                  <strong>Error:</strong> {log.error}
                </div>
              )}
              
              {log.output && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 font-mono text-xs overflow-x-auto">
                  <pre>{log.output}</pre>
                </div>
              )}
            </div>
          ))}

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
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No logs found
        </div>
      )}
    </div>
  );
};

export default CronJobLogs;

