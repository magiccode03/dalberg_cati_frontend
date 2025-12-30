'use client';

import { useAuth } from '@/contexts/AuthContext';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, Filter, RefreshCw, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

export default function ProgressOverviewPage() {
  const { user } = useAuth();

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Analysis', href: '/dashboard/analysis' },
    { label: 'Progress Overview', active: true }
  ];

  const progressData = [
    { district: 'Patna', completed: 95, pending: 5, total: 100, status: 'completed' },
    { district: 'Muzaffarpur', completed: 87, pending: 13, total: 100, status: 'in-progress' },
    { district: 'Gaya', completed: 92, pending: 8, total: 100, status: 'in-progress' },
    { district: 'Bhagalpur', completed: 78, pending: 22, total: 100, status: 'in-progress' },
    { district: 'Darbhanga', completed: 65, pending: 35, total: 100, status: 'pending' },
    { district: 'Purnia', completed: 45, pending: 55, total: 100, status: 'pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const overallProgress = progressData.reduce((acc, curr) => acc + curr.completed, 0) / (progressData.length * 100) * 100;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Progress Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track survey completion progress across all districts
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overall Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overall Progress
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overallProgress.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Districts
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {progressData.filter(d => d.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {progressData.filter(d => d.status === 'in-progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {progressData.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* District Progress Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              District-wise Progress
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    District
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Completed
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Pending
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Total
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Progress
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((district) => (
                  <tr key={district.district} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {district.district}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {district.completed}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        {district.pending}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {district.total}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${district.completed}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                          {district.completed}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`flex items-center justify-center space-x-1 ${getStatusColor(district.status)}`}>
                        {getStatusIcon(district.status)}
                        <span className="text-sm font-medium capitalize">
                          {district.status.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Progress Chart Placeholder */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Progress Trend Chart
          </h2>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Progress chart component will be implemented here
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
