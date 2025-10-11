'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, Upload, Edit } from 'lucide-react';
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
  const [acCode, setAcCode] = useState('');
  const [casteName, setCasteName] = useState('');
  const [casteCode, setCasteCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [data, setData] = useState<APIResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, acCode, casteName, casteCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build parameters object, only including non-empty values
      const params: any = {
        page: currentPage,
        limit: pageSize
      };
      
      // Only add ac_code if it's not empty
      if (acCode.trim()) {
        params.ac_code = acCode.trim();
      }
      
      // Only add caste_name if it's not empty
      if (casteName.trim()) {
        params.caste_name = casteName.trim();
      }
      
      // Only add caste_code if it's not empty
      if (casteCode.trim()) {
        params.caste_code = casteCode.trim();
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

  const handleDownloadCaste = () => {
    // Handle download caste list logic here
    console.log('Download Caste List');
  };

  const handleUploadCaste = () => {
    // Handle upload caste list logic here
    console.log('Upload Caste List');
  };

  const handleEditCaste = (id: number) => {
    // Handle edit caste logic here
    console.log('Edit Caste ID:', id);
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
            
            <div>
              <Button type="submit" variant="primary" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Master AC Caste Table Card */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
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
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{totalItems}</strong> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Ac Code</th>
                  <th>Caste Name</th>
                  <th>Absoulte Caste</th>
                  <th>Caste</th>
                  <th>Rank</th>
                  <th>Caste Code</th>
                  <th>Castecode</th>
                  <th>Minsample</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.castes.map((caste, index) => (
                  <tr key={caste.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{caste.ac_code}</td>
                    <td>{caste.caste_name}</td>
                    <td>{caste.absoulte_caste}</td>
                    <td>{caste.caste}</td>
                    <td>{caste.rank}</td>
                    <td>{caste.caste_code}</td>
                    <td>{caste.castecode}</td>
                    <td>{caste.minsample}</td>
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
        </div>
      </Card>
    </Container>
  );
}
