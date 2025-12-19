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
import Alert from '@/components/ui/Alert';
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
  const [pageSize] = useState(25);
  const [psFormData, setPsFormData] = useState<PSForForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Display success alerts
  const [success, setSuccess] = useState<string | null>(null);
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

  const handleCalculateValidInterview = async () => {
    try {
      setCalculating(true);
      setError(null);
      setSuccess(null);

      // Call API via apiService to calculate valid interviews
      const result = await apiService.calculateValidInterview();
      if (result.success) {
        // Display success message and affected rows if present
        const affected = result.data?.affected_rows ?? result.data?.affectedRows ?? null;
        const message = result.data?.message || result.message || 'Polling Station wise Interview Calculated Successfully!';
        const fullMsg = message;
        console.log(fullMsg + (affected !== null ? ` Affected Rows: ${affected}` : '')); 
        setSuccess(fullMsg);
        setTimeout(() => setSuccess(null), 8000);
        // Refresh list after calculation
        fetchPSFormData();
      } else {
        setError(result.message || 'Failed to calculate valid interviews');
      }
    } catch (err: any) {
      console.error('Error calculating valid interviews:', err);
      setError(err?.message || 'Error calculating valid interviews');
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadPS = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to download PS data
      const blob = await apiService.downloadPSForm();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Master-Dynamic-PS-List-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error downloading PS data:', err);
      setError('Failed to download PS data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPS = () => {
    // Handle upload PS list logic 
    window.location.href = '/capi/ppm/ps-form/upload';
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              List of Master Poling Station For Field Form
            </Heading>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCalculateValidInterview}
              disabled={calculating}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {calculating ? 'Calculating...' : 'Calculate Valid Interview'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPS}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Downloading...' : 'Download PS List'}
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
              {loading ? (
                'Loading...'
              ) : error ? (
                <span className="text-red-600">Error: {error}</span>
              ) : (
                <>Total <strong>{totalItems.toLocaleString()}</strong> items.</>
              )}
            </Text>
          </div>
          {success && (
            <div className="mb-4">
              <Alert type="success">{success}</Alert>
            </div>
          )}
          
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Ac Code</th>
                  <th className="text-center">Lot No</th>
                  <th className="text-center">Ac Lot</th>
                  <th className="text-center">Polling Station No</th>
                  <th className="text-center">Polling Station Name</th>
                  <th className="text-center">Polling Station Name L2</th>
                  <th className="text-center">Polling Station Location</th>
                  <th className="text-center">Valid Interview</th>
                  <th className="text-center">Valid Interview Limit</th>
                  <th className="text-center">Actions</th>
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
                      <td className="text-center">{ps.id}</td>
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
          </div>

          {/* Pagination */}
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
      </Card>
    </Container>
  );
}
