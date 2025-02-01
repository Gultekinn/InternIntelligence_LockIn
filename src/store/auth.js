import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});
export const updateUser = (userData) => ({
    type: "UPDATE_USER",
    payload: userData,
  });
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_USER":
        return {
          ...state,
          user: { ...state.user, ...action.payload },
        };
      case "LOGOUT":
        return initialState;
      default:
        return state;
    }
  };
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
