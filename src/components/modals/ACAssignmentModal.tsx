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
  total_data: number;
  assigned_data: number;
  pending_data: number;
  complete_data: number;
  data_available: number;
  pending_for_assign: number;
}

interface ACAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teleformUserId: number;
  telecallerName: string;
  onSuccess: () => void;
}

const ACAssignmentModal: React.FC<ACAssignmentModalProps> = ({
  isOpen,
  onClose,
  teleformUserId,
  telecallerName,
  onSuccess,
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
      
      const response = await fetch(`${apiUrl}/api/cati/interviews/teleform-user/${teleformUserId}/statistics`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUserStats(result.data);
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

      const response = await fetch(`${apiUrl}/api/cati/ac-details?${params.toString()}`, {
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
        const acData = Array.isArray(data.data?.data) ? data.data.data : [];
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${apiUrl}/api/cati/ac-details/unassign-data`, {
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
        // Remove the unassigned AC from the local state immediately
        setUserStats((prevStats: any) => {
          if (!prevStats || !prevStats.ac_detail) return prevStats;
          
          return {
            ...prevStats,
            ac_detail: prevStats.ac_detail.filter((ac: any) => ac.ac_code !== acToUnassign.ac_code)
          };
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      // Submit all selected ACs
      const promises = selectedAcs.map(ac => 
        fetch(`${apiUrl}/api/cati/ac-details/assign-data`, {
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
  const assignedACs = (userStats?.ac_detail || []).filter((ac: any) => ac.call_pending > 0);

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
                              {ac.pending_for_assign}
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

