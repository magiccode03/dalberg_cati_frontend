'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import { Download } from 'lucide-react';

const CapiDataPage = () => {
  const handleDownload = (url: string) => {
    console.log('Downloading:', url);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; // This tells the browser to download instead of navigate
    link.target = '_blank'; // Open in new tab as fallback
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const instanceData = [
    {
      id: 1,
      action: 'Download All Instance (.sav File)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=all_spss',
      yesterdayUrl: null
    },
    {
      id: 2,
      action: 'Download All Instance',
      overallUrl: '/bh/poll202504/pmt/download/instanceall',
      yesterdayUrl: '/bh/poll202504/pmt/download/instance?extra=yesterday'
    },
    {
      id: 4,
      action: 'Download Valid Instance',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=valid',
      yesterdayUrl: '/bh/poll202504/pmt/download/instance?type=valid&extra=yesterday'
    },
    {
      id: 5,
      action: 'Download Rejected (all) Instance',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=reject',
      yesterdayUrl: '/bh/poll202504/pmt/download/instance?type=reject&extra=yesterday'
    },
    {
      id: 6,
      action: 'Download All Instance (With Mobile Number)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=all_mobile',
      yesterdayUrl: '/bh/poll202504/pmt/download/instance?extra=yesterday'
    },
    {
      id: 7,
      action: 'Download Valid Instance (With Mobile Number)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=valid_mobile',
      yesterdayUrl: '/bh/poll202504/pmt/download/instance?type=valid&extra=yesterday'
    },
    {
      id: 8,
      action: 'Download Rejected (all) Instance (With Mobile Number)',
      overallUrl: '/bh/poll202504/pmt/download/instanceall?type=reject_mobile',
      yesterdayUrl: '/bh/poll202504/pmt/download/instance?type=reject&extra=yesterday'
    }
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
                  <th className="text-left font-semibold text-gray-800 dark:text-gray-200" style={{width: '15%'}}>Yesterday (15-10-2025)</th>
                </tr>
              </thead>
              <tbody>
                {instanceData.map((item) => (
                  <tr key={item.id}>
                    <td className="text-gray-900 dark:text-gray-100 text-left font-medium">{item.action}</td>
                    <td className="text-left">
                      <button
                        onClick={() => handleDownload(item.overallUrl)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                    <td className="text-left">
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
                    </td>
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
