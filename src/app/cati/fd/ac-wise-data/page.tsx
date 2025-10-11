'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';

export default function CATIACWiseDataPage() {
  const [acData, setAcData] = useState<CATIACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CATIACData; direction: 'asc' | 'desc' } | null>(null);

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

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={2} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        AC-Wise Report
      </Heading>

      {/* CATI AC Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4}>AC-Wise Call Progress Report</Heading>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4">
              Total {acData.length} items.
            </div>
          </div>
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
          <div className="table-responsive max-h-[600px] overflow-y-auto">
            <Table className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
                <tr>
                  <th 
                    className="border border-gray-300 w-16 cursor-pointer hover:bg-gray-100 bg-white dark:bg-gray-800"
                    onClick={() => handleSort('ac_code')}
                  >
                    <div className="flex items-center justify-between">
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
                    className="border border-gray-300 w-32 cursor-pointer hover:bg-gray-100 bg-white dark:bg-gray-800"
                    onClick={() => handleSort('ac_name')}
                  >
                    <div className="flex items-center justify-between">
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
                    className="border border-gray-300 w-32 cursor-pointer hover:bg-gray-100 bg-white dark:bg-gray-800"
                    onClick={() => handleSort('district_name')}
                  >
                    <div className="flex items-center justify-between">
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
                    className="border border-gray-300 w-24 cursor-pointer hover:bg-gray-100 bg-white dark:bg-gray-800"
                    onClick={() => handleSort('call_attempt')}
                  >
                    <div className="flex items-center justify-between">
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
                    className="border border-gray-300 w-24 cursor-pointer hover:bg-gray-100 bg-white dark:bg-gray-800"
                    onClick={() => handleSort('call_connected')}
                  >
                    <div className="flex items-center justify-between">
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
                    className="border border-gray-300 w-20 cursor-pointer hover:bg-gray-100 bg-white dark:bg-gray-800"
                    onClick={() => handleSort('success')}
                  >
                    <div className="flex items-center justify-between">
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
                {getSortedData().length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 border border-gray-300">
                      No CATI AC data found
                    </td>
                  </tr>
                ) : (
                  getSortedData().map((item, index) => (
                    <tr key={item.ac_code}>
                      <td className="border border-gray-300">{item.ac_code}</td>
                      <td className="border border-gray-300">{item.ac_name}</td>
                      <td className="border border-gray-300">{item.district_name}</td>
                      <td className="border border-gray-300">{item.call_attempt}</td>
                      <td className="border border-gray-300">{item.call_connected}</td>
                      <td className="border border-gray-300">{item.success}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}

      </Card>
    </Container>
  );
}
