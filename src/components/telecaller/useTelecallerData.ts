import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

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

interface TelecallerOption {
  value: string;
  label: string;
  user_id: number;
  name: string;
  mobile_number: string;
}

interface TelecallingGroup {
  id: number;
  name: string;
}

interface UseTelecallerDataReturn {
  // Data
  userData: UnifiedUserData[];
  telecallerOptions: TelecallerOption[];
  acOptions: Array<{ value: string; label: string }>;
  telecallingGroups: TelecallingGroup[];
  
  // Loading states
  loading: boolean;
  optionsLoading: boolean;
  groupsLoading: boolean;
  isFetching: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  
  // Actions
  fetchTelecallers: (page?: number, useDefaultFilter?: boolean) => Promise<void>;
  fetchTelecallerOptions: () => Promise<void>;
  fetchACOptions: () => Promise<void>;
  fetchTelecallingGroups: () => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useTelecallerData = (
  searchFilters: SearchFilters,
  pageSize: number = 10
): UseTelecallerDataReturn => {
  const [userData, setUserData] = useState<UnifiedUserData[]>([]);
  const [telecallerOptions, setTelecallerOptions] = useState<TelecallerOption[]>([]);
  const [acOptions, setAcOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [telecallingGroups, setTelecallingGroups] = useState<TelecallingGroup[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const optionsFetched = useRef(false);
  const dataFetched = useRef(false);
  const paginationFetched = useRef(false);
  const hasInitialized = useRef(false);

  const fetchTelecallerOptions = useCallback(async () => {
    if (optionsFetched.current || optionsLoading) {
      return;
    }

    optionsFetched.current = true;
    setOptionsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const params: any = { limit: '1000' };
      if (searchFilters.permission) {
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

        setTelecallerOptions(options);
      }
    } catch (err) {
      console.error('Error fetching telecaller options:', err);
      optionsFetched.current = false;
    } finally {
      setOptionsLoading(false);
    }
  }, [optionsLoading, searchFilters.permission]);

  const fetchACOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
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
        setAcOptions(acList.map((ac: any) => ({ value: ac.ac_code.toString(), label: `${ac.ac_name} - (${ac.ac_code})` })));
      }
    } catch (err) {
      console.error('Error fetching AC options:', err);
    }
  }, []);

  const fetchTelecallingGroups = useCallback(async () => {
    if (groupsLoading) {
      return;
    }

    setGroupsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
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
          setTelecallingGroups(groups);
        } else {
          setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
        }
      } else {
        setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
      }
    } catch (err) {
      console.error('Error fetching telecalling groups:', err);
      setTelecallingGroups([{ id: 1, name: 'Group 1' }]);
    } finally {
      setGroupsLoading(false);
    }
  }, [groupsLoading]);

  const fetchTelecallers = useCallback(async (page: number = currentPage, useDefaultFilter: boolean = false) => {
    if (isFetching || (useDefaultFilter && dataFetched.current)) {
      return;
    }

    setIsFetching(true);
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page: page,
        limit: pageSize,
      };

      if (searchFilters.teleform_user_id) params.teleform_user_id = searchFilters.teleform_user_id;
      if (searchFilters.ac_code) params.ac_code = searchFilters.ac_code;
      if (searchFilters.name) params.user_name = searchFilters.name;
      if (searchFilters.mobile_number) params.mobile_number = searchFilters.mobile_number;
      if (searchFilters.status) params.status = searchFilters.status;
      if (searchFilters.telecalling_group_id) params.telecalling_group_id = searchFilters.telecalling_group_id;

      if (searchFilters.permission) {
        params[searchFilters.permission] = '1';
      } else if (useDefaultFilter) {
        params.fill_form = '1';
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
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
        const totalPagesValue = pagination ? pagination.total_pages : 1;
        const totalCountValue = pagination ? pagination.total_count : result.data.length;

        setUserData(result.data);
        setTotalPages(totalPagesValue);
        setTotalCount(totalCountValue);
        setCurrentPage(page);
      } else {
        setError(result.message || 'Failed to fetch telecallers');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching telecallers');
      console.error('Error fetching telecallers:', err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [pageSize, isFetching, searchFilters, currentPage]);

  // Refetch telecaller options when permission filter changes
  useEffect(() => {
    optionsFetched.current = false;
    fetchTelecallerOptions();
  }, [searchFilters.permission, fetchTelecallerOptions]);

  // Handle page changes
  useEffect(() => {
    if (currentPage > 1 && !paginationFetched.current) {
      paginationFetched.current = true;
      fetchTelecallers(currentPage);
      setTimeout(() => {
        paginationFetched.current = false;
      }, 1000);
    }
  }, [currentPage, fetchTelecallers]);

  return {
    userData,
    telecallerOptions,
    acOptions,
    telecallingGroups,
    loading,
    optionsLoading,
    groupsLoading,
    isFetching,
    error,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    fetchTelecallers,
    fetchTelecallerOptions,
    fetchACOptions,
    fetchTelecallingGroups,
    setCurrentPage,
  };
};

