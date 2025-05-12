import { api } from "./api";
// import { setUser } from "../slices/global";

export const bookingApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchBookings: build.query({
      query: ({
        date,
        business_id,
        company_id,
        branch_id,
        category_id,
        platform_id,
        channel_id,
        source_id,
        agent_id,
        booking_status,
        payment_status,
        page, 
      }) => ({
        url: `/booking`,
        method: "GET",
        params: {
          date,
          business_id,
          company_id,
          branch_id,
          category_id,
          platform_id,
          channel_id,
          source_id,
          agent_id,
          booking_status,
          payment_status,
          page,
        },
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
      // async onQueryStarted(_, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(setUser(data.data));
      //   } catch (error: any) {
      //     throw new Error(error.message);
      //   }
      // },
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
    updateAddress: build.mutation({
      query: (data) => ({
        url: "customer/update_address",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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
    updateFamily: build.mutation({
      query: (data) => ({
        url: "/customer/update_family_member",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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
    deleteAttachment: build.mutation({
      query: (data) => ({
        url: "/customer/delete_attachment",
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
    updateCustomer: build.mutation({
      query: (data) => ({
        url: "/customer/update",
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
    fetchNationality: build.query({
      query: () => ({
        url: "/customer/nationalities",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: NationalityProps[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: parseInt(item.id),
            name: item.nationality,
          };
        });

        return formatted;
      },
    }),
    fetchAreas: build.query({
      query: (id: string) => ({
        url: `/customer/areas?emirate_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: AreaProps[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: parseInt(item.area_id),
            name: item.name,
          };
        });

        return formatted;
      },
    }),
    assignTeamMember: build.mutation({
      query: (data) => ({
        url: "/booking/assign",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    fetchBookingSources: build.query({
      query: () => ({
        url: `/booking/sources`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: { source_id: string; source: string }[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: item.source_id,
            name: item.source,
          };
        });

        return formatted;
      },
    }),
    fetchBookingChannels: build.query({
      query: () => ({
        url: `/booking/channels`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: { channel_id: string; channel: string }[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: item.channel_id,
            name: item.channel,
          };
        });

        return formatted;
      },
    }),
    fetchBookingPlatforms: build.query({
      query: () => ({
        url: `/booking/platforms`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: { platform_id: string; platform: string }[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: item.platform_id,
            name: item.platform,
          };
        });
        return formatted;
      },
    }),
    fetchBookingPartners: build.query({
      query: (company_id: string) => ({
        url: `/companies/partners`,
        method: "GET",
        params: {
          company_id,
        },
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: { partner_id: string; name: string }[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: item.partner_id,
            name: item.name,
          };
        });
        return formatted;
      },
    }),
    confirmBooking: build.mutation({
      query: (data) => ({
        url: "/booking/confirm",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    fetchBookingAttachments: build.query({
      query: (booking_id: string) => ({
        url: `/booking/attachments`,
        method: "GET",
        params: {
          booking_id,
        },
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
  useLazyFetchBookingDetailsQuery,
  useFetchCancellationReasonsQuery,
  useAddAddressMutation,
  useAddFamilyMutation,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useAddCustomerMutation,
  useFetchBookingHistoryMutation,
  useUpdateAddressMutation,
  useUpdateFamilyMutation,
  useAssignTeamMemberMutation,
  useUpdateCustomerMutation,
  useFetchNationalityQuery,
  useFetchAreasQuery,
  useFetchBookingSourcesQuery,
  useFetchBookingChannelsQuery,
  useFetchBookingPlatformsQuery,
  useFetchBookingPartnersQuery,
  useFetchBookingAttachmentsQuery,
  useConfirmBookingMutation,
} = bookingApi;
