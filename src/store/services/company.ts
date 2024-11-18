import { api } from "./api";

export const companyApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchCompany: build.query({
      query: (id) => ({
        url: `/companies?id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CompanyDetailProps;
      }) => response.data,
    }),
    fetchCompanies: build.query({
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
          url: `/companies${queryString}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: CompanyListProps[];
      }) => response.data,
    }),
    postCompany: build.mutation({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
    }),
    updateCompany: build.mutation({
      query: (data) => ({
        url: "/companies/update",
        method: "POST",
        body: data,
      }),
    }),
    postBranch: build.mutation({
      query: (data) => ({
        url: "/companies/branches",
        method: "POST",
        body: data,
      }),
    }),
    updateBranch: build.mutation({
      query: (data) => ({
        url: "/companies/update_branch",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchCompanyQuery,
  useFetchCompaniesQuery,
  usePostCompanyMutation,
  useUpdateCompanyMutation,
  usePostBranchMutation,
  useUpdateBranchMutation,
} = companyApi;
