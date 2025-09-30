'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Radio from '@/components/ui/Radio';
import Textarea from '@/components/ui/Textarea';
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

  const [instanceData, setInstanceData] = useState({
    instanceLoi: '180',
    instanceAudio1: 'consent',
    instanceAudio2: '',
    instanceAudio3: '',
  });

  const [sampleData, setSampleData] = useState({
    totalSample: '72900',
    acSample: '300',
    pollingStationSample: '13',
    enumeratorSample: '30',
    femaleQuota: '12',
    psCircleRadius: '3000',
  });

  const [surveyDatesData, setSurveyDatesData] = useState({
    surveyStartDate: '2025-04-05',
    surveyEndDate: '',
  });

  const [projectThemesData, setProjectThemesData] = useState({
    qcTheme: '1', // Light
    clientTheme: '1', // Light
    pmtTheme: '1', // Light
    qualityTheme: '1', // Light
  });

  const [questionTypeData, setQuestionTypeData] = useState({
    jsonData: `{
    "form_name": "string",
    "gp_sec_a": "string",
    "spd_sec_a_iden": "string",
    "state_name": "string",
    "pc_name": "string",
    "pc_code": "string",
    "ac_name": "string",
    "ac_code": "string",
    "zone_code": "string",
    "zone_name": "string",
    "district_code": "string",
    "district_name": "string",
    "mla_name": "string",
    "mp_name": "string",
    "bye_poll": "string",
    "gps_boundary": "string",
    "user_name": "string",
    "survey_date": "string",
    "gps": "string",
    "lot_no": "integer",
    "ps_name": "string",
    "spd_ps_data": "string",
    "rt_polling_station_no": "string",
    "rt_polling_station_english": "string",
    "rt_gps_coordinates": "string",
    "rt_booster": "string",
    "sample_type": "string",
    "locality": "integer",
    "resp_caste_jati": "integer",
    "spd_distance": "string",
    "distance": "string",
    "spd_int_name": "string",
    "int_name": "string",
    "int_id": "integer",
    "spd_sup_name": "string",
    "sup_name": "string",
    "sup_id": "integer",
    "consent": "integer",
    "reg_voter": "integer",
    "resp_age": "integer",
    "resp_gender": "integer",
    "end_gp_sec_a": "string",
    "gp_vp": "string",
    "q6": "integer",
    "q6_oth": "string",
    "q7": "string",
    "q7_1": "integer",
    "q7_2": "integer",
    "q7_3": "integer",
    "q7_4": "integer",
    "q7_5": "integer",
    "q7_6": "integer",
    "q7_7": "integer",
    "q7_8": "integer",
    "q7_44": "integer",
    "q7_99": "integer",
    "q7_reason_code": "integer",
    "q7_oth": "string",
    "q8": "integer",
    "q8_oth": "string",
    "q9": "integer",
    "q9_oth": "string",
    "q9_a": "integer",
    "q9_a_oth": "integer",
    "q10": "integer",
    "q10_oth": "string",
    "gp_ar": "string",
    "q11": "integer",
    "q11_oth": "string",
    "q12": "integer",
    "q13": "integer",
    "q14": "integer",
    "gp_ti": "string",
    "q15": "string",
    "q15_1": "integer",
    "q15_2": "integer",
    "q15_3": "integer",
    "q15_4": "integer",
    "q15_5": "integer",
    "q15_6": "integer",
    "q15_7": "integer",
    "q15_8": "integer",
    "q15_9": "integer",
    "q15_10": "integer",
    "q15_99": "integer",
    "q15_oth": "string",
    "q16": "string",
    "q16_1": "integer",
    "q16_2": "integer",
    "q16_3": "integer",
    "q16_4": "integer",
    "q16_5": "integer",
    "q16_6": "integer",
    "q16_7": "integer",
    "q16_8": "integer",
    "q16_9": "integer",
    "q16_10": "integer",
    "q16_99": "integer",
    "q16_oth": "string",
    "gp_party_img": "string",
    "spd_q17": "string",
    "q17_1": "string",
    "q17_1_1": "integer",
    "q17_1_2": "integer",
    "q17_1_3": "integer",
    "q17_1_4": "integer",
    "q17_1_5": "integer",
    "q17_1_6": "integer",
    "q17_2": "string",
    "q17_2_1": "integer",
    "q17_2_2": "integer",
    "q17_2_3": "integer",
    "q17_2_4": "integer",
    "q17_2_5": "integer",
    "q17_2_6": "integer",
    "q17_3": "string",
    "q17_3_1": "integer",
    "q17_3_2": "integer",
    "q17_3_3": "integer",
    "q17_3_4": "integer",
    "q17_3_5": "integer",
    "q17_3_6": "integer",
    "q17_4": "string",
    "q17_4_1": "integer",
    "q17_4_2": "integer",
    "q17_4_3": "integer",
    "q17_4_4": "integer",
    "q17_4_5": "integer",
    "q17_4_6": "integer",
    "q17_5": "string",
    "q17_5_1": "integer",
    "q17_5_2": "integer",
    "q17_5_3": "integer",
    "q17_5_4": "integer",
    "q17_5_5": "integer",
    "q17_5_6": "integer",
    "q17_6": "string",
    "q17_6_1": "integer",
    "q17_6_2": "integer",
    "q17_6_3": "integer",
    "q17_6_4": "integer",
    "q17_6_5": "integer",
    "q17_6_6": "integer",
    "q17_7": "string",
    "q17_7_1": "integer",
    "q17_7_2": "integer",
    "q17_7_3": "integer",
    "q17_7_4": "integer",
    "q17_7_5": "integer",
    "q17_7_6": "integer",
    "gp_leadership": "string",
    "spd_q18": "string",
    "q18": "string",
    "q18_a": "string",
    "q18_a_1": "integer",
    "q18_a_2": "integer",
    "q18_a_3": "integer",
    "q18_a_4": "integer",
    "q18_a_5": "integer",
    "q18_a_6": "integer",
    "q18_a_7": "integer",
    "q18_b": "string",
    "q18_b_1": "integer",
    "q18_b_2": "integer",
    "q18_b_3": "integer",
    "q18_b_4": "integer",
    "q18_b_5": "integer",
    "q18_b_6": "integer",
    "q18_b_7": "integer",
    "q18_c": "string",
    "q18_c_1": "integer",
    "q18_c_2": "integer",
    "q18_c_3": "integer",
    "q18_c_4": "integer",
    "q18_c_5": "integer",
    "q18_c_6": "integer",
    "q18_c_7": "integer",
    "q18_d": "string",
    "q18_d_1": "integer",
    "q18_d_2": "integer",
    "q18_d_3": "integer",
    "q18_d_4": "integer",
    "q18_d_5": "integer",
    "q18_d_6": "integer",
    "q18_d_7": "integer",
    "q18_e": "string",
    "q18_e_1": "integer",
    "q18_e_2": "integer",
    "q18_e_3": "integer",
    "q18_e_4": "integer",
    "q18_e_5": "integer",
    "q18_e_6": "integer",
    "q18_e_7": "integer",
    "q19": "string",
    "q19_1": "integer",
    "q19_2": "integer",
    "q19_3": "integer",
    "q19_4": "integer",
    "q19_5": "integer",
    "q19_6": "integer",
    "q19_7": "integer",
    "q19_8": "integer",
    "q19_9": "integer",
    "q19_44": "integer",
    "q20": "string",
    "q20_1": "integer",
    "q20_2": "integer",
    "q20_3": "integer",
    "q20_4": "integer",
    "q20_5": "integer",
    "q20_6": "integer",
    "q20_7": "integer",
    "q20_8": "integer",
    "q20_9": "integer",
    "q20_44": "integer",
    "q20_a": "string",
    "q20_b": "string",
    "q21": "integer",
    "q21_oth": "string",
    "gp_basicdemo_sec": "string",
    "op_sindoor": "integer",
    "resp_religion": "integer",
    "resp_religion_oth": "string",
    "resp_social_cat": "integer",
    "resp_family_income": "integer",
    "resp_name": "string",
    "resp_mobile": "integer",
    "resp_mobile_no": "string",
    "serial_no": "integer",
    "DeviceId": "string",
    "StartTime": "string",
    "EndTime": "string",
    "user_id": "integer",
    "form_id": "integer",
    "form_version": "integer",
    "server_id": "integer",
    "server_time": "string",
    "app_version": "integer",
    "app_sno": "integer",
    "open_count": "string",
    "duration": "string",
    "duration_mins": "string",
    "meta": "string",
    "gps_lat": "decimal",
    "gps_lng": "decimal",
    "gps_accuracy": "decimal",
    "audit": "string",
    "audio1": "string",
    "audio1_duration": "string",
    "weight": "string",
    "status": "string",
    "status_client": "string",
    "reason_reject": "string",
    "total_duration": "string",
    "qc": "string",
    "tele_qc": "string",
    "tele_qc_status": "string",
    "audio_qc_status": "string",
    "over_achievement": "string"
}`,
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

  const handleInstanceInputChange = (field: string, value: string) => {
    setInstanceData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSampleInputChange = (field: string, value: string) => {
    setSampleData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSurveyDatesInputChange = (field: string, value: string) => {
    setSurveyDatesData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProjectThemesInputChange = (field: string, value: string) => {
    setProjectThemesData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionTypeInputChange = (field: string, value: string) => {
    setQuestionTypeData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleInstanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Instance form submitted:', instanceData);
    // Handle instance form submission logic here
  };

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sample form submitted:', sampleData);
    // Handle sample form submission logic here
  };

  const handleSurveyDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey dates form submitted:', surveyDatesData);
    // Handle survey dates form submission logic here
  };

  const handleProjectThemesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Project themes form submitted:', projectThemesData);
    // Handle project themes form submission logic here
  };

  const handleQuestionTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Question type form submitted:', questionTypeData);
    // Handle question type form submission logic here
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
            {/* Project Info Tab */}
            {activeTab === 'project-info' && (
              <>
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
              </>
            )}

            {/* Instance Parsing Tab */}
            {activeTab === 'instance-parsing' && (
              <>
                <div className="mb-6">
                  <Heading level={4}>Instance Parsing</Heading>
                  <Text className="text-sm text-gray-500 mt-1">
                    Last Update: 12 days ago
                  </Text>
                </div>

                <form onSubmit={handleInstanceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Length of Interview */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Length of Interview</Text>
                        <Input
                          type="number"
                          value={instanceData.instanceLoi}
                          onChange={(e) => handleInstanceInputChange('instanceLoi', e.target.value)}
                          placeholder="Enter Min LOI(sec) for Success"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Instance Audio 1 Tag */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Instance Audio 1 Tag</Text>
                        <Input
                          type="text"
                          value={instanceData.instanceAudio1}
                          onChange={(e) => handleInstanceInputChange('instanceAudio1', e.target.value)}
                          placeholder="Audio 1 Tag"
                        />
                      </div>
                    </div>

                    {/* Instance Audio 2 Tag */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Instance Audio 2 Tag</Text>
                        <Input
                          type="text"
                          value={instanceData.instanceAudio2}
                          onChange={(e) => handleInstanceInputChange('instanceAudio2', e.target.value)}
                          placeholder="Audio 2 Tag"
                        />
                      </div>
                    </div>

                    {/* Instance Audio 3 Tag */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Instance Audio 3 Tag</Text>
                        <Input
                          type="text"
                          value={instanceData.instanceAudio3}
                          onChange={(e) => handleInstanceInputChange('instanceAudio3', e.target.value)}
                          placeholder="Audio 3 Tag"
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
              </>
            )}

            {/* Sample Size Tab */}
            {activeTab === 'sample-size' && (
              <>
                <div className="mb-6">
                  <Heading level={4}>Sample Size</Heading>
                  <Text className="text-sm text-gray-500 mt-1">
                    Last Update: 12 days ago
                  </Text>
                </div>

                <form onSubmit={handleSampleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Target Sample */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Total Target Sample</Text>
                        <Input
                          type="number"
                          value={sampleData.totalSample}
                          onChange={(e) => handleSampleInputChange('totalSample', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Sample Per AC */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Sample Per AC</Text>
                        <Input
                          type="number"
                          value={sampleData.acSample}
                          onChange={(e) => handleSampleInputChange('acSample', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Polling Station Sample */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Polling Station Sample</Text>
                        <Input
                          type="number"
                          value={sampleData.pollingStationSample}
                          onChange={(e) => handleSampleInputChange('pollingStationSample', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Per Day Sample of Enumerator */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Per Day Sample of Enumerator</Text>
                        <Input
                          type="number"
                          value={sampleData.enumeratorSample}
                          onChange={(e) => handleSampleInputChange('enumeratorSample', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Female Quota */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Female Quota</Text>
                        <Input
                          type="number"
                          value={sampleData.femaleQuota}
                          onChange={(e) => handleSampleInputChange('femaleQuota', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Polling Station Circle Radius */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Polling Station Circle Radius (In Meter)</Text>
                        <Input
                          type="number"
                          value={sampleData.psCircleRadius}
                          onChange={(e) => handleSampleInputChange('psCircleRadius', e.target.value)}
                          min="0"
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
              </>
            )}

            {/* Survey Dates Tab */}
            {activeTab === 'survey-dates' && (
              <>
                <div className="mb-6">
                  <Heading level={4}>Survey Dates</Heading>
                  <Text className="text-sm text-gray-500 mt-1">
                    Last Update: 12 days ago
                  </Text>
                </div>

                <form onSubmit={handleSurveyDatesSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Survey Start Date */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Survey Start Date</Text>
                        <Input
                          type="date"
                          value={surveyDatesData.surveyStartDate}
                          onChange={(e) => handleSurveyDatesInputChange('surveyStartDate', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Survey End Date */}
                    <div>
                      <div className="space-y-2">
                        <Text className="text-sm font-medium">Survey End Date</Text>
                        <Input
                          type="date"
                          value={surveyDatesData.surveyEndDate}
                          onChange={(e) => handleSurveyDatesInputChange('surveyEndDate', e.target.value)}
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
              </>
            )}

            {/* Project Themes Tab */}
            {activeTab === 'project-themes' && (
              <>
                <div className="mb-6">
                  <Heading level={4}>Project Themes</Heading>
                  <Text className="text-sm text-gray-500 mt-1">
                    Last Update: 12 days ago
                  </Text>
                </div>

                <form onSubmit={handleProjectThemesSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quality Check Theme */}
                    <div>
                      <div className="space-y-3">
                        <Text className="text-sm font-medium">Quality Check Theme</Text>
                        <div className="space-y-2">
                          <Radio
                            name="qcTheme"
                            value="1"
                            checked={projectThemesData.qcTheme === '1'}
                            onChange={(e) => handleProjectThemesInputChange('qcTheme', e.target.value)}
                            label="Light"
                          />
                          <Radio
                            name="qcTheme"
                            value="2"
                            checked={projectThemesData.qcTheme === '2'}
                            onChange={(e) => handleProjectThemesInputChange('qcTheme', e.target.value)}
                            label="Dark"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Area Theme */}
                    <div>
                      <div className="space-y-3">
                        <Text className="text-sm font-medium">Client Area Theme</Text>
                        <div className="space-y-2">
                          <Radio
                            name="clientTheme"
                            value="1"
                            checked={projectThemesData.clientTheme === '1'}
                            onChange={(e) => handleProjectThemesInputChange('clientTheme', e.target.value)}
                            label="Light"
                          />
                          <Radio
                            name="clientTheme"
                            value="2"
                            checked={projectThemesData.clientTheme === '2'}
                            onChange={(e) => handleProjectThemesInputChange('clientTheme', e.target.value)}
                            label="Dark"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PMT Theme */}
                    <div>
                      <div className="space-y-3">
                        <Text className="text-sm font-medium">PMT Theme</Text>
                        <div className="space-y-2">
                          <Radio
                            name="pmtTheme"
                            value="1"
                            checked={projectThemesData.pmtTheme === '1'}
                            onChange={(e) => handleProjectThemesInputChange('pmtTheme', e.target.value)}
                            label="Light"
                          />
                          <Radio
                            name="pmtTheme"
                            value="2"
                            checked={projectThemesData.pmtTheme === '2'}
                            onChange={(e) => handleProjectThemesInputChange('pmtTheme', e.target.value)}
                            label="Dark"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Quality Theme */}
                    <div>
                      <div className="space-y-3">
                        <Text className="text-sm font-medium">Data Quality Theme</Text>
                        <div className="space-y-2">
                          <Radio
                            name="qualityTheme"
                            value="1"
                            checked={projectThemesData.qualityTheme === '1'}
                            onChange={(e) => handleProjectThemesInputChange('qualityTheme', e.target.value)}
                            label="Light"
                          />
                          <Radio
                            name="qualityTheme"
                            value="2"
                            checked={projectThemesData.qualityTheme === '2'}
                            onChange={(e) => handleProjectThemesInputChange('qualityTheme', e.target.value)}
                            label="Dark"
                          />
                        </div>
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
              </>
            )}

            {/* Question Type Tab */}
            {activeTab === 'question-type' && (
              <>
                <div className="mb-6">
                  <Heading level={4}>Question Type for SPSS File</Heading>
                  <Text className="text-sm text-gray-500 mt-1">
                    Last Update: 4 months ago
                  </Text>
                </div>

                <form onSubmit={handleQuestionTypeSubmit} className="space-y-6">
                  <div>
                    <div className="space-y-2">
                      <Text className="text-sm font-medium">Question Types for SPSS</Text>
                      <Textarea
                        value={questionTypeData.jsonData}
                        onChange={(e) => handleQuestionTypeInputChange('jsonData', e.target.value)}
                        placeholder="Question Type Json Data"
                        rows={15}
                        className="font-mono text-sm"
                      />
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
              </>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ProjectSettingPage;
