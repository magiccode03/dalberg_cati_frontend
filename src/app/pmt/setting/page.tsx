'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Info, Filter, Hash, Calendar, ToggleLeft, File, ArrowLeft } from 'lucide-react';

interface ProjectSetting {
  projectName: string;
  formId: string;
  voiceBroadcastAnnouncementId: string;
  pmIds: string;
  audioQcFormId: string;
  audioReQcFormId: string;
}

const settingMenuItems = [
  { id: 'project-info', label: 'Project Info', icon: Info, href: '/pmt/setting', active: true },
  { id: 'instance-parsing', label: 'Instance Parsing', icon: Filter, href: '/pmt/setting/instance', active: false },
  { id: 'sample-size', label: 'Sample Size', icon: Hash, href: '/pmt/setting/sample', active: false },
  { id: 'survey-dates', label: 'Survey Dates', icon: Calendar, href: '/pmt/setting/dates', active: false },
  { id: 'project-themes', label: 'Project Themes', icon: ToggleLeft, href: '/pmt/setting/theme', active: false },
  { id: 'question-type', label: 'Question Type', icon: File, href: '/pmt/setting/questiontype', active: false },
];

const announcementOptions = [
  { value: '', label: 'Select Announcement' },
];

export default function ProjectSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectSetting>({
    projectName: 'Bihar 2025 Baseline',
    formId: '33',
    voiceBroadcastAnnouncementId: '',
    pmIds: '1390,1392,1393',
    audioQcFormId: '54',
    audioReQcFormId: '55',
  });

  const handleInputChange = (field: keyof ProjectSetting, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle success/error
    }, 1000);
  };

  const handleBack = () => {
    window.location.href = '/pmt/setting/index';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Project Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage project configuration and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Menu */}
          <div className="lg:col-span-1">
            <Card>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Settings
                </h3>
                <nav className="space-y-2">
                  {settingMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          item.active
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Project Info
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Last Update: 7 days ago
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Project Name */}
                    <div className="md:col-span-7">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Project Name
                        </label>
                        <Input
                          type="text"
                          value={formData.projectName}
                          onChange={(e) => handleInputChange('projectName', e.target.value)}
                          placeholder="Enter project name"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Form ID */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Form ID
                        </label>
                        <Input
                          type="text"
                          value={formData.formId}
                          onChange={(e) => handleInputChange('formId', e.target.value)}
                          placeholder="Form ID"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Voice Broadcast Announcement */}
                    <div className="md:col-span-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Voice Broadcast Announcement
                        </label>
                        <SelectDropdown
                          options={announcementOptions}
                          value={formData.voiceBroadcastAnnouncementId}
                          onChange={(value) => handleInputChange('voiceBroadcastAnnouncementId', Array.isArray(value) ? value[0] : value)}
                          placeholder="Select Announcement"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Project Manager IDs */}
                    <div className="md:col-span-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Project Manager (Enter in Comma Separated for Multiple User)
                        </label>
                        <Input
                          type="text"
                          value={formData.pmIds}
                          onChange={(e) => handleInputChange('pmIds', e.target.value)}
                          placeholder="Enter in Comma Separated for Multiple User"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Audio QC Web Form ID */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Audio QC Web Form ID
                        </label>
                        <Input
                          type="text"
                          value={formData.audioQcFormId}
                          onChange={(e) => handleInputChange('audioQcFormId', e.target.value)}
                          placeholder="Audio QC Form ID"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Audio Re-QC Web Form ID */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Audio Re-QC Web Form ID
                        </label>
                        <Input
                          type="text"
                          value={formData.audioReQcFormId}
                          onChange={(e) => handleInputChange('audioReQcFormId', e.target.value)}
                          placeholder="Audio Re-QC Form ID"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-12">
                      <div className="flex space-x-4">
                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                        >
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleBack}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
