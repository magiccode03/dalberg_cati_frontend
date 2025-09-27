'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Download, Users, Calendar, Shield, Heart, UserCheck } from 'lucide-react';

interface GenderWiseData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  maleQuota: number;
  maleCovered: number;
  maleBalance: number;
  femaleQuota: number;
  femaleCovered: number;
  femaleBalance: number;
}

interface AgeWiseData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  age18to24Quota: number;
  age18to24Covered: number;
  age18to24Balance: number;
  age25to34Quota: number;
  age25to34Covered: number;
  age25to34Balance: number;
  age35to49Quota: number;
  age35to49Covered: number;
  age35to49Balance: number;
  age50PlusQuota: number;
  age50PlusCovered: number;
  age50PlusBalance: number;
}

interface CasteWiseData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  caste1Name: string;
  caste1Quota: number;
  caste1Covered: number;
  caste1Balance: number;
  caste2Name: string;
  caste2Quota: number;
  caste2Covered: number;
  caste2Balance: number;
  caste3Name: string;
  caste3Quota: number;
  caste3Covered: number;
  caste3Balance: number;
  caste4Name: string;
  caste4Quota: number;
  caste4Covered: number;
  caste4Balance: number;
  caste5Name: string;
  caste5Quota: number;
  caste5Covered: number;
  caste5Balance: number;
  caste6Name: string;
  caste6Quota: number;
  caste6Covered: number;
  caste6Balance: number;
  caste7Name: string;
  caste7Quota: number;
  caste7Covered: number;
  caste7Balance: number;
  caste8Name: string;
  caste8Quota: number;
  caste8Covered: number;
  caste8Balance: number;
  caste9Name: string;
  caste9Quota: number;
  caste9Covered: number;
  caste9Balance: number;
  caste10Name: string;
  caste10Quota: number;
  caste10Covered: number;
  caste10Balance: number;
}

interface ReligionWiseData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  hinduPopulation: number;
  hinduSample: number;
  hinduDifference: number;
  muslimPopulation: number;
  muslimSample: number;
  muslimDifference: number;
  christianPopulation: number;
  christianSample: number;
  christianDifference: number;
  othersPopulation: number;
  othersSample: number;
  othersDifference: number;
}

interface SocialCategoryWiseData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  scPopulation: number;
  scSample: number;
  scDifference: number;
  stPopulation: number;
  stSample: number;
  stDifference: number;
  generalObcPopulation: number;
  generalObcSample: number;
  generalObcDifference: number;
}

export default function DemographicPage() {
  const [activeTab, setActiveTab] = useState('genderwise');

  // Sample demographic data
  const genderWiseData: GenderWiseData[] = [
    {
      id: 1,
      acName: 'Valmiki Nagar',
      acCode: 1,
      sampleAchieved: 310,
      maleQuota: 150,
      maleCovered: 230,
      maleBalance: -80,
      femaleQuota: 120,
      femaleCovered: 80,
      femaleBalance: 40
    },
    {
      id: 2,
      acName: 'Ramnagar (SC)',
      acCode: 2,
      sampleAchieved: 346,
      maleQuota: 150,
      maleCovered: 205,
      maleBalance: -55,
      femaleQuota: 120,
      femaleCovered: 141,
      femaleBalance: -21
    },
    {
      id: 3,
      acName: 'Narkatiaganj',
      acCode: 3,
      sampleAchieved: 315,
      maleQuota: 150,
      maleCovered: 223,
      maleBalance: -73,
      femaleQuota: 120,
      femaleCovered: 92,
      femaleBalance: 28
    },
    {
      id: 4,
      acName: 'Bagaha',
      acCode: 4,
      sampleAchieved: 306,
      maleQuota: 150,
      maleCovered: 208,
      maleBalance: -58,
      femaleQuota: 120,
      femaleCovered: 98,
      femaleBalance: 22
    },
    {
      id: 5,
      acName: 'Lauriya',
      acCode: 5,
      sampleAchieved: 337,
      maleQuota: 150,
      maleCovered: 220,
      maleBalance: -70,
      femaleQuota: 120,
      femaleCovered: 117,
      femaleBalance: 3
    }
  ];

  const ageWiseData: AgeWiseData[] = [
    {
      id: 1,
      acName: 'Valmiki Nagar',
      acCode: 1,
      sampleAchieved: 310,
      age18to24Quota: 50,
      age18to24Covered: 45,
      age18to24Balance: 5,
      age25to34Quota: 80,
      age25to34Covered: 95,
      age25to34Balance: -15,
      age35to49Quota: 90,
      age35to49Covered: 105,
      age35to49Balance: -15,
      age50PlusQuota: 60,
      age50PlusCovered: 65,
      age50PlusBalance: -5
    },
    {
      id: 2,
      acName: 'Ramnagar (SC)',
      acCode: 2,
      sampleAchieved: 346,
      age18to24Quota: 50,
      age18to24Covered: 52,
      age18to24Balance: -2,
      age25to34Quota: 80,
      age25to34Covered: 88,
      age25to34Balance: -8,
      age35to49Quota: 90,
      age35to49Covered: 110,
      age35to49Balance: -20,
      age50PlusQuota: 60,
      age50PlusCovered: 96,
      age50PlusBalance: -36
    },
    {
      id: 3,
      acName: 'Narkatiaganj',
      acCode: 3,
      sampleAchieved: 315,
      age18to24Quota: 50,
      age18to24Covered: 48,
      age18to24Balance: 2,
      age25to34Quota: 80,
      age25to34Covered: 82,
      age25to34Balance: -2,
      age35to49Quota: 90,
      age35to49Covered: 98,
      age35to49Balance: -8,
      age50PlusQuota: 60,
      age50PlusCovered: 87,
      age50PlusBalance: -27
    },
    {
      id: 4,
      acName: 'Bagaha',
      acCode: 4,
      sampleAchieved: 306,
      age18to24Quota: 50,
      age18to24Covered: 46,
      age18to24Balance: 4,
      age25to34Quota: 80,
      age25to34Covered: 78,
      age25to34Balance: 2,
      age35to49Quota: 90,
      age35to49Covered: 92,
      age35to49Balance: -2,
      age50PlusQuota: 60,
      age50PlusCovered: 90,
      age50PlusBalance: -30
    },
    {
      id: 5,
      acName: 'Lauriya',
      acCode: 5,
      sampleAchieved: 337,
      age18to24Quota: 50,
      age18to24Covered: 55,
      age18to24Balance: -5,
      age25to34Quota: 80,
      age25to34Covered: 85,
      age25to34Balance: -5,
      age35to49Quota: 90,
      age35to49Covered: 102,
      age35to49Balance: -12,
      age50PlusQuota: 60,
      age50PlusCovered: 95,
      age50PlusBalance: -35
    }
  ];

  const casteWiseData: CasteWiseData[] = [
    {
      id: 1,
      acName: 'Valmiki Nagar',
      acCode: 1,
      sampleAchieved: 310,
      caste1Name: 'Tharu',
      caste1Quota: 28,
      caste1Covered: 0,
      caste1Balance: 28,
      caste2Name: 'Muslim',
      caste2Quota: 21,
      caste2Covered: 50,
      caste2Balance: -29,
      caste3Name: 'Yadav / Raut',
      caste3Quota: 21,
      caste3Covered: 28,
      caste3Balance: -7,
      caste4Name: 'Kewat / Mallah / Bind / Nishad',
      caste4Quota: 19,
      caste4Covered: 48,
      caste4Balance: -29,
      caste5Name: 'Halwai / Kandu / Kanu',
      caste5Quota: 16,
      caste5Covered: 8,
      caste5Balance: 8,
      caste6Name: 'Chamar / Ravidas / Mochi',
      caste6Quota: 0,
      caste6Covered: 0,
      caste6Balance: 0,
      caste7Name: '',
      caste7Quota: 0,
      caste7Covered: 0,
      caste7Balance: 0,
      caste8Name: '',
      caste8Quota: 0,
      caste8Covered: 0,
      caste8Balance: 0,
      caste9Name: '',
      caste9Quota: 0,
      caste9Covered: 0,
      caste9Balance: 0,
      caste10Name: '',
      caste10Quota: 0,
      caste10Covered: 0,
      caste10Balance: 0
    },
    {
      id: 2,
      acName: 'Ramnagar (SC)',
      acCode: 2,
      sampleAchieved: 346,
      caste1Name: 'Muslim',
      caste1Quota: 41,
      caste1Covered: 31,
      caste1Balance: 10,
      caste2Name: 'Tharu',
      caste2Quota: 35,
      caste2Covered: 0,
      caste2Balance: 35,
      caste3Name: 'Chamar / Ravidas / Mochi',
      caste3Quota: 16,
      caste3Covered: 32,
      caste3Balance: -16,
      caste4Name: 'Yadav / Raut',
      caste4Quota: 14,
      caste4Covered: 18,
      caste4Balance: -4,
      caste5Name: 'Kewat / Mallah / Bind / Nishad',
      caste5Quota: 13,
      caste5Covered: 7,
      caste5Balance: 6,
      caste6Name: 'Kayastha',
      caste6Quota: 0,
      caste6Covered: 0,
      caste6Balance: 0,
      caste7Name: '',
      caste7Quota: 0,
      caste7Covered: 0,
      caste7Balance: 0,
      caste8Name: '',
      caste8Quota: 0,
      caste8Covered: 0,
      caste8Balance: 0,
      caste9Name: '',
      caste9Quota: 0,
      caste9Covered: 0,
      caste9Balance: 0,
      caste10Name: '',
      caste10Quota: 0,
      caste10Covered: 0,
      caste10Balance: 0
    },
    {
      id: 3,
      acName: 'Narkatiaganj',
      acCode: 3,
      sampleAchieved: 315,
      caste1Name: 'Muslim',
      caste1Quota: 58,
      caste1Covered: 69,
      caste1Balance: -11,
      caste2Name: 'Dhobi',
      caste2Quota: 12,
      caste2Covered: 4,
      caste2Balance: 8,
      caste3Name: 'Brahmin',
      caste3Quota: 11,
      caste3Covered: 20,
      caste3Balance: -9,
      caste4Name: '',
      caste4Quota: 0,
      caste4Covered: 0,
      caste4Balance: 0,
      caste5Name: '',
      caste5Quota: 0,
      caste5Covered: 0,
      caste5Balance: 0,
      caste6Name: '',
      caste6Quota: 0,
      caste6Covered: 0,
      caste6Balance: 0,
      caste7Name: '',
      caste7Quota: 0,
      caste7Covered: 0,
      caste7Balance: 0,
      caste8Name: '',
      caste8Quota: 0,
      caste8Covered: 0,
      caste8Balance: 0,
      caste9Name: '',
      caste9Quota: 0,
      caste9Covered: 0,
      caste9Balance: 0,
      caste10Name: '',
      caste10Quota: 0,
      caste10Covered: 0,
      caste10Balance: 0
    },
    {
      id: 4,
      acName: 'Bagaha',
      acCode: 4,
      sampleAchieved: 306,
      caste1Name: 'Muslim',
      caste1Quota: 32,
      caste1Covered: 25,
      caste1Balance: 7,
      caste2Name: 'Baniya / Barnwal / Mahuri / Kesari',
      caste2Quota: 29,
      caste2Covered: 24,
      caste2Balance: 5,
      caste3Name: 'Yadav / Raut',
      caste3Quota: 23,
      caste3Covered: 28,
      caste3Balance: -5,
      caste4Name: 'Chamar / Ravidas / Mochi',
      caste4Quota: 22,
      caste4Covered: 34,
      caste4Balance: -12,
      caste5Name: 'Kewat / Mallah / Bind / Nishad',
      caste5Quota: 20,
      caste5Covered: 60,
      caste5Balance: -40,
      caste6Name: 'Brahmin',
      caste6Quota: 0,
      caste6Covered: 0,
      caste6Balance: 0,
      caste7Name: '',
      caste7Quota: 0,
      caste7Covered: 0,
      caste7Balance: 0,
      caste8Name: '',
      caste8Quota: 0,
      caste8Covered: 0,
      caste8Balance: 0,
      caste9Name: '',
      caste9Quota: 0,
      caste9Covered: 0,
      caste9Balance: 0,
      caste10Name: '',
      caste10Quota: 0,
      caste10Covered: 0,
      caste10Balance: 0
    },
    {
      id: 5,
      acName: 'Lauriya',
      acCode: 5,
      sampleAchieved: 337,
      caste1Name: 'Muslim',
      caste1Quota: 32,
      caste1Covered: 62,
      caste1Balance: -30,
      caste2Name: 'Yadav / Raut',
      caste2Quota: 22,
      caste2Covered: 28,
      caste2Balance: -6,
      caste3Name: 'Koeri/Kushwaha',
      caste3Quota: 18,
      caste3Covered: 15,
      caste3Balance: 3,
      caste4Name: 'Brahmin',
      caste4Quota: 14,
      caste4Covered: 53,
      caste4Balance: -39,
      caste5Name: 'Kewat / Mallah / Bind / Nishad',
      caste5Quota: 13,
      caste5Covered: 8,
      caste5Balance: 5,
      caste6Name: 'Chamar / Ravidas / Mochi',
      caste6Quota: 0,
      caste6Covered: 0,
      caste6Balance: 0,
      caste7Name: '',
      caste7Quota: 0,
      caste7Covered: 0,
      caste7Balance: 0,
      caste8Name: '',
      caste8Quota: 0,
      caste8Covered: 0,
      caste8Balance: 0,
      caste9Name: '',
      caste9Quota: 0,
      caste9Covered: 0,
      caste9Balance: 0,
      caste10Name: '',
      caste10Quota: 0,
      caste10Covered: 0,
      caste10Balance: 0
    }
  ];

  const religionWiseData: ReligionWiseData[] = [
    {
      id: 0,
      acName: 'All',
      acCode: 0,
      sampleAchieved: 50025,
      hinduPopulation: 83.6,
      hinduSample: 44982,
      hinduDifference: 6.9,
      muslimPopulation: 10.4,
      muslimSample: 194,
      muslimDifference: 9.6,
      christianPopulation: 5.7,
      christianSample: 23,
      christianDifference: 0,
      othersPopulation: 0.3,
      othersSample: 90,
      othersDifference: 0.2
    },
    {
      id: 1,
      acName: 'Valmiki Nagar',
      acCode: 1,
      sampleAchieved: 310,
      hinduPopulation: 77.40,
      hinduSample: 83.9,
      hinduDifference: 6.9,
      muslimPopulation: 22.00,
      muslimSample: 0,
      muslimDifference: 0,
      christianPopulation: 0.20,
      christianSample: 0,
      christianDifference: 0,
      othersPopulation: 0.4,
      othersSample: 0,
      othersDifference: 0
    },
    {
      id: 2,
      acName: 'Ramnagar (SC)',
      acCode: 2,
      sampleAchieved: 346,
      hinduPopulation: 74.20,
      hinduSample: 90.5,
      hinduDifference: 16.5,
      muslimPopulation: 25.30,
      muslimSample: 0.6,
      muslimDifference: 24.4,
      christianPopulation: 0.20,
      christianSample: 0,
      christianDifference: 0,
      othersPopulation: 0.3,
      othersSample: 0,
      othersDifference: 0
    },
    {
      id: 3,
      acName: 'Narkatiaganj',
      acCode: 3,
      sampleAchieved: 315,
      hinduPopulation: 67.80,
      hinduSample: 75.9,
      hinduDifference: 8.9,
      muslimPopulation: 31.70,
      muslimSample: 0.3,
      muslimDifference: 30.7,
      christianPopulation: 0.10,
      christianSample: 0,
      christianDifference: 0,
      othersPopulation: 0.3,
      othersSample: 1.9,
      othersDifference: 1.9
    },
    {
      id: 4,
      acName: 'Bagaha',
      acCode: 4,
      sampleAchieved: 306,
      hinduPopulation: 82.00,
      hinduSample: 91.5,
      hinduDifference: 9.5,
      muslimPopulation: 17.50,
      muslimSample: 0,
      muslimDifference: 0,
      christianPopulation: 0.20,
      christianSample: 0,
      christianDifference: 0,
      othersPopulation: 0.2,
      othersSample: 0.3,
      othersDifference: 0.3
    },
    {
      id: 5,
      acName: 'Lauriya',
      acCode: 5,
      sampleAchieved: 337,
      hinduPopulation: 72.40,
      hinduSample: 81,
      hinduDifference: 9,
      muslimPopulation: 27.40,
      muslimSample: 0.3,
      muslimDifference: 26.7,
      christianPopulation: 0.10,
      christianSample: 0,
      christianDifference: 0,
      othersPopulation: 0.2,
      othersSample: 0.3,
      othersDifference: 0.3
    }
  ];

  const socialCategoryWiseData: SocialCategoryWiseData[] = [
    {
      id: 0,
      acName: 'All',
      acCode: 0,
      sampleAchieved: 50025,
      scPopulation: 15.9,
      scSample: 1798,
      scDifference: 11.4,
      stPopulation: 1.3,
      stSample: 84,
      stDifference: 0.8,
      generalObcPopulation: 82.8,
      generalObcSample: 7531,
      generalObcDifference: 66.9
    },
    {
      id: 1,
      acName: 'Valmiki Nagar',
      acCode: 1,
      sampleAchieved: 310,
      scPopulation: 14.70,
      scSample: 4.5,
      scDifference: 9.5,
      stPopulation: 18.90,
      stSample: 0,
      stDifference: 0,
      generalObcPopulation: 66.40,
      generalObcSample: 79.4,
      generalObcDifference: 13.4
    },
    {
      id: 2,
      acName: 'Ramnagar (SC)',
      acCode: 2,
      sampleAchieved: 346,
      scPopulation: 16.90,
      scSample: 1.2,
      scDifference: 14.8,
      stPopulation: 22.60,
      stSample: 0.9,
      stDifference: 21.1,
      generalObcPopulation: 60.50,
      generalObcSample: 53.2,
      generalObcDifference: 6.8
    },
    {
      id: 3,
      acName: 'Narkatiaganj',
      acCode: 3,
      sampleAchieved: 315,
      scPopulation: 15.10,
      scSample: 15.2,
      scDifference: 0.2,
      stPopulation: 1.50,
      stSample: 0,
      stDifference: 0,
      generalObcPopulation: 83.30,
      generalObcSample: 34,
      generalObcDifference: 49
    },
    {
      id: 4,
      acName: 'Bagaha',
      acCode: 4,
      sampleAchieved: 306,
      scPopulation: 14.60,
      scSample: 0,
      scDifference: 0,
      stPopulation: 3.90,
      stSample: 0,
      stDifference: 0,
      generalObcPopulation: 81.50,
      generalObcSample: 10.1,
      generalObcDifference: 70.9
    },
    {
      id: 5,
      acName: 'Lauriya',
      acCode: 5,
      sampleAchieved: 337,
      scPopulation: 13.30,
      scSample: 19.3,
      scDifference: 6.3,
      stPopulation: 1.40,
      stSample: 0.3,
      stDifference: 0.7,
      generalObcPopulation: 85.30,
      generalObcSample: 31.2,
      generalObcDifference: 53.8
    }
  ];

  const tabs = [
    { id: 'genderwise', label: 'Gender Wise', href: '/ppm/demographic', icon: Users },
    { id: 'agewise', label: 'Age Wise', href: '/ppm/demographic/agewise', icon: Calendar },
    { id: 'castewise', label: 'Caste Wise', href: '/ppm/demographic/castewise', icon: Shield },
    { id: 'religionwise', label: 'Religion Wise', href: '/ppm/demographic/religionwise', icon: Heart },
    { id: 'socialcategorywise', label: 'Social Category Wise', href: '/ppm/demographic/socialcategorywise', icon: UserCheck }
  ];

  const handleDownload = () => {
    // Handle download logic here
    console.log('Downloading demographic data...');
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

  const renderGenderWiseTable = () => (
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
        {genderWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.acName}</td>
            <td className="text-center">{row.acCode}</td>
            <td className="text-center">{row.sampleAchieved}</td>
            <td className="text-center">{row.maleQuota}</td>
            <td className={`text-center ${getCellStyle(row.maleCovered)}`}>
              {row.maleCovered}
            </td>
            <td className="text-center">{row.maleBalance}</td>
            <td className="text-center">{row.femaleQuota}</td>
            <td className={`text-center ${getCellStyle(row.femaleCovered, true)}`}>
              {row.femaleCovered}
            </td>
            <td className="text-center">{row.femaleBalance}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderAgeWiseTable = () => (
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
            35-49 Years
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
          <tr key={row.id}>
            <td>{row.acName}</td>
            <td className="text-center">{row.acCode}</td>
            <td className="text-center">{row.sampleAchieved}</td>
            <td className="text-center">{row.age18to24Quota}</td>
            <td className="text-center">{row.age18to24Covered}</td>
            <td className="text-center">{row.age18to24Balance}</td>
            <td className="text-center">{row.age25to34Quota}</td>
            <td className="text-center">{row.age25to34Covered}</td>
            <td className="text-center">{row.age25to34Balance}</td>
            <td className="text-center">{row.age35to49Quota}</td>
            <td className="text-center">{row.age35to49Covered}</td>
            <td className="text-center">{row.age35to49Balance}</td>
            <td className="text-center">{row.age50PlusQuota}</td>
            <td className="text-center">{row.age50PlusCovered}</td>
            <td className="text-center">{row.age50PlusBalance}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const getCasteBalanceStyle = (balance: number) => {
    if (balance < 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderCasteWiseTable = () => (
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
          <tr key={row.id}>
            <td>{row.acName}</td>
            <td className="text-center">{row.acCode}</td>
            <td className="text-center">{row.sampleAchieved}</td>
            {/* Caste 1 */}
            <td className="text-center">{row.caste1Name}</td>
            <td className="text-center">{row.caste1Quota}</td>
            <td className="text-center">{row.caste1Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste1Balance)}`}>{row.caste1Balance}</td>
            {/* Caste 2 */}
            <td className="text-center">{row.caste2Name}</td>
            <td className="text-center">{row.caste2Quota}</td>
            <td className="text-center">{row.caste2Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste2Balance)}`}>{row.caste2Balance}</td>
            {/* Caste 3 */}
            <td className="text-center">{row.caste3Name}</td>
            <td className="text-center">{row.caste3Quota}</td>
            <td className="text-center">{row.caste3Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste3Balance)}`}>{row.caste3Balance}</td>
            {/* Caste 4 */}
            <td className="text-center">{row.caste4Name}</td>
            <td className="text-center">{row.caste4Quota}</td>
            <td className="text-center">{row.caste4Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste4Balance)}`}>{row.caste4Balance}</td>
            {/* Caste 5 */}
            <td className="text-center">{row.caste5Name}</td>
            <td className="text-center">{row.caste5Quota}</td>
            <td className="text-center">{row.caste5Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste5Balance)}`}>{row.caste5Balance}</td>
            {/* Caste 6 */}
            <td className="text-center">{row.caste6Name}</td>
            <td className="text-center">{row.caste6Quota}</td>
            <td className="text-center">{row.caste6Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste6Balance)}`}>{row.caste6Balance}</td>
            {/* Caste 7 */}
            <td className="text-center">{row.caste7Name}</td>
            <td className="text-center">{row.caste7Quota}</td>
            <td className="text-center">{row.caste7Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste7Balance)}`}>{row.caste7Balance}</td>
            {/* Caste 8 */}
            <td className="text-center">{row.caste8Name}</td>
            <td className="text-center">{row.caste8Quota}</td>
            <td className="text-center">{row.caste8Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste8Balance)}`}>{row.caste8Balance}</td>
            {/* Caste 9 */}
            <td className="text-center">{row.caste9Name}</td>
            <td className="text-center">{row.caste9Quota}</td>
            <td className="text-center">{row.caste9Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste9Balance)}`}>{row.caste9Balance}</td>
            {/* Caste 10 */}
            <td className="text-center">{row.caste10Name}</td>
            <td className="text-center">{row.caste10Quota}</td>
            <td className="text-center">{row.caste10Covered}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.caste10Balance)}`}>{row.caste10Balance}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const getReligionDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderReligionWiseTable = () => (
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
          <tr key={row.id}>
            <td>{row.acName}</td>
            <td className="text-center">{row.acCode}</td>
            <td className="text-center">{row.sampleAchieved}</td>
            {/* Hindu */}
            <td className="text-center">{row.hinduPopulation}</td>
            <td className="text-center">{row.hinduSample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.hinduDifference)}`}>{row.hinduDifference}</td>
            {/* Muslim */}
            <td className="text-center">{row.muslimPopulation}</td>
            <td className="text-center">{row.muslimSample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.muslimDifference)}`}>{row.muslimDifference}</td>
            {/* Christian */}
            <td className="text-center">{row.christianPopulation}</td>
            <td className="text-center">{row.christianSample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.christianDifference)}`}>{row.christianDifference}</td>
            {/* Others */}
            <td className="text-center">{row.othersPopulation}</td>
            <td className="text-center">{row.othersSample}</td>
            <td className={`text-center ${getReligionDifferenceStyle(row.othersDifference)}`}>{row.othersDifference}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const getSocialCategoryDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return 'bg-red-100 text-red-800';
    }
    return '';
  };

  const renderSocialCategoryWiseTable = () => (
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
          <tr key={row.id}>
            <td>{row.acName}</td>
            <td className="text-center">{row.acCode}</td>
            <td className="text-center">{row.sampleAchieved}</td>
            {/* SC */}
            <td className="text-center">{row.scPopulation}</td>
            <td className="text-center">{row.scSample}</td>
            <td className={`text-center ${getSocialCategoryDifferenceStyle(row.scDifference)}`}>
              {row.scDifference}
            </td>
            {/* ST */}
            <td className="text-center">{row.stPopulation}</td>
            <td className="text-center">{row.stSample}</td>
            <td className={`text-center ${getSocialCategoryDifferenceStyle(row.stDifference)}`}>
              {row.stDifference}
            </td>
            {/* General+OBC */}
            <td className="text-center">{row.generalObcPopulation}</td>
            <td className="text-center">{row.generalObcSample}</td>
            <td className={`text-center ${getSocialCategoryDifferenceStyle(row.generalObcDifference)}`}>
              {row.generalObcDifference}
            </td>
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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
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
