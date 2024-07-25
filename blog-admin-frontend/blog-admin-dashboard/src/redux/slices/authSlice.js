import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: "",
    phoneNum: "",
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
    },
    addPhone: (state, action) => {
      state.phoneNum = action.payload;
    },
  },
});

export const { login, addPhone } = authSlice.actions;
export default authSlice.reducer;
