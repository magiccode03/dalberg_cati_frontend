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
import { Search, Download, Upload, Edit, Map, RotateCcw } from 'lucide-react';
import { apiService } from '@/lib/api';

interface MasterPS {
  id: number;
  pc_code: number;
  ac_code: number;
  polling_station_no: string;
  polling_station_name: string;
  polling_station_name_l2: string;
  gps_lng: string;
  gps_lat: string;
  gps: string;
  ac_name: string;
  district_name: string;
  zone_name: string;
  pc_name: string;
  agency_name: string;
}

interface APIResponse {
  success: boolean;
  data: {
    polling_stations: MasterPS[];
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
  timestamp: string;
}

export default function MasterPSPage() {
  const [pollingStationName, setPollingStationName] = useState('');
  const [pollingStationNo, setPollingStationNo] = useState('');
  const [acCode, setAcCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [data, setData] = useState<APIResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pollingStationName, pollingStationNo, acCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build parameters object, only including non-empty values
      const params: any = {
        page: currentPage,
        limit: pageSize
      };
      
      // Only add polling_station_name if it's not empty
      if (pollingStationName.trim()) {
        params.polling_station_name = pollingStationName.trim();
      }
      
      // Only add polling_station_no if it's not empty
      if (pollingStationNo.trim()) {
        params.polling_station_no = pollingStationNo.trim();
      }
      
      // Only add ac_code if it's not empty
      if (acCode.trim()) {
        params.ac_code = acCode.trim();
      }
      
      console.log('API Parameters:', params);
      
      const response = await apiService.getMasterPollingStationList(params);
      
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

  const handleCalculateValidInterview = () => {
    // Handle calculate valid interview logic here
    console.log('Calculate Valid Interview');
  };

  const handleDownloadPS = () => {
    // Handle download PS list logic here
    console.log('Download PS List');
  };

  const handleUploadPS = () => {
    // Handle upload PS list logic here
    console.log('Upload PS List');
  };

  const handleEditPS = (id: number) => {
    // Handle edit PS logic here
    console.log('Edit PS ID:', id);
  };

  const handleViewGPSMap = (acCode: number, psCode: string) => {
    // Handle view GPS map logic here
    console.log('View GPS Map - AC Code:', acCode, 'PS Code:', psCode);
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
            List of Master Poling Station
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
                value={pollingStationName}
                onChange={(e) => setPollingStationName(e.target.value)}
                placeholder="Search By Poling Station Name"
                className="w-full"
              />
            </div>
            
            <div>
              <Input
                type="text"
                value={pollingStationNo}
                onChange={(e) => setPollingStationNo(e.target.value)}
                placeholder="Search By Poling Station Code"
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

      {/* Master PS Table Card */}
      <Card className="">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of Master Poling Station
            </Heading>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCalculateValidInterview}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Calculate Valid Interview
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPS}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PS List
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUploadPS}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload PS List
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
                  <th className="text-center">Polling Station No</th>
                  <th className="text-center">Polling Station Name</th>
                  <th className="text-center">Polling Station Name L2</th>
                  <th className="text-center">Gps</th>
                  <th className="text-center">Gps Lat</th>
                  <th className="text-center">Gps Lng</th>
                  <th className="text-center">Valid Interview</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.polling_stations.map((ps, index) => (
                  <tr key={ps.id}>
                    <td className="text-center">{startIndex + index + 1}</td>
                    <td className="text-center">{ps.ac_code}</td>
                    <td className="text-center">{ps.polling_station_no}</td>
                    <td className="text-left">{ps.polling_station_name}</td>
                    <td className="text-left">{ps.polling_station_name_l2}</td>
                    <td className="text-center">{ps.gps}</td>
                    <td className="text-center">{ps.gps_lat}</td>
                    <td className="text-center">{ps.gps_lng}</td>
                    <td className="text-center">-</td>
                    <td className="text-center">
                      <div className="flex gap-1">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditPS(ps.id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 border-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewGPSMap(ps.ac_code, ps.polling_station_no)}
                          className="bg-teal-500 hover:bg-teal-600 text-white border-0"
                          title="GPS Map"
                        >
                          <Map className="w-4 h-4" />
                        </Button>
                      </div>
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
