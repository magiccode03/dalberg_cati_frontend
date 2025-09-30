'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';

interface ProgressSummary {
  details: string;
  measure: string | number;
}

interface ACProgress {
  acCode: number;
  acName: string;
  districtName: string;
  validUnderQc: number;
  reject: number;
  completionPercent: number;
}

export default function FieldworkProgressPage() {
  // Progress Summary Data
  const progressSummaryData: ProgressSummary[] = [
    { details: 'Total Sample', measure: '72900' },
    { details: 'Sample Achieved (Numbers)', measure: '50025' },
    { details: 'Sample Achieved (%)', measure: '68.62' },
    { details: 'ACs completed', measure: '56' },
    { details: 'ACs not completed', measure: '178' },
    { details: 'ACs yet to be initiated', measure: '9' }
  ];

  // AC Wise Progress Data (first 50 items from the HTML)
  const acProgressData: ACProgress[] = [
    { acCode: 1, acName: 'Valmiki Nagar', districtName: 'Pashchim Champaran', validUnderQc: 310, reject: 15, completionPercent: 103.3 },
    { acCode: 2, acName: 'Ramnagar (SC)', districtName: 'Pashchim Champaran', validUnderQc: 346, reject: 44, completionPercent: 115.3 },
    { acCode: 3, acName: 'Narkatiaganj', districtName: 'Pashchim Champaran', validUnderQc: 315, reject: 73, completionPercent: 105 },
    { acCode: 4, acName: 'Bagaha', districtName: 'Pashchim Champaran', validUnderQc: 306, reject: 27, completionPercent: 102 },
    { acCode: 5, acName: 'Lauriya', districtName: 'Pashchim Champaran', validUnderQc: 337, reject: 96, completionPercent: 112.3 },
    { acCode: 6, acName: 'Nautan', districtName: 'Pashchim Champaran', validUnderQc: 326, reject: 73, completionPercent: 108.7 },
    { acCode: 7, acName: 'Chanpatia', districtName: 'Pashchim Champaran', validUnderQc: 314, reject: 52, completionPercent: 104.7 },
    { acCode: 8, acName: 'Bettiah', districtName: 'Pashchim Champaran', validUnderQc: 318, reject: 95, completionPercent: 106 },
    { acCode: 9, acName: 'Sikta', districtName: 'Pashchim Champaran', validUnderQc: 351, reject: 11, completionPercent: 117 },
    { acCode: 10, acName: 'Raxaul', districtName: 'Purba Champaran', validUnderQc: 325, reject: 104, completionPercent: 108.3 },
    { acCode: 11, acName: 'Sugauli', districtName: 'Purba Champaran', validUnderQc: 238, reject: 182, completionPercent: 79.3 },
    { acCode: 12, acName: 'Narkatia', districtName: 'Purba Champaran', validUnderQc: 303, reject: 8, completionPercent: 101 },
    { acCode: 13, acName: 'Harsidhi (SC)', districtName: 'Purba Champaran', validUnderQc: 171, reject: 190, completionPercent: 57 },
    { acCode: 14, acName: 'Govindganj', districtName: 'Purba Champaran', validUnderQc: 148, reject: 200, completionPercent: 49.3 },
    { acCode: 15, acName: 'Kesaria', districtName: 'Purba Champaran', validUnderQc: 291, reject: 218, completionPercent: 97 },
    { acCode: 16, acName: 'Kalyanpur', districtName: 'Purba Champaran', validUnderQc: 192, reject: 283, completionPercent: 64 },
    { acCode: 17, acName: 'Pipra', districtName: 'Purba Champaran', validUnderQc: 189, reject: 345, completionPercent: 63 },
    { acCode: 18, acName: 'Madhuban', districtName: 'Purba Champaran', validUnderQc: 209, reject: 102, completionPercent: 69.7 },
    { acCode: 19, acName: 'Motihari', districtName: 'Purba Champaran', validUnderQc: 118, reject: 234, completionPercent: 39.3 },
    { acCode: 20, acName: 'Chiraia', districtName: 'Purba Champaran', validUnderQc: 89, reject: 437, completionPercent: 29.7 },
    { acCode: 21, acName: 'Dhaka', districtName: 'Purba Champaran', validUnderQc: 163, reject: 140, completionPercent: 54.3 },
    { acCode: 22, acName: 'Sheohar', districtName: 'Sheohar', validUnderQc: 211, reject: 204, completionPercent: 70.3 },
    { acCode: 23, acName: 'Riga', districtName: 'Sitamarhi', validUnderQc: 193, reject: 608, completionPercent: 64.3 },
    { acCode: 24, acName: 'Bathnaha (SC)', districtName: 'Sitamarhi', validUnderQc: 210, reject: 394, completionPercent: 70 },
    { acCode: 25, acName: 'Parihar', districtName: 'Sitamarhi', validUnderQc: 301, reject: 155, completionPercent: 100.3 },
    { acCode: 26, acName: 'Sursand', districtName: 'Sitamarhi', validUnderQc: 292, reject: 308, completionPercent: 97.3 },
    { acCode: 27, acName: 'Bajpatti', districtName: 'Sitamarhi', validUnderQc: 305, reject: 78, completionPercent: 101.7 },
    { acCode: 28, acName: 'Sitamarhi', districtName: 'Sitamarhi', validUnderQc: 293, reject: 68, completionPercent: 97.7 },
    { acCode: 29, acName: 'Runnisaidpur', districtName: 'Sitamarhi', validUnderQc: 166, reject: 599, completionPercent: 55.3 },
    { acCode: 30, acName: 'Belsand', districtName: 'Sitamarhi', validUnderQc: 188, reject: 204, completionPercent: 62.7 },
    { acCode: 31, acName: 'Harlakhi', districtName: 'Madhubani', validUnderQc: 304, reject: 60, completionPercent: 101.3 },
    { acCode: 32, acName: 'Benipatti', districtName: 'Madhubani', validUnderQc: 302, reject: 75, completionPercent: 100.7 },
    { acCode: 33, acName: 'Khajauli', districtName: 'Madhubani', validUnderQc: 209, reject: 270, completionPercent: 69.7 },
    { acCode: 34, acName: 'Babubarhi', districtName: 'Madhubani', validUnderQc: 277, reject: 176, completionPercent: 92.3 },
    { acCode: 35, acName: 'Bisfi', districtName: 'Madhubani', validUnderQc: 430, reject: 3, completionPercent: 143.3 },
    { acCode: 36, acName: 'Madhubani', districtName: 'Madhubani', validUnderQc: 303, reject: 127, completionPercent: 101 },
    { acCode: 37, acName: 'Rajnagar (SC)', districtName: 'Madhubani', validUnderQc: 306, reject: 23, completionPercent: 102 },
    { acCode: 38, acName: 'Jhanjharpur', districtName: 'Madhubani', validUnderQc: 302, reject: 121, completionPercent: 100.7 },
    { acCode: 39, acName: 'Phulparas', districtName: 'Madhubani', validUnderQc: 300, reject: 34, completionPercent: 100 },
    { acCode: 40, acName: 'Laukaha', districtName: 'Madhubani', validUnderQc: 301, reject: 19, completionPercent: 100.3 },
    { acCode: 41, acName: 'Nirmali', districtName: 'Supaul', validUnderQc: 271, reject: 213, completionPercent: 90.3 },
    { acCode: 42, acName: 'Pipra', districtName: 'Supaul', validUnderQc: 288, reject: 151, completionPercent: 96 },
    { acCode: 43, acName: 'Supaul', districtName: 'Supaul', validUnderQc: 283, reject: 205, completionPercent: 94.3 },
    { acCode: 44, acName: 'Triveniganj (SC)', districtName: 'Supaul', validUnderQc: 270, reject: 192, completionPercent: 90 },
    { acCode: 45, acName: 'Chhatapur', districtName: 'Supaul', validUnderQc: 289, reject: 113, completionPercent: 96.3 },
    { acCode: 46, acName: 'Narpatganj', districtName: 'Araria', validUnderQc: 36, reject: 476, completionPercent: 12 },
    { acCode: 47, acName: 'Raniganj (SC)', districtName: 'Araria', validUnderQc: 41, reject: 278, completionPercent: 13.7 },
    { acCode: 48, acName: 'Forbesganj', districtName: 'Araria', validUnderQc: 11, reject: 473, completionPercent: 3.7 },
    { acCode: 49, acName: 'Araria', districtName: 'Araria', validUnderQc: 36, reject: 332, completionPercent: 12 },
    { acCode: 50, acName: 'Jokihat', districtName: 'Araria', validUnderQc: 8, reject: 394, completionPercent: 2.7 }
  ];

  const getRowStyle = (completionPercent: number) => {
    if (completionPercent >= 100) {
      return 'bg-green-500 text-white';
    } else if (completionPercent >= 50) {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Fieldwork Progress
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Progress Summary Card */}
      <Card className="p-6 mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              Progress <i>Summary</i>
            </Heading>
            <span className="text-end">
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Measure</th>
                </tr>
              </thead>
              <tbody>
                {progressSummaryData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.details}</td>
                    <td>{item.measure}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>

      {/* AC Wise Progress Card */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              AC Wise Progress
            </Heading>
            <span className="text-end">
              {/* Download button can be added here */}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <b>243</b> items.
              </Text>
            </div>
            
            <Table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-center">AC Code</th>
                  <th>AC Name</th>
                  <th>District Name</th>
                  <th className="text-center">Valid+Under QC</th>
                  <th className="text-center">Reject</th>
                  <th className="text-center">% of Completion</th>
                </tr>
              </thead>
              <tbody>
                {acProgressData.map((ac, index) => (
                  <tr key={ac.acCode} className={getRowStyle(ac.completionPercent)}>
                    <td className="text-center">{ac.acCode}</td>
                    <td>{ac.acName}</td>
                    <td>{ac.districtName}</td>
                    <td className="text-center">{ac.validUnderQc}</td>
                    <td className="text-center">{ac.reject}</td>
                    <td className="text-center">{ac.completionPercent}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Container>
  );
}
