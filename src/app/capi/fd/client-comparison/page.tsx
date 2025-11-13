'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Card from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { apiService } from '@/lib/api';

interface ConstituencyData {
  ac_code: number;
  ac_name: string;
  target_sample: number;
  valid_client: number;
  valid_pmt: number;
  difference: number;
  color_code: string;
}

interface APIResponse {
  success: boolean;
  data: {
    success: boolean;
    data: ConstituencyData[];
    pagination: {
      total: number;
      page: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
    totals: {
      target_sample: string;
      valid_client: number;
      valid_pmt: number;
      difference: number;
      completion_percentage: number;
      data_sync_status: string;
    };
    message: string;
    timestamp: string;
  };
  message: string;
  timestamp: string;
}

export default function ClientComparisonPage() {
  const [constituencyData, setConstituencyData] = useState<ConstituencyData[]>([]);
  const [totals, setTotals] = useState({
    target_sample: 0,
    valid_client: 0,
    valid_pmt: 0,
    difference: 0,
    completion_percentage: 0,
    data_sync_status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFDInternalDashboard({
        limit: pageSize,
        page: currentPage
      }) as APIResponse;

      if (response.success && response.data.success) {
        setConstituencyData(response.data.data);
        setTotals({
          ...response.data.totals,
          target_sample: parseInt(response.data.totals.target_sample) || 0
        });
        setTotalPages(response.data.pagination.total_pages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError('Failed to fetch client comparison data');
      }
    } catch (err) {
      setError('Error fetching data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getDifferenceColor = (difference: number): string => {
    if (difference <= 0) return '#b4eed4'; // Good - green
    if (difference <= 20) return '#f5bcbc'; // Low Alert - light red
    return '#ff5757'; // High Alert - red
  };

  const getDifferenceIcon = (difference: number): string => {
    if (difference <= 0) return '🟢'; // Good
    if (difference <= 20) return '🟡'; // Low Alert
    return '🔴'; // High Alert
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
            Client Comparison
          </Heading>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-purple-600 text-white rounded-lg shadow-lg">
          <div className="p-6 text-center">
            <h3 className="text-white text-xl font-semibold mb-0">
              Interviews Valid (Client) - {loading ? 'Loading...' : totals.valid_client.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-green-600 text-white rounded-lg shadow-lg">
          <div className="p-6 text-center">
            <h3 className="text-white text-xl font-semibold mb-0">
              Interviews Valid (PMT) - {loading ? 'Loading...' : totals.valid_pmt.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Client Comparison Data
            </Heading>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              High Alert
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-200 rounded-full mr-2"></span>
              Low Alert
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-200 rounded-full mr-2"></span>
              Good
            </span>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading data...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-lg text-red-600">Error: {error}</div>
              <button 
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">AC Code</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">Target Sample</th>
                    <th className="text-center">Valid (Client)</th>
                    <th className="text-center">Valid (PMT)</th>
                    <th className="text-center">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {constituencyData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="text-center">{item.ac_code}</td>
                      <td className="text-left">{item.ac_name}</td>
                      <td className="text-center">{item.target_sample}</td>
                      <td className="text-center">{item.valid_client}</td>
                      <td className="text-center">{item.valid_pmt}</td>
                      <td 
                        className="text-center"
                        style={{ backgroundColor: item.color_code || getDifferenceColor(item.difference) }}
                      >
                        {item.difference}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
                    <td className="text-left font-semibold">Total</td>
                    <td className="text-center font-semibold">{totals.target_sample}</td>
                    <td className="text-center font-semibold">{totals.valid_client.toLocaleString()}</td>
                    <td className="text-center font-semibold">{totals.valid_pmt.toLocaleString()}</td>
                    <td className="text-center font-semibold">{totals.difference.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6">
            <PaginationStandard
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
      `}</style>
    </Container>
  );
}
