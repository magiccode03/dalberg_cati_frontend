'use client';

import { useState, useEffect } from 'react';
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
import type { PerformanceReportData, PerformanceReportParams, ACListItem } from '@/lib/api';

export default function ProgressReportPage() {
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
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acList, setAcList] = useState<ACListItem[]>([]);
  const [acListLoading, setAcListLoading] = useState(false);

  // Load AC list on component mount, but don't fetch progress report data
  useEffect(() => {
    fetchACList();
  }, []);

  // Clear AC code when switching to levels that don't require it
  useEffect(() => {
    if (!['polingstation', 'interviewer'].includes(searchForm.level) && searchForm.acCode) {
      setSearchForm(prev => ({
        ...prev,
        acCode: ''
      }));
    }
  }, [searchForm.level]);

  const fetchACList = async () => {
    setAcListLoading(true);
    try {
      const response = await apiService.getPerformanceReportACList();
      if (response.success) {
        setAcList(response.data);
      }
    } catch (err) {
      console.error('Error fetching AC list:', err);
    } finally {
      setAcListLoading(false);
    }
  };

  const fetchProgressReport = async () => {
    setLoading(true);
    setError(null);
    setProgressData([]); // Clear previous data immediately
    setCurrentPage(1); // Reset to first page
    
    // Add a small delay to ensure data is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const params: PerformanceReportParams = {
        report_days: searchForm.reportDays as any,
        type: searchForm.typeOfReport as 'performance' | 'quality',
        level: searchForm.level as 'ac' | 'pc' | 'polingstation' | 'interviewer',
        // Only include ac_code for polingstation and interviewer levels
        ...(['polingstation', 'interviewer'].includes(searchForm.level) && searchForm.acCode && { ac_code: searchForm.acCode }),
        custom_date: searchForm.customDate || undefined,
        custom_date_end: searchForm.customDateEnd || undefined
      };

      console.log('API Parameters:', params);

      const response = await apiService.getPerformanceReport(params);
      
      if (response.success) {
        console.log('API Response Data:', response.data.data);
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
    
    fetchProgressReport();
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

  // Helper function to get table headers based on type and level
  const getTableHeaders = () => {
    const type = searchForm.typeOfReport;
    const level = searchForm.level;

    if (type === 'performance') {
      switch (level) {
        case 'ac':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'ac_code', label: 'AC Code', width: 'w-20' },
            { key: 'ac_name', label: 'AC Name', width: 'w-32' },
            { key: 'pc_name', label: 'Pc Name', width: 'w-32' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-32' },
            { key: 'ps_covered', label: 'PS Covered', width: 'w-24' },
            { key: 'completed_interviews', label: 'Completed Interviews', width: 'w-32' },
            { key: 'terminated_interviews', label: 'Terminated Interviews', width: 'w-32' },
            { key: 'system_rejections', label: 'System rejections', width: 'w-32' },
            { key: 'counts_after_terminated', label: 'Counts after Terminated and System Rejection', width: 'w-40' },
            { key: 'gps_pending', label: 'GPS Pending', width: 'w-24' },
            { key: 'gps_fail', label: 'GPS Fail', width: 'w-20' },
            { key: 'passed', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white' },
            { key: 'failed', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white' },
            { key: 'under_qc', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-32' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-40' },
            { key: 'actual_sc', label: 'Actual % of SC', width: 'w-24' },
            { key: 'mentioned_sc', label: '% of Interviews mentioned as SC', width: 'w-36' },
            { key: 'actual_muslim', label: 'Actual % of Muslims', width: 'w-28' },
            { key: 'mentioned_muslim', label: '% of Interviews mentioned as Muslims', width: 'w-40' },
            { key: 'age_18_24', label: '% of Interviews under the age of (18-24)', width: 'w-40' },
            { key: 'age_50_plus', label: '% of Interviews under the age of (50+)', width: 'w-40' }
          ];
        case 'pc':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'pc_code', label: 'PC Code', width: 'w-20' },
            { key: 'pc_name', label: 'PC Name', width: 'w-32' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-32' },
            { key: 'ps_covered', label: 'PS Covered', width: 'w-24' },
            { key: 'completed_interviews', label: 'Completed Interviews', width: 'w-32' },
            { key: 'terminated_interviews', label: 'Terminated Interviews', width: 'w-32' },
            { key: 'system_rejections', label: 'System rejections', width: 'w-32' },
            { key: 'counts_after_terminated', label: 'Counts after Terminated and System Rejection', width: 'w-40' },
            { key: 'passed', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white' },
            { key: 'failed', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white' },
            { key: 'under_qc', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-32' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-40' },
            { key: 'mentioned_sc', label: '% of Interviews mentioned as SC', width: 'w-36' },
            { key: 'mentioned_muslim', label: '% of Interviews mentioned as Muslims', width: 'w-40' },
            { key: 'age_18_24', label: '% of Interviews under the age of (18-24)', width: 'w-40' },
            { key: 'age_50_plus', label: '% of Interviews under the age of (50+)', width: 'w-40' }
          ];
        case 'interviewer':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'interviewer_id', label: 'Interviewer ID', width: 'w-32' },
            { key: 'no_of_ac', label: 'No of AC covered', width: 'w-32' },
            { key: 'pscovered', label: 'PS Covered', width: 'w-24' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-32' },
            { key: 'invalid', label: 'Terminated Interviews', width: 'w-32' },
            { key: 'reject_auto', label: 'System rejections', width: 'w-32' },
            { key: 'count_after_termination_and_rejection', label: 'Counts after Terminated and System Rejection', width: 'w-40' },
            { key: 'valid', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white' },
            { key: 'reject', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white' },
            { key: 'interview_in_qc_total', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-32' },
            { key: 'no_of_day', label: 'No of days worked', width: 'w-32' },
            { key: 'without_audio', label: 'No of Interviews without audio', width: 'w-40' },
            { key: 'average_per_day', label: 'Average per day', width: 'w-32' },
            { key: 'min_achivement', label: 'Lowest achievement', width: 'w-32' },
            { key: 'max_achivement', label: 'Highest achievement', width: 'w-32' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-40' },
            { key: 'sc_category_per', label: '% of Interviews mentioned as SC', width: 'w-36' },
            { key: 'muslim_category_per', label: '% of Interviews mentioned as Muslims', width: 'w-40' },
            { key: 'age_18_24_per', label: '% of Interviews under the age of (18-24)', width: 'w-40' },
            { key: 'age_50_above_per', label: '% of Interviews under the age of (50+)', width: 'w-40' },
            { key: 'rejection_per', label: '% of Rejection', width: 'w-32' }
          ];
        case 'polingstation':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'polling_station_name', label: 'Polling Station Name', width: 'w-40' },
            { key: 'ac_name', label: 'AC Name', width: 'w-32' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-32' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-32' },
            { key: 'invalid', label: 'Terminated Interviews', width: 'w-32' },
            { key: 'reject_auto', label: 'System Rejections', width: 'w-32' },
            { key: 'count_after_termination_and_rejection', label: 'Counts After Terminated And System Rejection', width: 'w-40' },
            { key: 'valid', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white' },
            { key: 'reject', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white' },
            { key: 'interview_in_qc_total', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-32' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-40' },
            { key: 'sc_category_per', label: '% of Interviews mentioned as SC', width: 'w-36' },
            { key: 'muslim_category_per', label: '% of Interviews mentioned as Muslims', width: 'w-40' },
            { key: 'age_18_24_per', label: '% of Interviews under the age of (18-24)', width: 'w-40' },
            { key: 'age_50_above_per', label: '% of Interviews under the age of (50+)', width: 'w-40' }
          ];
        default:
          return [];
      }
    } else if (type === 'quality') {
      switch (level) {
        case 'ac':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'ac_code', label: 'Ac Code', width: 'w-20' },
            { key: 'ac_name', label: 'Ac Name', width: 'w-32' },
            { key: 'pc_name', label: 'Pc Name', width: 'w-32' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-32' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-32' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32' },
            { key: 'valid_without_phone_per', label: '% of pass interviews without Phone Number', width: 'w-40' },
            { key: 'assign_to_audioqc', label: 'Assigned to Audio', width: 'w-32' },
            { key: 'interview_in_qc_total', label: 'Under QC Interviews', width: 'w-32' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24' },
            { key: 'reject_short', label: 'Short Interviews Fail', width: 'w-32' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-32' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24' },
            { key: 'reject_qc_audio_gender', label: 'Survey conversation can be heard', width: 'w-40' },
            { key: 'reject_qc_audio_blank', label: 'No Conversation', width: 'w-32' },
            { key: 'reject_qc_audio_irrelevant', label: 'Irrelevant conversation', width: 'w-40' },
            { key: 'reject_qc_audio_respondent', label: 'Interviewer acting as respondent', width: 'w-48' },
            { key: 'reject_qc_audio_interviewer_more', label: 'Can hear the interviewer more than the respondent', width: 'w-56' },
            { key: 'reject_qc_audio_mechanical', label: 'The interviewer is asking questions mechanically', width: 'w-56' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24' }
          ];
        case 'pc':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'pc_code', label: 'PC Code', width: 'w-20' },
            { key: 'pc_name', label: 'PC Name', width: 'w-32' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-32' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-32' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32' },
            { key: 'valid_without_phone_per', label: '% of Valid interviews without Phone Number', width: 'w-40' },
            { key: 'assign_to_qc', label: 'Assigned to Audio', width: 'w-32' },
            { key: 'interview_in_qc_total', label: 'Under QC Interviews', width: 'w-32' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24' },
            { key: 'reject_short', label: 'Short Interviews Fail', width: 'w-32' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-32' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24' }
          ];
        case 'interviewer':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'interviewer_id', label: 'Interviewer ID', width: 'w-32' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-32' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32' },
            { key: 'valid_without_phone_per', label: '% of Pass interviews without Phone Number', width: 'w-40' },
            { key: 'assign_to_audioqc', label: 'Assigned to Audio', width: 'w-32' },
            { key: 'interview_in_qc_total', label: 'Under QC Interviews', width: 'w-32' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24' },
            { key: 'reject_short', label: 'Short Interviews Fail', width: 'w-32' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-32' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24' },
            { key: 'reject_qc_audio_gender', label: 'Survey conversation can be heard', width: 'w-40' },
            { key: 'reject_qc_audio_blank', label: 'No Conversation', width: 'w-32' },
            { key: 'reject_qc_audio_irrelevant', label: 'Irrelevant conversation', width: 'w-40' },
            { key: 'reject_qc_audio_respondent', label: 'Interviewer acting as respondent', width: 'w-48' },
            { key: 'reject_qc_audio_interviewer_more', label: 'Can hear the interviewer more than the respondent', width: 'w-56' },
            { key: 'reject_qc_audio_mechanical', label: 'The interviewer is asking questions mechanically', width: 'w-56' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24' },
            { key: 'rejection_per', label: 'Rejection %', width: 'w-24' }
          ];
        case 'polingstation':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16' },
            { key: 'polling_station_name', label: 'Polling Station Name', width: 'w-40' },
            { key: 'ac_name', label: 'Ac Name', width: 'w-32' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-32' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-32' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32' },
            { key: 'valid_without_phone_per', label: '% of Pass interviews without Phone Number', width: 'w-40' },
            { key: 'assign_to_audioqc', label: 'Assigned to Audio', width: 'w-32' },
            { key: 'interview_in_qc_total', label: 'Under QC Interview', width: 'w-32' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24' },
            { key: 'reject_short', label: 'Short Interviews', width: 'w-32' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-32' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24' }
          ];
        default:
          return [];
      }
    }
    return [];
  };

  // Helper function to get data value based on header key and API response structure
  const getDataValue = (item: any, key: string, itemIndex?: number) => {
    switch (key) {
      case 'sr':
        return startIndex + (itemIndex || 0) + 1; // Calculate correct serial number based on pagination
      
        // Common fields across all levels
        case 'ac_code':
          return item.ac_code ?? '-';
        case 'ac_name':
          return item.ac_name ?? '-';
        case 'pc_code':
          return item.pc_code !== undefined ? item.pc_code : '-';
        case 'pc_name':
          return item.pc_name ?? '-';
        case 'ps_name':
          return item.polling_station_name ?? item.ps_name ?? '-';
        case 'polling_station_name':
          return item.polling_station_name ?? '-';
        case 'interviewer_id':
          return item.interviewer_id ?? '-';
      case 'target_sample':
        return item.target_sample ?? '-';
      case 'interviewer':
        return item.interviewer ?? '-';
      case 'ac_covered':
        return item.no_of_ac ?? item.ac_covered ?? '-';
      case 'ps_covered':
        return item.pscovered ?? item.ps_covered ?? '-';
      case 'no_of_ac':
        return item.no_of_ac ?? '-';
      case 'pscovered':
        return item.pscovered ?? '-';
      case 'completed_interviews':
        return item.total_interview ?? item.completed_interviews ?? '-';
      case 'terminated_interviews':
        return item.invalid ?? item.terminated_interviews ?? '-';
      case 'system_rejections':
        return item.reject_auto ?? item.system_rejections ?? '-';
      case 'counts_after_terminated':
        return item.count_after_termination_and_rejection ?? item.counts_after_terminated ?? '-';
      case 'count_after_termination_and_rejection':
        return item.count_after_termination_and_rejection ?? '-';
      case 'total_interview':
        return item.total_interview ?? '-';
      case 'invalid':
        return item.invalid ?? '-';
      case 'reject_auto':
        return item.reject_auto ?? '-';
      case 'valid':
        return item.valid ?? '-';
      case 'reject':
        return item.reject ?? '-';
      case 'interview_in_qc_total':
        // Calculate the sum of all QC fields and display 0 if the sum is 0
        const qcTotal = (item.interview_in_qc ?? 0) + (item.interview_in_qc_complete ?? 0) + (item.interview_in_reqc ?? 0) + (item.interview_in_reqc_complete ?? 0);
        return qcTotal ?? '-';
      
      // GPS fields (only for AC level)
      case 'gps_pending':
        return item.interview_gps_pending ?? item.gps_pending ?? '-';
      case 'gps_fail':
        return item.interview_gps_reject ?? item.gps_fail ?? '-';
      
      // Pass/Fail fields
      case 'passed':
        return item.valid ?? item.passed ?? item.pass_interviews ?? '-';
      case 'failed':
        const failedValue = (item.reject - item.reject_auto);
        return failedValue ?? item.failed ?? item.fail_interviews ?? '-';
      case 'under_qc':
        const underQcValue = (item.interview_in_qc + item.interview_in_qc_complete + item.interview_in_reqc + item.interview_in_reqc_complete);
        return underQcValue ?? item.under_qc ?? item.under_qc_interviews ?? item.under_qc_interview ?? '-';
      
      // Percentage fields
      case 'female_per':
        return item.female_per ?? '-';
      case 'without_phone_per':
        return item.without_phone_per ?? '-';
      case 'pass_without_phone_per':
        return item.valid_without_phone_per ?? item.pass_without_phone_per ?? '-';
      case 'valid_without_phone_per':
        return item.valid_without_phone_per ?? '-';
      
      // SC and Muslim fields
      case 'actual_sc':
        return item.sc ?? '-';
      case 'mentioned_sc':
        return item.sc_category_per ?? item.mentioned_sc ?? '-';
      case 'actual_muslim':
        return item.muslim ?? '-';
      case 'mentioned_muslim':
        return item.muslim_category_per ?? item.mentioned_muslim ?? '-';
      
      // Age fields
      case 'age_18_24':
        return item.age_18_24_per ?? item.age_18_24 ?? '-';
      case 'age_50_plus':
        return item.age_50_above_per ?? item.age_50_plus ?? '-';
      case 'sc_category_per':
        return item.sc_category_per ?? '-';
      case 'muslim_category_per':
        return item.muslim_category_per ?? '-';
      case 'age_18_24_per':
        return item.age_18_24_per ?? '-';
      case 'age_50_above_per':
        return item.age_50_above_per ?? '-';
      
      // Interviewer specific fields
      case 'days_worked':
        return item.no_of_day ?? item.days_worked ?? '-';
      case 'no_of_day':
        return item.no_of_day ?? '-';
      case 'without_audio':
        return item.without_audio ?? '-';
      case 'average_per_day':
        return item.average_per_day ?? '-';
      case 'min_achivement':
        return item.min_achivement ?? '-';
      case 'max_achivement':
        return item.max_achivement ?? '-';
      case 'rejection_per':
        return item.rejection_per ?? '-';
      case 'lowest_achievement':
        return item.min_achivement ?? item.lowest_achievement ?? '-';
      case 'highest_achievement':
        return item.max_achivement ?? item.highest_achievement ?? '-';
      
      // Quality specific fields
      case 'assigned_to_audio':
        return item.assign_to_audioqc ?? item.assigned_to_audio ?? '-';
      case 'assign_to_audioqc':
        return item.assign_to_audioqc ?? '-';
      case 'assign_to_qc':
        return item.assign_to_qc ?? '-';
      case 'system_fail':
        return item.reject_auto ?? item.system_fail ?? '-';
      case 'short_interviews_fail':
        return item.reject_short ?? item.short_interviews_fail ?? '-';
      case 'reject_short':
        return item.reject_short ?? '-';
      case 'short_interviews':
        return item.reject_short ?? item.short_interviews ?? '-';
      case 'duplicate_mobile':
        return item.reject_duplicatephone ?? item.duplicate_mobile ?? '-';
      case 'reject_duplicatephone':
        return item.reject_duplicatephone ?? '-';
      case 'audio_fail':
        return item.reject_qc_audio ?? item.audio_fail ?? '-';
      case 'reject_qc_audio':
        return item.reject_qc_audio ?? '-';
      case 'reject_rta':
        return item.reject_rta ?? '-';
      
      // Audio QC fields
      case 'reject_qc_audio_gender':
        return item.reject_qc_audio_gender ?? '-';
      case 'reject_qc_audio_blank':
        return item.reject_qc_audio_blank ?? '-';
      case 'reject_qc_audio_irrelevant':
        return item.reject_qc_audio_irrelevant ?? '-';
      case 'reject_qc_audio_respondent':
        return item.reject_qc_audio_respondent ?? '-';
      case 'reject_qc_audio_interviewer_more':
        return item.reject_qc_audio_interviewer_more ?? '-';
      case 'reject_qc_audio_mechanical':
        return item.reject_qc_audio_mechanical ?? '-';
      
      // Other fields
      case 'nwrta_fail':
        return item.reject_rta ?? item.nwrta_fail ?? '-';
      
      default:
        return '-';
    }
  };

  // Helper function to determine if a value should be highlighted in red
  const shouldHighlightRed = (value: number, column: string) => {
    if (column === 'female_per') {
      return value > 50 || value < 25;
    }
    if (column === 'sc_category_per' || column === 'mentioned_sc') {
      return value < 3.5;
    }
    if (column === 'muslim_category_per' || column === 'mentioned_muslim') {
      return value < 15;
    }
    if (column === 'age_18_24_per' || column === 'age_18_24') {
      return value < 10;
    }
    if (column === 'age_50_above_per' || column === 'age_50_plus') {
      return value < 15;
    }
    if (column === 'without_phone_per' || column === 'pass_without_phone_per' || column === 'valid_without_phone_per') {
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
              <SelectDropdown
                options={acList?.map(ac => ({
                  value: ac.ac_code.toString(),
                  label: ac.acnameandcode
                })) || []}
                value={searchForm.acCode}
                onChange={(value) => handleInputChange('acCode', value as string)}
                placeholder={acListLoading ? "Loading AC list..." : "Select AC Code"}
                className="w-full"
                disabled={acListLoading}
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
            <Heading level={4}>
              {searchForm.typeOfReport === 'performance' ? 'PERFORMANCE' : 'QUALITY'} REPORT - {searchForm.level.toUpperCase()} LEVEL
            </Heading>
          </div>
          <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="table-responsive">
          <Table 
            key={`${searchForm.typeOfReport}-${searchForm.level}-${searchForm.acCode}`}
            className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300"
          >
            <thead className="table-light">
              <tr>
                {getTableHeaders().map((header) => (
                  <th 
                    key={header.key}
                    className={`border border-gray-300 ${header.width} ${header.className || ''}`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={getTableHeaders().length} className="text-center py-8 text-gray-500 border border-gray-300">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={getTableHeaders().length} className="text-center py-8 text-red-500 border border-gray-300">
                    {error}
                  </td>
                </tr>
              ) : progressData.length === 0 ? (
                <tr>
                  <td colSpan={getTableHeaders().length} className="text-center py-8 text-gray-500 border border-gray-300">
                    {searchForm.typeOfReport === 'performance' ? 'Performance' : 'Quality'} Data Not Found
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={`${item.ac_code || item.pc_code || item.interviewer_id || item.polling_station_no || item.polling_station_name || index}-${index}`}>
                    {getTableHeaders().map((header) => {
                      const value = getDataValue(item, header.key, index);
                      const isHighlighted = typeof value === 'number' && shouldHighlightRed(value, header.key);
                      const isPS = header.key === 'ps_covered' && value !== '-';
                      
                      return (
                        <td 
                          key={header.key}
                          className={`border border-gray-300 ${isHighlighted ? 'text-red-600 font-bold' : ''} ${isPS ? 'text-blue-600' : ''}`}
                        >
                          {header.key === 'sr' ? startIndex + index + 1 : value}
                        </td>
                      );
                    })}
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