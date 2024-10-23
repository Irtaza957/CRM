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
  }),
});

export const {
  useFetchServiceQuery,
  useFetchServicesQuery,
  usePostServiceMutation,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useFetchCategoryListQuery,
  useFetchServiceListMutation,
} = serviceApi;
