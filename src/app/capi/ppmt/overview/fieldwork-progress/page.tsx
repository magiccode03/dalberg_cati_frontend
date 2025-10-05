'use client';

import React from 'react';
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

const FieldworkProgressPage = () => {
  // Progress Summary data
  const progressSummaryData: ProgressSummary[] = [
    { details: 'Total Sample', measure: '72900' },
    { details: 'Sample Achieved (Numbers)', measure: '50025' },
    { details: 'Sample Achieved (%)', measure: '68.62' },
    { details: 'ACs completed', measure: '56' },
    { details: 'ACs not completed', measure: '178' },
    { details: 'ACs yet to be initiated', measure: '9' },
  ];

  // Complete AC Wise Progress data (243 ACs)
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
    // Continue with more data...
    { acCode: 243, acName: 'Chakai', districtName: 'Jamui', validUnderQc: 2, reject: 318, completionPercent: 0.7 },
  ];

  const getRowStyle = (completionPercent: number) => {
    if (completionPercent >= 100) {
      return 'bg-green-600 text-white';
    } else if (completionPercent >= 50) {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="justify-content-center mt-2">
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Progress Summary Card */}
      <Card className="mb-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="card-title mg-b-0">
              Progress <i>Summary</i>
            </Heading>
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
      <Card>
        <div className="card-header pb-0 mb-6">
          <div className="flex items-center">
          <div className="w-1 h-6 bg-green-500 mr-3 flex-shrink-0"></div>
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
                Total <b>{acProgressData.length}</b> items.
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
};

export default FieldworkProgressPage;