'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Radio from '@/components/ui/Radio';
import Text from '@/components/ui/Text';

interface FormData {
  ac_code: string;
  ac_name: string;
  pc_name: string;
  pc_code: string;
  district_name: string;
  district_code: string;
  region_name: string;
  region_code: string;
  mla_name: string;
  mp_name: string;
  number_status: string;
  call_not_ring: string;
  call_ring_status: string;
  q_call_status: string;
  call_reschedule: string;
  telecaller_id: string;
  telecaller_name: string;
  callid: string;
}

export default function TeleFormPage() {
  const [language, setLanguage] = useState<string>('english');
  const [formData, setFormData] = useState<FormData>({
    ac_code: '',
    ac_name: '',
    pc_name: '',
    pc_code: '',
    district_name: '',
    district_code: '',
    region_name: '',
    region_code: '',
    mla_name: '',
    mp_name: '',
    number_status: '',
    call_not_ring: '',
    call_ring_status: '',
    q_call_status: '',
    call_reschedule: '',
    telecaller_id: '',
    telecaller_name: '',
    callid: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add API call here
  };

  const handleCallDrop = () => {
    console.log('Call dropped by respondent');
    // Handle call drop logic
  };

  // Translations
  const translations = {
    english: {
      title: 'WB Opinion Poll CATI 2025',
      section1: 'Section 1: Identification',
      identification: 'Identification',
      ac_code: 'Assembly Constituency code',
      ac_name: 'Assembly Constituency name',
      pc_name: 'Parliamentary Constituency Name',
      pc_code: 'Parliamentary Constituency Code',
      district_name: 'District Name',
      district_code: 'District Code',
      region_name: 'Region Name',
      region_code: 'Region Code',
      mla_name: 'MLA Name',
      mp_name: 'MP Name',
      telecallerId: 'Telecaller ID',
      telecallerName: 'Telecaller Name',
      callId: 'Call ID',
    },
    bengali: {
      title: 'WB Opinion Poll CATI 2025',
      section1: 'ধারা ১: পরিচিতি',
      identification: 'পরিচিতি',
      ac_code: 'বিধানসভা কেন্দ্রের কোড',
      ac_name: 'বিধানসভা কেন্দ্রের নাম',
      pc_name: 'সংসদীয় নির্বাচনী এলাকার নাম',
      pc_code: 'সংসদীয় নির্বাচনী এলাকার কোড',
      district_name: 'জেলার নাম',
      district_code: 'জেলার কোড',
      region_name: 'অঞ্চলের নাম',
      region_code: 'অঞ্চলের কোড',
      mla_name: 'MLA Name',
      mp_name: 'MP Name',
      telecallerId: 'টেলিকলার আইডি',
      telecallerName: 'টেলিকলার নাম',
      callId: 'কল আইডি',
    }
  };

  const t = translations[language as keyof typeof translations];

  const showCallNotRing = formData.number_status === '2';
  const showCallRingStatus = formData.number_status === '1';
  const showCallStatus = formData.call_ring_status === '1';
  const showReschedule = formData.q_call_status === '5';

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-6">
      {/* Page Title with Language Selector */}
      <div className="mb-6 flex items-center justify-between">
        <Heading level={4}>{t.title}</Heading>
        <div className="flex items-center gap-3">
          <Text className="font-medium text-gray-700 dark:text-gray-300">Language:</Text>
          <div className="w-48">
            <SelectDropdown
              options={[
                { value: 'english', label: 'English' },
                { value: 'bengali', label: 'Bengali (বাংলা)' },
              ]}
              value={language}
              onChange={(value) => setLanguage(value as string)}
              placeholder="Select Language"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Identification */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-4">
              {t.section1}
            </Heading>
            <Heading level={4} className="text-gray-700 dark:text-gray-300">
              {t.identification}
            </Heading>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* AC Code */}
            <div>
              <Input
                label={t.ac_code}
                value={formData.ac_code}
                onChange={(e) => handleInputChange('ac_code', e.target.value)}
                required
                placeholder=""
              />
            </div>

            {/* AC Name */}
            <div>
              <Input
                label={t.ac_name}
                value={formData.ac_name}
                onChange={(e) => handleInputChange('ac_name', e.target.value)}
                required
                placeholder=""
              />
            </div>

            {/* PC Name */}
            <div>
              <Input
                label={t.pc_name}
                value={formData.pc_name}
                onChange={(e) => handleInputChange('pc_name', e.target.value)}
                placeholder=""
              />
            </div>

            {/* PC Code */}
            <div>
              <Input
                label={t.pc_code}
                value={formData.pc_code}
                onChange={(e) => handleInputChange('pc_code', e.target.value)}
                placeholder=""
              />
            </div>

            {/* District Name */}
            <div>
              <Input
                label={t.district_name}
                value={formData.district_name}
                onChange={(e) => handleInputChange('district_name', e.target.value)}
                placeholder=""
              />
            </div>

            {/* District Code */}
            <div>
              <Input
                label={t.district_code}
                value={formData.district_code}
                onChange={(e) => handleInputChange('district_code', e.target.value)}
                placeholder=""
              />
            </div>

            {/* Region Name */}
            <div>
              <Input
                label={t.region_name}
                value={formData.region_name}
                onChange={(e) => handleInputChange('region_name', e.target.value)}
                placeholder=""
              />
            </div>

            {/* Region Code */}
            <div>
              <Input
                label={t.region_code}
                value={formData.region_code}
                onChange={(e) => handleInputChange('region_code', e.target.value)}
                placeholder=""
              />
            </div>

            {/* MLA Name */}
            <div>
              <Input
                label={t.mla_name}
                value={formData.mla_name}
                onChange={(e) => handleInputChange('mla_name', e.target.value)}
                required
                placeholder=""
              />
            </div>

            {/* MP Name */}
            <div>
              <Input
                label={t.mp_name}
                value={formData.mp_name}
                onChange={(e) => handleInputChange('mp_name', e.target.value)}
                required
                placeholder=""
              />
            </div>
          </div>
        </Card>

        {/* Call Status Section - English Only */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white">
              Call Status
            </Heading>
          </div>

          {/* Number Status */}
          <div className="mb-6">
            <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
              Number Status
            </Text>
            <div className="space-y-3">
              <Radio
                id="number_status_3"
                name="number_status"
                value="3"
                label="Call Not Received to Telecaller"
                checked={formData.number_status === '3'}
                onChange={() => handleInputChange('number_status', '3')}
              />
              <Radio
                id="number_status_1"
                name="number_status"
                value="1"
                label="Ringing (Respondent Call)"
                checked={formData.number_status === '1'}
                onChange={() => handleInputChange('number_status', '1')}
              />
              <Radio
                id="number_status_2"
                name="number_status"
                value="2"
                label="Not Ringing (Respondent Call)"
                checked={formData.number_status === '2'}
                onChange={() => handleInputChange('number_status', '2')}
              />
            </div>
          </div>

          {/* Call Not Ring Status - Conditional */}
          {showCallNotRing && (
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                Call Not Ring Status
              </Text>
              <div className="space-y-3">
                <Radio
                  id="call_not_ring_1"
                  name="call_not_ring"
                  value="1"
                  label="Switch Off"
                  checked={formData.call_not_ring === '1'}
                  onChange={() => handleInputChange('call_not_ring', '1')}
                />
                <Radio
                  id="call_not_ring_2"
                  name="call_not_ring"
                  value="2"
                  label="Number Not Reachable"
                  checked={formData.call_not_ring === '2'}
                  onChange={() => handleInputChange('call_not_ring', '2')}
                />
                <Radio
                  id="call_not_ring_3"
                  name="call_not_ring"
                  value="3"
                  label="Number Does not exist"
                  checked={formData.call_not_ring === '3'}
                  onChange={() => handleInputChange('call_not_ring', '3')}
                />
              </div>
            </div>
          )}

          {/* Call Ring Status - Conditional */}
          {showCallRingStatus && (
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                Call Ring Status
              </Text>
              <div className="space-y-3">
                <Radio
                  id="call_ring_status_1"
                  name="call_ring_status"
                  value="1"
                  label="Picked"
                  checked={formData.call_ring_status === '1'}
                  onChange={() => handleInputChange('call_ring_status', '1')}
                />
                <Radio
                  id="call_ring_status_2"
                  name="call_ring_status"
                  value="2"
                  label="Did not picked"
                  checked={formData.call_ring_status === '2'}
                  onChange={() => handleInputChange('call_ring_status', '2')}
                />
              </div>
            </div>
          )}

          {/* Q Call Status - Conditional */}
          {showCallStatus && (
            <div className="mb-6">
              <Text className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">
                Call Status
              </Text>
              <div className="space-y-3">
                <Radio
                  id="q_call_status_1"
                  name="q_call_status"
                  value="1"
                  label="Continue"
                  checked={formData.q_call_status === '1'}
                  onChange={() => handleInputChange('q_call_status', '1')}
                />
                <Radio
                  id="q_call_status_2"
                  name="q_call_status"
                  value="2"
                  label="Wrong Number"
                  checked={formData.q_call_status === '2'}
                  onChange={() => handleInputChange('q_call_status', '2')}
                />
                <Radio
                  id="q_call_status_5"
                  name="q_call_status"
                  value="5"
                  label="Respondent Not available/Reschedule Interview"
                  checked={formData.q_call_status === '5'}
                  onChange={() => handleInputChange('q_call_status', '5')}
                />
              </div>
            </div>
          )}

          {/* Reschedule Interview - Conditional */}
          {showReschedule && (
            <div className="mb-6">
              <Input
                type="datetime-local"
                label="Reschedule Interview"
                value={formData.call_reschedule}
                onChange={(e) => handleInputChange('call_reschedule', e.target.value)}
                placeholder=""
              />
            </div>
          )}

          {/* Telecaller Name - English Only */}
          <div className="mb-6">
            <Input
              label="Telecaller Name"
              value={formData.telecaller_name}
              onChange={(e) => handleInputChange('telecaller_name', e.target.value)}
              placeholder=""
            />
          </div>

          {/* Call ID - English Only */}
          <div>
            <Input
              label="Call ID"
              value={formData.callid}
              onChange={(e) => handleInputChange('callid', e.target.value)}
              placeholder=""
            />
          </div>
        </Card>

        {/* Call Drop Group - English Only */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <Heading level={4} className="text-gray-900 dark:text-white mb-4">
              Call Drop Group
            </Heading>
          </div>

          <div>
            <Button 
              size="lg"
              onClick={handleCallDrop}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Respondent Cut the Call
            </Button>
          </div>
        </Card>

        {/* Submit Button - English Only */}
        <Card className="p-6">
          <div className="flex gap-4">
            <Button 
              type="submit" 
              size="lg"
              className="min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              <i className="fa fa-save mr-2"></i>
              Submit
            </Button>
          </div>
        </Card>
      </form>
    </Container>
  );
}

