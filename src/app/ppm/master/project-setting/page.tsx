'use client';

import React, { useState } from 'react';
// import { Card } from '@/components/ui/Card';
// import { Heading } from '@/components/ui/Heading';
// import { Text } from '@/components/ui/Text';
// import { Container } from '@/components/ui/Container';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Label } from '@/components/ui/Label';
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
    <div className="main-content horizontal-content">
      <div className="main-container container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="breadcrumb-header justify-content-between">
          <div className="left-content">
            <h1 className="main-content-title mg-b-0 mg-b-lg-1 text-2xl font-bold text-gray-800">
              Project Settings
            </h1>
          </div>
          <div className="justify-content-center mt-2"></div>
          <div className="right-content">
            <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
          </div>
        </div>

        <div className="row">
          {/* Settings Sidebar */}
          <div className="col-lg-4 col-xl-3">
            <div className="card custom-card shadow-sm bg-white rounded-lg border border-gray-200">
              <div className="card-header">
                <h4 className="card-title text-lg font-semibold">
                  Settings
                </h4>
              </div>
              <div className="main-content-left main-content-left-mail card-body">
                <div className="main-settings-menu">
                  <nav className="nav main-nav-column">
                    {settingsMenu.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          className={`nav-link thumb mb-2 w-full text-left px-4 py-3 rounded-lg transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                          }`}
                          onClick={() => handleTabClick(item.id)}
                        >
                          <IconComponent className="inline w-4 h-4 mr-3" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-8 col-xl-9">
            <div className="card custom-card shadow-sm bg-white rounded-lg border border-gray-200">
              <div className="card-header">
                <h4 className="card-title text-lg font-semibold">
                  Project Info
                </h4>
                <span className="text-sm text-gray-500 mt-1">
                  Last Update: 8 days ago
                </span>
              </div>

              <div className="card-body">
                <form id="ac-form" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Project Name */}
                    <div className="col-md-7">
                      <div className="form-group mb-4">
                        <label htmlFor="surveysetting-project_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Project Name
                        </label>
                        <input
                          type="text"
                          id="surveysetting-project_name"
                          className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.projectName}
                          onChange={(e) => handleInputChange('projectName', e.target.value)}
                        />
                        <div className="invalid-feedback"></div>
                      </div>
                    </div>

                    {/* Form ID */}
                    <div className="col-md-2">
                      <div className="form-group mb-4">
                        <label htmlFor="surveysetting-form_id" className="block text-sm font-medium text-gray-700 mb-2">
                          Form ID
                        </label>
                        <input
                          type="text"
                          id="surveysetting-form_id"
                          className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.formId}
                          onChange={(e) => handleInputChange('formId', e.target.value)}
                        />
                        <div className="invalid-feedback"></div>
                      </div>
                    </div>

                    {/* Voice Broadcast Announcement */}
                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label htmlFor="surveysetting-voice_broadcast_announcement_id" className="block text-sm font-medium text-gray-700 mb-2">
                          Voice Broadcast Announcement
                        </label>
                        <select
                          className="form-select"
                          value={formData.voiceBroadcastAnnouncementId}
                          onChange={(e) => handleInputChange('voiceBroadcastAnnouncementId', e.target.value)}
                        >
                          <option value="">Select Announcement</option>
                        </select>
                        <div className="invalid-feedback"></div>
                      </div>
                    </div>

                    {/* Project Manager IDs */}
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="surveysetting-pm_ids" className="block text-sm font-medium text-gray-700 mb-2">
                          Project Manager (Enter in Comma Separated for Multiple User)
                        </label>
                        <input
                          type="text"
                          id="surveysetting-pm_ids"
                          className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.pmIds}
                          onChange={(e) => handleInputChange('pmIds', e.target.value)}
                          placeholder="Enter in Comma Separated for Multiple User"
                        />
                        <div className="invalid-feedback"></div>
                      </div>
                    </div>

                    {/* Audio QC Web Form ID */}
                    <div className="col-md-2">
                      <div className="form-group mb-4">
                        <label htmlFor="surveysetting-audio_qc_form_id" className="block text-sm font-medium text-gray-700 mb-2">
                          Audio QC Web Form ID
                        </label>
                        <input
                          type="text"
                          id="surveysetting-audio_qc_form_id"
                          className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.audioQcFormId}
                          onChange={(e) => handleInputChange('audioQcFormId', e.target.value)}
                        />
                        <div className="invalid-feedback"></div>
                      </div>
                    </div>

                    {/* Audio Re-QC Web Form ID */}
                    <div className="col-md-2">
                      <div className="form-group mb-4">
                        <label htmlFor="surveysetting-audio_re_qc_form_id" className="block text-sm font-medium text-gray-700 mb-2">
                          Audio Re-QC Web Form ID
                        </label>
                        <input
                          type="text"
                          id="surveysetting-audio_re_qc_form_id"
                          className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.audioReQcFormId}
                          onChange={(e) => handleInputChange('audioReQcFormId', e.target.value)}
                        />
                        <div className="invalid-feedback"></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-md-12">
                      <div className="flex space-x-3">
                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-danger"
                          onClick={() => window.history.back()}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingPage;
