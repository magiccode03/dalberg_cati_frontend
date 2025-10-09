'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { Download, Search } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';

export default function CATIACWiseDataPage() {
  const [acData, setAcData] = useState<CATIACData[]>([]);
  const [filteredData, setFilteredData] = useState<CATIACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAcCode, setSelectedAcCode] = useState<string>('');

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
        setFilteredData(response.data);
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

  const handleSearch = () => {
    if (!selectedAcCode) {
      setFilteredData(acData);
      return;
    }

    const filtered = acData.filter(item =>
      item.ac_code.toString() === selectedAcCode
    );
    setFilteredData(filtered);
  };

  const handleAcChange = (value: string | string[]) => {
    const acCode = Array.isArray(value) ? value[0] : value;
    setSelectedAcCode(acCode);
  };

  // Create dropdown options from AC data
  const acOptions = [
    { value: '', label: 'All ACs' },
    ...acData.map(ac => ({
      value: ac.ac_code.toString(),
      label: `${ac.ac_name} (${ac.ac_code})`
    }))
  ];

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <Heading level={4} className="mb-6">
       AC-Wise Report
      </Heading>

      {/* Search Filter */}
      <Card className="p-4 md:p-6 mb-6">
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <div className="col-span-4">
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
          <div className="col-span-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0">
                Action
              </label>
              <Button 
                type="button" 
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

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
                  <th className="border border-gray-300 w-16">Sr.No.</th>
                  <th className="border border-gray-300 w-32">AC Name</th>
                  <th className="border border-gray-300 w-24">Call Attempted</th>
                  <th className="border border-gray-300 w-24">Call Connected</th>
                  <th className="border border-gray-300 w-20">Success</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 border border-gray-300">
                      {selectedAcCode ? 'No AC data found matching your selection' : 'No CATI AC data found'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.ac_code}>
                      <td className="border border-gray-300">{index + 1}</td>
                      <td className="border border-gray-300">{item.ac_name}</td>
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
