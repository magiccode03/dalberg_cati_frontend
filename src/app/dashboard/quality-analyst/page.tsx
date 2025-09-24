'use client';

import { useAppSelector } from '@/hooks/redux';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { UserCheck, BarChart3, AlertTriangle, CheckCircle, Clock, Filter, RefreshCw } from 'lucide-react';

export default function QualityAnalystPage() {
  const user = useAppSelector((state) => state.app.user);

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Quality Analyst', active: true }
  ];

  const qualityStats = [
    { title: 'Total Reviews', value: '2,456', icon: UserCheck, color: 'bg-blue-500' },
    { title: 'Quality Score', value: '94.2%', icon: BarChart3, color: 'bg-green-500' },
    { title: 'Critical Issues', value: '23', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Pending Analysis', value: '67', icon: Clock, color: 'bg-yellow-500' },
  ];

  const analysisData = [
    { id: 'QA-001', surveyId: 'SUR-12345', district: 'Patna', qualityScore: 95, status: 'completed', analyst: 'John Doe', date: '2024-01-15' },
    { id: 'QA-002', surveyId: 'SUR-12346', district: 'Muzaffarpur', qualityScore: 78, status: 'in-progress', analyst: 'Jane Smith', date: '2024-01-15' },
    { id: 'QA-003', surveyId: 'SUR-12347', district: 'Gaya', qualityScore: 92, status: 'completed', analyst: 'Mike Johnson', date: '2024-01-14' },
    { id: 'QA-004', surveyId: 'SUR-12348', district: 'Bhagalpur', qualityScore: 65, status: 'failed', analyst: 'Sarah Wilson', date: '2024-01-14' },
    { id: 'QA-005', surveyId: 'SUR-12349', district: 'Darbhanga', qualityScore: 88, status: 'pending', analyst: 'Alex Brown', date: '2024-01-13' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quality Analyst
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quality Analysis and Review Management
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
              <UserCheck className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Quality Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityStats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quality Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quality Distribution
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Excellent (90-100%)
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  45%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Good (75-89%)
                </span>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  35%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Poor (&lt;75%)
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  20%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Trends
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Analysis Time
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  3.2 hrs
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completion Rate
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  89.5%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rejection Rate
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  10.5%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Issues
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Incomplete Data
                </span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  45%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  GPS Mismatch
                </span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  30%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duplicate Entries
                </span>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  25%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Analysis Queue Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analysis Queue
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
                    Analysis ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Survey ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    District
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Quality Score
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Analyst
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysisData.map((analysis) => (
                  <tr key={analysis.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analysis.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {analysis.surveyId}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">
                        {analysis.district}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-lg font-bold ${getQualityScoreColor(analysis.qualityScore)}`}>
                        {analysis.qualityScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                        {getStatusIcon(analysis.status)}
                        <span className="ml-1 capitalize">{analysis.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {analysis.analyst}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {analysis.date}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="sm">
                          Analyze
                        </Button>
                        {analysis.status === 'failed' && (
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
