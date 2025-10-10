'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { Download } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';

export default function CATIACWiseDataPage() {
  const [acData, setAcData] = useState<CATIACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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


  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={4} className="mb-6">
       AC-Wise Report
      </Heading>

      {/* CATI AC Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4}>AC-Wise Call Progress Report</Heading>
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
          <div className="table-responsive">
            <Table className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light">
                <tr>
                  <th className="border border-gray-300 w-16">AC Code</th>
                  <th className="border border-gray-300 w-32">AC Name</th>
                  <th className="border border-gray-300 w-32">District Name</th>
                  <th className="border border-gray-300 w-24">Call Attempted</th>
                  <th className="border border-gray-300 w-24">Call Connected</th>
                  <th className="border border-gray-300 w-20">Success</th>
                </tr>
              </thead>
              <tbody>
                {acData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 border border-gray-300">
                      No CATI AC data found
                    </td>
                  </tr>
                ) : (
                  acData.map((item, index) => (
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
