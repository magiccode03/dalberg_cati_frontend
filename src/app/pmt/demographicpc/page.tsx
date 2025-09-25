'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import { Users, BarChart3, MapPin, Home, Building } from 'lucide-react';

interface DemographicData {
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  [key: string]: any;
}

export default function DemographicPcPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('gender-wise');

  // Mock data for Gender Wise
  const genderWiseData: DemographicData[] = [
    { pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, maleQuota: 0, maleCovered: 1292, maleBalance: -1292, femaleQuota: 0, femaleCovered: 673, femaleBalance: -673 },
    { pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, maleQuota: 0, maleCovered: 1266, maleBalance: -1266, femaleQuota: 0, femaleCovered: 558, femaleBalance: -558 },
    { pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, maleQuota: 0, maleCovered: 599, maleBalance: -599, femaleQuota: 0, femaleCovered: 510, femaleBalance: -510 },
    { pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, maleQuota: 0, maleCovered: 646, maleBalance: -646, femaleQuota: 0, femaleCovered: 407, femaleBalance: -407 },
    { pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, maleQuota: 0, maleCovered: 914, maleBalance: -914, femaleQuota: 0, femaleCovered: 653, femaleBalance: -653 },
    { pcName: 'Madhubani', pcCode: 6, sampleAchieved: 1932, maleQuota: 0, maleCovered: 1385, maleBalance: -1385, femaleQuota: 0, femaleCovered: 547, femaleBalance: -547 },
    { pcName: 'Jhanjharpur', pcCode: 7, sampleAchieved: 1695, maleQuota: 0, maleCovered: 1131, maleBalance: -1131, femaleQuota: 0, femaleCovered: 564, femaleBalance: -564 },
    { pcName: 'Supaul', pcCode: 8, sampleAchieved: 1697, maleQuota: 0, maleCovered: 1075, maleBalance: -1075, femaleQuota: 0, femaleCovered: 622, femaleBalance: -622 },
    { pcName: 'Araria', pcCode: 9, sampleAchieved: 144, maleQuota: 0, maleCovered: 80, maleBalance: -80, femaleQuota: 0, femaleCovered: 64, femaleBalance: -64 },
    { pcName: 'Kishanganj', pcCode: 10, sampleAchieved: 613, maleQuota: 0, maleCovered: 385, maleBalance: -385, femaleQuota: 0, femaleCovered: 228, femaleBalance: -228 },
  ];

  // Mock data for Age Wise
  const ageWiseData: DemographicData[] = [
    { pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, age18_24Min: 0, age18_24Achieved: 265, age18_24Balance: -265, age25_34Min: 0, age25_34Achieved: 518, age25_34Balance: -518, age35_50Min: 0, age35_50Achieved: 810, age35_50Balance: -810, age50PlusMin: 0, age50PlusAchieved: 372, age50PlusBalance: -372 },
    { pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, age18_24Min: 0, age18_24Achieved: 246, age18_24Balance: -246, age25_34Min: 0, age25_34Achieved: 581, age25_34Balance: -581, age35_50Min: 0, age35_50Achieved: 649, age35_50Balance: -649, age50PlusMin: 0, age50PlusAchieved: 348, age50PlusBalance: -348 },
    { pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, age18_24Min: 0, age18_24Achieved: 167, age18_24Balance: -167, age25_34Min: 0, age25_34Achieved: 285, age25_34Balance: -285, age35_50Min: 0, age35_50Achieved: 388, age35_50Balance: -388, age50PlusMin: 0, age50PlusAchieved: 269, age50PlusBalance: -269 },
    { pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, age18_24Min: 0, age18_24Achieved: 102, age18_24Balance: -102, age25_34Min: 0, age25_34Achieved: 247, age25_34Balance: -247, age35_50Min: 0, age35_50Achieved: 405, age35_50Balance: -405, age50PlusMin: 0, age50PlusAchieved: 299, age50PlusBalance: -299 },
    { pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, age18_24Min: 0, age18_24Achieved: 117, age18_24Balance: -117, age25_34Min: 0, age25_34Achieved: 298, age25_34Balance: -298, age35_50Min: 0, age35_50Achieved: 537, age35_50Balance: -537, age50PlusMin: 0, age50PlusAchieved: 615, age50PlusBalance: -615 },
  ];

  // Mock data for Locality Wise
  const localityWiseData: DemographicData[] = [
    { pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, urbanPopulation: 8.10, urbanSample: 6.8, urbanDifference: 1.2, ruralPopulation: 91.90, ruralSample: 93.2, ruralDifference: 2.2 },
    { pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, urbanPopulation: 13.00, urbanSample: 16, urbanDifference: 3, ruralPopulation: 87.00, ruralSample: 84, ruralDifference: 3 },
    { pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, urbanPopulation: 6.80, urbanSample: 6.7, urbanDifference: 0.7, ruralPopulation: 93.20, ruralSample: 93.3, ruralDifference: 0.3 },
    { pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, urbanPopulation: 6.80, urbanSample: 2.6, urbanDifference: 3.4, ruralPopulation: 93.20, ruralSample: 97.4, ruralDifference: 4.4 },
    { pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, urbanPopulation: 4.60, urbanSample: 0.1, urbanDifference: 3.9, ruralPopulation: 95.40, ruralSample: 99.9, ruralDifference: 4.9 },
  ];

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
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.pcName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.pcCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.maleQuota}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.maleCovered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.maleBalance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.femaleQuota}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.femaleCovered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.femaleBalance}</td>
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
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.pcName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.pcCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age18_24Min}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age18_24Achieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age18_24Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age25_34Min}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age25_34Achieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age25_34Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age35_50Min}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age35_50Achieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age35_50Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age50PlusMin}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age50PlusAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age50PlusBalance}</td>
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
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.pcName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.pcCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.urbanPopulation}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.urbanSample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.urbanDifference > 2 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'text-gray-900 dark:text-gray-100'}`}>{row.urbanDifference}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.ruralPopulation}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.ruralSample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.ruralDifference > 2 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'text-gray-900 dark:text-gray-100'}`}>{row.ruralDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
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
