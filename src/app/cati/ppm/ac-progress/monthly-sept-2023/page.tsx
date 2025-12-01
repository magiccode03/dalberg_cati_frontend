'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Users, Clock, PhoneCall, PhoneOff, CheckCircle, CreditCard } from 'lucide-react';

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
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

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

  // Pagination calculations
  const totalItems = monthlyACProgressData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = monthlyACProgressData.slice(startIndex, endIndex);

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    bgColor = 'bg-blue-500',
    iconColor = 'text-white'
  }: {
    icon: any;
    title: string;
    value: string | number;
    bgColor?: string;
    iconColor?: string;
  }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Monthly: Sept 2023
        </Heading>
      </div>

      {/* Call Outcome Metrics */}
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">
              Call Outcome
            </Heading>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={CreditCard}
            title="Number Assigned"
            value={callOutcomeMetrics.numberAssigned.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={Clock}
            title="Number Pending"
            value={callOutcomeMetrics.numberPending.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={PhoneOff}
            title="Total Number Exhausted"
            value={callOutcomeMetrics.totalNumberExhausted.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={PhoneOff}
            title="Number Does Not Exist"
            value={callOutcomeMetrics.numberDoesNotExist.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={PhoneOff}
            title="Respondent Did Not Pick"
            value={callOutcomeMetrics.respondentDidNotPick.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={PhoneOff}
            title="Picked And Refused"
            value={callOutcomeMetrics.pickedAndRefused.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={PhoneCall}
            title="Call Continue"
            value={callOutcomeMetrics.callContinue.toLocaleString()}
            bgColor="bg-green-500"
          />
          <MetricCard
            icon={CheckCircle}
            title="Successful Interviews"
            value={callOutcomeMetrics.successfulInterviews.toLocaleString()}
            bgColor="bg-green-500"
          />
        </div>
      </Card>

      {/* September 2023 Month Progress Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Sept 2023 Month Progress
            </Heading>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">AC Name</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">Total Numbers</th>
                  <th className="text-center">Number Assigned</th>
                  <th className="text-center">Number Pending</th>
                  <th className="text-center">Number Exhausted</th>
                  <th className="text-center">Successful Interviews</th>
                  <th className="text-center">Call Continue</th>
                  <th className="text-center">Number does not exist</th>
                  <th className="text-center">Respondent did not pick</th>
                  <th className="text-center">Picked and Refused</th>
                  <th className="text-center">Total Callers</th>
                  <th className="text-center">Total Call Dials</th>
                  <th className="text-center">Total Days</th>
                  <th className="text-center">Data Available</th>
                  <th className="text-center">Data in File</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-left">{item.acName}</td>
                    <td className="text-center">{item.acCode}</td>
                    <td className="text-center">{item.totalNumbers.toLocaleString()}</td>
                    <td className="text-center">{item.numberAssigned.toLocaleString()}</td>
                    <td className="text-center">{item.numberPending.toLocaleString()}</td>
                    <td className="text-center">{item.numberExhausted.toLocaleString()}</td>
                    <td className="text-center">{item.successfulInterviews.toLocaleString()}</td>
                    <td className="text-center">{item.callContinue.toLocaleString()}</td>
                    <td className="text-center">{item.numberDoesNotExist.toLocaleString()}</td>
                    <td className="text-center">{item.respondentDidNotPick.toLocaleString()}</td>
                    <td className="text-center">{item.pickedAndRefused.toLocaleString()}</td>
                    <td className="text-center">{item.totalCallers.toLocaleString()}</td>
                    <td className="text-center">{item.totalCallDials.toLocaleString()}</td>
                    <td className="text-center">{item.totalDays.toLocaleString()}</td>
                    <td className="text-center">{item.dataAvailable.toLocaleString()}</td>
                    <td className="text-center">{item.dataInFile.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default MonthlySept2023Page;
