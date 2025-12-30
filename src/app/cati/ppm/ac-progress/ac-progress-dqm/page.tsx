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
import { apiService, CATIACDQMData } from '@/lib/api';
import Input from '@/components/ui/Input';


export default function CATIACProgressDQMPage() {
    const [callingDates, setCallingDates] = useState<string>('all');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [filteredData, setFilteredData] = useState<CATIACDQMData[]>([]);
    const [acData, setAcData] = useState<CATIACDQMData[]>([]);
    const [selectedAcCode, setSelectedAcCode] = useState<string>('');
    const [selectedAcName, setSelectedAcName] = useState<string>('');
    const [totalCount, setTotalCount] = useState(0);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs to prevent multiple simultaneous API calls
    const fetchingDataRef = useRef(false);
    const fetchingMetricsRef = useRef(false);
    const hasInitialFetchRef = useRef(false);

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
    // Helper function to convert calling dates option to start_date and end_date
    const getDateRangeForAPI = useCallback((callingDates: string, fromDate?: string, toDate?: string) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        switch (callingDates) {
            case 'all':
                return { start_date: '', end_date: '' };
            case 'today':
                return { start_date: todayStr, end_date: todayStr };
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                return { start_date: yesterdayStr, end_date: yesterdayStr };
            case 'dby':
                const dby = new Date(today);
                dby.setDate(dby.getDate() - 2);
                const dbyStr = dby.toISOString().split('T')[0];
                return { start_date: dbyStr, end_date: dbyStr };
            case 'l3':
                const l3Start = new Date(today);
                l3Start.setDate(l3Start.getDate() - 2);
                return { start_date: l3Start.toISOString().split('T')[0], end_date: todayStr };
            case 'l7':
                const l7Start = new Date(today);
                l7Start.setDate(l7Start.getDate() - 6);
                return { start_date: l7Start.toISOString().split('T')[0], end_date: todayStr };
            case 'l15':
                const l15Start = new Date(today);
                l15Start.setDate(l15Start.getDate() - 14);
                return { start_date: l15Start.toISOString().split('T')[0], end_date: todayStr };
            case 'currentmonth':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                return { start_date: monthStart.toISOString().split('T')[0], end_date: todayStr };
            case 'custom':
                return { start_date: fromDate || '', end_date: toDate || '' };
            default:
                return { start_date: '', end_date: '' };
        }
    }, []);


    const handleCallingDatesChange = (value: string | string[]) => {
        const callingDatesValue = Array.isArray(value) ? value[0] : value;
        setCallingDates(callingDatesValue);
    };
    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(e.target.value);
    };

    const handleAcChange = (value: string | string[]) => {
        const acCode = Array.isArray(value) ? value[0] : value;
        setSelectedAcCode(acCode);
    };

    const handleSearch = () => {
        fetchCATIDQMData();
    };
    const handleClearFilters = () => {
        setSelectedAcCode('');
        setCallingDates('all');
        setFromDate('');
        setToDate('');
        fetchCATIDQMData();
    };
    // Create dropdown options from AC data (memoized to prevent unnecessary re-renders)
    const acOptions = useMemo(() => [
        { value: '', label: 'All ACs' },
        ...acData.map(ac => ({
            value: ac.ac_code.toString(),
            label: `${ac.ac_name} (${ac.ac_code})`
        }))
    ], [acData]);

    const fetchCATIDQMData = useCallback(async () => {

        if (fetchingDataRef.current) return;

        fetchingDataRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication required');
                setLoading(false);
                fetchingDataRef.current = false;
                return;
            }

            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const params = new URLSearchParams();

            // Date filter
            const dateRange = getDateRangeForAPI(callingDates, fromDate, toDate);
            if (dateRange.start_date && dateRange.end_date) {
                params.append('start_date', dateRange.start_date);
                params.append('end_date', dateRange.end_date);
            }

            // AC filter
            if (selectedAcCode) {
                params.append('ac_code', selectedAcCode);
            }

            const url = `${apiBaseUrl}/api/cati/ac-progress-report/dqm${params.toString() ? `?${params.toString()}` : ''}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();

            if (result.success && result.data) {
                const summary = result.data.summary;   // SUMMARY
                const list = result.data.data;        // DATA ARRAY
                setSummary(summary);
                setTotalCount(list.length);
                setAcData(list);
                setFilteredData(list);
            } else {
                setError(result.message || "Failed to fetch CATI AC data");
            }

        } catch (err) {
            console.error("Error fetching CATI AC data:", err);
            setError(err instanceof Error ? err.message : "An error occurred while fetching data");
        } finally {
            setLoading(false);
            fetchingDataRef.current = false;
        }

    }, [callingDates, fromDate, toDate, selectedAcCode]);


    useEffect(() => {
        if (!hasInitialFetchRef.current) {
            hasInitialFetchRef.current = true;
            fetchCATIDQMData();
        }
    }, []);

    const handleDownload = () => {
        if (filteredData.length === 0) return;

        // Create CSV content
        const headers = ['AC Code', 'AC Name', 'Total Completed Data', 'Valid', 'QC Rejected', 'Short Interview Rejected', 'Total Under QC Data', 'Assigned to QC User', 'Pending For Assignment'];
       

        const rows: string[] = [];

        // 👉 Add SUMMARY row first (if available)
        if (summary) {
            rows.push([
                '-',                           
                '"-"',                   
                summary.total_success,
                summary.total_pass,
                summary.total_qc_rejected,
                summary.total_short_interview ?? '',
                summary.total_under_qc ?? '',
                summary.total_assigned_to_qc_user ?? '',
                summary.total_pending_for_assignment ?? ''
            ].join(','));
        }

        // 👉 Add all AC rows
        filteredData.forEach((item) => {
            rows.push([
                item.ac_code,
                `"${item.ac_name}"`,
                item.success,
                item.pass,
                item.qc_rejected,
                item.short_interview ?? '',
                item.under_qc ?? '',
                item.assigned_to_qc_user ?? '',
                item.pending_for_assignment ?? ''
            ].join(','));
        });

        // 👉 Final CSV content
        const csvContent = [headers.join(','), ...rows].join('\n');


        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);

        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const selectedAc = selectedAcCode ? acData.find(ac => ac.ac_code.toString() === selectedAcCode)?.ac_name : 'All';
        const filename = `AC-Wise-Report-${selectedAc}-${currentDate}.csv`;

        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                                value={selectedAcCode}
                                onChange={handleAcChange}
                                className="w-full"
                                placeholder="Select AC Name"
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
                                        value={fromDate}
                                        onChange={handleFromDateChange}
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
                                        value={toDate}
                                        onChange={handleToDateChange}
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
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                                <Button
                                    onClick={handleClearFilters}
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
                            onClick={handleDownload}
                            disabled={loading || filteredData.length === 0}
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
                        <tbody>

                            {summary && (
                                <tr className="bg-blue-100 font-semibold">
                                    <td className="border border-gray-300 text-center">-</td>
                                    <td className="border border-gray-300 text-left">-</td>
                                    <td className="border border-gray-300 text-center">{summary.total_success}</td>
                                    <td className="border border-gray-300 text-center">{summary.total_pass}</td>
                                    <td className="border border-gray-300 text-center">{summary.total_qc_rejected}</td>
                                    <td className="border border-gray-300 text-center">{summary.total_short_interview}</td>
                                    <td className="border border-gray-300 text-center">{summary.total_under_qc}</td>
                                    <td className="border border-gray-300 text-center">{summary.total_assigned_to_qc_user}</td>
                                    <td className="border border-gray-300 text-center">{summary.total_pending_for_assignment}</td>
                                </tr>
                            )}

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
                                        <td className="border border-gray-300 text-center">{item.success}</td>
                                        <td className="border border-gray-300 text-center">{item.pass}</td>
                                        <td className="border border-gray-300 text-center">{item.qc_rejected}</td>
                                        <td className="border border-gray-300 text-center">{item.short_interview ?? '-'}</td>
                                        <td className="border border-gray-300 text-center">{item.under_qc ?? '-'}</td>
                                        <td className="border border-gray-300 text-center">{item.assigned_to_qc_user ?? '-'}</td>
                                        <td className="border border-gray-300 text-center">{item.pending_for_assignment ?? '-'}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </Table>
                </div>

            </Card>
        </Container>
    );
}


