import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthApiSlice = createApi({
  reducerPath: "AuthApiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    sendOTp: builder.mutation({
      query: (phone) => ({
        url: "/sendSms",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: {
          phone: phone,
        },
      }),
    }),
    verify: builder.mutation({
      query: ({ phone, otp }) => ({
        url: "/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: {
          phone: phone,
          otp: otp,
        },
      }),
    }),
    userLogOut: builder.mutation({
      query: (token) => ({
        url: "/logout",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useSendOTpMutation, useVerifyMutation, useUserLogOutMutation } =
  AuthApiSlice;
