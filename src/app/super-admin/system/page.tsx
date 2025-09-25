'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Server, 
  Database, 
  Activity, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  ArrowLeft,
  Monitor,
  Globe,
  Shield,
  Users,
  Settings,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SystemHealth {
  status: string;
  timestamp: string;
  databases: {
    mysql: boolean;
    analytics: boolean;
    overall: boolean;
  };
  uptime: number;
  version: string;
  environment: string;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  cpu: {
    loadAverage: string;
    uptime: number;
  };
}

interface SystemInfo {
  system: {
    version: string;
    environment: string;
    uptime: number;
    nodeVersion: string;
    platform: string;
    arch: string;
  };
  database: {
    mysql: {
      connected: boolean;
      version: string;
    };
    analytics: {
      connected: boolean;
      version: string;
    };
  };
  features: {
    totalFeatures: number;
    activeFeatures: number;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
  };
  roles: {
    totalRoles: number;
    activeRoles: number;
  };
}

export default function SuperAdminSystemPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSystemData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthResponse, infoResponse] = await Promise.all([
        apiService.getSystemHealth(),
        apiService.getSystemInfo()
      ]);

      if (healthResponse.success && infoResponse.success) {
        setHealth(healthResponse.data);
        setSystemInfo(infoResponse.data);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch system data');
      }
    } catch (err) {
      setError('Error loading system data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getMemoryUsagePercentage = () => {
    if (!health) return 0;
    return Math.round((health.memory.used / health.memory.total) * 100);
  };

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert type="error" title="Access Denied">
          You do not have permission to access system information.
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading system information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert type="error" title="Error" className="mb-4">
          {error}
        </Alert>
        <Button onClick={fetchSystemData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/super-admin/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={fetchSystemData} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          System Information
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor system health, performance, and configuration.
        </p>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      {/* System Health Overview */}
      {health && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
                <div className="flex items-center mt-1">
                  {getHealthStatusIcon(health.status)}
                  <span className={`ml-2 text-lg font-semibold ${getHealthStatusColor(health.status)}`}>
                    {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                  </span>
                </div>
              </div>
              <Server className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatUptime(health.uptime)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getMemoryUsagePercentage()}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {health.memory.used}MB / {health.memory.total}MB
                </p>
              </div>
              <MemoryStick className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>
        </div>
      )}

      {/* System Information */}
      {systemInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Version:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemInfo.system.version}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Environment:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemInfo.system.environment}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Node Version:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemInfo.system.nodeVersion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Platform:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemInfo.system.platform} ({systemInfo.system.arch})
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Database Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">MySQL:</span>
                </div>
                <div className="flex items-center">
                  {systemInfo.database.mysql.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {systemInfo.database.mysql.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Analytics:</span>
                </div>
                <div className="flex items-center">
                  {systemInfo.database.analytics.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {systemInfo.database.analytics.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Statistics */}
      {systemInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemInfo.users.totalUsers}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {systemInfo.users.activeUsers} active
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Roles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemInfo.roles.totalRoles}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {systemInfo.roles.activeRoles} active
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Features</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemInfo.features.totalFeatures}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {systemInfo.features.activeFeatures} active
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemInfo.features.totalPages || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {systemInfo.features.activePages || 0} active
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {health && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Cpu className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Load</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {health.cpu.loadAverage}
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <MemoryStick className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {health.memory.used}MB
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                of {health.memory.total}MB total
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <HardDrive className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">External Memory</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {health.memory.external}MB
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
