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
import { Search, Download, Upload, Edit } from 'lucide-react';
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
  const [pageSize] = useState(20);
  const [data, setData] = useState<APIResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build parameters object, only including non-empty values
      const params: any = {
        page: currentPage,
        limit: pageSize
      };
      
      // Only add ac_name if it's not empty
      if (acName.trim()) {
        params.ac_name = acName.trim();
      }
      
      // Only add ac_code if it's not empty
      if (acCode.trim()) {
        params.ac_code = acCode.trim();
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


  const handleDownloadAC = () => {
    // Handle download AC list logic here
    console.log('Download AC List');
  };

  const handleUploadAC = () => {
    // Handle upload AC list logic here
    console.log('Upload AC List');
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
          <Heading level={1} className="text-2xl font-bold mb-0">
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
            
            <div>
              <Button type="submit" variant="primary" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Master AC Table Card */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
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
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Showing <b>{startIndex + 1}-{endIndex}</b> of <b>{data.total_count}</b> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ac Code</th>
                  <th>Ac Name</th>
                  <th>District Code</th>
                  <th>District Name</th>
                  <th>Pc Name</th>
                  <th>Pc Code</th>
                  <th>Zone Code</th>
                  <th>Zone Name</th>
                  <th>Current Mla</th>
                  <th>Agency</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.acs.map((ac, index) => (
                  <tr key={ac.ac_code}>
                    <td>{startIndex + index + 1}</td>
                    <td>{ac.ac_code}</td>
                    <td>{ac.ac_name}</td>
                    <td>{ac.district_code}</td>
                    <td>{ac.district_name}</td>
                    <td>{ac.pc_name}</td>
                    <td>{ac.pc_code}</td>
                    <td>{ac.zone_code}</td>
                    <td>{ac.zone_name}</td>
                    <td>{ac.current_mla}</td>
                    <td>{ac.agency_name || ''}</td>
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
        </div>
      </Card>
    </Container>
  );
}
