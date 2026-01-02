'use client';

import React, { useEffect, useState, ChangeEvent, ReactNode } from 'react';
import { Search , Download} from 'lucide-react';
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

export const TABLE_DUMMY_DATA = [
    {
      serverId: "SRV-1001",
      formName: "Customer Satisfaction Survey",
      respondentName: "Ravi Kumar",
      state: "Karnataka",
      attempt1DateTime: "2025-01-02 10:15 AM",
      attempt1Outcome: "No Answer",
      attempt2DateTime: "2025-01-02 02:30 PM",
      attempt2Outcome: "Call Dropped",
      attempt3DateTime: "2025-01-03 11:10 AM",
      attempt3Outcome: "Interested",
      attempt4DateTime: "2025-01-03 04:45 PM",
      attempt4Outcome: "Form Filled",
      finalOutcome: "Success",
    },
    {
      serverId: "SRV-1002",
      formName: "Health Awareness Form",
      respondentName: "Anita Sharma",
      state: "Maharashtra",
      attempt1DateTime: "2025-01-01 09:20 AM",
      attempt1Outcome: "Busy",
      attempt2DateTime: "2025-01-01 01:05 PM",
      attempt2Outcome: "No Answer",
      attempt3DateTime: "2025-01-02 10:40 AM",
      attempt3Outcome: "Rejected",
      attempt4DateTime: "-",
      attempt4Outcome: "-",
      finalOutcome: "Rejected",
    },
    {
      serverId: "SRV-1003",
      formName: "Employment Registration",
      respondentName: "Mohit Verma",
      state: "Uttar Pradesh",
      attempt1DateTime: "2025-01-03 11:00 AM",
      attempt1Outcome: "Interested",
      attempt2DateTime: "2025-01-03 03:15 PM",
      attempt2Outcome: "Rescheduled",
      attempt3DateTime: "2025-01-04 12:00 PM",
      attempt3Outcome: "Form Partially Filled",
      attempt4DateTime: "2025-01-04 05:30 PM",
      attempt4Outcome: "Completed",
      finalOutcome: "Partial Submission",
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
  

const CallOutcomeTracker = () => {
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

          <Button
            variant="orange"
            onClick={() => {}}

            className="flex items-center gap-2 cursor-not-allowed opacity-80 "
            >
            <span className="hidden sm:inline">View</span>
          </Button>

        </div>
      </Card>

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
            <span className="hidden sm:inline">Download Overall Data</span>
            </Button>
        </div>
        <div className="overflow-x-auto">
            <div className="table-responsive">
                <Table className="table table-bordered table-striped table-hover">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Server Id
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Form Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Respondent Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            State
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Attempt 1 Date And Time
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Outcome
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Attempt 2 Date And Time
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Outcome
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Attempt 3 Date And Time
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Outcome
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Attempt 4 Date And Time
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Outcome
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Final Outcome
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {TABLE_DUMMY_DATA.map((row, index) => (
                            <tr key={index} className="border-t">
                            <td className="px-4 py-2">{row.serverId}</td>
                            <td className="px-4 py-2">{row.formName}</td>
                            <td className="px-4 py-2">{row.respondentName}</td>
                            <td className="px-4 py-2">{row.state}</td>

                            <td className="px-4 py-2">{row.attempt1DateTime}</td>
                            <td className="px-4 py-2">{row.attempt1Outcome}</td>

                            <td className="px-4 py-2">{row.attempt2DateTime}</td>
                            <td className="px-4 py-2">{row.attempt2Outcome}</td>

                            <td className="px-4 py-2">{row.attempt3DateTime}</td>
                            <td className="px-4 py-2">{row.attempt3Outcome}</td>

                            <td className="px-4 py-2">{row.attempt4DateTime}</td>
                            <td className="px-4 py-2">{row.attempt4Outcome}</td>

                            <td className="px-4 py-2 font-semibold">
                                {row.finalOutcome}
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

export default CallOutcomeTracker;
