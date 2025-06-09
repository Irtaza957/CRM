import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchAllUsers: build.query({
      query: () => {
        return {
          url: `/user`,
          method: "GET",
        };
      },
    }),
    fetchUserRoles: build.query({
      query: () => {
        return {
          url: `/user/roles`,
          method: "GET",
        };
      },
    }),
    fetchUserDesignations: build.query({
      query: () => {
        return {
          url: `/user/designations`,
          method: "GET",
        };
      },
    }),
    fetchUserById: build.query({
      query: (id) => {
        return {
          url: `/user?id=${id}`,
          method: "GET",
        };
      },
    }),
    postUser: build.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: data,
      }),
    }),
    updateUser: build.mutation({
      query: (data) => ({
        url: `/user/update`,
        method: "POST",
        body: data,
      }),
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `user?id=${id}`,
        method: "DELETE"
      }),
    }),
  }),
});

export const {
  useFetchAllUsersQuery,
  usePostUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFetchUserByIdQuery,
  useFetchUserRolesQuery,
  useFetchUserDesignationsQuery
} = userApi;
