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

export default function ProgressReportPage() {
  const [searchForm, setSearchForm] = useState({
    reportDays: 'All',
    typeOfReport: 'Progress Report',
    level: 'AC Level'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Empty data array
  const progressData: any[] = [];

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching with:', searchForm);
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
      <Heading level={4} className="mb-6">
        Progress Report
      </Heading>

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
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>


      {/* Progress Report Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4}>PROGRESS REPORT-AC LEVEL</Heading>
          </div>
          <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="table-responsive">
          <Table className="table table-centered table-striped dt-responsive nowrap w-100">
            <thead className="table-light">
              <tr>
                <th>Sr.No.</th>
                <th>AC Code</th>
                <th>AC Name</th>
                <th>Pc Name</th>
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
              {progressData.length === 0 ? (
                <tr>
                  <td colSpan={24} className="text-center py-8 text-gray-500">
                    Progress Data Not Found
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr 
                    key={item.id} 
                    className={item.isSummary ? 'bg-gray-100 font-bold' : ''}
                  >
                    <td className={item.isSummary ? 'font-bold' : ''}>{item.srNo}</td>
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
                      {item.femaleInterviewsPercent}
                    </td>
                    <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.withoutPhonePercent, 'withoutPhonePercent') ? 'text-red-600' : ''}`}>
                      {item.withoutPhonePercent}
                    </td>
                    <td className={item.isSummary ? 'font-bold' : ''}>{item.actualScPercent}</td>
                    <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.mentionedScPercent, 'mentionedScPercent') ? 'text-red-600' : ''}`}>
                      {item.mentionedScPercent}
                    </td>
                    <td className={item.isSummary ? 'font-bold' : ''}>{item.actualMuslimPercent}</td>
                    <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.mentionedMuslimPercent, 'mentionedMuslimPercent') ? 'text-red-600' : ''}`}>
                      {item.mentionedMuslimPercent}
                    </td>
                    <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.age18to24Percent, 'age18to24Percent') ? 'text-red-600' : ''}`}>
                      {item.age18to24Percent}
                    </td>
                    <td className={`${item.isSummary ? 'font-bold' : ''} ${shouldHighlightRed(item.age50PlusPercent, 'age50PlusPercent') ? 'text-red-600' : ''}`}>
                      {item.age50PlusPercent}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {progressData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
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
      </Card>
    </Container>
  );
}