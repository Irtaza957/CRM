import { api } from "./api";
import { setUser } from "../slices/global";

export const bookingApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchBookings: build.query({
      query: (date) => ({
        url: `/booking?date=${date}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: BookingProps[];
      }) => response.data,
    }),
    createBooking: build.mutation({
      query: (data) => ({
        url: "/booking",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Set the Content-Type header
        },
      }),
    }),
    cancelBooking: build.mutation({
      query: (data) => ({
        url: "/booking/cancel",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
    fetchBookingDetails: build.query({
      query: (id) => ({
        url: `/booking?id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: BookingDetailProps;
      }) => response.data,
    }),
    fetchCancellationReasons: build.query({
      query: () => ({
        url: "/booking/cancellation_reasons",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: OptionProps[];
      }) => {
        const finalized = response.data.map((item) => {
          return {
            id: item.id,
            name: item.reason!,
          };
        });

        return finalized;
      },
    }),
    addAddress: build.mutation({
      query: (data) => ({
        url: "/customer/address",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Set the Content-Type header
        },
      }),
    }),
    addFamily: build.mutation({
      query: (data) => ({
        url: "/customer/family_member",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Set the Content-Type header
        },
      }),
    }),
    uploadAttachment: build.mutation({
      query: (data) => ({
        url: "/customer/upload_attachment",
        method: "POST",
        body: data,
      }),
    }),
    addCustomer: build.mutation({
      query: (data) => ({
        url: "/customer",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    fetchCategories: build.mutation({
      query: () => ({
        url: `/categories`,
        method: "GET",
      }),
    }),
    fetchBookingHistory: build.mutation({
      query: (customerId) => ({
        url: `/booking/history?customer_id=${customerId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFetchBookingsQuery,
  useFetchCategoriesMutation,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useFetchBookingDetailsQuery,
  useFetchCancellationReasonsQuery,
  useAddAddressMutation,
  useAddFamilyMutation,
  useUploadAttachmentMutation,
  useAddCustomerMutation,
  useFetchBookingHistoryMutation
} = bookingApi;
