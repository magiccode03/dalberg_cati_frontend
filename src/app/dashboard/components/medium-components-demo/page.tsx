'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import MetricCard, { RevenueMetricCard, UsersMetricCard, ConversionMetricCard, ErrorMetricCard, MetricCardGrid } from '@/components/ui/MetricCard';
import SearchInput, { SearchInputWithResults } from '@/components/ui/SearchInput';
import Tabs, { Tab, TabList, TabPanel, TabPanels } from '@/components/ui/Tabs';
import Accordion, { SimpleAccordion } from '@/components/ui/Accordion';
import Alert, { InfoAlert, SuccessAlert, WarningAlert, ErrorAlert, AlertWithActions, AlertList } from '@/components/ui/Alert';
import Badge, { CountBadge, DotBadge, BadgeGroup } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, AlertCircle, Info, CheckCircle, AlertTriangle, X, Plus, Trash2, Edit, Eye, Settings, Bell, User, Database, BarChart3 } from 'lucide-react';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'Medium Priority Components Demo', active: true }
];

export default function MediumComponentsDemoPage() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: '1', title: 'Bihar Election 2025', description: 'Comprehensive election analysis dashboard', category: 'Project' },
    { id: '2', title: 'Vote Share Analysis', description: 'Detailed vote share breakdown by constituency', category: 'Analysis' },
    { id: '3', title: 'Quality Control', description: 'QC management and monitoring system', category: 'Management' },
  ]);
  const [alerts, setAlerts] = useState([
    { id: '1', type: 'info' as const, title: 'System Update', message: 'New features have been added to the dashboard.', dismissible: true },
    { id: '2', type: 'success' as const, title: 'Data Sync Complete', message: 'All data has been synchronized successfully.', dismissible: true },
    { id: '3', type: 'warning' as const, title: 'Maintenance Scheduled', message: 'System maintenance is scheduled for tonight at 2 AM.', dismissible: true },
    { id: '4', type: 'error' as const, title: 'Connection Error', message: 'Unable to connect to the database server.', dismissible: true },
  ]);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const removeAllAlerts = () => {
    setAlerts([]);
  };

  const tabs = [
    {
      id: 'tab1',
      label: 'Overview',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Overview Tab</h3>
          <p className="text-gray-600 dark:text-gray-400">
            This is the overview tab content. It contains general information about the dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Key Metrics</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Total Surveys: 1,250</li>
                <li>• Completed: 1,100</li>
                <li>• Pending: 150</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• 5 new surveys added</li>
                <li>• 12 surveys completed</li>
                <li>• 3 surveys rejected</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tab2',
      label: 'Analytics',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analytics Tab</h3>
          <p className="text-gray-600 dark:text-gray-400">
            This tab contains analytics and reporting features.
          </p>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Analytics Chart Placeholder</span>
          </div>
        </div>
      ),
    },
    {
      id: 'tab3',
      label: 'Settings',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Settings Tab</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your dashboard settings here.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Button size="sm" variant="outline">Toggle</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Button size="sm" variant="outline">Toggle</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Refresh</span>
              <Button size="sm" variant="outline">Toggle</Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const accordionItems = [
    {
      id: '1',
      title: 'Survey Management',
      content: (
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">
            Manage all survey-related activities including creation, editing, and monitoring.
          </p>
          <div className="flex space-x-2">
            <Button size="sm">Create Survey</Button>
            <Button size="sm" variant="outline">View All</Button>
          </div>
        </div>
      ),
      icon: <BarChart3 className="h-5 w-5" />,
      badge: '12',
    },
    {
      id: '2',
      title: 'Quality Control',
      content: (
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage quality control processes for all survey data.
          </p>
          <div className="flex space-x-2">
            <Button size="sm">QC Dashboard</Button>
            <Button size="sm" variant="outline">Reports</Button>
          </div>
        </div>
      ),
      icon: <CheckCircle className="h-5 w-5" />,
      badge: '5',
    },
    {
      id: '3',
      title: 'Data Analysis',
      content: (
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">
            Analyze survey data and generate insights for decision making.
          </p>
          <div className="flex space-x-2">
            <Button size="sm">Run Analysis</Button>
            <Button size="sm" variant="outline">Export Data</Button>
          </div>
        </div>
      ),
      icon: <Database className="h-5 w-5" />,
      badge: '8',
    },
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: 1250000,
      change: { value: 12.5, type: 'increase' as const, period: 'last month' },
      icon: <DollarSign className="h-5 w-5" />,
      color: 'green' as const,
      format: 'currency' as const,
    },
    {
      title: 'Active Users',
      value: 2450,
      change: { value: 8.2, type: 'increase' as const, period: 'last week' },
      icon: <Users className="h-5 w-5" />,
      color: 'blue' as const,
      format: 'number' as const,
    },
    {
      title: 'Conversion Rate',
      value: 3.2,
      change: { value: 2.1, type: 'decrease' as const, period: 'last month' },
      icon: <Target className="h-5 w-5" />,
      color: 'purple' as const,
      format: 'percentage' as const,
      precision: 1,
    },
    {
      title: 'Error Rate',
      value: 0.5,
      change: { value: 15.3, type: 'decrease' as const, period: 'last week' },
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'red' as const,
      format: 'percentage' as const,
      precision: 2,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medium Priority Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of medium-priority components including metric cards, search inputs, tabs, accordions, and alerts
          </p>
        </div>

        {/* Metric Cards Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metric Cards</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Metric Cards</h3>
              <MetricCardGrid metrics={metrics} columns={4} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Metric Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RevenueMetricCard
                  value={1250000}
                  change={{ value: 12.5, type: 'increase', period: 'last month' }}
                />
                <UsersMetricCard
                  value={2450}
                  change={{ value: 8.2, type: 'increase', period: 'last week' }}
                />
                <ConversionMetricCard
                  value={3.2}
                  change={{ value: 2.1, type: 'decrease', period: 'last month' }}
                />
                <ErrorMetricCard
                  value={0.5}
                  change={{ value: 15.3, type: 'decrease', period: 'last week' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Input Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Input</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Search Input</h3>
              <div className="max-w-md">
                <SearchInput
                  placeholder="Search surveys..."
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={(query) => console.log('Search:', query)}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search with Results</h3>
              <div className="max-w-md">
                <SearchInputWithResults
                  placeholder="Search with suggestions..."
                  results={searchResults}
                  onResultSelect={(result) => console.log('Selected:', result)}
                  renderResult={(result) => (
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-gray-500">{result.description}</div>
                      <div className="text-xs text-gray-400">{result.category}</div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tabs</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Tabs</h3>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="default"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pills Tabs</h3>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="pills"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cards Tabs</h3>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="cards"
              />
            </div>
          </div>
        </div>

        {/* Accordion Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accordion</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Accordion</h3>
              <Accordion
                items={accordionItems}
                allowMultiple={false}
                defaultOpenItems={['1']}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Multiple Open Accordion</h3>
              <Accordion
                items={accordionItems}
                allowMultiple={true}
                variant="bordered"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simple Accordion</h3>
              <SimpleAccordion
                title="Simple Accordion Item"
                defaultOpen={false}
                icon={<Settings className="h-5 w-5" />}
                badge="New"
              >
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    This is a simple accordion item with custom content.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm">Action 1</Button>
                    <Button size="sm" variant="outline">Action 2</Button>
                  </div>
                </div>
              </SimpleAccordion>
            </div>
          </div>
        </div>

        {/* Alert Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Alerts</h3>
              <div className="space-y-3">
                <InfoAlert title="Information" dismissible>
                  This is an informational alert with some important details.
                </InfoAlert>
                <SuccessAlert title="Success" dismissible>
                  Your action was completed successfully.
                </SuccessAlert>
                <WarningAlert title="Warning" dismissible>
                  Please review your input before proceeding.
                </WarningAlert>
                <ErrorAlert title="Error" dismissible>
                  An error occurred while processing your request.
                </ErrorAlert>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert with Actions</h3>
              <AlertWithActions
                type="warning"
                title="System Maintenance"
                actions={[
                  { label: 'Schedule', onClick: () => console.log('Schedule clicked') },
                  { label: 'Cancel', onClick: () => console.log('Cancel clicked'), variant: 'outline' },
                ]}
              >
                System maintenance is scheduled for tonight. Please save your work and log out before 2 AM.
              </AlertWithActions>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert List</h3>
              <AlertList
                alerts={alerts}
                onDismissAll={removeAllAlerts}
                showDismissAll
              />
            </div>
          </div>
        </div>

        {/* Badge Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Count Badges</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-400" />
                  <CountBadge count={5} />
                </div>
                <div className="relative">
                  <User className="h-6 w-6 text-gray-400" />
                  <CountBadge count={99} />
                </div>
                <div className="relative">
                  <Settings className="h-6 w-6 text-gray-400" />
                  <CountBadge count={150} max={99} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dot Badges</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">A</span>
                  </div>
                  <DotBadge variant="error" />
                </div>
                <div className="relative">
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">B</span>
                  </div>
                  <DotBadge variant="success" />
                </div>
                <div className="relative">
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">C</span>
                  </div>
                  <DotBadge variant="warning" pulse />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
