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
  const [pageSize] = useState(25);

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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
              Interview Date Wise
            </Heading>
          </div>
        </div>

        {/* Main Content */}
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Date Wise Report
              </Heading>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="bg-white">
            <div className="mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{interviewDateWiseData.length.toLocaleString()}</strong> items.
              </Text>
            </div>
            
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">Interview Date</th>
                    <th className="text-center">Total Interview</th>
                    <th className="text-center">Valid Interview</th>
                    <th className="text-center">Reject Interview</th>
                    <th className="text-center">QC Assigned</th>
                    <th className="text-center">QC Pending</th>
                    <th className="text-center">QC Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data, index) => (
                    <tr key={data.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">
                        <button
                          onClick={() => handleDateClick(data.interviewDate)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {data.interviewDate}
                        </button>
                      </td>
                      <td className="text-center font-mono font-semibold">{data.totalInterview.toLocaleString()}</td>
                      <td className="text-center">{data.validInterview.toLocaleString()}</td>
                      <td className="text-center">{data.rejectInterview.toLocaleString()}</td>
                      <td className="text-center">{data.qcAssigned.toLocaleString()}</td>
                      <td className="text-center">{data.qcPending.toLocaleString()}</td>
                      <td className="text-center">{data.qcCompleted.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={interviewDateWiseData.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </Card>
    </Container>
  );
}
