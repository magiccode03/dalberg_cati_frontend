'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Radio from '@/components/ui/Radio';
import Checkbox from '@/components/ui/Checkbox';
import Text from '@/components/ui/Text';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { FormData, initialFormData } from './types/form.types';
import {
  getPartyOptions2019,
  getPartyOptions2019ForQ9,
  getPartyOptions2020,
  getQ10Options,
  getQ11Options,
  getQ12Options,
  getQ13Options,
  getSatisfactionOptions,
  getQ17Options,
  getReligionOptions,
  getSocialCategoryOptions,
  getCasteOptions,
  getFemaleEducationOptions,
  getMaleEducationOptions,
  getOccupationOptions,
  getFutureContactOptions,
} from './utils/partyOptions';
import { translations } from '@/app/capi/dqm/progress/interview-list/interview-list-tele-form/utils/translations';

export default function TeleFormPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('english');
  const [timer, setTimer] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [toasts, setToasts] = useState<any[]>([]);
  const [teleformUserName, setTeleformUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const showToast = (message: string, type: 'warning' | 'error' | 'success' | 'info' = 'warning') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      message,
      type,
      position: 'bottom-left' as const,
      duration: 3000,
    };
    setToasts(prev => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Load teleform user data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('teleform_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setTeleformUserName(userData.name || '');
      } catch (err) {
        console.error('Error loading teleform user data:', err);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Comprehensive input change handler with clearing logic
  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Number Status clearing logic
      if (field === 'number_status') {
        if (value !== '1') {
          newData.call_ring_status = '';
          newData.q_call_status = '';
          newData.call_reschedule = '';
          newData.consent = '';
          clearSection3And4And5And6(newData);
        }
        if (value !== '2') {
          newData.call_not_ring = '';
        }
      }
      
      // Call Ring Status clearing logic
      if (field === 'call_ring_status') {
        if (value !== '1') {
          newData.q_call_status = '';
          newData.call_reschedule = '';
          newData.consent = '';
          clearSection3And4And5And6(newData);
        }
      }
      
      // Q Call Status clearing logic
      if (field === 'q_call_status') {
        if (value !== '1') {
          newData.consent = '';
          clearSection3And4And5And6(newData);
        }
        if (value !== '5') {
          newData.call_reschedule = '';
        }
      }
      
      // Consent clearing logic
      if (field === 'consent' && value !== '1') {
        clearSection3And4And5And6(newData);
      }
      
      // Age clearing logic
      if (field === 'resp_age') {
        const age = parseInt(value as string);
        if (isNaN(age) || age < 18) {
          newData.resp_registered_voter = '';
          newData.resp_gender = '';
          clearSection4And5And6(newData);
        }
        if (isNaN(age) || age < 19) {
          newData.q6 = '';
          newData.q6_oth = '';
          newData.q6_ind = '';
        }
        if (isNaN(age) || age < 20) {
          newData.q7 = '';
          newData.q7_oth = '';
          newData.q7_ind = '';
        }
        if (isNaN(age) || age < 22) {
          newData.q5 = '';
          newData.q5_oth = '';
          newData.q5_ind = '';
        }
      }
      
      // Registered Voter clearing logic
      if (field === 'resp_registered_voter' && value !== '1') {
        newData.resp_gender = '';
        clearSection4And5And6(newData);
      }
      
      // Q5 "Others" field clearing
      if (field === 'q5') {
        if (value !== '44') newData.q5_oth = '';
        if (value !== '12') newData.q5_ind = '';
      }
      
      // Q6 "Others" field clearing
      if (field === 'q6') {
        if (value !== '44') newData.q6_oth = '';
        if (value !== '12') newData.q6_ind = '';
      }
      
      // Q7 "Others" field clearing
      if (field === 'q7') {
        if (value !== '44') newData.q7_oth = '';
        if (value !== '12') newData.q7_ind = '';
      }
      
      // Q8 "Others" field clearing
      if (field === 'q8') {
        if (value !== '44') newData.q8_oth = '';
        if (value !== '12') newData.q8_ind = '';
      }
      
      // Q9 "Others" field clearing
      if (field === 'q9') {
        if (value !== '44') newData.q9_oth = '';
        if (value !== '12') newData.q9_ind = '';
      }
      
      // Q17 "Others" field clearing
      if (field === 'q17' && value !== '44') {
        newData.q17_oth = '';
      }
      
      // Q19 "Others" field clearing
      if (field === 'q19' && value !== '44') {
        newData.q19_oth = '';
      }
      
      // Religion "Others" field clearing
      if (field === 'resp_religion' && value !== '44') {
        newData.resp_religion_oth = '';
      }
      
      // Caste "Others" field clearing
      if (field === 'resp_caste_jati' && value !== '44') {
        newData.resp_caste_jati_oth = '';
      }
      
      return newData;
    });
  };

  // Checkbox change handler with exclusive logic for specific options
  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      
      // Define exclusive values based on field
      // Q10: 5 = "Do not wish to vote for any other party", 99 = "Don't know"
      // Q11, Q12, Q13: 99 = "Don't know"
      let exclusiveValues: string[] = [];
      
      if (field === 'q10') {
        exclusiveValues = ['5', '99']; // Q10 has both "Do not wish to vote" (5) and "Don't know" (99)
      } else {
        exclusiveValues = ['99']; // Other questions only have "Don't know" (99)
      }
      
      const isExclusive = exclusiveValues.includes(value);
      
      // Max selection limit for Q11, Q12, Q13 (excluding exclusive options)
      const maxSelectionFields = ['q11', 'q12', 'q13'];
      const maxSelections = 3;
      
      let newValues: string[];
      
      if (isExclusive && checked) {
        // Selecting an exclusive option - clear all others and only keep this one
        newValues = [value];
      } else if (checked) {
        // Selecting a regular option - remove any exclusive values if present
        const filteredValues = currentValues.filter(v => !exclusiveValues.includes(v));
        
        // Check max selection limit for Q11, Q12, Q13
        if (maxSelectionFields.includes(field) && filteredValues.length >= maxSelections) {
          // Maximum selections reached, don't add more
          showToast(`You can select a maximum of ${maxSelections} options.`, 'warning');
          return prev;
        }
        
        newValues = [...filteredValues, value];
      } else {
        // Unchecking
        newValues = currentValues.filter(v => v !== value);
      }
      
      const newData = { ...prev, [field]: newValues };
      
      // Handle "Others" text field clearing for checkboxes
      if (field === 'q10' && !newValues.includes('44')) {
        newData.q10_oth = '';
      }
      if (field === 'q11' && !newValues.includes('44')) {
        newData.q11_oth = '';
      }
      if (field === 'q12' && !newValues.includes('44')) {
        newData.q12_oth = '';
      }
      if (field === 'q13' && !newValues.includes('44')) {
        newData.q13_oth = '';
      }
      
      return newData;
    });
  };

  // Helper functions to clear sections
  const clearSection3And4And5And6 = (data: FormData) => {
    data.resp_age = '';
    data.resp_registered_voter = '';
    data.resp_gender = '';
    clearSection4And5And6(data);
  };

  const clearSection4And5And6 = (data: FormData) => {
    // Section 4
    data.q5 = '';
    data.q5_oth = '';
    data.q5_ind = '';
    data.q6 = '';
    data.q6_oth = '';
    data.q6_ind = '';
    data.q7 = '';
    data.q7_oth = '';
    data.q7_ind = '';
    data.q8 = '';
    data.q8_oth = '';
    data.q8_ind = '';
    data.q9 = '';
    data.q9_oth = '';
    data.q9_ind = '';
    data.q10 = [];
    data.q10_oth = '';
    data.q11 = [];
    data.q11_oth = '';
    data.q12 = [];
    data.q12_oth = '';
    data.q13 = [];
    data.q13_oth = '';
    
    // Section 5
    data.q14 = '';
    data.q15 = '';
    data.q16_a = '';
    data.q16_b = '';
    data.q17 = '';
    data.q17_oth = '';
    data.q19 = '';
    data.q19_oth = '';
    
    // Section 6
    data.resp_religion = '';
    data.resp_religion_oth = '';
    data.resp_social_cat = '';
    data.resp_caste_jati = '';
    data.resp_caste_jati_oth = '';
    data.resp_female_edu = '';
    data.resp_male_edu = '';
    data.resp_occupation = '';
    data.thanks_future = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    showToast('Saving form data...', 'info');
    showToast('Form submitted successfully! Data has been saved.', 'success');
    
    setTimeout(() => {
      router.push('/cati/ss/start-form-filling');
    }, 1500);
  };

  const handleCallDropped = async () => {
    showToast('Saving partial data...', 'info');
    showToast('Call dropped. Partial data has been saved.', 'success');
    
    setTimeout(() => {
      router.push('/cati/ss/start-form-filling');
    }, 1500);
  };


  // Get translations
  const t = translations[language as keyof typeof translations];
  
  // Get options based on language
  const partyOptions2019 = getPartyOptions2019(language as 'english' | 'bengali');
  const partyOptions2019ForQ9 = getPartyOptions2019ForQ9(language as 'english' | 'bengali');
  const partyOptions2020 = getPartyOptions2020(language as 'english' | 'bengali');
  const q10Options = getQ10Options(language as 'english' | 'bengali');
  const q11Options = getQ11Options(language as 'english' | 'bengali');
  const q12Options = getQ12Options(language as 'english' | 'bengali');
  const q13Options = getQ13Options(language as 'english' | 'bengali');
  const satisfactionOptions = getSatisfactionOptions(language as 'english' | 'bengali');
  const q17Options = getQ17Options(language as 'english' | 'bengali');
  const religionOptions = getReligionOptions(language as 'english' | 'bengali');
  const socialCategoryOptions = getSocialCategoryOptions(language as 'english' | 'bengali');
  const casteOptions = getCasteOptions(language as 'english' | 'bengali');
  const femaleEducationOptions = getFemaleEducationOptions(language as 'english' | 'bengali');
  const maleEducationOptions = getMaleEducationOptions(language as 'english' | 'bengali');
  const occupationOptions = getOccupationOptions(language as 'english' | 'bengali');
  const futureContactOptions = getFutureContactOptions(language as 'english' | 'bengali');

  // Conditional visibility logic
  const showCallNotRing = formData.number_status === '2';
  const showCallRingStatus = formData.number_status === '1';
  const showCallStatus = formData.call_ring_status === '1';
  const showReschedule = formData.q_call_status === '5';
  const showSection2 = formData.q_call_status === '1';
  const showSection3 = formData.consent === '1';
  const showRegisteredVoter = parseInt(formData.resp_age) >= 18;
  const showGender = formData.resp_registered_voter === '1' && formData.consent === '1';
  const showSection4 = formData.resp_registered_voter === '1';
  const showQ5 = showSection4 && parseInt(formData.resp_age) >= 22;
  const showQ6 = showSection4 && parseInt(formData.resp_age) >= 19;
  const showQ7 = showSection4 && parseInt(formData.resp_age) >= 20;
  const showQ8 = showSection3;
  const showQ9 = showSection3;
  const showQ10 = showSection3;
  const showQ11 = showSection3;
  const showQ12 = showSection3;
  const showQ13 = showSection3;
  const showSection5 = formData.consent === '1' && formData.resp_registered_voter === '1';
  const showSection6 = formData.consent === '1' && formData.resp_registered_voter === '1';

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-6">
      {/* Timer and Language Selector */}
      <div className="mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <Heading level={4}>{t.title}</Heading>
            <div className="flex items-center gap-6">
              {/* Timer */}
              <div>
                <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {t.time}: <span className="text-blue-600 dark:text-blue-400 float-right">{timer}s</span>
                </Text>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center gap-3">
                <Text className="font-medium text-gray-700 dark:text-gray-300">{t.language}:</Text>
                <div className="w-48">
                  <SelectDropdown
                    options={[
                      { value: 'english', label: 'English (English)' },
                      { value: 'bengali', label: 'Bangla (বাংলা)' },
                    ]}
                    value={language}
                    onChange={(value) => setLanguage(value as string)}
                    placeholder="Select Language"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Identification */}
        {/* <Card className="p-6 mb-6">
          <div className="mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-4">
              {t.section1}
            </Heading>
            <Heading level={5} className="text-gray-700 dark:text-gray-300">
              {t.identification}
            </Heading>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Input
              label={t.ac_code}
              value={formData.ac_code}
              onChange={(e) => handleInputChange('ac_code', e.target.value)}
              required
              maxLength={150}
            />
            <Input
              label={t.ac_name}
              value={formData.ac_name}
              onChange={(e) => handleInputChange('ac_name', e.target.value)}
              required
              maxLength={150}
            />
            <Input
              label={t.pc_name}
              value={formData.pc_name}
              onChange={(e) => handleInputChange('pc_name', e.target.value)}
              maxLength={150}
            />
            <Input
              label={t.pc_code}
              value={formData.pc_code}
              onChange={(e) => handleInputChange('pc_code', e.target.value)}
              maxLength={150}
            />
            <Input
              label={t.district_name}
              value={formData.district_name}
              onChange={(e) => handleInputChange('district_name', e.target.value)}
              maxLength={150}
            />
            <Input
              label={t.district_code}
              value={formData.district_code}
              onChange={(e) => handleInputChange('district_code', e.target.value)}
              maxLength={150}
            />
            <Input
              label={t.region_name}
              value={formData.region_name}
              onChange={(e) => handleInputChange('region_name', e.target.value)}
              maxLength={150}
            />
            <Input
              label={t.region_code}
              value={formData.region_code}
              onChange={(e) => handleInputChange('region_code', e.target.value)}
              maxLength={150}
            />
            <Input
              label={t.mla_name}
              value={formData.mla_name}
              onChange={(e) => handleInputChange('mla_name', e.target.value)}
              required
              maxLength={150}
            />
            <Input
              label={t.mp_name}
              value={formData.mp_name}
              onChange={(e) => handleInputChange('mp_name', e.target.value)}
              required
              maxLength={150}
            />
          </div>
        </Card> */}

        {/* Call Status Section */}
        <Card className="p-6 mb-6">
          <Heading level={4} className="text-gray-900 dark:text-white mb-6">
            {t.callStatus}
          </Heading>

          {/* Number Status */}
          <div className="mb-6">
            <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
              {t.numberStatus}
            </Text>
            <div className="space-y-3">
              <Radio
                id="number_status_3"
                name="number_status"
                value="3"
                label={t.numberStatus_3}
                checked={formData.number_status === '3'}
                onChange={() => handleInputChange('number_status', '3')}
              />
              <Radio
                id="number_status_1"
                name="number_status"
                value="1"
                label={t.numberStatus_1}
                checked={formData.number_status === '1'}
                onChange={() => handleInputChange('number_status', '1')}
              />
              <Radio
                id="number_status_2"
                name="number_status"
                value="2"
                label={t.numberStatus_2}
                checked={formData.number_status === '2'}
                onChange={() => handleInputChange('number_status', '2')}
              />
            </div>
          </div>

          {/* Call Not Ring Status */}
          {showCallNotRing && (
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.callNotRingStatus}
              </Text>
              <div className="space-y-3">
                <Radio
                  id="call_not_ring_1"
                  name="call_not_ring"
                  value="1"
                  label={t.callNotRing_1}
                  checked={formData.call_not_ring === '1'}
                  onChange={() => handleInputChange('call_not_ring', '1')}
                />
                <Radio
                  id="call_not_ring_2"
                  name="call_not_ring"
                  value="2"
                  label={t.callNotRing_2}
                  checked={formData.call_not_ring === '2'}
                  onChange={() => handleInputChange('call_not_ring', '2')}
                />
                <Radio
                  id="call_not_ring_3"
                  name="call_not_ring"
                  value="3"
                  label={t.callNotRing_3}
                  checked={formData.call_not_ring === '3'}
                  onChange={() => handleInputChange('call_not_ring', '3')}
                />
              </div>
            </div>
          )}

          {/* Call Ring Status */}
          {showCallRingStatus && (
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.callRingStatus}
              </Text>
              <div className="space-y-3">
                <Radio
                  id="call_ring_status_1"
                  name="call_ring_status"
                  value="1"
                  label={t.callRing_1}
                  checked={formData.call_ring_status === '1'}
                  onChange={() => handleInputChange('call_ring_status', '1')}
                />
                <Radio
                  id="call_ring_status_2"
                  name="call_ring_status"
                  value="2"
                  label={t.callRing_2}
                  checked={formData.call_ring_status === '2'}
                  onChange={() => handleInputChange('call_ring_status', '2')}
                />
              </div>
            </div>
          )}

          {/* Q Call Status */}
          {showCallStatus && (
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.qCallStatus}
              </Text>
              <div className="space-y-3">
                <Radio
                  id="q_call_status_1"
                  name="q_call_status"
                  value="1"
                  label={t.qCallStatus_1}
                  checked={formData.q_call_status === '1'}
                  onChange={() => handleInputChange('q_call_status', '1')}
                />
                <Radio
                  id="q_call_status_2"
                  name="q_call_status"
                  value="2"
                  label={t.qCallStatus_2}
                  checked={formData.q_call_status === '2'}
                  onChange={() => handleInputChange('q_call_status', '2')}
                />
                <Radio
                  id="q_call_status_5"
                  name="q_call_status"
                  value="5"
                  label={t.qCallStatus_5}
                  checked={formData.q_call_status === '5'}
                  onChange={() => handleInputChange('q_call_status', '5')}
                />
              </div>
            </div>
          )}

          {/* Reschedule Interview */}
          {showReschedule && (
            <div className="mb-6">
              <Input
                type="datetime-local"
                label={t.rescheduleInterview}
                value={formData.call_reschedule}
                onChange={(e) => handleInputChange('call_reschedule', e.target.value)}
              />
            </div>
          )}

          {/* Telecaller Name */}
          {/* <div className="mb-6">
            <Input
              label={t.telecallerName}
              value={formData.telecaller_name}
              onChange={(e) => handleInputChange('telecaller_name', e.target.value)}
              maxLength={255}
            />
          </div> */}

          {/* Call ID */}
          {/* <div>
            <Input
              label={t.callId}
              value={formData.callid}
              onChange={(e) => handleInputChange('callid', e.target.value)}
              maxLength={50}
            />
          </div> */}
        </Card>

        {/* Section 2: Consent */}
        {showSection2 && (
          <Card className="p-6 mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-6">
              {t.section2}
            </Heading>

            <div className="mb-4">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-4">
                {t.consentText.replace('{telecaller_name}', teleformUserName || '[enumerator name]')}
                <br /><br />
                {t.shouldContinue}
              </Text>
            </div>

            <div className="space-y-3">
              <Radio
                id="consent_1"
                name="consent"
                value="1"
                label={t.consent_yes}
                checked={formData.consent === '1'}
                onChange={() => handleInputChange('consent', '1')}
              />
              <Radio
                id="consent_2"
                name="consent"
                value="2"
                label={t.consent_no}
                checked={formData.consent === '2'}
                onChange={() => handleInputChange('consent', '2')}
              />
            </div>
          </Card>
        )}

        {/* Section 3: Basic Demographic */}
        {showSection3 && (
          <Card className="p-6 mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-6">
              {t.section3}
            </Heading>

            {/* Age */}
            <div className="mb-6">
              <Input
                type="number"
                label={t.respAge}
                value={formData.resp_age}
                onChange={(e) => handleInputChange('resp_age', e.target.value)}
                min={10}
                max={99}
              />
              <Text className="text-sm italic text-gray-500 dark:text-gray-400 mt-1">{t.years}</Text>
            </div>

            {/* Registered Voter */}
            {showRegisteredVoter && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                  {t.registeredVoter}
                </Text>
                <div className="space-y-3">
                  <Radio
                    id="resp_registered_voter_1"
                    name="resp_registered_voter"
                    value="1"
                    label={t.registeredVoter_yes}
                    checked={formData.resp_registered_voter === '1'}
                    onChange={() => handleInputChange('resp_registered_voter', '1')}
                  />
                  <Radio
                    id="resp_registered_voter_2"
                    name="resp_registered_voter"
                    value="2"
                    label={t.registeredVoter_no}
                    checked={formData.resp_registered_voter === '2'}
                    onChange={() => handleInputChange('resp_registered_voter', '2')}
                  />
                </div>
              </div>
            )}

            {/* Gender */}
            {showGender && (
              <div>
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                  {t.respGender}
                </Text>
                <div className="space-y-3">
                  <Radio
                    id="resp_gender_1"
                    name="resp_gender"
                    value="1"
                    label={t.gender_male}
                    checked={formData.resp_gender === '1'}
                    onChange={() => handleInputChange('resp_gender', '1')}
                  />
                  <Radio
                    id="resp_gender_2"
                    name="resp_gender"
                    value="2"
                    label={t.gender_female}
                    checked={formData.resp_gender === '2'}
                    onChange={() => handleInputChange('resp_gender', '2')}
                  />
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Section 4: Party Preferences */}
        {showSection4 && (
          <Card className="p-6 mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-6">
              {t.section4}
            </Heading>

            {/* Q5 */}
            {showQ5 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q5}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHint}
                </Text>
                <div className="space-y-3">
                  {partyOptions2019.map(option => (
                    <Radio
                      key={option.value}
                      id={`q5_${option.value}`}
                      name="q5"
                      value={option.value}
                      label={option.label}
                      checked={formData.q5 === option.value}
                      onChange={() => handleInputChange('q5', option.value)}
                    />
                  ))}
                </div>
                {formData.q5 === '44' && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q5_oth}
                      onChange={(e) => handleInputChange('q5_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
                {formData.q5 === '12' && (
                  <div className="mt-4">
                    <Input
                      label={t.independentSpecify}
                      value={formData.q5_ind}
                      onChange={(e) => handleInputChange('q5_ind', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q6 */}
            {showQ6 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q6}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHint}
                </Text>
                <div className="space-y-3">
                  {partyOptions2019.map(option => (
                    <Radio
                      key={option.value}
                      id={`q6_${option.value}`}
                      name="q6"
                      value={option.value}
                      label={option.label}
                      checked={formData.q6 === option.value}
                      onChange={() => handleInputChange('q6', option.value)}
                    />
                  ))}
                </div>
                {formData.q6 === '44' && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q6_oth}
                      onChange={(e) => handleInputChange('q6_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
                {formData.q6 === '12' && (
                  <div className="mt-4">
                    <Input
                      label={t.independentSpecify}
                      value={formData.q6_ind}
                      onChange={(e) => handleInputChange('q6_ind', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q7 */}
            {showQ7 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q7}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHint}
                </Text>
                <div className="space-y-3">
                  {partyOptions2019.map(option => (
                    <Radio
                      key={option.value}
                      id={`q7_${option.value}`}
                      name="q7"
                      value={option.value}
                      label={option.label}
                      checked={formData.q7 === option.value}
                      onChange={() => handleInputChange('q7', option.value)}
                    />
                  ))}
                </div>
                {formData.q7 === '44' && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q7_oth}
                      onChange={(e) => handleInputChange('q7_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
                {formData.q7 === '12' && (
                  <div className="mt-4">
                    <Input
                      label={t.independentSpecify}
                      value={formData.q7_ind}
                      onChange={(e) => handleInputChange('q7_ind', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q8 */}
            {showQ8 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q8}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHint}
                </Text>
                <div className="space-y-3">
                  {partyOptions2019.map(option => (
                    <Radio
                      key={option.value}
                      id={`q8_${option.value}`}
                      name="q8"
                      value={option.value}
                      label={option.label}
                      checked={formData.q8 === option.value}
                      onChange={() => handleInputChange('q8', option.value)}
                    />
                  ))}
                </div>
                {formData.q8 === '44' && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q8_oth}
                      onChange={(e) => handleInputChange('q8_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
                {formData.q8 === '12' && (
                  <div className="mt-4">
                    <Input
                      label={t.independentSpecify}
                      value={formData.q8_ind}
                      onChange={(e) => handleInputChange('q8_ind', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q9 */}
            {showQ9 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q9}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHint}
                </Text>
                <div className="space-y-3">
                  {partyOptions2019ForQ9.map(option => (
                    <Radio
                      key={option.value}
                      id={`q9_${option.value}`}
                      name="q9"
                      value={option.value}
                      label={option.label}
                      checked={formData.q9 === option.value}
                      onChange={() => handleInputChange('q9', option.value)}
                    />
                  ))}
                </div>
                {formData.q9 === '44' && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q9_oth}
                      onChange={(e) => handleInputChange('q9_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
                {formData.q9 === '12' && (
                  <div className="mt-4">
                    <Input
                      label={t.independentSpecify}
                      value={formData.q9_ind}
                      onChange={(e) => handleInputChange('q9_ind', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q10 - Checkbox */}
            {showQ10 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q10}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHint}
                </Text>
                <div className="space-y-3">
                  {q10Options.map(option => (
                    <Checkbox
                      key={option.value}
                      id={`q10_${option.value}`}
                      label={option.label}
                      checked={formData.q10.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('q10', option.value, checked)}
                    />
                  ))}
                </div>
                {formData.q10.includes('44') && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q10_oth}
                      onChange={(e) => handleInputChange('q10_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q11 - Checkbox */}
            {showQ11 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q11}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHintSpont}
                </Text>
                <div className="space-y-3">
                  {q11Options.map(option => (
                    <Checkbox
                      key={option.value}
                      id={`q11_${option.value}`}
                      label={option.label}
                      checked={formData.q11.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('q11', option.value, checked)}
                    />
                  ))}
                </div>
                {formData.q11.includes('44') && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q11_oth}
                      onChange={(e) => handleInputChange('q11_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q12 - Checkbox */}
            {showQ12 && (
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q12}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHintSpont}
                </Text>
                <div className="space-y-3">
                  {q12Options.map(option => (
                    <Checkbox
                      key={option.value}
                      id={`q12_${option.value}`}
                      label={option.label}
                      checked={formData.q12.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('q12', option.value, checked)}
                    />
                  ))}
                </div>
                {formData.q12.includes('44') && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q12_oth}
                      onChange={(e) => handleInputChange('q12_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Q13 - Checkbox */}
            {showQ13 && (
              <div>
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t.q13}
                </Text>
                <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                  {t.interviewerHintSpont}
                </Text>
                <div className="space-y-3">
                  {q13Options.map(option => (
                    <Checkbox
                      key={option.value}
                      id={`q13_${option.value}`}
                      label={option.label}
                      checked={formData.q13.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('q13', option.value, checked)}
                    />
                  ))}
                </div>
                {formData.q13.includes('44') && (
                  <div className="mt-4">
                    <Input
                      label={t.otherSpecify}
                      value={formData.q13_oth}
                      onChange={(e) => handleInputChange('q13_oth', e.target.value)}
                      required
                      maxLength={150}
                    />
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Section 5: Satisfaction and Approval Ratings */}
        {showSection5 && (
          <Card className="p-6 mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-6">
              {t.section5}
            </Heading>

            {/* Q14 */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                {t.q14}
              </Text>
              <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                {t.interviewerReadOptions}
              </Text>
              <div className="space-y-3">
                {satisfactionOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`q14_${option.value}`}
                    name="q14"
                    value={option.value}
                    label={option.label}
                    checked={formData.q14 === option.value}
                    onChange={() => handleInputChange('q14', option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q15 */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
                {t.q15}
              </Text>
              <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                {t.interviewerReadOptions}
              </Text>
              <div className="space-y-3">
                {satisfactionOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`q15_${option.value}`}
                    name="q15"
                    value={option.value}
                    label={option.label}
                    checked={formData.q15 === option.value}
                    onChange={() => handleInputChange('q15', option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q16 - Info Header */}
            <div className="mb-6">
              <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                {t.q16}
              </Heading>
              <Text className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
                {t.interviewerReadOptions}
              </Text>

              {/* Q16_A */}
              <div className="mb-6">
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                  {t.q16_a.replace('{mp_name}', formData.mp_name || '[MP Name]')}
                </Text>
                <div className="space-y-3">
                  {satisfactionOptions.map(option => (
                    <Radio
                      key={option.value}
                      id={`q16_a_${option.value}`}
                      name="q16_a"
                      value={option.value}
                      label={option.label}
                      checked={formData.q16_a === option.value}
                      onChange={() => handleInputChange('q16_a', option.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q16_B */}
              <div>
                <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                  {t.q16_b.replace('{mla_name}', formData.mla_name || '[MLA Name]')}
                </Text>
                <div className="space-y-3">
                  {satisfactionOptions.map(option => (
                    <Radio
                      key={option.value}
                      id={`q16_b_${option.value}`}
                      name="q16_b"
                      value={option.value}
                      label={option.label}
                      checked={formData.q16_b === option.value}
                      onChange={() => handleInputChange('q16_b', option.value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Q17 */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q17}
              </Text>
              <div className="space-y-3">
                {q17Options.map(option => (
                  <Radio
                    key={option.value}
                    id={`q17_${option.value}`}
                    name="q17"
                    value={option.value}
                    label={option.label}
                    checked={formData.q17 === option.value}
                    onChange={() => handleInputChange('q17', option.value)}
                  />
                ))}
              </div>
              {formData.q17 === '44' && (
                <div className="mt-4">
                  <Input
                    label={t.othersSpecify}
                    value={formData.q17_oth}
                    onChange={(e) => handleInputChange('q17_oth', e.target.value)}
                    required
                    maxLength={150}
                  />
                </div>
              )}
            </div>

            {/* Q19 */}
            <div>
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q19}
              </Text>
              <div className="space-y-3">
                {partyOptions2020.map(option => (
                  <Radio
                    key={option.value}
                    id={`q19_${option.value}`}
                    name="q19"
                    value={option.value}
                    label={option.label}
                    checked={formData.q19 === option.value}
                    onChange={() => handleInputChange('q19', option.value)}
                  />
                ))}
              </div>
              {formData.q19 === '44' && (
                <div className="mt-4">
                  <Input
                    label={t.otherPleaseSpecify}
                    value={formData.q19_oth}
                    onChange={(e) => handleInputChange('q19_oth', e.target.value)}
                    required
                    maxLength={150}
                  />
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Section 6: Basic Demographic */}
        {showSection6 && (
          <Card className="p-6 mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-6">
              {t.section6}
            </Heading>

            {/* Q20: Religion */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q20}
              </Text>
              <div className="space-y-3">
                {religionOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`resp_religion_${option.value}`}
                    name="resp_religion"
                    value={option.value}
                    label={option.label}
                    checked={formData.resp_religion === option.value}
                    onChange={() => handleInputChange('resp_religion', option.value)}
                  />
                ))}
              </div>
              {formData.resp_religion === '44' && (
                <div className="mt-4">
                  <Input
                    label={t.otherSpecify}
                    value={formData.resp_religion_oth}
                    onChange={(e) => handleInputChange('resp_religion_oth', e.target.value)}
                    required
                    maxLength={150}
                  />
                </div>
              )}
            </div>

            {/* Q21: Social Category */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q21}
              </Text>
              <div className="space-y-3">
                {socialCategoryOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`resp_social_cat_${option.value}`}
                    name="resp_social_cat"
                    value={option.value}
                    label={option.label}
                    checked={formData.resp_social_cat === option.value}
                    onChange={() => handleInputChange('resp_social_cat', option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q22: Caste */}
            {/* <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q22}
              </Text>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {casteOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`resp_caste_jati_${option.value}`}
                    name="resp_caste_jati"
                    value={option.value}
                    label={option.label}
                    checked={formData.resp_caste_jati === option.value}
                    onChange={() => handleInputChange('resp_caste_jati', option.value)}
                  />
                ))}
              </div>
              {formData.resp_caste_jati === '44' && (
                <div className="mt-4">
                  <Input
                    label={t.otherSpecify}
                    value={formData.resp_caste_jati_oth}
                    onChange={(e) => handleInputChange('resp_caste_jati_oth', e.target.value)}
                    required
                    maxLength={150}
                  />
                </div>
              )}
            </div> */}

            {/* Q23: Female Education */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q23}
              </Text>
              <div className="space-y-3">
                {femaleEducationOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`resp_female_edu_${option.value}`}
                    name="resp_female_edu"
                    value={option.value}
                    label={option.label}
                    checked={formData.resp_female_edu === option.value}
                    onChange={() => handleInputChange('resp_female_edu', option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q24: Male Education */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q24}
              </Text>
              <div className="space-y-3">
                {maleEducationOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`resp_male_edu_${option.value}`}
                    name="resp_male_edu"
                    value={option.value}
                    label={option.label}
                    checked={formData.resp_male_edu === option.value}
                    onChange={() => handleInputChange('resp_male_edu', option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q25: Occupation */}
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q25}
              </Text>
              <div className="space-y-3">
                {occupationOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`resp_occupation_${option.value}`}
                    name="resp_occupation"
                    value={option.value}
                    label={option.label}
                    checked={formData.resp_occupation === option.value}
                    onChange={() => handleInputChange('resp_occupation', option.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q28: Future Contact */}
            <div>
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t.q28}
              </Text>
              <div className="space-y-3">
                {futureContactOptions.map(option => (
                  <Radio
                    key={option.value}
                    id={`thanks_future_${option.value}`}
                    name="thanks_future"
                    value={option.value}
                    label={option.label}
                    checked={formData.thanks_future === option.value}
                    onChange={() => handleInputChange('thanks_future', option.value)}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Call Drop Group */}
        {/* <Card className="p-6 mb-6">
          <Heading level={4} className="text-gray-900 dark:text-white mb-4">
            {t.callDropGroup}
          </Heading>
          <div>
            <Button 
              size="lg"
              onClick={handleCallDrop}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t.respondentCutCall}
            </Button>
          </div>
        </Card> */}

        {/* Submit Buttons */}
        <Card className="p-6">
          <div className="flex gap-4">
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="min-w-[150px] bg-green-600 hover:bg-green-700 text-white"
            >
              <i className="fa fa-save mr-2"></i>
              {isSubmitting ? 'Submitting...' : t.submit}
            </Button>
            <Button 
              type="button"
              onClick={handleCallDropped}
              size="lg"
              disabled={isSubmitting}
              className="min-w-[150px] bg-red-600 hover:bg-red-700 text-white"
            >
              <i className="fa fa-phone-slash mr-2"></i>
              {isSubmitting ? 'Saving...' : 'Call Dropped'}
            </Button>
          </div>
        </Card>
      </form>
      
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position="bottom-left"
      />
    </Container>
  );
}
