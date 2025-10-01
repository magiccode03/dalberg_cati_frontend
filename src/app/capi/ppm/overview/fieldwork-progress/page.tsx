'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';

const FieldworkProgressPage = () => {
  // Progress Summary data
  const progressSummaryData = [
    { details: 'Total Sample', measure: '72900' },
    { details: 'Sample Achieved (Numbers)', measure: '50025' },
    { details: 'Sample Achieved (%)', measure: '68.62' },
    { details: 'ACs completed', measure: '56' },
    { details: 'ACs not completed', measure: '178' },
    { details: 'ACs yet to be initiated', measure: '9' },
  ];

  // AC Wise Progress data
  const acWiseProgressData = [
    { acCode: 1, acName: 'Valmiki Nagar', districtName: 'Pashchim Champaran', validUnderQC: 310, reject: 15, completionPercent: 103.3, status: 'completed' },
    { acCode: 2, acName: 'Ramnagar (SC)', districtName: 'Pashchim Champaran', validUnderQC: 346, reject: 44, completionPercent: 115.3, status: 'completed' },
    { acCode: 3, acName: 'Narkatiaganj', districtName: 'Pashchim Champaran', validUnderQC: 315, reject: 73, completionPercent: 105, status: 'completed' },
    { acCode: 4, acName: 'Bagaha', districtName: 'Pashchim Champaran', validUnderQC: 306, reject: 27, completionPercent: 102, status: 'completed' },
    { acCode: 5, acName: 'Lauriya', districtName: 'Pashchim Champaran', validUnderQC: 337, reject: 96, completionPercent: 112.3, status: 'completed' },
    { acCode: 6, acName: 'Nautan', districtName: 'Pashchim Champaran', validUnderQC: 326, reject: 73, completionPercent: 108.7, status: 'completed' },
    { acCode: 7, acName: 'Chanpatia', districtName: 'Pashchim Champaran', validUnderQC: 314, reject: 52, completionPercent: 104.7, status: 'completed' },
    { acCode: 8, acName: 'Bettiah', districtName: 'Pashchim Champaran', validUnderQC: 318, reject: 95, completionPercent: 106, status: 'completed' },
    { acCode: 9, acName: 'Sikta', districtName: 'Pashchim Champaran', validUnderQC: 351, reject: 11, completionPercent: 117, status: 'completed' },
    { acCode: 10, acName: 'Raxaul', districtName: 'Purba Champaran', validUnderQC: 325, reject: 104, completionPercent: 108.3, status: 'completed' },
    { acCode: 11, acName: 'Sugauli', districtName: 'Purba Champaran', validUnderQC: 238, reject: 182, completionPercent: 79.3, status: 'in-progress' },
    { acCode: 12, acName: 'Narkatia', districtName: 'Purba Champaran', validUnderQC: 303, reject: 8, completionPercent: 101, status: 'completed' },
    { acCode: 13, acName: 'Harsidhi (SC)', districtName: 'Purba Champaran', validUnderQC: 171, reject: 190, completionPercent: 57, status: 'in-progress' },
    { acCode: 14, acName: 'Govindganj', districtName: 'Purba Champaran', validUnderQC: 148, reject: 200, completionPercent: 49.3, status: 'in-progress' },
    { acCode: 15, acName: 'Kesaria', districtName: 'Purba Champaran', validUnderQC: 291, reject: 218, completionPercent: 97, status: 'in-progress' },
    { acCode: 16, acName: 'Kalyanpur', districtName: 'Purba Champaran', validUnderQC: 192, reject: 283, completionPercent: 64, status: 'in-progress' },
    { acCode: 17, acName: 'Pipra', districtName: 'Purba Champaran', validUnderQC: 189, reject: 345, completionPercent: 63, status: 'in-progress' },
    { acCode: 18, acName: 'Madhuban', districtName: 'Purba Champaran', validUnderQC: 209, reject: 102, completionPercent: 69.7, status: 'in-progress' },
    { acCode: 19, acName: 'Motihari', districtName: 'Purba Champaran', validUnderQC: 118, reject: 234, completionPercent: 39.3, status: 'in-progress' },
    { acCode: 20, acName: 'Chiraia', districtName: 'Purba Champaran', validUnderQC: 89, reject: 437, completionPercent: 29.7, status: 'in-progress' },
    { acCode: 21, acName: 'Dhaka', districtName: 'Purba Champaran', validUnderQC: 163, reject: 140, completionPercent: 54.3, status: 'in-progress' },
    { acCode: 22, acName: 'Sheohar', districtName: 'Sheohar', validUnderQC: 211, reject: 204, completionPercent: 70.3, status: 'in-progress' },
    { acCode: 23, acName: 'Riga', districtName: 'Sitamarhi', validUnderQC: 193, reject: 608, completionPercent: 64.3, status: 'in-progress' },
    { acCode: 24, acName: 'Bathnaha (SC)', districtName: 'Sitamarhi', validUnderQC: 210, reject: 394, completionPercent: 70, status: 'in-progress' },
    { acCode: 25, acName: 'Parihar', districtName: 'Sitamarhi', validUnderQC: 301, reject: 155, completionPercent: 100.3, status: 'completed' },
    { acCode: 26, acName: 'Sursand', districtName: 'Sitamarhi', validUnderQC: 292, reject: 308, completionPercent: 97.3, status: 'in-progress' },
    { acCode: 27, acName: 'Bajpatti', districtName: 'Sitamarhi', validUnderQC: 305, reject: 78, completionPercent: 101.7, status: 'completed' },
    { acCode: 28, acName: 'Sitamarhi', districtName: 'Sitamarhi', validUnderQC: 293, reject: 68, completionPercent: 97.7, status: 'in-progress' },
    { acCode: 29, acName: 'Runnisaidpur', districtName: 'Sitamarhi', validUnderQC: 166, reject: 599, completionPercent: 55.3, status: 'in-progress' },
    { acCode: 30, acName: 'Belsand', districtName: 'Sitamarhi', validUnderQC: 188, reject: 204, completionPercent: 62.7, status: 'in-progress' },
  ];

  const getRowStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white';
      case 'in-progress':
        return 'bg-orange-500 text-white';
      case 'not-started':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-white text-gray-800';
    }
  };

  return (
    <div className="main-container container mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="mb-6">
        <Heading level={4}>Fieldwork Progress</Heading>
      </div>

      {/* Progress Summary Card */}
      <div className="row mb-6">
        <div className="col-xl-12">
          <div className="card shadow-sm bg-white rounded-lg border border-gray-200 p-6">
            <div className="card-header pb-0">
              <div className="d-flex justify-content-between">
                <h4 className="card-title mg-b-0 text-lg font-semibold">
                  Progress <em>Summary</em>
                </h4>
                <span className="text-end"></span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">Details</th>
                      <th className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">Measure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressSummaryData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b border-gray-200">{item.details}</td>
                        <td className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">
                          {item.measure}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AC Wise Progress Card */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card shadow-sm bg-white rounded-lg border border-gray-200 p-6">
            <div className="card-header pb-0">
              <div className="d-flex justify-content-between">
                <h4 className="card-title mg-b-0 text-lg font-semibold">
                  AC Wise Progress
                </h4>
                <span className="text-end">
                  <span className="text-sm text-gray-500">
                    Total <strong>243</strong> items.
                  </span>
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <Table bordered striped hover>
                  <thead className="sticky-header bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">AC Code</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">AC Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">District Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">Valid+Under QC</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">Reject</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">% of Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acWiseProgressData.map((item, index) => (
                      <tr key={index} className={`${getRowStyle(item.status)} hover:opacity-90`}>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.acCode}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 font-medium">
                          {item.acName}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200">
                          {item.districtName}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.validUnderQC}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.reject}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-center font-medium">
                          {item.completionPercent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldworkProgressPage;
