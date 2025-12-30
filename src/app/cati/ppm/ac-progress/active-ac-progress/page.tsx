'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, CreditCard } from 'lucide-react';

// Interfaces
interface ACProgressData {
  id: number;
  acName: string;
  acCode: string;
  totalNumbers: number;
  numberAssigned: number;
  numberPending: number;
  numberExhausted: number;
  successfulInterviews: number;
  numberDoesNotExist: number;
  respondentDidNotPick: number;
  pickedAndRefused: number;
  dataAvailable: number;
  dataInFile: number;
}

const ActiveACProgressPage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Empty data for Active AC Progress (no active ACs currently)
  const [acProgressData] = useState<ACProgressData[]>([]);

  // Performance metrics data (mostly empty for active ACs)
  const numberSummaryMetrics = {
    totalNumbers: 0,
    numberAssigned: 0,
    numberPending: 0,
    numberExhausted: 0,
  };

  const callOutcomeMetrics = {
    numberDoesNotExist: 0,
    respondentDidNotPick: 0,
    pickedAndRefused: 0,
    successfulInterviews: 0,
  };

  const handleDownload = () => {
    console.log('Download Active AC Progress data');
  };

  // Pagination calculations
  const totalItems = acProgressData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = acProgressData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Active AC Progress
        </Heading>
      </div>

      {/* Performance Metrics Cards */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Number Summary */}
          <div>
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Number Summary
                </Heading>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Numbers */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Total Numbers</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.totalNumbers.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Number Assigned */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Assigned</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.numberAssigned.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Number Pending */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Pending</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.numberPending.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Number Exhausted */}
              <div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Exhausted</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {numberSummaryMetrics.numberExhausted.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call Outcome */}
          <div>
            <div className="mb-4">
              <Heading level={4} className="text-lg font-semibold text-gray-900">
                Call Outcome
              </Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number Does Not Exist */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Number Does Not Exist</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.numberDoesNotExist.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Respondent Did Not Pick */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Respondent Did Not Pick</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.respondentDidNotPick.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Picked And Refused */}
              <div className="border-r border-gray-200 pr-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Picked And Refused</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.pickedAndRefused.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Successful Interviews */}
              <div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text className="text-sm text-gray-600 mb-1">Successful Interviews</Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {callOutcomeMetrics.successfulInterviews.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Master AC Progress Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Master AC Progress
            </Heading>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">AC Name</th>
                  <th className="text-center">AC Code</th>
                  <th className="text-center">Total Numbers</th>
                  <th className="text-center">Number Assigned</th>
                  <th className="text-center">Number Pending</th>
                  <th className="text-center">Number Exhausted</th>
                  <th className="text-center">Successful Interviews</th>
                  <th className="text-center">Number does not exist</th>
                  <th className="text-center">Respondent did not pick</th>
                  <th className="text-center">Picked and Refused</th>
                  <th className="text-center">Data Available</th>
                  <th className="text-center">Data in File</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-8 text-gray-500">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{item.acName}</td>
                      <td className="text-center">{item.acCode}</td>
                      <td className="text-center">{item.totalNumbers.toLocaleString()}</td>
                      <td className="text-center">{item.numberAssigned.toLocaleString()}</td>
                      <td className="text-center">{item.numberPending.toLocaleString()}</td>
                      <td className="text-center">{item.numberExhausted.toLocaleString()}</td>
                      <td className="text-center">{item.successfulInterviews.toLocaleString()}</td>
                      <td className="text-center">{item.numberDoesNotExist.toLocaleString()}</td>
                      <td className="text-center">{item.respondentDidNotPick.toLocaleString()}</td>
                      <td className="text-center">{item.pickedAndRefused.toLocaleString()}</td>
                      <td className="text-center">{item.dataAvailable.toLocaleString()}</td>
                      <td className="text-center">{item.dataInFile.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default ActiveACProgressPage;
