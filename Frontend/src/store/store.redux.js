import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/loginuser/loginUser.Slice.js"

export const store = configureStore({
  reducer: {
    auth:authReducer
  },
});
