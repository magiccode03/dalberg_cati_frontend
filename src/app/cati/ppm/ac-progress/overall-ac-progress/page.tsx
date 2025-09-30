'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import { Download, CreditCard } from 'lucide-react';

// Interfaces
interface ACProgressData {
  id: number;
  acName: string;
  acCode: string;
  totalNumbers: number;
  numberAssigned: number;
  numberPending: number;
  numberExhausted: number;
  successfulInterviews: number;
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  pickedAndRefused: number;
  dataAvailable: number;
  dataInFile: number;
}

const OverallACProgressPage = () => {
  // Sample data for AC Progress
  const [acProgressData] = useState<ACProgressData[]>([
    {
      id: 1,
      acName: 'Alipurduars',
      acCode: '12',
      totalNumbers: 4250,
      numberAssigned: 4208,
      numberPending: 0,
      numberExhausted: 4208,
      successfulInterviews: 893,
      numberDoesNotExist: 794,
      respondentDidNotPick: 160,
      pickedAndRefused: 2265,
      dataAvailable: 77,
      dataInFile: 0,
    },
    {
      id: 2,
      acName: 'Amdanga',
      acCode: '102',
      totalNumbers: 5927,
      numberAssigned: 5578,
      numberPending: 0,
      numberExhausted: 5578,
      successfulInterviews: 1097,
      numberDoesNotExist: 858,
      respondentDidNotPick: 753,
      pickedAndRefused: 2748,
      dataAvailable: 0,
      dataInFile: 0,
    },
    {
      id: 3,
      acName: 'Amta',
      acCode: '181',
      totalNumbers: 6203,
      numberAssigned: 5647,
      numberPending: 0,
      numberExhausted: 5647,
      successfulInterviews: 1106,
      numberDoesNotExist: 921,
      respondentDidNotPick: 669,
      pickedAndRefused: 2818,
      dataAvailable: 273,
      dataInFile: 0,
    },
  ]);

  // Performance metrics data
  const numberSummaryMetrics = {
    totalNumbers: 1887219,
    numberAssigned: 1555036,
    numberPending: 0,
    numberExhausted: 1555036,
  };

  const callOutcomeMetrics = {
    numberDoesNotExist: 204234,
    respondentDidNotPick: 149537,
    pickedAndRefused: 675214,
    successfulInterviews: 300354,
  };

  const handleDownload = () => {
    console.log('Download AC Progress data');
  };

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Overall AC Progress
        </Heading>
      </div>

      {/* Performance Metrics Cards */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Number Summary */}
          <div>
            <div className="mb-4">
              <Heading level={3} className="text-lg font-semibold text-gray-900">
                Number Summary
              </Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Numbers */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Total Numbers</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.totalNumbers.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Number Assigned */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Assigned</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.numberAssigned.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Number Pending */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Pending</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.numberPending.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Number Exhausted */}
              <div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Exhausted</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.numberExhausted.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call Outcome */}
          <div>
            <div className="mb-4">
              <Heading level={3} className="text-lg font-semibold text-gray-900">
                Call Outcome
              </Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number Does Not Exist */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Does Not Exist</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.numberDoesNotExist.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Respondent Did Not Pick */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Respondent Did Not Pick</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.respondentDidNotPick.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Picked And Refused */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Picked And Refused</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.pickedAndRefused.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Successful Interviews */}
              <div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Successful Interviews</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.successfulInterviews.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Master AC Progress Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading level={2} className="text-xl font-semibold text-gray-900">
            Master AC Progress
          </Heading>
          <button 
            onClick={handleDownload}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Name</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">AC Code</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Total Numbers</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number Assigned</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number Pending</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number Exhausted</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Successful Interviews</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number does not exist</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Respondent did not pick</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Picked and Refused</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Data Available</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Data in File</th>
              </tr>
            </thead>
            <tbody>
              {acProgressData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.acName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.acCode}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalNumbers.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberAssigned.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberPending.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberExhausted.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.successfulInterviews.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberDoesNotExist.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.respondentDidNotPick.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.pickedAndRefused.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.dataAvailable.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.dataInFile.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">1</span> - <span className="font-semibold">{acProgressData.length}</span> of <span className="font-semibold">{acProgressData.length}</span> results
        </div>
      </Card>
    </FluidContainer>
  );
};

export default OverallACProgressPage;
