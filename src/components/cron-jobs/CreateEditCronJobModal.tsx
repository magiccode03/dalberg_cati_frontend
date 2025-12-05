'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Alert from '@/components/ui/Alert';
import { Calendar, Clock, Globe, Code, Database, Zap, Webhook, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { validateCronExpression, getCronDescription } from '@/lib/cron-expression-helper';

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
  config?: {
    scriptPath?: string;
    apiUrl?: string;
    apiMethod?: string;
    apiHeaders?: Record<string, string>;
    queueName?: string;
    sqlQuery?: string;
    command?: string;
  };
}

interface CreateEditCronJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: CronJob | null;
  onSuccess: () => void;
}

const CreateEditCronJobModal: React.FC<CreateEditCronJobModalProps> = ({
  isOpen,
  onClose,
  job,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<CronJob>>({
    name: '',
    description: '',
    jobType: 'script',
    cronExpression: '0 0 * * *',
    timezone: 'Asia/Kolkata',
    enabled: true,
    config: {},
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedulePreset, setSchedulePreset] = useState<string>('custom');
  const [cronValidation, setCronValidation] = useState<{ valid: boolean; error?: string; description?: string } | null>(null);

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        config: job.config || {},
      });
      // Validate existing cron expression
      if (job.cronExpression) {
        const validation = validateCronExpression(job.cronExpression);
        setCronValidation(validation);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        jobType: 'script',
        cronExpression: '0 0 * * *',
        timezone: 'Asia/Kolkata',
        enabled: true,
        config: {},
      });
      // Validate default cron expression
      const validation = validateCronExpression('0 0 * * *');
      setCronValidation(validation);
    }
  }, [job, isOpen]);

  const schedulePresets = [
    { value: 'custom', label: 'Custom Expression' },
    { value: '0 0 * * *', label: 'Daily at Midnight' },
    { value: '0 0 * * 0', label: 'Weekly on Sunday' },
    { value: '0 0 1 * *', label: 'Monthly on 1st' },
    { value: '*/5 * * * *', label: 'Every 5 Minutes' },
    { value: '*/15 * * * *', label: 'Every 15 Minutes' },
    { value: '0 * * * *', label: 'Every Hour' },
    { value: '0 0,12 * * *', label: 'Twice Daily (Noon & Midnight)' },
  ];

  const handleSchedulePresetChange = (preset: string) => {
    setSchedulePreset(preset);
    if (preset !== 'custom') {
      setFormData(prev => ({ ...prev, cronExpression: preset }));
      // Validate preset cron expression
      const validation = validateCronExpression(preset);
      setCronValidation(validation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate cron expression before submission
    if (formData.cronExpression) {
      const validation = validateCronExpression(formData.cronExpression);
      if (!validation.valid) {
        setError(validation.error || 'Invalid cron expression');
        setCronValidation(validation);
        return;
      }
    }
    
    setLoading(true);
    setError(null);

    try {
      if (job?.id) {
        await apiClient.put(`/cron-jobs/${job.id}`, formData);
      } else {
        await apiClient.post('/cron-jobs', formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save cron job');
    } finally {
      setLoading(false);
    }
  };

  const renderJobTypeConfig = () => {
    switch (formData.jobType) {
      case 'script':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Script Path
            </label>
            <Input
              type="text"
              value={formData.config?.scriptPath || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                config: { ...prev?.config, scriptPath: e.target.value }
              }))}
              placeholder="/scripts/backup.sh"
              required
            />
          </div>
        );
      
      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API URL
              </label>
              <Input
                type="url"
                value={formData.config?.apiUrl || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  config: { ...prev?.config, apiUrl: e.target.value }
                }))}
                placeholder="https://api.example.com/endpoint"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HTTP Method
              </label>
              <SelectDropdown
                options={[
                  { value: 'GET', label: 'GET' },
                  { value: 'POST', label: 'POST' },
                  { value: 'PUT', label: 'PUT' },
                  { value: 'DELETE', label: 'DELETE' },
                  { value: 'PATCH', label: 'PATCH' },
                ]}
                value={formData.config?.apiMethod || 'GET'}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  config: { ...prev?.config, apiMethod: Array.isArray(value) ? value[0] : value as string }
                }))}
                placeholder="Select Method"
              />
            </div>
          </div>
        );
      
      case 'queue':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Queue Name
            </label>
            <Input
              type="text"
              value={formData.config?.queueName || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                config: { ...prev?.config, queueName: e.target.value }
              }))}
              placeholder="task-queue"
              required
            />
          </div>
        );
      
      case 'database':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SQL Query
            </label>
            <textarea
              value={formData.config?.sqlQuery || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                config: { ...prev?.config, sqlQuery: e.target.value }
              }))}
              placeholder="SELECT * FROM table WHERE..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={4}
              required
            />
          </div>
        );
      
      case 'command':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              System Command
            </label>
            <Input
              type="text"
              value={formData.config?.command || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                config: { ...prev?.config, command: e.target.value }
              }))}
              placeholder="ls -la /path"
              required
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'script': return <Code className="w-5 h-5" />;
      case 'api': return <Webhook className="w-5 h-5" />;
      case 'queue': return <Zap className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? 'Edit Cron Job' : 'Create Cron Job'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Name *
            </label>
            <Input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Backup Database"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this job does"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Type *
            </label>
            <SelectDropdown
              options={[
                { value: 'script', label: 'Script', icon: getJobTypeIcon('script') },
                { value: 'api', label: 'API Call', icon: getJobTypeIcon('api') },
                { value: 'queue', label: 'Queue Task', icon: getJobTypeIcon('queue') },
                { value: 'database', label: 'Database Query', icon: getJobTypeIcon('database') },
                { value: 'command', label: 'System Command', icon: getJobTypeIcon('command') },
              ]}
              value={formData.jobType || 'script'}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                jobType: (Array.isArray(value) ? value[0] : value) as any,
                config: {}
              }))}
              placeholder="Select Job Type"
            />
          </div>
        </div>

        {/* Job Type Specific Configuration */}
        {renderJobTypeConfig()}

        {/* Schedule Configuration */}
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule Configuration
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Schedule Preset
            </label>
            <SelectDropdown
              options={schedulePresets}
              value={schedulePreset}
              onChange={(value) => handleSchedulePresetChange(Array.isArray(value) ? value[0] : value as string)}
              placeholder="Select Preset"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cron Expression *
            </label>
            <Input
              type="text"
              value={formData.cronExpression || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, cronExpression: value }));
                setSchedulePreset('custom');
                
                // Validate cron expression
                if (value.trim()) {
                  const validation = validateCronExpression(value);
                  setCronValidation(validation);
                } else {
                  setCronValidation(null);
                }
              }}
              placeholder="0 0 * * *"
              required
              className={cronValidation && !cronValidation.valid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {cronValidation && (
              <div className={`mt-2 p-2 rounded-md flex items-start gap-2 ${
                cronValidation.valid 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                {cronValidation.valid ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {cronValidation.valid ? (
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Valid Expression
                      </p>
                      {cronValidation.description && (
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          {cronValidation.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Invalid Expression
                      </p>
                      {cronValidation.error && (
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                          {cronValidation.error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {!cronValidation && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Format: minute hour day month dayOfWeek (e.g., "0 0 * * *" = daily at midnight)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Timezone *
            </label>
            <SelectDropdown
              options={[
                { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'America/New_York (EST)' },
                { value: 'Europe/London', label: 'Europe/London (GMT)' },
                { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
              ]}
              value={formData.timezone || 'Asia/Kolkata'}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                timezone: Array.isArray(value) ? value[0] : value as string
              }))}
              placeholder="Select Timezone"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
                }))}
              />
            </div>
          </div>
        </div>

        {/* Job Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable job immediately
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            {job ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEditCronJobModal;

