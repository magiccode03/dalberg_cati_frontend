'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';

interface ACWisePendingData {
  id: number;
  srNo: number;
  acCode: number;
  acName: string;
  pendingInterview: number;
}

export default function ACWisePendingDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data for AC Wise Pending Data
  const acWisePendingData: ACWisePendingData[] = [
    { id: 1, srNo: 1, acCode: 1, acName: 'Valmiki Nagar (1)', pendingInterview: 0 },
    { id: 2, srNo: 2, acCode: 2, acName: 'Ramnagar (SC) (2)', pendingInterview: 0 },
    { id: 3, srNo: 3, acCode: 3, acName: 'Narkatiaganj (3)', pendingInterview: 0 },
    { id: 4, srNo: 4, acCode: 4, acName: 'Bagaha (4)', pendingInterview: 0 },
    { id: 5, srNo: 5, acCode: 5, acName: 'Lauriya (5)', pendingInterview: 0 },
    { id: 6, srNo: 6, acCode: 6, acName: 'Nautan (6)', pendingInterview: 0 },
    { id: 7, srNo: 7, acCode: 7, acName: 'Chanpatia (7)', pendingInterview: 0 },
    { id: 8, srNo: 8, acCode: 8, acName: 'Bettiah (8)', pendingInterview: 0 },
    { id: 9, srNo: 9, acCode: 9, acName: 'Sikta (9)', pendingInterview: 0 },
    { id: 10, srNo: 10, acCode: 10, acName: 'Raxaul (10)', pendingInterview: 0 },
    { id: 11, srNo: 11, acCode: 11, acName: 'Sugauli (11)', pendingInterview: 0 },
    { id: 12, srNo: 12, acCode: 12, acName: 'Narkatia (12)', pendingInterview: 0 },
    { id: 13, srNo: 13, acCode: 13, acName: 'Harsidhi (SC) (13)', pendingInterview: 0 },
    { id: 14, srNo: 14, acCode: 14, acName: 'Govindganj (14)', pendingInterview: 0 },
    { id: 15, srNo: 15, acCode: 15, acName: 'Kesaria (15)', pendingInterview: 0 },
    { id: 16, srNo: 16, acCode: 16, acName: 'Kalyanpur (16)', pendingInterview: 0 },
    { id: 17, srNo: 17, acCode: 17, acName: 'Pipra (17)', pendingInterview: 0 },
    { id: 18, srNo: 18, acCode: 18, acName: 'Madhuban (18)', pendingInterview: 0 },
    { id: 19, srNo: 19, acCode: 19, acName: 'Motihari (19)', pendingInterview: 0 },
    { id: 20, srNo: 20, acCode: 20, acName: 'Chiraia (20)', pendingInterview: 0 },
    { id: 21, srNo: 21, acCode: 21, acName: 'Dhaka (21)', pendingInterview: 0 },
    { id: 22, srNo: 22, acCode: 22, acName: 'Sheohar (22)', pendingInterview: 0 },
    { id: 23, srNo: 23, acCode: 23, acName: 'Riga (23)', pendingInterview: 0 },
    { id: 24, srNo: 24, acCode: 24, acName: 'Bathnaha (SC) (24)', pendingInterview: 0 },
    { id: 25, srNo: 25, acCode: 25, acName: 'Parihar (25)', pendingInterview: 0 },
    { id: 26, srNo: 26, acCode: 26, acName: 'Sursand (26)', pendingInterview: 0 },
    { id: 27, srNo: 27, acCode: 27, acName: 'Bajpatti (27)', pendingInterview: 0 },
    { id: 28, srNo: 28, acCode: 28, acName: 'Sitamarhi (28)', pendingInterview: 0 },
    { id: 29, srNo: 29, acCode: 29, acName: 'Runnisaidpur (29)', pendingInterview: 0 },
    { id: 30, srNo: 30, acCode: 30, acName: 'Belsand (30)', pendingInterview: 0 },
    { id: 31, srNo: 31, acCode: 31, acName: 'Harlakhi (31)', pendingInterview: 0 },
    { id: 32, srNo: 32, acCode: 32, acName: 'Benipatti (32)', pendingInterview: 0 },
    { id: 33, srNo: 33, acCode: 33, acName: 'Khajauli (33)', pendingInterview: 0 },
    { id: 34, srNo: 34, acCode: 34, acName: 'Babubarhi (34)', pendingInterview: 0 },
    { id: 35, srNo: 35, acCode: 35, acName: 'Bisfi (35)', pendingInterview: 0 },
    { id: 36, srNo: 36, acCode: 36, acName: 'Madhubani (36)', pendingInterview: 0 },
    { id: 37, srNo: 37, acCode: 37, acName: 'Rajnagar (SC) (37)', pendingInterview: 0 },
    { id: 38, srNo: 38, acCode: 38, acName: 'Jhanjharpur (38)', pendingInterview: 0 },
    { id: 39, srNo: 39, acCode: 39, acName: 'Phulparas (39)', pendingInterview: 0 },
    { id: 40, srNo: 40, acCode: 40, acName: 'Laukaha (40)', pendingInterview: 0 },
  ];

  const totalPages = Math.ceil(acWisePendingData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = acWisePendingData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              AC Wise - Pending Data
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
                  Pending QC Data AC Wise
                </Heading>
                <div className="text-end">
                  <span></span>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Sr. No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Pending Interview</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((acData) => (
                      <tr key={acData.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{acData.srNo}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{acData.acCode}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{acData.acName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{acData.pendingInterview}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Total <span className="font-semibold">{acWisePendingData.length}</span> items.
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={acWisePendingData.length}
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
