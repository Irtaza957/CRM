import { getFilterQuery } from "../../utils/helpers";
import { api } from "./api";

export const bannerApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchBanners: build.query({
      query: (query) => {
        const queryString = getFilterQuery(query);
        return {
          url: `/banners?${queryString}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: unknown;
      }) => response.data,
    }),
    postBanner: build.mutation({
      query: (data) => ({
        url: "/banners",
        method: "POST",
        body: data,
      }),
    }),
    updateBanner: build.mutation({
      query: (data) => ({
        url: `/banners/update`,
        method: "POST",
        body: data,
      }),
    }),
    updateBannerStatus: build.mutation({
        query: (data) => ({
          url: `banners/active`,
          method: "POST",
          body: data,
        }),
      }),
    deleteBanner: build.mutation({
      query: (id) => ({
        url: `banners?id=${id}`,
        method: "DELETE"
      }),
    }),
  }),
});

export const {
  useFetchBannersQuery,
  usePostBannerMutation,
  useUpdateBannerMutation,
  useUpdateBannerStatusMutation,
  useDeleteBannerMutation,
} = bannerApi;
