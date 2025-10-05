'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Download, Users, Calendar, Shield, Heart, UserCheck } from 'lucide-react';
import { apiService } from '@/lib/api';

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
  const [genderWiseData, setGenderWiseData] = useState<GenderWiseData[]>([]);
  const [ageWiseData, setAgeWiseData] = useState<AgeWiseData[]>([]);
  const [casteWiseData, setCasteWiseData] = useState<CasteWiseData[]>([]);
  const [religionWiseData, setReligionWiseData] = useState<ReligionWiseData[]>([]);
  const [socialCategoryWiseData, setSocialCategoryWiseData] = useState<SocialCategoryWiseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API based on active tab
  useEffect(() => {
    if (activeTab === 'genderwise') {
      fetchGenderWiseData();
    } else if (activeTab === 'agewise') {
      fetchAgeWiseData();
    } else if (activeTab === 'castewise') {
      fetchCasteWiseData();
    } else if (activeTab === 'religionwise') {
      fetchReligionWiseData();
    } else if (activeTab === 'socialcategorywise') {
      fetchSocialCategoryWiseData();
    }
  }, [activeTab]);

  const fetchGenderWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDemographicGenderWise();
      
      if (response.success) {
        setGenderWiseData(response.data.constituencies);
      } else {
        setError('Failed to fetch gender wise data');
      }
    } catch (err) {
      setError('Error fetching gender wise data');
      console.error('Error fetching gender wise data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgeWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDemographicAgeWise();
      
      if (response.success) {
        setAgeWiseData(response.data.constituencies);
      } else {
        setError('Failed to fetch age wise data');
      }
    } catch (err) {
      setError('Error fetching age wise data');
      console.error('Error fetching age wise data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCasteWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDemographicCasteWise();
      
      if (response.success) {
        setCasteWiseData(response.data.constituencies);
      } else {
        setError('Failed to fetch caste wise data');
      }
    } catch (err) {
      setError('Error fetching caste wise data');
      console.error('Error fetching caste wise data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReligionWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDemographicReligionWise();
      
      if (response.success) {
        setReligionWiseData(response.data.ac_data);
      } else {
        setError('Failed to fetch religion wise data');
      }
    } catch (err) {
      setError('Error fetching religion wise data');
      console.error('Error fetching religion wise data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialCategoryWiseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDemographicSocialCategoryWise();
      
      if (response.success) {
        setSocialCategoryWiseData(response.data.ac_data);
      } else {
        setError('Failed to fetch social category wise data');
      }
    } catch (err) {
      setError('Error fetching social category wise data');
      console.error('Error fetching social category wise data:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'genderwise', label: 'Gender Wise', href: '/ppmt/demographic', icon: Users },
    { id: 'agewise', label: 'Age Wise', href: '/ppmt/demographic/agewise', icon: Calendar },
    { id: 'castewise', label: 'Caste Wise', href: '/ppmt/demographic/castewise', icon: Shield },
    { id: 'religionwise', label: 'Religion Wise', href: '/ppmt/demographic/religionwise', icon: Heart },
    { id: 'socialcategorywise', label: 'Social Category Wise', href: '/ppmt/demographic/socialcategorywise', icon: UserCheck }
  ];

  const handleDownload = () => {
    if (activeTab === 'genderwise' && genderWiseData.length > 0) {
      generateGenderWiseCSV();
    } else if (activeTab === 'agewise' && ageWiseData.length > 0) {
      generateAgeWiseCSV();
    } else if (activeTab === 'castewise' && casteWiseData.length > 0) {
      generateCasteWiseCSV();
    } else if (activeTab === 'religionwise' && religionWiseData.length > 0) {
      generateReligionWiseCSV();
    } else if (activeTab === 'socialcategorywise' && socialCategoryWiseData.length > 0) {
      generateSocialCategoryWiseCSV();
    } else {
    console.log('Downloading demographic data...');
    }
  };

  const generateGenderWiseCSV = () => {
    const headers = [
      'AC Name',
      'AC Code', 
      'Sample Achieved',
      'Male Quota',
      'Male Covered',
      'Male Balance',
      'Female Quota',
      'Female Covered',
      'Female Balance'
    ];

    const csvContent = [
      headers.join(','),
      ...genderWiseData.map(row => [
        `"${row.ac_name}"`,
        row.ac_code,
        row.sample_achieved,
        row.male_min_sample,
        row.male_covered,
        row.male_balance,
        row.female_min_sample,
        row.female_covered,
        row.female_balance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demographic-genderwise-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateAgeWiseCSV = () => {
    const headers = [
      'AC Name',
      'AC Code', 
      'Sample Achieved',
      '18-24 Quota',
      '18-24 Covered',
      '18-24 Balance',
      '25-34 Quota',
      '25-34 Covered',
      '25-34 Balance',
      '35-50 Quota',
      '35-50 Covered',
      '35-50 Balance',
      '50+ Quota',
      '50+ Covered',
      '50+ Balance'
    ];

    const csvContent = [
      headers.join(','),
      ...ageWiseData.map(row => [
        `"${row.ac_name}"`,
        row.ac_code,
        row.sample_achieved,
        row.age_groups['18_24'].quota,
        row.age_groups['18_24'].covered,
        row.age_groups['18_24'].balance,
        row.age_groups['25_34'].quota,
        row.age_groups['25_34'].covered,
        row.age_groups['25_34'].balance,
        row.age_groups['35_50'].quota,
        row.age_groups['35_50'].covered,
        row.age_groups['35_50'].balance,
        row.age_groups['50_above'].quota,
        row.age_groups['50_above'].covered,
        row.age_groups['50_above'].balance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demographic-agewise-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCasteWiseCSV = () => {
    // Create headers dynamically based on max number of castes
    const maxCastes = Math.max(...casteWiseData.map(row => row.castes.length));
    const baseHeaders = ['AC Name', 'AC Code', 'Sample Achieved'];
    const casteHeaders: string[] = [];
    
    for (let i = 1; i <= maxCastes; i++) {
      casteHeaders.push(
        `Caste ${i} Name`,
        `Caste ${i} Code`,
        `Caste ${i} Quota`,
        `Caste ${i} Covered`,
        `Caste ${i} Balance`,
        `Caste ${i} Rank`
      );
    }

    const headers = [...baseHeaders, ...casteHeaders];

    const csvContent = [
      headers.join(','),
      ...casteWiseData.map(row => {
        const baseData = [
          `"${row.ac_name}"`,
          row.ac_code,
          row.sample_achieved
        ];
        
        const casteData: (string | number)[] = [];
        for (let i = 0; i < maxCastes; i++) {
          const caste = row.castes[i];
          if (caste) {
            casteData.push(
              `"${caste.caste_name}"`,
              caste.caste_code,
              caste.quota,
              caste.covered,
              caste.balance,
              caste.rank
            );
          } else {
            casteData.push('', '', '', '', '', '');
          }
        }
        
        return [...baseData, ...casteData].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demographic-castewise-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReligionWiseCSV = () => {
    const headers = [
      'AC Name',
      'AC Code',
      'Sample Achieved',
      'Hindu Population',
      'Hindu Sample',
      'Hindu Difference',
      'Muslim Population',
      'Muslim Sample',
      'Muslim Difference',
      'Christian Population',
      'Christian Sample',
      'Christian Difference',
      'Others Population',
      'Others Sample',
      'Others Difference'
    ];

    const csvContent = [
      headers.join(','),
      ...religionWiseData.map(row => [
        `"${row.ac_name}"`,
        row.ac_code,
        row.sample_achieved,
        row.hindu.population,
        row.hindu.sample,
        row.hindu.difference,
        row.muslim.population,
        row.muslim.sample,
        row.muslim.difference,
        row.christian.population,
        row.christian.sample,
        row.christian.difference,
        row.others.population,
        row.others.sample,
        row.others.difference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demographic-religionwise-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSocialCategoryWiseCSV = () => {
    const headers = [
      'AC Name',
      'AC Code',
      'Sample Achieved',
      'SC Population',
      'SC Sample',
      'SC Difference',
      'ST Population',
      'ST Sample',
      'ST Difference',
      'General OBC Population',
      'General OBC Sample',
      'General OBC Difference'
    ];

    const csvContent = [
      headers.join(','),
      ...socialCategoryWiseData.map(row => [
        `"${row.ac_name}"`,
        row.ac_code,
        row.sample_achieved,
        row.sc.population,
        row.sc.sample,
        row.sc.difference,
        row.st.population,
        row.st.sample,
        row.st.difference,
        row.general_obc.population,
        row.general_obc.sample,
        row.general_obc.difference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demographic-socialcategorywise-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading gender wise data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      );
    }

    return (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th>AC Name</th>
          <th className="text-center">AC Code</th>
          <th className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Male
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Female
          </th>
        </tr>
        <tr>
          <th></th>
          <th className="text-center"></th>
          <th className="text-center"></th>
          <th className="text-center border-r-2">Male Quota</th>
          <th className="text-center border-r-2">Male covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Female Quota</th>
          <th className="text-center border-r-2">Female covered</th>
          <th className="text-center border-r-2">Balance</th>
        </tr>
      </thead>
      <tbody>
          {genderWiseData.map((row, index) => (
            <tr key={row.ac_code}>
              <td>{row.ac_name}</td>
              <td className="text-center">{row.ac_code}</td>
              <td className="text-center">{row.sample_achieved}</td>
              <td className="text-center">{row.male_min_sample}</td>
              <td className={`text-center ${getCellStyle(row.male_covered)}`}>
                {row.male_covered}
            </td>
              <td className="text-center">{row.male_balance}</td>
              <td className="text-center">{row.female_min_sample}</td>
              <td className={`text-center ${getCellStyle(row.female_covered, true)}`}>
                {row.female_covered}
            </td>
              <td className="text-center">{row.female_balance}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
  };

  const getAgeWiseBalanceStyle = (balance: number) => {
    if (balance < 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderAgeWiseTable = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Text>Loading age wise data...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <Text className="text-red-600">Error: {error}</Text>
        </div>
      );
    }

    return (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th>AC Name</th>
          <th className="text-center">AC Code</th>
          <th className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            18-24 Years
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            25-34 Years
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
              35-50 Years
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            50+ Years
          </th>
        </tr>
        <tr>
          <th></th>
          <th className="text-center"></th>
          <th className="text-center"></th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {ageWiseData.map((row) => (
            <tr key={row.ac_code}>
              <td>{row.ac_name}</td>
              <td className="text-center">{row.ac_code}</td>
              <td className="text-center">{row.sample_achieved}</td>
              <td className="text-center">{row.age_groups['18_24'].quota}</td>
              <td className="text-center">{row.age_groups['18_24'].covered}</td>
              <td className={`text-center ${getAgeWiseBalanceStyle(row.age_groups['18_24'].balance)}`}>
                {row.age_groups['18_24'].balance}
              </td>
              <td className="text-center">{row.age_groups['25_34'].quota}</td>
              <td className="text-center">{row.age_groups['25_34'].covered}</td>
              <td className={`text-center ${getAgeWiseBalanceStyle(row.age_groups['25_34'].balance)}`}>
                {row.age_groups['25_34'].balance}
              </td>
              <td className="text-center">{row.age_groups['35_50'].quota}</td>
              <td className="text-center">{row.age_groups['35_50'].covered}</td>
              <td className={`text-center ${getAgeWiseBalanceStyle(row.age_groups['35_50'].balance)}`}>
                {row.age_groups['35_50'].balance}
              </td>
              <td className="text-center">{row.age_groups['50_above'].quota}</td>
              <td className="text-center">{row.age_groups['50_above'].covered}</td>
              <td className={`text-center ${getAgeWiseBalanceStyle(row.age_groups['50_above'].balance)}`}>
                {row.age_groups['50_above'].balance}
              </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
  };

  const getCasteBalanceStyle = (balance: number) => {
    if (balance < 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderCasteWiseTable = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Text>Loading caste wise data...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <Text className="text-red-600">Error: {error}</Text>
        </div>
      );
    }

    // Determine the maximum number of castes across all constituencies
    const maxCastes = Math.max(...casteWiseData.map(row => row.castes.length));
    
    return (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th rowSpan={2}>AC Name</th>
          <th rowSpan={2} className="text-center">AC Code</th>
          <th rowSpan={2} className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 1
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 2
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 3
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 4
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 5
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 6
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 7
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 8
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 9
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Caste 10
          </th>
        </tr>
        <tr>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Name</th>
          <th className="text-center border-r-2">Quota</th>
          <th className="text-center border-r-2">Covered</th>
          <th className="text-center border-r-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {casteWiseData.map((row) => (
          <tr key={row.ac_code}>
            <td>{row.ac_name}</td>
            <td className="text-center">{row.ac_code}</td>
            <td className="text-center">{row.sample_achieved}</td>
            {/* Render up to 10 castes */}
            {Array.from({ length: 10 }).map((_, index) => {
              const caste = row.castes[index];
              if (caste) {
                return (
                  <React.Fragment key={index}>
                    <td className="text-center">{caste.caste_name}</td>
                    <td className="text-center">{caste.quota}</td>
                    <td className="text-center">{caste.covered}</td>
                    <td className={`text-center ${getCasteBalanceStyle(caste.balance)}`}>
                      {caste.balance}
                    </td>
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment key={index}>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
                  </React.Fragment>
                );
              }
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
  };

  const getReligionDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderReligionWiseTable = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Text>Loading religion wise data...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <Text className="text-red-600">Error: {error}</Text>
        </div>
      );
    }

    return (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th rowSpan={2}>AC Name</th>
          <th rowSpan={2} className="text-center">AC Code</th>
          <th rowSpan={2} className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Hindu
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Muslim
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Christian
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Others
          </th>
        </tr>
        <tr>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
        </tr>
      </thead>
      <tbody>
        {religionWiseData.map((row) => (
          <tr key={row.ac_code}>
            <td>{row.ac_name}</td>
            <td className="text-center">{row.ac_code}</td>
            <td className="text-center">{row.sample_achieved}</td>
            {/* Hindu */}
            <td className="text-center">{row.hindu.population}</td>
            <td className="text-center">{row.hindu.sample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.hindu.difference)}`}>
              {row.hindu.difference}
            </td>
            {/* Muslim */}
            <td className="text-center">{row.muslim.population}</td>
            <td className="text-center">{row.muslim.sample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.muslim.difference)}`}>
              {row.muslim.difference}
            </td>
            {/* Christian */}
            <td className="text-center">{row.christian.population}</td>
            <td className="text-center">{row.christian.sample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.christian.difference)}`}>
              {row.christian.difference}
            </td>
            {/* Others */}
            <td className="text-center">{row.others.population}</td>
            <td className="text-center">{row.others.sample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.others.difference)}`}>
              {row.others.difference}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
  };

  const getSocialCategoryDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderSocialCategoryWiseTable = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Text>Loading social category wise data...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <Text className="text-red-600">Error: {error}</Text>
        </div>
      );
    }

    return (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th rowSpan={2}>AC Name</th>
          <th rowSpan={2} className="text-center">AC Code</th>
          <th rowSpan={2} className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            SC
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            ST
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            General+OBC
          </th>
        </tr>
        <tr>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
        </tr>
      </thead>
      <tbody>
        {socialCategoryWiseData.map((row) => (
          <tr key={row.ac_code}>
            <td>{row.ac_name}</td>
            <td className="text-center">{row.ac_code}</td>
            <td className="text-center">{row.sample_achieved}</td>
            {/* SC */}
            <td className="text-center">{row.sc.population}</td>
            <td className="text-center">{row.sc.sample}</td>
            <td className={`text-center ${getSocialCategoryDifferenceStyle(parseFloat(row.sc.difference))}`}>
              {row.sc.difference}
            </td>
            {/* ST */}
            <td className="text-center">{row.st.population}</td>
            <td className="text-center">{row.st.sample}</td>
            <td className={`text-center ${getSocialCategoryDifferenceStyle(parseFloat(row.st.difference))}`}>
              {row.st.difference}
            </td>
            {/* General+OBC */}
            <td className="text-center">{row.general_obc.population}</td>
            <td className="text-center">{row.general_obc.sample}</td>
            <td className={`text-center ${getSocialCategoryDifferenceStyle(parseFloat(row.general_obc.difference))}`}>
              {row.general_obc.difference}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
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
            <Button variant="outline" onClick={handleDownload}>
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
