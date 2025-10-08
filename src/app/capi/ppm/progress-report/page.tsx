'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { apiService } from '@/lib/api';
import type { PerformanceReportData, PerformanceReportParams } from '@/lib/api';

export default function ProgressReportPage() {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState({
    reportDays: 'all',
    typeOfReport: 'performance',
    level: 'ac',
    acCode: '',
    customDate: '',
    customDateEnd: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [progressData, setProgressData] = useState<PerformanceReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    fetchProgressReport();
  }, []);

  const fetchProgressReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PerformanceReportParams = {
        report_days: searchForm.reportDays as any,
        type: searchForm.typeOfReport as 'performance' | 'quality',
        level: searchForm.level as 'ac' | 'pc' | 'polingstation' | 'interviewer',
        ac_code: searchForm.acCode || undefined,
        custom_date: searchForm.customDate || undefined,
        custom_date_end: searchForm.customDateEnd || undefined
      };

      const response = await apiService.getPerformanceReport(params);
      
      if (response.success) {
        setProgressData(response.data.data);
      } else {
        setError('Failed to fetch progress report data');
      }
    } catch (err) {
      console.error('Error fetching progress report:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Validate required fields
    if (['polingstation', 'interviewer'].includes(searchForm.level) && !searchForm.acCode.trim()) {
      setError('AC Code is required for Polling Station and Interviewer levels');
      return;
    }
    
    if (searchForm.reportDays === 'custom' && (!searchForm.customDate || !searchForm.customDateEnd)) {
      setError('Start Date and End Date are required for custom period');
      return;
    }
    
    // If it's the default AC performance report, fetch data directly
    if (searchForm.typeOfReport === 'performance' && searchForm.level === 'ac') {
      fetchProgressReport();
    } else {
      // For other combinations, navigate to the specific page
      const params = new URLSearchParams({
        report_days: searchForm.reportDays,
        type: searchForm.typeOfReport,
        level: searchForm.level,
        ...(searchForm.acCode && { ac_code: searchForm.acCode }),
        ...(searchForm.customDate && { custom_date: searchForm.customDate }),
        ...(searchForm.customDateEnd && { custom_date_end: searchForm.customDateEnd })
      });

      const path = `/capi/ppm/progress-report/${searchForm.typeOfReport}/${searchForm.level}`;
      router.push(`${path}?${params.toString()}`);
    }
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
    if (column === 'female_per') {
      return value > 50 || value < 25;
    }
    if (column === 'sc_category_per') {
      return value < 3.5;
    }
    if (column === 'muslim_category_per') {
      return value < 15;
    }
    if (column === 'age_18_24_per') {
      return value < 10;
    }
    if (column === 'age_50_above_per') {
      return value < 15;
    }
    if (column === 'without_phone_per') {
      return value > 20; // Highlight if more than 20% without phone
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
        <div className={`grid grid-cols-1 gap-4 ${['polingstation', 'interviewer'].includes(searchForm.level) ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
          <div>
            <Text className="text-sm font-medium mb-2">Report Days</Text>
            <SelectDropdown
              options={[
                { value: 'all', label: 'All' },
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'dby', label: 'Day Before Yesterday' },
                { value: 'l3', label: 'Last 3 Days' },
                { value: 'l7', label: 'Last 7 Days' },
                { value: 'l15', label: 'Last 15 Days' },
                { value: 'currentmonth', label: 'Current Month' },
                { value: 'custom', label: 'Custom' },
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
                { value: 'performance', label: 'Progress Report' },
                { value: 'quality', label: 'Quality Report' },
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
                { value: 'ac', label: 'AC' },
                { value: 'pc', label: 'PC' },
                { value: 'polingstation', label: 'Polling Station' },
                { value: 'interviewer', label: 'Interviewer' },
              ]}
              value={searchForm.level}
              onChange={(value) => handleInputChange('level', value as string)}
              placeholder="AC"
              className="w-full"
            />
          </div>
          {/* AC Code Field - Only show when polingstation or interviewer is selected */}
          {['polingstation', 'interviewer'].includes(searchForm.level) && (
            <div>
              <Text className="text-sm font-medium mb-2">
                AC Code
                <span className="text-red-500 ml-1">*</span>
              </Text>
              <Input
                type="text"
                value={searchForm.acCode}
                onChange={(e) => handleInputChange('acCode', e.target.value)}
                placeholder="Enter AC Code"
                className="w-full"
                required
              />
            </div>
          )}
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Custom Date Fields - Only show when custom is selected */}
        {searchForm.reportDays === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Text className="text-sm font-medium mb-2">
                Start Date
                <span className="text-red-500 ml-1">*</span>
              </Text>
              <Input
                type="date"
                value={searchForm.customDate}
                onChange={(e) => handleInputChange('customDate', e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Text className="text-sm font-medium mb-2">
                End Date
                <span className="text-red-500 ml-1">*</span>
              </Text>
              <Input
                type="date"
                value={searchForm.customDateEnd}
                onChange={(e) => handleInputChange('customDateEnd', e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>
        )}
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
          <Table className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300">
            <thead className="table-light">
              <tr>
                <th className="border border-gray-300 w-16">Sr.No.</th>
                <th className="border border-gray-300 w-20">AC Code</th>
                <th className="border border-gray-300 w-32">AC Name</th>
                <th className="border border-gray-300 w-32">Pc Name</th>
                <th className="border border-gray-300 w-24">Target Sample</th>
                <th className="border border-gray-300 w-32">No Of Interviewers Worked</th>
                <th className="border border-gray-300 w-24">PS Covered</th>
                <th className="border border-gray-300 w-32">Completed Interviews</th>
                <th className="border border-gray-300 w-32">Terminated Interviews</th>
                <th className="border border-gray-300 w-32">System Rejections</th>
                <th className="border border-gray-300 w-40">Counts After Terminated And System Rejection</th>
                <th className="border border-gray-300 w-24">GPS Pending</th>
                <th className="border border-gray-300 w-20">GPS Fail</th>
                <th className="bg-green-500 text-white border border-gray-300 w-20">Passed</th>
                <th className="bg-red-500 text-white border border-gray-300 w-20">Failed</th>
                <th className="bg-blue-500 text-white border border-gray-300 w-24">Under QC</th>
                <th className="border border-gray-300 w-32">% Of Female Interviews</th>
                <th className="border border-gray-300 w-40">% Of Interviews Without Phone Number</th>
                <th className="border border-gray-300 w-24">Actual % Of SC</th>
                <th className="border border-gray-300 w-36">% Of Interviews Mentioned As SC</th>
                <th className="border border-gray-300 w-28">Actual % Of Muslims</th>
                <th className="border border-gray-300 w-40">% Of Interviews Mentioned As Muslims</th>
                <th className="border border-gray-300 w-40">% Of Interviews Under The Age Of (18-24)</th>
                <th className="border border-gray-300 w-40">% Of Interviews Under The Age Of (50+)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={24} className="text-center py-8 text-gray-500 border border-gray-300">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={24} className="text-center py-8 text-red-500 border border-gray-300">
                    {error}
                  </td>
                </tr>
              ) : progressData.length === 0 ? (
                <tr>
                  <td colSpan={24} className="text-center py-8 text-gray-500 border border-gray-300">
                    Progress Data Not Found
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.ac_code}>
                    <td className="border border-gray-300">{startIndex + index + 1}</td>
                    <td className="border border-gray-300">{item.ac_code}</td>
                    <td className="border border-gray-300">{item.ac_name}</td>
                    <td className="border border-gray-300">{item.pc_name}</td>
                    <td className="border border-gray-300">{item.target_sample}</td>
                    <td className="border border-gray-300">{item.interviewer}</td>
                    <td className="text-blue-600 border border-gray-300">{item.pscovered}</td>
                    <td className="border border-gray-300">{item.total_interview}</td>
                    <td className="border border-gray-300">{item.invalid}</td>
                    <td className="border border-gray-300">{item.reject_auto}</td>
                    <td className="border border-gray-300">{item.count_after_termination_and_rejection}</td>
                    <td className="border border-gray-300">{item.interview_gps_pending}</td>
                    <td className="border border-gray-300">{item.interview_gps_reject}</td>
                    <td className="border border-gray-300">{item.valid}</td>
                    <td className="border border-gray-300">{item.reject - item.reject_auto}</td>
                    <td className="border border-gray-300">{item.interview_in_qc + item.interview_in_qc_complete + item.interview_in_reqc + item.interview_in_reqc_complete}</td>
                    <td className={`border border-gray-300 ${shouldHighlightRed(item.female_per, 'female_per') ? 'text-red-600 font-bold' : ''}`}>
                      {item.female_per}
                    </td>
                    <td className={`border border-gray-300 ${shouldHighlightRed(item.without_phone_per, 'without_phone_per') ? 'text-red-600 font-bold' : ''}`}>
                      {item.without_phone_per}
                    </td>
                    <td className="border border-gray-300">{item.sc}</td>
                    <td className={`border border-gray-300 ${shouldHighlightRed(item.sc_category_per, 'sc_category_per') ? 'text-red-600 font-bold' : ''}`}>
                      {item.sc_category_per}
                    </td>
                    <td className="border border-gray-300">{item.muslim}</td>
                    <td className={`border border-gray-300 ${shouldHighlightRed(item.muslim_category_per, 'muslim_category_per') ? 'text-red-600 font-bold' : ''}`}>
                      {item.muslim_category_per}
                    </td>
                    <td className={`border border-gray-300 ${shouldHighlightRed(item.age_18_24_per, 'age_18_24_per') ? 'text-red-600 font-bold' : ''}`}>
                      {item.age_18_24_per}
                    </td>
                    <td className={`border border-gray-300 ${shouldHighlightRed(item.age_50_above_per, 'age_50_above_per') ? 'text-red-600 font-bold' : ''}`}>
                      {item.age_50_above_per}
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