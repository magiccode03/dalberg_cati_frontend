'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Plus, Play, Pause, Copy, Trash2, Eye, Clock, CheckCircle, XCircle, AlertCircle, Search, RefreshCw, Pencil, Activity, TrendingUp, AlertTriangle, Zap, RotateCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import PaginationStandard from '@/components/ui/PaginationStandard';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Input from '@/components/ui/Input';
import apiClient from '@/lib/api-client';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface CronJob {
  id: string;
  name: string;
  description: string;
  jobType: 'script' | 'api' | 'queue' | 'database' | 'command';
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  startDate?: string;
  endDate?: string;
  nextRun?: string;
  lastRun?: string;
  lastRunStatus?: 'success' | 'failed' | 'running' | 'skipped';
  executionCount: number;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface DashboardStats {
  totalJobs: number;
  enabledJobs: number;
  disabledJobs: number;
  runningJobs: number;
  failedJobs: number;
  totalExecutions: number;
  totalFailures: number;
  successRate: number;
}

interface APIResponse {
  success: boolean;
  data?: {
    data: CronJob[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}

export default function CronJobDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);
  
  // UI States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<CronJob | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  const isFetching = useRef(false);

  const fetchJobs = useCallback(async () => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const response = await apiClient.get(`/cron-jobs?${params.toString()}`);
      const data: APIResponse = response.data;

      if (data.success && data.data) {
        const jobsData = data.data.data || [];
        setJobs(jobsData);
        
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages);
          setTotalCount(data.data.pagination.total);
        }

        // Calculate dashboard statistics
        calculateStats(jobsData);
      } else {
        setError(data.message || 'Failed to fetch cron jobs');
      }
    } catch (err: any) {
      console.error('Error fetching cron jobs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch cron jobs');
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [currentPage, pageSize, searchTerm, statusFilter, typeFilter]);

  const calculateStats = (jobsData: CronJob[]) => {
    const stats: DashboardStats = {
      totalJobs: jobsData.length,
      enabledJobs: jobsData.filter(j => j.enabled).length,
      disabledJobs: jobsData.filter(j => !j.enabled).length,
      runningJobs: jobsData.filter(j => j.lastRunStatus === 'running').length,
      failedJobs: jobsData.filter(j => j.lastRunStatus === 'failed').length,
      totalExecutions: jobsData.reduce((sum, j) => sum + j.executionCount, 0),
      totalFailures: jobsData.reduce((sum, j) => sum + j.failureCount, 0),
      successRate: 0
    };

    if (stats.totalExecutions > 0) {
      stats.successRate = Math.round(((stats.totalExecutions - stats.totalFailures) / stats.totalExecutions) * 100);
    }

    setStats(stats);
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = () => {
    router.push('/portal-admin/cron-jobs/create');
  };

  const handleViewJob = (job: CronJob) => {
    router.push(`/portal-admin/cron-jobs/${job.id}`);
  };

  const handleEditJob = (job: CronJob) => {
    router.push(`/portal-admin/cron-jobs/${job.id}/edit`);
  };

  const handleCloneJob = (job: CronJob) => {
    router.push(`/portal-admin/cron-jobs/create?clone=${job.id}`);
  };

  const handleDeleteJob = (job: CronJob) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    setIsActionLoading(jobToDelete.id);
    try {
      await apiClient.delete(`/cron-jobs/${jobToDelete.id}`);
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleToggleJob = async (job: CronJob) => {
    setIsActionLoading(job.id);
    try {
      await apiClient.patch(`/cron-jobs/${job.id}/toggle`, {
        enabled: !job.enabled
      });
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle job');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleRunNow = async (job: CronJob) => {
    setIsActionLoading(job.id);
    try {
      await apiClient.post(`/cron-jobs/${job.id}/run-now`);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run job');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handlePauseJob = async (job: CronJob) => {
    setIsActionLoading(job.id);
    try {
      await apiClient.post(`/cron-jobs/${job.id}/pause`);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to pause job');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleResumeJob = async (job: CronJob) => {
    setIsActionLoading(job.id);
    try {
      await apiClient.post(`/cron-jobs/${job.id}/resume`);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resume job');
    } finally {
      setIsActionLoading(null);
    }
  };

  const getStatusBadge = (job: CronJob) => {
    if (!job.enabled) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Disabled</span>;
    }
    
    if (job.lastRunStatus === 'running') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Running</span>;
    }
    
    if (job.lastRunStatus === 'failed') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</span>;
    }
    
    if (job.lastRunStatus === 'success') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Success</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Idle</span>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { bg: string; text: string }> = {
      script: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
      api: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' },
      queue: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200' },
      database: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
      command: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' },
    };
    
    const colors = typeMap[type] || typeMap.command;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatNextRun = (nextRun?: string) => {
    if (!nextRun) return '-';
    const date = new Date(nextRun);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white">
              CRON Jobs
            </Heading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor scheduled jobs
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateJob}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Job
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Dashboard Statistics */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-blue-500 rounded-lg p-3 md:p-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-white opacity-90 truncate">Total Jobs</p>
                  <p className="text-lg md:text-2xl font-bold text-white mt-1 break-all">{stats.totalJobs}</p>
                  <p className="text-xs text-white opacity-75 mt-1">
                    {stats.enabledJobs} enabled
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2">
                  <Activity className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-green-500 rounded-lg p-3 md:p-4 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-white opacity-90 truncate">Success Rate</p>
                  <p className="text-lg md:text-2xl font-bold text-white mt-1 break-all">{stats.successRate}%</p>
                  <p className="text-xs text-white opacity-75 mt-1">
                    {stats.totalExecutions - stats.totalFailures} / {stats.totalExecutions} executions
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-yellow-500 rounded-lg p-3 md:p-4 border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-white opacity-90 truncate">Running</p>
                  <p className="text-lg md:text-2xl font-bold text-white mt-1 break-all">{stats.runningJobs}</p>
                  <p className="text-xs text-white opacity-75 mt-1">
                    Active executions
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-red-500 rounded-lg p-3 md:p-4 border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-white opacity-90 truncate">Failed Jobs</p>
                  <p className="text-lg md:text-2xl font-bold text-white mt-1 break-all">{stats.failedJobs}</p>
                  <p className="text-xs text-white opacity-75 mt-1">
                    {stats.totalFailures} total failures
                  </p>
                </div>
                <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <SelectDropdown
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'enabled', label: 'Enabled' },
                    { value: 'disabled', label: 'Disabled' },
                    { value: 'running', label: 'Running' },
                    { value: 'failed', label: 'Failed' },
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(Array.isArray(value) ? value[0] : value as string)}
                  placeholder="Filter by Status"
                  clearable
                />
              </div>
              <div>
                <SelectDropdown
                  options={[
                    { value: '', label: 'All Types' },
                    { value: 'script', label: 'Script' },
                    { value: 'api', label: 'API' },
                    { value: 'queue', label: 'Queue' },
                    { value: 'database', label: 'Database' },
                    { value: 'command', label: 'Command' },
                  ]}
                  value={typeFilter}
                  onChange={(value) => setTypeFilter(Array.isArray(value) ? value[0] : value as string)}
                  placeholder="Filter by Type"
                  clearable
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Jobs Table */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Scheduled Jobs
              </Heading>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchJobs}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table striped bordered hover>
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Schedule</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Next Run</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Last Run</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4">
                          <div>
                            <button
                              onClick={() => handleViewJob(job)}
                              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                            >
                              {job.name}
                            </button>
                            {job.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {job.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getTypeBadge(job.jobType)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 dark:text-white font-mono">
                            {job.cronExpression}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {job.timezone}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(job)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatNextRun(job.nextRun)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {job.lastRun ? (
                            <div className="flex items-center gap-2">
                              {job.lastRunStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {job.lastRunStatus === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                              {job.lastRunStatus === 'running' && <AlertCircle className="w-4 h-4 text-blue-500 animate-pulse" />}
                              <span className="text-sm text-gray-900 dark:text-white">
                                {new Date(job.lastRun).toLocaleString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Never</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewJob(job)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRunNow(job)}
                              disabled={isActionLoading === job.id}
                              title="Run Now"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            {job.enabled ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePauseJob(job)}
                                disabled={isActionLoading === job.id}
                                title="Pause"
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResumeJob(job)}
                                disabled={isActionLoading === job.id}
                                title="Resume"
                              >
                                <RotateCw className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditJob(job)}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCloneJob(job)}
                              title="Clone"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteJob(job)}
                              title="Delete"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No cron jobs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter || typeFilter
                  ? 'Try adjusting your filters'
                  : 'Create your first scheduled job to get started'}
              </p>
              {!searchTerm && !statusFilter && !typeFilter && (
                <Button variant="primary" onClick={handleCreateJob}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Cron Job"
        message={`Are you sure you want to delete "${jobToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isActionLoading === jobToDelete?.id}
      />
    </Container>
  );
}
