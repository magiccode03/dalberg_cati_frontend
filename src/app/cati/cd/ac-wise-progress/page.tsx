'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { MetricCard } from '@/components/ui/MetricCard';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { CreditCard, Users, Phone, PhoneOff, CheckCircle } from 'lucide-react';

interface ACData {
  id: number;
  acName: string;
  acCode: number;
  totalNumbers: string;
  numberAssigned: string;
  numberPending: string;
  numberExhausted: string;
  successfulInterviews: string;
  numberDoesNotExist: string;
  respondentDidNotPick: string;
  pickedAndRefused: string;
}

export default function ACWiseProgressPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sample data for AC Wise Progress
  const acData: ACData[] = [
    {
      id: 1,
      acName: 'Alipurduars',
      acCode: 12,
      totalNumbers: '4,250',
      numberAssigned: '4,208',
      numberPending: '0',
      numberExhausted: '4,208',
      successfulInterviews: '893',
      numberDoesNotExist: '794',
      respondentDidNotPick: '160',
      pickedAndRefused: '2,265'
    },
    {
      id: 2,
      acName: 'Amdanga',
      acCode: 102,
      totalNumbers: '5,927',
      numberAssigned: '5,578',
      numberPending: '0',
      numberExhausted: '5,578',
      successfulInterviews: '1,097',
      numberDoesNotExist: '858',
      respondentDidNotPick: '753',
      pickedAndRefused: '2,748'
    },
    {
      id: 3,
      acName: 'Amta',
      acCode: 181,
      totalNumbers: '6,203',
      numberAssigned: '5,647',
      numberPending: '0',
      numberExhausted: '5,647',
      successfulInterviews: '1,106',
      numberDoesNotExist: '921',
      respondentDidNotPick: '669',
      pickedAndRefused: '2,818'
    },
    {
      id: 4,
      acName: 'Arambag',
      acCode: 200,
      totalNumbers: '5,564',
      numberAssigned: '5,151',
      numberPending: '0',
      numberExhausted: '5,151',
      successfulInterviews: '1,038',
      numberDoesNotExist: '883',
      respondentDidNotPick: '494',
      pickedAndRefused: '2,715'
    },
    {
      id: 5,
      acName: 'Asansol Dakshin',
      acCode: 280,
      totalNumbers: '6,579',
      numberAssigned: '5,467',
      numberPending: '0',
      numberExhausted: '5,467',
      successfulInterviews: '932',
      numberDoesNotExist: '2',
      respondentDidNotPick: '16',
      pickedAndRefused: '932'
    },
    {
      id: 6,
      acName: 'Asansol Uttar',
      acCode: 281,
      totalNumbers: '7,681',
      numberAssigned: '5,840',
      numberPending: '0',
      numberExhausted: '5,840',
      successfulInterviews: '834',
      numberDoesNotExist: '2',
      respondentDidNotPick: '28',
      pickedAndRefused: '842'
    },
    {
      id: 7,
      acName: 'Ashoknagar',
      acCode: 101,
      totalNumbers: '8,896',
      numberAssigned: '8,464',
      numberPending: '0',
      numberExhausted: '8,464',
      successfulInterviews: '1,333',
      numberDoesNotExist: '1,125',
      respondentDidNotPick: '1,211',
      pickedAndRefused: '3,849'
    },
    {
      id: 8,
      acName: 'Ausgram',
      acCode: 273,
      totalNumbers: '6,188',
      numberAssigned: '4,874',
      numberPending: '0',
      numberExhausted: '4,874',
      successfulInterviews: '1,033',
      numberDoesNotExist: '859',
      respondentDidNotPick: '458',
      pickedAndRefused: '2,446'
    },
    {
      id: 9,
      acName: 'Baduria',
      acCode: 99,
      totalNumbers: '7,639',
      numberAssigned: '7,142',
      numberPending: '0',
      numberExhausted: '7,142',
      successfulInterviews: '1,350',
      numberDoesNotExist: '815',
      respondentDidNotPick: '812',
      pickedAndRefused: '3,407'
    },
    {
      id: 10,
      acName: 'Bagda',
      acCode: 94,
      totalNumbers: '6,812',
      numberAssigned: '6,223',
      numberPending: '0',
      numberExhausted: '6,223',
      successfulInterviews: '1,098',
      numberDoesNotExist: '1,009',
      respondentDidNotPick: '1,074',
      pickedAndRefused: '2,803'
    }
  ];

  // Summary data
  const summaryData = {
    totalNumbers: '18,87,219',
    numberAssigned: '15,55,036',
    numberPending: '0',
    numberExhausted: '15,55,036',
    numberDoesNotExist: '2,04,234',
    respondentDidNotPick: '1,49,537',
    pickedAndRefused: '6,75,214',
    successfulInterviews: '3,00,354'
  };

  // Calculate pagination
  const totalPages = Math.ceil(acData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = acData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tableColumns = [
    { key: 'id', label: '#', width: '60px' },
    { key: 'acName', label: 'AC Name', width: '200px' },
    { key: 'acCode', label: 'AC Code', width: '100px' },
    { key: 'totalNumbers', label: 'Total Numbers', width: '150px' },
    { key: 'numberAssigned', label: 'Number Assigned', width: '150px' },
    { key: 'numberPending', label: 'Number Pending', width: '150px' },
    { key: 'numberExhausted', label: 'Number Exhausted', width: '150px' },
    { key: 'successfulInterviews', label: 'Successful Interviews', width: '150px' },
    { key: 'numberDoesNotExist', label: 'Number does not exist', width: '150px' },
    { key: 'respondentDidNotPick', label: 'Respondent did not pick', width: '150px' },
    { key: 'pickedAndRefused', label: 'Picked and Refused', width: '150px' }
  ];

  return (
    <Container className="py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
          AC Wise Progress - Overall : State Survey
        </Heading>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Number Summary */}
        <Card className="p-6">
          <div className="mb-6">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
              Number Summary
            </Heading>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 border-r border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Numbers
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.totalNumbers}
                </Text>
              </div>
            </div>

            <div className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Number Assigned
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.numberAssigned}
                </Text>
              </div>
            </div>

            <div className="flex items-center p-4 border-r border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Number Pending
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.numberPending}
                </Text>
              </div>
            </div>

            <div className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Number Exhausted
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.numberExhausted}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Call Outcome */}
        <Card className="p-6">
          <div className="mb-6">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white relative">
              Call Outcome
              <div className="absolute -left-2 top-0 w-1 h-6 bg-[#356b59]"></div>
            </Heading>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <PhoneOff className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Number Does Not Exist
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.numberDoesNotExist}
                </Text>
              </div>
            </div>

            <div className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <PhoneOff className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Respondent Did Not Pick
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.respondentDidNotPick}
                </Text>
              </div>
            </div>

            <div className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <PhoneOff className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Picked And Refused
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.pickedAndRefused}
                </Text>
              </div>
            </div>

            <div className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Successful Interviews
                </Text>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.successfulInterviews}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table
            columns={tableColumns}
            data={currentData}
            className="min-w-full"
          />
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, acData.length)}</span> of <span className="font-semibold">{acData.length}</span> results
          </Text>
          
          <PaginationStandard
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={acData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </Container>
  );
}
