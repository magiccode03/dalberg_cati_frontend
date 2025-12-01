'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface UnifiedUserData {
  user_id: number;
  user_name: string;
  user_type: 'telecaller' | 'qc_user' | 'data_entry';
  total_assigned: number;
  total_call_attempted?: number;
  total_call_pending?: number;
  total_qc_pass?: number;
  total_qc_fail?: number;
  total_qc_pending?: number;
  data_entry_pass?: number;
  data_entry_pending?: number;
  ac_wise_statistics: Array<{
    ac_code: number;
    ac_name: string;
    total_assigned: number;
    call_attempted?: number;
    call_pending?: number;
    qc_pass?: number;
    qc_fail?: number;
    qc_pending?: number;
    data_entry_pass?: number;
    data_entry_pending?: number;
  }>;
}

interface TelecallerExpandedDetailsProps {
  user: UnifiedUserData;
}

const TelecallerExpandedDetails: React.FC<TelecallerExpandedDetailsProps> = ({ user }) => {
  const isQCUser = user.user_type === 'qc_user';
  const isDataEntry = user.user_type === 'data_entry';

  return (
    <div className="p-3 md:p-4">
      <div className="space-y-3">
        {/* Detailed Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Total Assigned:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {user.total_assigned}
              </span>
            </div>
            {isQCUser ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Pass:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {user.total_qc_pass || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Fail:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {user.total_qc_fail || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Pending:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {user.total_qc_pending || 0}
                  </span>
                </div>
              </>
            ) : isDataEntry ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Pass:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {user.data_entry_pass || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Pending:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {user.data_entry_pending || 0}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Attempted:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {user.total_call_attempted || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Pending:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {user.total_call_pending || 0}
                  </span>
                </div>
              </>
            )}
          </div>
          <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
        </div>

        {/* AC Details Row */}
        {user.ac_wise_statistics && user.ac_wise_statistics.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                AC-wise Breakdown ({user.ac_wise_statistics.length} ACs)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {user.ac_wise_statistics.map((ac) => (
                <div key={ac.ac_code} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {ac.ac_name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded flex-shrink-0">
                      #{ac.ac_code}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {isQCUser ? (
                      <>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Pass:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {ac.qc_pass || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Fail:</span>
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {ac.qc_fail || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                          <span className="font-semibold text-orange-600 dark:text-orange-400">
                            {ac.qc_pending || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {ac.total_assigned}
                          </span>
                        </div>
                      </>
                    ) : isDataEntry ? (
                      <>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Pass:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {ac.data_entry_pass || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                          <span className="font-semibold text-orange-600 dark:text-orange-400">
                            {ac.data_entry_pending || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {ac.total_assigned}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Attempted:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {ac.call_attempted || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                          <span className="font-semibold text-orange-600 dark:text-orange-400">
                            {ac.call_pending || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {ac.total_assigned}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelecallerExpandedDetails;

