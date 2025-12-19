'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { ArrowLeft, Download, Search, RefreshCw, FileText, FileSpreadsheet, FileCode, Calendar, CheckCircle, XCircle, Plus } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface DownloadItem {
  id: number;
  title: string;
  description?: string;
  api: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, any> | string;
  };
  status: number; // 1 = active, 0 = inactive
  type: 'CSV' | 'EXCEL' | 'ZIP' | 'JSON' | 'PDF' | 'OTHER';
  survey_type: 'CAPI' | 'CATI' | 'CAVI' | 'CAPI QC' | 'OTHER';
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function DownloadsPage() {
  const router = useRouter();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const limit = 20;

  useEffect(() => {
    fetchDownloads();
  }, [currentPage, searchQuery, filterType, filterStatus]);

  const fetchDownloads = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      if (filterType !== 'all') {
        params.append('type', filterType);
      }
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus === 'active' ? '1' : '0');
      }

      const response = await apiClient.get(`/download-items?${params.toString()}`);
      
      if (response.data.success) {
        // API response structure: { success, data: { data: [...], pagination: {...} } }
        const responseData = response.data.data || {};
        setDownloads(responseData.data || []);
        setTotalPages(responseData.pagination?.totalPages || 1);
        setTotalItems(responseData.pagination?.total || 0);
      } else {
        setError(response.data.message || 'Failed to fetch download items');
      }
    } catch (err: any) {
      console.error('Error fetching downloads:', err);
      setError(err.response?.data?.message || 'Failed to fetch download items');
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item: DownloadItem) => {
    if (downloadingId) return; // Prevent multiple simultaneous downloads
    
    setDownloadingId(item.id);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build the download URL based on API configuration
      let downloadUrl = item.api.url;
      
      // For GET requests, append params as query string
      if (item.api.method === 'GET' && item.api.params) {
        const params = new URLSearchParams();
        
        if (typeof item.api.params === 'string') {
          // If params is a string (e.g., "date=2025-11-20&format=csv")
          const paramPairs = item.api.params.split('&');
          paramPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
              params.append(decodeURIComponent(key), decodeURIComponent(value));
            }
          });
        } else {
          // If params is an object
          const paramsObj = item.api.params as Record<string, any>;
          Object.keys(paramsObj).forEach(key => {
            params.append(key, String(paramsObj[key]));
          });
        }
        
        downloadUrl += `?${params.toString()}`;
      }
      
      // Track the download first (as per documentation)
      try {
        await apiClient.post(`/download-items/${item.id}/track`, {});
      } catch (trackErr) {
        console.error('Failed to track download:', trackErr);
        // Continue with download even if tracking fails
      }
      
      // Handle download based on method
      if (item.api.method === 'GET') {
        // For GET requests, fetch with authentication token
        const fullUrl = downloadUrl.startsWith('http') 
          ? downloadUrl 
          : `${apiBaseUrl}${downloadUrl}`;
        
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        // Fetch with authentication
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`);
        }
        
        // Get the blob from response
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${item.title}.${item.type.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // For POST/PUT/DELETE, make API call and download blob
        let requestData: any = {};
        
        if (item.api.params) {
          if (typeof item.api.params === 'string') {
            // Parse string params
            const paramPairs = item.api.params.split('&');
            paramPairs.forEach(pair => {
              const [key, value] = pair.split('=');
              if (key && value) {
                requestData[decodeURIComponent(key)] = decodeURIComponent(value);
              }
            });
          } else {
            requestData = item.api.params;
          }
        }
        
        const response = await apiClient.request({
          url: item.api.url,
          method: item.api.method,
          data: requestData,
          responseType: 'blob',
        });
        
        // Create blob and trigger download
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${item.title}.${item.type.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(err.response?.data?.message || 'Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CSV':
      case 'EXCEL':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'ZIP':
        return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'JSON':
        return <FileCode className="w-5 h-5 text-purple-500" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      CSV: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      EXCEL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ZIP: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      JSON: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      PDF: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type] || colors.OTHER}`}>
        {type}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDownloads();
  };

  const fileTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'CSV', label: 'CSV' },
    { value: 'EXCEL', label: 'Excel' },
    { value: 'ZIP', label: 'ZIP' },
    { value: 'JSON', label: 'JSON' },
    { value: 'PDF', label: 'PDF' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
  ];

  return (
    <Container maxWidth="7xl" className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white">
              Downloads
            </Heading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Download data files and reports
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/portal-admin/downloads/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Download Item
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Search and Filter */}
        <Card className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <Input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fileTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterStatus('active');
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={fetchDownloads}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </form>
        </Card>

        {/* Downloads List */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Available Downloads
              </Heading>
            </div>
            {totalItems > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : downloads.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No download items found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No download items available at the moment'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">API Endpoint</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {downloads.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => router.push(`/portal-admin/downloads/${item.id}/edit`)}
                                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                              >
                                {item.title}
                              </button>
                              {item.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md mt-1">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getTypeBadge(item.type)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-mono text-gray-900 dark:text-white">
                              {item.api.method} {item.api.url}
                            </div>
                            {item.api.params && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Params: {typeof item.api.params === 'string' ? item.api.params : JSON.stringify(item.api.params)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {item.status === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleDownload(item)}
                              disabled={item.status !== 1 || downloadingId === item.id}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              {downloadingId === item.id ? 'Downloading...' : 'Download'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </Container>
  );
}
