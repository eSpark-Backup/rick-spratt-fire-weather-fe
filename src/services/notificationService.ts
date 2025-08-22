import api from './api';
import {
  setNotifications,
  setNotificationsLoading,
  setNotificationsError,
} from '../redux/slices/notificationSlice';

import { AppDispatch } from '../redux/store';
import { Notification } from '../types';

export const fetchAllNotifications = () => async (dispatch: AppDispatch) => {
  let allNotifications: Notification[] = [];
  let page = 1;
  let hasNextPage = true;

  dispatch(setNotificationsLoading(true));
  try {
    while (hasNextPage) {
      const response = await api.get(`/notifications?page=${page}&limit=10`);

      const notifications = response.data.data.notifications;
      const pagination = response.data.data.meta;

      console.log('Fetched page notifications:', notifications);

      allNotifications = allNotifications.concat(notifications);
      hasNextPage = pagination.currentPage < pagination.totalPages;
      console.log('Has next page:', hasNextPage);
      page++;
    }

    console.log('All fetched notifications:', allNotifications);
    dispatch(setNotifications({ notifications: allNotifications }));
  } catch (error: any) {
    console.log(error?.message || 'Failed to fetch notifications');
    dispatch(
      setNotificationsError(error?.message || 'Failed to fetch notifications'),
    );
  } finally {
    dispatch(setNotificationsLoading(false));
  }
};
