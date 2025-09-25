'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Users, BarChart3, MapPin, Home, Building } from 'lucide-react';
import { apiService, GenderWiseResponse, DemographicConstituency, AgeWiseResponse, AgeWiseConstituency, CasteWiseResponse, CasteWiseConstituency, CasteData } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DemographicData {
  id: number;
  acName: string;
  acCode: number;
  sampleAchieved: number;
  [key: string]: any;
}

export default function DemographicPage() {
  const [activeTab, setActiveTab] = useState('gender-wise');
  const [genderWiseData, setGenderWiseData] = useState<GenderWiseResponse | null>(null);
  const [ageWiseData, setAgeWiseData] = useState<AgeWiseResponse | null>(null);
  const [casteWiseData, setCasteWiseData] = useState<CasteWiseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch demographic data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (activeTab === 'gender-wise') {
          const response = await apiService.getGenderWiseData();
          if (response.success) {
            setGenderWiseData(response.data);
          } else {
            setError('Failed to fetch gender-wise data');
          }
        } else if (activeTab === 'age-wise') {
          const response = await apiService.getAgeWiseData();
          if (response.success) {
            setAgeWiseData(response.data);
          } else {
            setError('Failed to fetch age-wise data');
          }
        } else if (activeTab === 'caste-wise') {
          const response = await apiService.getCasteWiseData();
          if (response.success) {
            setCasteWiseData(response.data);
          } else {
            setError('Failed to fetch caste-wise data');
          }
        }
      } catch (err) {
        console.error('Error fetching demographic data:', err);
        setError('Error loading demographic data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'gender-wise' || activeTab === 'age-wise' || activeTab === 'caste-wise') {
      fetchData();
    }
  }, [activeTab]);

  // Generate mock data for demographic representation (keeping for other tabs)
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

  // Generate mock data for religion-wise demographic representation
  const generateReligionWiseData = (): DemographicData[] => {
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
      
      // Define population percentages for each religion (based on typical Bihar demographics)
      const hinduPopulation = Math.floor(Math.random() * 20) + 70; // 70-90%
      const muslimPopulation = Math.floor(Math.random() * 15) + 5; // 5-20%
      const christianPopulation = Math.floor(Math.random() * 5) + 1; // 1-6%
      const othersPopulation = Math.floor(Math.random() * 5) + 1; // 1-6%
      
      // Generate sample percentages (can exceed population %)
      const hinduSample = Math.floor(Math.random() * 30) + 50;
      const muslimSample = Math.floor(Math.random() * 25) + 5;
      const christianSample = Math.floor(Math.random() * 10) + 1;
      const othersSample = Math.floor(Math.random() * 10) + 1;
      
      // Calculate differences
      const hinduDifference = hinduSample - hinduPopulation;
      const muslimDifference = muslimSample - muslimPopulation;
      const christianDifference = christianSample - christianPopulation;
      const othersDifference = othersSample - othersPopulation;

      data.push({
        id: i + 1,
        acName: acNames[i],
        acCode: i + 1,
        sampleAchieved,
        hinduPopulation,
        hinduSample,
        hinduDifference,
        muslimPopulation,
        muslimSample,
        muslimDifference,
        christianPopulation,
        christianSample,
        christianDifference,
        othersPopulation,
        othersSample,
        othersDifference,
      });
    }
    
    return data;
  };

  // Generate mock data for caste-wise demographic representation
  const generateCasteWiseData = (): any[] => {
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

    const casteNames = [
      'Tharu', 'Muslim', 'Yadav / Raut', 'Kewat / Mallah / Bhoi / Bind / Nishad',
      'Halwai / Kandu / Kanu', 'Chamar / Ravidas / Mochi', 'Koeri/Kushwaha', 'Kurmi',
      'Brahmin', 'Rajput', 'Bhumihar', 'Kayastha', 'Baniya / Barnwal / Mahuri / Kesari',
      'Teli', 'Dhobi', 'Nonia', 'Kushwaha', 'Kurmi', 'Bhumihar', 'Rajput'
    ];

    const data: any[] = [];
    
    for (let i = 0; i < Math.min(acNames.length, 15); i++) {
      const sampleAchieved = Math.floor(Math.random() * 400) + 50;
      
      // Generate data for 10 caste categories
      const castes: any[] = [];
      for (let j = 0; j < 10; j++) {
        if (j < 8) { // Only populate first 8 castes with data
          const quota = Math.floor(Math.random() * 50) + 10;
          const covered = Math.floor(Math.random() * 80) + 5;
          const balance = quota - covered;
          
          castes.push({
            name: casteNames[j] || '',
            quota,
            covered,
            balance
          });
        } else {
          castes.push({
            name: '',
            quota: 0,
            covered: 0,
            balance: 0
          });
        }
      }

      data.push({
        acName: acNames[i],
        acCode: i + 1,
        sampleAchieved,
        caste1: castes[0],
        caste2: castes[1],
        caste3: castes[2],
        caste4: castes[3],
        caste5: castes[4],
        caste6: castes[5],
        caste7: castes[6],
        caste8: castes[7],
        caste9: castes[8],
        caste10: castes[9],
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
  const religionWiseData = generateReligionWiseData();
  const socialCategoryWiseData = generateReligionWiseData();

  const tabItems = [
    { id: 'gender-wise', label: 'Gender Wise', icon: Users },
    { id: 'age-wise', label: 'Age Wise', icon: BarChart3 },
    { id: 'caste-wise', label: 'Caste Wise', icon: Building },
    { id: 'religion-wise', label: 'Religion Wise', icon: Building },
    { id: 'social-category-wise', label: 'Social Category Wise', icon: Home },
  ];

  const renderGenderWiseTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!genderWiseData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      );
    }

    return (
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
            {genderWiseData.constituencies.map((row, index) => (
              <tr key={row.ac_code} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.ac_name}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.ac_code}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sample_achieved}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.male.quota}</td>
                <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.male.covered > row.male.quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.male.covered}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.male.balance}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.female.quota}</td>
                <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.female.covered > row.female.quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.female.covered}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.female.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAgeWiseTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!ageWiseData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Code</th>
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
            {ageWiseData.constituencies.map((row, index) => (
                <tr key={row.ac_code} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.ac_name}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.ac_code}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sample_achieved}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["18_24"].quota}</td>
                <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age_groups["18_24"].covered > row.age_groups["18_24"].quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age_groups["18_24"].covered}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["18_24"].balance}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["25_34"].quota}</td>
                <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age_groups["25_34"].covered > row.age_groups["25_34"].quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age_groups["25_34"].covered}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["25_34"].balance}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["35_50"].quota}</td>
                <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age_groups["35_50"].covered > row.age_groups["35_50"].quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age_groups["35_50"].covered}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["35_50"].balance}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["50_above"].quota}</td>
                <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.age_groups["50_above"].covered > row.age_groups["50_above"].quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.age_groups["50_above"].covered}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.age_groups["50_above"].balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCasteWiseTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!casteWiseData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Code</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 1</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 2</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 3</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 4</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 5</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 6</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 7</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 8</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 9</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={4}>Caste 10</th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2"></th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quota</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Covered</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
            </tr>
          </thead>
          <tbody>
            {casteWiseData.constituencies.map((constituency, index) => (
              <tr key={constituency.ac_code} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{constituency.ac_name}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{constituency.ac_code}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{constituency.sample_achieved}</td>
                
                {/* Render up to 10 castes, filling empty slots if needed */}
                {Array.from({ length: 10 }, (_, casteIndex) => {
                  const caste = constituency.castes[casteIndex];
                  if (caste) {
                    return (
                      <React.Fragment key={caste.caste_code}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{caste.caste_name}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{caste.quota}</td>
                        <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${caste.covered > caste.quota ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                          {caste.covered}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{caste.balance}</td>
                      </React.Fragment>
                    );
                  } else {
                    return (
                      <React.Fragment key={casteIndex}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">-</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">-</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">-</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">-</td>
                      </React.Fragment>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderReligionWiseTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Code</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Hindu</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Muslim</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Christian</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>Others</th>
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
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Population</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Difference</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Population</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Difference</th>
          </tr>
        </thead>
        <tbody>
          {religionWiseData.map((row: DemographicData, index: number) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.acName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.acCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.hinduPopulation}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.hinduDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.hinduSample}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.hinduDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.hinduDifference > 0 ? `+${row.hinduDifference}` : row.hinduDifference}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.muslimPopulation}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.muslimDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.muslimSample}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.muslimDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.muslimDifference > 0 ? `+${row.muslimDifference}` : row.muslimDifference}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.christianPopulation}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.christianDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.christianSample}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.christianDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.christianDifference > 0 ? `+${row.christianDifference}` : row.christianDifference}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.othersPopulation}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.othersDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.othersSample}%</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.othersDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.othersDifference > 0 ? `+${row.othersDifference}` : row.othersDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSocialCategoryWiseTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AC Code</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sample Achieved</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>SC</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>ST</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300" colSpan={3}>General+OBC</th>
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
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Population</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sample</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Difference</th>
          </tr>
        </thead>
        <tbody>
          {socialCategoryWiseData.map((row: DemographicData, index: number) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{row.acName}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.acCode}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.sampleAchieved}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.scPopulation}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.scSample > row.scPopulation ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.scSample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.scDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.scDifference}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.stPopulation}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.stSample > row.stPopulation ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.stSample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.stDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.stDifference}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">{row.generalOBCPopulation}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.generalOBCSample > row.generalOBCPopulation ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.generalOBCSample}</td>
              <td className={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-center ${row.generalOBCDifference > 0 ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'}`}>{row.generalOBCDifference}</td>
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
        return renderCasteWiseTable();
      case 'religion-wise':
        return renderReligionWiseTable();
      case 'social-category-wise':
        return renderSocialCategoryWiseTable();
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