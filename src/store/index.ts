/* eslint-disable @typescript-eslint/ban-ts-comment */
import { api } from "./services/api";
import globalReducer from "./slices/global";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // @ts-ignore
    global: persistReducer(persistConfig, globalReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export default store;
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
