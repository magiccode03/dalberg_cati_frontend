import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Notification, Theme } from '@/types';

export interface AppState {
  user: User | null;
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@biharelection.gov.in',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    permissions: ['read', 'write', 'delete', 'manage_users'],
  },
  theme: 'light',
  sidebarOpen: true,
  notifications: [],
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
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
  setUser,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setNotifications,
  addNotification,
  markNotificationRead,
  removeNotification,
  setLoading,
  setError,
  clearError,
} = appSlice.actions;

export default appSlice.reducer;
