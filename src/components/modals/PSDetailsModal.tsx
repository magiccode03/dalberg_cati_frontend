'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiService } from '@/lib/api';

interface PSDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  acCode?: string;
  pcCode?: string;
  reportDays: string;
  customDate?: string;
  customDateEnd?: string;
  level: 'ac' | 'pc';
}

interface PSDetailData {
  sr_no: number;
  ps_code: string;
  no_of_interviewers_worked: number;
  completed_interviews: number;
  valid_interviews: number;
  interviews_under_qc: number;
  rejected_interviews: number;
  interviewers: Array<{
    interviewer_id: string;
    full_interviews: number;
  }>;
}

interface PSDetailsResponse {
  title: string;
  ps_covered_type: string;
  total_ps_covered: number;
  ps_list: PSDetailData[];
  applied_filters: {
    ps_covered: string;
    report_days: string;
    ac_code?: number;
    pc_code?: string;
    agency_id: number | null;
    is_ppm_user: boolean;
  };
}

export default function PSDetailsModal({
  isOpen,
  onClose,
  acCode,
  pcCode,
  reportDays,
  customDate,
  customDateEnd,
  level
}: PSDetailsModalProps) {
  const [psData, setPsData] = useState<PSDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && (acCode || pcCode)) {
      fetchPSDetails();
    }
  }, [isOpen, acCode, pcCode, reportDays, customDate, customDateEnd, level]);

  const fetchPSDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        report_days: reportDays,
        custom_date: customDate || undefined,
        custom_date_end: customDateEnd || undefined,
        ps_covered: 'pscovered'
      };

      // Add the appropriate code parameter based on level
      if (level === 'ac' && acCode) {
        params.ac_code = acCode;
      } else if (level === 'pc' && pcCode) {
        params.pc_code = pcCode;
      }

      console.log('PS Details API Parameters:', params);
      
      const response = await apiService.getPSDetails(params);
      
      if (response.success) {
        setPsData(response.data);
      } else {
        setError('Failed to fetch PS details');
      }
    } catch (err) {
      console.error('Error fetching PS details:', err);
      setError('An error occurred while fetching PS details');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    if (!psData || !psData.ps_list || psData.ps_list.length === 0) return null;
    
    const summary = psData.ps_list.reduce((acc, item) => ({
      total_interviewers: acc.total_interviewers + item.no_of_interviewers_worked,
      total_completed_interviews: acc.total_completed_interviews + item.completed_interviews,
      total_valid_interviews: acc.total_valid_interviews + item.valid_interviews,
      total_interviews_under_qc: acc.total_interviews_under_qc + item.interviews_under_qc,
      total_rejected_interviews: acc.total_rejected_interviews + item.rejected_interviews,
    }), {
      total_interviewers: 0,
      total_completed_interviews: 0,
      total_valid_interviews: 0,
      total_interviews_under_qc: 0,
      total_rejected_interviews: 0,
    });

    return summary;
  };

  const summaryData = calculateSummary();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="text-center flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {level.toUpperCase()} Code - {psData?.applied_filters.ac_code || psData?.applied_filters.pc_code || 'N/A'} PS Covered
            </h2>
            {psData && (
              <p className="text-sm text-gray-600 mt-1">
                Total PS Covered: {psData.total_ps_covered}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading PS details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">Sr.No.</th>
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">PS Code</th>
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">
                      No Of Interviewers Worked
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">Completed Interviews</th>
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">Valid Interviews</th>
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">Interviews Under QC</th>
                    <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-center">Rejected Interviews</th>
                  </tr>
                </thead>
                <tbody>
                  {psData?.ps_list?.map((item, index) => (
                    <tr key={index} className="bg-blue-50 hover:bg-blue-100">
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center">{item.sr_no}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center font-medium">{item.ps_code}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                        <div className="space-y-1">
                          <div className="grid grid-cols-2 gap-1 text-xs font-bold border border-gray-400">
                            <div className="border-r border-gray-400 p-1 text-gray-800">Interviewer({item.no_of_interviewers_worked})</div>
                            <div className="p-1 text-gray-800">Full Interviews</div>
                          </div>
                          {item.interviewers.map((interviewer, idx) => (
                            <div key={idx} className="grid grid-cols-2 gap-1 text-xs border border-gray-400">
                              <div className="border-r border-gray-400 p-1">{interviewer.interviewer_id || 'N/A'}</div>
                              <div className="p-1">{interviewer.full_interviews}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center">{item.completed_interviews}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center">{item.valid_interviews}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center">{item.interviews_under_qc}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm text-center">{item.rejected_interviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
