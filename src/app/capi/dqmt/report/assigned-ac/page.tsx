'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';

interface AssignedACData {
  id: number;
  qcId: number;
  qcUserName: string;
  acCode: number;
  acName: string;
  interviewerId: number;
}

export default function AssignedACPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data based on the provided HTML
  const assignedACData: AssignedACData[] = [
    // QC ID 109 - Kundan
    { id: 1, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 101 },
    { id: 2, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 102 },
    { id: 3, qcId: 109, qcUserName: 'Kundan', acCode: 1, acName: 'Valmiki Nagar', interviewerId: 104 },
    
    // QC ID 120 - Supriya
    { id: 4, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 1182 },
    { id: 5, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4002 },
    { id: 6, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4003 },
    { id: 7, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4010 },
    { id: 8, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4013 },
    { id: 9, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 503 },
    { id: 10, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6006 },
    { id: 11, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6007 },
    { id: 12, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6016 },
    { id: 13, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6017 },
    { id: 14, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6020 },
    { id: 15, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6021 },
    { id: 16, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6022 },
    { id: 17, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 1180 },
    { id: 18, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 1181 },
    { id: 19, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 205 },
    { id: 20, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 206 },
    { id: 21, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 266 },
    { id: 22, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 279 },
    { id: 23, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 280 },
    { id: 24, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4004 },
    { id: 25, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4005 },
    { id: 26, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4008 },
    { id: 27, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4014 },
    { id: 28, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 4015 },
    { id: 29, qcId: 120, qcUserName: 'Supriya', acCode: 132, acName: 'Warisnagar', interviewerId: 6018 },
    
    // QC ID 127 - Faizal Saifi
    { id: 30, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 244 },
    { id: 31, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 245 },
    { id: 32, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 236 },
    { id: 33, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 238 },
    { id: 34, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 237 },
    { id: 35, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 239 },
    { id: 36, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 240 },
    { id: 37, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 243 },
    { id: 38, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 212 },
    { id: 39, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 605 },
    { id: 40, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 246 },
    { id: 41, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1175 },
    { id: 42, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1180 },
    { id: 43, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1182 },
    { id: 44, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1183 },
    { id: 45, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1191 },
    { id: 46, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1902 },
    { id: 47, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1905 },
    { id: 48, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1921 },
    { id: 49, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 193 },
    { id: 50, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1930 },
    { id: 51, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1931 },
    { id: 52, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1934 },
    { id: 53, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 2006 },
    { id: 54, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 211 },
    { id: 55, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 214 },
    { id: 56, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 503 },
    { id: 57, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 6008 },
    { id: 58, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 6017 },
    { id: 59, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 6018 },
    { id: 60, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 6021 },
    { id: 61, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 6023 },
    { id: 62, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1924 },
    { id: 63, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 1932 },
    { id: 64, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 266 },
    { id: 65, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 280 },
    { id: 66, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 7002 },
    { id: 67, qcId: 127, qcUserName: 'Faizal Saifi', acCode: 23, acName: 'Riga', interviewerId: 7005 },
    
    // QC ID 137 - Muskan Siddiqui
    { id: 68, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 454 },
    { id: 69, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 467 },
    { id: 70, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 875 },
    { id: 71, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 881 },
    { id: 72, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 882 },
    { id: 73, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 883 },
    { id: 74, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 890 },
    { id: 75, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 891 },
    { id: 76, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 898 },
    { id: 77, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 167, acName: 'Suryagarha', interviewerId: 1084 },
    { id: 78, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 167, acName: 'Suryagarha', interviewerId: 1082 },
    { id: 79, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 167, acName: 'Suryagarha', interviewerId: 108 },
    { id: 80, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1052 },
    { id: 81, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1058 },
    { id: 82, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1059 },
    { id: 83, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1061 },
    { id: 84, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1062 },
    { id: 85, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1069 },
    { id: 86, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 167, acName: 'Suryagarha', interviewerId: 1085 },
    { id: 87, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 167, acName: 'Suryagarha', interviewerId: 1081 },
    { id: 88, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 167, acName: 'Suryagarha', interviewerId: 1083 },
    { id: 89, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1053 },
    { id: 90, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1060 },
    { id: 91, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1063 },
    { id: 92, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1064 },
    { id: 93, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 1559 },
    { id: 94, qcId: 137, qcUserName: 'Muskan Siddiqui', acCode: 190, acName: 'Paliganj', interviewerId: 810 },
  ];

  const totalPages = Math.ceil(assignedACData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = assignedACData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              Assigned AC
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Assigned AC Table */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  Assigned AC
                </Heading>
                <span className="text-end"></span>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC User Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Interviewer ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.qcId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{data.qcUserName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.acCode}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.acName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.interviewerId}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, assignedACData.length)}</span> of <span className="font-semibold">{assignedACData.length}</span> items
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={assignedACData.length}
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
