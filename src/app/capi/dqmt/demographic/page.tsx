'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Download, Users, Calendar, MapPin, Heart, UserCheck, Shield } from 'lucide-react';

interface PCGenderWiseData {
  id: number;
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  maleQuota: number;
  maleCovered: number;
  maleBalance: number;
  femaleQuota: number;
  femaleCovered: number;
  femaleBalance: number;
}

interface PCAgeWiseData {
  id: number;
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  age18to24MinSample: number;
  age18to24AchievedSample: number;
  age18to24Balance: number;
  age25to34MinSample: number;
  age25to34AchievedSample: number;
  age25to34Balance: number;
  age35to50MinSample: number;
  age35to50AchievedSample: number;
  age35to50Balance: number;
  age50PlusMinSample: number;
  age50PlusAchievedSample: number;
  age50PlusBalance: number;
}

interface PCLocalityWiseData {
  id: number;
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  urbanPopulation: number;
  urbanSample: number;
  urbanDifference: number;
  ruralPopulation: number;
  ruralSample: number;
  ruralDifference: number;
}

interface PCCasteWiseData {
  id: number;
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  // Caste 1
  caste1Name: string;
  caste1Quota: number;
  caste1Covered: number;
  caste1Balance: number;
  // Caste 2
  caste2Name: string;
  caste2Quota: number;
  caste2Covered: number;
  caste2Balance: number;
  // Caste 3
  caste3Name: string;
  caste3Quota: number;
  caste3Covered: number;
  caste3Balance: number;
  // Caste 4
  caste4Name: string;
  caste4Quota: number;
  caste4Covered: number;
  caste4Balance: number;
  // Caste 5
  caste5Name: string;
  caste5Quota: number;
  caste5Covered: number;
  caste5Balance: number;
  // Caste 6
  caste6Name: string;
  caste6Quota: number;
  caste6Covered: number;
  caste6Balance: number;
  // Caste 7
  caste7Name: string;
  caste7Quota: number;
  caste7Covered: number;
  caste7Balance: number;
  // Caste 8
  caste8Name: string;
  caste8Quota: number;
  caste8Covered: number;
  caste8Balance: number;
  // Caste 9
  caste9Name: string;
  caste9Quota: number;
  caste9Covered: number;
  caste9Balance: number;
}

export default function DemographicPage() {
  const [activeTab, setActiveTab] = useState('genderwise');

  // Sample PC-wise gender demographic data
  const pcGenderWiseData: PCGenderWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, maleQuota: 0, maleCovered: 1292, maleBalance: -1292, femaleQuota: 0, femaleCovered: 673, femaleBalance: -673 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, maleQuota: 0, maleCovered: 1266, maleBalance: -1266, femaleQuota: 0, femaleCovered: 558, femaleBalance: -558 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, maleQuota: 0, maleCovered: 599, maleBalance: -599, femaleQuota: 0, femaleCovered: 510, femaleBalance: -510 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, maleQuota: 0, maleCovered: 646, maleBalance: -646, femaleQuota: 0, femaleCovered: 407, femaleBalance: -407 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, maleQuota: 0, maleCovered: 914, maleBalance: -914, femaleQuota: 0, femaleCovered: 653, femaleBalance: -653 },
  ];

  // Sample PC-wise locality demographic data
  const pcLocalityWiseData: PCLocalityWiseData[] = [
    { id: 0, pcName: 'All', pcCode: 0, sampleAchieved: 50025, urbanPopulation: 12.3, urbanSample: 3281, urbanDifference: 5.4, ruralPopulation: 87.7, ruralSample: 46744, ruralDifference: 6.4 },
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, urbanPopulation: 8.10, urbanSample: 6.8, urbanDifference: 1.2, ruralPopulation: 91.90, ruralSample: 93.2, ruralDifference: 2.2 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, urbanPopulation: 13.00, urbanSample: 16, urbanDifference: 3, ruralPopulation: 87.00, ruralSample: 84, ruralDifference: 3 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, urbanPopulation: 6.80, urbanSample: 6.7, urbanDifference: 0.7, ruralPopulation: 93.20, ruralSample: 93.3, ruralDifference: 0.3 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, urbanPopulation: 6.80, urbanSample: 2.6, urbanDifference: 3.4, ruralPopulation: 93.20, ruralSample: 97.4, ruralDifference: 4.4 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, urbanPopulation: 4.60, urbanSample: 0.1, urbanDifference: 3.9, ruralPopulation: 95.40, ruralSample: 99.9, ruralDifference: 4.9 },
  ];

  // Sample PC-wise age demographic data
  const pcAgeWiseData: PCAgeWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, age18to24MinSample: 0, age18to24AchievedSample: 265, age18to24Balance: -265, age25to34MinSample: 0, age25to34AchievedSample: 518, age25to34Balance: -518, age35to50MinSample: 0, age35to50AchievedSample: 810, age35to50Balance: -810, age50PlusMinSample: 0, age50PlusAchievedSample: 372, age50PlusBalance: -372 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, age18to24MinSample: 0, age18to24AchievedSample: 246, age18to24Balance: -246, age25to34MinSample: 0, age25to34AchievedSample: 581, age25to34Balance: -581, age35to50MinSample: 0, age35to50AchievedSample: 649, age35to50Balance: -649, age50PlusMinSample: 0, age50PlusAchievedSample: 348, age50PlusBalance: -348 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, age18to24MinSample: 0, age18to24AchievedSample: 167, age18to24Balance: -167, age25to34MinSample: 0, age25to34AchievedSample: 285, age25to34Balance: -285, age35to50MinSample: 0, age35to50AchievedSample: 388, age35to50Balance: -388, age50PlusMinSample: 0, age50PlusAchievedSample: 269, age50PlusBalance: -269 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, age18to24MinSample: 0, age18to24AchievedSample: 102, age18to24Balance: -102, age25to34MinSample: 0, age25to34AchievedSample: 247, age25to34Balance: -247, age35to50MinSample: 0, age35to50AchievedSample: 405, age35to50Balance: -405, age50PlusMinSample: 0, age50PlusAchievedSample: 299, age50PlusBalance: -299 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, age18to24MinSample: 0, age18to24AchievedSample: 117, age18to24Balance: -117, age25to34MinSample: 0, age25to34AchievedSample: 298, age25to34Balance: -298, age35to50MinSample: 0, age35to50AchievedSample: 537, age35to50Balance: -537, age50PlusMinSample: 0, age50PlusAchievedSample: 615, age50PlusBalance: -615 },
  ];

  // Sample PC-wise caste demographic data
  const pcCasteWiseData: PCCasteWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, caste1Name: 'Muslim', caste1Quota: 237, caste1Covered: 339, caste1Balance: -102, caste2Name: 'Yadav / Raut', caste2Quota: 110, caste2Covered: 169, caste2Balance: -59, caste3Name: 'Chamar / Ravidas / Mochi', caste3Quota: 88, caste3Covered: 201, caste3Balance: -113, caste4Name: 'Tharu', caste4Quota: 45, caste4Covered: 67, caste4Balance: -22, caste5Name: 'Koeri/Kushwaha', caste5Quota: 78, caste5Covered: 89, caste5Balance: -11, caste6Name: 'Brahmin', caste6Quota: 34, caste6Covered: 45, caste6Balance: -11, caste7Name: 'Rajput', caste7Quota: 56, caste7Covered: 67, caste7Balance: -11, caste8Name: 'Teli', caste8Quota: 23, caste8Covered: 34, caste8Balance: -11, caste9Name: 'Kurmi', caste9Quota: 45, caste9Covered: 56, caste9Balance: -11 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, caste1Name: 'Muslim', caste1Quota: 258, caste1Covered: 263, caste1Balance: -5, caste2Name: 'Yadav / Raut', caste2Quota: 137, caste2Covered: 229, caste2Balance: -92, caste3Name: 'Kewat / Mallah / Bhoi / Bind / Nishad', caste3Quota: 65, caste3Covered: 105, caste3Balance: -40, caste4Name: 'Koeri/Kushwaha', caste4Quota: 89, caste4Covered: 123, caste4Balance: -34, caste5Name: 'Brahmin', caste5Quota: 45, caste5Covered: 56, caste5Balance: -11, caste6Name: 'Rajput', caste6Quota: 67, caste6Covered: 78, caste6Balance: -11, caste7Name: 'Teli', caste7Quota: 34, caste7Covered: 45, caste7Balance: -11, caste8Name: 'Kurmi', caste8Quota: 56, caste8Covered: 67, caste8Balance: -11, caste9Name: 'Chamar / Ravidas / Mochi', caste9Quota: 78, caste9Covered: 89, caste9Balance: -11 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, caste1Name: 'Muslim', caste1Quota: 164, caste1Covered: 97, caste1Balance: 67, caste2Name: 'Yadav / Raut', caste2Quota: 125, caste2Covered: 134, caste2Balance: -9, caste3Name: 'Koeri/Kushwaha', caste3Quota: 105, caste3Covered: 110, caste3Balance: -5, caste4Name: 'Brahmin', caste4Quota: 45, caste4Covered: 56, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 67, caste5Covered: 78, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 34, caste6Covered: 45, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 56, caste7Covered: 67, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 78, caste8Covered: 89, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 45, caste9Covered: 56, caste9Balance: -11 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, caste1Name: 'Muslim', caste1Quota: 207, caste1Covered: 101, caste1Balance: 106, caste2Name: 'Yadav / Raut', caste2Quota: 90, caste2Covered: 122, caste2Balance: -32, caste3Name: 'Teli', caste3Quota: 73, caste3Covered: 69, caste3Balance: 4, caste4Name: 'Rajput', caste4Quota: 56, caste4Covered: 67, caste4Balance: -11, caste5Name: 'Brahmin', caste5Quota: 45, caste5Covered: 56, caste5Balance: -11, caste6Name: 'Koeri/Kushwaha', caste6Quota: 67, caste6Covered: 78, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 56, caste7Covered: 67, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 78, caste8Covered: 89, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 45, caste9Covered: 56, caste9Balance: -11 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, caste1Name: 'Muslim', caste1Quota: 189, caste1Covered: 234, caste1Balance: -45, caste2Name: 'Yadav / Raut', caste2Quota: 156, caste2Covered: 189, caste2Balance: -33, caste3Name: 'Koeri/Kushwaha', caste3Quota: 123, caste3Covered: 145, caste3Balance: -22, caste4Name: 'Brahmin', caste4Quota: 67, caste4Covered: 78, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 89, caste5Covered: 100, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 45, caste6Covered: 56, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 67, caste7Covered: 78, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 89, caste8Covered: 100, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 56, caste9Covered: 67, caste9Balance: -11 },
  ];

  const tabs = [
    { id: 'genderwise', label: 'Gender Wise', href: '/dqmt/demographic', icon: Users },
    { id: 'agewise', label: 'Age Wise', href: '/dqmt/demographic/agewise', icon: Calendar },
    { id: 'localitywise', label: 'Locality Wise', href: '/dqmt/demographic/localitywise', icon: MapPin },
    { id: 'religionwise', label: 'Religion Wise', href: '/dqmt/demographic/religionwise', icon: Heart },
    { id: 'socialcategorywise', label: 'Social Category Wise', href: '/dqmt/demographic/socialcategorywise', icon: UserCheck },
    { id: 'castewise', label: 'Caste Wise', href: '/dqmt/demographic/castewise', icon: Shield }
  ];

  const handleDownload = () => {
    console.log('Downloading demographic data...');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'genderwise':
        return 'Demographic Representation (PC Level): Gender Wise Proportions(%)';
      case 'agewise':
        return 'Demographic Representation (PC Level): Age Wise Proportions(%)';
      case 'localitywise':
        return 'Demographic Representation (PC Level): Locality Wise Proportions(%)';
      case 'religionwise':
        return 'Demographic Representation (PC Level): Religion Wise Proportions(%)';
      case 'socialcategorywise':
        return 'Demographic Representation (PC Level): Social Category Wise Proportions(%)';
      case 'castewise':
        return 'Demographic Representation (PC Level): Caste Wise Proportions(%)';
      default:
        return 'Demographic Representation (PC Level): Gender Wise Proportions(%)';
    }
  };

  const getLocalityDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const getCasteBalanceStyle = (balance: number) => {
    if (balance > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const getCasteCoveredStyle = (quota: number, covered: number) => {
    if (quota > 0 && covered < quota) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderGenderWiseTable = () => (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th className="text-center">PC Name</th>
          <th className="text-center">PC Code</th>
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
          <th className="text-center border-r-2">Male Covered</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Female Quota</th>
          <th className="text-center border-r-2">Female Covered</th>
          <th className="text-center border-r-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {pcGenderWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.pcName}</td>
            <td className="text-center">{row.pcCode}</td>
            <td className="text-center">{row.sampleAchieved.toLocaleString()}</td>
            <td className="text-center">{row.maleQuota}</td>
            <td className="text-center">{row.maleCovered.toLocaleString()}</td>
            <td className="text-center">{row.maleBalance.toLocaleString()}</td>
            <td className="text-center">{row.femaleQuota}</td>
            <td className="text-center">{row.femaleCovered.toLocaleString()}</td>
            <td className="text-center">{row.femaleBalance.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderLocalityWiseTable = () => (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th className="text-center">PC Name</th>
          <th className="text-center">PC Code</th>
          <th className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Urban
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={3}>
            Rural
          </th>
        </tr>
        <tr>
          <th></th>
          <th className="text-center"></th>
          <th className="text-center"></th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
          <th className="text-center border-r-2">Population</th>
          <th className="text-center border-r-2">Sample</th>
          <th className="text-center border-r-2">Difference</th>
        </tr>
      </thead>
      <tbody>
        {pcLocalityWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.pcName}</td>
            <td className="text-center">{row.pcCode}</td>
            <td className="text-center">{row.sampleAchieved.toLocaleString()}</td>
            <td className="text-center">{row.urbanPopulation}</td>
            <td className="text-center">{row.urbanSample}</td>
            <td className={`text-center ${getLocalityDifferenceStyle(row.urbanDifference)}`}>
              {row.urbanDifference}
            </td>
            <td className="text-center">{row.ruralPopulation}</td>
            <td className="text-center">{row.ruralSample}</td>
            <td className={`text-center ${getLocalityDifferenceStyle(row.ruralDifference)}`}>
              {row.ruralDifference}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderAgeWiseTable = () => (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th className="text-center">PC Name</th>
          <th className="text-center">PC Code</th>
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
          <th className="text-center border-r-2">Min Sample</th>
          <th className="text-center border-r-2">Achieved Sample</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Min Sample</th>
          <th className="text-center border-r-2">Achieved Sample</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Min Sample</th>
          <th className="text-center border-r-2">Achieved Sample</th>
          <th className="text-center border-r-2">Balance</th>
          <th className="text-center border-r-2">Min Sample</th>
          <th className="text-center border-r-2">Achieved Sample</th>
          <th className="text-center border-r-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {pcAgeWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.pcName}</td>
            <td className="text-center">{row.pcCode}</td>
            <td className="text-center">{row.sampleAchieved.toLocaleString()}</td>
            <td className="text-center">{row.age18to24MinSample}</td>
            <td className="text-center">{row.age18to24AchievedSample.toLocaleString()}</td>
            <td className="text-center">{row.age18to24Balance.toLocaleString()}</td>
            <td className="text-center">{row.age25to34MinSample}</td>
            <td className="text-center">{row.age25to34AchievedSample.toLocaleString()}</td>
            <td className="text-center">{row.age25to34Balance.toLocaleString()}</td>
            <td className="text-center">{row.age35to50MinSample}</td>
            <td className="text-center">{row.age35to50AchievedSample.toLocaleString()}</td>
            <td className="text-center">{row.age35to50Balance.toLocaleString()}</td>
            <td className="text-center">{row.age50PlusMinSample}</td>
            <td className="text-center">{row.age50PlusAchievedSample.toLocaleString()}</td>
            <td className="text-center">{row.age50PlusBalance.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderCasteWiseTable = () => (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th className="text-center">PC Name</th>
          <th className="text-center">PC Code</th>
          <th className="text-center">Sample Achieved</th>
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
        </tr>
        <tr>
          <th></th>
          <th className="text-center"></th>
          <th className="text-center"></th>
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
        {pcCasteWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.pcName}</td>
            <td className="text-center">{row.pcCode}</td>
            <td className="text-center">{row.sampleAchieved.toLocaleString()}</td>
            <td className="text-center">{row.caste1Name}</td>
            <td className="text-center">{row.caste1Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste1Quota, row.caste1Covered)}`}>{row.caste1Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste1Balance)}`}>{row.caste1Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste2Name}</td>
            <td className="text-center">{row.caste2Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste2Quota, row.caste2Covered)}`}>{row.caste2Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste2Balance)}`}>{row.caste2Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste3Name}</td>
            <td className="text-center">{row.caste3Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste3Quota, row.caste3Covered)}`}>{row.caste3Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste3Balance)}`}>{row.caste3Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste4Name}</td>
            <td className="text-center">{row.caste4Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste4Quota, row.caste4Covered)}`}>{row.caste4Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste4Balance)}`}>{row.caste4Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste5Name}</td>
            <td className="text-center">{row.caste5Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste5Quota, row.caste5Covered)}`}>{row.caste5Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste5Balance)}`}>{row.caste5Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste6Name}</td>
            <td className="text-center">{row.caste6Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste6Quota, row.caste6Covered)}`}>{row.caste6Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste6Balance)}`}>{row.caste6Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste7Name}</td>
            <td className="text-center">{row.caste7Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste7Quota, row.caste7Covered)}`}>{row.caste7Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste7Balance)}`}>{row.caste7Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste8Name}</td>
            <td className="text-center">{row.caste8Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste8Quota, row.caste8Covered)}`}>{row.caste8Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste8Balance)}`}>{row.caste8Balance.toLocaleString()}</td>
            <td className="text-center">{row.caste9Name}</td>
            <td className="text-center">{row.caste9Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.caste9Quota, row.caste9Covered)}`}>{row.caste9Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste9Balance)}`}>{row.caste9Balance.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'genderwise':
        return renderGenderWiseTable();
      case 'agewise':
        return renderAgeWiseTable();
      case 'localitywise':
        return renderLocalityWiseTable();
      case 'castewise':
        return renderCasteWiseTable();
      default:
        return (
          <div className="text-center py-8">
            <Text className="text-gray-500">Table content for {activeTab} will be implemented here</Text>
          </div>
        );
    }
  };

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Demographic
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full">
          <Card className="p-6">
            {/* Card Header */}
            <div className="pb-0 mb-6">
              <div className="flex justify-between items-center">
                <h4 className="mb-0"></h4>
                <span className="text-end">
                  {(activeTab === 'localitywise' || activeTab === 'castewise') && (
                    <Button
                      onClick={handleDownload}
                      className="btn btn-primary btn-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </span>
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
        </div>
      </Container>
    </div>
  );
}
