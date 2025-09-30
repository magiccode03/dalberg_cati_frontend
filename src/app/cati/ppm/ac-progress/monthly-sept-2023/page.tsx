'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import { Download, CreditCard } from 'lucide-react';

// Interfaces
interface MonthlyACProgressData {
  id: number;
  acName: string;
  acCode: string;
  totalNumbers: number;
  numberAssigned: number;
  numberPending: number;
  numberExhausted: number;
  successfulInterviews: number;
  callContinue: number;
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  pickedAndRefused: number;
  totalCallers: number;
  totalCallDials: number;
  totalDays: number;
  dataAvailable: number;
  dataInFile: number;
}

const MonthlySept2023Page = () => {
  // Sample data for September 2023 AC Progress
  const [monthlyACProgressData] = useState<MonthlyACProgressData[]>([
    {
      id: 1,
      acName: 'Alipurduars',
      acCode: '12',
      totalNumbers: 1535,
      numberAssigned: 185,
      numberPending: 13,
      numberExhausted: 172,
      successfulInterviews: 21,
      callContinue: 25,
      numberDoesNotExist: 47,
      respondentDidNotPick: 4,
      pickedAndRefused: 44,
      totalCallers: 51,
      totalCallDials: 244,
      totalDays: 19,
      dataAvailable: 77,
      dataInFile: 0,
    },
    {
      id: 2,
      acName: 'Amdanga',
      acCode: '102',
      totalNumbers: 1664,
      numberAssigned: 195,
      numberPending: 13,
      numberExhausted: 182,
      successfulInterviews: 24,
      callContinue: 33,
      numberDoesNotExist: 40,
      respondentDidNotPick: 10,
      pickedAndRefused: 49,
      totalCallers: 53,
      totalCallDials: 285,
      totalDays: 19,
      dataAvailable: 0,
      dataInFile: 0,
    },
    {
      id: 3,
      acName: 'Amta',
      acCode: '181',
      totalNumbers: 1988,
      numberAssigned: 176,
      numberPending: 6,
      numberExhausted: 170,
      successfulInterviews: 27,
      callContinue: 32,
      numberDoesNotExist: 40,
      respondentDidNotPick: 2,
      pickedAndRefused: 53,
      totalCallers: 50,
      totalCallDials: 231,
      totalDays: 18,
      dataAvailable: 273,
      dataInFile: 0,
    },
    {
      id: 4,
      acName: 'Arambag',
      acCode: '200',
      totalNumbers: 2204,
      numberAssigned: 195,
      numberPending: 12,
      numberExhausted: 183,
      successfulInterviews: 24,
      callContinue: 29,
      numberDoesNotExist: 40,
      respondentDidNotPick: 8,
      pickedAndRefused: 61,
      totalCallers: 55,
      totalCallDials: 278,
      totalDays: 19,
      dataAvailable: 0,
      dataInFile: 0,
    },
  ]);

  // Call outcome metrics for September 2023
  const callOutcomeMetrics = {
    numberAssigned: 58587,
    numberPending: 5857,
    totalNumberExhausted: 52730,
    numberDoesNotExist: 12136,
    respondentDidNotPick: 1445,
    pickedAndRefused: 14139,
    callContinue: 10091,
    successfulInterviews: 8058,
  };

  const handleDownload = () => {
    console.log('Download September 2023 progress data');
  };

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Monthly: Sept 2023
        </Heading>
      </div>

      {/* Call Outcome Metrics */}
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={3} className="text-lg font-semibold text-gray-900">
              Call Outcome
            </Heading>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Number Assigned */}
          <div className="border-r border-gray-200 pr-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 mb-1">Number Assigned</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {callOutcomeMetrics.numberAssigned.toLocaleString()}
                </Text>
              </div>
            </div>
          </div>

          {/* Number Pending */}
          <div className="border-r border-gray-200 pr-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 mb-1">Number Pending</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {callOutcomeMetrics.numberPending.toLocaleString()}
                </Text>
              </div>
            </div>
          </div>

          {/* Total Number Exhausted */}
          <div className="border-r border-gray-200 pr-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 mb-1">Total Number Exhausted</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {callOutcomeMetrics.totalNumberExhausted.toLocaleString()}
                </Text>
              </div>
            </div>
          </div>

          {/* Number Does Not Exist */}
          <div>
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

          {/* Call Continue */}
          <div className="border-r border-gray-200 pr-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 mb-1">Call Continue</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {callOutcomeMetrics.callContinue.toLocaleString()}
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
      </Card>

      {/* September 2023 Month Progress Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={2} className="text-xl font-semibold text-gray-900">
              Sept 2023 Month Progress
            </Heading>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Call Continue</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number does not exist</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Respondent did not pick</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Picked and Refused</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Total Callers</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Total Call Dials</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Total Days</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Data Available</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Data in File</th>
              </tr>
            </thead>
            <tbody>
              {monthlyACProgressData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.acName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.acCode}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalNumbers.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberAssigned.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberPending.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberExhausted.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.successfulInterviews.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.callContinue.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberDoesNotExist.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.respondentDidNotPick.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.pickedAndRefused.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalCallers.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalCallDials.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.totalDays.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.dataAvailable.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.dataInFile.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">1</span> - <span className="font-semibold">{monthlyACProgressData.length}</span> of <span className="font-semibold">{monthlyACProgressData.length}</span> results
        </div>
      </Card>
    </FluidContainer>
  );
};

export default MonthlySept2023Page;
