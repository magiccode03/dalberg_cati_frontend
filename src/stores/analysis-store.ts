import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VoteShareData, ProgressData, DashboardStats, FilterFormData } from '@/types';

export interface AnalysisState {
  voteShareData: VoteShareData[];
  progressData: ProgressData[];
  dashboardStats: DashboardStats;
  filters: FilterFormData;
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  voteShareData: [],
  progressData: [],
  dashboardStats: {
    totalVoters: 0,
    completedSurveys: 0,
    pendingSurveys: 0,
    rejectionRate: 0,
  },
  filters: {
    dateRange: {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
    location: '',
    status: '',
    search: '',
  },
  loading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setVoteShareData: (state, action: PayloadAction<VoteShareData[]>) => {
      state.voteShareData = action.payload;
    },
    setProgressData: (state, action: PayloadAction<ProgressData[]>) => {
      state.progressData = action.payload;
    },
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.dashboardStats = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterFormData>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setVoteShareData,
  setProgressData,
  setDashboardStats,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  clearError,
} = analysisSlice.actions;

export default analysisSlice.reducer;
