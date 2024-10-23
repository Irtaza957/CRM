import { RootState } from "..";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).global.user?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.append("ci-api-key", import.meta.env.VITE_CI_API_KEY);

    return headers;
  },
});

export const api = createApi({
  baseQuery,
  keepUnusedDataFor: 5,
  endpoints: () => ({}),
});
