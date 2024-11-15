import { api } from "./api";

export const customerApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchCustomer: build.mutation({
      query: (keyword) => ({
        url: `/customer/search?${typeof keyword==='number' ? `keyword=${keyword ? `&customer_id=${keyword}` : ''}` : `keyword=${keyword}`}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: CustomerProps[];
      }) => response.data,
    }),
    fetchCustomerAddresses: build.mutation({
      query: (id) => ({
        url: `/customer/address?customer_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: AddressProps[];
      }) => response.data,
    }),
    fetchCustomerFamily: build.mutation({
      query: (id) => ({
        url: `/customer/family_member?customer_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: FamilyProps[];
      }) => response.data,
    }),
    fetchCustomerAttachments: build.mutation({
      query: (id) => ({
        url: `/customer/attachments?customer_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: number;
        error: string;
        data: AttachmentProps[];
      }) => response.data,
    }),
    fetchCustomers: build.mutation({
      query: (query) => ({
        url: `/customer${query}`,
        method: "GET",
      })
    }),
  }),
});

export const {
  useSearchCustomerMutation,
  useFetchCustomerFamilyMutation,
  useFetchCustomerAddressesMutation,
  useFetchCustomerAttachmentsMutation,
  useFetchCustomersMutation,
} = customerApi;
