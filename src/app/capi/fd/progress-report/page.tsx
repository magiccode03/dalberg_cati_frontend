'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Badge from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download } from 'lucide-react';

interface ProgressReportData {
  id: string;
  srNo: number;
  acCode: string;
  acName: string;
  pcName: string;
  targetSample: number;
  interviewersWorked: number;
  psCovered: number;
  completedInterviews: number;
  terminatedInterviews: number;
  systemRejections: number;
  countsAfterTerminated: number;
  gpsPending: number;
  gpsFail: number;
  passed: number;
  failed: number;
  underQc: number;
  femaleInterviewsPercent: number;
  withoutPhonePercent: number;
  actualScPercent: number;
  mentionedScPercent: number;
  actualMuslimPercent: number;
  mentionedMuslimPercent: number;
  age18to24Percent: number;
  age50PlusPercent: number;
  isSummary?: boolean;
}

export default function CAPIFDProgressReportPage() {
  const [searchForm, setSearchForm] = useState({
    reportDays: 'All',
    typeOfReport: 'Progress Report',
    level: 'AC Level'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Mock data for demonstration
  const progressData: ProgressReportData[] = [
    {
      id: '1',
      srNo: 1,
      acCode: 'AC001',
      acName: 'Delhi Cantonment',
      pcName: 'PC001',
      targetSample: 300,
      interviewersWorked: 15,
      psCovered: 25,
      completedInterviews: 280,
      terminatedInterviews: 12,
      systemRejections: 8,
      countsAfterTerminated: 260,
      gpsPending: 5,
      gpsFail: 3,
      passed: 240,
      failed: 20,
      underQc: 15,
      femaleInterviewsPercent: 45.2,
      withoutPhonePercent: 8.5,
      actualScPercent: 18.5,
      mentionedScPercent: 3.2,
      actualMuslimPercent: 22.1,
      mentionedMuslimPercent: 14.8,
      age18to24Percent: 12.5,
      age50PlusPercent: 18.2
    },
    {
      id: '2',
      srNo: 2,
      acCode: 'AC002',
      acName: 'New Delhi',
      pcName: 'PC002',
      targetSample: 350,
      interviewersWorked: 18,
      psCovered: 30,
      completedInterviews: 320,
      terminatedInterviews: 15,
      systemRejections: 10,
      countsAfterTerminated: 295,
      gpsPending: 8,
      gpsFail: 5,
      passed: 270,
      failed: 25,
      underQc: 20,
      femaleInterviewsPercent: 48.7,
      withoutPhonePercent: 6.2,
      actualScPercent: 16.8,
      mentionedScPercent: 2.8,
      actualMuslimPercent: 25.3,
      mentionedMuslimPercent: 18.5,
      age18to24Percent: 15.2,
      age50PlusPercent: 22.1
    },
    {
      id: '3',
      srNo: 3,
      acCode: 'AC003',
      acName: 'Chandni Chowk',
      pcName: 'PC003',
      targetSample: 280,
      interviewersWorked: 12,
      psCovered: 22,
      completedInterviews: 250,
      terminatedInterviews: 8,
      systemRejections: 6,
      countsAfterTerminated: 236,
      gpsPending: 4,
      gpsFail: 2,
      passed: 210,
      failed: 18,
      underQc: 12,
      femaleInterviewsPercent: 42.1,
      withoutPhonePercent: 9.8,
      actualScPercent: 20.2,
      mentionedScPercent: 3.5,
      actualMuslimPercent: 28.5,
      mentionedMuslimPercent: 22.3,
      age18to24Percent: 8.9,
      age50PlusPercent: 16.7
    },
    // Summary row
    {
      id: 'summary',
      srNo: 0,
      acCode: 'TOTAL',
      acName: 'SUMMARY',
      pcName: 'ALL',
      targetSample: 930,
      interviewersWorked: 45,
      psCovered: 77,
      completedInterviews: 850,
      terminatedInterviews: 35,
      systemRejections: 24,
      countsAfterTerminated: 791,
      gpsPending: 17,
      gpsFail: 10,
      passed: 720,
      failed: 63,
      underQc: 47,
      femaleInterviewsPercent: 45.3,
      withoutPhonePercent: 8.2,
      actualScPercent: 18.5,
      mentionedScPercent: 3.2,
      actualMuslimPercent: 25.3,
      mentionedMuslimPercent: 18.5,
      age18to24Percent: 12.2,
      age50PlusPercent: 19.0,
      isSummary: true
    }
  ];

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Searching with:', searchForm);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalPages = Math.ceil(progressData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = progressData.slice(startIndex, endIndex);

  // Helper function to determine if a value should be highlighted in red
  const shouldHighlightRed = (value: number, column: string) => {
    if (column === 'femaleInterviewsPercent') {
      return value > 50 || value < 25;
    }
    if (column === 'mentionedScPercent') {
      return value < 3.5;
    }
    if (column === 'mentionedMuslimPercent') {
      return value < 15;
    }
    if (column === 'age18to24Percent') {
      return value < 10;
    }
    if (column === 'age50PlusPercent') {
      return value < 15;
    }
    return false;
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900 dark:text-white">
            Progress Report
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1 text-right hidden">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Text className="text-sm font-medium mb-2">Report Days</Text>
            <SelectDropdown
              options={[
                { value: 'All', label: 'All' },
                { value: '7', label: 'Last 7 Days' },
                { value: '30', label: 'Last 30 Days' },
                { value: '90', label: 'Last 90 Days' },
              ]}
              value={searchForm.reportDays}
              onChange={(value) => handleInputChange('reportDays', value as string)}
              placeholder="All"
              className="w-full"
            />
          </div>
          <div>
            <Text className="text-sm font-medium mb-2">Type of Report</Text>
            <SelectDropdown
              options={[
                { value: 'Progress Report', label: 'Progress Report' },
                { value: 'Rejection Report', label: 'Rejection Report' },
                { value: 'Demographic Report', label: 'Demographic Report' },
              ]}
              value={searchForm.typeOfReport}
              onChange={(value) => handleInputChange('typeOfReport', value as string)}
              placeholder="Progress Report"
              className="w-full"
            />
          </div>
          <div>
            <Text className="text-sm font-medium mb-2">Level</Text>
            <SelectDropdown
              options={[
                { value: 'AC Level', label: 'AC Level' },
                { value: 'PC Level', label: 'PC Level' },
                { value: 'State Level', label: 'State Level' },
              ]}
              value={searchForm.level}
              onChange={(value) => handleInputChange('level', value as string)}
              placeholder="AC Level"
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleSearch} 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress Report Table */}
      <Card className="">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-green-500 mr-3"></div>
              <Heading level={4} className="card-title mg-b-0">
                PROGRESS REPORT - AC LEVEL
              </Heading>
            </div>
            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <Text className="mt-4 text-gray-600">Loading progress data...</Text>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Text className="text-lg text-red-600">Error: {error}</Text>
              <Button 
                onClick={handleSearch}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-centered table-striped dt-responsive nowrap w-100">
                <thead className="table-light">
                  <tr>
                    <th>Sr.No.</th>
                    <th>AC Code</th>
                    <th>AC Name</th>
                    <th>PC Name</th>
                    <th>Target Sample</th>
                    <th>No Of Interviewers Worked</th>
                    <th>PS Covered</th>
                    <th>Completed Interviews</th>
                    <th>Terminated Interviews</th>
                    <th>System Rejections</th>
                    <th>Counts After Terminated And System Rejection</th>
                    <th>GPS Pending</th>
                    <th>GPS Fail</th>
                    <th className="bg-green-500 text-white">Passed</th>
                    <th className="bg-red-500 text-white">Failed</th>
                    <th className="bg-blue-500 text-white">Under QC</th>
                    <th>% Of Female Interviews</th>
                    <th>% Of Interviews Without Phone Number</th>
                    <th>Actual % Of SC</th>
                    <th>% Of Interviews Mentioned As SC</th>
                    <th>Actual % Of Muslims</th>
                    <th>% Of Interviews Mentioned As Muslims</th>
                    <th>% Of Interviews Under The Age Of (18-24)</th>
                    <th>% Of Interviews Under The Age Of (50+)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => (
                    <tr 
                      key={item.id} 
                      className={item.isSummary ? 'bg-gray-100 font-bold' : ''}
                    >
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.srNo || 'TOTAL'}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.acCode}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.acName}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.pcName}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.targetSample}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.interviewersWorked}</td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} text-blue-600`}>
                        {item.psCovered}
                      </td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.completedInterviews}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.terminatedInterviews}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.systemRejections}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.countsAfterTerminated}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.gpsPending}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.gpsFail}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.passed}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.failed}</td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.underQc}</td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.femaleInterviewsPercent, 'femaleInterviewsPercent') ? 'text-red-600' : ''}`}>
                        {item.femaleInterviewsPercent}%
                      </td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.withoutPhonePercent, 'withoutPhonePercent') ? 'text-red-600' : ''}`}>
                        {item.withoutPhonePercent}%
                      </td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.actualScPercent}%</td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.mentionedScPercent, 'mentionedScPercent') ? 'text-red-600' : ''}`}>
                        {item.mentionedScPercent}%
                      </td>
                      <td className={item.isSummary ? 'font-bold' : ''}>{item.actualMuslimPercent}%</td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.mentionedMuslimPercent, 'mentionedMuslimPercent') ? 'text-red-600' : ''}`}>
                        {item.mentionedMuslimPercent}%
                      </td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.age18to24Percent, 'age18to24Percent') ? 'text-red-600' : ''}`}>
                        {item.age18to24Percent}%
                      </td>
                      <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.age50PlusPercent, 'age50PlusPercent') ? 'text-red-600' : ''}`}>
                        {item.age50PlusPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && progressData.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={progressData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                className="justify-center"
              />
            </div>
          )}
        </div>
      </Card>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th,
        .table td {
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          text-align: left;
        }
        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.075);
        }
        .table-centered {
          text-align: center;
        }
        .table-centered th,
        .table-centered td {
          text-align: center;
        }
      `}</style>
    </Container>
  );
}
