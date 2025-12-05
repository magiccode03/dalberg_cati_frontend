'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertCircle, Play, Calendar } from 'lucide-react';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api-client';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Card from '@/components/ui/Card';

interface LogEntry {
  id: string;
  logType: 'stdout' | 'stderr' | 'error';
  logLevel: 'info' | 'warning' | 'error';
  message: string;
  metadata?: any;
  createdAt: string;
}

interface ExecutionLog {
  id: string;
  executionId: string;
  startTime: string;
  endTime?: string | null;
  duration?: number | null;
  status: 'success' | 'failed' | 'running' | 'pending';
  triggeredBy: 'scheduled' | 'manual';
  error?: string | null;
  logs: LogEntry[];
}

interface CronJobLogsProps {
  jobId: string;
}

const CronJobLogs: React.FC<CronJobLogsProps> = ({ jobId }) => {
  const [executions, setExecutions] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedExecutions, setExpandedExecutions] = useState<Set<string>>(new Set());
  const [logTypeFilter, setLogTypeFilter] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, [jobId, currentPage, statusFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (statusFilter) params.append('status', statusFilter);

      const response = await apiClient.get(`/cron-jobs/${jobId}/logs?${params.toString()}`);
      if (response.data.success) {
        setExecutions(response.data.data?.data || []);
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

  const toggleExecution = (executionId: string) => {
    const newExpanded = new Set(expandedExecutions);
    if (newExpanded.has(executionId)) {
      newExpanded.delete(executionId);
    } else {
      newExpanded.add(executionId);
    }
    setExpandedExecutions(newExpanded);
  };

  const formatDuration = (ms?: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
      success: {
        icon: <CheckCircle className="w-4 h-4" />,
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-300',
      },
      failed: {
        icon: <XCircle className="w-4 h-4" />,
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-800 dark:text-red-300',
      },
      running: {
        icon: <AlertCircle className="w-4 h-4 animate-pulse" />,
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-800 dark:text-blue-300',
      },
      pending: {
        icon: <Clock className="w-4 h-4" />,
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-800 dark:text-yellow-300',
      },
    };

    const statusInfo = statusMap[status] || statusMap.failed;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLogTypeBadge = (logType: string) => {
    const typeMap: Record<string, { bg: string; text: string }> = {
      stdout: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
      stderr: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
      error: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
    };
    const typeInfo = typeMap[logType] || typeMap.stdout;
    return (
      <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${typeInfo.bg} ${typeInfo.text}`}>
        {logType}
      </span>
    );
  };

  const getLogLevelBadge = (level: string) => {
    const levelMap: Record<string, { bg: string; text: string }> = {
      info: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' },
      warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
      error: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
    };
    const levelInfo = levelMap[level] || levelMap.info;
    return (
      <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${levelInfo.bg} ${levelInfo.text}`}>
        {level}
      </span>
    );
  };

  const filterLogs = (logs: LogEntry[]) => {
    if (!logTypeFilter) return logs;
    return logs.filter(log => log.logType === logTypeFilter);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <SelectDropdown
          options={[
            { value: '', label: 'All Status' },
            { value: 'success', label: 'Success' },
            { value: 'failed', label: 'Failed' },
            { value: 'running', label: 'Running' },
            { value: 'pending', label: 'Pending' },
          ]}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(Array.isArray(value) ? value[0] : value as string);
            setCurrentPage(1);
          }}
          placeholder="Status"
          clearable
          className="w-auto min-w-[140px]"
        />
        <SelectDropdown
          options={[
            { value: '', label: 'All Log Types' },
            { value: 'stdout', label: 'STDOUT' },
            { value: 'stderr', label: 'STDERR' },
            { value: 'error', label: 'Error' },
          ]}
          value={logTypeFilter}
          onChange={(value) => setLogTypeFilter(Array.isArray(value) ? value[0] : value as string)}
          placeholder="Log Type"
          clearable
          className="w-auto min-w-[140px]"
        />
        <Button variant="outline" size="sm" onClick={fetchLogs}>
          <Search className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Executions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : executions.length > 0 ? (
        <div className="space-y-2">
          {executions.map((execution) => {
            const isExpanded = expandedExecutions.has(execution.executionId);
            const filteredLogs = filterLogs(execution.logs || []);

            return (
              <Card key={execution.id} className="overflow-hidden">
                {/* Execution Header */}
                <div
                  className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleExecution(execution.executionId)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    {getStatusBadge(execution.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 flex-wrap">
                        <span className="capitalize text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {execution.triggeredBy}
                        </span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDateTime(execution.startTime)}</span>
                          {execution.endTime && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span>{formatDateTime(execution.endTime)}</span>
                            </>
                          )}
                        </div>
                        {execution.duration && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="font-medium">{formatDuration(execution.duration)}</span>
                          </>
                        )}
                        {execution.logs && execution.logs.length > 0 && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {execution.logs.length} log{execution.logs.length !== 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {execution.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded text-xs text-red-700 dark:text-red-300">
                      <strong>Error:</strong> {execution.error}
                    </div>
                  )}
                </div>

                {/* Expanded Logs */}
                {isExpanded && filteredLogs.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                    <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                      {filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className={`p-2 rounded border-l-2 ${
                            log.logType === 'error' || log.logLevel === 'error'
                              ? 'bg-red-50/30 dark:bg-red-900/5 border-red-400'
                              : log.logType === 'stderr' || log.logLevel === 'warning'
                              ? 'bg-yellow-50/30 dark:bg-yellow-900/5 border-yellow-400'
                              : 'bg-white dark:bg-gray-800 border-blue-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(log.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                            {getLogTypeBadge(log.logType)}
                            {log.logLevel !== 'info' && getLogLevelBadge(log.logLevel)}
                          </div>
                          <div className="text-xs text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap break-words">
                            {log.message}
                          </div>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <details className="mt-1">
                              <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                Metadata
                              </summary>
                              <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && filteredLogs.length === 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No logs match the selected filter
                  </div>
                )}
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
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
        <Card>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No execution logs found</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CronJobLogs;

