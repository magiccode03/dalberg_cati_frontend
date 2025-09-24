'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ExportButton, { CSVExportButton, ExcelExportButton, JSONExportButton, PDFExportButton } from '@/components/ui/ExportButton';
import RefreshButton, { AutoRefreshButton, RefreshButtonWithTimer, QuickRefreshButton, FullRefreshButton } from '@/components/ui/RefreshButton';
import PrintButton, { PrintButtonWithOptions, QuickPrintButton, PrintPageButton } from '@/components/ui/PrintButton';
import ThemeToggle, { SimpleThemeToggle, ThemeToggleWithLabel, ThemeSelector } from '@/components/ui/ThemeToggle';
import UserMenu, { SimpleUserMenu, UserMenuWithNotifications } from '@/components/ui/UserMenu';
import Button from '@/components/ui/Button';
import { Download, RefreshCw, Printer, Sun, Moon, User, Settings, LogOut, Bell, Shield, HelpCircle, CreditCard, BarChart3 } from 'lucide-react';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'Utility Components Demo', active: true }
];

export default function UtilityComponentsDemoPage() {
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notificationCount, setNotificationCount] = useState(5);

  // Sample data for export
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive' },
  ];

  // Sample user data
  const sampleUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@biharelection.gov.in',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe',
    role: 'Administrator',
    status: 'online' as const,
  };

  const handleExport = async (data: any, format: string) => {
    setExportLoading(true);
    console.log(`Exporting data as ${format}:`, data);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setExportLoading(false);
    alert(`Data exported as ${format.toUpperCase()} successfully!`);
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    console.log('Refreshing data...');
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRefreshLoading(false);
    alert('Data refreshed successfully!');
  };

  const handlePrint = () => {
    console.log('Printing...');
    alert('Print functionality would be implemented here!');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    alert('Logout functionality would be implemented here!');
  };

  const handleProfileClick = () => {
    console.log('Opening profile...');
    alert('Profile page would open here!');
  };

  const handleSettingsClick = () => {
    console.log('Opening settings...');
    alert('Settings page would open here!');
  };

  const handleNotificationClick = () => {
    console.log('Opening notifications...');
    setNotificationCount(0);
    alert('Notifications panel would open here!');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    console.log('Theme changed to:', newTheme);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Utility Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of utility components including export, refresh, print, theme toggle, and user menu functionality
          </p>
        </div>

        {/* Export Button Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Export Button</h3>
              <div className="flex flex-wrap gap-3">
                <ExportButton
                  data={sampleData}
                  filename="users"
                  format="csv"
                  onExport={handleExport}
                  loading={exportLoading}
                />
                <ExportButton
                  data={sampleData}
                  filename="users"
                  format="xlsx"
                  onExport={handleExport}
                  loading={exportLoading}
                />
                <ExportButton
                  data={sampleData}
                  filename="users"
                  format="json"
                  onExport={handleExport}
                  loading={exportLoading}
                />
                <ExportButton
                  data={sampleData}
                  filename="users"
                  format="pdf"
                  onExport={handleExport}
                  loading={exportLoading}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export with Format Selector</h3>
              <ExportButton
                data={sampleData}
                filename="users"
                showFormatSelector
                onExport={handleExport}
                loading={exportLoading}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Export Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <CSVExportButton
                  data={sampleData}
                  filename="users"
                  onExport={handleExport}
                  loading={exportLoading}
                />
                <ExcelExportButton
                  data={sampleData}
                  filename="users"
                  onExport={handleExport}
                  loading={exportLoading}
                />
                <JSONExportButton
                  data={sampleData}
                  filename="users"
                  onExport={handleExport}
                  loading={exportLoading}
                />
                <PDFExportButton
                  data={sampleData}
                  filename="users"
                  onExport={handleExport}
                  loading={exportLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Refresh Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Refresh Button</h3>
              <div className="flex flex-wrap gap-3">
                <RefreshButton
                  onRefresh={handleRefresh}
                  loading={refreshLoading}
                />
                <RefreshButton
                  onRefresh={handleRefresh}
                  loading={refreshLoading}
                  icon="rotate-ccw"
                >
                  Reload Data
                </RefreshButton>
                <RefreshButton
                  onRefresh={handleRefresh}
                  loading={refreshLoading}
                  icon="rotate-cw"
                  size="sm"
                  variant="ghost"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto Refresh Button</h3>
              <AutoRefreshButton
                onRefresh={handleRefresh}
                loading={refreshLoading}
                autoRefresh={false}
                autoRefreshInterval={30000}
                onAutoRefreshToggle={(enabled) => console.log('Auto refresh:', enabled)}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Refresh with Timer</h3>
              <RefreshButtonWithTimer
                onRefresh={handleRefresh}
                loading={refreshLoading}
                showTimer
                timerFormat="auto"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Refresh Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <QuickRefreshButton
                  onRefresh={handleRefresh}
                  loading={refreshLoading}
                />
                <FullRefreshButton
                  onRefresh={handleRefresh}
                  loading={refreshLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Print Button Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Print Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Print Button</h3>
              <div className="flex flex-wrap gap-3">
                <PrintButton
                  title="Print Page"
                  onPrint={handlePrint}
                />
                <PrintButton
                  title="Print Table"
                  target="#sample-table"
                  onPrint={handlePrint}
                />
                <QuickPrintButton
                  title="Quick Print"
                  onPrint={handlePrint}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Print with Options</h3>
              <PrintButtonWithOptions
                title="Print with Options"
                onPrint={handlePrint}
                printOptions={{
                  showHeader: true,
                  showFooter: true,
                  orientation: 'portrait',
                  paperSize: 'A4',
                }}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Print Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <PrintPageButton
                  title="Print Current Page"
                  onPrint={handlePrint}
                />
                <QuickPrintButton
                  title="Quick Print"
                  onPrint={handlePrint}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Toggle</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Theme Toggle</h3>
              <div className="flex flex-wrap gap-3">
                <ThemeToggle
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />
                <SimpleThemeToggle
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />
                <ThemeToggleWithLabel
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Selector</h3>
              <ThemeSelector
                theme={theme}
                onThemeChange={handleThemeChange}
                showCurrentTheme
                showDescriptions
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Selector with All Options</h3>
              <ThemeToggle
                theme={theme}
                onThemeChange={handleThemeChange}
                showThemeSelector
                showSystemOption
              />
            </div>
          </div>
        </div>

        {/* User Menu Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Menu</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic User Menu</h3>
              <div className="flex flex-wrap gap-3">
                <UserMenu
                  user={sampleUser}
                  onLogout={handleLogout}
                  onProfileClick={handleProfileClick}
                  onSettingsClick={handleSettingsClick}
                />
                <SimpleUserMenu
                  user={sampleUser}
                  onLogout={handleLogout}
                  onProfileClick={handleProfileClick}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Menu with Notifications</h3>
              <UserMenuWithNotifications
                user={sampleUser}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                showNotifications
                notificationCount={notificationCount}
                onNotificationClick={handleNotificationClick}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Menu with Custom Items</h3>
              <UserMenu
                user={sampleUser}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                menuItems={[
                  {
                    id: 'profile',
                    label: 'Profile',
                    icon: <User className="h-4 w-4" />,
                    onClick: () => handleProfileClick(),
                  },
                  {
                    id: 'settings',
                    label: 'Settings',
                    icon: <Settings className="h-4 w-4" />,
                    onClick: () => handleSettingsClick(),
                  },
                  {
                    id: 'analytics',
                    label: 'Analytics',
                    icon: <BarChart3 className="h-4 w-4" />,
                    onClick: () => alert('Analytics clicked'),
                  },
                  {
                    id: 'billing',
                    label: 'Billing',
                    icon: <CreditCard className="h-4 w-4" />,
                    onClick: () => alert('Billing clicked'),
                  },
                  {
                    id: 'help',
                    label: 'Help & Support',
                    icon: <HelpCircle className="h-4 w-4" />,
                    onClick: () => alert('Help clicked'),
                  },
                  {
                    id: 'divider',
                    label: '',
                    onClick: () => {},
                    divider: true,
                  },
                  {
                    id: 'logout',
                    label: 'Sign Out',
                    icon: <LogOut className="h-4 w-4" />,
                    onClick: () => handleLogout(),
                    danger: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Sample Table for Print Demo */}
        <div id="sample-table" className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sample Table (for Print Demo)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Role</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.role}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
