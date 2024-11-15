import { api } from "./api";

export const serviceApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchService: build.query({
      query: (id) => ({
        url: `/services?id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: ServiceDetailProps;
      }) => response.data,
    }),
    fetchServices: build.query({
      query: ({ company_id, filters }) => {
        let query = company_id ? `?company_id=${company_id}` : '';
        if (filters) {
          const filterQuery = Object.entries(filters)
            .filter(([, value]) => value !== undefined && value !== null) // Exclude undefined or null values
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
          query += query ? `&${filterQuery}` : `?${filterQuery}`;
        }
        return {
          url: `/services${query}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: ServiceProps[];
      }) => response.data,
    }),
    fetchServiceList: build.mutation({
      query: () => ({
        url: "/services",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: ServiceProps[];
      }) => response.data,
    }),
    createCategory: build.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
    }),
    fetchCategories: build.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CategoryListProps[];
      }) => response.data,
    }),
    fetchCategoryList: build.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CategoryListProps[];
      }) => {
        const data = response.data;
        const adjusted = data.map((item) => {
          return {
            name: item.category_name,
            id: parseInt(item.category_id),
          };
        });

        return adjusted;
      },
    }),
    postService: build.mutation({
      query: (data) => ({
        url: "/services",
        method: "POST",
        body: data,
      }),
    }),
    updateService: build.mutation({
      query: (data) => ({
        url: "/services/update",
        method: "POST",
        body: data,
      }),
    }),
    updateCategoryStatus: build.mutation({
      query: (data) => ({
        url: "/categories/active",
        method: "POST",
        body: data,
      }),
    }),
    updateServicesStatus: build.mutation({
      query: (data) => ({
        url: "/services/active",
        method: "POST",
        body: data,
      }),
    }),
    fetchBusinesses: build.query({
      query: (company_id) => ({
        url: `/businesses${company_id ? `?company_id=${company_id}` : ''}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: BusinessProps[];
      }) => response.data,
    }),
    createBusiness: build.mutation({
      query: (data) => ({
        url: "/businesses",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchServiceQuery,
  useFetchServicesQuery,
  usePostServiceMutation,
  useUpdateServiceMutation,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useFetchCategoryListQuery,
  useFetchServiceListMutation,
  useUpdateCategoryStatusMutation,
  useUpdateServicesStatusMutation,
  useFetchBusinessesQuery,
  useCreateBusinessMutation,
} = serviceApi;
