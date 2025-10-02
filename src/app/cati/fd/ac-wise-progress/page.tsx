'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import DataTable from '@/components/tables/DataTable';
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
  const itemsPerPage = 20;

  // Custom MetricCard component
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
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



  const tableColumns = [
    { key: 'id' as keyof ACData, label: '#', width: '60px' },
    { key: 'acName' as keyof ACData, label: 'AC Name', width: '200px' },
    { key: 'acCode' as keyof ACData, label: 'AC Code', width: '100px' },
    { key: 'totalNumbers' as keyof ACData, label: 'Total Numbers', width: '150px' },
    { key: 'numberAssigned' as keyof ACData, label: 'Number Assigned', width: '150px' },
    { key: 'numberPending' as keyof ACData, label: 'Number Pending', width: '150px' },
    { key: 'numberExhausted' as keyof ACData, label: 'Number Exhausted', width: '150px' },
    { key: 'successfulInterviews' as keyof ACData, label: 'Successful Interviews', width: '150px' },
    { key: 'numberDoesNotExist' as keyof ACData, label: 'Number does not exist', width: '150px' },
    { key: 'respondentDidNotPick' as keyof ACData, label: 'Respondent did not pick', width: '150px' },
    { key: 'pickedAndRefused' as keyof ACData, label: 'Picked and Refused', width: '150px' }
  ];

  return (
    <Container maxWidth="full">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
            AC Wise Progress - Overall : State Survey
          </Heading>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
        {/* Number Summary */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <Heading level={3} className="text-base font-semibold text-gray-900 dark:text-white">
              NUMBER SUMMARY
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={CreditCard}
              title="Total Numbers"
              value={summaryData.totalNumbers}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={CreditCard}
              title="Number Assigned"
              value={summaryData.numberAssigned}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={CreditCard}
              title="Number Pending"
              value={summaryData.numberPending}
              bgColor="bg-blue-500"
            />
            <MetricCard
              icon={CreditCard}
              title="Number Exhausted"
              value={summaryData.numberExhausted}
              bgColor="bg-blue-500"
            />
          </div>
        </Card>

        {/* Call Outcome */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-green-500 mr-3"></div>
            <Heading level={3} className="text-base font-semibold text-gray-900 dark:text-white">
              CALL OUTCOME
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={PhoneOff}
              title="Number does not exist"
              value={summaryData.numberDoesNotExist}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Respondent did not pick"
              value={summaryData.respondentDidNotPick}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={PhoneOff}
              title="Picked and Refused"
              value={summaryData.pickedAndRefused}
              bgColor="bg-green-500"
            />
            <MetricCard
              icon={CheckCircle}
              title="Successful Interviews"
              value={summaryData.successfulInterviews}
              bgColor="bg-green-500"
            />
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <DataTable
          data={acData}
          columns={tableColumns}
          pagination={true}
          pageSize={itemsPerPage}
          searchable={false}
          sortable={true}
        />
      </Card>
    </Container>
  );
}
