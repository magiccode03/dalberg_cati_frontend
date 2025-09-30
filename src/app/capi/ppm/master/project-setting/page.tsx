'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { 
  Info, 
  Filter, 
  Hash, 
  Calendar, 
  ToggleLeft, 
  File 
} from 'lucide-react';

const ProjectSettingPage = () => {
  const [formData, setFormData] = useState({
    projectName: 'Bihar 2025 Baseline',
    formId: '33',
    voiceBroadcastAnnouncementId: '',
    pmIds: '1390,1392,1393',
    audioQcFormId: '54',
    audioReQcFormId: '55',
  });

  const [activeTab, setActiveTab] = useState('project-info');

  const settingsMenu = [
    {
      id: 'project-info',
      label: 'Project Info',
      icon: Info,
      href: '/bh/poll202504/pmt/setting',
    },
    {
      id: 'instance-parsing',
      label: 'Instance Parsing',
      icon: Filter,
      href: '/bh/poll202504/pmt/setting/instance',
    },
    {
      id: 'sample-size',
      label: 'Sample Size',
      icon: Hash,
      href: '/bh/poll202504/pmt/setting/sample',
    },
    {
      id: 'survey-dates',
      label: 'Survey Dates',
      icon: Calendar,
      href: '/bh/poll202504/pmt/setting/dates',
    },
    {
      id: 'project-themes',
      label: 'Project Themes',
      icon: ToggleLeft,
      href: '/bh/poll202504/pmt/setting/theme',
    },
    {
      id: 'question-type',
      label: 'Question Type',
      icon: File,
      href: '/bh/poll202504/pmt/setting/questiontype',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      <Heading level={1} className="mb-6">
        Project Settings
      </Heading>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <Heading level={4} className="mb-4">
              Settings
            </Heading>
            <nav className="space-y-2">
              {settingsMenu.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    <Text className="font-medium">{item.label}</Text>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <Card className="p-6">
            <div className="mb-6">
              <Heading level={4}>Project Info</Heading>
              <Text className="text-sm text-gray-500 mt-1">
                Last Update: 8 days ago
              </Text>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-5">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium">Project Name</Text>
                    <Input
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                </div>

                {/* Form ID */}
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium">Form ID</Text>
                    <Input
                      type="text"
                      value={formData.formId}
                      onChange={(e) => handleInputChange('formId', e.target.value)}
                      placeholder="Form ID"
                    />
                  </div>
                </div>
              </div>

              {/* Voice Broadcast Announcement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="space-y-2">
                    <Text className="text-sm font-medium">Voice Broadcast Announcement</Text>
                    <SelectDropdown
                      options={[
                        { value: '', label: 'Select Announcement' },
                        { value: '1', label: 'Announcement 1' },
                        { value: '2', label: 'Announcement 2' },
                      ]}
                      value={formData.voiceBroadcastAnnouncementId}
                      onChange={(value) => handleInputChange('voiceBroadcastAnnouncementId', value as string)}
                      placeholder="Select Announcement"
                    />
                  </div>
                </div>
              </div>

              {/* Project Manager IDs */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-4">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium">Project Manager IDs</Text>
                    <Input
                      type="text"
                      value={formData.pmIds}
                      onChange={(e) => handleInputChange('pmIds', e.target.value)}
                      placeholder="Enter in Comma Separated for Multiple User"
                    />
                  </div>
                </div>

                {/* Audio QC Web Form ID */}
                <div className="md:col-span-1">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium">Audio QC Web Form ID</Text>
                    <Input
                      type="text"
                      value={formData.audioQcFormId}
                      onChange={(e) => handleInputChange('audioQcFormId', e.target.value)}
                      placeholder="Form ID"
                    />
                  </div>
                </div>

                {/* Audio Re-QC Web Form ID */}
                <div className="md:col-span-1">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium">Audio Re-QC Web Form ID</Text>
                    <Input
                      type="text"
                      value={formData.audioReQcFormId}
                      onChange={(e) => handleInputChange('audioReQcFormId', e.target.value)}
                      placeholder="Form ID"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="primary">
                  Update
                </Button>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ProjectSettingPage;
