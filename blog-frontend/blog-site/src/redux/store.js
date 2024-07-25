import { configureStore } from "@reduxjs/toolkit";
import { AuthApiSlice } from "./API/AuthApiSlice";
import authSlice from "./slices/authSlice";
import { UsersApiSlice } from "./API/UsersApiSlice";
import { PostsApiSlice } from "./API/PostsApiSlice";

export default configureStore({
  reducer: {
    authSlice: authSlice,
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer,
    [UsersApiSlice.reducerPath]: UsersApiSlice.reducer,
    [PostsApiSlice.reducerPath]: PostsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApiSlice.middleware,
      UsersApiSlice.middleware,
      PostsApiSlice.middleware
    ),
});
