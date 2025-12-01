'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { Download, Search, X } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';
import Input from '@/components/ui/Input';


export default function CATIACProgressDQMPage() {
    const [callingDates, setCallingDates] = useState<string>('all');
    const [acData, setAcData] = useState<CATIACData[]>([]);
    const [selectedAcCode, setSelectedAcCode] = useState<string>('');
    const [selectedAcName, setSelectedAcName] = useState<string>('');
    const [totalCount, setTotalCount] = useState(0);

    const acOptions = useMemo(() => [
        { value: '', label: 'All ACs' },
        ...acData.map(ac => ({
            value: ac.ac_code.toString(),
            label: `${ac.ac_name} (${ac.ac_code})`
        }))
    ], [acData]);

    const callingDatesOptions = [
        { value: 'all', label: 'All' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'dby', label: 'Day Before Yesterday' },
        { value: 'l3', label: 'Last 3 Days' },
        { value: 'l7', label: 'Last 7 Days' },
        { value: 'l15', label: 'Last 15 Days' },
        { value: 'currentmonth', label: 'Current Month' },
        { value: 'custom', label: 'Custom Date Range' },
    ];


    const handleCallingDatesChange = (value: string | string[]) => {
        const callingDatesValue = Array.isArray(value) ? value[0] : value;
        setCallingDates(callingDatesValue);
    };

    const handleAcChange = (value: string | string[]) => {
        const acCode = Array.isArray(value) ? value[0] : value;
        setSelectedAcCode(acCode);
    };

    const handleAcNameChange = (value: string | string[]) => {
        const acName = Array.isArray(value) ? value[0] : value;
        setSelectedAcName(acName);
    };


    return (
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
            <Heading level={2} className="text-2xl font-semibold mb-6">
                AC-Wise Report
            </Heading>

            {/* Search Filter */}
            <Card className="mb-5">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                AC Name
                            </label>
                            <SelectDropdown
                                options={acOptions}
                                value={selectedAcName}
                                onChange={handleAcNameChange}
                                className="w-full"
                                placeholder="Select AC Name"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                AC Code
                            </label>
                            <SelectDropdown
                                options={acOptions}
                                value={selectedAcCode}
                                onChange={handleAcChange}
                                className="w-full"
                                placeholder="Select AC Code"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Calling Dates
                            </label>
                            <SelectDropdown
                                options={callingDatesOptions}
                                value={callingDates}
                                onChange={handleCallingDatesChange}
                                className="w-full"
                                placeholder="Select Date Range"
                                searchable={false}
                                clearable={true}
                            />
                        </div>
                    </div>
                    {callingDates === 'custom' && (
                        <>
                            <div className="col-span-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        From Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        // value={fromDate}
                                        // onChange={handleFromDateChange}
                                        placeholder="Select From Date"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        To Date <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        // value={toDate}
                                        // onChange={handleToDateChange}
                                        placeholder="Select To Date"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex gap-3">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0">
                                Action
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    //   onClick={handleSearch}
                                    //   disabled={loading}
                                    className="flex-1"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                                <Button
                                    // onClick={handleClear}
                                    className="bg-gray-500 text-white hover:bg-gray-600 flex items-center"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/*        "completed_interview": 1500,
        "terminated_interview": 3907,
        "incomplete_interview": 4368,
        "ineligible_interview": 692, */}


            {/* CATI AC Data Table */}
            <Card className="">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                        <Heading level={4} className="text-lg font-semibold text-gray-900">AC-Wise Call Progress Report</Heading>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            //   onClick={handleDownload}
                            //   disabled={loading || filteredData.length === 0}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    </div>
                </div>

                <div className="mb-4">
                    <Text className="text-sm text-gray-600">
                        Total <strong>{totalCount}</strong> items.
                    </Text>
                </div>

                <div className="table-responsive max-h-[600px] overflow-y-auto">
                    <Table className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300">
                        <thead className="bg-gray-50 sticky top-0 z-20 dark:bg-gray-800 shadow-sm">
                            <tr>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">AC Code</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">AC Name</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">Total Completed Data</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">Valid</th>    
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">QC Rejected</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">Short Interview Rejected</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">Total Under QC Data</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">Assigned to QC User</th>
                                <th className="border border-gray-300 bg-white dark:bg-gray-800 text-center">Pending For Assignment</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-gray-500 border border-gray-300">
                      {selectedAcCode ? 'No AC data found matching your selection' : 'No CATI AC data found'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.ac_code}>
                      <td className="border border-gray-300 text-center">{item.ac_code}</td>
                      <td className="border border-gray-300 text-left">{item.ac_name}</td>
                      <td className="border border-gray-300 text-center">{item.call_attempt}</td>
                      <td className="border border-gray-300 text-center">{item.call_connected}</td>
                      <td className="border border-gray-300 text-center">{item.success}</td>
                      <td className="border border-gray-300 text-center">{item.pass ?? '-'}</td>
                      <td className="border border-gray-300 text-center">{item.under_qc ?? '-'}</td>
                      <td className="border border-gray-300 text-center">{item.qc_rejected ?? '-'}</td>
                      <td className="border border-gray-300 text-center">{item.short_interview ?? '-'}</td>
                      <td className="border border-gray-300 text-center">{item.total_caller_data ?? '-'}</td>
                      <td className="border border-gray-300 text-center">{item.total_caller_available ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody> */}

                        <tbody>
                            <tr>
                                <td colSpan={11} className="text-center py-8 text-gray-500 border border-gray-300">
                                    No data found
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>

            </Card>
        </Container>
    );
}


