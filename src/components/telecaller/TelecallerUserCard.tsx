'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Edit, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UnifiedUserData {
  user_id: number;
  user_name: string;
  mobile_number: string;
  user_type: 'telecaller' | 'qc_user' | 'data_entry';
  agency_id: number;
  agency_name: string;
  status: number;
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

interface TelecallerUserCardProps {
  user: UnifiedUserData;
  isExpanded: boolean;
  onToggleExpand: (userId: number) => void;
  onAddData: (user: UnifiedUserData) => void;
  renderExpandedDetails?: (user: UnifiedUserData) => React.ReactNode;
}

const TelecallerUserCard: React.FC<TelecallerUserCardProps> = ({
  user,
  isExpanded,
  onToggleExpand,
  onAddData,
  renderExpandedDetails,
}) => {
  const router = useRouter();
  const isQCUser = user.user_type === 'qc_user';
  const isDataEntry = user.user_type === 'data_entry';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      {/* Main Row Content */}
      <div className="p-3 md:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left Section - User Info */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm md:text-base">
              {user.user_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.user_name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    ID: {user.user_id}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${user.status === 1
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {user.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-mono">{user.mobile_number}</span>
              </div>
            </div>
          </div>

          {/* Center Section - Quick Stats */}
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-1">
            {isQCUser ? (
              <>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Assigned</p>
                  <p className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {user.total_assigned}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pass</p>
                  <p className="text-base md:text-lg font-bold text-green-600 dark:text-green-400">
                    {user.total_qc_pass || 0}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fail</p>
                  <p className="text-base md:text-lg font-bold text-red-600 dark:text-red-400">
                    {user.total_qc_fail || 0}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-base md:text-lg font-bold text-orange-600 dark:text-orange-400">
                    {user.total_qc_pending || 0}
                  </p>
                </div>
              </>
            ) : isDataEntry ? (
              <>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Assigned</p>
                  <p className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {user.total_assigned}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pass</p>
                  <p className="text-base md:text-lg font-bold text-green-600 dark:text-green-400">
                    {user.data_entry_pass || 0}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-base md:text-lg font-bold text-orange-600 dark:text-orange-400">
                    {user.data_entry_pending || 0}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Assigned</p>
                  <p className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {user.total_assigned}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Attempted</p>
                  <p className="text-base md:text-lg font-bold text-green-600 dark:text-green-400">
                    {user.total_call_attempted || 0}
                  </p>
                </div>
                <div className="text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-base md:text-lg font-bold text-orange-600 dark:text-orange-400">
                    {user.total_call_pending || 0}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center justify-end gap-1 md:gap-2 flex-1 lg:flex-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleExpand(user.user_id)}
              title={isExpanded ? "Hide assigned AC details" : "View assigned AC details"}
              className="text-xs md:text-sm px-2 md:px-3"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">Assigned AC</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">Assigned AC</span>
                </>
              )}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(`/cati/ppm/manage-calling/edit-tele-caller/${user.user_id}`)}
              title="Edit telecaller"
              className="px-2 md:px-3"
            >
              <Edit className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={`px-2 md:px-3 ${isQCUser
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              onClick={() => onAddData(user)}
              title={isQCUser ? "Assign AC for QC" : "Assign AC data"}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && renderExpandedDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {renderExpandedDetails(user)}
        </div>
      )}
    </div>
  );
};

export default TelecallerUserCard;

