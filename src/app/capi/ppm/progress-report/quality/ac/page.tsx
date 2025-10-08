'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import SelectDropdown from '@/components/ui/select-dropdown';
import { Table } from '@/components/ui/table';
import PaginationStandard from '@/components/ui/pagination-standard';
import Heading from '@/components/ui/Heading';
import { Search, Download } from 'lucide-react';
import { apiService, PerformanceReportData, PerformanceReportParams } from '@/lib/api';

export default function QualityACPage() {
  const [searchForm, setSearchForm] = useState({
    reportDays: 'all',
    acCode: '',
    customDate: '',
    customDateEnd: ''
  });

  const [progressData, setProgressData] = useState<PerformanceReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProgressReport();
  }, []);

  const fetchProgressReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PerformanceReportParams = {
        report_days: searchForm.reportDays,
        type: 'quality',
        level: 'ac',
        ac_code: searchForm.acCode,
        custom_date: searchForm.customDate,
        custom_date_end: searchForm.customDateEnd
      };

      const response = await apiService.getPerformanceReport(params);
      
      if (response.success && response.data) {
        setProgressData(response.data.data);
      } else {
        setError('Failed to fetch progress data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Error fetching progress report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchForm.reportDays === 'custom') {
      if (!searchForm.customDate || !searchForm.customDateEnd) {
        alert('Please select both start and end dates for custom period');
        return;
      }
    }
    
    setCurrentPage(1);
    fetchProgressReport();
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const shouldHighlightRed = (value: number, field: string) => {
    const thresholds: { [key: string]: { min: number; max: number } } = {
      female_per: { min: 30, max: 50 },
      without_phone_per: { min: 15, max: 25 },
      sc_category_per: { min: 5, max: 15 },
      muslim_category_per: { min: 10, max: 30 },
      age_18_24_per: { min: 10, max: 20 },
      age_50_above_per: { min: 20, max: 40 }
    };

    const threshold = thresholds[field];
    if (!threshold) return false;

    return value < threshold.min || value > threshold.max;
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = progressData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(progressData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">Bihar Election</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">Progress Report</a>
                </li>
                <li className="breadcrumb-item active">Quality - AC Level</li>
              </ol>
            </div>
            <h4 className="page-title">Progress Report</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Report Days</label>
                  <SelectDropdown
                    value={searchForm.reportDays}
                    onChange={(value) => handleInputChange('reportDays', value)}
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'today', label: 'Today' },
                      { value: 'yesterday', label: 'Yesterday' },
                      { value: 'dby', label: 'Day Before Yesterday' },
                      { value: 'l3', label: 'Last 3 Days' },
                      { value: 'l7', label: 'Last 7 Days' },
                      { value: 'l15', label: 'Last 15 Days' },
                      { value: 'currentmonth', label: 'Current Month' },
                      { value: 'custom', label: 'Custom' }
                    ]}
                  />
                </div>
                
                {searchForm.reportDays === 'custom' && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label">Start Date <span className="text-red-500">*</span></label>
                      <Input
                        type="date"
                        value={searchForm.customDate}
                        onChange={(e) => handleInputChange('customDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">End Date <span className="text-red-500">*</span></label>
                      <Input
                        type="date"
                        value={searchForm.customDateEnd}
                        onChange={(e) => handleInputChange('customDateEnd', e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-md-3 d-flex align-items-end">
                  <Button onClick={handleSearch} className="btn-primary">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Heading level={2} className="mb-0">
                  QUALITY REPORT-AC LEVEL
                </Heading>
                <Button className="btn-success">
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
                      <th className="border border-gray-300 w-32">PC Name</th>
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
                    onPageChange={handlePageChange}
                    totalItems={progressData.length}
                    itemsPerPage={itemsPerPage}
                    startIndex={startIndex}
                    endIndex={Math.min(endIndex, progressData.length)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
