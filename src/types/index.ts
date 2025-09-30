// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'pmt' | 'qc' | 'quality-analyst' | 'start-qc' | 'data-quality' | 'ppm' | 'ppmt' | 'dqm' | 'dqmt' | 'fd' | 'portal_admin';
  avatar?: string;
  permissions: string[];
  system?: 'capi' | 'cati'; // System assignment for CAPI/CATI users
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalVoters: number;
  completedSurveys: number;
  pendingSurveys: number;
  rejectionRate: number;
}

// Chart Data Types
export interface VoteShareData {
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface ProgressData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

// Form Types
export interface FilterFormData {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  location: string;
  status: string;
  search: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  children?: MenuItem[];
  roles: string[];
  system?: 'capi' | 'cati' | 'common'; // System identifier for menu filtering
}

// Table Types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

// Map Types
export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  name: string;
  data: any;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps
  extends BaseComponentProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

// State Types
export interface AppState {
  user: User | null;
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface GlobalState {
  user: User | null;
  notifications: Notification[];
}

export interface AnalysisState {
  voteShareData: VoteShareData[];
  progressData: ProgressData[];
  dashboardStats: DashboardStats;
  filters: FilterFormData;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}
