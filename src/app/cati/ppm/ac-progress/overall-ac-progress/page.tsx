'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Search, X } from 'lucide-react';
import { apiService, CATIACData } from '@/lib/api';

export default function CATIACWiseDataPage() {
  const [acData, setAcData] = useState<CATIACData[]>([]);
  const [filteredData, setFilteredData] = useState<CATIACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAcCode, setSelectedAcCode] = useState<string>('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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
    } else {
      const filtered = acData.filter(item =>
        item.ac_code.toString() === selectedAcCode
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClear = () => {
    setSelectedAcCode(''); // Clear the selected AC code
    setFilteredData(acData); // Show all data
    setCurrentPage(1); // Reset to first page
  };

  const handleAcChange = (value: string | string[]) => {
    const acCode = Array.isArray(value) ? value[0] : value;
    setSelectedAcCode(acCode);
  };

  // Create dropdown options from AC data
  const acOptions = [
    { value: '', label: 'All ACs' },
    ...acData
      .sort((a, b) => a.ac_name.localeCompare(b.ac_name))
      .map(ac => ({
        value: ac.ac_code.toString(),
        label: `${ac.ac_name} (${ac.ac_code})`
      }))
  ];

  // Calculate pagination
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleDownload = () => {
    if (filteredData.length === 0) return;

    // Create CSV content
    const headers = ['Sr.No.', 'AC Name', 'Call Attempted', 'Call Connected', 'Success'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((item, index) => [
        index + 1,
        `"${item.ac_name}"`,
        item.call_attempt,
        item.call_connected,
        item.success
      ].join(','))
    ].join('\n');

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
      <Card className="mb-6">
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
                  type="button" 
                  onClick={handleClear}
                  disabled={loading}
                  variant="secondary"
                  className="flex-1"
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
              variant="primary" 
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
          <div className="table-responsive ">
            <Table className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-300 w-16 text-center">Sr.No.</th>
                  <th className="border border-gray-300 w-32 text-center">AC Name</th>
                  <th className="border border-gray-300 w-24 text-center">Call Attempted</th>
                  <th className="border border-gray-300 w-24 text-center">Call Connected</th>
                  <th className="border border-gray-300 w-20 text-center">Success</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 border border-gray-300">
                      {selectedAcCode ? 'No AC data found matching your selection' : 'No CATI AC data found'}
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.ac_code}>
                      <td className="border border-gray-300 text-center">{startIndex + index + 1}</td>
                      <td className="border border-gray-300 text-left">{item.ac_name}</td>
                      <td className="border border-gray-300 text-center">{item.call_attempt}</td>
                      <td className="border border-gray-300 text-center">{item.call_connected}</td>
                      <td className="border border-gray-300 text-center">{item.success}</td>
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
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

      </Card>
    </Container>
  );
}
