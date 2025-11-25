import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { MapPin, User, Users, X } from 'lucide-react';
import { apiService } from '@/lib/api-service';

interface ACData {
  ac_code: number;
  ac_name: string;
  district_name: string;
  zone_name: string;
  mla_name: string;
  electorate: number;
  pc_code: number;
  pc_name: string;
  total_assigned: number;
  total_not_assigned: number;
  total_pending: number;
  total_pass: number;
  total_fail: number;
}

interface ACAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teleformUserId: number;
  telecallerName: string;
  onSuccess: () => void;
  mode?: 'telecaller' | 'data_entry';
}

const ACAssignmentModal: React.FC<ACAssignmentModalProps> = ({
  isOpen,
  onClose,
  teleformUserId,
  telecallerName,
  onSuccess,
  mode = 'telecaller',
}) => {
  const [acList, setAcList] = useState<ACData[]>([]);
  const [allAcList, setAllAcList] = useState<ACData[]>([]); // Store all ACs for client-side filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcs, setSelectedAcs] = useState<ACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  // Unassign functionality state
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [acToUnassign, setAcToUnassign] = useState<ACData | null>(null);
  const [unassigning, setUnassigning] = useState(false);

  // Fetch AC details and user statistics on modal open
  useEffect(() => {
    if (isOpen) {
      setAcList([]);
      setAllAcList([]);
      fetchACDetails();
      fetchUserStatistics();
    }
  }, [isOpen]);

  // Client-side search filtering
  useEffect(() => {
    if (!allAcList.length) return;

    if (!searchTerm.trim()) {
      setAcList(allAcList);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filteredACs = allAcList.filter((ac) => {
      // Try to determine if it's an AC code (number) or name
      if (!isNaN(Number(searchTerm))) {
        return ac.ac_code.toString().includes(searchTerm);
      } else {
        return (
          ac.ac_name.toLowerCase().includes(searchLower) ||
          ac.district_name.toLowerCase().includes(searchLower) ||
          ac.pc_name.toLowerCase().includes(searchLower) ||
          ac.mla_name.toLowerCase().includes(searchLower)
        );
      }
    });

    setAcList(filteredACs);
  }, [searchTerm, allAcList]);

  const fetchUserStatistics = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const token = localStorage.getItem('accessToken');
      
      // For data_entry users, use the unified-user-statistics endpoint with data_entry filter
      const response = await (mode === 'data_entry'
        ? fetch(`${apiUrl}/api/cati/unified-user-statistics?teleform_user_id=${teleformUserId}&data_entry=1`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
        : fetch(`${apiUrl}/api/cati/interviews/teleform-user/${teleformUserId}/statistics`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
      );

      const result = await response.json();

      if (response.ok && result.success) {
        if (mode === 'data_entry') {
          // unified-user-statistics returns an array; pick first item
          setUserStats(Array.isArray(result.data) ? result.data[0] : result.data);
        } else {
          setUserStats(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching user statistics:', err);
    }
  };


  const fetchACDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const token = localStorage.getItem('accessToken');
      
      // Build query parameters - fetch all ACs at once
      const params = new URLSearchParams({
        limit: '1000', // Fetch all ACs at once
      });

      // Use data-entry specific AC endpoint when mode === 'data_entry'
      const endpoint = mode === 'data_entry'
        ? `${apiUrl}/api/cati/ac-details/data-entry?${params.toString()}`
        : `${apiUrl}/api/cati/ac-details?${params.toString()}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AC Details API Response:', data);

      if (data.success) {
        const acDataRaw = Array.isArray(data.data?.data) ? data.data.data : [];
        // Normalize fields so UI can reuse the same ACData schema
        const acData = acDataRaw.map((item: any) => {
          const isDataEntry = mode === 'data_entry';
          const dataEntryTotal = Number(item.data_entry_total_data ?? item.data_entry_total ?? 0);
          const dataEntryAssigned = Number(item.data_entry_assigned_data ?? item.data_entry_assigned ?? 0);
          const dataEntryPending = Number(item.data_entry_pending ?? item.data_entry_pending ?? 0);
          const dataEntryComplete = Number(item.data_entry_complete_data ?? item.data_entry_complete ?? 0);

          const total_assigned_val = isDataEntry ? dataEntryAssigned : (item.total_assigned ?? 0);
          const total_pass_val = isDataEntry ? dataEntryComplete : (item.total_pass ?? 0);
          const total_pending_val = isDataEntry ? dataEntryPending : (item.total_pending ?? 0);
          const total_not_assigned_val = isDataEntry
            ? Math.max(0, dataEntryTotal - dataEntryAssigned)
            : (item.total_not_assigned ?? (item.total_assigned ? Math.max(0, (item.total_assigned - ((item.total_pass ?? 0) + (item.total_pending ?? 0)))) : 0));

          return {
            ac_code: item.ac_code,
            ac_name: item.ac_name,
            district_name: item.district_name || item.district || '',
            zone_name: item.zone_name || '',
            mla_name: item.mla_name || '',
            electorate: item.electorate || 0,
            pc_code: item.pc_code || 0,
            pc_name: item.pc_name || '',
            total_assigned: total_assigned_val,
            total_not_assigned: total_not_assigned_val,
            total_pass: total_pass_val,
            total_pending: total_pending_val,
            total_fail: item.total_fail ?? 0,
          };
        });
        setAllAcList(acData); // Store all ACs for client-side filtering
        setAcList(acData); // Initially show all ACs
        
        if (acData.length === 0) {
          setError('No Assembly Constituencies found');
        }
      } else {
        setError(data.message || 'Failed to fetch AC details');
      }
    } catch (err: any) {
      console.error('Error fetching AC details:', err);
      setError(err.message || 'Error fetching AC details');
    } finally {
      setLoading(false);
    }
  };

  const handleACSelect = (ac: ACData) => {
    const isAlreadySelected = selectedAcs.some(selected => selected.ac_code === ac.ac_code);
    const isAssigned = assignedACs.some((assigned: any) => assigned.ac_code === ac.ac_code);
    
    // If already assigned (with call_pending > 0), don't allow selection/deselection
    if (isAssigned) return;
    
    if (isAlreadySelected) {
      setSelectedAcs(selectedAcs.filter(selected => selected.ac_code !== ac.ac_code));
    } else {
      setSelectedAcs([...selectedAcs, ac]);
    }
  };

  const handleRemoveSelection = (ac: ACData) => {
    setSelectedAcs(selectedAcs.filter(selected => selected.ac_code !== ac.ac_code));
  };

  const handleUnassignClick = (ac: ACData) => {
    setAcToUnassign(ac);
    setShowUnassignModal(true);
  };

  const handleUnassignConfirm = async () => {
    if (!acToUnassign) return;

    setUnassigning(true);
    setError(null);
    setShowUnassignModal(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('NEXT_PUBLIC_API_URL is not set, falling back to http://localhost:4001');
      }

      const unassignEndpoint = mode === 'data_entry'
        ? `${apiUrl}/api/cati/ac-details/data-entry/unassign-data`
        : `${apiUrl}/api/cati/ac-details/unassign-data`;
      console.log('Unassign endpoint chosen:', unassignEndpoint);
      const response = await fetch(unassignEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teleform_user_id: teleformUserId,
          ac_code: acToUnassign.ac_code,
        }),
      });

      if (response.ok) {
        // Remove the unassigned AC from the local state immediately (handle multiple shapes)
        setUserStats((prevStats: any) => {
          if (!prevStats) return prevStats;
          const copy = { ...prevStats };
          if (Array.isArray(copy.ac_detail)) {
            copy.ac_detail = copy.ac_detail.filter((ac: any) => ac.ac_code !== acToUnassign.ac_code);
          }
          if (Array.isArray(copy.ac_wise_statistics)) {
            copy.ac_wise_statistics = copy.ac_wise_statistics.filter((ac: any) => ac.ac_code !== acToUnassign.ac_code);
          }
          return copy;
        });
        
        // Refresh the data after successful unassignment
        fetchUserStatistics().catch(err => {
          console.error('Error refreshing user statistics after unassign:', err);
          // Even if refresh fails, the local state update above will handle the UI
        });
        onSuccess(); // This will trigger refresh on the main page
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to unassign AC');
      }
    } catch (err: any) {
      console.error('Error unassigning AC:', err);
      setError(err.message || 'Error unassigning AC');
    } finally {
      setUnassigning(false);
      setAcToUnassign(null);
    }
  };

  const handleUnassignCancel = () => {
    setShowUnassignModal(false);
    setAcToUnassign(null);
  };

  const handleSubmit = async () => {
    if (selectedAcs.length === 0) {
      setError('Please select at least one Assembly Constituency');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // if (!apiUrl) {
      //   throw new Error('API URL not configured');
      // }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

      // Submit all selected ACs
      const assignEndpoint = mode === 'data_entry'
        ? `${apiUrl}/api/cati/ac-details/data-entry/assign-data`
        : `${apiUrl}/api/cati/ac-details/assign-data`;
      console.log('Assign endpoint chosen:', assignEndpoint);
      const promises = selectedAcs.map(ac => 
        fetch(assignEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teleform_user_id: teleformUserId,
            ac_code: ac.ac_code,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const allSuccess = responses.every(r => r.ok);

      if (allSuccess) {
        onSuccess(); // This will trigger refresh on the main page
        onClose();
        setSelectedAcs([]);
        setSearchTerm('');
      } else {
        setError('Some assignments failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Error assigning data:', err);
      setError(err.message || 'Error assigning data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAcs([]);
    setSearchTerm('');
    setError(null);
    onClose();
  };

  // Get assigned ACs from stats - filter out ACs with call_pending=0
  // Support multiple stats shapes: ac_detail (telecaller), ac_wise_statistics (unified), ac_detail for QC as well
  const userAcList = userStats?.ac_detail || userStats?.ac_wise_statistics || [];
  const assignedACs = (userAcList || []).filter((ac: any) => {
    const pending = ac.call_pending ?? ac.total_pending ?? ac.data_entry_pending ?? 0;
    return pending > 0;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Assembly Constituency Data"
      size="lg"
      className="max-h-[85vh]"
    >
      <div className="space-y-4">
        {/* Compact Telecaller Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
            Assigning data for: {telecallerName}
          </p>
        </div>

        {/* Selected and Assigned ACs Chips */}
        {(assignedACs.length > 0 || selectedAcs.length > 0) && (
          <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Selected ACs ({assignedACs.length + selectedAcs.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Already Assigned ACs - Can unassign */}
              {assignedACs.map((ac: any) => (
                <div
                  key={`assigned-${ac.ac_code}`}
                  className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-full px-2 py-1 group"
                  title="Click to unassign"
                >
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    {ac.ac_name}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    #{ac.ac_code}
                  </span>
                  <button
                    onClick={() => handleUnassignClick(ac)}
                    className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Unassign AC"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Newly Selected ACs - Can remove */}
              {selectedAcs.map((ac) => (
                <div
                  key={`selected-${ac.ac_code}`}
                  className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full px-2 py-1 group"
                >
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {ac.ac_name}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    #{ac.ac_code}
                  </span>
                  <button
                    onClick={() => handleRemoveSelection(ac)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    title="Remove"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Assembly Constituency
          </label>
          <Input
            type="text"
            placeholder="Search by AC Code, AC Name, District, Zone, PC, or MLA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Type to search by AC code, name, district, zone, PC, or MLA name
          </p>
        </div>

        {/* AC List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Assembly Constituency
            {acList.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                ({acList.length} ACs)
              </span>
            )}
          </label>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div 
              className="max-h-[45vh] min-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {acList.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {acList.map((ac) => {
                    const isAssigned = assignedACs.some((assigned: any) => assigned.ac_code === ac.ac_code);
                    const isSelected = selectedAcs.some(selected => selected.ac_code === ac.ac_code);
                    
                    return (
                    <div
                      key={ac.ac_code}
                      className={`p-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                          : isAssigned
                          ? 'bg-green-50 dark:bg-green-900/10 border-l-2 border-green-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleACSelect(ac)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Left: AC Name & Code */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {ac.ac_name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                #{ac.ac_code}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {ac.district_name}
                            </div>
                          </div>
                        </div>

                        {/* Right: Available Count & Status */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {isAssigned && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full whitespace-nowrap">
                              Assigned
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full whitespace-nowrap">
                              Selected
                            </span>
                          )}
                          <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Available</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {ac.total_not_assigned}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No Assembly Constituencies found matching your search.' : 'No Assembly Constituencies available.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - Always visible */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedAcs.length === 0 || submitting}
            loading={submitting}
          >
            {submitting ? 'Assigning...' : `Assign ${selectedAcs.length > 0 ? `(${selectedAcs.length})` : 'Data'}`}
          </Button>
        </div>
      </div>

      {/* Unassign Confirmation Modal */}
      <ConfirmationModal
        isOpen={showUnassignModal}
        onClose={handleUnassignCancel}
        onConfirm={handleUnassignConfirm}
        title="Unassign Assembly Constituency"
        message={`Are you sure you want to unassign ${acToUnassign?.ac_name} (${acToUnassign?.ac_code}) from ${telecallerName}?`}
        confirmText="Unassign"
        cancelText="Cancel"
        variant="danger"
        loading={unassigning}
      />
    </Modal>
  );
};

export default ACAssignmentModal;

