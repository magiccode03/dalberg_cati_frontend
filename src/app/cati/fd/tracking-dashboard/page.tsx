'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import EChartsLineChart from '@/components/charts/EChartsLineChart';
import { Search, Calendar, MapPin, Users, User, Home, Clock } from 'lucide-react';


export default function TrackingDashboardPage() {
  const [filters, setFilters] = useState({
    zone: '',
    pc: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    ageGroup: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    // Implement search logic here
  };

  const handleReset = () => {
    setFilters({
      zone: '',
      pc: '',
      gender: '',
      locality: '',
      religion: '',
      socialCategory: '',
      ageGroup: ''
    });
  };

  // Chart data for Chief Minister preference tracking
  const chiefMinisterData = {
    categories: ["2024-05-24", "2024-05-25", "2024-05-26", "2024-05-27", "2024-05-28", "2024-05-29", "2024-05-30", "2024-05-31"],
    series: [
      { name: "Mamata Banerjee", data: [59.8, 55.8, 58.5, 52.3, 53.6, 60.1, 59.7, 76.2], color: "#F37809" },
      { name: "Anubrata Mandal", data: [1.6, 0.9, 1.2, 0.9, 0, 0.3, 1.3, 0], color: "#F79431" },
      { name: "Partha Chatterjee", data: [1.7, 2.1, 0, 0, 0.5, 0.5, 0, 1.2], color: "#E55705" },
      { name: "Aroop Biswas", data: [1.4, 0.8, 1.8, 0, 0, 0.3, 0, 0], color: "#00B0F0" },
      { name: "Mukul Roy", data: [0.7, 0.2, 0, 0, 0, 0.5, 0.5, 0], color: "#32328A" },
      { name: "Dilip Ghosh", data: [0.3, 1.8, 0, 0, 0.5, 0.3, 0.5, 0], color: "#A32817" },
      { name: "Babul Supriyo", data: [0.3, 0.3, 0.6, 0, 0, 0, 0, 0], color: "#20753A" },
      { name: "Suvendu Adhikari", data: [4.2, 6.2, 3.7, 3.6, 3.6, 5.5, 3, 7.1], color: "#E8825B" },
      { name: "Sukanta Majumudar", data: [0.6, 0.6, 0, 0, 0, 0, 0, 0], color: "#FFFF00" },
      { name: "Abhishek Banerjee", data: [2.1, 1.2, 3, 0, 1.4, 0.8, 2.4, 0], color: "#F20A0B" },
      { name: "Anyone from TMC", data: [9.7, 9.8, 7.9, 9, 14, 11.5, 14, 6], color: "#D32121" },
      { name: "Anyone from INC", data: [1.1, 1.6, 1.8, 0.9, 0, 0.3, 1.3, 0], color: "#3D7BB3" },
      { name: "Anyone from BJP", data: [9.4, 10.1, 17.7, 14.4, 14, 9.7, 9.4, 9.5], color: "#f75151" },
      { name: "Others", data: [7.1, 8.5, 3.7, 18.9, 12.6, 10.2, 7.8, 0], color: "#D9D9D9" }
    ]
  };

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
              Tracking Dashboard
            </Heading>
          </div>
        </div>

        {/* Search Form */}
        <Card>
          <form id="searchform" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            {/* Top Row - Select Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Zone */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Zone</label>
              <SelectDropdown
                value={filters.zone}
                onChange={(value: string | string[]) => handleFilterChange('zone', Array.isArray(value) ? value[0] : value)}
                options={[
                      { value: '', label: 'Select a Zone' },
                      { value: '1', label: 'Burdwan' },
                      { value: '2', label: 'Jalpaiguri' },
                      { value: '3', label: 'Malda' },
                      { value: '4', label: 'Medinipur' },
                      { value: '5', label: 'Presidency' }
                    ]}
                    placeholder="Select a Zone"
                  />
                </div>
            </div>

              {/* PC */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">PC</label>
              <SelectDropdown
                value={filters.pc}
                onChange={(value: string | string[]) => handleFilterChange('pc', Array.isArray(value) ? value[0] : value)}
                options={[
                      { value: '', label: 'Select a PC' },
                      { value: '2', label: 'Alipurduars' },
                      { value: '29', label: 'Arambagh (SC)' },
                      { value: '40', label: 'Asansol' },
                      { value: '10', label: 'Baharampur' },
                      { value: '6', label: 'Balurghat' },
                      { value: '14', label: 'Bangaon (SC)' },
                      { value: '36', label: 'Bankura' },
                      { value: '17', label: 'Barasat' },
                      { value: '38', label: 'Bardhaman Pur' },
                      { value: '39', label: 'Bardhaman-Dur' }
                    ]}
                    placeholder="Select a PC"
              />
            </div>
              </div>
            </div>

            {/* Bottom Row - Checkbox Groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {/* Gender */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Gender</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="gender[]"
                        value="1"
                        checked={filters.gender === 'male'}
                        onChange={(e) => handleFilterChange('gender', e.target.checked ? 'male' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="gender[]"
                        value="2"
                        checked={filters.gender === 'female'}
                        onChange={(e) => handleFilterChange('gender', e.target.checked ? 'female' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Female</span>
                    </label>
                  </div>
                </div>
            </div>

              {/* Locality */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Locality</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="locality[]"
                        value="1"
                        checked={filters.locality === 'urban'}
                        onChange={(e) => handleFilterChange('locality', e.target.checked ? 'urban' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Urban</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="locality[]"
                        value="2"
                        checked={filters.locality === 'rural'}
                        onChange={(e) => handleFilterChange('locality', e.target.checked ? 'rural' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Rural</span>
                    </label>
                  </div>
                </div>
            </div>

              {/* Religion */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Religion</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="religion[]"
                        value="1"
                        checked={filters.religion === 'hindu'}
                        onChange={(e) => handleFilterChange('religion', e.target.checked ? 'hindu' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Hindu</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="religion[]"
                        value="2"
                        checked={filters.religion === 'muslim'}
                        onChange={(e) => handleFilterChange('religion', e.target.checked ? 'muslim' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Muslim</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="religion[]"
                        value="3"
                        checked={filters.religion === 'christian'}
                        onChange={(e) => handleFilterChange('religion', e.target.checked ? 'christian' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Christian</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="religion[]"
                        value="4"
                        checked={filters.religion === 'sikh'}
                        onChange={(e) => handleFilterChange('religion', e.target.checked ? 'sikh' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sikh</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="religion[]"
                        value="5"
                        checked={filters.religion === 'others'}
                        onChange={(e) => handleFilterChange('religion', e.target.checked ? 'others' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Others</span>
                    </label>
                  </div>
                </div>
            </div>

              {/* Social Category */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Social Category</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="social_category[]"
                        value="1"
                        checked={filters.socialCategory === 'general'}
                        onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'general' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">General/OC</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="social_category[]"
                        value="2"
                        checked={filters.socialCategory === 'sc'}
                        onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'sc' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Schedule Castes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="social_category[]"
                        value="3"
                        checked={filters.socialCategory === 'st'}
                        onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'st' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Schedule Tribes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="social_category[]"
                        value="4"
                        checked={filters.socialCategory === 'obc'}
                        onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'obc' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Other Backward Castes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="social_category[]"
                        value="5"
                        checked={filters.socialCategory === 'no_response'}
                        onChange={(e) => handleFilterChange('socialCategory', e.target.checked ? 'no_response' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">No response</span>
                    </label>
                  </div>
                </div>
            </div>

              {/* Age Group */}
            <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Age Group</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="age[]"
                        value="18_24"
                        checked={filters.ageGroup === '18-24'}
                        onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '18-24' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">18-24 Years</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="age[]"
                        value="25_34"
                        checked={filters.ageGroup === '25-34'}
                        onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '25-34' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">25-34 Years</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="age[]"
                        value="35_50"
                        checked={filters.ageGroup === '35-50'}
                        onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '35-50' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">35-50 Years</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="age[]"
                        value="51_80"
                        checked={filters.ageGroup === '50+'}
                        onChange={(e) => handleFilterChange('ageGroup', e.target.checked ? '50+' : '')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">50+ Years</span>
                    </label>
                  </div>
            </div>
          </div>
          </div>
          </form>
        </Card>

        {/* Chief Minister Preference Charts */}
        <div className="space-y-8">
          {/* Overall Chart */}
          <Card>
            <EChartsLineChart
              title="OVERALL"
              data={chiefMinisterData}
              height={450}
            />

          {/* Zone: Presidency Chart - Half Width */}
          <div className="grid grid-cols-2 gap-4 mt-8">
              <EChartsLineChart
                title="ZONE: PRESIDENCY"
                data={chiefMinisterData}
                height={450}
              />
            <div></div> {/* Empty column */}
          </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
