'use client';

import { useAppSelector } from '@/hooks/redux';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, Filter, RefreshCw } from 'lucide-react';

export default function QCManagementPage() {
  const user = useAppSelector((state) => state.app.user);

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'QC Management', active: true }
  ];

  const qcStats = [
    { title: 'Total Surveys', value: '1,247', icon: Shield, color: 'bg-blue-500' },
    { title: 'Passed QC', value: '1,089', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Failed QC', value: '98', icon: XCircle, color: 'bg-red-500' },
    { title: 'Pending Review', value: '60', icon: Clock, color: 'bg-yellow-500' },
  ];

  const qcData = [
    { id: 'QC-001', surveyId: 'SUR-12345', district: 'Patna', status: 'passed', reviewer: 'John Doe', date: '2024-01-15', issues: 0 },
    { id: 'QC-002', surveyId: 'SUR-12346', district: 'Muzaffarpur', status: 'failed', reviewer: 'Jane Smith', date: '2024-01-15', issues: 3 },
    { id: 'QC-003', surveyId: 'SUR-12347', district: 'Gaya', status: 'pending', reviewer: 'Mike Johnson', date: '2024-01-14', issues: 0 },
    { id: 'QC-004', surveyId: 'SUR-12348', district: 'Bhagalpur', status: 'passed', reviewer: 'Sarah Wilson', date: '2024-01-14', issues: 1 },
    { id: 'QC-005', surveyId: 'SUR-12349', district: 'Darbhanga', status: 'failed', reviewer: 'Alex Brown', date: '2024-01-13', issues: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
              QC Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quality Control and Review Management System
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
              <Shield className="h-4 w-4 mr-2" />
              Start QC
            </Button>
          </div>
        </div>

        {/* QC Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qcStats.map((stat) => (
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

        {/* Quality Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quality Metrics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pass Rate
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  87.3%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.3%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Review Time
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  2.4 hrs
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Critical Issues
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  12
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Alerts
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    High failure rate in Muzaffarpur
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    QC backlog increasing
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    4 hours ago
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Patna district QC completed
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    6 hours ago
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* QC Review Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              QC Review Queue
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
                    QC ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Survey ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    District
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Reviewer
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Issues
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
                {qcData.map((qc) => (
                  <tr key={qc.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {qc.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {qc.surveyId}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">
                        {qc.district}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(qc.status)}`}>
                        {getStatusIcon(qc.status)}
                        <span className="ml-1 capitalize">{qc.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {qc.reviewer}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${
                        qc.issues === 0 ? 'text-green-600 dark:text-green-400' :
                        qc.issues <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {qc.issues}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {qc.date}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                        {qc.status === 'failed' && (
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
