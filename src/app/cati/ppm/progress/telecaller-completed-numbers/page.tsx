'use client';

import React, { useEffect, useState, ChangeEvent, ReactNode } from 'react';
import { Search , Download} from 'lucide-react';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Eye } from 'lucide-react';

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


const telecallerOptions = [
    { value: 'ravi', label: 'Ravi' },
    { value: 'anita', label: 'Anita' },
    { value: 'mohit', label: 'Mohit' },
  ];
  
  const callDateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
  ];
  
  const callOutcomeOptions = [
    { value: 'success', label: 'Success' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'partial submission', label: 'Partial Submission' },
  ];
  
  const talkDurationOptions = [
    { value: 'short', label: '< 2 mins' },
    { value: 'medium', label: '2–5 mins' },
    { value: 'long', label: '> 5 mins' },
  ];
  
  const stateOptions = [
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'uttar pradesh', label: 'Uttar Pradesh' },
  ];

  export const TABLE_DUMMY_DATA = [
    {
      id: 1,
      webServerId: 'WEB-5001',
      formName: 'Customer Feedback Survey',
      serverId: 'SRV-9001',
      telecaller: 'Ravi Kumar',
      telecallerId: 'TC-101',
      state: 'Karnataka',
      callDate: '2025-01-05 10:30 AM',
      respondentName: 'Anil Sharma',
      status: 'Completed',
      talkDuration: '04:25',
      response: 'Interested',
      edit: 'View',
    },
    {
      id: 2,
      webServerId: 'WEB-5002',
      formName: 'Health Awareness Program',
      serverId: 'SRV-9002',
      telecaller: 'Neha Verma',
      telecallerId: 'TC-102',
      state: 'Maharashtra',
      callDate: '2025-01-05 01:15 PM',
      respondentName: 'Sunita Patil',
      status: 'Completed',
      talkDuration: '03:10',
      response: 'Form Filled',
      edit: 'View',
    },
    {
      id: 3,
      webServerId: 'WEB-5003',
      formName: 'Employment Registration',
      serverId: 'SRV-9003',
      telecaller: 'Amit Singh',
      telecallerId: 'TC-103',
      state: 'Uttar Pradesh',
      callDate: '2025-01-06 11:05 AM',
      respondentName: 'Rakesh Verma',
      status: 'In Progress',
      talkDuration: '02:40',
      response: 'Callback Requested',
      edit: 'View',
    },
    {
      id: 4,
      webServerId: 'WEB-5004',
      formName: 'Product Feedback',
      serverId: 'SRV-9004',
      telecaller: 'Pooja Mehta',
      telecallerId: 'TC-104',
      state: 'Gujarat',
      callDate: '2025-01-06 04:20 PM',
      respondentName: 'Kunal Shah',
      status: 'Rejected',
      talkDuration: '01:15',
      response: 'Not Interested',
      edit: 'View',
    },
    {
      id: 5,
      webServerId: 'WEB-5005',
      formName: 'Service Quality Check',
      serverId: 'SRV-9005',
      telecaller: 'Rahul Joshi',
      telecallerId: 'TC-105',
      state: 'Rajasthan',
      callDate: '2025-01-07 09:50 AM',
      respondentName: 'Mahesh Kumar',
      status: 'Completed',
      talkDuration: '05:05',
      response: 'Satisfied',
      edit: 'View',
    },
  ];
  
  

/* ============================================================
   MAIN COMPONENT
============================================================ */
  

const TelecallerCompletedNumbers = () => {
    const [filters, setFilters] = useState({
        serverId: '',
        telecaller: '',
        phone: '',
        callDate: '',
        callOutcome: '',
        talkDuration: '',
        state: '',
      });
      
      const handleChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

  return (
    <Container maxWidth="full" className="py-6 space-y-6">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white"> 
        Completed Numbers
      </Heading>

      {/* FILTER CARD */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">

            {/* Server ID */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Server ID</label>
            <Input
                placeholder="Search by Server ID"
                value={filters.serverId}
                onChange={e => handleChange('serverId', e.target.value)}
            />
            </div>

            {/* Telecaller */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Telecaller</label>
            <SelectDropdown
                value={filters.telecaller}
                options={telecallerOptions}
                onChange={v => handleChange('telecaller', v as string)}
            />
            </div>

            {/* Phone */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Phone</label>
            <Input
                placeholder="Phone Number"
                value={filters.phone}
                onChange={e => handleChange('phone', e.target.value)}
            />
            </div>

            {/* Call Date */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Call Date</label>
            <SelectDropdown
                value={filters.callDate}
                options={callDateOptions}
                onChange={v => handleChange('callDate', v as string)}
            />
            </div>

            {/* Call Outcome */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Call Outcome</label>
            <SelectDropdown
                value={filters.callOutcome}
                options={callOutcomeOptions}
                onChange={v => handleChange('callOutcome', v as string)}
            />
            </div>

            {/* Talk Duration */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">Talk Duration</label>
            <SelectDropdown
                value={filters.talkDuration}
                options={talkDurationOptions}
                onChange={v => handleChange('talkDuration', v as string)}
            />
            </div>

            {/* State */}
            <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium mb-2 block">State</label>
            <SelectDropdown
                value={filters.state}
                options={stateOptions}
                onChange={v => handleChange('state', v as string)}
            />
            </div>

            {/* Search Button */}
            <Button onClick={() => console.log(filters)}>
            <Search className="w-4 h-4 mr-2" />
            Search
            </Button>

        </div>
      </Card>

      {/* TABLE CARD */}
      <Card>
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
                <div className="w-1 h-6 bg-yellow-600 mr-3"></div>
                <div>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                    Completed Numbers
                </Heading>
                </div>
            </div>
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
                             Web Server ID
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Form Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Server ID
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Tellecaller
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Tellecaller ID
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            State
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Call Date
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Respondent Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Status
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Talk Duration
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Response
                            </th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-200">
                            Edit
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {TABLE_DUMMY_DATA.map((row, index) => (
                            <tr key={row.id} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{row.webServerId}</td>
                            <td className="px-4 py-2">{row.formName}</td>
                            <td className="px-4 py-2">{row.serverId}</td>
                            <td className="px-4 py-2">{row.telecaller}</td>
                            <td className="px-4 py-2">{row.telecallerId}</td>
                            <td className="px-4 py-2">{row.state}</td>
                            <td className="px-4 py-2">{row.callDate}</td>
                            <td className="px-4 py-2">{row.respondentName}</td>
                            <td className="px-4 py-2">{row.status}</td>
                            <td className="px-4 py-2">{row.talkDuration}</td>
                            <td className="px-4 py-2">{row.response}</td>
                            <td className="px-4 py-2 text-center">
                                <button
                                    className="bg-blue-500 text-white h-6 w-7 flex items-center justify-center cursor-pointer rounded-sm"
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

export default TelecallerCompletedNumbers;
