'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Download, Users, Calendar, Shield, Heart, UserCheck } from 'lucide-react';

interface GenderWiseData {
  ac_code: number;
  ac_name: string;
  male_min_sample: number;
  female_min_sample: number;
  male_covered: number;
  female_covered: number;
  male_balance: number;
  female_balance: number;
  sample_achieved: number;
}

interface GenderWiseAPIResponse {
  success: boolean;
  data: {
    constituencies: GenderWiseData[];
    summary: {
      total_sample_achieved: number;
      total_male_quota: number;
      total_female_quota: number;
      total_male_covered: number;
      total_female_covered: number;
      total_male_balance: number;
      total_female_balance: number;
    };
  };
  message: string;
  timestamp: string;
}

// Age Wise Data Interface
interface AgeWiseData {
  ac_code: number;
  ac_name: string;
  sample_achieved: number;
  age_groups: {
    '18_24': { quota: number; covered: number; balance: number };
    '25_34': { quota: number; covered: number; balance: number };
    '35_50': { quota: number; covered: number; balance: number };
    '50_above': { quota: number; covered: number; balance: number };
  };
}

// Age Wise API Response Interface
interface AgeWiseAPIResponse {
  success: boolean;
  data: {
    summary: {
      total_sample_achieved: number;
      age_groups: {
        '18_24': { quota: number; covered: number; balance: number };
        '25_34': { quota: number; covered: number; balance: number };
        '35_50': { quota: number; covered: number; balance: number };
        '50_above': { quota: number; covered: number; balance: number };
      };
    };
    constituencies: AgeWiseData[];
  };
  message: string;
  timestamp: string;
}

// Caste Wise Data Interface
interface CasteData {
  caste_name: string;
  caste_code: string;
  quota: number;
  covered: number;
  balance: number;
  rank: number;
}

interface CasteWiseData {
  ac_code: number;
  ac_name: string;
  sample_achieved: number;
  castes: CasteData[];
}

// Caste Wise API Response Interface
interface CasteWiseAPIResponse {
  success: boolean;
  data: {
    summary: {
      total_sample_achieved: number;
      total_castes: number;
    };
    constituencies: CasteWiseData[];
  };
  message: string;
  timestamp: string;
}

// Religion Wise Data Interface
interface ReligionData {
  population: string;
  sample: number;
  difference: number;
}

interface ReligionWiseData {
  ac_code: number;
  ac_name: string;
  sample_achieved: number;
  hindu: ReligionData;
  muslim: ReligionData;
  christian: ReligionData;
  others: ReligionData;
}

// Religion Wise API Response Interface
interface ReligionWiseAPIResponse {
  success: boolean;
  data: {
    summary: {
      total_sample: number;
      hindu: ReligionData;
      muslim: ReligionData;
      christian: ReligionData;
      others: ReligionData;
    };
    ac_data: ReligionWiseData[];
  };
  message: string;
  timestamp: string;
}

// Social Category Wise Data Interface
interface SocialCategoryData {
  population: string;
  sample: string;
  difference: string;
}

interface SocialCategoryWiseData {
  ac_code: number;
  ac_name: string;
  sample_achieved: number;
  sc: SocialCategoryData;
  st: SocialCategoryData;
  general_obc: SocialCategoryData;
}

// Social Category Wise API Response Interface
interface SocialCategoryWiseAPIResponse {
  success: boolean;
  data: {
    summary: {
      total_sample: number;
      sc: SocialCategoryData;
      st: SocialCategoryData;
      general_obc: SocialCategoryData;
    };
    ac_data: SocialCategoryWiseData[];
  };
  message: string;
  timestamp: string;
}

export default function PPMTDemographicPage() {
  const [activeTab, setActiveTab] = useState('genderwise');

  // No API calls needed - using empty data

  const tabs = [
    { id: 'genderwise', label: 'Gender Wise', href: '/ppmt/demographic', icon: Users },
    { id: 'agewise', label: 'Age Wise', href: '/ppmt/demographic/agewise', icon: Calendar },
    { id: 'castewise', label: 'Caste Wise', href: '/ppmt/demographic/castewise', icon: Shield },
    { id: 'religionwise', label: 'Religion Wise', href: '/ppmt/demographic/religionwise', icon: Heart },
    { id: 'socialcategorywise', label: 'Social Category Wise', href: '/ppmt/demographic/socialcategorywise', icon: UserCheck }
  ];

  const handleDownload = () => {
    console.log('No data available for download');
  };

  const getCellStyle = (value: number, isFemale: boolean = false) => {
    if (isFemale && value < 120) {
      return 'bg-red-500 text-white';
    }
    if (!isFemale && value > 150) {
      return 'bg-red-500 text-white';
    }
    return '';
  };

  const renderGenderWiseTable = () => {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">Gender Wise Data Not Found</Text>
      </div>
    );
  };

  const getAgeWiseBalanceStyle = (balance: number) => {
    if (balance < 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderAgeWiseTable = () => {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">Age Wise Data Not Found</Text>
      </div>
    );
  };

  const getCasteBalanceStyle = (balance: number) => {
    if (balance < 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderCasteWiseTable = () => {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">Caste Wise Data Not Found</Text>
      </div>
    );
  };

  const getReligionDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderReligionWiseTable = () => {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">Religion Wise Data Not Found</Text>
      </div>
    );
  };

  const getSocialCategoryDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderSocialCategoryWiseTable = () => {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">Social Category Wise Data Not Found</Text>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'genderwise':
        return renderGenderWiseTable();
      case 'agewise':
        return renderAgeWiseTable();
      case 'castewise':
        return renderCasteWiseTable();
      case 'religionwise':
        return renderReligionWiseTable();
      case 'socialcategorywise':
        return renderSocialCategoryWiseTable();
      default:
        return renderGenderWiseTable();
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'genderwise':
        return 'Demographic Representation : Gender Wise Proportions(%)';
      case 'agewise':
        return 'Demographic Representation : Age Wise Proportions(%)';
      case 'castewise':
        return 'Demographic Representation : Caste Wise Proportions(%)';
      case 'religionwise':
        return 'Demographic Representation : Religion Wise Proportions(%)';
      case 'socialcategorywise':
        return 'Demographic Representation : Social Category Wise Proportions(%)';
      default:
        return 'Demographic Representation : Gender Wise Proportions(%)';
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            {getPageTitle()}
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Main Card */}
      <Card className="p-6">
        {/* Card Header */}
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div></div>
            <Button variant="primary" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="panel panel-primary tabs-style-2 mb-6">
          <div className="tab-menu-heading">
            <div className="tabs-menu1">
              <ul className="nav panel-tabs main-nav-line flex flex-wrap border-b border-gray-200">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <li key={tab.id} className="mr-1">
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-link px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="panel-body tabs-menu-body main-content-body-right border table-responsive">
          <div className="bootstrap-table bootstrap5">
            <div className="table-responsive">
              {renderContent()}
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
