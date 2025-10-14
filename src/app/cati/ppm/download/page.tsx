'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import { Download } from 'lucide-react';

const DownloadPage = () => {
  const handleDownload = (type: string, extra?: string, qc?: string) => {
    console.log('Download:', { type, extra, qc });
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Download
        </Heading>
      </div>

      {/* Raw Data Download Table */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900">
              Raw Data Download
            </Heading>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Action</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Overall (Successful)</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Overall</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Yesterday (29-09-2025)</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Today (30-09-2025)</th>
              </tr>
            </thead>
            <tbody>
              {/* Download All Interviews */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">Download All Interviews</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('successful')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Successful Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download All Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all', 'yesterday')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Yesterday's Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all', 'today')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Today's Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
              </tr>

              {/* Download QC Interviews */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">Download QC Interviews</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="text-gray-400">-</span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all_qc')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download QC Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all', 'yesterday', '1')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Yesterday's QC Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all', 'today', '1')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Today's QC Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
              </tr>

              {/* Download Re-QC Interviews */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">Download Re-QC Interviews</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="text-gray-400">-</span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all_re_qc')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Re-QC Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all', 'yesterday', '2')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Yesterday's Re-QC Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('all', 'today', '2')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download Today's Re-QC Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
              </tr>

              {/* Download All Interviews (CAPI) */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">Download All Interviews (CAPI)</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="text-gray-400">-</span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDownload('capi')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Download CAPI Interviews"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="text-gray-400">-</span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default DownloadPage;
