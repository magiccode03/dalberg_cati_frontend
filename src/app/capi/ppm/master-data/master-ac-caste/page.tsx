'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, Upload, Edit, X } from 'lucide-react';
import { apiService } from '@/lib/api';

interface MasterACCaste {
  id: number;
  ac_code: number;
  caste_name: string;
  absoulte_caste: number;
  caste: string;
  rank: number;
  caste_code: string;
  castecode: string;
  minsample: number;
}

interface APIResponse {
  success: boolean;
  data: {
    castes: MasterACCaste[];
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
  timestamp: string;
}

export default function MasterACCastePage() {
  const router = useRouter();
  const [acCode, setAcCode] = useState('');
  const [casteName, setCasteName] = useState('');
  const [casteCode, setCasteCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [data, setData] = useState<APIResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async (customAcCode?: string, customCasteName?: string, customCasteCode?: string, customPage?: number) => {
    try {
      setLoading(true);
      
      // Use custom values if provided, otherwise use state values
      const acCodeToUse = customAcCode !== undefined ? customAcCode : acCode;
      const casteNameToUse = customCasteName !== undefined ? customCasteName : casteName;
      const casteCodeToUse = customCasteCode !== undefined ? customCasteCode : casteCode;
      const pageToUse = customPage !== undefined ? customPage : currentPage;
      
      // Build parameters object, only including non-empty values
      const params: any = {
        page: pageToUse,
        limit: pageSize
      };
      
      // Only add ac_code if it's not empty
      if (acCodeToUse.trim()) {
        params.ac_code = acCodeToUse.trim();
      }
      
      // Only add caste_name if it's not empty
      if (casteNameToUse.trim()) {
        params.caste_name = casteNameToUse.trim();
      }
      
      // Only add caste_code if it's not empty
      if (casteCodeToUse.trim()) {
        params.caste_code = casteCodeToUse.trim();
      }
      
      console.log('API Parameters:', params);
      
      const response = await apiService.getMasterACCasteList(params);
      
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    fetchData();
  };

  const handleClearFilters = () => {
    // Reset filters to empty values
    setAcCode('');
    setCasteName('');
    setCasteCode('');
    setCurrentPage(1);
    
    // Fetch data with cleared filters immediately
    fetchData('', '', '', 1);
  };

  const handleDownloadCaste = () => {
    // Handle download caste list logic here
    console.log('Download Caste List');
  };

  const handleUploadCaste = () => {
    router.push('/capi/ppm/master-data/master-ac-caste/uploadcaste');
  };

  const handleEditCaste = (id: number) => {
    router.push(`/capi/ppm/master-data/master-ac-caste/update?id=${id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex justify-center items-center h-64">
          <Text className="text-lg">Loading...</Text>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex justify-center items-center h-64">
          <Text className="text-lg text-red-600">Error: {error}</Text>
        </div>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="flex justify-center items-center h-64">
          <Text className="text-lg">No data available</Text>
        </div>
      </Container>
    );
  }

  const totalItems = data.total_count;
  const totalPages = data.total_pages;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            List of AC Wise Caste
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                value={acCode}
                onChange={(e) => setAcCode(e.target.value)}
                placeholder="Search By AC Code"
                className="w-full"
              />
            </div>
            
            <div>
              <Input
                type="text"
                value={casteName}
                onChange={(e) => setCasteName(e.target.value)}
                placeholder="Search By Caste Name"
                className="w-full"
              />
            </div>
            
            <div>
              <Input
                type="text"
                value={casteCode}
                onChange={(e) => setCasteCode(e.target.value)}
                placeholder="Search By Caste Code"
                className="w-full"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button type="submit" variant="primary" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600 border-gray-500"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Master AC Caste Table Card */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of AC Wise Caste
            </Heading>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadCaste}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Caste List
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUploadCaste}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Caste List
            </Button>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Ac Code</th>
                  <th className="text-center">Caste Name</th>
                  <th className="text-center">Absoulte Caste</th>
                  <th className="text-center">Caste</th>
                  <th className="text-center">Rank</th>
                  <th className="text-center">Caste Code</th>
                  <th className="text-center">Castecode</th>
                  <th className="text-center">Minsample</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.castes.map((caste, index) => (
                  <tr key={caste.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{caste.ac_code}</td>
                    <td className="text-left">{caste.caste_name}</td>
                    <td className="text-center">{caste.absoulte_caste}</td>
                    <td className="text-left">{caste.caste}</td>
                    <td className="text-center">{caste.rank}</td>
                    <td className="text-center">{caste.caste_code}</td>
                    <td className="text-center">{caste.castecode}</td>
                    <td className="text-center">{caste.minsample}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditCaste(caste.id)}
                        className="text-white"
                        title="Edit Caste"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

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
