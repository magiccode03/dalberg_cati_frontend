'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import apiClient from '@/lib/api-client';
import { Loader2 } from 'lucide-react';
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

interface PCReligionWiseData {
  id: number;
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  // Religion 1
  religion1Name: string;
  religion1Quota: number;
  religion1Covered: number;
  religion1Balance: number;
  // Religion 2
  religion2Name: string;
  religion2Quota: number;
  religion2Covered: number;
  religion2Balance: number;
  // Religion 3
  religion3Name: string;
  religion3Quota: number;
  religion3Covered: number;
  religion3Balance: number;
  // Religion 4
  religion4Name: string;
  religion4Quota: number;
  religion4Covered: number;
  religion4Balance: number;
  // Religion 5
  religion5Name: string;
  religion5Quota: number;
  religion5Covered: number;
  religion5Balance: number;
}

interface PCSocialCategoryWiseData {
  id: number;
  pcName: string;
  pcCode: number;
  sampleAchieved: number;
  // Social Category 1
  socialCategory1Name: string;
  socialCategory1Quota: number;
  socialCategory1Covered: number;
  socialCategory1Balance: number;
  // Social Category 2
  socialCategory2Name: string;
  socialCategory2Quota: number;
  socialCategory2Covered: number;
  socialCategory2Balance: number;
  // Social Category 3
  socialCategory3Name: string;
  socialCategory3Quota: number;
  socialCategory3Covered: number;
  socialCategory3Balance: number;
  // Social Category 4
  socialCategory4Name: string;
  socialCategory4Quota: number;
  socialCategory4Covered: number;
  socialCategory4Balance: number;
  // Social Category 5
  socialCategory5Name: string;
  socialCategory5Quota: number;
  socialCategory5Covered: number;
  socialCategory5Balance: number;
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

// API Response Interfaces
interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: string;
}

interface GenderWiseAPIResponse extends APIResponse {
  data?: {
    pc_name: string;
    pc_code: number;
    sample_achieved: number;
    male: {
      quota: number;
      covered: number;
      balance: number;
    };
    female: {
      quota: number;
      covered: number;
      balance: number;
    };
  }[];
}

interface AgeWiseAPIResponse extends APIResponse {
  data?: {
    pc_name: string;
    pc_code: number;
    sample_achieved: number;
    Age_18_24: {
      min_sample: number;
      achieved_sample: number;
      balance: number;
    };
    Age_25_34: {
      min_sample: number;
      achieved_sample: number;
      balance: number;
    };
    Age_35_50: {
      min_sample: number;
      achieved_sample: number;
      balance: number;
    };
    age_50_plus: {
      min_sample: number;
      achieved_sample: number;
      balance: number;
    };
  }[];
}

interface LocalityWiseAPIResponse extends APIResponse {
  data?: {
    pc_name: string;
    pc_code: number;
    sample_achieved: number;
    Urban: {
      population: number;
      sample_percentage: number;
      difference: number;
    };
    Rural: {
      population: number;
      sample_percentage: number;
      difference: number;
    };
  }[];
}

interface ReligionWiseAPIResponse extends APIResponse {
  data?: {
    pc_name: string;
    pc_code: number;
    sample_achieved: number;
    religions: {
      religion_name: string;
      quota: number;
      covered: number;
      balance: number;
    }[];
  }[];
}

interface SocialCategoryWiseAPIResponse extends APIResponse {
  data?: {
    pc_name: string;
    pc_code: number;
    sample_achieved: number;
    social_categories: {
      category_name: string;
      quota: number;
      covered: number;
      balance: number;
    }[];
  }[];
}

interface CasteWiseAPIResponse extends APIResponse {
  data?: {
    pc_name: string;
    pc_code: number;
    sample_achieved: number;
    castes: {
      caste_name: string;
      quota: number;
      covered: number;
      balance: number;
    }[];
  }[];
}

export default function DemographicPage() {
  const [activeTab, setActiveTab] = useState('genderwise');
  const [pcGenderWiseData, setPcGenderWiseData] = useState<PCGenderWiseData[]>([]);
  const [pcAgeWiseData, setPcAgeWiseData] = useState<PCAgeWiseData[]>([]);
  const [pcLocalityWiseData, setPcLocalityWiseData] = useState<PCLocalityWiseData[]>([]);
  const [pcReligionWiseData, setPcReligionWiseData] = useState<PCReligionWiseData[]>([]);
  const [pcSocialCategoryWiseData, setPcSocialCategoryWiseData] = useState<PCSocialCategoryWiseData[]>([]);
  const [pcCasteWiseData, setPcCasteWiseData] = useState<PCCasteWiseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  // API Endpoints mapping
  const apiEndpoints: { [key: string]: string } = {
    genderwise: '/demographicpc/genderwise',
    agewise: '/demographicpc/agewise',
    localitywise: '/demographicpc/localitywise',
    religionwise: '/demographicpc/religionwise',
    socialcategorywise: '/demographicpc/socialcategorywise',
    castewise: '/demographicpc/castewise'
  };

  // Sample PC-wise gender demographic data
  const sampleGenderWiseData: PCGenderWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, maleQuota: 0, maleCovered: 1292, maleBalance: -1292, femaleQuota: 0, femaleCovered: 673, femaleBalance: -673 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, maleQuota: 0, maleCovered: 1266, maleBalance: -1266, femaleQuota: 0, femaleCovered: 558, femaleBalance: -558 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, maleQuota: 0, maleCovered: 599, maleBalance: -599, femaleQuota: 0, femaleCovered: 510, femaleBalance: -510 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, maleQuota: 0, maleCovered: 646, maleBalance: -646, femaleQuota: 0, femaleCovered: 407, femaleBalance: -407 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, maleQuota: 0, maleCovered: 914, maleBalance: -914, femaleQuota: 0, femaleCovered: 653, femaleBalance: -653 },
    { id: 6, pcName: 'Madhubani', pcCode: 6, sampleAchieved: 1932, maleQuota: 0, maleCovered: 1385, maleBalance: -1385, femaleQuota: 0, femaleCovered: 547, femaleBalance: -547 },
    { id: 7, pcName: 'Jhanjharpur', pcCode: 7, sampleAchieved: 1695, maleQuota: 0, maleCovered: 1131, maleBalance: -1131, femaleQuota: 0, femaleCovered: 564, femaleBalance: -564 },
    { id: 8, pcName: 'Supaul', pcCode: 8, sampleAchieved: 1697, maleQuota: 0, maleCovered: 1075, maleBalance: -1075, femaleQuota: 0, femaleCovered: 622, femaleBalance: -622 },
    { id: 9, pcName: 'Araria', pcCode: 9, sampleAchieved: 144, maleQuota: 0, maleCovered: 80, maleBalance: -80, femaleQuota: 0, femaleCovered: 64, femaleBalance: -64 },
    { id: 10, pcName: 'Kishanganj', pcCode: 10, sampleAchieved: 613, maleQuota: 0, maleCovered: 385, maleBalance: -385, femaleQuota: 0, femaleCovered: 228, femaleBalance: -228 },
    { id: 11, pcName: 'Katihar', pcCode: 11, sampleAchieved: 165, maleQuota: 0, maleCovered: 93, maleBalance: -93, femaleQuota: 0, femaleCovered: 72, femaleBalance: -72 },
    { id: 12, pcName: 'Purnia', pcCode: 12, sampleAchieved: 793, maleQuota: 0, maleCovered: 360, maleBalance: -360, femaleQuota: 0, femaleCovered: 433, femaleBalance: -433 },
    { id: 13, pcName: 'Madhepura', pcCode: 13, sampleAchieved: 1648, maleQuota: 0, maleCovered: 1059, maleBalance: -1059, femaleQuota: 0, femaleCovered: 589, femaleBalance: -589 },
    { id: 14, pcName: 'Darbhanga', pcCode: 14, sampleAchieved: 1875, maleQuota: 0, maleCovered: 1238, maleBalance: -1238, femaleQuota: 0, femaleCovered: 637, femaleBalance: -637 },
    { id: 15, pcName: 'Muzaffarpur', pcCode: 15, sampleAchieved: 1416, maleQuota: 0, maleCovered: 908, maleBalance: -908, femaleQuota: 0, femaleCovered: 508, femaleBalance: -508 },
    { id: 16, pcName: 'Vaishali', pcCode: 16, sampleAchieved: 1123, maleQuota: 0, maleCovered: 634, maleBalance: -634, femaleQuota: 0, femaleCovered: 489, femaleBalance: -489 },
    { id: 17, pcName: 'Gopalganj (SC)', pcCode: 17, sampleAchieved: 1224, maleQuota: 0, maleCovered: 1000, maleBalance: -1000, femaleQuota: 0, femaleCovered: 224, femaleBalance: -224 },
    { id: 18, pcName: 'Siwan', pcCode: 18, sampleAchieved: 980, maleQuota: 0, maleCovered: 754, maleBalance: -754, femaleQuota: 0, femaleCovered: 226, femaleBalance: -226 },
    { id: 19, pcName: 'Maharajganj', pcCode: 19, sampleAchieved: 1096, maleQuota: 0, maleCovered: 628, maleBalance: -628, femaleQuota: 0, femaleCovered: 468, femaleBalance: -468 },
    { id: 20, pcName: 'Saran', pcCode: 20, sampleAchieved: 902, maleQuota: 0, maleCovered: 503, maleBalance: -503, femaleQuota: 0, femaleCovered: 399, femaleBalance: -399 },
    { id: 21, pcName: 'Hajipur (SC)', pcCode: 21, sampleAchieved: 786, maleQuota: 0, maleCovered: 410, maleBalance: -410, femaleQuota: 0, femaleCovered: 376, femaleBalance: -376 },
    { id: 22, pcName: 'Ujiarpur', pcCode: 22, sampleAchieved: 1334, maleQuota: 0, maleCovered: 895, maleBalance: -895, femaleQuota: 0, femaleCovered: 439, femaleBalance: -439 },
    { id: 23, pcName: 'Samastipur (SC)', pcCode: 23, sampleAchieved: 1417, maleQuota: 0, maleCovered: 875, maleBalance: -875, femaleQuota: 0, femaleCovered: 542, femaleBalance: -542 },
    { id: 24, pcName: 'Begusarai', pcCode: 24, sampleAchieved: 1434, maleQuota: 0, maleCovered: 1164, maleBalance: -1164, femaleQuota: 0, femaleCovered: 270, femaleBalance: -270 },
    { id: 25, pcName: 'Khagaria', pcCode: 25, sampleAchieved: 1596, maleQuota: 0, maleCovered: 1165, maleBalance: -1165, femaleQuota: 0, femaleCovered: 431, femaleBalance: -431 },
    { id: 26, pcName: 'Bhagalpur', pcCode: 26, sampleAchieved: 1439, maleQuota: 0, maleCovered: 1235, maleBalance: -1235, femaleQuota: 0, femaleCovered: 204, femaleBalance: -204 },
    { id: 27, pcName: 'Banka', pcCode: 27, sampleAchieved: 1194, maleQuota: 0, maleCovered: 822, maleBalance: -822, femaleQuota: 0, femaleCovered: 372, femaleBalance: -372 },
    { id: 28, pcName: 'Munger', pcCode: 28, sampleAchieved: 1573, maleQuota: 0, maleCovered: 1074, maleBalance: -1074, femaleQuota: 0, femaleCovered: 499, femaleBalance: -499 },
    { id: 29, pcName: 'Nalanda', pcCode: 29, sampleAchieved: 2207, maleQuota: 0, maleCovered: 1458, maleBalance: -1458, femaleQuota: 0, femaleCovered: 749, femaleBalance: -749 },
    { id: 30, pcName: 'Patna Sahib', pcCode: 30, sampleAchieved: 1051, maleQuota: 0, maleCovered: 734, maleBalance: -734, femaleQuota: 0, femaleCovered: 317, femaleBalance: -317 },
    { id: 31, pcName: 'Pataliputra', pcCode: 31, sampleAchieved: 1051, maleQuota: 0, maleCovered: 609, maleBalance: -609, femaleQuota: 0, femaleCovered: 442, femaleBalance: -442 },
    { id: 32, pcName: 'Arrah', pcCode: 32, sampleAchieved: 1624, maleQuota: 0, maleCovered: 967, maleBalance: -967, femaleQuota: 0, femaleCovered: 657, femaleBalance: -657 },
    { id: 33, pcName: 'Buxar', pcCode: 33, sampleAchieved: 1182, maleQuota: 0, maleCovered: 751, maleBalance: -751, femaleQuota: 0, femaleCovered: 431, femaleBalance: -431 },
    { id: 34, pcName: 'Sasaram (SC)', pcCode: 34, sampleAchieved: 1304, maleQuota: 0, maleCovered: 855, maleBalance: -855, femaleQuota: 0, femaleCovered: 449, femaleBalance: -449 },
    { id: 35, pcName: 'Karakat', pcCode: 35, sampleAchieved: 1179, maleQuota: 0, maleCovered: 710, maleBalance: -710, femaleQuota: 0, femaleCovered: 469, femaleBalance: -469 },
    { id: 36, pcName: 'Jahanabad', pcCode: 36, sampleAchieved: 763, maleQuota: 0, maleCovered: 440, maleBalance: -440, femaleQuota: 0, femaleCovered: 323, femaleBalance: -323 },
    { id: 37, pcName: 'Aurangabad', pcCode: 37, sampleAchieved: 571, maleQuota: 0, maleCovered: 407, maleBalance: -407, femaleQuota: 0, femaleCovered: 164, femaleBalance: -164 },
    { id: 38, pcName: 'Gaya (SC)', pcCode: 38, sampleAchieved: 1576, maleQuota: 0, maleCovered: 1332, maleBalance: -1332, femaleQuota: 0, femaleCovered: 244, femaleBalance: -244 },
    { id: 39, pcName: 'Nawada', pcCode: 39, sampleAchieved: 1269, maleQuota: 0, maleCovered: 725, maleBalance: -725, femaleQuota: 0, femaleCovered: 544, femaleBalance: -544 },
    { id: 40, pcName: 'Jamui (SC)', pcCode: 40, sampleAchieved: 654, maleQuota: 0, maleCovered: 418, maleBalance: -418, femaleQuota: 0, femaleCovered: 236, femaleBalance: -236 },
  ];

  // Sample PC-wise locality demographic data
  const samplePcLocalityWiseData: PCLocalityWiseData[] = [
    { id: 0, pcName: 'All', pcCode: 0, sampleAchieved: 50025, urbanPopulation: 12.3, urbanSample: 3281, urbanDifference: 5.4, ruralPopulation: 87.7, ruralSample: 46744, ruralDifference: 6.4 },
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, urbanPopulation: 8.10, urbanSample: 6.8, urbanDifference: 1.2, ruralPopulation: 91.90, ruralSample: 93.2, ruralDifference: 2.2 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, urbanPopulation: 13.00, urbanSample: 16, urbanDifference: 3, ruralPopulation: 87.00, ruralSample: 84, ruralDifference: 3 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, urbanPopulation: 6.80, urbanSample: 6.7, urbanDifference: 0.7, ruralPopulation: 93.20, ruralSample: 93.3, ruralDifference: 0.3 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, urbanPopulation: 6.80, urbanSample: 2.6, urbanDifference: 3.4, ruralPopulation: 93.20, ruralSample: 97.4, ruralDifference: 4.4 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, urbanPopulation: 4.60, urbanSample: 0.1, urbanDifference: 3.9, ruralPopulation: 95.40, ruralSample: 99.9, ruralDifference: 4.9 },
    { id: 6, pcName: 'Madhubani', pcCode: 6, sampleAchieved: 1932, urbanPopulation: 3.40, urbanSample: 2, urbanDifference: 1, ruralPopulation: 96.60, ruralSample: 98, ruralDifference: 2 },
    { id: 7, pcName: 'Jhanjharpur', pcCode: 7, sampleAchieved: 1695, urbanPopulation: 2.90, urbanSample: 0, urbanDifference: 0, ruralPopulation: 97.10, ruralSample: 100, ruralDifference: 3 },
    { id: 8, pcName: 'Supaul', pcCode: 8, sampleAchieved: 1697, urbanPopulation: 4.10, urbanSample: 6.4, urbanDifference: 2.4, ruralPopulation: 95.90, ruralSample: 93.6, ruralDifference: 1.4 },
    { id: 9, pcName: 'Araria', pcCode: 9, sampleAchieved: 144, urbanPopulation: 6.10, urbanSample: 0, urbanDifference: 0, ruralPopulation: 93.90, ruralSample: 100, ruralDifference: 7 },
    { id: 10, pcName: 'Kishanganj', pcCode: 10, sampleAchieved: 613, urbanPopulation: 6.40, urbanSample: 0.3, urbanDifference: 5.7, ruralPopulation: 93.60, ruralSample: 99.7, ruralDifference: 6.7 },
    { id: 11, pcName: 'Katihar', pcCode: 11, sampleAchieved: 165, urbanPopulation: 11.30, urbanSample: 3, urbanDifference: 8, ruralPopulation: 88.70, ruralSample: 97, ruralDifference: 9 },
    { id: 12, pcName: 'Purnia', pcCode: 12, sampleAchieved: 793, urbanPopulation: 12.80, urbanSample: 0, urbanDifference: 0, ruralPopulation: 87.20, ruralSample: 100, ruralDifference: 13 },
    { id: 13, pcName: 'Madhepura', pcCode: 13, sampleAchieved: 1648, urbanPopulation: 8.50, urbanSample: 1.8, urbanDifference: 6.2, ruralPopulation: 91.50, ruralSample: 98.2, ruralDifference: 7.2 },
    { id: 14, pcName: 'Darbhanga', pcCode: 14, sampleAchieved: 1875, urbanPopulation: 17.20, urbanSample: 2.3, urbanDifference: 14.7, ruralPopulation: 82.80, ruralSample: 97.7, ruralDifference: 15.7 },
    { id: 15, pcName: 'Muzaffarpur', pcCode: 15, sampleAchieved: 1416, urbanPopulation: 16.60, urbanSample: 2.3, urbanDifference: 13.7, ruralPopulation: 83.40, ruralSample: 97.7, ruralDifference: 14.7 },
    { id: 16, pcName: 'Vaishali', pcCode: 16, sampleAchieved: 1123, urbanPopulation: 3.40, urbanSample: 0.4, urbanDifference: 2.6, ruralPopulation: 96.60, ruralSample: 99.6, ruralDifference: 3.6 },
    { id: 17, pcName: 'Gopalganj (SC)', pcCode: 17, sampleAchieved: 1224, urbanPopulation: 6.30, urbanSample: 0, urbanDifference: 0, ruralPopulation: 93.70, ruralSample: 100, ruralDifference: 7 },
    { id: 18, pcName: 'Siwan', pcCode: 18, sampleAchieved: 980, urbanPopulation: 6.20, urbanSample: 0, urbanDifference: 0, ruralPopulation: 93.80, ruralSample: 100, ruralDifference: 7 },
    { id: 19, pcName: 'Maharajganj', pcCode: 19, sampleAchieved: 1096, urbanPopulation: 1.00, urbanSample: 3.6, urbanDifference: 2.6, ruralPopulation: 99.00, ruralSample: 96.4, ruralDifference: 2.6 },
    { id: 20, pcName: 'Saran', pcCode: 20, sampleAchieved: 902, urbanPopulation: 16.30, urbanSample: 2.4, urbanDifference: 13.6, ruralPopulation: 83.70, ruralSample: 97.6, ruralDifference: 14.6 },
    { id: 21, pcName: 'Hajipur (SC)', pcCode: 21, sampleAchieved: 786, urbanPopulation: 9.30, urbanSample: 0, urbanDifference: 0, ruralPopulation: 90.70, ruralSample: 100, ruralDifference: 10 },
    { id: 22, pcName: 'Ujiarpur', pcCode: 22, sampleAchieved: 1334, urbanPopulation: 1.00, urbanSample: 1.7, urbanDifference: 0.7, ruralPopulation: 99.00, ruralSample: 98.3, ruralDifference: 0.7 },
    { id: 23, pcName: 'Samastipur (SC)', pcCode: 23, sampleAchieved: 1417, urbanPopulation: 4.70, urbanSample: 8, urbanDifference: 4, ruralPopulation: 95.30, ruralSample: 92, ruralDifference: 3 },
    { id: 24, pcName: 'Begusarai', pcCode: 24, sampleAchieved: 1434, urbanPopulation: 18.80, urbanSample: 9.5, urbanDifference: 8.5, ruralPopulation: 81.20, ruralSample: 90.5, ruralDifference: 9.5 },
    { id: 25, pcName: 'Khagaria', pcCode: 25, sampleAchieved: 1596, urbanPopulation: 3.50, urbanSample: 0, urbanDifference: 0, ruralPopulation: 96.50, ruralSample: 100, ruralDifference: 4 },
    { id: 26, pcName: 'Bhagalpur', pcCode: 26, sampleAchieved: 1439, urbanPopulation: 23.70, urbanSample: 0.2, urbanDifference: 22.8, ruralPopulation: 76.30, ruralSample: 99.8, ruralDifference: 23.8 },
    { id: 27, pcName: 'Banka', pcCode: 27, sampleAchieved: 1194, urbanPopulation: 5.20, urbanSample: 4.2, urbanDifference: 0.8, ruralPopulation: 94.80, ruralSample: 95.8, ruralDifference: 1.8 },
    { id: 28, pcName: 'Munger', pcCode: 28, sampleAchieved: 1573, urbanPopulation: 22.10, urbanSample: 24, urbanDifference: 2, ruralPopulation: 77.90, ruralSample: 76, ruralDifference: 1 },
    { id: 29, pcName: 'Nalanda', pcCode: 29, sampleAchieved: 2207, urbanPopulation: 17.10, urbanSample: 0.9, urbanDifference: 16.1, ruralPopulation: 82.90, ruralSample: 99.1, ruralDifference: 17.1 },
    { id: 30, pcName: 'Patna Sahib', pcCode: 30, sampleAchieved: 1051, urbanPopulation: 78.10, urbanSample: 57.4, urbanDifference: 20.6, ruralPopulation: 21.90, ruralSample: 42.6, ruralDifference: 21.6 },
    { id: 31, pcName: 'Pataliputra', pcCode: 31, sampleAchieved: 1051, urbanPopulation: 23.10, urbanSample: 14.7, urbanDifference: 8.3, ruralPopulation: 76.90, ruralSample: 85.3, ruralDifference: 9.3 },
    { id: 32, pcName: 'Arrah', pcCode: 32, sampleAchieved: 1624, urbanPopulation: 15.10, urbanSample: 18.8, urbanDifference: 3.8, ruralPopulation: 84.90, ruralSample: 81.2, ruralDifference: 2.8 },
    { id: 33, pcName: 'Buxar', pcCode: 33, sampleAchieved: 1182, urbanPopulation: 7.80, urbanSample: 14.3, urbanDifference: 7.3, ruralPopulation: 92.20, ruralSample: 85.7, ruralDifference: 6.3 },
    { id: 34, pcName: 'Sasaram (SC)', pcCode: 34, sampleAchieved: 1304, urbanPopulation: 9.20, urbanSample: 10.5, urbanDifference: 1.5, ruralPopulation: 90.80, ruralSample: 89.5, ruralDifference: 0.5 },
    { id: 35, pcName: 'Karakat', pcCode: 35, sampleAchieved: 1179, urbanPopulation: 13.80, urbanSample: 2, urbanDifference: 11, ruralPopulation: 86.20, ruralSample: 98, ruralDifference: 12 },
    { id: 36, pcName: 'Jahanabad', pcCode: 36, sampleAchieved: 763, urbanPopulation: 8.50, urbanSample: 0.4, urbanDifference: 7.6, ruralPopulation: 91.50, ruralSample: 99.6, ruralDifference: 8.6 },
    { id: 37, pcName: 'Aurangabad', pcCode: 37, sampleAchieved: 571, urbanPopulation: 6.70, urbanSample: 0, urbanDifference: 0, ruralPopulation: 93.30, ruralSample: 100, ruralDifference: 7 },
    { id: 38, pcName: 'Gaya (SC)', pcCode: 38, sampleAchieved: 1576, urbanPopulation: 22.90, urbanSample: 13.7, urbanDifference: 8.3, ruralPopulation: 77.10, ruralSample: 86.3, ruralDifference: 9.3 },
    { id: 39, pcName: 'Nawada', pcCode: 39, sampleAchieved: 1269, urbanPopulation: 10.40, urbanSample: 4.5, urbanDifference: 5.5, ruralPopulation: 89.60, ruralSample: 95.5, ruralDifference: 6.5 },
    { id: 40, pcName: 'Jamui (SC)', pcCode: 40, sampleAchieved: 654, urbanPopulation: 10.50, urbanSample: 5.7, urbanDifference: 4.3, ruralPopulation: 89.50, ruralSample: 94.3, ruralDifference: 5.3 },
  ];

  // Sample PC-wise age demographic data
  const samplePcAgeWiseData: PCAgeWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, age18to24MinSample: 0, age18to24AchievedSample: 265, age18to24Balance: -265, age25to34MinSample: 0, age25to34AchievedSample: 518, age25to34Balance: -518, age35to50MinSample: 0, age35to50AchievedSample: 810, age35to50Balance: -810, age50PlusMinSample: 0, age50PlusAchievedSample: 372, age50PlusBalance: -372 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, age18to24MinSample: 0, age18to24AchievedSample: 246, age18to24Balance: -246, age25to34MinSample: 0, age25to34AchievedSample: 581, age25to34Balance: -581, age35to50MinSample: 0, age35to50AchievedSample: 649, age35to50Balance: -649, age50PlusMinSample: 0, age50PlusAchievedSample: 348, age50PlusBalance: -348 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, age18to24MinSample: 0, age18to24AchievedSample: 167, age18to24Balance: -167, age25to34MinSample: 0, age25to34AchievedSample: 285, age25to34Balance: -285, age35to50MinSample: 0, age35to50AchievedSample: 388, age35to50Balance: -388, age50PlusMinSample: 0, age50PlusAchievedSample: 269, age50PlusBalance: -269 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, age18to24MinSample: 0, age18to24AchievedSample: 102, age18to24Balance: -102, age25to34MinSample: 0, age25to34AchievedSample: 247, age25to34Balance: -247, age35to50MinSample: 0, age35to50AchievedSample: 405, age35to50Balance: -405, age50PlusMinSample: 0, age50PlusAchievedSample: 299, age50PlusBalance: -299 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, age18to24MinSample: 0, age18to24AchievedSample: 117, age18to24Balance: -117, age25to34MinSample: 0, age25to34AchievedSample: 298, age25to34Balance: -298, age35to50MinSample: 0, age35to50AchievedSample: 537, age35to50Balance: -537, age50PlusMinSample: 0, age50PlusAchievedSample: 615, age50PlusBalance: -615 },
    { id: 6, pcName: 'Madhubani', pcCode: 6, sampleAchieved: 1932, age18to24MinSample: 0, age18to24AchievedSample: 274, age18to24Balance: -274, age25to34MinSample: 0, age25to34AchievedSample: 753, age25to34Balance: -753, age35to50MinSample: 0, age35to50AchievedSample: 557, age35to50Balance: -557, age50PlusMinSample: 0, age50PlusAchievedSample: 348, age50PlusBalance: -348 },
    { id: 7, pcName: 'Jhanjharpur', pcCode: 7, sampleAchieved: 1695, age18to24MinSample: 0, age18to24AchievedSample: 173, age18to24Balance: -173, age25to34MinSample: 0, age25to34AchievedSample: 530, age25to34Balance: -530, age35to50MinSample: 0, age35to50AchievedSample: 597, age35to50Balance: -597, age50PlusMinSample: 0, age50PlusAchievedSample: 395, age50PlusBalance: -395 },
    { id: 8, pcName: 'Supaul', pcCode: 8, sampleAchieved: 1697, age18to24MinSample: 0, age18to24AchievedSample: 289, age18to24Balance: -289, age25to34MinSample: 0, age25to34AchievedSample: 481, age25to34Balance: -481, age35to50MinSample: 0, age35to50AchievedSample: 559, age35to50Balance: -559, age50PlusMinSample: 0, age50PlusAchievedSample: 368, age50PlusBalance: -368 },
    { id: 9, pcName: 'Araria', pcCode: 9, sampleAchieved: 144, age18to24MinSample: 0, age18to24AchievedSample: 17, age18to24Balance: -17, age25to34MinSample: 0, age25to34AchievedSample: 56, age25to34Balance: -56, age35to50MinSample: 0, age35to50AchievedSample: 39, age35to50Balance: -39, age50PlusMinSample: 0, age50PlusAchievedSample: 32, age50PlusBalance: -32 },
    { id: 10, pcName: 'Kishanganj', pcCode: 10, sampleAchieved: 613, age18to24MinSample: 0, age18to24AchievedSample: 193, age18to24Balance: -193, age25to34MinSample: 0, age25to34AchievedSample: 256, age25to34Balance: -256, age35to50MinSample: 0, age35to50AchievedSample: 130, age35to50Balance: -130, age50PlusMinSample: 0, age50PlusAchievedSample: 34, age50PlusBalance: -34 },
    { id: 11, pcName: 'Katihar', pcCode: 11, sampleAchieved: 165, age18to24MinSample: 0, age18to24AchievedSample: 16, age18to24Balance: -16, age25to34MinSample: 0, age25to34AchievedSample: 51, age25to34Balance: -51, age35to50MinSample: 0, age35to50AchievedSample: 76, age35to50Balance: -76, age50PlusMinSample: 0, age50PlusAchievedSample: 22, age50PlusBalance: -22 },
    { id: 12, pcName: 'Purnia', pcCode: 12, sampleAchieved: 793, age18to24MinSample: 0, age18to24AchievedSample: 86, age18to24Balance: -86, age25to34MinSample: 0, age25to34AchievedSample: 266, age25to34Balance: -266, age35to50MinSample: 0, age35to50AchievedSample: 352, age35to50Balance: -352, age50PlusMinSample: 0, age50PlusAchievedSample: 89, age50PlusBalance: -89 },
    { id: 13, pcName: 'Madhepura', pcCode: 13, sampleAchieved: 1648, age18to24MinSample: 0, age18to24AchievedSample: 186, age18to24Balance: -186, age25to34MinSample: 0, age25to34AchievedSample: 442, age25to34Balance: -442, age35to50MinSample: 0, age35to50AchievedSample: 589, age35to50Balance: -589, age50PlusMinSample: 0, age50PlusAchievedSample: 431, age50PlusBalance: -431 },
    { id: 14, pcName: 'Darbhanga', pcCode: 14, sampleAchieved: 1875, age18to24MinSample: 0, age18to24AchievedSample: 219, age18to24Balance: -219, age25to34MinSample: 0, age25to34AchievedSample: 447, age25to34Balance: -447, age35to50MinSample: 0, age35to50AchievedSample: 649, age35to50Balance: -649, age50PlusMinSample: 0, age50PlusAchievedSample: 560, age50PlusBalance: -560 },
    { id: 15, pcName: 'Muzaffarpur', pcCode: 15, sampleAchieved: 1416, age18to24MinSample: 0, age18to24AchievedSample: 308, age18to24Balance: -308, age25to34MinSample: 0, age25to34AchievedSample: 462, age25to34Balance: -462, age35to50MinSample: 0, age35to50AchievedSample: 404, age35to50Balance: -404, age50PlusMinSample: 0, age50PlusAchievedSample: 242, age50PlusBalance: -242 },
    { id: 16, pcName: 'Vaishali', pcCode: 16, sampleAchieved: 1123, age18to24MinSample: 0, age18to24AchievedSample: 208, age18to24Balance: -208, age25to34MinSample: 0, age25to34AchievedSample: 375, age25to34Balance: -375, age35to50MinSample: 0, age35to50AchievedSample: 335, age35to50Balance: -335, age50PlusMinSample: 0, age50PlusAchievedSample: 205, age50PlusBalance: -205 },
    { id: 17, pcName: 'Gopalganj (SC)', pcCode: 17, sampleAchieved: 1224, age18to24MinSample: 0, age18to24AchievedSample: 132, age18to24Balance: -132, age25to34MinSample: 0, age25to34AchievedSample: 417, age25to34Balance: -417, age35to50MinSample: 0, age35to50AchievedSample: 508, age35to50Balance: -508, age50PlusMinSample: 0, age50PlusAchievedSample: 167, age50PlusBalance: -167 },
    { id: 18, pcName: 'Siwan', pcCode: 18, sampleAchieved: 980, age18to24MinSample: 0, age18to24AchievedSample: 126, age18to24Balance: -126, age25to34MinSample: 0, age25to34AchievedSample: 292, age25to34Balance: -292, age35to50MinSample: 0, age35to50AchievedSample: 419, age35to50Balance: -419, age50PlusMinSample: 0, age50PlusAchievedSample: 143, age50PlusBalance: -143 },
    { id: 19, pcName: 'Maharajganj', pcCode: 19, sampleAchieved: 1096, age18to24MinSample: 0, age18to24AchievedSample: 210, age18to24Balance: -210, age25to34MinSample: 0, age25to34AchievedSample: 313, age25to34Balance: -313, age35to50MinSample: 0, age35to50AchievedSample: 378, age35to50Balance: -378, age50PlusMinSample: 0, age50PlusAchievedSample: 195, age50PlusBalance: -195 },
    { id: 20, pcName: 'Saran', pcCode: 20, sampleAchieved: 902, age18to24MinSample: 0, age18to24AchievedSample: 47, age18to24Balance: -47, age25to34MinSample: 0, age25to34AchievedSample: 306, age25to34Balance: -306, age35to50MinSample: 0, age35to50AchievedSample: 448, age35to50Balance: -448, age50PlusMinSample: 0, age50PlusAchievedSample: 101, age50PlusBalance: -101 },
  ];

  // Sample PC-wise caste demographic data
  const samplePcCasteWiseData: PCCasteWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, caste1Name: 'Muslim', caste1Quota: 237, caste1Covered: 339, caste1Balance: -102, caste2Name: 'Yadav / Raut', caste2Quota: 110, caste2Covered: 169, caste2Balance: -59, caste3Name: 'Chamar / Ravidas / Mochi', caste3Quota: 88, caste3Covered: 201, caste3Balance: -113, caste4Name: 'Tharu', caste4Quota: 45, caste4Covered: 67, caste4Balance: -22, caste5Name: 'Koeri/Kushwaha', caste5Quota: 78, caste5Covered: 89, caste5Balance: -11, caste6Name: 'Brahmin', caste6Quota: 34, caste6Covered: 45, caste6Balance: -11, caste7Name: 'Rajput', caste7Quota: 56, caste7Covered: 67, caste7Balance: -11, caste8Name: 'Teli', caste8Quota: 23, caste8Covered: 34, caste8Balance: -11, caste9Name: 'Kurmi', caste9Quota: 45, caste9Covered: 56, caste9Balance: -11 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, caste1Name: 'Muslim', caste1Quota: 258, caste1Covered: 263, caste1Balance: -5, caste2Name: 'Yadav / Raut', caste2Quota: 137, caste2Covered: 229, caste2Balance: -92, caste3Name: 'Kewat / Mallah / Bhoi / Bind / Nishad', caste3Quota: 65, caste3Covered: 105, caste3Balance: -40, caste4Name: 'Koeri/Kushwaha', caste4Quota: 89, caste4Covered: 123, caste4Balance: -34, caste5Name: 'Brahmin', caste5Quota: 45, caste5Covered: 56, caste5Balance: -11, caste6Name: 'Rajput', caste6Quota: 67, caste6Covered: 78, caste6Balance: -11, caste7Name: 'Teli', caste7Quota: 34, caste7Covered: 45, caste7Balance: -11, caste8Name: 'Kurmi', caste8Quota: 56, caste8Covered: 67, caste8Balance: -11, caste9Name: 'Chamar / Ravidas / Mochi', caste9Quota: 78, caste9Covered: 89, caste9Balance: -11 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, caste1Name: 'Muslim', caste1Quota: 164, caste1Covered: 97, caste1Balance: 67, caste2Name: 'Yadav / Raut', caste2Quota: 125, caste2Covered: 134, caste2Balance: -9, caste3Name: 'Koeri/Kushwaha', caste3Quota: 105, caste3Covered: 110, caste3Balance: -5, caste4Name: 'Brahmin', caste4Quota: 45, caste4Covered: 56, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 67, caste5Covered: 78, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 34, caste6Covered: 45, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 56, caste7Covered: 67, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 78, caste8Covered: 89, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 45, caste9Covered: 56, caste9Balance: -11 },
    { id: 4, pcName: 'Sheohar', pcCode: 4, sampleAchieved: 1053, caste1Name: 'Muslim', caste1Quota: 207, caste1Covered: 101, caste1Balance: 106, caste2Name: 'Yadav / Raut', caste2Quota: 90, caste2Covered: 122, caste2Balance: -32, caste3Name: 'Teli', caste3Quota: 73, caste3Covered: 69, caste3Balance: 4, caste4Name: 'Rajput', caste4Quota: 56, caste4Covered: 67, caste4Balance: -11, caste5Name: 'Brahmin', caste5Quota: 45, caste5Covered: 56, caste5Balance: -11, caste6Name: 'Koeri/Kushwaha', caste6Quota: 67, caste6Covered: 78, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 56, caste7Covered: 67, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 78, caste8Covered: 89, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 45, caste9Covered: 56, caste9Balance: -11 },
    { id: 5, pcName: 'Sitamarhi', pcCode: 5, sampleAchieved: 1567, caste1Name: 'Muslim', caste1Quota: 189, caste1Covered: 234, caste1Balance: -45, caste2Name: 'Yadav / Raut', caste2Quota: 156, caste2Covered: 189, caste2Balance: -33, caste3Name: 'Koeri/Kushwaha', caste3Quota: 123, caste3Covered: 145, caste3Balance: -22, caste4Name: 'Brahmin', caste4Quota: 67, caste4Covered: 78, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 89, caste5Covered: 100, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 45, caste6Covered: 56, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 67, caste7Covered: 78, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 89, caste8Covered: 100, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 56, caste9Covered: 67, caste9Balance: -11 },
    { id: 6, pcName: 'Madhubani', pcCode: 6, sampleAchieved: 1932, caste1Name: 'Muslim', caste1Quota: 234, caste1Covered: 267, caste1Balance: -33, caste2Name: 'Yadav / Raut', caste2Quota: 189, caste2Covered: 223, caste2Balance: -34, caste3Name: 'Koeri/Kushwaha', caste3Quota: 145, caste3Covered: 167, caste3Balance: -22, caste4Name: 'Brahmin', caste4Quota: 78, caste4Covered: 89, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 100, caste5Covered: 111, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 56, caste6Covered: 67, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 78, caste7Covered: 89, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 100, caste8Covered: 111, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 67, caste9Covered: 78, caste9Balance: -11 },
    { id: 7, pcName: 'Jhanjharpur', pcCode: 7, sampleAchieved: 1695, caste1Name: 'Muslim', caste1Quota: 201, caste1Covered: 234, caste1Balance: -33, caste2Name: 'Yadav / Raut', caste2Quota: 167, caste2Covered: 189, caste2Balance: -22, caste3Name: 'Koeri/Kushwaha', caste3Quota: 123, caste3Covered: 145, caste3Balance: -22, caste4Name: 'Brahmin', caste4Quota: 67, caste4Covered: 78, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 89, caste5Covered: 100, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 45, caste6Covered: 56, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 67, caste7Covered: 78, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 89, caste8Covered: 100, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 56, caste9Covered: 67, caste9Balance: -11 },
    { id: 8, pcName: 'Supaul', pcCode: 8, sampleAchieved: 1697, caste1Name: 'Muslim', caste1Quota: 201, caste1Covered: 234, caste1Balance: -33, caste2Name: 'Yadav / Raut', caste2Quota: 167, caste2Covered: 189, caste2Balance: -22, caste3Name: 'Koeri/Kushwaha', caste3Quota: 123, caste3Covered: 145, caste3Balance: -22, caste4Name: 'Brahmin', caste4Quota: 67, caste4Covered: 78, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 89, caste5Covered: 100, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 45, caste6Covered: 56, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 67, caste7Covered: 78, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 89, caste8Covered: 100, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 56, caste9Covered: 67, caste9Balance: -11 },
    { id: 9, pcName: 'Araria', pcCode: 9, sampleAchieved: 144, caste1Name: 'Muslim', caste1Quota: 23, caste1Covered: 34, caste1Balance: -11, caste2Name: 'Yadav / Raut', caste2Quota: 18, caste2Covered: 23, caste2Balance: -5, caste3Name: 'Koeri/Kushwaha', caste3Quota: 14, caste3Covered: 18, caste3Balance: -4, caste4Name: 'Brahmin', caste4Quota: 8, caste4Covered: 9, caste4Balance: -1, caste5Name: 'Rajput', caste5Quota: 10, caste5Covered: 11, caste5Balance: -1, caste6Name: 'Teli', caste6Quota: 5, caste6Covered: 6, caste6Balance: -1, caste7Name: 'Kurmi', caste7Quota: 8, caste7Covered: 9, caste7Balance: -1, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 10, caste8Covered: 11, caste8Balance: -1, caste9Name: 'Tharu', caste9Quota: 6, caste9Covered: 7, caste9Balance: -1 },
    { id: 10, pcName: 'Kishanganj', pcCode: 10, sampleAchieved: 613, caste1Name: 'Muslim', caste1Quota: 98, caste1Covered: 123, caste1Balance: -25, caste2Name: 'Yadav / Raut', caste2Quota: 78, caste2Covered: 89, caste2Balance: -11, caste3Name: 'Koeri/Kushwaha', caste3Quota: 56, caste3Covered: 67, caste3Balance: -11, caste4Name: 'Brahmin', caste4Quota: 34, caste4Covered: 45, caste4Balance: -11, caste5Name: 'Rajput', caste5Quota: 45, caste5Covered: 56, caste5Balance: -11, caste6Name: 'Teli', caste6Quota: 23, caste6Covered: 34, caste6Balance: -11, caste7Name: 'Kurmi', caste7Quota: 34, caste7Covered: 45, caste7Balance: -11, caste8Name: 'Chamar / Ravidas / Mochi', caste8Quota: 45, caste8Covered: 56, caste8Balance: -11, caste9Name: 'Tharu', caste9Quota: 28, caste9Covered: 39, caste9Balance: -11 }
  ];

  // Sample PC-wise religion demographic data
  const samplePcReligionWiseData: PCReligionWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, religion1Name: 'Islam', religion1Quota: 237, religion1Covered: 339, religion1Balance: -102, religion2Name: 'Sanatana Dharma', religion2Quota: 110, religion2Covered: 169, religion2Balance: -59, religion3Name: 'Christianity', religion3Quota: 88, religion3Covered: 201, religion3Balance: -113, religion4Name: 'Sikhism', religion4Quota: 45, religion4Covered: 67, religion4Balance: -22, religion5Name: 'Buddhism', religion5Quota: 78, religion5Covered: 89, religion5Balance: -11 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, religion1Name: 'Islam', religion1Quota: 258, religion1Covered: 263, religion1Balance: -5, religion2Name: 'Sanatana Dharma', religion2Quota: 137, religion2Covered: 229, religion2Balance: -92, religion3Name: 'Christianity', religion3Quota: 65, religion3Covered: 105, religion3Balance: -40, religion4Name: 'Sikhism', religion4Quota: 89, religion4Covered: 123, religion4Balance: -34, religion5Name: 'Buddhism', religion5Quota: 45, religion5Covered: 56, religion5Balance: -11 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, religion1Name: 'Islam', religion1Quota: 164, religion1Covered: 97, religion1Balance: 67, religion2Name: 'Sanatana Dharma', religion2Quota: 125, religion2Covered: 134, religion2Balance: -9, religion3Name: 'Christianity', religion3Quota: 105, religion3Covered: 110, religion3Balance: -5, religion4Name: 'Sikhism', religion4Quota: 45, religion4Covered: 56, religion4Balance: -11, religion5Name: 'Buddhism', religion5Quota: 67, religion5Covered: 78, religion5Balance: -11 },
  ];

  // Sample PC-wise social category demographic data
  const samplePcSocialCategoryWiseData: PCSocialCategoryWiseData[] = [
    { id: 1, pcName: 'Valmiki Nagar', pcCode: 1, sampleAchieved: 1965, socialCategory1Name: 'General', socialCategory1Quota: 237, socialCategory1Covered: 339, socialCategory1Balance: -102, socialCategory2Name: 'OBC', socialCategory2Quota: 110, socialCategory2Covered: 169, socialCategory2Balance: -59, socialCategory3Name: 'SC', socialCategory3Quota: 88, socialCategory3Covered: 201, socialCategory3Balance: -113, socialCategory4Name: 'ST', socialCategory4Quota: 45, socialCategory4Covered: 67, socialCategory4Balance: -22, socialCategory5Name: 'Others', socialCategory5Quota: 78, socialCategory5Covered: 89, socialCategory5Balance: -11 },
    { id: 2, pcName: 'Paschim Champaran', pcCode: 2, sampleAchieved: 1824, socialCategory1Name: 'General', socialCategory1Quota: 258, socialCategory1Covered: 263, socialCategory1Balance: -5, socialCategory2Name: 'OBC', socialCategory2Quota: 137, socialCategory2Covered: 229, socialCategory2Balance: -92, socialCategory3Name: 'SC', socialCategory3Quota: 65, socialCategory3Covered: 105, socialCategory3Balance: -40, socialCategory4Name: 'ST', socialCategory4Quota: 89, socialCategory4Covered: 123, socialCategory4Balance: -34, socialCategory5Name: 'Others', socialCategory5Quota: 45, socialCategory5Covered: 56, socialCategory5Balance: -11 },
    { id: 3, pcName: 'Purvi Champaran', pcCode: 3, sampleAchieved: 1109, socialCategory1Name: 'General', socialCategory1Quota: 164, socialCategory1Covered: 97, socialCategory1Balance: 67, socialCategory2Name: 'OBC', socialCategory2Quota: 125, socialCategory2Covered: 134, socialCategory2Balance: -9, socialCategory3Name: 'SC', socialCategory3Quota: 105, socialCategory3Covered: 110, socialCategory3Balance: -5, socialCategory4Name: 'ST', socialCategory4Quota: 45, socialCategory4Covered: 56, socialCategory4Balance: -11, socialCategory5Name: 'Others', socialCategory5Quota: 67, socialCategory5Covered: 78, socialCategory5Balance: -11 },
  ];

  // Data transformation functions
  const transformGenderWiseData = (apiData: any[]): PCGenderWiseData[] => {
    console.log('Transforming gender data:', apiData.slice(0, 2));
    return apiData.map((item, index) => ({
      id: index + 1,
      pcName: item.pc_name || item.ac_name || '',
      pcCode: item.pc_code || item.ac_code || 0,
      sampleAchieved: item.sample_achieved || 0,
      // Handle different male/female field structures
      maleQuota: item.male?.quota || item.male_min_sample || item.male?.min_sample || 0,
      maleCovered: item.male?.covered || item.male_covered || 0,
      maleBalance: item.male?.balance || item.male_balance || 0,
      femaleQuota: item.female?.quota || item.female_min_sample || item.female?.min_sample || 0,
      femaleCovered: item.female?.covered || item.female_covered || 0,
      femaleBalance: item.female?.balance || item.female_balance || 0
    }));
  };

  const transformAgeWiseData = (apiData: any[]): PCAgeWiseData[] => {
    console.log('Transforming age data:', apiData.slice(0, 2));
    return apiData.map((item, index) => ({
      id: index + 1,
      pcName: item.pc_name || item.ac_name || '',
      pcCode: item.pc_code || item.ac_code || 0,
      sampleAchieved: item.sample_achieved || 0,
      // Handle different age group field structures
      age18to24MinSample: item.Age_18_24?.min_sample || item.age_groups?.['18_24']?.quota || 0,
      age18to24AchievedSample: item.Age_18_24?.achieved_sample || item.age_groups?.['18_24']?.covered || 0,
      age18to24Balance: item.Age_18_24?.balance || item.age_groups?.['18_24']?.balance || 0,
      age25to34MinSample: item.Age_25_34?.min_sample || item.age_groups?.['25_34']?.quota || 0,
      age25to34AchievedSample: item.Age_25_34?.achieved_sample || item.age_groups?.['25_34']?.covered || 0,
      age25to34Balance: item.Age_25_34?.balance || item.age_groups?.['25_34']?.balance || 0,
      age35to50MinSample: item.Age_35_50?.min_sample || item.age_groups?.['35_50']?.quota || 0,
      age35to50AchievedSample: item.Age_35_50?.achieved_sample || item.age_groups?.['35_50']?.covered || 0,
      age35to50Balance: item.Age_35_50?.balance || item.age_groups?.['35_50']?.balance || 0,
      age50PlusMinSample: item.age_50_plus?.min_sample || item.age_groups?.['50_above']?.quota || 0,
      age50PlusAchievedSample: item.age_50_plus?.achieved_sample || item.age_groups?.['50_above']?.covered || 0,
      age50PlusBalance: item.age_50_plus?.balance || item.age_groups?.['50_above']?.balance || 0
    }));
  };

  const transformLocalityWiseData = (apiData: any[]): PCLocalityWiseData[] => {
    console.log('Transforming locality data:', apiData.slice(0, 2));
    console.log('First item structure:', apiData[0] ? Object.keys(apiData[0]) : 'No items');
    return apiData.map((item, index) => ({
      id: index + 1,
      pcName: item.pc_name || '',
      pcCode: item.pc_code || 0,
      sampleAchieved: item.sample_achieved || 0,
      urbanPopulation: item.urban_population || item.Urban?.population || 0,
      urbanSample: item.urban_sample || item.Urban?.sample_percentage || 0,
      urbanDifference: item.urban_difference || item.Urban?.difference || 0,
      ruralPopulation: item.rural_population || item.Rural?.population || 0,
      ruralSample: item.rural_sample || item.Rural?.sample_percentage || 0,
      ruralDifference: item.rural_difference || item.Rural?.difference || 0
    }));
  };

  const transformReligionWiseData = (apiData: any[]): PCReligionWiseData[] => {
    console.log('Transforming religion data:', apiData.slice(0, 2));
    return apiData.map((item, index) => {
      // Handle different religion data structures
      let religions = [];
      
      if (item.religions && Array.isArray(item.religions)) {
        // Array format with religions property
        religions = item.religions;
      } else if (item.hindu || item.muslim || item.christian || item.others) {
        // Direct object format (like PPM version)
        religions = [
          { religion_name: 'Hindu', quota: item.hindu?.population || 0, covered: item.hindu?.sample || 0, balance: item.hindu?.difference || 0 },
          { religion_name: 'Muslim', quota: item.muslim?.population || 0, covered: item.muslim?.sample || 0, balance: item.muslim?.difference || 0 },
          { religion_name: 'Christian', quota: item.christian?.population || 0, covered: item.christian?.sample || 0, balance: item.christian?.difference || 0 },
          { religion_name: 'Others', quota: item.others?.population || 0, covered: item.others?.sample || 0, balance: item.others?.difference || 0 }
        ];
      }
      
      return {
        id: index + 1,
        pcName: item.pc_name || item.ac_name || '',
        pcCode: item.pc_code || item.ac_code || 0,
        sampleAchieved: item.sample_achieved || 0,
        religion1Name: religions[0]?.religion_name || '',
        religion1Quota: religions[0]?.quota || religions[0]?.population || 0,
        religion1Covered: religions[0]?.covered || religions[0]?.sample || 0,
        religion1Balance: religions[0]?.balance || religions[0]?.difference || 0,
        religion2Name: religions[1]?.religion_name || '',
        religion2Quota: religions[1]?.quota || religions[1]?.population || 0,
        religion2Covered: religions[1]?.covered || religions[1]?.sample || 0,
        religion2Balance: religions[1]?.balance || religions[1]?.difference || 0,
        religion3Name: religions[2]?.religion_name || '',
        religion3Quota: religions[2]?.quota || religions[2]?.population || 0,
        religion3Covered: religions[2]?.covered || religions[2]?.sample || 0,
        religion3Balance: religions[2]?.balance || religions[2]?.difference || 0,
        religion4Name: religions[3]?.religion_name || '',
        religion4Quota: religions[3]?.quota || religions[3]?.population || 0,
        religion4Covered: religions[3]?.covered || religions[3]?.sample || 0,
        religion4Balance: religions[3]?.balance || religions[3]?.difference || 0,
        religion5Name: religions[4]?.religion_name || '',
        religion5Quota: religions[4]?.quota || religions[4]?.population || 0,
        religion5Covered: religions[4]?.covered || religions[4]?.sample || 0,
        religion5Balance: religions[4]?.balance || religions[4]?.difference || 0
      };
    });
  };

  const transformSocialCategoryWiseData = (apiData: any[]): PCSocialCategoryWiseData[] => {
    console.log('Transforming social category data:', apiData.slice(0, 2));
    return apiData.map((item, index) => {
      // Handle different social category data structures
      let socialCategories = [];
      
      if (item.social_categories && Array.isArray(item.social_categories)) {
        // Array format with social_categories property
        socialCategories = item.social_categories;
      } else if (item.sc || item.st || item.general_obc) {
        // Direct object format (like PPM version)
        socialCategories = [
          { category_name: 'SC', quota: item.sc?.population || 0, covered: item.sc?.sample || 0, balance: item.sc?.difference || 0 },
          { category_name: 'ST', quota: item.st?.population || 0, covered: item.st?.sample || 0, balance: item.st?.difference || 0 },
          { category_name: 'General+OBC', quota: item.general_obc?.population || 0, covered: item.general_obc?.sample || 0, balance: item.general_obc?.difference || 0 }
        ];
      }
      
      return {
        id: index + 1,
        pcName: item.pc_name || item.ac_name || '',
        pcCode: item.pc_code || item.ac_code || 0,
        sampleAchieved: item.sample_achieved || 0,
        socialCategory1Name: socialCategories[0]?.category_name || '',
        socialCategory1Quota: socialCategories[0]?.quota || socialCategories[0]?.population || 0,
        socialCategory1Covered: socialCategories[0]?.covered || socialCategories[0]?.sample || 0,
        socialCategory1Balance: socialCategories[0]?.balance || socialCategories[0]?.difference || 0,
        socialCategory2Name: socialCategories[1]?.category_name || '',
        socialCategory2Quota: socialCategories[1]?.quota || socialCategories[1]?.population || 0,
        socialCategory2Covered: socialCategories[1]?.covered || socialCategories[1]?.sample || 0,
        socialCategory2Balance: socialCategories[1]?.balance || socialCategories[1]?.difference || 0,
        socialCategory3Name: socialCategories[2]?.category_name || '',
        socialCategory3Quota: socialCategories[2]?.quota || socialCategories[2]?.population || 0,
        socialCategory3Covered: socialCategories[2]?.covered || socialCategories[2]?.sample || 0,
        socialCategory3Balance: socialCategories[2]?.balance || socialCategories[2]?.difference || 0,
        socialCategory4Name: socialCategories[3]?.category_name || '',
        socialCategory4Quota: socialCategories[3]?.quota || socialCategories[3]?.population || 0,
        socialCategory4Covered: socialCategories[3]?.covered || socialCategories[3]?.sample || 0,
        socialCategory4Balance: socialCategories[3]?.balance || socialCategories[3]?.difference || 0,
        socialCategory5Name: socialCategories[4]?.category_name || '',
        socialCategory5Quota: socialCategories[4]?.quota || socialCategories[4]?.population || 0,
        socialCategory5Covered: socialCategories[4]?.covered || socialCategories[4]?.sample || 0,
        socialCategory5Balance: socialCategories[4]?.balance || socialCategories[4]?.difference || 0
      };
    });
  };

  const transformCasteWiseData = (apiData: any[]): PCCasteWiseData[] => {
    return apiData.map((item, index) => {
      const castes = item.castes || [];
      return {
        id: index + 1,
        pcName: item.pc_name || item.ac_name || '',
        pcCode: item.pc_code || item.ac_code || 0,
        sampleAchieved: item.sample_achieved || 0,
        caste1Name: castes[0]?.caste_name || '',
        caste1Quota: castes[0]?.quota || 0,
        caste1Covered: castes[0]?.covered || 0,
        caste1Balance: castes[0]?.balance || 0,
        caste2Name: castes[1]?.caste_name || '',
        caste2Quota: castes[1]?.quota || 0,
        caste2Covered: castes[1]?.covered || 0,
        caste2Balance: castes[1]?.balance || 0,
        caste3Name: castes[2]?.caste_name || '',
        caste3Quota: castes[2]?.quota || 0,
        caste3Covered: castes[2]?.covered || 0,
        caste3Balance: castes[2]?.balance || 0,
        caste4Name: castes[3]?.caste_name || '',
        caste4Quota: castes[3]?.quota || 0,
        caste4Covered: castes[3]?.covered || 0,
        caste4Balance: castes[3]?.balance || 0,
        caste5Name: castes[4]?.caste_name || '',
        caste5Quota: castes[4]?.quota || 0,
        caste5Covered: castes[4]?.covered || 0,
        caste5Balance: castes[4]?.balance || 0,
        caste6Name: castes[5]?.caste_name || '',
        caste6Quota: castes[5]?.quota || 0,
        caste6Covered: castes[5]?.covered || 0,
        caste6Balance: castes[5]?.balance || 0,
        caste7Name: castes[6]?.caste_name || '',
        caste7Quota: castes[6]?.quota || 0,
        caste7Covered: castes[6]?.covered || 0,
        caste7Balance: castes[6]?.balance || 0,
        caste8Name: castes[7]?.caste_name || '',
        caste8Quota: castes[7]?.quota || 0,
        caste8Covered: castes[7]?.covered || 0,
        caste8Balance: castes[7]?.balance || 0,
        caste9Name: castes[8]?.caste_name || '',
        caste9Quota: castes[8]?.quota || 0,
        caste9Covered: castes[8]?.covered || 0,
        caste9Balance: castes[8]?.balance || 0
      };
    });
  };

  // Helper function to set fallback sample data
  const setFallbackData = (tabType: string) => {
    switch (tabType) {
      case 'genderwise':
        setPcGenderWiseData(sampleGenderWiseData);
        break;
      case 'agewise':
        setPcAgeWiseData(samplePcAgeWiseData);
        break;
      case 'localitywise':
        setPcLocalityWiseData(samplePcLocalityWiseData);
        break;
      case 'religionwise':
        setPcReligionWiseData(samplePcReligionWiseData);
        break;
      case 'socialcategorywise':
        setPcSocialCategoryWiseData(samplePcSocialCategoryWiseData);
        break;
      case 'castewise':
        setPcCasteWiseData(samplePcCasteWiseData);
        break;
      default:
        console.log(`No sample data available for ${tabType}`);
    }
  };

  // Fetch data from API
  const fetchDemographicData = async (tabType: string) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = apiEndpoints[tabType];
      if (!endpoint) {
        console.log(`No API endpoint defined for tab: ${tabType}`);
        // Use sample data for undefined tabs
        setFallbackData(tabType);
        return;
      }

      console.log(`Fetching data for ${tabType} from ${endpoint}`);
      console.log(`Full API URL: http://localhost:4001${endpoint}`);
      
      // Debug: Check authentication token
      const token = localStorage.getItem('accessToken');
      console.log(`Auth token exists:`, !!token);
      console.log(`Token preview:`, token ? `${token.substring(0, 30)}...` : 'N/A');
      
      // Make API call with 10 second timeout for faster failure
      const response = await apiClient.get(endpoint, { timeout: 10000 });
      const data: APIResponse = response.data;

      console.log(`API Response for ${tabType}:`, data);
      console.log(`Raw response:`, response);
      console.log(`Data received:`, typeof data, data);
      console.log(`Success flag:`, data?.success);
      console.log(`Data array:`, data?.data, Array.isArray(data?.data));
      
      // Specific debugging for locality-wise
      if (tabType === 'localitywise') {
        console.log(`LOCALITY DEBUG:`, {
          responseStatus: response?.status,
          dataSuccess: data?.success,
          dataError: data?.error,
          dataStructure: data?.data ? Object.keys(data.data) : 'no data object',
          dataType: typeof data?.data,
          isArray: Array.isArray(data?.data)
        });
      }

      if (data && data.success) {
        // Handle flexible API response structures - check multiple possible locations for data
        let constituencyData = null;
        
        // Try different possible data locations
        if (Array.isArray(data.data)) {
          // Direct array format
          constituencyData = data.data;
        } else if (data.data.pc_data && Array.isArray(data.data.pc_data)) {
          // PC data format
          constituencyData = data.data.pc_data;
        } else if (data.data.constituencies && Array.isArray(data.data.constituencies)) {
          // Constituencies format (like PPM)
          constituencyData = data.data.constituencies;
        } else if (data.data.ac_data && Array.isArray(data.data.ac_data)) {
          // AC data format
          constituencyData = data.data.ac_data;
        }
        
        console.log(`Processing ${tabType} data:`, {
          responseSuccess: data.success,
          dataKeys: data.data ? Object.keys(data.data) : 'no data',
          constituencyDataIsArray: Array.isArray(constituencyData),
          constituencyDataLength: Array.isArray(constituencyData) ? constituencyData.length : 'not array',
          sampleData: constituencyData && Array.isArray(constituencyData) ? constituencyData.slice(0, 2) : constituencyData
        });

        if (Array.isArray(constituencyData) && constituencyData.length > 0) {
          // Transform data based on tab type
          switch (tabType) {
            case 'genderwise':
              setPcGenderWiseData(transformGenderWiseData(constituencyData));
              break;
            case 'agewise':
              setPcAgeWiseData(transformAgeWiseData(constituencyData));
              break;
            case 'localitywise':
              setPcLocalityWiseData(transformLocalityWiseData(constituencyData));
              break;
            case 'religionwise':
              setPcReligionWiseData(transformReligionWiseData(constituencyData));
              break;
            case 'socialcategorywise':
              setPcSocialCategoryWiseData(transformSocialCategoryWiseData(constituencyData));
              break;
            case 'castewise':
              setPcCasteWiseData(transformCasteWiseData(constituencyData));
              break;
          }
        } else {
          console.log(`API returned success but no usable data array for ${tabType}, using sample data`);
          setFallbackData(tabType);
        }
      } else if (data && data.error) {
        console.log(`API Error for ${tabType}:`, data.error);
        setError(data.error);
        // Use sample data on API error
        setFallbackData(tabType);
      } else if (!data || !data.data || (Array.isArray(data.data) && data.data.length === 0)) {
        console.log(`Empty or no data for ${tabType}, using sample data`);
        console.log(`This might indicate that the API endpoint '/demographicpc/${tabType}' is not implemented yet`);
        console.log(`Full response object:`, JSON.stringify(data, null, 2));
        // Use sample data silently for empty responses
        setFallbackData(tabType);
      } else {
        const errorMsg = `No data available or unexpected response format for ${tabType}`;
        console.log(`Error: ${errorMsg}`);
        console.log(`Received data type: ${typeof data}, Success: ${data?.success}, Data: ${JSON.stringify(data?.data).substring(0, 100)}...`);
        setError(errorMsg);
        // Use sample data on format error
        setFallbackData(tabType);
      }
    } catch (err: any) {
      // Better error handling for different error types
      if (err.message?.includes('timeout') || err.code === 'ECONNABORTED') {
        console.log(`Request timed out for ${tabType}, using sample data`);
        setFallbackData(tabType);
      } else {
        console.error(`Error fetching ${tabType} data:`, err);
        
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
          setFallbackData(tabType);
        } else if (err.response?.status === 403) {
          setError('Access forbidden. You do not have permission to view this data.');
          setFallbackData(tabType);
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
          setFallbackData(tabType);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
          setFallbackData(tabType);
        } else {
          // For network errors, don't show error, just use sample data
          console.log(`Network/Connection error for ${tabType}, using sample data`);
          setFallbackData(tabType);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    fetchDemographicData(activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'genderwise', label: 'Gender Wise', href: '/dqm/demographic', icon: Users },
    { id: 'agewise', label: 'Age Wise', href: '/dqm/demographic/agewise', icon: Calendar },
    { id: 'localitywise', label: 'Locality Wise', href: '/dqm/demographic/localitywise', icon: MapPin },
    { id: 'religionwise', label: 'Religion Wise', href: '/dqm/demographic/religionwise', icon: Heart },
    { id: 'socialcategorywise', label: 'Social Category Wise', href: '/dqm/demographic/socialcategorywise', icon: UserCheck },
    { id: 'castewise', label: 'Caste Wise', href: '/dqm/demographic/castewise', icon: Shield }
  ];

  const handleDownload = () => {
    console.log('Downloading demographic data...');
  };

  // Debug function specifically for locality-wise API
  const debugLocalityAPI = async () => {
    console.log('=== LOCALITY-WISE API DEBUGGING ===');
    
    try {
      const endpoint = '/demographicpc/localitywise';
      console.log(`Testing endpoint: http://localhost:4001${endpoint}`);
      
      const response = await apiClient.get(endpoint, { timeout: 10000 });
      console.log('✅ API Response received:', response.data);
      setApiStatus('✅ API is working');
      
      // Check if it matches expected structure
      const data = response.data;
      if (data.success && data.data && Array.isArray(data.data)) {
        console.log('✅ Valid array structure - 1st item:', data.data[0]);
        console.log('✅ Available fields:', data.data[0] ? Object.keys(data.data[0]) : 'No fields');
      } else if (data.success && data.data && data.data.pc_data) {
        console.log('✅ Nested pc_data structure - 1st item:', data.data.pc_data[0]);
        console.log('✅ Available fields:', data.data.pc_data[0] ? Object.keys(data.data.pc_data[0]) : 'No fields');
      } else {
        console.log('❌ Unexpected structure:', data);
      }
      
    } catch (error: any) {
      console.log('❌ API Error:', error.response?.status, error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.log('❌ Authentication issue - check login token');
        setApiStatus('❌ Authentication required');
      } else if (error.response?.status === 404) {
        console.log('❌ Endpoint not found - API may not be implemented');
        setApiStatus('❌ API endpoint not implemented');
      } else if (error.response?.status === 500) {
        console.log('❌ Server error - backend issue');
        setApiStatus('❌ Server error');
      } else {
        setApiStatus(`❌ Error: ${error.response?.status || 'Network error'}`);
      }
      
      // Test with mock data to verify transformation logic
      console.log('🧪 Testing transformation with mock data...');
      const mockAPIResponse = {
        success: true,
        data: [
          {
            pc_name: 'Valmiki Nagar',
            pc_code: 1,
            sample_achieved: 1965,
            urban_population: 8.10,
            urban_sample: 6.8,
            urban_difference: 1.2,
            rural_population: 91.90,
            rural_sample: 93.2,
            rural_difference: 2.2
          }
        ]
      };
      
      console.log('Mock transformation result:');
      const transformedData = transformLocalityWiseData(mockAPIResponse.data);
      console.log(transformedData);
    }
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

  const renderReligionWiseTable = () => (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th className="text-center">PC Name</th>
          <th className="text-center">PC Code</th>
          <th className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Religion 1
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Religion 2
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Religion 3
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Religion 4
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Religion 5
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
        </tr>
      </thead>
      <tbody>
        {pcReligionWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.pcName}</td>
            <td className="text-center">{row.pcCode}</td>
            <td className="text-center">{row.sampleAchieved.toLocaleString()}</td>
            <td className="text-center">{row.religion1Name}</td>
            <td className="text-center">{row.religion1Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.religion1Quota, row.religion1Covered)}`}>{row.religion1Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.religion1Balance)}`}>{row.religion1Balance.toLocaleString()}</td>
            <td className="text-center">{row.religion2Name}</td>
            <td className="text-center">{row.religion2Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.religion2Quota, row.religion2Covered)}`}>{row.religion2Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.religion2Balance)}`}>{row.religion2Balance.toLocaleString()}</td>
            <td className="text-center">{row.religion3Name}</td>
            <td className="text-center">{row.religion3Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.religion3Quota, row.religion3Covered)}`}>{row.religion3Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.religion3Balance)}`}>{row.religion3Balance.toLocaleString()}</td>
            <td className="text-center">{row.religion4Name}</td>
            <td className="text-center">{row.religion4Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.religion4Quota, row.religion4Covered)}`}>{row.religion4Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.religion4Balance)}`}>{row.religion4Balance.toLocaleString()}</td>
            <td className="text-center">{row.religion5Name}</td>
            <td className="text-center">{row.religion5Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.religion5Quota, row.religion5Covered)}`}>{row.religion5Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.religion5Balance)}`}>{row.religion5Balance.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderSocialCategoryWiseTable = () => (
    <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
      <thead className="sticky-header">
        <tr>
          <th className="text-center">PC Name</th>
          <th className="text-center">PC Code</th>
          <th className="text-center">Sample Achieved</th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Social Category 1
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Social Category 2
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Social Category 3
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Social Category 4
          </th>
          <th className="text-center border-l-2 border-r-2" colSpan={4}>
            Social Category 5
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
        </tr>
      </thead>
      <tbody>
        {pcSocialCategoryWiseData.map((row) => (
          <tr key={row.id}>
            <td>{row.pcName}</td>
            <td className="text-center">{row.pcCode}</td>
            <td className="text-center">{row.sampleAchieved.toLocaleString()}</td>
            <td className="text-center">{row.socialCategory1Name}</td>
            <td className="text-center">{row.socialCategory1Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.socialCategory1Quota, row.socialCategory1Covered)}`}>{row.socialCategory1Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.socialCategory1Balance)}`}>{row.socialCategory1Balance.toLocaleString()}</td>
            <td className="text-center">{row.socialCategory2Name}</td>
            <td className="text-center">{row.socialCategory2Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.socialCategory2Quota, row.socialCategory2Covered)}`}>{row.socialCategory2Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.socialCategory2Balance)}`}>{row.socialCategory2Balance.toLocaleString()}</td>
            <td className="text-center">{row.socialCategory3Name}</td>
            <td className="text-center">{row.socialCategory3Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.socialCategory3Quota, row.socialCategory3Covered)}`}>{row.socialCategory3Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.socialCategory3Balance)}`}>{row.socialCategory3Balance.toLocaleString()}</td>
            <td className="text-center">{row.socialCategory4Name}</td>
            <td className="text-center">{row.socialCategory4Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.socialCategory4Quota, row.socialCategory4Covered)}`}>{row.socialCategory4Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.socialCategory4Balance)}`}>{row.socialCategory4Balance.toLocaleString()}</td>
            <td className="text-center">{row.socialCategory5Name}</td>
            <td className="text-center">{row.socialCategory5Quota}</td>
            <td className={`text-center ${getCasteCoveredStyle(row.socialCategory5Quota, row.socialCategory5Covered)}`}>{row.socialCategory5Covered.toLocaleString()}</td>
            <td className={`text-center ${getCasteBalanceStyle(row.socialCategory5Balance)}`}>{row.socialCategory5Balance.toLocaleString()}</td>
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
      case 'religionwise':
        return renderReligionWiseTable();
      case 'socialcategorywise':
        return renderSocialCategoryWiseTable();
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

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <Text className="text-gray-600">Loading demographic data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <Card className="mb-6">
          <div className="card-body text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading Data</Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <Text className="text-gray-500 text-sm mb-4">
              The API endpoint for '{activeTab}' demographic data is being debugged. Check browser console for detailed API response data.
              Possible issues: Field mapping mismatch, empty API response, or authentication token expiry.
              You can use sample data below while backend is being fixed.
            </Text>
            <button 
              onClick={() => fetchDemographicData(activeTab)} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-4"
            >
              Retry
            </button>
            <button 
              onClick={() => {
                setError(null);
                setFallbackData(activeTab);
              }} 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Use Sample Data
            </button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
              {getPageTitle()}
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full">
          <Card>
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
