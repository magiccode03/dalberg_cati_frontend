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
  const pcLocalityWiseData: PCLocalityWiseData[] = [
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
  const pcAgeWiseData: PCAgeWiseData[] = [
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
  const pcCasteWiseData: PCCasteWiseData[] = [
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
          <th>PC Name</th>
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
          <th>PC Name</th>
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
          <th>PC Name</th>
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
          <th>PC Name</th>
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
