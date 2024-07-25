import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PostsApiSlice = createApi({
  reducerPath: "PostsApiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (token) => ({
        url: "/postsList",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deletePost: builder.mutation({
      query: ({ token, id }) => ({
        url: `/deletePost/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updatePost: builder.mutation({
      query: ({ token, id, payload }) => ({
        url: `/updatePost/${id}?_method=PUT`,
        method: "POST",
        headers: {
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }),
    }),
    createPost: builder.mutation({
      query: ({ token, payload }) => ({
        url: `/createPost`,
        method: "POST",
        headers: {
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }),
    }),
    getPostById: builder.query({
      query: ({ token, id }) => ({
        url: `/getPost/${id}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = PostsApiSlice;
