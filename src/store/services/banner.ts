import { api } from "./api";

export const bannerApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchBanners: build.query({
      query: (params: { businessId: number; companyId: number }) => ({
        url: `/banners?business_id=${params.businessId}&company_id=${params.companyId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
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
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded",
        // },
      }),
    }),
  }),
});

export const {
  useFetchBannersQuery,
  usePostBannerMutation,
  useUpdateBannerMutation,
} = bannerApi;
