import { getFilterQuery } from "../../utils/helpers";
import { api } from "./api";

export const couponsApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchCoupons: build.query({
      query: (query) => {
        const queryString = getFilterQuery(query)
        return{
        url: `/coupons?${queryString}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }},
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

    updateCouponStatus: build.mutation({
      query: (data) => ({
        url: `coupons/active`,
        method: "POST",
        body: data,
      }),
    }),

    deleteCoupon: build.mutation({
      query: (id) => ({
        url: `/coupons?id=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchCouponsQuery,
  usePostCouponMutation,
  useUpdateCouponMutation,
  useUpdateCouponStatusMutation,
  useDeleteCouponMutation
} = couponsApi;
