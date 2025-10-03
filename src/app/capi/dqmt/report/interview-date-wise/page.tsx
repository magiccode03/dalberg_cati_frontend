'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download } from 'lucide-react';

interface InterviewDateWiseData {
  id: number;
  interviewDate: string;
  totalInterview: number;
  validInterview: number;
  rejectInterview: number;
  qcAssigned: number;
  qcPending: number;
  qcCompleted: number;
}

export default function InterviewDateWisePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data based on the provided HTML
  const interviewDateWiseData: InterviewDateWiseData[] = [
    { id: 1, interviewDate: '2025-06-17', totalInterview: 1, validInterview: 0, rejectInterview: 0, qcAssigned: 0, qcPending: 0, qcCompleted: 0 },
    { id: 2, interviewDate: '2025-06-15', totalInterview: 6, validInterview: 0, rejectInterview: 6, qcAssigned: 0, qcPending: 0, qcCompleted: 0 },
    { id: 3, interviewDate: '2025-06-14', totalInterview: 17, validInterview: 0, rejectInterview: 17, qcAssigned: 9, qcPending: 0, qcCompleted: 9 },
    { id: 4, interviewDate: '2025-06-13', totalInterview: 28, validInterview: 0, rejectInterview: 28, qcAssigned: 15, qcPending: 0, qcCompleted: 15 },
    { id: 5, interviewDate: '2025-06-12', totalInterview: 1042, validInterview: 359, rejectInterview: 681, qcAssigned: 863, qcPending: 0, qcCompleted: 863 },
    { id: 6, interviewDate: '2025-06-11', totalInterview: 1426, validInterview: 561, rejectInterview: 863, qcAssigned: 1179, qcPending: 0, qcCompleted: 1179 },
    { id: 7, interviewDate: '2025-06-10', totalInterview: 1547, validInterview: 653, rejectInterview: 884, qcAssigned: 1247, qcPending: 0, qcCompleted: 1247 },
    { id: 8, interviewDate: '2025-06-09', totalInterview: 963, validInterview: 447, rejectInterview: 515, qcAssigned: 749, qcPending: 0, qcCompleted: 749 },
    { id: 9, interviewDate: '2025-06-08', totalInterview: 1096, validInterview: 323, rejectInterview: 766, qcAssigned: 829, qcPending: 0, qcCompleted: 829 },
    { id: 10, interviewDate: '2025-06-07', totalInterview: 1217, validInterview: 357, rejectInterview: 854, qcAssigned: 955, qcPending: 0, qcCompleted: 955 },
    { id: 11, interviewDate: '2025-06-06', totalInterview: 887, validInterview: 247, rejectInterview: 633, qcAssigned: 700, qcPending: 0, qcCompleted: 700 },
    { id: 12, interviewDate: '2025-06-05', totalInterview: 933, validInterview: 218, rejectInterview: 709, qcAssigned: 702, qcPending: 0, qcCompleted: 702 },
    { id: 13, interviewDate: '2025-06-04', totalInterview: 688, validInterview: 225, rejectInterview: 459, qcAssigned: 473, qcPending: 0, qcCompleted: 473 },
    { id: 14, interviewDate: '2025-06-03', totalInterview: 720, validInterview: 166, rejectInterview: 541, qcAssigned: 546, qcPending: 0, qcCompleted: 546 },
    { id: 15, interviewDate: '2025-06-02', totalInterview: 905, validInterview: 316, rejectInterview: 576, qcAssigned: 766, qcPending: 0, qcCompleted: 766 },
    { id: 16, interviewDate: '2025-06-01', totalInterview: 1602, validInterview: 495, rejectInterview: 1090, qcAssigned: 1420, qcPending: 0, qcCompleted: 1420 },
    { id: 17, interviewDate: '2025-05-31', totalInterview: 1268, validInterview: 460, rejectInterview: 791, qcAssigned: 1179, qcPending: 0, qcCompleted: 1179 },
    { id: 18, interviewDate: '2025-05-30', totalInterview: 1164, validInterview: 408, rejectInterview: 753, qcAssigned: 1038, qcPending: 0, qcCompleted: 1038 },
    { id: 19, interviewDate: '2025-05-29', totalInterview: 1481, validInterview: 526, rejectInterview: 944, qcAssigned: 1323, qcPending: 0, qcCompleted: 1323 },
    { id: 20, interviewDate: '2025-05-28', totalInterview: 1184, validInterview: 433, rejectInterview: 741, qcAssigned: 1040, qcPending: 0, qcCompleted: 1040 },
  ];

  const handleDownload = () => {
    console.log('Download report');
  };

  const handleDateClick = (date: string) => {
    console.log('Navigate to interview details for date:', date);
  };

  const totalPages = Math.ceil(interviewDateWiseData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = interviewDateWiseData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Interview Date Wise
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Interview Date Wise Report
                </Heading>
                <div className="text-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interview Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Total Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Valid Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Reject Interview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Assigned</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Pending</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC Completed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleDateClick(data.interviewDate)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {data.interviewDate}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.totalInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.validInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.rejectInterview.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcAssigned.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcPending.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcCompleted.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, interviewDateWiseData.length)}</span> of <span className="font-semibold">{interviewDateWiseData.length}</span> results
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={interviewDateWiseData.length}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
