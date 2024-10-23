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
      query: () => ({
        url: "/companies",
        method: "GET",
      }),
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
  }),
});

export const {
  useFetchCompanyQuery,
  useFetchCompaniesQuery,
  usePostCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
