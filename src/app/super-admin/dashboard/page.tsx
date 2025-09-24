'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { 
  Users, 
  Shield, 
  Settings, 
  FileText, 
  Activity, 
  Server, 
  Database,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SystemStats {
  users: {
    total: number;
    active: number;
  };
  roles: {
    total: number;
    active: number;
  };
  features: {
    total: number;
    active: number;
  };
  pages: {
    total: number;
    active: number;
  };
}

interface SystemHealth {
  status: string;
  databases: {
    mysql: boolean;
    analytics: boolean;
    overall: boolean;
  };
  uptime: number;
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

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data since backend is not available
      // TODO: Replace with actual API calls when backend is ready
      const mockStats: SystemStats = {
        users: { total: 25, active: 23 },
        roles: { total: 8, active: 7 },
        features: { total: 45, active: 42 },
        pages: { total: 12, active: 12 }
      };

      const mockHealth: SystemHealth = {
        status: 'healthy',
        databases: { mysql: true, analytics: true, overall: true },
        uptime: 99.9,
        memory: { used: 2048, total: 8192, external: 1024 },
        cpu: { loadAverage: '0.5, 0.3, 0.2', uptime: 86400 }
      };

      setStats(mockStats);
      setHealth(mockHealth);
      setLastUpdated(new Date());

      // Uncomment when backend is ready:
      // const [systemInfoResponse, healthResponse] = await Promise.all([
      //   apiService.getSystemInfo(),
      //   apiService.getSystemHealth()
      // ]);
      // 
      // if (systemInfoResponse.success && healthResponse.success) {
      //   const systemInfo = systemInfoResponse.data;
      //   const healthData = healthResponse.data;
      //
      //   setStats({
      //     users: systemInfo.users,
      //     roles: systemInfo.roles,
      //     features: systemInfo.features,
      //     pages: {
      //       total: systemInfo.features?.totalPages || 0,
      //       active: systemInfo.features?.activePages || 0,
      //     }
      //   });
      //
      //   setHealth(healthData);
      //   setLastUpdated(new Date());
      // } else {
      //   setError('Failed to fetch system data');
      // }
    } catch (err) {
      setError('Error loading system data');
      console.error('Error fetching system data:', err);
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
        return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Super Admin Dashboard..." />
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name}. Manage system settings, users, and permissions.
        </p>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      {/* System Health Alert */}
      {health && (
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getHealthStatusIcon(health.status)}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    System Status: <span className={getHealthStatusColor(health.status)}>
                      {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uptime: {formatUptime(health.uptime)} | 
                    Memory: {health.memory.used}MB / {health.memory.total}MB | 
                    CPU Load: {health.cpu.loadAverage}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSystemData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.users.total}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {stats.users.active} active
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Roles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.roles.total}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {stats.roles.active} active
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Features</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.features.total}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {stats.features.active} active
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pages.total}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {stats.pages.active} active
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/super-admin/users'}
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/super-admin/roles'}
            >
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Roles</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/super-admin/features'}
            >
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Features</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/super-admin/pages'}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Pages</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Information
          </h3>
          {health && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-sm font-medium ${getHealthStatusColor(health.status)}`}>
                  {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uptime:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatUptime(health.uptime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {health.memory.used}MB / {health.memory.total}MB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database:</span>
                <span className={`text-sm font-medium ${health.databases.overall ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {health.databases.overall ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Database Status */}
      {health && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Database Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Database className={`h-5 w-5 ${health.databases.mysql ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">MySQL</p>
                <p className={`text-xs ${health.databases.mysql ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {health.databases.mysql ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BarChart3 className={`h-5 w-5 ${health.databases.analytics ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                <p className={`text-xs ${health.databases.analytics ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {health.databases.analytics ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Server className={`h-5 w-5 ${health.databases.overall ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Overall</p>
                <p className={`text-xs ${health.databases.overall ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {health.databases.overall ? 'Healthy' : 'Issues Detected'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
