'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Radio from '@/components/ui/Radio';
import Checkbox from '@/components/ui/Checkbox';
import Text from '@/components/ui/Text';
import { FormData, initialFormData } from '../types/form.types';
import {
  getPartyOptions2019,
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
} from '../utils/partyOptions';
import { translations } from '../utils/translations';

interface InterviewDetailData {
  id: number;
  phone: string;
  ac_code: number;
  ac_name: string;
  ac_district_name: string;
  ac_zone_name: string;
  ac_mla_name: string;
  ac_electorate: number;
  status: number;
  call_attempt: number;
  call_received: number;
  teleform_user_id: number;
  generate_date: string;
  track: number;
  calling_group: number;
  priority: number;
}

export default function TeleFormPage() {
  const params = useParams();
  const interviewId = params.id as string;
  
  const [language, setLanguage] = useState<string>('english');
  const [timer, setTimer] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [interviewData, setInterviewData] = useState<InterviewDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch interview details on component mount
  useEffect(() => {
    if (interviewId) {
      fetchInterviewDetails(interviewId);
    }
  }, [interviewId]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-fill form data when interview data is loaded
  useEffect(() => {
    if (interviewData) {
      setFormData(prev => ({
        ...prev,
        // Auto-fill Identification section
        telecaller_name: '', // Will be filled from user context
        call_id: `CALL-${interviewData.id}`,
        respondent_phone: interviewData.phone,
        ac_code: interviewData.ac_code.toString(),
        ac_name: interviewData.ac_name,
        district: interviewData.ac_district_name,
        zone: interviewData.ac_zone_name,
        pc_name: interviewData.ac_mla_name,
        // Keep other fields as they were
      }));
      setLoading(false);
    }
  }, [interviewData]);

  const fetchInterviewDetails = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cati/interviews/${id}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setInterviewData(data.data);
      } else {
        setError(data.message || 'Failed to fetch interview details');
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
      setError('Failed to fetch interview details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive input change handler with clearing logic
  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Clear dependent fields based on mutual exclusivity rules
      if (field === 'call_status') {
        if (value === '1') { // Connected
          newData.call_drop_group = '';
          newData.call_drop_reason = '';
          newData.call_drop_other = '';
        } else if (value === '2') { // Call Drop
          newData.consent = '';
          newData.respondent_name = '';
          newData.respondent_relation = '';
          newData.respondent_relation_other = '';
          newData.age_group = '';
          newData.locality = '';
          newData.registered_voter = '';
          newData.gender = '';
        }
      }

      // Clear other fields when "Other" is selected
      if (field === 'respondent_relation' && value === '5') {
        newData.respondent_relation_other = '';
      }

      if (field === 'q2' && value === '44') {
        newData.q2_other = '';
      }

      if (field === 'q3' && value === '44') {
        newData.q3_other = '';
      }

      if (field === 'q11' && value === '44') {
        newData.q11_other = '';
      }

      if (field === 'q12' && value === '44') {
        newData.q12_other = '';
      }

      if (field === 'q13' && value === '44') {
        newData.q13_other = '';
      }

      if (field === 'q13_a' && value === '44') {
        newData.q13_a_other = '';
      }

      if (field === 'q14' && value === '44') {
        newData.q14_other = '';
      }

      if (field === 'q15' && value === '44') {
        newData.q15_other = '';
      }

      if (field === 'religion' && value === '44') {
        newData.religion_other = '';
      }

      if (field === 'social_category' && value === '44') {
        newData.social_category_other = '';
      }

      if (field === 'caste_jati' && value === '44') {
        newData.caste_jati_other = '';
      }

      if (field === 'occupation' && value === '44') {
        newData.occupation_other = '';
      }

      if (field === 'future_contact' && value === '44') {
        newData.future_contact_other = '';
      }

      return newData;
    });
  };

  // Handle checkbox changes with mutual exclusivity
  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      
      if (checked) {
        // Add value to array
        const newValues = [...currentValues, value];
        
        // Apply mutual exclusivity rules
        if (field === 'q1') {
          // If selecting BJP, clear all others
          if (value === '1') {
            return { ...prev, [field]: ['1'] };
          }
          // If selecting others, remove BJP
          else if (currentValues.includes('1')) {
            return { ...prev, [field]: newValues.filter(v => v !== '1') };
          }
        }
        
        return { ...prev, [field]: newValues };
      } else {
        // Remove value from array
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTranslation = (key: string) => {
    return translations[language][key] || key;
  };

  if (loading) {
    return (
      <Container maxWidth="full">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading interview details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="full">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            {getTranslation('form_title')}
          </Heading>
          <div className="flex items-center space-x-4">
            <SelectDropdown
              value={language}
              onChange={(value) => setLanguage(value)}
              options={[
                { value: 'english', label: 'English' },
                { value: 'bengali', label: 'বাংলা' }
              ]}
              className="w-32"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getTranslation('timer_label')}: {formatTime(timer)}
            </div>
          </div>
        </div>

        {/* Identification Section */}
        <Card>
          <Heading level={2} className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {getTranslation('identification_title')}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {getTranslation('telecaller_name')}
              </Text>
              <Input
                type="text"
                value={formData.telecaller_name}
                onChange={(e) => handleInputChange('telecaller_name', e.target.value)}
                placeholder={getTranslation('telecaller_name_placeholder')}
                className="w-full"
              />
            </div>
            <div>
              <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {getTranslation('call_id')}
              </Text>
              <Input
                type="text"
                value={formData.call_id}
                onChange={(e) => handleInputChange('call_id', e.target.value)}
                placeholder={getTranslation('call_id_placeholder')}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Call Status Section */}
        <Card>
          <Heading level={2} className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Call Status
          </Heading>
          <div className="space-y-4">
            <div>
              <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call Status
              </Text>
              <div className="space-y-2">
                {[
                  { value: '1', label: 'Connected' },
                  { value: '2', label: 'Call Drop' },
                  { value: '3', label: 'Busy' },
                  { value: '4', label: 'No Response' },
                  { value: '5', label: 'Wrong Number' },
                  { value: '6', label: 'Switched Off' }
                ].map((option) => (
                  <Radio
                    key={option.value}
                    name="call_status"
                    value={option.value}
                    checked={formData.call_status === option.value}
                    onChange={(e) => handleInputChange('call_status', e.target.value)}
                    label={option.label}
                  />
                ))}
              </div>
            </div>

            {formData.call_status === '1' && (
              <>
                <div>
                  <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Consent
                  </Text>
                  <div className="space-y-2">
                    {[
                      { value: '1', label: 'Yes' },
                      { value: '2', label: 'No' }
                    ].map((option) => (
                      <Radio
                        key={option.value}
                        name="consent"
                        value={option.value}
                        checked={formData.consent === option.value}
                        onChange={(e) => handleInputChange('consent', e.target.value)}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>

                {formData.consent === '1' && (
                  <div>
                    <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Respondent Name
                    </Text>
                    <Input
                      type="text"
                      value={formData.respondent_name}
                      onChange={(e) => handleInputChange('respondent_name', e.target.value)}
                      placeholder="Enter respondent name"
                      className="w-full"
                    />
                  </div>
                )}
              </>
            )}

            {formData.call_status === '2' && (
              <div>
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call Drop Group
                </Text>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'Respondent Cut the Call' },
                    { value: '2', label: 'Network Issue' },
                    { value: '3', label: 'Technical Issue' }
                  ].map((option) => (
                    <Radio
                      key={option.value}
                      name="call_drop_group"
                      value={option.value}
                      checked={formData.call_drop_group === option.value}
                      onChange={(e) => handleInputChange('call_drop_group', e.target.value)}
                      label={option.label}
                      className={option.value === '1' ? 'text-red-600' : ''}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Additional form sections would continue here... */}
        {/* For now, showing basic structure with auto-filled data */}

        <div className="flex justify-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            onClick={() => {
              console.log('Form submitted:', formData);
              // Implement form submission logic here
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Container>
  );
}
