'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  survey_type?: string;
}

const CapiDataPage = () => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [, setDownloadError] = useState<{ [key: number]: string }>({});
  const [apiItems, setApiItems] = useState<DownloadItem[]>([]);
  const [qcApiItems, setQcApiItems] = useState<DownloadItem[]>([]);
  const [isLoadingApiItems, setIsLoadingApiItems] = useState(false);
  const [isLoadingQcItems, setIsLoadingQcItems] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-clear status messages after 5s
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  // Load download-items to get actual download URLs for CAPI ZIPs
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoadingApiItems(true);
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const res = await fetch(`${apiBaseUrl}/api/download-items?page=1&limit=50&survey_type=CAPI`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (!res.ok) return;
        const json = await res.json();
        if (json?.data?.data) setApiItems(json.data.data);
      } catch (err) {
        console.error('Failed to fetch apiItems', err);
      } finally {
        setIsLoadingApiItems(false);
      }
    };
    fetchItems();
  }, []);

  // Fetch QC download items (CAPI QC) separately
  useEffect(() => {
    const fetchQcItems = async () => {
      try {
        setIsLoadingQcItems(true);
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const res = await fetch(`${apiBaseUrl}/api/download-items?page=1&limit=50&survey_type=CAPI_QC`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (!res.ok) return;
        const json = await res.json();
        if (json?.data?.data) setQcApiItems(json.data.data);
      } catch (err) {
        console.error('Failed to fetch qcApiItems', err);
      } finally {
        setIsLoadingQcItems(false);
      }
    };
    fetchQcItems();
  }, []);

  // Filter CAPI items from the fetched API list
  const capiItems = useMemo(() => apiItems.filter(item => String(item.survey_type).toUpperCase().startsWith('CAPI') && !String(item.title).toLowerCase().includes('qc')), [apiItems]);
  const qcItems = useMemo(() => {
    const fromApi = apiItems.filter(item => String(item.title).toLowerCase().includes('qc') || String(item.survey_type).toUpperCase().includes('QC'));
    const combined = [...(qcApiItems || []), ...fromApi];
    // Deduplicate by id
    const map = new Map<number, DownloadItem>();
    combined.forEach(it => map.set(it.id, it));
    return Array.from(map.values());
  }, [apiItems, qcApiItems]);


  // API-driven download using URL from /api/download-items (with fallback)
  const apiDownload = async (id: number, apiPath: string | null, method: string = 'GET', params: any = null) => {
    try {
      setDownloadingId(id);
      setStatusMessage(null);
      setDownloadError(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setDownloadError(prev => ({ ...prev, [id]: 'Authentication token not found' }));
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      // Diagnostics: log available apiItems and incoming apiPath
      console.log('CAPI apiItems count:', apiItems.length);
      console.log('apiPath provided to apiDownload:', apiPath);

      // Use apiPath if available; otherwise fail gracefully
      if (!apiPath) {
        console.warn('CAPI download: no apiPath. Cannot proceed.');
        setDownloadError(prev => ({ ...prev, [id]: 'Download URL not available' }));
        setStatusMessage({ type: 'error', message: 'File not found' });
        return;
      }

      let downloadUrl = apiPath && apiPath.startsWith('http') ? apiPath : `${apiBaseUrl}${apiPath}`;
      // If GET method and params provided as object, append as query string
      if (method === 'GET' && params && typeof params === 'object') {
        const paramsObj = params as Record<string, string | number>;
        const searchParams = new URLSearchParams();
        Object.keys(paramsObj).forEach(key => searchParams.append(key, String(paramsObj[key])));
        const queryStr = searchParams.toString();
        downloadUrl += queryStr ? (downloadUrl.includes('?') ? '&' : '?') + queryStr : '';
      }
      console.log('CAPI Download URL:', downloadUrl);
      const headers: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: '*/*' };
      const options: RequestInit = { method, headers };
      if (method !== 'GET' && params) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(params);
      }
      const res = await fetch(downloadUrl, options);

      if (!res.ok) {
        // backend returns JSON error when file missing
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          // Just show 'File not found' instead of full message
          setDownloadError(prev => ({ ...prev, [id]: 'File not found' }));
          setStatusMessage({ type: 'error', message: 'File not found' });
        } else {
          setDownloadError(prev => ({ ...prev, [id]: `Download failed: ${res.status}` }));
          setStatusMessage({ type: 'error', message: 'File not found' });
        }
        return;
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        // Just show 'File not found' instead of full message
        setDownloadError(prev => ({ ...prev, [id]: 'File not found' }));
        setStatusMessage({ type: 'error', message: 'File not found' });
        return;
      }

      const blob = await res.blob();
      const fileName = (apiPath || '').split('/').pop() || `download_${id}.zip`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      // clear any error
      setDownloadError(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setStatusMessage({ type: 'success', message: 'Download data successfully' });
    } catch (err) {
      console.error('API download error', err);
      setDownloadError(prev => ({ ...prev, [id]: 'File not found' }));
      setStatusMessage({ type: 'error', message: 'File not found' });
    } finally {
      setDownloadingId(null);
    }
  };

  // Instance data is now driven by API response: `capiItems` (filtered by survey_type === 'CAPI')


  // QC items are derived from API response (filtered as `qcItems`).

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Raw Data Download (CAPI)
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
              INSTANCE DATA DOWNLOAD (CAPI)
            </Heading>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {isLoadingApiItems ? (
              <div className="py-6 text-center">
                <div className="text-sm text-gray-500">Loading CAPI items...</div>
              </div>
            ) : capiItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-sm text-gray-500">No download items found for CAPI</div>
              </div>
            ) : (
              <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top">
                <thead>
                  <tr>
                    <th className="text-center font-semibold text-gray-800 dark:text-gray-200 w-1/2">Action</th>
                    <th className="text-center font-semibold text-gray-800 dark:text-gray-200 w-1/2" >Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {capiItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-gray-900 dark:text-gray-100 text-left font-medium">{item.title}
                      </td>
                      <td className="text-center relative">
                        <div className="flex items-center justify-center">
                          <div>
                            <button
                              onClick={() => apiDownload(item.id, item.api.url, item.api.method, item.api.params)}
                              disabled={downloadingId === item.id || item.status !== 1}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Download className="w-4 h-4" />
                              {downloadingId === item.id ? 'Downloading...' : 'Download'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="card-header pb-0">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <Heading level={4} className="card-title mg-b-0 text-lg font-semibold text-gray-900 dark:text-white">
              INSTANCE DATA DOWNLOAD (QC DATA)
            </Heading>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {isLoadingQcItems ? (
              <div className="py-6 text-center">
                <div className="text-sm text-gray-500">Loading QC items...</div>
              </div>
            ) : qcItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-sm text-gray-500">No QC items found for CAPI</div>
              </div>
            ) : (
              <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top">
                <thead>
                  <tr>
                    <th className="text-center font-semibold text-gray-800 dark:text-gray-200 w-1/2">Action</th>
                    <th className="text-center font-semibold text-gray-800 dark:text-gray-200 w-1/2">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {qcItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-gray-900 dark:text-gray-100 text-left font-medium">{item.title}
                      </td>
                      <td className="text-left">
                        <div className="flex items-center justify-center">
                          <div>
                            <button
                              onClick={() => apiDownload(item.id, item.api.url, item.api.method, item.api.params)}
                              disabled={downloadingId === item.id || item.status !== 1}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Download className="w-4 h-4" />
                              {downloadingId === item.id ? 'Downloading...' : 'Download'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </Card>

    </Container>
  );
};

export default CapiDataPage;
