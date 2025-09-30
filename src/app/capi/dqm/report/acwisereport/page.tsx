'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';

interface ACWiseReportData {
  id: number;
  sNo: number;
  acCode: number;
  name: string;
  agencyName: string;
  sample: number;
  checker: string;
  alloted: number;
  completed: number;
  accepted: number;
  rejected: number;
  underQc: number;
}

export default function ACWiseReportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data based on the provided HTML
  const acWiseReportData: ACWiseReportData[] = [
    { id: 1, sNo: 1, acCode: 0, name: 'Bihar', agencyName: '', sample: 300, checker: '', alloted: 0, completed: 0, accepted: 0, rejected: 0, underQc: 0 },
    { id: 2, sNo: 2, acCode: 1, name: 'Valmiki Nagar', agencyName: 'Parbhat', sample: 300, checker: '122, 116', alloted: 330, completed: 0, accepted: 310, rejected: 9, underQc: 0 },
    { id: 3, sNo: 3, acCode: 2, name: 'Ramnagar (SC)', agencyName: 'Parbhat', sample: 300, checker: '101, 127, 139', alloted: 395, completed: 0, accepted: 346, rejected: 30, underQc: 0 },
    { id: 4, sNo: 4, acCode: 3, name: 'Narkatiaganj', agencyName: 'Parbhat', sample: 300, checker: '110, 103, 120, 140', alloted: 400, completed: 0, accepted: 315, rejected: 73, underQc: 0 },
    { id: 5, sNo: 5, acCode: 4, name: 'Bagaha', agencyName: 'Parbhat', sample: 300, checker: '116, 127, 128', alloted: 345, completed: 0, accepted: 306, rejected: 27, underQc: 0 },
    { id: 6, sNo: 6, acCode: 5, name: 'Lauriya', agencyName: 'Parbhat', sample: 300, checker: '103, 102, 108, 106, 136', alloted: 462, completed: 0, accepted: 391, rejected: 41, underQc: 0 },
    { id: 7, sNo: 7, acCode: 6, name: 'Nautan', agencyName: 'Parbhat', sample: 300, checker: '105, 109, 136', alloted: 408, completed: 0, accepted: 332, rejected: 65, underQc: 0 },
    { id: 8, sNo: 8, acCode: 7, name: 'Chanpatia', agencyName: 'Parbhat', sample: 300, checker: '109, 114, 119, 137', alloted: 388, completed: 0, accepted: 320, rejected: 46, underQc: 0 },
    { id: 9, sNo: 9, acCode: 8, name: 'Bettiah', agencyName: 'Parbhat', sample: 300, checker: '105, 106, 101, 121, 109, 116', alloted: 738, completed: 0, accepted: 356, rejected: 57, underQc: 0 },
    { id: 10, sNo: 10, acCode: 9, name: 'Sikta', agencyName: 'Parbhat', sample: 300, checker: '120, 117', alloted: 393, completed: 0, accepted: 349, rejected: 13, underQc: 0 },
    { id: 11, sNo: 11, acCode: 10, name: 'Raxaul', agencyName: 'Parbhat', sample: 300, checker: '109, 129, 138, 121', alloted: 447, completed: 0, accepted: 336, rejected: 92, underQc: 0 },
    { id: 12, sNo: 12, acCode: 11, name: 'Sugauli', agencyName: 'Parbhat', sample: 300, checker: '101, 109, 105, 122, 116, 136', alloted: 466, completed: 0, accepted: 243, rejected: 177, underQc: 0 },
    { id: 13, sNo: 13, acCode: 12, name: 'Narkatia', agencyName: 'Parbhat', sample: 300, checker: '130, 119', alloted: 325, completed: 0, accepted: 303, rejected: 8, underQc: 0 },
    { id: 14, sNo: 14, acCode: 13, name: 'Harsidhi (SC)', agencyName: 'Inhouse', sample: 300, checker: '1002, 119, 1011, 1007', alloted: 361, completed: 0, accepted: 169, rejected: 99, underQc: 0 },
    { id: 15, sNo: 15, acCode: 14, name: 'Govindganj', agencyName: 'Inhouse', sample: 300, checker: '1001, 137, 1004, 121', alloted: 352, completed: 0, accepted: 145, rejected: 141, underQc: 0 },
    { id: 16, sNo: 16, acCode: 15, name: 'Kesaria', agencyName: 'Kadence', sample: 300, checker: '2003, 2006, 1001, 2016, 1010', alloted: 575, completed: 0, accepted: 309, rejected: 194, underQc: 0 },
    { id: 17, sNo: 17, acCode: 16, name: 'Kalyanpur', agencyName: 'Inhouse', sample: 300, checker: '140, 117, 136, 122, 130', alloted: 518, completed: 0, accepted: 191, rejected: 268, underQc: 0 },
    { id: 18, sNo: 18, acCode: 17, name: 'Pipra', agencyName: 'Inhouse', sample: 300, checker: '138, 127, 119, 130', alloted: 573, completed: 0, accepted: 188, rejected: 232, underQc: 0 },
    { id: 19, sNo: 19, acCode: 18, name: 'Madhuban', agencyName: 'Navin', sample: 300, checker: '121', alloted: 313, completed: 0, accepted: 196, rejected: 115, underQc: 0 },
    { id: 20, sNo: 20, acCode: 19, name: 'Motihari', agencyName: 'Inhouse', sample: 300, checker: '122, 1001, 1002, 1010', alloted: 356, completed: 0, accepted: 111, rejected: 201, underQc: 0 },
  ];


  const getAgencyBadge = (agencyName: string) => {
    if (!agencyName) return <span className="text-gray-400">-</span>;
    
    const agencyColors: { [key: string]: string } = {
      'Parbhat': 'bg-blue-100 text-blue-800',
      'Inhouse': 'bg-green-100 text-green-800',
      'Kadence': 'bg-purple-100 text-purple-800',
      'Navin': 'bg-orange-100 text-orange-800',
    };
    
    const colorClass = agencyColors[agencyName] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {agencyName}
      </span>
    );
  };

  const totalPages = Math.ceil(acWiseReportData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = acWiseReportData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              AC Wise Report
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>


        {/* AC Wise Report Table */}
        <div className="w-full">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900">
                  AC Wise Report
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">S.No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">AC Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Agency Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Sample</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Checker</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Alloted</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Completed</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Accepted</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Rejected</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Under QC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.sNo}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.acCode}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{data.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getAgencyBadge(data.agencyName)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.sample.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.checker || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.alloted.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{data.completed.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-green-600 font-medium">{data.accepted.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-red-600 font-medium">{data.rejected.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-blue-600 font-medium">{data.underQc.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, acWiseReportData.length)}</span> of <span className="font-semibold">{acWiseReportData.length}</span> items
                </div>
                <div>
                  <PaginationStandard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={acWiseReportData.length}
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
