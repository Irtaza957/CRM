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
          url: `/services${queryString}`,
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
      query: (id) => ({
        url: `/categories${id ? `?company_id=${id}` : ''}`,
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
          url: `/businesses${queryString}`,
          method: "GET",
        };
      },
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
    fetchAddressAreas: build.query({
      query: () => ({
        url: "/area?emirate_id=1",
        method: "GET",
      }),
    }),
    categoryBundle: build.mutation({
      query: (id) => ({
        url: `categories/bundles?id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: {bundle: string}[];
      }) => response.data,
    }),
    serviceVitamin: build.mutation({
      query: () => ({
        url: `services/vitamins`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: {bundle: string}[];
      }) => response.data,
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
  useFetchAddressAreasQuery,
  useCreateBusinessMutation,
  useCategoryBundleMutation,
  useServiceVitaminMutation
} = serviceApi;
