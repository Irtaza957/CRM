import { getFilterQuery } from "../../utils/helpers";
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
        const queryString = getFilterQuery(query);
        return {
          url: `/services?${queryString}`,
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
        url: `/categories${id ? `?company_id=${id}` : ""}`,
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
        data: { bundle: string }[];
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
        data: { bundle: string }[];
      }) => response.data,
    }),
    fetchSections: build.query({
      query: (id) => ({
        url: `/services/sections?service_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: { name: string; description: string }[];
      }) => response.data,
    }),
    fetchRelatedServices: build.query({
      query: (id) => ({
        url: `/services/related_services?service_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: {
          code: string;
          name: string;
          price_with_vat: string;
          promotional_price_with_vat: string;
        }[];
      }) => response.data,
    }),
    createSection: build.mutation({
      query: (data) => ({
        url: "/services/sections",
        method: "POST",
        body: data,
      }),
    }),
    updateSection: build.mutation({
      query: (data) => ({
        url: "/services/update_section",
        method: "POST",
        body: data,
      }),
    }),
    createRelatedSection: build.mutation({
      query: (data) => ({
        url: "/services/related_services",
        method: "POST",
        body: data,
      }),
    }),
    addFAQ: build.mutation({
      query: (data) => ({
        url: "/services/faqs",
        method: "POST",
        body: data,
      }),
    }),
    updateFAQ: build.mutation({
      query: (data) => ({
        url: "/services/update_faq",
        method: "POST",
        body: data,
      }),
    }),
    addReview: build.mutation({
      query: (data) => ({
        url: "/services/reviews",
        method: "POST",
        body: data,
      }),
    }),
    updateReview: build.mutation({
      query: (data) => ({
        url: "/services/update_review",
        method: "POST",
        body: data,
      }),
    }),
    fetchFAQs: build.query({
      query: (serviceId) => ({
        url: `/services/faqs?service_id=${serviceId}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: FAQProps[];
      }) => response.data,
    }),
    fetchReviews: build.query({
      query: (serviceId) => ({
        url: `/services/reviews?service_id=${serviceId}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: ReviewProps[];
      }) => response.data,
    }),
    fetchHomeSections: build.query({
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
          url: `/home${queryString}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        success: number;
        error: string;
        data: HomeSectionProps[];
      }) => response.data,
    }),
    updateHomeSection: build.mutation({
      query: (data) => ({
        url: "/home/update",
        method: "POST",
        body: data,
      }),
    }),
    addHomeSection: build.mutation({
      query: (data) => ({
        url: "/home",
        method: "POST",
        body: data,
      }),
    }),
    deleteSection: build.mutation({
      query: (id) => ({
        url: `/services/sections?id=${id}`,
        method: "DELETE",
      }),
    }),
    updateSectionStatus: build.mutation({
      query: (data) => ({
        url: "/services/active_section",
        method: "POST",
        body: data,
      }),
    }),
    deleteReview: build.mutation({
      query: (id) => ({
        url: `/services/reviews?id=${id}`,
        method: "DELETE",
      }),
    }),
    updateReviewStatus: build.mutation({
      query: (data) => ({
        url: "/services/active_review",
        method: "POST",
        body: data,
      }),
    }),
    deleteFAQ: build.mutation({
      query: (id) => ({
        url: `/services/faqs?id=${id}`,
        method: "DELETE",
      }),
    }),
    updateFAQStatus: build.mutation({
      query: (data) => ({
        url: "/services/active_faq",
        method: "POST",
        body: data,
      }),
    }),
    deleteHomeSection: build.mutation({
      query: (id) => ({
        url: `/home?id=${id}`,
        method: "DELETE",
      }),
    }),
    updateHomeSectionStatus: build.mutation({
      query: (data) => ({
        url: "/home/active",
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
  useCategoryBundleMutation,
  useServiceVitaminMutation,
  useFetchAddressAreasQuery,
  useFetchSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useFetchRelatedServicesQuery,
  useCreateRelatedSectionMutation,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useFetchFAQsQuery,
  useFetchReviewsQuery,
  useFetchHomeSectionsQuery,
  useUpdateHomeSectionMutation,
  useAddHomeSectionMutation,
  useDeleteSectionMutation,
  useUpdateSectionStatusMutation,
  useDeleteReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteFAQMutation,
  useUpdateFAQStatusMutation,
  useDeleteHomeSectionMutation,
  useUpdateHomeSectionStatusMutation
} = serviceApi;
