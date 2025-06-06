import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchUsers: build.query({
      query: () => {
        return {
          url: `/user`,
          method: "GET",
        };
      },
    }),
    fetchUserById: build.query({
      query: (id) => {
        return {
          url: `/user?user_id=${id}`,
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
  useFetchUsersQuery,
  usePostUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFetchUserByIdQuery,
} = userApi;
