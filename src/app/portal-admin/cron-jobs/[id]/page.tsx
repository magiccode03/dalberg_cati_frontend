'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, FileText, Calendar, Play, Pause, Pencil, Copy, Trash2, Info, RotateCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import Tabs from '@/components/ui/Tabs';
import apiClient from '@/lib/api-client';
import CronJobLogs from '@/components/cron-jobs/CronJobLogs';
import CronJobExecutionHistory from '@/components/cron-jobs/CronJobExecutionHistory';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { getCronDescription } from '@/lib/cron-expression-helper';

interface CronJobDetail {
  id: string;
  name: string;
  description: string;
  jobType: string;
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  startDate?: string;
  endDate?: string;
  nextRun?: string;
  lastRun?: string;
  lastRunStatus?: string;
  executionCount: number;
  failureCount: number;
  averageDuration?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  config?: any;
}

export default function CronJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<CronJobDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/cron-jobs/${jobId}`);
      if (response.data.success) {
        setJob(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch job details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    setIsActionLoading(true);
    try {
      await apiClient.delete(`/cron-jobs/${job.id}`);
      router.push('/portal-admin/cron-jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsActionLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleRunNow = async () => {
    if (!job) return;
    setIsActionLoading(true);
    try {
      await apiClient.post(`/cron-jobs/${job.id}/run-now`);
      fetchJobDetails();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run job');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!job) return;
    setIsActionLoading(true);
    try {
      await apiClient.patch(`/cron-jobs/${job.id}/toggle`, {
        enabled: !job.enabled
      });
      fetchJobDetails();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle job');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusMap: Record<string, { icon: React.ReactNode; color: string }> = {
      success: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' },
      failed: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600' },
      running: { icon: <AlertCircle className="w-4 h-4 animate-pulse" />, color: 'text-blue-600' },
      skipped: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-yellow-600' },
    };
    
    const statusInfo = statusMap[status] || statusMap.failed;
    return (
      <div className={`flex items-center gap-2 ${statusInfo.color}`}>
        {statusInfo.icon}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = job ? [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {/* Job Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Job Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">{job.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Job Type</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{job.jobType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <div className="mt-1">
                {job.enabled ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Enabled
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Disabled
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cron Expression</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">{job.cronExpression}</p>
              <div className="mt-1 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getCronDescription(job.cronExpression)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Timezone</p>
              <p className="font-semibold text-gray-900 dark:text-white">{job.timezone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next Run</p>
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Clock className="w-4 h-4 text-gray-400" />
                {formatDate(job.nextRun)}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{job.executionCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failures</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{job.failureCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {job.executionCount > 0
                    ? `${Math.round(((job.executionCount - job.failureCount) / job.executionCount) * 100)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>

          {/* Last Run */}
          {job.lastRun && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last Run</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Execution Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatDate(job.lastRun)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  {getStatusBadge(job.lastRunStatus)}
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: <FileText className="w-4 h-4" />,
      content: <CronJobLogs jobId={jobId} />,
    },
    {
      id: 'history',
      label: 'Execution History',
      icon: <Calendar className="w-4 h-4" />,
      content: <CronJobExecutionHistory jobId={jobId} />,
    },
  ] : [];

  return (
    <Container maxWidth="6xl" className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/portal-admin/cron-jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>
            <div>
              <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
                {job ? job.name : 'Job Details'}
              </Heading>
              {job?.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {job.description}
                </p>
              )}
            </div>
          </div>
          {job && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRunNow}
                disabled={isActionLoading || !job.enabled}
              >
                <Play className="w-4 h-4 mr-2" />
                Run Now
              </Button>
              <Button
                variant="outline"
                onClick={handleToggle}
                disabled={isActionLoading}
              >
                {job.enabled ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/portal-admin/cron-jobs/${job.id}/edit`)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : job && tabs.length > 0 ? (
          <Card>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              defaultActiveTab="overview"
            />
          </Card>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Job not found</p>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Cron Job"
        message={`Are you sure you want to delete "${job?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isActionLoading}
      />
    </Container>
  );
}

