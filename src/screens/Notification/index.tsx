import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import NotificationTile from '../../components/NotificationTile';
import { bgColor, primaryColor } from '../../constants/colors';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchAllNotifications,
  fetchNotificationsPage,
} from '../../services/notificationService';
import CustomText from '../../components/CustomText';
import { CloudCool } from '../../assets';
import {
  setNotifications,
  setNotificationsLoading,
  setNotificationsError,
} from '../../redux/slices/notificationSlice';

export default function NotificationsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notification,
  );
  const hasNotifications =
    Array.isArray(notifications) && notifications.length > 0;

  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // initial load: load page 1
  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const loadInitial = async () => {
    dispatch(setNotificationsLoading(true));
    try {
      const data = await fetchNotificationsPage(1, 10);
      const pageNotifications = data.notifications ?? [];
      const meta = data.meta ?? { currentPage: 1, totalPages: 1 };
      dispatch(setNotifications({ notifications: pageNotifications }));
      setPage(2); // next page to load
      setTotalPages(meta.totalPages ?? 1);
    } catch (err: any) {
      dispatch(
        setNotificationsError(err?.message || 'Failed to fetch notifications'),
      );
    } finally {
      dispatch(setNotificationsLoading(false));
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchNotificationsPage(1, 10);
      const pageNotifications = data.notifications ?? [];
      const meta = data.meta ?? { currentPage: 1, totalPages: 1 };
      dispatch(setNotifications({ notifications: pageNotifications }));
      setPage(2);
      setTotalPages(meta.totalPages ?? 1);
    } catch (err: any) {
      dispatch(
        setNotificationsError(
          err?.message || 'Failed to refresh notifications',
        ),
      );
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleLoadMore = async () => {
    // don't load more if already loading, initial loading, refreshing, or no more pages
    if (loading || loadingMore || refreshing) return;
    if (totalPages !== null && page > totalPages) return;

    setLoadingMore(true);
    try {
      const data = await fetchNotificationsPage(page, 10);
      const newNotifications = data.notifications ?? [];
      const meta = data.meta ?? { currentPage: page, totalPages: page };
      const merged = Array.isArray(notifications)
        ? [...notifications, ...newNotifications]
        : newNotifications;
      dispatch(setNotifications({ notifications: merged }));
      setPage(p => p + 1);
      setTotalPages(meta.totalPages ?? meta.currentPage ?? page);
    } catch (err: any) {
      dispatch(
        setNotificationsError(
          err?.message || 'Failed to load more notifications',
        ),
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // stop the refresh control when loading finishes (keeps parity with slice loading)
  useEffect(() => {
    if (!loading) {
      setRefreshing(false);
    }
  }, [loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && !hasNotifications ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : error && !hasNotifications ? (
        <View style={styles.center}>
          <CustomText size={14} color="red">
            {error}
          </CustomText>
        </View>
      ) : !hasNotifications ? (
        <View style={styles.center}>
          <CustomText size={14} color="gray">
            No notifications found
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item: any) => String(item.id)}
          renderItem={({ item }: any) => (
            <NotificationTile
              key={item.id}
              icon={item.icon ?? <CloudCool />}
              message={item.body || ''}
              time={item.createdAt || ''}
            />
          )}
          contentContainerStyle={styles.scrollViewContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator size="small" color={primaryColor} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bgColor,
  },
  scrollViewContent: {
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
