'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';

interface DemographicData {
  acName: string;
  sample: string;
  populationPercent: string;
  genderMale: string;
  genderFemale: string;
  age18_24: string;
  age25_34: string;
  age35_50: string;
  age50Plus: string;
  localityUrban: string;
  localityRural: string;
  socialGeneral: string;
  socialSC: string;
  socialST: string;
  religionHindu: string;
  religionMuslim: string;
  religionOthers: string;
}

export default function DemographicPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All ACs');
  const [localityFilter, setLocalityFilter] = useState('All ACs');
  const [religionFilter, setReligionFilter] = useState('All ACs');
  const [socialCategoryFilter, setSocialCategoryFilter] = useState('All ACs');
  const [ageFilter, setAgeFilter] = useState('All ACs');

  // Summary Cards Data
  const summaryCards = [
    { title: 'ACs', value: '243', color: 'bg-green-600', opacity: 'opacity-100' },
    { title: 'PCs', value: '40', color: 'bg-teal-500', opacity: 'opacity-100' },
    { title: 'Districts', value: '38', color: 'bg-teal-500', opacity: 'opacity-100' },
    { title: 'Zones', value: '9', color: 'bg-teal-500', opacity: 'opacity-100' }
  ];

  // Sample demographic data matching the image
  const demographicData: DemographicData[] = [
    {
      acName: '1 - Valmiki Nagar',
      sample: '311/300',
      populationPercent: 'Population %',
      genderMale: '54%',
      genderFemale: '46%',
      age18_24: '19%',
      age25_34: '27%',
      age35_50: '34%',
      age50Plus: '21%',
      localityUrban: '0%',
      localityRural: '100%',
      socialGeneral: '66%',
      socialSC: '15%',
      socialST: '19%',
      religionHindu: '77%',
      religionMuslim: '22%',
      religionOthers: '1%'
    },
    {
      acName: '2 - Ramnagar (SC)',
      sample: '346/300',
      populationPercent: 'Population %',
      genderMale: '53%',
      genderFemale: '47%',
      age18_24: '19%',
      age25_34: '27%',
      age35_50: '34%',
      age50Plus: '21%',
      localityUrban: '11%',
      localityRural: '89%',
      socialGeneral: '61%',
      socialSC: '17%',
      socialST: '23%',
      religionHindu: '74%',
      religionMuslim: '25%',
      religionOthers: '1%'
    },
    {
      acName: '3 - Narkatiaganj',
      sample: '315/300',
      populationPercent: 'Population %',
      genderMale: '54%',
      genderFemale: '46%',
      age18_24: '19%',
      age25_34: '27%',
      age35_50: '34%',
      age50Plus: '21%',
      localityUrban: '12%',
      localityRural: '88%',
      socialGeneral: '83%',
      socialSC: '15%',
      socialST: '2%',
      religionHindu: '68%',
      religionMuslim: '32%',
      religionOthers: '0%'
    }
  ];

  const getDifferenceStyle = (value: string) => {
    const numValue = parseFloat(value.replace(/[+%-]/g, ''));
    if (value.startsWith('+') || numValue === 0) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const renderBarChart = (title: string, data: any[]) => (
    <Card className="p-4">
      <h3 className="text-center text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.label}</span>
              <span className="font-semibold">{item.population}%</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded">
              <div 
                className="absolute top-0 left-0 h-full bg-gray-400 rounded"
                style={{ width: `${item.population}%` }}
              ></div>
              <div 
                className="absolute top-0 left-0 h-full rounded"
                style={{ 
                  width: `${item.achievement}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Universal Coverage</span>
              <span className="font-semibold">{item.achievement}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
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

      {/* Charts Section */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {renderBarChart('Gender Coverage', [
            { label: 'Male', population: 53, achievement: 66, color: '#2da9d9' },
            { label: 'Female', population: 47, achievement: 34, color: '#b73377' }
          ])}
          
          {renderBarChart('Locality Coverage', [
            { label: 'Urban', population: 12, achievement: 7, color: '#ffeb3b' },
            { label: 'Rural', population: 88, achievement: 93, color: '#4caf50' }
          ])}
          
          {renderBarChart('Social Category Coverage', [
            { label: 'General+OBC+EBC', population: 83, achievement: 77, color: '#ff9800' },
            { label: 'SC', population: 16, achievement: 16, color: '#4caf50' },
            { label: 'ST', population: 1, achievement: 7, color: '#3f51b5' }
          ])}
          
          {renderBarChart('Age Coverage', [
            { label: '18-24 Years', population: 21, achievement: 14, color: '#4caf50' },
            { label: '25-34 Years', population: 26, achievement: 30, color: '#2196f3' },
            { label: '35-50 Years', population: 32, achievement: 36, color: '#ff9800' },
            { label: '50+ Years', population: 21, achievement: 20, color: '#9c27b0' }
          ])}
          
          {renderBarChart('Religion Coverage', [
            { label: 'Hindu', population: 84, achievement: 99, color: '#ff9800' },
            { label: 'Muslim', population: 10, achievement: 0, color: '#4caf50' },
            { label: 'Others', population: 6, achievement: 0, color: '#9e9e9e' }
          ])}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className={`${card.color} text-white ${card.opacity} cursor-pointer hover:opacity-90 transition-opacity`}>
            <div className="p-4 text-center">
              <h2 className="text-white text-lg font-semibold mb-2">{card.title}</h2>
              <h4 className="text-white text-2xl font-bold">{card.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Table */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              Demographic Data
            </Heading>
            <Button className="btn btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Input
            type="text"
            placeholder="Search by AC Name/Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <SelectDropdown
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            options={[
              { value: 'All ACs', label: 'All ACs' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' }
            ]}
            className="w-full"
          />
          <SelectDropdown
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            options={[
              { value: 'All ACs', label: 'All ACs' },
              { value: 'Urban', label: 'Urban' },
              { value: 'Rural', label: 'Rural' }
            ]}
            className="w-full"
          />
          <SelectDropdown
            value={religionFilter}
            onChange={(e) => setReligionFilter(e.target.value)}
            options={[
              { value: 'All ACs', label: 'All ACs' },
              { value: 'Hindu', label: 'Hindu' },
              { value: 'Muslim', label: 'Muslim' },
              { value: 'Others', label: 'Others' }
            ]}
            className="w-full"
          />
          <SelectDropdown
            value={socialCategoryFilter}
            onChange={(e) => setSocialCategoryFilter(e.target.value)}
            options={[
              { value: 'All ACs', label: 'All ACs' },
              { value: 'General+OBC+EBC', label: 'General+OBC+EBC' },
              { value: 'SC', label: 'SC' },
              { value: 'ST', label: 'ST' }
            ]}
            className="w-full"
          />
          <SelectDropdown
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            options={[
              { value: 'All ACs', label: 'All ACs' },
              { value: '18-24', label: '18-24' },
              { value: '25-34', label: '25-34' },
              { value: '35-50', label: '35-50' },
              { value: '50+', label: '50+' }
            ]}
            className="w-full"
          />
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <Table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th rowSpan={2} className="bg-tableheader text-center">AC Name</th>
                  <th rowSpan={2} className="bg-tableheader text-center">Sample</th>
                  <th rowSpan={2} className="bg-tableheader text-center"></th>
                  <th colSpan={2} className="text-center bg-tableheader">Gender</th>
                  <th colSpan={4} className="text-center bg-tableheader">Age</th>
                  <th colSpan={2} className="text-center bg-tableheader">Locality</th>
                  <th colSpan={3} className="text-center bg-tableheader">Social Category</th>
                  <th colSpan={3} className="text-center bg-tableheader">Religion</th>
                </tr>
                <tr>
                  <th className="text-center bg-tableheader">Male</th>
                  <th className="text-center bg-tableheader">Female</th>
                  <th className="text-center bg-tableheader">18-24</th>
                  <th className="text-center bg-tableheader">25-34</th>
                  <th className="text-center bg-tableheader">35-50</th>
                  <th className="text-center bg-tableheader">50+</th>
                  <th className="text-center bg-tableheader">Urban</th>
                  <th className="text-center bg-tableheader">Rural</th>
                  <th className="text-center bg-tableheader">G+O+E</th>
                  <th className="text-center bg-tableheader">SC</th>
                  <th className="text-center bg-tableheader">ST</th>
                  <th className="text-center bg-tableheader">Hindu</th>
                  <th className="text-center bg-tableheader">Muslim</th>
                  <th className="text-center bg-tableheader">OTH</th>
                </tr>
              </thead>
              <tbody>
                {demographicData.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td rowSpan={3} className="text-blue-600 font-semibold text-center">{row.acName}</td>
                      <td rowSpan={3} className="font-semibold text-center">{row.sample}</td>
                      <td className="text-center">Population %</td>
                      <td className="text-center">{row.genderMale}</td>
                      <td className="text-center">{row.genderFemale}</td>
                      <td className="text-center">{row.age18_24}</td>
                      <td className="text-center">{row.age25_34}</td>
                      <td className="text-center">{row.age35_50}</td>
                      <td className="text-center">{row.age50Plus}</td>
                      <td className="text-center">{row.localityUrban}</td>
                      <td className="text-center">{row.localityRural}</td>
                      <td className="text-center">{row.socialGeneral}</td>
                      <td className="text-center">{row.socialSC}</td>
                      <td className="text-center">{row.socialST}</td>
                      <td className="text-center">{row.religionHindu}</td>
                      <td className="text-center">{row.religionMuslim}</td>
                      <td className="text-center">{row.religionOthers}</td>
                    </tr>
                    <tr>
                      <td className="text-center">Achievement %</td>
                      <td className="text-center">74%</td>
                      <td className="text-center">26%</td>
                      <td className="text-center">15%</td>
                      <td className="text-center">22%</td>
                      <td className="text-center">38%</td>
                      <td className="text-center">25%</td>
                      <td className="text-center">0%</td>
                      <td className="text-center">100%</td>
                      <td className="text-center">83%</td>
                      <td className="text-center">12%</td>
                      <td className="text-center">5%</td>
                      <td className="text-center">100%</td>
                      <td className="text-center">0%</td>
                      <td className="text-center">0%</td>
                    </tr>
                    <tr>
                      <td className="text-center">Difference</td>
                      <td className={`text-center ${getDifferenceStyle('+20%')}`}>+20%</td>
                      <td className={`text-center ${getDifferenceStyle('-20%')}`}>-20%</td>
                      <td className={`text-center ${getDifferenceStyle('-4%')}`}>-4%</td>
                      <td className={`text-center ${getDifferenceStyle('-5%')}`}>-5%</td>
                      <td className={`text-center ${getDifferenceStyle('+4%')}`}>+4%</td>
                      <td className={`text-center ${getDifferenceStyle('+4%')}`}>+4%</td>
                      <td className={`text-center ${getDifferenceStyle('0%')}`}>0%</td>
                      <td className={`text-center ${getDifferenceStyle('0%')}`}>0%</td>
                      <td className={`text-center ${getDifferenceStyle('+17%')}`}>+17%</td>
                      <td className={`text-center ${getDifferenceStyle('-3%')}`}>-3%</td>
                      <td className={`text-center ${getDifferenceStyle('-14%')}`}>-14%</td>
                      <td className={`text-center ${getDifferenceStyle('+23%')}`}>+23%</td>
                      <td className={`text-center ${getDifferenceStyle('-22%')}`}>-22%</td>
                      <td className={`text-center ${getDifferenceStyle('-1%')}`}>-1%</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Container>
  );
}
