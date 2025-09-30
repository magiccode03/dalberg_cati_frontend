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

  // Sample data for comprehensive Progress Report
  const progressData = [
    {
      id: 0,
      srNo: 0,
      acCode: 'All Ac',
      acName: 'All Ac',
      pcName: 'All Pc',
      targetSample: 72900,
      interviewersWorked: 776,
      psCovered: 5374,
      completedInterviews: 108333,
      terminatedInterviews: 2561,
      systemRejections: 6020,
      countsAfterTerminated: 99752,
      gpsPending: 0,
      gpsFail: 0,
      passed: 50025,
      failed: 49727,
      underQc: 0,
      femaleInterviewsPercent: 34,
      withoutPhonePercent: 24.8,
      actualScPercent: 15.9,
      mentionedScPercent: 3.6,
      actualMuslimPercent: 10.4,
      mentionedMuslimPercent: 20.7,
      age18to24Percent: 13.9,
      age50PlusPercent: 23.9,
      isSummary: true
    },
    {
      id: 1,
      srNo: 118,
      acCode: '118',
      acName: 'Chapra',
      pcName: 'Saran',
      targetSample: 300,
      interviewersWorked: 8,
      psCovered: 24,
      completedInterviews: 930,
      terminatedInterviews: 0,
      systemRejections: 66,
      countsAfterTerminated: 864,
      gpsPending: 0,
      gpsFail: 0,
      passed: 142,
      failed: 722,
      underQc: 0,
      femaleInterviewsPercent: 46.5,
      withoutPhonePercent: 6.9,
      actualScPercent: 11.7,
      mentionedScPercent: 2.8,
      actualMuslimPercent: 10.4,
      mentionedMuslimPercent: 20.4,
      age18to24Percent: 4.9,
      age50PlusPercent: 14.1,
      isSummary: false
    },
    {
      id: 2,
      srNo: 98,
      acCode: '98',
      acName: 'Sahebganj',
      pcName: 'Vaishali',
      targetSample: 300,
      interviewersWorked: 22,
      psCovered: 24,
      completedInterviews: 1089,
      terminatedInterviews: 64,
      systemRejections: 183,
      countsAfterTerminated: 842,
      gpsPending: 0,
      gpsFail: 0,
      passed: 139,
      failed: 703,
      underQc: 0,
      femaleInterviewsPercent: 41,
      withoutPhonePercent: 5.4,
      actualScPercent: 13.9,
      mentionedScPercent: 2.2,
      actualMuslimPercent: 12.4,
      mentionedMuslimPercent: 5,
      age18to24Percent: 5.8,
      age50PlusPercent: 30.2,
      isSummary: false
    },
    {
      id: 3,
      srNo: 23,
      acCode: '23',
      acName: 'Riga',
      pcName: 'Sheohar',
      targetSample: 300,
      interviewersWorked: 40,
      psCovered: 24,
      completedInterviews: 912,
      terminatedInterviews: 2,
      systemRejections: 109,
      countsAfterTerminated: 801,
      gpsPending: 0,
      gpsFail: 0,
      passed: 193,
      failed: 608,
      underQc: 0,
      femaleInterviewsPercent: 50.8,
      withoutPhonePercent: 11.2,
      actualScPercent: 14.1,
      mentionedScPercent: 0,
      actualMuslimPercent: 13,
      mentionedMuslimPercent: 0.5,
      age18to24Percent: 13.5,
      age50PlusPercent: 16.1,
      isSummary: false
    },
    {
      id: 4,
      srNo: 112,
      acCode: '112',
      acName: 'Maharajganj',
      pcName: 'Maharajganj',
      targetSample: 300,
      interviewersWorked: 29,
      psCovered: 21,
      completedInterviews: 852,
      terminatedInterviews: 6,
      systemRejections: 55,
      countsAfterTerminated: 791,
      gpsPending: 0,
      gpsFail: 0,
      passed: 159,
      failed: 632,
      underQc: 0,
      femaleInterviewsPercent: 36.5,
      withoutPhonePercent: 14,
      actualScPercent: 11.5,
      mentionedScPercent: 0,
      actualMuslimPercent: 14.9,
      mentionedMuslimPercent: 0.6,
      age18to24Percent: 23.3,
      age50PlusPercent: 10.1,
      isSummary: false
    },
    {
      id: 5,
      srNo: 190,
      acCode: '190',
      acName: 'Paliganj',
      pcName: 'Pataliputra',
      targetSample: 300,
      interviewersWorked: 22,
      psCovered: 24,
      completedInterviews: 947,
      terminatedInterviews: 83,
      systemRejections: 74,
      countsAfterTerminated: 790,
      gpsPending: 0,
      gpsFail: 0,
      passed: 281,
      failed: 509,
      underQc: 0,
      femaleInterviewsPercent: 38.1,
      withoutPhonePercent: 7.1,
      actualScPercent: 18.8,
      mentionedScPercent: 1.1,
      actualMuslimPercent: 0,
      mentionedMuslimPercent: 0,
      age18to24Percent: 17.4,
      age50PlusPercent: 31,
      isSummary: false
    },
    {
      id: 6,
      srNo: 29,
      acCode: '29',
      acName: 'Runnisaidpur',
      pcName: 'Sitamarhi',
      targetSample: 300,
      interviewersWorked: 16,
      psCovered: 24,
      completedInterviews: 812,
      terminatedInterviews: 13,
      systemRejections: 34,
      countsAfterTerminated: 765,
      gpsPending: 0,
      gpsFail: 0,
      passed: 166,
      failed: 599,
      underQc: 0,
      femaleInterviewsPercent: 46.4,
      withoutPhonePercent: 7.9,
      actualScPercent: 12.3,
      mentionedScPercent: 3,
      actualMuslimPercent: 12.4,
      mentionedMuslimPercent: 5.4,
      age18to24Percent: 0,
      age50PlusPercent: 64.5,
      isSummary: false
    },
    {
      id: 7,
      srNo: 158,
      acCode: '158',
      acName: 'Nathnagar',
      pcName: 'Bhagalpur',
      targetSample: 300,
      interviewersWorked: 9,
      psCovered: 24,
      completedInterviews: 724,
      terminatedInterviews: 0,
      systemRejections: 4,
      countsAfterTerminated: 720,
      gpsPending: 0,
      gpsFail: 0,
      passed: 293,
      failed: 427,
      underQc: 0,
      femaleInterviewsPercent: 21.8,
      withoutPhonePercent: 19.6,
      actualScPercent: 10.9,
      mentionedScPercent: 3.4,
      actualMuslimPercent: 0,
      mentionedMuslimPercent: 33.4,
      age18to24Percent: 9.6,
      age50PlusPercent: 30.7,
      isSummary: false
    },
    {
      id: 8,
      srNo: 76,
      acCode: '76',
      acName: 'Simri Bakhtiarpur',
      pcName: 'Khagaria',
      targetSample: 300,
      interviewersWorked: 38,
      psCovered: 24,
      completedInterviews: 819,
      terminatedInterviews: 10,
      systemRejections: 90,
      countsAfterTerminated: 719,
      gpsPending: 0,
      gpsFail: 0,
      passed: 280,
      failed: 439,
      underQc: 0,
      femaleInterviewsPercent: 44.6,
      withoutPhonePercent: 14.7,
      actualScPercent: 18.4,
      mentionedScPercent: 0,
      actualMuslimPercent: 18.3,
      mentionedMuslimPercent: 0,
      age18to24Percent: 23.6,
      age50PlusPercent: 17.5,
      isSummary: false
    },
    {
      id: 9,
      srNo: 224,
      acCode: '224',
      acName: 'Rafiganj',
      pcName: 'Aurangabad',
      targetSample: 300,
      interviewersWorked: 23,
      psCovered: 18,
      completedInterviews: 744,
      terminatedInterviews: 3,
      systemRejections: 75,
      countsAfterTerminated: 666,
      gpsPending: 0,
      gpsFail: 0,
      passed: 117,
      failed: 549,
      underQc: 0,
      femaleInterviewsPercent: 23.9,
      withoutPhonePercent: 5.2,
      actualScPercent: 27.1,
      mentionedScPercent: 6,
      actualMuslimPercent: 0.1,
      mentionedMuslimPercent: 4.3,
      age18to24Percent: 12,
      age50PlusPercent: 20.5,
      isSummary: false
    },
    {
      id: 10,
      srNo: 125,
      acCode: '125',
      acName: 'Vaishali',
      pcName: 'Vaishali',
      targetSample: 300,
      interviewersWorked: 29,
      psCovered: 24,
      completedInterviews: 784,
      terminatedInterviews: 7,
      systemRejections: 114,
      countsAfterTerminated: 663,
      gpsPending: 0,
      gpsFail: 0,
      passed: 274,
      failed: 389,
      underQc: 0,
      femaleInterviewsPercent: 57.3,
      withoutPhonePercent: 26.8,
      actualScPercent: 20.5,
      mentionedScPercent: 0,
      actualMuslimPercent: 0.1,
      mentionedMuslimPercent: 8.4,
      age18to24Percent: 26.3,
      age50PlusPercent: 15.7,
      isSummary: false
    }
  ];

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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      <Heading level={1} className="mb-6">
        Progress Report
      </Heading>

      {/* Filter Section */}
      <Card className="mb-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
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
            />
          </div>
          <div className="flex-1">
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
            />
          </div>
          <div className="flex-1">
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
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} className="px-6">
              <Search className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress Report Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Heading level={4}>PROGRESS REPORT-AC LEVEL</Heading>
          <Button variant="outline">
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
              {currentData.map((item) => (
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
              ))}
            </tbody>
          </Table>
        </div>

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
      </Card>
    </Container>
  );
}
