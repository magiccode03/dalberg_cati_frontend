'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';

interface VoteShareData {
  party: string;
  percentage: number;
  count: string;
  color: string;
}

interface DemographicData {
  category: string;
  subcategory: string;
  bjp: number;
  jdu: number;
  hams: number;
  vsip: number;
  ljp: number;
  inc: number;
  rjd: number;
  cpi: number;
  jsp: number;
  others: number;
  nwr: number;
}

export default function VoteShareEstimatePage() {
  const [progressType, setProgressType] = useState('ac');

  // 2025 Preference Data
  const voteShare2025: VoteShareData[] = [
    { party: 'Bhartiya Janta Party (BJP)', percentage: 49, count: '24,729', color: '#e97132' },
    { party: 'Janta Dal (United) (JDU)', percentage: 10, count: '4,907', color: '#92d050' },
    { party: 'Hindustani Awam Morcha (Secular) (HAMS)', percentage: 0, count: '112', color: '#dce119' },
    { party: 'Vikassheel Insaan Party (VSIP)', percentage: 0, count: '139', color: '#275317' },
    { party: 'Lok Janshakti Party (Ram Vilas)', percentage: 2, count: '1,131', color: '#7030a0' },
    { party: 'Indian National Congress (INC)', percentage: 5, count: '2,713', color: '#00b0f0' },
    { party: 'Rashtriya Janta Dal (RJD)', percentage: 28, count: '14,198', color: '#548235' },
    { party: 'CPI-MaLe', percentage: 1, count: '502', color: '#ff0000' },
    { party: 'JSP', percentage: 2, count: '757', color: '#ffff00' },
    { party: 'Others', percentage: 1, count: '360', color: '#aeaeae' },
    { party: 'NOTA/NWR', percentage: 1, count: '477', color: '#aeaeae' },
  ];

  // 2020 AE Data
  const voteShare2020: VoteShareData[] = [
    { party: 'Bhartiya Janta Party (BJP)', percentage: 26, count: '12,826', color: '#e97132' },
    { party: 'Janta Dal (United) (JDU)', percentage: 24, count: '12,051', color: '#92d050' },
    { party: 'Hindustani Awam Morcha (Secular) (HAMS)', percentage: 1, count: '309', color: '#dce119' },
    { party: 'Vikassheel Insaan Party (VSIP)', percentage: 1, count: '693', color: '#275317' },
    { party: 'Lok Janshakti Party (Ram Vilas)', percentage: 4, count: '1,913', color: '#7030a0' },
    { party: 'Indian National Congress (INC)', percentage: 8, count: '3,803', color: '#00b0f0' },
    { party: 'Rashtriya Janta Dal (RJD)', percentage: 19, count: '9,376', color: '#548235' },
    { party: 'CPI-MaLe', percentage: 2, count: '1,091', color: '#ff0000' },
    { party: 'JSP', percentage: 0, count: '0', color: '#ffff00' },
    { party: 'Others', percentage: 2, count: '815', color: '#aeaeae' },
    { party: 'NOTA/NWR', percentage: 14, count: '7,091', color: '#aeaeae' },
  ];

  // Demographic Data
  const demographicData: DemographicData[] = [
    // Gender
    { category: 'Gender', subcategory: 'Male', bjp: 47.1, jdu: 9.7, hams: 0.3, vsip: 0.3, ljp: 2.5, inc: 5.5, rjd: 30.0, cpi: 1.0, jsp: 2.0, others: 0.8, nwr: 0.9 },
    { category: 'Gender', subcategory: 'Female', bjp: 54.0, jdu: 10.0, hams: 0.1, vsip: 0.2, ljp: 1.8, inc: 5.3, rjd: 25.2, cpi: 0.9, jsp: 0.6, others: 0.7, nwr: 1.1 },
    
    // Locality
    { category: 'Locality', subcategory: 'Urban', bjp: 55.9, jdu: 9.6, hams: 0.2, vsip: 0.1, ljp: 2.0, inc: 5.1, rjd: 23.9, cpi: 0.8, jsp: 1.5, others: 0.5, nwr: 0.4 },
    { category: 'Locality', subcategory: 'Rural', bjp: 49.0, jdu: 9.8, hams: 0.2, vsip: 0.3, ljp: 2.3, inc: 5.4, rjd: 28.7, cpi: 1.0, jsp: 1.5, others: 0.7, nwr: 1.0 },
    
    // Social Category
    { category: 'Social Category', subcategory: 'General+OBC', bjp: 51.3, jdu: 6.9, hams: 0.1, vsip: 0.1, ljp: 0.7, inc: 6.3, rjd: 31.6, cpi: 0.9, jsp: 1.5, others: 0.4, nwr: 0.2 },
    { category: 'Social Category', subcategory: 'SC', bjp: 49.5, jdu: 10.0, hams: 0.9, vsip: 0.7, ljp: 5.5, inc: 4.7, rjd: 22.0, cpi: 3.0, jsp: 1.5, others: 2.0, nwr: 0.3 },
    { category: 'Social Category', subcategory: 'ST', bjp: 51.2, jdu: 10.7, hams: 0.1, vsip: 0.8, ljp: 2.2, inc: 7.0, rjd: 23.6, cpi: 1.7, jsp: 1.9, others: 0.7, nwr: 0.2 },
    
    // Age
    { category: 'Age', subcategory: '18-24', bjp: 51.4, jdu: 5.6, hams: 0.2, vsip: 0.2, ljp: 2.4, inc: 6.3, rjd: 29.7, cpi: 0.9, jsp: 2.0, others: 0.8, nwr: 0.4 },
    { category: 'Age', subcategory: '25-34', bjp: 51.4, jdu: 5.6, hams: 0.2, vsip: 0.2, ljp: 2.4, inc: 6.3, rjd: 29.7, cpi: 0.9, jsp: 2.0, others: 0.8, nwr: 0.4 },
    { category: 'Age', subcategory: '35-50', bjp: 48.3, jdu: 8.5, hams: 0.2, vsip: 0.3, ljp: 2.1, inc: 6.2, rjd: 30.7, cpi: 0.7, jsp: 1.7, others: 0.6, nwr: 0.7 },
    { category: 'Age', subcategory: '50+', bjp: 47.6, jdu: 11.3, hams: 0.3, vsip: 0.3, ljp: 2.2, inc: 5.0, rjd: 28.9, cpi: 1.2, jsp: 1.4, others: 0.7, nwr: 1.1 },
    
    // Religion
    { category: 'Religion', subcategory: 'Hindu', bjp: 53.6, jdu: 10.3, hams: 0.2, vsip: 0.3, ljp: 2.5, inc: 3.7, rjd: 25.3, cpi: 1.0, jsp: 1.5, others: 0.7, nwr: 0.9 },
    { category: 'Religion', subcategory: 'Muslim', bjp: 25.8, jdu: 5.2, hams: 0.0, vsip: 0.0, ljp: 1.0, inc: 17.0, rjd: 44.8, cpi: 3.1, jsp: 1.0, others: 2.1, nwr: 0.0 },
    { category: 'Religion', subcategory: 'Christian', bjp: 73.9, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 4.3, rjd: 13.0, cpi: 4.3, jsp: 0.0, others: 0.0, nwr: 4.3 },
    { category: 'Religion', subcategory: 'Others', bjp: 45.1, jdu: 4.4, hams: 0.0, vsip: 0.0, ljp: 1.8, inc: 8.8, rjd: 23.9, cpi: 1.8, jsp: 3.5, others: 8.0, nwr: 2.7 },
  ];

  const handleCardClick = (type: string) => {
    setProgressType(type);
    console.log('Progress type changed to:', type);
  };

  const renderBarChart = (data: VoteShareData[], title: string, interviews: number) => (
    <div className="card-border p-3">
      <h4 className="text-center mb-4">{title}</h4>
      <div className="d-flex justify-content-end mb-4">
        <h6 className="text-sm text-gray-600">Interviews Achieved - {interviews.toLocaleString()}</h6>
      </div>
      
      {/* Bar Chart Visualization */}
      <div className="chart-container" style={{ height: '450px', position: 'relative' }}>
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="chart-bar-item mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700" style={{ width: '180px', textAlign: 'right', paddingRight: '15px' }}>
                  {item.party}
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mr-2">{item.percentage}%</span>
                  <span className="text-xs text-gray-500">({item.count})</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 relative">
                <div
                  className="h-8 rounded-full flex items-center justify-end pr-3"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                    color: item.color === '#275317' || item.color === '#7030a0' || item.color === '#548235' ? 'white' : 'black'
                  }}
                >
                  <span className="text-sm font-bold">{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDemographicTable = () => {
    const categories = [...new Set(demographicData.map(item => item.category))];
    
    return (
      <div className="card-border p-3">
        <h4 className="text-center mb-4">Vote Share Estimate - 2025 Preference Demographics (%)</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <tbody>
              {categories.map((category, categoryIndex) => {
                const categoryData = demographicData.filter(item => item.category === category);
                return (
                  <React.Fragment key={categoryIndex}>
                    {/* Category Header */}
                    <tr>
                      <th style={{ width: '10%' }} className="bg-tableheader">{category}</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#e97132' }}>BJP</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#92d050' }}>JDU</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#dce119' }}>HAMS</th>
                      <th className="number" style={{ width: '5%', color: 'white', backgroundColor: '#275317' }}>VSIP</th>
                      <th className="number" style={{ width: '5%', color: 'white', backgroundColor: '#7030a0' }}>LJP(RV)</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#00b0f0' }}>INC</th>
                      <th className="number" style={{ width: '5%', color: 'white', backgroundColor: '#548235' }}>RJD</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#ff0000' }}>CPI(M)</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#ffff00' }}>JSP</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }}>Others</th>
                      <th className="number" style={{ width: '5%', color: 'black', backgroundColor: '#aeaeae' }}>NWR</th>
                    </tr>
                    
                    {/* Category Data Rows */}
                    {categoryData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td style={{ width: '10%' }}>{row.subcategory}</td>
                        <td className="number">{row.bjp}</td>
                        <td className="number">{row.jdu}</td>
                        <td className="number">{row.hams}</td>
                        <td className="number">{row.vsip}</td>
                        <td className="number">{row.ljp}</td>
                        <td className="number">{row.inc}</td>
                        <td className="number">{row.rjd}</td>
                        <td className="number">{row.cpi}</td>
                        <td className="number">{row.jsp}</td>
                        <td className="number">{row.others}</td>
                        <td className="number">{row.nwr}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Vote Share Estimates
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Progress Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            progressType === 'ac' ? 'opacity-100' : 'opacity-50'
          }`}
          onClick={() => handleCardClick('ac')}
          data-progress-type="ac"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">AC Level</h2>
            </div>
          </div>
        </div>

        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            progressType === 'pc' ? 'opacity-100' : 'opacity-50'
          }`}
          onClick={() => handleCardClick('pc')}
          data-progress-type="pc"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">PC Level</h2>
            </div>
          </div>
        </div>

        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            progressType === 'district' ? 'opacity-100' : 'opacity-50'
          }`}
          onClick={() => handleCardClick('district')}
          data-progress-type="district"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">District Level</h2>
            </div>
          </div>
        </div>

        <div
          className={`bg-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            progressType === 'zone' ? 'opacity-100' : 'opacity-50'
          }`}
          onClick={() => handleCardClick('zone')}
          data-progress-type="zone"
        >
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-white mb-0">Zone Level</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <Card className="p-6 mb-6">
        <div className="row">
          <div className="col-md-6 mb-4">
            {renderBarChart(voteShare2025, '2025 Preference', 50025)}
          </div>
          <div className="col-md-6 mb-4">
            {renderBarChart(voteShare2020, '2020 AE', 49968)}
          </div>
        </div>
      </Card>

      {/* Demographic Table Section */}
      <Card className="p-6">
        <div className="row">
          <div className="col-md-12">
            {renderDemographicTable()}
          </div>
        </div>
      </Card>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
        .card-border {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: white;
          margin-bottom: 1rem;
        }
        .bg-tableheader {
          background-color: #d1eaef !important;
          font-weight: 600;
        }
        .chart-container {
          overflow-x: auto;
          padding: 0.5rem 0;
        }
        .chart-bar-item {
          margin-bottom: 1rem;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid #a0a0a3;
          padding: 0.75rem 0.5rem;
        }
        .table > :not(:last-child) > :last-child > * {
          border-bottom-color: #a0a0a3;
        }
        .number {
          text-align: center;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .d-flex {
          display: flex;
        }
        .justify-content-end {
          justify-content: flex-end;
        }
        .justify-content-center {
          justify-content: center;
        }
        .text-center {
          text-align: center;
        }
        .mb-0 {
          margin-bottom: 0;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .mb-3 {
          margin-bottom: 1rem;
        }
        .mb-4 {
          margin-bottom: 1.5rem;
        }
        .mb-6 {
          margin-bottom: 2rem;
        }
        .p-3 {
          padding: 1rem;
        }
        .p-6 {
          padding: 1.5rem;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -0.75rem;
        }
        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0.75rem;
        }
        .col-md-12 {
          flex: 0 0 100%;
          max-width: 100%;
          padding: 0.75rem;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          margin-bottom: 0;
        }
        .table th,
        .table td {
          padding: 0.75rem 0.5rem;
          vertical-align: middle;
        }
        .table th {
          font-weight: 600;
          background-color: #f8f9fa;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.075);
        }
        @media (max-width: 768px) {
          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </Container>
  );
}
