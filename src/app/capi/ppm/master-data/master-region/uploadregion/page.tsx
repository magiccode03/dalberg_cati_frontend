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
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Upload, Download, Eye } from 'lucide-react';
import { apiService } from '@/lib/api';

interface PreviousRequest {
  cron_id: number;
  action_route: string;
  planned_at: string;
  executed_at: string;
  execution: number;
  errors: string;
  status: string;
  uploaded_file?: string;
  params?: string;
  cron_info?: string;
}

interface PreviousRequestsResponse {
  success: boolean;
  data: {
    requests: PreviousRequest[];
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

export default function UploadRegionPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previousRequests, setPreviousRequests] = useState<PreviousRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPreviousRequests();
  }, [currentPage]);

  const fetchPreviousRequests = async () => {
    try {
      setLoadingRequests(true);
      setRequestsError(null);
      
      // TODO: Replace with actual API endpoint when available
      // For now, using a placeholder endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setRequestsError('Authentication required');
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/capi/master-pc/upload-requests?page=${currentPage}&limit=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPreviousRequests(result.data?.requests || []);
          setTotalCount(result.data?.total_count || 0);
          setTotalPages(result.data?.total_pages || 0);
        } else {
          setRequestsError(result.message || 'Failed to fetch previous requests');
        }
      } else {
        setRequestsError('Failed to fetch previous requests');
      }
    } catch (error) {
      console.error('Error fetching previous requests:', error);
      setRequestsError('Error loading previous requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    // Validate file type (CSV)
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.type.includes('csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setUploadError('Authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('csv_file', selectedFile);

      const response = await fetch(`${apiUrl}/api/capi/master-pc/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadSuccess(true);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('csv_file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        // Refresh previous requests list
        fetchPreviousRequests();
      } else {
        setUploadError(result.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadRegion = () => {
    // Navigate back to master AC list page
    router.push('/capi/ppm/master-data/master-region');
  };

  const handleViewRequest = (cronId: number) => {
    // TODO: Implement view request functionality
    // This could open a modal or navigate to a detail page
    console.log('View request:', cronId);
    // For now, we'll use a placeholder
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    window.open(`${apiUrl}/api/capi/master-pc/view-request?cronrequest_id=${cronId}`, '_blank');
  };

  const handleDownloadUploadedFile = async (cronId: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/capi/master-pc/download-uploaded-file?cronrequest_id=${cronId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `uploaded_file_${cronId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {status}
        </span>
      );
    } else if (statusLower === 'failed') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {status}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          {status}
        </span>
      );
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Upload List of Region 
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Upload Form Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload List of Region
            </Heading>
          </div>
          <div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadRegion}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Region List
            </Button>
          </div>
        </div>

        <form onSubmit={handleUpload}>
          {uploadSuccess && (
            <Alert type="success" className="mb-4">
              File uploaded successfully!
            </Alert>
          )}

          {uploadError && (
            <Alert type="error" className="mb-4">
              {uploadError}
            </Alert>
          )}

          <div className="mb-4">
            <Text className="text-sm text-red-600 dark:text-red-400">
              Note - Please Upload Complete Region List as per sample file
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-3">
              <label htmlFor="csv_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CSV File <span className="text-red-500">*</span>
              </label>
              <Input
                id="csv_file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={uploading || !selectedFile}
              loading={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Previous Requests Card */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
          <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
            List of Previous Requests
          </Heading>
        </div>

        {requestsError && (
          <Alert type="error" className="mb-4">
            {requestsError}
          </Alert>
        )}

        {loadingRequests ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <Text className="text-gray-600 dark:text-gray-400 mt-4">Loading previous requests...</Text>
          </div>
        ) : (
          <div className="bg-white">
            <div className="mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{totalCount.toLocaleString()}</strong> items.
              </Text>
            </div>
            
            {previousRequests.length === 0 ? (
              <div className="text-center py-12">
                <Text className="text-gray-600 dark:text-gray-400">No previous requests found</Text>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                    <thead className="table-light bg-gray-50">
                      <tr>
                        <th className="text-center">S.No</th>
                        <th className="text-center">Cron ID</th>
                        <th className="text-center">Action/Route</th>
                        <th className="text-center">Planned At</th>
                        <th className="text-center">Executed At</th>
                        <th className="text-center">Execution</th>
                        <th className="text-center">Errors</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Actions</th>
                        <th className="text-center">Uploaded File</th>
                        <th className="text-center">Params</th>
                        <th className="text-center">CRON Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousRequests.map((request, index) => {
                        const startIndex = (currentPage - 1) * pageSize;
                        return (
                          <tr key={request.cron_id}>
                            <td className="text-center">{startIndex + index + 1}</td>
                            <td className="text-center">{request.cron_id}</td>
                            <td className="text-left">{request.action_route}</td>
                            <td className="text-center">{formatDate(request.planned_at)}</td>
                            <td className="text-center">{formatDate(request.executed_at)}</td>
                            <td className="text-center">{request.execution}</td>
                            <td className="text-center">
                              {request.errors === 'Yes' ? (
                                <span className="text-red-600 font-semibold">Yes</span>
                              ) : (
                                <span className="text-green-600">No</span>
                              )}
                            </td>
                            <td className="text-center">{getStatusBadge(request.status)}</td>
                            <td className="text-center">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewRequest(request.cron_id)}
                                className="text-white"
                                title="View Request"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                            <td className="text-center">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleDownloadUploadedFile(request.cron_id)}
                                className="text-white"
                                title="Download Uploaded File"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </td>
                            <td className="text-center">{request.params || '-'}</td>
                            <td className="text-center">{request.cron_info || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-6">
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </Container>
  );
}

