import { RootState } from "..";
import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/global";

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

// Custom wrapper for baseQuery
const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // If unauthorized, dispatch logout and redirect
  if (result?.error && (result.error as FetchBaseQueryError).status === 401) {
    api.dispatch(logout());

    // optional: if using React Router
    window.location.href = "/login"; // replace with actual logout route
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 5,
  tagTypes: ['Bookings'],
  endpoints: () => ({}),
});