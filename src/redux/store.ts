import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

// Persist configs
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const notificationPersistConfig = {
  key: 'notification',
  storage: AsyncStorage,
};

// Wrap reducers you want persisted
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(
  notificationPersistConfig,
  notificationReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notification: persistedNotificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
