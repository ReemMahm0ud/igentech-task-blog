import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UsersApiSlice = createApi({
  reducerPath: "UsersApiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (token) => ({
        url: "/usersList",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ token, id }) => ({
        url: `/deleteUser/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ token, id, payload }) => ({
        url: `/updateUser/${id}?_method=PUT`,
        method: "POST",
        headers: {
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }),
    }),
    createUser: builder.mutation({
      query: ({ token, payload }) => ({
        url: `/createUser`,
        method: "POST",
        headers: {
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
} = UsersApiSlice;
