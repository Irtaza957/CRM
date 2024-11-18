import { api } from "./api";

export const filtersApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchProviders: build.query({
      query: () => ({
        url: "/companies",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: ProviderProps[];
      }) => response.data,
    }),
    fetchUsersByRoles: build.query({
      query: () => ({
        url: "/account/users_by_role",
        method: "GET",
      }),
    }),
    fetchAreas: build.query({
      query: (id) => ({
        url: `/areas?emirate_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: AreaProps[];
      }) => response.data,
    }),
    fetchCategories: build.query({
      query: () => ({
        url: "/categories/all",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CategoryProps[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            label: parseInt(item.category_id),
            value: item.category_name,
            color: item.color,
          };
        });

        return [
          {
            label: "0",
            value: "All",
            color: "",
          },
          ...formatted,
        ];
      },
    }),
    fetchSources: build.query({
      query: () => ({
        url: "/booking/sources",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: SourceProps[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: parseInt(item.source_id),
            name: item.source,
          };
        });

        return formatted;
      },
    }),
    fetchChannels: build.query({
      query: () => ({
        url: "/booking/channels",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: ChannelProps[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            id: parseInt(item.channel_id),
            name: item.channel,
          };
        });

        return formatted;
      },
    }),
    fetchBranches: build.query({
      query: (query) => {
        let queryString = "";
        if (query?.length) {
          queryString =
            "?" +
            query
              ?.map(
                (filter: { name: string; id: string }) =>
                  `${encodeURIComponent(filter.name)}_id=${encodeURIComponent(filter.id?.split("-")[0])}`
              )
              .join("&");
        }
        return {
        url: `/companies/branches${queryString}`,
        method: "GET",
      }},
      transformResponse: (response: {
        success: number;
        error: string;
        data: BranchProps[];
      }) => response.data,
    }),
    fetchBookingStatuses: build.query({
      query: () => ({
        url: "/booking/statuses",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: StatusProps[];
      }) => {
        const formatted = response.data.map((item) => {
          return {
            label: parseInt(item.status_id),
            value: item.name,
            color: item.color,
          };
        });

        return [
          {
            label: "0",
            value: "All",
            color: "#858688",
          },
          ...formatted,
        ];
      },
    }),
    fetchBusinessesList: build.query({
      query: () => ({
        url: "/businesses",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: BusinessListProps[];
      }) => {
        const formatted = response.data.map((business) => {
          return {
            id: parseInt(business.id),
            name: business.name,
          };
        });

        return formatted;
      },
    }),
  }),
});

export const {
  useFetchAreasQuery,
  useFetchSourcesQuery,
  useFetchChannelsQuery,
  useFetchBranchesQuery,
  useFetchProvidersQuery,
  useFetchCategoriesQuery,
  useFetchUsersByRolesQuery,
  useFetchBusinessesListQuery,
  useFetchBookingStatusesQuery,
} = filtersApi;
