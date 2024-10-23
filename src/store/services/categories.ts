import { api } from "./api";

export const categoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchCategory: build.query({
      query: (id) => ({
        url: `/categories?id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CategoryDetailProps;
      }) => response.data,
    }),
    fetchAllCategories: build.query({
      query: () => ({
        url: "/categories/all",
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CategoryAllListProps[];
      }) => response.data,
    }),
    postCategory: build.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
    }),
    updateCategory: build.mutation({
      query: (data) => ({
        url: "/categories/update",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchCategoryQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation,
  useFetchAllCategoriesQuery,
} = categoryApi;
