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
import { Search, Download, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import type { PerformanceReportData, PerformanceReportParams, ACListItem } from '@/lib/api';
import PSDetailsModal from '@/components/modals/PSDetailsModal';

export default function ProgressReportPage() {
  const [searchForm, setSearchForm] = useState({
    reportDays: 'all',
    typeOfReport: 'performance',
    level: 'ac',
    acCode: '',
    customDate: '',
    customDateEnd: ''
  });

  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acList, setAcList] = useState<ACListItem[]>([]);
  const [acListLoading, setAcListLoading] = useState(false);
  const [psModalOpen, setPsModalOpen] = useState(false);
  const [selectedAcCode, setSelectedAcCode] = useState<string>('');

  // Load AC list and fetch progress report data on component mount
  useEffect(() => {
    fetchACList();
    // Auto-fetch progress report data with default values
    fetchProgressReport();
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

  const fetchProgressReport = async (skipValidation = false) => {
    setLoading(true);
    setError(null);
    setProgressData([]); // Clear previous data immediately
    
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
    if (searchForm.reportDays === 'custom' && (!searchForm.customDate || !searchForm.customDateEnd)) {
      setError('Start Date and End Date are required for custom period');
      return;
    }
    
    fetchProgressReport(false);
  };

  const handleClear = () => {
    const defaultForm = {
      reportDays: 'all',
      typeOfReport: 'performance',
      level: 'ac',
      acCode: '',
      customDate: '',
      customDateEnd: ''
    };
    setSearchForm(defaultForm);
    setError(null);
    setProgressData([]);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePSClick = (code: string) => {
    setSelectedAcCode(code);
    setPsModalOpen(true);
  };

  const handleDownload = () => {
    if (progressData.length === 0) return;

    // Get table headers
    const headers = getTableHeaders();
    
    // Create CSV content
    const csvContent = [
      // Header row
      headers.map(header => `"${header.label}"`).join(','),
      // Data rows
      ...progressData.map((item, index) => 
        headers.map(header => {
          const value = getDataValue(item, header.key, index);
          return `"${value}"`;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Generate filename with current date and report type
    const currentDate = new Date().toISOString().split('T')[0];
    const reportType = searchForm.typeOfReport === 'performance' ? 'Performance' : 'Quality';
    const level = searchForm.level.toUpperCase();
    const filename = `${reportType}_Report_${level}_${currentDate}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Helper function to get table headers based on type and level
  const getTableHeaders = () => {
    const type = searchForm.typeOfReport;
    const level = searchForm.level;

    if (type === 'performance') {
      switch (level) {
        case 'ac':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'ac_code', label: 'AC Code', width: 'w-20', align: 'center' },
            { key: 'ac_name', label: 'AC Name', width: 'w-32', align: 'left' },
            { key: 'pc_name', label: 'Pc Name', width: 'w-32', align: 'left' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24', align: 'center' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-48', align: 'center' },
            { key: 'ps_covered', label: 'PS Covered', width: 'w-24', align: 'center' },
            { key: 'completed_interviews', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'terminated_interviews', label: 'Terminated Interviews', width: 'w-48', align: 'center' },
            { key: 'system_rejections', label: 'System rejections', width: 'w-40', align: 'center' },
            { key: 'counts_after_terminated', label: 'Counts after Terminated and System Rejection', width: 'w-80', align: 'center' },
            { key: 'gps_pending', label: 'GPS Pending', width: 'w-24', align: 'center' },
            { key: 'gps_fail', label: 'GPS Fail', width: 'w-20', align: 'center' },
            { key: 'passed', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white', align: 'center' },
            { key: 'failed', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white', align: 'center' },
            { key: 'under_qc', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white', align: 'center' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-48', align: 'center' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-48', align: 'center' },
            { key: 'actual_sc', label: 'Actual % of SC', width: 'w-32', align: 'center' },
            { key: 'mentioned_sc', label: '% of Interviews mentioned as SC', width: 'w-44', align: 'center' },
            { key: 'actual_muslim', label: 'Actual % of Muslims', width: 'w-40', align: 'center' },
            { key: 'mentioned_muslim', label: '% of Interviews mentioned as Muslims', width: 'w-48', align: 'center' },
            { key: 'age_18_24', label: '% of Interviews under the age of (18-24)', width: 'w-48', align: 'center' },
            { key: 'age_50_plus', label: '% of Interviews under the age of (50+)', width: 'w-48', align: 'center' }
          ];
        case 'pc':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'pc_code', label: 'PC Code', width: 'w-20', align: 'center' },
            { key: 'pc_name', label: 'PC Name', width: 'w-32', align: 'left' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24', align: 'center' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-48', align: 'center' },
            { key: 'ps_covered', label: 'PS Covered', width: 'w-24', align: 'center' },
            { key: 'completed_interviews', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'terminated_interviews', label: 'Terminated Interviews', width: 'w-48', align: 'center' },
            { key: 'system_rejections', label: 'System rejections', width: 'w-40', align: 'center' },
            { key: 'counts_after_terminated', label: 'Counts after Terminated and System Rejection', width: 'w-80', align: 'center' },
            { key: 'passed', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white', align: 'center' },
            { key: 'failed', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white', align: 'center' },
            { key: 'under_qc', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white', align: 'center' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-48', align: 'center' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-48', align: 'center' },
            { key: 'mentioned_sc', label: '% of Interviews mentioned as SC', width: 'w-44', align: 'center' },
            { key: 'mentioned_muslim', label: '% of Interviews mentioned as Muslims', width: 'w-48', align: 'center' },
            { key: 'age_18_24', label: '% of Interviews under the age of (18-24)', width: 'w-48', align: 'center' },
            { key: 'age_50_plus', label: '% of Interviews under the age of (50+)', width: 'w-48', align: 'center' }
          ];
        case 'interviewer':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'interviewer_id', label: 'Interviewer ID', width: 'w-32', align: 'center' },
            { key: 'no_of_ac', label: 'No of AC covered', width: 'w-40', align: 'center' },
            { key: 'pscovered', label: 'PS Covered', width: 'w-24', align: 'center' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'invalid', label: 'Terminated Interviews', width: 'w-48', align: 'center' },
            { key: 'reject_auto', label: 'System rejections', width: 'w-40', align: 'center' },
            { key: 'count_after_termination_and_rejection', label: 'Counts after Terminated and System Rejection', width: 'w-80', align: 'center' },
            { key: 'valid', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white', align: 'center' },
            { key: 'reject', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white', align: 'center' },
            { key: 'interview_in_qc_total', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white', align: 'center' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-48', align: 'center' },
            { key: 'no_of_day', label: 'No of days worked', width: 'w-40', align: 'center' },
            { key: 'without_audio', label: 'No of Interviews without audio', width: 'w-48', align: 'center' },
            { key: 'average_per_day', label: 'Average per day', width: 'w-40', align: 'center' },
            { key: 'min_achivement', label: 'Lowest achievement', width: 'w-40', align: 'center' },
            { key: 'max_achivement', label: 'Highest achievement', width: 'w-40', align: 'center' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-48', align: 'center' },
            { key: 'sc_category_per', label: '% of Interviews mentioned as SC', width: 'w-44', align: 'center' },
            { key: 'muslim_category_per', label: '% of Interviews mentioned as Muslims', width: 'w-48', align: 'center' },
            { key: 'age_18_24_per', label: '% of Interviews under the age of (18-24)', width: 'w-48', align: 'center' },
            { key: 'age_50_above_per', label: '% of Interviews under the age of (50+)', width: 'w-48', align: 'center' },
            { key: 'rejection_per', label: '% of Rejection', width: 'w-32', align: 'center' }
          ];
        case 'polingstation':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'polling_station_name', label: 'Polling Station Name', width: 'w-48', align: 'left' },
            { key: 'ac_name', label: 'AC Name', width: 'w-32', align: 'left' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24', align: 'center' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-48', align: 'center' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'invalid', label: 'Terminated Interviews', width: 'w-48', align: 'center' },
            { key: 'reject_auto', label: 'System Rejections', width: 'w-40', align: 'center' },
            { key: 'count_after_termination_and_rejection', label: 'Counts After Terminated And System Rejection', width: 'w-80', align: 'center' },
            { key: 'valid', label: 'Passed', width: 'w-20', className: 'bg-green-500 text-white', align: 'center' },
            { key: 'reject', label: 'Failed', width: 'w-20', className: 'bg-red-500 text-white', align: 'center' },
            { key: 'interview_in_qc_total', label: 'Under QC', width: 'w-24', className: 'bg-blue-500 text-white', align: 'center' },
            { key: 'female_per', label: '% Of Female Interviews', width: 'w-48', align: 'center' },
            { key: 'without_phone_per', label: '% of interviews without Phone Number', width: 'w-48', align: 'center' },
            { key: 'sc_category_per', label: '% of Interviews mentioned as SC', width: 'w-44', align: 'center' },
            { key: 'muslim_category_per', label: '% of Interviews mentioned as Muslims', width: 'w-48', align: 'center' },
            { key: 'age_18_24_per', label: '% of Interviews under the age of (18-24)', width: 'w-48', align: 'center' },
            { key: 'age_50_above_per', label: '% of Interviews under the age of (50+)', width: 'w-48', align: 'center' }
          ];
        default:
          return [];
      }
    } else if (type === 'quality') {
      switch (level) {
        case 'ac':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'ac_code', label: 'Ac Code', width: 'w-20', align: 'center' },
            { key: 'ac_name', label: 'Ac Name', width: 'w-32', align: 'left' },
            { key: 'pc_name', label: 'Pc Name', width: 'w-32', align: 'left' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24', align: 'center' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-48', align: 'center' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32', align: 'center' },
            { key: 'valid_without_phone_per', label: '% of pass interviews without Phone Number', width: 'w-48', align: 'center' },
            { key: 'assign_to_audioqc', label: 'Assigned to Audio', width: 'w-40', align: 'center' },
            { key: 'interview_in_qc_total', label: 'Under QC Interviews', width: 'w-40', align: 'center' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32', align: 'center' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24', align: 'center' },
            { key: 'reject_short', label: 'Short Interviews Fail', width: 'w-40', align: 'center' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-40', align: 'center' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24', align: 'center' },
            { key: 'reject_qc_audio_gender', label: 'Survey conversation can be heard', width: 'w-48', align: 'center' },
            { key: 'reject_qc_audio_blank', label: 'No Conversation', width: 'w-32', align: 'center' },
            { key: 'reject_qc_audio_irrelevant', label: 'Irrelevant conversation', width: 'w-48', align: 'center' },
            { key: 'reject_qc_audio_respondent', label: 'Interviewer acting as respondent', width: 'w-64', align: 'center' },
            { key: 'reject_qc_audio_interviewer_more', label: 'Can hear the interviewer more than the respondent', width: 'w-80', align: 'center' },
            { key: 'reject_qc_audio_mechanical', label: 'The interviewer is asking questions mechanically', width: 'w-80', align: 'center' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24', align: 'center' }
          ];
        case 'pc':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'pc_code', label: 'PC Code', width: 'w-20', align: 'center' },
            { key: 'pc_name', label: 'PC Name', width: 'w-32', align: 'left' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24', align: 'center' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-48', align: 'center' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32', align: 'center' },
            { key: 'valid_without_phone_per', label: '% of Valid interviews without Phone Number', width: 'w-56', align: 'center' },
            { key: 'assign_to_qc', label: 'Assigned to Audio', width: 'w-40', align: 'center' },
            { key: 'interview_in_qc_total', label: 'Under QC Interviews', width: 'w-40', align: 'center' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32', align: 'center' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24', align: 'center' },
            { key: 'reject_short', label: 'Short Interviews Fail', width: 'w-40', align: 'center' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-40', align: 'center' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24', align: 'center' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24', align: 'center' }
          ];
        case 'interviewer':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'interviewer_id', label: 'Interviewer ID', width: 'w-32', align: 'center' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32', align: 'center' },
            { key: 'valid_without_phone_per', label: '% of Pass interviews without Phone Number', width: 'w-56', align: 'center' },
            { key: 'assign_to_audioqc', label: 'Assigned to Audio', width: 'w-40', align: 'center' },
            { key: 'interview_in_qc_total', label: 'Under QC Interviews', width: 'w-40', align: 'center' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32', align: 'center' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24', align: 'center' },
            { key: 'reject_short', label: 'Short Interviews Fail', width: 'w-40', align: 'center' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-40', align: 'center' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24', align: 'center' },
            { key: 'reject_qc_audio_gender', label: 'Survey conversation can be heard', width: 'w-48', align: 'center' },
            { key: 'reject_qc_audio_blank', label: 'No Conversation', width: 'w-32', align: 'center' },
            { key: 'reject_qc_audio_irrelevant', label: 'Irrelevant conversation', width: 'w-48', align: 'center' },
            { key: 'reject_qc_audio_respondent', label: 'Interviewer acting as respondent', width: 'w-64', align: 'center' },
            { key: 'reject_qc_audio_interviewer_more', label: 'Can hear the interviewer more than the respondent', width: 'w-80', align: 'center' },
            { key: 'reject_qc_audio_mechanical', label: 'The interviewer is asking questions mechanically', width: 'w-80', align: 'center' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24', align: 'center' },
            { key: 'rejection_per', label: 'Rejection %', width: 'w-24', align: 'center' }
          ];
        case 'polingstation':
          return [
            { key: 'sr', label: 'Sr.No.', width: 'w-16', align: 'center' },
            { key: 'polling_station_name', label: 'Polling Station Name', width: 'w-48', align: 'left' },
            { key: 'ac_name', label: 'Ac Name', width: 'w-32', align: 'left' },
            { key: 'target_sample', label: 'Target Sample', width: 'w-24', align: 'center' },
            { key: 'interviewer', label: 'No of Interviewers Worked', width: 'w-48', align: 'center' },
            { key: 'total_interview', label: 'Completed Interviews', width: 'w-48', align: 'center' },
            { key: 'valid', label: 'Pass interviews', width: 'w-32', align: 'center' },
            { key: 'valid_without_phone_per', label: '% of Pass interviews without Phone Number', width: 'w-56', align: 'center' },
            { key: 'assign_to_audioqc', label: 'Assigned to Audio', width: 'w-40', align: 'center' },
            { key: 'interview_in_qc_total', label: 'Under QC Interview', width: 'w-40', align: 'center' },
            { key: 'reject', label: 'Fail Interviews', width: 'w-32', align: 'center' },
            { key: 'reject_auto', label: 'System Fail', width: 'w-24', align: 'center' },
            { key: 'reject_short', label: 'Short Interviews', width: 'w-32', align: 'center' },
            { key: 'reject_duplicatephone', label: 'Duplicate Mobile Number', width: 'w-40', align: 'center' },
            { key: 'reject_qc_audio', label: 'Audio Fail', width: 'w-24', align: 'center' },
            { key: 'reject_rta', label: 'N+W+RTA Fail', width: 'w-24', align: 'center' }
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
        return (itemIndex || 0) + 1; // Calculate correct serial number
      
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
      <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
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
              </Text>
              <div className="relative">
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
                  searchable={true}
                />
                {searchForm.acCode && (
                  <button
                    type="button"
                    onClick={() => handleInputChange('acCode', '')}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear selection"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
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
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              {searchForm.typeOfReport === 'performance' ? 'PERFORMANCE' : 'QUALITY'} REPORT - {searchForm.level.toUpperCase()} LEVEL
            </Heading>
          </div>
          <Button 
            variant="primary" 
            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            onClick={handleDownload}
            disabled={loading || progressData.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="table-responsive">
          <Table 
            key={`${searchForm.typeOfReport}-${searchForm.level}-${searchForm.acCode}`}
            className="table table-centered table-striped dt-responsive nowrap w-100 border border-gray-300"
          >
            <thead className="table-light bg-gray-50">
              <tr>
                {getTableHeaders().map((header) => (
                  <th 
                    key={header.key}
                    className={`border border-gray-300 ${header.width} ${header.className || ''} text-${header.align || 'left'}`}
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
                progressData.map((item, index) => (
                  <tr key={`${item.ac_code || item.pc_code || item.interviewer_id || item.polling_station_no || item.polling_station_name || index}-${index}`}>
                    {getTableHeaders().map((header) => {
                      const value = getDataValue(item, header.key, index);
                      const isHighlighted = typeof value === 'number' && shouldHighlightRed(value, header.key);
                      const isPS = header.key === 'ps_covered' && value !== '-';
                      const isClickablePS = isPS && searchForm.typeOfReport === 'performance' && ['ac', 'pc'].includes(searchForm.level);
                      
                      // Get the appropriate code based on level
                      const codeToPass = searchForm.level === 'ac' ? item.ac_code : item.pc_code;
                      
                      return (
                        <td 
                          key={header.key}
                          className={`border border-gray-300 text-${header.align || 'left'} ${isHighlighted ? 'text-red-600 font-bold' : ''} ${isPS ? 'text-blue-600' : ''} ${isClickablePS ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                          onClick={isClickablePS ? () => handlePSClick(codeToPass || 'all') : undefined}
                        >
                          {isClickablePS ? (
                            <span className="underline hover:no-underline">
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

      </Card>

      {/* PS Details Modal */}
      <PSDetailsModal
        isOpen={psModalOpen}
        onClose={() => setPsModalOpen(false)}
        acCode={searchForm.level === 'ac' ? selectedAcCode : undefined}
        pcCode={searchForm.level === 'pc' ? selectedAcCode : undefined}
        reportDays={searchForm.reportDays}
        customDate={searchForm.customDate}
        customDateEnd={searchForm.customDateEnd}
        level={searchForm.level as 'ac' | 'pc'}
      />
    </Container>
  );
}