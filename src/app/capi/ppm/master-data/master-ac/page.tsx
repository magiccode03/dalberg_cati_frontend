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

interface MasterAC {
  ac_code: number;
  ac_name: string;
  district_code: number;
  district_name: string;
  pc_code: number;
  pc_name: string;
  zone_code: number;
  zone_name: string;
  current_mla: string;
  agency_name: string | null;
}

interface APIResponse {
  success: boolean;
  data: {
    acs: MasterAC[];
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
  timestamp: string;
  requestId: string;
}

export default function MasterACPage() {
  const router = useRouter();
  const [acName, setAcName] = useState('');
  const [acCode, setAcCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [data, setData] = useState<APIResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async (customAcName?: string, customAcCode?: string, customPage?: number) => {
    try {
      setLoading(true);
      
      // Use custom values if provided, otherwise use state values
      const nameToUse = customAcName !== undefined ? customAcName : acName;
      const codeToUse = customAcCode !== undefined ? customAcCode : acCode;
      const pageToUse = customPage !== undefined ? customPage : currentPage;
      
      // Build parameters object, only including non-empty values
      const params: any = {
        page: pageToUse,
        limit: pageSize
      };
      
      // Only add ac_name if it's not empty
      if (nameToUse.trim()) {
        params.ac_name = nameToUse.trim();
      }
      
      // Only add ac_code if it's not empty
      if (codeToUse.trim()) {
        params.ac_code = codeToUse.trim();
      }
      
      console.log('API Parameters:', params);
      
      const response = await apiService.getMasterACList(params);
      
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
    setAcName('');
    setAcCode('');
    setCurrentPage(1);
    
    // Fetch data with cleared filters immediately
    fetchData('', '', 1);
  };


  const handleDownloadAC = () => {
    // Handle download AC list logic here
    console.log('Download AC List');
  };

  const handleUploadAC = () => {
    router.push('/capi/ppm/master-data/master-ac/uploadac');
  };

  const handleEditAC = (acCode: number) => {
    router.push(`/capi/ppm/master-data/master-ac/update?ac_code=${acCode}`);
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        <div className="text-center">
          <div className="text-lg text-red-600">No data available</div>
        </div>
      </Container>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.total_count);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            List of AC
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                type="text"
                value={acName}
                onChange={(e) => setAcName(e.target.value)}
                placeholder="Search By AC Name"
                className="w-full"
              />
            </div>
            
            <div>
              <Input
                type="text"
                value={acCode}
                onChange={(e) => setAcCode(e.target.value)}
                placeholder="Search By AC Code"
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

      {/* Master AC Table Card */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of AC
            </Heading>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadAC}
            >
              <Download className="w-4 h-4 mr-2" />
              Download AC List
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUploadAC}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload AC List
            </Button>
          </div>
        </div>
        
        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{data.total_count.toLocaleString()}</strong> items.
            </Text>
          </div>
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Ac Code</th>
                  <th className="text-center">Ac Name</th>
                  <th className="text-center">District Code</th>
                  <th className="text-center">District Name</th>
                  <th className="text-center">Pc Name</th>
                  <th className="text-center">Pc Code</th>
                  <th className="text-center">Zone Code</th>
                  <th className="text-center">Zone Name</th>
                  <th className="text-center">Current Mla</th>
                  <th className="text-center">Team</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.acs.map((ac, index) => (
                  <tr key={ac.ac_code}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{ac.ac_code}</td>
                    <td className="text-left">{ac.ac_name}</td>
                    <td className="text-center">{ac.district_code}</td>
                    <td className="text-left">{ac.district_name}</td>
                    <td className="text-left">{ac.pc_name}</td>
                    <td className="text-center">{ac.pc_code}</td>
                    <td className="text-center">{ac.zone_code}</td>
                    <td className="text-left">{ac.zone_name}</td>
                    <td className="text-left">{ac.current_mla}</td>
                    <td className="text-left">{ac.agency_name || ''}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditAC(ac.ac_code)}
                        className="text-white"
                        title="Edit AC"
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
              currentPage={data.current_page}
              totalPages={data.total_pages}
              totalItems={data.total_count}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </Container>
  );
}
