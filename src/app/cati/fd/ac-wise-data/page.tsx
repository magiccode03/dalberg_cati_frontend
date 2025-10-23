'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';

export default function CATIACWiseDataPage() {
  const [acData, setAcData] = useState<CATIACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CATIACData; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  useEffect(() => {
    fetchCATIData();
  }, []);

  const fetchCATIData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCATIACData();
      
      if (response.success && response.data) {
        setAcData(response.data);
      } else {
        setError('Failed to fetch CATI AC data');
      }
    } catch (err) {
      console.error('Error fetching CATI AC data:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof CATIACData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return acData;

    return [...acData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  // Pagination calculations
  const totalItems = getSortedData().length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = getSortedData().slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        AC-Wise Report
      </Heading>

      {/* CATI AC Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              AC-Wise Call Progress Report
            </Heading>
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
              <Text>Loading CATI AC data...</Text>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <Text>{error}</Text>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th 
                      className="text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('ac_code')}
                    >
                      <div className="flex items-center justify-center">
                        <span>AC Code</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig?.key === 'ac_code' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'ac_code' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('ac_name')}
                    >
                      <div className="flex items-center justify-center">
                        <span>AC Name</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig?.key === 'ac_name' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'ac_name' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('district_name')}
                    >
                      <div className="flex items-center justify-center">
                        <span>District Name</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig?.key === 'district_name' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'district_name' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('call_attempt')}
                    >
                      <div className="flex items-center justify-center">
                        <span>Call Attempted</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig?.key === 'call_attempt' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'call_attempt' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('call_connected')}
                    >
                      <div className="flex items-center justify-center">
                        <span>Call Connected</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig?.key === 'call_connected' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'call_connected' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>
                    </th>
                    <th 
                      className="text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('success')}
                    >
                      <div className="flex items-center justify-center">
                        <span>Success</span>
                        <div className="ml-1 flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig?.key === 'success' && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig?.key === 'success' && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No CATI AC data found
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.ac_code}>
                        <td className="text-center">{startIndex + index + 1}</td>
                        <td className="text-center">{item.ac_code}</td>
                        <td className="text-left">{item.ac_name}</td>
                        <td className="text-left">{item.district_name}</td>
                        <td className="text-center">{item.call_attempt}</td>
                        <td className="text-center">{item.call_connected}</td>
                        <td className="text-center">{item.success}</td>
                      </tr>
                    ))
                  )}
                </tbody>
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
    </Container>
  );
}
