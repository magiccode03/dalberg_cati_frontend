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
  const [pageSize] = useState(25);

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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">
              AC Wise - Pending Data
            </Heading>
          </div>
        </div>

        {/* Main Content */}
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending QC Data AC Wise
              </Heading>
            </div>
          </div>
          
          <div className="bg-white">
            <div className="mb-4">
              <Text className="text-sm text-gray-600">
                Total <strong>{acWisePendingData.length.toLocaleString()}</strong> items.
              </Text>
            </div>
            
            <div className="table-responsive">
              <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                <thead className="table-light bg-gray-50">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th className="text-center">AC Code</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">Pending Interview</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((acData, index) => (
                    <tr key={acData.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-center font-mono font-semibold">{acData.acCode}</td>
                      <td className="text-left">{acData.acName}</td>
                      <td className="text-center">{acData.pendingInterview.toLocaleString()}</td>
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
                totalItems={acWisePendingData.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </Card>
    </Container>
  );
}
