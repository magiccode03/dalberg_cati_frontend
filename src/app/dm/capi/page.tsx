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
}

const CapiDataPage = () => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [, setDownloadError] = useState<{ [key: number]: string }>({});
  const [apiItems, setApiItems] = useState<DownloadItem[]>([]);
  const [isLoadingApiItems, setIsLoadingApiItems] = useState(false);
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
        const res = await fetch(`${apiBaseUrl}/api/download-items?page=1&limit=50`, {
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

  // Precompute CAPI-only API URLs by intent
  const capiApiUrls = useMemo(() => {
    const capiItems = apiItems.filter(item => item.title?.toLowerCase().includes('capi'));
    const findBy = (predicate: (title: string) => boolean) =>
      capiItems.find(item => predicate(item.title.toLowerCase()))?.api?.url || null;

    return {
      all: findBy(title => title.includes('download all instance') && !title.includes('mobile')),
      valid: findBy(title => title.includes('valid instance') && !title.includes('mobile')),
      rejected: findBy(title => title.includes('rejected') && !title.includes('mobile')),
      allMobile:
        findBy(
          title =>
            title.includes('all instance') &&
            title.includes('mobile') &&
            !title.includes('rejected') &&
            !title.includes('valid')
        ) || '/api/capi/instance/download/capi_all_instance_with_mobileno_data.zip',
      validMobile: findBy(title => title.includes('valid instance') && title.includes('mobile')),
      rejectedMobile: findBy(title => title.includes('rejected') && title.includes('mobile')),
      qc: findBy(title => title.includes('qc data')),
    };
  }, [apiItems]);

  // existing direct-download helper for non-API buttons (keep current behavior)
  const handleDownload = (url: string) => {
    console.log('Downloading (direct):', url);
    setStatusMessage(null);
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; // tell browser to download if possible
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', message: 'Download data successfully' });
  };

  // API-driven download using URL from /api/download-items (with fallback)
  const apiDownload = async (id: number, apiPath: string | null) => {
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

      const downloadUrl = `${apiBaseUrl}${apiPath}`;
      console.log('CAPI Download URL:', downloadUrl);
      const res = await fetch(downloadUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
      });

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
      const fileName = apiPath.split('/').pop() || `download_${id}.zip`;
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

  const instanceData = [
    {
      id: 1,
      action: 'Download All Instance (.sav File)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=all_spss',
    },
    {
      id: 2,
      action: 'Download All Instance',
      overallUrl: '/bh/poll202504/pmt/download/instanceall',
    },
    {
      id: 4,
      action: 'Download Valid Instance',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=valid',
    },
    {
      id: 5,
      action: 'Download Rejected (all) Instance',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=reject',
    },
    {
      id: 6,
      action: 'Download All Instance (With Mobile Number)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=all_mobile',
    },
    {
      id: 7,
      action: 'Download Valid Instance (With Mobile Number)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=valid_mobile',
    },
    {
      id: 8,
      action: 'Download Rejected (all) Instance (With Mobile Number)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=reject_mobile',
    }
  ];


  const qcData = [
    {
      id: 1,
      action: 'QC Data Download',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=all_spss',
    },
   
  ];

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
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-gray-800 dark:text-gray-200">Action</th>
                  <th className="text-left font-semibold text-gray-800 dark:text-gray-200" style={{width: '15%'}}>Overall</th>
                  {/* <th className="text-left font-semibold text-gray-800 dark:text-gray-200" style={{width: '15%'}}>Yesterday (15-10-2025)</th> */}
                </tr>
              </thead>
              <tbody>
                {instanceData.map((item) => (
                  <tr key={item.id}>
                    <td className="text-gray-900 dark:text-gray-100 text-left font-medium">{item.action}</td>
                    <td className="text-left relative">
                      <div>
                        {/* For these three ids (2=all,4=valid,5=rejected) use API-driven download */}
                        {item.id === 2 || item.id === 4 || item.id === 5 ? (
                          <>
                            <button
                              onClick={() => {
                                if (item.id === 2) {
                                  apiDownload(item.id, capiApiUrls.all);
                                  return;
                                }
                                if (item.id === 4) {
                                  apiDownload(item.id, capiApiUrls.valid);
                                  return;
                                }
                                if (item.id === 5) {
                                  apiDownload(item.id, capiApiUrls.rejected);
                                  return;
                                }
                              }}
                              disabled={downloadingId === item.id}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Download className="w-4 h-4" />
                              {downloadingId === item.id ? 'Downloading...' : 'Download'}
                            </button>
                          </>
                        ) : item.id === 6 || item.id === 7 || item.id === 8 ? (
                          <button
                            onClick={() => {
                              if (item.id === 6) {
                                apiDownload(item.id, capiApiUrls.allMobile);
                                return;
                              }
                              if (item.id === 7) {
                                apiDownload(item.id, capiApiUrls.validMobile);
                                return;
                              }
                              if (item.id === 8) {
                                apiDownload(item.id, capiApiUrls.rejectedMobile);
                                return;
                              }
                            }}
                            disabled={downloadingId === item.id}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4" />
                            {downloadingId === item.id ? 'Downloading...' : 'Download'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDownload(item.overallUrl)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
            <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-gray-800 dark:text-gray-200">Action</th>
                  <th className="text-left font-semibold text-gray-800 dark:text-gray-200" style={{width: '15%'}}>Overall</th>
                  {/* <th className="text-left font-semibold text-gray-800 dark:text-gray-200" style={{width: '15%'}}>Yesterday (15-10-2025)</th> */}
                </tr>
              </thead>
              <tbody>
                {qcData.map((item) => (
                  <tr key={item.id}>
                    <td className="text-gray-900 dark:text-gray-100 text-left font-medium">{item.action}</td>
                    <td className="text-left">
                      <button
                        onClick={() => apiDownload(item.id, capiApiUrls.qc)}
                        disabled={downloadingId === item.id}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        {downloadingId === item.id ? 'Downloading...' : 'Download'}
                      </button>
                    </td>
                    {/* <td className="text-left">
                      {item.yesterdayUrl ? (
                        <button
                          onClick={() => handleDownload(item.yesterdayUrl!)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>

    </Container>
  );
};

export default CapiDataPage;
