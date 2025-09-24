import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app-store';
import analysisReducer from './analysis-store';

export const store = configureStore({
  reducer: {
    app: appReducer,
    analysis: analysisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
