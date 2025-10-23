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
import { Search, Download, Upload, Edit, RotateCcw } from 'lucide-react';
import { apiService } from '@/lib/api';

interface PSForForm {
  id: number;
  ac_code: number;
  lot_no: number;
  ac_lot: string;
  polling_station_no: string;
  polling_station_name: string;
  polling_station_name_l2: string | null;
  polling_station_location: string | null;
  valid_interview: number;
  valid_interview_limit: number;
}

interface APIResponse {
  success: boolean;
  data: PSForForm[];
  pagination: {
    total: number;
    page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
  timestamp: string;
  requestId: string;
}

export default function PSForFormPage() {
  const [pollingStationName, setPollingStationName] = useState('');
  const [pollingStationNo, setPollingStationNo] = useState('');
  const [acCode, setAcCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [psFormData, setPsFormData] = useState<PSForForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch PS Form data from API
  const fetchPSFormData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      // Add search filters if they have values
      if (pollingStationName.trim()) {
        params.polling_station_name = pollingStationName.trim();
      }
      if (pollingStationNo.trim()) {
        params.polling_station_no = pollingStationNo.trim();
      }
      if (acCode.trim()) {
        params.ac_code = acCode.trim();
      }

      const response = await apiService.getPSFormList(params) as APIResponse;
      
      if (response.success) {
        setPsFormData(response.data);
        // Use pagination data from API response
        if (response.pagination) {
          setTotalItems(response.pagination.total);
          setTotalPages(response.pagination.total_pages);
        } else {
          // Fallback if pagination data is not available
          setTotalItems(response.data.length * 10);
          setTotalPages(Math.ceil((response.data.length * 10) / pageSize));
        }
      } else {
        setError('Failed to fetch PS Form data');
      }
    } catch (err) {
      console.error('Error fetching PS Form data:', err);
      setError('Error fetching PS Form data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchPSFormData();
  }, [currentPage, pageSize]);

  // Fetch data when search filters change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchPSFormData();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pollingStationName, pollingStationNo, acCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPSFormData();
  };

  const handleCalculateValidInterview = () => {
    // Handle calculate valid interview logic here
    console.log('Calculate Valid Interview');
  };

  const generatePSFormCSV = () => {
    const headers = [
      'AC Code',
      'Lot No',
      'AC Lot',
      'Polling Station No',
      'Polling Station Name',
      'Polling Station Name L2',
      'Polling Station Location',
      'Valid Interview',
      'Valid Interview Limit'
    ];

    const csvContent = [
      headers.join(','),
      ...psFormData.map(ps => [
        ps.ac_code,
        ps.lot_no,
        ps.ac_lot,
        ps.polling_station_no,
        `"${ps.polling_station_name}"`,
        ps.polling_station_name_l2 || '',
        ps.polling_station_location || '',
        ps.valid_interview,
        ps.valid_interview_limit
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ps-form-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPS = () => {
    generatePSFormCSV();
  };

  const handleUploadPS = () => {
    // Handle upload PS list logic here
    console.log('Upload PS List');
  };

  const handleEditPS = (id: number) => {
    // Navigate to edit page
    window.location.href = `/capi/ppm/ps-form/edit/${id}`;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            List of Master Poling Station For Field Form
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

      {/* PS for Form Table Card */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="card-title text-lg font-semibold text-gray-900 dark:text-white">
              List of Master Poling Station For Field Form
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
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                {loading ? (
                  'Loading...'
                ) : error ? (
                  <span className="text-red-600">Error: {error}</span>
                ) : (
                  <>Total <strong>{totalItems.toLocaleString()}</strong> items.</>
                )}
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered border border-gray-300">
              <thead>
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Ac Code</th>
                  <th className="text-center">Lot No</th>
                  <th className="text-center">Ac Lot</th>
                  <th className="text-center">Polling Station No</th>
                  <th className="text-left">Polling Station Name</th>
                  <th className="text-left">Polling Station Name L2</th>
                  <th className="text-left">Polling Station Location</th>
                  <th className="text-center">Valid Interview</th>
                  <th className="text-center">Valid Interview Limit</th>
                  <th className="text-center action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8">
                      <Text className="text-gray-500">Loading PS Form data...</Text>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8">
                      <Text className="text-red-500">Error loading data: {error}</Text>
                    </td>
                  </tr>
                ) : psFormData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8">
                      <Text className="text-gray-500">No PS Form data found</Text>
                    </td>
                  </tr>
                ) : (
                  psFormData.map((ps, index) => (
                    <tr key={`${ps.ac_code}-${ps.polling_station_no}`}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center">{ps.ac_code}</td>
                      <td className="text-center">{ps.lot_no}</td>
                      <td className="text-center">{ps.ac_lot}</td>
                      <td className="text-center">{ps.polling_station_no}</td>
                      <td className="text-left">{ps.polling_station_name}</td>
                      <td className="text-left">{ps.polling_station_name_l2 || '-'}</td>
                      <td className="text-left">{ps.polling_station_location || '-'}</td>
                      <td className="text-center">{ps.valid_interview}</td>
                      <td className="text-center">{ps.valid_interview_limit}</td>
                      <td className="text-center">
                        <Button
                          variant="primary"
                          size="sm"
                            onClick={() => handleEditPS(ps.id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 border-0"
                            title="Edit PS"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                    ))
                )}
              </tbody>
            </Table>
            
            {!loading && !error && psFormData.length > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
            )}
          </div>
        </div>
      </Card>
    </Container>
  );
}
