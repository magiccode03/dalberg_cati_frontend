'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { Plus, Search } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import PaginationStandard from '@/components/ui/PaginationStandard';
import ACAssignmentModal from '@/components/modals/ACAssignmentModal';
import CatiQCACAssignModal from '@/components/modals/CatiQCACAssignModal';
import QCMetrics from '@/components/telecaller/QCMetrics';
import TelecallerSearchFilters from '@/components/telecaller/TelecallerSearchFilters';
import TelecallerUserCard from '@/components/telecaller/TelecallerUserCard';
import TelecallerExpandedDetails from '@/components/telecaller/TelecallerExpandedDetails';
import { useTelecallerData } from '@/components/telecaller/useTelecallerData';

interface UnifiedUserData {
  user_id: number;
  user_name: string;
  mobile_number: string;
  user_type: 'telecaller' | 'qc_user' | 'data_entry';
  agency_id: number;
  agency_name: string;
  status: number;
  total_assigned: number;
  // For telecallers
  total_call_attempted?: number;
  total_call_pending?: number;
  // For QC users
  total_qc_pass?: number;
  total_qc_fail?: number;
  total_qc_pending?: number;
  // For Data Entry users
  data_entry_pass?: number;
  data_entry_pending?: number;
  ac_wise_statistics: Array<{
    ac_code: number;
    ac_name: string;
    total_assigned: number;
    // For telecallers
    call_attempted?: number;
    call_pending?: number;
    // For QC users
    qc_pass?: number;
    qc_fail?: number;
    qc_pending?: number;
    // For Data Entry users
    data_entry_pass?: number;
    data_entry_pending?: number;
  }>;
}

interface SearchFilters {
  teleform_user_id: string;
  name: string;
  mobile_number: string;
  status: string;
  telecaller: string;
  ac_code: string;
  permission: string;
  telecalling_group_id: string;
}

interface TelecallingGroup {
  id: number;
  name: string;
}

interface TelecallerOption {
  value: string;
  label: string;
  user_id: number;
  name: string;
  mobile_number: string;
}

const TeleUserInfoPage: React.FC = () => {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    teleform_user_id: '',
    name: '',
    mobile_number: '',
    status: '',
    telecaller: '',
    ac_code: '',
    permission: '', // No default permission filter
    telecalling_group_id: '',
  });

  // Consolidated state management
  const [state, setState] = useState({
    // Data states
    telecallerOptions: [] as TelecallerOption[],
    acOptions: [] as Array<{ value: string; label: string }>,
    telecallingGroups: [] as TelecallingGroup[],
    userData: [] as UnifiedUserData[],

    // Loading states
    optionsLoading: false,
    groupsLoading: false,
    loading: false,
    isFetching: false,
    error: null as string | null,

    // Pagination
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,

    // UI states
    expandedRows: new Set<number>(),
    isModalOpen: false,
    isQCModalOpen: false,
    selectedTelecaller: null as { id: number, name: string, type?: 'telecaller' | 'qc_user' | 'data_entry' } | null,
  });

  const [showQCMetrics, setShowQCMetrics] = useState(false);


  // Use refs to prevent multiple calls
  const hasInitialized = useRef(false);
  const optionsFetched = useRef(false);
  const dataFetched = useRef(false);
  const paginationFetched = useRef(false);

  // Memoized options to prevent unnecessary re-renders
  const statusOptions = useMemo(() => [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ], []);

  const permissionOptions = useMemo(() => [
    { value: '', label: 'All Users' },
    { value: 'fill_form', label: 'Telecallers' },
    { value: 'qc', label: 'QC Users' },
    { value: 'data_entry', label: 'Data Entry Users' },
  ], []);

  // Optimized state update helper
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Optimized fetch telecaller options with useCallback
  const fetchTelecallerOptions = useCallback(async () => {
    if (optionsFetched.current || state.optionsLoading) {
      return;
    }

    optionsFetched.current = true;
    updateState({ optionsLoading: true });

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('NEXT_PUBLIC_API_URL is not set, falling back to http://localhost:4001');
      }
      // Build params including the permission filter (fill_form | qc | data_entry)
      const params: any = { limit: '1000' };
      if (searchFilters.permission) {
        // permission contains the exact query param name that the API expects (fill_form | qc | data_entry)
        params[searchFilters.permission] = '1';
      }
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${apiBaseUrl}/api/teleform-users?${queryParams}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const options: TelecallerOption[] = result.data
          .map((user: any) => ({
            value: user.teleform_user_id.toString(),
            label: `${user.name}(${user.teleform_user_id})`,
            user_id: user.teleform_user_id,
            name: user.name,
            mobile_number: user.mobile_number,
          }))
          .sort((a: TelecallerOption, b: TelecallerOption) => a.name.localeCompare(b.name));

        updateState({ telecallerOptions: options });
      }
    } catch (err) {
      console.error('Error fetching telecaller options:', err);
      optionsFetched.current = false;
    } finally {
      updateState({ optionsLoading: false });
    }
  }, [state.optionsLoading, updateState, searchFilters.permission]);

  // Fetch AC options for the AC dropdown
  const fetchACOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      if (!process.env.NEXT_PUBLIC_API_URL) console.warn('NEXT_PUBLIC_API_URL is not set, falling back to http://localhost:4001');
      const response = await fetch(`${apiBaseUrl}/api/cati/ac-details?limit=1000`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) {
        const acList = Array.isArray(data.data?.data) ? data.data.data : [];
        updateState({ acOptions: acList.map((ac: any) => ({ value: ac.ac_code.toString(), label: `${ac.ac_name} - (${ac.ac_code})` })) });
      }
    } catch (err) {
      console.error('Error fetching AC options:', err);
    }
  }, [updateState]);

  // Refetch telecaller options whenever permission filter changes
  useEffect(() => {
    // Reset the fetched flag so we can fetch new options scoped to the permission
    optionsFetched.current = false;
    fetchTelecallerOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters.permission]);

  // Fetch telecalling groups
  const fetchTelecallingGroups = useCallback(async () => {
    if (state.groupsLoading) {
      return;
    }

    updateState({ groupsLoading: true });

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        updateState({ telecallingGroups: [{ id: 1, name: 'Group 1' }] });
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiBaseUrl}/api/teleform-users/telecalling-groups`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const groups: TelecallingGroup[] = result.data.map((item: any) => ({
            id: item.telecalling_group_id || item.id,
            name: item.telecalling_group_name || item.name || `Group ${item.telecalling_group_id || item.id}`,
          }));
          updateState({ telecallingGroups: groups });
        } else {
          updateState({ telecallingGroups: [{ id: 1, name: 'Group 1' }] });
        }
      } else {
        updateState({ telecallingGroups: [{ id: 1, name: 'Group 1' }] });
      }
    } catch (err) {
      console.error('Error fetching telecalling groups:', err);
      updateState({ telecallingGroups: [{ id: 1, name: 'Group 1' }] });
    } finally {
      updateState({ groupsLoading: false });
    }
  }, [state.groupsLoading, updateState]);

  // Optimized fetch telecallers with useCallback
  const fetchTelecallers = useCallback(async (page: number = state.currentPage, useDefaultFilter: boolean = false) => {
    if (state.isFetching || (useDefaultFilter && dataFetched.current)) {
      return;
    }

    updateState({ isFetching: true, loading: true, error: null });

    try {
      const params: any = {
        page: page,
        limit: state.pageSize,
      };

      // Add filters if they have values
      if (searchFilters.teleform_user_id) params.teleform_user_id = searchFilters.teleform_user_id;
      if (searchFilters.ac_code) params.ac_code = searchFilters.ac_code;
      if (searchFilters.name) params.user_name = searchFilters.name;
      if (searchFilters.mobile_number) params.mobile_number = searchFilters.mobile_number;
      if (searchFilters.status) params.status = searchFilters.status;
      if (searchFilters.telecalling_group_id) params.telecalling_group_id = searchFilters.telecalling_group_id;

      // Permission filter: fill_form=1 (telecallers) or qc=1 (QC users)
      if (searchFilters.permission) {
        params[searchFilters.permission] = '1';
        console.log('🔍 Using permission filter:', searchFilters.permission, '→', params[searchFilters.permission]);
      } else if (useDefaultFilter) {
        // Default filter: show only active telecallers (fill_form=1) when no permission filter is selected
        params.fill_form = '1';
        console.log('🔍 Using default filter: fill_form=1');
      } else {
        console.log('🔍 No permission filter applied');
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        updateState({ error: 'Authentication required' });
        return;
      }

      const queryParams = new URLSearchParams(params).toString();
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const url = `${apiBaseUrl}/api/cati/unified-user-statistics?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (useDefaultFilter) {
          dataFetched.current = true;
        }

        const pagination = result.pagination;
        const totalPages = pagination ? pagination.total_pages : 1;
        const totalCount = pagination ? pagination.total_count : result.data.length;

        updateState({
          userData: result.data,
          totalPages,
          totalCount,
          currentPage: page,
        });
      } else {
        updateState({ error: result.message || 'Failed to fetch telecallers' });
      }
    } catch (err: any) {
      updateState({ error: err.message || 'Error fetching telecallers' });
      console.error('Error fetching telecallers:', err);
    } finally {
      updateState({ loading: false, isFetching: false });
    }
  }, [state.pageSize, state.isFetching, searchFilters, updateState]); // Keep searchFilters in dependencies

  // Initial data fetch on component mount
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) {
      console.log('Component already initialized, skipping initialization');
      return;
    }

    hasInitialized.current = true;
    console.log('Initializing component data...');

    const initializeData = async () => {
      // Fetch telecaller options and telecalling groups
      await Promise.all([
        fetchTelecallerOptions(),
        fetchTelecallingGroups()
        // Fetch AC options
        , fetchACOptions()
      ]);

      // Then fetch initial telecaller data with default filter
      await fetchTelecallers(1, true); // true = use default filter
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Handle page changes (only for page > 1 to avoid duplicate calls)
  useEffect(() => {
    if (state.currentPage > 1 && !paginationFetched.current) {
      paginationFetched.current = true;
      fetchTelecallers(state.currentPage);
      // Reset the flag after a short delay
      setTimeout(() => {
        paginationFetched.current = false;
      }, 1000);
    }
  }, [state.currentPage]); // Remove fetchTelecallers from dependencies


  // Optimized event handlers with useCallback
  const handleInputChange = useCallback((field: keyof SearchFilters, value: string) => {
    console.log('🔍 Input change:', field, '→', value);
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Search triggered with filters:', searchFilters);

    // Enable QC metrics only after clicking Search
    setShowQCMetrics(searchFilters.permission === 'qc');

    updateState({ currentPage: 1 });
    fetchTelecallers(1);
  }, [updateState, searchFilters, fetchTelecallers]);

  const handleClear = useCallback(() => {
    setSearchFilters({
      teleform_user_id: '',
      name: '',
      mobile_number: '',
      status: '',
      telecaller: '',
      ac_code: '',
      permission: '',
      telecalling_group_id: '',
    });

    // Hide QC metrics
    setShowQCMetrics(false);

    updateState({ currentPage: 1 });
    fetchTelecallers(1);
  }, [updateState, fetchTelecallers]);

  const handleAddData = useCallback((user: UnifiedUserData) => {
    const selectedTelecaller = {
      id: user.user_id,
      name: user.user_name
    };

    updateState({
      selectedTelecaller,
      isQCModalOpen: user.user_type === 'qc_user',
      // Open the generic assignment modal for telecaller and data_entry users
      isModalOpen: user.user_type === 'telecaller' || user.user_type === 'data_entry',
    });

    // store user type on the selectedTelecaller for modal mode switching
    updateState({ selectedTelecaller: { ...selectedTelecaller, type: user.user_type } });
  }, [updateState]);

  const handleModalClose = useCallback(() => {
    updateState({
      isModalOpen: false,
      isQCModalOpen: false,
      selectedTelecaller: null,
    });
  }, [updateState]);

  const handleAssignmentSuccess = useCallback(async () => {
    // Small delay to ensure backend has processed the assignment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Refresh the telecallers data
    fetchTelecallers();
  }, [fetchTelecallers]);

  const toggleRowExpansion = useCallback((userId: number) => {
    const newExpandedRows = new Set(state.expandedRows);

    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.clear();
      newExpandedRows.add(userId);
    }

    updateState({ expandedRows: newExpandedRows });
  }, [state.expandedRows, updateState]);

  // Stable pagination handler
  const handlePageChange = useCallback((page: number) => {
    if (page !== state.currentPage && !state.isFetching) {
      updateState({ currentPage: page });
    }
  }, [state.currentPage, state.isFetching, updateState]);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Heading level={2} className="text-2xl  font-semibold text-gray-900 dark:text-white">
              Tele Caller
            </Heading>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage telecallers and their assignments
            </p> */}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {/* Additional header content if needed */}
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <Alert type="error" className="mb-6">
            {state.error}
          </Alert>
        )}

        {/* Search Form */}
        <TelecallerSearchFilters
          searchFilters={searchFilters}
          onFilterChange={handleInputChange}
          onSearch={handleSearch}
          onClear={handleClear}
          acOptions={state.acOptions}
          telecallerOptions={state.telecallerOptions}
          telecallingGroups={state.telecallingGroups}
          statusOptions={statusOptions}
          permissionOptions={permissionOptions}
          loading={state.loading}
          groupsLoading={state.groupsLoading}
          onTelecallerSelect={(selectedValue, options) => {
            if (selectedValue) {
              const selectedOption = options.find(opt => opt.value === selectedValue);
              if (selectedOption) {
                setSearchFilters(prev => ({
                  ...prev,
                  telecaller: selectedValue,
                  teleform_user_id: selectedOption.user_id.toString(),
                }));
              }
            } else {
              setSearchFilters(prev => ({
                ...prev,
                telecaller: '',
                teleform_user_id: '',
              }));
            }
          }}
        />

        {showQCMetrics && (
          <QCMetrics teleformUserId={searchFilters.teleform_user_id || undefined}
            ac_code={searchFilters.ac_code || undefined} />
        )}

        {/* Tele Caller Cards */}
        <Card className="">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Tele Caller
              </Heading>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:space-x-2 gap-2 lg:gap-0">
              <Button
                variant="primary"
                onClick={() => router.push('/cati/ppm/manage-calling/create-tele-caller')}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add New Telecaller</span>
                <span className="sm:hidden">Add New Telecaller</span>
              </Button>

              {/* <Button variant="secondary" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white w-full lg:w-auto">
                <Search className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Calling User Check</span>
                <span className="sm:hidden">User Check</span>
              </Button> */}
              {/* <Button variant="secondary" size="sm" className="bg-green-500 hover:bg-green-600 text-white w-full lg:w-auto">
                <Edit className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Redistribute Pending Data</span>
                <span className="sm:hidden">Redistribute</span>
              </Button> */}
              {/* <Button variant="secondary" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white w-full lg:w-auto">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Refresh Progress Data</span>
                <span className="sm:hidden">Refresh</span>
              </Button> */}
            </div>
          </div>

          {state.loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : state.userData.length > 0 ? (
            <div className="space-y-3">
              {state.userData.map((user) => (
                <TelecallerUserCard
                  key={user.user_id}
                  user={user}
                  isExpanded={state.expandedRows.has(user.user_id)}
                  onToggleExpand={toggleRowExpansion}
                  onAddData={handleAddData}
                  renderExpandedDetails={(user) => <TelecallerExpandedDetails user={user} />}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No telecallers found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search filters or add a new telecaller.
              </p>
            </div>
          )}

          {/* Total Count Footer */}
          {/* {!loading && teleUserData.length > 0 && (
            <div className="flex justify-start mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Total: <span className="font-semibold">{totalCount}</span> telecaller{totalCount !== 1 ? 's' : ''}
              </div> */}
          {/* Debug info - remove after testing */}
          {/* <div className="ml-4 text-xs text-gray-500">
                Debug: totalPages={totalPages}, currentPage={currentPage}, pageSize={pageSize}
              </div>
            </div>
          )} */}

          {/* Pagination */}
          {!state.loading && state.totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <PaginationStandard
                currentPage={state.currentPage}
                totalPages={state.totalPages}
                totalItems={state.totalCount}
                itemsPerPage={state.pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>

        {/* AC Assignment Modal */}
        {state.selectedTelecaller && (
          <>
            <ACAssignmentModal
              isOpen={state.isModalOpen}
              onClose={handleModalClose}
              teleformUserId={state.selectedTelecaller.id}
              telecallerName={state.selectedTelecaller.name}
              onSuccess={handleAssignmentSuccess}
              mode={state.selectedTelecaller?.type === 'data_entry' ? 'data_entry' : 'telecaller'}
            />
            <CatiQCACAssignModal
              isOpen={state.isQCModalOpen}
              onClose={handleModalClose}
              teleformUserId={state.selectedTelecaller.id}
              telecallerName={state.selectedTelecaller.name}
              onSuccess={handleAssignmentSuccess}
            />
          </>
        )}
      </div>
    </Container>
  );
};

export default TeleUserInfoPage;
