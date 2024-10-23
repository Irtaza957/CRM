import { api } from "./api";

export const businessApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchBusiness: build.query({
      query: (id) => ({
        url: `/businesses?id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: BusinessDetailProps;
      }) => response.data,
    }),
    fetchBusinesses: build.query({
      query: () => ({
        url: "/businesses",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: BusinessListProps[];
      }) => response.data,
    }),
    postBusiness: build.mutation({
      query: (data) => ({
        url: "/businesses",
        method: "POST",
        body: data,
      }),
    }),
    updateBusiness: build.mutation({
      query: (data) => ({
        url: "/businesses/update",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchBusinessQuery,
  useFetchBusinessesQuery,
  usePostBusinessMutation,
  useUpdateBusinessMutation,
} = businessApi;
