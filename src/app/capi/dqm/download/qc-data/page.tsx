'use client';

import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import { Download } from 'lucide-react';

export default function QCDataPage() {
  const handleDownload = (url: string) => {
    console.log('Downloading:', url);
    // In a real application, this would trigger the actual download
    window.open(url, '_blank');
  };

  const downloadData = [
    {
      id: 1,
      action: 'Download All Interviews',
      overallUrl: '/bh/poll202504/dataquality/download/interviewall',
      yesterdayUrl: '/bh/poll202504/dataquality/download/interview?extra=yesterday'
    },
    {
      id: 2,
      action: 'Download Valid Interviews',
      overallUrl: '/bh/poll202504/dataquality/download/interviewall?type=valid',
      yesterdayUrl: '/bh/poll202504/dataquality/download/interview?type=valid&extra=yesterday'
    },
    {
      id: 3,
      action: 'Download Rejected (all) Interviews',
      overallUrl: '/bh/poll202504/dataquality/download/interviewall?type=reject',
      yesterdayUrl: '/bh/poll202504/dataquality/download/interview?type=reject&extra=yesterday'
    },
    {
      id: 4,
      action: 'Download All (QC) Interviews',
      overallUrl: '/bh/poll202504/dataquality/download/interviewall?type=qc',
      yesterdayUrl: null
    },
    {
      id: 5,
      action: 'Audio QC Web Form Data',
      overallUrl: '/bh/poll202504/dataquality/download/interviewall?type=audioqcdata',
      yesterdayUrl: null
    }
  ];

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              QC Data
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full">
          <Card className="p-6">
            {/* Card Header */}
            <div className="pb-0 mb-6">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900 mb-0">
                  Interview Data Download
                </Heading>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top">
                <thead>
                  <tr>
                    <th className="text-left font-semibold text-gray-800">Action</th>
                    <th className="text-left font-semibold text-gray-800">Overall</th>
                    <th className="text-left font-semibold text-gray-800">Yesterday (26-09-2025)</th>
                  </tr>
                </thead>
                <tbody>
                  {downloadData.map((item) => (
                    <tr key={item.id}>
                      <td className="text-gray-900 font-medium">{item.action}</td>
                      <td>
                        <button
                          onClick={() => handleDownload(item.overallUrl)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </td>
                      <td>
                        {item.yesterdayUrl ? (
                          <button
                            onClick={() => handleDownload(item.yesterdayUrl!)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
