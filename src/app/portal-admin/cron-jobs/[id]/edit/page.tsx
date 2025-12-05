'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Alert from '@/components/ui/Alert';
import { Calendar, Clock, Globe, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { validateCronExpression } from '@/lib/cron-expression-helper';
import CodeEditor from '@/components/ui/CodeEditor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
    params?: string;
    requestBody?: string;
    queueName?: string;
    sqlQuery?: string;
    command?: string;
  };
  retryConfig?: any;
  notificationConfig?: any;
}

export default function EditCronJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedulePreset, setSchedulePreset] = useState<string>('custom');
  const [cronValidation, setCronValidation] = useState<{ valid: boolean; error?: string; description?: string } | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    setFetching(true);
    setError(null);
    try {
      const response = await apiClient.get(`/cron-jobs/${jobId}`);
      if (response.data.success && response.data.data) {
        const job = response.data.data;
        setFormData({
          ...job,
          config: job.config || {},
        });
        if (job.cronExpression) {
          const validation = validateCronExpression(job.cronExpression);
          setCronValidation(validation);
        }
      } else {
        setError('Job not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch job');
    } finally {
      setFetching(false);
    }
  };

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
      const validation = validateCronExpression(preset);
      setCronValidation(validation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate API request body for POST/PUT/DELETE/PATCH
    if (formData.jobType === 'api') {
      const method = formData.config?.apiMethod || 'GET';
      const needsRequestBody = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
      if (needsRequestBody && !formData.config?.requestBody?.trim()) {
        setError('Request Body is required for ' + method + ' requests');
        return;
      }
    }
    
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
      await apiClient.put(`/cron-jobs/${jobId}`, formData);
      router.push(`/portal-admin/cron-jobs/${jobId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update cron job');
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
        const apiMethod = formData.config?.apiMethod || 'GET';
        const isGetRequest = apiMethod === 'GET';
        const needsRequestBody = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(apiMethod);
        
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
                value={apiMethod}
                onChange={(value) => {
                  const method = Array.isArray(value) ? value[0] : value as string;
                  setFormData(prev => ({
                    ...prev,
                    config: { 
                      ...prev?.config, 
                      apiMethod: method,
                      // Clear params/requestBody when method changes
                      params: method === 'GET' ? prev.config?.params : undefined,
                      requestBody: ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) ? prev.config?.requestBody : undefined
                    }
                  }));
                }}
                placeholder="Select Method"
              />
            </div>
            
            {/* Params for GET requests */}
            {isGetRequest && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Query Parameters (Optional)
                </label>
                <textarea
                  value={formData.config?.params || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    config: { ...prev?.config, params: e.target.value }
                  }))}
                  placeholder='{"key1": "value1", "key2": "value2"}'
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={4}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter JSON object for query parameters (e.g., {"{"}"key": "value"{"}"})
                </p>
              </div>
            )}
            
            {/* Request Body for POST/PUT/DELETE/PATCH */}
            {needsRequestBody && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request Body *
                </label>
                <textarea
                  value={formData.config?.requestBody || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    config: { ...prev?.config, requestBody: e.target.value }
                  }))}
                  placeholder='{"key": "value"}'
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={6}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter JSON object for request body (required for {apiMethod} requests)
                </p>
              </div>
            )}
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
            <CodeEditor
              value={formData.config?.sqlQuery || ''}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                config: { ...prev?.config, sqlQuery: value }
              }))}
              language="sql"
              placeholder="SELECT * FROM table WHERE..."
              height="auto"
              minHeight="200px"
              maxHeight="420px"
              editorClassName="max-h-[360px] overflow-y-auto"
              showLineNumbers={true}
              showToolbar={false}
              showStatusBar={false}
              showLanguageSelector={false}
              showThemeSelector={false}
              showFontSizeSelector={false}
              showTabSizeSelector={false}
              showSettings={false}
              showCopy={true}
              showDownload={false}
              showRun={false}
              showFormat={false}
              showMinimize={false}
              showMaximize={false}
              allowFullscreen={false}
              allowDownload={false}
              allowCopy={true}
              allowRun={false}
              allowFormat={false}
              allowSettings={false}
              compact={true}
              fontSize={14}
              tabSize={2}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Enter your SQL query. The query will be executed against the configured database.
            </p>
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

  if (fetching) {
    return (
      <Container maxWidth="7xl" className="w-full">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/portal-admin/cron-jobs/${jobId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
              Edit CRON Job
            </Heading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update job configuration
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side: Job Details */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Job Details
                  </h3>
                </div>

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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Type *
                  </label>
                  <SelectDropdown
                    options={[
                      { value: 'script', label: 'Script' },
                      { value: 'api', label: 'API Call' },
                      { value: 'queue', label: 'Queue Task' },
                      { value: 'command', label: 'System Command' },
                    ]}
                    value={formData.jobType || 'script'}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      jobType: (Array.isArray(value) ? value[0] : value) as any,
                      config: formData.jobType !== (Array.isArray(value) ? value[0] : value) ? {} : prev.config
                    }))}
                    placeholder="Select Job Type"
                  />
                </div>

                {/* Job Type Specific Configuration */}
                {renderJobTypeConfig()}
              </div>

              {/* Right Side: Schedule Configuration */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Schedule Configuration
                  </h3>
                </div>

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
                    <div className={`mt-2 p-3 rounded-md flex items-start gap-2 ${
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
            </div>

            {/* Job Status - Full Width */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                onClick={() => router.push(`/portal-admin/cron-jobs/${jobId}`)}
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
                Update Job
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
}

