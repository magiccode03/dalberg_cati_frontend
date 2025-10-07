'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Badge from '@/components/ui/Badge';
import { Search, Download, Phone, Clock, User, Calendar, TrendingUp } from 'lucide-react';

interface TelecallerProgressData {
  id: string;
  telecaller_name: string;
  telecaller_id: string;
  total_calls: number;
  completed_calls: number;
  successful_calls: number;
  failed_calls: number;
  success_rate: number;
  average_duration: string;
  last_call_date: string;
  status: 'Active' | 'Inactive' | 'On Break';
}

interface APIResponse {
  success: boolean;
  data: {
    telecallers: TelecallerProgressData[];
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
    summary: {
      total_telecallers: number;
      active_telecallers: number;
      total_calls_today: number;
      success_rate_overall: number;
    };
  };
}

export default function TelecallerProgressPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [telecallerData, setTelecallerData] = useState<TelecallerProgressData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState({
    total_telecallers: 0,
    active_telecallers: 0,
    total_calls_today: 0,
    success_rate_overall: 0
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentPage, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demonstration
      const mockData: APIResponse = {
        success: true,
        data: {
          telecallers: [
            {
              id: 'TC001',
              telecaller_name: 'Priya Sharma',
              telecaller_id: 'TC001',
              total_calls: 45,
              completed_calls: 42,
              successful_calls: 28,
              failed_calls: 14,
              success_rate: 66.7,
              average_duration: '4:30',
              last_call_date: '2024-01-15',
              status: 'Active'
            },
            {
              id: 'TC002',
              telecaller_name: 'Raj Kumar',
              telecaller_id: 'TC002',
              total_calls: 38,
              completed_calls: 35,
              successful_calls: 22,
              failed_calls: 13,
              success_rate: 57.9,
              average_duration: '3:45',
              last_call_date: '2024-01-15',
              status: 'Active'
            },
            {
              id: 'TC003',
              telecaller_name: 'Sneha Patel',
              telecaller_id: 'TC003',
              total_calls: 52,
              completed_calls: 48,
              successful_calls: 35,
              failed_calls: 13,
              success_rate: 72.9,
              average_duration: '5:15',
              last_call_date: '2024-01-14',
              status: 'On Break'
            },
            {
              id: 'TC004',
              telecaller_name: 'Amit Singh',
              telecaller_id: 'TC004',
              total_calls: 41,
              completed_calls: 38,
              successful_calls: 25,
              failed_calls: 13,
              success_rate: 65.8,
              average_duration: '4:20',
              last_call_date: '2024-01-15',
              status: 'Active'
            },
            {
              id: 'TC005',
              telecaller_name: 'Kavya Reddy',
              telecaller_id: 'TC005',
              total_calls: 47,
              completed_calls: 44,
              successful_calls: 31,
              failed_calls: 13,
              success_rate: 70.5,
              average_duration: '4:45',
              last_call_date: '2024-01-15',
              status: 'Inactive'
            }
          ],
          pagination: {
            current_page: 1,
            per_page: 20,
            total_count: 5,
            total_pages: 1
          },
          summary: {
            total_telecallers: 5,
            active_telecallers: 3,
            total_calls_today: 223,
            success_rate_overall: 66.4
          }
        }
      };

      setTelecallerData(mockData.data.telecallers);
      setTotalItems(mockData.data.pagination.total_count);
      setTotalPages(mockData.data.pagination.total_pages);
      setSummary(mockData.data.summary);

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
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'On Break':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
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
            Telecaller Progress
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor telecaller performance and progress metrics
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Telecallers</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total_telecallers}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Telecallers</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.active_telecallers}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Calls Today</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total_calls_today}</Text>
            </div>
          </div>
        </Card>

        <Card className="">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Success Rate</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{summary.success_rate_overall}%</Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <SelectDropdown
                value={statusFilter}
                onChange={(value) => setStatusFilter(Array.isArray(value) ? value[0] : value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'On Break', label: 'On Break' }
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

      {/* Telecaller Progress Table */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
                Telecaller Progress
              </Heading>
            </div>
            <span className="text-end">
              <Text className="text-sm text-gray-500">
                Showing {telecallerData.length} of {totalItems} telecallers
              </Text>
            </span>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <Text className="mt-4 text-gray-600">Loading telecaller data...</Text>
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
          ) : telecallerData.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-lg text-gray-600">No telecaller data found</Text>
              <Text className="text-sm text-gray-500 mt-2">Try adjusting your search filters</Text>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: '5%' }}>#</th>
                    <th style={{ width: '20%' }}>Telecaller</th>
                    <th className="text-center" style={{ width: '10%' }}>Total Calls</th>
                    <th className="text-center" style={{ width: '12%' }}>Completed</th>
                    <th className="text-center" style={{ width: '12%' }}>Successful</th>
                    <th className="text-center" style={{ width: '10%' }}>Failed</th>
                    <th className="text-center" style={{ width: '12%' }}>Success Rate</th>
                    <th className="text-center" style={{ width: '10%' }}>Avg Duration</th>
                    <th className="text-center" style={{ width: '10%' }}>Status</th>
                    <th style={{ width: '12%' }}>Last Call</th>
                  </tr>
                </thead>
                <tbody>
                  {telecallerData.map((telecaller, index) => (
                    <tr key={telecaller.id}>
                      <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <div>
                          <Text className="font-medium">{telecaller.telecaller_name}</Text>
                          <Text className="text-sm text-gray-500">{telecaller.telecaller_id}</Text>
                        </div>
                      </td>
                      <td className="text-center">{telecaller.total_calls}</td>
                      <td className="text-center">{telecaller.completed_calls}</td>
                      <td className="text-center">{telecaller.successful_calls}</td>
                      <td className="text-center">{telecaller.failed_calls}</td>
                      <td className="text-center">
                        <Badge className={telecaller.success_rate >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : telecaller.success_rate >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}>
                          {telecaller.success_rate}%
                        </Badge>
                      </td>
                      <td className="text-center">{telecaller.average_duration}</td>
                      <td className="text-center">
                        <Badge className={getStatusBadgeColor(telecaller.status)}>
                          {telecaller.status}
                        </Badge>
                      </td>
                      <td>{telecaller.last_call_date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && telecallerData.length > 0 && (
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
