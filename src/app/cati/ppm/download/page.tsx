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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Raw Data Download
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">Action</th>
                  <th className="text-center">Overall (Successful)</th>
                  <th className="text-center">Overall</th>
                  <th className="text-center">Yesterday (29-09-2025)</th>
                  <th className="text-center">Today (30-09-2025)</th>
                </tr>
              </thead>
              <tbody>
                {/* Download All Interviews */}
                <tr>
                  <td className="text-left font-medium">Download All Interviews</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('successful')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Successful Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download All Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all', 'yesterday')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Yesterday's Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all', 'today')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Today's Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                </tr>

                {/* Download QC Interviews */}
                <tr>
                  <td className="text-left font-medium">Download QC Interviews</td>
                  <td className="text-center">
                    <span className="text-gray-400">-</span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all_qc')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download QC Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all', 'yesterday', '1')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Yesterday's QC Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all', 'today', '1')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Today's QC Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                </tr>

                {/* Download Re-QC Interviews */}
                <tr>
                  <td className="text-left font-medium">Download Re-QC Interviews</td>
                  <td className="text-center">
                    <span className="text-gray-400">-</span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all_re_qc')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Re-QC Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all', 'yesterday', '2')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Yesterday's Re-QC Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('all', 'today', '2')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download Today's Re-QC Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                </tr>

                {/* Download All Interviews (CAPI) */}
                <tr>
                  <td className="text-left font-medium">Download All Interviews (CAPI)</td>
                  <td className="text-center">
                    <span className="text-gray-400">-</span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDownload('capi')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                      title="Download CAPI Interviews"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </td>
                  <td className="text-center">
                    <span className="text-gray-400">-</span>
                  </td>
                  <td className="text-center">
                    <span className="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default DownloadPage;
