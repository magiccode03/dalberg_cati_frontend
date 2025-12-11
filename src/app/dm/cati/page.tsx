'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Alert from '@/components/ui/Alert';
import { Table } from '@/components/ui/Table';
import { Download } from 'lucide-react';

interface DownloadItem {
  id: number;
  title: string;
  description: string;
  api: {
    url: string;
    method: string;
    params: Record<string, string | number> | null;
  };
  type: string;
  status: number;
  sortOrder: number;
}

const CatiDataPage = () => {
  const [instanceData, setInstanceData] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [, setDownloadError] = useState<{ [key: number]: string }>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-clear status messages after 5s
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  // Fetch download items on mount
  useEffect(() => {
    let isMounted = true;

    const fetchDownloadItems = async () => {
      try {
        setIsLoading(true);
        setHasError(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
          setHasError('Authentication token not found');
          return;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

        const response = await fetch(`${apiBaseUrl}/api/download-items?page=1&limit=20`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          setHasError(`Failed to fetch download items (${response.status})`);
          return;
        }

        const result = await response.json();

        if (!result.success || !result.data?.data) {
          setHasError('Failed to fetch download items');
          return;
        }

        // Filter only CATI interview ZIP files with status = 1 (active)
        const priorityTitles = [
          'CATI All Interview Data',
          'CATI All Valid Interview Data',
          'CATI All Rejected Interview Data',
        ];

        const catiItems = result.data.data
          .filter((item: DownloadItem) =>
            item.type === 'ZIP' &&
            item.title.includes('CATI') && 
            item.status === 1 &&
            item.title.includes('Interview')
          )
          .sort((a: DownloadItem, b: DownloadItem) => {
            const aIdx = priorityTitles.indexOf(a.title);
            const bIdx = priorityTitles.indexOf(b.title);
            const aPriority = aIdx === -1 ? Number.MAX_SAFE_INTEGER : aIdx;
            const bPriority = bIdx === -1 ? Number.MAX_SAFE_INTEGER : bIdx;
            if (aPriority !== bPriority) return aPriority - bPriority;
            return a.sortOrder - b.sortOrder;
          });

        if (isMounted) setInstanceData(catiItems);
      } catch (err) {
        console.error('Error fetching download items:', err);
        if (isMounted) setHasError('Failed to load download items');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDownloadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = async (item: DownloadItem) => {
    try {
      setDownloadingId(item.id);
      setStatusMessage(null);
      setDownloadError(prev => {
        const newErrors = { ...prev };
        delete newErrors[item.id];
        return newErrors;
      });

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setDownloadError(prev => ({ ...prev, [item.id]: 'Authentication token not found' }));
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

      // Use the actual file URL from the API response
      const downloadUrl = `${apiBaseUrl}${item.api.url}`;

      console.log('API Base URL:', apiBaseUrl);
      console.log('Download URL:', downloadUrl);
      console.log('Download Item:', item);

      // Call the download API endpoint
      const downloadResponse = await fetch(downloadUrl, {
        method: item.api.method || 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });

      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        console.error('Download response error:', errorText);
        setDownloadError(prev => ({ ...prev, [item.id]: 'File not found' }));
        setStatusMessage({ type: 'error', message: 'File not found' });
        return;
      }

      // Get the file from response
      const blob = await downloadResponse.blob();
      
      // Determine file extension from type
      const fileExtensionMap: { [key: string]: string } = {
        'ZIP': 'zip',
        'CSV': 'csv',
        'EXCEL': 'xlsx',
        'PDF': 'pdf',
        'JSON': 'json',
      };

      const fileExtension = fileExtensionMap[item.type] || 'bin';
      const fileName = `${item.title.replace(/\s+/g, '_')}.${fileExtension}`;

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      // Clear error message after successful download
      setDownloadError(prev => {
        const newErrors = { ...prev };
        delete newErrors[item.id];
        return newErrors;
      });
      setStatusMessage({ type: 'success', message: 'Download data successfully' });
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(prev => ({ ...prev, [item.id]: 'File not found' }));
      setStatusMessage({ type: 'error', message: 'File not found' });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Raw Data Download (CATI)
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {statusMessage && (
        <Alert type={statusMessage.type === 'success' ? 'success' : 'error'} className="mb-4">
          {statusMessage.message}
        </Alert>
      )}

      {/* Instance Data Download Table */}
      <Card className="mb-6">
        <div className="card-header pb-0">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>   
            <Heading level={4} className="card-title mg-b-0 text-lg font-semibold text-gray-900 dark:text-white">
              INSTANCE DATA DOWNLOAD (CATI)
            </Heading>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading download items...</p>
            </div>
          ) : hasError ? (
            <div className="text-center py-8 bg-red-50 dark:bg-red-900/20 rounded p-4">
              <p className="text-red-600 dark:text-red-400">{hasError}</p>
            </div>
          ) : instanceData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No download items available</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top">
                <thead>
                  <tr>
                    <th className="text-left font-semibold text-gray-800 dark:text-gray-200">Action</th>
                    <th className="text-left font-semibold text-gray-800 dark:text-gray-200" style={{width: '15%'}}>Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {instanceData.map((item) => (
                    <tr key={item.id}>
                      <td className="text-gray-900 dark:text-gray-100 text-left font-medium">{item.title}</td>
                      <td className="text-left relative">
                        <div>
                          <button
                            onClick={() => handleDownload(item)}
                            disabled={downloadingId === item.id}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4" />
                            {downloadingId === item.id ? 'Downloading...' : 'Download'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Card>

    </Container>
  );
};

export default CatiDataPage;
