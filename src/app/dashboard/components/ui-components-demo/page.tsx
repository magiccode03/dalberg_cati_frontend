'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Tooltip from '@/components/ui/Tooltip';
import LoadingSpinner, { ButtonSpinner, PageSpinner, CardSpinner, InlineSpinner } from '@/components/ui/LoadingSpinner';
import EmptyState, { NoDataEmptyState, NoResultsEmptyState, ErrorEmptyState, CreateEmptyState } from '@/components/ui/EmptyState';
import Pagination, { CompactPagination, SimplePagination } from '@/components/ui/Pagination';
import StatusBadge, { SuccessBadge, ErrorBadge, WarningBadge, InfoBadge, PendingBadge, ActiveBadge, InactiveBadge } from '@/components/ui/StatusBadge';
import ProgressBar, { CircularProgressBar, StepProgressBar } from '@/components/ui/ProgressBar';
import Switch, { ToggleSwitch, SwitchGroup } from '@/components/ui/Switch';
import Badge, { CountBadge, DotBadge, BadgeGroup, PrimaryBadge, SuccessBadge as BadgeSuccess, WarningBadge as BadgeWarning, ErrorBadge as BadgeError, InfoBadge as BadgeInfo, OutlineBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Info, Settings, User, Bell, Download, RefreshCw, Printer, Sun, Moon, Plus, Trash2, Edit, Eye } from 'lucide-react';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'UI Components Demo', active: true }
];

export default function UIComponentsDemoPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(65);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [toggleChecked, setToggleChecked] = useState(true);
  const [switches, setSwitches] = useState([
    { id: '1', label: 'Email Notifications', description: 'Receive email notifications', checked: true, onChange: (checked: boolean) => setSwitches(prev => prev.map(s => s.id === '1' ? { ...s, checked } : s)) },
    { id: '2', label: 'SMS Notifications', description: 'Receive SMS notifications', checked: false, onChange: (checked: boolean) => setSwitches(prev => prev.map(s => s.id === '2' ? { ...s, checked } : s)) },
    { id: '3', label: 'Push Notifications', description: 'Receive push notifications', checked: true, onChange: (checked: boolean) => setSwitches(prev => prev.map(s => s.id === '3' ? { ...s, checked } : s)) },
  ]);
  const [badges, setBadges] = useState([
    { id: '1', label: 'React', variant: 'primary' as const },
    { id: '2', label: 'TypeScript', variant: 'info' as const },
    { id: '3', label: 'Next.js', variant: 'success' as const },
    { id: '4', label: 'Tailwind CSS', variant: 'warning' as const },
    { id: '5', label: 'Redux', variant: 'error' as const },
  ]);

  const removeBadge = (id: string) => {
    setBadges(prev => prev.filter(badge => badge.id !== id));
  };

  const removeAllBadges = () => {
    setBadges([]);
  };

  const steps = [
    { id: '1', label: 'Personal Info', completed: true, active: false },
    { id: '2', label: 'Address', completed: true, active: false },
    { id: '3', label: 'Preferences', completed: false, active: true },
    { id: '4', label: 'Review', completed: false, active: false },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">UI Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of all UI components including tooltips, loading states, empty states, pagination, badges, progress bars, and switches
          </p>
        </div>

        {/* Tooltip Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tooltips</h2>
          <div className="flex flex-wrap gap-4">
            <Tooltip content="This is a tooltip on the top" position="top">
              <Button variant="outline">Top Tooltip</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on the bottom" position="bottom">
              <Button variant="outline">Bottom Tooltip</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on the left" position="left">
              <Button variant="outline">Left Tooltip</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on the right" position="right">
              <Button variant="outline">Right Tooltip</Button>
            </Tooltip>
            <Tooltip content="Click to toggle this tooltip" trigger="click">
              <Button variant="outline">Click Tooltip</Button>
            </Tooltip>
            <Tooltip content="Focus to show this tooltip" trigger="focus">
              <Button variant="outline">Focus Tooltip</Button>
            </Tooltip>
          </div>
        </div>

        {/* Loading Spinner Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Loading Spinners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Small</h3>
              <LoadingSpinner size="sm" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medium</h3>
              <LoadingSpinner size="md" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Large</h3>
              <LoadingSpinner size="lg" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">With Text</h3>
              <LoadingSpinner size="md" text="Loading..." />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Button disabled>
                <ButtonSpinner />
                Loading Button
              </Button>
              <InlineSpinner />
              <span className="text-sm text-gray-600 dark:text-gray-400">Inline spinner</span>
            </div>
          </div>
        </div>

        {/* Empty State Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Empty States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <NoDataEmptyState
                action={{
                  label: 'Add Data',
                  onClick: () => console.log('Add data clicked'),
                }}
              />
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <NoResultsEmptyState
                action={{
                  label: 'Clear Filters',
                  onClick: () => console.log('Clear filters clicked'),
                }}
              />
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <ErrorEmptyState
                action={{
                  label: 'Retry',
                  onClick: () => console.log('Retry clicked'),
                }}
              />
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <CreateEmptyState
                action={{
                  label: 'Create New',
                  onClick: () => console.log('Create new clicked'),
                }}
              />
            </div>
          </div>
        </div>

        {/* Pagination Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pagination</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Standard Pagination</h3>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
                showInfo
                totalItems={100}
                itemsPerPage={10}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compact Pagination</h3>
              <CompactPagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simple Pagination</h3>
              <SimplePagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        {/* Status Badge Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Badges</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Election Statuses</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="approved" />
                <StatusBadge status="rejected" />
                <StatusBadge status="under_review" />
                <StatusBadge status="draft" />
                <StatusBadge status="published" />
                <StatusBadge status="archived" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">QC Statuses</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="qc_pending" />
                <StatusBadge status="qc_approved" />
                <StatusBadge status="qc_rejected" />
                <StatusBadge status="under_qc" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Survey Statuses</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="survey_completed" />
                <StatusBadge status="survey_in_progress" />
                <StatusBadge status="survey_pending" />
                <StatusBadge status="survey_rejected" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Badges</h3>
              <div className="flex flex-wrap gap-2">
                <SuccessBadge>Success</SuccessBadge>
                <ErrorBadge>Error</ErrorBadge>
                <WarningBadge>Warning</WarningBadge>
                <InfoBadge>Info</InfoBadge>
                <PendingBadge>Pending</PendingBadge>
                <ActiveBadge>Active</ActiveBadge>
                <InactiveBadge>Inactive</InactiveBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Bars</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Linear Progress Bars</h3>
              <div className="space-y-4">
                <ProgressBar progress={progress} showLabel label="Progress" />
                <ProgressBar progress={progress} color="success" showLabel label="Success" />
                <ProgressBar progress={progress} color="warning" showLabel label="Warning" />
                <ProgressBar progress={progress} color="error" showLabel label="Error" />
                <ProgressBar progress={progress} striped animated showLabel label="Animated" />
              </div>
              <div className="mt-4">
                <Button onClick={() => setProgress(Math.min(100, progress + 10))} size="sm">
                  Increase Progress
                </Button>
                <Button onClick={() => setProgress(Math.max(0, progress - 10))} size="sm" className="ml-2">
                  Decrease Progress
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Circular Progress Bar</h3>
              <div className="flex justify-center">
                <CircularProgressBar progress={progress} showLabel />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Step Progress Bar</h3>
              <StepProgressBar steps={steps} currentStep={2} showLabels />
            </div>
          </div>
        </div>

        {/* Switch Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Switches</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Switches</h3>
              <div className="space-y-4">
                <Switch
                  checked={switchChecked}
                  onChange={setSwitchChecked}
                  label="Enable notifications"
                  description="Receive email notifications about important updates"
                />
                <Switch
                  checked={!switchChecked}
                  onChange={(checked) => setSwitchChecked(!checked)}
                  label="Dark mode"
                  description="Switch between light and dark themes"
                  color="success"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Toggle Switch</h3>
              <ToggleSwitch
                checked={toggleChecked}
                onChange={setToggleChecked}
                onIcon={<Sun className="h-3 w-3" />}
                offIcon={<Moon className="h-3 w-3" />}
                showLabels
                onLabel="Light"
                offLabel="Dark"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Switch Group</h3>
              <SwitchGroup
                switches={switches}
                title="Notification Settings"
                description="Configure how you want to receive notifications"
              />
            </div>
          </div>
        </div>

        {/* Badge Demo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <PrimaryBadge>Primary</PrimaryBadge>
                <BadgeSuccess>Success</BadgeSuccess>
                <BadgeWarning>Warning</BadgeWarning>
                <BadgeError>Error</BadgeError>
                <BadgeInfo>Info</BadgeInfo>
                <OutlineBadge>Outline</OutlineBadge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Badges with Icons</h3>
              <div className="flex flex-wrap gap-2">
                <Badge icon={<User className="h-3 w-3" />}>User</Badge>
                <Badge icon={<Settings className="h-3 w-3" />}>Settings</Badge>
                <Badge icon={<Bell className="h-3 w-3" />}>Notifications</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Removable Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge removable onRemove={() => console.log('Removed')}>Removable</Badge>
                <Badge removable onRemove={() => console.log('Removed')} variant="success">Success</Badge>
                <Badge removable onRemove={() => console.log('Removed')} variant="warning">Warning</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Count Badges</h3>
              <div className="flex flex-wrap gap-2">
                <CountBadge count={5} />
                <CountBadge count={99} />
                <CountBadge count={150} max={99} />
                <CountBadge count={0} showZero />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dot Badges</h3>
              <div className="flex flex-wrap gap-2">
                <DotBadge variant="error" />
                <DotBadge variant="success" />
                <DotBadge variant="warning" />
                <DotBadge variant="info" pulse />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Badge Group</h3>
              <BadgeGroup
                badges={badges}
                maxVisible={3}
                showRemoveAll
                onRemoveAll={removeAllBadges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
