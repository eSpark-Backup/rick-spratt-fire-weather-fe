import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  pagination: undefined,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNotifications: (state, action: PayloadAction<{
      notifications: Notification[];
      pagination?: any;
      append?: boolean;
    }>) => {
      const { notifications, pagination, append = false } = action.payload;
      
      if (append) {
        state.notifications = [...state.notifications, ...notifications];
      } else {
        state.notifications = notifications;
      }
      
      if (pagination) {
        state.pagination = pagination;
      }
      
      state.error = null;
    },
    setNotificationsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.pagination = undefined;
      state.error = null;
    },
  },
});

export const {
  setNotificationsLoading,
  setNotifications,
  setNotificationsError,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;