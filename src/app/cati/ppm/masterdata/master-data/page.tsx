'use client';

import React, { useEffect, useState, ChangeEvent, ReactNode } from 'react';
import { Search , Download, Eye} from 'lucide-react';
import TraderOutcomeMetrics from '@/components/trader/TraderOutcomeMetrics';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';

/* ============================================================
   TYPES
============================================================ */

type MaxWidth = '7xl' | '6xl' | 'full';

interface SelectOption {
  value: string;
  label: string;
}

interface TableRow {
  serverId: number;
  formName: string;
  respondentName: string;
  finalOutcome: string;
}

/* ============================================================
   UI COMPONENTS
============================================================ */

const Container = ({
  children,
  maxWidth = '7xl',
  className = '',
}: {
  children: ReactNode;
  maxWidth?: MaxWidth;
  className?: string;
}) => {
  const widths: Record<MaxWidth, string> = {
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className={`${widths[maxWidth]} mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};


/* ============================================================
   DUMMY DATA
============================================================ */


const formNameOptions: SelectOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'custom', label: 'Custom Range' },
];


const statusOptions: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const callbackOptions: SelectOption[] = [
  { value: 'g1', label: 'Group 1' },
  { value: 'g2', label: 'Group 2' },
];

const stateOptions: SelectOption[] = [
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
];

export const WEBFORM_TABLE_DATA = [
    {
      id: 1,
      serverId: 'SRV-10234',
      webFormName: 'Voter Survey 2024',
      contactNumber: '9876543210',
      languageCode: 'EN',
      respondentName: 'Ramesh Kumar',
      state: 'Uttar Pradesh',
      status: 'Completed',
      response: '',
    },
    {
      id: 2,
      serverId: 'SRV-10235',
      webFormName: 'Health Feedback',
      contactNumber: '9123456789',
      languageCode: 'HI',
      respondentName: 'Sunita Verma',
      state: 'Madhya Pradesh',
      status: 'Pending',
      response: '',
    },
    {
      id: 3,
      serverId: 'SRV-10236',
      webFormName: 'Education Poll',
      contactNumber: '9988776655',
      languageCode: 'EN',
      respondentName: 'Amit Sharma',
      state: 'Rajasthan',
      status: 'In Progress',
      response: '',
    },
    {
      id: 4,
      serverId: 'SRV-10237',
      webFormName: 'Employment Survey',
      contactNumber: '9012345678',
      languageCode: 'MR',
      respondentName: 'Pooja Patil',
      state: 'Maharashtra',
      status: 'Completed',
      response: '',
    },
    {
      id: 5,
      serverId: 'SRV-10238',
      webFormName: 'Public Opinion',
      contactNumber: '8899776655',
      languageCode: 'TA',
      respondentName: 'Karthik R',
      state: 'Tamil Nadu',
      status: 'Failed',
      response: '',
    },
    {
      id: 6,
      serverId: 'SRV-10239',
      webFormName: 'Civic Feedback',
      contactNumber: '9345612780',
      languageCode: 'BN',
      respondentName: 'Ananya Das',
      state: 'West Bengal',
      status: 'Pending',
      response: '',
    },
    {
      id: 7,
      serverId: 'SRV-10240',
      webFormName: 'Urban Survey',
      contactNumber: '8765432109',
      languageCode: 'EN',
      respondentName: 'Rahul Mehta',
      state: 'Gujarat',
      status: 'Completed',
      response: '',
    },
    {
      id: 8,
      serverId: 'SRV-10241',
      webFormName: 'Rural Development',
      contactNumber: '9098765432',
      languageCode: 'HI',
      respondentName: 'Suresh Yadav',
      state: 'Bihar',
      status: 'In Progress',
      response: '',
    },
  ];
  
  


const dummyTraderOutcomeMetrics = {
    call_status: {
        total_numbers: 7529,
        pending_for_calls: 91,
        number_exhausted: 3401,
        into_form_filling: 635,
        reschedule_interview: 162,
        waiting_for_callback: 972,
        call_droped: 1520,
        partial_submission: 485,
        reject_interview:263,
        success:2309,
    },
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
  

const MasterData = () => {
  const [filters, setFilters] = useState({
    acCode: '',
    callingDates: '',
    customDateFrom: '',
    customDateTo: '',
    telecaller: '',
    group: '',
    status: '',
    outcome: '',
  });

  const handleChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Container maxWidth="full" className="py-6 space-y-6">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white"> 
        Call Outcome Tracker
      </Heading>

      {/* FILTER CARD */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">

          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Server ID</label>
            <Input placeholder='Search by Server ID'/>
          </div>

          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Form Name</label>
            <SelectDropdown
              value={filters.callingDates}
              options={formNameOptions}
              onChange={(v) => handleChange('callingDates', v as string)}
            />
          </div>

          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Phone</label>
            <Input placeholder='Phone Number'/>
          </div>

          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <SelectDropdown
              value={filters.group}
              options={statusOptions}
              onChange={(v) => handleChange('group', v as string)}
            />
          </div>

          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Callback Attempt</label>
            <SelectDropdown
              value={filters.status}
              options={callbackOptions}
              onChange={(v) => handleChange('status', v as string)}
            />
          </div>

          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">State</label>
            <SelectDropdown
              value={filters.outcome}
              options={stateOptions}
              onChange={(v) => handleChange('outcome', v as string)}
            />
          </div>

          <Button onClick={() => console.log(filters)}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>

        </div>
      </Card>

        <Button
            variant="orange"
            onClick={() => {}}

            className="flex items-center gap-2 cursor-not-allowed opacity-80 "
            >
            <span className="hidden sm:inline">View</span>
        </Button>

      {/* Metrics Card */}
      <TraderOutcomeMetrics
      data={dummyTraderOutcomeMetrics}
      loading={false}
      error={null}
      />

      {/* TABLE CARD */}
      <Card>
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
                <div className="w-1 h-6 bg-yellow-600 mr-3"></div>
                <div>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                    Master Data
                </Heading>
                </div>
            </div>

            {/* Download Button */}
            <Button
            variant="primary"
            onClick={() => {}}

            className="flex items-center gap-2 cursor-not-allowed opacity-80"
            >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download Data</span>
            </Button>
        </div>
        <div className="overflow-x-auto">
            <div className="table-responsive">
                <Table className="table table-bordered table-striped table-hover">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            #
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Server Id
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Web Form Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Contact Number
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Language Code
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Respondent Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            State
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Status
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Response
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {WEBFORM_TABLE_DATA.map((row, index) => (
                            <tr key={row.id} className="border-t">
                            {/* # */}
                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                {index + 1}
                            </td>

                            {/* Server Id */}
                            <td className="px-4 py-2 text-sm">
                                {row.serverId}
                            </td>

                            {/* Web Form Name */}
                            <td className="px-4 py-2 text-sm">
                                {row.webFormName}
                            </td>

                            {/* Contact Number */}
                            <td className="px-4 py-2 text-sm">
                                {row.contactNumber}
                            </td>

                            {/* Language Code */}
                            <td className="px-4 py-2 text-sm">
                                {row.languageCode}
                            </td>

                            {/* Respondent Name */}
                            <td className="px-4 py-2 text-sm">
                                {row.respondentName}
                            </td>

                            {/* State */}
                            <td className="px-4 py-2 text-sm">
                                {row.state}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-2 text-sm">
                                {row.status}
                            </td>

                            {/* Response (Eye icon stays same) */}
                            <td className="px-4 py-2 text-center">
                                <button
                                    className="bg-yellow-500 text-white h-6 w-7 flex items-center justify-center cursor-pointer rounded-sm"
                                >
                                    <Eye className="h-5 w-5" />
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>


                </Table>
            </div>
        </div>

        <div className="mt-4">
            <PaginationStandard
                currentPage={1}
                totalItems={100}
                totalPages={10}
                itemsPerPage={10}
                onPageChange={() => {}}
            />
        </div>
      </Card>

    </Container>
  );
};

export default MasterData;
