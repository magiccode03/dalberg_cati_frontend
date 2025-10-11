'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import { Users, BarChart3, MapPin, Home, Building } from 'lucide-react';
import { apiService, GenderWiseResponse, DemographicConstituency, AgeWiseResponse, AgeWiseConstituency, LocalityWiseResponse, LocalityWiseConstituency } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DemographicData {
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  [key: string]: any;
}

export default function DemographicPcPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('gender-wise');
  const [genderWiseData, setGenderWiseData] = useState<DemographicConstituency[]>([]);
  const [ageWiseData, setAgeWiseData] = useState<AgeWiseConstituency[]>([]);
  const [localityWiseData, setLocalityWiseData] = useState<LocalityWiseConstituency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'gender-wise') {
          const response = await apiService.getGenderWiseData();
          if (response.success && response.data) {
            setGenderWiseData(response.data.constituencies);
          } else {
            setError(response.message || 'Failed to fetch gender-wise data');
          }
        } else if (activeTab === 'age-wise') {
          const response = await apiService.getAgeWiseData();
          if (response.success && response.data) {
            setAgeWiseData(response.data.constituencies);
          } else {
            setError(response.message || 'Failed to fetch age-wise data');
          }
        } else if (activeTab === 'locality-wise') {
          const response = await apiService.getLocalityWiseData();
          if (response.success && response.data) {
            setLocalityWiseData(response.data.constituencies);
          } else {
            setError(response.message || 'Failed to fetch locality-wise data');
          }
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);



  const tabItems = [
    { id: 'gender-wise', label: 'Gender Wise', icon: Users },
    { id: 'age-wise', label: 'Age Wise', icon: BarChart3 },
    { id: 'locality-wise', label: 'Locality Wise', icon: MapPin },
    { id: 'religion-wise', label: 'Religion Wise', icon: Building },
    { id: 'social-category-wise', label: 'Social Category Wise', icon: Home },
  ];

  const renderGenderWiseTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PC Code</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Male</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Female</th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Male Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Male Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Female Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Female Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
          </tr>
        </thead>
        <tbody>
          {genderWiseData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.pc_name}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.pc_code}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sample_achieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.male.quota}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.male.covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.male.balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.female.quota}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.female.covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.female.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAgeWiseTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PC Code</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>18-24 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>25-34 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>35-50 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>50+ Years</th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Min Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Achieved Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Min Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Achieved Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Min Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Achieved Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Min Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Achieved Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ageWiseData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.pc_name}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.pc_code}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sample_achieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["18_24"].min_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["18_24"].achieved_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["18_24"].balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["25_34"].min_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["25_34"].achieved_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["25_34"].balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["35_50"].min_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["35_50"].achieved_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["35_50"].balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["50_above"].min_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["50_above"].achieved_sample}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["50_above"].balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLocalityWiseTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PC Code</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Urban</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Rural</th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Population</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Difference</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Population</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Difference</th>
          </tr>
        </thead>
        <tbody>
          {localityWiseData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.pc_name}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.pc_code}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sample_achieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.locality.urban.population}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.locality.urban.sample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${Math.abs(row.locality.urban.difference) > 2 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'text-gray-900 dark:text-gray-100'}`}>{row.locality.urban.difference.toFixed(2)}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.locality.rural.population}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.locality.rural.sample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${Math.abs(row.locality.rural.difference) > 2 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'text-gray-900 dark:text-gray-100'}`}>{row.locality.rural.difference.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'gender-wise':
        return renderGenderWiseTable();
      case 'age-wise':
        return renderAgeWiseTable();
      case 'locality-wise':
        return renderLocalityWiseTable();
      case 'religion-wise':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No Data</p>
          </div>
        );
      case 'social-category-wise':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No Data</p>
          </div>
        );
      default:
        return renderGenderWiseTable();
    }
  };

  if (user?.role !== 'pmt' && user?.role !== 'super_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Demographic Representation (PC Level): <span className="text-blue-600 dark:text-blue-400">{tabItems.find(tab => tab.id === activeTab)?.label} Proportions(%)</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View demographic data and proportions for parliamentary constituencies.
        </p>
      </div>

      {/* Tabs */}
      <Card className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === item.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
      </Card>

      {/* Content */}
      <Card>
        <div className="p-4">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}
