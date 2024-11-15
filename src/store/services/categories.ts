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
      query: ({ customer_id, filters }) => {
        // Start with customer_id if defined
        let query = customer_id ? `?customer_id=${customer_id}` : '';
        if (filters) {
          const filterQuery = Object.entries(filters)
            .filter(([, value]) => value !== undefined && value !== null) // Exclude undefined or null values
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
          query += query ? `&${filterQuery}` : `?${filterQuery}`;
        }
        return {
          url: `/categories/all${query}`,
          method: "GET",
        };
      },
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
