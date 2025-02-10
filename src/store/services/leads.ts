import { api } from "./api";

export const leadsApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchLeads: build.query({
      query: (query) => {
        return {
          url: `/leads?start_date=${query.start_date}&end_date=${query.end_date}&limit=${query.limit}&offset=${query.offset}${query.source ? `&source=${query.source}` : ''}${query.search ? `&keyword=${query.search}` : ''}${query.channel ? `&channel=${query.channel}` : ''}${query.nationality ? `&nationality=${query.nationality}` : ''}${query.stage ? `&stage=${query.stage}` : ''}${query.agent ? `&agent=${query.agent}` : ''}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: {leads: LeadsData[], total_pages: number};
      }) => response.data,
    }),
    fetchLeadSources: build.query({
      query: () => {
        return {
          url: `/leads/sources`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: LeadsSourceProps[];
      }) => response.data?.map((item: { id: string, source: string }) => ({
        id: item.id,
        name: item.source,
      })),
    }),

    fetchLeadChannels: build.query({
      query: () => {
        return {
          url: `/leads/channels`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: { id: string, channel: string }[];
      }) => response.data?.map((item: { id: string, channel: string }) => ({
        id: item.id,
        name: item.channel,
      })),
    }),

    fetchLeadChat: build.query({
      query: (id) => {
        return {
          url: `/leads/chats?id=${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: unknown
      }) => response.data
    }),

    fetchLeadStages: build.query({
      query: () => {
        return {
          url: `/leads/stages`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: { id: string, stage: string }[];
      }) => response.data?.map((item: { id: string, stage: string }) => ({
        id: item.id,
        name: item.stage,
      })),
    }),

    fetchUsers: build.query({
      query: () => {
        return {
          url: `/account/all`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: { user_id: string, full_name: string }[];
      }) => response.data?.map((item: { user_id: string, full_name: string }) => ({
        id: item.user_id,
        name: item.full_name,
      })),
    }),


    fetchLeadById: build.query({
      query: (id) => ({
        url: `/leads?id=${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: LeadsData;
      }) => response.data
    }),


    postLead: build.mutation({
      query: (data) => ({
        url: "/leads",
        method: "POST",
        body: data,
      }),
    }),

    updateLead: build.mutation({
      query: (data) => ({
        url: `/leads/update`,
        method: "POST",
        body: data,
      }),
    }),

    assignLead: build.mutation({
      query: (data) => ({
        url: `/leads/assign`,
        method: "POST",
        body: data,
      }),
    }),
    moveLead: build.mutation({
      query: (data) => ({
        url: `/leads/move`,
        method: "POST",
        body: data,
      }),
    }),
    deleteLead: build.mutation({
      query: (id) => ({
        url: `/leads?id=${id}`,
        method: "DELETE"
      }),
    }),
  }),
});

export const {
  useFetchLeadsQuery,
  useFetchLeadByIdQuery,
  usePostLeadMutation,
  useUpdateLeadMutation,
  useFetchLeadSourcesQuery,
  useFetchLeadChannelsQuery,
  useFetchLeadStagesQuery,
  useDeleteLeadMutation,
  useAssignLeadMutation,
  useMoveLeadMutation,
  useFetchUsersQuery,
  useFetchLeadChatQuery,
} = leadsApi;
