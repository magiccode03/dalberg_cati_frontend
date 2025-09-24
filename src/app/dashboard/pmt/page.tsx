'use client';

import { useAppSelector } from '@/hooks/redux';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, FileText, BarChart3, Settings, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function PMTPage() {
  const user = useAppSelector((state) => state.app.user);

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'PMT System', active: true }
  ];

  const pmtStats = [
    { title: 'Total Agencies', value: '24', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Projects', value: '8', icon: FileText, color: 'bg-green-500' },
    { title: 'Completed Surveys', value: '1,247', icon: BarChart3, color: 'bg-purple-500' },
    { title: 'Pending Reviews', value: '156', icon: Settings, color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { id: 1, action: 'New agency registered', agency: 'ABC Survey Co.', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Survey completed', agency: 'XYZ Research', time: '4 hours ago', type: 'info' },
    { id: 3, action: 'Quality check failed', agency: 'Data Solutions', time: '6 hours ago', type: 'warning' },
    { id: 4, action: 'Project approved', agency: 'Field Works', time: '1 day ago', type: 'success' },
    { id: 5, action: 'Payment processed', agency: 'Survey Pro', time: '2 days ago', type: 'info' },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
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
              PMT System
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Project Management and Tracking System
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pmtStats.map((stat) => (
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

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Agencies</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Create Project</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>System Settings</span>
            </Button>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.agency}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Agency Management Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agency Management
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Agency
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Agency Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Contact
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Projects
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'ABC Survey Co.', contact: 'john@abc.com', status: 'active', projects: 3 },
                  { name: 'XYZ Research', contact: 'jane@xyz.com', status: 'active', projects: 2 },
                  { name: 'Data Solutions', contact: 'mike@data.com', status: 'pending', projects: 1 },
                  { name: 'Field Works', contact: 'sarah@field.com', status: 'active', projects: 4 },
                  { name: 'Survey Pro', contact: 'alex@survey.com', status: 'inactive', projects: 0 },
                ].map((agency, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {agency.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {agency.contact}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agency.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        agency.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {agency.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {agency.projects}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
