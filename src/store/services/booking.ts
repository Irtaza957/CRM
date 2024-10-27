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
      }),
    }),
  }),
});

export const {
  useFetchBookingsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useFetchBookingDetailsQuery,
  useFetchCancellationReasonsQuery,
  useAddAddressMutation
} = bookingApi;
