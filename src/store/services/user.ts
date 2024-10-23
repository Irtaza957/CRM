import { api } from "./api";
import { setUser } from "../slices/global";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = userApi;
