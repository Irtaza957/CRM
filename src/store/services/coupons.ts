import { api } from "./api";

export const couponsApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchCoupons: build.query({
      query: (params: { businessId: number; companyId: number }) => ({
        url: `/coupons?business_id=${params.businessId}&company_id=${params.companyId}`,
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

    postCoupon: build.mutation({
      query: (data) => ({
        url: "/coupons",
        method: "POST",
        body: data,
      }),
    }),

    updateCoupon: build.mutation({
      query: (data) => ({
        url: `/coupons/update`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchCouponsQuery,
  usePostCouponMutation,
  useUpdateCouponMutation,
} = couponsApi;
