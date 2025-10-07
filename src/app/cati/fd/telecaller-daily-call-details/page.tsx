'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Input from '@/components/ui/Input';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Badge from '@/components/ui/Badge';
import { Search, Download, Phone, Clock, User, Calendar } from 'lucide-react';

interface TelecallerCallData {
  id: string;
  telecaller_name: string;
  telecaller_id: string;
  phone_number: string;
  call_date: string;
  call_time: string;
  call_duration: string;
  call_status: 'Completed' | 'In Progress' | 'Failed' | 'No Answer';
  call_outcome: 'Successful' | 'Busy' | 'No Answer' | 'Invalid Number' | 'Callback Required';
  notes: string;
  attempts: number;
}

interface APIResponse {
  success: boolean;
  data: {
    calls: TelecallerCallData[];
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
    summary: {
      total_calls: number;
      completed_calls: number;
      successful_calls: number;
      failed_calls: number;
      average_duration: string;
    };
    filters: {
      telecallers: Array<{
        id: string;
        name: string;
      }>;
      call_dates: string[];
    };
  };
}

export default function TelecallerDailyCallDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [callData, setCallData] = useState<TelecallerCallData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState({
    total_calls: 0,
    completed_calls: 0,
    successful_calls: 0,
    failed_calls: 0,
    average_duration: '0:00'
  });

  // Filter states
  const [selectedTelecaller, setSelectedTelecaller] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [callOutcome, setCallOutcome] = useState('');

  // Filter options
  const [telecallerOptions, setTelecallerOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [dateOptions, setDateOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedTelecaller, selectedDate, callStatus, callOutcome]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demonstration
      const mockData: APIResponse = {
        success: true,
        data: {
          calls: [
            {
              id: 'TC001',
              telecaller_name: 'Priya Sharma',
              telecaller_id: 'TC001',
              phone_number: '9876543210',
              call_date: '2024-01-15',
              call_time: '10:30 AM',
              call_duration: '5:45',
              call_status: 'Completed',
              call_outcome: 'Successful',
              notes: 'Respondent was cooperative and provided complete information',
              attempts: 1
            },
            {
              id: 'TC002',
              telecaller_name: 'Raj Kumar',
              telecaller_id: 'TC002',
              phone_number: '9876543211',
              call_date: '2024-01-15',
              call_time: '11:15 AM',
              call_duration: '3:20',
              call_status: 'Completed',
              call_outcome: 'Busy',
              notes: 'Line was busy, will try again later',
              attempts: 2
            },
            {
              id: 'TC003',
              telecaller_name: 'Sneha Patel',
              telecaller_id: 'TC003',
              phone_number: '9876543212',
              call_date: '2024-01-15',
              call_time: '12:00 PM',
              call_duration: '0:00',
              call_status: 'Failed',
              call_outcome: 'No Answer',
              notes: 'No response after 3 attempts',
              attempts: 3
            },
            {
              id: 'TC004',
              telecaller_name: 'Amit Singh',
              telecaller_id: 'TC004',
              phone_number: '9876543213',
              call_date: '2024-01-15',
              call_time: '1:30 PM',
              call_duration: '7:15',
              call_status: 'Completed',
              call_outcome: 'Successful',
              notes: 'Long conversation, detailed responses provided',
              attempts: 1
            },
            {
              id: 'TC005',
              telecaller_name: 'Kavya Reddy',
              telecaller_id: 'TC005',
              phone_number: '9876543214',
              call_date: '2024-01-15',
              call_time: '2:45 PM',
              call_duration: '4:30',
              call_status: 'Completed',
              call_outcome: 'Callback Required',
              notes: 'Respondent requested callback at convenient time',
              attempts: 1
            }
          ],
          pagination: {
            current_page: 1,
            per_page: 20,
            total_count: 5,
            total_pages: 1
          },
          summary: {
            total_calls: 5,
            completed_calls: 4,
            successful_calls: 2,
            failed_calls: 1,
            average_duration: '4:10'
          },
          filters: {
            telecallers: [
              { id: 'TC001', name: 'Priya Sharma' },
              { id: 'TC002', name: 'Raj Kumar' },
              { id: 'TC003', name: 'Sneha Patel' },
              { id: 'TC004', name: 'Amit Singh' },
              { id: 'TC005', name: 'Kavya Reddy' }
            ],
            call_dates: ['2024-01-15', '2024-01-14', '2024-01-13']
          }
        }
      };

      setCallData(mockData.data.calls);
      setTotalItems(mockData.data.pagination.total_count);
      setTotalPages(mockData.data.pagination.total_pages);
      setSummary(mockData.data.summary);

      // Set filter options
      const telecallerOptionsData = [
        { value: '', label: 'All Telecallers' },
        ...mockData.data.filters.telecallers.map(tc => ({
          value: tc.id,
          label: tc.name
        }))
      ];
      setTelecallerOptions(telecallerOptionsData);

      const dateOptionsData = [
        { value: '', label: 'All Dates' },
        ...mockData.data.filters.call_dates.map(date => ({
          value: date,
          label: date
        }))
      ];
      setDateOptions(dateOptionsData);

    } catch (err) {
      setError('Error fetching data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'No Answer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getOutcomeBadgeColor = (outcome: string) => {
    switch (outcome) {
      case 'Successful':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Busy':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'No Answer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Invalid Number':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Callback Required':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900 dark:text-white">
            Telecaller Daily Call Details
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and track daily call activities of telecallers
          </Text>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1 text-right">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Calls</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total_calls}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <User className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.completed_calls}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Successful</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.successful_calls}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.failed_calls}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.average_duration}</Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telecaller
              </label>
              <SelectDropdown
                value={selectedTelecaller}
                onChange={(value) => setSelectedTelecaller(Array.isArray(value) ? value[0] : value)}
                options={telecallerOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call Date
              </label>
              <SelectDropdown
                value={selectedDate}
                onChange={(value) => setSelectedDate(Array.isArray(value) ? value[0] : value)}
                options={dateOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call Status
              </label>
              <SelectDropdown
                value={callStatus}
                onChange={(value) => setCallStatus(Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Failed', label: 'Failed' },
                  { value: 'No Answer', label: 'No Answer' }
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call Outcome
              </label>
              <SelectDropdown
                value={callOutcome}
                onChange={(value) => setCallOutcome(Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'All Outcomes' },
                  { value: 'Successful', label: 'Successful' },
                  { value: 'Busy', label: 'Busy' },
                  { value: 'No Answer', label: 'No Answer' },
                  { value: 'Invalid Number', label: 'Invalid Number' },
                  { value: 'Callback Required', label: 'Callback Required' }
                ]}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Call Details Table */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
                Daily Call Details
              </Heading>
            </div>
            <span className="text-end">
              <Text className="text-sm text-gray-500">
                Showing {callData.length} of {totalItems} calls
              </Text>
            </span>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <Text className="mt-4 text-gray-600">Loading call details...</Text>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Text className="text-lg text-red-600">Error: {error}</Text>
              <Button 
                onClick={fetchData}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          ) : callData.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-lg text-gray-600">No call data found</Text>
              <Text className="text-sm text-gray-500 mt-2">Try adjusting your search filters</Text>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: '5%' }}>#</th>
                    <th style={{ width: '15%' }}>Telecaller</th>
                    <th style={{ width: '12%' }}>Phone Number</th>
                    <th style={{ width: '10%' }}>Call Date</th>
                    <th style={{ width: '10%' }}>Call Time</th>
                    <th style={{ width: '10%' }}>Duration</th>
                    <th style={{ width: '12%' }}>Status</th>
                    <th style={{ width: '12%' }}>Outcome</th>
                    <th style={{ width: '8%' }}>Attempts</th>
                    <th style={{ width: '16%' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {callData.map((call, index) => (
                    <tr key={call.id}>
                      <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <div>
                          <Text className="font-medium">{call.telecaller_name}</Text>
                          <Text className="text-sm text-gray-500">{call.telecaller_id}</Text>
                        </div>
                      </td>
                      <td>{call.phone_number}</td>
                      <td>{call.call_date}</td>
                      <td>{call.call_time}</td>
                      <td className="text-center">{call.call_duration}</td>
                      <td>
                        <Badge className={getStatusBadgeColor(call.call_status)}>
                          {call.call_status}
                        </Badge>
                      </td>
                      <td>
                        <Badge className={getOutcomeBadgeColor(call.call_outcome)}>
                          {call.call_outcome}
                        </Badge>
                      </td>
                      <td className="text-center">{call.attempts}</td>
                      <td>
                        <Text className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {call.notes}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && callData.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </Card>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th,
        .table td {
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          text-align: left;
        }
        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.075);
        }
      `}</style>
    </Container>
  );
}
