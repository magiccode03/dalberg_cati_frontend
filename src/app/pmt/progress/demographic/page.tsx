'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { Users, BarChart3, MapPin, Home, Building } from 'lucide-react';

interface DemographicData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  [key: string]: any;
}

export default function DemographicPage() {
  const [activeTab, setActiveTab] = useState('gender-wise');

  // Generate mock data for demographic representation
  const generateDemographicData = (): DemographicData[] => {
    const acNames = [
      'Valmiki Nagar', 'Ramnagar (SC)', 'Narkatiaganj', 'Bagaha', 'Lauriya',
      'Nautan', 'Chanpatia', 'Bettiah', 'Sikta', 'Raxaul', 'Sugauli', 'Narkatia',
      'Harsidhi (SC)', 'Govindganj', 'Kesaria', 'Kalyanpur', 'Pipra', 'Madhuban',
      'Motihari', 'Chiraia', 'Dhaka', 'Sheohar', 'Riga', 'Bathnaha (SC)', 'Parihar',
      'Sursand', 'Bajpatti', 'Sitamarhi', 'Runnisaidpur', 'Belsand', 'Harlakhi',
      'Benipatti', 'Khajauli', 'Babubarhi', 'Bisfi', 'Madhubani', 'Rajnagar (SC)',
      'Jhanjharpur', 'Phulparas', 'Laukaha', 'Nirmali', 'Pipra', 'Supaul',
      'Triveniganj (SC)', 'Chhatapur', 'Narpatganj', 'Raniganj (SC)', 'Forbesganj',
      'Araria', 'Jokihat', 'Sikti', 'Bahadurganj', 'Thakurganj', 'Kishanganj',
      'Kochadhaman', 'Amour', 'Baisi', 'Kasba', 'Banmankhi (SC)', 'Rupauli',
      'Dhamdaha', 'Purnia', 'Katihar', 'Kadwa', 'Balrampur', 'Pranpur',
      'Manihari (ST)', 'Barari', 'Korha (SC)', 'Alamnagar', 'Bihariganj',
      'Singheshwar (SC)', 'Madhepura', 'Sonbarsha (SC)', 'Saharsa',
      'Simri Bakhtiarpur', 'Mahishi', 'Kusheshwar Asthan (SC)', 'Gaura Bauram',
      'Benipur', 'Alinagar', 'Darbhanga Rural', 'Darbhanga', 'Hayaghat',
      'Bahadurpur', 'Keoti', 'Jale', 'Gaighat', 'Aurai', 'Minapur',
      'Bochaha (SC)', 'Sakra (SC)', 'Kurhani', 'Muzaffarpur', 'Kanti',
      'Baruraj', 'Paroo', 'Sahebganj', 'Baikunthpur', 'Barauli', 'Gopalganj',
      'Kuchaikote', 'Bhorey (SC)', 'Hathua', 'Siwan', 'Ziradei', 'Darauli (SC)',
      'Raghunathpur', 'Daraundha', 'Barharia', 'Goriakothi', 'Maharajganj',
      'Ekma', 'Manjhi', 'Baniapur', 'Taraiya', 'Marhaura', 'Chapra',
      'Garkha (SC)', 'Amnour', 'Parsa', 'Sonepur', 'Hajipur', 'Lalganj',
      'Vaishali', 'Mahua', 'Raja Pakar (SC)', 'Raghopur', 'Mahnar',
      'Patepur (SC)', 'Kalyanpur (SC)', 'Warisnagar', 'Samastipur', 'Ujiarpur',
      'Morwa', 'Sarairanjan', 'Mohiuddinnagar', 'Bibhutipur', 'Rosera (SC)',
      'Hasanpur', 'Cheria Bariarpur', 'Bachhwara', 'Teghra', 'Matihani',
      'Sahebpur Kamal', 'Begusarai', 'Bakhri (SC)', 'Alauli (SC)', 'Khagaria',
      'Beldaur', 'Parbatta', 'Bihpur', 'Gopalpur', 'Pirpainti (SC)', 'Kahalgaon',
      'Bhagalpur', 'Sultanganj', 'Nathnagar', 'Amarpur', 'Dhauraiya (SC)',
      'Banka', 'Katoria (ST)', 'Belhar', 'Tarapur', 'Munger', 'Jamalpur',
      'Suryagarha', 'Lakhisarai', 'Sheikhpura', 'Barbigha', 'Asthawan',
      'Biharsharif', 'Rajgir (SC)', 'Islampur', 'Hilsa', 'Nalanda', 'Harnaut',
      'Mokama', 'Barh', 'Bakhtiarpur', 'Digha', 'Bankipur', 'Kumhrar',
      'Patna Sahib', 'Fatuha', 'Danapur', 'Maner', 'Phulwari (SC)', 'Masaurhi (SC)',
      'Paliganj', 'Bikram', 'Sandesh', 'Barhara', 'Arrah', 'Agiaon (SC)',
      'Tarari', 'Jagdishpur', 'Shahpur', 'Brahampur', 'Buxar', 'Dumraon',
      'Rajpur (SC)', 'Ramgarh', 'Mohania (SC)', 'Bhabua', 'Chainpur',
      'Chenari (SC)', 'Sasaram', 'Kargahar', 'Dinara', 'Nokha', 'Dehri',
      'Karakat', 'Arwal', 'Kurtha', 'Jahanabad', 'Ghosi', 'Makhadumapur (SC)',
      'Goh', 'Obra', 'Nabinagar', 'Kutumba (SC)', 'Aurangabad', 'Rafiganj',
      'Gurua', 'Sherghati', 'Imamganj (SC)', 'Barachatti (SC)', 'Bodh Gaya (SC)',
      'Gaya Town', 'Tikari', 'Belaganj', 'Atri', 'Wazirganj', 'Rajauli (SC)',
      'Hisua', 'Nawada', 'Gobindpur', 'Warsaliganj', 'Sikandra (SC)', 'Jamui',
      'Jhajha', 'Chakai'
    ];

    const data: DemographicData[] = [];
    
    for (let i = 0; i < acNames.length; i++) {
      const sampleAchieved = Math.floor(Math.random() * 400) + 50;
      const maleQuota = 150;
      const femaleQuota = 120;
      
      // Generate realistic covered numbers with some exceeding quota
      const maleCovered = Math.floor(Math.random() * 300) + 50;
      const femaleCovered = Math.floor(Math.random() * 200) + 30;
      
      const maleBalance = maleQuota - maleCovered;
      const femaleBalance = femaleQuota - femaleCovered;

      data.push({
        id: i + 1,
        acName: acNames[i],
        acCode: i + 1,
        sampleAchieved,
        maleQuota,
        maleCovered,
        maleBalance,
        femaleQuota,
        femaleCovered,
        femaleBalance,
      });
    }
    
    return data;
  };

  // Generate mock data for age-wise demographic representation
  const generateAgeWiseData = (): DemographicData[] => {
    const acNames = [
      'Valmiki Nagar', 'Ramnagar (SC)', 'Narkatiaganj', 'Bagaha', 'Lauriya',
      'Nautan', 'Chanpatia', 'Bettiah', 'Sikta', 'Raxaul', 'Sugauli', 'Narkatia',
      'Harsidhi (SC)', 'Govindganj', 'Kesaria', 'Kalyanpur', 'Pipra', 'Madhuban',
      'Motihari', 'Chiraia', 'Dhaka', 'Sheohar', 'Riga', 'Bathnaha (SC)', 'Parihar',
      'Sursand', 'Bajpatti', 'Sitamarhi', 'Runnisaidpur', 'Belsand', 'Harlakhi',
      'Benipatti', 'Khajauli', 'Babubarhi', 'Bisfi', 'Madhubani', 'Rajnagar (SC)',
      'Jhanjharpur', 'Phulparas', 'Laukaha', 'Nirmali', 'Pipra', 'Supaul',
      'Triveniganj (SC)', 'Chhatapur', 'Narpatganj', 'Raniganj (SC)', 'Forbesganj',
      'Araria', 'Jokihat', 'Sikti', 'Bahadurganj', 'Thakurganj', 'Kishanganj',
      'Kochadhaman', 'Amour', 'Baisi', 'Kasba', 'Banmankhi (SC)', 'Rupauli',
      'Dhamdaha', 'Purnia', 'Katihar', 'Kadwa', 'Balrampur', 'Pranpur',
      'Manihari (ST)', 'Barari', 'Korha (SC)', 'Alamnagar', 'Bihariganj',
      'Singheshwar (SC)', 'Madhepura', 'Sonbarsha (SC)', 'Saharsa',
      'Simri Bakhtiarpur', 'Mahishi', 'Kusheshwar Asthan (SC)', 'Gaura Bauram',
      'Benipur', 'Alinagar', 'Darbhanga Rural', 'Darbhanga', 'Hayaghat',
      'Bahadurpur', 'Keoti', 'Jale', 'Gaighat', 'Aurai', 'Minapur',
      'Bochaha (SC)', 'Sakra (SC)', 'Kurhani', 'Muzaffarpur', 'Kanti',
      'Baruraj', 'Paroo', 'Sahebganj', 'Baikunthpur', 'Barauli', 'Gopalganj',
      'Kuchaikote', 'Bhorey (SC)', 'Hathua', 'Siwan', 'Ziradei', 'Darauli (SC)',
      'Raghunathpur', 'Daraundha', 'Barharia', 'Goriakothi', 'Maharajganj',
      'Ekma', 'Manjhi', 'Baniapur', 'Taraiya', 'Marhaura', 'Chapra',
      'Garkha (SC)', 'Amnour', 'Parsa', 'Sonepur', 'Hajipur', 'Lalganj',
      'Vaishali', 'Mahua', 'Raja Pakar (SC)', 'Raghopur', 'Mahnar',
      'Patepur (SC)', 'Kalyanpur (SC)', 'Warisnagar', 'Samastipur', 'Ujiarpur',
      'Morwa', 'Sarairanjan', 'Mohiuddinnagar', 'Bibhutipur', 'Rosera (SC)',
      'Hasanpur', 'Cheria Bariarpur', 'Bachhwara', 'Teghra', 'Matihani',
      'Sahebpur Kamal', 'Begusarai', 'Bakhri (SC)', 'Alauli (SC)', 'Khagaria',
      'Beldaur', 'Parbatta', 'Bihpur', 'Gopalpur', 'Pirpainti (SC)', 'Kahalgaon',
      'Bhagalpur', 'Sultanganj', 'Nathnagar', 'Amarpur', 'Dhauraiya (SC)',
      'Banka', 'Katoria (ST)', 'Belhar', 'Tarapur', 'Munger', 'Jamalpur',
      'Suryagarha', 'Lakhisarai', 'Sheikhpura', 'Barbigha', 'Asthawan',
      'Biharsharif', 'Rajgir (SC)', 'Islampur', 'Hilsa', 'Nalanda', 'Harnaut',
      'Mokama', 'Barh', 'Bakhtiarpur', 'Digha', 'Bankipur', 'Kumhrar',
      'Patna Sahib', 'Fatuha', 'Danapur', 'Maner', 'Phulwari (SC)', 'Masaurhi (SC)',
      'Paliganj', 'Bikram', 'Sandesh', 'Barhara', 'Arrah', 'Agiaon (SC)',
      'Tarari', 'Jagdishpur', 'Shahpur', 'Brahampur', 'Buxar', 'Dumraon',
      'Rajpur (SC)', 'Ramgarh', 'Mohania (SC)', 'Bhabua', 'Chainpur',
      'Chenari (SC)', 'Sasaram', 'Kargahar', 'Dinara', 'Nokha', 'Dehri',
      'Karakat', 'Arwal', 'Kurtha', 'Jahanabad', 'Ghosi', 'Makhadumapur (SC)',
      'Goh', 'Obra', 'Nabinagar', 'Kutumba (SC)', 'Aurangabad', 'Rafiganj',
      'Gurua', 'Sherghati', 'Imamganj (SC)', 'Barachatti (SC)', 'Bodh Gaya (SC)',
      'Gaya Town', 'Tikari', 'Belaganj', 'Atri', 'Wazirganj', 'Rajauli (SC)',
      'Hisua', 'Nawada', 'Gobindpur', 'Warsaliganj', 'Sikandra (SC)', 'Jamui',
      'Jhajha', 'Chakai'
    ];

    const data: DemographicData[] = [];
    
    for (let i = 0; i < acNames.length; i++) {
      const sampleAchieved = Math.floor(Math.random() * 400) + 50;
      
      // Define quotas for each age group
      const age18to25Quota = 60;
      const age26to35Quota = 80;
      const age36to45Quota = 70;
      const age46to55Quota = 50;
      const age56to65Quota = 40;
      const age65PlusQuota = 30;
      
      // Generate realistic covered numbers
      const age18to25Covered = Math.floor(Math.random() * 100) + 20;
      const age26to35Covered = Math.floor(Math.random() * 120) + 30;
      const age36to45Covered = Math.floor(Math.random() * 100) + 25;
      const age46to55Covered = Math.floor(Math.random() * 80) + 15;
      const age56to65Covered = Math.floor(Math.random() * 60) + 10;
      const age65PlusCovered = Math.floor(Math.random() * 50) + 5;
      
      // Calculate balances
      const age18to25Balance = age18to25Quota - age18to25Covered;
      const age26to35Balance = age26to35Quota - age26to35Covered;
      const age36to45Balance = age36to45Quota - age36to45Covered;
      const age46to55Balance = age46to55Quota - age46to55Covered;
      const age56to65Balance = age56to65Quota - age56to65Covered;
      const age65PlusBalance = age65PlusQuota - age65PlusCovered;

      data.push({
        id: i + 1,
        acName: acNames[i],
        acCode: i + 1,
        sampleAchieved,
        age18to25Quota,
        age18to25Covered,
        age18to25Balance,
        age26to35Quota,
        age26to35Covered,
        age26to35Balance,
        age36to45Quota,
        age36to45Covered,
        age36to45Balance,
        age46to55Quota,
        age46to55Covered,
        age46to55Balance,
        age56to65Quota,
        age56to65Covered,
        age56to65Balance,
        age65PlusQuota,
        age65PlusCovered,
        age65PlusBalance,
      });
    }
    
    return data;
  };

  const demographicData = generateDemographicData();
  const ageWiseData = generateAgeWiseData();

  const tabItems = [
    { id: 'gender-wise', label: 'Gender Wise', icon: Users },
    { id: 'age-wise', label: 'Age Wise', icon: BarChart3 },
    { id: 'caste-wise', label: 'Caste Wise', icon: Building },
    { id: 'religion-wise', label: 'Religion Wise', icon: Building },
    { id: 'social-category-wise', label: 'Social Category Wise', icon: Home },
  ];

  const renderGenderWiseTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Code</th>
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
          {demographicData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.acName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.acCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.maleQuota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.maleCovered > row.maleQuota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.maleCovered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.maleBalance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.femaleQuota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.femaleCovered > row.femaleQuota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.femaleCovered}</td>
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
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Code</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>18-25 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>26-35 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>36-45 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>46-55 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>56-65 Years</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>65+ Years</th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ageWiseData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.acName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.acCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age18to25Quota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age18to25Covered > row.age18to25Quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age18to25Covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age18to25Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age26to35Quota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age26to35Covered > row.age26to35Quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age26to35Covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age26to35Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age36to45Quota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age36to45Covered > row.age36to45Quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age36to45Covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age36to45Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age46to55Quota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age46to55Covered > row.age46to55Quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age46to55Covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age46to55Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age56to65Quota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age56to65Covered > row.age56to65Quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age56to65Covered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age56to65Balance}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age65PlusQuota}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age65PlusCovered > row.age65PlusQuota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age65PlusCovered}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age65PlusBalance}</td>
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
      case 'caste-wise':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No Data</p>
          </div>
        );
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

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Demographic Representation (AC Level): <span className="text-blue-600 dark:text-blue-400">{tabItems.find(tab => tab.id === activeTab)?.label} Proportions(%)</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View demographic data and proportions for assembly constituencies.
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